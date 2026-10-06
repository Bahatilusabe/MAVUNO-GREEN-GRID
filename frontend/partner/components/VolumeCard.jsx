import { ChartColumnIncreasing } from "lucide-react";
import { BarsChart } from "../../shared/charts";
import { WEEKLY } from "../data";

export default function VolumeCard() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
          <ChartColumnIncreasing aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">
          Weekly throughput <span className="text-xs font-medium text-gray-500">(kg)</span>
        </h3>
      </div>

      {/* Chart Body */}
      <div className="pt-2">
        <BarsChart data={WEEKLY} xKey="day" yKey="kg" />
      </div>

      {/* Footer Note */}
      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">Sample data • Replace with real deliveries</small>
      </div>
    </section>
  );
}