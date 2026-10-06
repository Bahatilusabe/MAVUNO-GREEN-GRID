import pandas as pd

SHELF_LIFE_DAYS = 7
ALERT_THRESHOLD = 0.60
WEIGHTS = {"surplus": 0.5, "perishability": 0.3, "urgency": 0.2}

def risk_breakdown(surplus_ratio: float, weeks_until: int, shelf_life_days: int = SHELF_LIFE_DAYS, weather: dict = None) -> dict:
    if weather is None: weather = {}
    
    # Dynamic adjustment: if temp > 28°C, tomatoes spoil 2 days faster
    actual_shelf_life = shelf_life_days
    if weather.get("temperature_c", 25.0) > 28.0:
        actual_shelf_life = max(1, shelf_life_days - 2)
        
    s = min(surplus_ratio / 0.30, 1.0)
    p = max(0.0, 1 - actual_shelf_life / 14)
    
    # Dynamic adjustment: if rain > 10mm, transport/harvest gets harder (urgency rises)
    u = max(0.0, 1 - weeks_until / 8)
    if weather.get("rainfall_mm", 0.0) > 10.0:
        u = min(1.0, u + 0.2)
        
    return {"surplus": WEIGHTS["surplus"] * s, "perishability": WEIGHTS["perishability"] * p, "urgency": WEIGHTS["urgency"] * u}

def risk_score(surplus_ratio: float, weeks_until: int, shelf_life_days: int = SHELF_LIFE_DAYS, weather: dict = None) -> float:
    parts = risk_breakdown(surplus_ratio, weeks_until, shelf_life_days, weather)
    return round(sum(parts.values()), 3)

def add_risk(forecast: pd.DataFrame, weather: dict = None) -> pd.DataFrame:
    f = forecast.copy()
    f["risk"] = [risk_score(r.surplus_ratio, int(r.week), SHELF_LIFE_DAYS, weather) for r in f.itertuples()]
    f["alert"] = (f.risk >= ALERT_THRESHOLD) & (f.surplus_t > 0)
    return f