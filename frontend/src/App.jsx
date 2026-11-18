import { lazy, Suspense, useEffect, useSyncExternalStore } from "react";
import { Toaster } from "sonner";
import Loader from "../shared/Loader";
import { navigate } from "../shared/nav";
import { useTheme } from "./theme/useTheme";

const Landing = lazy(() => import("../landing/Landing"));
const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const FarmerPortal = lazy(() => import("../farmer/FarmerPortal"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const PartnerPortal = lazy(() => import("../partner/PartnerPortal"));
const JudgeModeDemo = lazy(() => import("../shared/JudgeModeDemo"));

const FARMER_VIEWS = [
  "overview",
  "farms",
  "crops",
  "opportunities",
  "deals",
  "recs",
  "market",
  "storage",
  "transport",
  "weather",
  "impact",
  "messages",
  "settings"
];

const LINKS = [
  ["#/", "Home"],
  ["#/judge", "Live Judge Demo"],
  ["#/dashboard", "Farmer dashboard"],
  ["#/farmer", "Farmer portal"],
  ["#/admin", "Admin"],
  ["#/partner", "Partner"],
];

const subscribe = (cb) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

const getPath = () => {
  const hash = window.location.hash || "#/";
  return hash.replace(/^#\/?/, "").trim(); // returns "" for root, "judge" for #/judge
};

const navigate = (to) => {
  window.location.hash = to.startsWith("#") ? to : `#${to}`;
};

function Home() {
  return <Landing />;
}

function Switcher({ activeKey }) {
  return (
    <details className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-2 text-xs font-semibold group">
      <summary className="cursor-pointer px-3 py-1.5 text-gray-700 hover:text-green-800 flex items-center gap-2 list-none">
        <span>Switch view</span>
      </summary>
      <nav aria-label="Switch view" className="pt-2 mt-2 border-t border-gray-100 flex flex-col space-y-1">
        {LINKS.map(([to, label]) => {
          const key = to.replace(/^#\/?/, "");
          const isActive = key === "" ? activeKey === "" : activeKey.startsWith(key);
          return (
            <a
              key={to}
              href={to}
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
  const { resolved } = useTheme();
  const route = useSyncExternalStore(subscribe, getPath, () => "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const [root, sub] = route.split("/");

  let page;
  switch (root) {
    case "judge":
      page = <JudgeModeDemo />;
      break;
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
      break;
  }

  return (
    <>
      <Suspense fallback={<Loader className="system-loader--page" />}>{page}</Suspense>
      <Toaster theme={resolved} position="bottom-right" richColors closeButton />
      {root !== "" && <Switcher activeKey={root} />}
    </>
  );
}
