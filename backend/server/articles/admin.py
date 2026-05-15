from django.contrib import admin
from .models import Article, UnmoderatedArticle
from imagekit.admin import AdminThumbnail
from django import forms
from ckeditor.widgets import CKEditorWidget

class ArticleAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget(), label="Опис статті")
    class Meta:
        model = Article
        fields = '__all__'
    
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    form = ArticleAdminForm
    admin_thumbnail = AdminThumbnail(image_field='thumbnail')
    list_display = ("name", "user", "moderated", "admin_thumbnail")
    readonly_fields = ["user", "id"]
    search_fields = ("name",)
    list_filter = ("moderated",)
    actions = ["approve_articles"]

    @admin.action(description="Підтвердити вибрані статті")
    def approve_articles(self, request, queryset):
        queryset.update(moderated=True)

@admin.register(UnmoderatedArticle)
class UnmoderatedArticleAdmin(admin.ModelAdmin):
    form = ArticleAdminForm
    admin_thumbnail = AdminThumbnail(image_field='thumbnail')
    list_display = ("name", "user", "moderated", "admin_thumbnail")
    readonly_fields = ["name", "description", "main_description", "user", "admin_thumbnail", "id",]
    search_fields = ("name",)
    actions = ["approve_articles"]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(moderated=False)

    @admin.action(description="Підтвердити вибрані статті")
    def approve_articles(self, request, queryset):
        queryset.update(moderated=True)