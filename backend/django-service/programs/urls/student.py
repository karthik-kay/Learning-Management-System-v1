from django.urls import path

from programs.views.student import StudentProgramEnrollmentListAPIView

urlpatterns = [
    path(
        "enrollments/",
        StudentProgramEnrollmentListAPIView.as_view(),
        name="student-program-enrollments",
    ),
]
