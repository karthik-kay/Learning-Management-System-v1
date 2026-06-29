from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Workspace(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user})"


class WorkspaceItem(models.Model):
    FILE = "file"
    FOLDER = "folder"

    ITEM_TYPE_CHOICES = [
        (FILE, "File"),
        (FOLDER, "Folder"),
    ]

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="items"
    )

    name = models.CharField(max_length=255)

    type = models.CharField(
        max_length=10,
        choices=ITEM_TYPE_CHOICES
    )

    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
        db_index=True
    )

    content = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("workspace", "parent", "name")


    def __str__(self):
        return self.name

