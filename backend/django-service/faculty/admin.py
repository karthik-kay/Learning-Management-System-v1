from django.contrib import admin

from .models import FacultyProfile


@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = (
        "display_name",
        "user",
        "headline",
        "years_experience",
        "is_public",
        "updated_at",
    )
    list_filter = ("is_public",)
    search_fields = ("display_name", "headline", "bio", "user__username", "user__email")
    prepopulated_fields = {"slug": ("display_name",)}
    readonly_fields = ("created_at", "updated_at")
    ordering = ("display_name",)
