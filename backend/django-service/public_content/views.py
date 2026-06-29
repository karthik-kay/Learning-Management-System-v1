from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny

from public_content.models import (
    BlogCategory,
    BlogPost,
    CareerPath,
    FAQ,
    PublicDomain,
    PublicEvent,
    PublicPage,
    Roadmap,
)
from public_content.serializers import (
    BlogCategorySerializer,
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    CareerPathDetailSerializer,
    CareerPathListSerializer,
    FAQSerializer,
    PublicDomainSerializer,
    PublicEventDetailSerializer,
    PublicEventListSerializer,
    PublicPageSerializer,
    RoadmapDetailSerializer,
    RoadmapListSerializer,
)


PUBLISHED = "published"


class PublicPageDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicPageSerializer
    permission_classes = [AllowAny]
    lookup_field = "page_key"

    def get_queryset(self):
        return (
            PublicPage.objects.filter(status=PUBLISHED)
            .prefetch_related("blocks", "faqs")
        )


class FAQListAPIView(generics.ListAPIView):
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = FAQ.objects.filter(status=PUBLISHED).select_related("page")
        params = self.request.query_params

        page_key = params.get("page")
        category = params.get("category")
        search = params.get("search")

        if page_key:
            qs = qs.filter(page__page_key=page_key)

        if category:
            qs = qs.filter(category__iexact=category)

        if search:
            qs = qs.filter(Q(question__icontains=search) | Q(answer__icontains=search))

        return qs


class BlogCategoryListAPIView(generics.ListAPIView):
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    queryset = BlogCategory.objects.all()


class BlogPostListAPIView(generics.ListAPIView):
    serializer_class = BlogPostListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = BlogPost.objects.filter(status=PUBLISHED).select_related("category")
        params = self.request.query_params

        search = params.get("search")
        category = params.get("category")
        featured = params.get("featured")
        tag = params.get("tag")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(excerpt__icontains=search)
                | Q(body__icontains=search)
            )

        if category:
            qs = qs.filter(category__slug=category)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        if tag:
            qs = qs.filter(tags__contains=[tag])

        return qs


class BlogPostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = BlogPostDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return BlogPost.objects.filter(status=PUBLISHED).select_related("category")


class PublicDomainListAPIView(generics.ListAPIView):
    serializer_class = PublicDomainSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = PublicDomain.objects.filter(status=PUBLISHED)
        featured = self.request.query_params.get("featured")

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class CareerPathListAPIView(generics.ListAPIView):
    serializer_class = CareerPathListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            CareerPath.objects.filter(status=PUBLISHED)
            .select_related("domain")
            .prefetch_related("stages", "related_roadmaps")
        )
        params = self.request.query_params

        search = params.get("search")
        domain = params.get("domain")
        level = params.get("level")
        featured = params.get("featured")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(subtitle__icontains=search)
                | Q(short_description__icontains=search)
                | Q(description__icontains=search)
                | Q(skills__contains=[search])
                | Q(tools__contains=[search])
            )

        if domain:
            qs = qs.filter(domain__slug=domain)

        if level:
            qs = qs.filter(level=level)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class CareerPathDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CareerPathDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            CareerPath.objects.filter(status=PUBLISHED)
            .select_related("domain")
            .prefetch_related(
                "stages",
                "recommended_programs",
                "recommended_courses",
                "related_roadmaps__domain",
            )
        )


class RoadmapListAPIView(generics.ListAPIView):
    serializer_class = RoadmapListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            Roadmap.objects.filter(status=PUBLISHED)
            .select_related("domain")
            .prefetch_related("steps", "tracks")
        )
        params = self.request.query_params

        search = params.get("search")
        domain = params.get("domain")
        level = params.get("level")
        career_path = params.get("career_path")
        featured = params.get("featured")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(subtitle__icontains=search)
                | Q(description__icontains=search)
            )

        if domain:
            qs = qs.filter(domain__slug=domain)

        if level:
            qs = qs.filter(level=level)

        if career_path:
            qs = qs.filter(related_career_paths__slug=career_path)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class RoadmapDetailAPIView(generics.RetrieveAPIView):
    serializer_class = RoadmapDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Roadmap.objects.filter(status=PUBLISHED)
            .select_related("domain")
            .prefetch_related(
                "steps",
                "tracks__steps",
                "related_career_paths__domain",
                "recommended_programs",
                "recommended_courses",
            )
        )


class PublicEventListAPIView(generics.ListAPIView):
    serializer_class = PublicEventListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = PublicEvent.objects.filter(status=PUBLISHED)
        params = self.request.query_params

        search = params.get("search")
        event_type = params.get("event_type")
        featured = params.get("featured")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(short_description__icontains=search)
                | Q(description__icontains=search)
                | Q(mentor_name__icontains=search)
            )

        if event_type:
            qs = qs.filter(event_type=event_type)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        return qs


class PublicEventDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicEventDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            PublicEvent.objects.filter(status=PUBLISHED)
            .prefetch_related(
                "related_programs",
                "related_courses",
            )
        )
