from django.urls import path
from . import views

urlpatterns = [
    path('create-order/',    views.create_order,         name='create_order'),
    path('verify/',          views.verify_payment,       name='verify_payment'),
    path('webhook/',         views.razorpay_webhook,     name='razorpay_webhook'),
    path('generate-link/',   views.generate_sales_link,  name='generate_sales_link'),
    path('history/',         views.payment_history,      name='payment_history'),
]