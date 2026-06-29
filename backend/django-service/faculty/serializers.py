from rest_framework import serializers

from .models import FacultyProfile


class PublicFacultyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyProfile
        fields = [
            "id",
            "display_name",
            "slug",
            "headline",
            "bio",
            "avatar",
            "expertise",
            "linkedin_url",
            "github_url",
            "website_url",
            "years_experience",
        ]
