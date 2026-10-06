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

# --- NEW UPDATED IMPORTS ---
from forecasting.forecaster import SAMPLE_COHORTS, WEEKLY_DEMAND_T, HARVEST_LOSS, forecast_surplus
from risk.risk_assessor import SHELF_LIFE_DAYS, ALERT_THRESHOLD, add_risk
from matching.matcher import OPTIONS, score_options
from optimization.optimizer import allocate
from pipeline.run_pipeline import CAPACITY_T
from weather.weather_client import get_weather  
# ---------------------------

TOL_T = 0.5   # tonnes of rounding slack when checking the model's sums

# A cold room that can hold surplus tonnes for a few weeks (SYNTHETIC numbers).
# Tonnes stored in week s can be released in weeks s+1 .. s+max_hold_weeks;
# anything still there after that spoils. Holding costs money every week.
STORAGE = {"name": "Mwea cold room", "capacity_t": 150.0, "max_hold_weeks": 2,
           "holding_cost_kes_per_kg_week": 2.0}

# Shown to the model in step 2 so it knows the exact format to answer in.
DECISION_FORMAT = """{
  "weeks": [
    {"week": 0, "supply_t": 0.0, "demand_t": 800.0, "surplus_t": 0.0,
     "risk": 0.35, "alert": false,
     "allocations": [{"option": "<option name>", "tonnes": 0.0}],
     "unallocated_t": 0.0, "store_t": 0.0, "release_t": 0.0,
     "reasoning": "one or two sentences"}
  ],
  "warnings": ["anything odd or missing in the input data"]
}"""


# ---------- IN: the situation ----------
def build_situation(lat: float = None, lng: float = None) -> dict:
    """Bundle everything we know into one JSON-friendly dict."""
    options = OPTIONS.copy()
    options["capacity_t_per_week"] = options["name"].map(CAPACITY_T)
    
    # Fetch live weather for the farmer's map pin!
    current_weather = get_weather(lat, lng)
    
    return {
        "crop": "tomato",
        "cohorts": SAMPLE_COHORTS.to_dict("records"),
        "weekly_demand_t": list(WEEKLY_DEMAND_T),
        "options": options.to_dict("records"),
        "assumptions": {"harvest_loss": HARVEST_LOSS,
                        "shelf_life_days": SHELF_LIFE_DAYS,
                        "alert_threshold": ALERT_THRESHOLD},
        "storage": dict(STORAGE),
        "weather": current_weather,  # <-- NEW
    }


# ---------- Reference answer from the plain math (steps 1-5) ----------
def reference_decision(situation: dict) -> dict:
    """What the math alone would decide. Same format the model must use."""
    cohorts = pd.DataFrame(situation["cohorts"])
    options = pd.DataFrame(situation["options"])
    forecast = add_risk(
        forecast_surplus(cohorts, situation["weekly_demand_t"]),
        situation.get("weather", {})
    )
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
            "store_t": 0.0, "release_t": 0.0,
            "reasoning": "Reference math: greedy allocation by match score.",
        })
    return {"weeks": weeks, "warnings": []}


# ---------- Storage: the cold room that moves tonnes between weeks ----------
def _num(x) -> float:
    """A real number, or 0.0 (wrong types are reported by validate_decision)."""
    return float(x) if isinstance(x, (int, float)) and not isinstance(x, bool) else 0.0


def simulate_storage(situation: dict, decision: dict) -> dict:
    """Replay the decision's store_t / release_t week by week (oldest tonnes
    leave first). Returns {'problems', 'spoiled_t', 'left_t', 'held_tonne_weeks'}.
    Each week: release first, then store; at the end of the week, tonnes that
    have been held for max_hold_weeks are spoiled."""
    storage = situation.get("storage")
    cap = _num(storage["capacity_t"]) if storage else 0.0
    hold = int(storage["max_hold_weeks"]) if storage else 0
    weeks = sorted((w for w in decision.get("weeks", [])
                    if isinstance(w, dict) and isinstance(w.get("week"), int)),
                   key=lambda w: w["week"])
    batches, problems = [], []             # batches: [week stored, tonnes]
    spoiled = held = 0.0
    for w in weeks:
        wk, store, release = w["week"], _num(w.get("store_t")), _num(w.get("release_t"))
        if (store > TOL_T or release > TOL_T) and not storage:
            problems.append(f"week {wk}: there is no storage facility")
            store = release = 0.0
        available = sum(t for _, t in batches)
        if release > available + TOL_T:
            problems.append(f"week {wk}: releases {release:.0f} t but only "
                            f"{available:.0f} t is in storage")
            release = min(release, available)
        left_to_take = release
        for b_ in batches:                         # oldest first
            take = min(b_[1], left_to_take)
            b_[1] -= take
            left_to_take -= take
        batches = [b_ for b_ in batches if b_[1] > 1e-9]
        after_release = sum(t for _, t in batches)
        if after_release + store > cap + TOL_T:
            problems.append(f"week {wk}: storage over capacity "
                            f"({after_release + store:.0f} t > {cap:.0f} t)")
        if store > 0:
            batches.append([wk, store])
        held += sum(t for _, t in batches)         # tonnes held through this week
        keep = []
        for b_ in batches:
            if wk - b_[0] >= hold:                 # held as long as allowed
                spoiled += b_[1]
                problems.append(f"{b_[1]:.0f} t stored in week {b_[0]} SPOILED by week {wk}: store later, store less, or release earlier")
            else:
                keep.append(b_)
        batches = keep
    return {"problems": problems, "spoiled_t": spoiled,
            "left_t": sum(t for _, t in batches), "held_tonne_weeks": held}


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
        bad_flow = [k for k in ("store_t", "release_t") if k in w and (
            not isinstance(w[k], (int, float)) or isinstance(w[k], bool) or w[k] < 0)]
        if bad_flow:
            problems.append(f"week {wk}: {bad_flow} must be numbers >= 0")
            continue
        store, release = _num(w.get("store_t")), _num(w.get("release_t"))
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
        if store > TOL_T and free > TOL_T:
            problems.append(f"week {wk}: {store:.0f} t assigned to multi-week storage "
                            f"while {free:.0f} t of immediate option capacity is still free; "
                            "fill immediate options before storing overflow")
        # tonnes in = this week's surplus + tonnes released from storage;
        # tonnes out = placed + put into storage + wasted
        if abs(total + store + w["unallocated_t"] - w["surplus_t"] - release) > TOL_T:
            problems.append(f"week {wk}: placed + stored + unallocated != "
                            f"surplus + released (tonnes lost or invented)")
    problems += simulate_storage(situation, decision)["problems"]
    return problems


# ---------- Numbers the CODE computes (never the model) ----------
def add_impact(situation: dict, decision: dict) -> dict:
    """Add a summary computed from the decision. Returns a new decision.
    wasted = never placed + spoiled in storage + still in storage at the end,
    so saved + wasted always equals the total surplus."""
    price = {o["name"]: o["price_kes_kg"] for o in situation["options"]}
    co2e = {o["name"]: o["co2e_per_t"] for o in situation["options"]}
    saved = revenue = co2e_kg = unplaced = 0.0
    for w in decision["weeks"]:
        unplaced += w["unallocated_t"]
        for a in w["allocations"]:
            saved += a["tonnes"]
            revenue += a["tonnes"] * 1000 * price[a["option"]]
            co2e_kg += a["tonnes"] * co2e[a["option"]]
    sim = simulate_storage(situation, decision)
    storage = situation.get("storage")
    holding = (sim["held_tonne_weeks"] * 1000
               * storage["holding_cost_kes_per_kg_week"]) if storage else 0.0
    out = copy.deepcopy(decision)
    out["summary"] = {
        "tonnes_saved": saved,
        "tonnes_wasted": unplaced + sim["spoiled_t"] + sim["left_t"],
        "tonnes_spoiled": sim["spoiled_t"],
        "tonnes_left_in_storage": sim["left_t"],
        "revenue_kes": revenue,
        "holding_cost_kes": holding,
        "net_value_kes": revenue - holding,
        "co2e_avoided_t": co2e_kg / 1000,
    }
    return out


def tighten_capacity(situation: dict, factor: float) -> dict:
    """Copy of the situation with every option's capacity scaled (for tests/demos)."""
    s = copy.deepcopy(situation)
    for o in s["options"]:
        o["capacity_t_per_week"] = o["capacity_t_per_week"] * factor
    return s


def hand_storage_plan(situation: dict) -> dict:
    """A hand-made plan for the demo/tests: store half of the overflow of weeks 6
    and 7 (75 t each) and sell it all in week 8. Not clever, just valid."""
    plan = copy.deepcopy(reference_decision(situation))
    wk = {w["week"]: w for w in plan["weeks"]}
    for n in (6, 7):
        wk[n]["store_t"] = 75.0
        wk[n]["unallocated_t"] -= 75.0
    options = pd.DataFrame(situation["options"])
    scored = score_options(options)
    scored["capacity_t"] = scored["name"].map(
        dict(zip(options["name"], options["capacity_t_per_week"])))
    a = allocate(150.0, scored[["name", "score", "capacity_t"]])
    wk[8]["release_t"] = 150.0
    wk[8]["allocations"] = [{"option": n, "tonnes": float(t)}
                            for n, t in zip(a["name"], a["allocated_t"]) if t > 0]
    wk[8]["reasoning"] = "Sell the stored tomatoes while option capacity is idle."
    return plan


if __name__ == "__main__":
    situation = build_situation()
    decision = reference_decision(situation)
    problems = validate_decision(situation, decision)
    final = add_impact(situation, decision)
    s = final["summary"]
    print(f"Situation: {len(situation['cohorts'])} cohorts, "
          f"{len(situation['options'])} options, "
          f"{len(situation['weekly_demand_t'])} weeks, storage "
          f"{situation['storage']['capacity_t']:.0f} t")
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

    # --- storage: a tighter world where stored tonnes can be saved ---
    tight = tighten_capacity(situation, 0.6)           # options take 60% as much
    base = reference_decision(tight)
    plan = hand_storage_plan(tight)
    assert validate_decision(tight, base) == [], "baseline stays valid"
    assert validate_decision(tight, plan) == [], validate_decision(tight, plan)
    sb, sp = add_impact(tight, base)["summary"], add_impact(tight, plan)["summary"]
    total_surplus = sum(w["surplus_t"] for w in base["weeks"])
    for sm in (sb, sp):                                # nothing lost or invented
        assert abs(sm["tonnes_saved"] + sm["tonnes_wasted"] - total_surplus) < 1e-6
    assert abs(sp["tonnes_saved"] - sb["tonnes_saved"] - 150) < 1e-6
    assert sp["tonnes_spoiled"] == 0 and sp["tonnes_left_in_storage"] == 0
    assert abs(sp["holding_cost_kes"] - 450_000) < 1e-6     # 225 tonne-weeks x 2 KES/kg
    print(f"\nStorage demo (options at 60% capacity): baseline saves "
          f"{sb['tonnes_saved']:,.0f} t, planned storage saves "
          f"{sp['tonnes_saved']:,.0f} t (+{sp['tonnes_saved'] - sb['tonnes_saved']:,.0f}), "
          f"net value {sp['net_value_kes'] - sb['net_value_kes']:+,.0f} KES")

    def storage_problems(mutate):                      # mutate a copy of the plan
        d = copy.deepcopy(plan)
        mutate({w["week"]: w for w in d["weeks"]})
        return validate_decision(tight, d)

    assert any("only 0 t is in storage" in p for p in storage_problems(
        lambda wk: wk[3].update(release_t=10.0)))                     # nothing stored yet
    def overfill(wk):
        wk[6]["store_t"], wk[6]["unallocated_t"] = 200.0, wk[6]["unallocated_t"] - 125.0
    assert any("storage over capacity" in p for p in storage_problems(overfill))
    assert any("tonnes lost or invented" in p for p in storage_problems(
        lambda wk: wk[6].update(store_t=0.0)))                        # tonnes vanish
    assert any("no storage facility" in p for p in validate_decision(
        {**tight, "storage": None}, plan))

    # stored but never sold: valid, but the tonnes spoil and count as wasted
    wasteful = copy.deepcopy(base)
    w4 = wasteful["weeks"][4]
    w4["store_t"], w4["unallocated_t"] = 75.0, w4["unallocated_t"] - 75.0
    assert validate_decision(tight, wasteful) == []
    sw = add_impact(tight, wasteful)["summary"]
    assert sw["tonnes_spoiled"] == 75 and sw["tonnes_saved"] == sb["tonnes_saved"]
    assert sw["net_value_kes"] < sb["net_value_kes"], "holding cost must show up"
    print("All storage checks passed: valid plans pass, 4 kinds of bad plans fail, "
          "spoilage is counted.")