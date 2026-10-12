import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";

export function useOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      if (!getToken()) throw new Error("Not signed in");
      setData(await api.get("/overview", { signal }));
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

  return { data, error, loading, reload: () => load() };
}
