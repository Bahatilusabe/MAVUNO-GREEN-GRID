import {
  ChartColumnIncreasing,
  CircleAlert,
  Store,
  Warehouse,
} from "lucide-react";
import { RECS } from "../../shared/data";
import { Donut, PALETTE } from "../../shared/charts";
import { KpiRow } from "../components/ui";

const RECOMMENDATION_ICONS = {
  Harvest: CircleAlert,
  Market: Store,
  Storage: Warehouse,
};

export default function Overview({ farms, go }) {
  const byCrop = farms.reduce(
    (m, f) => ({ ...m, [f.crop]: (m[f.crop] || 0) + f.kg }),
    {},
  );
  const mix = Object.entries(byCrop)
    .filter(([, kg]) => kg > 0)
    .map(([crop, kg], i) => ({
      name: crop,
      value: kg,
      color: PALETTE[i % PALETTE.length],
    }));

  return (
    <>
      <KpiRow farms={farms} />
      <div className="split">
        <div className="card">
          <h3>Needs attention</h3>
          {RECS.slice(0, 2).map((r) => (
            <div key={r.id} className="row">
              <span className="row-icon">
                {(() => {
                  const Icon = RECOMMENDATION_ICONS[r.kind] || CircleAlert;
                  return <Icon aria-hidden="true" size={18} />;
                })()}
              </span>
              <div className="grow">
                <strong>{r.title}</strong>
                <small>{r.text}</small>
              </div>
              <button className="btn btn-sm" onClick={() => go("recs")}>
                Open
              </button>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>
            <ChartColumnIncreasing aria-hidden="true" size={18} /> Expected
            harvest by crop (kg)
          </h3>
          <Donut data={mix} unit=" kg" />
        </div>
      </div>
    </>
  );
}
