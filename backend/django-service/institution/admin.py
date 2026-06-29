from django.contrib import admin
from .models import (
    Institution,
    Department,
    Program,
    AcademicBatch,
    Section,
    Subject,
    Degree,
    FacultyProfile,
    InstitutionStudent,
    GradeScale,
    InstitutionAuditLog,
    InstitutionExportJob,
    LeaveApplication,
)


# ─────────────────────────────
# BASE MIXIN (COMMON FIELDS)
# ─────────────────────────────

class BaseAdmin(admin.ModelAdmin):
    list_display = ("id", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("id",)


# ─────────────────────────────
# INSTITUTION
# ─────────────────────────────

@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "attendance_threshold", "is_active")
    search_fields = ("name",)


# ─────────────────────────────
# ACADEMIC STRUCTURE
# ─────────────────────────────

@admin.register(Department)
class DepartmentAdmin(BaseAdmin):
    list_display = ("id", "name", "code", "institution", "hod_name", "is_active")

    def hod_name(self, obj):
        return obj.hod.user.get_full_name() if obj.hod else None


@admin.register(Program)
class ProgramAdmin(BaseAdmin):
    list_display = (
        "id", "name", "code", "department",
        "degree", "duration_semesters", "is_active"
    )
    list_filter = ("department", "degree")

@admin.register(AcademicBatch)
class BatchAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "program",
        "start_year", "end_year",
        "current_semester"
    )
    list_filter = ("program",)


@admin.register(Section)
class SectionAdmin(BaseAdmin):
    list_display = (
        "id", "name", "batch", "class_teacher",
        "capacity"
    )


@admin.register(Subject)
class SubjectAdmin(BaseAdmin):
    list_display = (
        "id", "name", "code", "program",
        "semester", "credits"
    )
    list_filter = ("program", "semester")


@admin.register(Degree)
class DegreeAdmin(BaseAdmin):
    list_display = ("id", "name", "code", "is_active")


# ─────────────────────────────
# PEOPLE
# ─────────────────────────────

@admin.register(FacultyProfile)
class FacultyAdmin(BaseAdmin):
    list_display = (
        "id", "user", "department",
        "designation", "status"
    )
    list_filter = ("department", "status")
    search_fields = ("user__email", "employee_id")


@admin.register(InstitutionStudent)
class StudentAdmin(BaseAdmin):
    list_display = (
        "id", "user", "enrollment_number",
        "department", "program",
        "batch", "section",
        "current_semester", "status"
    )
    list_filter = ("department", "program", "batch", "status")
    search_fields = ("user__email", "enrollment_number")


# ─────────────────────────────
# GRADES
# ─────────────────────────────

@admin.register(GradeScale)
class GradeScaleAdmin(admin.ModelAdmin):
    list_display = (
        "institution", "grade",
        "min_marks", "max_marks",
        "grade_point"
    )
    list_filter = ("institution",)
    ordering = ("-min_marks",)


@admin.register(InstitutionAuditLog)
class InstitutionAuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "institution",
        "department",
        "actor",
        "action",
        "target_type",
        "target_id",
        "created_at",
    )
    list_filter = ("institution", "department", "action", "created_at")
    search_fields = ("actor__email", "target_type", "target_id", "reason")
    readonly_fields = (
        "institution",
        "department",
        "actor",
        "action",
        "target_type",
        "target_id",
        "reason",
        "metadata",
        "created_at",
    )


@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "institution",
        "student",
        "from_date",
        "to_date",
        "status",
        "reviewed_by",
        "created_at",
    )
    list_filter = ("institution", "status", "from_date", "created_at")
    search_fields = ("student__user__email", "student__enrollment_number", "reason")


@admin.register(InstitutionExportJob)
class InstitutionExportJobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "institution",
        "requested_by",
        "report_type",
        "status",
        "row_count",
        "created_at",
        "completed_at",
    )
    list_filter = ("institution", "report_type", "status", "created_at")
    search_fields = ("requested_by__email", "report_type", "error_message")
    readonly_fields = ("created_at", "started_at", "completed_at")
