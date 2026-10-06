import { Sparkles, Banknote, Route, Cloud, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const SAVINGS = [
  { icon: Banknote, value: "KES 18,400", label: "Cost reduction" },
  { icon: Route, value: "240 km", label: "Distance saved" },
  { icon: Cloud, value: "320 kg CO₂e", label: "Emissions avoided" },
];

export default function PlanCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
            Recommended Transport Plan
          </h3>
          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Sparkles size={14} className="text-green-600" /> MAVUNO AI
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="bg-green-50/60 border border-green-100 p-4 rounded-xl space-y-2 text-sm text-gray-700 leading-relaxed">
            <p>
              Bundle your tomato deliveries with <strong className="text-gray-900 font-semibold">3 other farmers</strong> to fill a 10-ton truck on the Kirinyaga → Nairobi route.
            </p>
            <p className="text-xs text-green-800 font-medium">
              This reduces your transport cost by 32% and cuts emissions by 28%.
            </p>
          </div>

          <button 
            className="w-full py-3 px-4 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-sm flex items-center justify-center gap-2" 
            onClick={() => toast.success("Bundle request sent to 3 nearby farmers")}
          >
            View Plan <ArrowRight size={16} />
          </button>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Estimated savings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAVINGS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-sm font-bold text-gray-900 truncate">{value}</strong>
                    <small className="text-[11px] text-gray-500 block truncate">{label}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}