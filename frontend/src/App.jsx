import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { Handshake, Sprout, Tractor, Truck, ChevronRight } from "lucide-react";
import { Toaster } from "sonner";
import Loader from "../shared/Loader";

const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const FarmerPortal = lazy(() => import("../farmer/FarmerPortal"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const PartnerPortal = lazy(() => import("../partner/PartnerPortal"));

const FARMER_VIEWS = ["overview", "farms", "crops", "opportunities", "recs", "market", "storage", "transport", "weather", "impact", "messages", "settings"];

const LINKS = [
  ["/", "Home"],
  ["/dashboard", "Farmer dashboard"],
  ["/farmer", "Farmer portal"],
  ["/admin", "Admin"],
  ["/partner", "Partner"],
];

const subscribe = (cb) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getPath = () => window.location.hash.replace(/^#/, "").replace(/\/+$/, "") || "/";
const navigate = (to) => { window.location.hash = to; };

function Home() {
  const cards = [
    [Sprout, "Farmer dashboard", "Overview of farms, forecasts and alerts", "/dashboard"],
    [Tractor, "Farmer portal", "Farms, crops, market, AI recommendations", "/farmer"],
    [Handshake, "Admin dashboard", "Users, partners, alerts, system health", "/admin"],
    [Truck, "Partner portal", "Requests, orders, capacity and pricing", "/partner"],
  ];
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-2xl shadow-xs">
            <Sprout aria-hidden="true" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">MAVUNO Green Grid</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium">Pick a view to open and explore the agricultural platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {cards.map(([Icon, title, text, to]) => (
            <a 
              key={to} 
              href={`#${to}`} 
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-50 text-green-700 rounded-xl group-hover:bg-green-700 group-hover:text-white transition-colors">
                  <Icon aria-hidden="true" size={24} />
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="space-y-1">
                <strong className="text-base font-bold text-gray-900 group-hover:text-green-800 transition-colors block">{title}</strong>
                <small className="text-xs text-gray-500 font-medium block leading-relaxed">{text}</small>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

function Switcher({ path }) {
  return (
    <details className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 text-xs font-semibold group">
      <summary className="cursor-pointer px-3 py-1.5 text-gray-700 hover:text-green-800 flex items-center gap-2 list-none">
        <span>Switch view</span>
      </summary>
      <nav aria-label="Switch view" className="pt-2 mt-2 border-t border-gray-100 flex flex-col space-y-1">
        {LINKS.map(([to, label]) => {
          const isActive = (to === "/" ? path === "/" : path.startsWith(to));
          return (
            <a 
              key={to} 
              href={`#${to}`} 
              aria-current={isActive ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </details>
  );
}

export default function App() {
  const path = useSyncExternalStore(subscribe, getPath, () => "/");
  useEffect(() => { window.scrollTo(0, 0); }, [path]);

  const [, root, sub] = path.split("/");
  let page;
  switch (root) {
    case "dashboard":
      page = <Dashboard userName="Samuel" onNavigate={(v) => navigate(`/farmer/${v}`)} />;
      break;
    case "farmer": {
      const view = FARMER_VIEWS.includes(sub) ? sub : "overview";
      page = <FarmerPortal key={view} initialView={view} />;
      break;
    }
    case "admin": page = <AdminDashboard />; break;
    case "partner": page = <PartnerPortal />; break;
    default: page = <Home />;
  }

  return (
    <>
      <Suspense fallback={<Loader className="system-loader--page" />}>{page}</Suspense>
      <Toaster position="bottom-right" richColors closeButton />
      {path !== "/" && <Switcher path={path} />}
    </>
  );
}