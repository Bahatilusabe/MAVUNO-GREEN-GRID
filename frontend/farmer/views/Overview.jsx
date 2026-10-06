import { useMemo } from "react";
import { Sprout, ShieldCheck, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import EmptyState from "../../shared/EmptyState";
import StatCards from "./overview/StatCards";
import RiskWatch from "./overview/RiskWatch";
import FarmsTable from "./overview/FarmsTable";
import TodayRecs from "./overview/TodayRecs";
import HarvestOutlook from "./overview/HarvestOutlook";
import GridActivity from "./overview/GridActivity";
import EnvImpact from "./overview/EnvImpact";

const EXPOSED_SHARE = 0.8;

export default function Overview({ farms, go, onOpenFarm }) {
  const m = useMemo(() => {
    const high = farms.filter((f) => f.risk === "High");
    return {
      count: farms.length,
      tons: farms.reduce((s, f) => s + f.kg, 0) / 1000,
      exposedKg: Math.round(high.reduce((s, f) => s + f.kg, 0) * EXPOSED_SHARE),
      topFarm: high[0],
    };
  }, [farms]);

  if (!farms.length) {
    return (
      <EmptyState
        icon={Sprout}
        title="No farms yet"
        text="Add your first farm to see forecasts, risk alerts and buyer matches."
        action="Add a farm"
        onAction={() => go("farms")}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Profile Summary Strip (Added to Overview) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-800 text-white flex items-center justify-center font-bold text-lg shadow-inner">
            SK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">Samuel Kamau</h3>
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck size={12} /> Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-green-600" /> Kirinyaga County</span>
              <span className="flex items-center gap-1"><Phone size={12} className="text-green-600" /> +254 712 345 678</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => go("settings")} 
          className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
        >
          Manage Profile <ArrowRight size={14} />
        </button>
      </div>

      {/* 1. Stat Summary Cards */}
      <StatCards m={m} />

      {/* 2. AI Risk Watch Banner */}
      <RiskWatch m={m} go={go} />

      {/* 3. Middle Section: Farms Table & Today's Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <FarmsTable farms={farms} onOpen={onOpenFarm} go={go} />
        </div>
        <div className="lg:col-span-5">
          <TodayRecs go={go} />
        </div>
      </div>

      {/* 4. Bottom Section: Outlook, Activity & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HarvestOutlook />
        <GridActivity />
        <EnvImpact />
      </div>
    </div>
  );
}