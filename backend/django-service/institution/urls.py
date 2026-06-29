from django.urls import path

from institution.views.academic import (
    BatchDetailView,
    BatchListView,
    DegreeDetailView,
    DegreeListView,
    DepartmentDetailView,
    DepartmentListView,
    ProgramDetailView,
    ProgramListView,
    SectionDetailView,
    SectionListView,
    SubjectDetailView,
    SubjectListView,
)
from institution.views.attendance import (
    AttendanceRecordListView,
    AttendanceSessionDetailView,
    AttendanceSessionListView,
    AttendanceShortageView,
    BulkAttendanceView,
    BulkShortageAlertView,
    LeaveApplicationView,
    LeaveApproveView,
    UnlockAttendanceView,
)
from institution.views.audit import InstitutionAuditLogListView
from institution.views.dashboard import DashboardStatsView, HODDashboardView
from institution.views.exports import InstitutionExportJobDetailView, InstitutionExportJobListView
from institution.views.grades import (
    AssignmentDetailView,
    AssignmentListView,
    BulkScoreUploadView,
    EvaluationComponentDetailView,
    EvaluationComponentListView,
    ExamDetailView,
    ExamListView,
    ExamPublishView,
    ExamResultListView,
    ExamSubjectListView,
    PublishResultView,
    StudentCGPAView,
    StudentComponentScoreListView,
    SubjectResultComputeView,
    SubjectResultListView,
    SubmissionListView,
    SubmissionMarkView,
)
from institution.views.people import (
    FacultyDetailView,
    FacultyListView,
    FacultyMakeHODView,
    FacultyOffboardView,
    FacultyReactivateView,
    FacultySuspendView,
    StudentBulkImportView,
    StudentDetailView,
    StudentListView,
    StudentPromoteView,
    StudentSuspendView,
)
from institution.views.reports import (
    AtRiskStudentsView,
    AttendanceReportView,
    BatchPerformanceReportView,
    FacultyActivityReportView,
    PerformanceReportView,
    StudentProgressReportView,
    StudentSubjectAttendanceView,
)
from institution.views.timetable import (
    FacultySubjectAssignmentDetailView,
    FacultySubjectAssignmentListView,
    SubstituteView,
    TimeSlotDetailView,
    TimeSlotListView,
    TimetableConflictView,
    TimetableEntryDetailView,
    TimetableEntryListView,
    TimetablePublishView,
)

app_name = "institution"

urlpatterns = [
    # Dashboards
    path("dashboards/admin/", DashboardStatsView.as_view(), name="admin-dashboard"),
    path("dashboards/hod/", HODDashboardView.as_view(), name="hod-dashboard"),

    # People
    path("faculty/", FacultyListView.as_view(), name="faculty-list"),
    path("faculty/<int:faculty_id>/", FacultyDetailView.as_view(), name="faculty-detail"),
    path(
        "faculty/<int:faculty_id>/suspension/",
        FacultySuspendView.as_view(),
        name="faculty-suspend",
    ),
    path(
        "faculty/<int:faculty_id>/reactivation/",
        FacultyReactivateView.as_view(),
        name="faculty-reactivate",
    ),
    path(
        "faculty/<int:faculty_id>/offboarding/",
        FacultyOffboardView.as_view(),
        name="faculty-offboard",
    ),
    path(
        "faculty/<int:faculty_id>/hod-assignment/",
        FacultyMakeHODView.as_view(),
        name="faculty-assign-hod",
    ),
    path("students/", StudentListView.as_view(), name="student-list"),
    path("students/imports/", StudentBulkImportView.as_view(), name="student-import"),
    path("students/<int:student_id>/", StudentDetailView.as_view(), name="student-detail"),
    path(
        "students/<int:student_id>/suspension/",
        StudentSuspendView.as_view(),
        name="student-suspend",
    ),
    path(
        "students/<int:student_id>/promotion/",
        StudentPromoteView.as_view(),
        name="student-promote",
    ),

    # Academic structure
    path("degrees/", DegreeListView.as_view(), name="degree-list"),
    path("degrees/<int:degree_id>/", DegreeDetailView.as_view(), name="degree-detail"),
    path("departments/", DepartmentListView.as_view(), name="department-list"),
    path(
        "departments/<int:dept_id>/",
        DepartmentDetailView.as_view(),
        name="department-detail",
    ),
    path("programs/", ProgramListView.as_view(), name="program-list"),
    path("programs/<int:program_id>/", ProgramDetailView.as_view(), name="program-detail"),
    path("batches/", BatchListView.as_view(), name="batch-list"),
    path("batches/<int:batch_id>/", BatchDetailView.as_view(), name="batch-detail"),
    path("sections/", SectionListView.as_view(), name="section-list"),
    path("sections/<int:section_id>/", SectionDetailView.as_view(), name="section-detail"),
    path("subjects/", SubjectListView.as_view(), name="subject-list"),
    path("subjects/<int:subject_id>/", SubjectDetailView.as_view(), name="subject-detail"),

    # Timetable
    path("time-slots/", TimeSlotListView.as_view(), name="time-slot-list"),
    path("time-slots/<int:slot_id>/", TimeSlotDetailView.as_view(), name="time-slot-detail"),
    path(
        "teaching-assignments/",
        FacultySubjectAssignmentListView.as_view(),
        name="teaching-assignment-list",
    ),
    path(
        "teaching-assignments/<int:assignment_id>/",
        FacultySubjectAssignmentDetailView.as_view(),
        name="teaching-assignment-detail",
    ),
    path("timetable-entries/", TimetableEntryListView.as_view(), name="timetable-entry-list"),
    path(
        "timetable-entries/<int:entry_id>/",
        TimetableEntryDetailView.as_view(),
        name="timetable-entry-detail",
    ),
    path(
        "sections/<int:section_id>/timetable-publication/",
        TimetablePublishView.as_view(),
        name="section-timetable-publish",
    ),
    path("timetable-conflicts/", TimetableConflictView.as_view(), name="timetable-conflicts"),
    path("substitutions/", SubstituteView.as_view(), name="substitution-create"),

    # Attendance
    path("attendance-sessions/", AttendanceSessionListView.as_view(), name="attendance-session-list"),
    path(
        "attendance-sessions/<int:session_id>/",
        AttendanceSessionDetailView.as_view(),
        name="attendance-session-detail",
    ),
    path(
        "attendance-sessions/<int:session_id>/unlock/",
        UnlockAttendanceView.as_view(),
        name="attendance-session-unlock",
    ),
    path("attendance-records/", AttendanceRecordListView.as_view(), name="attendance-record-list"),
    path("attendance-records/bulk/", BulkAttendanceView.as_view(), name="attendance-bulk-mark"),
    path("attendance-shortages/", AttendanceShortageView.as_view(), name="attendance-shortage-list"),
    path(
        "attendance-shortage-alerts/bulk/",
        BulkShortageAlertView.as_view(),
        name="attendance-shortage-alert-bulk",
    ),
    path("leave-applications/", LeaveApplicationView.as_view(), name="leave-application-list"),
    path(
        "leave-applications/<int:leave_id>/approval/",
        LeaveApproveView.as_view(),
        name="leave-application-approve",
    ),

    # Grades and exams
    path("evaluation-components/", EvaluationComponentListView.as_view(), name="evaluation-component-list"),
    path(
        "evaluation-components/<int:component_id>/",
        EvaluationComponentDetailView.as_view(),
        name="evaluation-component-detail",
    ),
    path("component-scores/", StudentComponentScoreListView.as_view(), name="component-score-list"),
    path("component-scores/bulk/", BulkScoreUploadView.as_view(), name="component-score-bulk"),
    path("exams/", ExamListView.as_view(), name="exam-list"),
    path("exams/<int:exam_id>/", ExamDetailView.as_view(), name="exam-detail"),
    path("exams/<int:exam_id>/publication/", ExamPublishView.as_view(), name="exam-publish"),
    path("exams/<int:exam_id>/subjects/", ExamSubjectListView.as_view(), name="exam-subject-list"),
    path("exam-results/", ExamResultListView.as_view(), name="exam-result-list"),
    path("subject-results/", SubjectResultListView.as_view(), name="subject-result-list"),
    path("subject-results/compute/", SubjectResultComputeView.as_view(), name="subject-result-compute"),
    path("exams/<int:exam_id>/result-publication/", PublishResultView.as_view(), name="exam-result-publish"),
    path("students/<int:student_id>/cgpa/", StudentCGPAView.as_view(), name="student-cgpa"),
    path("assignments/", AssignmentListView.as_view(), name="assignment-list"),
    path("assignments/<int:assignment_id>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("submissions/", SubmissionListView.as_view(), name="submission-list"),
    path("submissions/<int:submission_id>/marks/", SubmissionMarkView.as_view(), name="submission-mark"),

    # Reports
    path("reports/attendance/", AttendanceReportView.as_view(), name="attendance-report"),
    path(
        "students/<int:student_id>/attendance-report/",
        StudentSubjectAttendanceView.as_view(),
        name="student-attendance-report",
    ),
    path("reports/performance/", PerformanceReportView.as_view(), name="performance-report"),
    path("reports/faculty-activity/", FacultyActivityReportView.as_view(), name="faculty-activity-report"),
    path("reports/batch-performance/", BatchPerformanceReportView.as_view(), name="batch-performance-report"),
    path(
        "students/<int:student_id>/progress-report/",
        StudentProgressReportView.as_view(),
        name="student-progress-report",
    ),
    path("reports/at-risk-students/", AtRiskStudentsView.as_view(), name="at-risk-student-report"),

    # Audit
    path("audit-logs/", InstitutionAuditLogListView.as_view(), name="audit-log-list"),

    # Exports
    path("exports/", InstitutionExportJobListView.as_view(), name="export-job-list"),
    path("exports/<int:export_id>/", InstitutionExportJobDetailView.as_view(), name="export-job-detail"),
]
