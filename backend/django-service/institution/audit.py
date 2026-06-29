def log_institution_action(
    *,
    actor,
    action,
    target,
    reason="",
    metadata=None,
):
    from institution.models import InstitutionAuditLog

    institution = getattr(actor, "institution", None)
    department = getattr(target, "department", None)

    if department is None and getattr(actor, "role", None) == "hod":
        faculty_profile = getattr(actor, "faculty_profile", None)
        department = getattr(faculty_profile, "department", None)

    if institution is None:
        return None

    return InstitutionAuditLog.objects.create(
        institution=institution,
        department=department,
        actor=actor,
        action=action,
        target_type=target.__class__.__name__,
        target_id=str(target.pk),
        reason=reason or "",
        metadata=metadata or {},
    )
