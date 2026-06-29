from django.urls import path

from programs.views.public import (
    PublicLearningProgramDetailAPIView,
    PublicLearningProgramListAPIView,
)

urlpatterns = [
    path("", PublicLearningProgramListAPIView.as_view(), name="public-program-list"),
    path(
        "<slug:slug>/",
        PublicLearningProgramDetailAPIView.as_view(),
        name="public-program-detail",
    ),
]
