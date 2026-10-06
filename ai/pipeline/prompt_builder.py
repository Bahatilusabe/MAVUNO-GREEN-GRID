import json
import pandas as pd

from matching.matcher import score_options

# The shape of the model's reply: ONLY its decisions, nothing we can calculate.
CHOICE_FORMAT = """{
  "weeks": [
    {"week": 3,
     "allocations": [{"option": "", "tonnes": 0.0}],
     "unallocated_t": 0.0,
     "store_t": 0.0, 
     "release_t": 0.0,
     "reasoning": "under 20 words"}
  ],
  "warnings": ["anything odd or risky in the input data"]
}"""

SYSTEM_PROMPT = f"""You are the allocation decision-maker of a food-surplus network.
All forecasts, risk scores and option scores in the facts were calculated and
verified by code. Do NOT recompute or change them.

Your job: decide allocations across ALL weeks to maximize total tonnes saved and
net value while avoiding spoilage. Use each week's surplus, risk, option scores,
and spare_capacity_t as the evidence for your decisions.

Weather Rules:
- If rainfall > 10mm, prioritize local processors over long-distance transit.
- If temperature > 28°C, prioritize immediate cold storage if available.

Cold Storage Rules (Facility: Mwea cold room):
- Capacity: 150 tonnes maximum.
- Holding limit: produce may be held for at most 2 weeks before it spoils.
- 'store_t': put this week's overflow into multi-week cold storage.
- 'release_t': take tomatoes out of cold storage to sell in a week with
    spare_capacity_t. Do not release more than that week's spare capacity.
- "Cold store (Mwea)" in the options list is an immediate buyer route. It is
    separate from the "Mwea cold room" multi-week storage facility used by
    store_t and release_t. Do not confuse them.
- For each week, calculate the available tonnes as surplus_t + release_t.
    Include an allocation entry for EVERY option, even when its tonnes are 0.
    Allocate across all immediate options, including "Cold store (Mwea)", without
    exceeding any option's capacity_t_per_week. Do not omit an option just because
    other routes have higher scores.
- Let total_option_capacity be the sum of all options' capacity_t_per_week.
    The total allocated must be min(available tonnes, total_option_capacity).
    Only overflow beyond that amount may enter multi-week storage:
    store_t = min(max(0, available tonnes - total_option_capacity), remaining
    storage capacity). Thus, if available tonnes do not exceed total option
    capacity, store_t MUST be 0. Any remaining tonnes after storage go in
    unallocated_t.
- Release stored tonnes only when the receiving week's option capacity is idle.
    Use the actual spare_capacity_t and option capacities; do not assume a fixed
    amount can be stored or released in a particular week.
- Never store produce that will spoil before it can be released.

For EVERY week listed in "decide_weeks", return one choice, including weeks
with no surplus. Never exceed an option's capacity_t_per_week. Use option names
exactly as given. Keep each "reasoning" under 20 words.

Weekly balance equation:
    allocations_sum + store_t + unallocated_t = surplus_t + release_t.

Before the JSON, provide a concise  block listing each proposed
storage transfer by store week, release week, and tonnes. Keep it to the plan;
do not include private step-by-step reasoning. Then provide ONLY one compact
JSON object (no comments or trailing commas) in this format:
{CHOICE_FORMAT}"""


def compute_facts(situation: dict, reference: dict) -> dict:
    """The verified figures the model decides from (all calculated by code)."""
    scored = score_options(pd.DataFrame(situation["options"]))
    options = [{
        "name": r.name, "type": r.type, "price_kes_kg": float(r.price_kes_kg),
        "distance_km": float(r.distance_km), "lead_days": int(r.lead_days),
        "co2e_per_t": float(r.co2e_per_t),
        "capacity_t_per_week": float(r.capacity_t_per_week),
        "scores": {"value": round(float(r.value), 2),
                   "distance": round(float(r.distance), 2),
                   "urgency": round(float(r.urgency), 2),
                   "impact": round(float(r.impact), 2),
                   "overall": round(float(r.score), 2)},
    } for r in scored.itertuples()]
    total_cap = sum(o["capacity_t_per_week"] for o in options)
    decide = []
    for w in reference["weeks"]:
        used = sum(a["tonnes"] for a in w.get("allocations", []))
        decide.append({
            "week": w["week"],
            "supply_t": round(w["supply_t"], 1),
            "demand_t": w["demand_t"],
            "surplus_t": round(w["surplus_t"], 1),
            "risk": round(w["risk"], 2),
            "alert": w["alert"],
            "spare_capacity_t": round(total_cap - used, 1),
        })
    return {"crop": situation["crop"], "alert_threshold":
            situation["assumptions"]["alert_threshold"],
            "decide_weeks": decide, "options": options,
            "total_option_capacity_t": total_cap,
            "storage": situation["storage"],
            "weather": situation.get("weather", {})} # <-- NEW


def build_messages(facts: dict) -> list:
    """First message pair: the rules, then the verified figures."""
    total_capacity = facts["total_option_capacity_t"]
    storage_capacity = facts["storage"]["capacity_t"]
    below_capacity = next(
        (w for w in facts["decide_weeks"]
         if 0 < w["surplus_t"] <= total_capacity), None)
    above_capacity = next(
        (w for w in facts["decide_weeks"] if w["surplus_t"] > total_capacity), None)
    examples = []
    if below_capacity:
        examples.append(
            f"Week {below_capacity['week']} has {below_capacity['surplus_t']:.1f} t "
            f"available, below total option capacity {total_capacity:.1f} t: "
            f"allocate exactly {below_capacity['surplus_t']:.1f} t in total, "
            "store 0 t, and leave 0 t unallocated.")
    if above_capacity:
        overflow = above_capacity["surplus_t"] - total_capacity
        store = min(overflow, storage_capacity)
        examples.append(
            f"Week {above_capacity['week']} has {above_capacity['surplus_t']:.1f} t "
            f"available above total option capacity {total_capacity:.1f} t: "
            f"allocate {total_capacity:.1f} t in total, store at most "
            f"{store:.1f} t, and leave any excess after storage unallocated.")
    user_content = "Facts:\n" + json.dumps(facts)
    if examples:
        user_content += "\n\nAllocation arithmetic examples (follow these rules):\n- " + "\n- ".join(examples)
    return [{"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content}]