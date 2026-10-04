import { useMemo, useState } from "react";
import {
  BellRing,
  ChartNoAxesCombined,
  Clock3,
  Handshake,
  HeartPulse,
  Scale,
  Tractor,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import Shell from "../shared/Shell";
import { USERS, PARTNERS, ALERTS_INIT } from "./data";
import KpiGrid from "./components/KpiGrid";
import { WasteCard, CountyRiskCard, StatusCard } from "./components/ChartCards";
import FarmersTable from "./components/FarmersTable";
import PartnersCard from "./components/PartnersCard";
import AlertsCard from "./components/AlertsCard";
import HealthCard from "./components/HealthCard";

const USER = { name: "Admin", sub: "Platform operator", initials: "AD" };

export default function AdminDashboard() {
  const [users, setUsers] = useState(USERS);
  const [partners, setPartners] = useState(PARTNERS);
  const [alerts, setAlerts] = useState(ALERTS_INIT);
  const [active, setActive] = useState("overview");

  const kpis = useMemo(() => {
    const pendingUsers = users.filter((u) => u.status === "Pending").length;
    const pendingPartners = partners.filter((p) => p.status === "Pending").length;
    return [
      [UsersRound, "Total farmers", users.length, `${users.filter((u) => u.status === "Active").length} active`],
      [Tractor, "Registered farms", users.reduce((s, u) => s + u.farms, 0), "across 5 counties"],
      [Scale, "Expected harvest", `${users.reduce((s, u) => s + u.tons, 0).toFixed(1)} t`, "all farmers"],
      [Clock3, "Pending approvals", pendingUsers + pendingPartners, `${pendingUsers} farmers, ${pendingPartners} partners`],
      [TriangleAlert, "Open alerts", alerts.length, "needs review", alerts.length > 0],
    ];
  }, [users, partners, alerts]);

  const nav = [
    ["overview", "Overview", ChartNoAxesCombined],
    ["farmers", "Farmers", UsersRound],
    ["partners", "Partners", Handshake],
    ["alerts", "Alerts", BellRing, alerts.length],
    ["health", "System health", HeartPulse],
  ];

  const jump = (key) => {
    setActive(key);
    if (key === "overview") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setUserStatus = (id, s) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: s } : u)));
  const setPartnerStatus = (id, s) => setPartners((ps) => ps.map((p) => (p.id === id ? { ...p, status: s } : p)));

  return (
    <Shell nav={nav} active={active} onNavigate={jump} title="Admin Dashboard" subtitle="Platform overview for MAVUNO Green Grid" user={USER} alerts={alerts.length}>
      <div className="ad">
        <KpiGrid kpis={kpis} />
        <div className="ad-grid2"><WasteCard /><CountyRiskCard /></div>
        <FarmersTable users={users} onStatus={setUserStatus} />
        <div className="ad-grid2"><StatusCard users={users} /><PartnersCard partners={partners} onDecide={setPartnerStatus} /></div>
        <div className="ad-grid2">
          <AlertsCard alerts={alerts} onResolve={(id) => setAlerts(alerts.filter((a) => a.id !== id))} />
          <HealthCard />
        </div>
      </div>
    </Shell>
  );
}