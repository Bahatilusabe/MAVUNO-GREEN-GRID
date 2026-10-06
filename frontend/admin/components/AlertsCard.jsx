import { PartyPopper, TriangleAlert } from "lucide-react";

const LEVEL_STYLES = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-blue-100 text-blue-800 border-blue-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function AlertsCard({ alerts, onResolve }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <TriangleAlert aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Alerts</h3>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((a) => {
          const levelKey = a.level.toLowerCase();
          const levelStyle = LEVEL_STYLES[levelKey] || LEVEL_STYLES.default;

          return (
            <div 
              key={a.id} 
              className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border flex-shrink-0 ${levelStyle}`}>
                  {a.level}
                </span>
                <p className="text-xs sm:text-sm text-gray-800 font-medium truncate">
                  {a.text}
                </p>
              </div>

              <button
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-colors flex-shrink-0 shadow-2xs cursor-pointer"
                onClick={() => onResolve(a.id)}
              >
                Resolve
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!alerts.length && (
        <div className="py-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <PartyPopper aria-hidden="true" size={18} className="text-green-600" />
          <span className="font-medium">No open alerts</span>
        </div>
      )}
    </section>
  );
}