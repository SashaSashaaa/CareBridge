from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .gemini_mod import GeminiRequests
from .pixabay import get_image
from .programming_game1 import play_round as play_round_game1, reset as reset_game1
from .travel_game2 import play_round as play_round_game_travel, reset as reset_game_travel
from .planting_game3 import play_round as play_round_game_planting, reset as reset_game_planting


greqs = GeminiRequests()


def quiz(request):
    topic = request.GET.get("topic")

    questions = greqs.generate_questions(topic)

    reset_game1()
    reset_game_planting()
    reset_game_travel()

    return JsonResponse(questions, safe=False)


@csrf_exempt
def quiz_image(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        if not data or "keyword" not in data:
            return JsonResponse({"error": "keyword is required"}, status=400)

        keyword = data["keyword"]
        img = get_image(keyword)

        return JsonResponse({"image": img})

    except Exception as e:
        print("ERROR:", e)
        return JsonResponse({"error": "Internal server error"}, status=500)


@csrf_exempt
def round_game1(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    data = json.loads(request.body)

    ai = data.get("ai", 0)
    transport = data.get("transport", 0)
    eco = data.get("eco", 0)

    return play_round_game1(
        ai,
        transport,
        eco,
        greqs.generate_report_game1
    )


@csrf_exempt
def round_game_travel(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    data = json.loads(request.body)

    dest = data.get("dest", 0)
    comfort = data.get("comfort", 0)
    exp = data.get("exp", 0)

    return play_round_game_travel(
        dest,
        comfort,
        exp,
        greqs.generate_report_travel
    )


@csrf_exempt
def round_game_planting(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    data = json.loads(request.body)

    plants = data.get("plants", 0)
    water = data.get("water", 0)
    automation = data.get("automation", 0)

    return play_round_game_planting(
        plants,
        water,
        automation,
        greqs.generate_report_planting_game
    )