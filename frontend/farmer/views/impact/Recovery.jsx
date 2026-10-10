
import { Sprout, ShoppingCart, Factory, Recycle, RefreshCw } from "lucide-react";
import { FLOW } from "./data";
import { COLORS } from "../../../shared/chartColors";

const NODES = [
  { label: "Produce", sub: FLOW.produce, Icon: Sprout, x: "left-1/2 -translate-x-1/2 top-4" },
  { label: "Market", sub: FLOW.market, Icon: ShoppingCart, x: "right-4 top-1/2 -translate-y-1/2 text-right" },
  { label: "Processing", sub: FLOW.processing, Icon: Factory, x: "left-1/2 -translate-x-1/2 bottom-4" },
  { label: "Recovery", sub: FLOW.recovery, Icon: Recycle, x: "left-4 top-1/2 -translate-y-1/2 text-left" },
];

const ARCS = [
  "M182.5 50.7 A95 95 0 0 1 239.3 107.5",
  "M239.3 172.5 A95 95 0 0 1 182.5 229.3",
  "M117.5 229.3 A95 95 0 0 1 60.7 172.5",
  "M60.7 107.5 A95 95 0 0 1 117.5 50.7",
];

export default function Recovery() {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
            <RefreshCw className="text-green-600" aria-hidden="true" size={20} /> 
            Resource Recovery
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Turning waste into value</p>
        </div>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          Circular Economy
        </span>
      </div>

      {/* Cycle Diagram Container */}
      <div className="p-6 relative flex items-center justify-center min-h-[340px] bg-gray-50/50">
        
        {/* SVG Flow Arcs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 300 280" className="w-72 h-72" aria-hidden="true">
            <defs>
              <marker id="tailwind-pg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L10 5L0 10z" fill={COLORS.green} />
              </marker>
            </defs>
            {ARCS.map((d) => (
              <path key={d} d={d} fill="none" stroke={COLORS.green} strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#tailwind-pg-arrow)" />
            ))}
          </svg>
        </div>

        {/* Center Badge */}
        <div className="absolute z-10 w-24 h-24 rounded-full bg-green-700 text-white flex flex-col items-center justify-center text-center shadow-md font-bold text-xs uppercase tracking-wider">
          <span>Circular</span>
          <span>Economy</span>
        </div>

        {/* Circular Nodes */}
        {NODES.map(({ label, sub, Icon, x }) => (
          <div key={label} className={`absolute z-20 flex flex-col items-center max-w-[120px] p-2 bg-white/90 backdrop-blur-xs rounded-xl border border-gray-200 shadow-xs ${x}`}>
            <div className="p-2 bg-green-100 text-green-700 rounded-lg mb-1">
              <Icon size={18} aria-hidden="true" />
            </div>
            <strong className="text-xs font-bold text-gray-900 truncate">{label}</strong>
            <small className="text-[10px] text-gray-500 text-center truncate w-full">{sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}