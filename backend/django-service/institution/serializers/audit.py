from rest_framework import serializers

from institution.models import InstitutionAuditLog


class InstitutionAuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.get_full_name", read_only=True)
    actor_email = serializers.EmailField(source="actor.email", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = InstitutionAuditLog
        fields = [
            "id",
            "action",
            "actor",
            "actor_name",
            "actor_email",
            "department",
            "department_name",
            "target_type",
            "target_id",
            "reason",
            "metadata",
            "created_at",
        ]
