from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.text import slugify


def build_unique_slug(instance, source_field="title", slug_field="slug"):
    base_slug = slugify(getattr(instance, source_field) or "")
    if not base_slug:
        base_slug = "item"

    model_class = instance.__class__
    unique_slug = base_slug
    counter = 1

    while model_class.objects.filter(**{slug_field: unique_slug}).exclude(pk=instance.pk).exists():
        counter += 1
        unique_slug = f"{base_slug}-{counter}"

    return unique_slug


class PublishableModel(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(default=False, db_index=True)
    display_order = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if self.status == self.Status.PUBLISHED and self.published_at is None:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class PublicPage(PublishableModel):
    class PageKey(models.TextChoices):
        HOME = "home", "Home"
        PROGRAMS = "programs", "Programs"
        CAREER_PATHS = "career_paths", "Career Paths"
        ROADMAPS = "roadmaps", "Roadmaps"
        CERTIFICATIONS = "certifications", "Certifications"
        EVENTS = "events", "Events"
        BLOG = "blog", "Blog"
        ABOUT = "about", "About"
        CONTACT = "contact", "Contact"
        PRIVACY = "privacy", "Privacy Policy"
        TERMS = "terms", "Terms of Service"
        REFUND = "refund", "Refund Policy"

    page_key = models.CharField(max_length=60, choices=PageKey.choices, unique=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    hero_eyebrow = models.CharField(max_length=120, blank=True)
    hero_title = models.CharField(max_length=255, blank=True)
    hero_subtitle = models.TextField(blank=True)
    primary_cta_label = models.CharField(max_length=120, blank=True)
    primary_cta_url = models.CharField(max_length=255, blank=True)
    secondary_cta_label = models.CharField(max_length=120, blank=True)
    secondary_cta_url = models.CharField(max_length=255, blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["display_order", "page_key"]
        indexes = [
            models.Index(fields=["status", "page_key"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PublicContentBlock(PublishableModel):
    page = models.ForeignKey(PublicPage, on_delete=models.CASCADE, related_name="blocks")
    section_key = models.CharField(max_length=100)
    title = models.CharField(max_length=200, blank=True)
    subtitle = models.TextField(blank=True)
    body = models.TextField(blank=True)
    eyebrow = models.CharField(max_length=120, blank=True)
    image_url = models.URLField(blank=True)
    cta_label = models.CharField(max_length=120, blank=True)
    cta_url = models.CharField(max_length=255, blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["page", "display_order", "id"]
        indexes = [
            models.Index(fields=["page", "status", "section_key"]),
        ]

    def __str__(self):
        return f"{self.page.page_key} - {self.section_key}"


class FAQ(PublishableModel):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    page = models.ForeignKey(
        PublicPage,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="faqs",
    )
    category = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["display_order", "id"]
        indexes = [
            models.Index(fields=["status", "category"]),
            models.Index(fields=["page", "status"]),
        ]

    def __str__(self):
        return self.question


class BlogCategory(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name_plural = "Blog categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self, source_field="name")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(PublishableModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField()
    cover_image_url = models.URLField(blank=True)
    author_name = models.CharField(max_length=150, blank=True)
    category = models.ForeignKey(
        BlogCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posts",
    )
    tags = models.JSONField(default=list, blank=True)
    reading_time_minutes = models.PositiveIntegerField(default=0)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        ordering = ["display_order", "-published_at", "title"]
        indexes = [
            models.Index(fields=["status", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PublicDomain(PublishableModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=80, blank=True)
    color = models.CharField(max_length=20, blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["display_order", "title"]
        indexes = [
            models.Index(fields=["status", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CareerPath(PublishableModel):
    class Level(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    domain = models.ForeignKey(
        PublicDomain,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="career_paths",
    )
    role_family = models.CharField(max_length=120, blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    demand_label = models.CharField(max_length=120, blank=True)
    opportunity_count_label = models.CharField(max_length=120, blank=True)
    average_salary_lpa = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    salary_min_lpa = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    salary_max_lpa = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    hiring_companies = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    prerequisites = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    recommended_programs = models.ManyToManyField(
        "programs.LearningProgram",
        blank=True,
        related_name="career_paths",
    )
    recommended_courses = models.ManyToManyField(
        "courses.CourseProduct",
        blank=True,
        related_name="career_paths",
    )
    related_roadmaps = models.ManyToManyField(
        "Roadmap",
        blank=True,
        related_name="related_career_paths",
    )
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["display_order", "title"]
        indexes = [
            models.Index(fields=["status", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class CareerPathStage(models.Model):
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE, related_name="stages")
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    expected_salary_lpa = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["career_path", "display_order", "id"]

    def __str__(self):
        return f"{self.career_path.title} - {self.title}"


class Roadmap(PublishableModel):
    class Level(models.TextChoices):
        BEGINNER = "beginner", "Beginner"
        INTERMEDIATE = "intermediate", "Intermediate"
        ADVANCED = "advanced", "Advanced"

    class RoadmapType(models.TextChoices):
        DOMAIN = "domain", "Domain Roadmap"
        ROLE = "role", "Role Roadmap"
        SKILL = "skill", "Skill Roadmap"
        TRACK = "track", "Track Roadmap"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    domain = models.ForeignKey(
        PublicDomain,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="roadmaps",
    )
    roadmap_type = models.CharField(
        max_length=30,
        choices=RoadmapType.choices,
        default=RoadmapType.DOMAIN,
    )
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    estimated_duration_weeks = models.PositiveIntegerField(default=0)
    skills = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)
    outcomes = models.JSONField(default=list, blank=True)
    recommended_programs = models.ManyToManyField(
        "programs.LearningProgram",
        blank=True,
        related_name="roadmaps",
    )
    recommended_courses = models.ManyToManyField(
        "courses.CourseProduct",
        blank=True,
        related_name="roadmaps",
    )
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["display_order", "title"]
        indexes = [
            models.Index(fields=["status", "roadmap_type", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class RoadmapTrack(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name="tracks")
    title = models.CharField(max_length=180)
    slug = models.SlugField(blank=True)
    description = models.TextField(blank=True)
    focus_area = models.CharField(max_length=120, blank=True)
    skills = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["roadmap", "display_order", "id"]
        unique_together = ["roadmap", "slug"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.roadmap.title} - {self.title}"


class RoadmapStep(models.Model):
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE, related_name="steps")
    track = models.ForeignKey(
        RoadmapTrack,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="steps",
    )
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    stage_type = models.CharField(max_length=80, blank=True)
    duration_label = models.CharField(max_length=80, blank=True)
    concepts = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)
    projects = models.JSONField(default=list, blank=True)
    resources = models.JSONField(default=list, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["roadmap", "track__display_order", "display_order", "id"]

    def clean(self):
        if self.track_id and self.roadmap_id and self.track.roadmap_id != self.roadmap_id:
            raise ValidationError("RoadmapStep track must belong to the same roadmap.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.roadmap.title} - {self.title}"


class PublicEvent(PublishableModel):
    class EventType(models.TextChoices):
        WEBINAR = "webinar", "Webinar"
        WORKSHOP = "workshop", "Workshop"
        EXAM = "exam", "Exam"
        BOUNTY = "bounty", "Bounty"
        HACKATHON = "hackathon", "Hackathon"
        COMMUNITY = "community", "Community"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    mentor_name = models.CharField(max_length=150, blank=True)
    location_label = models.CharField(max_length=150, blank=True)
    register_url = models.CharField(max_length=255, blank=True)
    prize_pool = models.CharField(max_length=120, blank=True)
    team_size = models.CharField(max_length=120, blank=True)
    related_programs = models.ManyToManyField(
        "programs.LearningProgram",
        blank=True,
        related_name="public_events",
    )
    related_courses = models.ManyToManyField(
        "courses.CourseProduct",
        blank=True,
        related_name="public_events",
    )
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["display_order", "starts_at", "title"]
        indexes = [
            models.Index(fields=["status", "event_type", "starts_at"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = build_unique_slug(self)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
