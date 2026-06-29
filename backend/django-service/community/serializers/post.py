from rest_framework import serializers
from community.models import CommunityPost, PostLike


class CommunityPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(
        source="author.username",
        read_only=True
    )

    author_avatar = serializers.ImageField(
        source="author.profile_image",
        read_only=True
    )

    group_name = serializers.CharField(
        source="group.name",
        read_only=True
    )

    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = [
            "id",
            "author_username",
            "author_avatar",
            "group",
            "group_name",
            "content",
            "image",
            "created_at",
            "likes_count",
            "liked_by_me",
        ]

    def get_likes_count(self, obj):
        return PostLike.objects.filter(post=obj).count()

    def get_liked_by_me(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return PostLike.objects.filter(
                post=obj,
                user=request.user
            ).exists()
        return False


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ["content", "image", "group"]

    def create(self, validated_data):
        request = self.context["request"]
        return CommunityPost.objects.create(
            author=request.user,
            **validated_data
        )
