"""
Lists the models NVIDIA says are available to your key right now.
Run:  python list_models.py            (all)
      python list_models.py nemotron   (only ids containing 'nemotron')
Then test one with:  python check_nvidia.py <model-id>
Note: a model can be listed but still be busy or restricted, so always test.
"""
import os
import sys

from brain import NVIDIA_BASE_URL            # also loads your .env file

key = os.environ.get("NVIDIA_API_KEY")
if not key:
    sys.exit("NVIDIA_API_KEY is not set (check your .env file)")
try:
    from openai import OpenAI
    client = OpenAI(base_url=NVIDIA_BASE_URL, api_key=key, timeout=60)
    ids = sorted(m.id for m in client.models.list())
except Exception as e:
    sys.exit(f"FAILED: {type(e).__name__}: {str(e)[:300]}")

word = sys.argv[1].lower() if len(sys.argv) > 1 else ""
shown = [i for i in ids if word in i.lower()]
print(f"{len(shown)} of {len(ids)} models" + (f" matching '{word}'" if word else ""))
for i in shown:
    print(" ", i)