from django.db import models
from django.contrib.auth import get_user_model
from .post import CommunityPost

User = get_user_model()

class PostLike(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")
 