from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display  = ['credential_id', 'student', 'course', 'issued_at']
    search_fields = ['credential_id', 'student__user__username', 'course__title']
    readonly_fields = ['id', 'credential_id', 'issued_at']