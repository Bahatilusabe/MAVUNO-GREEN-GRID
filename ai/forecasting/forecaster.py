import numpy as np
import pandas as pd

# Assumptions and synthetic data
HARVEST_LOSS = 0.10
SAMPLE_COHORTS = pd.DataFrame([
    ("Mwea East",           240, 12.0, 2, 6),
    ("Mwea West",           210, 11.0, 3, 6),
    ("Kirinyaga Central",   120, 13.0, 3, 5),
    ("Kirinyaga East",       90, 10.0, 4, 5),
    ("Kirinyaga West",       72, 12.0, 4, 4),
], columns=["sub_county", "acres", "yield_t_per_acre", "harvest_start_wk", "harvest_weeks"])

WEEKLY_DEMAND_T = [800, 800, 820, 850, 900, 920, 900, 880, 850, 820, 800, 800]

def weekly_supply(cohorts: pd.DataFrame, n_weeks: int = 12) -> pd.DataFrame:
    supply = pd.DataFrame(0.0, index=range(n_weeks), columns=cohorts["sub_county"])
    for _, c in cohorts.iterrows():
        total = c.acres * c.yield_t_per_acre * (1 - HARVEST_LOSS)
        per_week = total / c.harvest_weeks
        for w in range(c.harvest_start_wk, c.harvest_start_wk + c.harvest_weeks):
            if w < n_weeks:
                supply.loc[w, c.sub_county] += per_week
    return supply

def forecast_surplus(cohorts: pd.DataFrame, demand: list) -> pd.DataFrame:
    supply = weekly_supply(cohorts, n_weeks=len(demand))
    out = pd.DataFrame({
        "week": range(len(demand)),
        "supply_t": supply.sum(axis=1).values,
        "demand_t": demand,
    })
    out["surplus_t"] = (out.supply_t - out.demand_t).clip(lower=0)
    out["surplus_ratio"] = np.where(out.supply_t > 0, out.surplus_t / out.supply_t, 0.0)
    return out