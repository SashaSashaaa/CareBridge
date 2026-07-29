from rest_framework import serializers
from .models import Story
from django.contrib.auth.models import User

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username"]
        
class StorySerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    user = UserShortSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    class Meta:
        model = Story
        fields = [
            "id",
            "name",
            "description",
            "created_at",
            "image",
            "thumbnail",
            "user",
            "likes_count",
            "is_liked",
        ]