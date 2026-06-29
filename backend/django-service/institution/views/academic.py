from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from institution.models import (
    Department, Program, AcademicBatch, Section, Subject, Degree
)
from institution.serializers.academic import (
    DegreeSerializer,
    DepartmentSerializer, DepartmentCreateSerializer,
    ProgramSerializer, ProgramCreateSerializer,
    BatchSerializer, BatchCreateSerializer,
    SectionSerializer, SectionCreateSerializer,
    SubjectSerializer, SubjectCreateSerializer,
)
from institution.permissions import CanManageAcademicScoped, IsInstitutionMember
from institution.scoping import (
    ensure_department_allowed,
    get_user_institution,
    scope_batches_for_user,
    scope_departments_for_user,
    scope_programs_for_user,
    scope_sections_for_user,
    scope_subjects_for_user,
)


# ─────────────────────────────────────────────
# PAGINATION
# ─────────────────────────────────────────────

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ─────────────────────────────────────────────
# BASE VIEW
# ─────────────────────────────────────────────

class InstitutionScopedAPIView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageAcademicScoped]

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

# ─────────────────────────────────────────────
# DEGREE VIEWS
# ─────────────────────────────────────────────

class DegreeListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        degrees = Degree.objects.filter(institution=institution, is_active=True).order_by('name')
        return self.paginate(degrees, DegreeSerializer, request)

    def post(self, request):
        institution = self.get_institution()
        serializer = DegreeSerializer(
        data=request.data,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(institution=institution)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DegreeDetailView(InstitutionScopedAPIView):

    def get(self, request, degree_id):
        institution = self.get_institution()
        try:
            degree = Degree.objects.get(id=degree_id, institution=institution)
        except Degree.DoesNotExist:
            return Response({'error': 'Degree not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(DegreeSerializer(degree).data)

    def patch(self, request, degree_id):
        institution = self.get_institution()
        try:
            degree = Degree.objects.get(id=degree_id, institution=institution)
        except Degree.DoesNotExist:
            return Response({'error': 'Degree not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DegreeSerializer(
        degree,
        data=request.data,
        partial=True,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

    def delete(self, request, degree_id):
        institution = self.get_institution()
        try:
            degree = Degree.objects.get(id=degree_id, institution=institution)
        except Degree.DoesNotExist:
            return Response({'error': 'Degree not found'}, status=status.HTTP_404_NOT_FOUND)

        degree.is_active = False
        degree.save()
        return Response({'message': 'Degree deactivated'})


# ─────────────────────────────────────────────
# DEPARTMENT VIEWS
# ─────────────────────────────────────────────

class DepartmentListView(InstitutionScopedAPIView):

    def get(self, request):
        departments = scope_departments_for_user(
            Department.objects.select_related('hod', 'hod__user'),
            request.user,
        ).order_by('name')

        is_active = request.query_params.get('is_active')
        if is_active is not None:
            is_active = is_active.lower() == 'true'
            departments = departments.filter(is_active=is_active)

        return self.paginate(departments, DepartmentSerializer, request)

    def post(self, request):
        institution = self.get_institution()
        serializer = DepartmentCreateSerializer(
        data=request.data,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(institution=institution)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DepartmentDetailView(InstitutionScopedAPIView):

    def get_object(self, dept_id, institution):
        return scope_departments_for_user(
            Department.objects.select_related('hod', 'hod__user'),
            self.request.user,
        ).filter(id=dept_id, institution=institution).first()

    def get(self, request, dept_id):
        dept = self.get_object(dept_id, self.get_institution())
        if not dept:
            return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DepartmentSerializer(dept).data)

    def patch(self, request, dept_id):
        dept = self.get_object(dept_id, self.get_institution())
        if not dept:
            return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DepartmentCreateSerializer(dept, data=request.data, partial=True,context={"request": request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(DepartmentSerializer(dept).data)

    def delete(self, request, dept_id):
        dept = self.get_object(dept_id, self.get_institution())
        if not dept:
            return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

        dept.is_active = False
        dept.save()
        return Response({'message': 'Department deactivated'})


# ─────────────────────────────────────────────
# PROGRAM VIEWS
# ─────────────────────────────────────────────

class ProgramListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        programs = scope_programs_for_user(
            Program.objects.select_related('department', 'degree'),
            request.user,
        ).order_by('name')

        dept_id = request.query_params.get('department')
        if dept_id and dept_id.isdigit():
            programs = programs.filter(department_id=dept_id)

        return self.paginate(programs, ProgramSerializer, request)

    def post(self, request):
        institution = self.get_institution()
        serializer = ProgramCreateSerializer(
        data=request.data,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(request.user, serializer.validated_data["department"])
        program = serializer.save()
        

        return Response(ProgramSerializer(program).data, status=status.HTTP_201_CREATED)


class ProgramDetailView(InstitutionScopedAPIView):

    def get_object(self, program_id, institution):
        return scope_programs_for_user(
            Program.objects.select_related('department', 'degree'),
            self.request.user,
        ).filter(id=program_id, department__institution=institution).first()

    def get(self, request, program_id):
        program = self.get_object(program_id, self.get_institution())
        if not program:
            return Response({'error': 'Program not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ProgramSerializer(program).data)

    def patch(self, request, program_id):
        institution = self.get_institution()
        program = self.get_object(program_id, institution)
        if not program:
            return Response({'error': 'Program not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProgramCreateSerializer(
        program,
        data=request.data,
        partial=True,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(
            request.user,
            serializer.validated_data.get("department") or program.department,
        )
        updated_program = serializer.save()


        return Response(ProgramSerializer(updated_program).data)

    def delete(self, request, program_id):
        program = self.get_object(program_id, self.get_institution())
        if not program:
            return Response({'error': 'Program not found'}, status=status.HTTP_404_NOT_FOUND)

        program.is_active = False
        program.save()
        return Response({'message': 'Program deactivated'})


# ─────────────────────────────────────────────
# BATCH VIEWS
# ─────────────────────────────────────────────

class BatchListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        batches = scope_batches_for_user(
            AcademicBatch.objects.select_related('program__department'),
            request.user,
        ).order_by('-start_year')

        program_id = request.query_params.get('program')
        status_filter = request.query_params.get('status')

        if program_id and program_id.isdigit():
            batches = batches.filter(program_id=int(program_id))
        if status_filter:
            batches = batches.filter(status=status_filter)

        return self.paginate(batches, BatchSerializer, request)

    def post(self, request):
        institution = self.get_institution()
        serializer = BatchCreateSerializer(
        data=request.data,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(request.user, serializer.validated_data["program"].department)
        batch = serializer.save()


        return Response(BatchSerializer(batch).data, status=status.HTTP_201_CREATED)


class BatchDetailView(InstitutionScopedAPIView):

    def get_object(self, batch_id, institution):
        return scope_batches_for_user(
            AcademicBatch.objects.select_related('program__department'),
            self.request.user,
        ).filter(id=batch_id, program__department__institution=institution).first()

    def get(self, request, batch_id):
        batch = self.get_object(batch_id, self.get_institution())
        if not batch:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(BatchSerializer(batch).data)

    def patch(self, request, batch_id):
        institution = self.get_institution()
        batch = self.get_object(batch_id, institution)
        if not batch:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BatchCreateSerializer(
        batch,
        data=request.data,
        partial=True,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(
            request.user,
            (serializer.validated_data.get("program") or batch.program).department,
        )
        updated_batch = serializer.save()

        return Response(BatchSerializer(updated_batch).data)

    def delete(self, request, batch_id):
        batch = self.get_object(batch_id, self.get_institution())
        if not batch:
            return Response({'error': 'Batch not found'}, status=status.HTTP_404_NOT_FOUND)

        batch.status = 'completed'
        batch.save()
        return Response({'message': 'Batch archived'})


# ─────────────────────────────────────────────
# SECTION VIEWS
# ─────────────────────────────────────────────

class SectionListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()
        sections = scope_sections_for_user(
            Section.objects.select_related('batch__program__department', 'class_teacher'),
            request.user,
        ).order_by('name')

        batch_id = request.query_params.get('batch')
        if batch_id and batch_id.isdigit():
            sections = sections.filter(batch_id=int(batch_id))

        return self.paginate(sections, SectionSerializer, request)

    def post(self, request):
        institution = self.get_institution()
        serializer = SectionCreateSerializer(
        data=request.data,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(
            request.user,
            serializer.validated_data["batch"].program.department,
        )
        section = serializer.save()

        return Response(SectionSerializer(section).data, status=status.HTTP_201_CREATED)


class SectionDetailView(InstitutionScopedAPIView):

    def get_object(self, section_id, institution):
        return scope_sections_for_user(
            Section.objects.select_related('batch__program__department', 'class_teacher'),
            self.request.user,
        ).filter(id=section_id, batch__program__department__institution=institution).first()

    def get(self, request, section_id):
        section = self.get_object(section_id, self.get_institution())
        if not section:
            return Response({'error': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(SectionSerializer(section).data)

    def patch(self, request, section_id):
        institution = self.get_institution()
        section = self.get_object(section_id, institution)
        if not section:
            return Response({'error': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SectionCreateSerializer(
        section,
        data=request.data,
        partial=True,
        context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(
            request.user,
            (serializer.validated_data.get("batch") or section.batch).program.department,
        )
        updated_section = serializer.save()


        return Response(SectionSerializer(updated_section).data)

    def delete(self, request, section_id):
        section = self.get_object(section_id, self.get_institution())
        if not section:
            return Response({'error': 'Section not found'}, status=status.HTTP_404_NOT_FOUND)

        section.is_active = False
        section.save()
        return Response({'message': 'Section deactivated'})


# ─────────────────────────────────────────────
# SUBJECT VIEWS
# ─────────────────────────────────────────────

class SubjectListView(InstitutionScopedAPIView):

    def get(self, request):
        institution = self.get_institution()

        subjects = scope_subjects_for_user(
            Subject.objects.select_related('program__department'),
            request.user,
        ).order_by('semester', 'name')

        program_id = request.query_params.get('program')
        semester = request.query_params.get('semester')
        
        if program_id and program_id.isdigit():
            subjects = subjects.filter(program_id=int(program_id))

        if semester and semester.isdigit():
            subjects = subjects.filter(semester=int(semester))

        return self.paginate(subjects, SubjectSerializer, request)

    def post(self, request):
        serializer = SubjectCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(request.user, serializer.validated_data["program"].department)
        subject = serializer.save()

        return Response(SubjectSerializer(subject).data, status=status.HTTP_201_CREATED)


class SubjectDetailView(InstitutionScopedAPIView):

    def get_object(self, subject_id, institution):
        return scope_subjects_for_user(
            Subject.objects.select_related('program__department'),
            self.request.user,
        ).filter(id=subject_id, program__department__institution=institution).first()

    def get(self, request, subject_id):
        subject = self.get_object(subject_id, self.get_institution())
        if not subject:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(SubjectSerializer(subject).data)

    def patch(self, request, subject_id):
        institution = self.get_institution()
        subject = self.get_object(subject_id, institution)

        if not subject:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubjectCreateSerializer(
            subject,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        ensure_department_allowed(
            request.user,
            (serializer.validated_data.get("program") or subject.program).department,
        )
        updated_subject = serializer.save()

        return Response(SubjectSerializer(updated_subject).data)

    def delete(self, request, subject_id):
        subject = self.get_object(subject_id, self.get_institution())
        if not subject:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        subject.is_active = False
        subject.save()
        return Response({'message': 'Subject deactivated'})
