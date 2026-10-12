import time

import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

_CACHE = {}
CACHE_TTL = 3600


def get_weather(lat: float = -0.5, lng: float = 37.35) -> dict:
    """Fetch current temperature and precipitation from Open-Meteo."""
    if lat is None or lng is None:
        lat, lng = -0.5, 37.35

    cache_key = f"{round(lat, 2)},{round(lng, 2)}"
    cached = _CACHE.get(cache_key)
    if cached and time.time() - cached["time"] < CACHE_TTL:
        return cached["data"]

    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "temperature_2m,precipitation",
        "timezone": "Africa/Nairobi",
    }

    try:
        response = requests.get(OPEN_METEO_URL, params=params, timeout=5.0)
        response.raise_for_status()
        current = response.json().get("current", {})
        result = {
            "temperature_c": current.get("temperature_2m", 25.0),
            "rainfall_mm": current.get("precipitation", 0.0),
            "source": "open-meteo",
        }
    except requests.RequestException as error:
        print(f"Open-Meteo fetch failed ({error}). Using seasonal defaults.")
        result = {
            "temperature_c": 25.0,
            "rainfall_mm": 0.0,
            "source": "fallback",
        }

    _CACHE[cache_key] = {"time": time.time(), "data": result}
    return result
