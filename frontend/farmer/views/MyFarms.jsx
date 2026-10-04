import { Sprout } from "lucide-react";
import EmptyState from "../../shared/EmptyState";
import { riskClass } from "../constants";
import { KpiRow, Thumb, FakeMap } from "../components/ui";

export default function MyFarms({ farms, onOpen, onAdd }) {
  if (!farms.length) {
    return (
      <EmptyState
        icon={Sprout}
        title="No farms yet"
        text="Register a farm to start tracking harvests and risk."
        action="Add farm"
        onAction={onAdd}
      />
    );
  }

  const pins = farms.map((f, i) => ({ x: 25 + i * 22, y: 30 + (i % 2) * 30, color: f.risk === "High" ? "#dc2626" : "#1e7a46", label: f.name }));
  return (
    <div className="split farms-page">
      <div>
        <KpiRow farms={farms} />
        {farms.map((f) => (
          <div key={f.id} className="card farm-row">
            <Thumb crop={f.crop} size={84} />
            <div className="grow">
              <strong>{f.name}</strong>
              <small>{f.county} • {f.area} ha • {f.crop}</small>
              <small>Expected harvest: {(f.kg / 1000).toFixed(1)} t</small>
              <span className={riskClass(f.risk)}>Risk: {f.risk}</span>
            </div>
            <button className="btn btn-soft" onClick={() => onOpen(f.id)}>View Details ›</button>
          </div>
        ))}
        <button className="btn" onClick={onAdd}>＋ Add Farm</button>
      </div>
      <div>
        <div className="card">
          <FakeMap pins={pins} height={240} risk />
          <div className="legend"><i style={{ background: "#1e7a46" }} />Your Farms <i style={{ background: "#dc2626" }} />Risk Area <i style={{ background: "#7cc79a" }} />Other Farms</div>
        </div>
        <div className="card">
          <h3>Farm Performance</h3>
          {farms.map((f) => (
            <div key={f.id} className="perf">
              <span>{f.name.replace(" Farm", "")}</span>
              <div className="bar"><div style={{ width: `${f.perf}%` }} /></div>
              <b>{f.perf}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}