import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";

/**
 * The signed-in user's notification feed. It is the same feed the platform
 * writes to when a match is sent, accepted or declined, so the farmer's
 * bell badge and the partner's inbox agree.
 */
export function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) throw new Error("Not signed in");
      const body = await api.get("/notifications", { signal });
      setItems(Array.isArray(body?.notifications) ? body.notifications : []);
      setUnread(Number(body?.unread || 0));
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

  const markRead = useCallback(async (id) => {
    setItems((cur) =>
      cur.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setUnread((cur) => Math.max(0, cur - 1));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      load();
    }
  }, [load]);

  const markAllRead = useCallback(async () => {
    setItems((cur) => cur.map((n) => ({ ...n, unread: false })));
    setUnread(0);
    try {
      await api.post("/notifications/read-all");
    } catch {
      load();
    }
  }, [load]);

  const dismiss = useCallback(async (id) => {
    setItems((cur) => cur.filter((n) => n.id !== id));
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      load();
    }
  }, [load]);

  return { items, unread, error, loading, reload: () => load(), markRead, markAllRead, dismiss };
}
