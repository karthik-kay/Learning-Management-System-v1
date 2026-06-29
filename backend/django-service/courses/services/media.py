import cloudinary.uploader
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_course_thumbnail(request):
    file = request.FILES.get("file")

    if not file:
        return Response({"error": "No file provided"}, status=400)

    if not file.content_type.startswith("image/"):
        return Response({"error": "Invalid image"}, status=400)

    result = cloudinary.uploader.upload(
        file,
        folder="courses/thumbnails",
        resource_type="image"
    )

    return Response(
        {"thumbnail_url": result["secure_url"]},
        status=status.HTTP_201_CREATED
    )
