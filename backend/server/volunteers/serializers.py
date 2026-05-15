from rest_framework import serializers
from .models import Volunteer, Category, Advertisement
from django.contrib.auth.models import User

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username"]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class VolunteerSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    user = UserShortSerializer(read_only=True)
    highlighted_active = serializers.ReadOnlyField()

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    class Meta:
        model = Volunteer
        fields = [
            "id",
            "category",
            "category_id",
            "name",
            "description",
            "created_at",
            "image",
            "thumbnail",
            "main_description",
            "user",
            "moderated",
            "is_highlighted",
            "highlight_until",
            "highlighted_active",
        ]
        read_only_fields = ["moderated", "is_highlighted", "highlight_until"]

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ["id", "title", "image", "link", "position"]