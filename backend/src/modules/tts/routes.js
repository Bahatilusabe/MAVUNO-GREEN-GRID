import { Router } from "express";
import { HttpError } from "../../utils/errors.js";

const router = Router();
const AI_BASE = process.env.AI_BASE_URL || "http://localhost:8010/api/v1";

router.get("/", async (req, res) => {
  const text = String(req.query.text ?? "").trim().slice(0, 500);
  const lang = req.query.lang === "sw-KE" ? "sw-KE" : "en-US";
  if (!text) throw new HttpError(400, "text is required");

  let upstream;
  try {
    upstream = await fetch(`${AI_BASE}/tts?${new URLSearchParams({ text, lang })}`, {
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    throw new HttpError(503, `Speech service unavailable: ${err.message}`);
  }

  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !type.startsWith("audio/")) {
    throw new HttpError(502, "Speech service error");
  }

  res.set("Content-Type", type);
  res.set("Cache-Control", "private, max-age=3600");
  res.send(Buffer.from(await upstream.arrayBuffer()));
});

export default router;