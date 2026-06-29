from django.contrib import admin
from .models import Workspace, WorkspaceItem


@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "user", "created_at")
    search_fields = ("name", "user__username")


@admin.register(WorkspaceItem)
class WorkspaceItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "type", "workspace", "parent")
    list_filter = ("type", "workspace")
    search_fields = ("name",)
