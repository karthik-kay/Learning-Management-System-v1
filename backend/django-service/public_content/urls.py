from django.urls import path

from public_content.views import (
    BlogCategoryListAPIView,
    BlogPostDetailAPIView,
    BlogPostListAPIView,
    CareerPathDetailAPIView,
    CareerPathListAPIView,
    FAQListAPIView,
    PublicDomainListAPIView,
    PublicEventDetailAPIView,
    PublicEventListAPIView,
    PublicPageDetailAPIView,
    RoadmapDetailAPIView,
    RoadmapListAPIView,
)

urlpatterns = [
    path("pages/<str:page_key>/", PublicPageDetailAPIView.as_view(), name="public-page-detail"),
    path("faqs/", FAQListAPIView.as_view(), name="public-faq-list"),
    path("blog/categories/", BlogCategoryListAPIView.as_view(), name="public-blog-category-list"),
    path("domains/", PublicDomainListAPIView.as_view(), name="public-domain-list"),
    path("blog/", BlogPostListAPIView.as_view(), name="public-blog-list"),
    path("blog/<slug:slug>/", BlogPostDetailAPIView.as_view(), name="public-blog-detail"),
    path("career-paths/", CareerPathListAPIView.as_view(), name="public-career-path-list"),
    path(
        "career-paths/<slug:slug>/",
        CareerPathDetailAPIView.as_view(),
        name="public-career-path-detail",
    ),
    path("roadmaps/", RoadmapListAPIView.as_view(), name="public-roadmap-list"),
    path("roadmaps/<slug:slug>/", RoadmapDetailAPIView.as_view(), name="public-roadmap-detail"),
    path("events/", PublicEventListAPIView.as_view(), name="public-event-list"),
    path("events/<slug:slug>/", PublicEventDetailAPIView.as_view(), name="public-event-detail"),
]
