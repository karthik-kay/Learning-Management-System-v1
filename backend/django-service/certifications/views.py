from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer

class MyCertificatesView(ListAPIView):
    serializer_class   = CertificateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Certificate.objects.filter(
            student=self.request.user.student_profile
        ).select_related('course', 'student__user').prefetch_related(
            'course__product__instructors'
        )


class CertificateDetailView(RetrieveAPIView):
    serializer_class   = CertificateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field       = 'credential_id'

    def get_queryset(self):
        return Certificate.objects.filter(
            student=self.request.user.student_profile
        ).select_related('course', 'student__user').prefetch_related(
            'course__product__instructors'
        )
