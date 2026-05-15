import re
import time
from google import genai
from django.conf import settings
from .models import AISupportSettings


DEFAULT_SYSTEM_PROMPT = """

Ти — онлайн-помічник платформи CareBridge.
Допомагай користувачам з сайтом, оголошеннями, акаунтом і навігацією.
Пиши українською мовою, коротко і зрозуміло.
Можеш надати легку емоційну підтримку, але не замінюєш психолога або лікаря.

Інструкції по сайту CareBridge:

Щоб створити оголошення:
1. Користувач має увійти або зареєструватися.
2. Після входу треба перейти у розділ "Волонтерства".
3. На сторінці волонтерств потрібно натиснути кнопку "Створити оголошення".
4. У формі треба заповнити назву, категорію, короткий опис, повний опис і додати зображення.
5. Після натискання кнопки збереження оголошення потрапляє на перевірку.
6. До підтвердження адміністратором оголошення буде видно лише власнику в профілі.
7. Після підтвердження оголошення стане доступним для всіх користувачів.

Якщо користувач питає, як щось зробити на сайті, відповідай саме за цими інструкціями, а не "зазвичай".
Не вигадуй кнопки або сторінки, яких немає в CareBridge.
Якщо точної інформації немає в інструкціях — скажи, що краще уточнити у підтримки або адміністрації сайту.


ВАЖЛИВО:
Ти маєш доступ до історії діалогу вище і повинен її використовувати.

НІКОЛИ не кажи, що ти не пам’ятаєш або не маєш доступу до попередніх повідомлень.
НІКОЛИ не кажи, що твоя пам’ять обмежена.

Якщо користувач питає "що я писав раніше" — коротко перекажи попередні повідомлення з історії.
"""

FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemma-4-31b-it",
    "gemini-2.0-flash",
]


def get_active_settings():
    settings_obj = AISupportSettings.objects.filter(is_active=True).first()

    if settings_obj:
        return settings_obj.system_prompt, settings_obj.model_name

    return DEFAULT_SYSTEM_PROMPT, "gemini-3.1-flash-lite"

def build_dialog_text(history, user_message):
    parts = ["Історія діалогу:"]

    for item in history:
        sender = item.get("sender")
        text = item.get("text", "").strip()

        if not text:
            continue

        if sender == "user":
            parts.append(f"Користувач сказав: {text}")
        else:
            parts.append(f"Ти відповів: {text}")

    parts.append(f"Останнє повідомлення користувача: {user_message}")

    return "\n".join(parts)


def try_model(client, model_name, full_prompt):
    response = client.models.generate_content(
        model=model_name,
        contents=full_prompt,
    )

    text = getattr(response, "text", None)
    if text and text.strip():
        return text.strip()

    return "Вибач, зараз не вдалося отримати відповідь."


def get_aisupport_reply(user_message, history=None):
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY не знайдено у .env")

    if history is None:
        history = []

    system_prompt, model_name = get_active_settings()
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    dialog_text = build_dialog_text(history, user_message)

    full_prompt = f"""
{system_prompt}

Ось історія поточної розмови:
{dialog_text}

Відповідай як ШІ-підтримка CareBridge. Можеш коротко підтримати користувача емоційно, але не називай себе психологом і не став діагнозів.
"""

    models_to_try = [model_name]

    for fallback_model in FALLBACK_MODELS:
        if fallback_model not in models_to_try:
            models_to_try.append(fallback_model)

    last_error = ""

    for current_model in models_to_try:
        try:
            return try_model(client, current_model, full_prompt)
        except Exception as e:
            last_error = str(e)
            print(f"AI ERROR MODEL {current_model}:", last_error)

            if "503" in last_error or "UNAVAILABLE" in last_error:
                time.sleep(2)
                try:
                    return try_model(client, current_model, full_prompt)
                except Exception as retry_error:
                    last_error = str(retry_error)
                    print(f"RETRY ERROR MODEL {current_model}:", last_error)

            continue

    if "429" in last_error or "RESOURCE_EXHAUSTED" in last_error:
        return "Зараз сервіс ШІ тимчасово обмежив запити. Спробуй трохи пізніше."

    return "Сталася тимчасова помилка. Спробуй ще раз пізніше."