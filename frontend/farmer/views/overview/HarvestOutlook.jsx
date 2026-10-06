import { TrendingUp } from "lucide-react";
import { HarvestChart } from "../../../shared/charts";
import { OUTLOOK } from "./data";

export default function HarvestOutlook() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <TrendingUp className="text-green-600" aria-hidden="true" size={20} /> 
          Harvest Outlook
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Seasonal Trend
        </span>
      </div>

      {/* Chart Body */}
      <div className="p-4 sm:p-5 flex-grow flex items-center justify-center">
        <div className="w-full">
          <HarvestChart {...OUTLOOK} height={210} />
        </div>
      </div>
    </section>
  );
}