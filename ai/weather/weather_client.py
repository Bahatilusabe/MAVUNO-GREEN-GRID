import os
import time
import requests

OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

# Simple cache to prevent spamming the API on every page reload
_CACHE = {}
CACHE_TTL = 3600  # 1 hour

def get_weather(lat: float = -0.5, lng: float = 37.35) -> dict:
    """Fetch current temp and rain from the OpenWeather API."""
    if lat is None or lng is None:
        lat, lng = -0.5, 37.35

    cache_key = f"{round(lat, 2)},{round(lng, 2)}"
    
    if cache_key in _CACHE and time.time() - _CACHE[cache_key]["time"] < CACHE_TTL:
        return _CACHE[cache_key]["data"]

    api_key = os.environ.get("OPENWEATHER_API_KEY")
    
    # Graceful fallback if the API key hasn't been pasted into .env yet
    if not api_key:
        print("OPENWEATHER_API_KEY is not set in .env. Using seasonal defaults.")
        return {"temperature_c": 25.0, "rainfall_mm": 0.0, "source": "fallback"}

    params = {
        "lat": lat,
        "lon": lng,
        "appid": api_key,
        "units": "metric"  # Automatically returns temperature in Celsius
    }

    try:
        # 5-second timeout ensures the AI pipeline never hangs if the network drops
        resp = requests.get(OPENWEATHER_URL, params=params, timeout=5.0)
        resp.raise_for_status()
        data = resp.json()
        
        temp = data.get("main", {}).get("temp", 25.0)
        
        # OpenWeather returns rain as a dictionary (e.g., {"1h": 0.5} or {"3h": 1.2})
        rain_data = data.get("rain", {})
        rainfall = rain_data.get("1h", rain_data.get("3h", 0.0))
        
        result = {
            "temperature_c": temp,
            "rainfall_mm": rainfall,
            "source": "openweather"
        }
    except Exception as e:
        print(f"OpenWeather fetch failed ({e}). Using seasonal defaults.")
        result = {
            "temperature_c": 25.0,
            "rainfall_mm": 0.0,
            "source": "fallback"
        }

    _CACHE[cache_key] = {"time": time.time(), "data": result}
    return result