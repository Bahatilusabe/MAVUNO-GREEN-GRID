import { Cherry, Sprout, Wheat } from "lucide-react";
import { CROP } from "../../shared/data";
import MapView from "../../shared/MapView";

const CROP_ICONS = { Tomatoes: Cherry, "French Beans": Sprout, Rice: Wheat };

const TONE_STYLES = {
  green: "bg-green-100 text-green-700 border-green-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-red-100 text-red-600 border-red-200",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3" role="tablist">
      {tabs.map((t) => {
        const isActive = active === t;
        return (
          <button
            key={t}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-xs ${
              isActive
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function Thumb({ crop, size = 64 }) {
  const c = CROP[crop] || CROP.Rice;
  const toneClass = TONE_STYLES[c.tone] || TONE_STYLES.green;

  return (
    <div
      className={`rounded-xl border flex items-center justify-center shadow-xs ${toneClass}`}
      style={{ width: size, height: size }}
    >
      <CropIcon crop={crop} size={size * 0.45} />
    </div>
  );
}

export function CropIcon({ crop, size = 20 }) {
  const Icon = CROP_ICONS[crop] || Sprout;
  return <Icon aria-hidden="true" size={size} />;
}

export function Stat({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-green-100 text-green-700 rounded-xl flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <small className="text-xs font-medium text-gray-500 block truncate">{label}</small>
        <strong className="text-base font-bold text-gray-900 block mt-0.5 truncate">{value}</strong>
      </div>
    </div>
  );
}

export function FakeMap(props) {
  return <MapView {...props} />;
}

export function Toggle({ label, on, onChange }) {
  return (
    <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
      <span className="text-sm font-semibold text-gray-900">{label}</span>
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          role="switch"
          checked={on}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-700"></div>
      </div>
    </label>
  );
}

export function KpiRow({ farms }) {
  const kg = farms.reduce((s, f) => s + f.kg, 0);
  const area = farms.reduce((s, f) => s + f.area, 0).toFixed(1);
  const high = farms.filter((f) => f.risk === "High").length;

  const kpis = [
    { value: farms.length, label: "Total farms", alert: false },
    { value: `${area} ha`, label: "Total area", alert: false },
    { value: `${(kg / 1000).toFixed(1)} t`, label: "Expected harvest", alert: false },
    { value: high, label: "High risk", alert: high > 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(({ value, label, alert }) => (
        <div 
          key={label} 
          className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between ${
            alert ? "border-red-300 bg-red-50/30" : "border-gray-200"
          }`}
        >
          <strong className={`text-2xl font-bold tracking-tight ${alert ? "text-red-700" : "text-gray-900"}`}>
            {value}
          </strong>
          <small className="text-xs font-medium text-gray-500 mt-1">{label}</small>
        </div>
      ))}
    </div>
  );
}