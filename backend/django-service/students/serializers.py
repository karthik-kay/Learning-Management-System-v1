from rest_framework import serializers
from .models import Student, LearningActivity, Goal, Task,LessonProgress
from courses.serializers import EnrolledLessonSerializer
from courses.models import Course, Lesson


class LearningActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningActivity
        fields = ["id", "seconds", "created_at"]


class GoalSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    
    class Meta:
        model = Goal
        fields = ["id",
            "title",
            "category",
            "category_display",
            "goal_type",
            "progress",
            "target",
            "deadline",
            "created_at",
            "last_checkin_date",
            "completed",]
    def get_completed(self, obj):
        return obj.progress >= obj.target



class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "deadline",
            "priority",
            "progress",
            "completed",
            "course",
            "course_title",
            "is_overdue",
        ]

    def get_is_overdue(self, obj):
        return obj.is_overdue()

    def get_course_title(self, obj):
        return obj.course.title if obj.course else None


class CourseSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = Course
        fields = ["id", "title", "description", "created_by_name", "created_at"]

class MonthlyStatsSerializer(serializers.Serializer):
    learning_hours = serializers.FloatField()
    modules_completed = serializers.IntegerField()
    # assessments_passed = serializers.IntegerField()

class StudentSerializer(serializers.ModelSerializer):
    activities = LearningActivitySerializer(many=True, read_only=True)
    goals = GoalSerializer(many=True, read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    enrolled_courses = CourseSerializer(many=True, read_only=True)
    lifetime_learning_hours = serializers.SerializerMethodField()
    monthly_stats = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "lifetime_learning_hours",
            "day_streak",
            "last_active",
            "total_points",
            "activities",
            "goals",
            "tasks",
            "enrolled_courses",
            "monthly_stats"
        ]
    def get_lifetime_learning_hours(self, obj):
        total_seconds = sum(a.seconds for a in obj.activities.all())
        return round(total_seconds / 3600, 2)
    
    def get_monthly_stats(self, obj):
        if not self.context.get("include_monthly_stats"):
            return None

        from students.services.monthly_stats import get_monthly_stats
        return get_monthly_stats(obj)

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson = EnrolledLessonSerializer(read_only=True)

    class Meta:
        model = LessonProgress
        fields = ["id", "lesson", "completed", "completed_at"]



class LessonQueueSerializer(serializers.ModelSerializer):
    module = serializers.CharField(source="module.title")
    course_id = serializers.IntegerField(source="module.course.id")
    
    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "module",
            "course_id",
            "lesson_type",
            "duration_minutes",

        ]


