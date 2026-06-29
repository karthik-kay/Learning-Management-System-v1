from collections import defaultdict

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, Q, Sum

# Assuming your paginator is somewhere like this, adjust import as needed!
from rest_framework.pagination import PageNumberPagination

from institution.models import (
    InstitutionStudent, FacultyProfile,
    AttendanceRecord, AttendanceSession,
    SubjectResult, FacultySubjectAssignment,
    AcademicBatch, Subject
)
from institution.serializers.reports import (
    AtRiskStudentSerializer,
    AttendanceReportSerializer,
    SubjectAttendanceSerializer,
    PerformanceReportSerializer,
    FacultyActivityReportSerializer,
    BatchPerformanceReportSerializer,
    StudentProgressReportSerializer,
)
from institution.permissions import CanViewReportsScoped, IsInstitutionMember
from institution.scoping import (
    get_user_institution,
    scope_batches_for_user,
    scope_faculty_for_user,
    scope_students_for_user,
)

class InstitutionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# ─────────────────────────────────────────────
# ATTENDANCE REPORT
# ─────────────────────────────────────────────

class AttendanceReportView(APIView):
    """
    Institution-wide or dept-filtered attendance report
    Shows per student attendance % and shortage flag
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request):
        institution = get_user_institution(request.user)
        threshold = institution.attendance_threshold

        # Filters
        dept_id = request.query_params.get('department')
        batch_id = request.query_params.get('batch')
        section_id = request.query_params.get('section')
        sort_order = request.query_params.get('sort', 'asc')

        students = scope_students_for_user(
            InstitutionStudent.objects.filter(status='active').select_related(
                'user', 'department', 'program', 'batch'
            ),
            request.user,
        )

        if dept_id and dept_id.isdigit():
            students = students.filter(department_id=dept_id)
        if batch_id and batch_id.isdigit():
            students = students.filter(batch_id=batch_id)
        if section_id and section_id.isdigit():
            students = students.filter(section_id=section_id)

        students = students.annotate(
            total_classes_count=Count('attendance_records'),
            attended_classes_count=Count(
                'attendance_records', 
                filter=Q(attendance_records__status__in=['present', 'late'])
            )
        )

        report = []

        for student in students:
            total = student.total_classes_count
            attended = student.attended_classes_count

            percentage = round(
                (attended / total * 100) if total > 0 else 0, 2
            )

            report.append({
                'student_name': student.user.get_full_name(),
                'enrollment_number': student.enrollment_number,
                'department': student.department.name,
                'program': student.program.name,
                'batch': student.batch.name,
                'total_classes': total,
                'attended': attended,
                'attendance_percentage': percentage,
                'is_shortage': percentage < threshold
            })

        report.sort(
            key=lambda x: x['attendance_percentage'], 
            reverse=(sort_order == 'desc')
        )

        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(report, request, view=self)
        if page is not None:
            serializer = AttendanceReportSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = AttendanceReportSerializer(report, many=True)
        return Response(serializer.data)


class StudentSubjectAttendanceView(APIView):
    """
    Per subject attendance breakdown for a single student
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request, student_id):
        if not str(student_id).isdigit():
            return Response({'error': 'Invalid student ID'}, status=400)

        institution = get_user_institution(request.user)

        try:
            student = scope_students_for_user(
                InstitutionStudent.objects.filter(id=student_id),
                request.user,
            ).get()
        except InstitutionStudent.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

        subjects = Subject.objects.filter(
            program=student.program,
            semester=student.current_semester,
            is_active=True
        )

        # FINAL POLISH 3: N+1 Eradicated via python-level grouping
        # Grabs all records in ONE query
        records = AttendanceRecord.objects.filter(
            student=student,
            session__timetable_entry__assignment__subject__in=subjects
        ).select_related('session__timetable_entry__assignment__subject')

        attendance_data = defaultdict(lambda: {'total': 0, 'attended': 0})

        for record in records:
            subj_id = record.session.timetable_entry.assignment.subject.id
            attendance_data[subj_id]['total'] += 1
            if record.status in ['present', 'late']:
                attendance_data[subj_id]['attended'] += 1

        report = []

        for subject in subjects:
            data = attendance_data[subject.id]
            total = data['total']
            attended = data['attended']
            
            percentage = round(
                (attended / total * 100) if total > 0 else 0, 2
            )

            report.append({
                'subject_name': subject.name,
                'subject_code': subject.code,
                'total_classes': total,
                'attended': attended,
                'attendance_percentage': percentage,
            })

        serializer = SubjectAttendanceSerializer(report, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# PERFORMANCE REPORT
# ─────────────────────────────────────────────

class PerformanceReportView(APIView):
    """
    Institution-wide performance report
    Shows avg marks, grade, CGPA per student
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request):
        institution = get_user_institution(request.user)

        dept_id = request.query_params.get('department')
        batch_id = request.query_params.get('batch')

        students = scope_students_for_user(
            InstitutionStudent.objects.filter(status='active').select_related(
                'user', 'department', 'program'
            ),
            request.user,
        )

        if dept_id and dept_id.isdigit():
            students = students.filter(department_id=dept_id)
        if batch_id and batch_id.isdigit():
            students = students.filter(batch_id=batch_id)

        # FINAL POLISH 2: Destroyed the mild N+1 query. 
        # Fetching all results in one go and mapping them to students in memory.
        all_results = SubjectResult.objects.filter(
            student__in=students
        ).select_related('subject', 'student')
        
        results_by_student = defaultdict(list)
        for res in all_results:
            results_by_student[res.student_id].append(res)

        report = []

        for student in students:
            results = results_by_student[student.id]

            if not results:
                continue

            total_marks_sum = sum(r.total_marks for r in results)
            avg_marks = total_marks_sum / len(results)

            # CGPA calculation
            total_credit_points = 0
            total_credits = 0
            for result in results:
                credits = result.subject.credits or 0
                if result.grade_point:
                    total_credit_points += result.grade_point * credits
                    total_credits += credits

            cgpa = round(
                total_credit_points / total_credits, 2
            ) if total_credits > 0 else 0

            # Assuming the last item in the list is the latest result based on how it's created/ordered
            latest = max(results, key=lambda x: x.id) if results else None

            report.append({
                'student_name': student.user.get_full_name(),
                'enrollment_number': student.enrollment_number,
                'department': student.department.name,
                'program': student.program.name,
                'total_marks': round(total_marks_sum, 2),
                'avg_marks': round(avg_marks, 2),
                'grade': latest.grade if latest else 'N/A',
                'cgpa': cgpa,
            })

        report.sort(key=lambda x: x['cgpa'], reverse=True)

        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(report, request, view=self)
        if page is not None:
            serializer = PerformanceReportSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = PerformanceReportSerializer(report, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# FACULTY ACTIVITY REPORT
# ─────────────────────────────────────────────

class FacultyActivityReportView(APIView):
    """
    Shows classes scheduled vs conducted per faculty
    and attendance submission count
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request):
        institution = get_user_institution(request.user)

        dept_id = request.query_params.get('department')

        faculty_qs = scope_faculty_for_user(
            FacultyProfile.objects.filter(status='active').select_related(
                'user', 'department'
            ),
            request.user,
        )

        if dept_id and dept_id.isdigit():
            faculty_qs = faculty_qs.filter(department_id=dept_id)

        report = []

        for faculty in faculty_qs:
            subjects_assigned = FacultySubjectAssignment.objects.filter(
                faculty=faculty,
                is_active=True
            ).count()

            classes_scheduled = faculty.subject_assignments.filter(
                is_active=True
            ).prefetch_related('timetable_entries').aggregate(
                total=Count('timetable_entries')
            )['total'] or 0

            classes_conducted = AttendanceSession.objects.filter(
                conducted_by=faculty,
                is_cancelled=False
            ).count()

            attendance_submissions = AttendanceRecord.objects.filter(
                session__conducted_by=faculty
            ).count()

            report.append({
                'faculty_name': faculty.user.get_full_name(),
                'employee_id': faculty.employee_id,
                'department': faculty.department.name,
                'classes_scheduled': classes_scheduled,
                'classes_conducted': classes_conducted,
                'attendance_submissions': attendance_submissions,
                'subjects_assigned': subjects_assigned,
            })

        # FINAL POLISH 1: Added Pagination so the server doesn't choke if there are 500+ faculty
        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(report, request, view=self)
        if page is not None:
            serializer = FacultyActivityReportSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = FacultyActivityReportSerializer(report, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# BATCH PERFORMANCE REPORT
# ─────────────────────────────────────────────

class BatchPerformanceReportView(APIView):
    """
    Batch-wise performance summary
    Useful for comparing batches across programs
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request):
        institution = get_user_institution(request.user)
        threshold = institution.attendance_threshold

        batches = scope_batches_for_user(
            AcademicBatch.objects.select_related('program'),
            request.user,
        )

        report = []

        for batch in batches:
            students = InstitutionStudent.objects.filter(
                batch=batch,
                status='active'
            ).annotate(
                total_classes=Count('attendancerecord'),
                attended_classes=Count(
                    'attendancerecord', 
                    filter=Q(attendancerecord__status__in=['present', 'late'])
                )
            )

            total_students = students.count()
            if total_students == 0:
                continue

            attendance_percentages = []
            shortage_count = 0

            for student in students:
                total = student.total_classes
                attended = student.attended_classes

                if total > 0:
                    pct = (attended / total) * 100
                    attendance_percentages.append(pct)
                    if pct < threshold:
                        shortage_count += 1

            avg_attendance = round(
                sum(attendance_percentages) / len(attendance_percentages), 2
            ) if attendance_percentages else 0

            avg_marks_data = SubjectResult.objects.filter(
                student__batch=batch
            ).aggregate(Avg('total_marks'))

            avg_marks = round(
                avg_marks_data['total_marks__avg'] or 0, 2
            )

            top_student = InstitutionStudent.objects.filter(
                batch=batch,
                status='active'
            ).annotate(
                total_student_score=Sum('subjectresult__total_marks')
            ).order_by('-total_student_score').select_related('user').first()

            top_performer = top_student.user.get_full_name() if top_student else 'N/A'

            report.append({
                'batch_name': batch.name,
                'program_name': batch.program.name,
                'total_students': total_students,
                'avg_attendance': avg_attendance,
                'avg_marks': avg_marks,
                'top_performer': top_performer,
                'shortage_count': shortage_count,
            })

        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(report, request, view=self)

        if page is not None:
            serializer = BatchPerformanceReportSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = BatchPerformanceReportSerializer(report, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# STUDENT PROGRESS REPORT
# ─────────────────────────────────────────────

class StudentProgressReportView(APIView):
    """
    Full individual student report —
    attendance + CGPA + subject-wise breakdown
    """
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request, student_id):
        if not str(student_id).isdigit():
            return Response({'error': 'Invalid student ID'}, status=400)

        institution = get_user_institution(request.user)

        try:
            student = scope_students_for_user(
                InstitutionStudent.objects.select_related(
                    'user', 'department', 'program', 'batch'
                ).filter(id=student_id),
                request.user,
            ).get()
        except InstitutionStudent.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)

        total = AttendanceRecord.objects.filter(student=student).count()
        attended = AttendanceRecord.objects.filter(
            student=student, status__in=['present', 'late']
        ).count()
        overall_attendance = round(
            (attended / total * 100) if total > 0 else 0, 2
        )

        results = SubjectResult.objects.filter(
            student=student
        ).select_related('subject')

        total_credit_points = 0
        total_credits = 0
        subjects_data = []

        for result in results:
            credits = result.subject.credits or 0
            if result.grade_point:
                total_credit_points += result.grade_point * credits
                total_credits += credits

            subjects_data.append({
                'subject_name': result.subject.name,
                'subject_code': result.subject.code,
                'semester': result.subject.semester,
                'internal_marks': result.internal_marks,
                'external_marks': result.external_marks,
                'total_marks': result.total_marks,
                'grade': result.grade,
                'grade_point': result.grade_point,
                'credits': credits,
            })

        cgpa = round(
            total_credit_points / total_credits, 2
        ) if total_credits > 0 else 0

        data = {
            'student_name': student.user.get_full_name(),
            'enrollment_number': student.enrollment_number,
            'current_semester': student.current_semester,
            'overall_attendance': overall_attendance,
            'cgpa': cgpa,
            'subjects': subjects_data,
        }

        return Response(data)


class AtRiskStudentsView(APIView):
    """
    Students with attendance
    shortage and/or poor
    academic performance
    """

    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]


    def get(
        self,
        request,
    ):

        institution = get_user_institution(request.user)

        threshold = (
            institution
            .attendance_threshold
        )


        students = (
            scope_students_for_user(
                InstitutionStudent
                .objects
                .filter(status="active")
                .select_related(
                    "user",
                ),
                request.user,
            )
            .annotate(

                total_classes=
                    Count(
                        "attendance_records",
                    ),

                attended_classes=
                    Count(

                        "attendance_records",

                        filter=Q(
                            attendance_records__status__in=[
                                "present",
                                "late",
                            ]
                        ),

                    ),

                cgpa_value=
                    Avg(
                        "subject_results__grade_point",
                    ),

            )
        )


        report = []


        for student in students:

            attendance = 0


            if (
                student
                .total_classes
                > 0
            ):

                attendance = round(

                    (
                        student
                        .attended_classes

                        /

                        student
                        .total_classes

                    ) * 100,

                    2,
                )


            cgpa = round(

                student
                .cgpa_value

                or

                0,

                2,
            )


            attendance_risk = (

                attendance
                <
                threshold

            )

            cgpa_risk = (

                cgpa
                <
                6

            )


            if not (

                attendance_risk

                or

                cgpa_risk

            ):

                continue


            reasons = []


            if (
                attendance_risk
            ):

                reasons.append(
                    "Low Attendance"
                )


            if (
                cgpa_risk
            ):

                reasons.append(
                    "Low CGPA"
                )


            # Risk logic
            if (

                attendance
                < 60

                or

                cgpa
                < 5

            ):

                risk_level = (
                    "high"
                )


            elif (

                attendance_risk

                and

                cgpa_risk

            ):

                risk_level = (
                    "medium"
                )


            else:

                risk_level = (
                    "low"
                )


            report.append({

                "id":
                    student.id,

                "name":
                    student
                    .user
                    .get_full_name(),

                "enrollment_number":
                    student
                    .enrollment_number,

                "attendance":
                    attendance,

                "cgpa":
                    cgpa,

                "risk_level":
                    risk_level,

                "risk_reason":
                    ", ".join(
                        reasons
                    ),

            })


        paginator = (
            InstitutionPagination()
        )


        page = (
            paginator
            .paginate_queryset(

                report,

                request,

                view=self,

            )
        )


        if (
            page
            is not None
        ):

            serializer = (
                AtRiskStudentSerializer(

                    page,

                    many=True,

                )
            )

            return (
                paginator
                .get_paginated_response(

                    serializer.data

                )
            )


        serializer = (
            AtRiskStudentSerializer(

                report,

                many=True,

            )
        )


        return Response(
            serializer.data
        )
