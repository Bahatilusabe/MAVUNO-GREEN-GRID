"""
Brain: code calculates the figures, the NVIDIA model makes the decisions.
Needs: numpy, pandas, and for the live call:  pip install openai python-dotenv
Optional (repairs small JSON slips in the model's reply):  pip install json-repair
Keep in the same folder as brain_schema.py and the other pipeline files.
Run:  python brain.py

Division of labour (keeps the model fast and reliable):
    CODE  : forecast, risk, alerts, option scores, money, CO2e  (exact, instant)
    MODEL : for each surplus week, how many tonnes go to each option, and why
    CHECK : capacity, tonnes add up, nothing left unplaced while room remains
    If the model fails (or NVIDIA_ENABLED=0) the score-ranked baseline is used
    and the output says so.
    After the decision, the model also explains the highest-risk alert.

The database folder currently has schemas and a placeholder seeder, not records
that this pipeline can load. Forecast inputs are still synthetic.

Setup: put the key in a file named .env (in the repo root or this folder):
    NVIDIA_API_KEY=nvapi-...
    NVIDIA_MODEL=<a model id>                    (optional)
    NVIDIA_FALLBACK_MODELS=<id>,<id>             (optional backups)
    NVIDIA_ENABLED=0                             (optional: run without the model)
and add  .env  to .gitignore so it is never committed.
"""
import copy
import json
import os
import re
import time

try:                                  # read NVIDIA_API_KEY from the .env file
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:                   # fine if the key is set another way
    pass

import pandas as pd

# --- NEW UPDATED IMPORTS ---
from pipeline.brain_schema import (build_situation, reference_decision,
                                   validate_decision, add_impact)
from matching.matcher import score_options
# ---------------------------

# Optional: set LLM_BASE_URL in .env to use a different OpenAI-compatible
# provider or a paid/dedicated endpoint (the key still goes in NVIDIA_API_KEY).
NVIDIA_BASE_URL = os.environ.get("LLM_BASE_URL",
                                 "https://integrate.api.nvidia.com/v1")
DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b"  # models get retired: check build.nvidia.com
MAX_TRIES = 3
# Facts about the most recent model reply, used to explain failures in the log.
LAST = {"finish": None, "chars": 0, "repaired": False}

# The shape of the model's reply: ONLY its decisions, nothing we can calculate.
CHOICE_FORMAT = """{
  "weeks": [
    {"week": 3,
     "allocations": [{"option": "<option name>", "tonnes": 0.0}],
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

Before the JSON, provide a concise <allocation_plan> block listing each proposed
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
            "storage": situation["storage"]}


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


def _ask(client, model: str, messages: list) -> str:
    """Ask ONE model: retry while it is busy, stream the reply, return text."""
    retries = int(os.environ.get("NVIDIA_RETRIES", "3"))
    for attempt in range(retries + 1):
        try:
            # stream=True: text arrives piece by piece, so a long answer
            # cannot time out while being written, and we can show progress.
            stream = client.chat.completions.create(
                model=model, messages=messages, temperature=0.2, stream=True,
                max_tokens=int(os.environ.get("NVIDIA_MAX_TOKENS", "8000")),
                extra_body={"chat_template_kwargs": {"enable_thinking": False}})
            break
        except Exception as e:
            busy = any(w in str(e).lower() for w in
                       ("overload", "temporar", "429", "503", "rate limit"))
            if not busy or attempt == retries:
                raise                           # a real error, or out of retries
            wait = 10 * 3 ** attempt            # 10 s, 30 s, 90 s
            print(f"Service busy, retrying in {wait} s...", flush=True)
            time.sleep(wait)
    start = time.time()
    limit = float(os.environ.get("NVIDIA_MAX_SECONDS", "300"))
    parts, pieces = [], 0
    for chunk in stream:
        if time.time() - start > limit:
            raise TimeoutError(f"no complete answer within {limit:.0f} s")
        if chunk.choices and chunk.choices[0].delta.content:
            parts.append(chunk.choices[0].delta.content)
        if chunk.choices and getattr(chunk.choices[0], "finish_reason", None):
            LAST["finish"] = chunk.choices[0].finish_reason   # 'stop' or 'length'
        pieces += 1
        if pieces % 50 == 0:
            print(".", end="", flush=True)     # progress: model is working
    print(" done", flush=True)
    text = "".join(parts).strip()
    LAST["chars"] = len(text)
    return text


def call_nvidia(messages: list) -> str:
    """Try NVIDIA_MODEL, then each model in NVIDIA_FALLBACK_MODELS (comma
    separated, optional). Raises the last error if every model fails."""
    key = os.environ.get("NVIDIA_API_KEY")
    if not key:
        raise RuntimeError("NVIDIA_API_KEY is not set")
    from openai import OpenAI            # NVIDIA's API is OpenAI-compatible
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=key,
                    timeout=float(os.environ.get("NVIDIA_TIMEOUT", "300")))
    models = [os.environ.get("NVIDIA_MODEL", DEFAULT_MODEL)] + [
        m.strip() for m in os.environ.get("NVIDIA_FALLBACK_MODELS", "").split(",")
        if m.strip()]
    last_error = None
    for i, model in enumerate(models):
        try:
            return _ask(client, model, messages)
        except Exception as e:
            last_error = e
            more = "trying the next model..." if i < len(models) - 1 else ""
            print(f"Model {model} failed ({type(e).__name__}). {more}", flush=True)
    raise last_error


def parse_json(text: str) -> dict:
    """Pull the JSON object out of the model's reply. Ignores <think> blocks
    and ``` fences. If it has a small syntax slip (missing comma...), try the
    optional json-repair package; the checker still validates the result."""
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.S)
    text = re.sub(r"```(?:json)?", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start < 0:
        raise ValueError("no JSON object found in the reply")
    candidate = text[start:end + 1] if end > start else text[start:]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError as first_error:
        try:
            import json_repair                  # pip install json-repair
        except ImportError:
            raise first_error
        fixed = json_repair.repair_json(candidate, return_objects=True)
        if isinstance(fixed, dict) and fixed:
            LAST["repaired"] = True
            return fixed
        raise first_error


def check_choices(facts: dict, out: dict) -> list:
    """Structure check of the model's reply (before we build a full decision)."""
    if not isinstance(out, dict) or not isinstance(out.get("weeks"), list):
        return ["the reply needs a 'weeks' list"]
    problems, got = [], []
    for c in out["weeks"]:
        if not isinstance(c, dict) or not isinstance(c.get("allocations"), list):
            problems.append("each week needs 'week' and an 'allocations' list")
            continue
        wk = c.get("week")
        got.append(wk)
        u = c.get("unallocated_t")
        if not isinstance(u, (int, float)) or isinstance(u, bool):
            problems.append(f"week {wk}: unallocated_t must be a number")
        if not isinstance(c.get("reasoning"), str) or not c["reasoning"].strip():
            problems.append(f"week {wk}: reasoning is empty")
        for a in c["allocations"]:
            if (not isinstance(a, dict) or "option" not in a
                    or not isinstance(a.get("tonnes"), (int, float))
                    or isinstance(a.get("tonnes"), bool)):
                problems.append(f"week {wk}: each allocation needs 'option' and "
                                f"a numeric 'tonnes'")
                break
    expected = {w["week"] for w in facts["decide_weeks"]}
    for wk in sorted(expected - set(got)):
        problems.append(f"week {wk}: missing - decide every week in decide_weeks")
    for wk in sorted(set(got) - expected, key=str):
        problems.append(f"week {wk}: not in decide_weeks, remove it")
    if len(got) != len(set(got)):
        problems.append("a week appears more than once")
    return problems


def _allocate_by_preference(amount: float, available: dict, candidates: list,
                            score_order: list) -> dict:
    """Fit a requested quantity to route capacities, preserving model order."""
    preferred = {}
    for candidate in candidates:
        name = candidate["option"]
        tonnes = candidate["tonnes"]
        if name in available and isinstance(tonnes, (int, float)):
            preferred[name] = preferred.get(name, 0.0) + max(float(tonnes), 0.0)
    order = list(dict.fromkeys(
        [candidate["option"] for candidate in candidates
         if candidate["option"] in available] + score_order))
    allocated = {name: 0.0 for name in available}
    remaining = max(float(amount), 0.0)
    for name in order:
        take = min(preferred.get(name, 0.0), available[name], remaining)
        allocated[name] += take
        available[name] -= take
        remaining -= take
    for name in score_order:
        take = min(available[name], remaining)
        allocated[name] += take
        available[name] -= take
        remaining -= take
        if remaining <= 1e-9:
            break
    return allocated


def assemble(situation: dict, reference: dict, out: dict) -> dict:
    """Apply model route preferences while code enforces quantities and storage."""
    chosen = {c["week"]: c for c in out["weeks"]}
    capacities = {o["name"]: float(o["capacity_t_per_week"])
                  for o in situation["options"]}
    score_order = score_options(pd.DataFrame(situation["options"]))["name"].tolist()
    storage = situation.get("storage")
    storage_capacity = float(storage["capacity_t"]) if storage else 0.0
    max_hold = int(storage["max_hold_weeks"]) if storage else 0
    total_capacity = sum(capacities.values())
    batches = []
    release_reservations = {}
    weeks = []
    warnings = [str(x) for x in out.get("warnings", [])
                if isinstance(out.get("warnings"), list)]
    for index, w in enumerate(reference["weeks"]):
        new = copy.deepcopy(w)
        c = chosen[w["week"]]
        candidates = c["allocations"]
        available = dict(capacities)

        fresh_target = min(float(w["surplus_t"]), sum(available.values()))
        fresh_alloc = _allocate_by_preference(
            fresh_target, available, candidates, score_order)

        requested_release = max(float(c.get("release_t", 0.0)), 0.0)
        stored = sum(batch[1] for batch in batches)
        release_target = min(requested_release, stored, sum(available.values()))
        release_alloc = _allocate_by_preference(
            release_target, available, candidates, score_order)
        release = sum(release_alloc.values())
        left_to_release = release
        for batch in batches:
            take = min(batch[1], left_to_release)
            batch[1] -= take
            left_to_release -= take
        batches = [batch for batch in batches if batch[1] > 1e-9]

        fresh_overflow = max(float(w["surplus_t"]) - fresh_target, 0.0)
        remaining_storage = max(
            storage_capacity - sum(batch[1] for batch in batches), 0.0)
        future_slots = []
        future_release = 0.0
        for future in reference["weeks"][index + 1:]:
            if future["week"] - w["week"] > max_hold:
                continue
            future_capacity = max(
                total_capacity - min(float(future["surplus_t"]), total_capacity),
                0.0)
            requested = max(float(chosen[future["week"]].get("release_t", 0.0)), 0.0)
            reservable = max(
                min(requested, future_capacity)
                - release_reservations.get(future["week"], 0.0),
                0.0)
            future_slots.append((future["week"], reservable))
            future_release += reservable
        store = min(max(float(c.get("store_t", 0.0)), 0.0),
                    fresh_overflow, remaining_storage, future_release)
        to_reserve = store
        for future_week, reservable in future_slots:
            reserved = min(reservable, to_reserve)
            release_reservations[future_week] = (
                release_reservations.get(future_week, 0.0) + reserved)
            to_reserve -= reserved
            if to_reserve <= 1e-9:
                break
        if store > 0:
            batches.append([w["week"], store])

        allocations = {name: fresh_alloc[name] + release_alloc[name]
                       for name in capacities}
        new["allocations"] = [{"option": name, "tonnes": tonnes}
                              for name, tonnes in allocations.items()
                              if tonnes > 1e-9]
        new["unallocated_t"] = max(fresh_overflow - store, 0.0)
        new["store_t"] = store
        new["release_t"] = release
        new["reasoning"] = c["reasoning"]
        proposed_total = (sum(max(float(a["tonnes"]), 0.0) for a in candidates
                              if isinstance(a.get("tonnes"), (int, float)))
                          + max(float(c.get("store_t", 0.0)), 0.0)
                          + max(float(c.get("unallocated_t", 0.0)), 0.0))
        final_total = (sum(allocations.values()) + store + new["unallocated_t"])
        proposed_allocations = {}
        for allocation in candidates:
            name, tonnes = allocation.get("option"), allocation.get("tonnes")
            if name in capacities and isinstance(tonnes, (int, float)):
                proposed_allocations[name] = (
                    proposed_allocations.get(name, 0.0) + max(float(tonnes), 0.0))
        routes_adjusted = any(
            abs(proposed_allocations.get(name, 0.0) - tonnes) > 0.5
            for name, tonnes in allocations.items())
        if (routes_adjusted or abs(proposed_total - final_total) > 0.5
                or abs(max(float(c.get("store_t", 0.0)), 0.0) - store) > 0.5
                or abs(max(float(c.get("unallocated_t", 0.0)), 0.0)
                       - new["unallocated_t"]) > 0.5
                or abs(max(float(c.get("release_t", 0.0)), 0.0) - release) > 0.5):
            warnings.append(
                f"week {w['week']}: model quantities adjusted to respect supply, "
                "route capacities, and storage limits")
        weeks.append(new)
    return {"weeks": weeks,
            "warnings": warnings}


def compare_to_reference(decision: dict, reference: dict) -> list:
    """Non-blocking notes where the model moved tonnes away from the baseline."""
    notes = []
    ref = {w["week"]: w for w in reference["weeks"]}
    for w in decision["weeks"]:
        mine = {a["option"]: a["tonnes"] for a in w["allocations"]}
        base = {a["option"]: a["tonnes"] for a in ref[w["week"]]["allocations"]}
        diffs = {o: mine.get(o, 0) - base.get(o, 0) for o in set(mine) | set(base)}
        moved = sum(abs(d) for d in diffs.values()) / 2
        if moved > 1:
            o = max(diffs, key=lambda k: abs(diffs[k]))
            notes.append(f"week {w['week']}: moves {moved:.0f} t away from the "
                         f"score-ranked baseline (biggest change: {o} {diffs[o]:+.0f} t)")
    return notes


def think(situation: dict, llm_fn=call_nvidia, max_tries: int = MAX_TRIES) -> dict:
    """Ask the model, check the answer, retry with the problems if needed.
    Returns {'decision','source','tries','problems','notes','log'}.
    source is 'model' or 'reference' (score-ranked baseline fallback)."""
    reference = reference_decision(situation)
    facts = compute_facts(situation, reference)
    messages = build_messages(facts)
    log, problems = [], []

    for attempt in range(1, max_tries + 1):
        LAST.update(finish=None, chars=0, repaired=False)
        try:
            raw = llm_fn(messages)
        except Exception as e:                  # no key, no internet, API error
            log.append(f"attempt {attempt}: model call failed "
                       f"({type(e).__name__}: {e})")
            break                               # retrying will not help
        try:
            out = parse_json(raw)
            problems = check_choices(facts, out)
            if not problems:
                decision = assemble(situation, reference, out)
                problems = validate_decision(situation, decision)
        except Exception as e:                  # bad JSON or wrong structure
            problems = [f"reply was not a valid decision: {e} (ended: "
                        f"{LAST['finish']}, {LAST['chars']} chars, "
                        f"starts: {raw[:60]!r})"]
        if not problems:
            log.append(f"attempt {attempt}: accepted"
                       + (" (small JSON slip repaired)" if LAST["repaired"] else ""))
            return {"decision": add_impact(situation, decision),
                    "source": "model", "tries": attempt, "problems": [],
                    "notes": compare_to_reference(decision, reference),
                    "log": log}
        log.append(f"attempt {attempt}: {len(problems)} problem(s): {problems[0][:200]}")
        messages = messages + [
            {"role": "assistant", "content": raw},
            {"role": "user", "content": "Your answer failed these checks:\n- "
             + "\n- ".join(problems[:10])
             + "\nFix them and answer again with ONLY the JSON object."}]

    log.append("using the score-ranked baseline instead")
    return {"decision": add_impact(situation, reference),
            "source": "reference", "tries": len(log) - 1, "problems": problems,
            "notes": [], "log": log}


def model_enabled() -> bool:
    """The model decides by default. Set NVIDIA_ENABLED=0 to run without it."""
    return os.environ.get("NVIDIA_ENABLED", "1").lower() not in {"0", "false", "no"}


def explain_top_alert(situation: dict, decision: dict) -> None:
    """Print a plain-language explanation of the highest-risk alert week."""
    alerts = [w for w in decision["weeks"] if w["alert"]]
    if not alerts:
        print("No alert needs an explanation.")
        return
    alert = max(alerts, key=lambda w: w["risk"])
    options = {o["name"]: o for o in situation["options"]}
    saved = revenue = co2e = 0.0
    for a in alert["allocations"]:
        o = options[a["option"]]
        saved += a["tonnes"]
        revenue += a["tonnes"] * 1000 * o["price_kes_kg"]
        co2e += a["tonnes"] * o["co2e_per_t"]
    row = {
        "week": alert["week"],
        "surplus_t": alert["surplus_t"],
        "surplus_ratio": (alert["surplus_t"] / alert["supply_t"]
                          if alert["supply_t"] else 0.0),
        "risk": alert["risk"],
        "tonnes_saved": saved,
        "tonnes_wasted": alert["unallocated_t"],
        "revenue_kes": revenue,
        "co2e_avoided_t": co2e / 1000,
    }
    from explanations.explainer import explain_alert
    explanation = explain_alert(row)
    print(f"\nAlert explanation ({explanation['source']}):")
    print(explanation["text"])
    if explanation["note"]:
        print(f"Explanation fallback reason: {explanation['note'][:180]}")


def main(llm_fn=call_nvidia, explain: bool = True) -> dict:
    """Run the whole brain once and print the result."""
    situation = build_situation()
    if model_enabled():
        print("Asking the model... (it decides from verified figures)")
        result = think(situation, llm_fn=llm_fn)
    else:
        result = {"decision": add_impact(situation, reference_decision(situation)),
                  "source": "reference", "tries": 0, "problems": [], "notes": [],
                  "log": ["model switched off (NVIDIA_ENABLED=0): baseline answer"]}
    decision = result["decision"]
    s = decision["summary"]
    print(f"Source: {result['source']}")
    print("Log:", *result["log"], sep="\n  ")
    if result["source"] == "reference" and model_enabled():
        print("NOTE: the model's answer was not usable, so these figures are the "
              "score-ranked baseline.")
    print(f"Saved {s['tonnes_saved']:,.0f} t, wasted {s['tonnes_wasted']:,.0f} t, "
          f"KES {s['revenue_kes']:,.0f}, CO2e {s['co2e_avoided_t']:,.0f} t")
    if result["source"] == "model":
        base = add_impact(situation, reference_decision(situation))["summary"]
        print(f"vs score-ranked baseline: saved "
              f"{s['tonnes_saved'] - base['tonnes_saved']:+,.0f} t, revenue "
              f"{s['revenue_kes'] - base['revenue_kes']:+,.0f} KES, CO2e "
              f"{s['co2e_avoided_t'] - base['co2e_avoided_t']:+,.0f} t")
    for n in result["notes"]:
        print("Note:", n)
    alerts = [w for w in decision["weeks"] if w["alert"]]
    if alerts:
        print("\nAlert weeks:")
        for w in alerts:
            print(f"  week {w['week']}: surplus {w['surplus_t']:.0f} t, "
                  f"risk {w['risk']:.2f} - {w['reasoning']}")
    for wmsg in decision.get("warnings", []):
        print("Warning from the model:", wmsg)
    if explain and model_enabled():
        explain_top_alert(situation, decision)
    return result


if __name__ == "__main__":
    main()
    situation = build_situation()

    # --- tiny self-checks, using FAKE models (no key or internet needed) ---
    reference = reference_decision(situation)
    facts = compute_facts(situation, reference)
    json.dumps(facts)                               # must be JSON-friendly
    assert [w["week"] for w in facts["decide_weeks"]] == list(range(12))
    surplus = {w["week"]: w["surplus_t"] for w in reference["weeks"]}

    good_choices = {"weeks": [
        {"week": w["week"], "allocations": w["allocations"],
         "unallocated_t": w["unallocated_t"], "reasoning": "test"}
        for w in reference["weeks"]], "warnings": []}
    good = json.dumps(good_choices)

    r = think(situation, llm_fn=lambda _m: "```json\n" + good + "\n```")
    assert r["source"] == "model" and r["tries"] == 1 and r["notes"] == []

    # a valid answer that differs from the baseline is accepted AND reported
    other = json.loads(good)
    wk3 = next(w for w in other["weeks"] if w["week"] == 3)
    for a in wk3["allocations"]:
        if a["option"] == "Nairobi wholesale":
            a["tonnes"] -= 10
    wk3["allocations"].append({"option": "Tomato paste factory", "tonnes": 10.0})
    r = think(situation, llm_fn=lambda _m: json.dumps(other))
    assert r["source"] == "model" and any("week 3" in n for n in r["notes"])

    bad = json.loads(good)
    bad_week = next(w for w in bad["weeks"] if w["week"] == 3)
    bad_week["allocations"][0]["tonnes"] = 9999             # breaks capacity
    r = think(situation, llm_fn=lambda _m: json.dumps(bad))
    assert r["source"] == "model" and r["tries"] == 1
    assert any("quantities adjusted" in warning
               for warning in r["decision"]["warnings"])
    assert validate_decision(situation, r["decision"]) == []

    partial = json.loads(good)
    partial["weeks"].pop()                     # forgot a week
    r = think(situation, llm_fn=lambda _m: json.dumps(partial), max_tries=1)
    assert r["source"] == "reference" and "missing" in r["log"][0]

    lazy = json.loads(good)                    # gives up on every week
    for w in lazy["weeks"]:
        w["allocations"], w["unallocated_t"] = [], surplus[w["week"]]
    r = think(situation, llm_fn=lambda _m: json.dumps(lazy), max_tries=1)
    assert r["source"] == "model"
    assert any("quantities adjusted" in warning
               for warning in r["decision"]["warnings"])
    assert validate_decision(situation, r["decision"]) == []

    r = think(situation, llm_fn=lambda _m: "Sorry, I cannot help with that.")
    assert r["source"] == "reference" and r["tries"] == 3, "fallback after 3"

    r = think(situation, llm_fn=lambda _m: "", max_tries=1)
    assert "0 chars" in r["log"][0], "empty reply must explain itself"

    def offline(_):
        raise RuntimeError("no internet")
    r = think(situation, llm_fn=offline)
    assert r["source"] == "reference" and r["tries"] == 1
    assert validate_decision(situation, r["decision"]) == [], "fallback is valid"

    # the whole flow, with a fake model; the switch must work either way
    import contextlib, io
    saved_switch = os.environ.get("NVIDIA_ENABLED")      # restore it afterwards
    os.environ["NVIDIA_ENABLED"] = "1"
    with contextlib.redirect_stdout(io.StringIO()):
        out = main(llm_fn=lambda _m: good, explain=False)
    assert out["source"] == "model", "main() should use the model's decision"
    os.environ["NVIDIA_ENABLED"] = "0"
    with contextlib.redirect_stdout(io.StringIO()):
        off = main(explain=False)
    assert off["source"] == "reference" and off["tries"] == 0
    if saved_switch is None:
        os.environ.pop("NVIDIA_ENABLED")
    else:
        os.environ["NVIDIA_ENABLED"] = saved_switch
    print("\nAll checks passed.")