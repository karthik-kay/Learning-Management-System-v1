from django.urls import path, include

urlpatterns = [
    path("users/", include("users.urls")),
    path("students/", include("students.urls")),
    path("courses/", include("courses.urls")),
    path("public/course-products/", include("courses.public_urls")),
    path("public/faculty/", include("faculty.urls")),
    path("public/programs/", include("programs.urls.public")),
    path("public/content/", include("public_content.urls")),
    path("admin/programs/", include("programs.urls.admin")),
    path("student/programs/", include("programs.urls.student")),
    path("ide/", include("ide.urls")),
    path('live-classes/', include('live_classes.urls')),
    path("community/", include("community.urls")),
    path("sales/",include("sales.urls")),
    path('certificates/', include('certifications.urls')),
    path('tickets/', include('tickets.urls')),
    path('payments/', include('payments.urls')),
    path('notifications/', include('notifications.urls')),
    path("institution/", include("institution.urls")),


]
