import { useMemo } from "react";
import StatCards from "./overview/StatCards";
import RiskWatch from "./overview/RiskWatch";
import FarmsTable from "./overview/FarmsTable";
import TodayRecs from "./overview/TodayRecs";
import HarvestOutlook from "./overview/HarvestOutlook";
import GridActivity from "./overview/GridActivity";
import EnvImpact from "./overview/EnvImpact";

const EXPOSED_SHARE = 0.8; // mock: share of a high-risk harvest assumed exposed

export default function Overview({ farms, go, onOpenFarm }) {
  const m = useMemo(() => {
    const high = farms.filter((f) => f.risk === "High");
    return {
      count: farms.length,
      tons: farms.reduce((s, f) => s + f.kg, 0) / 1000,
      exposedKg: Math.round(high.reduce((s, f) => s + f.kg, 0) * EXPOSED_SHARE),
      topFarm: high[0],
    };
  }, [farms]);

  return (
    <div className="ov">
      <StatCards m={m} />
      <RiskWatch m={m} go={go} />
      <div className="ov-mid">
        <FarmsTable farms={farms} onOpen={onOpenFarm} go={go} />
        <TodayRecs go={go} />
      </div>
      <div className="ov-bottom">
        <HarvestOutlook />
        <GridActivity />
        <EnvImpact />
      </div>
    </div>
  );
}