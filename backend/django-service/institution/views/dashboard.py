from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import (
    Avg, Count, Case, When, Value, FloatField, ExpressionWrapper, F
)

from institution.models import (
    Department, FacultyProfile, InstitutionStudent,
    AttendanceRecord, SubjectResult, Exam
)
from institution.permissions import IsHODRole, IsInstitutionAdminRole, IsInstitutionMember
from institution.scoping import get_user_institution
from institution.serializers.dashboard import DashboardStatsSerializer, HODDashboardSerializer


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, IsInstitutionAdminRole]

    def get(self, request):

        institution = get_user_institution(request.user)

        total_departments = Department.objects.filter(
            institution=institution, is_active=True
        ).count()

        total_students = InstitutionStudent.objects.filter(
            institution=institution, status='active'
        ).count()

        total_faculty = FacultyProfile.objects.filter(
            institution=institution, status='active'
        ).count()

        total_records = AttendanceRecord.objects.filter(
            student__institution=institution
        ).count()

        present_records = AttendanceRecord.objects.filter(
            student__institution=institution,
            status__in=['present', 'late']
        ).count()

        avg_attendance = round(
            (present_records / total_records * 100) if total_records > 0 else 0, 2
        )

        # FIX N+1: single query — annotate each student with their total + present counts
        # then filter in Python on the already-fetched aggregated rows (2 queries total, not 2N)
        threshold = institution.attendance_threshold

        student_attendance = InstitutionStudent.objects.filter(
            institution=institution, status='active'
        ).annotate(
            total=Count('attendance_records'),
            present=Count(
                Case(
                    When(
                        attendance_records__status__in=['present', 'late'],
                        then=Value(1)
                    )
                )
            )
        ).filter(total__gt=0)

        at_risk_count = sum(
            1 for s in student_attendance
            if (s.present / s.total * 100) < threshold
        )

        avg_performance = SubjectResult.objects.filter(
            student__institution=institution
        ).aggregate(Avg('total_marks'))['total_marks__avg'] or 0

        return Response({
            'total_departments': total_departments,
            'total_students': total_students,
            'total_faculty': total_faculty,
            'active_courses': 0,
            'avg_attendance': avg_attendance,
            'avg_performance': float(round(avg_performance, 2)),
            'pending_certifications': 0,
            'active_placement_drives': 0,
            'students_placed_this_year': 0,
            'at_risk_students': at_risk_count,
        })


class HODDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, IsHODRole]

    def get(self, request):
        user = request.user

        # safe access — crashes if user has no faculty_profile
        faculty = getattr(user, 'faculty_profile', None)
        if not faculty:
            return Response({'error': 'Not a faculty user'}, status=403)

        department = faculty.department
        today = timezone.now().date()
        next_week = today + timezone.timedelta(days=7)

        # institution safety check
        if department.institution != request.user.institution:
            return Response({'error': 'Unauthorized'}, status=403)

        total_students = InstitutionStudent.objects.filter(
            department=department, status='active'
        ).count()

        today_total = AttendanceRecord.objects.filter(
            student__department=department,
            session__date=today
        ).count()

        today_present = AttendanceRecord.objects.filter(
            student__department=department,
            session__date=today,
            status__in=['present', 'late']
        ).count()

        today_attendance_pct = round(
            (today_present / today_total * 100) if today_total > 0 else 0, 2
        )

        # FIX N+1: same annotation pattern — 1 query instead of 2N
        threshold = department.institution.attendance_threshold

        dept_student_attendance = InstitutionStudent.objects.filter(
            department=department, status='active'
        ).annotate(
            total=Count('attendance_records'),
            present=Count(
                Case(
                    When(
                        attendance_records__status__in=['present', 'late'],
                        then=Value(1)
                    )
                )
            )
        ).filter(total__gt=0)

        shortage_count = sum(
            1 for s in dept_student_attendance
            if (s.present / s.total * 100) < threshold
        )

        upcoming_exams = Exam.objects.filter(
            batch__program__department=department,
            start_date__range=[today, next_week]
        ).count()

        return Response({
            'department': department.name,
            'total_students': total_students,
            'today_attendance_percentage': today_attendance_pct,
            'shortage_count': shortage_count,
            'pending_marks_entry': 0,
            'upcoming_exams': upcoming_exams,
            'pending_leave_approvals': 0,
            'pending_internship_approvals': 0,
        })
