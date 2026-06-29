from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied

from .models import Lead
from .serializers import LeadSerializer
from .permissions import IsSalesUser
from .services.query_service import get_visible_leads
from sales.services.lead_service import convert_lead

class LeadViewSet(viewsets.ModelViewSet):

    serializer_class = LeadSerializer
    permission_classes = [IsSalesUser]

    def get_queryset(self):
        return get_visible_leads(self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def convert(self, request, pk=None):

        lead = self.get_object()

        try:
            student = convert_lead(lead, request.user)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)

        return Response({
            "detail": "Lead converted successfully.",
            "student_id": student.id
        })
        
from .models import LeadFollowUp
from .serializers import LeadFollowUpSerializer


from sales.services.followup_service import create_followup


class LeadFollowUpViewSet(viewsets.ModelViewSet):

    serializer_class = LeadFollowUpSerializer
    permission_classes = [IsSalesUser]

    def get_queryset(self):
        return LeadFollowUp.objects.filter(
            lead__in=get_visible_leads(self.request.user)
        )

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lead = serializer.validated_data['lead']
        note = serializer.validated_data['note']
        next_date = serializer.validated_data.get('next_date')

        try:
            followup = create_followup(
                lead=lead,
                user=request.user,
                note=note,
                next_date=next_date
            )
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=403)

        return Response(
            LeadFollowUpSerializer(followup).data,
            status=201
        )