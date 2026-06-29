# ide/serializers.py
from rest_framework import serializers
from .models import Workspace, WorkspaceItem

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "name", "created_at"]

class WorkspaceItemTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = WorkspaceItem
        fields = [
            "id",
            "name",
            "type",
            "parent",
            "content",
            "children",
        ]

    def get_children(self, obj):
        qs = obj.children.all().order_by("type", "name")
        return WorkspaceItemTreeSerializer(qs, many=True).data

class WorkspaceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceItem
        fields = "__all__"

    def validate(self, attrs):
        parent = attrs.get("parent", getattr(self.instance, "parent", None))
        item_type = attrs.get("type", getattr(self.instance, "type", None))

        if parent and parent.type != WorkspaceItem.FOLDER:
            raise serializers.ValidationError(
                {"parent": "Parent must be a folder"}
            )

        if item_type == WorkspaceItem.FOLDER:
            attrs["content"] = None

        return attrs
