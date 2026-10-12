import requests

def get_soil_baseline(lat: float, lng: float) -> dict:
    """
    Retrieves baseline soil characteristics (sand, silt, clay, pH, organic carbon)
    from ISRIC SoilGrids via their v2.0 REST API.
    """
    url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    
    # Requesting all our baseline properties at the 0-5cm depth layer
    params = {
        "lon": lng,
        "lat": lat,
        "property": ["sand", "silt", "clay", "phh2o", "soc"],
        "depth": "0-5cm",
        "value": "mean"
    }

    print(f"Querying ISRIC SoilGrids REST API for ({lat}, {lng})...")
    
    try:
        response = requests.get(url, params=params, timeout=15)
        if response.status_code != 200:
            raise RuntimeError(f"ISRIC API Error ({response.status_code}): {response.text}")
            
        data = response.json()
        layers = data.get("properties", {}).get("layers", [])
        
        # Extract the mean values from the JSON structure
        results = {}
        for layer in layers:
            name = layer.get("name")
            # Dig into the depths array to get the mean value
            depths = layer.get("depths", [])
            if depths and "values" in depths[0]:
                results[name] = depths[0]["values"].get("mean")
            else:
                results[name] = None
                
    except Exception as e:
        print(f"Failed to fetch from ISRIC: {e}")
        results = {}

    # Decode the raw ISRIC mapped values into standard conventional units
    # Sand/Silt/Clay are returned as g/kg (divide by 10 for percentage)
    # pH is returned as pH * 10 (divide by 10)
    # SOC is returned in dg/kg
    processed = {
        "soil_type_estimate": "Unknown",
        "sand_pct": round(results["sand"] / 10, 1) if results.get("sand") else None,
        "silt_pct": round(results["silt"] / 10, 1) if results.get("silt") else None,
        "clay_pct": round(results["clay"] / 10, 1) if results.get("clay") else None,
        "ph_level": round(results["phh2o"] / 10, 1) if results.get("phh2o") else None,
        "organic_carbon_dg_kg": results.get("soc")
    }
    
    # Calculate dominant soil texture based on sand/silt/clay ratios
    if processed["sand_pct"] and processed["sand_pct"] > 50:
        processed["soil_type_estimate"] = "Sandy (High drainage, low retention)"
    elif processed["clay_pct"] and processed["clay_pct"] > 40:
        processed["soil_type_estimate"] = "Clay (High retention, poor drainage)"
    elif processed["silt_pct"] and processed["silt_pct"] > 50:
        processed["soil_type_estimate"] = "Silty (Moderate drainage)"
    elif processed["sand_pct"] and processed["clay_pct"]:
        processed["soil_type_estimate"] = "Loam (Ideal drainage/retention)"

    return processed

if __name__ == "__main__":
    TEST_LAT = -1.7  # Moved south to Isinya / rural Kajiado
    TEST_LNG = 36.8
    try:
        soil = get_soil_baseline(TEST_LAT, TEST_LNG)
        print("Success! Baseline Soil Profile:")
        for k, v in soil.items():
            print(f"  - {k}: {v}")
    except Exception as e:
        print(f"Error: {e}")