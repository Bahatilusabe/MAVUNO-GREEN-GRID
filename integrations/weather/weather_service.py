import requests


class WeatherService:
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"

    def get_current_weather(self, latitude, longitude):
        """Get current weather for coordinates from Open-Meteo."""
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,precipitation",
            "timezone": "Africa/Nairobi",
        }
        response = requests.get(self.base_url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()

    def get_forecast(self, latitude, longitude, days=7):
        """Get a daily weather forecast from Open-Meteo."""
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": "temperature_2m_max,precipitation_probability_max,weather_code",
            "timezone": "Africa/Nairobi",
            "forecast_days": days,
        }
        response = requests.get(self.base_url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()

    def get_historical_weather(self, latitude, longitude, start_date, end_date):
        """Historical weather is not provided by this integration yet."""
        raise NotImplementedError("Historical weather is not implemented")
