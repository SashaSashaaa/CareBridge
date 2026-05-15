from django.contrib import admin
from .models import Story
from imagekit.admin import AdminThumbnail
from django import forms
from ckeditor.widgets import CKEditorWidget

class StoryAdminForm(forms.ModelForm):
    # description = forms.CharField(widget=CKEditorWidget(), label="Опис історії")
    class Meta:
        model = Story
        fields = '__all__'
    
@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    form = StoryAdminForm
    admin_thumbnail = AdminThumbnail(image_field='thumbnail')
    list_display=("name", "admin_thumbnail",)
    readonly_fields = ["user", "id"]
    search_fields = ('name',)