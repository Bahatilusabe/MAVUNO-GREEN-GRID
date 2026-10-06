import { Cherry, Sprout, Wheat, ArrowRight } from "lucide-react";
import { INITIAL_FARMS as FARMS } from "../../shared/data";

const CROP_ICONS = { Tomatoes: Cherry, "French Beans": Sprout, Rice: Wheat };

const RISK_BADGE = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-green-100 text-green-800 border-green-200",
};

export default function CropsCard({ onNavigate }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-900">My Crops</h3>
        <button 
          className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1" 
          onClick={() => onNavigate("crops")}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      {/* Crop List */}
      <div className="space-y-3">
        {FARMS.map((f) => {
          const Icon = CROP_ICONS[f.crop] || Sprout;
          const riskStyle = RISK_BADGE[f.risk] || "bg-gray-100 text-gray-800 border-gray-200";

          return (
            <button
              key={f.id}
              className="w-full bg-gray-50/70 border border-gray-100 hover:bg-green-50/40 hover:border-green-300 p-3.5 rounded-xl flex items-center justify-between gap-4 transition-all text-left group cursor-pointer shadow-2xs"
              onClick={() => onNavigate("crops")}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 shadow-2xs">
                  <Icon aria-hidden="true" size={22} />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <strong className="text-sm font-bold text-gray-900 group-hover:text-green-800 transition-colors block truncate">
                    {f.crop}
                  </strong>
                  
                  <small className="text-xs text-gray-500 block truncate font-medium">
                    {f.name} • {(f.kg / 1000).toFixed(1)} t • Harvest: {f.harvest}
                  </small>

                  {/* Performance Progress Bar */}
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${f.perf}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Risk Badge */}
              <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border flex-shrink-0 ${riskStyle}`}>
                {f.risk}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}