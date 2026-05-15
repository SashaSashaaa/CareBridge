import os
import requests
from dotenv import load_dotenv
load_dotenv()

PIXABAY_KEY = os.getenv("PIXABAY_KEY")


def get_image(query):
    url = "https://pixabay.com/api/"
    params = {
        "key": PIXABAY_KEY,
        "q": query,
        "image_type": "photo",
        "per_page": 3
    }

    
    response = requests.get(url, params=params)
    res = response.json()
    if res["hits"]:
        return res["hits"][0]["webformatURL"]

    return None