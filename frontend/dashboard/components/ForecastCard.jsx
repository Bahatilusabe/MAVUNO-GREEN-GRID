import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { FORECASTS } from "../../shared/data";
import { HarvestChart } from "../../shared/charts";

export default function ForecastCard() {
  const [range, setRange] = useState("7 days");

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
          <TrendingUp aria-hidden="true" size={18} className="text-green-600" /> Harvest Forecast
        </h3>

        {/* Range Segmented Tabs */}
        <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1 self-start sm:self-auto" role="tablist">
          {Object.keys(FORECASTS).map((r) => {
            const isActive = range === r;
            return (
              <button
                key={r}
                role="tab"
                aria-selected={isActive}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-green-800 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Body */}
      <div className="pt-2">
        <HarvestChart {...FORECASTS[range]} />
      </div>
    </section>
  );
}