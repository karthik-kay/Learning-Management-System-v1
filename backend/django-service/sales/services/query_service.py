from sales.models import Lead


def get_visible_leads(user):

    if user.has_role('sales_admin', 'admin'):
        return Lead.objects.all()

    if user.has_role('sales_manager'):
        team_ids = list(user.team_members.values_list('id', flat=True))
        team_ids.append(user.id)
        return Lead.objects.filter(assigned_to__in=team_ids)

    if user.has_role('sales_exec'):
        return Lead.objects.filter(assigned_to=user)

    return Lead.objects.none()