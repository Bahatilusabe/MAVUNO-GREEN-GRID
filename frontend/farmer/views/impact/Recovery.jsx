import { Sprout, ShoppingCart, Factory, Recycle } from "lucide-react";
import { FLOW } from "./data";

const NODES = [
  { label: "Produce", sub: FLOW.produce, Icon: Sprout, x: 50, y: 16 },
  { label: "Market", sub: FLOW.market, Icon: ShoppingCart, x: 81.7, y: 50 },
  { label: "Processing", sub: FLOW.processing, Icon: Factory, x: 50, y: 84 },
  { label: "Recovery", sub: FLOW.recovery, Icon: Recycle, x: 18.3, y: 50 },
];

const ARCS = [
  "M182.5 50.7 A95 95 0 0 1 239.3 107.5",
  "M239.3 172.5 A95 95 0 0 1 182.5 229.3",
  "M117.5 229.3 A95 95 0 0 1 60.7 172.5",
  "M60.7 107.5 A95 95 0 0 1 117.5 50.7",
];

export default function Recovery() {
  return (
    <section className="card">
      <h3>Resource Recovery</h3>
      <small>Turning waste into value</small>
      <div className="pg-cycle">
        <svg viewBox="0 0 300 280" aria-hidden="true">
          <defs>
            <marker id="pg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#22a05a" />
            </marker>
          </defs>
          {ARCS.map((d) => <path key={d} d={d} fill="none" stroke="#22a05a" strokeWidth="1.6" markerEnd="url(#pg-arrow)" />)}
        </svg>
        <div className="pg-center">Circular<br />Economy</div>
        {NODES.map(({ label, sub, Icon, x, y }) => (
          <div key={label} className="pg-node" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="pg-ico green"><Icon size={22} aria-hidden="true" /></span>
            <strong>{label}</strong>
            <small>{sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}