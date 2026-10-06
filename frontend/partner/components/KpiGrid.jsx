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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(([Icon, label, value, sub]) => (
        <div 
          key={label} 
          className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
        >
          <div className="p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-100 text-green-700 shadow-2xs">
            <Icon aria-hidden="true" size={20} />
          </div>

          <div className="min-w-0 space-y-0.5">
            <small className="text-xs font-medium text-gray-500 block truncate">{label}</small>
            <strong className="text-xl font-bold tracking-tight text-gray-900 block truncate">
              {value}
            </strong>
            <small className="text-[11px] text-gray-400 font-medium block truncate pt-0.5">
              {sub}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}