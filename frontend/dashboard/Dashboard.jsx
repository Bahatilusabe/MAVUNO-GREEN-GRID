import { useEffect, useState } from "react";
import { Hand, TriangleAlert } from "lucide-react";
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
      aside={<Assistant className="sh-assist" />}
    >
      <div className="db">
        <div className="db-main">
          <header className="db-head">
            <div>
              <h1>Good day, {userName} <Hand aria-hidden="true" size={20} /></h1>
              <small>Here's how your farms are doing this week.</small>
            </div>
            <button className="db-btn" onClick={() => onNavigate("farms")}>＋ Add Farm</button>
          </header>

          {liveAlert ? (
            <div className="db-alert" role="alert">
              <TriangleAlert aria-hidden="true" size={20} />
              <div className="grow">
                <strong>Surplus alert · Week {liveAlert.week}</strong>
                <small>{liveAlert.ai_explanation}</small>
                <small>
                  {Number(liveAlert.surplus_t).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t surplus
                  {liveAlert.revenue_kes != null && ` · KES ${Number(liveAlert.revenue_kes).toLocaleString("en-KE")} revenue`}
                </small>
                <small>Risk score: {Number(liveAlert.risk).toFixed(2)} / 1</small>
              </div>
              <button className="db-btn sm" onClick={() => onNavigate("recs")}>View Plan</button>
            </div>
          ) : showFallbackAlert ? (
            <div className="db-alert" role="alert">
              <TriangleAlert aria-hidden="true" size={20} />
              <div className="grow"><strong>High surplus risk on Tomatoes</strong><small>1,800 kg may go unsold. Act within 72 hours.</small></div>
              <button className="db-btn sm" onClick={() => onNavigate("recs")}>View Plan</button>
            </div>
          ) : null}

          <KpiGrid totals={totals} globalImpact={globalImpact} onNavigate={onNavigate} />
          <div className="db-grid2"><ForecastCard /><CropsCard onNavigate={onNavigate} /></div>
          <div className="db-grid2">
            <RecsCard recs={recs} onDismiss={(id) => setDismissed([...dismissed, id])} onNavigate={onNavigate} />
            <OpportunitiesCard onNavigate={onNavigate} />
          </div>
          <div className="db-grid3"><PricesCard onNavigate={onNavigate} /><WeatherCard /><ActivityCard /></div>
        </div>
      </div>
    </Shell>
  );
}