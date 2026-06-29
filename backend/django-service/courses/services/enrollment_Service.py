from django.db import transaction

from notifications.models import Notification
from notifications.services import create_notification
from notifications.tasks import deliver_notification


def enroll_student(student, course):

    enrollment = Enrollment.objects.create(
        student=student,
        course=course,
    )

    notification = create_notification(
        recipient=student.user,
        title="Course Enrollment",
        message=f"You enrolled in {course.title}",
        category=Notification.Category.COURSE,
        channel=Notification.Channel.EMAIL,
        enqueue=False,
    )

    if notification:
        transaction.on_commit(lambda: deliver_notification.delay(str(notification.id)))

    return enrollment
