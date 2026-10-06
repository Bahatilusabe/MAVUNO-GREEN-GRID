import { HeartPulse } from "lucide-react";
import { HEALTH } from "../data";

const TONE_DOTS = {
  green: "bg-green-500 shadow-xs shadow-green-200",
  amber: "bg-amber-500 shadow-xs shadow-amber-200",
  red: "bg-red-500 shadow-xs shadow-red-200",
  default: "bg-gray-400",
};

export default function HealthCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
          <HeartPulse aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">System Health</h3>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {HEALTH.map(([name, state, tone]) => {
          const dotClass = TONE_DOTS[tone] || TONE_DOTS.default;

          return (
            <div 
              key={name} 
              className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
                <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{name}</span>
              </div>
              <small className="text-xs text-gray-500 font-medium">{state}</small>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">Sample data • Connect to your monitoring service</small>
      </div>
    </section>
  );
}