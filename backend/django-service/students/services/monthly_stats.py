from django.utils import timezone
from django.db.models import Sum
from students.models import LearningActivity, LessonProgress, Task

def get_monthly_stats(student):
    now = timezone.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0)

    seconds = (
        LearningActivity.objects
        .filter(
            student=student,
            created_at__gte=start_of_month
        )
        .aggregate(total=Sum("seconds"))["total"] or 0
    )

    learning_hours = round(seconds / 3600, 2)


    modules_completed = (
        LessonProgress.objects
        .filter(
            student=student,
            completed=True,
            completed_at__gte=start_of_month
        )
        .values("lesson__module")
        .distinct()
        .count()
    )

  
    # assessments_passed = (
    #     Task.objects
    #     .filter(
    #         student=student,
    #         completed=True,
    #         category="assessment"
    #     )
    #     .count()
    # )

    return {
        "learning_hours": learning_hours,
        "modules_completed": modules_completed,
        # "assessments_passed": assessments_passed,
    }
