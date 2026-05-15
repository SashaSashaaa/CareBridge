from django.conf import settings
from django.db import models
from django.db.models import Q, F
from django.utils import timezone


class ChatRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Очікує"
        ACCEPTED = "accepted", "Прийнято"
        DECLINED = "declined", "Відхилено"
        CANCELLED = "cancelled", "Скасовано"

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_chat_requests",
        verbose_name="Відправник"
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_chat_requests",
        verbose_name="Отримувач"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Статус"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата створення"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата оновлення"
    )

    class Meta:
        verbose_name = "Запит на спілкування"
        verbose_name_plural = "Запити на спілкування"
        ordering = ["-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["sender", "receiver"],
                condition=Q(status="pending"),
                name="unique_pending_chat_request"
            ),
        ]

    def str(self):
        return f"{self.sender} → {self.receiver} [{self.status}]"


class Chat(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата створення"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата оновлення"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Активний"
    )

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="ChatParticipant",
        related_name="chats",
        verbose_name="Учасники"
    )

    class Meta:
        verbose_name = "Чат"
        verbose_name_plural = "Чати"
        ordering = ["-updated_at"]

    def str(self):
        return f"Чат #{self.id}"

    def get_other_participant(self, user):
        return self.participants.exclude(id=user.id).first()


class ChatParticipant(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="chat_participants",
        verbose_name="Чат"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_participations",
        verbose_name="Користувач"
    )

    joined_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата входу в чат"
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Дата видалення чату користувачем"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Активний учасник"
    )

    class Meta:
        verbose_name = "Учасник чату"
        verbose_name_plural = "Учасники чату"
        unique_together = ("chat", "user")

    def str(self):
        return f"{self.user} у чаті #{self.chat_id}"

    def mark_deleted(self):
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=["deleted_at", "is_active"])


class Message(models.Model):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages",
        verbose_name="Чат"
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_messages",
        verbose_name="Відправник"
    )

    text = models.TextField(
        verbose_name="Текст повідомлення"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата створення"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата оновлення"
    )

    is_read = models.BooleanField(
        default=False,
        verbose_name="Прочитано"
    )

    is_deleted = models.BooleanField(
        default=False,
        verbose_name="Видалено"
    )

    class Meta:
        verbose_name = "Повідомлення"
        verbose_name_plural = "Повідомлення"
        ordering = ["created_at"]

    def str(self):
        return f"Повідомлення #{self.id} від {self.sender}"