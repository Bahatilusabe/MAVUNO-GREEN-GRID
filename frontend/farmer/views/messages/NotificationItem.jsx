import { TriangleAlert, Handshake, Truck, Warehouse, TrendingUp, CloudRain, X, ArrowRight } from "lucide-react";

const ICONS = { 
  risk: TriangleAlert, 
  deal: Handshake, 
  truck: Truck, 
  storage: Warehouse, 
  price: TrendingUp, 
  weather: CloudRain 
};

const TONE_STYLES = {
  red: "bg-red-100 text-red-600",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-600",
  amber: "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-600",
};

export default function NotificationItem({ n, onRead, onOpen, onDismiss }) {
  const Icon = ICONS[n.icon] || TriangleAlert;
  const toneClass = TONE_STYLES[n.tone] || "bg-green-100 text-green-700";

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative group ${
      n.unread 
        ? "bg-green-50/40 border-green-200 shadow-xs" 
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}>
      {/* Left: Icon & Main Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${toneClass}`}>
          <Icon size={20} aria-hidden="true" />
        </div>

        <button 
          className="text-left flex-1 min-w-0 focus:outline-none" 
          onClick={() => onRead(n.id)}
        >
          <div className="flex items-center gap-2">
            <strong className="text-sm font-bold text-gray-900 group-hover:text-green-800 transition-colors">
              {n.title}
            </strong>
            {n.unread && (
              <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" role="img" aria-label="Unread" />
            )}
          </div>
          <small className="text-xs text-gray-600 block mt-0.5 leading-relaxed">
            {n.text}
          </small>
        </button>
      </div>

      {/* Right: Meta, Action, & Dismiss */}
      <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <small className="text-[11px] text-gray-400 font-medium whitespace-nowrap">
          {n.ago}
        </small>

        <div className="flex items-center gap-2">
          {n.action && (
            <button 
              className="px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex items-center gap-1 shadow-xs" 
              onClick={() => onOpen(n)}
            >
              {n.action.label} <ArrowRight size={12} />
            </button>
          )}

          <button 
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
            aria-label={`Dismiss ${n.title}`} 
            onClick={() => onDismiss(n.id)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}