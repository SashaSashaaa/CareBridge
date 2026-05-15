from django.contrib import admin
from .models import Category, Volunteer, Advertisement, UnmoderatedVolunteer
from imagekit.admin import AdminThumbnail
from django import forms
from ckeditor.widgets import CKEditorWidget

class VolunteerAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget(), label="Опис волонтерства")
    class Meta:
        model = Volunteer
        fields = '__all__'
    
@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    form = VolunteerAdminForm
    admin_thumbnail = AdminThumbnail(image_field='thumbnail')

    list_display = ("name", "category", "user", "moderated", "is_highlighted", "admin_thumbnail")
    readonly_fields = ["user", "id"]
    search_fields = ("name",)
    list_filter = ("moderated", "category")
    actions = ["approve_volunteers"]

    @admin.action(description="Підтвердити вибрані волонтерства")
    def approve_volunteers(self, request, queryset):
        queryset.update(moderated=True)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("id", "name")
    readonly_fields = ["id"]

@admin.register(UnmoderatedVolunteer)
class UnmoderatedVolunteerAdmin(admin.ModelAdmin):
    form = VolunteerAdminForm
    admin_thumbnail = AdminThumbnail(image_field='thumbnail')

    list_display = ("name", "user", "moderated", "admin_thumbnail")
    readonly_fields = ["name", "category", "description", "main_description", "user", "admin_thumbnail", "id",]
    search_fields = ("name",)
    actions = ["approve_volunteers"]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(moderated=False)

    @admin.action(description="Підтвердити вибрані волонтерства")
    def approve_volunteers(self, request, queryset):
        queryset.update(moderated=True)

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ("title", "position", "is_active", "created_at")
    list_filter = ("position", "is_active")
    search_fields = ("title",)