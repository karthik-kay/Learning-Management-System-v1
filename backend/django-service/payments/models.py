import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from users.models import CustomUser
from courses.models import Course
from django.core.validators import MinValueValidator



class CoursePrice(models.Model):
    course       = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='pricing_plans')
    amount_paise = models.IntegerField(validators=[MinValueValidator(1)])
    min_final_price_paise = models.IntegerField(default=0) 
    max_negotiation_paise = models.IntegerField(default=0)
    is_active    = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.course.title} - ₹{self.amount_paise // 100}"
    
class CourseDiscount(models.Model):
    course         = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='discounts')
    discount_paise = models.IntegerField(validators=[MinValueValidator(1)])
    label          = models.CharField(max_length=100, blank=True)  # e.g. "Diwali Sale"
    is_active      = models.BooleanField(default=True)
    starts_at      = models.DateTimeField(null=True, blank=True)
    ends_at        = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - ₹{self.discount_paise // 100} off"


class PaymentOrder(models.Model):
    STATUS_CHOICES = [
        ('created',  'Created'),
        ('paid',     'Paid'),
        ('failed',   'Failed'),
        ('expired',  'Expired'),
        ('refunded', 'Refunded'),
    ]
    student           = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='payment_orders')
    razorpay_order_id = models.CharField(max_length=100, unique=True)
    amount_paise      = models.IntegerField(validators=[MinValueValidator(1)])
    currency          = models.CharField(max_length=5, default='INR')
    status            = models.CharField(max_length=10, choices=STATUS_CHOICES, default='created')
    sales_exec        = models.ForeignKey(
                          CustomUser, null=True, blank=True,
                          on_delete=models.SET_NULL,
                          related_name='attributed_orders',
                          limit_choices_to={'role': 'sales_exec'}
                        )
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)
    expires_at        = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=['razorpay_order_id']),
            models.Index(fields=['student', 'status']),
        ]

    def __str__(self):
        return f"{self.student.username} - ₹{self.amount_paise // 100} - {self.status}"


class PaymentOrderItem(models.Model):
    order                = models.ForeignKey(PaymentOrder, on_delete=models.CASCADE, related_name='items')
    course               = models.ForeignKey(Course, on_delete=models.PROTECT)
    course_price         = models.ForeignKey('CoursePrice', on_delete=models.PROTECT)
    course_title_snapshot = models.CharField(max_length=255)  # snapshot at time of purchase

    base_amount_paise     = models.IntegerField()   # original price, never changes
    discount_paise        = models.IntegerField(default=0)   # public discount applied
    negotiation_paise     = models.IntegerField(default=0)   # exec negotiation applied
    final_amount_paise    = models.IntegerField()
    

    def __str__(self):
        return f"{self.order} - {self.course_title_snapshot}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('captured',       'Captured'),
        ('failed',         'Failed'),
        ('refunded',       'Refunded'),
        ('partial_refund', 'Partial Refund'),
    ]
    order               = models.ForeignKey(PaymentOrder, on_delete=models.PROTECT, related_name='payments')
    razorpay_payment_id = models.CharField(max_length=100, unique=True)
    razorpay_signature  = models.TextField()
    amount_paise        = models.IntegerField(validators=[MinValueValidator(1)])
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES)
    method              = models.CharField(max_length=30, blank=True)
    captured_at         = models.DateTimeField(null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=['razorpay_payment_id'])]

    def __str__(self):
        return f"{self.razorpay_payment_id} - {self.status}"


class Refund(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('processing', 'Processing'),
        ('processed',  'Processed'),
        ('failed',     'Failed'),
    ]
    payment            = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name='refunds')
    razorpay_refund_id = models.CharField(max_length=100, unique=True, blank=True)
    amount_paise       = models.IntegerField(validators=[MinValueValidator(1)])
    reason             = models.TextField()
    status             = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    initiated_by       = models.ForeignKey(
                           CustomUser, on_delete=models.SET_NULL,
                           null=True, related_name='initiated_refunds'
                         )
    approved_by        = models.ForeignKey(
                           CustomUser, null=True, blank=True,
                           on_delete=models.SET_NULL,
                           related_name='approved_refunds'
                         )
    created_at         = models.DateTimeField(auto_now_add=True)
    processed_at       = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Refund {self.razorpay_refund_id} - {self.status}"


class CommissionRule(models.Model):
    course     = models.OneToOneField(
                   Course, on_delete=models.CASCADE,
                   null=True, blank=True,
                   related_name='commission_rule'
                 )
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    is_active  = models.BooleanField(default=True)
    created_by = models.ForeignKey(
                   CustomUser, on_delete=models.SET_NULL,
                   null=True, related_name='commission_rules'
                 )
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_rate_for_course(course):
        rule = CommissionRule.objects.filter(
            course=course, is_active=True
        ).first()
        if not rule:
            rule = CommissionRule.objects.filter(
                course__isnull=True, is_active=True
            ).first()
        return rule.percentage if rule else 0

    def __str__(self):
        if self.course:
            return f"{self.course.title} - {self.percentage}%"
        return f"Global default - {self.percentage}%"


class Commission(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('approved',  'Approved'),
        ('paid',      'Paid'),
        ('cancelled', 'Cancelled'),
    ]
    order_item   = models.ForeignKey(PaymentOrderItem, on_delete=models.PROTECT, related_name='commissions')
    payment      = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name='commissions')
    sales_exec   = models.ForeignKey(
                     CustomUser, on_delete=models.PROTECT,
                     related_name='commissions',
                     limit_choices_to={'role': 'sales_exec'}
                   )
    percentage   = models.DecimalField(max_digits=5, decimal_places=2)
    amount_paise = models.IntegerField(validators=[MinValueValidator(1)])
    status       = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payout_ref   = models.CharField(max_length=200, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    paid_at      = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=['sales_exec', 'status'])]

    def __str__(self):
        return f"Commission for {self.sales_exec.username} - {self.status}"
    

class SalesLink(models.Model):
    token      = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    sales_exec = models.ForeignKey(
                   CustomUser, on_delete=models.CASCADE,
                   related_name='sales_links',
                   limit_choices_to={'role': 'sales_exec'}
                 )
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sales_links')
    lead       = models.ForeignKey(
                   'sales.Lead', on_delete=models.SET_NULL,
                   null=True, blank=True, related_name='sales_links'
                 )
    is_active  = models.BooleanField(default=True)

    expires_at = models.DateTimeField()
    used_at    = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sales_exec.username} - {self.course.title} - {self.token}"