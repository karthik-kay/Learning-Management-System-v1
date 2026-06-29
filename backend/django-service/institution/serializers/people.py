from rest_framework import serializers
from institution.models import FacultyProfile, InstitutionStudent


class FacultyListSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = FacultyProfile
        fields = [
            'id', 'name', 'email', 'employee_id',
            'department_name', 'designation', 'status'
        ]


class FacultyDetailSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(
        source='user.phone_number', allow_null=True, read_only=True
    )
    department_name = serializers.CharField(source='department.name', read_only=True)
    institution_name = serializers.CharField(source='institution.name', read_only=True)

    class Meta:
        model = FacultyProfile
        fields = [
            'id', 'name', 'email', 'phone',
            'employee_id', 'designation', 'status',
            'department_name', 'institution_name',
            'joining_date', 'created_at', 'updated_at'
        ]


class FacultyCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name  = serializers.CharField(write_only=True)
    email      = serializers.EmailField(write_only=True)

    class Meta:
        model = FacultyProfile
        fields = [
            'first_name', 'last_name', 'email',
            'employee_id', 'designation', 'department',
            'joining_date'
        ]

    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        department = data.get('department')

        if department and department.institution != institution:
            raise serializers.ValidationError(
                "Department does not belong to this institution"
            )
        if FacultyProfile.objects.filter(employee_id=data["employee_id"],institution=institution).exists():

            raise serializers.ValidationError(
                "Employee ID already exists"
            )
        

        return data


class StudentListSerializer(serializers.ModelSerializer):
    name          = serializers.CharField(source='user.get_full_name', read_only=True)
    email         = serializers.EmailField(source='user.email', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    program_name  = serializers.CharField(source='program.name', read_only=True)
    batch_name    = serializers.CharField(source='batch.name', read_only=True)
    section_name  = serializers.CharField(
        source='section.name', allow_null=True, read_only=True
    )

    class Meta:
        model = InstitutionStudent
        fields = [
            'id', 'name', 'email', 'enrollment_number',
            'department_name', 'program_name', 'batch_name',
            'section_name', 'current_semester', 'status'
        ]


class StudentDetailSerializer(serializers.ModelSerializer):
    name          = serializers.CharField(source='user.get_full_name', read_only=True)
    email         = serializers.EmailField(source='user.email', read_only=True)
    phone         = serializers.CharField(
        source='user.phone_number', allow_null=True, read_only=True
    )
    department_name = serializers.CharField(source='department.name', read_only=True)
    program_name  = serializers.CharField(source='program.name', read_only=True)
    batch_name    = serializers.CharField(source='batch.name', read_only=True)
    section_name  = serializers.CharField(
        source='section.name', allow_null=True, read_only=True
    )

    class Meta:
        model = InstitutionStudent
        fields = [
            'id', 'name', 'email', 'phone',
            'enrollment_number', 'current_semester',
            'department_name', 'program_name',
            'batch_name', 'section_name',
            'admission_date', 'status',
            'created_at', 'updated_at'
        ]


class StudentCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name  = serializers.CharField(write_only=True)
    email      = serializers.EmailField(write_only=True)

    class Meta:
        model = InstitutionStudent
        fields = [
            'first_name', 'last_name', 'email',
            'enrollment_number', 'department', 'program',
            'batch', 'section', 'admission_date'
        ]

    def validate(self, data):
        request = self.context.get('request')
        institution = request.user.institution if request else None

        department = data.get('department')
        program    = data.get('program')
        batch      = data.get('batch')
        section    = data.get('section')

        if department and department.institution != institution:
            raise serializers.ValidationError(
                "Department does not belong to this institution"
            )

        if program and program.department != department:
            raise serializers.ValidationError(
                "Program does not belong to selected department"
            )

        if batch and batch.program != program:
            raise serializers.ValidationError(
                "Batch does not belong to selected program"
            )

        if section and section.batch != batch:
            raise serializers.ValidationError(
                "Section does not belong to selected batch"
            )

        return data
    def create(self, validated_data):
        from django.contrib.auth import get_user_model

        User = get_user_model()

        request = self.context.get("request")
        institution = request.user.institution

        first_name = validated_data.pop(
            "first_name"
        )

        last_name = validated_data.pop(
            "last_name"
        )

        email = validated_data.pop(
            "email"
        )

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role="student",
            institution=institution,
        )

        user.set_unusable_password()
        user.save()

        return InstitutionStudent.objects.create(
            user=user,
            institution=institution,
            **validated_data
        )
