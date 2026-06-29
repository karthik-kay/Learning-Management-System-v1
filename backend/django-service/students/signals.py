from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Student

User = settings.AUTH_USER_MODEL

@receiver(post_save, sender=User)
def create_student_profile(sender, instance, created, **kwargs):
    if created and instance.role == "student":
        Student.objects.create(user=instance)