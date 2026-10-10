import { useState } from "react";
import { Cherry, Droplets, MapPin, Tractor, TrendingUp, ArrowLeft, ArrowRight, Compass, ShieldCheck, CalendarDays, Sprout } from "lucide-react";
import { Thumb, FakeMap } from "../components/ui";

const ACTIVITY = [
  [Cherry, "Tomato crop updated • 2 days ago"],
  [TrendingUp, "Harvest forecast updated • 4 days ago"],
  [Droplets, "Soil moisture reading • 6 days ago"],
  [Tractor, "Farm registered • 2 weeks ago"],
];

export default function FarmDetails({ farm, onBack, onForecast }) {
  const [tab, setTab] = useState("Overview");
  const cropRecords = farm.crops || [{
    id: farm.id,
    crop_type: farm.crop,
    expected_harvest_date: farm.harvest,
    expected_yield: farm.kg,
    status: farm.stage,
  }];

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button & Header */}
      <div className="space-y-2">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Farms
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-950">{farm.name}</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
              <MapPin aria-hidden="true" size={14} className="text-green-600" /> 
              {farm.county} County
            </p>
          </div>
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full w-fit">
            <ShieldCheck size={14} /> Active Farm Record
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        {["Overview", "Crops", "Soil & Water", "History"].map((t) => (
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

      {tab === "Overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Farm Info Card (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-green-50/40 p-4 rounded-xl border border-green-100">
              <div className="flex-shrink-0">
                <Thumb crop={farm.crop} size={110} />
              </div>
              
              {/* Mini Stats Grid */}
              <div className="grid grid-cols-2 gap-4 flex-1 w-full">
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                  <small className="text-[11px] text-gray-400 font-medium uppercase tracking-wider block">Total Area</small>
                  <strong className="text-base font-bold text-gray-900">{farm.area} ha</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                  <small className="text-[11px] text-gray-400 font-medium uppercase tracking-wider block">Farm Type</small>
                  <strong className="text-base font-bold text-gray-900">{farm.type}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                  <small className="text-[11px] text-gray-400 font-medium uppercase tracking-wider block">Water Source</small>
                  <strong className="text-base font-bold text-gray-900">{farm.water}</strong>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                  <small className="text-[11px] text-gray-400 font-medium uppercase tracking-wider block">Irrigation</small>
                  <strong className="text-base font-bold text-gray-900">{farm.irrigation}</strong>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Compass size={16} className="text-green-600" /> Farm Location
                </h4>
                <small className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{farm.coords}</small>
              </div>

              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200" style={{ height: "180px" }}>
                <FakeMap
                  pins={[{ x: 50, y: 50, color: "var(--color-map-pin)", label: farm.name }]}
                  height="100%"
                />
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="w-full py-3 px-4 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors shadow-sm flex items-center justify-center gap-2" 
              onClick={onForecast}
            >
              View Harvest Forecast <ArrowRight size={16} />
            </button>
          </div>

          {/* Recent Activity Card (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h4 className="text-base font-bold text-gray-900 border-b pb-3">Recent Activity</h4>
            
            <div className="space-y-3">
              {ACTIVITY.map(([Icon, activity], index) => (
                <div key={index} className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-green-50/30 transition-colors">
                  <div className="p-2.5 bg-green-100 text-green-700 rounded-lg flex-shrink-0">
                    <Icon aria-hidden="true" size={18} />
                  </div>
                  <small className="text-xs font-medium text-gray-700 leading-relaxed block">{activity}</small>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : tab === "Crops" ? (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-green-50/40">
            <h3 className="font-bold text-green-900 flex items-center gap-2"><Sprout size={19} className="text-green-600" /> Crop cycles</h3>
            <p className="text-xs text-gray-500 mt-1">Track each planting cycle and prepare the next handoff before harvest.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {cropRecords.map((crop) => (
              <div key={crop.id} className="p-5 flex flex-wrap items-center gap-4">
                <Thumb crop={crop.crop_type} size={48} />
                <div className="min-w-[160px]">
                  <strong className="block text-sm font-bold text-gray-900">{crop.crop_type}</strong>
                  <span className="text-xs text-gray-500">Expected yield: {crop.expected_yield || 0} kg</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays size={14} className="text-green-600" /> Harvest: {crop.expected_harvest_date || "Pending"}
                </div>
                <span className="ml-auto text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">{crop.status}</span>
              </div>
            ))}
          </div>
        </section>
      ) : tab === "Soil & Water" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Droplets size={18} className="text-blue-600" /> Water plan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100"><span className="block text-xs text-gray-500">Source</span><strong className="text-sm text-gray-900">{farm.water}</strong></div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100"><span className="block text-xs text-gray-500">Irrigation</span><strong className="text-sm text-gray-900">{farm.irrigation}</strong></div>
            </div>
            <p className="text-xs text-gray-500">Keep this information current so weather alerts and crop recommendations can be targeted to this farm.</p>
          </section>
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Farm baseline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Area</span><strong>{farm.area} ha</strong></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Farm type</span><strong>{farm.type}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Location</span><strong>{farm.county}</strong></div>
            </div>
          </section>
        </div>
      ) : (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 border-b pb-3">Farm history</h3>
          <div className="mt-4 space-y-3">
            {ACTIVITY.map(([Icon, activity], index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Icon size={17} className="text-green-700" />
                <span className="text-sm text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}