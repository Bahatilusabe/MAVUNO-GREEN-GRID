import { TrendingUp, ArrowRight } from "lucide-react";
import { CROP_PRICES } from "../../shared/data";
import { Sparkline } from "../../shared/charts";

export default function PricesCard({ onNavigate }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <TrendingUp aria-hidden="true" size={18} className="text-green-600" /> Market Prices
        </h3>
        <button 
          className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex items-center gap-1" 
          onClick={() => onNavigate("market")}
        >
          Market <ArrowRight size={14} />
        </button>
      </div>

      {/* Crop Prices List */}
      <div className="space-y-3">
        {CROP_PRICES.map((p) => {
          const isUp = p.delta >= 0;

          return (
            <div 
              key={p.crop} 
              className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:bg-green-50/40 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-gray-900 truncate">{p.crop}</strong>
                <small className="text-xs text-gray-500 block font-medium">
                  KES {p.price}/kg
                </small>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Sparkline data={p.trend} up={isUp} />
                <span className={`px-2 py-1 text-xs font-bold rounded-lg flex items-center gap-0.5 ${
                  isUp ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {isUp ? "▲" : "▼"} {Math.abs(p.delta)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}