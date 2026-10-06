import { useState } from "react";
import {
  CalendarDays,
  Flower2,
  Hourglass,
  Scale,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { RECS, FORECAST } from "../../shared/data";
import { HarvestChart } from "../../shared/charts";
import { fmt } from "../../shared/utils";
import { Tabs, Thumb } from "../components/ui";

const SHARE = { High: 0.4, Medium: 0.2, Low: 0.05 };
const SPOILAGE = { High: "Medium", Medium: "Low", Low: "Low" };

export default function Forecast({ farm, onBack, go }) {
  const [tab, setTab] = useState("Overview");
  const share = SHARE[farm.risk];
  const surplus = Math.round(farm.kg * share);

  const stats = [
    { icon: Flower2, label: "Current Stage", value: farm.stage },
    { icon: CalendarDays, label: "Expected Harvest", value: farm.harvest },
    { icon: Scale, label: "Expected Quantity", value: `${fmt(farm.kg)} kg` },
    { icon: Hourglass, label: "Harvest Window", value: "5 days" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm bg-gradient-to-r from-green-50/40 to-white">
          <div className="flex-shrink-0">
            <Thumb crop={farm.crop} size={64} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">
              {farm.crop} – <span className="text-green-800">{farm.name}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Comprehensive harvest forecast & AI risk analysis</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        {["Overview", "Forecast", "Risk Analysis", "Recommendations"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              tab === t 
                ? "border-green-700 text-green-800" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stat Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-xl flex-shrink-0">
              <Icon aria-hidden="true" size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-gray-500 block truncate">{label}</span>
              <strong className="text-base font-bold text-gray-900 block mt-0.5 truncate">{value}</strong>
            </div>
          </div>
        ))}
      </div>

      {tab === "Recommendations" ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-2 text-green-800 font-bold">
            <Sparkles size={20} className="text-green-600" /> Mavuno AI Recommendation
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-green-50/50 p-4 rounded-xl border border-green-100">
            {RECS[0].text}
          </p>
          <button 
            className="px-6 py-2.5 bg-green-700 text-white font-medium text-sm rounded-lg hover:bg-green-800 transition-colors shadow-sm flex items-center gap-2" 
            onClick={() => go("recs")}
          >
            Open AI Recommendations <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Harvest Chart (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-green-900 border-b pb-3">
              <TrendingUp aria-hidden="true" size={18} className="text-green-600" /> Harvest Forecast
            </h3>
            <div className="pt-2">
              <HarvestChart {...FORECAST} />
            </div>
          </div>

          {/* Surplus Risk Analysis (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-600" /> Surplus Risk
            </h3>

            <div className="space-y-3">
              {/* Risk Level Box */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                farm.risk === "High" ? "bg-red-50 border-red-200 text-red-900" :
                farm.risk === "Medium" ? "bg-amber-50 border-amber-200 text-amber-900" :
                "bg-green-50 border-green-200 text-green-900"
              }`}>
                <div>
                  <small className="text-xs font-medium block uppercase tracking-wider opacity-75">Risk Status</small>
                  <strong className="text-lg font-bold">{farm.risk} Risk</strong>
                </div>
                <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full shadow-xs">
                  {Math.round(share * 100)}% Exposure
                </span>
              </div>

              {/* Potential Surplus Box */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <small className="text-xs font-medium text-gray-500 block uppercase tracking-wider">Potential surplus</small>
                  <strong className="text-lg font-bold text-gray-900">{fmt(surplus)} kg</strong>
                </div>
                <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md">
                  Projected
                </span>
              </div>

              {/* Spoilage Risk Box */}
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <small className="text-xs font-medium text-amber-800 block uppercase tracking-wider">Spoilage risk</small>
                  <strong className="text-lg font-bold text-amber-950">{SPOILAGE[farm.risk]}</strong>
                </div>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                  Vulnerability
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}