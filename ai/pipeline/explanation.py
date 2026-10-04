"""
Step 6: plain-language explanation of a surplus alert.
Needs: pandas, numpy. For the NVIDIA call also: pip install openai
Run:  python explanation.py   (works with or without an API key)

Design (so the AI can never invent numbers):
  1. The math code produces the facts.            (build_facts)
  2. The NVIDIA model only rewrites those facts   (call_nvidia)
     as friendly text.
  3. A guard rejects any text containing a number (numbers_are_grounded)
     that is not one of the facts.
  4. If there is no key, no internet, or the guard fails, we use a
     fixed template instead.                      (template_text)

To use NVIDIA: get a free key at build.nvidia.com, then set
    NVIDIA_API_KEY=nvapi-...      (optional: NVIDIA_MODEL=...)
"""
import os
import re

from surplus_forecast import risk_breakdown
from run_pipeline import run_pipeline

NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"

DRIVER_TEXT = {
    "surplus": "a large share of the harvest has no buyer yet",
    "perishability": "tomatoes spoil quickly",
    "urgency": "the harvest is close, leaving little time to act",
}


def build_facts(row: dict) -> dict:
    """Turn one pipeline result row into a small dict of plain numbers."""
    parts = risk_breakdown(row["surplus_ratio"], int(row["week"]))
    return {
        "week": int(row["week"]),
        "surplus_t": round(row["surplus_t"]),
        "surplus_pct": round(row["surplus_ratio"] * 100),
        "risk": round(row["risk"], 2),
        "top_driver": max(parts, key=parts.get),
        "saved_t": round(row["tonnes_saved"]),
        "wasted_t": round(row["tonnes_wasted"]),
        "revenue_million_kes": round(row["revenue_kes"] / 1e6, 1),
        "co2e_t": round(row["co2e_avoided_t"]),
    }


def template_text(f: dict) -> str:
    """Fixed fallback wording. Always safe, never needs the internet."""
    if f["wasted_t"] == 0:
        tail = "Everything can be placed."
    else:
        tail = (f"About {f['wasted_t']} t may still go unsold, "
                "so extra buyers are worth lining up.")
    return (
        f"Week {f['week']}: about {f['surplus_t']} t of tomatoes "
        f"(roughly {f['surplus_pct']}% of that week's harvest) has no buyer, "
        f"giving a spoilage risk of {f['risk']} out of 1. "
        f"The main reason is that {DRIVER_TEXT[f['top_driver']]}. "
        f"Matched buyers, processors and storage can take {f['saved_t']} t, "
        f"earning about KES {f['revenue_million_kes']} million and avoiding "
        f"about {f['co2e_t']} t of CO2e. {tail}"
    )


def build_messages(f: dict) -> list:
    """The prompt we send to the model: facts in, friendly text out."""
    system = (
        "You advise a farmer cooperative manager using verified calculations. "
        "Treat every supplied fact as authoritative. Explain the main risk "
        "and recommend practical next actions that follow from the facts. "
        "Do not recalculate or change any values. Do not include digits or "
        "number words; the program displays verified figures separately. "
        "Do not add names, dates or unsupported predictions. Write a few "
        "plain sentences, no bullet points."
    )
    facts = {**f, "top_driver": DRIVER_TEXT[f["top_driver"]]}
    user = ("Interpret this tomato surplus alert and recommend next actions. "
            "Use all supplied calculations as evidence:\n"
            + "\n".join(f"- {key}: {value}" for key, value in facts.items()))
    return [{"role": "system", "content": system},
            {"role": "user", "content": user}]


def call_nvidia(messages: list) -> str:
    """Ask the NVIDIA-hosted model. Raises an error if anything is missing."""
    key = os.environ.get("NVIDIA_API_KEY")
    if not key:
        raise RuntimeError("NVIDIA_API_KEY is not set")
    from openai import OpenAI            # NVIDIA's API is OpenAI-compatible
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=key, timeout=60)
    resp = client.chat.completions.create(
        model=os.environ.get("NVIDIA_EXPLANATION_MODEL", DEFAULT_MODEL),
        messages=messages, temperature=0.2, max_tokens=600,
        extra_body={"chat_template_kwargs": {"enable_thinking": False}})
    content = resp.choices[0].message.content
    if not content or not content.strip():
        raise RuntimeError("model returned no explanation text")
    return content.strip()


def numbers_are_grounded(text: str, f: dict) -> bool:
    """True only if every number in the text is one of the facts (or 1)."""
    allowed = {float(v) for v in f.values()
               if isinstance(v, (int, float))} | {1.0}
    # numbers not glued to letters, so the '2' in 'CO2e' is ignored
    for token in re.findall(r"(?<![A-Za-z])\d[\d,]*(?:\.\d+)?", text):
        value = float(token.replace(",", ""))
        if not any(abs(value - a) < 1e-9 for a in allowed):
            return False
    return True


def explain_alert(row: dict, llm_fn=call_nvidia) -> dict:
    """Return {'text', 'source', 'note'}; source is 'nvidia' or 'template'."""
    f = build_facts(row)
    try:
        text = llm_fn(build_messages(f))
        if numbers_are_grounded(text, f):
            return {"text": text, "source": "nvidia", "note": ""}
        note = "model text contained a number not in the facts"
    except Exception as e:                # no key, no internet, API error...
        note = f"{type(e).__name__}: {e}"
    return {"text": template_text(f), "source": "template", "note": note}


if __name__ == "__main__":
    row = run_pipeline().query("week == 4").iloc[0].to_dict()
    out = explain_alert(row)
    print(f"[source: {out['source']}]  {out['note']}\n")
    print(out["text"])

    # --- tiny self-checks (use fake models, so no key or internet needed) ---
    f = build_facts(row)
    good = "Week 4 has 516 t with no buyer, risk 0.75, and 510 t can be saved."
    bad = "Week 4 has 999 t with no buyer."
    assert numbers_are_grounded(template_text(f), f), "template must be grounded"
    assert numbers_are_grounded(good, f)
    assert not numbers_are_grounded(bad, f)
    assert explain_alert(row, llm_fn=lambda m: good)["source"] == "nvidia"
    assert explain_alert(row, llm_fn=lambda m: bad)["source"] == "template"

    def broken(_):
        raise RuntimeError("no internet")
    assert explain_alert(row, llm_fn=broken)["source"] == "template"
    print("\nAll checks passed.")