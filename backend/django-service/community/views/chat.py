from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from community.models import GroupMembership
from community.models.chat_message import ChatMessage

User = get_user_model()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def authorize_chat(request):
    room_id = request.query_params.get("room_id")
    
    if not room_id:
        return Response({"allowed": False})

    # 1. GROUP LOGIC: Check membership table
    if room_id.startswith("group:"):
        try:
            group_id = int(room_id.split(":")[1])
            is_member = GroupMembership.objects.filter(
                user=request.user,
                group_id=group_id
            ).exists()
            return Response({"allowed": is_member})
        except (ValueError, IndexError):
            return Response({"allowed": False})

    # 2. DM LOGIC: Check if user is part of the deterministic ID
    if room_id.startswith("dm:"):
        try:
            # Splits "dm:5_6" into ["5", "6"]
            participants = room_id.split(":")[1].split("_")
            
            # Check if current user ID is either the first or second ID in the room name
            # We use string comparison because the room_id comes in as a string
            current_user_id = str(request.user.id)
            
            if current_user_id in participants:
                return Response({"allowed": True})
            
            return Response({"allowed": False})
        except (ValueError, IndexError):
            return Response({"allowed": False})

    return Response({"allowed": False})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def contacts(request):
    my_groups = GroupMembership.objects.filter(
        user=request.user
    ).values_list("group_id", flat=True)

    users = User.objects.filter(
        groupmembership__group_id__in=my_groups
    ).exclude(id=request.user.id).distinct()

    data = [
        {
            "id": u.id,
            "username": u.username,
            "role": getattr(u, "role", "student")
        }
        for u in users
    ]

    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_message(request):
    room_id = request.data.get("room_id")
    message = request.data.get("message")
    
    if not room_id or not message:
        return Response({"error": "No data bruv"}, status=400)

    ChatMessage.objects.create(
        room_id=room_id,
        sender=request.user,
        text=message
    )
    return Response({"status": "saved"})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_history(request):
    room_id = request.query_params.get("room_id")
    # Make sure you are filtering by room_id and returning the right fields
    messages = ChatMessage.objects.filter(room_id=room_id).order_by('timestamp')
    
    data = [{
        "text": m.text,
        "sender_id": m.sender.id,
        "ts": m.timestamp.isoformat()
    } for m in messages]
    
    return Response(data)