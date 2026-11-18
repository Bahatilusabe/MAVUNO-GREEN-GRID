import { useMemo, useState } from "react";
import {
  BellRing,
  ChartNoAxesCombined,
  Clock3,
  Handshake,
  HeartPulse,
  RefreshCw,
  Scale,
  Tractor,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import Shell from "../shared/Shell";
import { navigate } from "../shared/nav";
import NotificationsPopover from "../shared/NotificationsPopover";
import Badge from "../shared/ui/Badge";
import Button from "../shared/ui/Button";
import { titleStatus } from "../shared/status";
import { useAdminData } from "../src/hooks/useAdminData";
import { useNotifications } from "../src/hooks/useNotifications";
import { shapePartner, shapeUser } from "./model";
import KpiGrid from "./components/KpiGrid";
import {
  CountyRiskChart,
  PartnerMixChart,
  PlatformSummaryChart,
  StatusDonut,
  WasteChart,
} from "./components/ChartCards";
import FarmersTable from "./components/FarmersTable";
import PartnersCard from "./components/PartnersCard";
import AlertsCard from "./components/AlertsCard";
import HealthCard from "./components/HealthCard";

const USER = { name: "Admin", sub: "Platform operator", initials: "AD" };

export default function AdminDashboard({ path = "/admin" }) {
  const {
    users: rawUsers,
    partners: rawPartners,
    summary,
    counties,
    alerts,
    waste,
    error,
    loading,
    live,
    setUserStatus,
    setPartnerStatus,
    resolveAlert,
    reload,
  } = useAdminData();

  const notifications = useNotifications();
  const [active, setActive] = useState("overview");
  const [bellOpen, setBellOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // One shape for both feeds, so the panels below never have to care whether
  // the row came from the API or from the sample fixtures.
  const users = useMemo(() => rawUsers.map(shapeUser), [rawUsers]);
  const partners = useMemo(() => rawPartners.map(shapePartner), [rawPartners]);

  // The account list holds every role on the platform. The farmer table shows
  // the farmers; the partner accounts are offered as link targets.
  const farmers = useMemo(() => users.filter((u) => u.role === "farmer"), [users]);
  const accounts = useMemo(() => users.filter((u) => u.role !== "farmer"), [users]);

  const totals = useMemo(() => {
    const activeUsers = farmers.filter((u) => u.status === "Active").length;
    const pendingUsers = farmers.filter((u) => u.status === "Pending").length;
    const pendingPartners = partners.filter((p) => p.status === "Pending").length;
    const sampleTons = farmers.reduce((s, u) => s + u.tons, 0);

    return {
      farmers: summary?.farmers ?? farmers.length,
      active: activeUsers,
      pendingUsers,
      pendingPartners,
      farms: summary?.farms ?? farmers.reduce((s, u) => s + u.farms, 0),
      areaHa: summary ? `${summary.areaHa} ha` : "—",
      tons: summary ? Number(summary.expectedKg || 0) / 1000 : sampleTons,
      matchRequests: summary?.matchRequests ?? 0,
      pendingMatches: summary?.pendingMatches ?? 0,
      partners: summary?.partners ?? partners.length,
      linkedPartners: partners.filter((p) => p.userId).length,
      counties: new Set(farmers.map((u) => u.county)).size,
      pendingApprovals: summary
        ? Number(summary.pendingFarmers || 0) + Number(summary.pendingPartners || 0)
        : pendingUsers + pendingPartners,
    };
  }, [farmers, partners, summary]);

  const kpis = useMemo(
    () => [
      {
        icon: UsersRound,
        label: "Total farmers",
        value: totals.farmers,
        hint: `${totals.active} active`,
        tone: "brand",
      },
      {
        icon: Tractor,
        label: "Registered farms",
        value: totals.farms,
        hint: `across ${totals.counties} counties`,
        tone: "teal",
      },
      {
        icon: Scale,
        label: "Expected harvest",
        value: totals.tons,
        unit: "t",
        decimals: 1,
        hint: "all farmers",
        tone: "gold",
      },
      {
        icon: Clock3,
        label: "Pending approvals",
        value: totals.pendingApprovals,
        hint: `${totals.pendingUsers} farmers, ${totals.pendingPartners} partners`,
        tone: "violet",
      },
      {
        icon: TriangleAlert,
        label: "Open alerts",
        value: alerts.length,
        hint: alerts.length ? "needs review" : "all clear",
        tone: alerts.length ? "red" : "brand",
      },
    ],
    [totals, alerts.length],
  );

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

  const handleUserStatus = async (user, status) => {
    setBusyId(`user:${user.id}`);
    try {
      await setUserStatus(user.id, status);
      const label = titleStatus(status).toLowerCase();
      if (live) toast.success(`${user.name} is now ${label}`);
      else toast.info(`${user.name} is now ${label} — sample data only, not saved to the server`);
    } catch (e) {
      toast.error(e.message || "Could not update that farmer");
    } finally {
      setBusyId(null);
    }
  };

  const handlePartnerStatus = async (partner, status) => {
    setBusyId(`partner:${partner.id}`);
    try {
      await setPartnerStatus(partner.id, status);
      const label = titleStatus(status).toLowerCase();
      if (live) toast.success(`${partner.name} ${label}`);
      else toast.info(`${partner.name} ${label} — sample data only, not saved to the server`);
    } catch (e) {
      toast.error(e.message || "Could not update that partner");
    } finally {
      setBusyId(null);
    }
  };

  const handleResolve = (id) => {
    resolveAlert(id);
    toast.success("Alert resolved");
  };

  const handleLinkAccount = async (partner, userId) => {
    setBusyId(`partner:${partner.id}`);
    try {
      await setPartnerStatus(partner.id, undefined, userId);
      const account = accounts.find((a) => a.id === userId);
      toast.success(`${partner.name} linked to ${account?.name ?? "an account"}`);
    } catch (e) {
      toast.error(e.message || "Could not link that account");
    } finally {
      setBusyId(null);
    }
  };

  const crumbs = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Admin console" },
  ];

  return (
    <Shell
      nav={nav}
      active={active}
      onNavigate={jump}
      title="Admin console"
      subtitle="Platform overview for MAVUNO Green Grid"
      user={USER}
      path={path}
      breadcrumbs={crumbs}
      alerts={notifications.unread}
      onBell={() => setBellOpen((v) => !v)}
      actions={
        <Badge tone={live ? "success" : "warning"} dot>
          {live ? "Live" : "Sample data"}
        </Badge>
      }
    >
      {bellOpen && (
        <NotificationsPopover
          notifications={notifications}
          onClose={() => setBellOpen(false)}
        />
      )}

      <div className="space-y-6 pb-12">
        {/* Why the console is showing what it is showing */}
        {error && (
          <div
            className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800"
            role="status"
          >
            <Badge tone="warning">Sample data</Badge>
            <span className="min-w-0 flex-1">{error}</span>
            <Button size="sm" variant="outline" icon={RefreshCw} onClick={reload}>
              Retry
            </Button>
          </div>
        )}

        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PlatformSummaryChart totals={totals} live={live} />
          <CountyRiskChart counties={counties} live={live} />
          <WasteChart data={waste} />
          <StatusDonut users={farmers} live={live} />
        </div>

        <div id="farmers" className="scroll-mt-24">
          <FarmersTable users={farmers} onStatus={handleUserStatus} busyId={busyId} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PartnerMixChart partners={partners} live={live} />
          <div id="partners" className="scroll-mt-24">
            <PartnersCard
              partners={partners}
              accounts={accounts}
              onDecide={handlePartnerStatus}
              onLink={handleLinkAccount}
              busyId={busyId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div id="alerts" className="scroll-mt-24">
            <AlertsCard alerts={alerts} onResolve={handleResolve} />
          </div>
          <div id="health" className="scroll-mt-24">
            <HealthCard />
          </div>
        </div>

        {loading && (
          <p className="flex items-center justify-center gap-2 pb-4 text-xs font-medium text-muted-foreground">
            <RefreshCw size={13} className="animate-spin" aria-hidden="true" /> Syncing with the
            platform…
          </p>
        )}
      </div>
    </Shell>
  );
}
