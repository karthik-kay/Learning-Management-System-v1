from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.db.models import Q

from community.models import CommunityPost, GroupMembership, PostLike
from community.serializers.post import CommunityPostSerializer, CreatePostSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def feed_list(request):
    group_id = request.query_params.get("group_id")

    my_groups = GroupMembership.objects.filter(
        user=request.user
    ).values_list("group_id", flat=True)

    posts = CommunityPost.objects.select_related(
        "author", "group"
    ).filter(
        Q(group__isnull=True) |
        Q(group_id__in=my_groups)
    ).order_by("-created_at")

    if group_id:
        posts = posts.filter(group_id=group_id)

    paginator = Paginator(posts, 10)
    page = request.query_params.get("page", 1)
    page_obj = paginator.get_page(page)

    serializer = CommunityPostSerializer(
        page_obj,
        many=True,
        context={"request": request}
    )

    return Response({
        "results": serializer.data,
        "has_next": page_obj.has_next()
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = CreatePostSerializer(
        data=request.data,
        context={"request": request}
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    post = CommunityPost.objects.get(id=post_id)

    like, created = PostLike.objects.get_or_create(
        post=post,
        user=request.user
    )

    if not created:
        like.delete()
        return Response({"liked": False})

    return Response({"liked": True})
