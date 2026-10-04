"""
MAVUNO-X core logic, steps 1-2: surplus forecast + spoilage risk.
Single crop (tomato). Sample data is Kirinyaga-style; swap in any region. Needs: numpy, pandas.

!! ALL DATA BELOW IS SYNTHETIC. Replace SAMPLE_COHORTS and WEEKLY_DEMAND_T
   with real numbers when you have them. The logic does not change.

Run:  python surplus_forecast.py
"""
import numpy as np
import pandas as pd

# ---------- Assumptions (edit these) ----------
HARVEST_LOSS = 0.10        # share of crop lost in field/handling before sale
SHELF_LIFE_DAYS = 7        # fresh tomato, no cold storage (rough assumption)
ALERT_THRESHOLD = 0.60     # risk score at/above this triggers Resource Alert
WEIGHTS = {"surplus": 0.5, "perishability": 0.3, "urgency": 0.2}

# ---------- Synthetic input data ----------
# One row = one planting cohort. Weeks are counted from "week 0" (this week).
SAMPLE_COHORTS = pd.DataFrame([
    # sub_county,         acres, yield_t_per_acre, harvest_start_wk, harvest_weeks
    ("Mwea East",           240, 12.0, 2, 6),
    ("Mwea West",           210, 11.0, 3, 6),
    ("Kirinyaga Central",   120, 13.0, 3, 5),
    ("Kirinyaga East",       90, 10.0, 4, 5),
    ("Kirinyaga West",       72, 12.0, 4, 4),
], columns=["sub_county", "acres", "yield_t_per_acre",
            "harvest_start_wk", "harvest_weeks"])

# Projected weekly demand the region can absorb (tonnes), weeks 0..11.
WEEKLY_DEMAND_T = [800, 800, 820, 850, 900, 920, 900, 880, 850, 820, 800, 800]


def weekly_supply(cohorts: pd.DataFrame, n_weeks: int = 12) -> pd.DataFrame:
    """Spread each cohort's total harvest evenly over its harvest window.
    Returns a table: rows = weeks, columns = sub_counties (tonnes)."""
    supply = pd.DataFrame(0.0, index=range(n_weeks),
                          columns=cohorts["sub_county"])
    for _, c in cohorts.iterrows():
        total = c.acres * c.yield_t_per_acre * (1 - HARVEST_LOSS)
        per_week = total / c.harvest_weeks
        for w in range(c.harvest_start_wk, c.harvest_start_wk + c.harvest_weeks):
            if w < n_weeks:
                supply.loc[w, c.sub_county] += per_week
    return supply


def forecast_surplus(cohorts: pd.DataFrame, demand: list) -> pd.DataFrame:
    """Weekly supply vs demand. Surplus is clipped at 0 (shortage != surplus)."""
    supply = weekly_supply(cohorts, n_weeks=len(demand))
    out = pd.DataFrame({
        "week": range(len(demand)),
        "supply_t": supply.sum(axis=1).values,
        "demand_t": demand,
    })
    out["surplus_t"] = (out.supply_t - out.demand_t).clip(lower=0)
    out["surplus_ratio"] = np.where(out.supply_t > 0,
                                    out.surplus_t / out.supply_t, 0.0)
    return out


def risk_breakdown(surplus_ratio: float, weeks_until: int,
                   shelf_life_days: int = SHELF_LIFE_DAYS) -> dict:
    """How much each signal adds to the 0-1 risk score (used to explain alerts).
    surplus      : share of the week's supply with no buyer (capped at 30% -> 1.0)
    perishability: shorter shelf life -> higher risk (14+ days -> 0)
    urgency      : sooner harvest -> less time to act (8+ weeks away -> 0)"""
    s = min(surplus_ratio / 0.30, 1.0)
    p = max(0.0, 1 - shelf_life_days / 14)
    u = max(0.0, 1 - weeks_until / 8)
    return {"surplus": WEIGHTS["surplus"] * s,
            "perishability": WEIGHTS["perishability"] * p,
            "urgency": WEIGHTS["urgency"] * u}


def risk_score(surplus_ratio: float, weeks_until: int,
               shelf_life_days: int = SHELF_LIFE_DAYS) -> float:
    """Combine the three signals into one 0-1 spoilage risk score."""
    parts = risk_breakdown(surplus_ratio, weeks_until, shelf_life_days)
    return round(sum(parts.values()), 3)


def add_risk(forecast: pd.DataFrame) -> pd.DataFrame:
    """Add risk score and alert flag to each forecast week."""
    f = forecast.copy()
    f["risk"] = [risk_score(r.surplus_ratio, int(r.week))
                 for r in f.itertuples()]
    f["alert"] = (f.risk >= ALERT_THRESHOLD) & (f.surplus_t > 0)
    return f


if __name__ == "__main__":
    result = add_risk(forecast_surplus(SAMPLE_COHORTS, WEEKLY_DEMAND_T))
    pd.set_option("display.float_format", "{:.2f}".format)
    print(result.to_string(index=False))

    # --- tiny self-checks ---
    assert (result.surplus_t >= 0).all(), "surplus must never be negative"
    assert result.risk.between(0, 1).all(), "risk must be in [0, 1]"
    total_supply = (SAMPLE_COHORTS.acres * SAMPLE_COHORTS.yield_t_per_acre
                    * (1 - HARVEST_LOSS)).sum()
    assert abs(result.supply_t.sum() - total_supply) < 1e-6, "supply mismatch"
    first = result[result.alert].head(1)
    if not first.empty:
        print(f"\nFirst alert: week {int(first.week.iloc[0])}, "
              f"surplus {first.surplus_t.iloc[0]:.0f} t")
    print("All checks passed.")