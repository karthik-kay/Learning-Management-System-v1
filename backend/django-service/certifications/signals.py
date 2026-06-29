from django.db.models.signals import post_save
from django.dispatch import receiver
from courses.models import Enrollment
from .models import Certificate

@receiver(post_save, sender=Enrollment)
def issue_certificate_on_completion(sender, instance, **kwargs):
    if not instance.is_completed:
        return
    Certificate.objects.get_or_create(
        student=instance.student,
        course=instance.course
    )