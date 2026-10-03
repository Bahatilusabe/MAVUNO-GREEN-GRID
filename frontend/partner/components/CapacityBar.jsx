import { fmt } from "../../shared/utils";

export default function CapacityBar({ stats, capacity }) {
  return (
    <div className="pp-card">
      <div className="pp-row"><strong className="grow">Capacity today</strong><small>{fmt(stats.load)} / {fmt(capacity)} kg</small></div>
      <div className="pp-bar"><div className={stats.util >= 85 ? "hi" : stats.util >= 60 ? "md" : "lo"} style={{ width: `${stats.util}%` }} /></div>
    </div>
  );
}