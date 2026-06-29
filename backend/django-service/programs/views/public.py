from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny

from programs.models import LearningProgram
from programs.serializers.public import (
    PublicLearningProgramDetailSerializer,
    PublicLearningProgramListSerializer,
)


class PublicLearningProgramListAPIView(generics.ListAPIView):
    serializer_class = PublicLearningProgramListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            LearningProgram.objects.filter(is_published=True)
            .prefetch_related(
                "pricing_plans",
                "phases",
                "program_courses",
            )
        )
        params = self.request.query_params

        search = params.get("search")
        program_type = params.get("program_type")
        level = params.get("level")
        featured = params.get("featured")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(subtitle__icontains=search)
                | Q(short_description__icontains=search)
                | Q(description__icontains=search)
            )

        if program_type:
            qs = qs.filter(program_type=program_type)

        if level:
            qs = qs.filter(level=level)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class PublicLearningProgramDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicLearningProgramDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            LearningProgram.objects.filter(is_published=True)
            .prefetch_related(
                "pricing_plans",
                "outcomes",
                "faqs",
                "phases__phase_courses__course__modules__lessons",
            )
        )
