import { Sparkles, Award, ArrowDown } from "lucide-react";

export default function RecommendedCard({ facilities }) {
  const top = [...facilities].sort((a, b) => b.score - a.score).slice(0, 3);
  const best = top[0];

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
            Recommended Storage
          </h3>
          <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Sparkles size={14} className="text-green-600" /> MAVUNO AI
          </span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="bg-green-50/60 border border-green-100 p-4 rounded-xl text-sm text-gray-700 leading-relaxed">
            <p>
              Based on your harvest forecast and current capacity, <strong className="text-gray-900 font-semibold">{best?.name}</strong> offers the best balance of cost, distance and temperature suitability.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top 3 Options</h4>
            
            <div className="space-y-2.5">
              {top.map((f, i) => (
                <div key={f.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                      i === 0 ? "bg-green-700 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-sm font-bold text-gray-900 truncate">{f.name}</strong>
                      <small className="text-xs text-gray-500 block">{f.km} km away</small>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full flex-shrink-0">
                    Score {f.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 sm:pt-0 sm:px-6 sm:pb-6">
        <button 
          className="w-full py-3 px-4 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-sm flex items-center justify-center gap-2" 
          onClick={() => document.getElementById("storage-facilities")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Full Analysis <ArrowDown size={16} />
        </button>
      </div>
    </section>
  );
}