import { Leaf } from "lucide-react";
import { ENV } from "./data";

export default function EnvImpact() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Leaf className="text-green-600" aria-hidden="true" size={20} /> 
          My Environmental Impact
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Sustainability
        </span>
      </div>

      {/* Impact Tiles Grid (Updated to 2 columns for comfortable reading) */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ENV.map(([Icon, label, value, sub]) => (
          <div 
            key={label} 
            className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3.5 hover:bg-green-50/40 transition-colors"
          >
            {/* Icon Badge */}
            <div className="p-2.5 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
              <Icon aria-hidden="true" size={18} />
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium text-gray-500 block truncate">{label}</span>
              <strong className="text-base sm:text-lg font-bold text-gray-900 block mt-0.5 truncate">{value}</strong>
              {sub && <span className="text-xs text-gray-400 block mt-0.5 truncate">{sub}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}