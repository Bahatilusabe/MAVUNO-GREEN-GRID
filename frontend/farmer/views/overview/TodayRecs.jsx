import { Sparkles } from "lucide-react";
import { TODAY_RECS } from "./data";

export default function TodayRecs({ go }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Sparkles className="text-green-600" aria-hidden="true" size={20} /> 
          Today's AI Recommendations
        </h3>
      </div>
      
      {/* Recommendations List */}
      <div className="divide-y divide-gray-100">
        {TODAY_RECS.map((r, index) => (
          <div 
            key={r.title || index} 
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors"
          >
            {/* Icon Badge */}
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-700">
              <r.icon aria-hidden="true" size={24} />
            </div>
            
            {/* Text Content */}
            <div className="flex-grow">
              <h4 className="text-base font-semibold text-gray-900">{r.title}</h4>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{r.text}</p>
            </div>
            
            {/* CTA Button */}
            <button 
              className="mt-2 sm:mt-0 flex-shrink-0 w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-green-800 bg-green-100 rounded-lg hover:bg-green-200 transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none text-center" 
              onClick={() => go(r.to)}
            >
              {r.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}