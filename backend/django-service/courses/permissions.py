from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsFaculty(BasePermission):
    """
    Only faculty can access this endpoint.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == 'faculty'
        )


class IsFacultyOrAdmin(BasePermission):
    """
    Faculty and admins can access.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated and 
            request.user.role in ['faculty', 'admin']
        )
    
class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role == 'student'
        )

class IsQuizOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user
