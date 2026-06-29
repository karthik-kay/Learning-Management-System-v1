from rest_framework import serializers

from public_content.models import (
    BlogCategory,
    BlogPost,
    CareerPath,
    CareerPathStage,
    FAQ,
    PublicContentBlock,
    PublicDomain,
    PublicEvent,
    PublicPage,
    Roadmap,
    RoadmapStep,
    RoadmapTrack,
)


class PublicContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicContentBlock
        fields = [
            "id",
            "section_key",
            "title",
            "subtitle",
            "body",
            "eyebrow",
            "image_url",
            "cta_label",
            "cta_url",
            "payload",
            "display_order",
        ]


class FAQSerializer(serializers.ModelSerializer):
    page_key = serializers.CharField(source="page.page_key", read_only=True)

    class Meta:
        model = FAQ
        fields = [
            "id",
            "question",
            "answer",
            "category",
            "page_key",
            "display_order",
        ]


class PublicPageSerializer(serializers.ModelSerializer):
    blocks = serializers.SerializerMethodField()
    faqs = serializers.SerializerMethodField()

    class Meta:
        model = PublicPage
        fields = [
            "id",
            "page_key",
            "title",
            "slug",
            "meta_title",
            "meta_description",
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "primary_cta_label",
            "primary_cta_url",
            "secondary_cta_label",
            "secondary_cta_url",
            "payload",
            "published_at",
            "blocks",
            "faqs",
        ]

    def get_blocks(self, obj):
        blocks = obj.blocks.filter(status=PublicContentBlock.Status.PUBLISHED)
        return PublicContentBlockSerializer(blocks, many=True).data

    def get_faqs(self, obj):
        faqs = obj.faqs.filter(status=FAQ.Status.PUBLISHED)
        return FAQSerializer(faqs, many=True).data


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ["id", "name", "slug", "description", "display_order"]


class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "cover_image_url",
            "author_name",
            "category",
            "tags",
            "reading_time_minutes",
            "is_featured",
            "display_order",
            "published_at",
            "meta_title",
            "meta_description",
        ]


class BlogPostDetailSerializer(BlogPostListSerializer):
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ["body"]


class PublicDomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicDomain
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "icon",
            "color",
            "is_featured",
            "display_order",
            "payload",
        ]


class CareerPathStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerPathStage
        fields = [
            "id",
            "title",
            "description",
            "expected_salary_lpa",
            "display_order",
            "payload",
        ]


class LinkedProgramSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.SlugField()
    subtitle = serializers.CharField()
    program_type = serializers.CharField()
    level = serializers.CharField()


class LinkedCourseProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.SlugField()
    short_description = serializers.CharField()


class CareerPathListSerializer(serializers.ModelSerializer):
    domain = serializers.SlugField(source="domain.slug", read_only=True)
    domain_title = serializers.CharField(source="domain.title", read_only=True)
    stages_count = serializers.IntegerField(source="stages.count", read_only=True)

    class Meta:
        model = CareerPath
        fields = [
            "id",
            "title",
            "slug",
            "subtitle",
            "short_description",
            "domain",
            "domain_title",
            "role_family",
            "level",
            "demand_label",
            "opportunity_count_label",
            "average_salary_lpa",
            "salary_min_lpa",
            "salary_max_lpa",
            "hiring_companies",
            "skills",
            "tools",
            "responsibilities",
            "prerequisites",
            "highlights",
            "is_featured",
            "display_order",
            "published_at",
            "stages_count",
            "payload",
        ]


class CareerPathDetailSerializer(CareerPathListSerializer):
    stages = CareerPathStageSerializer(many=True, read_only=True)
    recommended_programs = LinkedProgramSerializer(many=True, read_only=True)
    recommended_courses = LinkedCourseProductSerializer(many=True, read_only=True)
    related_roadmaps = serializers.SerializerMethodField()

    class Meta(CareerPathListSerializer.Meta):
        fields = CareerPathListSerializer.Meta.fields + [
            "description",
            "stages",
            "recommended_programs",
            "recommended_courses",
            "related_roadmaps",
        ]

    def get_related_roadmaps(self, obj):
        return RoadmapListSerializer(obj.related_roadmaps.filter(status="published"), many=True).data


class RoadmapStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapStep
        fields = [
            "id",
            "track",
            "title",
            "description",
            "stage_type",
            "duration_label",
            "concepts",
            "skills",
            "tools",
            "projects",
            "resources",
            "display_order",
            "payload",
        ]


class RoadmapTrackSerializer(serializers.ModelSerializer):
    steps = serializers.SerializerMethodField()

    class Meta:
        model = RoadmapTrack
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "focus_area",
            "skills",
            "tools",
            "display_order",
            "payload",
            "steps",
        ]

    def get_steps(self, obj):
        return RoadmapStepSerializer(obj.steps.all(), many=True).data


class RoadmapListSerializer(serializers.ModelSerializer):
    domain = serializers.SlugField(source="domain.slug", read_only=True)
    domain_title = serializers.CharField(source="domain.title", read_only=True)
    steps_count = serializers.IntegerField(source="steps.count", read_only=True)
    tracks_count = serializers.IntegerField(source="tracks.count", read_only=True)

    class Meta:
        model = Roadmap
        fields = [
            "id",
            "title",
            "slug",
            "subtitle",
            "description",
            "domain",
            "domain_title",
            "roadmap_type",
            "level",
            "estimated_duration_weeks",
            "skills",
            "tools",
            "outcomes",
            "is_featured",
            "display_order",
            "published_at",
            "steps_count",
            "tracks_count",
            "payload",
        ]


class RoadmapDetailSerializer(RoadmapListSerializer):
    steps = RoadmapStepSerializer(many=True, read_only=True)
    tracks = RoadmapTrackSerializer(many=True, read_only=True)
    related_career_paths = CareerPathListSerializer(many=True, read_only=True)
    recommended_programs = LinkedProgramSerializer(many=True, read_only=True)
    recommended_courses = LinkedCourseProductSerializer(many=True, read_only=True)

    class Meta(RoadmapListSerializer.Meta):
        fields = RoadmapListSerializer.Meta.fields + [
            "steps",
            "tracks",
            "related_career_paths",
            "recommended_programs",
            "recommended_courses",
        ]


class PublicEventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicEvent
        fields = [
            "id",
            "title",
            "slug",
            "event_type",
            "short_description",
            "starts_at",
            "ends_at",
            "mentor_name",
            "location_label",
            "register_url",
            "prize_pool",
            "team_size",
            "is_featured",
            "display_order",
            "published_at",
            "payload",
        ]


class PublicEventDetailSerializer(PublicEventListSerializer):
    related_programs = LinkedProgramSerializer(many=True, read_only=True)
    related_courses = LinkedCourseProductSerializer(many=True, read_only=True)

    class Meta(PublicEventListSerializer.Meta):
        fields = PublicEventListSerializer.Meta.fields + [
            "description",
            "related_programs",
            "related_courses",
        ]
