import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";

export function useDeals(pollMs = 15000) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      if (!getToken()) return;
      const { deals } = await api.get("/deals");
      setDeals(deals);
      setError("");
    } catch (e) {
      setError(e.message);
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

  return { deals, loading, error, refresh };
}