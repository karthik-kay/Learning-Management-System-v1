from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import LessonProgress, Student, LearningActivity, Task, Goal
from .serializers import LessonQueueSerializer, StudentSerializer, TaskSerializer, GoalSerializer, LearningActivitySerializer
from .services.notifications import get_notifications
from courses.models import Lesson

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def student_dashboard(request):
    student = request.user.student_profile
    include_stats = request.query_params.get("include_stats") == "1"

    serializer = StudentSerializer(
        student,
        context={"include_monthly_stats": include_stats},
    )


    data = serializer.data
    data["notifications"] = get_notifications(student)

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def daily_learning_hours(request):
    student = request.user.student_profile

    today = timezone.localdate()
    from datetime import timedelta


    week_days = [today - timedelta(days=i) for i in range(6, -1, -1)]

    output = []

    for day in week_days:
        logs = student.activities.filter(created_at__date=day)
        total_seconds = sum(activity.seconds for activity in logs)
        hours = round(total_seconds / 3600, 2)

        output.append({
            "day": day.strftime("%a"),
            "hours": hours,
        })

    return Response(output)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_activity(request):
    student = request.user.student_profile
    seconds = request.data.get("seconds", None)

    if seconds is None:
        return Response({"error": "seconds is required"}, status=400)

    LearningActivity.objects.create(student=student, seconds=seconds)
    hours = seconds / 3600
    student.learning_hours = round(student.learning_hours + hours, 2)
    student.save()

    update_streak(student)

    return Response({"message": "Activity logged"})


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_task(request):
#     student = request.user.student_profile
    
#     serializer = TaskSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(student=student)
#         return Response(serializer.data)
    
#     return Response(serializer.errors, status=400)


# @api_view(["PATCH"])
# @permission_classes([IsAuthenticated])
# def update_task(request, task_id):
#     student = request.user.student_profile
#     task = student.tasks.filter(id=task_id).first()

#     if not task:
#         return Response({"error": "Task not found"}, status=404)

#     serializer = TaskSerializer(task, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)

#     return Response(serializer.errors, status=400)

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def complete_task(request, task_id):
#     student = request.user.student_profile
#     task = student.tasks.filter(id=task_id).first()

#     if not task:
#         return Response({"error": "Task not found"}, status=404)

#     task.completed = True
#     task.progress = 100
#     task.save()

#     return Response({"message": "Task marked as completed"})


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.student_profile.tasks.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def perform_update(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=["POST"])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.completed = True
        task.progress = 100
        task.save()
        return Response({"message": "Task completed"})
    

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def create_goal(request):
#     student = request.user.student_profile
    
#     serializer = GoalSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(student=student)
#         return Response(serializer.data)
    
#     return Response(serializer.errors, status=400)



# @api_view(["PATCH"])
# @permission_classes([IsAuthenticated])
# def update_goal(request, goal_id):
#     student = request.user.student_profile
#     goal = student.goals.filter(id=goal_id).first()

#     if not goal:
#         return Response({"error": "Goal not found"}, status=404)

#     serializer = GoalSerializer(goal, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)

#     return Response(serializer.errors, status=400)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.student_profile.goals.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)

   
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=["POST"], url_path="checkin")
    def checkin(self, request, pk=None):
        goal = self.get_object()

        # Only habit goals can check in
        if goal.goal_type != "habit":
            return Response(
                {"detail": "This goal is not a habit goal."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        today = timezone.now().date()

        if goal.last_checkin_date == today:
            return Response(
                {"detail": "Already checked in today."},
                status=status.HTTP_400_BAD_REQUEST,
            )

       
        goal.progress += 1
        goal.last_checkin_date = today
        goal.save()

        return Response(GoalSerializer(goal).data, status=status.HTTP_200_OK)
    

def update_streak(student):
    now = timezone.now().date()

    if student.last_active is None:
        student.day_streak = 1
    else:
        last = student.last_active.date()
        if (now - last).days == 1:
            student.day_streak += 1
        elif (now - last).days > 1:
            student.day_streak = 1

    student.last_active = timezone.now()
    student.save()


class LessonQueueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student = getattr(request.user, "student_profile", None)

        if not student:
            return Response({
                "mode": "auto",
                "queue": []
            })

        queue = []

        
        last_progress = (
            LessonProgress.objects
            .filter(student=student, completed=True)
            .select_related("lesson__module")
            .order_by("-completed_at")
            .first()
        )

        if last_progress:
            lesson = last_progress.lesson

            
            next_lesson = (
                Lesson.objects
                .filter(
                    module=lesson.module,
                    order__gt=lesson.order
                )
                .order_by("order")
                .first()
            )

            if next_lesson:
                queue.append(next_lesson)

        completed_ids = LessonProgress.objects.filter(
            student=student,
            completed=True
        ).values_list("lesson_id", flat=True)
       
        other_lessons = (
            Lesson.objects
            .exclude(id__in=completed_ids)
            .exclude(id__in=[l.id for l in queue])
            .select_related("module")
            .order_by("module", "order")
        )

        seen_modules = set()
        for lesson in other_lessons:
            if lesson.module_id not in seen_modules:
                queue.append(lesson)
                seen_modules.add(lesson.module_id)

            if len(queue) >= 4:
                break

        serializer = LessonQueueSerializer(queue, many=True)
        return Response({
            "mode": "auto",
            "queue": serializer.data
        })
