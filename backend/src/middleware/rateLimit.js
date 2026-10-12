import { HttpError } from "../utils/errors.js";

// Per-user sliding window. Use after requireAuth so req.user exists.
export function rateLimit({ windowMs = 60_000, max = 30 } = {}) {
  const hits = new Map();

  return (req, _res, next) => {
    const key = req.user?.id ?? req.ip;
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);

    if (hits.size > 5000) {
      for (const [k, v] of hits) {
        if (!v.some((t) => now - t < windowMs)) hits.delete(k);
      }
    }

    if (recent.length > max) {
      throw new HttpError(429, "Too many requests. Try again in a minute.");
    }
    next();
  };
}