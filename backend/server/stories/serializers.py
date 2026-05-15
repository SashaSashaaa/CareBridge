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

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

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
        ]
