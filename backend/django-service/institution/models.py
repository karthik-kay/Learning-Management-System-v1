import uuid
from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.db.models import Sum
from django.core.validators import MinValueValidator, MaxValueValidator  # ← you missed this import
from django.core.exceptions import ValidationError


def default_modules():
    return {
        "live_classes": False,
        "community": False,
        "bounties": False,
        "ide": False,
        "attendance": True,
        "assessments": True,
        "placements": False,
        "analytics": False,
    }


class Institution(models.Model):
    TIER_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('offboarded', 'Offboarded'),
    ]

    name = models.CharField(max_length=200)

    slug = models.SlugField(unique=True, blank=True)
    email = models.EmailField(blank=True, null=True)

    logo = models.URLField(blank=True, null=True)
    primary_contact = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    admin = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.SET_NULL,
        null=True,
        related_name='administered_institutions',
        limit_choices_to={'role': 'institution_admin'},
        db_index=True
    )

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )

    tier = models.CharField(max_length=10, choices=TIER_CHOICES, default='basic')

    seat_limit = models.IntegerField(
        default=500,
        validators=[MinValueValidator(1)]
    )

    attendance_threshold = models.IntegerField(
        default=75,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    modules_config = models.JSONField(default=default_modules)

    mou_reference = models.CharField(max_length=200, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # SLUG GENERATION
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            unique_slug = base_slug

            while Institution.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

            self.slug = unique_slug

        super().save(*args, **kwargs)

    # FEATURE CHECK
    def has_module(self, key):
        return self.modules_config.get(key, False)

    @property
    def is_active(self):
        return self.status == 'active'

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


# Dept model

class Department(models.Model):
    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.CASCADE,
        related_name='departments'
    )

    name = models.CharField(max_length=200)   # e.g. Computer Science
    code = models.CharField(max_length=20)    # e.g. CSE, ECE

    hod = models.ForeignKey(
        'institution.FacultyProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments',
    )

    description = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def active_program_count(self):
        return self.programs.filter(is_active=True).count()

    @property
    def active_faculty_count(self):
        return self.faculty.filter(status='active').count()

    @property
    def active_student_count(self):
        return self.students.filter(status='active').count()

    class Meta:
        unique_together = ['institution', 'code']
        ordering = ['name']

    def __str__(self):
        return f"{self.code} - {self.name}"


#Degree model

class Degree(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=20)

    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.CASCADE,
        related_name='degrees'
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['institution', 'code']
        ordering = ['name']

    def __str__(self):
        return f"{self.code} ({self.name})"

# Program model

class Program(models.Model):
    
    department = models.ForeignKey(
        'institution.Department',
        on_delete=models.CASCADE,
        related_name='programs'
    )

    name = models.CharField(max_length=200)   # e.g. B.Tech Artificial Intelligence
    code = models.CharField(max_length=20)    
    degree = models.ForeignKey(
        'institution.Degree',
        on_delete=models.PROTECT,
        related_name='programs',
        db_index=True
        )
        
    duration_semesters = models.PositiveIntegerField(default=8)

    intake_capacity = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['department', 'code']
        ordering = ['name']

    def clean(self):
        if self.degree.institution and self.degree.institution != self.department.institution:
            raise ValidationError(
                "Degree does not belong to the same institution as department"
            )
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        if self.degree:
            return f"{self.degree.code} - {self.name}"
        return f"{self.code} - {self.name}"





#subject

class Subject(models.Model):

    SUBJECT_TYPE_CHOICES = [
    ('theory', 'Theory'),
    ('lab',    'Lab'),
    ('project','Project'),
    ]

    program = models.ForeignKey(
        'institution.Program',
        on_delete=models.CASCADE,
        related_name='subjects'
    )


    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20,db_index=True)

    subject_type = models.CharField(
    max_length=10,
    choices=SUBJECT_TYPE_CHOICES,
    default='theory'
    )

    semester = models.PositiveIntegerField()

    credits = models.PositiveIntegerField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['program', 'code']
        ordering = ['semester', 'name']

    def clean(self):
        #Validate semester against program duration
        if self.semester < 1:
            raise ValidationError("Semester must be at least 1")

        if self.semester > self.program.duration_semesters:
            raise ValidationError(
                f"Semester cannot exceed {self.program.duration_semesters} for this program"
            )
    

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (Sem {self.semester})"



# class ProgramOutcome(models.Model):
#     program = models.ForeignKey(
#         'institution.Program',
#         on_delete=models.CASCADE,
#         related_name='program_outcomes'
#     )

#     code = models.CharField(max_length=10)  # PO1, PO2, etc.
#     description = models.TextField()

#     def __str__(self):
#         return f"{self.code} - {self.program.name}"


# class CourseOutcome(models.Model):
#     subject = models.ForeignKey(
#         'Subject',
#         on_delete=models.CASCADE,
#         related_name='course_outcomes'
#     )

#     code = models.CharField(max_length=10)  # CO1, CO2
#     description = models.TextField()

#     target_level = models.FloatField()

#     def __str__(self):
#         return f"{self.code} - {self.subject.name}"

# class COPOMapping(models.Model):
#     course_outcome = models.ForeignKey(
#         'CourseOutcome',
#         on_delete=models.CASCADE,
#         related_name='po_mappings'
#     )

#     program_outcome = models.ForeignKey(
#         'ProgramOutcome',
#         on_delete=models.CASCADE,
#         related_name='co_mappings'
#     )

#     weightage = models.FloatField()

#     # NAAC usually uses 1–3 scale
#     strength = models.PositiveIntegerField(
#         choices=[
#             (1, 'Low'),
#             (2, 'Medium'),
#             (3, 'High')
#         ]
#     )

#     class Meta:
#         unique_together = ['course_outcome', 'program_outcome']

#     def __str__(self):
#         return f"{self.course_outcome.code} → {self.program_outcome.code} ({self.strength})"

# class COAttainment(models.Model):
#     course_outcome = models.ForeignKey('CourseOutcome', on_delete=models.CASCADE)
#     attainment_level = models.FloatField()
#     academic_year = models.CharField(max_length=10)



#Academic Batch Model

class AcademicBatch(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    program = models.ForeignKey(
        'institution.Program',
        on_delete=models.CASCADE,
        related_name='batches'
    )

    name = models.CharField(max_length=100)

    start_year = models.PositiveIntegerField()
    end_year = models.PositiveIntegerField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='upcoming',
        db_index=True
    )

    intake_size = models.PositiveIntegerField(null=True, blank=True)

    current_semester = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['program', 'start_year']
        ordering = ['-start_year']

    def clean(self):
        # Year validation
        if self.start_year >= self.end_year:
            raise ValidationError("End year must be greater than start year")

        # Dynamic Semester validation
        if self.current_semester:
            if self.current_semester < 1:
                raise ValidationError("Semester must be at least 1")

            if self.current_semester > self.program.duration_semesters:
                raise ValidationError(
                    f"Semester cannot exceed {self.program.duration_semesters} for this program"
                )
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.program.name} ({self.start_year}-{self.end_year})"


# Section Model

class Section(models.Model):
    batch = models.ForeignKey(
        'institution.AcademicBatch',
        on_delete=models.CASCADE,
        related_name='sections'
    )

    name = models.CharField(max_length=10)  # A, B, C

    class_teacher = models.ForeignKey(
        'institution.FacultyProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='class_teacher_sections',
    )

    capacity = models.PositiveIntegerField(null=True, blank=True,validators=[MinValueValidator(1)])

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['batch', 'name']
        ordering = ['name']

    def __str__(self):
        return f"{self.batch} - Section {self.name}"



#Institution student

class InstitutionStudent(models.Model):
    STATUS_CHOICES = [
        ('active',      'Active'),
        ('detained',    'Detained'),
        ('passed_out',  'Passed Out'),
        ('dropped',     'Dropped'),
        ('suspended',   'Suspended'),
    ]

    user = models.OneToOneField(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='institution_student'
    )

    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.CASCADE,
        related_name='students',
        db_index=True
    )

    department = models.ForeignKey(
        'institution.Department',
        on_delete=models.PROTECT,
        related_name='students',
        db_index=True
    )

    program = models.ForeignKey(
        'institution.Program',
        on_delete=models.PROTECT,
        related_name='students',
        db_index=True
    )

    batch = models.ForeignKey(
        'institution.AcademicBatch',
        on_delete=models.PROTECT,
        related_name='students',
        db_index=True
    )

    section = models.ForeignKey(
        'institution.Section',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students',
        db_index=True
    )

    #Core fields
    enrollment_number = models.CharField(
        max_length=50,
        db_index=True   #removed unique=True, kept indexed
    )

    current_semester = models.PositiveIntegerField(default=1)

    admission_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['institution', 'enrollment_number']  
        ordering = ['enrollment_number']

    def clean(self):
        #Hierarchy validation
        if self.department.institution != self.institution:
            raise ValidationError("Department does not belong to this institution")

        if self.program.department != self.department:
            raise ValidationError("Program does not belong to the selected department")

        if self.batch.program != self.program:
            raise ValidationError("Batch does not belong to the selected program")

        if self.section:
            if self.section.batch != self.batch:
                raise ValidationError("Section does not belong to the selected batch")

        #Semester validation
        if self.current_semester < 1:
            raise ValidationError("Semester must be at least 1")

        if self.current_semester > self.program.duration_semesters:
            raise ValidationError(
                f"Semester cannot exceed {self.program.duration_semesters} for this program"
            )

    def save(self, *args, **kwargs):
        self.clean()  #validation on save
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.enrollment_number} — {self.user.get_full_name()}"


#Faculty for institution

class FacultyProfile(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
    ]

    user = models.OneToOneField(
        'users.CustomUser',
        on_delete=models.CASCADE,
        related_name='faculty_profile'
    )

    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.CASCADE,
        related_name='faculty',
        db_index=True
    )

    department = models.ForeignKey(
        'institution.Department',
        on_delete=models.PROTECT,
        related_name='faculty',
        db_index=True
    )

    employee_id = models.CharField(
        max_length=50,
        db_index=True
    )

    designation = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    joining_date = models.DateField(null=True, blank=True)

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['institution', 'employee_id']
        ordering = ['user__username']

    def clean(self):
        # Ensure department belongs to institution
        if self.department.institution != self.institution:
            raise ValidationError("Department does not belong to this institution")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.get_full_name()} ({self.employee_id})"


class FacultySubjectAssignment(models.Model):
    faculty = models.ForeignKey(
        'institution.FacultyProfile',
        on_delete=models.CASCADE,
        related_name='subject_assignments'
    )

    subject = models.ForeignKey(
        'institution.Subject',
        on_delete=models.CASCADE,
        related_name='faculty_assignments'
    )
    
    
    role = models.CharField(
        max_length=10,
        choices=[
            ('theory', 'Theory'),
            ('lab', 'Lab'),
        ],
        default='theory'
    )

    section = models.ForeignKey(
        'institution.Section',
        on_delete=models.CASCADE,
        related_name='subject_assignments'
    )

    batch = models.ForeignKey(
        'institution.AcademicBatch',
        on_delete=models.CASCADE,
        related_name='subject_assignments'
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['faculty', 'subject', 'section', 'batch', 'role']
        ordering = ['subject__semester']

    def clean(self):
        #Ensure hierarchy consistency

        # Institution consistency
        if self.faculty.institution != self.section.batch.program.department.institution:
            raise ValidationError("Faculty and section belong to different institutions")

        #Section to Batch
        if self.section.batch != self.batch:
            raise ValidationError("Section does not belong to the selected batch")

        # Batch to Program  to Subject
        if self.batch.program != self.subject.program:
            raise ValidationError("Subject does not belong to the batch's program")

        # Faculty to Department to  Program
        if self.subject.program.department != self.faculty.department:
            raise ValidationError("Faculty department mismatch with subject")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.faculty.user.get_full_name()} → {self.subject.name} ({self.section})"


#Time slot

class TimeSlot(models.Model):
    DAY_CHOICES = [
        ('mon','Monday'),
        ('tue','Tuesday'),
        ('wed','Wednesday'),
        ('thu','Thursday'),
        ('fri','Friday'),
        ('sat','Saturday'),
        ('sun','Sunday'),
    ]

    day = models.CharField(max_length=10, choices=DAY_CHOICES)

    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    is_break = models.BooleanField(default=False)

    class Meta:
        ordering = ['day', 'start_time']

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.day} {self.start_time}-{self.end_time}"


# TIme table Entry

class TimetableEntry(models.Model):
    assignment = models.ForeignKey(
        'institution.FacultySubjectAssignment',
        on_delete=models.CASCADE,
        related_name='timetable_entries'
    )

    section = models.ForeignKey(
        'institution.Section',
        on_delete=models.CASCADE,
        related_name='timetable_entries'
    )

    timeslot = models.ForeignKey(
        'institution.TimeSlot',
        on_delete=models.CASCADE
    )

    room = models.CharField(max_length=50, null=True, blank=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['section', 'timeslot']
        ordering = ['timeslot__day', 'timeslot__start_time']

    def clean(self):
        # Section mismatch protection
        if self.assignment.section != self.section:
            raise ValidationError("Assignment does not belong to this section")

        # Faculty clash
        if TimetableEntry.objects.filter(
            assignment__faculty=self.assignment.faculty,
            timeslot=self.timeslot
        ).exclude(id=self.id).exists():
            raise ValidationError("Faculty already has a class at this time")

        # Break slot protection
        if self.timeslot.is_break:
            raise ValidationError("Cannot assign class to a break slot")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.section} - {self.timeslot}"

class AttendanceSession(models.Model):
    timetable_entry = models.ForeignKey(
        'institution.TimetableEntry',
        on_delete=models.CASCADE,
        related_name='sessions'
    )

    date = models.DateField()

    conducted_by = models.ForeignKey(
        'institution.FacultyProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    topic = models.CharField(max_length=255, null=True, blank=True)

    is_cancelled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['timetable_entry', 'date']
        ordering = ['-date']

    def clean(self):
        # Optional: prevent marking future sessions
        # if self.date > timezone.now().date():
        #     raise ValidationError("Cannot create attendance for future date")

        # Ensure faculty belongs to assignment
        if self.conducted_by:
            if self.conducted_by != self.timetable_entry.assignment.faculty:
                raise ValidationError("Faculty mismatch with timetable assignment")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.timetable_entry} on {self.date}"


# Attendance Record

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]

    session = models.ForeignKey(
        'institution.AttendanceSession',
        on_delete=models.CASCADE,
        related_name='records'
    )

    student = models.ForeignKey(
        'institution.InstitutionStudent',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES
    )

    remarks = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        unique_together = ['session', 'student']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['session']),
        ]

    def clean(self):
        # Ensure student belongs to the section of this session
        if self.student.section != self.session.timetable_entry.section:
            raise ValidationError("Student does not belong to this section")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.status}"


class LeaveApplication(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("cancelled", "Cancelled"),
    ]

    institution = models.ForeignKey(
        "institution.Institution",
        on_delete=models.CASCADE,
        related_name="leave_applications",
    )
    student = models.ForeignKey(
        "institution.InstitutionStudent",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="leave_applications",
    )
    faculty = models.ForeignKey(
        "institution.FacultyProfile",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="leave_applications",
    )
    from_date = models.DateField()
    to_date = models.DateField()
    reason = models.TextField()
    document_url = models.URLField(blank=True)
    attachment = models.FileField(
        upload_to="institution/leave_documents/%Y/%m/",
        blank=True,
        null=True,
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        db_index=True,
    )
    reviewed_by = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_leave_applications",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["institution", "status"]),
            models.Index(fields=["student", "from_date", "to_date"]),
        ]

    def clean(self):
        if self.from_date > self.to_date:
            raise ValidationError("Leave start date cannot be after end date")

        if bool(self.student_id) == bool(self.faculty_id):
            raise ValidationError("Choose exactly one leave applicant")

        applicant = self.student if self.student_id else self.faculty
        if applicant and self.institution_id:
            if applicant.institution_id != self.institution_id:
                raise ValidationError("Applicant does not belong to this institution")

    def save(self, *args, **kwargs):
        if not self.institution_id:
            applicant = self.student if self.student_id else self.faculty
            if applicant:
                self.institution = applicant.institution
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        applicant = self.student or self.faculty
        return f"{applicant} leave {self.from_date} to {self.to_date}"



# Academic domain


class EvaluationComponent(models.Model):
    COMPONENT_TYPE_CHOICES = [
        ('assignment', 'Assignment'),
        ('lab', 'Lab'),
        ('quiz', 'Quiz'),
        ('midsem', 'Mid Semester'),
        ('project', 'Project'),
        ('attendance', 'Attendance'),
    ]

    subject = models.ForeignKey('institution.Subject', on_delete=models.CASCADE, related_name='components')
    
    batch = models.ForeignKey(
    'institution.AcademicBatch',
    on_delete=models.CASCADE,
    related_name='evaluation_components'
    )
    
    section = models.ForeignKey(
    'institution.Section',
    on_delete=models.CASCADE,
    null=True,
    blank=True
    )

    semester = models.PositiveIntegerField(null=True, blank=True)

    name = models.CharField(max_length=100)
    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPE_CHOICES)

    max_marks = models.FloatField()
    weightage = models.FloatField()  # % contribution

    is_internal = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.subject.program != self.batch.program:
            raise ValidationError("Subject does not belong to this batch program")
        
        #weightage validation

        total = EvaluationComponent.objects.filter(
        subject=self.subject,
        batch=self.batch
        ).exclude(id=self.id).aggregate(Sum('weightage'))['weightage__sum'] or 0

        if total + self.weightage > 100:
            raise ValidationError("Total weightage cannot exceed 100%")
    def save(self,*args,**kwargs):
        self.clean()
        super().save( *args, **kwargs)


class StudentComponentScore(models.Model):
    component = models.ForeignKey(
        'institution.EvaluationComponent',
        on_delete=models.CASCADE,
        related_name='scores'
    )

    student = models.ForeignKey(
        'institution.InstitutionStudent',
        on_delete=models.CASCADE,
        related_name='component_scores'
    )

    marks_obtained = models.FloatField()
    is_absent = models.BooleanField(default=False)

    class Meta:
        unique_together = ['component', 'student']
        indexes = [
        models.Index(fields=['student']),
        models.Index(fields=['component']),
        ]

    def clean(self):
        # Student must belong to same program
        if self.student.program != self.component.subject.program:
            raise ValidationError("Student does not belong to this subject program")

        # Student must belong to same batch
        if self.student.batch != self.component.batch:
            raise ValidationError("Student does not belong to this batch")
        
        # marks <= component.max_marks and marks >= 0
        if self.marks_obtained < 0:
            raise ValidationError("Marks cannot be negative")

        if (self.marks_obtained > self.component.max_marks):
            raise ValidationError("Marks exceed max marks")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Exam(models.Model):
    EXAM_TYPE_CHOICES = [
        ('midterm', 'Midterm'),
        ('final', 'Final'),
    ]

    name = models.CharField(max_length=100)

    batch = models.ForeignKey(
        'institution.AcademicBatch',
        on_delete=models.CASCADE,
        related_name='exams'
    )

    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)

    start_date = models.DateField()
    end_date = models.DateField()

    is_published = models.BooleanField(default=False)

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError("End date must be after start date")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)



class ExamSubject(models.Model):
    exam = models.ForeignKey('institution.Exam', on_delete=models.CASCADE,related_name='subjects')

    subject = models.ForeignKey('institution.Subject', on_delete=models.CASCADE,related_name='exam_subjects')

    max_marks = models.FloatField()

    class Meta:
        unique_together = ['exam', 'subject']
    
    def clean(self):
        if self.subject.program != self.exam.batch.program:
            raise ValidationError("Subject does not belong to exam batch program")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class ExamResult(models.Model):
    exam_subject = models.ForeignKey(
        'institution.ExamSubject',
        on_delete=models.CASCADE,
        related_name='results'
    )

    student = models.ForeignKey(
        'institution.InstitutionStudent',
        on_delete=models.CASCADE,
        related_name='exam_results'
    )

    marks_obtained = models.FloatField()
    is_absent = models.BooleanField(default=False)

    class Meta:
        unique_together = ['exam_subject', 'student']
        indexes = [
        models.Index(fields=['student']),
        models.Index(fields=['exam_subject']),
        ]
    
    def clean(self):
        if self.marks_obtained > self.exam_subject.max_marks:
            raise ValidationError("Marks cannot exceed maximum marks")
        if self.marks_obtained < 0:
            raise ValidationError("Marks cannot be negative")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)



#gradescale

class GradeScale(models.Model):
    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.CASCADE,
        related_name='grade_scales'
    )

    min_marks = models.FloatField()
    max_marks = models.FloatField()

    grade = models.CharField(max_length=2)       # A, B+, etc.
    grade_point = models.FloatField()            # 10, 9, 8

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-min_marks']
        unique_together = ['institution', 'grade']

    def clean(self):
        if self.min_marks > self.max_marks:
            raise ValidationError("Min marks cannot exceed max marks")
        
    def save(self,*args,**kwargs):
        self.clean()
        super().save(*args,**kwargs)

    def __str__(self):
        return f"{self.grade} ({self.min_marks}-{self.max_marks})"



#Subject Result

class SubjectResult(models.Model):
    student = models.ForeignKey('institution.InstitutionStudent', on_delete=models.CASCADE,related_name='subject_results' )
    subject = models.ForeignKey('institution.Subject', on_delete=models.CASCADE,related_name='results')

    internal_marks = models.FloatField()
    external_marks = models.FloatField()

    total_marks = models.FloatField()

    grade = models.CharField(max_length=2, null=True, blank=True)
    grade_point = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ['student', 'subject']

    def compute_total(self):
        return (
            self.internal_marks
            +
            self.external_marks
        )
    
    def calculate_grade(self):
        scale = GradeScale.objects.filter(
            institution=self.student.institution,
            min_marks__lte=self.total_marks,
            max_marks__gte=self.total_marks,
            is_active=True
        ).first()

        if scale:
            self.grade = scale.grade
            self.grade_point = scale.grade_point
    
    def clean(self):
        if self.internal_marks < 0:
            raise ValidationError(
                "Internal marks cannot be negative"
            )

        if self.external_marks < 0:
            raise ValidationError(
                "External marks cannot be negative"
            )

    def save(self, *args, **kwargs):
        self.clean()
        self.total_marks = self.compute_total()
        self.calculate_grade()
        super().save(*args, **kwargs)





class Assignment(models.Model):
    component = models.ForeignKey(
        'institution.EvaluationComponent',
        on_delete=models.CASCADE,
        related_name='assignments'
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()

    def clean(self):
        if self.due_date < timezone.now():
            raise ValidationError("Due date cannot be in the past")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Submission(models.Model):
    assignment = models.ForeignKey(
        'institution.Assignment',
        on_delete=models.CASCADE,
        related_name='submissions'
    )

    student = models.ForeignKey(
        'institution.InstitutionStudent',
        on_delete=models.CASCADE,
        related_name='submissions'
    )

    submitted_at = models.DateTimeField(auto_now_add=True)

    is_late = models.BooleanField(default=False)


    file = models.URLField()
    marks = models.FloatField(null=True, blank=True)

    def clean(self):
        # Ensure student belongs to correct batch
        if self.student.batch != self.assignment.component.batch:
            raise ValidationError("Student not in correct batch for this assignment")


    def save(self, *args, **kwargs):
        self.clean()
        if self.assignment.due_date:
            from django.utils import timezone
            self.is_late = timezone.now() > self.assignment.due_date
        super().save(*args, **kwargs)


class InstitutionAuditLog(models.Model):
    ACTION_CHOICES = [
        ("student_created", "Student Created"),
        ("student_updated", "Student Updated"),
        ("student_suspended", "Student Suspended"),
        ("student_promoted", "Student Promoted"),
        ("student_bulk_import", "Student Bulk Import"),
        ("faculty_created", "Faculty Created"),
        ("faculty_updated", "Faculty Updated"),
        ("faculty_suspended", "Faculty Suspended"),
        ("faculty_reactivated", "Faculty Reactivated"),
        ("faculty_offboarded", "Faculty Offboarded"),
        ("faculty_made_hod", "Faculty Made HOD"),
        ("attendance_unlocked", "Attendance Unlocked"),
        ("grade_overridden", "Grade Overridden"),
        ("result_published", "Result Published"),
        ("leave_applied", "Leave Applied"),
        ("leave_approved", "Leave Approved"),
        ("leave_rejected", "Leave Rejected"),
        ("export_requested", "Export Requested"),
        ("export_completed", "Export Completed"),
        ("export_failed", "Export Failed"),
        ("academic_structure_changed", "Academic Structure Changed"),
    ]

    institution = models.ForeignKey(
        "institution.Institution",
        on_delete=models.CASCADE,
        related_name="audit_logs",
        db_index=True,
    )
    department = models.ForeignKey(
        "institution.Department",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        db_index=True,
    )
    actor = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="institution_audit_actions",
    )
    action = models.CharField(max_length=80, choices=ACTION_CHOICES, db_index=True)
    target_type = models.CharField(max_length=100)
    target_id = models.CharField(max_length=80)
    reason = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["institution", "action"]),
            models.Index(fields=["institution", "department"]),
            models.Index(fields=["target_type", "target_id"]),
        ]

    def __str__(self):
        return f"{self.action} on {self.target_type}:{self.target_id}"


class InstitutionExportJob(models.Model):
    REPORT_CHOICES = [
        ("students", "Students"),
        ("faculty", "Faculty"),
        ("attendance", "Attendance"),
        ("performance", "Performance"),
        ("faculty_activity", "Faculty Activity"),
        ("batch_performance", "Batch Performance"),
    ]

    STATUS_CHOICES = [
        ("queued", "Queued"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    FORMAT_CHOICES = [
        ("csv", "CSV"),
    ]

    institution = models.ForeignKey(
        "institution.Institution",
        on_delete=models.CASCADE,
        related_name="export_jobs",
    )
    requested_by = models.ForeignKey(
        "users.CustomUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="institution_export_jobs",
    )
    report_type = models.CharField(max_length=40, choices=REPORT_CHOICES)
    export_format = models.CharField(
        max_length=20,
        choices=FORMAT_CHOICES,
        default="csv",
    )
    filters = models.JSONField(default=dict, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="queued",
        db_index=True,
    )
    file = models.FileField(upload_to="exports/institution/", blank=True)
    row_count = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["institution", "report_type"]),
            models.Index(fields=["requested_by", "status"]),
        ]

    def __str__(self):
        return f"{self.report_type} export ({self.status})"
