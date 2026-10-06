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
import { toast } from "sonner";
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
      [UsersRound, "Total farmers", users.length, `${users.filter((u) => u.status === "Active").length} active`, false],
      [Tractor, "Registered farms", users.reduce((s, u) => s + u.farms, 0), "across 5 counties", false],
      [Scale, "Expected harvest", `${users.reduce((s, u) => s + u.tons, 0).toFixed(1)} t`, "all farmers", false],
      [Clock3, "Pending approvals", pendingUsers + pendingPartners, `${pendingUsers} farmers, ${pendingPartners} partners`, false],
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

  const setUserStatus = (id, status) => {
    const previousStatus = users.find((u) => u.id === id)?.status;
    if (previousStatus === undefined) return;
    setUsers((current) => current.map((u) => (u.id === id ? { ...u, status } : u)));
    toast(`Farmer ${status.toLowerCase()}`, {
      action: {
        label: "Undo",
        onClick: () =>
          setUsers((current) =>
            current.map((u) =>
              u.id === id ? { ...u, status: previousStatus } : u,
            ),
          ),
      },
    });
  };

  const setPartnerStatus = (id, status) => {
    setPartners((current) =>
      current.map((p) => (p.id === id ? { ...p, status } : p)),
    );
    toast.success(`Partner ${status.toLowerCase()}`);
  };

  const resolveAlert = (id) => {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) return;
    setAlerts((current) => current.filter((item) => item.id !== id));
    toast.success("Alert resolved", {
      action: {
        label: "Undo",
        onClick: () =>
          setAlerts((current) =>
            [...current, alert].sort((a, b) => a.id - b.id),
          ),
      },
    });
  };

  return (
    <Shell 
      nav={nav} 
      active={active} 
      onNavigate={jump} 
      title="Admin Dashboard" 
      subtitle="Platform overview for MAVUNO Green Grid" 
      user={USER} 
      alerts={alerts.length}
    >
      <div className="space-y-6 pb-12">
        {/* KPI Summary Grid */}
        <KpiGrid kpis={kpis} />

        {/* Waste Avoided & County Risk Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WasteCard />
          <CountyRiskCard />
        </div>

        {/* Farmers Management Table */}
        <div id="farmers">
          <FarmersTable users={users} onStatus={setUserStatus} />
        </div>

        {/* Status Donut & Partners Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="partners">
          <StatusCard users={users} />
          <PartnersCard partners={partners} onDecide={setPartnerStatus} />
        </div>

        {/* System Alerts & Health Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="alerts">
            <AlertsCard alerts={alerts} onResolve={resolveAlert} />
          </div>
          <div id="health">
            <HealthCard />
          </div>
        </div>
      </div>
    </Shell>
  );
}