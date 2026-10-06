import pandas as pd

# Adjustable weights (must add up to 1)
WEIGHTS = {"value": 0.35, "distance": 0.20, "urgency": 0.20, "impact": 0.25}

# Synthetic options data
OPTIONS = pd.DataFrame([
    ("Nairobi wholesale",    "buyer",       40,    100, 2,         1500),
    ("Local town markets",   "buyer",       25,    20,  1,         1500),
    ("Tomato paste factory", "processor",   18,    60,  3,         1200),
    ("Cold store (Mwea)",    "cold_store",  30,    15,  1,         1300),
    ("Solar dryer coop",     "processor",   12,    10,  2,         1100),
    ("Animal feed",          "recovery",    3,     25,  1,         400),
    ("Compost",              "recovery",    1,     5,   1,         150),
], columns=["name", "type", "price_kes_kg", "distance_km", "lead_days", "co2e_per_t"])


def scale_high_is_good(s: pd.Series) -> pd.Series:
    return s / s.max()

def scale_low_is_good(s: pd.Series) -> pd.Series:
    return 1 - (s - s.min()) / (s.max() - s.min())

def score_options(options: pd.DataFrame, weights: dict = WEIGHTS) -> pd.DataFrame:
    assert abs(sum(weights.values()) - 1) < 1e-9, "weights must add up to 1"
    df = options.copy()
    df["value"] = scale_high_is_good(df.price_kes_kg)
    df["distance"] = scale_low_is_good(df.distance_km)
    df["urgency"] = scale_low_is_good(df.lead_days)
    df["impact"] = scale_high_is_good(df.co2e_per_t)
    df["score"] = sum(weights[k] * df[k] for k in weights)
    return df.sort_values("score", ascending=False).reset_index(drop=True)