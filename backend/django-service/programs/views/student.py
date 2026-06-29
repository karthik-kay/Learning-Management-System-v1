from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from programs.models import ProgramEnrollment
from programs.serializers.student import ProgramEnrollmentSerializer


class StudentProgramEnrollmentListAPIView(generics.ListAPIView):
    serializer_class = ProgramEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ProgramEnrollment.objects.filter(
                student=self.request.user.student_profile,
            )
            .select_related("program")
            .prefetch_related("program__pricing_plans")
            .order_by("-updated_at")
        )
