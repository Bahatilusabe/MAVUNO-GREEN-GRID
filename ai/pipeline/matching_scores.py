"""
KIFARU core logic, step 3: score and rank recovery options.
Needs: pandas.  Run:  python matching_scores.py

!! ALL NUMBERS ARE SYNTHETIC PLACEHOLDERS. Replace OPTIONS with real data later.

Each option gets four sub-scores between 0 and 1 (higher is better):
  value    : how much money the tomatoes are worth on this route
  distance : closer is better
  urgency  : how quickly the option can take the tomatoes
  impact   : how much CO2e is avoided compared with letting them rot
Final score = weighted sum of the four. Weights are adjustable.
"""
import pandas as pd

# Adjustable weights (must add up to 1)
WEIGHTS = {"value": 0.35, "distance": 0.20, "urgency": 0.20, "impact": 0.25}

# One row per option. Prices in KES/kg, impact in kg CO2e avoided per tonne.
OPTIONS = pd.DataFrame([
    # name,                  type,          price, km,  lead_days, co2e_per_t
    ("Nairobi wholesale",    "buyer",       40,    100, 2,         1500),
    ("Local town markets",   "buyer",       25,    20,  1,         1500),
    ("Tomato paste factory", "processor",   18,    60,  3,         1200),
    ("Cold store (Mwea)",    "cold_store",  30,    15,  1,         1300),
    ("Solar dryer coop",     "processor",   12,    10,  2,         1100),
    ("Animal feed",          "recovery",    3,     25,  1,         400),
    ("Compost",              "recovery",    1,     5,   1,         150),
], columns=["name", "type", "price_kes_kg", "distance_km",
            "lead_days", "co2e_per_t"])


def scale_high_is_good(s: pd.Series) -> pd.Series:
    """Scale values to 0-1 where the biggest value gets 1."""
    return s / s.max()


def scale_low_is_good(s: pd.Series) -> pd.Series:
    """Scale values to 0-1 where the smallest value gets 1 (closer/faster)."""
    return 1 - (s - s.min()) / (s.max() - s.min())


def score_options(options: pd.DataFrame, weights: dict = WEIGHTS) -> pd.DataFrame:
    """Add four sub-scores and a final score, sorted best first."""
    assert abs(sum(weights.values()) - 1) < 1e-9, "weights must add up to 1"
    df = options.copy()
    df["value"] = scale_high_is_good(df.price_kes_kg)
    df["distance"] = scale_low_is_good(df.distance_km)
    df["urgency"] = scale_low_is_good(df.lead_days)
    df["impact"] = scale_high_is_good(df.co2e_per_t)
    df["score"] = sum(weights[k] * df[k] for k in weights)
    return df.sort_values("score", ascending=False).reset_index(drop=True)


if __name__ == "__main__":
    ranked = score_options(OPTIONS)
    pd.set_option("display.float_format", "{:.2f}".format)
    print(ranked[["name", "value", "distance", "urgency", "impact",
                  "score"]].to_string(index=False))

    # --- tiny self-checks ---
    assert ranked.score.between(0, 1).all(), "scores must be in [0, 1]"
    assert ranked.score.is_monotonic_decreasing, "must be sorted best first"
    # Money-only weights should put the highest price first.
    money_only = score_options(OPTIONS, {"value": 1, "distance": 0,
                                         "urgency": 0, "impact": 0})
    assert money_only.name.iloc[0] == "Nairobi wholesale"
    print("All checks passed.")