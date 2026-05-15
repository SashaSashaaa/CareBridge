from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import Thumbnail, ResizeToFit
from django.contrib.auth.models import User
from django.utils import timezone
from PIL import Image
import uuid

class Category(models.Model):
    id = models.UUIDField(verbose_name="Код категорії", default=uuid.uuid4, primary_key=True)
    name = models.CharField(verbose_name="Ім'я категорії", max_length=100)
    image = models.ImageField(verbose_name="Картинка", upload_to='category/', blank=True, null=True)
    
    def _resize_image(self):
        img_path = self.image.path
        img = Image.open(img_path)
        if img.height > 500 or img.width > 500:
            img.thumbnail((500, 500))
            img.save(img_path, format='JPEG', quality=85)

    def save(self, *args, **kwargs):
        try:
            old_instance = Category.objects.get(pk=self.pk)
            if old_instance.image != self.image:
                if old_instance.image:
                    old_instance.image.delete(save=False)
        except Category.DoesNotExist:
            pass

        super().save(*args, **kwargs)
        if self.image:
            self._resize_image()

    class Meta:
        verbose_name = "Категорія волонтерства"
        verbose_name_plural = "Категорії волонтерств"

    def __str__(self):
        return self.name
    
class Volunteer(models.Model):
    id = models.UUIDField(verbose_name="Код волонтерства", default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, verbose_name="Категорія волонтерства")
    main_description = models.TextField(verbose_name="Короткий опис", default="Ваш опис")
    description = models.TextField(verbose_name="Опис")
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='volunteers', null=True, blank=True)
    thumbnail = ImageSpecField(source='image', processors=[ResizeToFit(400, 400)], format='JPEG', options={'quality': 60})
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='volunteers', null=True, blank=True)
    moderated = models.BooleanField(verbose_name="Модерація пройдена", default=False)

    is_highlighted = models.BooleanField(verbose_name="Прорекламовано", default=False)
    highlight_until = models.DateTimeField(verbose_name="Виділено до", null=True, blank=True)

    @property
    def highlighted_active(self):
        return self.is_highlighted and self.highlight_until and self.highlight_until > timezone.now()

    class Meta:
        verbose_name = "Волонтерство"
        verbose_name_plural = "Волонтерства"

    def __str__(self):
        return self.name
    
class UnmoderatedVolunteer(Volunteer):
    class Meta:
        proxy = True
        verbose_name = "Волонтерство на модерації"
        verbose_name_plural = "Волонтерства на модерації"

class Advertisement(models.Model):
    POSITION_CHOICES = [
        ("left", "Ліва сторона"),
        ("right", "Права сторона"),
    ]

    title = models.CharField(max_length=150)
    image = models.ImageField(upload_to="advertisements/")
    link = models.URLField(blank=True)
    position = models.CharField(max_length=10, choices=POSITION_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Реклама"
        verbose_name_plural = "Реклами"