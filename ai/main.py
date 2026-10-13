"""
MAVUNO-X FastAPI Backend
Run this server with: python main.py
"""
import os
import json
import shutil
import tempfile
import uuid
from pathlib import Path
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, ValidationError
import uvicorn


def load_project_env() -> None:
    """Load the repo's .env files from all valid project locations."""
    candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parent / "pipeline" / ".env",
        Path(__file__).resolve().parent.parent / ".env",
    ]
    for candidate in candidates:
        if candidate.exists():
            load_dotenv(candidate, override=False)


# 1. Load NVIDIA_API_KEY etc. from the project .env (real env vars win)
load_project_env()

# 2. Import the actual AI Brain
from pipeline.brain import call_nvidia, think
from pipeline.brain_schema import build_situation
from explanations.explainer import build_facts, template_text
from matching.matcher import OPTIONS
from pipeline.run_pipeline import CAPACITY_T
from weather.weather_client import get_weather

app = FastAPI(title="MAVUNO-X AI API")

_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]
_extra_origins = [
    o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_default_origins + _extra_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Liveness probe for Render / Docker."""
    return {"ok": True}


def detect_farmer_language(message: str) -> str:
    """Return the likely language style of the farmer's question."""
    lowered = message.lower()
    swahili_markers = [
        "habari", "hujambo", "sasa", "vipi", "mkulima", "kilimo", "shamba",
        "mbegu", "bei", "ngapi", "nina", "nafasi", "kiasi", "mchana",
        "tafadhali", "asante", "unaweza", "nime", "njia", "soko", "mifugo",
        "mnunuzi", "zaidi", "kitu", "lipa", "tumia", "karibu", "mazao",
        "bidhaa", "kuuza", "nunua", "kuweka", "msee", "mkemia", "kibanda",
        "muhogo", "ndizi", "tembea", "kuhusu", "mchanganyiko", "sina",
        "yupi", "yoyote", "kwanini", "naweza", "niko", "kuna", "nimechoka",
        "naomba", "sijui", "tunateka", "wapi", "ninaomba", "mchuu", "mchango",
        "mbolea", "mavuno", "misitu", "ufugaji", "mahindi", "mpunga", "nyanya",
        "kale", "kuku", "ng'ombe", "ngombe", "mbuzi", "ngano", "chumvi",
        "kiwanja", "kilimo cha", "mauzo", "hio", "hizo", "hizi", "hilo",
        "hiyo", "mauzo", "sijapata", "nimekosa", "kituo", "mashambani"
    ]
    english_slang_markers = [
        "bro", "guys", "hey", "help me", "i need", "can you", "what's up",
        "pls", "please", "thanks", "urgent", "need help", "how do i",
        "any idea", "what should i do", "this is rough", "low price",
        "too much", "super", "bad weather", "im stuck", "i'm stuck",
        "price is dropping", "prices are low", "my crop is dying",
        "my tomatoes", "my maize", "my produce", "price is falling",
        "how can i", "what now", "this is bad", "not good", "really bad"
    ]

    if any(marker in lowered for marker in swahili_markers):
        return "Kiswahili / Sheng"
    if any(marker in lowered for marker in english_slang_markers):
        return "English slang"
    return "English"


class NearbyPlace(BaseModel):
    name: str
    kind: str = "public map site"
    distance_km: float
    buyer_type: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    map_url: Optional[str] = None
    price_kes_per_kg: Optional[float] = None


class ChatQuery(BaseModel):
    message: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    farm_name: Optional[str] = None
    crop: Optional[str] = None
    size_acres: Optional[float] = None
    # Filled in by the backend from its cached map data. The AI never searches maps itself.
    nearby_type: Optional[str] = None
    nearby: Optional[list[NearbyPlace]] = None
    nearby_status: Optional[str] = None


def describe_nearby(query: ChatQuery) -> str:
    """Describe the backend nearby-place results and their lookup status for the model."""
    if query.nearby_status == "missing_location":
        return (
            "The farmer asked about nearby places, but this farm has no saved coordinates. "
            "Say the nearby map search needs a saved farm location. Ask them to add the farm pin or share their nearest town/county. "
            "Do not imply that no buyers exist or ask for details already present in the message. "
        )
    if query.nearby_status == "unavailable":
        return (
            "The nearby map lookup could not complete for this request. Be transparent that the lookup is temporarily unavailable; "
            "do not imply that no buyers exist or that you searched successfully. Suggest retrying the Nearby Opportunities page. "
        )
    if query.nearby is None:
        return ""

    label = {
        "market": "markets and buyers",
        "cold_store": "cold storage sites",
        "water": "water sources",
    }.get(query.nearby_type or "", "places")

    if not query.nearby:
        return (
            f"No verified {label} were found within 25 kilometres of the farm on the map. "
            "If the farmer asks about nearby places, say so plainly and suggest asking local "
            "farmers or the county office. Never invent places. "
        )

    lines = []
    for place in query.nearby[:5]:
        line = f"{place.name} ({place.buyer_type or place.kind}, about {place.distance_km} km away"
        if place.address:
            line += f", address {place.address}"
        elif place.lat is not None and place.lng is not None:
            line += f", coordinates {place.lat}, {place.lng}"
        if place.phone:
            line += f", phone {place.phone}"
        if place.website:
            line += f", website {place.website}"
        if place.map_url:
            line += f", Google Maps {place.map_url}"
        if place.price_kes_per_kg is not None:
            line += f", pays about {place.price_kes_per_kg} Kenya shillings per kilogram"
        lines.append(line + ")")

    return (
        f"Mapped {label} leads near the farm (public map records, not confirmed buyers; distances are straight-line): "
        + "; ".join(lines)
        + ". When asked about nearby places, recommend only from this list. "
        "These public map sites are leads, not confirmed produce buyers; tell the farmer to call first and ask whether they buy the crop, quantity, grade, delivery terms, and current price. "
        "Give any listed phone number, address or coordinates, and Google Maps link. If no phone is listed, say it is not available in the map data. Never invent a number, contact, buyer agreement, price or opening hours. "
    )


@app.post("/api/v1/chat")
async def chat_endpoint(request: Request):
    """Answer a farmer question with live date, weather, and farm context included."""
    content_type = request.headers.get("content-type", "")
    media = None
    if "application/json" in content_type:
        try:
            payload = await request.json()
        except Exception as error:
            raise HTTPException(status_code=400, detail="Invalid JSON request") from error
    elif "multipart/form-data" in content_type:
        form = await request.form()
        payload = {
            key: form.get(key)
            for key in (
                "message", "lat", "lng", "farm_name", "crop", "size_acres",
                "nearby_type", "nearby", "nearby_status",
            )
            if form.get(key) is not None
        }
        if isinstance(payload.get("nearby"), str):
            try:
                payload["nearby"] = json.loads(payload["nearby"])
            except json.JSONDecodeError as error:
                raise HTTPException(status_code=400, detail="Invalid nearby places data") from error
        media = form.get("media")
    else:
        raise HTTPException(status_code=415, detail="Use JSON or multipart form data")

    try:
        query = ChatQuery.model_validate(payload)
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors()) from error

    visual_assessment = None
    if media is not None:
        if not hasattr(media, "filename") or not hasattr(media, "file"):
            raise HTTPException(status_code=400, detail="media must be an uploaded file")
        media_type = media.content_type or ""
        if not (media_type.startswith("image/") or media_type.startswith("video/")):
            await media.close()
            raise HTTPException(status_code=400, detail="media must be an image or video")

        extension = Path(media.filename or "").suffix.lower()
        video_extensions = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
        image_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
        is_video = media_type.startswith("video/") or extension in video_extensions
        safe_extensions = video_extensions if is_video else image_extensions
        suffix = extension if extension in safe_extensions else (".mp4" if is_video else ".jpg")

        temp_path = None
        vision_prompt = (
            "Describe only what is visibly supported by this farm media. Separate observations from guesses. "
            "Do not identify a crop from grass-like appearance alone, and do not say it is ready to harvest "
            "unless clear crop-specific maturity signs are visible. Do not infer soil fertility, soil moisture, "
            "or field-wide conditions from appearance alone. State uncertainty when the crop or symptoms "
            "cannot be identified confidently. Do not name tree species or claim they are healthy from distant "
            "background trees. Do not recommend specific crop species unless the farmer's location, season, "
            "water access, and planting goal support that recommendation. "
            "Assess the media in light of the farmer's question. "
            f"Farmer's question: {query.message}"
        )
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_path = temp_file.name
                shutil.copyfileobj(media.file, temp_file)

            if is_video:
                from tools.video_vision_analyzer import analyze_crop_video, extract_representative_frame

                vision_result = analyze_crop_video(temp_path, prompt=vision_prompt)
                visual_assessment = vision_result.get("video_visual_assessment")
                if not visual_assessment:
                    vision_error = vision_result.get("message") or vision_result.get("error")
                diagnosis_path = None
                if os.getenv("KINDWISE_API_KEY"):
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as diagnosis_file:
                        diagnosis_path = diagnosis_file.name
                    if not extract_representative_frame(temp_path, diagnosis_path):
                        os.remove(diagnosis_path)
                        diagnosis_path = None
            else:
                from tools.vision_analyzer import analyze_crop_image

                vision_result = analyze_crop_image(temp_path, prompt=vision_prompt)
                visual_assessment = vision_result.get("visual_assessment")
                vision_error = vision_result.get("message") or vision_result.get("error")
                diagnosis_path = temp_path

            assessments = []
            if visual_assessment:
                assessments.append(f"Visual inspection: {visual_assessment}")

            if os.getenv("KINDWISE_API_KEY") and diagnosis_path:
                try:
                    from tools.plant_health import diagnose_crop

                    diagnosis = diagnose_crop(diagnosis_path)
                    assessments.append(
                        "Crop-health service result (treat as a candidate diagnosis and check it against visible evidence): "
                        + json.dumps(diagnosis, ensure_ascii=False)
                    )
                except Exception as error:
                    print(f"Crop-health tool unavailable for this upload: {error}", flush=True)
                finally:
                    if is_video and diagnosis_path and os.path.exists(diagnosis_path):
                        os.remove(diagnosis_path)

            if not assessments:
                detail = vision_error or "Media analysis failed"
                raise HTTPException(status_code=502, detail=detail)
            visual_assessment = "\n\n".join(assessments)
        except HTTPException:
            raise
        except Exception as error:
            raise HTTPException(status_code=502, detail=f"Media analysis failed: {error}") from error
        finally:
            await media.close()
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    from tools.farm_context import collect_farm_context

    farm_tool_context = collect_farm_context(query.lat, query.lng, query.message)

    has_farm_coordinates = query.lat is not None and query.lng is not None
    weather = get_weather(query.lat, query.lng) if has_farm_coordinates else None
    if not has_farm_coordinates:
        weather_context = "Farm coordinates are unavailable; do not claim that weather data is local to this farm."
    elif weather.get("source") == "fallback":
        weather_context = "The current weather provider was unavailable; do not present fallback values as live readings."
    else:
        weather_context = (
            f"Current weather at the supplied farm coordinates ({weather.get('source', 'weather service')}): "
            f"{weather['temperature_c']}°C with {weather['rainfall_mm']}mm of precipitation."
        )

    farm_profile = []
    if query.farm_name:
        farm_profile.append(f"registered farm name: {query.farm_name}")
    if query.size_acres is not None:
        farm_profile.append(f"registered area: {query.size_acres} acres")
    if query.crop:
        farm_profile.append(f"crops currently planned or growing: {query.crop}")
    farm_profile_context = (
        "Available farm profile: " + "; ".join(farm_profile) + ". "
        if farm_profile
        else "No verified farm profile was supplied. Do not invent a farm name, size, or crop history. "
    )
    today_str = datetime.now().strftime("%A, %B %d, %Y")
    farmer_language = detect_farmer_language(query.message)
    nearby_text = describe_nearby(query)

    messages = [
        {
            "role": "system",
            "content": (
                "You are MAVUNO AI, an expert agricultural and logistics assistant "
                "for MAVUNO Green Grid in Kenya. "
                + (
                    "A farm image or video was uploaded and successfully analyzed by the visual assessment service. "
                    "Use the attached visual assessment as evidence when answering the farmer. "
                    "When a crop-health service result is included, compare it with visible evidence and avoid presenting an uncertain result as confirmed. "
                    "Do not say that you cannot read, see, or analyze images, and do not ask the farmer to describe the uploaded media. "
                    "If the assessment is uncertain, explain what is uncertain and ask a focused follow-up question. "
                    if visual_assessment
                    else ""
                )
                + f"Today's date is {today_str}. "
                + (
                    "Use relevant farm tool readings included with the farmer's message. State when readings are regional estimates or unavailable. "
                    if farm_tool_context
                    else ""
                )
                + farm_profile_context
                + weather_context
                + f"{nearby_text}"
                "Language rule: if the farmer's question is in Kiswahili or Sheng, answer in Kiswahili or a natural Kiswahili-Sheng mix. "
                "If the farmer writes in English, answer in clear English. If the farmer uses English slang or casual wording, keep it natural and conversational, not robotic. "
                "Do not force English when the user asks in Swahili or Sheng. "
                "Response style rule: "
                "- Kiswahili / Sheng: use short, natural, spoken language like a Kenyan farmer would say it. Keep sentences simple and practical. Use a few local phrases like 'sasa', 'msee', 'hii inatokea', 'niko na shida', 'tutafanya hivi', 'kwa haraka', 'kama ni lazima', but never overdo slang. "
                "- English slang: keep it casual, practical, and friendly, like a helpful farm advisor speaking to a farmer over the phone. "
                "- English formal: stay clear and professional but still concise. "
                "Voice guidance for spoken replies: speak slowly, one sentence at a time, with a natural pause between thoughts. Keep the answer short enough to listen to comfortably. Do not use markdown, bullets, symbols, emojis, or long dense paragraphs. Use words instead of shorthand, such as 'tonnes' instead of 't', and 'Kenya shillings' instead of 'KES'. "
                "If the answer is read aloud, make it easy to listen to: short sentences, plain language, no jargon, no forced formality, and no long lists. Use everyday farmer-friendly wording. "
                "Use the current date and only the farm profile, weather, and tool readings actually supplied. "
                "Crops in the registered profile are planned or active crops, not crop history. "
                "Open-Meteo soil moisture is a modeled estimate for the top 0–1 cm, not a direct root-zone measurement; "
                "a zero reading alone does not prove the whole field is dry. Recommend checking moisture at root depth before irrigation or planting decisions. "
                "Soil map data is regional baseline information, not a field soil test. "
                "Satellite NDVI is an area-level average near the farm point over a recent time window, not a crop identification or leaf-level diagnosis. "
                "A low or negative NDVI can reflect bare soil, water, non-crop cover, clouds, or mixed land in the satellite footprint; never call it proof of dead crops. "
                "If NDVI conflicts with the uploaded image, state that the signals disagree, explain that they cover different areas or times, and do not let NDVI overrule clear close-up evidence. "
                "Do not identify trees, fruit species, or plant health from indistinct background shapes. "
                "For planting advice, do not give a firm planting schedule from one image or a single weather reading; "
                "do not suggest named crops or make claims about fruit trees already present unless supported by clear evidence and the farm's goals. "
                "Account for local season, water access, crop identity, and uncertainty, asking a focused question when a key fact is missing. "
                "Never present an estimate or visual guess as a confirmed observation. Be clear when information is unavailable. "
                "Keep answers concise, practical, card-style, and tailored to smallholder farmers. "
                f"Detected user language style: {farmer_language}."
            ),
        },
        {
            "role": "user",
            "content": (
                query.message
                + (f"\n\n[Attached media assessment]: {visual_assessment}" if visual_assessment else "")
                + (f"\n\n[{farm_tool_context}]" if farm_tool_context else "")
            ),
        },
    ]
    try:
        response = call_nvidia(messages)
        return {"status": "success", "reply": response}
    except Exception as error:
        return {"status": "error", "message": str(error)}


@app.get("/api/v1/opportunities")
def get_opportunities():
    """Return active routes with their current capacities and matching data."""
    opportunities = []
    for _, row in OPTIONS.iterrows():
        name = row["name"]
        opportunities.append({
            "name": name,
            "type": row["type"],
            "price_kes_kg": float(row["price_kes_kg"]),
            "distance_km": float(row["distance_km"]),
            "lead_days": int(row["lead_days"]),
            "capacity_t": CAPACITY_T.get(name, 50),
            "co2e_per_t": float(row["co2e_per_t"]),
        })
    return {"status": "success", "data": opportunities}


@app.get("/api/v1/surplus-alerts")
def get_alerts(lat: Optional[float] = None, lng: Optional[float] = None):
    """
    Builds the situation for the selected map coordinates, asks the NVIDIA model
    to plan storage, and generates natural language explanations.
    """
    situation = build_situation(lat, lng)

    # 2. Ask the NVIDIA model to generate the multi-week plan
    result = think(situation, max_tries=1)
    decision = result["decision"]

    price = {o["name"]: o["price_kes_kg"] for o in situation["options"]}
    co2e = {o["name"]: o["co2e_per_t"] for o in situation["options"]}

    alerts = []

    for w in decision["weeks"]:
        if w["alert"]:
            saved = sum(a["tonnes"] for a in w.get("allocations", []))
            revenue = sum(a["tonnes"] * 1000 * price[a["option"]] for a in w.get("allocations", []))
            co2e_kg = sum(a["tonnes"] * co2e[a["option"]] for a in w.get("allocations", []))

            row_dict = {
                "week": w["week"],
                "surplus_ratio": w["surplus_t"] / w["supply_t"] if w["supply_t"] > 0 else 0,
                "surplus_t": w["surplus_t"],
                "risk": w["risk"],
                "tonnes_saved": saved,
                "tonnes_wasted": w["unallocated_t"],
                "revenue_kes": revenue,
                "co2e_avoided_t": co2e_kg / 1000
            }

            # Get the AI natural language explanation
            explanation = {
                "text": template_text(build_facts(row_dict)),
                "source": "template",
            }
            alerts.append({
                "week": w["week"],
                "surplus_t": w["surplus_t"],
                "risk": w["risk"],
                "tonnes_saved": saved,
                "tonnes_wasted": w["unallocated_t"],
                "store_t": w.get("store_t", 0.0),
                "release_t": w.get("release_t", 0.0),
                "revenue_kes": revenue,
                "co2e_avoided_t": co2e_kg / 1000,
                "ai_reasoning": w.get("reasoning", ""),
                "ai_explanation": explanation["text"],
                "explanation_source": explanation["source"]
            })

    return {
        "status": "success",
        "ai_engine_used": result["source"],
        "global_impact": decision["summary"],
        "data": alerts
    }


@app.get("/api/v1/tts")
async def text_to_speech(text: str = "", lang: str = "sw-KE"):
    """Generate speech audio from text using a natural female Swahili voice via Edge TTS."""
    clean_text = (text or "").strip()
    if not clean_text:
        return {"status": "error", "message": "No text supplied."}

    try:
        import edge_tts
    except ImportError:
        return {"status": "error", "message": "edge-tts is not installed."}

    voice = "sw-KE-ZuriNeural" if lang == "sw-KE" else "en-US-JennyNeural"
    audio_dir = Path(__file__).resolve().parent / "audio_cache"
    audio_dir.mkdir(exist_ok=True)
    token = uuid.uuid4().hex
    out_path = audio_dir / f"{token}.mp3"

    communicate = edge_tts.Communicate(clean_text, voice)
    await communicate.save(str(out_path))
    return FileResponse(out_path, media_type="audio/mpeg", filename=f"mavuno-{token}.mp3")

@app.post("/api/v1/analyze-crop")
async def analyze_crop_media(
    file: UploadFile = File(...),
    lat: float = Form(None),
    lng: float = Form(None)
):
    """
    Receives an uploaded image or video frame of a crop, saves it temporarily,
    and runs diagnostic analysis.
    """
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Import your diagnostic tool
        from tools.plant_health import diagnose_crop
        diagnosis = diagnose_crop(file_path)
        
        return {
            "status": "success",
            "filename": file.filename,
            "coordinates": {"lat": lat, "lng": lng},
            "diagnosis": diagnosis
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

if __name__ == "__main__":
    # Render/Docker inject PORT; locally it falls back to 8010
    port = int(os.getenv("PORT", "8010"))
    print(f"Starting MAVUNO-X AI API Server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
