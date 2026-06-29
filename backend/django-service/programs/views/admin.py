from rest_framework import permissions, viewsets

from programs.models import (
    LearningProgram,
    ProgramCourse,
    ProgramEnrollment,
    ProgramFAQ,
    ProgramOutcome,
    ProgramPhase,
    ProgramPrice,
)
from programs.serializers.admin import (
    LearningProgramAdminSerializer,
    ProgramCourseAdminSerializer,
    ProgramEnrollmentAdminSerializer,
    ProgramFAQAdminSerializer,
    ProgramOutcomeAdminSerializer,
    ProgramPhaseAdminSerializer,
    ProgramPriceAdminSerializer,
)


class IsProgramAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or getattr(request.user, "role", None) == "admin")
        )


class LearningProgramAdminViewSet(viewsets.ModelViewSet):
    queryset = LearningProgram.objects.all().prefetch_related("phases", "program_courses")
    serializer_class = LearningProgramAdminSerializer
    permission_classes = [IsProgramAdmin]
    lookup_field = "slug"


class ProgramPhaseAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramPhase.objects.select_related("program").all()
    serializer_class = ProgramPhaseAdminSerializer
    permission_classes = [IsProgramAdmin]


class ProgramCourseAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramCourse.objects.select_related("program", "phase", "course").all()
    serializer_class = ProgramCourseAdminSerializer
    permission_classes = [IsProgramAdmin]


class ProgramEnrollmentAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramEnrollment.objects.select_related("student", "student__user", "program").all()
    serializer_class = ProgramEnrollmentAdminSerializer
    permission_classes = [IsProgramAdmin]


class ProgramPriceAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramPrice.objects.select_related("program").all()
    serializer_class = ProgramPriceAdminSerializer
    permission_classes = [IsProgramAdmin]


class ProgramOutcomeAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramOutcome.objects.select_related("program").all()
    serializer_class = ProgramOutcomeAdminSerializer
    permission_classes = [IsProgramAdmin]


class ProgramFAQAdminViewSet(viewsets.ModelViewSet):
    queryset = ProgramFAQ.objects.select_related("program").all()
    serializer_class = ProgramFAQAdminSerializer
    permission_classes = [IsProgramAdmin]
