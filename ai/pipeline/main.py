"""
MAVUNO-X FastAPI Backend
Run this server with: python main.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# 1. Force FastAPI to load your NVIDIA_API_KEY from the .env file
load_dotenv()

# 2. Import the actual AI Brain instead of the basic math pipeline
from brain import call_nvidia, think
from brain_schema import build_situation
from explanation import explain_alert
from matching_scores import OPTIONS
from run_pipeline import CAPACITY_T

app = FastAPI(title="MAVUNO-X AI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ChatQuery(BaseModel):
    message: str


@app.post("/api/v1/chat")
def chat_endpoint(query: ChatQuery):
    """Answer a farmer question with the NVIDIA-hosted MAVUNO assistant."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are MAVUNO AI, an expert agricultural and resource assistant "
                "for MAVUNO Green Grid in Kenya. You help farmers manage crop "
                "surpluses, coordinate with buyers, cold storage, processors, and "
                "transport, and reduce food waste. Keep answers concise, practical, "
                "and tailored to smallholder farmers. Do not invent farm-specific "
                "facts that were not provided."
            ),
        },
        {"role": "user", "content": query.message},
    ]
    try:
        response = call_nvidia(messages)
        return {"status": "success", "reply": response}
    except Exception as error:
        print(f"MAVUNO chat request failed ({type(error).__name__}): {error}")
        return {
            "status": "error",
            "reply": (
                "I'm having trouble connecting to my AI core right now. "
                "Please check your surplus risk watch and local storage options."
            ),
        }


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
def get_alerts():
    """
    Builds the situation, asks the NVIDIA model to plan 12-week cold storage,
    and generates natural language explanations for high-risk weeks.
    """
    situation = build_situation()
    
    # 3. Ask the NVIDIA model to generate the multi-week plan
    result = think(situation)
    decision = result["decision"]
    
    # Grab the price and co2e dictionaries to calculate weekly metrics
    price = {o["name"]: o["price_kes_kg"] for o in situation["options"]}
    co2e = {o["name"]: o["co2e_per_t"] for o in situation["options"]}
    
    alerts = []
    
    for w in decision["weeks"]:
        if w["alert"]:
            # Calculate this specific week's saved tonnes and revenue
            saved = sum(a["tonnes"] for a in w.get("allocations", []))
            revenue = sum(a["tonnes"] * 1000 * price[a["option"]] for a in w.get("allocations", []))
            co2e_kg = sum(a["tonnes"] * co2e[a["option"]] for a in w.get("allocations", []))
            
            # Format the data exactly how explanation.py expects it
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
            explanation = explain_alert(row_dict)
            
            alerts.append({
                "week": w["week"],
                "surplus_t": w["surplus_t"],
                "risk": w["risk"],
                "tonnes_saved": saved,
                "tonnes_wasted": w["unallocated_t"],
                "store_t": w.get("store_t", 0.0),       # Exposes the AI's storage decision
                "release_t": w.get("release_t", 0.0),   # Exposes the AI's release decision
                "revenue_kes": revenue,
                "co2e_avoided_t": co2e_kg / 1000,
                "ai_reasoning": w.get("reasoning", ""), # The model's short logic
                "ai_explanation": explanation["text"],
                "explanation_source": explanation["source"]
            })
            
    return {
        "status": "success",
        "ai_engine_used": result["source"], 
        "global_impact": decision["summary"], # Include the overall 12-week metrics
        "data": alerts
    }

if __name__ == "__main__":
    print("Starting MAVUNO-X AI API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)