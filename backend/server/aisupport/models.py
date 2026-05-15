from django.db import models


class AISupportSettings(models.Model):
    MODEL_CHOICES = [
        ("gemini-3.1-flash-lite", "Gemini 3.1 Flash-Lite"),
        ("gemini-2.5-flash", "Gemini 2.5 Flash"),
        ("gemini-2.5-flash-lite", "Gemini 2.5 Flash-Lite"),
        ("gemini-2.5-pro", "Gemini 2.5 Pro"),
        ("gemma-4-31b-it", "Gemma 4 31B"),
        ("gemini-2.0-flash", "Gemini 2.0 Flash"),
    ]

    title = models.CharField("Назва", max_length=100, default="Основні налаштування")
    system_prompt = models.TextField("Системний промпт")
    model_name = models.CharField(
        "Модель",
        max_length=100,
        choices=MODEL_CHOICES,
        default="gemini-3.1-flash-lite"
    )
    is_active = models.BooleanField("Активний", default=True)
    updated_at = models.DateTimeField("Оновлено", auto_now=True)

    class Meta:
        verbose_name = "Налаштування чату ШІ Підтримки"
        verbose_name_plural = "Налаштування чату ШІ Підтримки"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_active:
            AISupportSettings.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)