import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";
import { nearbyPlaces } from "../places/service.js";

const PARTNER_RADIUS_KM = 150;
const PLACE_RADIUS_KM = 25;
const PLACE_TIMEOUT_MS = 12_000;
const TYPE_MAP = { buyer: "buyer", processor: "processor", storage: "cold_store", transport: "transport" };

const toRad = (d) => (d * Math.PI) / 180;
function haversineKm(aLat, aLng, bLat, bLng) {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const withTimeout = (promise, ms) => {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

async function pickFarm(ownerId, farmId) {
  const { rows } = await query(
    `SELECT id AS "id", lat AS "lat", lng AS "lng"
       FROM farms
      WHERE owner_id = :1${farmId ? " AND id = :2" : ""}
      ORDER BY created_at
      FETCH FIRST 1 ROWS ONLY`,
    farmId ? [ownerId, farmId] : [ownerId]
  );
  if (!rows[0]) throw new HttpError(404, "Farm not found");
  if (rows[0].lat == null || rows[0].lng == null) {
    throw new HttpError(422, "This farm has no saved location");
  }
  return { id: rows[0].id, lat: Number(rows[0].lat), lng: Number(rows[0].lng) };
}

async function nearbyPartners(farm) {
  const dLat = PARTNER_RADIUS_KM / 111;
  const dLng = PARTNER_RADIUS_KM / (111 * Math.max(Math.cos(toRad(farm.lat)), 0.01));
  const { rows } = await query(
    `SELECT p.id AS "id", p.name AS "name", p.type AS "type", p.lat AS "lat", p.lng AS "lng",
            p.price_per_kg AS "pricePerKg", p.capacity_kg AS "capacityKg", u.phone AS "phone"
       FROM partners p LEFT JOIN users u ON u.id = p.user_id
      WHERE p.status = 'approved' AND p.accepting = 1
        AND p.lat IS NOT NULL AND p.lng IS NOT NULL
        AND p.lat BETWEEN :1 AND :2 AND p.lng BETWEEN :3 AND :4`,
    [farm.lat - dLat, farm.lat + dLat, farm.lng - dLng, farm.lng + dLng]
  );
  return rows.map((p) => ({
    kind: "partner",
    id: p.id,
    name: p.name,
    type: TYPE_MAP[p.type] ?? "buyer",
    lat: Number(p.lat),
    lng: Number(p.lng),
    pricePerKg: p.pricePerKg,
    capacityKg: p.capacityKg,
    phone: p.phone ?? null,
    buyerType: p.type,
  }));
}

async function publicSites(farm) {
  const searches = [
    ["market", "buyer", "Market"],
    ["cold_store", "cold_store", "Cold store"],
  ];
  const settled = await Promise.allSettled(
    searches.map(([type]) =>
      withTimeout(
        nearbyPlaces({ lat: farm.lat, lng: farm.lng, radiusKm: PLACE_RADIUS_KM, type, limit: 15 }),
        PLACE_TIMEOUT_MS
      )
    )
  );

  let complete = true;
  const items = [];
  settled.forEach((s, i) => {
    const [, uiType, fallbackName] = searches[i];
    if (s.status !== "fulfilled" || !s.value || s.value.source === "unavailable") {
      complete = false;
      return;
    }
    for (const r of s.value.results) {
      if (r.kind !== "place") continue;
      items.push({
        kind: "place",
        id: r.id,
        name: r.name ?? `${fallbackName} (unnamed)`,
        type: uiType,
        lat: Number(r.lat),
        lng: Number(r.lng),
        phone: r.phone ?? null,
        website: r.website ?? null,
        address: r.address ?? null,
        buyerType: r.buyerType ?? null,
        mapUrl: r.mapUrl ?? null,
        pricePerKg: null,
        capacityKg: null,
      });
    }
  });
  return { items, complete };
}

export async function listOpportunities(ownerId, farmId) {
  const farm = await pickFarm(ownerId, farmId);
  const [partners, sites] = await Promise.all([nearbyPartners(farm), publicSites(farm)]);

  const opportunities = [...partners, ...sites.items]
    .map((o) => ({
      ...o,
      distanceKm: Number(haversineKm(farm.lat, farm.lng, o.lat, o.lng).toFixed(1)),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    farmId: farm.id,
    opportunities,
    // false when a public-site search timed out. The cache keeps filling, so a reload gets the rest
    complete: sites.complete,
  };
}
