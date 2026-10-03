import { useMemo } from "react";

export default function usePartnerStats(orders, requests, capacity) {
  return useMemo(() => {
    const load = orders.filter((o) => o.status !== "Delivered").reduce((s, o) => s + o.kg, 0);
    const delivered = orders.filter((o) => o.status === "Delivered");
    return {
      load,
      remaining: Math.max(0, capacity - load),
      util: Math.min(100, Math.round((load / capacity) * 100)),
      revenue: delivered.reduce((s, o) => s + o.kg * o.price, 0),
      deliveredKg: delivered.reduce((s, o) => s + o.kg, 0),
      pending: requests.filter((r) => r.status === "Pending").length,
    };
  }, [orders, requests, capacity]);
}