from .serializers import StorySerializer
from .models import Story
from .permissions import IsOwnerOrReadOnly

from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class OneStoryView(RetrieveAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [AllowAny]


class StoryPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20


class StoriesView(ListAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    pagination_class = StoryPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        name = self.request.query_params.get('name')

        queryset = Story.objects.all().order_by("-created_at")

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset


class StoryCreateView(CreateAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StoryUpdateView(UpdateAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class StoryDeleteView(DestroyAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class MyStoriesView(ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(user=self.request.user).order_by("-created_at")

class StoryLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        if request.user in story.likes.all():
            story.likes.remove(request.user)
            is_liked = False
        else:
            story.likes.add(request.user)
            is_liked = True
            
        return Response({
            "is_liked": is_liked,
            "likes_count": story.likes.count()
        }, status=status.HTTP_200_OK)