from rest_framework import serializers
from .models import Ticket, TicketMessage


class TicketMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = TicketMessage
        fields = '__all__'
        read_only_fields = ['id', 'sender', 'sender_type', 'created_at']

    def get_replies(self, obj):
        # only top level messages carry their replies, avoids infinite nesting
        if obj.parent is None:
            return TicketMessageSerializer(obj.replies.all(), many=True).data
        return []


class TicketSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_role = serializers.CharField(source='created_by.role', read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'assigned_to_role', 'created_at', 'updated_at']

    def get_messages(self, obj):
        # only return top level messages, replies are nested inside them
        top_level = obj.messages.filter(parent=None).order_by('created_at')
        return TicketMessageSerializer(top_level, many=True).data