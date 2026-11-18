import { useCallback, useEffect, useState } from "react";
import { api, getToken } from "../lib/api";
import { USERS, PARTNERS, COUNTY_RISK, WASTE, ALERTS_INIT } from "../../admin/data";

/**
 * The admin console's data. When the console is not reachable (or the
 * account is not an admin) the platform falls back to the sample figures so
 * the screen still demonstrates the layout.
 */
export function useAdminData() {
  const [users, setUsers] = useState(USERS);
  const [partners, setPartners] = useState(PARTNERS);
  const [summary, setSummary] = useState(null);
  const [counties, setCounties] = useState(COUNTY_RISK);
  const [alerts, setAlerts] = useState(ALERTS_INIT);
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
      const [usersBody, partnersBody, summaryBody, countyBody] = await Promise.all([
        api.get("/admin/users", { signal }),
        api.get("/admin/partners", { signal }),
        api.get("/admin/summary", { signal }),
        api.get("/admin/county-risk", { signal }),
      ]);

      setUsers(usersBody.users ?? []);
      setPartners(partnersBody.partners ?? []);
      setSummary(summaryBody ?? null);
      if (countyBody?.counties?.length) setCounties(countyBody.counties);
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

  const setUserStatus = useCallback(async (id, status) => {
    const previous = users.find((u) => u.id === id)?.status;
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status } : u)));
    try {
      if (live) await api.patch(`/admin/users/${id}/status`, { status });
    } catch (e) {
      setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, status: previous } : u)));
      throw e;
    }
  }, [users, live]);

  /**
   * Update a partner. `status` and `userId` are both optional and only the
   * ones that are supplied are written, so linking an account never clears
   * the approval status and approving never unlinks the account.
   */
  const setPartnerStatus = useCallback(async (id, status, userId) => {
    const previous = partners.find((p) => p.id === id);
    setPartners((cur) =>
      cur.map((p) =>
        p.id === id
          ? {
              ...p,
              ...(status !== undefined ? { status } : {}),
              ...(userId !== undefined ? { userId } : {}),
            }
          : p
      )
    );
    try {
      if (live) {
        const body = await api.patch(`/admin/partners/${id}`, {
          ...(status !== undefined ? { status } : {}),
          ...(userId !== undefined ? { user_id: userId } : {}),
        });
        if (body?.partner) {
          setPartners((cur) => cur.map((p) => (p.id === id ? body.partner : p)));
        }
      }
    } catch (e) {
      setPartners((cur) => cur.map((p) => (p.id === id ? previous : p)));
      throw e;
    }
  }, [partners, live]);

  const resolveAlert = useCallback((id) => {
    setAlerts((cur) => cur.filter((a) => a.id !== id));
  }, []);

  return {
    users,
    partners,
    summary,
    counties,
    alerts,
    waste: WASTE,
    error,
    loading,
    live,
    setUserStatus,
    setPartnerStatus,
    resolveAlert,
    reload: () => load(),
  };
}
