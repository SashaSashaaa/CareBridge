from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import Thumbnail, ResizeToFit
from django.contrib.auth.models import User
import uuid
from PIL import Image
    
class Article(models.Model):
    id = models.UUIDField(verbose_name="Код статті", default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=100)
    main_description = models.TextField(verbose_name="Короткий опис", default="Ваш опис")
    description = models.TextField(verbose_name="Опис")
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='articles', null=True, blank=True)
    thumbnail = ImageSpecField(source='image', processors=[ResizeToFit(400, 400)], format='JPEG', options={'quality': 60})
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='articles', null=True, blank=True)
    moderated = models.BooleanField(verbose_name="Модерація пройдена", default=False)

    class Meta:
        verbose_name = "Стаття"
        verbose_name_plural = "Статті"

    def __str__(self):
        return self.name
    
class UnmoderatedArticle(Article):
    class Meta:
        proxy = True
        verbose_name = "Стаття на модерації"
        verbose_name_plural = "Статті на модерації"