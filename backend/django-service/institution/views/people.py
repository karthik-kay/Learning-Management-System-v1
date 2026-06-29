import csv
import io

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from institution.audit import log_institution_action
from institution.models import Department, FacultyProfile, InstitutionStudent, Section
from institution.notifications import notify_user
from institution.permissions import (
    CanAssignHOD,
    CanManagePeopleScoped,
    IsInstitutionMember,
)
from institution.scoping import (
    ensure_department_allowed,
    get_user_institution,
    scope_faculty_for_user,
    scope_students_for_user,
)
from institution.serializers.people import (
    FacultyCreateSerializer,
    FacultyDetailSerializer,
    FacultyListSerializer,
    StudentCreateSerializer,
    StudentDetailSerializer,
    StudentListSerializer,
)

User = get_user_model()


class InstitutionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


def paginate(queryset, serializer_class, request):
    paginator = InstitutionPagination()
    page = paginator.paginate_queryset(queryset, request)
    serializer = serializer_class(page, many=True)
    return paginator.get_paginated_response(serializer.data)


class FacultyListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def get(self, request):
        faculty = scope_faculty_for_user(
            FacultyProfile.objects.select_related("user", "department"),
            request.user,
        )

        dept_id = request.query_params.get("department")
        status_filter = request.query_params.get("status")

        if dept_id and dept_id.isdigit():
            faculty = faculty.filter(department_id=dept_id)
        if status_filter:
            faculty = faculty.filter(status=status_filter)

        return paginate(faculty, FacultyListSerializer, request)

    def post(self, request):
        institution = get_user_institution(request.user)
        serializer = FacultyCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(request.user, serializer.validated_data["department"])

        email = serializer.validated_data["email"]
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=serializer.validated_data["first_name"],
                last_name=serializer.validated_data["last_name"],
                role="faculty",
                institution=institution,
            )
            user.set_unusable_password()
            user.save()

            faculty = FacultyProfile.objects.create(
                user=user,
                institution=institution,
                department=serializer.validated_data["department"],
                employee_id=serializer.validated_data["employee_id"],
                designation=serializer.validated_data.get("designation"),
                joining_date=serializer.validated_data.get("joining_date"),
            )

        log_institution_action(
            actor=request.user,
            action="faculty_created",
            target=faculty,
            metadata={"employee_id": faculty.employee_id},
        )
        notify_user(
            faculty.user,
            title="Faculty account created",
            message=f"You have been added to {institution.name}.",
            metadata={"faculty_id": faculty.id},
        )

        return Response(
            FacultyDetailSerializer(faculty).data,
            status=status.HTTP_201_CREATED,
        )


class FacultyDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def get_object(self, faculty_id, user):
        return scope_faculty_for_user(
            FacultyProfile.objects.select_related("user", "department", "institution"),
            user,
        ).filter(id=faculty_id).first()

    def get(self, request, faculty_id):
        faculty = self.get_object(faculty_id, request.user)
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        return Response(FacultyDetailSerializer(faculty).data)

    def patch(self, request, faculty_id):
        institution = get_user_institution(request.user)
        faculty = self.get_object(faculty_id, request.user)
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        user = faculty.user
        if "first_name" in request.data:
            user.first_name = request.data["first_name"]
        if "last_name" in request.data:
            user.last_name = request.data["last_name"]
        if "email" in request.data:
            new_email = request.data["email"]
            if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.email = new_email
        user.save()

        if "designation" in request.data:
            faculty.designation = request.data["designation"]
        if "joining_date" in request.data:
            faculty.joining_date = request.data["joining_date"]
        if "department" in request.data:
            department = Department.objects.filter(
                id=request.data["department"],
                institution=institution,
            ).first()
            if not department:
                return Response(
                    {"error": "Invalid department"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            ensure_department_allowed(request.user, department)
            faculty.department = department

        faculty.save()
        log_institution_action(
            actor=request.user,
            action="faculty_updated",
            target=faculty,
            metadata={"employee_id": faculty.employee_id},
        )
        return Response(FacultyDetailSerializer(faculty).data)


class FacultySuspendView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request, faculty_id):
        faculty = scope_faculty_for_user(
            FacultyProfile.objects.select_related("user", "department"),
            request.user,
        ).filter(id=faculty_id).first()
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        faculty.status = "inactive"
        faculty.save()
        faculty.user.is_active = False
        faculty.user.save()

        log_institution_action(
            actor=request.user,
            action="faculty_suspended",
            target=faculty,
            reason=request.data.get("reason", ""),
            metadata={"employee_id": faculty.employee_id},
        )
        notify_user(
            faculty.user,
            title="Faculty account suspended",
            message="Your institution faculty access has been suspended.",
            metadata={"faculty_id": faculty.id},
        )

        return Response({"message": "Faculty suspended successfully"})


class FacultyReactivateView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request, faculty_id):
        faculty = scope_faculty_for_user(
            FacultyProfile.objects.select_related("user", "department"),
            request.user,
        ).filter(id=faculty_id).first()
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        faculty.status = "active"
        faculty.save()
        faculty.user.is_active = True
        faculty.user.save()

        log_institution_action(
            actor=request.user,
            action="faculty_reactivated",
            target=faculty,
            reason=request.data.get("reason", ""),
            metadata={"employee_id": faculty.employee_id},
        )
        notify_user(
            faculty.user,
            title="Faculty account reactivated",
            message="Your institution faculty access has been reactivated.",
            metadata={"faculty_id": faculty.id},
        )

        return Response({"message": "Faculty reactivated successfully"})


class FacultyOffboardView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request, faculty_id):
        faculty = scope_faculty_for_user(
            FacultyProfile.objects.select_related("user", "department"),
            request.user,
        ).filter(id=faculty_id).first()
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        faculty.status = "inactive"
        faculty.save()
        faculty.user.is_active = False
        faculty.user.institution = None
        faculty.user.save()

        log_institution_action(
            actor=request.user,
            action="faculty_offboarded",
            target=faculty,
            reason=request.data.get("reason", ""),
            metadata={"employee_id": faculty.employee_id},
        )

        return Response({"message": "Faculty offboarded successfully"})


class FacultyMakeHODView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanAssignHOD]

    def post(self, request, faculty_id):
        institution = get_user_institution(request.user)
        faculty = FacultyProfile.objects.filter(
            id=faculty_id,
            institution=institution,
        ).select_related("user", "department").first()
        if not faculty:
            return Response({"error": "Faculty not found"}, status=404)

        department_id = request.data.get("department_id")
        if not department_id:
            return Response(
                {"error": "department_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        department = Department.objects.filter(
            id=department_id,
            institution=institution,
        ).first()
        if not department:
            return Response({"error": "Department not found"}, status=404)

        department.hod = faculty
        department.save()

        faculty.user.role = "hod"
        faculty.user.save()

        log_institution_action(
            actor=request.user,
            action="faculty_made_hod",
            target=faculty,
            reason=request.data.get("reason", ""),
            metadata={"department_id": department.id},
        )
        notify_user(
            faculty.user,
            title="HOD assignment",
            message=f"You are now HOD of {department.name}.",
            metadata={"faculty_id": faculty.id, "department_id": department.id},
        )

        return Response(
            {"message": f"{faculty.user.get_full_name()} is now HOD of {department.name}"}
        )


class StudentListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def get(self, request):
        students = scope_students_for_user(
            InstitutionStudent.objects.select_related(
                "user", "department", "program", "batch", "section"
            ),
            request.user,
        )

        dept_id = request.query_params.get("department")
        batch_id = request.query_params.get("batch")
        section_id = request.query_params.get("section")
        status_filter = request.query_params.get("status")

        if dept_id and dept_id.isdigit():
            students = students.filter(department_id=dept_id)
        if batch_id and batch_id.isdigit():
            students = students.filter(batch_id=batch_id)
        if section_id and section_id.isdigit():
            students = students.filter(section_id=section_id)
        if status_filter:
            students = students.filter(status=status_filter)

        return paginate(students, StudentListSerializer, request)

    def post(self, request):
        serializer = StudentCreateSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(request.user, serializer.validated_data["department"])

        email = serializer.validated_data["email"]
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            student = serializer.save()

        log_institution_action(
            actor=request.user,
            action="student_created",
            target=student,
            metadata={"enrollment_number": student.enrollment_number},
        )
        notify_user(
            student.user,
            title="Student account created",
            message=f"You have been added to {student.institution.name}.",
            metadata={"student_id": student.id},
        )

        return Response(
            StudentDetailSerializer(student).data,
            status=status.HTTP_201_CREATED,
        )


class StudentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def get_object(self, student_id, user):
        return scope_students_for_user(
            InstitutionStudent.objects.select_related(
                "user", "department", "program", "batch", "section"
            ),
            user,
        ).filter(id=student_id).first()

    def get(self, request, student_id):
        student = self.get_object(student_id, request.user)
        if not student:
            return Response({"error": "Student not found"}, status=404)

        return Response(StudentDetailSerializer(student).data)

    def patch(self, request, student_id):
        institution = get_user_institution(request.user)
        student = self.get_object(student_id, request.user)
        if not student:
            return Response({"error": "Student not found"}, status=404)

        user = student.user
        if "first_name" in request.data:
            user.first_name = request.data["first_name"]
        if "last_name" in request.data:
            user.last_name = request.data["last_name"]
        if "email" in request.data:
            new_email = request.data["email"]
            if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.email = new_email
        user.save()

        if "section" in request.data:
            section = Section.objects.filter(
                id=request.data["section"],
                batch__program__department__institution=institution,
            ).select_related("batch__program__department").first()
            if not section:
                return Response({"error": "Invalid section"}, status=400)
            ensure_department_allowed(request.user, section.batch.program.department)
            student.section = section

        if "current_semester" in request.data:
            semester = int(request.data["current_semester"])
            if semester < 1:
                return Response({"error": "Invalid semester"}, status=400)
            if semester > student.program.duration_semesters:
                return Response(
                    {"error": "Semester exceeds program duration"},
                    status=400,
                )
            student.current_semester = semester

        student.save()
        log_institution_action(
            actor=request.user,
            action="student_updated",
            target=student,
            metadata={"enrollment_number": student.enrollment_number},
        )
        return Response(StudentDetailSerializer(student).data)


class StudentSuspendView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request, student_id):
        student = scope_students_for_user(
            InstitutionStudent.objects.select_related("user", "department"),
            request.user,
        ).filter(id=student_id).first()
        if not student:
            return Response({"error": "Student not found"}, status=404)

        student.status = "suspended"
        student.save()
        student.user.is_active = False
        student.user.save()

        log_institution_action(
            actor=request.user,
            action="student_suspended",
            target=student,
            reason=request.data.get("reason", ""),
            metadata={"enrollment_number": student.enrollment_number},
        )
        notify_user(
            student.user,
            title="Student account suspended",
            message="Your institution student access has been suspended.",
            metadata={"student_id": student.id},
        )

        return Response({"message": "Student suspended"})


class StudentPromoteView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request, student_id):
        student = scope_students_for_user(
            InstitutionStudent.objects.select_related("program", "department"),
            request.user,
        ).filter(id=student_id).first()
        if not student:
            return Response({"error": "Student not found"}, status=404)

        if student.current_semester >= student.program.duration_semesters:
            return Response(
                {"error": "Student already in final semester"},
                status=400,
            )

        student.current_semester += 1
        student.save()

        log_institution_action(
            actor=request.user,
            action="student_promoted",
            target=student,
            metadata={
                "enrollment_number": student.enrollment_number,
                "current_semester": student.current_semester,
            },
        )
        notify_user(
            student.user,
            title="Semester updated",
            message=f"You have been promoted to semester {student.current_semester}.",
            metadata={"student_id": student.id, "semester": student.current_semester},
        )

        return Response({"message": "Student promoted"})


class StudentBulkImportView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManagePeopleScoped]

    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "CSV file required"}, status=400)

        decoded = file.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(decoded))
        created = []

        with transaction.atomic():
            for row in reader:
                serializer = StudentCreateSerializer(
                    data=row,
                    context={"request": request},
                )

                if not serializer.is_valid():
                    return Response(serializer.errors, status=400)

                ensure_department_allowed(
                    request.user,
                    serializer.validated_data["department"],
                )

                student = serializer.save()
                created.append(student.id)

        if created:
            log_institution_action(
                actor=request.user,
                action="student_bulk_import",
                target=request.user.institution,
                metadata={"created_count": len(created), "student_ids": created},
            )
            notify_user(
                request.user,
                title="Student import complete",
                message=f"{len(created)} students were imported successfully.",
                metadata={"student_ids": created},
            )

        return Response({"created": created})
