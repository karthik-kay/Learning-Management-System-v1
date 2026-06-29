from rest_framework import serializers
from institution.models import AttendanceSession, AttendanceRecord, LeaveApplication


class AttendanceSessionSerializer(serializers.ModelSerializer):
    # FIX 1: SerializerMethodField to avoid crash on null chain
    subject_name = serializers.SerializerMethodField()
    faculty_name = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceSession
        fields = [
            'id', 'timetable_entry', 'subject_name',
            'faculty_name', 'section_name',
            'date', 'topic', 'is_cancelled', 'created_at'
        ]

    def get_subject_name(self, obj):
        try:
            return obj.timetable_entry.assignment.subject.name
        except AttributeError:
            return None

    def get_faculty_name(self, obj):
        try:
            return obj.conducted_by.user.get_full_name()
        except AttributeError:
            return None

    def get_section_name(self, obj):
        try:
            return obj.timetable_entry.section.name
        except AttributeError:
            return None


class AttendanceSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSession
        fields = [
            'timetable_entry', 'date',
            'conducted_by', 'topic'
        ]

    # FIX 2: institution validation via request context
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None
        faculty = data.get('conducted_by')


        timetable = data.get('timetable_entry')

        if faculty and timetable:
            if faculty != timetable.assignment.faculty:
                raise serializers.ValidationError("Faculty mismatch with timetable assignment")

        if timetable and institution:
            try:
                if timetable.assignment.faculty.institution != institution:
                    raise serializers.ValidationError("Invalid timetable entry")
            except AttributeError:
                raise serializers.ValidationError("Invalid timetable entry structure")

        return data


class AttendanceRecordSerializer(serializers.ModelSerializer):
    # FIX 1: same safe pattern for nested fields
    student_name = serializers.SerializerMethodField()
    enrollment_number = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'session', 'student', 'student_name',
            'enrollment_number', 'status', 'remarks'
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


class AttendanceRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['session', 'student', 'status', 'remarks']
    
    def validate(self, data):
        request = self.context.get("request")
        institution = request.user.institution if request else None

        session = data.get("session")
        student = data.get("student")

        if session and institution:
            try:
                if (
                    session
                    .timetable_entry
                    .assignment
                    .faculty
                    .institution
                    != institution
                ):
                    raise serializers.ValidationError(
                        "Invalid session"
                    )
            except AttributeError:
                raise serializers.ValidationError(
                    "Invalid session"
                )

        if student and institution:
            if student.institution != institution:
                raise serializers.ValidationError(
                    "Invalid student"
                )

        return data


class BulkAttendanceSerializer(serializers.Serializer):
    session = serializers.IntegerField()
    records = serializers.ListField(
        child=serializers.DictField()
    )
    # records format:
    # [{ student: id, status: present/absent/late, remarks: '' }]


class AttendanceShortageSerializer(serializers.Serializer):
    student_name = serializers.CharField()
    enrollment_number = serializers.CharField()
    department = serializers.CharField()
    total_classes = serializers.IntegerField()
    attended = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()
    shortage = serializers.FloatField()


class LeaveApplicationSerializer(serializers.ModelSerializer):
    applicant_type = serializers.SerializerMethodField()
    applicant_name = serializers.SerializerMethodField()
    applicant_identifier = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()
    batch_name = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.CharField(
        source="reviewed_by.get_full_name", read_only=True, allow_null=True
    )
    affected_sessions = serializers.SerializerMethodField()
    recorded_absences = serializers.SerializerMethodField()

    class Meta:
        model = LeaveApplication
        fields = [
            "id",
            "student",
            "faculty",
            "applicant_type",
            "applicant_name",
            "applicant_identifier",
            "department_name",
            "batch_name",
            "section_name",
            "from_date",
            "to_date",
            "reason",
            "document_url",
            "attachment",
            "status",
            "reviewed_by",
            "reviewed_by_name",
            "reviewed_at",
            "review_note",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "status",
            "reviewed_by",
            "reviewed_at",
            "created_at",
            "updated_at",
        ]

    def get_applicant_type(self, obj):
        return "student" if obj.student_id else "faculty"

    def get_applicant_name(self, obj):
        applicant = obj.student or obj.faculty
        return applicant.user.get_full_name() if applicant else None

    def get_applicant_identifier(self, obj):
        if obj.student_id:
            return obj.student.enrollment_number
        return obj.faculty.employee_id if obj.faculty_id else None

    def get_department_name(self, obj):
        applicant = obj.student or obj.faculty
        return applicant.department.name if applicant and applicant.department else None

    def get_batch_name(self, obj):
        return obj.student.batch.name if obj.student_id and obj.student.batch else None

    def get_section_name(self, obj):
        return obj.student.section.name if obj.student_id and obj.student.section else None

    def get_affected_sessions(self, obj):
        if not obj.student_id or not obj.student.section_id:
            return 0
        return AttendanceSession.objects.filter(
            timetable_entry__section=obj.student.section,
            date__range=(obj.from_date, obj.to_date),
            is_cancelled=False,
        ).count()

    def get_recorded_absences(self, obj):
        if not obj.student_id:
            return 0
        return AttendanceRecord.objects.filter(
            student=obj.student,
            session__date__range=(obj.from_date, obj.to_date),
            status="absent",
        ).count()

    def validate(self, attrs):
        request = self.context.get("request")
        institution = request.user.institution if request else None
        student = attrs.get("student")
        faculty = attrs.get("faculty")

        if bool(student) == bool(faculty):
            raise serializers.ValidationError("Choose exactly one student or faculty applicant")

        applicant = student or faculty
        if institution and applicant.institution_id != institution.id:
            raise serializers.ValidationError("Invalid applicant for this institution")

        return attrs


class LeaveDecisionSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=["approved", "rejected"])
    review_note = serializers.CharField(required=False, allow_blank=True)


class UnlockAttendanceSerializer(serializers.Serializer):
    reason = serializers.CharField()
