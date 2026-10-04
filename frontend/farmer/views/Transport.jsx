import { useState } from "react";
import { toast } from "sonner";
import { Truck, Boxes, Banknote, TriangleAlert } from "lucide-react";
import { StatCard } from "../components/page-parts";
import { REQUESTS, STATS, TRENDS } from "./transport/data";
import MapCard from "./transport/MapCard";
import PlanCard from "./transport/PlanCard";
import RequestsTable from "./transport/RequestsTable";
import Deliveries from "./transport/Deliveries";
import QuickActions from "./transport/QuickActions";

const deliveries = REQUESTS.filter((r) => r.stage !== undefined);
const atRisk = REQUESTS.filter((r) => r.atRisk && r.status === "Pending").length;

export default function Transport({ go }) {
  const [selected, setSelected] = useState(deliveries[0]?.id);

  const view = (r) => {
    if (r.stage === undefined) {
      toast.info(`${r.crop}: waiting for a transporter`);
      return;
    }
    setSelected(r.id);
    document.getElementById("deliveries")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="pg">
      <div className="pg-stats">
        <StatCard icon={Truck} tone="green" label="Active Deliveries" value={deliveries.length} trend={TRENDS.active} />
        <StatCard icon={Boxes} tone="blue" label="Available Capacity" value={STATS.capacity} trend={TRENDS.capacity} />
        <StatCard icon={Banknote} tone="green" label="Transport Cost Saved" value={STATS.saved} trend={TRENDS.saved} />
        <StatCard icon={TriangleAlert} tone="red" label="Deliveries at Risk" value={atRisk} trend={TRENDS.risk} down danger />
      </div>
      <div className="pg-two map">
        <MapCard />
        <PlanCard />
      </div>
      <RequestsTable requests={REQUESTS} onView={view} />
      <div className="pg-two wide">
        <Deliveries deliveries={deliveries} selectedId={selected} onSelect={setSelected} />
        <QuickActions go={go} />
      </div>
    </div>
  );
}