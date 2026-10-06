import pandas as pd

SHELF_LIFE_DAYS = 7
ALERT_THRESHOLD = 0.60
WEIGHTS = {"surplus": 0.5, "perishability": 0.3, "urgency": 0.2}

def risk_breakdown(surplus_ratio: float, weeks_until: int, shelf_life_days: int = SHELF_LIFE_DAYS) -> dict:
    s = min(surplus_ratio / 0.30, 1.0)
    p = max(0.0, 1 - shelf_life_days / 14)
    u = max(0.0, 1 - weeks_until / 8)
    return {"surplus": WEIGHTS["surplus"] * s, "perishability": WEIGHTS["perishability"] * p, "urgency": WEIGHTS["urgency"] * u}

def risk_score(surplus_ratio: float, weeks_until: int, shelf_life_days: int = SHELF_LIFE_DAYS) -> float:
    parts = risk_breakdown(surplus_ratio, weeks_until, shelf_life_days)
    return round(sum(parts.values()), 3)

def add_risk(forecast: pd.DataFrame) -> pd.DataFrame:
    f = forecast.copy()
    f["risk"] = [risk_score(r.surplus_ratio, int(r.week)) for r in f.itertuples()]
    f["alert"] = (f.risk >= ALERT_THRESHOLD) & (f.surplus_t > 0)
    return f