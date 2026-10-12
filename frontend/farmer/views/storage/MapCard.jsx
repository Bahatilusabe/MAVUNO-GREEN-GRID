import { MapPin, Navigation } from "lucide-react";
import { FakeMap } from "../../components/ui";

export default function MapCard({ facilities }) {
  const pins = [
    ...facilities.map((f) => ({ x: f.x, y: f.y, color: "var(--color-map-storage)", label: `${f.name} (${f.km} km)` })),
    { x: 48, y: 55, color: "var(--color-map-pin)", label: "Your farm" },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Navigation className="text-green-600" aria-hidden="true" size={20} /> 
          Nearby Storage Facilities
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Geospatial Map
        </span>
      </div>

      {/* Map Body */}
      <div className="relative w-full bg-gray-100" style={{ height: "300px" }}>
        <FakeMap pins={pins} height="100%" />
      </div>

      {/* Interactive Legend Bar */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span className="w-3 h-3 rounded-full shadow-xs bg-blue-600 flex-shrink-0" />
          <span>Storage Facility</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span className="w-3 h-3 rounded-full shadow-xs bg-green-700 flex-shrink-0" />
          <span>Your Farm</span>
        </div>
      </div>
    </section>
  );
}