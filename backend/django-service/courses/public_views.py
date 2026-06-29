from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import CourseProduct
from .public_serializers import (
    PublicCourseProductDetailSerializer,
    PublicCourseProductListSerializer,
)


class PublicCourseProductListAPIView(generics.ListAPIView):
    serializer_class = PublicCourseProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            CourseProduct.objects.filter(is_published=True, course__is_active=True)
            .select_related("course")
            .prefetch_related("course__modules__lessons")
        )
        params = self.request.query_params

        search = params.get("search")
        domain = params.get("domain")
        level = params.get("level")
        language = params.get("language")
        featured = params.get("featured")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(short_description__icontains=search)
                | Q(course__title__icontains=search)
                | Q(course__description__icontains=search)
            )

        if domain:
            qs = qs.filter(course__domain__iexact=domain)

        if level:
            qs = qs.filter(course__level__iexact=level)

        if language:
            qs = qs.filter(course__language__iexact=language)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class PublicCourseProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicCourseProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            CourseProduct.objects.filter(is_published=True, course__is_active=True)
            .select_related("course")
            .prefetch_related("course__modules__lessons")
        )
