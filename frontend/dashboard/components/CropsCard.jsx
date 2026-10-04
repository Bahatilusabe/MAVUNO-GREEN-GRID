import { Cherry, Sprout, Wheat } from "lucide-react";
import { INITIAL_FARMS as FARMS } from "../../shared/data";

const CROP_ICONS = { Tomatoes: Cherry, "French Beans": Sprout, Rice: Wheat };

export default function CropsCard({ onNavigate }) {
  return (
    <section className="db-card">
      <div className="db-row">
        <h3 className="grow">My Crops</h3>
        <button className="db-link" onClick={() => onNavigate("crops")}>
          View all
        </button>
      </div>
      {FARMS.map((f) => (
        <button
          key={f.id}
          className="db-crop"
          onClick={() => onNavigate("crops")}
        >
          <span className="db-ico lg">
            {(() => {
              const Icon = CROP_ICONS[f.crop] || Sprout;
              return <Icon aria-hidden="true" size={26} />;
            })()}
          </span>
          <div className="grow">
            <strong>{f.crop}</strong>
            <small>
              {f.name} • {(f.kg / 1000).toFixed(1)} t • {f.harvest}
            </small>
            <div className="db-bar">
              <div style={{ width: `${f.perf}%` }} />
            </div>
          </div>
          <span className={`db-pill ${f.risk.toLowerCase()}`}>{f.risk}</span>
        </button>
      ))}
    </section>
  );
}
