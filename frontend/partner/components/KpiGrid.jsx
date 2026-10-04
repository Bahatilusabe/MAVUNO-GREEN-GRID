import { CircleDollarSign, Inbox, Package, Scale } from "lucide-react";
import { fmt } from "../../shared/utils";

export default function KpiGrid({ stats }) {
  const kpis = [
    [Inbox, "New requests", stats.pending, "awaiting your decision"],
    [
      Package,
      "Capacity used",
      `${stats.util}%`,
      `${fmt(stats.remaining)} kg free`,
    ],
    [
      Scale,
      "Delivered volume",
      `${fmt(stats.deliveredKg)} kg`,
      "completed orders",
    ],
    [
      CircleDollarSign,
      "Revenue",
      `KES ${fmt(stats.revenue)}`,
      "from delivered orders",
    ],
  ];
  return (
    <div className="pp-kpis">
      {kpis.map(([Icon, label, value, sub]) => (
        <div key={label} className="pp-card pp-kpi">
          <span className="pp-ico">
            <Icon aria-hidden="true" size={20} />
          </span>
          <div>
            <small>{label}</small>
            <strong>{value}</strong>
            <small>{sub}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
