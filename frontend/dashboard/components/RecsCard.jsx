import {
  CircleAlert,
  PartyPopper,
  Sparkles,
  Sprout,
  Store,
  Warehouse,
  X,
  ArrowRight,
} from "lucide-react";

const RECOMMENDATION_ICONS = {
  Harvest: Sprout,
  Market: Store,
  Storage: Warehouse,
};

const TONE_STYLES = {
  red: "bg-red-50/60 border-red-200 text-red-900",
  amber: "bg-amber-50/60 border-amber-200 text-amber-900",
  green: "bg-green-50/60 border-green-200 text-green-900",
  blue: "bg-blue-50/60 border-blue-200 text-blue-900",
  default: "bg-gray-50 border-gray-200 text-gray-900",
};

const ICON_TONES = {
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  default: "bg-gray-100 text-gray-600",
};

export default function RecsCard({ recs, onDismiss, onNavigate }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <Sparkles aria-hidden="true" size={18} className="text-green-600" /> AI Recommendations
        </h3>
        <button 
          className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1" 
          onClick={() => onNavigate("recs")}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recs.map((r) => {
          const Icon = RECOMMENDATION_ICONS[r.kind] || CircleAlert;
          const toneClass = TONE_STYLES[r.tone] || TONE_STYLES.default;
          const iconToneClass = ICON_TONES[r.tone] || ICON_TONES.default;

          return (
            <div 
              key={r.id} 
              className={`p-4 rounded-xl border flex items-start gap-3.5 relative transition-all ${toneClass}`}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 shadow-2xs ${iconToneClass}`}>
                <Icon aria-hidden="true" size={18} />
              </div>

              <div className="min-w-0 flex-1 space-y-1 pr-6">
                <strong className="block text-sm font-bold text-gray-900 leading-snug">{r.title}</strong>
                <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
                
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-white/80 border border-gray-200 text-gray-700 shadow-2xs">
                    {r.conf}% confidence
                  </span>
                </div>
              </div>

              <button
                className="absolute top-3.5 right-3.5 p-1 text-gray-400 hover:text-gray-700 hover:bg-black/5 rounded-lg transition-colors"
                aria-label={`Dismiss ${r.title}`}
                onClick={() => onDismiss(r.id)}
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {!recs.length && (
        <div className="py-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <PartyPopper aria-hidden="true" size={18} className="text-green-600" /> 
          <span className="font-medium">You're all caught up</span>
        </div>
      )}
    </section>
  );
}