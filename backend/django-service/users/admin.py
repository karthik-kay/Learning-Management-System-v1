from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = UserCreationForm.Meta.fields+('role', 'email')
    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=False) 
        user.role = self.cleaned_data["role"]
        user.email = self.cleaned_data["email"]
        user.phone_number = self.cleaned_data.get("phone_number")
        
        if commit:
            user.save()
        return user

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'role', 'email', 'phone_number','bio', 'profile_image')

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'role', 'email', 'phone_number','is_staff']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email','phone_number',  'role', 'bio', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {'fields': ('username', 'email','phone_number',  'role', 'password1', 'password2')}), # Crucial change here
        ('Personal info', {'fields': ('bio', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
