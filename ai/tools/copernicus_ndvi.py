import os
import requests
import json
from datetime import datetime, timedelta

def get_satellite_ndvi(lat: float, lng: float) -> dict:
    """
    Fetches raw Sentinel-2 reflectance data via the Copernicus Data Space Ecosystem (CDSE)
    and calculates the NDVI (Normalized Difference Vegetation Index) for the farm.
    """
    client_id = os.getenv("CDSE_CLIENT_ID")
    client_secret = os.getenv("CDSE_CLIENT_SECRET")
    
    # Graceful fallback if keys are missing
    if not client_id or not client_secret:
        return {
            "ndvi_score": None,
            "formula_used": "(Band 8 - Band 4) / (Band 8 + Band 4)",
            "index_interpretation": "Unavailable",
            "assessment_date": datetime.now().strftime("%Y-%m-%d"),
            "note": "CDSE keys are missing; no satellite measurement was available."
        }

    # 1. Authenticate with Copernicus CDSE Keycloak
    auth_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    auth_data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    auth_res = requests.post(auth_url, data=auth_data, timeout=15)
    if auth_res.status_code != 200:
        raise RuntimeError(f"CDSE Auth Failed: {auth_res.text}")
    
    token = auth_res.json().get("access_token")

    # 2. Build a tiny bounding box polygon for the farm coordinate (~1 acre)
    offset = 0.0005
    polygon = {
        "type": "Polygon",
        "coordinates": [[[lng - offset, lat - offset], [lng + offset, lat - offset], 
                         [lng + offset, lat + offset], [lng - offset, lat + offset], 
                         [lng - offset, lat - offset]]]
    }

    # 3. Evalscript running directly on Copernicus servers
    # 3. Evalscript running directly on Copernicus servers
    evalscript = """
    //VERSION=3
    function setup() {
        return {
            input: [{ bands: ["B04", "B08", "dataMask"] }],
            output: [
                { id: "default", bands: 1, sampleType: "FLOAT32" },
                { id: "dataMask", bands: 1, sampleType: "UINT8" }
            ]
        };
    }
    function evaluatePixel(samples) {
        let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
        return {
            default: [ndvi],
            dataMask: [samples.dataMask]
        };
    }
    """

    stats_url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)

    payload = {
        "input": {
            "bounds": {"geometry": polygon},
            "data": [{"type": "sentinel-2-l2a", "dataFilter": {"mosaickingOrder": "leastCC"}}]
        },
        "aggregation": {
            "timeRange": {
                "from": start_date.strftime("%Y-%m-%dT00:00:00Z"),
                "to": end_date.strftime("%Y-%m-%dT23:59:59Z")
            },
            "aggregationInterval": {"of": "P1D"},
            "evalscript": evalscript
        }
    }

    print(f"Querying Copernicus Sentinel-2 for ({lat}, {lng})...")
    stats_res = requests.post(stats_url, headers=headers, json=payload, timeout=20)
    
    if stats_res.status_code != 200:
        raise RuntimeError(f"CDSE API Error: {stats_res.text}")

    data = stats_res.json()
    
    # 4. Extract the latest valid NDVI value
    latest_ndvi = None
    latest_date = None
    
    for item in reversed(data.get("data", [])):
        outputs = item.get("outputs", {}).get("default", {}).get("bands", {}).get("B0", {}).get("stats", {})
        mean_ndvi = outputs.get("mean")
        if mean_ndvi is not None:
            latest_ndvi = round(mean_ndvi, 2)
            latest_date = item.get("interval", {}).get("from", "")[:10]
            break

    status = "Unavailable"
    if latest_ndvi is not None:
        if latest_ndvi > 0.6: status = "High vegetation index; not a crop-specific health diagnosis"
        elif latest_ndvi > 0.4: status = "Moderate vegetation index; not a crop-specific health diagnosis"
        elif latest_ndvi > 0.2: status = "Low vegetation index; interpretation depends on land cover and image quality"
        else: status = "Very low or negative vegetation index; bare soil, water, mixed cover, or quality effects are possible"

    return {
        "ndvi_score": latest_ndvi,
        "index_interpretation": status,
        "assessment_date": latest_date,
        "period_start": start_date.strftime("%Y-%m-%d"),
        "period_end": end_date.strftime("%Y-%m-%d"),
        "spatial_scope": "area average over an approximately 100 m by 100 m footprint centered on the farm point",
        "satellite": "Sentinel-2 L2A (Copernicus)",
        "formula_used": "(Band 8 - Band 4) / (Band 8 + Band 4)"
    }

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(dotenv_path="../.env")
    
    TEST_LAT = -1.7
    TEST_LNG = 36.8
    try:
        ndvi = get_satellite_ndvi(TEST_LAT, TEST_LNG)
        print("Success! Copernicus Visual Check:")
        for k, v in ndvi.items():
            print(f"  - {k}: {v}")
    except Exception as e:
        print(f"Error: {e}")
