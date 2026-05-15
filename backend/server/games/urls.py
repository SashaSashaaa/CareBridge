from django.urls import path
from . import views


urlpatterns = [
    path("quiz/", views.quiz, name="quiz"),
    path("quiz_image/", views.quiz_image, name="quiz_image"),

    path("round_game1/", views.round_game1, name="round_game1"),
    path("round_game_travel/", views.round_game_travel, name="round_game_travel"),
    path("round_game_planting/", views.round_game_planting, name="round_game_planting"),
]