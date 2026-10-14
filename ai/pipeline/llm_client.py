import json
import os
import re
import time
from pathlib import Path
from dotenv import load_dotenv

def load_project_env() -> None:
    candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parents[1] / ".env",
        Path(__file__).resolve().parents[1] / "pipeline" / ".env",
    ]
    for candidate in candidates:
        if candidate.exists():
            load_dotenv(candidate, override=False)

load_project_env()

NVIDIA_BASE_URL = os.environ.get("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1")
DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b"
LAST = {"finish": None, "chars": 0, "repaired": False}

AVAILABLE_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "check_terrain_elevation",
            "description": "Get farm elevation in meters using Mapbox.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number"},
                    "lng": {"type": "number"}
                },
                "required": ["lat", "lng"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_nearby_resources",
            "description": "Find nearby agricultural markets or resources.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number"},
                    "lng": {"type": "number"},
                    "radius_km": {"type": "number"},
                    "resource_type": {"type": "string"}
                },
                "required": ["lat", "lng", "resource_type"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_openmeteo_agronomics",
            "description": "Fetch real-time soil moisture and temperature.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number"},
                    "lng": {"type": "number"}
                },
                "required": ["lat", "lng"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_soil_baseline",
            "description": "Fetch the permanent baseline soil profile (sand, silt, clay ratio, pH, and organic carbon) to understand field drainage and retention.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number"},
                    "lng": {"type": "number"}
                },
                "required": ["lat", "lng"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_historical_climatology",
            "description": "Fetch NASA's 20-year historical climate averages (rainfall, temperature) for a farm coordinate to compare current conditions against historical norms.",
            "parameters": {
                "type": "object",
                "properties": {
                    "lat": {"type": "number", "description": "Latitude"},
                    "lng": {"type": "number", "description": "Longitude"}
                },
                "required": ["lat", "lng"]
            }
        }
    }
]

def _ask(client, model: str, messages: list) -> str:
    retries = int(os.environ.get("NVIDIA_RETRIES", "0"))
    for attempt in range(retries + 1):
        try:
            stream = client.chat.completions.create(
                model=model, messages=messages, temperature=0.2, stream=True,
                max_tokens=int(os.environ.get("NVIDIA_MAX_TOKENS", "8000")),
                extra_body={"chat_template_kwargs": {"enable_thinking": False}})
            break
        except Exception as e:
            busy = any(w in str(e).lower() for w in ("overload", "temporar", "429", "503", "rate limit"))
            if not busy or attempt == retries:
                raise
            time.sleep(10 * 3 ** attempt)
            
    start = time.time()
    limit = float(os.environ.get("NVIDIA_MAX_SECONDS", "50"))
    parts = []
    for chunk in stream:
        if time.time() - start > limit:
            raise TimeoutError("Response timeout exceeded")
        if chunk.choices and chunk.choices[0].delta.content:
            parts.append(chunk.choices[0].delta.content)
            
    return "".join(parts).strip()

def call_nvidia(messages: list) -> str:
    key = os.environ.get("NVIDIA_API_KEY")
    if not key:
        raise RuntimeError("NVIDIA_API_KEY is not set")
        
    from openai import OpenAI
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=key, timeout=60)
    model = os.environ.get("NVIDIA_MODEL", DEFAULT_MODEL)
    
    # Get the latest user message text
    latest_msg = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            latest_msg = m.get("content", "")
            break

    # --- SMART PYTHON-SIDE INTERCEPTOR ---
    lat_lng_match = re.findall(r"(-?\d+\.\d+)", latest_msg)
    tool_injected_context = ""
    
    if len(lat_lng_match) >= 2:
        lat, lng = float(lat_lng_match[0]), float(lat_lng_match[1])
        text_lower = latest_msg.lower()
        print(f"🛠️ [Interceptor Triggered] Detected Coords: Lat {lat}, Lng {lng}", flush=True)
        
        try:
            if "elevation" in text_lower or "slope" in text_lower:
                from tools.terrain import get_elevation
                elev = get_elevation(lat, lng, os.environ.get("MAPBOX_API_KEY"))
                tool_injected_context += f"\n[Tool Data - Elevation]: {elev} meters above sea level."
                print(f"⛰️ Elevation fetched: {elev}", flush=True)
                
            if "soil" in text_lower or "moisture" in text_lower or "temperature" in text_lower:
                from tools.openmeteo_agro import get_agronomic_data
                agro = get_agronomic_data(lat, lng)
                tool_injected_context += f"\n[Tool Data - Open-Meteo Agronomics]: {json.dumps(agro)}"
                print(f"🌱 Agronomics fetched: {agro}", flush=True)
                
            if "market" in text_lower or "hub" in text_lower or "resource" in text_lower:
                from tools.radius_search import search_nearby_resources
                places = search_nearby_resources(lat, lng, 10.0, "market")
                tool_injected_context += f"\n[Tool Data - Nearby Resources]: {json.dumps(places)}"
                print(f"📍 Resources fetched: {places}", flush=True)
            if "soil type" in text_lower or "ph" in text_lower or "baseline" in text_lower:
                from tools.soil_baseline import get_soil_baseline
                soil_base = get_soil_baseline(lat, lng)
                tool_injected_context += f"\n[Tool Data - ISRIC Soil Baseline]: {json.dumps(soil_base)}"
                print(f"🌍 Soil Baseline fetched: {soil_base}", flush=True)
            if "history" in text_lower or "average" in text_lower or "climate" in text_lower or "normal" in text_lower:
                from tools.nasa_power import get_historical_climatology
                climate_base = get_historical_climatology(lat, lng)
                tool_injected_context += f"\n[Tool Data - NASA Climatology]: {json.dumps(climate_base)}"
                print(f"🌦️ NASA Benchmark fetched: {climate_base['average_annual_rainfall_mm']}mm avg rain", flush=True)
            # 5. Visual Check (Copernicus Sentinel-2 NDVI)
            if "satellite" in text_lower or "ndvi" in text_lower or "health" in text_lower or "stress" in text_lower:
                from tools.copernicus_ndvi import get_satellite_ndvi
                ndvi = get_satellite_ndvi(lat, lng)
                tool_injected_context += f"\n[Copernicus Sentinel-2 NDVI]: {json.dumps(ndvi)}"
        except Exception as e:
            tool_injected_context += f"\n[Tool Error]: {str(e)}"
            print(f"❌ Tool Execution Error: {e}", flush=True)

    if tool_injected_context:
        injection = f"\n\n[CRITICAL SENSOR DATA INJECTED BY BACKEND - YOU MUST USE THESE EXACT FIGURES IN YOUR REPORT:\n{tool_injected_context}]"
        
        # Inject the data directly into the user's actual prompt so the AI is forced to read it
        for m in reversed(messages):
            if m.get("role") == "user":
                m["content"] += injection
                break

    # Standard LLM call
    return _ask(client, model, messages)

def parse_json(text: str) -> dict:
    if not isinstance(text, str):
        raise ValueError("reply is not text")
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.I)
        cleaned = re.sub(r"\s*```\s*$", "", cleaned)
    start, end = cleaned.find("{"), cleaned.rfind("}")
    return json.loads(cleaned[start:end + 1])

# Inside your chat/assessment route or interceptor logic:
def get_augmented_context(lat, lng, image_path=None, user_query="Assess my farm"):
    # 1. Existing telemetry tools (SoilGrids, Open-Meteo, Copernicus NDVI)
    telemetry_data = fetch_all_telemetry(lat, lng)
    
    vision_report = None
    if image_path:
        # 2. Run NVIDIA Vision Analysis on the uploaded farm/crop photo
        from tools.vision_analyzer import analyze_crop_image

        vision_report = analyze_crop_image(image_path, prompt=user_query)
        
    # Combine everything into the force-injected prompt context
    combined_context = f"""
    [SENSOR DATA]
    {telemetry_data}
    
    [NVIDIA VISION VLM CROP INSPECTION REPORT]
    {vision_report if vision_report else "No farm photo uploaded for this query."}
    """
    return combined_context

def model_enabled() -> bool:
    return os.environ.get("NVIDIA_ENABLED", "1").lower() not in {"0", "false", "no"}
