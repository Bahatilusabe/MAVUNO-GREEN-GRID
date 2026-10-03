import { Cherry, Sprout, Wheat } from "lucide-react";
import { CROP } from "../../shared/data";
import { cls } from "../../shared/utils";

const CROP_ICONS = { Tomatoes: Cherry, "French Beans": Sprout, Rice: Wheat };

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={active === t}
          className={cls("tab", active === t && "active")}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function Thumb({ crop, size = 64 }) {
  const c = CROP[crop] || CROP.Rice;
  return (
    <div
      className={`thumb thumb-${c.tone}`}
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
    <div className="stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export function FakeMap({ pins = [], height = 260, risk = false }) {
  return (
    <div className={cls("map", risk && "map-risk")} style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="map-roads"
        aria-hidden
      >
        <path d="M0 30 Q30 40 50 55 T100 80" />
        <path d="M20 0 Q35 40 60 100" />
        <path d="M0 85 Q40 60 100 20" />
      </svg>
      {risk && <div className="risk-blob" />}
      {pins.map((p, i) => (
        <span
          key={i}
          className="pin"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }}
          title={p.label}
        />
      ))}
    </div>
  );
}

export function Toggle({ label, on, onChange }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i />
    </label>
  );
}

export function KpiRow({ farms }) {
  const kg = farms.reduce((s, f) => s + f.kg, 0);
  const area = farms.reduce((s, f) => s + f.area, 0).toFixed(1);
  const high = farms.filter((f) => f.risk === "High").length;
  return (
    <div className="stat-row">
      <div className="card kpi">
        <strong>{farms.length}</strong>
        <small>Total farms</small>
      </div>
      <div className="card kpi">
        <strong>{area} ha</strong>
        <small>Total area</small>
      </div>
      <div className="card kpi">
        <strong>{(kg / 1000).toFixed(1)} t</strong>
        <small>Expected harvest</small>
      </div>
      <div className="card kpi danger">
        <strong>{high}</strong>
        <small>High risk</small>
      </div>
    </div>
  );
}
