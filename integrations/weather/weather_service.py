# Weather Integration Service

import requests

class WeatherService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.openweathermap.org/data/2.5'
    
    def get_current_weather(self, latitude, longitude):
        """Get current weather for coordinates"""
        endpoint = f"{self.base_url}/weather"
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': self.api_key,
            'units': 'metric'
        }
        response = requests.get(endpoint, params=params)
        return response.json()
    
    def get_forecast(self, latitude, longitude, days=7):
        """Get weather forecast"""
        # Implementation here
        pass
    
    def get_historical_weather(self, latitude, longitude, start_date, end_date):
        """Get historical weather data"""
        # Implementation here
        pass
