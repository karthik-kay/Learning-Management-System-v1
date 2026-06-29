from django.contrib import admin
from .models import (
    Course, CourseProduct, Module, Lesson,
    Enrollment,
    Quiz, QuizQuestion, QuizOption,
    QuizAttempt, QuizAnswer
)

# -------------------------
# INLINE CONFIGS
# -------------------------

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ("title", "order", "duration_minutes", "is_preview")
    ordering = ("order",)


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1
    fields = ("title", "order", "duration_minutes", "deadline")
    ordering = ("order",)
    show_change_link = True


# -------------------------
# COURSE ADMIN
# -------------------------

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_by",
        "domain",
        "level",
        "language",
        "estimated_hours",
        "is_active",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "domain",
        "level",
        "language",
        "course_type",
        "is_active",
    )

    search_fields = ("title", "description", "created_by__username")

    prepopulated_fields = {"slug": ("title",)}

    inlines = [ModuleInline]

    readonly_fields = ("created_at", "updated_at")

    ordering = ("-updated_at", "-created_at")


@admin.register(CourseProduct)
class CourseProductAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "course",
        "is_free",
        "display_price_paise",
        "is_published",
        "is_featured",
        "order",
        "published_at",
        "updated_at",
    )
    list_filter = ("is_published", "is_featured", "is_free")
    search_fields = ("title", "short_description", "course__title")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    filter_horizontal = ("instructors",)
    ordering = ("order", "-published_at", "title")


# -------------------------
# MODULE ADMIN
# -------------------------

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "duration_minutes", "deadline")
    list_filter = ("course",)
    search_fields = ("title", "course__title")
    ordering = ("course", "order")

    inlines = [LessonInline]


# -------------------------
# LESSON ADMIN
# -------------------------

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "module",
        "lesson_type",
        "order",
        "duration_minutes",
        "is_preview",
        "deadline",
    )

    list_filter = ("module","lesson_type", "is_preview")
    search_fields = ("title", "module__title", "module__course__title")
    ordering = ("module", "order")


# -------------------------
# ENROLLMENT ADMIN
# -------------------------

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "course",
        "progress",
        "completed_modules",
        "total_modules",
        "is_completed",
        "started_at",
        "updated_at",
    )

    list_filter = ("course", "is_completed")
    search_fields = ("student__user__username", "course__title")
    ordering = ("-updated_at",)


# -------------------------
# QUIZ ADMIN
# -------------------------

class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1
    show_change_link = True
    ordering = ("order",)


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "module", "lesson", "due_date", "created_at")
    list_filter = ("course", "module")
    search_fields = ("title", "course__title")
    inlines = [QuizQuestionInline]
    ordering = ("-created_at",)


# -------------------------
# QUESTION + OPTIONS ADMIN
# -------------------------

class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 2


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "quiz", "question_type", "marks", "order")
    list_filter = ("quiz", "question_type")
    search_fields = ("text",)
    ordering = ("quiz", "order")
    inlines = [QuizOptionInline]


@admin.register(QuizOption)
class QuizOptionAdmin(admin.ModelAdmin):
    list_display = ("text", "question", "is_correct")
    list_filter = ("question",)
    search_fields = ("text",)


# -------------------------
# QUIZ ATTEMPT + ANSWERS
# -------------------------

class QuizAnswerInline(admin.TabularInline):
    model = QuizAnswer
    extra = 0
    readonly_fields = ("question", "selected_option", "text_answer")


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("student", "quiz", "score", "started_at", "completed_at")
    list_filter = ("quiz", "student")
    search_fields = ("student__user__username", "quiz__title")
    ordering = ("-completed_at",)
    inlines = [QuizAnswerInline]


@admin.register(QuizAnswer)
class QuizAnswerAdmin(admin.ModelAdmin):
    list_display = ("attempt", "question", "selected_option", "text_answer")
    list_filter = ("attempt__quiz",)
