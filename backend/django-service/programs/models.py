from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class LearningProgram(models.Model):
    class ProgramType(models.TextChoices):
        LONG_TERM = "long_term", "Long-Term Program"
        FAST_TRACK = "fast_track", "Fast-Track Program"
        COHORT = "cohort", "Cohort Program"
        SELF_PACED = "self_paced", "Self-Paced Program"

    class Level(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    program_type = models.CharField(
        max_length=30,
        choices=ProgramType.choices,
        default=ProgramType.LONG_TERM,
    )
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    duration_weeks = models.PositiveIntegerField(default=0)
    total_hours = models.PositiveIntegerField(default=0)
    thumbnail = models.URLField(blank=True, null=True)
    promo_video_url = models.URLField(blank=True, null=True)
    is_published = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    order = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-published_at", "title"]
        indexes = [
            models.Index(fields=["is_published", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            unique_slug = base_slug
            counter = 1

            while LearningProgram.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                counter += 1
                unique_slug = f"{base_slug}-{counter}"

            self.slug = unique_slug

        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProgramPhase(models.Model):
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.CASCADE,
        related_name="phases",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration_weeks = models.PositiveIntegerField(default=0)
    starts_at_week = models.PositiveIntegerField(null=True, blank=True)
    ends_at_week = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["program", "order", "id"]
        unique_together = ["program", "order"]

    def __str__(self):
        return f"{self.program.title} - {self.title}"


class ProgramCourse(models.Model):
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.CASCADE,
        related_name="program_courses",
    )
    phase = models.ForeignKey(
        ProgramPhase,
        on_delete=models.CASCADE,
        related_name="phase_courses",
    )
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.PROTECT,
        related_name="program_links",
    )
    order = models.PositiveIntegerField(default=0)
    is_required = models.BooleanField(default=True)
    unlock_after_days = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["program", "phase__order", "order", "id"]
        unique_together = ["program", "course"]
        indexes = [
            models.Index(fields=["program", "phase", "order"]),
        ]

    def clean(self):
        if self.phase_id and self.program_id and self.phase.program_id != self.program_id:
            raise ValidationError("ProgramCourse phase must belong to the same program.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.program.title} - {self.course.title}"


class ProgramEnrollment(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        REFUNDED = "refunded", "Refunded"

    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="program_enrollments",
    )
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.PROTECT,
        related_name="enrollments",
    )
    order = models.ForeignKey(
        "payments.PaymentOrder",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="program_enrollments",
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    progress = models.FloatField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["student", "program"]
        indexes = [
            models.Index(fields=["student", "status"]),
            models.Index(fields=["program", "status"]),
        ]

    def __str__(self):
        return f"{self.student} -> {self.program.title}"


class ProgramPrice(models.Model):
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.CASCADE,
        related_name="pricing_plans",
    )
    amount_paise = models.PositiveIntegerField()
    min_final_price_paise = models.PositiveIntegerField(default=0)
    max_negotiation_paise = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_active", "-created_at"]

    def __str__(self):
        return f"{self.program.title} - Rs {self.amount_paise // 100}"


class ProgramOutcome(models.Model):
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.CASCADE,
        related_name="outcomes",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=80, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["program", "order", "id"]

    def __str__(self):
        return f"{self.program.title} - {self.title}"


class ProgramFAQ(models.Model):
    program = models.ForeignKey(
        LearningProgram,
        on_delete=models.CASCADE,
        related_name="faqs",
    )
    question = models.CharField(max_length=255)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["program", "order", "id"]

    def __str__(self):
        return self.question
