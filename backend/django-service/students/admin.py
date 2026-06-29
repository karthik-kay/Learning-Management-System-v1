from django.contrib import admin
from .models import Student, LearningActivity, Goal, Task, LessonProgress


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("user", "learning_hours", "day_streak", "total_points")
    search_fields = ("user__username",)
    list_filter = ()


@admin.register(LearningActivity)
class LearningActivityAdmin(admin.ModelAdmin):
    list_display = ("student", "seconds", "created_at")
    list_filter = ("created_at",)
    search_fields = ("student__user__username",)


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("student", "title","category","goal_type", "progress", "target", "deadline","created_at")
    list_filter = ("deadline", "category", "goal_type")
    search_fields = ("title", "student__user__username")


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("student", "title", "deadline", "priority", "completed")
    list_filter = ("priority", "completed")
    search_fields = ("title", "student__user__username")


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("student", "lesson", "completed", "completed_at")
    list_filter = ("completed", "lesson__module__course")
    search_fields = ("student__user__username", "lesson__title")
