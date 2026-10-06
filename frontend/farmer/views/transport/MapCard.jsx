import { MapPin, Navigation } from "lucide-react";
import { FakeMap } from "../../components/ui";

const LAYERS = [
  ["Farms", "#f59e0b", [{ x: 38, y: 22 }, { x: 22, y: 55 }]],
  ["Buyers", "#7f1d1d", [{ x: 80, y: 82 }]],
  ["Storage", "#2563eb", [{ x: 25, y: 74 }]],
  ["Processors", "#ea580c", [{ x: 74, y: 48 }]],
  ["Trucks", "#1e7a46", [{ x: 52, y: 38 }, { x: 60, y: 62 }]],
];

export default function MapCard() {
  const pins = LAYERS.flatMap(([label, color, pts]) => pts.map((p) => ({ ...p, color, label })));
  
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Navigation className="text-green-600" aria-hidden="true" size={20} /> 
          Transport Network &amp; Live Map
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Geospatial Hub
        </span>
      </div>

      {/* Map Body */}
      <div className="relative w-full bg-gray-100" style={{ height: "320px" }}>
        <FakeMap pins={pins} height="100%" />
      </div>

      {/* Interactive Legend Bar */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {LAYERS.map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <span className="w-3 h-3 rounded-full shadow-xs flex-shrink-0" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}