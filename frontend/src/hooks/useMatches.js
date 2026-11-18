import { useCallback, useEffect, useState } from "react";
import { api, getToken, idempotencyKey } from "../lib/api";

/**
 * The farmer's own match requests — the link between a farm's crop and a
 * buyer, processor, storage site or transporter.
 *
 * The API returns the rows the API returns; the UI works with `partnerId` /
 * `placeId` so it can tell which target a request points at.
 */
export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) throw new Error("Not signed in");
      const body = await api.get("/matches", { signal });
      setMatches(Array.isArray(body?.matches) ? body.matches : []);
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

  /**
   * Send a request. The idempotency key is derived from the request content,
   * so a double click or a retry returns the original match instead of
   * creating a second one.
   */
  const createMatch = useCallback(async ({ cropId, kg, pricePerKg, pickupDate, partnerId, placeId, notes }) => {
    const key = idempotencyKey([
      getToken(),
      cropId,
      partnerId ?? placeId,
      kg,
      pricePerKg ?? "",
      pickupDate ?? "",
    ]);

    const body = await api.post(
      "/matches",
      {
        crop_id: cropId,
        kg: Number(kg),
        price_per_kg: pricePerKg == null ? undefined : Number(pricePerKg),
        pickup_date: pickupDate || undefined,
        partner_id: partnerId || undefined,
        place_id: placeId || undefined,
        notes: notes || undefined,
      },
      { headers: { "Idempotency-Key": key } }
    );

    setMatches((cur) => {
      const incoming = body?.match;
      if (!incoming) return cur;
      const without = cur.filter((m) => m.id !== incoming.id);
      return [incoming, ...without];
    });

    return body?.match;
  }, []);

  const cancelMatch = useCallback(async (id) => {
    const body = await api.post(`/matches/${id}/cancel`, {});
    setMatches((cur) => cur.map((m) => (m.id === id ? (body?.match ?? m) : m)));
    return body?.match;
  }, []);

  /**
   * A stable key for a target so a card can tell "already requested" from
   * "new". Opportunity cards carry a composite id ("partner:abc") while a
   * match carries the raw target id, so the composite is normalised away
   * before the two are compared.
   */
  const keyFor = useCallback((target) => {
    const kind = target?.kind === "place" ? "place" : "partner";
    const raw = target?.refId ?? target?.id ?? "";
    const id = String(raw).includes(":") ? String(raw).split(":").pop() : String(raw);
    return `${kind}:${id}`;
  }, []);

  const requestFor = useCallback(
    (target) => {
      const want = keyFor(target);
      return matches.find((m) => {
        const id = m.placeId || m.partnerId;
        if (!id) return false;
        return `${m.placeId ? "place" : "partner"}:${id}` === want;
      });
    },
    [matches, keyFor]
  );

  return { matches, error, loading, reload: () => load(), createMatch, cancelMatch, keyFor, requestFor };
}
