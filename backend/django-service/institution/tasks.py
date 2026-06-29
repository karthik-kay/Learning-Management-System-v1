import csv
import io

from celery import shared_task
from django.core.files.base import ContentFile
from django.utils import timezone

from institution.audit import log_institution_action
from institution.models import (
    AttendanceRecord,
    FacultyProfile,
    InstitutionExportJob,
    InstitutionStudent,
    SubjectResult,
)
from institution.scoping import scope_faculty_for_user, scope_students_for_user
from notifications.models import Notification
from notifications.services import create_notification


def _write_csv(rows):
    buffer = io.StringIO()
    if not rows:
        return "", 0

    writer = csv.DictWriter(buffer, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue(), len(rows)


def _student_rows(job):
    students = scope_students_for_user(
        InstitutionStudent.objects.select_related(
            "user",
            "department",
            "program",
            "batch",
            "section",
        ),
        job.requested_by,
    )
    filters = job.filters or {}
    if filters.get("department"):
        students = students.filter(department_id=filters["department"])
    if filters.get("status"):
        students = students.filter(status=filters["status"])

    return [
        {
            "name": student.user.get_full_name(),
            "email": student.user.email,
            "enrollment_number": student.enrollment_number,
            "department": student.department.name,
            "program": student.program.name,
            "batch": student.batch.name,
            "section": student.section.name if student.section else "",
            "semester": student.current_semester,
            "status": student.status,
        }
        for student in students
    ]


def _faculty_rows(job):
    faculty = scope_faculty_for_user(
        FacultyProfile.objects.select_related("user", "department"),
        job.requested_by,
    )
    filters = job.filters or {}
    if filters.get("department"):
        faculty = faculty.filter(department_id=filters["department"])
    if filters.get("status"):
        faculty = faculty.filter(status=filters["status"])

    return [
        {
            "name": member.user.get_full_name(),
            "email": member.user.email,
            "employee_id": member.employee_id,
            "department": member.department.name,
            "designation": member.designation,
            "status": member.status,
        }
        for member in faculty
    ]


def _attendance_rows(job):
    students = scope_students_for_user(
        InstitutionStudent.objects.select_related("user", "department", "program", "batch"),
        job.requested_by,
    )
    filters = job.filters or {}
    if filters.get("department"):
        students = students.filter(department_id=filters["department"])
    if filters.get("batch"):
        students = students.filter(batch_id=filters["batch"])

    rows = []
    for student in students:
        records = AttendanceRecord.objects.filter(student=student)
        total = records.count()
        attended = records.filter(status__in=["present", "late"]).count()
        percentage = round((attended / total * 100) if total else 0, 2)
        rows.append(
            {
                "name": student.user.get_full_name(),
                "enrollment_number": student.enrollment_number,
                "department": student.department.name,
                "program": student.program.name,
                "batch": student.batch.name,
                "total_classes": total,
                "attended": attended,
                "attendance_percentage": percentage,
            }
        )
    return rows


def _performance_rows(job):
    students = scope_students_for_user(
        InstitutionStudent.objects.select_related("user", "department", "program"),
        job.requested_by,
    )
    filters = job.filters or {}
    if filters.get("department"):
        students = students.filter(department_id=filters["department"])

    rows = []
    for student in students:
        results = SubjectResult.objects.filter(student=student)
        count = results.count()
        total = sum(result.total_marks for result in results)
        avg = round((total / count) if count else 0, 2)
        rows.append(
            {
                "name": student.user.get_full_name(),
                "enrollment_number": student.enrollment_number,
                "department": student.department.name,
                "program": student.program.name,
                "subjects_count": count,
                "total_marks": round(total, 2),
                "average_marks": avg,
            }
        )
    return rows


EXPORT_BUILDERS = {
    "students": _student_rows,
    "faculty": _faculty_rows,
    "attendance": _attendance_rows,
    "performance": _performance_rows,
    "faculty_activity": _faculty_rows,
    "batch_performance": _performance_rows,
}


@shared_task
def generate_institution_export(export_job_id):
    job = InstitutionExportJob.objects.select_related(
        "institution",
        "requested_by",
    ).get(id=export_job_id)
    job.status = "processing"
    job.started_at = timezone.now()
    job.save(update_fields=["status", "started_at"])

    try:
        builder = EXPORT_BUILDERS[job.report_type]
        csv_content, row_count = _write_csv(builder(job))
        file_name = f"{job.report_type}-{job.id}.csv"
        job.file.save(file_name, ContentFile(csv_content.encode("utf-8")), save=False)
        job.row_count = row_count
        job.status = "completed"
        job.completed_at = timezone.now()
        job.save(update_fields=["file", "row_count", "status", "completed_at"])

        log_institution_action(
            actor=job.requested_by,
            action="export_completed",
            target=job,
            metadata={"report_type": job.report_type, "row_count": row_count},
        )

        create_notification(
            recipient=job.requested_by,
            title="Export ready",
            message=f"Your {job.report_type} export is ready.",
            category=Notification.Category.INSTITUTION,
            channel=Notification.Channel.IN_APP,
            metadata={"export_job_id": job.id, "report_type": job.report_type},
        )
        return {"status": "completed", "rows": row_count}
    except Exception as exc:
        job.status = "failed"
        job.error_message = str(exc)
        job.completed_at = timezone.now()
        job.save(update_fields=["status", "error_message", "completed_at"])
        log_institution_action(
            actor=job.requested_by,
            action="export_failed",
            target=job,
            reason=str(exc),
            metadata={"report_type": job.report_type},
        )
        raise
