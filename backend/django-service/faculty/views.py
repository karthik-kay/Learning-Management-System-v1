from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import FacultyProfile
from .serializers import PublicFacultyProfileSerializer


class PublicFacultyProfileListAPIView(generics.ListAPIView):
    serializer_class = PublicFacultyProfileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return FacultyProfile.objects.filter(is_public=True).select_related("user")


class PublicFacultyProfileDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicFacultyProfileSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return FacultyProfile.objects.filter(is_public=True).select_related("user")
