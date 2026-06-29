from rest_framework import serializers
from institution.models import (
    EvaluationComponent, StudentComponentScore,
    Exam, ExamSubject, ExamResult,
    SubjectResult, Assignment, Submission
)


# ─────────────────────────────────────────────
# EVALUATION COMPONENT
# ─────────────────────────────────────────────

class EvaluationComponentSerializer(serializers.ModelSerializer):
    # FIX: SerializerMethodField to avoid null-chain crashes
    subject_name = serializers.SerializerMethodField()
    batch_name = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationComponent
        fields = [
            'id', 'subject', 'subject_name', 'batch', 'batch_name',
            'section', 'semester', 'name', 'component_type',
            'max_marks', 'weightage', 'is_internal', 'created_at'
        ]

    def get_subject_name(self, obj):
        try:
            return obj.subject.name
        except AttributeError:
            return None

    def get_batch_name(self, obj):
        try:
            return obj.batch.name
        except AttributeError:
            return None


class EvaluationComponentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationComponent
        fields = [
            'subject', 'batch', 'section', 'semester',
            'name', 'component_type', 'max_marks',
            'weightage', 'is_internal'
        ]

    # FIX: institution validation via request context
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        subject = data.get('subject')

        if subject and institution:
            try:
                if subject.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid subject")
            except AttributeError:
                raise serializers.ValidationError("Invalid subject structure")

        return data


# ─────────────────────────────────────────────
# STUDENT COMPONENT SCORE
# ─────────────────────────────────────────────

class StudentComponentScoreSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    enrollment_number = serializers.SerializerMethodField()
    component_name = serializers.SerializerMethodField()

    class Meta:
        model = StudentComponentScore
        fields = [
            'id', 'component', 'component_name',
            'student', 'student_name', 'enrollment_number',
            'marks_obtained', 'is_absent'
        ]

    def get_student_name(self, obj):
        try:
            return obj.student.user.get_full_name()
        except AttributeError:
            return None

    def get_enrollment_number(self, obj):
        try:
            return obj.student.enrollment_number
        except AttributeError:
            return None

    def get_component_name(self, obj):
        try:
            return obj.component.name
        except AttributeError:
            return None


class StudentComponentScoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentComponentScore
        fields = ['component', 'student', 'marks_obtained', 'is_absent']
    
    def validate(self, data):
        component = data.get("component")
        marks = data.get("marks_obtained")
        is_absent = data.get("is_absent", False)

        if marks is not None and marks < 0:
            raise serializers.ValidationError(
                "Marks cannot be negative"
            )

        if component and marks is not None and not is_absent:
            if marks > component.max_marks:
                raise serializers.ValidationError(
                    f"marks_obtained ({marks}) "
                    f"cannot exceed "
                    f"component max_marks "
                    f"({component.max_marks})"
                )

        return data


# ─────────────────────────────────────────────
# EXAM
# ─────────────────────────────────────────────

class ExamSerializer(serializers.ModelSerializer):
    batch_name = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = [
            'id', 'name', 'batch', 'batch_name',
            'exam_type', 'start_date', 'end_date', 'is_published'
        ]

    def get_batch_name(self, obj):
        try:
            return obj.batch.name
        except AttributeError:
            return None


class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            'name', 'batch', 'exam_type',
            'start_date', 'end_date'
        ]

    # FIX: institution validation
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        batch = data.get('batch')

        if batch and institution:
            try:
                if batch.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid batch")
            except AttributeError:
                raise serializers.ValidationError("Invalid batch structure")

        return data


# ─────────────────────────────────────────────
# EXAM SUBJECT
# ─────────────────────────────────────────────

class ExamSubjectSerializer(serializers.ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    exam_name = serializers.SerializerMethodField()

    class Meta:
        model = ExamSubject
        fields = [
            'id', 'exam', 'exam_name',
            'subject', 'subject_name', 'max_marks'
        ]

    def get_subject_name(self, obj):
        try:
            return obj.subject.name
        except AttributeError:
            return None

    def get_exam_name(self, obj):
        try:
            return obj.exam.name
        except AttributeError:
            return None


class ExamSubjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSubject
        fields = ['exam', 'subject', 'max_marks']

    # FIX: institution validation — exam and subject must belong to same institution
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        exam = data.get('exam')
        subject = data.get('subject')

        if institution:
            try:
                if exam and exam.batch.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid exam")
                if subject and subject.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid subject")
            except AttributeError:
                raise serializers.ValidationError("Invalid exam or subject structure")

        return data


# ─────────────────────────────────────────────
# EXAM RESULT
# ─────────────────────────────────────────────

class ExamResultSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    enrollment_number = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    max_marks = serializers.SerializerMethodField()

    class Meta:
        model = ExamResult
        fields = [
            'id', 'exam_subject', 'subject_name', 'max_marks',
            'student', 'student_name', 'enrollment_number',
            'marks_obtained', 'is_absent'
        ]

    def get_student_name(self, obj):
        try:
            return obj.student.user.get_full_name()
        except AttributeError:
            return None

    def get_enrollment_number(self, obj):
        try:
            return obj.student.enrollment_number
        except AttributeError:
            return None

    def get_subject_name(self, obj):
        try:
            return obj.exam_subject.subject.name
        except AttributeError:
            return None

    def get_max_marks(self, obj):
        try:
            return obj.exam_subject.max_marks
        except AttributeError:
            return None


class ExamResultCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamResult
        fields = ['exam_subject', 'student', 'marks_obtained', 'is_absent']

    def validate(self, data):
        exam_subject = data.get("exam_subject")
        marks = data.get("marks_obtained")
        is_absent = data.get("is_absent", False)

        if marks is not None and marks < 0:
            raise serializers.ValidationError(
                "Marks cannot be negative"
            )

        if (
            exam_subject
            and marks is not None
            and not is_absent
        ):
            if marks > exam_subject.max_marks:
                raise serializers.ValidationError(
                    f"marks_obtained ({marks}) "
                    f"cannot exceed "
                    f"max_marks "
                    f"({exam_subject.max_marks})"
                )

        return data


# ─────────────────────────────────────────────
# SUBJECT RESULT
# ─────────────────────────────────────────────

class SubjectResultSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    enrollment_number = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    credits = serializers.SerializerMethodField()

    class Meta:
        model = SubjectResult
        fields = [
            'id', 'student', 'student_name', 'enrollment_number',
            'subject', 'subject_name', 'credits',
            'internal_marks', 'external_marks',
            'total_marks', 'grade', 'grade_point'
        ]

    def get_student_name(self, obj):
        try:
            return obj.student.user.get_full_name()
        except AttributeError:
            return None

    def get_enrollment_number(self, obj):
        try:
            return obj.student.enrollment_number
        except AttributeError:
            return None

    def get_subject_name(self, obj):
        try:
            return obj.subject.name
        except AttributeError:
            return None

    def get_credits(self, obj):
        try:
            return obj.subject.credits
        except AttributeError:
            return None


# ─────────────────────────────────────────────
# ASSIGNMENT
# ─────────────────────────────────────────────

class AssignmentSerializer(serializers.ModelSerializer):
    component_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            'id', 'component', 'component_name',
            'subject_name', 'title', 'description', 'due_date'
        ]

    def get_component_name(self, obj):
        try:
            return obj.component.name
        except AttributeError:
            return None

    def get_subject_name(self, obj):
        try:
            return obj.component.subject.name
        except AttributeError:
            return None


class AssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['component', 'title', 'description', 'due_date']

    # FIX: institution validation
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        component = data.get('component')

        if component and institution:
            try:
                if component.subject.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid component")
            except AttributeError:
                raise serializers.ValidationError("Invalid component structure")

        return data


# ─────────────────────────────────────────────
# SUBMISSION
# ─────────────────────────────────────────────

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    enrollment_number = serializers.SerializerMethodField()
    assignment_title = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            'id', 'assignment', 'assignment_title',
            'student', 'student_name', 'enrollment_number',
            'file', 'marks', 'is_late', 'submitted_at'
        ]

    def get_student_name(self, obj):
        try:
            return obj.student.user.get_full_name()
        except AttributeError:
            return None

    def get_enrollment_number(self, obj):
        try:
            return obj.student.enrollment_number
        except AttributeError:
            return None

    def get_assignment_title(self, obj):
        try:
            return obj.assignment.title
        except AttributeError:
            return None


class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['assignment', 'student', 'file']

    # FIX: institution validation
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        assignment = data.get('assignment')

        if assignment and institution:
            try:
                if assignment.component.subject.program.department.institution != institution:
                    raise serializers.ValidationError("Invalid assignment")
            except AttributeError:
                raise serializers.ValidationError("Invalid assignment structure")

        return data


# ─────────────────────────────────────────────
# BULK
# ─────────────────────────────────────────────

class BulkScoreSerializer(serializers.Serializer):
    component = serializers.IntegerField()
    scores = serializers.ListField(
        child=serializers.DictField()
    )
    # scores format:
    # [{ student: id, marks_obtained: float, is_absent: bool }]