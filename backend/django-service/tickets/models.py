import uuid
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Ticket(models.Model):

    TICKET_TYPE_CHOICES = [
        ('support', 'Support'),
        ('sales', 'Sales'),
        ('admin', 'Admin'),
    ]

    ASSIGNED_ROLE_CHOICES = [
        ('faculty', 'Faculty'),
        ('sales', 'Sales'),
        ('admin', 'Admin'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('awaiting_student', 'Awaiting Student Response'),
        ('reopened', 'Reopened'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    title = models.CharField(max_length=255)
    description = models.TextField()
    attachment = models.FileField(upload_to='tickets/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    type = models.CharField(max_length=20, choices=TICKET_TYPE_CHOICES)
    assigned_to_role = models.CharField(max_length=20, choices=ASSIGNED_ROLE_CHOICES, default='faculty')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.type}) - {self.status}"


class TicketMessage(models.Model):

    SENDER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ticket_messages')
    sender_type = models.CharField(max_length=10, choices=SENDER_TYPE_CHOICES)
    message = models.TextField()
    attachment = models.FileField(upload_to='ticket_messages/', blank=True, null=True)

    # for threading — reply to a specific message
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} ({self.sender_type}) → {self.ticket.id}"