from django.utils import timezone
from rest_framework import serializers
from django.db import models


from .models import (
    Course,
    Module,
    Lesson,
    Enrollment,
    Quiz,
    QuizQuestion,
    QuizOption,
    QuizAttempt,
    QuizAnswer
)

from students.models import LessonProgress


 
# LESSON SERIALIZERS
 

class PublicLessonSerializer(serializers.ModelSerializer):
    """Safe lesson structure for non-enrolled users (preview only)."""

    class Meta:
        model = Lesson
        fields = ["id", "title", "order", "is_preview", "duration_minutes"]


class EnrolledLessonSerializer(serializers.ModelSerializer):
    """Full lesson data + completed status for enrolled students."""
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "order",
            "resource_url",
            "duration_minutes",
            "resources",
            "deadline",
            "is_preview",
            "completed",
        ]

    def get_completed(self, lesson):
        student = self.context.get("student")
        if isinstance(lesson, dict):
            lesson_id = lesson.get("id")
        else:
            lesson_id = getattr(lesson, "id", None)

        if not student or not lesson_id:
            return False

        return LessonProgress.objects.filter(
            student_id=getattr(student, "id", student),
            lesson_id=lesson_id,
            completed=True,
        ).exists()


 
# MODULE SERIALIZERS
 

class PublicModuleSerializer(serializers.ModelSerializer):
    lessons = PublicLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "order", "description", "lessons"]


class EnrolledModuleSerializer(serializers.ModelSerializer):
    lessons = EnrolledLessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ["id", "title", "order", "description", "deadline", "lessons"]


 
# COURSE SERIALIZERS
 

class CourseListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)
    modules_count = serializers.SerializerMethodField()
    lessons_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "created_by_name",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "is_active",
            "slug",
            "course_type",
            "modules_count",
            "lessons_count",
        ]

    def get_modules_count(self, obj):
        return obj.modules.count()

    def get_lessons_count(self, obj):
        return Lesson.objects.filter(module__course=obj).count()


class PublicCourseDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)
    modules = PublicModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "created_by_name",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "is_active",
            "slug",
            "course_type",
            "deadline",
            "created_at",
            "updated_at",
            "modules",
        ]


class EnrolledCourseDetailSerializer(serializers.ModelSerializer):
    """Used only when student is enrolled - includes full content data."""
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)
    modules = EnrolledModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "created_by_name",
            "course_type",
            "deadline",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "is_active",
            "created_at",
            "updated_at",
            "modules",
        ]


# ENROLLMENT SERIALIZER


class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source="course.id", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True)
    course_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course_id",
            "course_title",
            "course_thumbnail",
            "progress",
            "completed_modules",
            "total_modules",
            "started_at",
            "updated_at",
            "completed_at",
            "is_completed",
        ]
        read_only_fields = [
            "started_at",
            "updated_at",
            "completed_at",
            "is_completed",
        ]

    def get_course_thumbnail(self, obj):
        product = getattr(obj.course, "product", None)
        return product.thumbnail if product else None


# PROGRESS SERIALIZER


class CourseProgressSerializer(serializers.Serializer):
    course = EnrolledCourseDetailSerializer()
    course_thumbnail = serializers.SerializerMethodField()
    progress_percent = serializers.FloatField()
    completed_lessons = serializers.IntegerField()
    total_lessons = serializers.IntegerField()
    modules = serializers.SerializerMethodField()

    def get_modules(self, obj):
        course = obj["course"]
        student = self.context["student"]
        return EnrolledModuleSerializer(
            course.modules.all().order_by("order"),
            many=True,
            context={"student": student}
        ).data

    def get_course_thumbnail(self, obj):
        product = getattr(obj["course"], "product", None)
        return product.thumbnail if product else None
 
# QUIZ SERIALIZERS
 

class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ["id", "text", "is_correct"]
        extra_kwargs = {"is_correct": {"write_only": True}}  # hide from students


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = [
            "id",
            "text",
            "question_type",
            "marks",
            "order",
            "options",
        ]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "instructions",
            "due_date",
            "questions",
        ]


 
# QUIZ HISTORY / ATTEMPT SERIALIZERS
 

class QuizAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.text", read_only=True)
    question_type = serializers.CharField(source="question.question_type", read_only=True)
    correct_option = serializers.SerializerMethodField()
    selected_option_text = serializers.SerializerMethodField()

    class Meta:
        model = QuizAnswer
        fields = [
            "question",
            "question_text",
            "question_type",
            "selected_option",
            "selected_option_text",
            "text_answer",
            "correct_option",
        ]

    def get_correct_option(self, obj):
        q = obj.question

        if q.question_type in ["mcq", "true_false"]:
            opt = q.options.filter(is_correct=True).first()
            return opt.text if opt else None

        if q.question_type == "fill":
            return q.correct_answer

        return None

    def get_selected_option_text(self, obj):
        return obj.selected_option.text if obj.selected_option else None


class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, read_only=True)
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    max_score = serializers.SerializerMethodField()

    class Meta:
        model = QuizAttempt
        fields = [
            "id",
            "quiz",
            "quiz_title",
            "max_score",
            "score",
            "started_at",
            "completed_at",
            "answers",
        ]

    def get_max_score(self, obj):
        return sum(q.marks for q in obj.quiz.questions.all())


 
# QUIZ CREATE SERIALIZERS
 

class QuizOptionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ["text", "is_correct"]


class QuizQuestionCreateSerializer(serializers.ModelSerializer):
    options = QuizOptionCreateSerializer(many=True, required=False)

    class Meta:
        model = QuizQuestion
        fields = ["text", "question_type", "marks", "order", "options"]


class QuizCreateSerializer(serializers.ModelSerializer):
    questions = QuizQuestionCreateSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ["course", "module", "lesson", "title", "instructions", "due_date", "questions"]

    def create(self, validated_data):
        questions_data = validated_data.pop("questions")
        quiz = Quiz.objects.create(**validated_data)

        for q in questions_data:
            options = q.pop("options", [])
            question = QuizQuestion.objects.create(quiz=quiz, **q)
            for opt in options:
                QuizOption.objects.create(question=question, **opt)

        return quiz


 
# QUIZ SUBMISSION SERIALIZERS
 

class QuizAnswerSubmitSerializer(serializers.Serializer):
    question = serializers.IntegerField()
    selected_option = serializers.IntegerField(required=False)
    text_answer = serializers.CharField(required=False)


class QuizSubmitSerializer(serializers.Serializer):
    answers = QuizAnswerSubmitSerializer(many=True)

    def create(self, validated_data):
        student = self.context["request"].user.student
        quiz = self.context["quiz"]

        attempt = QuizAttempt.objects.create(student=student, quiz=quiz)
        score = 0

        for ans in validated_data["answers"]:
            q_id = ans["question"]
            question = QuizQuestion.objects.get(id=q_id)

            selected_option = ans.get("selected_option")
            text_answer = ans.get("text_answer")

            answer_obj = QuizAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_option_id=selected_option,
                text_answer=text_answer,
            )

            # auto-grading
            if question.question_type in ["mcq", "true_false"]:
                if selected_option:
                    opt = QuizOption.objects.get(id=selected_option)
                    if opt.is_correct:
                        score += question.marks

            elif question.question_type == "fill":
                if text_answer and text_answer.lower().strip() == question.correct_answer.lower().strip():
                    score += question.marks

        attempt.score = score
        attempt.completed_at = timezone.now()
        attempt.save()

        return attempt

# serializers.py

class CourseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "title",
            "description",
            "created_by",
            "domain",
            "level",
            "language",
            "estimated_hours",
            "is_active",
            "course_type",
            "deadline",
        ]
