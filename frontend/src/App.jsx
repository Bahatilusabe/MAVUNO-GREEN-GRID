import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { Handshake, Sprout, Tractor, Truck, ChevronRight } from "lucide-react";
import { Toaster } from "sonner";
import Loader from "../shared/Loader";
import { VIEWS, navigate } from "../shared/nav";
import { Card } from "../shared/ui/Card";
import { Reveal } from "../shared/ui/Motion";
import { useTheme } from "./theme/useTheme";

const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const FarmerPortal = lazy(() => import("../farmer/FarmerPortal"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const PartnerPortal = lazy(() => import("../partner/PartnerPortal"));

const FARMER_VIEWS = ["overview", "farms", "crops", "opportunities", "recs", "market", "storage", "transport", "weather", "impact", "messages", "settings"];

const subscribe = (cb) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getPath = () => window.location.hash.replace(/^#/, "").replace(/\/+$/, "") || "/";

/** The four working areas of the platform, in the order a new user meets them. */
const PORTALS = [
  [Sprout, "Farmer dashboard", "Overview of farms, forecasts and alerts", "/dashboard"],
  [Tractor, "Farmer portal", "Farms, crops, market, AI recommendations", "/farmer"],
  [Handshake, "Admin dashboard", "Users, partners, alerts, system health", "/admin"],
  [Truck, "Partner portal", "Requests, orders, capacity and pricing", "/partner"],
];

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-sans sm:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-2xl bg-brand-50 p-3 text-brand-700">
            <Sprout aria-hidden="true" size={32} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            MAVUNO Green Grid
          </h1>
          <p className="text-sm font-medium text-muted-foreground sm:text-base">
            Pick an area to open. Every view shares the same data, navigation and charts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PORTALS.map(([Icon, title, text, to], i) => (
            <Reveal key={to} index={i}>
              <Card interactive className="group h-full">
                <a
                  href={`#${to}`}
                  className="flex h-full flex-col justify-between gap-4 focus-visible:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-700 group-hover:text-white">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <strong className="block text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-brand-800">
                      {title}
                    </strong>
                    <small className="block text-xs font-medium leading-relaxed text-muted-foreground">
                      {text}
                    </small>
                  </div>
                </a>
              </Card>
            </Reveal>
          ))}
        </div>

        <nav aria-label="All views" className="flex flex-wrap items-center justify-center gap-2">
          {VIEWS.map((view) => (
            <button
              key={view.path}
              type="button"
              onClick={() => navigate(view.path)}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}

export default function App() {
  const { resolved } = useTheme();
  const path = useSyncExternalStore(subscribe, getPath, () => "/");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  const [, root, sub] = path.split("/");
  let page;
  switch (root) {
    case "dashboard":
      page = <Dashboard path="/dashboard" onNavigate={(v) => navigate(`/farmer/${v}`)} />;
      break;
    case "farmer": {
      const view = FARMER_VIEWS.includes(sub) ? sub : "overview";
      page = <FarmerPortal key={view} initialView={view} />;
      break;
    }
    case "admin":
      page = <AdminDashboard />;
      break;
    case "partner":
      page = <PartnerPortal path="/partner" />;
      break;
    default:
      page = <Home />;
  }

  return (
    <>
      <Suspense fallback={<Loader className="system-loader--page" />}>{page}</Suspense>
      <Toaster theme={resolved} position="bottom-right" richColors closeButton />
    </>
  );
}