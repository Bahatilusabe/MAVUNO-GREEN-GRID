import { FakeMap } from "../../components/ui";

export default function MapCard({ facilities }) {
  const pins = [
    ...facilities.map((f) => ({ x: f.x, y: f.y, color: "#2563eb", label: `${f.name} (${f.km} km)` })),
    { x: 48, y: 55, color: "#1e7a46", label: "Your farm" },
  ];
  return (
    <section className="card">
      <h3>Nearby Storage Facilities</h3>
      <FakeMap pins={pins} height={300} />
      <div className="legend">
        <span><i style={{ background: "#2563eb" }} />Storage</span>
        <span><i style={{ background: "#1e7a46" }} />Your farm</span>
      </div>
    </section>
  );
}