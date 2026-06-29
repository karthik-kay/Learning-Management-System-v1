from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # This matches the ws://localhost:8000/ws/terminal/ we put in React
    re_path(r'ws/terminal/$', consumers.TerminalConsumer.as_asgi()),
]