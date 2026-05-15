"""
🎮 ОПИС ГРИ

Це симуляційна гра про розвиток агроекосистеми. Гравець керує трьома напрямками:
- plants (рослини) 🌿 — впливають на базовий дохід
- water (вода) 💧 — дає синергію та покращує екологію
- automation (автоматизація) 🤖 — множить ефективність виробництва

Кожен параметр має прогрес від 0 до 20. Чим більше значення — тим сильніший вплив.

🔄 ІГРОВИЙ РАУНД
1. Гравець додає бали до plants, water, automation
2. Прогрес збільшується (максимум 20)
3. Обчислюється рівень кожного параметра (0–1)
4. Випадкова подія впливає на гру:
   - rain 🌧️ — +вода
   - drought ☀️ — -вода
   - pests 🐛 — зменшення доходу
   - perfect ✨ — бонус до доходу і екології
   - storm ⛈️ — шкода рослинам і воді

💰 ДОХІД
Формується з:
- базового доходу (від рослин)
- бонусу води
- бонусу автоматизації
- впливу події

Формула:
income = base_income × water_bonus × automation_bonus × event_modifier

🌍 ЕКОЛОГІЯ
eco_score залежить від рівня води та подій.
Це показник екологічної ефективності ферми.

📊 СТАТИСТИКА
- total_income — загальний дохід
- total_saving — сумарна екологія
- round_count — кількість раундів

🧠 ЗВІТ
Після кожного раунду генерується текстовий звіт (через AI),
який описує стан ферми та події.

🏁 КІНЕЦЬ ГРИ
Гра завершується, коли всі параметри досягають 20/20.

🔁 RESET
Функція reset() скидає гру до початкового стану.

💡 СУТЬ
Баланс між прибутком 💰, екологією 🌱 та випадковими подіями 🎲.
"""

import random
from django.http import JsonResponse


bots = {
    "plants": {"progress": 0, "max": 20},
    "water": {"progress": 0, "max": 20},
    "automation": {"progress": 0, "max": 20}
}

total_income = 0
total_saving = 0
round_count = 0

def calc_round(plants, water, automation):
    global total_income, total_saving, round_count

    bots["plants"]["progress"] += plants
    bots["water"]["progress"] += water
    bots["automation"]["progress"] += automation

    for b in bots:
        bots[b]["progress"] = min(bots[b]["progress"], 20)

    p_lvl = bots["plants"]["progress"] / 20
    w_lvl = bots["water"]["progress"] / 20
    a_lvl = bots["automation"]["progress"] / 20

    event = random.choice([
        "rain", "drought", "pests", "perfect", "storm"
    ])

    event_modifier = 1
    eco_modifier = 1

    if event == "rain":
        w_lvl += 0.2
    elif event == "drought":
        w_lvl -= 0.3
    elif event == "pests":
        event_modifier -= 0.3
    elif event == "perfect":
        event_modifier += 0.3
        eco_modifier += 0.3
    elif event == "storm":
        p_lvl -= 0.2
        w_lvl -= 0.2

    p_lvl = max(0, min(p_lvl, 1))
    w_lvl = max(0, min(w_lvl, 1))
    a_lvl = max(0, min(a_lvl, 1))

    base_income = 50 + 200 * p_lvl

    water_bonus = 1 + 0.5 * w_lvl

    automation_bonus = 1 + 0.7 * a_lvl

    income = base_income * water_bonus * automation_bonus * event_modifier

    eco_score = (30 + 100 * w_lvl) * eco_modifier

    total_income += income
    total_saving += eco_score
    round_count += 1

    return event, income, eco_score


def play_round(plants, water, automation, gemini_generate_report):
    event, income, eco_score = calc_round(plants, water, automation)

    report = gemini_generate_report(
        plants, water, automation,
        income, eco_score,
        event, bots
    )

    game_over = all(bots[b]["progress"] >= 20 for b in bots)

    return JsonResponse({
        "last_plants": plants,
        "last_water": water,
        "last_automation": automation,
        "event": event,
        "income": round(income),
        "eco_score": round(eco_score),
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
        "plants": {"progress": 0, "max": 20},
        "water": {"progress": 0, "max": 20},
        "automation": {"progress": 0, "max": 20}
    }