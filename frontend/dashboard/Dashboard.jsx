import { useState } from "react";
import "./Dashboard.css";
import { INITIAL_FARMS as FARMS, RECS } from "../shared/data";
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
  const recs = RECS.filter((r) => !dismissed.includes(r.id));

  return (
    <div className="db">
      <div className="db-main">
        <header className="db-head">
          <div>
            <h1>Good day, {userName} 👋</h1>
            <small>Here's how your farms are doing this week.</small>
          </div>
          <button className="db-btn" onClick={() => onNavigate("farms")}>＋ Add Farm</button>
        </header>

        {totals.high > 0 && recs.some((r) => r.id === 1) && (
          <div className="db-alert" role="alert">
            <span>🚨</span>
            <div className="grow"><strong>High surplus risk on Tomatoes</strong><small>1,800 kg may go unsold. Act within 72 hours.</small></div>
            <button className="db-btn sm" onClick={() => onNavigate("recs")}>View Plan</button>
          </div>
        )}

        <KpiGrid totals={totals} onNavigate={onNavigate} />
        <div className="db-grid2"><ForecastCard /><CropsCard onNavigate={onNavigate} /></div>
        <div className="db-grid2">
          <RecsCard recs={recs} onDismiss={(id) => setDismissed([...dismissed, id])} onNavigate={onNavigate} />
          <OpportunitiesCard onNavigate={onNavigate} />
        </div>
        <div className="db-grid3"><PricesCard onNavigate={onNavigate} /><WeatherCard /><ActivityCard /></div>
      </div>
      <Assistant className="db-card db-assistant" />
    </div>
  );
}