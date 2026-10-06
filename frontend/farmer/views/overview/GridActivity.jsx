import { Link2 } from "lucide-react";
import { ACTIVITY } from "./data";

export default function GridActivity() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Link2 className="text-green-600" aria-hidden="true" size={20} /> 
          Green Grid Activity
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Live Feed
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="divide-y divide-gray-100 flex-grow">
        {ACTIVITY.map((a, index) => (
          <div key={a.title || index} className="flex items-start gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors">
            {/* Icon Badge (Conditional danger styling) */}
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
              a.danger ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
            }`}>
              <a.icon aria-hidden="true" size={18} />
            </div>
            
            {/* Content */}
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{a.title}</h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.sub}</p>
            </div>

            {/* Timestamp */}
            <span className="flex-shrink-0 text-xs font-medium text-gray-400 whitespace-nowrap pt-0.5">
              {a.ago}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
        Sample data. Connect to live events.
      </div>
    </section>
  );
}