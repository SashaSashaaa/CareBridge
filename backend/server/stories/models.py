from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import Thumbnail, ResizeToFit
from django.contrib.auth.models import User
from PIL import Image
import uuid
    
class Story(models.Model):
    id = models.UUIDField(verbose_name="Код статті", default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(verbose_name="Опис")
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='stories', null=True, blank=True)
    thumbnail = ImageSpecField(source='image', processors=[ResizeToFit(400, 400)], format='JPEG', options={'quality': 60})
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories', null=True, blank=True)
    likes = models.ManyToManyField(User, related_name='liked_stories', blank=True)

    class Meta:
        verbose_name = "Історія добра"
        verbose_name_plural = "Історії добра"

    def __str__(self):
        return self.name