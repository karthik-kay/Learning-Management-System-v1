from rest_framework import serializers


class AttendanceReportSerializer(serializers.Serializer):
    student_name = serializers.CharField()
    enrollment_number = serializers.CharField()
    department = serializers.CharField()
    program = serializers.CharField()
    batch = serializers.CharField()
    total_classes = serializers.IntegerField()
    attended = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()
    is_shortage = serializers.BooleanField()


class SubjectAttendanceSerializer(serializers.Serializer):
    subject_name = serializers.CharField()
    subject_code = serializers.CharField()
    total_classes = serializers.IntegerField()
    attended = serializers.IntegerField()
    attendance_percentage = serializers.FloatField()


class PerformanceReportSerializer(serializers.Serializer):
    student_name = serializers.CharField()
    enrollment_number = serializers.CharField()
    department = serializers.CharField()
    program = serializers.CharField()
    total_marks = serializers.FloatField()
    avg_marks = serializers.FloatField()
    grade = serializers.CharField()
    cgpa = serializers.FloatField()


class FacultyActivityReportSerializer(serializers.Serializer):
    faculty_name = serializers.CharField()
    employee_id = serializers.CharField()
    department = serializers.CharField()
    classes_scheduled = serializers.IntegerField()
    classes_conducted = serializers.IntegerField()
    attendance_submissions = serializers.IntegerField()
    subjects_assigned = serializers.IntegerField()


class BatchPerformanceReportSerializer(serializers.Serializer):
    batch_name = serializers.CharField()
    program_name = serializers.CharField()
    total_students = serializers.IntegerField()
    avg_attendance = serializers.FloatField()
    avg_marks = serializers.FloatField()
    top_performer = serializers.CharField()
    shortage_count = serializers.IntegerField()


class CertificationReportSerializer(serializers.Serializer):
    course_name = serializers.CharField()
    issued = serializers.IntegerField()
    pending = serializers.IntegerField()
    revoked = serializers.IntegerField()


class StudentProgressReportSerializer(serializers.Serializer):
    student_name = serializers.CharField()
    enrollment_number = serializers.CharField()
    current_semester = serializers.IntegerField()
    overall_attendance = serializers.FloatField()
    cgpa = serializers.FloatField()
    subjects = serializers.ListField(child=serializers.DictField())

class AtRiskStudentSerializer(serializers.Serializer):
    RISK_LEVEL_CHOICES = [

        (
            "low",
            "Low",
        ),

        (
            "medium",
            "Medium",
        ),

        (
            "high",
            "High",
        ),

    ]
    id = serializers.IntegerField()
    name = serializers.CharField()
    enrollment_number = serializers.CharField()
    attendance = serializers.FloatField()
    cgpa = serializers.FloatField()
    risk_level = (
        serializers.ChoiceField(

            choices=
                RISK_LEVEL_CHOICES

        )
    )
    risk_reason = serializers.CharField()