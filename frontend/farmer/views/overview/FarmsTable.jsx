import { CalendarDays, Tractor } from "lucide-react";
import { riskClass } from "../../constants";
import { Thumb } from "../../components/ui";

export default function FarmsTable({ farms, onOpen, go }) {
  return (
    <section className="card">
      <h3 className="ov-title">
        <Tractor aria-hidden="true" size={18} /> My Farms
        <button className="ov-link" onClick={() => go("farms")}>View all farms →</button>
      </h3>
      <div className="ov-farms-head"><span>Farm / Crop</span><span>Harvest Date</span><span>Risk Level</span></div>
      {farms.map((f) => (
        <button key={f.id} className="ov-farm" onClick={() => onOpen(f.id)}>
          <span className="ov-farm-id">
            <Thumb crop={f.crop} size={44} />
            <span><strong>{f.name}</strong><small>{f.crop}</small></span>
          </span>
          <span className="ov-harvest-date"><CalendarDays aria-hidden="true" size={15} /> {f.harvest}</span>
          <span className={riskClass(f.risk)}>{f.risk} Risk</span>
        </button>
      ))}
    </section>
  );
}