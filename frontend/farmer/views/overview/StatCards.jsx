import { AlertTriangle, Banknote, Sprout, Tractor, TrendingUp, TrendingDown } from "lucide-react";
import { fmt } from "../../../shared/utils";
import { STAT_TRENDS, VALUE_PROTECTED } from "./data";

export default function StatCards({ m }) {
  const cards = [
    { icon: Tractor, label: "My Farms", value: m.count, trend: STAT_TRENDS.farms, warn: false },
    { icon: Sprout, label: "Expected Harvest", value: `${m.tons.toFixed(1)} t`, trend: STAT_TRENDS.harvest, warn: false },
    { icon: AlertTriangle, label: "At-Risk Produce", value: `${(m.exposedKg / 1000).toFixed(1)} t`, trend: STAT_TRENDS.risk, warn: m.exposedKg > 0 },
    { icon: Banknote, label: "Value Protected", value: `KES ${fmt(VALUE_PROTECTED)}`, trend: STAT_TRENDS.value, warn: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ icon: Icon, label, value, trend, warn }) => (
        <div 
          key={label} 
          className={`relative p-5 rounded-xl border bg-white shadow-sm flex items-start justify-between transition-all hover:shadow-md ${
            warn ? "border-red-300 bg-red-50/30" : "border-gray-200"
          }`}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
            
            {/* Trend Indicator */}
            <div className="flex items-center pt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                warn ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}>
                {warn ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                {trend}
              </span>
            </div>
          </div>

          {/* Icon Badge */}
          <div className={`p-3 rounded-xl flex items-center justify-center ${
            warn ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          }`}>
            <Icon aria-hidden="true" size={22} />
          </div>
        </div>
      ))}
    </div>
  );
}