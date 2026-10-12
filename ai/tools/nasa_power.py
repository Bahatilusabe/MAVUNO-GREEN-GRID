import requests

def get_historical_climatology(lat: float, lng: float) -> dict:
    """
    Fetches 20-year historical climate averages (precipitation, temperature) 
    for a specific coordinate using the NASA POWER Agroclimatology API.
    """
    # The NASA POWER API endpoint for multi-year climatology (averages)
    url = "https://power.larc.nasa.gov/api/temporal/climatology/point"
    
    params = {
        "parameters": "PRECTOTCORR,T2M",  # Corrected precipitation and temperature at 2 meters
        "community": "AG",                # Agroclimatology community
        "longitude": lng,
        "latitude": lat,
        "format": "JSON",
        "start": "2000",                  # Averages starting from year 2000
        "end": "2020"                     # Averages ending year 2020 (a solid 20-year baseline)
    }

    print(f"Querying NASA POWER Climatology for ({lat}, {lng})...")

    response = requests.get(url, params=params, timeout=15)
    
    if response.status_code != 200:
        raise RuntimeError(f"NASA POWER API Error ({response.status_code}): {response.text}")

    data = response.json()
    
    properties = data.get("properties", {}).get("parameter", {})
    
    # Extract the annual averages ("ANN")
    annual_precip_mm_day = properties.get("PRECTOTCORR", {}).get("ANN", 0)
    annual_temp_c = properties.get("T2M", {}).get("ANN", 0)

    # Convert average daily precipitation to average annual total (mm/day * 365.25)
    annual_total_rainfall = round(annual_precip_mm_day * 365.25, 1) if annual_precip_mm_day else "Unknown"

    return {
        "baseline_years": "2000-2020",
        "average_annual_rainfall_mm": annual_total_rainfall,
        "average_annual_temperature_c": round(annual_temp_c, 1) if annual_temp_c else "Unknown",
        "historical_monthly_rainfall_mm": properties.get("PRECTOTCORR", {})  # Includes JAN-DEC daily averages
    }

# Quick terminal test block
if __name__ == "__main__":
    TEST_LAT = -1.2921
    TEST_LNG = 36.8219
    try:
        climate = get_historical_climatology(TEST_LAT, TEST_LNG)
        print("Success! Historical Climate Benchmark:")
        print(f"  - Baseline Period: {climate['baseline_years']}")
        print(f"  - Average Annual Rainfall: {climate['average_annual_rainfall_mm']} mm")
        print(f"  - Average Temperature: {climate['average_annual_temperature_c']} °C")
    except Exception as e:
        print(f"Error: {e}")