import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_elevation(lat: float, lng: float, mapbox_token: str = None) -> float:
    """
    Takes GPS coordinates and returns elevation in meters using the Mapbox 
    Terrain vector contour tileset via the Tilequery API.
    """
    token = mapbox_token or os.environ.get("MAPBOX_API_KEY")
    if not token:
        raise RuntimeError("MAPBOX_API_KEY is not set in environment variables.")

    # Query the Mapbox Terrain vector contours (mapbox-terrain-v2)
    url = f"https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/{lng},{lat}.json?access_token={token}"

    response = requests.get(url, timeout=15)
    if response.status_code != 200:
        raise RuntimeError(f"Mapbox API Error ({response.status_code}): {response.text}")

    data = response.json()
    features = data.get("features", [])
    
    if not features:
        return None

    # Extract the elevation ('ele') property from the closest contour feature
    for feature in features:
        props = feature.get("properties", {})
        if "ele" in props:
            return float(props["ele"])

    raise ValueError("Elevation attribute ('ele') not found in tilequery feature properties.")

if __name__ == "__main__":
    TEST_LAT = -1.2921  # Nairobi region
    TEST_LNG = 36.8219
    
    try:
        elev = get_elevation(TEST_LAT, TEST_LNG)
        print(f"Success! Elevation at ({TEST_LAT}, {TEST_LNG}) is {elev} meters above sea level.")
    except Exception as e:
        print(f"Error: {e}")
