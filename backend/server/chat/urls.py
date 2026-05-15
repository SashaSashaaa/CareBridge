from django.urls import path

from . import views


app_name = "chat"

urlpatterns = [
    # --------------------------------------------------
    # USERS
    # --------------------------------------------------

    path(
        "users/",
        views.ChatUsersView.as_view(),
        name="chat-users"
    ),


    # --------------------------------------------------
    # CHAT REQUESTS
    # --------------------------------------------------

    # Відправити запит на спілкування
    path(
        "requests/send/",
        views.SendChatRequestView.as_view(),
        name="send-chat-request"
    ),

    path(
    "requests/",
    views.ChatRequestsView.as_view(),
    name="chat-requests"
    ),

    # Прийняти запит на спілкування
    path(
        "requests/<int:pk>/accept/",
        views.AcceptChatRequestView.as_view(),
        name="accept-chat-request"
    ),

    # Відхилити вхідний запит
    path(
        "requests/<int:pk>/decline/",
        views.DeclineChatRequestView.as_view(),
        name="decline-chat-request"
    ),

    # Скасувати свій вихідний запит
    path(
        "requests/<int:pk>/cancel/",
        views.CancelChatRequestView.as_view(),
        name="cancel-chat-request"
    ),


    # --------------------------------------------------
    # CHATS
    # --------------------------------------------------

    # Отримати список моїх чатів
    path(
        "chats/",
        views.ChatListView.as_view(),
        name="chat-list"
    ),

    # Отримати деталі одного чату
    path(
        "chats/<int:pk>/",
        views.ChatDetailView.as_view(),
        name="chat-detail"
    ),

    # Видалити чат для поточного користувача
    path(
        "chats/<int:pk>/delete/",
        views.DeleteChatView.as_view(),
        name="delete-chat"
    ),


    # --------------------------------------------------
    # MESSAGES
    # --------------------------------------------------

    # Отримати повідомлення конкретного чату
    path(
        "chats/<int:chat_id>/messages/",
        views.MessageListView.as_view(),
        name="message-list"
    ),

    # Позначити повідомлення чату як прочитані
    path(
        "chats/<int:chat_id>/messages/read/",
        views.MarkMessagesAsReadView.as_view(),
        name="mark-messages-as-read"
    ),

    # Видалити конкретне повідомлення
    path(
        "messages/<int:pk>/delete/",
        views.DeleteMessageView.as_view(),
        name="delete-message"
    ),
]