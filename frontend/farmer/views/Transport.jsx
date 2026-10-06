import { useState } from "react";
import { toast } from "sonner";
import { Truck, Boxes, Banknote, TriangleAlert, TrendingUp, TrendingDown } from "lucide-react";
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

  const statCardsData = [
    { label: "Active Deliveries", value: deliveries.length, trend: TRENDS.active, icon: Truck, warn: false },
    { label: "Available Capacity", value: STATS.capacity, trend: TRENDS.capacity, icon: Boxes, warn: false },
    { label: "Transport Cost Saved", value: STATS.saved, trend: TRENDS.saved, icon: Banknote, warn: false },
    { label: "Deliveries at Risk", value: atRisk, trend: TRENDS.risk, icon: TriangleAlert, warn: atRisk > 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stat Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map(({ label, value, trend, icon: Icon, warn }) => (
          <div 
            key={label} 
            className={`relative p-5 rounded-xl border bg-white shadow-sm flex items-start justify-between transition-all hover:shadow-md ${
              warn ? "border-red-300 bg-red-50/30" : "border-gray-200"
            }`}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
              <div className="flex items-center pt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  warn ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {warn ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {trend}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center justify-center ${
              warn ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
            }`}>
              <Icon aria-hidden="true" size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Map & Transport Plan Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MapCard />
        </div>
        <div className="lg:col-span-5">
          <PlanCard />
        </div>
      </div>

      {/* Requests Table */}
      <RequestsTable requests={REQUESTS} onView={view} />

      {/* Deliveries Tracker & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Deliveries deliveries={deliveries} selectedId={selected} onSelect={setSelected} />
        </div>
        <div className="lg:col-span-5">
          <QuickActions go={go} />
        </div>
      </div>
    </div>
  );
}