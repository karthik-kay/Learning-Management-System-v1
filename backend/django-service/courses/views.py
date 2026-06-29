from django.utils import timezone
from django.db.models import Q
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import (
    Course,
    CourseProduct,
    Enrollment,
    Lesson,
    Quiz,
    QuizAttempt,
)
from .public_serializers import (
    PublicCourseProductDetailSerializer,
    PublicCourseProductListSerializer,
)
from students.models import LessonProgress

from .serializers import (
    CourseListSerializer,
    CourseWriteSerializer,
    PublicCourseDetailSerializer,
    EnrolledCourseDetailSerializer,
    EnrollmentSerializer,
    CourseProgressSerializer,
    QuizSerializer,
    QuizCreateSerializer,
    QuizSubmitSerializer,
    QuizAttemptSerializer,
)

from .permissions import IsFacultyOrAdmin, IsStudent


# ─────────────────────────────────────────────
# COURSE VIEWSET (AUTH REQUIRED)
# ─────────────────────────────────────────────

class CourseViewSet(viewsets.ModelViewSet):
    """
    /courses/                      -> faculty/admin list
    /courses/{id}/                 -> internal detail
    /courses/{id}/enroll/          -> enroll student
    /courses/{id}/progress/        -> enrolled detail + progress
    /courses/{id}/complete_lesson/ -> mark lesson complete
    """
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) == "faculty":
            return Course.objects.filter(created_by=user)
        return Course.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        if self.action == "retrieve":
            return PublicCourseDetailSerializer
        return CourseWriteSerializer

    # ── ENROLL ───────────────────────────────

    @action(
        detail=True,
        methods=["POST"],
        permission_classes=[IsAuthenticated, IsStudent],
    )
    def enroll(self, request, pk=None):
        """
        Free course direct enroll.
        Paid courses must go through /payments/create-order/ instead.
        """
        student = request.user.student_profile
        course = self.get_object()
        product = getattr(course, "product", None)

        if not product or not product.is_free:
            return Response(
                {"error": "Paid courses must be purchased via the checkout flow."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        enrollment, created = Enrollment.objects.get_or_create(
            student=student,
            course=course,
            defaults={
                "is_active": True,
                "total_modules": course.modules.count(),
                "price_paid": 0,
            }
        )

        if not created:
            return Response(
                {"message": "Already enrolled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Enrolled successfully"},
            status=status.HTTP_201_CREATED,
        )

    # ── COURSE PROGRESS ───────────────────────

    @action(
        detail=True,
        methods=["GET"],
        permission_classes=[IsAuthenticated, IsStudent],
        url_path="progress",
    )
    def progress(self, request, pk=None):
        student = request.user.student_profile
        course = self.get_object()

        # check enrollment exists and is active
        try:
            enrollment = Enrollment.objects.get(
                student=student,
                course=course,
                is_active=True,
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"error": "Not enrolled in this course"},
                status=status.HTTP_403_FORBIDDEN,
            )

        total_lessons = Lesson.objects.filter(module__course=course).count()

        completed_lessons = LessonProgress.objects.filter(
            student=student,
            completed=True,
            lesson__module__course=course,
        ).count()

        progress_percent = (
            completed_lessons / total_lessons * 100 if total_lessons else 0
        )

        # sync enrollment progress
        enrollment.completed_modules = completed_lessons
        enrollment.total_modules = total_lessons
        enrollment.progress = progress_percent
        enrollment.save()

        payload = {
            "course": course,
            "progress_percent": progress_percent,
            "completed_lessons": completed_lessons,
            "total_lessons": total_lessons,
            "modules": course.modules.all(),
        }

        serializer = CourseProgressSerializer(
            payload,
            context={"student": student, "request": request}
        )
        return Response(serializer.data)

    # ── COMPLETE LESSON ───────────────────────

    @action(
        detail=True,
        methods=["POST"],
        permission_classes=[IsAuthenticated, IsStudent],
    )
    def complete_lesson(self, request, pk=None):
        student = request.user.student_profile
        lesson_id = request.data.get("lesson_id")

        if not lesson_id:
            return Response(
                {"error": "lesson_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # check student is enrolled and active
        try:
            Enrollment.objects.get(
                student=student,
                course_id=pk,
                is_active=True,
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"error": "Not enrolled in this course"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            lesson = Lesson.objects.get(id=lesson_id, module__course_id=pk)
        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        progress, _ = LessonProgress.objects.get_or_create(
            student=student,
            lesson=lesson,
        )

        progress.completed = True
        progress.completed_at = timezone.now()
        progress.save()

        return Response(
            {"message": "Lesson marked complete"},
            status=status.HTTP_200_OK,
        )


# ─────────────────────────────────────────────
# ENROLLMENT VIEWSET
# ─────────────────────────────────────────────

class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    /enrollments/           -> list user enrollments
    /enrollments/completed/ -> completed courses
    /enrollments/continue/  -> continue learning list
    """
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            student=self.request.user.student_profile,
            is_active=True,
        ).select_related("course")

    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Use /courses/{id}/enroll/ for free courses or /payments/create-order/ for paid courses"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ── COMPLETED COURSES ─────────────────────

    @action(detail=False, methods=["GET"], url_path="completed")
    def completed_courses(self, request):
        student = request.user.student_profile

        enrollments = Enrollment.objects.filter(
            student=student,
            is_completed=True,
            is_active=True,
        ).select_related("course")

        data = [
            {
                "id": e.id,
                "course_id": e.course.id,
                "course_title": e.course.title,
                "course_thumbnail": e.course.product.thumbnail if hasattr(e.course, "product") else None,
                "completed_at": e.completed_at,
                "progress": e.progress,
            }
            for e in enrollments
        ]

        return Response(data)

    # ── CONTINUE LEARNING ─────────────────────

    @action(detail=False, methods=["GET"], url_path="continue")
    def continue_learning(self, request):
        student = request.user.student_profile

        enrollments = Enrollment.objects.filter(
            student=student,
            is_completed=False,
            is_active=True,
        ).select_related("course").prefetch_related("course__modules__lessons")

        results = []

        for enroll in enrollments:
            course = enroll.course
            modules = course.modules.all().order_by("order")

            total_lessons = Lesson.objects.filter(module__course=course).count()

            completed = LessonProgress.objects.filter(
                student=student,
                completed=True,
                lesson__module__course=course,
            ).count()

            unread = max(total_lessons - completed, 0)
            progress_percent = (completed / total_lessons * 100) if total_lessons else 0

            # find next incomplete lesson
            resume_lesson = None
            for module in modules:
                for lesson in module.lessons.all().order_by("order"):
                    is_done = LessonProgress.objects.filter(
                        student=student,
                        lesson=lesson,
                        completed=True,
                    ).exists()
                    if not is_done:
                        resume_lesson = lesson
                        break
                if resume_lesson:
                    break

            if not resume_lesson:
                continue

            AVG_MIN_PER_LESSON = 10
            estimated_time_left = unread * AVG_MIN_PER_LESSON

            results.append({
                "enrollment_id": enroll.id,
                "course_id": course.id,
                "course_title": course.title,
                "course_thumbnail": course.product.thumbnail if hasattr(course, "product") else None,
                "course_progress_percent": progress_percent,
                "completed_lessons": completed,
                "total_lessons": total_lessons,
                "unread_lessons": unread,
                "module_id": resume_lesson.module.id,
                "module_title": resume_lesson.module.title,
                "lesson_id": resume_lesson.id,
                "lesson_title": resume_lesson.title,
                "estimated_time_left_minutes": estimated_time_left,
            })

        return Response(results)


# ─────────────────────────────────────────────
# QUIZ VIEWS
# ─────────────────────────────────────────────

class QuizCreateAPIView(generics.CreateAPIView):
    """POST /courses/quizzes/create/ — Faculty/Admin only."""
    serializer_class = QuizCreateSerializer
    permission_classes = [IsAuthenticated, IsFacultyOrAdmin]


class QuizDetailAPIView(generics.RetrieveAPIView):
    """GET /courses/quizzes/{id}/"""
    serializer_class = QuizSerializer
    queryset = Quiz.objects.all()
    permission_classes = [IsAuthenticated]


class QuizSubmitAPIView(generics.CreateAPIView):
    """POST /courses/quizzes/{quiz_id}/submit/"""
    serializer_class = QuizSubmitSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_serializer_context(self):
        return {
            "request": self.request,
            "quiz": Quiz.objects.get(id=self.kwargs["quiz_id"]),
        }


class QuizAttemptsListAPIView(generics.ListAPIView):
    """GET /courses/quizzes/{quiz_id}/attempts/"""
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        student = self.request.user.student_profile
        quiz_id = self.kwargs["quiz_id"]
        return QuizAttempt.objects.filter(
            student=student,
            quiz_id=quiz_id,
        ).order_by("-completed_at")


class QuizHistoryAPIView(generics.ListAPIView):
    """GET /courses/quizzes/history/ — all attempts by current student."""
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        student = self.request.user.student_profile
        return QuizAttempt.objects.filter(student=student).order_by("-completed_at")


# ─────────────────────────────────────────────
# PUBLIC COURSE LIST
# ─────────────────────────────────────────────

class PublicCourseListAPIView(generics.ListAPIView):
    """
    GET /public/courses/
    ?search= &domain= &level= &language= &featured= &free=
    &min_price= &max_price= (in INR, converted to paise internally)
    &ordering=
    No auth required.
    """
    serializer_class = PublicCourseProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = CourseProduct.objects.filter(is_published=True, course__is_active=True).select_related(
            "course"
        ).prefetch_related("instructors", "course__modules__lessons")
        params = self.request.query_params

        search   = params.get("search")
        domain   = params.get("domain")
        level    = params.get("level")
        language = params.get("language")
        featured = params.get("featured")
        free     = params.get("free")
        min_price = params.get("min_price")  # INR
        max_price = params.get("max_price")  # INR
        ordering = params.get("ordering")

        if search:
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(short_description__icontains=search)
                | Q(course__title__icontains=search)
                | Q(course__description__icontains=search)
                | Q(instructors__display_name__icontains=search)
            )

        if domain:
            qs = qs.filter(course__domain__iexact=domain)

        if level:
            qs = qs.filter(course__level__iexact=level)

        if language:
            qs = qs.filter(course__language__iexact=language)

        if featured == "true":
            qs = qs.filter(is_featured=True)

        if free == "true":
            qs = qs.filter(is_free=True)

        if min_price:
            try:
                min_paise = int(float(min_price) * 100)
                qs = qs.filter(display_price_paise__gte=min_paise)
            except (ValueError, TypeError):
                pass

        if max_price:
            try:
                max_paise = int(float(max_price) * 100)
                qs = qs.filter(display_price_paise__lte=max_paise)
            except (ValueError, TypeError):
                pass

        if ordering:
            allowed_orderings = [
                "created_at", "-created_at",
                "title", "-title",
                "display_price_paise", "-display_price_paise",
            ]
            if ordering in allowed_orderings:
                qs = qs.order_by(ordering)

        return qs


# ─────────────────────────────────────────────
# PUBLIC COURSE DETAIL
# ─────────────────────────────────────────────

class PublicCourseDetailAPIView(generics.RetrieveAPIView):
    """
    GET /public/courses/{id}/
    Used for Explore -> PublicCoursePage.
    No auth required.
    """
    queryset = CourseProduct.objects.filter(is_published=True, course__is_active=True).select_related(
        "course"
    ).prefetch_related("instructors", "course__modules__lessons")
    serializer_class = PublicCourseProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "course_id"
    lookup_url_kwarg = "id"
