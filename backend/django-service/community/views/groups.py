from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from community.models import CommunityGroup, GroupMembership
from community.serializers.group import GroupSerializer, GroupMemberSerializer
from django.contrib.auth import get_user_model
User=get_user_model()

# LIST MY GROUPS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_groups(request):
    groups = CommunityGroup.objects.filter(
        groupmembership__user=request.user
    )
    serializer = GroupSerializer(groups, many=True)
    return Response(serializer.data)


# CREATE GROUP
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group(request):
    serializer = GroupSerializer(data=request.data)

    if serializer.is_valid():
        group = serializer.save(created_by=request.user)

        GroupMembership.objects.create(
            user=request.user,
            group=group,
            role=GroupMembership.Role.ADMIN
        )

        return Response(GroupSerializer(group).data)

    return Response(serializer.errors, status=400)


# DELETE GROUP
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_group(request, group_id):
    group = get_object_or_404(CommunityGroup, id=group_id)

    is_admin = GroupMembership.objects.filter(
        user=request.user,
        group=group,
        role=GroupMembership.Role.ADMIN
    ).exists()

    if not is_admin:
        return Response(status=403)

    group.delete()
    return Response({"status": "deleted"})


# EXIT GROUP
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def exit_group(request, group_id):
    GroupMembership.objects.filter(
        user=request.user,
        group_id=group_id
    ).delete()

    return Response({"status": "left"})


# ADD MEMBER

from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_member(request, group_id):
    group = get_object_or_404(CommunityGroup, id=group_id)

    # 1. Permission Check
    is_admin = GroupMembership.objects.filter(
        user=request.user,
        group=group,
        role=GroupMembership.Role.ADMIN
    ).exists()

    if not is_admin:
        return Response({"error": "Only admins can add members"}, status=403)

    # 2. Get Data (Match the JS key 'user_id')
    user_id = request.data.get("user_id")
    
    if not user_id:
        return Response({"error": "No user_id provided in request body"}, status=400)

    # 3. Find the User
    try:
        # Check if user_id is a numeric ID or a username string
        if str(user_id).isdigit():
            target_user = User.objects.get(id=user_id)
        else:
            target_user = User.objects.get(username=user_id)
    except User.DoesNotExist:
        return Response({"error": f"User '{user_id}' not found"}, status=400)

    # 4. Membership Check
    if GroupMembership.objects.filter(group=group, user=target_user).exists():
        return Response({"error": "User is already in this group"}, status=400)

    # 5. Create
    GroupMembership.objects.create(
        group=group,
        user=target_user,
        role=GroupMembership.Role.MEMBER
    )

    return Response({"status": "added", "user": target_user.username}, status=201)

# REMOVE MEMBER
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_member(request, group_id):
    group = get_object_or_404(CommunityGroup, id=group_id)

    # 1. Security Check: Is the requester an admin?
    is_admin = GroupMembership.objects.filter(
        user=request.user,
        group=group,
        role=GroupMembership.Role.ADMIN
    ).exists()

    if not is_admin:
        return Response({"error": "Unauthorized. Admin rights required."}, status=403)

    # 2. Identify target
    target_user_id = request.data.get("user_id")
    if not target_user_id:
        return Response({"error": "user_id is required"}, status=400)

    # 3. Safety Check: Don't let admin delete themselves
    if int(target_user_id) == request.user.id:
        return Response({"error": "You cannot remove yourself. Use 'Exit Group' instead."}, status=400)

    # 4. Execute
    membership = GroupMembership.objects.filter(group=group, user_id=target_user_id)
    if not membership.exists():
        return Response({"error": "User is not a member of this group"}, status=404)

    membership.delete()

    return Response({
        "status": "success",
        "message": "Member removed successfully"
    })



# GROUP MEMBERS
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def group_members(request, group_id):
    members = GroupMembership.objects.filter(group_id=group_id)
    serializer = GroupMemberSerializer(members, many=True)
    return Response(serializer.data)
