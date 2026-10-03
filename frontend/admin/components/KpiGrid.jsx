import { cls } from "../../shared/utils";

export default function KpiGrid({ kpis }) {
  return (
    <div className="ad-kpis">
      {kpis.map(([icon, label, value, sub, danger]) => (
        <div key={label} className={cls("ad-card ad-kpi", danger && "danger")}>
          <span className="ad-ico">{icon}</span>
          <div><small>{label}</small><strong>{value}</strong><small>{sub}</small></div>
        </div>
      ))}
    </div>
  );
}