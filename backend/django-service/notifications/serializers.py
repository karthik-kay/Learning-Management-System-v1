from rest_framework import serializers

from notifications.models import Notification, NotificationPreference, OTPVerification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "title",
            "message",
            "category",
            "channel",
            "status",
            "is_read",
            "metadata",
            "created_at",
            "read_at",
            "sent_at",
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "in_app_enabled",
            "email_enabled",
            "sms_enabled",
            "whatsapp_enabled",
            "muted_categories",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class OTPSendSerializer(serializers.Serializer):
    channel = serializers.ChoiceField(choices=OTPVerification.Channel.choices)
    purpose = serializers.ChoiceField(choices=OTPVerification.Purpose.choices)
    destination = serializers.CharField(max_length=255)


class OTPVerifySerializer(serializers.Serializer):
    channel = serializers.ChoiceField(choices=OTPVerification.Channel.choices)
    purpose = serializers.ChoiceField(choices=OTPVerification.Purpose.choices)
    destination = serializers.CharField(max_length=255)
    code = serializers.CharField(max_length=12)
