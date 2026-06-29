from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Q
from django.utils import timezone

from institution.models import (
    AttendanceSession, AttendanceRecord,
    InstitutionStudent, FacultyProfile, TimetableEntry, LeaveApplication
)

from institution.serializers.attendance import (
    AttendanceSessionSerializer, AttendanceSessionCreateSerializer,
    AttendanceRecordSerializer, AttendanceRecordCreateSerializer,
    BulkAttendanceSerializer,
    AttendanceShortageSerializer,
    LeaveDecisionSerializer,
    LeaveApplicationSerializer,
    UnlockAttendanceSerializer,
)
from institution.audit import log_institution_action
from institution.notifications import notify_institution_admin, notify_user
from institution.permissions import CanManageAttendanceScoped, IsInstitutionMember
from institution.scoping import (
    get_user_institution,
    scope_attendance_records_for_user,
    scope_attendance_sessions_for_user,
    scope_faculty_for_user,
    scope_students_for_user,
)


# ─────────────────────────────────────────────
# PAGINATION + BASE
# ─────────────────────────────────────────────

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class InstitutionScopedAPIView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageAttendanceScoped]

    def get_institution(self):
        return get_user_institution(self.request.user)

    def paginate(self, queryset, serializer_class, request):
        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)

        if page is not None:
            serializer = serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# ATTENDANCE SESSION
# ─────────────────────────────────────────────

class AttendanceSessionListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        sessions = scope_attendance_sessions_for_user(
            AttendanceSession.objects.select_related(
            'timetable_entry__assignment__subject',
            'timetable_entry__section',
            'conducted_by__user'
            ),
            request.user,
        ).order_by('-date')

        section_id = request.query_params.get('section')
        date = request.query_params.get('date')
        faculty_id = request.query_params.get('faculty')

        if section_id and section_id.isdigit():
            sessions = sessions.filter(timetable_entry__section_id=int(section_id))
        if date:
            sessions = sessions.filter(date=date)
        if faculty_id and faculty_id.isdigit():
            sessions = sessions.filter(conducted_by_id=int(faculty_id))

        # FIX 6: pagination
        return self.paginate(sessions, AttendanceSessionSerializer, request)

    def post(self, request):
        # FIX 2: pass request in context for institution validation
        serializer = AttendanceSessionCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AttendanceSessionDetailView(InstitutionScopedAPIView):

    def get_object(self, session_id, institution):
        try:
            return scope_attendance_sessions_for_user(
                AttendanceSession.objects.select_related(
                'timetable_entry__assignment__subject',
                'timetable_entry__section',
                'conducted_by__user'
                ),
                self.request.user,
            ).get(
                id=session_id,
                timetable_entry__assignment__faculty__institution=institution
            )
        except AttendanceSession.DoesNotExist:
            return None

    def get(self, request, session_id):
        session = self.get_object(session_id, self.get_institution())
        if not session:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(AttendanceSessionSerializer(session).data)

    def patch(self, request, session_id):
        session = self.get_object(session_id, self.get_institution())
        if not session:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        session_age = timezone.now().date() - session.date
        if session_age.days > 2:
            return Response(
                {'error': 'Attendance locked after 48 hours. Use unlock endpoint.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # FIX 7: context passed in PATCH too
        serializer = AttendanceSessionCreateSerializer(
            session,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(AttendanceSessionSerializer(session).data)


# ─────────────────────────────────────────────
# ATTENDANCE RECORDS
# ─────────────────────────────────────────────

class AttendanceRecordListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()

        # FIX 5: scope through session chain, not just student.institution
        records = scope_attendance_records_for_user(
            AttendanceRecord.objects.select_related('session', 'student__user'),
            request.user,
        ).order_by('-session__date')

        session_id = request.query_params.get('session')
        student_id = request.query_params.get('student')
        status_filter = request.query_params.get('status')

        if session_id and session_id.isdigit():
            records = records.filter(session_id=int(session_id))
        if student_id and student_id.isdigit():
            records = records.filter(student_id=int(student_id))
        if status_filter:
            records = records.filter(status=status_filter)

        # FIX 6: pagination
        return self.paginate(records, AttendanceRecordSerializer, request)


# ─────────────────────────────────────────────
# BULK ATTENDANCE MARKING
# ─────────────────────────────────────────────

class BulkAttendanceView(InstitutionScopedAPIView):
    """
    Faculty marks attendance for all students in a session at once.
    POST body: { session: id, records: [{student: id, status: present/absent/late}] }
    """

    def post(self, request):
        institution = self.get_institution()
        serializer = BulkAttendanceSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        session_id = serializer.validated_data['session']
        records = serializer.validated_data['records']

        try:
            session = scope_attendance_sessions_for_user(
                AttendanceSession.objects.all(),
                request.user,
            ).get(
                id=session_id,
                timetable_entry__assignment__faculty__institution=institution
            )
        except AttendanceSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        session_age = timezone.now().date() - session.date
        if session_age.days > 2:
            return Response(
                {'error': 'Attendance locked after 48 hours'},
                status=status.HTTP_403_FORBIDDEN
            )

        created = []
        errors = []

        # FIX 9: deduplicate repeated student IDs in payload
        seen = set()

        with transaction.atomic():
            for record in records:
                student_id = record.get('student')

                # FIX 9: skip duplicates silently
                if student_id in seen:
                    continue
                seen.add(student_id)

                valid_status = {'present', 'absent', 'late'}
                status_value = record.get('status', 'absent')

                if status_value not in valid_status:
                    errors.append({
                        'student': student_id,
                        'error': 'Invalid status'
                    })
                    continue

                # FIX 3: validate student belongs to same institution + section
                student = InstitutionStudent.objects.filter(
                    id=student_id,
                    institution=institution,
                    section=session.timetable_entry.section
                ).first()

                if not student:
                    errors.append({
                        'student': student_id,
                        'error': 'Invalid student or does not belong to this section'
                    })
                    continue

                try:
                    obj, _ = AttendanceRecord.objects.update_or_create(
                        session=session,
                        student=student,
                        defaults={
                            'status': status_value,
                            'remarks': record.get('remarks', '')
                        }
                    )
                    created.append(student_id)
                except Exception as e:
                    errors.append({
                        'student': student_id,
                        'error': str(e)
                    })

        return Response({
            'marked_count': len(created),
            'failed_count': len(errors),
            'errors': errors
        })


# ─────────────────────────────────────────────
# ATTENDANCE SHORTAGE
# ─────────────────────────────────────────────

class AttendanceShortageView(InstitutionScopedAPIView):
    """
    Lists all students below the institution attendance threshold.
    NOTE: N+1 query — acceptable for now, replace with aggregation later.
    """

    def get(self, request):
        institution = self.get_institution()
        threshold = institution.attendance_threshold

        dept_id = request.query_params.get('department')
        batch_id = request.query_params.get('batch')

        students = scope_students_for_user(
            InstitutionStudent.objects.filter(status='active').select_related(
                'user', 'department', 'section'
            ),
            request.user,
        )

        if dept_id and dept_id.isdigit():
            students = students.filter(department_id=int(dept_id))
        if batch_id and batch_id.isdigit():
            students = students.filter(batch_id=int(batch_id))

        shortage_list = []

        for student in students:
            total = AttendanceRecord.objects.filter(student=student).count()
            attended = AttendanceRecord.objects.filter(
                student=student,
                status__in=['present', 'late']
            ).count()

            if total == 0:
                continue

            percentage = round((attended / total) * 100, 2)

            if percentage < threshold:
                shortage_list.append({
                    'student_name': student.user.get_full_name(),
                    'enrollment_number': student.enrollment_number,
                    'department': student.department.name,
                    'total_classes': total,
                    'attended': attended,
                    'attendance_percentage': percentage,
                    'shortage': round(threshold - percentage, 2)
                })

        serializer = AttendanceShortageSerializer(shortage_list, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# BULK SHORTAGE ALERT
# ─────────────────────────────────────────────

class BulkShortageAlertView(InstitutionScopedAPIView):
    """
    Sends shortage alerts to all students below threshold.
    Notification system to be wired up later.
    """

    def post(self, request):
        institution = self.get_institution()
        threshold = institution.attendance_threshold

        students = scope_students_for_user(
            InstitutionStudent.objects.filter(status='active').select_related('user'),
            request.user,
        )

        alerted = []

        for student in students:
            total = AttendanceRecord.objects.filter(student=student).count()
            attended = AttendanceRecord.objects.filter(
                student=student,
                status__in=['present', 'late']
            ).count()

            if total == 0:
                continue

            percentage = (attended / total) * 100

            if percentage < threshold:
                notify_user(
                    student.user,
                    title="Attendance shortage alert",
                    message=f"Your attendance is {percentage:.2f}%, below the required {threshold}%.",
                    metadata={
                        "student_id": student.id,
                        "attendance_percentage": round(percentage, 2),
                        "threshold": threshold,
                    },
                )
                alerted.append(student.enrollment_number)

        return Response({
            'alerted': len(alerted),
            'message': f'Shortage alerts sent to {len(alerted)} students'
        })


# ─────────────────────────────────────────────
# UNLOCK ATTENDANCE
# ─────────────────────────────────────────────

class UnlockAttendanceView(InstitutionScopedAPIView):
    """
    Admin unlocks a locked attendance session for editing.
    Reason is logged — audit trail to be wired later.
    """

    def post(self, request, session_id):
        institution = self.get_institution()
        serializer = UnlockAttendanceSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = scope_attendance_sessions_for_user(
                AttendanceSession.objects.all(),
                request.user,
            ).get(
                id=session_id,
                timetable_entry__assignment__faculty__institution=institution
            )
        except AttendanceSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        reason = serializer.validated_data['reason']

        log_institution_action(
            actor=request.user,
            action="attendance_unlocked",
            target=session,
            reason=reason,
            metadata={"session_id": session.id, "date": str(session.date)},
        )
        if session.conducted_by:
            notify_user(
                session.conducted_by.user,
                title="Attendance session unlocked",
                message=f"Attendance for {session.date} has been unlocked.",
                metadata={"session_id": session.id, "reason": reason},
            )

        return Response({
            'message': f'Session {session_id} unlocked',
            'reason_logged': reason,
            'unlocked_by': request.user.get_full_name()
        })


# ─────────────────────────────────────────────
# LEAVE APPLICATION
# ─────────────────────────────────────────────



class LeaveApplicationView(InstitutionScopedAPIView):

    def get(self, request):
        leaves = LeaveApplication.objects.filter(
            institution=self.get_institution()
        ).select_related(
            "student__user", "student__department", "student__batch",
            "student__section", "faculty__user", "faculty__department",
            "reviewed_by",
        )

        scoped_students = scope_students_for_user(
            InstitutionStudent.objects.all(),
            request.user,
        )
        scoped_faculty = scope_faculty_for_user(
            FacultyProfile.objects.all(),
            request.user,
        )
        leaves = leaves.filter(
            Q(student__in=scoped_students) | Q(faculty__in=scoped_faculty)
        )

        status_filter = request.query_params.get("status")
        applicant_type = request.query_params.get("applicant_type")
        student_id = request.query_params.get("student")
        department_id = request.query_params.get("department")
        batch_id = request.query_params.get("batch")
        section_id = request.query_params.get("section")

        if status_filter:
            leaves = leaves.filter(status=status_filter)
        if student_id and student_id.isdigit():
            leaves = leaves.filter(student_id=student_id)
        if applicant_type == "student":
            leaves = leaves.filter(student__isnull=False)
        elif applicant_type == "faculty":
            leaves = leaves.filter(faculty__isnull=False)
        if department_id and department_id.isdigit():
            leaves = leaves.filter(
                Q(student__department_id=department_id) |
                Q(faculty__department_id=department_id)
            )
        if batch_id and batch_id.isdigit():
            leaves = leaves.filter(student__batch_id=batch_id)
        if section_id and section_id.isdigit():
            leaves = leaves.filter(student__section_id=section_id)

        return self.paginate(leaves, LeaveApplicationSerializer, request)

    def post(self, request):
        serializer = LeaveApplicationSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        student = serializer.validated_data.get("student")
        faculty = serializer.validated_data.get("faculty")
        if student:
            student = scope_students_for_user(
                InstitutionStudent.objects.filter(id=student.id), request.user
            ).first()
        if faculty:
            faculty = scope_faculty_for_user(
                FacultyProfile.objects.filter(id=faculty.id), request.user
            ).first()
        applicant = student or faculty
        if not applicant:
            return Response({"error": "Applicant not found"}, status=404)

        leave = serializer.save(
            institution=self.get_institution(), student=student, faculty=faculty
        )

        log_institution_action(
            actor=request.user,
            action="leave_applied",
            target=leave,
            reason=leave.reason,
            metadata={
                "applicant_type": "student" if student else "faculty",
                "applicant_id": applicant.id,
                "from_date": str(leave.from_date),
                "to_date": str(leave.to_date),
            },
        )

        notify_institution_admin(
            leave.institution,
            title="New leave application",
            message=f"{applicant.user.get_full_name()} submitted a leave request.",
            metadata={"leave_id": leave.id},
        )

        return Response(
            LeaveApplicationSerializer(leave, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class LeaveApproveView(InstitutionScopedAPIView):

    def post(self, request, leave_id):
        serializer = LeaveDecisionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        scoped_students = scope_students_for_user(
            InstitutionStudent.objects.all(),
            request.user,
        )
        scoped_faculty = scope_faculty_for_user(
            FacultyProfile.objects.all(),
            request.user,
        )
        leave = LeaveApplication.objects.filter(
            id=leave_id,
            institution=self.get_institution(),
        ).filter(
            Q(student__in=scoped_students) | Q(faculty__in=scoped_faculty)
        ).select_related("student__user", "faculty__user").first()

        if not leave:
            return Response({"error": "Leave application not found"}, status=404)

        if leave.status != "pending":
            return Response({"error": "Leave application already reviewed"}, status=400)

        decision = serializer.validated_data["decision"]
        leave.status = decision
        leave.review_note = serializer.validated_data.get("review_note", "")
        leave.reviewed_by = request.user
        leave.reviewed_at = timezone.now()
        leave.save()

        audit_action = "leave_approved" if decision == "approved" else "leave_rejected"
        log_institution_action(
            actor=request.user,
            action=audit_action,
            target=leave,
            reason=leave.review_note,
            metadata={
                "applicant_type": "student" if leave.student_id else "faculty",
                "applicant_id": leave.student_id or leave.faculty_id,
                "from_date": str(leave.from_date),
                "to_date": str(leave.to_date),
            },
        )

        applicant = leave.student or leave.faculty
        notify_user(
            applicant.user,
            title=f"Leave {decision}",
            message=f"Your leave request from {leave.from_date} to {leave.to_date} was {decision}.",
            metadata={"leave_id": leave.id, "status": decision},
        )

        return Response(
            LeaveApplicationSerializer(leave, context={"request": request}).data
        )
