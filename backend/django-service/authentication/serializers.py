from rest_framework import serializers
from users.models import CustomUser
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from notifications.models import Notification
from notifications.services import create_notification

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
    
    def validate_email(self,value):
        if not value:
            raise serializers.ValidationError("Email is required")
        return value
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role="student",
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user

class PasswordResetSerializer(serializers.Serializer):
    email=serializers.EmailField()

    def validate_email(self,value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user registered with this email.")
        return value
    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        token = default_token_generator.make_token(user)
        reset_link = (
            f"{settings.FRONTEND_BASE_URL}/resetPassword?token={token}&uid={user.pk}"
        )

        create_notification(
            recipient=user,
            title="Password Reset",
            message=f"Click to reset your password: {reset_link}",
            category=Notification.Category.AUTH,
            channel=Notification.Channel.EMAIL,
            respect_preferences=False,
        )
        return {"message": "Password reset email sent."}

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = CustomUser.objects.get(pk=data['uid'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Invalid or expired token.")

        user.set_password(data['new_password'])
        user.save()
        return {"message": "Password has been reset successfully."}
    
class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "profile_image",
            "phone_number",
            "date_joined",
        ]

    def get_profile_image(self, obj):
        # return absolute URL for frontend
        if obj.profile_image:
            request = self.context.get("request")
            return request.build_absolute_uri(obj.profile_image.url)
        return None

