import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { FORECASTS } from "../../shared/data";
import { HarvestChart } from "../../shared/charts";
import { cls } from "../../shared/utils";

export default function ForecastCard() {
  const [range, setRange] = useState("7 days");
  return (
    <section className="db-card">
      <div className="db-row">
        <h3 className="grow db-heading">
          <TrendingUp aria-hidden="true" size={18} /> Harvest Forecast
        </h3>
        <div className="db-seg" role="tablist">
          {Object.keys(FORECASTS).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              className={cls(range === r && "on")}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <HarvestChart {...FORECASTS[range]} />
    </section>
  );
}
