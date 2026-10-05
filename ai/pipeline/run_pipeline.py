"""
Pipeline: connects steps 1-5 so the surplus flows through to impact numbers.
Needs: numpy, pandas. Keep this file in the SAME folder as:
    surplus_forecast.py, matching_scores.py, allocation.py, impact.py
Run:  python run_pipeline.py

Flow, for every week that raises an alert:
    surplus forecast -> score options -> allocate tonnes -> impact summary

Capacities are tightened to 60% of baseline to create realistic market overflow.
"""
import pandas as pd

from surplus_forecast import (SAMPLE_COHORTS, WEEKLY_DEMAND_T,
                              forecast_surplus, add_risk)
from matching_scores import OPTIONS, score_options
from allocation import allocate
from impact import impact_summary

# How many tonnes each option can take per week (tightened to 60%).
CAPACITY_T = {
    "Cold store (Mwea)": 36,
    "Local town markets": 48,
    "Nairobi wholesale": 90,
    "Solar dryer coop": 18,
    "Animal feed": 24,
    "Tomato paste factory": 60,
    "Compost": 30,
}


def run_week(surplus_t: float) -> dict:
    """Run steps 3-5 for one week's surplus and return the impact summary."""
    scored = score_options(OPTIONS)                       # step 3
    scored["capacity_t"] = scored["name"].map(CAPACITY_T)
    alloc = allocate(surplus_t, scored)                   # step 4
    return impact_summary(alloc, surplus_t)               # step 5


def run_pipeline() -> pd.DataFrame:
    """Run the whole chain; returns one row of results per alert week."""
    forecast = add_risk(forecast_surplus(SAMPLE_COHORTS, WEEKLY_DEMAND_T))  # 1-2
    rows = []
    for week in forecast[forecast.alert].itertuples():
        summary = run_week(week.surplus_t)
        rows.append({"week": week.week, "risk": week.risk,
                     "surplus_ratio": week.surplus_ratio, **summary})
    return pd.DataFrame(rows)


if __name__ == "__main__":
    result = run_pipeline()
    pd.set_option("display.float_format", "{:,.0f}".format)
    cols = ["week", "surplus_t", "tonnes_saved", "tonnes_wasted",
            "revenue_kes", "co2e_avoided_t"]
    print(result[cols].to_string(index=False))

    totals = result[["surplus_t", "tonnes_saved", "tonnes_wasted",
                     "revenue_kes", "co2e_avoided_t"]].sum()
    print("\nTOTAL over alert weeks")
    print(totals.to_string(float_format=lambda x: f"{x:,.0f}"))

    # --- tiny self-checks ---
    assert not result.empty, "expected at least one alert week"
    assert (result.tonnes_saved + result.tonnes_wasted
            - result.surplus_t).abs().max() < 1e-6, "tonnes lost"
    assert (result.tonnes_saved <= sum(CAPACITY_T.values()) + 1e-9).all()
    print("\nAll checks passed.")