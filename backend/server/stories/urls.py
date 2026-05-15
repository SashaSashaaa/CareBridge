from django.urls import path
from .views import (
    OneStoryView,
    StoriesView,
    StoryCreateView,
    StoryUpdateView,
    StoryDeleteView,
    MyStoriesView,
)

urlpatterns = [
    path('', StoriesView.as_view()),
    path("profile/me/", MyStoriesView.as_view(), name="my-stories"),
    path("my/", MyStoriesView.as_view(), name="my-stories"),
    path('create/', StoryCreateView.as_view(), name='create-story'),
    path('<uuid:pk>/update/', StoryUpdateView.as_view(), name='update-story'),
    path('delete/<uuid:pk>/', StoryDeleteView.as_view(), name='delete-story'),
    path('<uuid:pk>/', OneStoryView.as_view()),
]