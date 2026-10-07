import json
import os
import re
import time
from pathlib import Path

from dotenv import load_dotenv


def load_project_env() -> None:
    """Load the repo's .env files from all valid project locations."""
    candidates = [
        Path(__file__).resolve().parent / ".env",
        Path(__file__).resolve().parents[1] / ".env",
        Path(__file__).resolve().parents[1] / "pipeline" / ".env",
    ]
    for candidate in candidates:
        if candidate.exists():
            load_dotenv(candidate, override=False)


load_project_env()

# Base configuration
NVIDIA_BASE_URL = os.environ.get("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1")
DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b"
LAST = {"finish": None, "chars": 0, "repaired": False}


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
    """Pull the JSON object out of the model's reply. Ignores fenced blocks.
    If it has a small syntax slip (missing comma...), try the optional
    json-repair package; the checker still validates the result."""
    if not isinstance(text, str):
        raise ValueError("reply is not text")

    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.I)
        cleaned = re.sub(r"\s*```\s*$", "", cleaned)

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start < 0 or end < start:
        raise ValueError("no JSON object found in the reply")

    candidate = cleaned[start:end + 1]
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


def model_enabled() -> bool:
    """The model decides by default. Set NVIDIA_ENABLED=0 to run without it."""
    return os.environ.get("NVIDIA_ENABLED", "1").lower() not in {"0", "false", "no"}