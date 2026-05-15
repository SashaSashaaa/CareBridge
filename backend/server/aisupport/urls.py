from django.urls import path
from .views import aisupport_chat

urlpatterns = [
    path("chat/", aisupport_chat, name="aisupport_chat"),
]