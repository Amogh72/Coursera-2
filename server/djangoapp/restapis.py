import os
from pathlib import Path
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

backend_url = os.getenv("backend_url", "http://127.0.0.1:3030").strip().rstrip("/")
sentiment_analyzer_url = os.getenv(
    "sentiment_analyzer_url", "http://127.0.0.1:5050/"
).strip().rstrip("/")


def get_request(endpoint, **kwargs):
    """GET a JSON resource from the Node.js dealership service."""
    url = f"{backend_url}/{endpoint.lstrip('/')}"
    response = requests.get(url, timeout=8, **kwargs)
    response.raise_for_status()
    return response.json()


def post_request(endpoint, data_dict):
    """POST JSON to the Node.js dealership service."""
    url = f"{backend_url}/{endpoint.lstrip('/')}"
    response = requests.post(url, json=data_dict, timeout=8)
    response.raise_for_status()
    return response.json()


def analyze_review_sentiments(text):
    """Call the sentiment microservice; use a small fallback if it is unavailable."""
    try:
        url = f"{sentiment_analyzer_url}/analyze/{quote(str(text), safe='')}"
        response = requests.get(url, timeout=4)
        response.raise_for_status()
        result = response.json()
        return result.get("sentiment", "neutral")
    except (requests.RequestException, ValueError):
        lowered = str(text).lower()
        positive = ("fantastic", "great", "excellent", "good", "amazing", "wonderful", "helpful", "love", "best", "friendly", "perfect")
        negative = ("terrible", "awful", "bad", "poor", "worst", "hate", "rude", "disappointing", "horrible", "slow")
        pos = sum(word in lowered for word in positive)
        neg = sum(word in lowered for word in negative)
        return "positive" if pos > neg else "negative" if neg > pos else "neutral"


def post_review(data_dict):
    return post_request("insert_review", data_dict)
