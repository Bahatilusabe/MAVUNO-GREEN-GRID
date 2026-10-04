import { useState } from "react";
import {
  CalendarDays,
  Flower2,
  Hourglass,
  Scale,
  TrendingUp,
} from "lucide-react";
import { RECS, FORECAST } from "../../shared/data";
import { HarvestChart } from "../../shared/charts";
import { cls, fmt } from "../../shared/utils";
import { Tabs, Thumb, Stat } from "../components/ui";

const SHARE = { High: 0.4, Medium: 0.2, Low: 0.05 };
const SPOILAGE = { High: "Medium", Medium: "Low", Low: "Low" };

export default function Forecast({ farm, onBack, go }) {
  const [tab, setTab] = useState("Overview");
  const share = SHARE[farm.risk];
  const surplus = Math.round(farm.kg * share);

  return (
    <>
      <button className="link" onClick={onBack}>
        ‹ Back
      </button>
      <div className="crop-head">
        <Thumb crop={farm.crop} size={64} />
        <h2>
          {farm.crop} – {farm.name}
        </h2>
      </div>
      <Tabs
        tabs={["Overview", "Forecast", "Risk Analysis", "Recommendations"]}
        active={tab}
        onChange={setTab}
      />
      <div className="stat-row">
        <Stat
          icon={<Flower2 aria-hidden="true" size={20} />}
          label="Current Stage"
          value={farm.stage}
        />
        <Stat
          icon={<CalendarDays aria-hidden="true" size={20} />}
          label="Expected Harvest"
          value={farm.harvest}
        />
        <Stat
          icon={<Scale aria-hidden="true" size={20} />}
          label="Expected Quantity"
          value={`${fmt(farm.kg)} kg`}
        />
        <Stat
          icon={<Hourglass aria-hidden="true" size={20} />}
          label="Harvest Window"
          value="5 days"
        />
      </div>
      {tab === "Recommendations" ? (
        <div className="card">
          <p>{RECS[0].text}</p>
          <button className="btn" onClick={() => go("recs")}>
            Open AI Recommendations
          </button>
        </div>
      ) : (
        <div className="split">
          <div className="card">
            <h3>
              <TrendingUp aria-hidden="true" size={18} /> Harvest Forecast
            </h3>
            <HarvestChart {...FORECAST} />
          </div>
          <div className="card">
            <h3>Surplus Risk</h3>
            <div className={cls("risk-box", `risk-${farm.risk.toLowerCase()}`)}>
              <strong>{farm.risk}</strong>
              <small>{Math.round(share * 100)}%</small>
            </div>
            <div className="risk-box neutral">
              <small>Potential surplus</small>
              <strong>{fmt(surplus)} kg</strong>
            </div>
            <div className="risk-box warn">
              <small>Spoilage risk</small>
              <strong>{SPOILAGE[farm.risk]}</strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
