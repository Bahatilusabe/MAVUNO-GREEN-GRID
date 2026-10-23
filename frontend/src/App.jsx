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

const FARMER_VIEWS = ["overview", "farms", "crops", "opportunities", "recs", "market", "chat", "storage", "transport", "weather", "impact", "messages", "settings"];

const subscribe = (cb) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const getPath = () => window.location.hash.replace(/^#/, "").replace(/\/+$/, "") || "/";

function Home() {
  return <Landing />;
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