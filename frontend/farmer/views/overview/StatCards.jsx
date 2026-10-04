import { AlertTriangle, Banknote, Sprout, Tractor } from "lucide-react";
import { cls, fmt } from "../../../shared/utils";
import { STAT_TRENDS, VALUE_PROTECTED } from "./data";

export default function StatCards({ m }) {
  const cards = [
    [Tractor, "My Farms", m.count, STAT_TRENDS.farms, false],
    [Sprout, "Expected Harvest", `${m.tons.toFixed(1)} t`, STAT_TRENDS.harvest, false],
    [AlertTriangle, "At-Risk Produce", `${(m.exposedKg / 1000).toFixed(1)} t`, STAT_TRENDS.risk, m.exposedKg > 0],
    [Banknote, "Value Protected", `KES ${fmt(VALUE_PROTECTED)}`, STAT_TRENDS.value, false],
  ];
  return (
    <div className="ov-stats">
      {cards.map(([Icon, label, value, trend, warn]) => (
        <div key={label} className={cls("card ov-stat", warn && "warn")}>
          <span className="ov-stat-ico"><Icon aria-hidden="true" size={20} /></span>
          <div>
            <small>{label}</small>
            <strong>{value}</strong>
            <span className={cls("ov-delta", warn && "bad")}>{trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}