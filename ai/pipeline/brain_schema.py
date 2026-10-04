"""
Brain step 1: what goes INTO the AI model, what must come OUT, and the checker.
Needs: numpy, pandas. Keep in the same folder as the other pipeline files.
Run:  python brain_schema.py

IN  : a "situation" dict = everything we know (farms, demand, buyers, capacities).
OUT : a "decision" dict = the model's forecast, risk, allocation and reasoning.
The model supplies the decisions. CODE computes money and CO2e from the
allocations, because language models are unreliable at arithmetic.

reference_decision() is the plain-math answer from steps 1-5. It lets us test
the whole plumbing (and later compare the model against it) without any model.
"""
import copy
import json

import pandas as pd

from surplus_forecast import (SAMPLE_COHORTS, WEEKLY_DEMAND_T, HARVEST_LOSS,
                              SHELF_LIFE_DAYS, ALERT_THRESHOLD,
                              forecast_surplus, add_risk)
from matching_scores import OPTIONS, score_options
from allocation import allocate
from run_pipeline import CAPACITY_T

TOL_T = 0.5   # tonnes of rounding slack when checking the model's sums

# Shown to the model in step 2 so it knows the exact format to answer in.
DECISION_FORMAT = """{
  "weeks": [
    {"week": 0, "supply_t": 0.0, "demand_t": 800.0, "surplus_t": 0.0,
     "risk": 0.35, "alert": false,
     "allocations": [{"option": "<option name>", "tonnes": 0.0}],
     "unallocated_t": 0.0,
     "reasoning": "one or two sentences"}
  ],
  "warnings": ["anything odd or missing in the input data"]
}"""


# ---------- IN: the situation ----------
def build_situation() -> dict:
    """Bundle everything we know into one JSON-friendly dict."""
    options = OPTIONS.copy()
    options["capacity_t_per_week"] = options["name"].map(CAPACITY_T)
    return {
        "crop": "tomato",
        "cohorts": SAMPLE_COHORTS.to_dict("records"),
        "weekly_demand_t": list(WEEKLY_DEMAND_T),
        "options": options.to_dict("records"),
        "assumptions": {"harvest_loss": HARVEST_LOSS,
                        "shelf_life_days": SHELF_LIFE_DAYS,
                        "alert_threshold": ALERT_THRESHOLD},
    }


# ---------- Reference answer from the plain math (steps 1-5) ----------
def reference_decision(situation: dict) -> dict:
    """What the math alone would decide. Same format the model must use."""
    cohorts = pd.DataFrame(situation["cohorts"])
    options = pd.DataFrame(situation["options"])
    forecast = add_risk(forecast_surplus(cohorts, situation["weekly_demand_t"]))
    scored = score_options(options)
    scored["capacity_t"] = scored["name"].map(
        dict(zip(options["name"], options["capacity_t_per_week"])))
    weeks = []
    for r in forecast.itertuples():
        allocs, unallocated = [], 0.0
        if r.surplus_t > 0:
            a = allocate(r.surplus_t, scored[["name", "score", "capacity_t"]])
            allocs = [{"option": n, "tonnes": float(t)}
                      for n, t in zip(a["name"], a["allocated_t"]) if t > 0]
            unallocated = float(a.attrs["unallocated_t"])
        weeks.append({
            "week": int(r.week), "supply_t": float(r.supply_t),
            "demand_t": float(r.demand_t), "surplus_t": float(r.surplus_t),
            "risk": float(r.risk), "alert": bool(r.alert),
            "allocations": allocs, "unallocated_t": unallocated,
            "reasoning": "Reference math: greedy allocation by match score.",
        })
    return {"weeks": weeks, "warnings": []}


# ---------- The checker ----------
def validate_decision(situation: dict, decision: dict) -> list:
    """Return a list of problems. An empty list means the decision is valid."""
    problems = []
    weeks = decision.get("weeks")
    if not isinstance(weeks, list) or not isinstance(decision.get("warnings"), list):
        return ["decision must have a 'weeks' list and a 'warnings' list"]

    capacity = {o["name"]: o["capacity_t_per_week"] for o in situation["options"]}
    n_weeks = len(situation["weekly_demand_t"])
    if sorted(w.get("week") for w in weeks) != list(range(n_weeks)):
        problems.append(f"weeks must be exactly 0..{n_weeks - 1}, once each")

    needed = ["week", "supply_t", "demand_t", "surplus_t", "risk", "alert",
              "allocations", "unallocated_t", "reasoning"]
    for w in weeks:
        missing = [k for k in needed if k not in w]
        if missing:
            problems.append(f"week {w.get('week')}: missing {missing}")
            continue
        wk = w["week"]
        nums = [w["supply_t"], w["demand_t"], w["surplus_t"], w["risk"],
                w["unallocated_t"]]
        if not all(isinstance(x, (int, float)) and not isinstance(x, bool)
                   for x in nums):
            problems.append(f"week {wk}: numeric fields must be numbers")
            continue
        if not isinstance(w["alert"], bool):
            problems.append(f"week {wk}: alert must be true/false")
        if not 0 <= w["risk"] <= 1:
            problems.append(f"week {wk}: risk {w['risk']} outside 0-1")
        if w["surplus_t"] < 0 or w["unallocated_t"] < 0:
            problems.append(f"week {wk}: negative tonnes")
        expected = max(w["supply_t"] - w["demand_t"], 0)
        if abs(w["surplus_t"] - expected) > TOL_T:
            problems.append(f"week {wk}: surplus {w['surplus_t']} != "
                            f"supply - demand ({expected:.1f})")
        if not isinstance(w["reasoning"], str) or not w["reasoning"].strip():
            problems.append(f"week {wk}: reasoning is empty")

        total, seen, used = 0.0, set(), {}
        for a in w["allocations"]:
            name, t = a.get("option"), a.get("tonnes")
            if name not in capacity:
                problems.append(f"week {wk}: unknown option {name!r}")
            elif name in seen:
                problems.append(f"week {wk}: {name} listed twice")
            elif not isinstance(t, (int, float)) or t < 0:
                problems.append(f"week {wk}: bad tonnes for {name}")
            elif t > capacity[name] + TOL_T:
                problems.append(f"week {wk}: {name} over capacity "
                                f"({t} > {capacity[name]})")
            seen.add(name)
            total += t if isinstance(t, (int, float)) else 0
            if name in capacity and isinstance(t, (int, float)):
                used[name] = used.get(name, 0) + t
        free = sum(max(capacity[n] - used.get(n, 0), 0) for n in capacity)
        if w["unallocated_t"] > TOL_T and free > TOL_T:
            problems.append(f"week {wk}: {w['unallocated_t']:.0f} t left unplaced "
                            f"while {free:.0f} t of capacity is still free")
        if abs(total + w["unallocated_t"] - w["surplus_t"]) > TOL_T:
            problems.append(f"week {wk}: allocated + unallocated "
                            f"!= surplus (tonnes lost or invented)")
    return problems


# ---------- Numbers the CODE computes (never the model) ----------
def add_impact(situation: dict, decision: dict) -> dict:
    """Add a summary computed from the allocations. Returns a new decision."""
    price = {o["name"]: o["price_kes_kg"] for o in situation["options"]}
    co2e = {o["name"]: o["co2e_per_t"] for o in situation["options"]}
    saved = revenue = co2e_kg = wasted = 0.0
    for w in decision["weeks"]:
        wasted += w["unallocated_t"]
        for a in w["allocations"]:
            saved += a["tonnes"]
            revenue += a["tonnes"] * 1000 * price[a["option"]]
            co2e_kg += a["tonnes"] * co2e[a["option"]]
    out = copy.deepcopy(decision)
    out["summary"] = {"tonnes_saved": saved, "tonnes_wasted": wasted,
                      "revenue_kes": revenue, "co2e_avoided_t": co2e_kg / 1000}
    return out


if __name__ == "__main__":
    situation = build_situation()
    decision = reference_decision(situation)
    problems = validate_decision(situation, decision)
    final = add_impact(situation, decision)
    s = final["summary"]
    print(f"Situation: {len(situation['cohorts'])} cohorts, "
          f"{len(situation['options'])} options, "
          f"{len(situation['weekly_demand_t'])} weeks")
    print(f"Reference decision problems: {problems or 'none'}")
    print(f"Saved {s['tonnes_saved']:,.0f} t, wasted {s['tonnes_wasted']:,.0f} t, "
          f"KES {s['revenue_kes']:,.0f}, CO2e {s['co2e_avoided_t']:,.0f} t")

    # --- tiny self-checks ---
    json.dumps(situation)                       # must be JSON-friendly
    json.dumps(decision)
    assert problems == [], "the reference answer must pass its own checker"

    def broken(mutate):
        d = copy.deepcopy(decision)
        mutate(d["weeks"][4])                   # week 4 has real allocations
        return validate_decision(situation, d)

    assert broken(lambda w: w["allocations"][0].update(tonnes=9999))   # capacity
    assert broken(lambda w: w.update(unallocated_t=w["unallocated_t"] + 50))
    assert broken(lambda w: w.update(risk=1.5))
    assert broken(lambda w: w["allocations"][0].update(option="Made-up buyer"))
    assert broken(lambda w: w.pop("reasoning"))
    assert broken(lambda w: w.update(allocations=[], unallocated_t=w["surplus_t"]))  # gave up
    print("All checks passed: valid answers pass, 6 kinds of bad answers fail.")