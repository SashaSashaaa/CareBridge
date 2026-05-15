from django.urls import path
from .views import (
    OneArticleView,
    ArticlesView,
    ArticleCreateView,
    ArticleUpdateView,
    ArticleDeleteView,
    MyArticlesView
)

urlpatterns = [
    path('', ArticlesView.as_view()),
    path("my/", MyArticlesView.as_view(), name="my-articles"),
    path('create/', ArticleCreateView.as_view(), name='create-article'),
    path('<uuid:pk>/update/', ArticleUpdateView.as_view(), name='update-article'),
    path('delete/<uuid:pk>/', ArticleDeleteView.as_view(), name='delete-article'),
    path('<uuid:pk>/', OneArticleView.as_view()),
]