import { Router } from "express";

const router = Router();
const AI_BASE = process.env.AI_BASE_URL || "http://localhost:8010/api/v1";

router.post("/", async (req, res) => {
  const message = req.body?.message;
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const r = await fetch(`${AI_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(75_000),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: "AI service error", detail: body });
    res.json(body);
  } catch (err) {
    res.status(503).json({ error: "AI service unavailable", detail: err.message });
  }
});

export default router;