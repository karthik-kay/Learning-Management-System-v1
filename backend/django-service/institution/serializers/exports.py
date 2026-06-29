from rest_framework import serializers

from institution.models import InstitutionExportJob


class InstitutionExportJobSerializer(serializers.ModelSerializer):
    requested_by_name = serializers.CharField(
        source="requested_by.get_full_name",
        read_only=True,
    )
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = InstitutionExportJob
        fields = [
            "id",
            "report_type",
            "export_format",
            "filters",
            "status",
            "file",
            "file_url",
            "row_count",
            "error_message",
            "requested_by",
            "requested_by_name",
            "created_at",
            "started_at",
            "completed_at",
        ]
        read_only_fields = [
            "status",
            "file",
            "row_count",
            "error_message",
            "requested_by",
            "created_at",
            "started_at",
            "completed_at",
        ]

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class ExportCreateSerializer(serializers.Serializer):
    report_type = serializers.ChoiceField(choices=InstitutionExportJob.REPORT_CHOICES)
    export_format = serializers.ChoiceField(
        choices=InstitutionExportJob.FORMAT_CHOICES,
        default="csv",
    )
    filters = serializers.JSONField(required=False)
