"""
Brain: The Orchestrator.
Calculates the figures via code, asks the NVIDIA model for decisions,
and enforces rules using the assembly layer.

Run: python brain.py
"""
import json
import os
import contextlib
import io

from pipeline.brain_schema import (build_situation, reference_decision,
                                   validate_decision, add_impact)
from explanations.explainer import explain_alert

# --- NEW MODULAR IMPORTS ---
from pipeline.llm_client import call_nvidia, parse_json, model_enabled, LAST
from pipeline.prompt_builder import compute_facts, build_messages
from pipeline.assembly import check_choices, assemble, compare_to_reference
# ---------------------------

MAX_TRIES = 3

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
    
    # --- Self-checks block starts here ---
    situation = build_situation()
    reference = reference_decision(situation)
    facts = compute_facts(situation, reference)
    json.dumps(facts)                               
    assert [w["week"] for w in facts["decide_weeks"]] == list(range(12))
    surplus = {w["week"]: w["surplus_t"] for w in reference["weeks"]}

    good_choices = {"weeks": [
        {"week": w["week"], "allocations": w["allocations"],
         "unallocated_t": w["unallocated_t"], "reasoning": "test"}
        for w in reference["weeks"]], "warnings": []}
    good = json.dumps(good_choices)

    r = think(situation, llm_fn=lambda _m: "```json\n" + good + "\n```")
    assert r["source"] == "model" and r["tries"] == 1 and r["notes"] == []

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
    bad_week["allocations"][0]["tonnes"] = 9999             
    r = think(situation, llm_fn=lambda _m: json.dumps(bad))
    assert r["source"] == "model" and r["tries"] == 1
    assert any("quantities adjusted" in warning
               for warning in r["decision"]["warnings"])
    assert validate_decision(situation, r["decision"]) == []

    partial = json.loads(good)
    partial["weeks"].pop()                     
    r = think(situation, llm_fn=lambda _m: json.dumps(partial), max_tries=1)
    assert r["source"] == "reference" and "missing" in r["log"][0]

    lazy = json.loads(good)                    
    for w in lazy["weeks"]:
        w["allocations"], w["unallocated_t"] = [], surplus[w["week"]]
    r = think(situation, llm_fn=lambda _m: json.dumps(lazy), max_tries=1)
    assert r["source"] == "model"
    assert validate_decision(situation, r["decision"]) == []

    r = think(situation, llm_fn=lambda _m: "Sorry, I cannot help with that.")
    assert r["source"] == "reference" and r["tries"] == 3

    r = think(situation, llm_fn=lambda _m: "", max_tries=1)
    assert "0 chars" in r["log"][0]

    def offline(_):
        raise RuntimeError("no internet")
    r = think(situation, llm_fn=offline)
    assert r["source"] == "reference" and r["tries"] == 1
    assert validate_decision(situation, r["decision"]) == []

    saved_switch = os.environ.get("NVIDIA_ENABLED")      
    os.environ["NVIDIA_ENABLED"] = "1"
    with contextlib.redirect_stdout(io.StringIO()):
        out = main(llm_fn=lambda _m: good, explain=False)
    assert out["source"] == "model"
    os.environ["NVIDIA_ENABLED"] = "0"
    with contextlib.redirect_stdout(io.StringIO()):
        off = main(explain=False)
    assert off["source"] == "reference" and off["tries"] == 0
    if saved_switch is None:
        os.environ.pop("NVIDIA_ENABLED")
    else:
        os.environ["NVIDIA_ENABLED"] = saved_switch
    print("\nAll checks passed.")