from django.contrib import admin
from .models import Lead, LeadFollowUp


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'assigned_to', 'source', 'created_at')
    list_filter = ('status', 'source')
    search_fields = ('name', 'phone', 'email')


@admin.register(LeadFollowUp)
class LeadFollowUpAdmin(admin.ModelAdmin):
    list_display = ('lead', 'followup_type', 'created_by', 'created_at')
    list_filter = ('followup_type',)