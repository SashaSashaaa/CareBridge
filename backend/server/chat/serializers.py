from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import ChatRequest, Chat, ChatParticipant, Message


User = get_user_model()


# --------------------------------------------------
# USER SERIALIZERS
# --------------------------------------------------

class ShortUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "avatar",
        ]

    def get_full_name(self, obj):
        full_name = obj.get_full_name()
        return full_name if full_name else obj.username

    def get_avatar(self, obj):
        request = self.context.get("request")

        avatar = None

        # Якщо avatar є прямо в User
        if hasattr(obj, "avatar") and obj.avatar:
            avatar = obj.avatar

        # Якщо avatar є в profile
        elif hasattr(obj, "profile"):
            profile = obj.profile
            if hasattr(profile, "avatar") and profile.avatar:
                avatar = profile.avatar

        if not avatar:
            return None

        try:
            url = avatar.url
        except Exception:
            return None

        if request:
            return request.build_absolute_uri(url)

        return url


class ChatUserSerializer(serializers.ModelSerializer):
    """
    Серіалізатор для списку користувачів у чаті.

    Використовується для:
    GET /api/chat/users/?type=all
    GET /api/chat/users/?type=allowed
    GET /api/chat/users/?type=pending

    chat_status:
    - self
    - none
    - request_sent
    - request_received
    - allowed
    """

    full_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    chat_status = serializers.SerializerMethodField()
    request_id = serializers.SerializerMethodField()
    chat_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "avatar",
            "chat_status",
            "request_id",
            "chat_id",
        ]

    def get_full_name(self, obj):
        full_name = obj.get_full_name()
        return full_name if full_name else obj.username

    def get_avatar(self, obj):
        request = self.context.get("request")

        avatar = None

        if hasattr(obj, "avatar") and obj.avatar:
            avatar = obj.avatar

        elif hasattr(obj, "profile"):
            profile = obj.profile
            if hasattr(profile, "avatar") and profile.avatar:
                avatar = profile.avatar

        if not avatar:
            return None

        try:
            url = avatar.url
        except Exception:
            return None

        if request:
            return request.build_absolute_uri(url)

        return url

    def get_chat_status(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return "none"

        current_user = request.user

        if current_user.id == obj.id:
            return "self"

        chat = Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).filter(
            participants=obj
        ).distinct().first()

        if chat:
            return "allowed"

        sent_request = ChatRequest.objects.filter(
            sender=current_user,
            receiver=obj,
            status=ChatRequest.Status.PENDING
        ).first()

        if sent_request:
            return "request_sent"

        received_request = ChatRequest.objects.filter(
            sender=obj,
            receiver=current_user,
            status=ChatRequest.Status.PENDING
        ).first()

        if received_request:
            return "request_received"
        return "none"

    def get_request_id(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        current_user = request.user

        chat_request = ChatRequest.objects.filter(
            sender=current_user,
            receiver=obj,
            status=ChatRequest.Status.PENDING
        ).first()

        if not chat_request:
            chat_request = ChatRequest.objects.filter(
                sender=obj,
                receiver=current_user,
                status=ChatRequest.Status.PENDING
            ).first()

        return chat_request.id if chat_request else None

    def get_chat_id(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        current_user = request.user

        chat = Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).filter(
            participants=obj
        ).distinct().first()

        return chat.id if chat else None


UserListSerializer = ChatUserSerializer


# --------------------------------------------------
# CHAT REQUEST SERIALIZERS
# --------------------------------------------------

class ChatRequestSerializer(serializers.ModelSerializer):
    sender = ShortUserSerializer(read_only=True)
    receiver = ShortUserSerializer(read_only=True)

    class Meta:
        model = ChatRequest
        fields = [
            "id",
            "sender",
            "receiver",
            "status",
            "created_at",
            "updated_at",
        ]


class SendChatRequestSerializer(serializers.Serializer):
    receiver_id = serializers.IntegerField()

    def validate_receiver_id(self, value):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Користувач не авторизований."
            )

        current_user = request.user

        if current_user.id == value:
            raise serializers.ValidationError(
                "Не можна відправити запит самому собі."
            )

        try:
            receiver = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Користувача не знайдено."
            )

        existing_chat = Chat.objects.filter(
            participants=current_user,
            is_active=True,
            chat_participants__user=current_user,
            chat_participants__is_active=True,
        ).filter(
            participants=receiver
        ).first()

        if existing_chat:
            raise serializers.ValidationError(
                "Чат з цим користувачем вже існує."
            )

        direct_pending_request = ChatRequest.objects.filter(
            sender=current_user,
            receiver=receiver,
            status=ChatRequest.Status.PENDING
        ).first()

        if direct_pending_request:
            raise serializers.ValidationError(
                "Запит цьому користувачу вже відправлено."
            )

        reverse_pending_request = ChatRequest.objects.filter(
            sender=receiver,
            receiver=current_user,
            status=ChatRequest.Status.PENDING
        ).first()

        if reverse_pending_request:
            raise serializers.ValidationError(
                "Цей користувач вже відправив вам запит. Ви можете прийняти його."
            )

        self.receiver = receiver

        return value

    def create(self, validated_data):
        request = self.context.get("request")

        return ChatRequest.objects.create(
            sender=request.user,
            receiver=self.receiver,
            status=ChatRequest.Status.PENDING
        )
# --------------------------------------------------
# CHAT PARTICIPANT SERIALIZERS
# --------------------------------------------------

class ChatParticipantSerializer(serializers.ModelSerializer):
    user = ShortUserSerializer(read_only=True)

    class Meta:
        model = ChatParticipant
        fields = [
            "id",
            "user",
            "joined_at",
            "deleted_at",
            "is_active",
        ]


# --------------------------------------------------
# MESSAGE SERIALIZERS
# --------------------------------------------------

class MessageSerializer(serializers.ModelSerializer):
    sender = ShortUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "chat",
            "sender",
            "text",
            "created_at",
            "updated_at",
            "is_read",
            "is_deleted",
        ]

        read_only_fields = [
            "id",
            "chat",
            "sender",
            "created_at",
            "updated_at",
            "is_read",
            "is_deleted",
        ]


class MessageCreateSerializer(serializers.ModelSerializer):
    """
    Цей серіалізатор можна використовувати у WebSocket consumer
    або якщо пізніше додаси REST endpoint для створення повідомлення.
    """

    class Meta:
        model = Message
        fields = [
            "text",
        ]

    def validate_text(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Повідомлення не може бути порожнім."
            )

        if len(value) > 5000:
            raise serializers.ValidationError(
                "Повідомлення занадто довге."
            )

        return value


class LastMessageSerializer(serializers.ModelSerializer):
    sender = ShortUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "text",
            "created_at",
            "is_read",
        ]


# --------------------------------------------------
# CHAT SERIALIZERS
# --------------------------------------------------

class ChatListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "other_user",
            "last_message",
            "unread_count",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def get_other_user(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        other_user = obj.participants.exclude(
            id=request.user.id
        ).first()

        if not other_user:
            return None

        return ShortUserSerializer(
            other_user,
            context=self.context
        ).data

    def get_last_message(self, obj):
        request = self.context.get("request")

        messages = obj.messages.filter(
            is_deleted=False
        )

        if request and request.user.is_authenticated:
            participant = obj.chat_participants.filter(
                user=request.user
            ).first()

            if participant and participant.deleted_at:
                messages = messages.filter(
                    created_at__gt=participant.deleted_at
                )

        message = messages.order_by("-created_at").first()

        if not message:
            return None

        return LastMessageSerializer(
            message,
            context=self.context
        ).data

    def get_unread_count(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return 0
        messages = obj.messages.filter(
            is_read=False,
            is_deleted=False
        ).exclude(
            sender=request.user
        )

        participant = obj.chat_participants.filter(
            user=request.user
        ).first()

        if participant and participant.deleted_at:
            messages = messages.filter(
                created_at__gt=participant.deleted_at
            )

        return messages.count()


class ChatDetailSerializer(serializers.ModelSerializer):
    participants_data = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = [
            "id",
            "participants_data",
            "other_user",
            "messages",
            "unread_count",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def get_participants_data(self, obj):
        participants = obj.chat_participants.select_related(
            "user"
        ).all()

        return ChatParticipantSerializer(
            participants,
            many=True,
            context=self.context
        ).data

    def get_other_user(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None

        other_user = obj.participants.exclude(
            id=request.user.id
        ).first()

        if not other_user:
            return None

        return ShortUserSerializer(
            other_user,
            context=self.context
        ).data

    def get_messages(self, obj):
        request = self.context.get("request")

        messages = obj.messages.filter(
            is_deleted=False
        ).select_related(
            "sender"
        ).order_by(
            "created_at"
        )

        if request and request.user.is_authenticated:
            participant = obj.chat_participants.filter(
                user=request.user
            ).first()

            if participant and participant.deleted_at:
                messages = messages.filter(
                    created_at__gt=participant.deleted_at
                )

        return MessageSerializer(
            messages,
            many=True,
            context=self.context
        ).data

    def get_unread_count(self, obj):
        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return 0

        messages = obj.messages.filter(
            is_read=False,
            is_deleted=False
        ).exclude(
            sender=request.user
        )

        participant = obj.chat_participants.filter(
            user=request.user
        ).first()

        if participant and participant.deleted_at:
            messages = messages.filter(
                created_at__gt=participant.deleted_at
            )

        return messages.count()


# --------------------------------------------------
# WEBSOCKET PAYLOAD SERIALIZER
# --------------------------------------------------

class WebSocketMessageSerializer(serializers.ModelSerializer):
    """
    Зручно використовувати в consumers.py,
    щоб повертати однакову структуру повідомлення
    і через REST, і через WebSocket.
    """

    sender = ShortUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "chat",
            "sender",
            "text",
            "created_at",
            "updated_at",
            "is_read",
        ]