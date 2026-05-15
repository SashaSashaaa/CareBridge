from django.urls import path
from .views import UserDetailView, RegisterView, LoginView, LogoutView

urlpatterns = [
    path('profile/', UserDetailView.as_view(), name='profile'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]