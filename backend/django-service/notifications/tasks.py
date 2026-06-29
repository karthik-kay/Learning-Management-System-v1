from celery import shared_task
from django.utils import timezone

from notifications.models import (
    Notification,
    NotificationDelivery,
    OTPVerification,
    ScheduledNotification,
)
from notifications.providers import ProviderError, email_provider, msg91_provider
from notifications.services import create_delivery_for_notification


@shared_task(bind=True, autoretry_for=(ProviderError,), retry_backoff=True, max_retries=3)
def deliver_notification(self, notification_id):
    notification = Notification.objects.select_related("recipient").get(id=notification_id)

    if notification.channel == Notification.Channel.IN_APP:
        notification.status = Notification.Status.SENT
        notification.sent_at = timezone.now()
        notification.save(update_fields=["status", "sent_at"])
        return {"status": "in_app_saved"}

    delivery = create_delivery_for_notification(notification)
    delivery.attempts += 1

    try:
        if notification.channel == Notification.Channel.EMAIL:
            result = email_provider.send(
                destination=delivery.destination,
                subject=notification.title,
                message=notification.message,
            )
            delivery.provider = email_provider.provider_name
        else:
            raise ProviderError(f"Unsupported notification channel: {notification.channel}")

        delivery.provider_message_id = result.get("provider_message_id", "")
        delivery.status = NotificationDelivery.Status.SENT
        delivery.sent_at = timezone.now()
        notification.status = Notification.Status.SENT
        notification.sent_at = delivery.sent_at
    except Exception as exc:
        delivery.status = NotificationDelivery.Status.FAILED
        delivery.error_message = str(exc)
        notification.status = Notification.Status.FAILED
        delivery.save()
        notification.save(update_fields=["status"])
        raise

    delivery.save()
    notification.save(update_fields=["status", "sent_at"])
    return {"status": "sent", "notification_id": str(notification.id)}


@shared_task(bind=True, autoretry_for=(ProviderError,), retry_backoff=True, max_retries=3)
def deliver_otp(self, otp_id, code):
    otp = OTPVerification.objects.select_related("user").get(id=otp_id)

    if otp.status != OTPVerification.Status.PENDING or otp.is_expired:
        return {"status": "skipped"}

    if otp.channel == OTPVerification.Channel.EMAIL:
        email_provider.send(
            destination=otp.destination,
            subject="Your LearnerSlate verification code",
            message=f"Your verification code is {code}. It expires in 10 minutes.",
        )
        return {"status": "email_sent"}

    if otp.channel == OTPVerification.Channel.PHONE:
        msg91_provider.send_sms_otp(phone=otp.destination, otp=code)
        return {"status": "sms_sent"}

    raise ProviderError(f"Unsupported OTP channel: {otp.channel}")


@shared_task
def dispatch_due_scheduled_notifications():
    now = timezone.now()
    schedules = ScheduledNotification.objects.filter(
        scheduled_for__lte=now,
        dispatched_at__isnull=True,
        is_cancelled=False,
    ).select_related("notification")

    dispatched = 0
    for schedule in schedules:
        deliver_notification.delay(str(schedule.notification_id))
        schedule.dispatched_at = now
        schedule.save(update_fields=["dispatched_at"])
        dispatched += 1

    return {"dispatched": dispatched}


@shared_task
def expire_old_otps():
    updated = OTPVerification.objects.filter(
        status=OTPVerification.Status.PENDING,
        expires_at__lt=timezone.now(),
    ).update(status=OTPVerification.Status.EXPIRED)
    return {"expired": updated}
