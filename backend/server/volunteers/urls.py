from django.urls import path
from .views import (
    VolunteersCategoryView,
    OneVolunteerView,
    VolunteersView,
    VolunteerCreateView,
    VolunteerUpdateView,
    VolunteerDeleteView,
    MyVolunteersView,
    AdvertisementListView
)

urlpatterns = [
    path('', VolunteersView.as_view()),
    path('categories/', VolunteersCategoryView.as_view()),
    path("profile/me/", MyVolunteersView.as_view(), name="my-volunteers"),
    path("my/", MyVolunteersView.as_view(), name="my-volunteers"),
    path('create/', VolunteerCreateView.as_view(), name='create-volunteer'),
    path('<uuid:pk>/update/', VolunteerUpdateView.as_view(), name='update-volunteer'),
    path('delete/<uuid:pk>/', VolunteerDeleteView.as_view(), name='delete-volunteer'),
    path('<uuid:pk>/', OneVolunteerView.as_view()),
    path("advertisements/", AdvertisementListView.as_view()),
]