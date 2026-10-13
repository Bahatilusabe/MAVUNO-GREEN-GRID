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
    price_kes_per_kg: Optional[float] = None


class ChatQuery(BaseModel):
    message: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    farm_name: Optional[str] = "Oloitiptip Family Farm"
    crop: Optional[str] = "tomatoes and kale"
    size_acres: Optional[float] = 2.5
    # Filled in by the backend from its cached map data. The AI never searches maps itself.
    nearby_type: Optional[str] = None
    nearby: Optional[list[NearbyPlace]] = None


def describe_nearby(query: ChatQuery) -> str:
    """Turn the backend's verified nearby-places list into a prompt sentence."""
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
        line = f"{place.name} ({place.kind}, about {place.distance_km} km away"
        if place.price_kes_per_kg is not None:
            line += f", pays about {place.price_kes_per_kg} Kenya shillings per kilogram"
        lines.append(line + ")")

    return (
        f"Verified {label} near the farm from map data (distances are straight-line): "
        + "; ".join(lines)
        + ". When asked about nearby places, recommend only from this list. "
        "Do not invent places, prices or opening hours that are not listed. "
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
                "nearby_type", "nearby",
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
            "Assess this farm media and answer the farmer's question. "
            f"Farmer's question: {query.message}"
        )
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_path = temp_file.name
                shutil.copyfileobj(media.file, temp_file)

            if is_video:
                from tools.video_vision_analyzer import analyze_crop_video

                vision_result = analyze_crop_video(temp_path, prompt=vision_prompt)
                visual_assessment = vision_result.get("video_visual_assessment")
            else:
                from tools.vision_analyzer import analyze_crop_image

                vision_result = analyze_crop_image(temp_path, prompt=vision_prompt)
                visual_assessment = vision_result.get("visual_assessment")

            if not visual_assessment:
                detail = vision_result.get("message") or vision_result.get("error") or "Media analysis failed"
                raise HTTPException(status_code=502, detail=detail)
        except HTTPException:
            raise
        except Exception as error:
            raise HTTPException(status_code=502, detail=f"Media analysis failed: {error}") from error
        finally:
            await media.close()
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)

    weather = get_weather(query.lat, query.lng)
    location_label = "at the selected farm location" if query.lat else "in your region"
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
                    "Do not say that you cannot read, see, or analyze images, and do not ask the farmer to describe the uploaded media. "
                    "If the assessment is uncertain, explain what is uncertain and ask a focused follow-up question. "
                    if visual_assessment
                    else ""
                )
                + f"Today's date is {today_str}. "
                f"You are advising the owner of {query.farm_name}, "
                f"a {query.size_acres}-acre farm primarily growing {query.crop}. "
                f"Current local weather {location_label}: "
                f"{weather['temperature_c']}°C with {weather['rainfall_mm']}mm of rain. "
                f"{nearby_text}"
                "Language rule: if the farmer's question is in Kiswahili or Sheng, answer in Kiswahili or a natural Kiswahili-Sheng mix. "
                "If the farmer writes in English, answer in clear English. If the farmer uses English slang or casual wording, keep it natural and conversational, not robotic. "
                "Do not force English when the user asks in Swahili or Sheng. "
                "Response style rule: "
                "- Kiswahili / Sheng: use short, natural, spoken language like a Kenyan farmer would say it. Keep sentences simple and practical. Use a few local phrases like 'sasa', 'msee', 'hii inatokea', 'niko na shida', 'tutafanya hivi', 'kwa haraka', 'kama ni lazima', but never overdo slang. "
                "- English slang: keep it casual, practical, and friendly, like a helpful farm advisor speaking to a farmer over the phone. "
                "- English formal: stay clear and professional but still concise. "
                "Voice guidance for spoken replies: speak slowly, one sentence at a time, with a natural pause between thoughts. Keep the answer short enough to listen to comfortably. Do not use markdown, bullets, symbols, emojis, or long dense paragraphs. Use words instead of shorthand, such as 'tonnes' instead of 't', and 'Kenya shillings' instead of 'KES'. "
                "If the answer is read aloud, make it easy to listen to: short sentences, plain language, no jargon, no forced formality, and no long lists. Use everyday farmer-friendly wording. "
                "Integrate this farm profile, current date, and weather naturally into your advice. "
                "STRICT RULE: Never apologize or disclaim that you lack access to real-time dates, time, GPS, or farm records. Speak with full authority using the supplied context. "
                "Keep answers concise, practical, card-style, and tailored to smallholder farmers. "
                f"Detected user language style: {farmer_language}."
            ),
        },
        {
            "role": "user",
            "content": (
                query.message
                if not visual_assessment
                else f"{query.message}\n\n[Attached media assessment]: {visual_assessment}"
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
