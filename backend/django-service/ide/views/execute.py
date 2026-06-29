from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status

from ..models import Workspace
from ..serializers import WorkspaceSerializer


class WorkspaceViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - List user workspaces
    - Create new workspace
    - Rename workspace
    - Delete workspace
    """

    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # User can ONLY see their own workspaces
        return Workspace.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Attach workspace to logged-in user
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Optional safety:
        Prevent deleting last workspace
        """
        if self.get_queryset().count() <= 1:
            return Response(
                {"error": "At least one workspace is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)
