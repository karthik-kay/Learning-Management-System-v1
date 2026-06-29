from django.contrib import admin
from .models import (
    CoursePrice, PaymentOrder, PaymentOrderItem,
    Payment, Refund, CommissionRule, Commission
)

admin.site.register(CoursePrice)
admin.site.register(PaymentOrder)
admin.site.register(PaymentOrderItem)
admin.site.register(Payment)
admin.site.register(Refund)
admin.site.register(CommissionRule)
admin.site.register(Commission)