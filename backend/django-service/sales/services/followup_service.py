from django.core.exceptions import PermissionDenied
from sales.models import LeadFollowUp
from sales.services.query_service import get_visible_leads


def create_followup(lead, user, note, next_date=None):

    if not get_visible_leads(user).filter(id=lead.id).exists():
        raise PermissionDenied("Cannot add followup to this lead.")

    return LeadFollowUp.objects.create(
        lead=lead,
        note=note,
        next_date=next_date,
        created_by=user
    )