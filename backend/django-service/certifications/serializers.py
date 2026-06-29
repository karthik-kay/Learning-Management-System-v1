from django.conf import settings
from django.db import models
from rest_framework import serializers
from .models import Certificate
from courses.models import Lesson

class CertificateSerializer(serializers.ModelSerializer):
    student_name   = serializers.SerializerMethodField()
    course_title   = serializers.CharField(source='course.title')
    course_slug    = serializers.CharField(source='course.slug')
    course_level   = serializers.CharField(source='course.level')
    course_domain  = serializers.CharField(source='course.domain')
    faculty_name   = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField()
    org            = serializers.SerializerMethodField()

    class Meta:
        model  = Certificate
        fields = [
            'id',
            'credential_id',
            'student_name',
            'course_title',
            'course_slug',
            'course_level',
            'course_domain',
            'faculty_name',
            'total_duration',
            'org',
            'issued_at',
        ]

    def get_student_name(self, obj):
        u = obj.student.user
        full = u.get_full_name()
        return full if full.strip() else u.username

    def get_faculty_name(self, obj):
        product = getattr(obj.course, 'product', None)
        if product:
            instructor = product.instructors.first()
            if instructor:
                return instructor.display_name
            if product.instructor_name:
                return product.instructor_name
        return ''

    def get_total_duration(self, obj):
        total = Lesson.objects.filter(
            module__course=obj.course
        ).aggregate(
            total=models.Sum('duration_minutes')
        )['total'] or 0

        hours   = total // 60
        minutes = total % 60

        if hours and minutes:
            return f"{hours}h {minutes}m"
        elif hours:
            return f"{hours}h"
        else:
            return f"{minutes}m"

    def get_org(self, obj):
        return {
            'name':      getattr(settings, 'ORG_NAME', ''),
            'ceo_name':  getattr(settings, 'ORG_CEO_NAME', ''),
            'ceo_title': getattr(settings, 'ORG_CEO_TITLE', ''),
        }
