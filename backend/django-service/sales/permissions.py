from rest_framework.permissions import BasePermission

SALES_EXEC_ROLES = ['sales_exec', 'sales_manager', 'sales_admin', 'admin']
SALES_MANAGER_ROLES = ['sales_manager', 'sales_admin', 'admin']
SALES_ADMIN_ROLES = ['sales_admin', 'admin']


def is_sales_user(user):
    return user.has_role(*SALES_EXEC_ROLES)

def can_view_assigned_leads(user):
    return user.has_role(*SALES_EXEC_ROLES)

def can_view_team_leads(user):
    return user.has_role(*SALES_MANAGER_ROLES)

def can_reassign_leads(user):
    return user.has_role(*SALES_MANAGER_ROLES)

def can_convert_lead(user):
    return user.has_role(*SALES_EXEC_ROLES)

def can_delete_lead(user):
    return user.has_role(*SALES_ADMIN_ROLES)

def can_bulk_upload(user):
    return user.has_role(*SALES_ADMIN_ROLES)

def can_manage_targets(user):
    return user.has_role(*SALES_ADMIN_ROLES)

def can_view_reports(user):
    return user.has_role(*SALES_MANAGER_ROLES)

class IsSalesUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.has_role(
            'sales_exec', 'sales_manager', 'sales_admin', 'admin'
        )