from rest_framework import serializers

from programs.models import ProgramEnrollment
from programs.serializers.public import PublicLearningProgramListSerializer


class ProgramEnrollmentSerializer(serializers.ModelSerializer):
    program = PublicLearningProgramListSerializer(read_only=True)

    class Meta:
        model = ProgramEnrollment
        fields = [
            "id",
            "program",
            "status",
            "progress",
            "started_at",
            "updated_at",
            "completed_at",
            "expires_at",
        ]
