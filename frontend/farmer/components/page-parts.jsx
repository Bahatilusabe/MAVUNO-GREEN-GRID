import { TrendingDown, TrendingUp } from "lucide-react";

const TONE_STYLES = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-700",
};

const STATUS_STYLES = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  atrisk: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatCard({ icon: Icon, tone = "green", label, value, trend, down, danger }) {
  const Arrow = down ? TrendingDown : TrendingUp;
  const toneClass = TONE_STYLES[tone] || TONE_STYLES.green;

  return (
    <div className={`relative p-5 rounded-xl border bg-white shadow-sm flex items-start justify-between transition-all hover:shadow-md ${
      danger ? "border-red-300 bg-red-50/30" : "border-gray-200"
    }`}>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
        
        {trend && (
          <div className="flex items-center pt-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              danger ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              <Arrow size={12} aria-hidden="true" /> {trend}
            </span>
          </div>
        )}
      </div>

      <div className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 ${toneClass}`}>
        <Icon size={22} aria-hidden="true" />
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const normalizedKey = status.toLowerCase().replace(/\s+/g, "");
  const statusClass = STATUS_STYLES[normalizedKey] || STATUS_STYLES.default;

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${statusClass}`}>
      {status}
    </span>
  );
}