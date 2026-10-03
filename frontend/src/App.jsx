import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import "./App.css";

const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const FarmerPortal = lazy(() => import("../farmer/FarmerPortal"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const PartnerPortal = lazy(() => import("../partner/PartnerPortal"));

const FARMER_VIEWS = ["overview", "farms", "crops", "opportunities", "recs", "market", "storage", "transport", "impact", "messages", "settings"];

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
    ["🌱", "Farmer dashboard", "Overview of farms, forecasts and alerts", "/dashboard"],
    ["🚜", "Farmer portal", "Farms, crops, market, AI recommendations", "/farmer"],
    ["🛡️", "Admin dashboard", "Users, partners, alerts, system health", "/admin"],
    ["🚚", "Partner portal", "Requests, orders, capacity and pricing", "/partner"],
  ];
  return (
    <main className="app-home">
      <h1>🌿 MAVUNO Green Grid</h1>
      <p>Pick a view to open.</p>
      <div className="app-cards">
        {cards.map(([icon, title, text, to]) => (
          <a key={to} href={`#${to}`} className="app-card">
            <span>{icon}</span>
            <strong>{title}</strong>
            <small>{text}</small>
          </a>
        ))}
      </div>
    </main>
  );
}

function Switcher({ path }) {
  return (
    <details className="app-switcher">
      <summary>Switch view</summary>
      <nav aria-label="Switch view">
        {LINKS.map(([to, label]) => (
          <a key={to} href={`#${to}`} aria-current={(to === "/" ? path === "/" : path.startsWith(to)) ? "page" : undefined}>{label}</a>
        ))}
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
      <Suspense fallback={<div className="app-loading" role="status">Loading…</div>}>{page}</Suspense>
      {path !== "/" && <Switcher path={path} />}
    </>
  );
}