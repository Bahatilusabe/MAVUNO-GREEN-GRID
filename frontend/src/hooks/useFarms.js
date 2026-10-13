import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";

const RISK_ORDER = { low: 1, medium: 2, high: 3 };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const API_STATUSES = ["planned", "growing", "ready_to_harvest", "harvested", "sold", "lost"];

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const fmtHarvest = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short" })
    : "TBD";

// API crop -> the snake_case shape Crops.jsx and AddCropForm already use
export function toUiCrop(c, farmAreaHa) {
  return {
    id: c.id,
    farm_id: c.farmId,
    crop_type: c.name,
    variety: c.variety ?? "",
    planting_date: c.plantingDate ?? "",
    expected_harvest_date: c.expectedHarvest ?? "",
    area_planted: farmAreaHa,
    expected_yield: c.expectedKg,
    yield_unit: "kg",
    status: String(c.status ?? "growing").toUpperCase(),
    risk: cap(c.risk),
    actual_kg: c.actualKg,
  };
}

// API farm -> the shape the farmer UI already uses
export function toUiFarm(f) {
  const apiCrops = f.crops ?? [];
  const next = apiCrops
    .filter((c) => c.expectedHarvest)
    .sort((a, b) => a.expectedHarvest.localeCompare(b.expectedHarvest))[0];
  const worst = apiCrops.reduce(
    (w, c) => ((RISK_ORDER[c.risk] ?? 0) > RISK_ORDER[w] ? c.risk : w),
    "low"
  );

  return {
    id: f.id,
    name: f.name,
    county: f.county,
    sub: f.subCounty ?? "",
    area: f.areaHa,
    type: f.farmType ?? "Smallholder",
    water: f.waterSource || "—",
    irrigation: f.irrigation || "—",
    lat: f.lat,
    lng: f.lng,
    coords: f.lat != null && f.lng != null ? `${Number(f.lat).toFixed(5)}, ${Number(f.lng).toFixed(5)}` : "—",
    crop: apiCrops.length ? apiCrops.map((c) => c.name).join(", ") : "—",
    kg: apiCrops.reduce((s, c) => s + (c.expectedKg || 0), 0),
    risk: cap(worst),
    harvest: fmtHarvest(next?.expectedHarvest),
    stage: next?.stage || apiCrops[0]?.stage || "Planning",
    perf: 0,
    crops: apiCrops.map((c) => toUiCrop(c, f.areaHa)),
  };
}

// AddFarmForm values -> API body
export const toFarmPayload = (f) => ({
  name: f.name,
  county: f.county,
  sub_county: f.sub || undefined,
  area_ha: Number(f.area),
  water_source: f.water || undefined,
  irrigation: f.irrigation || undefined,
  lat: f.lat,
  lng: f.lng,
  video_url: f.videoUrl || undefined, // Added video support
});

const yieldMultiplier = (unit) =>
  /^(t|ton|tons|tonne|tonnes)$/i.test(String(unit ?? "").trim()) ? 1000 : 1;

// AddCropForm values -> API body
export function toCropPayload(c) {
  const status = String(c.status ?? "").toLowerCase();
  const kg = Math.round(Number(c.expected_yield || 0) * yieldMultiplier(c.yield_unit));
  return {
    farm_id: String(c.farm_id),
    name: c.crop_type,
    variety: c.variety || undefined,
    planting_date: ISO_DATE.test(c.planting_date ?? "") ? c.planting_date : undefined,
    expected_harvest: ISO_DATE.test(c.expected_harvest_date ?? "") ? c.expected_harvest_date : undefined,
    expected_kg: Number.isFinite(kg) && kg >= 0 ? kg : 0,
    status: API_STATUSES.includes(status) ? status : undefined,
  };
}

export function useFarms() {
  const [farms, setFarms] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) throw new Error("Not signed in");
      const body = await api.get("/farms", { signal });
      setFarms(body.farms.map(toUiFarm));
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const addFarm = useCallback(async (form) => {
    const { farm } = await api.post("/farms", toFarmPayload(form));
    const ui = toUiFarm(farm);
    setFarms((cur) => [...(cur ?? []), ui]);
    return ui;
  }, []);

  const addCrop = useCallback(async (crop) => {
    await api.post("/crops", toCropPayload(crop));
    const body = await api.get("/farms"); // refresh so farm totals and risk stay correct
    setFarms(body.farms.map(toUiFarm));
  }, []);

  const removeFarm = useCallback(async (id) => {
    await api.delete(`/farms/${id}`);
    setFarms((cur) => (cur ?? []).filter((f) => f.id !== id));
  }, []);

  return {
    farms: farms ?? [],
    loading,
    error,
    reload: () => load(),
    addFarm,
    addCrop,
    removeFarm,
  };
}