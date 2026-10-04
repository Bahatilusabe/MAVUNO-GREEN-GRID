import { Truck } from "lucide-react";
import { cls, fmt } from "../../../shared/utils";
import { STEPS } from "./data";

export default function Deliveries({ deliveries, selectedId, onSelect }) {
  const d = deliveries.find((x) => x.id === selectedId) || deliveries[0];
  return (
    <section className="card" id="deliveries">
      <h3>My Deliveries</h3>
      {!d ? (
        <p className="pg-note">No active deliveries.</p>
      ) : (
        <>
          <div className="pg-chips" role="tablist">
            {deliveries.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === d.id} className={cls("tab", x.id === d.id && "active")} onClick={() => onSelect(x.id)}>
                {x.crop}
              </button>
            ))}
          </div>
          <div className="pg-del-head">
            <span className="pg-mini lg"><Truck size={22} aria-hidden="true" /></span>
            <div>
              <strong>{d.crop} – {fmt(d.kg)} kg</strong>
              <small>{d.from} → {d.to}</small>
              <small>{d.truck ? `Truck ${d.truck}` : "Truck to be assigned"}</small>
            </div>
          </div>
          <div className="pg-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={cls("pg-step", i < d.stage && "done", i === d.stage && "current")}>
                <span className="pg-dot" />
                <strong>{s}</strong>
                <small>{d.times[i] || "–"}</small>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}