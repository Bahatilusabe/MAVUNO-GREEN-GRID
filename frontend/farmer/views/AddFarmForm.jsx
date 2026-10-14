import { useEffect, useState } from "react";
import { MapContainer, TileLayer, LayersControl, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

const COUNTIES = ["Kirinyaga", "Embu", "Murang'a", "Nyeri", "Machakos"];
const EMPTY = { name: "", county: "", sub: "", area: "", water: "", irrigation: "", videoFile: null, photoFile: null };
const SATELLITE_DEFAULT = import.meta.env.VITE_MAP_STYLE === "satellite";

const pinIcon = L.divIcon({
  className: "leaflet-pin-wrapper",
  html: '<span class="leaflet-pin leaflet-pin--farm"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

// Captures map clicks
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} icon={pinIcon} /> : null;
}

// Moves the map when "Use my location" succeeds (not on every click)
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 16));
  }, [map, target]);
  return null;
}

export default function AddFarmForm({ onSave, onCancel }) {
  const [f, setF] = useState(EMPTY);
  const [position, setPosition] = useState(null); // { lat, lng }
  const [flyTarget, setFlyTarget] = useState(null);
  const [locating, setLocating] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Require name, county, sub-county, valid area, AND a map pin
  const valid = f.name && f.county && f.sub && Number(f.area) > 0 && position;

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("This browser can't share your location. Click the map instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(p);
        setFlyTarget(p);
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location. Click the map to place the pin.");
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const handleSubmit = () => {
    onSave({
      ...f,
      area: +(Number(f.area) * 0.4047).toFixed(2), // Convert acres to hectares
      lat: Number(position.lat.toFixed(6)),
      lng: Number(position.lng.toFixed(6)),
      coords: `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`,
      videoFile: f.videoFile,
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

          <div className="space-y-4 pt-2">
            <label className="block text-sm font-medium text-gray-700">Farm Media (Optional Photos or Video)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-gray-500 mb-1">Crop/Soil Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setF({ ...f, photoFile: e.target.files[0] })}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {f.photoFile && <p className="text-[11px] text-blue-600 mt-1">Photo: {f.photoFile.name}</p>}
              </div>
              <div>
                <span className="block text-xs text-gray-500 mb-1">Walkthrough Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setF({ ...f, videoFile: e.target.files[0] })}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {f.videoFile && <p className="text-[11px] text-green-600 mt-1">Video: {f.videoFile.name}</p>}
              </div>
            </div>
          </div>

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

        {/* Right Column: Map */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-semibold text-green-800">3. Farm Location *</h4>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:text-gray-400"
            >
              {locating ? "Locating…" : "Use my location"}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Click the map to drop a pin at the centre of your farm. Switch to Satellite (top right) to place it precisely.
          </p>

          <div className="flex-grow w-full rounded-lg overflow-hidden border border-gray-300" style={{ minHeight: "300px" }}>
            <MapContainer center={[-0.5, 37.35]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked={!SATELLITE_DEFAULT} name="Street">
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked={SATELLITE_DEFAULT} name="Satellite">
                  <TileLayer
                    attribution="Tiles &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <LocationPicker position={position} setPosition={setPosition} />
              <FlyTo target={flyTarget} />
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
          className={`px-6 py-2 rounded-md text-white font-medium ${valid ? "bg-green-700 hover:bg-green-800" : "bg-gray-300 cursor-not-allowed"}`}
          disabled={!valid}
          onClick={handleSubmit}
        >
          Save Farm
        </button>
      </div>
    </div>
  );
}