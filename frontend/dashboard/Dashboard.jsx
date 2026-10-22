import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  CloudSun,
  Hand,
  Link2,
  Plus,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Sprout,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import Shell from "../shared/Shell";
import Assistant from "../shared/Assistant";
import NotificationsPopover from "../shared/NotificationsPopover";
import { navigate } from "../shared/nav";
import { INITIAL_FARMS as FARMS, RECS } from "../shared/data";
import { useOverview } from "../src/hooks/useOverview";
import { useOpportunities } from "../src/hooks/useOpportunities";
import { useMatches } from "../src/hooks/useMatches";
import { useNotifications } from "../src/hooks/useNotifications";
import { getUser } from "../src/lib/api";
import Badge from "../shared/ui/Badge";
import Button from "../shared/ui/Button";
import { Reveal } from "../shared/ui/Motion";
import { toCropRows, toSampleRows, worstAlert } from "./model";
import KpiGrid from "./components/KpiGrid";
import ForecastCard from "./components/ForecastCard";
import CropsCard from "./components/CropsCard";
import RecsCard from "./components/RecsCard";
import OpportunitiesCard from "./components/OpportunitiesCard";
import PricesCard from "./components/PricesCard";
import WeatherCard from "./components/WeatherCard";
import ActivityCard from "./components/ActivityCard";

/** The sections of the page, in the order the sidebar lists them. */
const SECTIONS = [
  { key: "overview", label: "Overview", icon: Sprout },
  { key: "forecast", label: "Harvest forecast", icon: TrendingUp },
  { key: "crops", label: "My crops", icon: Activity },
  { key: "recs", label: "Recommendations", icon: Sparkles },
  { key: "opportunities", label: "Opportunities", icon: Link2 },
  { key: "prices", label: "Market prices", icon: ShoppingCart },
  { key: "weather", label: "Weather", icon: CloudSun },
];

export default function Dashboard({ path = "/dashboard", onNavigate = () => {} }) {
  const { data, error, loading, reload } = useOverview();
  const { opportunities, isLive: opportunitiesLive } = useOpportunities();
  const { requestFor } = useMatches();
  const notifications = useNotifications();

  const [dismissed, setDismissed] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [section, setSection] = useState("overview");
  const observerRef = useRef(null);

  // The signed-in farmer, not a hard-coded sample name.
  const user = useMemo(() => {
    const stored = getUser();
    const name = stored?.name || "Samuel";
    return {
      name,
      sub: stored?.county ? `${stored.county} County` : "Kirinyaga County",
      initials: name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    };
  }, []);

  const live = Boolean(data?.stats);

  const totals = useMemo(() => {
    const stats = data?.stats;
    if (stats) {
      return {
        farms: Number(stats.farms || 0),
        area: Number(stats.areaHa || 0),
        tons: Number(stats.expectedKg || 0) / 1000,
        high: Number(stats.highRiskCrops || 0),
        atRiskKg: Number(stats.atRiskKg || 0),
        impact: stats.aiGlobalImpact || null,
      };
    }

    return {
      farms: FARMS.length,
      area: FARMS.reduce((s, f) => s + f.area, 0),
      tons: FARMS.reduce((s, f) => s + f.kg, 0) / 1000,
      high: FARMS.filter((f) => f.risk === "High").length,
      atRiskKg: 0,
      impact: null,
    };
  }, [data]);

  const crops = useMemo(() => toCropRows(data) ?? toSampleRows(FARMS), [data]);

  const recs = useMemo(() => RECS.filter((r) => !dismissed.includes(r.id)), [dismissed]);

  // The worst surplus alert, chosen by risk score rather than by string order.
  const alert = useMemo(() => worstAlert(data?.aiSurplusAlerts), [data]);
  const showFallbackAlert = !live && totals.high > 0 && recs.length > 0;

  // Keep the sidebar in step with the section in view.
  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(`dash-${s.key}`)).filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSection(visible.target.id.replace("dash-", ""));
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.4] },
    );

    nodes.forEach((node) => observer.observe(node));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [live]);

  const jump = useCallback((key) => {
    const node = document.getElementById(`dash-${key}`);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    else onNavigate(key);
  }, [onNavigate]);

  const dismissRec = useCallback((id) => {
    setDismissed((cur) => (cur.includes(id) ? cur : [...cur, id]));
  }, []);

  const crumbs = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Farmer dashboard" },
  ];

  return (
    <Shell
      nav={SECTIONS.map((s) => [s.key, s.label, s.icon])}
      active={section}
      onNavigate={jump}
      title="Farmer dashboard"
      subtitle="Signals, forecasts and market signals across your grid"
      user={user}
      path={path}
      breadcrumbs={crumbs}
      alerts={notifications.unread}
      onBell={() => setBellOpen((v) => !v)}
      aside={<Assistant />}
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
        {/* Greeting */}
        <Reveal index={0}>
          <section className="brand-panel p-5 sm:p-6">
            <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Good day, {user.name.split(" ")[0]}
                  <Hand className="inline-block text-amber-300" aria-hidden="true" size={22} />
                </h2>
                <p className="text-xs font-medium text-white/75 sm:text-sm">
                  Here is how your farms are doing this week.
                </p>
              </div>

              <Button
                variant="gold"
                icon={Plus}
                onClick={() => onNavigate("farms")}
                className="self-start sm:self-auto"
              >
                Add farm
              </Button>
            </div>
          </section>
        </Reveal>

        {/* Sample-data notice */}
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

        {/* Surplus alert */}
        <section id="dash-overview" className="scroll-mt-24">
          {alert ? (
            <div
              className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-xs sm:flex-row sm:items-center sm:p-5"
              role="alert"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-100 text-red-600"
                  aria-hidden="true"
                >
                  <TriangleAlert size={20} />
                </span>
                <div className="space-y-1">
                  <strong className="block text-sm font-bold text-red-900">
                    Surplus alert · Week {alert.week}
                  </strong>
                  <p className="text-xs leading-relaxed text-red-700">{alert.ai_explanation}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs font-semibold text-red-800">
                    <span>
                      {Number(alert.surplus_t ?? 0).toLocaleString("en-KE", {
                        maximumFractionDigits: 1,
                      })}{" "}
                      t surplus
                    </span>
                    {alert.revenue_kes != null && (
                      <span>· KES {Number(alert.revenue_kes).toLocaleString("en-KE")} revenue</span>
                    )}
                    <span>· Risk score {Number(alert.risk ?? 0).toFixed(2)} / 1</span>
                  </div>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => onNavigate("recs")}
                className="self-start sm:self-auto"
              >
                View plan
              </Button>
            </div>
          ) : showFallbackAlert ? (
            <div
              className="flex flex-col justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-xs sm:flex-row sm:items-center sm:p-5"
              role="alert"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="mt-0.5 grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-100 text-red-600"
                  aria-hidden="true"
                >
                  <TriangleAlert size={20} />
                </span>
                <div className="space-y-1">
                  <strong className="block text-sm font-bold text-red-900">
                    High surplus risk on Tomatoes
                  </strong>
                  <p className="text-xs leading-relaxed text-red-700">
                    1,800 kg may go unsold. Act within 72 hours.
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => onNavigate("recs")}
                className="self-start sm:self-auto"
              >
                View plan
              </Button>
            </div>
          ) : null}

          {/* KPIs */}
          <div className="mt-6">
            <KpiGrid totals={totals} live={live} />
          </div>
        </section>

        {/* Forecast + crops */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div id="dash-forecast" className="scroll-mt-24 lg:col-span-7">
            <Reveal index={1}>
              <ForecastCard />
            </Reveal>
          </div>
          <div id="dash-crops" className="scroll-mt-24 lg:col-span-5">
            <Reveal index={2}>
              <CropsCard crops={crops} onNavigate={onNavigate} />
            </Reveal>
          </div>
        </div>

        {/* Recommendations + opportunities */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div id="dash-recs" className="scroll-mt-24 lg:col-span-7">
            <Reveal index={1}>
              <RecsCard recs={recs} onDismiss={dismissRec} onNavigate={onNavigate} />
            </Reveal>
          </div>
          <div id="dash-opportunities" className="scroll-mt-24 lg:col-span-5">
            <Reveal index={2}>
              <OpportunitiesCard
                opportunities={opportunities}
                live={opportunitiesLive}
                requestFor={requestFor}
                onNavigate={onNavigate}
              />
            </Reveal>
          </div>
        </div>

        {/* Prices, weather, activity */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div id="dash-prices" className="scroll-mt-24">
            <PricesCard onNavigate={onNavigate} />
          </div>
          <div id="dash-weather" className="scroll-mt-24">
            <WeatherCard />
          </div>
          <ActivityCard activity={data?.activity} />
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
