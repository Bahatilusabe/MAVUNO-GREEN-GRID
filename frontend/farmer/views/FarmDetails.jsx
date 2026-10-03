import { useState } from "react";
import { Cherry, Droplets, MapPin, Tractor, TrendingUp } from "lucide-react";
import { Tabs, Thumb, FakeMap } from "../components/ui";

const ACTIVITY = [
  [Cherry, "Tomato crop updated • 2 days ago"],
  [TrendingUp, "Harvest forecast updated • 4 days ago"],
  [Droplets, "Soil moisture reading • 6 days ago"],
  [Tractor, "Farm registered • 2 weeks ago"],
];

export default function FarmDetails({ farm, onBack, onForecast }) {
  const [tab, setTab] = useState("Overview");
  return (
    <>
      <button className="link" onClick={onBack}>
        ‹ Back to My Farms
      </button>
      <h2>{farm.name}</h2>
      <small className="farm-county">
        <MapPin aria-hidden="true" size={14} /> {farm.county} County
      </small>
      <Tabs
        tabs={["Overview", "Crops", "Soil & Water", "History"]}
        active={tab}
        onChange={setTab}
      />
      {tab === "Overview" ? (
        <div className="split">
          <div className="card">
            <div className="farm-hero">
              <Thumb crop={farm.crop} size={150} />
              <div className="mini-grid">
                <div>
                  <small>Total Area</small>
                  <strong>{farm.area} ha</strong>
                </div>
                <div>
                  <small>Farm Type</small>
                  <strong>{farm.type}</strong>
                </div>
                <div>
                  <small>Water Source</small>
                  <strong>{farm.water}</strong>
                </div>
                <div>
                  <small>Irrigation</small>
                  <strong>{farm.irrigation}</strong>
                </div>
              </div>
            </div>
            <h4>Farm Location</h4>
            <small>{farm.coords}</small>
            <FakeMap
              pins={[{ x: 50, y: 50, color: "#1e7a46", label: farm.name }]}
              height={150}
            />
            <button className="btn" onClick={onForecast}>
              View Harvest Forecast
            </button>
          </div>
          <div className="card">
            <h4>Recent Activity</h4>
            {ACTIVITY.map(([Icon, activity]) => (
              <div key={activity} className="row">
                <Icon aria-hidden="true" size={18} />
                <small className="grow">{activity}</small>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card empty">{tab} details coming soon.</div>
      )}
    </>
  );
}
