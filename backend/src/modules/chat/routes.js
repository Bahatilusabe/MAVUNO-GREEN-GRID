import { Router } from "express";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";
import { nearbyPlaces } from "../places/service.js";

const router = Router();
const AI_BASE = process.env.AI_BASE_URL || "http://localhost:8010/api/v1";
const TIMEOUT_MS = Number(process.env.AI_CHAT_TIMEOUT_MS ?? 90_000);
const NEARBY_TIMEOUT_MS = 8_000;
const NEARBY_RADIUS_KM = 25;

const bodySchema = z.object({
  message: z.string().trim().min(1).max(2000),
  farmId: z.string().min(1).max(64).optional(),
});

// English and Swahili cues for "find something near my farm". First match wins.
const INTENTS = [
  ["cold_store", /\b(cold|storage|store|warehouse|hifadhi|ghala|baridi)\b/i],
  ["water", /\b(water|borehole|river|irrigat\w*|maji|mto|umwagiliaji)\b/i],
  ["market", /\b(market|markets|buyer|buyers|sell|selling|price|prices|soko|masoko|mnunuzi|kuuza|bei)\b/i],
];

const withTimeout = (promise, ms) => {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

async function farmContext(userId, farmId) {
  if (!userId) return null;

  const { rows } = await query(
    `SELECT f.id AS "id", f.name AS "name", f.area_ha AS "areaHa", f.lat AS "lat", f.lng AS "lng"
       FROM farms f
      WHERE f.owner_id = :1${farmId ? " AND f.id = :2" : ""}
      ORDER BY f.created_at
      FETCH FIRST 1 ROWS ONLY`,
    farmId ? [userId, farmId] : [userId]
  );
  const farm = rows[0];
  if (!farm) return null;

  const crops = await query(
    `SELECT DISTINCT name AS "name" FROM crops
      WHERE farm_id = :1 AND status IN ('planned', 'growing', 'ready_to_harvest')`,
    [farm.id]
  );
  return { ...farm, crops: crops.rows.map((c) => c.name) };
}

// Returns null when nothing was asked, or when the search could not run, so the AI is never
// told "there are none" because of a timeout.
async function nearbyFor(ctx, message) {
  if (ctx?.lat == null || ctx?.lng == null) return null;
  const hit = INTENTS.find(([, re]) => re.test(message));
  if (!hit) return null;
  const type = hit[0];

  try {
    const found = await withTimeout(
      nearbyPlaces({ lat: Number(ctx.lat), lng: Number(ctx.lng), radiusKm: NEARBY_RADIUS_KM, type, limit: 5 }),
      NEARBY_TIMEOUT_MS
    );
    if (!found || found.source === "unavailable") return null;
    return {
      type,
      items: found.results.map((r) => ({
        name: r.name ?? "Unnamed site",
        kind: r.kind === "partner" ? "registered MAVUNO partner" : "public map site",
        distance_km: r.distanceKm,
        price_kes_per_kg: r.pricePerKg ?? undefined,
      })),
    };
  } catch (err) {
    console.warn("Nearby lookup failed for chat:", err.message);
    return null;
  }
}

router.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "message is required (up to 2000 characters)");
  }
  const { message, farmId } = parsed.data;

  const payload = { message };
  const ctx = await farmContext(req.user?.id, farmId);
  if (ctx) {
    payload.farm_name = ctx.name;
    if (ctx.lat != null && ctx.lng != null) {
      payload.lat = Number(ctx.lat);
      payload.lng = Number(ctx.lng);
    }
    if (ctx.crops.length) payload.crop = ctx.crops.join(" and ");
    if (ctx.areaHa) payload.size_acres = Number((ctx.areaHa / 0.4047).toFixed(1));

    const nearby = await nearbyFor(ctx, message);
    if (nearby) {
      payload.nearby_type = nearby.type;
      payload.nearby = nearby.items;
    }
  }

  let aiRes;
  try {
    aiRes = await fetch(`${AI_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new HttpError(503, `AI service unavailable: ${err.message}`);
  }

  const body = await aiRes.json().catch(() => ({}));
  if (!aiRes.ok || body.status !== "success") {
    throw new HttpError(502, body.message || "AI service error");
  }
  res.json(body);
});

export default router;