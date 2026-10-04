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
    <section className="card">
      <h3>Transport Network &amp; Live Map</h3>
      <FakeMap pins={pins} height={320} />
      <div className="legend">
        {LAYERS.map(([label, color]) => <span key={label}><i style={{ background: color }} />{label}</span>)}
      </div>
    </section>
  );
}