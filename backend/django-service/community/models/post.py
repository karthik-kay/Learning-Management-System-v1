from django.db import models
from django.contrib.auth import get_user_model
from .group import CommunityGroup

User = get_user_model()

class CommunityPost(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="community_posts"
    )
    group = models.ForeignKey(
        CommunityGroup,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    content = models.TextField()
    image = models.ImageField(
        upload_to="community/posts/",
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
