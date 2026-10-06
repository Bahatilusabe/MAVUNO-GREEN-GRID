import { useState } from "react";
import { Check, Link, ArrowRight } from "lucide-react";
import { OPPS } from "../../shared/data";

export default function OpportunitiesCard({ onNavigate }) {
  const [matched, setMatched] = useState({});

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <Link aria-hidden="true" size={18} className="text-green-600" /> Nearby Opportunities
        </h3>
        <button 
          className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1" 
          onClick={() => onNavigate("opportunities")}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        {OPPS.slice(0, 3).map((o) => {
          const isMatched = matched[o.name];

          return (
            <div 
              key={o.name} 
              className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:bg-green-50/40 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <strong className="block text-sm font-bold text-gray-900 truncate">{o.name}</strong>
                <small className="text-xs text-gray-500 block truncate font-medium">
                  {o.type} • {o.km} km away • {o.price}
                </small>
                <small className="text-[11px] text-green-800 font-semibold block">
                  {o.note}
                </small>
              </div>

              <button
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0 shadow-2xs ${
                  isMatched
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-green-700 hover:bg-green-800 text-white"
                }`}
                onClick={() =>
                  setMatched({ ...matched, [o.name]: !isMatched })
                }
              >
                {isMatched ? (
                  <>
                    Matched <Check aria-hidden="true" size={14} />
                  </>
                ) : (
                  "Match"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}