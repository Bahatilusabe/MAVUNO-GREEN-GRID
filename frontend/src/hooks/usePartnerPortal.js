import { useCallback, useEffect, useMemo, useState } from "react";
import { api, getToken } from "../lib/api";
import { normalizeStatus } from "../../shared/status";
import { REQUESTS_INIT, ORDERS_INIT } from "../../partner/data";

const ACTIVE = new Set(["pending", "scheduled", "in transit", "delivered"]);

/** API request -> the row shape the partner tables render. */
function toRequest(m) {
  return {
    id: m.id,
    farmer: m.farmer ?? "Unknown farmer",
    county: m.county ?? "—",
    phone: m.phone ?? null,
    farm: m.farm ?? "—",
    crop: m.crop ?? "Mixed produce",
    kg: Number(m.kg || 0),
    price: Number(m.pricePerKg || 0),
    value: Number(m.kg || 0) * Number(m.pricePerKg || 0),
    date: m.pickupDate ?? "—",
    status: normalizeStatus(m.status ?? "pending"),
    notes: m.notes ?? null,
  };
}

const toOrder = (m) => ({
  ...toRequest(m),
  status: normalizeStatus(m.status ?? "scheduled"),
});

/** The sample fixture -> the same row shape, so the fallback never diverges. */
function toSample(r) {
  return {
    id: r.id,
    farmer: r.farmer,
    county: r.county ?? "—",
    phone: null,
    farm: r.farm ?? "—",
    crop: r.crop,
    kg: Number(r.kg || 0),
    price: Number(r.price || 0),
    value: Number(r.kg || 0) * Number(r.price || 0),
    date: r.date ?? "—",
    status: normalizeStatus(r.status),
    notes: null,
  };
}

const SAMPLE_REQUESTS = REQUESTS_INIT.map(toSample);
const SAMPLE_ORDERS = ORDERS_INIT.map(toSample);

/**
 * The partner's view of the farmer request stream.
 *
 * When the account is not linked to a partner profile the portal falls back
 * to the sample list, so the screen is still usable in a demo — and the
 * accept/decline buttons keep working against local state.
 */
export function usePartnerPortal() {
  const [partner, setPartner] = useState(null);
  const [requests, setRequests] = useState(SAMPLE_REQUESTS);
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [listing, setListing] = useState({ price: 20, capacity: 2000, accepting: true });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  const load = useCallback(async (signal) => {
    if (!getToken()) {
      setError("Not signed in");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const me = await api.get("/partners/me", { signal });
      setPartner(me.partner);
      setListing((cur) => ({
        price: me.partner.pricePerKg ?? cur.price,
        capacity: me.partner.capacityKg ?? cur.capacity,
        accepting: Boolean(me.partner.accepting),
      }));

      const payload = await api.get("/partners/me/requests", { signal });
      const rows = (payload.requests ?? []).map(toRequest);
      setRequests(rows);

      // A scheduled or in-transit request is an order the partner is fulfilling.
      setOrders(rows.filter((r) => r.status !== "pending").map(toOrder));
      setLive(true);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message);
        setLive(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  const decide = useCallback(
    async (request, accept) => {
      if (!live) {
        const next = { ...request, status: accept ? "scheduled" : "declined" };
        setRequests((cur) => cur.map((r) => (r.id === request.id ? next : r)));
        setOrders((cur) =>
          accept
            ? [next, ...cur.filter((o) => o.id !== request.id)]
            : cur.filter((o) => o.id !== request.id)
        );
        return next;
      }

      const body = await api.post(`/partners/me/requests/${request.id}/decision`, {
        decision: accept ? "accept" : "decline",
      });
      const next = toRequest(body.match);
      setRequests((cur) => cur.map((r) => (r.id === request.id ? next : r)));
      setOrders((cur) => {
        const without = cur.filter((o) => o.id !== request.id);
        return accept ? [next, ...without] : without;
      });
      return next;
    },
    [live]
  );

  const advance = useCallback(
    async (request, nextStatus) => {
      const apply = (next) => {
        setRequests((cur) => cur.map((r) => (r.id === request.id ? next : r)));
        setOrders((cur) => cur.map((o) => (o.id === request.id ? next : o)));
        return next;
      };

      if (!live) return apply({ ...request, status: normalizeStatus(nextStatus) });

      const body = await api.patch(`/partners/me/requests/${request.id}/status`, {
        status: normalizeStatus(nextStatus).replace(/ /g, "_"),
      });
      return apply(toRequest(body.match));
    },
    [live]
  );

  const saveListing = useCallback(
    async ({ price, capacity, accepting }) => {
      const next = { price, capacity, accepting };
      setListing(next);
      if (!live) return next;
      const body = await api.patch("/partners/me/listing", {
        price_per_kg: Number(price),
        capacity_kg: Number(capacity),
        accepting: Boolean(accepting),
      });
      if (body?.partner) {
        setPartner(body.partner);
        setListing({
          price: body.partner.pricePerKg ?? price,
          capacity: body.partner.capacityKg ?? capacity,
          accepting: Boolean(body.partner.accepting),
        });
      }
      return next;
    },
    [live]
  );

  const stats = useMemo(() => {
    const pending = requests.filter((r) => normalizeStatus(r.status) === "pending");
    const committed = requests.filter((r) => ACTIVE.has(normalizeStatus(r.status)));
    const delivered = requests.filter((r) => normalizeStatus(r.status) === "delivered");
    const loadKg = committed.reduce((s, r) => s + r.kg, 0);
    const capacity = Number(listing.capacity) || 0;

    return {
      pending: pending.length,
      load: loadKg,
      remaining: Math.max(0, capacity - loadKg),
      util: capacity ? Math.min(100, Math.round((loadKg / capacity) * 100)) : 0,
      revenue: delivered.reduce((s, r) => s + r.value, 0),
      deliveredKg: delivered.reduce((s, r) => s + r.kg, 0),
    };
  }, [requests, listing.capacity]);

  return {
    partner,
    requests,
    orders,
    listing,
    stats,
    error,
    loading,
    live,
    decide,
    advance,
    saveListing,
    reload: () => load(),
  };
}
