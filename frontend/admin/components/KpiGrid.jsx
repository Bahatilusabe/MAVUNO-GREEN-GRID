import { cls } from "../../shared/utils";

export default function KpiGrid({ kpis }) {
  return (
    <div className="ad-kpis">
      {kpis.map(([Icon, label, value, sub, danger]) => (
        <div key={label} className={cls("ad-card ad-kpi", danger && "danger")}>
          <span className="ad-ico"><Icon aria-hidden="true" size={20} /></span>
          <div><small>{label}</small><strong>{value}</strong><small>{sub}</small></div>
        </div>
      ))}
    </div>
  );
}