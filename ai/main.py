"""
MAVUNO-X FastAPI Backend
Run this server with: python main.py
"""
import os
import uuid
from pathlib import Path
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
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
from explanations.explainer import explain_alert
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


class ChatQuery(BaseModel):
    message: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    farm_name: Optional[str] = "Oloitiptip Family Farm"
    crop: Optional[str] = "tomatoes and kale"
    size_acres: Optional[float] = 2.5


@app.post("/api/v1/chat")
def chat_endpoint(query: ChatQuery):
    """Answer a farmer question with live date, weather, and farm context included."""
    weather = get_weather(query.lat, query.lng)
    location_label = "at the selected farm location" if query.lat else "in your region"
    today_str = datetime.now().strftime("%A, %B %d, %Y")
    farmer_language = detect_farmer_language(query.message)

    messages = [
        {
            "role": "system",
            "content": (
                "You are MAVUNO AI, an expert agricultural and logistics assistant "
                "for MAVUNO Green Grid in Kenya. "
                f"Today's date is {today_str}. "
                f"You are advising the owner of {query.farm_name}, "
                f"a {query.size_acres}-acre farm primarily growing {query.crop}. "
                f"Current local weather {location_label}: "
                f"{weather['temperature_c']}°C with {weather['rainfall_mm']}mm of rain. "
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
        {"role": "user", "content": query.message},
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

    result = think(situation)
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

            explanation = explain_alert(row_dict)

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


if __name__ == "__main__":
    # Render/Docker inject PORT; locally it falls back to 8010
    port = int(os.getenv("PORT", "8010"))
    print(f"Starting MAVUNO-X AI API Server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)