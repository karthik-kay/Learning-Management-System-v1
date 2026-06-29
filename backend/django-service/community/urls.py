from django.urls import path
from .views import groups, feed, chat

urlpatterns = [

    # =====================
    # GROUPS
    # =====================

    path("groups/", groups.my_groups, name="my-groups"),
    path("groups/create/", groups.create_group, name="create-group"),
    path("groups/<int:group_id>/delete/", groups.delete_group, name="delete-group"),
    path("groups/<int:group_id>/exit/", groups.exit_group, name="exit-group"),
    path("groups/<int:group_id>/add/", groups.add_member, name="add-member"),
    path("groups/<int:group_id>/remove/", groups.remove_member, name="remove-member"),
    path("groups/<int:group_id>/members/", groups.group_members, name="group-members"),

    # =====================
    # FEED
    # =====================

    path("feed/", feed.feed_list, name="feed-list"),
    path("posts/create/", feed.create_post, name="create-post"),
    path("posts/<int:post_id>/like/", feed.toggle_like, name="toggle-like"),

    # =====================
    # CHAT
    # =====================

    path("chat/authorize/", chat.authorize_chat, name="chat-authorize"),
    path("chat/save/", chat.save_message, name="chat-save"),      # Node calls this
    path("chat/history/", chat.get_history, name="chat-history"), # Frontend calls this
    path("contacts/", chat.contacts, name="contacts"),
]
