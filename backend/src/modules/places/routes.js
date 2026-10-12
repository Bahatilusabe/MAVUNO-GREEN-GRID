import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { nearbyPlaces, PLACE_TYPES } from "./service.js";

const router = Router();
router.use(requireAuth);

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(1).max(50).default(10),
  type: z.enum(PLACE_TYPES),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// 30 searches per user per minute, so a runaway client or AI loop cannot hammer Overpass
const hits = new Map();
function limited(userId) {
  const now = Date.now();
  const recent = (hits.get(userId) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(userId, recent);
  return recent.length > 30;
}

router.get("/nearby", async (req, res) => {
  if (limited(req.user.id)) {
    throw new HttpError(429, "Too many place searches. Try again in a minute.");
  }
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new HttpError(
      400,
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
    );
  }
  res.json(await nearbyPlaces(parsed.data));
});

export default router;