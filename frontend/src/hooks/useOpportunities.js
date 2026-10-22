import { useCallback, useEffect, useMemo, useState } from "react";
import { api, getToken } from "../lib/api";
import { OPPS, OPP_COLOR, OPP_TYPE } from "../../shared/data";

/** The opportunity types the platform understands, in one place. */
export const TYPE_LABELS = OPP_TYPE;

/** Static sample sites need coordinates to appear on the map. */
const KNOWN_SITES = {
  "Nairobi Fresh Markets": { lat: -1.2817, lng: 36.8313 },
  "Kagio Juice Processors": { lat: -0.668, lng: 37.317 },
  "Kirinyaga Cold Storage": { lat: -0.4994, lng: 37.2808 },
};

/** API opportunity -> the shape the cards and map use. */
export function toOpp(o) {
  return {
    id: `${o.kind}:${o.id}`,
    kind: o.kind,
    refId: o.id,
    name: o.name,
    type: TYPE_LABELS[o.type] ?? "Buyers",
    km: o.distanceKm,
    capacityKg: o.capacityKg,
    cap:
      o.capacityKg != null
        ? `${Number((o.capacityKg / 1000).toFixed(1)).toLocaleString("en-KE")} t capacity`
        : "Capacity not listed",
    price:
      o.pricePerKg != null
        ? `KES ${Number(o.pricePerKg).toLocaleString("en-KE")}/kg`
        : "Price on request",
    note: o.kind === "partner" ? "Registered MAVUNO partner" : "Public site, not yet on MAVUNO",
    lat: Number(o.lat),
    lng: Number(o.lng),
    phone: o.phone || null,
    website: o.website || null,
    address: o.address || null,
    buyerType: o.buyerType || null,
    mapUrl:
      o.mapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.lat},${o.lng}`)}`,
  };
}

/** The signed-out sample list, in the same shape as the live list. */
export function sampleOpportunities() {
  return OPPS.map((o) => ({
    id: `partner:${o.id}`,
    kind: "partner",
    refId: o.id,
    name: o.name,
    type: TYPE_LABELS[o.type] ?? "Buyers",
    km: o.km,
    capacityKg: null,
    cap: o.cap,
    price: o.price,
    note: o.note,
    lat: null,
    lng: null,
    x: o.x,
    y: o.y,
    ...(KNOWN_SITES[o.name] ?? {}),
  }));
}

/**
 * Nearby buyers, processors, storage and transport for a farm.
 *
 * When the platform is reachable the list is real; otherwise the signed-out
 * sample list is returned so the view is never empty.
 */
export function useOpportunities({ farmId } = {}) {
  const [live, setLive] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | sample | no-location
  const [incomplete, setIncomplete] = useState(false);

  const load = useCallback(
    async (signal) => {
      if (!getToken()) {
        setLive(null);
        setState("sample");
        return;
      }
      setState("loading");
      try {
        const qs = farmId ? `?farmId=${encodeURIComponent(farmId)}` : "";
        const body = await api.get(`/opportunities${qs}`, { signal });
        setLive((body.opportunities ?? []).map(toOpp));
        setIncomplete(body.complete === false);
        setState("ok");
      } catch (e) {
        if (e.name === "AbortError") return;
        setLive(null);
        setState(e.status === 422 ? "no-location" : "sample");
      }
    },
    [farmId]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const opportunities = useMemo(() => live ?? sampleOpportunities(), [live]);

  return {
    opportunities,
    state,
    incomplete,
    isLive: state === "ok",
    reload: () => load(),
  };
}

export const colorForType = (type) =>
  OPP_COLOR[type] ?? OPP_COLOR.Buyer;
