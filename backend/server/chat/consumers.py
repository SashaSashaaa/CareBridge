import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from .models import Chat, ChatParticipant, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]
        self.room_group_name = f"chat_{self.chat_id}"

        if not self.user.is_authenticated:
            await self.close()
            return

        is_participant = await self.is_chat_participant(
            user_id=self.user.id,
            chat_id=self.chat_id
        )

        if not is_participant:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.mark_messages_as_read(
            user_id=self.user.id,
            chat_id=self.chat_id
        )

        await self.send(text_data=json.dumps({
            "type": "connection",
            "message": "Chat websocket connected",
            "chat_id": self.chat_id,
        }))

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Invalid JSON",
            }))
            return

        event_type = data.get("type")

        if event_type == "message":
            await self.handle_message(data)
            return

        if event_type == "typing":
            await self.handle_typing(data)
            return

        if event_type == "read":
            await self.handle_read(data)
            return

        await self.send(text_data=json.dumps({
            "type": "error",
            "message": "Unknown event type",
        }))

    async def handle_message(self, data):
        text = data.get("text", "").strip()

        if not text:
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Message text is empty",
            }))
            return

        message = await self.create_message(
            chat_id=self.chat_id,
            user_id=self.user.id,
            text=text
        )

        await self.touch_chat(self.chat_id)

        payload = {
            "id": message["id"],
            "chat": int(self.chat_id),
            "text": message["text"],
            "created_at": message["created_at"],
            "is_read": message["is_read"],
            "sender": {
                "id": self.user.id,
                "username": self.user.username,
                "email": self.user.email,
                "full_name": self.user.get_full_name() or self.user.username,
            }
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "payload": payload,
            }
        )

        other_user_ids = await self.get_other_user_ids(
            chat_id=self.chat_id,
            user_id=self.user.id
        )

        for user_id in other_user_ids:
            await self.channel_layer.group_send(
                f"user_{user_id}_notifications",
                {
                    "type": "notify",
                    "event_type": "new_message",
                    "data": payload,
                }
            )

    async def handle_typing(self, data):
        is_typing = bool(data.get("is_typing", False))
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_typing",
                "user_id": self.user.id,
                "username": self.user.username,
                "is_typing": is_typing,
            }
        )

    async def handle_read(self, data):
        updated_count = await self.mark_messages_as_read(
            user_id=self.user.id,
            chat_id=self.chat_id
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_read",
                "user_id": self.user.id,
                "updated_count": updated_count,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "data": event["payload"],
        }))

    async def chat_typing(self, event):
        if event["user_id"] == self.user.id:
            return

        await self.send(text_data=json.dumps({
            "type": "typing",
            "user_id": event["user_id"],
            "username": event["username"],
            "is_typing": event["is_typing"],
        }))

    async def chat_read(self, event):
        await self.send(text_data=json.dumps({
            "type": "read",
            "user_id": event["user_id"],
            "updated_count": event["updated_count"],
        }))

    @database_sync_to_async
    def is_chat_participant(self, user_id, chat_id):
        return ChatParticipant.objects.filter(
            chat_id=chat_id,
            user_id=user_id,
            is_active=True,
            chat__is_active=True
        ).exists()

    @database_sync_to_async
    def create_message(self, chat_id, user_id, text):
        message = Message.objects.create(
            chat_id=chat_id,
            sender_id=user_id,
            text=text,
            is_read=False,
            is_deleted=False
        )

        return {
            "id": message.id,
            "text": message.text,
            "created_at": message.created_at.isoformat(),
            "is_read": message.is_read,
        }

    @database_sync_to_async
    def touch_chat(self, chat_id):
        Chat.objects.filter(id=chat_id).update(
            updated_at=timezone.now()
        )

    @database_sync_to_async
    def mark_messages_as_read(self, user_id, chat_id):
        return Message.objects.filter(
            chat_id=chat_id,
            is_read=False,
            is_deleted=False
        ).exclude(
            sender_id=user_id
        ).update(
            is_read=True
        )

    @database_sync_to_async
    def get_other_user_ids(self, chat_id, user_id):
        return list(
            ChatParticipant.objects.filter(
                chat_id=chat_id,
                is_active=True
            ).exclude(
                user_id=user_id
            ).values_list(
                "user_id",
                flat=True
            )
        )


class ChatNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        self.user_group_name = f"user_{self.user.id}_notifications"

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "connection",
            "message": "Notification websocket connected",
        }))

    async def disconnect(self, close_code):
        if hasattr(self, "user_group_name"):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def notify(self, event):
        await self.send(text_data=json.dumps({
            "type": event.get("event_type"),
            "data": event.get("data"),
        }))