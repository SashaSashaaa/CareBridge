import random
from django.http import JsonResponse


"""
Опис гри:

Це покрокова симуляційна гра, у якій гравець розподіляє ресурси між трьома напрямками:
- AI (штучний інтелект)
- Транспорт
- Екологія

У кожному раунді гравець інвестує обрану кількість ресурсів у ці сфери.
Інвестиції підвищують рівень розвитку відповідних систем, кожна з яких має максимум 20.

Основні механіки:
- AI підсилює інші системи:
    * збільшує дохід від транспорту
    * підвищує екологічні заощадження
- Транспорт генерує дохід:
    * у кожному раунді випадково обирається тип транспорту (auto, air, water)
    * дохід залежить від рівня транспорту та бонусу AI
- Екологія генерує заощадження:
    * заощадження зростають залежно від рівня екології та бонусу AI

Особливості:
- Прогрес кожної системи обмежений значенням 20
- Випадковий тип транспорту додає варіативності
- Загальний дохід і заощадження накопичуються з кожним раундом
- Гра завершується, коли всі системи досягають максимального рівня

Додатково:
- Після кожного раунду генерується текстовий звіт (через зовнішню AI-функцію)
- Стан гри повертається у форматі JSON (Flask API)
- Функція reset повністю перезапускає гру

Мета гри:
Максимізувати сумарний дохід і заощадження, стратегічно розподіляючи ресурси
між AI, транспортом і екологією до повного розвитку всіх систем.
"""


bots = {
    "ai": {"progress": 0, "max": 20},
    "transport": {"progress": 0, "max": 20},
    "eco": {"progress": 0, "max": 20}
}

total_income = 0
total_saving = 0
round_count = 0


def calc_round(ai_invest, transport_invest, eco_invest):
    global total_income, total_saving, round_count

    bots["ai"]["progress"] += ai_invest
    bots["transport"]["progress"] += transport_invest
    bots["eco"]["progress"] += eco_invest

    for b in bots:
        bots[b]["progress"] = min(bots[b]["progress"], 20)

    ai_level = bots["ai"]["progress"] / 20
    transport_level = bots["transport"]["progress"] / 20
    eco_level = bots["eco"]["progress"] / 20

    aiBoostTransport = 1 + 0.3 * ai_level
    aiBoostEco = 1 + 0.4 * ai_level

    transport_type = random.choice(["auto", "air", "water"])

    data = {
        "auto": (100, 150),
        "air": (60, 200),
        "water": (50, 300)
    }

    base, upgraded = data[transport_type]

    income = (base + (upgraded - base) * transport_level) * aiBoostTransport
    saving = (20 + (200 - 20) * eco_level) * aiBoostEco

    total_income += income
    total_saving += saving
    round_count += 1

    return transport_type, income, saving



def play_round(ai, transport, eco, gemini_generate_report):
    transport_type, income, saving = calc_round(ai, transport, eco)

    report = gemini_generate_report(ai, transport, eco, income, saving, transport_type, bots)

    game_over = True

    for b in bots:
        if bots[b]["progress"] < 20:
            game_over = False
            break

    return JsonResponse({
        "last_ai": ai,
        "last_transport": transport,
        "last_eco": eco,
        "income": round(income),
        "saving": round(saving),
        "total_income": round(total_income),
        "total_saving": round(total_saving),
        "round": round_count,
        "progress": bots,
        "report": report,
        "game_over": game_over
    })


def reset():
    global total_income, total_saving, round_count, bots

    total_income = 0
    total_saving = 0
    round_count = 0

    bots = {
        "ai": {"progress": 0, "max": 20},
        "transport": {"progress": 0, "max": 20},
        "eco": {"progress": 0, "max": 20}
    }

