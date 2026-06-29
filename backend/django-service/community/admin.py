from django.contrib import admin
from community.models import CommunityGroup, CommunityPost, GroupMembership

admin.site.register(CommunityGroup)
admin.site.register(CommunityPost)
admin.site.register(GroupMembership)
