import { CircleDollarSign, Inbox, Package, Scale } from "lucide-react";
import { fmt } from "../../shared/utils";
import Stat from "../../shared/ui/Stat";
import { Reveal } from "../../shared/ui/Motion";

export default function KpiGrid({ stats }) {
  const kpis = [
    { icon: Inbox, label: "New requests", value: stats.pending, hint: "awaiting your decision", tone: "brand" },
    { icon: Package, label: "Capacity used", value: stats.util, unit: "%", hint: `${fmt(stats.remaining)} kg free`, tone: "blue" },
    { icon: Scale, label: "Delivered volume", value: fmt(stats.deliveredKg), unit: "kg", hint: "completed orders", tone: "teal" },
    { icon: CircleDollarSign, label: "Revenue", value: `KES ${fmt(stats.revenue)}`, hint: "from delivered orders", tone: "gold" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <Reveal key={kpi.label} index={i}>
          <Stat {...kpi} animate={false} />
        </Reveal>
      ))}
    </div>
  );
}
