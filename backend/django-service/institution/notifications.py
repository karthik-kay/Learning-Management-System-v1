from notifications.models import Notification
from notifications.services import create_notification


def notify_user(user, *, title, message, category=Notification.Category.INSTITUTION, metadata=None):
    if not user:
        return None

    return create_notification(
        recipient=user,
        title=title,
        message=message,
        category=category,
        channel=Notification.Channel.IN_APP,
        metadata=metadata or {},
    )


def notify_institution_admin(institution, *, title, message, metadata=None):
    return notify_user(
        institution.admin,
        title=title,
        message=message,
        metadata=metadata,
    )
