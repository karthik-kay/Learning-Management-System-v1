from django.urls import path
from .views import JoinLiveClassView

urlpatterns = [
    path('<int:pk>/join/', JoinLiveClassView.as_view()),
]
