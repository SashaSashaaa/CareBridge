from django.contrib import admin
from .models import AISupportSettings


@admin.register(AISupportSettings)
class AISupportSettingsAdmin(admin.ModelAdmin):
    list_display = ("title", "model_name", "is_active", "updated_at")
    list_filter = ("is_active", "model_name")
    search_fields = ("title", "system_prompt")