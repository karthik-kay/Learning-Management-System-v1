from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.db.models import Avg

from institution.models import (
    EvaluationComponent, StudentComponentScore,
    Exam, ExamSubject, ExamResult,
    SubjectResult, Assignment, Submission,
    InstitutionStudent, GradeScale
)
from institution.serializers.grades import (
    EvaluationComponentSerializer, EvaluationComponentCreateSerializer,
    StudentComponentScoreSerializer, StudentComponentScoreCreateSerializer,
    ExamSerializer, ExamCreateSerializer,
    ExamSubjectSerializer, ExamSubjectCreateSerializer,
    ExamResultSerializer, ExamResultCreateSerializer,
    SubjectResultSerializer,
    AssignmentSerializer, AssignmentCreateSerializer,
    SubmissionSerializer, SubmissionCreateSerializer,
    BulkScoreSerializer,
)
from institution.audit import log_institution_action
from institution.notifications import notify_user
from institution.permissions import CanManageGradesScoped, IsInstitutionMember
from institution.scoping import (
    get_hod_department,
    get_user_institution,
    is_hod,
    scope_students_for_user,
)


# ─────────────────────────────────────────────
# PAGINATION + BASE
# ─────────────────────────────────────────────

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class InstitutionScopedAPIView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageGradesScoped]

    def get_institution(self):
        return get_user_institution(self.request.user)

    def paginate(self, queryset, serializer_class, request):
        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)

        if page is not None:
            serializer = serializer_class(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data)


def filter_hod_department(queryset, user, lookup_path):
    if is_hod(user):
        return queryset.filter(**{lookup_path: get_hod_department(user)})
    return queryset

# ─────────────────────────────────────────────
# GRADE COMPUTATION HELPER
# ─────────────────────────────────────────────

def apply_grade(subject_result):
    """
    Looks up the institution's GradeScale and stamps grade + grade_point
    onto a SubjectResult instance. Call before .save().
    """
    institution = subject_result.student.institution
    total = subject_result.total_marks

    scale = GradeScale.objects.filter(
        institution=institution,
        min_marks__lte=total,
        max_marks__gte=total
    ).first()

    if scale:
        subject_result.grade = scale.grade
        subject_result.grade_point = scale.grade_point


# ─────────────────────────────────────────────
# EVALUATION COMPONENT
# ─────────────────────────────────────────────

class EvaluationComponentListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        components = EvaluationComponent.objects.filter(
            subject__program__department__institution=institution
        ).select_related('subject', 'batch', 'section')
        components = filter_hod_department(
            components,
            request.user,
            'subject__program__department',
        )

        subject_id = request.query_params.get('subject')
        batch_id = request.query_params.get('batch')

        if subject_id and subject_id.isdigit():
            components = components.filter(subject_id=subject_id)
        if batch_id and batch_id.isdigit():
            components = components.filter(batch_id=batch_id)

        return self.paginate(components, EvaluationComponentSerializer, request)

    def post(self, request):
        # FIX: context passed for institution validation in serializer
        serializer = EvaluationComponentCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EvaluationComponentDetailView(InstitutionScopedAPIView):

    def get_object(self, component_id, institution):
        try:
            return EvaluationComponent.objects.select_related(
                'subject', 'batch'
            ).get(
                id=component_id,
                subject__program__department__institution=institution
            )
        except EvaluationComponent.DoesNotExist:
            return None

    def get(self, request, component_id):
        component = self.get_object(component_id, self.get_institution())
        if not component:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(EvaluationComponentSerializer(component).data)

    def patch(self, request, component_id):
        component = self.get_object(component_id, self.get_institution())
        if not component:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)

        # FIX: context passed in PATCH too
        serializer = EvaluationComponentCreateSerializer(
            component, data=request.data, partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(EvaluationComponentSerializer(component).data)

    def delete(self, request, component_id):
        component = self.get_object(component_id, self.get_institution())
        if not component:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)

        component.delete()
        return Response({'message': 'Component deleted'})


# ─────────────────────────────────────────────
# STUDENT COMPONENT SCORES
# ─────────────────────────────────────────────

class StudentComponentScoreListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        scores = StudentComponentScore.objects.filter(
            component__subject__program__department__institution=institution
        ).select_related('component', 'student__user')
        scores = filter_hod_department(
            scores,
            request.user,
            'component__subject__program__department',
        )

        component_id = request.query_params.get('component')
        student_id = request.query_params.get('student')

        if component_id and component_id.isdigit():
            scores = scores.filter(component_id=component_id)
        if student_id and student_id.isdigit():
            scores = scores.filter(student_id=student_id)

        return self.paginate(scores, StudentComponentScoreSerializer, request)

    def post(self, request):
        serializer = StudentComponentScoreCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BulkScoreUploadView(InstitutionScopedAPIView):
    """
    Bulk enter marks for a component across all students.
    POST body: { component: id, scores: [{student: id, marks_obtained: float, is_absent: bool}] }
    """

    def post(self, request):
        institution = self.get_institution()
        component_id = request.data.get('component')
        scores = request.data.get('scores', [])

        try:
            components = EvaluationComponent.objects.filter(
                id=component_id,
                subject__program__department__institution=institution
            )
            components = filter_hod_department(
                components,
                request.user,
                'subject__program__department',
            )
            component = components.get()
        except EvaluationComponent.DoesNotExist:
            return Response({'error': 'Component not found'}, status=status.HTTP_404_NOT_FOUND)

        created = []
        errors = []

        # FIX: deduplicate student IDs in payload
        seen = set()

        with transaction.atomic():
            for entry in scores:
                student_id = entry.get('student')

                # FIX: skip duplicates
                if student_id in seen:
                    continue
                seen.add(student_id)

                # FIX: validate student belongs to same institution + batch
                student = scope_students_for_user(
                    InstitutionStudent.objects.filter(
                        id=student_id,
                        batch=component.batch,
                    ),
                    request.user,
                ).first()

                if not student:
                    errors.append({
                        'student': student_id,
                        'error': 'Invalid student or does not belong to this batch'
                    })
                    continue

                marks = entry.get('marks_obtained', 0)
                is_absent = entry.get('is_absent', False)

                # FIX: marks validation
                if not is_absent and marks > component.max_marks:
                    errors.append({
                        'student': student_id,
                        'error': f'marks_obtained ({marks}) exceeds max_marks ({component.max_marks})'
                    })
                    continue
                if marks < 0:
                    errors.append({
                        "student": student_id,
                        "error": "Marks cannot be negative"
                    })
                    continue

                try:
                    obj, _ = StudentComponentScore.objects.update_or_create(
                        component=component,
                        student=student,
                        defaults={
                            'marks_obtained': marks,
                            'is_absent': is_absent,
                        }
                    )
                    created.append(student_id)
                except Exception as e:
                    errors.append({'student': student_id, 'error': str(e)})

        return Response({
            'updated': len(created),
            'errors': errors
        })


# ─────────────────────────────────────────────
# EXAM
# ─────────────────────────────────────────────

class ExamListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        exams = Exam.objects.filter(
            batch__program__department__institution=institution
        ).select_related('batch')
        exams = filter_hod_department(exams, request.user, 'batch__program__department')

        batch_id = request.query_params.get('batch')
        exam_type = request.query_params.get('exam_type')

        if batch_id and batch_id.isdigit():
            exams = exams.filter(batch_id=batch_id)
        if exam_type:
            exams = exams.filter(exam_type=exam_type)

        return self.paginate(exams, ExamSerializer, request)

    def post(self, request):
        serializer = ExamCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ExamDetailView(InstitutionScopedAPIView):

    def get_object(self, exam_id, institution):
        try:
            return Exam.objects.select_related('batch').get(
                id=exam_id,
                batch__program__department__institution=institution
            )
        except Exam.DoesNotExist:
            return None

    def get(self, request, exam_id):
        exam = self.get_object(exam_id, self.get_institution())
        if not exam:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ExamSerializer(exam).data)

    def patch(self, request, exam_id):
        exam = self.get_object(exam_id, self.get_institution())
        if not exam:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExamCreateSerializer(
            exam, data=request.data, partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(ExamSerializer(exam).data)


class ExamPublishView(InstitutionScopedAPIView):

    def post(self, request, exam_id):
        institution = self.get_institution()
        try:
            exam = Exam.objects.get(
                id=exam_id,
                batch__program__department__institution=institution
            )
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        exam.is_published = True
        exam.save()
        log_institution_action(
            actor=request.user,
            action='result_published',
            target=exam,
            metadata={'exam_id': exam.id, 'exam_name': exam.name},
        )
        notify_user(
            request.user,
            title="Exam published",
            message=f"{exam.name} was published successfully.",
            metadata={"exam_id": exam.id},
        )
        return Response({'message': f'{exam.name} published successfully'})


# ─────────────────────────────────────────────
# EXAM SUBJECT
# ─────────────────────────────────────────────

class ExamSubjectListView(InstitutionScopedAPIView):

    def get(self, request, exam_id):
        institution = self.get_institution()
        exam_subjects = ExamSubject.objects.filter(
            exam_id=exam_id,
            exam__batch__program__department__institution=institution
        ).select_related('exam', 'subject')
        exam_subjects = filter_hod_department(
            exam_subjects,
            request.user,
            'exam__batch__program__department',
        )

        return self.paginate(exam_subjects, ExamSubjectSerializer, request)

    def post(self, request, exam_id):
        serializer = ExamSubjectCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────
# EXAM RESULTS
# ─────────────────────────────────────────────

class ExamResultListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        results = ExamResult.objects.filter(
            exam_subject__exam__batch__program__department__institution=institution
        ).select_related('exam_subject__subject', 'student__user')
        results = filter_hod_department(
            results,
            request.user,
            'exam_subject__exam__batch__program__department',
        )

        exam_subject_id = request.query_params.get('exam_subject')
        student_id = request.query_params.get('student')

        if exam_subject_id and exam_subject_id.isdigit():
            results = results.filter(exam_subject_id=exam_subject_id)
        if student_id and student_id.isdigit():
            results = results.filter(student_id=student_id)

        return self.paginate(results, ExamResultSerializer, request)

    def post(self, request):
        serializer = ExamResultCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────
# SUBJECT RESULT + GRADE COMPUTATION
# ─────────────────────────────────────────────

class SubjectResultListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        results = SubjectResult.objects.filter(
            student__institution=institution
        ).select_related('student__user', 'subject')
        results = filter_hod_department(results, request.user, 'student__department')

        student_id = request.query_params.get('student')
        subject_id = request.query_params.get('subject')

        if student_id and student_id.isdigit():
            results = results.filter(student_id=student_id)
        if subject_id and subject_id.isdigit():
            results = results.filter(subject_id=subject_id)

        return self.paginate(results, SubjectResultSerializer, request)


class SubjectResultComputeView(InstitutionScopedAPIView):
    """
    POST { student, subject, internal_marks, external_marks }
    Computes total, looks up grade scale, saves SubjectResult.
    This is the bridge between scores/exam → final result.
    """

    def post(self, request):
        institution = self.get_institution()

        student_id = request.data.get('student')
        subject_id = request.data.get('subject')
        internal_marks = request.data.get('internal_marks')
        external_marks = request.data.get('external_marks')

        

        if not all([student_id, subject_id, internal_marks is not None, external_marks is not None]):
            return Response(
                {'error': 'student, subject, internal_marks, external_marks are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if internal_marks < 0 or external_marks < 0:
            return Response({'error': 'Marks cannot be negative'}, status=400)

        try:
            student = scope_students_for_user(
                InstitutionStudent.objects.filter(id=student_id),
                request.user,
            ).get()
        except InstitutionStudent.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        # FIX: compute total + apply grade scale
        total_marks = float(internal_marks) + float(external_marks)

        result, _ = SubjectResult.objects.get_or_create(
            student=student,
            subject_id=subject_id
        )

        result.internal_marks = internal_marks
        result.external_marks = external_marks
        result.total_marks = total_marks

        # FIX: apply grade from institution's GradeScale — without this CGPA breaks
        apply_grade(result)

        result.save()
        log_institution_action(
            actor=request.user,
            action='grade_overridden',
            target=result,
            reason=request.data.get('reason', ''),
            metadata={
                'student_id': student.id,
                'subject_id': subject_id,
                'total_marks': total_marks,
                'grade': result.grade,
            },
        )
        notify_user(
            student.user,
            title="Grade updated",
            message=f"Your grade for subject {subject_id} has been updated.",
            metadata={
                "student_id": student.id,
                "subject_id": subject_id,
                "grade": result.grade,
            },
        )

        return Response(SubjectResultSerializer(result).data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────
# CGPA
# ─────────────────────────────────────────────

class StudentCGPAView(InstitutionScopedAPIView):
    """
    Computes CGPA for a student on the fly.
    Formula: sum(grade_point * credits) / sum(credits)
    """

    def get(self, request, student_id):
        institution = self.get_institution()

        try:
            student = scope_students_for_user(
                InstitutionStudent.objects.filter(id=student_id),
                request.user,
            ).get()
        except InstitutionStudent.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

        results = SubjectResult.objects.filter(
            student=student,
            grade_point__isnull=False
        ).select_related('subject')

        total_credit_points = 0
        total_credits = 0

        for result in results:
            credits = result.subject.credits or 0
            total_credit_points += result.grade_point * credits
            total_credits += credits

        cgpa = round(total_credit_points / total_credits, 2) if total_credits > 0 else 0

        return Response({
            'student': student.user.get_full_name(),
            'enrollment_number': student.enrollment_number,
            'cgpa': cgpa,
            'total_credits_completed': total_credits,
            'subjects_counted': results.count()
        })


class PublishResultView(InstitutionScopedAPIView):

    def post(self, request, exam_id):
        institution = self.get_institution()

        try:
            exam = Exam.objects.get(
                id=exam_id,
                batch__program__department__institution=institution
            )
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        exam.is_published = True
        exam.save()
        log_institution_action(
            actor=request.user,
            action='result_published',
            target=exam,
            metadata={'exam_id': exam.id, 'exam_name': exam.name},
        )
        notify_user(
            request.user,
            title="Results published",
            message=f"Results for {exam.name} were published successfully.",
            metadata={"exam_id": exam.id},
        )

        return Response({'message': f'Results for {exam.name} published'})


# ─────────────────────────────────────────────
# ASSIGNMENT
# ─────────────────────────────────────────────

class AssignmentListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        assignments = Assignment.objects.filter(
            component__subject__program__department__institution=institution
        ).select_related('component__subject')
        assignments = filter_hod_department(
            assignments,
            request.user,
            'component__subject__program__department',
        )

        component_id = request.query_params.get('component')
        if component_id and component_id.isdigit():
            assignments = assignments.filter(component_id=component_id)

        return self.paginate(assignments, AssignmentSerializer, request)

    def post(self, request):
        serializer = AssignmentCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AssignmentDetailView(InstitutionScopedAPIView):

    def get_object(self, assignment_id, institution):
        try:
            return Assignment.objects.select_related(
                'component__subject'
            ).get(
                id=assignment_id,
                component__subject__program__department__institution=institution
            )
        except Assignment.DoesNotExist:
            return None

    def get(self, request, assignment_id):
        assignment = self.get_object(assignment_id, self.get_institution())
        if not assignment:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(AssignmentSerializer(assignment).data)

    def patch(self, request, assignment_id):
        assignment = self.get_object(assignment_id, self.get_institution())
        if not assignment:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AssignmentCreateSerializer(
            assignment, data=request.data, partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(AssignmentSerializer(assignment).data)

    def delete(self, request, assignment_id):
        assignment = self.get_object(assignment_id, self.get_institution())
        if not assignment:
            return Response({'error': 'Assignment not found'}, status=status.HTTP_404_NOT_FOUND)

        assignment.delete()
        return Response({'message': 'Assignment deleted'})


# ─────────────────────────────────────────────
# SUBMISSION
# ─────────────────────────────────────────────

class SubmissionListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        submissions = Submission.objects.filter(
            assignment__component__subject__program__department__institution=institution
        ).select_related('assignment', 'student__user')
        submissions = filter_hod_department(
            submissions,
            request.user,
            'assignment__component__subject__program__department',
        )

        assignment_id = request.query_params.get('assignment')
        student_id = request.query_params.get('student')

        if assignment_id and assignment_id.isdigit():
            submissions = submissions.filter(assignment_id=assignment_id)
        if student_id and student_id.isdigit():
            submissions = submissions.filter(student_id=student_id)

        return self.paginate(submissions, SubmissionSerializer, request)

    def post(self, request):
        serializer = SubmissionCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubmissionMarkView(InstitutionScopedAPIView):
    """Faculty enters marks for a submission."""

    def patch(self, request, submission_id):
        institution = self.get_institution()
        try:
            submission = Submission.objects.get(
                id=submission_id,
                assignment__component__subject__program__department__institution=institution
            )
        except Submission.DoesNotExist:
            return Response({'error': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

        marks = request.data.get('marks')
        if marks is None:
            return Response({'error': 'marks is required'}, status=status.HTTP_400_BAD_REQUEST)

        # FIX: marks validation
        if marks > submission.assignment.component.max_marks:
            return Response(
                {'error': f'Marks cannot exceed {submission.assignment.component.max_marks}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        submission.marks = marks
        submission.save()

        return Response(SubmissionSerializer(submission).data)
