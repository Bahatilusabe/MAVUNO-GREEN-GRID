import { Sprout, Plus, MapPin, ChevronRight, TrendingUp, ShieldAlert } from "lucide-react";
import EmptyState from "../../shared/EmptyState";
import { parseCoords } from "../../shared/geo";
import { riskClass } from "../constants";
import { KpiRow, Thumb, FakeMap } from "../components/ui";

export default function MyFarms({ farms, onOpen, onAdd }) {
  if (!farms.length) {
    return (
      <EmptyState
        icon={Sprout}
        title="No farms yet"
        text="Register a farm to start tracking harvests and risk."
        action="Add farm"
        onAction={onAdd}
      />
    );
  }

  const pins = farms.flatMap((f) => {
    const c = parseCoords(f.coords);
    return c ? [{ ...c, color: f.risk === "High" ? "#dc2626" : "#1e7a46", label: f.name }] : [];
  });
  const unmapped = farms.length - pins.length;

  return (
    <div className="space-y-6 pb-12">
      {/* KPI Summary Row */}
      <KpiRow farms={farms} />

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Farm List (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {farms.map((f) => (
            <div 
              key={f.id} 
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-green-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0">
                  <Thumb crop={f.crop} size={72} />
                </div>
                <div className="min-w-0 space-y-1">
                  <strong className="block text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors truncate">
                    {f.name}
                  </strong>
                  <small className="text-xs text-gray-500 block truncate">
                    {f.county} • {f.area} ha • {f.crop}
                  </small>
                  <small className="text-xs text-gray-600 font-medium block">
                    Expected harvest: {(f.kg / 1000).toFixed(1)} t
                  </small>
                  <div>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${riskClass(f.risk)}`}>
                      Risk: {f.risk}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                className="self-start sm:self-center px-4 py-2 text-xs font-semibold text-green-800 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0" 
                onClick={() => onOpen(f.id)}
              >
                View Details <ChevronRight size={14} />
              </button>
            </div>
          ))}

          <button 
            className="w-full py-3.5 px-4 bg-green-700 text-white font-semibold text-sm rounded-xl hover:bg-green-800 transition-colors shadow-sm flex items-center justify-center gap-2" 
            onClick={onAdd}
          >
            <Plus size={18} /> Add Farm
          </button>
        </div>

        {/* Right Column: Map & Performance (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Map Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={16} className="text-green-600" /> Geographic Distribution
            </h3>

            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100" style={{ height: "240px" }}>
              <FakeMap pins={pins} height="100%" risk />
            </div>

            <div className="flex items-center justify-center gap-6 pt-1">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <span className="w-3 h-3 rounded-full shadow-xs bg-green-700 flex-shrink-0" />
                <span>Your Farms</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <span className="w-3 h-3 rounded-full shadow-xs bg-red-600 flex-shrink-0" />
                <span>Risk Area</span>
              </div>
            </div>

            {unmapped > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-center">
                {unmapped} farm{unmapped > 1 ? "s" : ""} without coordinates not shown.
              </p>
            )}
          </div>

          {/* Farm Performance Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" /> Farm Performance
            </h3>

            <div className="space-y-4">
              {farms.map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>{f.name.replace(" Farm", "")}</span>
                    <span className="text-green-800">{f.perf}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${f.perf}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}