from .serializers import CategorySerializer, VolunteerSerializer, AdvertisementSerializer
from .models import Volunteer, Category, Advertisement
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


class VolunteersCategoryView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class OneVolunteerView(RetrieveAPIView):
    queryset = Volunteer.objects.filter(moderated=True)
    serializer_class = VolunteerSerializer
    permission_classes = [AllowAny]


class VolunteerPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20

class VolunteersView(ListAPIView):
    serializer_class = VolunteerSerializer
    pagination_class = VolunteerPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Volunteer.objects.filter(moderated=True).order_by("-created_at")

        category_id = self.request.query_params.get('category')
        name = self.request.query_params.get('name')

        if category_id:
            category_ids = category_id.split(',')
            queryset = queryset.filter(category_id__in=category_ids)

        if name:
            queryset = queryset.filter(name__icontains=name)

        return queryset


class VolunteerCreateView(CreateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, moderated=False)

class VolunteerUpdateView(UpdateAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class VolunteerDeleteView(DestroyAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class MyVolunteersView(ListAPIView):
    serializer_class = VolunteerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Volunteer.objects.filter(user=self.request.user).order_by("-created_at")

class AdvertisementListView(ListAPIView):
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Advertisement.objects.filter(is_active=True).order_by("-created_at")