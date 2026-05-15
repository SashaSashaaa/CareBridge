import random
from django.http import JsonResponse


tour = {
    "destinations": {"progress": 0, "max": 20},
    "comfort": {"progress": 0, "max": 20},
    "experience": {"progress": 0, "max": 20},
}

total_profit = 0
total_rating = 0
round_count = 0

def calc_round(dest, comfort, exp):
    global total_profit, total_rating, round_count

    tour["destinations"]["progress"] += dest
    tour["comfort"]["progress"] += comfort
    tour["experience"]["progress"] += exp

    for item in tour:
        tour[item]["progress"] = min(tour[item]["progress"], 20)

    dest_lvl = tour["destinations"]["progress"] / 20
    comfort_lvl = tour["comfort"]["progress"] / 20
    exp_lvl = tour["experience"]["progress"] / 20

    place = random.choice(["Europe", "Asia", "Islands"])

    place_data = {
        "Europe": (120, 200),
        "Asia": (80, 300),
        "Islands": (150, 500),
    }

    base, max_profit = place_data[place]

    season = random.choice(["low", "mid", "high"])

    season_mult = {
        "low": 0.7,
        "mid": 1.0,
        "high": 1.5,
    }[season]

    risk = random.random()
    risk_penalty = 1

    if risk < 0.2:
        risk_penalty = 0.6
    elif risk > 0.9:
        risk_penalty = 1.4

    viral = 1 + (0.5 * exp_lvl if exp_lvl > 0.7 else 0)

    profit = (
        (base + (max_profit - base) * dest_lvl)
        * (1 + 0.5 * comfort_lvl)
        * season_mult
        * viral
        * risk_penalty
    )

    rating = (
        3
        + 2 * exp_lvl
        + comfort_lvl
        - (0.5 if risk < 0.2 else 0)
    )

    total_profit += profit
    total_rating += rating
    round_count += 1

    return place, season, profit, rating, risk


def play_round(dest, comfort, exp, gemini_generate_report):
    place, season, profit, rating, risk = calc_round(dest, comfort, exp)

    report = gemini_generate_report(
        dest,
        comfort,
        exp,
        profit,
        rating,
        place,
        season,
        risk,
        tour,
    )

    game_over = all(tour[item]["progress"] >= 20 for item in tour)

    return JsonResponse({
        "last_dest": dest,
        "last_comfort": comfort,
        "last_experience": exp,

        "place": place,
        "season": season,

        "profit": round(profit),
        "rating": round(rating, 2),

        "total_profit": round(total_profit),
        "avg_rating": round(total_rating / round_count, 2),

        "round": round_count,
        "progress": tour,

        "report": report,
        "game_over": game_over,
    })


def reset():
    global total_profit, total_rating, round_count, tour

    total_profit = 0
    total_rating = 0
    round_count = 0

    tour = {
        "destinations": {"progress": 0, "max": 20},
        "comfort": {"progress": 0, "max": 20},
        "experience": {"progress": 0, "max": 20},
    }

    return JsonResponse({
        "message": "Гру скинуто",
        "total_profit": total_profit,
        "avg_rating": 0,
        "round": round_count,
        "progress": tour,
        "game_over": False,
    })