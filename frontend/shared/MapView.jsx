import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AREA = { north: -0.35, south: -0.75, west: 37.1, east: 37.6 }; // Kirinyaga, used for legacy {x, y} pins
const DANGER = "#dc2626";

const TILES = import.meta.env.VITE_MAP_STYLE === "satellite"
  ? { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: "Tiles &copy; Esri", maxZoom: 19 }
  : { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 };
  
const toLatLng = (p) =>
  p.lat != null
    ? [p.lat, p.lng]
    : [AREA.north - (p.y / 100) * (AREA.north - AREA.south), AREA.west + (p.x / 100) * (AREA.east - AREA.west)];

const pinIcon = (color) => {
  const safe = /^#[0-9a-f]{3,8}$/i.test(color) ? color : "#1e7a46";
  return L.divIcon({ className: "mv-pin", html: `<span style="background:${safe}"></span>`, iconSize: [22, 22], iconAnchor: [11, 22] });
};

function Fit({ k }) {
  const map = useMap();
  useEffect(() => {
    const pts = k ? k.split("|").map((s) => s.split(",").map(Number)) : [];
    if (pts.length === 1) map.setView(pts[0], 13);
    else if (pts.length > 1) map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 13 });
  }, [map, k]);
  return null;
}

export default function MapView({ pins = [], height = 260, risk = false }) {
  const points = pins.map(toLatLng);
  const k = points.map((p) => p.join(",")).join("|");
  return (
    <div className="mv-map" style={{ height }}>
      <MapContainer center={[-0.5, 37.35]} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer {...TILES} />
        <Fit k={k} />
        {risk && pins.map((p, i) => p.color === DANGER && (
          <Circle key={`r${i}`} center={points[i]} radius={900} pathOptions={{ color: DANGER, fillColor: DANGER, fillOpacity: 0.25, weight: 1 }} />
        ))}
        {pins.map((p, i) => (
          <Marker key={i} position={points[i]} icon={pinIcon(p.color)}>
            {p.label && <Tooltip direction="top" offset={[0, -18]}>{p.label}</Tooltip>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}