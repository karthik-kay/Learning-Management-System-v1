from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    TaskViewSet,
    GoalViewSet,
    student_dashboard,
    log_activity,
    daily_learning_hours,
    LessonQueueView
)

#viewser apis
router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"goals", GoalViewSet, basename="goals")


urlpatterns = [
    #non crud views
    path("dashboard/", student_dashboard, name="student-dashboard"),
    path("activity/log/", log_activity, name="log-activity"),
     path("activity/daily/", daily_learning_hours),
     path("lesson-queue/", LessonQueueView.as_view(), name="lesson-queue"),

    path("", include(router.urls)),
]
