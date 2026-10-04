"""
Compare NVIDIA models on the same job, scored by our checker.
Run:  python compare_models.py                  (default shortlist)
      python compare_models.py model-a model-b  (your own list)

For each model it runs brain.think() once (up to 2 attempts) and reports:
  source : 'model' = its answer passed every check, 'reference' = it failed
  tries  : attempts needed (1 is best)
  secs   : total time
  notes  : places it disagreed with the plain math (fewer = closer to the math,
           but a note is not automatically a mistake: read them)
  saved_t / revenue / co2e : the outcome of ITS allocations (computed by code)

This uses your NVIDIA credits (a handful of calls per model).
Models that are busy or retired simply show as 'reference' with the reason.
"""
import os
import sys
import time

# Keep each model's turn short so one slow model cannot stall the whole run.
os.environ.setdefault("NVIDIA_RETRIES", "1")
os.environ.setdefault("NVIDIA_TIMEOUT", "240")

import brain
from brain_schema import build_situation

SHORTLIST = [
    "nvidia/nemotron-3-super-120b-a12b",
    "nvidia/nemotron-3.5-lightning-30b-a3b",
    "deepseek-ai/deepseek-v4.1-flash",
    "z-ai/glm-5.3-flash",
    "openai/gpt-oss-20b",
]


def run_candidates(models: list, situation: dict, llm_fn=None) -> list:
    """Run each model once; return one result row (dict) per model."""
    llm_fn = llm_fn or brain.call_nvidia
    rows = []
    for model in models:
        os.environ["NVIDIA_MODEL"] = model          # call_nvidia reads this
        os.environ["NVIDIA_FALLBACK_MODELS"] = ""   # test THIS model alone
        print(f"\n>>> {model}", flush=True)
        start = time.time()
        r = brain.think(situation, llm_fn=llm_fn, max_tries=2)
        s = r["decision"]["summary"]
        rows.append({
            "model": model, "source": r["source"], "tries": r["tries"],
            "secs": time.time() - start, "notes": len(r["notes"]),
            "saved_t": s["tonnes_saved"], "revenue": s["revenue_kes"],
            "co2e": s["co2e_avoided_t"], "log": r["log"], "note_list": r["notes"],
        })
    return rows


def print_table(rows: list, reference: dict) -> None:
    r = reference["summary"]
    head = (f"{'model':42s} {'source':9s} {'tries':>5s} {'secs':>6s} "
            f"{'notes':>5s} {'saved_t':>8s} {'revenue_M':>9s} {'co2e_t':>7s}")
    print("\n" + head + "\n" + "-" * len(head))
    print(f"{'(plain math reference)':42s} {'-':9s} {'-':>5s} {'-':>6s} {'-':>5s} "
          f"{r['tonnes_saved']:8.0f} {r['revenue_kes'] / 1e6:9.1f} "
          f"{r['co2e_avoided_t']:7.0f}")
    for x in rows:
        print(f"{x['model']:42s} {x['source']:9s} {x['tries']:5d} "
              f"{x['secs']:6.0f} {x['notes']:5d} {x['saved_t']:8.0f} "
              f"{x['revenue'] / 1e6:9.1f} {x['co2e']:7.0f}")
    print("\nWhy a model fell back to the reference (if it did):")
    for x in rows:
        if x["source"] == "reference":
            print(f"  {x['model']}:")
            for line in x["log"][:-1]:          # last line is just 'using reference'
                print("    -", line[:230])
    print("\nFirst few disagreements with the math, per accepted model:")
    for x in rows:
        if x["source"] == "model" and x["note_list"]:
            print(f"  {x['model']}:")
            for n in x["note_list"][:3]:
                print("    -", n)


if __name__ == "__main__":
    models = sys.argv[1:] or SHORTLIST
    situation = build_situation()
    reference = brain.add_impact(situation, brain.reference_decision(situation))
    print(f"Comparing {len(models)} model(s). This can take several minutes.")
    print_table(run_candidates(models, situation), reference)