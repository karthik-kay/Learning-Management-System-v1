from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Student(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="student_profile")
    
    learning_hours=models.FloatField(default=0.0)
    day_streak=models.PositiveIntegerField(default=0)
    last_active=models.DateTimeField(null=True,blank=True)
    total_points=models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
    
class LearningActivity(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE,related_name="activities")
    seconds=models.PositiveIntegerField()
    created_at=models.DateTimeField(auto_now_add=True)

class GoalCategory(models.TextChoices):
    STUDY = "study", "Study"
    COURSE = "course", "Course"
    ASSESSMENT = "assessment", "Assessment"

class Goal(models.Model):
    class GoalType(models.TextChoices):
        PROGRESS = "progress", "Progress Goal"
        HABIT = "habit", "Daily Habit"

    student=models.ForeignKey(Student,on_delete=models.CASCADE,related_name="goals")
    title=models.CharField(max_length=255)

    category = models.CharField(
        max_length=20,
        choices=GoalCategory.choices,
        default=GoalCategory.STUDY
    )

    goal_type = models.CharField(
        max_length=20,
        choices=GoalType.choices,
        default=GoalType.PROGRESS
    )


    progress=models.PositiveBigIntegerField(default=0)
    target=models.PositiveIntegerField(default=100)
    deadline=models.DateField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    last_checkin_date = models.DateField(null=True, blank=True)

    def is_completed(self):
        return self.progress>=self.target



class Task(models.Model):
    CATEGORY_CHOICES = (
        ("course", "Course"),
        ("module", "Module"),
        ("study", "Study"),
        ("assessment", "Assessment"),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="tasks")
    course = models.ForeignKey("courses.Course", null=True, blank=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=255)

   

    deadline = models.DateField()
    priority = models.CharField(max_length=10, choices=[("high","High"),("medium","Medium"),("low","Low")], default="medium")

    progress = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)

    def is_overdue(self):
        from django.utils import timezone
        return not self.completed and self.deadline<timezone.now().date()
    

class LessonProgress(models.Model):
    student=models.ForeignKey("students.Student",on_delete=models.CASCADE)
    lesson=models.ForeignKey("courses.Lesson",on_delete=models.CASCADE)
    completed=models.BooleanField(default=False)
    completed_at=models.DateTimeField(null=True,blank=True)

    class Meta:
        unique_together=("student","lesson")

