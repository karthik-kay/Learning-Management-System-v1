from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import LiveClass

class JoinLiveClassView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        live_class = LiveClass.objects.get(pk=pk)
        user = request.user

        if live_class.status != 'live':
            return Response({'error': 'Class not live'}, status=403)

        role = 'student'
        if user == live_class.teacher:
            role = 'teacher'

        return Response({
            'liveClassId': live_class.id,
            'role': role,
            'permissions': {
                'audio': role == 'teacher',
                'video': role == 'teacher',
                'chat': True
            }
        })
