from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
 
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
 
from .models import ChatRequest, Chat, ChatParticipant, Message
from .serializers import (
    UserListSerializer,
    ChatRequestSerializer,
    SendChatRequestSerializer,
    ChatListSerializer,
    ChatDetailSerializer,
    MessageSerializer,
)
 
 
User = get_user_model()
channel_layer = get_channel_layer()
 
 
def notify_user(user_id, event_type, data=None):
    try:
        async_to_sync(channel_layer.group_send)(
            f"user_{user_id}_notifications",
            {
                "type": "notify",
                "event_type": event_type,
                "data": data or {},
            }
        )
    except Exception as e:
        print(f"notify_user error: {e}")
 
 
# --------------------------------------------------
# USERS
# --------------------------------------------------
 
class ChatUsersView(generics.ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        current_user = self.request.user
        list_type = self.request.query_params.get("type", "all")
 
        if list_type == "allowed":
            return self.get_allowed_users(current_user)
 
        if list_type == "pending":
            return self.get_pending_users(current_user)
 
        return self.get_all_users(current_user)
 
    def get_all_users(self, current_user):
        return User.objects.exclude(id=current_user.id).order_by("username")
 
    def get_allowed_users(self, current_user):
        chats = Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).prefetch_related("participants")
 
        user_ids = []
        for chat in chats:
            other_user = chat.participants.exclude(id=current_user.id).first()
            if other_user:
                user_ids.append(other_user.id)
 
        return User.objects.filter(id__in=user_ids).order_by("username")
 
    def get_pending_users(self, current_user):
        pending_requests = ChatRequest.objects.filter(
            Q(sender=current_user) | Q(receiver=current_user),
            status=ChatRequest.Status.PENDING
        )
 
        user_ids = []
        for chat_request in pending_requests:
            if chat_request.sender_id == current_user.id:
                user_ids.append(chat_request.receiver_id)
            else:
                user_ids.append(chat_request.sender_id)
 
        return User.objects.filter(id__in=user_ids).order_by("username")
 
 
# --------------------------------------------------
# CHAT REQUESTS
# --------------------------------------------------
 
class SendChatRequestView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request):
        serializer = SendChatRequestSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        receiver = serializer.receiver
        existing_chat = Chat.objects.filter(
            participants=request.user,
            is_active=True,
        ).filter(participants=receiver).first()

        if existing_chat:
            other_participant = ChatParticipant.objects.filter(
                chat=existing_chat,
                is_active=False
            ).exclude(user=request.user).first()

            if other_participant:

                ChatParticipant.objects.filter(
                    chat=existing_chat,
                    user=request.user
                ).update(is_active=False)
            else:
                notify_user(request.user.id, "request_accepted", {"chat_id": existing_chat.id})
                serializer_chat = ChatDetailSerializer(existing_chat, context={"request": request})
                return Response({"detail": "Чат відновлено.", "chat": serializer_chat.data}, status=status.HTTP_200_OK)

        chat_request = serializer.save()

 
class ChatRequestsView(generics.ListAPIView):
    serializer_class = ChatRequestSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        current_user = self.request.user
        request_type = self.request.query_params.get("type", "all")
 
        base_queryset = ChatRequest.objects.filter(
            status=ChatRequest.Status.PENDING
        ).select_related("sender", "receiver")
 
        if request_type == "incoming":
            return base_queryset.filter(receiver=current_user).order_by("-created_at")
 
        if request_type == "outgoing":
            return base_queryset.filter(sender=current_user).order_by("-created_at")
 
        return base_queryset.filter(
            Q(sender=current_user) | Q(receiver=current_user)
        ).order_by("-created_at")
 
 
class AcceptChatRequestView(APIView):
    permission_classes = [IsAuthenticated]
 
    @transaction.atomic
    def post(self, request, pk):
        try:
            chat_request = ChatRequest.objects.select_for_update().get(
                id=pk,
                receiver=request.user,
                status=ChatRequest.Status.PENDING
            )
        except ChatRequest.DoesNotExist:
            return Response(
                {"detail": "Запит не знайдено або він вже неактивний."},
                status=status.HTTP_404_NOT_FOUND
            )
 
        sender = chat_request.sender
        receiver = chat_request.receiver
 
        existing_chat = Chat.objects.filter(
            participants=sender,
            is_active=True
        ).filter(participants=receiver).first()
 
        if existing_chat:
            current_participant = existing_chat.chat_participants.filter(
                user=request.user,
                is_active=True
            ).first()
            if current_participant:
                raise serializers.ValidationError(
                    "Чат з цим користувачем вже існує."
                )
 
        chat = Chat.objects.create(is_active=True)
        ChatParticipant.objects.create(chat=chat, user=sender, is_active=True)
        ChatParticipant.objects.create(chat=chat, user=receiver, is_active=True)
 
        chat_request.status = ChatRequest.Status.ACCEPTED
        chat_request.save(update_fields=["status", "updated_at"])
 
        ChatRequest.objects.filter(
            Q(sender=sender, receiver=receiver) |
            Q(sender=receiver, receiver=sender),
            status=ChatRequest.Status.PENDING
        ).exclude(id=chat_request.id).update(
            status=ChatRequest.Status.CANCELLED,
            updated_at=timezone.now()
        )
 
        serializer = ChatDetailSerializer(chat, context={"request": request})
 
        notify_user(sender.id, "request_accepted", {"chat_id": chat.id})
        notify_user(receiver.id, "request_accepted", {"chat_id": chat.id})
 
        return Response(
            {"detail": "Запит прийнято. Чат створено.", "chat": serializer.data},
            status=status.HTTP_201_CREATED
        )
 
 
class DeclineChatRequestView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request, pk):
        try:
            chat_request = ChatRequest.objects.get(
                id=pk,
                receiver=request.user,
                status=ChatRequest.Status.PENDING
            )
        except ChatRequest.DoesNotExist:
            return Response(
                {"detail": "Запит не знайдено або він вже неактивний."},
                status=status.HTTP_404_NOT_FOUND
            )
 
        chat_request.status = ChatRequest.Status.DECLINED
        chat_request.save(update_fields=["status", "updated_at"])
 
        notify_user(chat_request.sender.id, "request_declined", {
            "request_id": pk,
        })
 
        serializer = ChatRequestSerializer(chat_request, context={"request": request})
        return Response(
            {"detail": "Запит відхилено.", "request": serializer.data},
            status=status.HTTP_200_OK
        )
 
 
class CancelChatRequestView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request, pk):
        try:
            chat_request = ChatRequest.objects.get(
                id=pk,
                sender=request.user,
                status=ChatRequest.Status.PENDING
            )
        except ChatRequest.DoesNotExist:
            return Response(
                {"detail": "Запит не знайдено або він вже неактивний."},
                status=status.HTTP_404_NOT_FOUND
            )
 
        chat_request.status = ChatRequest.Status.CANCELLED
        chat_request.save(update_fields=["status", "updated_at"])
 
        notify_user(chat_request.receiver.id, "request_cancelled", {
            "request_id": pk,
        })
 
        serializer = ChatRequestSerializer(chat_request, context={"request": request})
        return Response(
            {"detail": "Запит скасовано.", "request": serializer.data},
            status=status.HTTP_200_OK
        )
 
 
# --------------------------------------------------
# CHATS
# --------------------------------------------------
 
class ChatListView(generics.ListAPIView):
    serializer_class = ChatListSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        current_user = self.request.user
        return Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).prefetch_related(
            "participants", "messages", "chat_participants"
        ).distinct().order_by("-updated_at")
 
 
class ChatDetailView(generics.RetrieveAPIView):
    serializer_class = ChatDetailSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        current_user = self.request.user
        return Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).prefetch_related(
            "participants", "messages", "chat_participants"
        ).distinct()
 
 
class DeleteChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            ChatParticipant.objects.get(
                chat_id=pk,
                user=request.user,
                is_active=True
            )
        except ChatParticipant.DoesNotExist:
            return Response(
                {"detail": "Чат не знайдено."},
                status=status.HTTP_404_NOT_FOUND
            )

        now = timezone.now()

        ChatParticipant.objects.filter(
            chat_id=pk,
            is_active=True
        ).update(deleted_at=now, is_active=False)

        return Response(
            {"detail": "Чат видалено для всіх учасників."},
            status=status.HTTP_200_OK
        )
 
 
# --------------------------------------------------
# MESSAGES
# --------------------------------------------------
 
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
 
    def get_queryset(self):
        current_user = self.request.user
        chat_id = self.kwargs.get("chat_id")
 
        try:
            participant = ChatParticipant.objects.get(
                chat_id=chat_id,
                user=current_user,
                is_active=True
            )
        except ChatParticipant.DoesNotExist:
            return Message.objects.none()
 
        messages = Message.objects.filter(
            chat_id=chat_id,
            is_deleted=False
        ).select_related("sender").order_by("created_at")
 
        if participant.deleted_at:
            messages = messages.filter(created_at__gt=participant.deleted_at)
 
        return messages
 
 
class MarkMessagesAsReadView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request, chat_id):
        current_user = request.user
 
        is_participant = ChatParticipant.objects.filter(
            chat_id=chat_id,
            user=current_user,
            is_active=True
        ).exists()
 
        if not is_participant:
            return Response(
                {"detail": "Чат не знайдено."},
                status=status.HTTP_404_NOT_FOUND
            )
 
        updated_count = Message.objects.filter(
            chat_id=chat_id,
            is_read=False,
            is_deleted=False
        ).exclude(sender=current_user).update(is_read=True)
 
        return Response(
            {"detail": "Повідомлення позначено як прочитані.", "updated_count": updated_count},
            status=status.HTTP_200_OK
        )
 
 
class DeleteMessageView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request, pk):
        try:
            message = Message.objects.get(
                id=pk,
                sender=request.user,
                is_deleted=False
            )
        except Message.DoesNotExist:
            return Response(
                {"detail": "Повідомлення не знайдено або ви не можете його видалити."},
                status=status.HTTP_404_NOT_FOUND
            )
 
        message.is_deleted = True
        message.save(update_fields=["is_deleted", "updated_at"])
 
        return Response({"detail": "Повідомлення видалено."}, status=status.HTTP_200_OK)