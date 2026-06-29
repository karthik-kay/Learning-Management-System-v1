import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.db import transaction
from django.utils import timezone

from notifications.models import (
    Notification,
    NotificationDelivery,
    NotificationPreference,
    OTPVerification,
)

User = get_user_model()


def get_preferences(user):
    preferences, _ = NotificationPreference.objects.get_or_create(user=user)
    return preferences


def create_notification(
    *,
    recipient,
    title,
    message,
    category=Notification.Category.SYSTEM,
    channel=Notification.Channel.IN_APP,
    metadata=None,
    enqueue=True,
    respect_preferences=True,
):
    preferences = get_preferences(recipient)
    if respect_preferences and not preferences.allows(channel, category):
        return None

    notification = Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        category=category,
        channel=channel,
        metadata=metadata or {},
    )

    if enqueue and channel != Notification.Channel.IN_APP:
        from notifications.tasks import deliver_notification

        transaction.on_commit(lambda: deliver_notification.delay(str(notification.id)))

    return notification


def create_delivery_for_notification(notification):
    destination = ""
    if notification.channel == Notification.Channel.EMAIL:
        destination = notification.recipient.email or ""
    elif notification.channel in {
        Notification.Channel.SMS,
        Notification.Channel.WHATSAPP,
    }:
        destination = notification.recipient.phone_number or ""

    return NotificationDelivery.objects.create(
        notification=notification,
        channel=notification.channel,
        destination=destination,
    )


def generate_otp_code():
    return f"{random.randint(100000, 999999)}"


def send_otp(*, destination, channel, purpose, user=None):
    code = generate_otp_code()
    expires_at = timezone.now() + timedelta(minutes=10)

    otp = OTPVerification.objects.create(
        user=user,
        channel=channel,
        purpose=purpose,
        destination=destination,
        code_hash=make_password(code),
        expires_at=expires_at,
    )

    from notifications.tasks import deliver_otp

    transaction.on_commit(lambda: deliver_otp.delay(str(otp.id), code))
    return otp


def verify_otp(*, destination, channel, purpose, code):
    otp = (
        OTPVerification.objects.filter(
            destination=destination,
            channel=channel,
            purpose=purpose,
            status=OTPVerification.Status.PENDING,
        )
        .order_by("-created_at")
        .first()
    )

    if not otp:
        return False, "OTP not found or already used."

    if otp.is_expired:
        otp.status = OTPVerification.Status.EXPIRED
        otp.save(update_fields=["status"])
        return False, "OTP expired."

    if otp.attempts >= otp.max_attempts:
        otp.status = OTPVerification.Status.FAILED
        otp.save(update_fields=["status"])
        return False, "Too many attempts."

    otp.attempts += 1

    if not check_password(code, otp.code_hash):
        otp.save(update_fields=["attempts"])
        return False, "Invalid OTP."

    otp.status = OTPVerification.Status.VERIFIED
    otp.verified_at = timezone.now()
    otp.save(update_fields=["attempts", "status", "verified_at"])
    return True, "OTP verified."
