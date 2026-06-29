from rest_framework import serializers
from institution.models import (
    TimeSlot, FacultySubjectAssignment, TimetableEntry
)


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'day', 'start_time',
            'end_time', 'is_break'
        ]


class FacultySubjectAssignmentSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(
        source='faculty.user.get_full_name', read_only=True
    )
    subject_name = serializers.CharField(
        source='subject.name', read_only=True
    )
    section_name = serializers.CharField(
        source='section.name', read_only=True
    )
    batch_name = serializers.CharField(
        source='batch.name', read_only=True
    )

    class Meta:
        model = FacultySubjectAssignment
        fields = [
            'id', 'faculty', 'faculty_name',
            'subject', 'subject_name',
            'section', 'section_name',
            'batch', 'batch_name',
            'role', 'is_active', 'created_at'
        ]


class FacultySubjectAssignmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultySubjectAssignment
        fields = [
            'faculty', 'subject', 'section',
            'batch', 'role'
        ]

    # FIX 1: INSTITUTION VALIDATION IN CREATE
    def validate(self, data):
        request = self.context.get('request')
        if not request or not hasattr(request.user, 'institution'):
            raise serializers.ValidationError("Authentication context missing.")

        institution = request.user.institution
        faculty = data.get('faculty')
        section = data.get('section')
        batch = data.get('batch')
        subject = data.get("subject")


        # Prevent cross-institution faculty assignment
        if faculty and faculty.institution != institution:
            raise serializers.ValidationError(
                {"faculty": "Invalid assignment. Faculty does not belong to your institution."}
            )

        # Prevent cross-institution section assignment
        if section and section.batch.program.department.institution != institution:
            raise serializers.ValidationError(
                {"section": "Invalid section. Section does not belong to your institution."}
            )
            
        # Prevent cross-institution batch assignment
        if batch and batch.program.department.institution != institution:
            raise serializers.ValidationError(
                {"batch": "Invalid batch. Batch does not belong to your institution."}
            )
        
        if subject:
            if (subject.program.department.institution!= institution):
                raise serializers.ValidationError(
                    {"subject":"Invalid subject."}
                )

        return data


class TimetableEntrySerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(
        source='assignment.faculty.user.get_full_name', read_only=True
    )
    subject_name = serializers.CharField(
        source='assignment.subject.name', read_only=True
    )
    section_name = serializers.CharField(
        source='section.name', read_only=True
    )
    day = serializers.CharField(
        source='timeslot.day', read_only=True
    )
    start_time = serializers.TimeField(
        source='timeslot.start_time', read_only=True
    )
    end_time = serializers.TimeField(
        source='timeslot.end_time', read_only=True
    )

    class Meta:
        model = TimetableEntry
        fields = [
            'id', 'assignment', 'section', 'section_name',
            'timeslot', 'day', 'start_time', 'end_time',
            'faculty_name', 'subject_name',
            'room', 'is_active'
        ]


class TimetableEntryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimetableEntry
        fields = [
            'assignment', 'section',
            'timeslot', 'room'
        ]

    def validate(self, data):
        request = self.context.get('request')
        if not request or not hasattr(request.user, 'institution'):
            raise serializers.ValidationError("Authentication context missing.")

        institution = request.user.institution

        assignment = data.get('assignment') or getattr(self.instance, 'assignment', None)
        section = data.get('section') or getattr(self.instance, 'section', None)
        timeslot = data.get('timeslot') or getattr(self.instance, 'timeslot', None)
        room = data.get('room') or getattr(self.instance, 'room', None)

        # ────────────────
        # 1. INSTITUTION VALIDATION
        # ────────────────
        if assignment and assignment.faculty.institution != institution:
            raise serializers.ValidationError(
                {"assignment": "Invalid assignment. Faculty not in your institution."}
            )

        if section and section.batch.program.department.institution != institution:
            raise serializers.ValidationError(
                {"section": "Invalid section. Not in your institution."}
            )

        # ────────────────
        # 2. BATCH CONSISTENCY CHECK
        # ────────────────
        if assignment and section:
            if assignment.batch != section.batch:
                raise serializers.ValidationError(
                    {"section": "Section must belong to the same batch as assignment"}
                )

        # ────────────────
        # 3. ACTIVE STATE VALIDATION (THE 1% POLISH)
        # ────────────────
        if assignment and hasattr(assignment, 'is_active') and not assignment.is_active:
            raise serializers.ValidationError(
                {"assignment": "Cannot use an inactive faculty assignment."}
            )
            
        if section and hasattr(section, 'is_active') and not section.is_active:
            raise serializers.ValidationError(
                {"section": "Cannot use an inactive section."}
            )
            
        if timeslot and hasattr(timeslot, 'is_active') and not timeslot.is_active:
            raise serializers.ValidationError(
                {"timeslot": "Cannot use an inactive timeslot."}
            )

        # ────────────────
        # 4. FACULTY CONFLICT CHECK
        # ────────────────
        if assignment and timeslot:
            qs = TimetableEntry.objects.filter(
                timeslot=timeslot,
                assignment__faculty=assignment.faculty,
                is_active=True
            )

            if self.instance:
                qs = qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError(
                    {"timeslot": "Faculty already assigned at this time"}
                )

        # ────────────────
        # 5. ROOM CONFLICT CHECK
        # ────────────────
        if room and timeslot:
            qs = TimetableEntry.objects.filter(
                timeslot=timeslot,
                room=room,
                is_active=True
            )

            if self.instance:
                qs = qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError(
                    {"room": f"Room {room} is already occupied at this time"}
                )

        return data


class ConflictSerializer(serializers.Serializer):
    faculty_name = serializers.CharField()
    subject_name = serializers.CharField()
    day = serializers.CharField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    conflict_type = serializers.ChoiceField(choices=[
        "faculty_clash",
        "room_clash",
    ]
    )
    details = serializers.CharField()


class SubstituteSerializer(serializers.Serializer):
    timetable_entry = serializers.IntegerField()
    substitute_faculty = serializers.IntegerField()
    date = serializers.DateField()
    reason = serializers.CharField(required=False)