from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from ..models import Workspace, WorkspaceItem
from ..serializers import WorkspaceItemSerializer

class WorkspaceItemCreateView(APIView):
    """
    Create file or folder
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = WorkspaceItemSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class WorkspaceItemUpdateView(APIView):
    """
    Rename file/folder OR update file content
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        item = get_object_or_404(WorkspaceItem, pk=pk)

        if item.workspace.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = WorkspaceItemSerializer(
            item,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class WorkspaceItemDeleteView(APIView):
    """
    Delete file or folder (folders delete children automatically)
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        item = get_object_or_404(WorkspaceItem, pk=pk)

        if item.workspace.user != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
