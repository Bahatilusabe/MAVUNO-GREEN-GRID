import { Ruler, Scale, Tractor, TriangleAlert } from "lucide-react";
import { cls } from "../../shared/utils";

export default function KpiGrid({ totals, onNavigate }) {
  const kpis = [
    [Tractor, "Total farms", totals.farms, "farms"],
    [Ruler, "Total area", `${totals.area} ha`, "farms"],
    [Scale, "Expected harvest", `${totals.tons} t`, "crops"],
    [TriangleAlert, "High risk crops", totals.high, "recs", totals.high > 0],
  ];
  return (
    <div className="db-kpis">
      {kpis.map(([Icon, label, value, to, danger]) => (
        <button
          key={label}
          className={cls("db-card db-kpi", danger && "danger")}
          onClick={() => onNavigate(to)}
        >
          <span className="db-ico">
            <Icon aria-hidden="true" size={20} />
          </span>
          <div>
            <small>{label}</small>
            <strong>{value}</strong>
          </div>
        </button>
      ))}
    </div>
  );
}
