import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";
import { nearbyPlaces } from "../places/service.js";

const router = Router();
const AI_BASE = process.env.AI_BASE_URL || "http://localhost:8010/api/v1";
const TIMEOUT_MS = Number(process.env.AI_CHAT_TIMEOUT_MS ?? 90_000);
const MEDIA_TIMEOUT_MS = Number(process.env.AI_MEDIA_TIMEOUT_MS ?? 180_000);
const NEARBY_TIMEOUT_MS = 18_000;
const NEARBY_RADIUS_KM = 25;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
});
const parseChatUpload = (req, res, next) => {
  upload.single("media")(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return next(new HttpError(status, "Chat upload is invalid or exceeds the 50 MB limit"));
    }
    next(error);
  });
};

const bodySchema = z.object({
  message: z.string().trim().min(1).max(2000),
  farmId: z.string().min(1).max(64).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
}).refine((data) => (data.lat === undefined) === (data.lng === undefined), {
  message: "lat and lng must be provided together",
  path: ["lat"],
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

// Returns null only when the message has no place-search intent. Search failures and missing
// coordinates are passed through explicitly so the AI can explain the actual limitation.
async function nearbyFor(ctx, message) {
  const hit = INTENTS.find(([, re]) => re.test(message));
  if (!hit) return null;
  const type = hit[0];
  if (ctx?.lat == null || ctx?.lng == null) {
    return { type, items: [], status: "missing_location" };
  }

  try {
    const found = await withTimeout(
      nearbyPlaces({ lat: Number(ctx.lat), lng: Number(ctx.lng), radiusKm: NEARBY_RADIUS_KM, type, limit: 5 }),
      NEARBY_TIMEOUT_MS
    );
    if (!found || found.source === "unavailable") {
      return { type, items: [], status: "unavailable" };
    }
    return {
      type,
      status: "complete",
      items: found.results.map((r) => ({
        name: r.name ?? "Unnamed site",
        kind: r.kind === "partner" ? "registered MAVUNO partner" : "public map site",
        buyer_type: r.buyerType,
        distance_km: r.distanceKm,
        lat: r.lat == null ? undefined : Number(r.lat),
        lng: r.lng == null ? undefined : Number(r.lng),
        address: r.address ?? undefined,
        phone: r.phone ?? undefined,
        website: r.website ?? undefined,
        map_url: r.mapUrl ?? (r.lat != null && r.lng != null
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.lat},${r.lng}`)}`
          : undefined),
        price_kes_per_kg: r.pricePerKg ?? undefined,
      })),
    };
  } catch (err) {
    console.warn("Nearby lookup failed for chat:", err.message);
    return { type, items: [], status: "unavailable" };
  }
}

router.post("/", parseChatUpload, async (req, res) => {
  // Recover the prompt from its header if multipart parsing drops text fields.
  // The client URI-encodes it so arbitrary Unicode remains valid in a header.
  let headerMessage = "";
  const encodedHeaderMessage = req.get("X-Chat-Message");
  if (encodedHeaderMessage) {
    try {
      headerMessage = decodeURIComponent(encodedHeaderMessage).trim();
    } catch {
      headerMessage = "";
    }
  }

  if (!req.body?.message?.trim() && headerMessage) {
    req.body = { ...req.body, message: headerMessage };
  }

  // A media upload can still be analyzed if the client omitted both prompts.
  if (req.file && !req.body?.message?.trim()) {
    req.body = {
      ...req.body,
      message: "Please analyze this farm photo or video and tell me what you see.",
    };
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "message is required (up to 2000 characters)");
  }
  const { message, farmId } = parsed.data;

  const payload = { message };
  const ctx = await farmContext(req.user?.id, farmId);
  // Prefer the farm record; use coordinates sent from the selected live farm as a
  // fallback when the API's farm lookup cannot provide its saved pin.
  const lat = ctx?.lat ?? parsed.data.lat;
  const lng = ctx?.lng ?? parsed.data.lng;
  if (ctx) {
    payload.farm_name = ctx.name;
    if (ctx.crops.length) payload.crop = ctx.crops.join(" and ");
    if (ctx.areaHa) payload.size_acres = Number((ctx.areaHa / 0.4047).toFixed(1));
  }
  if (lat != null && lng != null) {
    payload.lat = Number(lat);
    payload.lng = Number(lng);
  }
  const nearby = await nearbyFor({ ...ctx, lat, lng }, message);
  if (nearby) {
    payload.nearby_type = nearby.type;
    payload.nearby = nearby.items;
    payload.nearby_status = nearby.status;
  }

  let aiRes;
  try {
    if (req.file) {
      if (!/^(image|video)\//i.test(req.file.mimetype)) {
        throw new HttpError(400, "media must be an image or video");
      }

      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value !== undefined && value !== null) {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      }
      formData.append(
        "media",
        new Blob([req.file.buffer], { type: req.file.mimetype }),
        req.file.originalname
      );

      aiRes = await fetch(`${AI_BASE}/chat`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(MEDIA_TIMEOUT_MS),
      });
    } else {
      aiRes = await fetch(`${AI_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    }
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (err?.name === "TimeoutError" || err?.name === "AbortError") {
      throw new HttpError(504, "Media analysis timed out. Try a smaller image or video.");
    }
    throw new HttpError(503, `AI service unavailable: ${err.message}`);
  }

  const body = await aiRes.json().catch(() => ({}));
  if (!aiRes.ok || body.status !== "success") {
    const detail = typeof body.detail === "string" ? body.detail : undefined;
    throw new HttpError(502, body.message || body.error || detail || "AI service error");
  }
  res.json(body);
});

export default router;
