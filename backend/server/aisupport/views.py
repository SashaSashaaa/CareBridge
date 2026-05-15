import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .aisupportAI import get_aisupport_reply


@csrf_exempt
def aisupport_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)
        message = data.get("message", "").strip()
        history = data.get("history", [])

        if not message:
            return JsonResponse({"error": "Повідомлення порожнє"}, status=400)

        reply = get_aisupport_reply(message, history)

        return JsonResponse({"reply": reply}, status=200)

    except Exception as e:
        print("VIEW ERROR:", repr(e))
        return JsonResponse(
            {"reply": "Сталася тимчасова помилка. Спробуй ще раз пізніше."},
            status=200
        )