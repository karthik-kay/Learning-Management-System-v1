from rest_framework import serializers

from .models import CourseProduct, Lesson
from .serializers import PublicModuleSerializer
from faculty.serializers import PublicFacultyProfileSerializer


class PublicCourseProductListSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source="course.id", read_only=True)
    course_slug = serializers.SlugField(source="course.slug", read_only=True)
    domain = serializers.CharField(source="course.domain", read_only=True)
    level = serializers.CharField(source="course.level", read_only=True)
    language = serializers.CharField(source="course.language", read_only=True)
    estimated_hours = serializers.IntegerField(source="course.estimated_hours", read_only=True)
    modules_count = serializers.IntegerField(source="course.modules.count", read_only=True)
    lessons_count = serializers.SerializerMethodField()
    instructors = PublicFacultyProfileSerializer(many=True, read_only=True)

    class Meta:
        model = CourseProduct
        fields = [
            "id",
            "course_id",
            "course_slug",
            "title",
            "slug",
            "short_description",
            "thumbnail",
            "promo_video_url",
            "is_free",
            "display_price_paise",
            "instructor_name",
            "instructors",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "modules_count",
            "lessons_count",
            "is_featured",
        ]

    def get_lessons_count(self, obj):
        return Lesson.objects.filter(module__course=obj.course).count()


class PublicCourseProductDetailSerializer(PublicCourseProductListSerializer):
    description = serializers.CharField(source="course.description", read_only=True)
    modules = PublicModuleSerializer(source="course.modules", many=True, read_only=True)

    class Meta(PublicCourseProductListSerializer.Meta):
        fields = PublicCourseProductListSerializer.Meta.fields + [
            "description",
            "modules",
            "published_at",
        ]
