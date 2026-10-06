import { CircleDollarSign, Leaf, Recycle, Ruler, Scale, Tractor, TriangleAlert } from "lucide-react";

export default function KpiGrid({ totals, globalImpact, onNavigate }) {
  const kpis = [
    [Tractor, "Total farms", totals.farms, "farms", false],
    [Ruler, "Total area", `${totals.area} ha`, "farms", false],
    [Scale, "Expected harvest", `${totals.tons} t`, "crops", false],
    [TriangleAlert, "High risk crops", totals.high, "recs", totals.high > 0],
  ];

  const impactKpis = globalImpact ? [
    [Scale, "Food saved", `${Number(globalImpact.tonnes_saved ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`],
    [Recycle, "Food at risk", `${Number(globalImpact.tonnes_wasted ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`],
    [CircleDollarSign, "Net value", `KES ${(Number(globalImpact.net_value_kes ?? globalImpact.revenue_kes ?? 0) / 1e6).toLocaleString("en-KE", { maximumFractionDigits: 1 })}M`],
    [Leaf, "CO2e avoided", `${Number(globalImpact.co2e_avoided_t ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`],
  ] : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Farm & Harvest KPIs */}
      {kpis.map(([Icon, label, value, to, danger]) => (
        <button
          key={label}
          onClick={() => onNavigate(to)}
          className={`p-5 rounded-xl border bg-white shadow-sm flex items-center gap-4 text-left transition-all hover:shadow-md cursor-pointer group ${
            danger ? "border-red-300 bg-red-50/40 hover:bg-red-50/70" : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
            danger ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          }`}>
            <Icon aria-hidden="true" size={20} />
          </div>
          <div className="min-w-0">
            <small className="text-xs font-medium text-gray-500 block truncate">{label}</small>
            <strong className={`text-xl font-bold tracking-tight block mt-0.5 truncate ${
              danger ? "text-red-700" : "text-gray-900 group-hover:text-green-800 transition-colors"
            }`}>
              {value}
            </strong>
          </div>
        </button>
      ))}

      {/* Global Impact KPIs */}
      {impactKpis.map(([Icon, label, value]) => (
        <div
          key={label}
          className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
        >
          <div className="p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-700 shadow-2xs">
            <Icon aria-hidden="true" size={20} />
          </div>
          <div className="min-w-0">
            <small className="text-xs font-medium text-gray-500 block truncate">{label}</small>
            <strong className="text-xl font-bold tracking-tight text-gray-900 block mt-0.5 truncate">
              {value}
            </strong>
          </div>
        </div>
      ))}
    </div>
  );
}