"""
Brain step 2: deterministic calculations with an optional NVIDIA explanation.
Needs: numpy, pandas, and for the live call:  pip install openai
Keep in the same folder as brain_schema.py and the other pipeline files.
Run:  python brain.py        (fast deterministic reference)
Optional explanation: set NVIDIA_ENABLED=1 and NVIDIA_API_KEY before running.
The database folder currently has schemas and a placeholder seeder, not records
that this pipeline can load. Forecast inputs are still synthetic.

Flow:
    situation -> deterministic forecast/risk/allocation/impact
             -> optional model explanation of the highest-risk alert

Setup: put the key in a file named .env (in the repo root or this folder):
    NVIDIA_API_KEY=nvapi-...
    NVIDIA_MODEL=<a model id>                    (optional)
    NVIDIA_FALLBACK_MODELS=<id>,<id>             (optional backups)
and add  .env  to .gitignore so it is never committed.
Needs:  pip install python-dotenv openai
"""
import json
import os
import re
import time

try:                                  # read NVIDIA_API_KEY from the .env file
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:                   # fine if the key is set another way
    pass

from brain_schema import (build_situation, reference_decision,
                          validate_decision, add_impact, DECISION_FORMAT)

# Optional: set LLM_BASE_URL in .env to use a different OpenAI-compatible
# provider or a paid/dedicated endpoint (the key still goes in NVIDIA_API_KEY).
NVIDIA_BASE_URL = os.environ.get("LLM_BASE_URL",
                                 "https://integrate.api.nvidia.com/v1")
DEFAULT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"  # models get retired: see list_models.py
MAX_TRIES = 3

SYSTEM_PROMPT = f"""You are the decision engine of a food-surplus network.
You receive everything known about a crop's planting, expected demand and the
available ways to place surplus produce. Your job, for EVERY week:

1. Forecast supply: each cohort's total harvest (acres x yield_t_per_acre x
   (1 - harvest_loss)) arrives evenly over its harvest weeks.
2. Compare with demand: surplus = max(supply - demand, 0).
3. Score spoilage risk from 0 to 1 using the surplus share of supply, how
   perishable the crop is (shelf_life_days) and how soon the harvest is.
   Set alert=true when risk >= alert_threshold and there is a surplus.
4. Allocate the surplus across the options. Weigh value (price), distance,
   how fast the option can take it (lead_days) and environmental impact
   (co2e_per_t). Do NOT simply pick the highest price. Never exceed an
   option's capacity_t_per_week. Tonnes nobody can take go in unallocated_t.
5. Explain each week briefly in "reasoning", and list anything odd or missing
   in the input under "warnings".

Rules: use only the data given. Allocated tonnes + unallocated_t must equal
surplus_t. Use the option names exactly as given. Answer with ONLY one JSON
object in this format, no other text:
{DECISION_FORMAT}"""


def build_messages(situation: dict) -> list:
    """First message pair: the rules, then all the information."""
    return [{"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "Situation:\n" + json.dumps(situation)}]


def _ask(client, model: str, messages: list) -> str:
    """Ask ONE model: retry while it is busy, stream the reply, return text."""
    retries = int(os.environ.get("NVIDIA_RETRIES", "3"))
    for attempt in range(retries + 1):
        try:
            # stream=True: text arrives piece by piece, so a long answer
            # cannot time out while being written, and we can show progress.
            stream = client.chat.completions.create(
                model=model, messages=messages, temperature=0.2, stream=True,
                max_tokens=int(os.environ.get("NVIDIA_MAX_TOKENS", "8000")))
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
        pieces += 1
        if pieces % 50 == 0:
            print(".", end="", flush=True)     # progress: model is working
    print(" done", flush=True)
    return "".join(parts).strip()


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
    """Pull the JSON object out of the model's reply (ignores ``` fences)."""
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.S)  # reasoning models
    text = re.sub(r"```(?:json)?", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start < 0 or end <= start:
        raise ValueError("no JSON object found in the reply")
    return json.loads(text[start:end + 1])


def compare_to_reference(decision: dict, reference: dict) -> list:
    """Non-blocking notes where the model disagrees with the plain math."""
    notes = []
    ref = {w["week"]: w for w in reference["weeks"]}
    for w in decision["weeks"]:
        r = ref[w["week"]]
        if r["supply_t"] > 0:
            if abs(w["supply_t"] - r["supply_t"]) / r["supply_t"] > 0.05:
                notes.append(f"week {w['week']}: model supply {w['supply_t']:.0f} t "
                             f"vs math {r['supply_t']:.0f} t (over 5% apart)")
        elif w["supply_t"] > 0.5:
            notes.append(f"week {w['week']}: model sees supply, math sees none")
        if w["alert"] != r["alert"]:
            notes.append(f"week {w['week']}: alert is {w['alert']} (model risk "
                         f"{w['risk']}) but math says {r['alert']} (risk {r['risk']})")
    return notes


def think(situation: dict, llm_fn=call_nvidia, max_tries: int = MAX_TRIES) -> dict:
    """Ask the model, check the answer, retry with the problems if needed.
    Returns {'decision','source','tries','problems','notes','log'}.
    source is 'model' or 'reference' (plain-math fallback)."""
    reference = reference_decision(situation)
    messages = build_messages(situation)
    log, problems = [], []

    for attempt in range(1, max_tries + 1):
        try:
            raw = llm_fn(messages)
        except Exception as e:                  # no key, no internet, API error
            log.append(f"attempt {attempt}: model call failed "
                       f"({type(e).__name__}: {e})")
            break                               # retrying will not help
        try:
            decision = parse_json(raw)
            problems = validate_decision(situation, decision)
        except Exception as e:                  # bad JSON or wrong structure
            decision, problems = None, [f"reply was not a valid decision: {e}"]
        if not problems:
            log.append(f"attempt {attempt}: accepted")
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

    log.append("using the plain-math reference answer instead")
    return {"decision": add_impact(situation, reference),
            "source": "reference", "tries": len(log) - 1, "problems": problems,
            "notes": [], "log": log}


if __name__ == "__main__":
    situation = build_situation()
    decision = reference_decision(situation)
    result = {
        "decision": add_impact(situation, decision),
        "source": "reference",
        "tries": 0,
        "problems": [],
        "notes": [],
        "log": ["all figures calculated deterministically"],
    }
    use_model = os.environ.get("NVIDIA_ENABLED", "").lower() in {"1", "true", "yes"}
    print("Calculating forecast, risk, allocations, and impact locally.")
    s = result["decision"]["summary"]
    print(f"Source: {result['source']}")
    print("Log:", *result["log"], sep="\n  ")
    print(f"Saved {s['tonnes_saved']:,.0f} t, wasted {s['tonnes_wasted']:,.0f} t, "
          f"KES {s['revenue_kes']:,.0f}, CO2e {s['co2e_avoided_t']:,.0f} t")
    for n in result["notes"]:
        print("Note:", n)

    if use_model:
        alert = max(
            (week for week in decision["weeks"] if week["alert"]),
            key=lambda week: week["risk"],
            default=None,
        )
        if alert is None:
            print("No alert needs an explanation.")
        else:
            options = {option["name"]: option for option in situation["options"]}
            saved = revenue = co2e = 0.0
            for allocation in alert["allocations"]:
                option = options[allocation["option"]]
                tonnes = allocation["tonnes"]
                saved += tonnes
                revenue += tonnes * 1000 * option["price_kes_kg"]
                co2e += tonnes * option["co2e_per_t"]
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
            from explanation import explain_alert
            explanation = explain_alert(row)
            print(f"\nAlert explanation ({explanation['source']}):")
            print(explanation["text"])
            if explanation["note"]:
                print(f"Explanation fallback reason: {explanation['note'][:180]}")

    # --- tiny self-checks, using FAKE models (no key or internet needed) ---
    good = json.dumps(reference_decision(situation))
    bad = json.loads(good)
    bad["weeks"][4]["allocations"][0]["tonnes"] = 9999     # breaks capacity

    r = think(situation, llm_fn=lambda _messages: "```json\n" + good + "\n```")
    assert r["source"] == "model" and r["tries"] == 1, "valid answer accepted"

    calls = []
    def flaky(messages):                       # wrong first, right second
        calls.append(messages)
        return json.dumps(bad) if len(calls) == 1 else good
    r = think(situation, llm_fn=flaky)
    assert r["source"] == "model" and r["tries"] == 2, "should retry once"
    assert "over capacity" in calls[1][-1]["content"], "problems sent back"

    r = think(situation, llm_fn=lambda _messages: "Sorry, I cannot help with that.")
    assert r["source"] == "reference" and r["tries"] == 3, "fallback after 3"

    def offline(_):
        raise RuntimeError("no internet")
    r = think(situation, llm_fn=offline)
    assert r["source"] == "reference" and r["tries"] == 1
    assert validate_decision(situation, r["decision"]) == [], "fallback is valid"
    print("\nAll checks passed.")