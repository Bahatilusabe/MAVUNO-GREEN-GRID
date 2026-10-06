import { fmt } from "../../shared/utils";

export default function CapacityBar({ stats, capacity }) {
  const utilColor = 
    stats.util >= 85 
      ? "bg-red-600" 
      : stats.util >= 60 
      ? "bg-amber-500" 
      : "bg-green-600";

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900">
        <span>Capacity today</span>
        <span className="text-gray-600 font-medium">{fmt(stats.load)} / {fmt(capacity)} kg</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${utilColor}`} 
          style={{ width: `${stats.util}%` }} 
        />
      </div>
    </section>
  );
}