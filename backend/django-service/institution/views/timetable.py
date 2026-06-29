from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

# Bringing in your paginator for the list views
from rest_framework.pagination import PageNumberPagination




from institution.models import (
    TimeSlot, FacultySubjectAssignment,
    TimetableEntry, FacultyProfile
)
from institution.serializers.timetable import (
    TimeSlotSerializer,
    FacultySubjectAssignmentSerializer,
    FacultySubjectAssignmentCreateSerializer,
    TimetableEntrySerializer,
    TimetableEntryCreateSerializer,
    ConflictSerializer,
    SubstituteSerializer,
)
from institution.permissions import CanManageTimetableScoped, IsInstitutionMember
from institution.scoping import (
    get_hod_department,
    get_user_institution,
    is_hod,
    scope_timetable_entries_for_user,
)


class InstitutionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# ─────────────────────────────────────────────
# TIME SLOT
# ─────────────────────────────────────────────

class TimeSlotListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get(self, request):
        # Filtering for active slots if you added the field for soft deletes
        # If is_active isn't on the model yet, just remove the filter
        slots = TimeSlot.objects.filter(is_active=True)

        day = request.query_params.get('day')
        if day:
            slots = slots.filter(day=day)

        # FIX 3: PAGINATION
        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(slots, request, view=self)
        if page is not None:
            serializer = TimeSlotSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = TimeSlotSerializer(slots, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TimeSlotSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TimeSlotDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get_object(self, slot_id):
        try:
            return TimeSlot.objects.get(id=slot_id, is_active=True)
        except TimeSlot.DoesNotExist:
            return None

    def get(self, request, slot_id):
        slot = self.get_object(slot_id)
        if not slot:
            return Response({'error': 'TimeSlot not found'}, status=404)
        return Response(TimeSlotSerializer(slot).data)

    def patch(self, request, slot_id):
        slot = self.get_object(slot_id)
        if not slot:
            return Response({'error': 'TimeSlot not found'}, status=404)

        serializer = TimeSlotSerializer(slot, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)

    def delete(self, request, slot_id):
        slot = self.get_object(slot_id)
        if not slot:
            return Response({'error': 'TimeSlot not found'}, status=404)

        # FIX 5: SOFT DELETE ON TIMESLOT
        slot.is_active = False
        slot.save()
        return Response({'message': 'TimeSlot deactivated'})


# ─────────────────────────────────────────────
# FACULTY SUBJECT ASSIGNMENT
# ─────────────────────────────────────────────

class FacultySubjectAssignmentListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get(self, request):
        institution = get_user_institution(request.user)
        assignments = FacultySubjectAssignment.objects.filter(
            faculty__institution=institution,
            is_active=True
        ).select_related(
            'faculty__user', 'subject', 'section', 'batch'
        )

        if is_hod(request.user):
            department = get_hod_department(request.user)
            assignments = assignments.filter(subject__program__department=department)

        faculty_id = request.query_params.get('faculty')
        section_id = request.query_params.get('section')
        batch_id = request.query_params.get('batch')

        # FIX 2: QUERY PARAM SAFETY
        if faculty_id and faculty_id.isdigit():
            assignments = assignments.filter(faculty_id=faculty_id)
        if section_id and section_id.isdigit():
            assignments = assignments.filter(section_id=section_id)
        if batch_id and batch_id.isdigit():
            assignments = assignments.filter(batch_id=batch_id)

        # FIX 3: PAGINATION
        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(assignments, request, view=self)
        if page is not None:
            serializer = FacultySubjectAssignmentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = FacultySubjectAssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request):
        # FIX 1: PASS CONTEXT TO SERIALIZER FOR INSTITUTION VALIDATION
        serializer = FacultySubjectAssignmentCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class FacultySubjectAssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get_object(self, assignment_id, institution):
        try:
            assignments = FacultySubjectAssignment.objects.select_related(
                'faculty__user', 'subject', 'section', 'batch'
            ).filter(
                id=assignment_id, 
                faculty__institution=institution,
                is_active=True
            )
            if is_hod(self.request.user):
                assignments = assignments.filter(
                    subject__program__department=get_hod_department(self.request.user)
                )
            return assignments.get()
        except FacultySubjectAssignment.DoesNotExist:
            return None

    def get(self, request, assignment_id):
        institution = get_user_institution(request.user)
        assignment = self.get_object(assignment_id, institution)

        if not assignment:
            return Response({'error': 'Assignment not found'}, status=404)

        return Response(FacultySubjectAssignmentSerializer(assignment).data)

    def patch(self, request, assignment_id):
        institution = get_user_institution(request.user)
        assignment = self.get_object(assignment_id, institution)

        if not assignment:
            return Response({'error': 'Assignment not found'}, status=404)

        # FIX 1: PASS CONTEXT TO SERIALIZER FOR UPDATE VALIDATION
        serializer = FacultySubjectAssignmentCreateSerializer(
            assignment, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(FacultySubjectAssignmentSerializer(assignment).data)

    def delete(self, request, assignment_id):
        institution = get_user_institution(request.user)
        assignment = self.get_object(assignment_id, institution)

        if not assignment:
            return Response({'error': 'Assignment not found'}, status=404)

        assignment.is_active = False
        assignment.save()
        return Response({'message': 'Assignment deactivated'})


# ─────────────────────────────────────────────
# TIMETABLE ENTRY
# ─────────────────────────────────────────────

class TimetableEntryListView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get(self, request):
        entries = scope_timetable_entries_for_user(
            TimetableEntry.objects.filter(is_active=True).select_related(
                'assignment__faculty__user',
                'assignment__subject',
                'section',
                'timeslot'
            ),
            request.user,
        )

        section_id = request.query_params.get('section')
        day = request.query_params.get('day')
        faculty_id = request.query_params.get('faculty')

        # FIX 2: QUERY PARAM SAFETY
        if section_id and section_id.isdigit():
            entries = entries.filter(section_id=section_id)
        if day:
            entries = entries.filter(timeslot__day=day) # String comparison, isdigit not needed
        if faculty_id and faculty_id.isdigit():
            entries = entries.filter(assignment__faculty_id=faculty_id)

        # FIX 3: PAGINATION
        paginator = InstitutionPagination()
        page = paginator.paginate_queryset(entries, request, view=self)
        if page is not None:
            serializer = TimetableEntrySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = TimetableEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        # FIX 1 & 6: PASS CONTEXT FOR CONFLICT CHECK AND INSTITUTION VALIDATION
        serializer = TimetableEntryCreateSerializer(
            data=request.data,
            context={'request': request}
        )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TimetableEntryDetailView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get_object(self, entry_id, institution):
        try:
            return scope_timetable_entries_for_user(
                TimetableEntry.objects.select_related(
                'assignment__faculty__user',
                'assignment__subject',
                'section',
                'timeslot'
                ),
                self.request.user,
            ).get(
                id=entry_id,
                assignment__faculty__institution=institution,
                is_active=True
            )
        except TimetableEntry.DoesNotExist:
            return None

    def get(self, request, entry_id):
        institution = get_user_institution(request.user)
        entry = self.get_object(entry_id, institution)

        if not entry:
            return Response({'error': 'Timetable entry not found'}, status=404)

        return Response(TimetableEntrySerializer(entry).data)

    def patch(self, request, entry_id):
        institution = get_user_institution(request.user)
        entry = self.get_object(entry_id, institution)

        if not entry:
            return Response({'error': 'Timetable entry not found'}, status=404)

        # FIX 1 & 6: PASS CONTEXT TO AVOID OVERRIDING CONFLICTS ON PATCH
        serializer = TimetableEntryCreateSerializer(
            entry, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(TimetableEntrySerializer(entry).data)

    def delete(self, request, entry_id):
        institution = get_user_institution(request.user)
        entry = self.get_object(entry_id, institution)

        if not entry:
            return Response({'error': 'Timetable entry not found'}, status=404)

        entry.is_active = False
        entry.save()
        return Response({'message': 'Timetable entry deactivated'})


# ─────────────────────────────────────────────
# PUBLISH TIMETABLE
# ─────────────────────────────────────────────

class TimetablePublishView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def post(self, request, section_id):
        if not str(section_id).isdigit():
            return Response({'error': 'Invalid section ID'}, status=400)

        institution = get_user_institution(request.user)

        entries = scope_timetable_entries_for_user(
            TimetableEntry.objects.filter(section_id=section_id),
            request.user,
        )

        if not entries.exists():
            return Response(
                {'error': 'No timetable entries found for this section'},
                status=404
            )

        entries.update(is_active=True)

        return Response({
            'message': f'Timetable published for section {section_id}',
            'entries_published': entries.count()
        })


# ─────────────────────────────────────────────
# CONFLICT DETECTION
# ─────────────────────────────────────────────

class TimetableConflictView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def get(self, request):
        entries = scope_timetable_entries_for_user(
            TimetableEntry.objects.filter(is_active=True).select_related(
                'assignment__faculty__user',
                'assignment__subject',
                'timeslot',
                'section'
            ),
            request.user,
        )

        conflicts = []

        # Faculty clash — same faculty, same timeslot, different sections
        seen = {}
        for entry in entries:
            key = (entry.assignment.faculty_id, entry.timeslot_id)
            if key in seen:
                conflicts.append({
                    'faculty_name': entry.assignment.faculty.user.get_full_name(),
                    'subject_name': entry.assignment.subject.name,
                    'day': entry.timeslot.day,
                    'start_time': entry.timeslot.start_time,
                    'end_time': entry.timeslot.end_time,
                    'conflict_type': 'faculty_clash',
                    'details': f'Also assigned to section {seen[key]} at same time'
                })
            else:
                seen[key] = entry.section.name

        # Room clash — same room, same timeslot
        room_seen = {}
        for entry in entries:
            if not entry.room:
                continue
            key = (entry.room, entry.timeslot_id)
            if key in room_seen:
                conflicts.append({
                    'faculty_name': entry.assignment.faculty.user.get_full_name(),
                    'subject_name': entry.assignment.subject.name,
                    'day': entry.timeslot.day,
                    'start_time': entry.timeslot.start_time,
                    'end_time': entry.timeslot.end_time,
                    'conflict_type': 'room_clash',
                    'details': f'Room {entry.room} also booked at same time'
                })
            else:
                room_seen[key] = entry.id

        serializer = ConflictSerializer(conflicts, many=True)
        return Response(serializer.data)


# ─────────────────────────────────────────────
# SUBSTITUTE FACULTY
# ─────────────────────────────────────────────

class SubstituteView(APIView):
    permission_classes = [IsAuthenticated, IsInstitutionMember, CanManageTimetableScoped]

    def post(self, request):
        institution = get_user_institution(request.user)
        serializer = SubstituteSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            entry = scope_timetable_entries_for_user(
                TimetableEntry.objects.all(),
                request.user,
            ).get(
                id=serializer.validated_data['timetable_entry'],
                assignment__faculty__institution=institution,
                is_active=True
            )
        except TimetableEntry.DoesNotExist:
            return Response({'error': 'Timetable entry not found'}, status=404)

        try:
            substitute = FacultyProfile.objects.get(
                id=serializer.validated_data['substitute_faculty'],
                institution=institution,
                status='active' # Ensuring substitute is active
            )
        except FacultyProfile.DoesNotExist:
            return Response({'error': 'Substitute faculty not found'}, status=404)

        return Response({
            'message': f'{substitute.user.get_full_name()} assigned as substitute',
            'date': serializer.validated_data['date'],
            'timetable_entry': entry.id,
            'original_faculty': entry.assignment.faculty.user.get_full_name(),
        })
