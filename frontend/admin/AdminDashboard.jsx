import { useMemo, useState } from "react";
import "./AdminDashboard.css";
import { USERS, PARTNERS, ALERTS_INIT } from "./data";
import KpiGrid from "./components/KpiGrid";
import { WasteCard, CountyRiskCard, StatusCard } from "./components/ChartCards";
import FarmersTable from "./components/FarmersTable";
import PartnersCard from "./components/PartnersCard";
import AlertsCard from "./components/AlertsCard";
import HealthCard from "./components/HealthCard";

export default function AdminDashboard() {
  const [users, setUsers] = useState(USERS);
  const [partners, setPartners] = useState(PARTNERS);
  const [alerts, setAlerts] = useState(ALERTS_INIT);

  const kpis = useMemo(() => {
    const pendingUsers = users.filter((u) => u.status === "Pending").length;
    const pendingPartners = partners.filter((p) => p.status === "Pending").length;
    return [
      ["👥", "Total farmers", users.length, `${users.filter((u) => u.status === "Active").length} active`],
      ["🚜", "Registered farms", users.reduce((s, u) => s + u.farms, 0), "across 5 counties"],
      ["⚖️", "Expected harvest", `${users.reduce((s, u) => s + u.tons, 0).toFixed(1)} t`, "all farmers"],
      ["🕒", "Pending approvals", pendingUsers + pendingPartners, `${pendingUsers} farmers, ${pendingPartners} partners`],
      ["🚨", "Open alerts", alerts.length, "needs review", alerts.length > 0],
    ];
  }, [users, partners, alerts]);

  const setUserStatus = (id, s) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: s } : u)));
  const setPartnerStatus = (id, s) => setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, status: s } : p)));

  return (
    <div className="ad">
      <header className="ad-head">
        <div><h1>Admin Dashboard</h1><small>Platform overview for MAVUNO Green Grid</small></div>
        <span className="ad-badge">Admin</span>
      </header>
      <KpiGrid kpis={kpis} />
      <div className="ad-grid2"><WasteCard /><CountyRiskCard /></div>
      <FarmersTable users={users} onStatus={setUserStatus} />
      <div className="ad-grid2"><StatusCard users={users} /><PartnersCard partners={partners} onDecide={setPartnerStatus} /></div>
      <div className="ad-grid2">
        <AlertsCard alerts={alerts} onResolve={(id) => setAlerts(alerts.filter((a) => a.id !== id))} />
        <HealthCard />
      </div>
    </div>
  );
}