import { useEffect, useState } from "react";
import { Hand, TriangleAlert, Plus, ArrowRight } from "lucide-react";
import { fetchSurplusAlerts, INITIAL_FARMS as FARMS, RECS } from "../shared/data";
import { FARMER_NAV, FARMER_USER } from "../shared/nav";
import Shell from "../shared/Shell";
import Assistant from "../shared/Assistant";
import KpiGrid from "./components/KpiGrid";
import ForecastCard from "./components/ForecastCard";
import CropsCard from "./components/CropsCard";
import RecsCard from "./components/RecsCard";
import OpportunitiesCard from "./components/OpportunitiesCard";
import PricesCard from "./components/PricesCard";
import WeatherCard from "./components/WeatherCard";
import ActivityCard from "./components/ActivityCard";

const totals = {
  farms: FARMS.length,
  area: FARMS.reduce((s, f) => s + f.area, 0).toFixed(1),
  tons: (FARMS.reduce((s, f) => s + f.kg, 0) / 1000).toFixed(1),
  high: FARMS.filter((f) => f.risk === "High").length,
};

export default function Dashboard({ onNavigate = () => {}, userName = "Samuel" }) {
  const [dismissed, setDismissed] = useState([]);
  const [backendData, setBackendData] = useState(null);
  const [globalImpact, setGlobalImpact] = useState(null);
  
  const recs = RECS.filter((r) => !dismissed.includes(r.id));
  const liveAlert = backendData?.reduce(
    (highest, alert) => !highest || alert.risk > highest.risk ? alert : highest,
    null,
  );
  const showFallbackAlert = backendData === null && totals.high > 0 && recs.some((r) => r.id === 1);

  useEffect(() => {
    let active = true;
    fetchSurplusAlerts().then((response) => {
      if (!active || response?.status !== "success") return;
      setBackendData(Array.isArray(response.data) ? response.data : []);
      setGlobalImpact(response.global_impact ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Shell
      nav={FARMER_NAV}
      active=""
      onNavigate={onNavigate}
      title="Dashboard"
      subtitle="Your farms at a glance"
      user={FARMER_USER}
      alerts={2}
      aside={<Assistant />}
    >
      <div className="space-y-6 pb-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm bg-gradient-to-r from-green-50/50 to-white">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-950 flex items-center gap-2">
              Good day, {userName} <Hand className="text-amber-500 inline-block" aria-hidden="true" size={22} />
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Here's how your farms are doing this week.</p>
          </div>
          <button 
            className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 w-fit cursor-pointer" 
            onClick={() => onNavigate("farms")}
          >
            <Plus size={16} /> Add Farm
          </button>
        </div>

        {/* Live or Fallback Surplus Alert Banner */}
        {liveAlert ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs" role="alert">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl flex-shrink-0 mt-0.5">
                <TriangleAlert aria-hidden="true" size={20} />
              </div>
              <div className="space-y-1">
                <strong className="block text-sm font-bold text-red-900">
                  Surplus alert · Week {liveAlert.week}
                </strong>
                <p className="text-xs text-red-700 leading-relaxed">{liveAlert.ai_explanation}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-800 font-semibold pt-1">
                  <span>{Number(liveAlert.surplus_t).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t surplus</span>
                  {liveAlert.revenue_kes != null && (
                    <span>· KES {Number(liveAlert.revenue_kes).toLocaleString("en-KE")} revenue</span>
                  )}
                  <span>· Risk score: {Number(liveAlert.risk).toFixed(2)} / 1</span>
                </div>
              </div>
            </div>
            <button 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-2xs cursor-pointer self-start sm:self-center" 
              onClick={() => onNavigate("recs")}
            >
              View Plan <ArrowRight size={14} />
            </button>
          </div>
        ) : showFallbackAlert ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs" role="alert">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl flex-shrink-0 mt-0.5">
                <TriangleAlert aria-hidden="true" size={20} />
              </div>
              <div className="space-y-1">
                <strong className="block text-sm font-bold text-red-900">High surplus risk on Tomatoes</strong>
                <p className="text-xs text-red-700">1,800 kg may go unsold. Act within 72 hours.</p>
              </div>
            </div>
            <button 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 shadow-2xs cursor-pointer self-start sm:self-center" 
              onClick={() => onNavigate("recs")}
            >
              View Plan <ArrowRight size={14} />
            </button>
          </div>
        ) : null}

        {/* KPI Grid Section */}
        <KpiGrid totals={totals} globalImpact={globalImpact} onNavigate={onNavigate} />

        {/* Forecast & Crops Section (Grid 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ForecastCard />
          </div>
          <div className="lg:col-span-5">
            <CropsCard onNavigate={onNavigate} />
          </div>
        </div>

        {/* Recommendations & Opportunities Section (Grid 2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <RecsCard recs={recs} onDismiss={(id) => setDismissed([...dismissed, id])} onNavigate={onNavigate} />
          </div>
          <div className="lg:col-span-5">
            <OpportunitiesCard onNavigate={onNavigate} />
          </div>
        </div>

        {/* Prices, Weather & Activity Section (Grid 3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PricesCard onNavigate={onNavigate} />
          <WeatherCard />
          <ActivityCard />
        </div>

      </div>
    </Shell>
  );
}