from django.urls import path

from .views import PublicFacultyProfileDetailAPIView, PublicFacultyProfileListAPIView

urlpatterns = [
    path("", PublicFacultyProfileListAPIView.as_view(), name="public-faculty-list"),
    path(
        "<slug:slug>/",
        PublicFacultyProfileDetailAPIView.as_view(),
        name="public-faculty-detail",
    ),
]
