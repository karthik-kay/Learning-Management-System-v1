from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    total_departments = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_faculty = serializers.IntegerField()
    active_courses = serializers.IntegerField()
    avg_attendance = serializers.FloatField()
    avg_performance = serializers.FloatField()
    pending_certifications = serializers.IntegerField()
    active_placement_drives = serializers.IntegerField()
    students_placed_this_year = serializers.IntegerField()
    at_risk_students = serializers.IntegerField()  # below 75% attendance


class HODDashboardSerializer(serializers.Serializer):
    department = serializers.CharField()
    total_students = serializers.IntegerField()
    today_attendance_percentage = serializers.FloatField()
    shortage_count = serializers.IntegerField()         # below 75%
    pending_marks_entry = serializers.IntegerField()    # subjects awaiting grade submission
    upcoming_exams = serializers.IntegerField()         # next 7 days
    pending_leave_approvals = serializers.IntegerField()
    pending_internship_approvals = serializers.IntegerField()