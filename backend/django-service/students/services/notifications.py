from django.utils import timezone

def get_notifications(student):
    notifications = []
    today = timezone.now().date()

    # Overdue tasks
    for task in student.tasks.all():
        if task.is_overdue():
            notifications.append(f"Task '{task.title}' is overdue!")

    # Tasks due today
    for task in student.tasks.filter(deadline=today):
        notifications.append(f"Task '{task.title}' is due today.")

    # Goal completions
    for goal in student.goals.all():
        if goal.progress >= goal.target:
            notifications.append(f"Goal '{goal.title}' completed!")

    return notifications
