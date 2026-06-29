import logging

import requests
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


class ProviderError(Exception):
    pass


class EmailProvider:
    provider_name = "django-email"

    def send(self, *, destination, subject, message):
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[destination],
            fail_silently=False,
        )
        return {"provider_message_id": ""}


class MSG91Provider:
    provider_name = "msg91"

    def __init__(self):
        self.auth_key = settings.MSG91_AUTH_KEY
        self.template_id = settings.MSG91_OTP_TEMPLATE_ID
        self.sender_id = settings.MSG91_SENDER_ID
        self.base_url = settings.MSG91_BASE_URL.rstrip("/")

    def send_sms_otp(self, *, phone, otp):
        if not self.auth_key or not self.template_id:
            logger.warning("MSG91 OTP credentials missing. Skipping SMS send.")
            return {"provider_message_id": "", "skipped": True}

        response = requests.post(
            f"{self.base_url}/otp",
            headers={"authkey": self.auth_key},
            json={
                "template_id": self.template_id,
                "mobile": phone,
                "otp": otp,
                "sender": self.sender_id,
            },
            timeout=10,
        )

        if response.status_code >= 400:
            raise ProviderError(response.text)

        data = response.json()
        return {"provider_message_id": str(data.get("request_id", ""))}


email_provider = EmailProvider()
msg91_provider = MSG91Provider()
