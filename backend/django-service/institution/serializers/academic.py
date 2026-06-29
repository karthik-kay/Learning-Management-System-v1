from rest_framework import serializers
from institution.models import (
    Department, Program, AcademicBatch, Section, Subject, Degree
)


class DegreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Degree
        fields = ['id', 'name', 'code', 'is_active']
    
    def validate_code(self, value):
        request = self.context.get('request')
        if not request:
            return value

        institution = request.user.institution

        qs = Degree.objects.filter(code=value, institution=institution)

        if self.instance:
            qs = qs.exclude(id=self.instance.id)

        if qs.exists():
            raise serializers.ValidationError("Degree code already exists")

        return value


class DepartmentSerializer(serializers.ModelSerializer):
    hod_name = serializers.CharField(source='hod.user.get_full_name', allow_null=True,read_only=True)

    program_count = serializers.IntegerField(source='active_program_count', read_only=True)
    faculty_count = serializers.IntegerField(source='active_faculty_count', read_only=True)
    student_count = serializers.IntegerField(source='active_student_count', read_only=True)

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'code', 'hod_name',
            'description', 'is_active', 'created_at',
            'program_count', 
            'faculty_count', 
            'student_count'
        ]


class DepartmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name', 'code', 'description', 'hod']
    
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        hod = data.get('hod')

        if hod and hasattr(hod, 'institution') and hod.institution != institution:
            raise serializers.ValidationError("Invalid HOD for this institution")

        return data



class ProgramSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name',read_only=True)
    degree_name = serializers.CharField(source='degree.name',read_only=True)

    class Meta:
        model = Program
        fields = [
            'id', 'name', 'code', 'department', 'department_name',
            'degree', 'degree_name', 'duration_semesters',
            'intake_capacity', 'is_active', 'created_at'
        ]


class ProgramCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = [
            'name', 'code', 'department', 'degree',
            'duration_semesters', 'intake_capacity'
        ]
    
    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        department = data.get('department') or getattr(self.instance, 'department', None)
        degree = data.get('degree') or getattr(self.instance, 'degree', None)

        # institution safety
        if department and institution and department.institution != institution:
            raise serializers.ValidationError("Invalid department for this institution")

        # relationship integrity
        if department and degree and degree.institution != department.institution:
            raise serializers.ValidationError(
                "Degree and Department must belong to same institution"
            )

        return data


class BatchSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name',read_only=True)

    class Meta:
        model = AcademicBatch
        fields = [
            'id', 'name', 'program', 'program_name', 'start_year',
            'end_year', 'status', 'current_semester',
            'intake_size', 'created_at'
        ]


class BatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicBatch
        fields = [
            'name', 'program', 'start_year', 'end_year',
            'intake_size', 'current_semester', 'status'
        ]

    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        program = data.get('program') or getattr(self.instance, 'program', None)

        if program and institution and program.department.institution != institution:
            raise serializers.ValidationError("Invalid program for this institution")

        return data


class SectionSerializer(serializers.ModelSerializer):
    batch_name = serializers.CharField(source='batch.name',read_only=True)
    class_teacher_name = serializers.SerializerMethodField()

    def get_class_teacher_name(self, obj):
        return obj.class_teacher.user.get_full_name() if obj.class_teacher else None

    class Meta:
        model = Section
        fields = [
            'id', 'name', 'batch', 'batch_name', 'class_teacher',
            'class_teacher_name',
            'capacity', 'is_active', 'created_at'
        ]


class SectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['name', 'batch', 'class_teacher', 'capacity']

    def validate(self, data):
        request = self.context.get("request")
        institution = request.user.institution if request else None

        batch = (
            data.get("batch")
            or getattr(self.instance, "batch", None)
        )

        teacher = (
            data.get("class_teacher")
            or getattr(self.instance, "class_teacher", None)
        )

        if batch and institution:
            if batch.program.department.institution != institution:
                raise serializers.ValidationError(
                    "Invalid batch for this institution"
                )

        if teacher and institution:
            if teacher.institution != institution:
                raise serializers.ValidationError(
                    "Invalid class teacher"
                )

        return data
    


class SubjectSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name',read_only=True)

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'program_name',
            'subject_type', 'semester', 'credits',
            'is_active', 'created_at'
        ]



class SubjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = [
            'name', 'code', 'program', 'subject_type',
            'semester', 'credits'
        ]

    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        program = data.get('program') or getattr(self.instance, 'program', None)
        semester = data.get('semester') or getattr(self.instance, 'semester', None)

        # institution safety
        if program and institution and program.department.institution != institution:
            raise serializers.ValidationError("Invalid program for this institution")

        # semester check
        if program and semester and semester > program.duration_semesters:
            raise serializers.ValidationError(
                f"Max semester is {program.duration_semesters}"
            )

        return data
