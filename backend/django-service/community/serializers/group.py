from rest_framework import serializers
from community.models import CommunityGroup, GroupMembership
from django.contrib.auth import get_user_model

User = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    class Meta:
        model = CommunityGroup
        fields = [
            "id",
            "name",
            "description",
            "created_by_username",
            "created_at",
        ]


class GroupMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = GroupMembership
        fields = [
            "id",
            "user",
            "username",
            "role",
            "joined_at",
        ]
