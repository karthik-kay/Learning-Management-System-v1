from rest_framework.exceptions import PermissionDenied


def get_user_institution(user):
    institution = getattr(user, "institution", None)

    if not institution:
        raise PermissionDenied("User is not attached to an institution.")

    if not institution.is_active:
        raise PermissionDenied("Institution is not active.")

    return institution


def get_hod_department(user):
    faculty_profile = getattr(user, "faculty_profile", None)

    if not faculty_profile:
        raise PermissionDenied("HOD profile not found.")

    return faculty_profile.department


def is_institution_admin(user):
    return getattr(user, "role", None) == "institution_admin"


def is_hod(user):
    return getattr(user, "role", None) == "hod"


def ensure_department_allowed(user, department):
    institution = get_user_institution(user)

    if department.institution_id != institution.id:
        raise PermissionDenied("Department does not belong to your institution.")

    if is_hod(user) and department.id != get_hod_department(user).id:
        raise PermissionDenied("HOD access is restricted to their department.")

    return department


def scope_departments_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(institution=institution)

    if is_hod(user):
        queryset = queryset.filter(id=get_hod_department(user).id)
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution departments.")

    return queryset


def scope_faculty_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(institution=institution)

    if is_hod(user):
        queryset = queryset.filter(department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution faculty.")

    return queryset


def scope_students_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(institution=institution)

    if is_hod(user):
        queryset = queryset.filter(department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution students.")

    return queryset


def scope_programs_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(department__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution programs.")

    return queryset


def scope_batches_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(program__department__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(program__department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution batches.")

    return queryset


def scope_sections_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(batch__program__department__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(batch__program__department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution sections.")

    return queryset


def scope_subjects_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(program__department__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(program__department=get_hod_department(user))
    elif not is_institution_admin(user):
        raise PermissionDenied("You cannot access institution subjects.")

    return queryset


def scope_timetable_entries_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(assignment__faculty__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(section__batch__program__department=get_hod_department(user))
    elif not is_institution_admin(user):
        faculty_profile = getattr(user, "faculty_profile", None)
        if not faculty_profile:
            raise PermissionDenied("You cannot access timetable entries.")
        queryset = queryset.filter(assignment__faculty=faculty_profile)

    return queryset


def scope_attendance_sessions_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(timetable_entry__assignment__faculty__institution=institution)

    if is_hod(user):
        queryset = queryset.filter(
            timetable_entry__section__batch__program__department=get_hod_department(user)
        )
    elif not is_institution_admin(user):
        faculty_profile = getattr(user, "faculty_profile", None)
        if not faculty_profile:
            raise PermissionDenied("You cannot access attendance sessions.")
        queryset = queryset.filter(conducted_by=faculty_profile)

    return queryset


def scope_attendance_records_for_user(queryset, user):
    institution = get_user_institution(user)
    queryset = queryset.filter(
        session__timetable_entry__assignment__faculty__institution=institution
    )

    if is_hod(user):
        queryset = queryset.filter(student__department=get_hod_department(user))
    elif not is_institution_admin(user):
        faculty_profile = getattr(user, "faculty_profile", None)
        if not faculty_profile:
            raise PermissionDenied("You cannot access attendance records.")
        queryset = queryset.filter(session__conducted_by=faculty_profile)

    return queryset


def assert_queryset_access(queryset, user):
    if not queryset.exists():
        raise PermissionDenied("You cannot access this institution object.")

    return True
