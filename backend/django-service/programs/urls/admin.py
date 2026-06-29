from django.urls import include, path
from rest_framework.routers import DefaultRouter

from programs.views.admin import (
    LearningProgramAdminViewSet,
    ProgramCourseAdminViewSet,
    ProgramEnrollmentAdminViewSet,
    ProgramFAQAdminViewSet,
    ProgramOutcomeAdminViewSet,
    ProgramPhaseAdminViewSet,
    ProgramPriceAdminViewSet,
)

router = DefaultRouter()
router.register("programs", LearningProgramAdminViewSet, basename="admin-program")
router.register("phases", ProgramPhaseAdminViewSet, basename="admin-program-phase")
router.register("courses", ProgramCourseAdminViewSet, basename="admin-program-course")
router.register("enrollments", ProgramEnrollmentAdminViewSet, basename="admin-program-enrollment")
router.register("prices", ProgramPriceAdminViewSet, basename="admin-program-price")
router.register("outcomes", ProgramOutcomeAdminViewSet, basename="admin-program-outcome")
router.register("faqs", ProgramFAQAdminViewSet, basename="admin-program-faq")

urlpatterns = [
    path("", include(router.urls)),
]
