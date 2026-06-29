from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views.workspace import WorkspaceViewSet
from .views.tree import WorkspaceTreeView
from .views.item import (
    WorkspaceItemCreateView,
    WorkspaceItemUpdateView,
    WorkspaceItemDeleteView,
)

router = DefaultRouter()
router.register("workspaces", WorkspaceViewSet, basename="workspace")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "workspaces/<int:workspace_id>/tree/",
        WorkspaceTreeView.as_view(),
        name="workspace-tree",
    ),
    path("items/", WorkspaceItemCreateView.as_view(), name="item-create"),
    path("items/<int:pk>/", WorkspaceItemUpdateView.as_view(), name="item-update"),
    path("items/<int:pk>/delete/", WorkspaceItemDeleteView.as_view(), name="item-delete"),
]
