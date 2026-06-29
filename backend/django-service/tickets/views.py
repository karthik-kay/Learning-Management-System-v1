from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Ticket, TicketMessage
from .serializers import TicketSerializer, TicketMessageSerializer


class TicketViewSet(ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.has_role('admin'):
            return Ticket.objects.all().order_by('-created_at')

        if user.has_role('student'):
            return Ticket.objects.filter(created_by=user).order_by('-created_at')

        if user.has_role('faculty', 'trainer'):
            return Ticket.objects.filter(
                Q(assigned_to_role='faculty') | Q(created_by=user)
            ).order_by('-created_at')

        if user.has_role('sales_exec', 'sales_manager', 'sales_admin'):
            return Ticket.objects.filter(
                Q(assigned_to_role='sales') | Q(created_by=user)
            ).order_by('-created_at')

        return Ticket.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        ticket_type = serializer.validated_data.get("type")

        if ticket_type == "support":
            assigned = "faculty"
        elif ticket_type == "sales":
            assigned = "sales"
        else:
            assigned = "admin"

        serializer.save(created_by=user, assigned_to_role=assigned)


class TicketMessageViewSet(ModelViewSet):
    serializer_class = TicketMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ticket_id = self.request.query_params.get('ticket')
        return TicketMessage.objects.filter(
            ticket_id=ticket_id,
            parent=None
        ).order_by('created_at')

    def perform_create(self, serializer):
        user = self.request.user

        if user.has_role('student'):
            sender_type = 'student'
        elif user.has_role('faculty', 'trainer'):
            sender_type = 'faculty'
        elif user.has_role('sales_exec', 'sales_manager', 'sales_admin'):
            sender_type = 'sales'
        elif user.has_role('admin'):
            sender_type = 'admin'
        else:
            sender_type = 'staff'

        serializer.save(sender=user, sender_type=sender_type)