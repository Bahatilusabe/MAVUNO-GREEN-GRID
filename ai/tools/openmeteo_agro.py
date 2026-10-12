import os
import requests

def get_agronomic_data(lat: float, lng: float) -> dict:
    """
    Fetches real-time soil moisture, soil temperature, and weather metrics 
    from Open-Meteo's free Weather and Agricultural API endpoints.
    """
    # Open-Meteo Forecast API with agronomic / soil variables
    url = "https://api.open-meteo.com/v1/forecast"
    
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation"],
        "hourly": ["soil_temperature_0cm", "soil_moisture_0_to_1cm", "evapotranspiration"]
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise RuntimeError(f"Open-Meteo API Error ({response.status_code}): {response.text}")

    data = response.json()
    
    current = data.get("current", {})
    hourly = data.get("hourly", {})
    
    # Extract latest hourly readings for soil data
    soil_temp = hourly.get("soil_temperature_0cm", [0])[0] if hourly.get("soil_temperature_0cm") else "N/A"
    soil_moisture = hourly.get("soil_moisture_0_to_1cm", [0])[0] if hourly.get("soil_moisture_0_to_1cm") else "N/A"
    
    return {
        "temperature_c": current.get("temperature_2m"),
        "humidity_pct": current.get("relative_humidity_2m"),
        "precipitation_mm": current.get("precipitation"),
        "soil_temperature_c": soil_temp,
        "soil_moisture_m3_m3": soil_moisture
    }

# Quick terminal test block
if __name__ == "__main__":
    TEST_LAT = -1.2921
    TEST_LNG = 36.8219
    try:
        agro = get_agronomic_data(TEST_LAT, TEST_LNG)
        print(f"Success! Open-Meteo Agronomic Data for ({TEST_LAT}, {TEST_LNG}):")
        for k, v in agro.items():
            print(f"  - {k}: {v}")
    except Exception as e:
        print(f"Error: {e}")