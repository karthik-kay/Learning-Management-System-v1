from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from institution.models import InstitutionAuditLog
from institution.permissions import CanViewAuditScoped, IsInstitutionMember
from institution.scoping import get_hod_department, get_user_institution, is_hod
from institution.serializers.audit import InstitutionAuditLogSerializer


class AuditLogPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 100


class InstitutionAuditLogListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanViewAuditScoped]

    def get(self, request):
        institution = get_user_institution(request.user)
        logs = InstitutionAuditLog.objects.filter(institution=institution).select_related(
            "actor",
            "department",
        )

        if is_hod(request.user):
            logs = logs.filter(department=get_hod_department(request.user))

        action = request.query_params.get("action")
        actor_id = request.query_params.get("actor")
        target_type = request.query_params.get("target_type")

        if action:
            logs = logs.filter(action=action)
        if actor_id and actor_id.isdigit():
            logs = logs.filter(actor_id=actor_id)
        if target_type:
            logs = logs.filter(target_type=target_type)

        paginator = AuditLogPagination()
        page = paginator.paginate_queryset(logs, request, view=self)
        if page is not None:
            serializer = InstitutionAuditLogSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = InstitutionAuditLogSerializer(logs, many=True)
        return Response(serializer.data)
