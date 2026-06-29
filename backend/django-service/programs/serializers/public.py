from rest_framework import serializers

from programs.models import (
    LearningProgram,
    ProgramCourse,
    ProgramFAQ,
    ProgramOutcome,
    ProgramPhase,
)


class PublicProgramPriceSerializer(serializers.Serializer):
    base_paise = serializers.IntegerField()
    base_inr = serializers.FloatField()


class PublicProgramOutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramOutcome
        fields = ["id", "title", "description", "icon", "order"]


class PublicProgramFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramFAQ
        fields = ["id", "question", "answer", "order"]


class PublicProgramCourseSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source="course.id", read_only=True)
    title = serializers.CharField(source="course.title", read_only=True)
    slug = serializers.SlugField(source="course.slug", read_only=True)
    description = serializers.CharField(source="course.description", read_only=True)
    domain = serializers.CharField(source="course.domain", read_only=True)
    level = serializers.CharField(source="course.level", read_only=True)
    language = serializers.CharField(source="course.language", read_only=True)
    estimated_hours = serializers.IntegerField(source="course.estimated_hours", read_only=True)
    modules_count = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()

    class Meta:
        model = ProgramCourse
        fields = [
            "id",
            "course_id",
            "title",
            "slug",
            "description",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "modules_count",
            "lessons_count",
            "order",
            "is_required",
            "unlock_after_days",
        ]

    def get_modules_count(self, obj):
        return obj.course.modules.count()

    def get_lessons_count(self, obj):
        return sum(module.lessons.count() for module in obj.course.modules.all())


class PublicProgramPhaseSerializer(serializers.ModelSerializer):
    courses = serializers.SerializerMethodField()

    class Meta:
        model = ProgramPhase
        fields = [
            "id",
            "title",
            "description",
            "order",
            "duration_weeks",
            "starts_at_week",
            "ends_at_week",
            "courses",
        ]

    def get_courses(self, obj):
        courses = obj.phase_courses.select_related("course").prefetch_related(
            "course__modules__lessons"
        )
        return PublicProgramCourseSerializer(courses, many=True).data


class PublicLearningProgramListSerializer(serializers.ModelSerializer):
    active_price = serializers.SerializerMethodField()
    phases_count = serializers.IntegerField(source="phases.count", read_only=True)
    courses_count = serializers.IntegerField(source="program_courses.count", read_only=True)

    class Meta:
        model = LearningProgram
        fields = [
            "id",
            "title",
            "slug",
            "subtitle",
            "short_description",
            "program_type",
            "level",
            "duration_weeks",
            "total_hours",
            "thumbnail",
            "promo_video_url",
            "is_featured",
            "order",
            "active_price",
            "phases_count",
            "courses_count",
        ]

    def get_active_price(self, obj):
        price = obj.pricing_plans.filter(is_active=True).first()
        if not price:
            return None
        return {
            "base_paise": price.amount_paise,
            "base_inr": price.amount_paise / 100,
        }


class PublicLearningProgramDetailSerializer(PublicLearningProgramListSerializer):
    phases = PublicProgramPhaseSerializer(many=True, read_only=True)
    outcomes = PublicProgramOutcomeSerializer(many=True, read_only=True)
    faqs = serializers.SerializerMethodField()

    class Meta(PublicLearningProgramListSerializer.Meta):
        fields = PublicLearningProgramListSerializer.Meta.fields + [
            "description",
            "published_at",
            "phases",
            "outcomes",
            "faqs",
        ]

    def get_faqs(self, obj):
        return PublicProgramFAQSerializer(
            obj.faqs.filter(is_active=True),
            many=True,
        ).data
