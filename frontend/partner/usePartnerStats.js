import { useMemo } from "react";
import { normalizeStatus } from "../shared/status";

/**
 * Partner KPIs derived from the request list. The order of an accepted
 * request and the committed load are the same thing, so both come from the
 * request stream and can never disagree.
 */
export default function usePartnerStats(orders, requests, capacity) {
  return useMemo(() => {
    const load = orders.filter((o) => normalizeStatus(o.status) !== "delivered").reduce((s, o) => s + o.kg, 0);
    const delivered = orders.filter((o) => normalizeStatus(o.status) === "delivered");
    const cap = Number(capacity) || 0;

    return {
      load,
      remaining: Math.max(0, cap - load),
      util: cap ? Math.min(100, Math.round((load / cap) * 100)) : 0,
      revenue: delivered.reduce((s, o) => s + o.kg * o.price, 0),
      deliveredKg: delivered.reduce((s, o) => s + o.kg, 0),
      pending: requests.filter((r) => normalizeStatus(r.status) === "pending").length,
    };
  }, [orders, requests, capacity]);
}
