import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";

function timeAgo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Map the server shape to what NotificationItem already expects
const adapt = (n) => ({
  id: n.id,
  kind: n.kind,
  icon: n.icon,
  tone: n.tone,
  title: n.title,
  text: n.body,
  unread: n.unread,
  matchId: n.matchId,
  ago: timeAgo(n.createdAt),
  action: n.actionLabel ? { label: n.actionLabel, to: n.actionTo } : null,
});

export function useNotifications(pollMs = 20000) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      if (!getToken()) return; // signed out (demo mode): nothing to fetch
      const { notifications } = await api.get("/notifications");
      setItems(notifications.map(adapt));
    } catch {
      /* keep the last good list */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(() => {
      if (!document.hidden) refresh();
    }, pollMs);
    return () => clearInterval(t);
  }, [refresh, pollMs]);

  const markRead = (id) => {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    api.patch(`/notifications/${id}/read`).catch(refresh);
  };

  const dismiss = (id) => {
    setItems((p) => p.filter((n) => n.id !== id));
    api.delete(`/notifications/${id}`).catch(refresh);
  };

  const restore = (id) => {
    api.post(`/notifications/${id}/restore`).then(refresh).catch(refresh);
  };

  const markAllRead = () => {
    setItems((p) => p.map((n) => ({ ...n, unread: false })));
    api.post("/notifications/read-all").catch(refresh);
  };

  return {
    items,
    unread: items.filter((n) => n.unread).length,
    loading,
    refresh,
    markRead,
    dismiss,
    restore,
    markAllRead,
  };
}