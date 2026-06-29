from django.urls import path

from .public_views import (
    PublicCourseProductDetailAPIView,
    PublicCourseProductListAPIView,
)

urlpatterns = [
    path(
        "",
        PublicCourseProductListAPIView.as_view(),
        name="public-course-product-list",
    ),
    path(
        "<slug:slug>/",
        PublicCourseProductDetailAPIView.as_view(),
        name="public-course-product-detail",
    ),
]
