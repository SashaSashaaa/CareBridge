from .serializers import ArticleSerializer
from .models import Article
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

class OneArticleView(RetrieveAPIView):
    queryset = Article.objects.filter(moderated=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]


class ArticlePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20

class ArticlesView(ListAPIView):
    serializer_class = ArticleSerializer
    pagination_class = ArticlePagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Article.objects.filter(moderated=True).order_by("-created_at")
        name = self.request.query_params.get('name')

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset


class ArticleCreateView(CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, moderated=False)

class ArticleUpdateView(UpdateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class ArticleDeleteView(DestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class MyArticlesView(ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Article.objects.filter(user=self.request.user).order_by("-created_at")