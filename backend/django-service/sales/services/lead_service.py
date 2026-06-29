import uuid
from django.db import transaction
from django.utils import timezone

from sales.models import Lead
from students.models import Student
from courses.models import Enrollment
from users.models import CustomUser


@transaction.atomic
def convert_lead(lead: Lead, acting_user: CustomUser):

    lead = Lead.objects.select_for_update().get(id=lead.id)

    if lead.status == Lead.Status.CONVERTED:
        raise ValueError("Lead already converted.")

    if not acting_user.has_role('sales_exec', 'sales_manager', 'sales_admin', 'admin'):
        raise ValueError("Not allowed to convert lead.")

    if lead.email and CustomUser.objects.filter(email=lead.email).exists():
        raise ValueError("User with this email already exists.")

    username = f"student_{uuid.uuid4().hex[:8]}"

    user = CustomUser.objects.create_user(
        username=username,
        email=lead.email,
        password=CustomUser.objects.make_random_password(),
        role='student'
    )

    student = Student.objects.create(user=user)

    if lead.course_interested:
        Enrollment.objects.create(
            student=student,
            course=lead.course_interested
        )

    lead.status = Lead.Status.CONVERTED
    lead.converted_student = student
    lead.save(update_fields=['status', 'converted_student'])

    return student

def reassign_lead(lead: Lead, new_user: CustomUser, acting_user: CustomUser):

    if not acting_user.has_role('sales_manager', 'sales_admin', 'admin'):
        raise ValueError("Not allowed to reassign lead.")

    if not new_user.has_role('sales_exec', 'sales_manager', 'sales_admin'):
        raise ValueError("Invalid sales role.")

    lead.assigned_to = new_user
    lead.save(update_fields=['assigned_to'])

