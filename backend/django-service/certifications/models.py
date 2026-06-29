import uuid
from django.db import models

class Certificate(models.Model):
    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student       = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='certificates')
    course        = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='certificates')
    issued_at     = models.DateTimeField(auto_now_add=True)
    credential_id = models.CharField(max_length=16, unique=True, editable=False)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-issued_at']

    def save(self, *args, **kwargs):
        if not self.credential_id:
            self.credential_id = f"LF-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.user.username} | {self.course.title} | {self.credential_id}"