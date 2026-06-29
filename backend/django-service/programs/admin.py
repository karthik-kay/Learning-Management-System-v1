from django.contrib import admin

from .models import (
    LearningProgram,
    ProgramCourse,
    ProgramEnrollment,
    ProgramFAQ,
    ProgramOutcome,
    ProgramPhase,
    ProgramPrice,
)


class ProgramPhaseInline(admin.TabularInline):
    model = ProgramPhase
    extra = 1
    fields = ("title", "order", "duration_weeks", "starts_at_week", "ends_at_week")
    ordering = ("order",)
    show_change_link = True


class ProgramCourseInline(admin.TabularInline):
    model = ProgramCourse
    extra = 1
    fields = ("phase", "course", "order", "is_required", "unlock_after_days")
    ordering = ("phase__order", "order")
    autocomplete_fields = ("course",)


class ProgramOutcomeInline(admin.TabularInline):
    model = ProgramOutcome
    extra = 1
    fields = ("title", "description", "icon", "order")
    ordering = ("order",)


class ProgramFAQInline(admin.TabularInline):
    model = ProgramFAQ
    extra = 1
    fields = ("question", "answer", "order", "is_active")
    ordering = ("order",)


class ProgramPriceInline(admin.TabularInline):
    model = ProgramPrice
    extra = 1
    fields = (
        "amount_paise",
        "min_final_price_paise",
        "max_negotiation_paise",
        "is_active",
    )


@admin.register(LearningProgram)
class LearningProgramAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "program_type",
        "level",
        "duration_weeks",
        "is_published",
        "is_featured",
        "order",
        "updated_at",
    )
    list_filter = ("program_type", "level", "is_published", "is_featured")
    search_fields = ("title", "subtitle", "short_description")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    inlines = [
        ProgramPhaseInline,
        ProgramCourseInline,
        ProgramPriceInline,
        ProgramOutcomeInline,
        ProgramFAQInline,
    ]
    ordering = ("order", "-updated_at")


@admin.register(ProgramPhase)
class ProgramPhaseAdmin(admin.ModelAdmin):
    list_display = ("title", "program", "order", "duration_weeks", "starts_at_week", "ends_at_week")
    list_filter = ("program",)
    search_fields = ("title", "program__title")
    ordering = ("program", "order")


@admin.register(ProgramCourse)
class ProgramCourseAdmin(admin.ModelAdmin):
    list_display = ("program", "phase", "course", "order", "is_required")
    list_filter = ("program", "phase", "is_required")
    search_fields = ("program__title", "phase__title", "course__title")
    autocomplete_fields = ("course",)
    ordering = ("program", "phase__order", "order")


@admin.register(ProgramEnrollment)
class ProgramEnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "program", "status", "progress", "started_at", "updated_at")
    list_filter = ("program", "status")
    search_fields = ("student__user__username", "program__title")
    ordering = ("-updated_at",)


@admin.register(ProgramPrice)
class ProgramPriceAdmin(admin.ModelAdmin):
    list_display = ("program", "amount_paise", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("program__title",)


@admin.register(ProgramOutcome)
class ProgramOutcomeAdmin(admin.ModelAdmin):
    list_display = ("program", "title", "order")
    list_filter = ("program",)
    search_fields = ("program__title", "title")
    ordering = ("program", "order")


@admin.register(ProgramFAQ)
class ProgramFAQAdmin(admin.ModelAdmin):
    list_display = ("program", "question", "order", "is_active")
    list_filter = ("program", "is_active")
    search_fields = ("program__title", "question", "answer")
    ordering = ("program", "order")
