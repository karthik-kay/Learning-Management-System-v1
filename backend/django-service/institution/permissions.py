from rest_framework.permissions import BasePermission


INSTITUTION_PERMISSION_MATRIX = {
    "institution_admin": {
        "view_dashboard",
        "manage_people",
        "manage_academic",
        "manage_timetable",
        "manage_attendance",
        "manage_grades",
        "view_reports",
        "view_audit",
        "assign_hod",
    },
    "hod": {
        "view_dashboard",
        "manage_dept_people",
        "manage_dept_academic",
        "manage_dept_timetable",
        "manage_dept_attendance",
        "manage_dept_grades",
        "view_dept_reports",
        "view_dept_audit",
    },
    "faculty": {
        "view_assigned_classes",
        "mark_attendance",
        "manage_assigned_grades",
        "view_assigned_students",
    },
    "trainer": {
        "view_assigned_classes",
        "mark_attendance",
        "assist_grading",
        "upload_resources",
    },
    "student": {
        "view_own_profile",
        "view_own_attendance",
        "view_own_grades",
    },
}


def user_has_institution_permission(user, permission):
    if not user or not user.is_authenticated:
        return False

    return permission in INSTITUTION_PERMISSION_MATRIX.get(user.role, set())


class IsInstitutionMember(BasePermission):
    message = "You must belong to an active institution."

    def has_permission(self, request, view):
        user = request.user
        institution = getattr(user, "institution", None)

        return bool(
            user
            and user.is_authenticated
            and institution
            and getattr(institution, "is_active", False)
        )


class HasAnyInstitutionPermission(BasePermission):
    required_permissions = ()
    message = "You do not have permission to perform this institution action."

    def has_permission(self, request, view):
        return any(
            user_has_institution_permission(request.user, permission)
            for permission in self.required_permissions
        )


class CanManagePeopleScoped(HasAnyInstitutionPermission):
    required_permissions = ("manage_people", "manage_dept_people")


class CanManageAcademicScoped(HasAnyInstitutionPermission):
    required_permissions = ("manage_academic", "manage_dept_academic")


class CanManageTimetableScoped(HasAnyInstitutionPermission):
    required_permissions = ("manage_timetable", "manage_dept_timetable")


class CanManageAttendanceScoped(HasAnyInstitutionPermission):
    required_permissions = ("manage_attendance", "manage_dept_attendance")


class CanManageGradesScoped(HasAnyInstitutionPermission):
    required_permissions = ("manage_grades", "manage_dept_grades")


class CanViewReportsScoped(HasAnyInstitutionPermission):
    required_permissions = ("view_reports", "view_dept_reports")


class CanViewAuditScoped(HasAnyInstitutionPermission):
    required_permissions = ("view_audit", "view_dept_audit")


class CanAssignHOD(HasAnyInstitutionPermission):
    required_permissions = ("assign_hod",)


class IsInstitutionAdminRole(BasePermission):
    message = "Institution admin access required."

    def has_permission(self, request, view):
        return getattr(request.user, "role", None) == "institution_admin"


class IsHODRole(BasePermission):
    message = "HOD access required."

    def has_permission(self, request, view):
        return getattr(request.user, "role", None) == "hod"


class HasInstitutionModule(BasePermission):
    required_module = None
    message = "This module is not enabled for your institution."

    def has_permission(self, request, view):
        institution = getattr(request.user, "institution", None)
        if not institution or not self.required_module:
            return False

        return institution.has_module(self.required_module)
