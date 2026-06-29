from django.db import models
from django.utils.text import slugify


class FacultyProfile(models.Model):
    user = models.OneToOneField(
        "users.CustomUser",
        on_delete=models.CASCADE,
        related_name="public_faculty_profile",
        limit_choices_to={"role__in": ["faculty", "trainer"]},
    )
    display_name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    headline = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True, null=True)
    expertise = models.JSONField(default=list, blank=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    years_experience = models.PositiveIntegerField(default=0)
    is_public = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_name"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["is_public"]),
        ]

    def save(self, *args, **kwargs):
        if not self.display_name:
            full_name = self.user.get_full_name().strip()
            self.display_name = full_name or self.user.username

        if not self.slug:
            base_slug = slugify(self.display_name)
            unique_slug = base_slug
            counter = 1

            while FacultyProfile.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                counter += 1
                unique_slug = f"{base_slug}-{counter}"

            self.slug = unique_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.display_name
