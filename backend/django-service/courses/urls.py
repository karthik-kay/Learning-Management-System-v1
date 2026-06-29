from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .services.media import upload_course_thumbnail
from .views import (
    CourseViewSet,
    EnrollmentViewSet,
    QuizCreateAPIView,
    QuizDetailAPIView,
    QuizSubmitAPIView,
    QuizAttemptsListAPIView,
    QuizHistoryAPIView,
    PublicCourseListAPIView,
    PublicCourseDetailAPIView,
)
from .public_views import (
    PublicCourseProductDetailAPIView,
    PublicCourseProductListAPIView,
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")

urlpatterns = [
    path("", include(router.urls)),
    path("quizzes/create/", QuizCreateAPIView.as_view(), name="quiz-create"),
    path("quizzes/<int:pk>/", QuizDetailAPIView.as_view(), name="quiz-detail"),
    path(
        "quizzes/<int:quiz_id>/submit/",
        QuizSubmitAPIView.as_view(),
        name="quiz-submit",
    ),
    path(
        "quizzes/<int:quiz_id>/attempts/",
        QuizAttemptsListAPIView.as_view(),
        name="quiz-attempts",
    ),
    path(
        "quizzes/history/",
        QuizHistoryAPIView.as_view(),
        name="quiz-history",
    ),
    path("public/courses/", PublicCourseListAPIView.as_view(), name="public-courses"),
    path(
        "public/course-products/",
        PublicCourseProductListAPIView.as_view(),
        name="public-course-products",
    ),
    path(
        "public/course-products/<slug:slug>/",
        PublicCourseProductDetailAPIView.as_view(),
        name="public-course-product-detail",
    ),
    path(
        "public/courses/<int:id>/",
        PublicCourseDetailAPIView.as_view(),
        name="public-course-detail",
    ),
     path("media/upload/thumbnail/", upload_course_thumbnail),
]
