import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";

const OVERPASS_URL = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const USER_AGENT = "MAVUNO-Green-Grid/1.0";
const TTL_DAYS = Number(process.env.GEO_CACHE_TTL_DAYS ?? 30);
const BUCKETS = [5, 10, 25, 50]; // km
const CELL_DEG = 0.1;
const CELL_MARGIN_KM = 8; // half-diagonal of a 0.1 degree cell, so one fetch covers any point inside it

const FILTERS = {
  market: ['["amenity"="marketplace"]'],
  cold_store: [
    '["industrial"="cold_storage"]',
    '["building"="warehouse"]["name"~"cold|storage|cool|fridge",i]',
  ],
  water: ['["natural"="water"]', '["man_made"="water_well"]', '["amenity"="drinking_water"]'],
};

// Registered, approved MAVUNO partners that can be committed to directly
const PARTNER_TYPES = { market: ["buyer", "processor"], cold_store: ["storage"], water: [] };

export const PLACE_TYPES = Object.keys(FILTERS);

const TAG_KEYS = ["amenity", "natural", "man_made", "industrial", "building", "operator", "opening_hours", "website"];

const toRad = (d) => (d * Math.PI) / 180;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function haversineKm(aLat, aLng, bLat, bLng) {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const snap = (v) => Math.round(v / CELL_DEG) * CELL_DEG;
const cellKey = (lat, lng) => `${snap(lat).toFixed(1)},${snap(lng).toFixed(1)}`;

function buildQuery(type, lat, lng, radiusM) {
  const parts = FILTERS[type].flatMap((f) =>
    ["node", "way"].map((el) => `${el}${f}(around:${radiusM},${lat},${lng});`)
  );
  return `[out:json][timeout:25];(${parts.join("")});out center 200;`;
}

async function fetchOverpass(ql) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({ data: ql }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) return await res.json();
      lastError = new Error(`Overpass returned HTTP ${res.status}`);
      if (res.status < 500) throw lastError; // 4xx (including 429) will not improve on an immediate retry
    } catch (err) {
      lastError = err;
      if (err.message?.startsWith("Overpass returned HTTP 4")) throw err;
    }
    if (attempt < 2) await sleep(1000);
  }
  throw lastError;
}

function normalize(el, type) {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const t = el.tags ?? {};
  const tags = {};
  for (const k of TAG_KEYS) if (t[k]) tags[k] = String(t[k]).slice(0, 100);
  return {
    sid: `${type}:${el.type}/${el.id}`,
    type,
    name: (t.name ?? t["name:en"] ?? null)?.slice(0, 255) ?? null,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    tags: JSON.stringify(tags),
  };
}

const MERGE_PLACE = `
  MERGE INTO geo_places g
  USING (SELECT :sid AS source_id, :type AS type, :name AS name, :lat AS lat, :lng AS lng, :tags AS tags FROM dual) s
  ON (g.source = 'osm' AND g.source_id = s.source_id)
  WHEN MATCHED THEN UPDATE SET g.type = s.type, g.name = s.name, g.lat = s.lat, g.lng = s.lng,
                               g.tags = s.tags, g.fetched_at = SYSTIMESTAMP
  WHEN NOT MATCHED THEN INSERT (source, source_id, type, name, lat, lng, tags)
       VALUES ('osm', s.source_id, s.type, s.name, s.lat, s.lng, s.tags)`;

const MERGE_FETCH = `
  MERGE INTO geo_fetches f
  USING (SELECT :type AS type, :cell AS cell, :radius AS radius_km FROM dual) s
  ON (f.type = s.type AND f.cell = s.cell AND f.radius_km = s.radius_km)
  WHEN MATCHED THEN UPDATE SET f.fetched_at = SYSTIMESTAMP
  WHEN NOT MATCHED THEN INSERT (type, cell, radius_km) VALUES (s.type, s.cell, s.radius_km)`;

async function doRefresh(type, cell, bucket) {
  const [cLat, cLng] = cell.split(",").map(Number);
  const data = await fetchOverpass(buildQuery(type, cLat, cLng, (bucket + CELL_MARGIN_KM) * 1000));

  const unique = new Map();
  for (const el of data.elements ?? []) {
    const p = normalize(el, type);
    if (p) unique.set(p.sid, p);
  }
  const places = [...unique.values()].map((p) => ({
    sid: p.sid, type: p.type, name: p.name, lat: p.lat, lng: p.lng, tags: p.tags,
  }));

  const conn = await getConnection();
  try {
    if (places.length) {
      await conn.executeMany(MERGE_PLACE, places, {
        bindDefs: {
          sid: { type: oracledb.STRING, maxSize: 80 },
          type: { type: oracledb.STRING, maxSize: 30 },
          name: { type: oracledb.STRING, maxSize: 255 },
          lat: { type: oracledb.NUMBER },
          lng: { type: oracledb.NUMBER },
          tags: { type: oracledb.STRING, maxSize: 2000 },
        },
      });
    }
    await conn.execute(MERGE_FETCH, { type, cell, radius: bucket });
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.close();
  }
}

// One refresh per (type, cell, radius) at a time, so concurrent searches share a single Overpass call
const inflight = new Map();
function refresh(type, cell, bucket) {
  const key = `${type}|${cell}|${bucket}`;
  if (!inflight.has(key)) {
    inflight.set(key, doRefresh(type, cell, bucket).finally(() => inflight.delete(key)));
  }
  return inflight.get(key);
}

async function nearbyPartners(type, lat, lng, radiusKm) {
  const types = PARTNER_TYPES[type] ?? [];
  if (!types.length) return [];
  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.max(Math.cos(toRad(lat)), 0.01));
  const placeholders = types.map((_, i) => `:${i + 5}`).join(", ");
  const { rows } = await query(
    `SELECT id AS "id", name AS "name", type AS "partnerType", lat AS "lat", lng AS "lng",
            price_per_kg AS "pricePerKg", capacity_kg AS "capacityKg"
       FROM partners
      WHERE status = 'approved' AND accepting = 1
        AND lat BETWEEN :1 AND :2 AND lng BETWEEN :3 AND :4
        AND type IN (${placeholders})`,
    [lat - dLat, lat + dLat, lng - dLng, lng + dLng, ...types]
  );
  return rows.map((r) => ({ ...r, kind: "partner" }));
}

export async function nearbyPlaces({ lat, lng, radiusKm, type, limit }) {
  const bucket = BUCKETS.find((b) => b >= radiusKm) ?? BUCKETS[BUCKETS.length - 1];
  const cell = cellKey(lat, lng);

  const fresh = await query(
    `SELECT 1 AS "ok" FROM geo_fetches
      WHERE type = :1 AND cell = :2 AND radius_km = :3
        AND fetched_at > SYSTIMESTAMP - NUMTODSINTERVAL(:4, 'DAY')`,
    [type, cell, bucket, TTL_DAYS]
  );

  let source = "cache";
  let refreshFailed = false;
  if (!fresh.rows.length) {
    try {
      await refresh(type, cell, bucket);
      source = "overpass";
    } catch (err) {
      refreshFailed = true;
      console.warn("Overpass unavailable, serving cached places:", err.message);
    }
  }

  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.max(Math.cos(toRad(lat)), 0.01));
  const { rows } = await query(
    `SELECT id AS "id", name AS "name", lat AS "lat", lng AS "lng", tags AS "tags"
       FROM geo_places
      WHERE type = :1 AND lat BETWEEN :2 AND :3 AND lng BETWEEN :4 AND :5`,
    [type, lat - dLat, lat + dLat, lng - dLng, lng + dLng]
  );

  const osm = rows.map((r) => ({ ...r, kind: "place", type }));
  const partners = await nearbyPartners(type, lat, lng, radiusKm);

  const results = [...partners, ...osm]
    .map((r) => ({ ...r, distanceKm: Number(haversineKm(lat, lng, r.lat, r.lng).toFixed(1)) }))
    .filter((r) => r.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  if (refreshFailed) source = osm.length ? "stale-cache" : "unavailable";
  return { source, count: results.length, results };
}