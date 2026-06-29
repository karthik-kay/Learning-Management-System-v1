from rest_framework import serializers

from programs.models import (
    LearningProgram,
    ProgramCourse,
    ProgramEnrollment,
    ProgramFAQ,
    ProgramOutcome,
    ProgramPhase,
    ProgramPrice,
)


class LearningProgramAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningProgram
        fields = "__all__"


class ProgramPhaseAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramPhase
        fields = "__all__"


class ProgramCourseAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramCourse
        fields = "__all__"


class ProgramEnrollmentAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramEnrollment
        fields = "__all__"


class ProgramPriceAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramPrice
        fields = "__all__"


class ProgramOutcomeAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramOutcome
        fields = "__all__"


class ProgramFAQAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramFAQ
        fields = "__all__"
