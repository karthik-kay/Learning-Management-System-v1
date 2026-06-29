from rest_framework import serializers
from .models import Lead, LeadFollowUp


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = (
            'created_by',
            'created_at',
            'updated_at',
            'converted_student',
        )

class LeadFollowUpSerializer(serializers.ModelSerializer):

    class Meta:
        model = LeadFollowUp
        fields = '__all__'
        read_only_fields = (
            'created_by',
            'created_at',
        )