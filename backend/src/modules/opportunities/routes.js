import { Router } from "express";

const router = Router();
const AI_BASE = process.env.AI_BASE_URL || "http://localhost:8010/api/v1";

router.get("/", async (req, res) => {
  try {
    const response = await fetch(`${AI_BASE}/opportunities`, {
      signal: AbortSignal.timeout(30_000),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(502).json({ error: "AI service error", detail: body });
    }
    res.json(body);
  } catch (error) {
    res.status(503).json({ error: "AI service unavailable", detail: error.message });
  }
});

export default router;