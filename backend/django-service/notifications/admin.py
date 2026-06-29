from django.contrib import admin

from notifications.models import (
    Notification,
    NotificationDelivery,
    NotificationPreference,
    NotificationTemplate,
    OTPVerification,
    ScheduledNotification,
)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient", "title", "category", "channel", "status", "is_read", "created_at")
    list_filter = ("category", "channel", "status", "is_read", "created_at")
    search_fields = ("recipient__email", "title", "message")
    readonly_fields = ("id", "created_at", "sent_at", "read_at")


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "in_app_enabled", "email_enabled", "sms_enabled", "whatsapp_enabled")
    search_fields = ("user__email", "user__username")


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ("key", "name", "channel", "is_active", "updated_at")
    list_filter = ("channel", "is_active")
    search_fields = ("key", "name", "subject", "body")


@admin.register(NotificationDelivery)
class NotificationDeliveryAdmin(admin.ModelAdmin):
    list_display = ("id", "notification", "channel", "destination", "provider", "status", "attempts", "sent_at")
    list_filter = ("channel", "provider", "status", "created_at")
    search_fields = ("destination", "provider_message_id", "error_message")
    readonly_fields = ("id", "created_at", "updated_at")


@admin.register(ScheduledNotification)
class ScheduledNotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "notification", "scheduled_for", "dispatched_at", "is_cancelled")
    list_filter = ("is_cancelled", "scheduled_for", "dispatched_at")


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ("id", "destination", "channel", "purpose", "status", "attempts", "expires_at", "created_at")
    list_filter = ("channel", "purpose", "status", "created_at")
    search_fields = ("destination", "user__email", "user__username")
    readonly_fields = ("id", "code_hash", "created_at", "verified_at")
