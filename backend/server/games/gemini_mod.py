import json
import re
from google import genai
from tenacity import retry, wait_exponential, stop_after_attempt

client = genai.Client()


class GeminiRequests:

    def __init__(self):
        pass

    @retry(wait=wait_exponential(min=2, max=10), stop=stop_after_attempt(3))
    def _generate(self, model: str, prompt: str):
        print("gemini request", prompt)
        res = client.models.generate_content(
            model=model,
            contents=prompt,
        )
        print("gemini response")
        return res

    def _extract_json(self, text: str):
        text = text.strip()

        text = re.sub(r"^```json", "", text, flags=re.IGNORECASE).strip()
        text = re.sub(r"^```", "", text).strip()
        text = re.sub(r"```$", "", text).strip()

        start = text.find("[")
        end = text.rfind("]")

        if start != -1 and end != -1 and end > start:
            return text[start:end + 1]

        return text
    
    def _fix_json(self, text: str):
        text = re.sub(
            r'"answers":\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"',
            r'"answers": ["\1", "\2", "\3", "\4"]',
            text
        )

        return text


    def generate_questions(self, topic: str):
        prompt = f"""
Згенеруй 10 тестових запитань по темі: "{topic}"

ВИМОГИ:
- рівно 10 питань
- 4 варіанти відповіді
- тільки 1 правильна
- правильна відповідь: число 0-3
- keyword: 1 слово на англійській мові для пошуку картинки

ПОВЕРНИ СТРОГО ЧИСТИЙ JSON БЕЗ ДОДАТКОВОГО СИНТАКСИСУ:

[
  {{
    "question": "string",
    "answers": ["a", "b", "c", "d"],
    "right": 0,
    "keyword": "string"
  }}
]

ВАЖЛИВО:
- answers ОБОВ'ЯЗКОВО має бути JSON масивом ["a","b","c","d"]
- НЕ ПОРУШУЙ JSON
- НЕ ПИШИ текст поза JSON
"""

        response = self._generate("gemini-3.1-flash-lite", prompt)

        text = response.text.strip()
        clean = self._extract_json(text)
        clean = self._fix_json(clean)

        try:
            data = json.loads(clean)

            if not isinstance(data, list) or len(data) == 0:
                raise ValueError("Invalid JSON")

            for q in data:
                if not all(k in q for k in ("question", "answers", "right", "keyword")):
                    raise ValueError("Broken structure")

            return data

        except Exception as e:
            print("JSON parse error:", e)
            print("RAW:", text)
            return []

    #################################################################
    # генерація звіту
    def generate_report_game1(self, ai, transport, eco, income, saving, transport_type, bots):
        prompt = f"""
Це гра-симуляція розвитку країни.

ІНВЕСТИЦІЇ:
- AI: {ai} додано для прокачки бота {bots["ai"]["progress"]} з 20
- Transport: {transport} додано для прокачки бота {bots["transport"]["progress"]} з 20
- Eco: {eco} додано для прокачки бота {bots["eco"]["progress"]} з 20
Чи раціонально це, зроби оригінальну відповідь, якщо грошей не дано?

Прокачано тип перевезень: {transport_type}
Дохід: {income}
Економія: {saving}

Згенеруй короткий звіт українською:
- що зробив кожен напрям
- як використані кошти
- який результат для країни

Лаконічно (5-7 речень), без JSON.
"""
        
        # print(prompt)

        try:
            response = self._generate("gemini-3.1-flash-lite", prompt)
        except Exception:
            response = self._generate("gemini-3.1-flash-lite", prompt)

        return response.text.strip()
    
    ################################################
    def generate_report_travel(
        self,
        dest, comfort, exp,
        profit, rating,
        place, season,
        risk,
        tour
    ):
        prompt = f"""
Ти — аналітик туристичної компанії.

Проаналізуй результат раунду гри.

ІНВЕСТИЦІЇ:
- destinations: +{dest} → {tour["destinations"]["progress"]}/20
- comfort: +{comfort} → {tour["comfort"]["progress"]}/20
- experience: +{exp} → {tour["experience"]["progress"]}/20

ПОДОРОЖ:
- напрям: {place}
- сезон: {season}
- ризик: {round(risk, 2)}

РЕЗУЛЬТАТ:
- прибуток: {round(profit)}
- рейтинг: {round(rating, 2)} / 5

Напиши короткий звіт українською:

ВИМОГИ:
- 5–7 речень
- стиль: професійний, але живий (як тревел-блог + бізнес-звіт)
- поясни:
  - чи вдалі інвестиції
  - як сезон вплинув
  - чи був ризик критичним
  - які емоції отримали туристи
- додай 1 яскраву деталь (вірусний ефект / провал / несподіваний успіх)

НЕ ПИШИ JSON.
"""

        try:
            response = self._generate("gemini-3.1-flash-lite", prompt)
        except Exception:
            response = self._generate("gemini-3.1-flash-lite", prompt)

        return response.text.strip()


    def generate_report_planting_game(
        self,
        plants, water, automation,
        income, eco_score,
        event,
        bots
    ):
        prompt = f"""
    Це гра-симуляція фермерського господарства.

    ІНВЕСТИЦІЇ:
    - Рослини (plants): +{plants} → {bots["plants"]["progress"]}/20
    - Вода (water): +{water} → {bots["water"]["progress"]}/20
    - Автоматизація (automation): +{automation} → {bots["automation"]["progress"]}/20

    ПОДІЯ:
    - {event}

    РЕЗУЛЬТАТ:
    - Урожай (дохід): {round(income)}
    - Екологія: {round(eco_score)}

    Згенеруй короткий звіт українською:

    ВИМОГИ:
    - 5-7 речень
    - стиль: як агро-звіт або фермерський щоденник
    - поясни:
    - як інвестиції вплинули на урожай
    - яку роль зіграла вода
    - чи допомогла автоматизація
    - як подія ({event}) вплинула
    - додай 1 атмосферну деталь (наприклад: “поля ожили після дощу” або “посуха виснажила ґрунт”)

    НЕ ПИШИ JSON.
    """

        try:
            response = self._generate("gemini-3.1-flash-lite", prompt)
        except Exception:
            response = self._generate("gemini-3.1-flash-lite", prompt)

        return response.text.strip()