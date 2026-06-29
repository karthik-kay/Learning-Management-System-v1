from rest_framework import serializers
from .models import LiveClass

class LiveClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(
        source='teacher.username',
        read_only=True
    )

    class Meta:
        model = LiveClass
        fields = [
            'id',
            'course',
            'teacher',
            'teacher_name',
            'start_time',
            'end_time',
            'status',
            'max_students',
        ]
