import { Router } from "express";

const router = Router();

const OSRM_URL = (process.env.OSRM_URL || "https://router.project-osrm.org").replace(/\/$/, "");
const TTL_MS = 60 * 60 * 1000;
const cache = new Map();

const coord = (v, max) => {
  const n = Number(v);
  return v !== undefined && Number.isFinite(n) && Math.abs(n) <= max ? n : null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stepText(s) {
  const { type, modifier } = s.maneuver || {};
  const road = s.name ? ` onto ${s.name}` : "";
  if (type === "depart") return `Head ${modifier || "out"}${s.name ? ` on ${s.name}` : ""}`;
  if (type === "arrive") return "Arrive at destination";
  if (type === "roundabout" || type === "rotary") return `Take the roundabout${road}`;
  if (modifier === "straight" || type === "continue" || type === "new name") {
    return `Continue${s.name ? ` on ${s.name}` : " straight"}`;
  }
  if (modifier) return `Turn ${modifier}${road}`;
  return s.name ? `Continue on ${s.name}` : "";
}

async function fetchRoute(url) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (res.ok) return await res.json();
      lastError = new Error(`Routing provider returned HTTP ${res.status}`);
      if (res.status < 500 && res.status !== 429) throw lastError;
    } catch (err) {
      lastError = err;
      if (err.message?.startsWith("Routing provider returned HTTP 4")) throw err;
    }
    if (attempt < 2) await sleep(500);
  }
  throw lastError;
}

router.get("/", async (req, res) => {
  const fromLat = coord(req.query.fromLat, 90);
  const fromLng = coord(req.query.fromLng, 180);
  const toLat = coord(req.query.toLat, 90);
  const toLng = coord(req.query.toLng, 180);

  if ([fromLat, fromLng, toLat, toLng].some((v) => v === null)) {
    return res.status(400).json({ error: "fromLat, fromLng, toLat and toLng are required" });
  }

  const key = [fromLat, fromLng, toLat, toLng].map((n) => n.toFixed(4)).join(",");
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return res.json(hit.value);

  const url =
    `${OSRM_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}` +
    `?overview=full&geometries=geojson&steps=true&alternatives=true`;

  try {
    const data = await fetchRoute(url);
    if (data.code !== "Ok" || !data.routes?.length) {
      return res.status(404).json({ error: "No road route found between these points" });
    }

    const value = {
      routes: data.routes.slice(0, 3).map((r) => ({
        distanceKm: Number((r.distance / 1000).toFixed(1)),
        durationMinutes: Math.round(r.duration / 60),
        coordinates: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        steps: (r.legs?.[0]?.steps ?? [])
          .map((s) => ({ text: stepText(s), distanceM: Math.round(s.distance) }))
          .filter((s) => s.text),
      })),
    };

    if (cache.size > 500) cache.clear();
    cache.set(key, { at: Date.now(), value });
    return res.json(value);
  } catch (err) {
    console.warn("Routing provider unavailable:", err.message);
    if (hit) return res.json(hit.value); // stale route beats no route
    return res.status(502).json({ error: "Routing provider unavailable" });
  }
});

export default router;