from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from ..models import Workspace, WorkspaceItem
from ..serializers import WorkspaceItemTreeSerializer


class WorkspaceTreeView(APIView):
    """
    GET entire file/folder tree for a workspace
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, workspace_id):
        workspace = get_object_or_404(
            Workspace,
            id=workspace_id,
            user=request.user
        )

        root_items = WorkspaceItem.objects.filter(
            workspace=workspace,
            parent__isnull=True
        ).order_by("type", "name")

        serializer = WorkspaceItemTreeSerializer(root_items, many=True)
        return Response(serializer.data)
