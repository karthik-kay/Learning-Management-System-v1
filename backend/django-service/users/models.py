from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [

         #Base LMS DOmain
        ('admin', 'Super Admin'),
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('trainer', 'Trainer'),

        #Institution Domain
        ('institution_admin', 'Institution Admin'),  
        ('hod', 'Head of Department'),               

        # Sales Domain
        ('sales_admin', 'Sales Admin'),
        ('sales_manager', 'Sales Manager'),
        ('sales_exec', 'Sales Executive'),

    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student',db_index=True)

    institution = models.ForeignKey(
        'institution.Institution',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='members',
        db_index=True 
    )


    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    bio = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    email=models.EmailField(null=True, blank=True, unique=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def has_role(self, *roles):
        return self.role in roles
    
    @property
    def is_institution_admin(self):
        return self.role == 'institution_admin'

    @property
    def is_hod(self):
        return self.role == 'hod'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"