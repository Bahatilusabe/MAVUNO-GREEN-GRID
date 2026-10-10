import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri", "Machakos"];
const EMPTY = { name: "", county: "", sub: "", area: "", water: "", irrigation: "" };

// Dynamic map tiles based on your environment variable
const TILES = import.meta.env.VITE_MAP_STYLE === "satellite"
  ? { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "Tiles &copy; Esri", maxZoom: 19 }
  : { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 };

// Reuse your custom pin icon for consistency
const pinIcon = L.divIcon({
  className: "leaflet-pin-wrapper",
  html: '<span class="leaflet-pin leaflet-pin--farm"></span>',
  iconSize: [22, 22], 
  iconAnchor: [11, 22] 
});

// Helper component to capture map clicks
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

export default function AddFarmForm({ onSave, onCancel }) {
  const [f, setF] = useState(EMPTY);
  const [position, setPosition] = useState(null); // Stores { lat, lng }

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  
  // Require name, county, sub-county, valid area, AND a map pin
  const valid = f.name && f.county && f.sub && Number(f.area) > 0 && position;

  const handleSubmit = () => {
    onSave({ 
      ...f, 
      area: +(Number(f.area) * 0.4047).toFixed(2), // Convert acres to hectares
      coords: `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` 
    });
  };

  return (
    <div className="card add-farm max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">Add New Farm</h3>
        <p className="text-sm text-gray-500">Register a new plot to start tracking weather and crop insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-green-800 border-b pb-2">1. Basic Details</h4>
          
          <label className="block text-sm font-medium text-gray-700">Farm Name *
            <input className="mt-1 w-full p-2 border rounded-md" value={f.name} onChange={set("name")} placeholder="e.g. Kiambaina Farm" />
          </label>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">County *
              <select className="mt-1 w-full p-2 border rounded-md" value={f.county} onChange={set("county")}>
                <option value="">Select County</option>
                {COUNTIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">Sub County *
              <input className="mt-1 w-full p-2 border rounded-md" value={f.sub} onChange={set("sub")} placeholder="e.g. Mwea" />
            </label>
          </div>

          <label className="block text-sm font-medium text-gray-700">Area (acres) *
            <input className="mt-1 w-full p-2 border rounded-md" type="number" min="0" step="0.1" value={f.area} onChange={set("area")} placeholder="e.g. 1.2" />
          </label>

          <h4 className="font-semibold text-green-800 border-b pb-2 mt-6">2. Resources</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">Water Source
              <select className="mt-1 w-full p-2 border rounded-md" value={f.water} onChange={set("water")}>
                <option value="">Select</option>
                {["Borehole", "River", "Canal", "Rain-fed"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">Irrigation Type
              <select className="mt-1 w-full p-2 border rounded-md" value={f.irrigation} onChange={set("irrigation")}>
                <option value="">Select</option>
                {["Drip", "Sprinkler", "Flood", "None"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
        </div>

        {/* Right Column: Map & Media */}
        <div className="space-y-4 flex flex-col">
          <h4 className="font-semibold text-green-800 border-b pb-2">3. Farm Location *</h4>
          <p className="text-xs text-gray-500">Click on the map to drop a pin at the center of your farm.</p>
          
          <div className="flex-grow w-full rounded-lg overflow-hidden border border-gray-300" style={{ minHeight: "300px" }}>
            <MapContainer center={[-0.5, 37.35]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <TileLayer {...TILES} />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          {position && (
            <p className="text-xs text-green-700 font-medium text-right">
              Coordinates: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-4 border-t flex justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" onClick={onCancel}>
          Cancel
        </button>
        <button 
          className={`px-6 py-2 rounded-md text-white font-medium ${valid ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-300 cursor-not-allowed'}`} 
          disabled={!valid} 
          onClick={handleSubmit}
        >
          Save Farm
        </button>
      </div>
    </div>
  );
}