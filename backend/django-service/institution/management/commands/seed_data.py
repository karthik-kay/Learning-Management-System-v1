from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from institution.models import (
    Institution, Department, Degree, Program,
    AcademicBatch, Section, Subject,
    FacultyProfile, InstitutionStudent,
    GradeScale
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seed mock data for institution"

    def handle(self, *args, **kwargs):

        # ─────────────────────────────
        # INSTITUTION
        # ─────────────────────────────
        inst, _ = Institution.objects.get_or_create(
            name="Test University",
            attendance_threshold=75
        )

        # ─────────────────────────────
        # DEGREE
        # ─────────────────────────────
        degree = Degree.objects.create(
        name="B.Tech",
        code="BTECH",
        institution=inst,  
        is_active=True
        )

        # ─────────────────────────────
        # DEPARTMENT
        # ─────────────────────────────
        dept = Department.objects.create(
            name="Computer Science",
            code="CSE",
            institution=inst
        )

        # ─────────────────────────────
        # PROGRAM
        # ─────────────────────────────
        program = Program.objects.create(
            name="B.Tech CSE",
            code="CSE2025",
            department=dept,
            degree=degree,
            duration_semesters=8,
            intake_capacity=60
        )

        # ─────────────────────────────
        # BATCH
        # ─────────────────────────────
        batch = AcademicBatch.objects.create(
            name="2025 Batch",
            program=program,
            start_year=2025,
            end_year=2029,
            current_semester=1,
            intake_size=60
        )

        # ─────────────────────────────
        # SECTION
        # ─────────────────────────────
        section = Section.objects.create(
            name="A",
            batch=batch,
            capacity=60
        )

        # ─────────────────────────────
        # SUBJECT
        # ─────────────────────────────
        subject = Subject.objects.create(
            name="Data Structures",
            code="CS101",
            program=program,
            subject_type="core",
            semester=1,
            credits=4
        )

        # ─────────────────────────────
        # FACULTY
        # ─────────────────────────────
        faculty_user = User.objects.create_user(
            username="faculty@test.com",
            email="faculty@test.com",
            password="test123",
            role="faculty",
            institution=inst
        )

        faculty = FacultyProfile.objects.create(
            user=faculty_user,
            institution=inst,
            department=dept,
            employee_id="EMP001",
            designation="Assistant Professor"
        )

        # ─────────────────────────────
        # STUDENTS
        # ─────────────────────────────
        for i in range(10):
            user = User.objects.create_user(
                username=f"student{i}@test.com",
                email=f"student{i}@test.com",
                password="test123",
                role="student",
                institution=inst
            )

            InstitutionStudent.objects.create(
                user=user,
                institution=inst,
                department=dept,
                program=program,
                batch=batch,
                section=section,
                enrollment_number=f"ENR{i}",
                current_semester=1
            )

        # ─────────────────────────────
        # GRADE SCALE
        # ─────────────────────────────
        grades = [
            (90, 100, "A+", 10),
            (80, 89, "A", 9),
            (70, 79, "B+", 8),
            (60, 69, "B", 7),
            (50, 59, "C", 6),
            (40, 49, "D", 5),
            (0, 39, "F", 0),
        ]

        for min_m, max_m, grade, gp in grades:
            GradeScale.objects.create(
                institution=inst,
                min_marks=min_m,
                max_marks=max_m,
                grade=grade,
                grade_point=gp
            )

        self.stdout.write(self.style.SUCCESS("Mock data created successfully!"))