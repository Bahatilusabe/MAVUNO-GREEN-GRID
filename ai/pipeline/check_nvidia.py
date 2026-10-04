"""
Quick connection test: sends one tiny question to your NVIDIA model.
Run:  python check_nvidia.py [model-name]
Example: python check_nvidia.py meta/llama-3.3-70b-instruct
Tells you if the key works, which model answered, and how long it took.
"""
import os
import sys
import time

from brain import call_nvidia, DEFAULT_MODEL

if len(sys.argv) > 1:                        # optional: try another model
    os.environ["NVIDIA_MODEL"] = sys.argv[1]
print("Model:", os.environ.get("NVIDIA_MODEL", DEFAULT_MODEL))
print("Key found:", bool(os.environ.get("NVIDIA_API_KEY")))
start = time.time()
try:
    reply = call_nvidia([{"role": "user", "content": "Reply with exactly: OK"}])
    print("Reply:", reply[:200])
except Exception as e:                      # show the real reason, not a wall
    print(f"FAILED: {type(e).__name__}: {str(e)[:300]}")
print(f"Took {time.time() - start:.1f} seconds")