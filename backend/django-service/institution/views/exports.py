from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from institution.audit import log_institution_action
from institution.models import InstitutionExportJob
from institution.permissions import CanViewReportsScoped, IsInstitutionMember
from institution.scoping import get_user_institution
from institution.serializers.exports import (
    ExportCreateSerializer,
    InstitutionExportJobSerializer,
)
from institution.tasks import generate_institution_export


class ExportPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class InstitutionExportJobListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request):
        jobs = InstitutionExportJob.objects.filter(
            institution=get_user_institution(request.user),
            requested_by=request.user,
        )

        report_type = request.query_params.get("report_type")
        status_filter = request.query_params.get("status")
        if report_type:
            jobs = jobs.filter(report_type=report_type)
        if status_filter:
            jobs = jobs.filter(status=status_filter)

        paginator = ExportPagination()
        page = paginator.paginate_queryset(jobs, request, view=self)
        if page is not None:
            serializer = InstitutionExportJobSerializer(
                page,
                many=True,
                context={"request": request},
            )
            return paginator.get_paginated_response(serializer.data)

        serializer = InstitutionExportJobSerializer(
            jobs,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = ExportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        job = InstitutionExportJob.objects.create(
            institution=get_user_institution(request.user),
            requested_by=request.user,
            report_type=serializer.validated_data["report_type"],
            export_format=serializer.validated_data.get("export_format", "csv"),
            filters=serializer.validated_data.get("filters") or {},
        )

        log_institution_action(
            actor=request.user,
            action="export_requested",
            target=job,
            metadata={
                "report_type": job.report_type,
                "filters": job.filters,
            },
        )

        generate_institution_export.delay(job.id)

        return Response(
            InstitutionExportJobSerializer(job, context={"request": request}).data,
            status=status.HTTP_202_ACCEPTED,
        )


class InstitutionExportJobDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewReportsScoped]

    def get(self, request, export_id):
        job = InstitutionExportJob.objects.filter(
            id=export_id,
            institution=get_user_institution(request.user),
            requested_by=request.user,
        ).first()

        if not job:
            return Response({"error": "Export job not found"}, status=404)

        return Response(
            InstitutionExportJobSerializer(job, context={"request": request}).data
        )
