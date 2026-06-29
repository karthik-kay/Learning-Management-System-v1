from django.urls import path
from .views import MyCertificatesView, CertificateDetailView

urlpatterns = [
    path('',                      MyCertificatesView.as_view(),    name='my-certificates'),
    path('<str:credential_id>/',  CertificateDetailView.as_view(), name='certificate-detail'),
]