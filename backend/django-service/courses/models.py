from django.db import models
from django.utils.text import slugify
from users.models import CustomUser

class Course(models.Model):
    COURSE_TYPES = (
       ('self_paced', 'Self-Paced Course'),
       ('instructor_led', 'Instructor-Led Course'),
    )
    DIFFICULTY_LEVELS = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )
    LANGUAGES = (
        ('english', 'English'),
        ('hindi', 'Hindi'),
        ('telugu', 'Telugu'),
        ('tamil', 'Tamil'),
        ('other', 'Other'),
    )

     
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_courses",
    )
    # students = models.ManyToManyField("students.Student", related_name="enrolled_courses", blank=True)
    course_type = models.CharField(max_length=20, choices=COURSE_TYPES, default='self_paced')
    deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    domain = models.CharField(max_length=100, blank=True, null=True)
    level = models.CharField(max_length=20, blank=True, null=True)
    language = models.CharField(max_length=20, blank=True, null=True)
    estimated_hours = models.PositiveIntegerField(default=0, blank=True)
    is_active = models.BooleanField(default=True)

    slug = models.SlugField(unique=True, blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CourseProduct(models.Model):
    course = models.OneToOneField(
        Course,
        on_delete=models.CASCADE,
        related_name="product",
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.TextField(blank=True)
    thumbnail = models.URLField(blank=True, null=True)
    promo_video_url = models.URLField(blank=True, null=True)
    instructors = models.ManyToManyField(
        "faculty.FacultyProfile",
        blank=True,
        related_name="course_products",
    )
    instructor_name = models.CharField(
        max_length=150,
        blank=True,
        help_text="Legacy/display fallback when no faculty profiles are attached.",
    )
    is_free = models.BooleanField(default=False)
    display_price_paise = models.PositiveIntegerField(null=True, blank=True)
    is_published = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    published_at = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-published_at", "title"]
        indexes = [
            models.Index(fields=["is_published", "is_featured"]),
            models.Index(fields=["slug"]),
        ]

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = self.course.title

        if not self.slug:
            base_slug = slugify(self.title or self.course.title)
            unique_slug = base_slug
            counter = 1

            while CourseProduct.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                counter += 1
                unique_slug = f"{base_slug}-{counter}"

            self.slug = unique_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
class Module(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="modules")
    title=models.CharField(max_length=200)
    order=models.PositiveIntegerField(default=0)
    deadline = models.DateTimeField(null=True, blank=True)

    description = models.TextField(blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0, blank=True, null=True)


    def __str__(self):
        return f"{self.course.title}-{self.title}"

class Lesson(models.Model):
    class LessonType(models.TextChoices):
        VIDEO = "video", "Video Lesson"
        READING = "reading", "Reading"
        LAB = "lab", "Interactive Lab"
    
    module=models.ForeignKey(Module,on_delete=models.CASCADE,related_name="lessons")
    title=models.CharField(max_length=200)
    content=models.CharField(max_length=5000,blank=True)
    order=models.PositiveSmallIntegerField(default=0)
    lesson_type = models.CharField(
        max_length=20,
        choices=LessonType.choices,
        default=LessonType.VIDEO
    )

    deadline = models.DateTimeField(null=True, blank=True)

    resource_url = models.URLField(blank=True, null=True)
    resources = models.JSONField(default=list, blank=True, null=True)
    duration_minutes = models.PositiveIntegerField(default=0, blank=True, null=True)
    is_preview = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.module.title} - {self.title}"


class Enrollment(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    order = models.ForeignKey(
        "payments.PaymentOrder",
        on_delete=models.PROTECT,
        null=True,      # null=True because free courses skip payment
        blank=True,
        related_name="enrollments"
    )

    price_paid   = models.IntegerField(null=True, blank=True)  # snapshot in paise
    is_active    = models.BooleanField(default=True)           # flip False on refund

    progress = models.FloatField(default=0) 
    completed_modules = models.IntegerField(default=0)
    total_modules = models.IntegerField(default=0)

    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'course')
        indexes = [
        models.Index(fields=['student', 'course']),
        ]

    def __str__(self):
        return f"{self.student.user.username} → {self.course.title}"
    
class Quiz(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="quizzes")
    module = models.ForeignKey(Module, on_delete=models.SET_NULL, null=True, blank=True, related_name="quizzes")
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True, related_name="quizzes")

    title = models.CharField(max_length=255)
    instructions = models.TextField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class QuizQuestion(models.Model):
    QUESTION_TYPES = (
        ('mcq', 'Multiple Choice'),
        ('true_false', 'True or False'),
        ('short', 'Short Answer'),
        ('long', 'Long Answer'),
        ('fill', 'Fill in the Blank'),
    )

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='mcq')

    text = models.TextField()
    marks = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)
    correct_answer = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"
    
class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuizAttempt(models.Model):
    student = models.ForeignKey("students.Student", on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)

    score = models.FloatField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student} - {self.quiz}"

class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)

    selected_option = models.ForeignKey(
        QuizOption,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    text_answer = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Answer for Q{self.question.id}"
