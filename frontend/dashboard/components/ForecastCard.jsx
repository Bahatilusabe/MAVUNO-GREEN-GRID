import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { FORECASTS } from "../../shared/data";
import { ChartFrame, HarvestChart } from "../../shared/charts";
import Tabs from "../../shared/ui/Tabs";

/**
 * The harvest forecast. The range switcher is the shared pill tab strip, so
 * it lines up with the tab strips in the market and partner views.
 */
export default function ForecastCard() {
  const [range, setRange] = useState("7 days");
  const forecast = FORECASTS[range] ?? FORECASTS["7 days"];

  return (
    <ChartFrame
      title="Harvest forecast"
      subtitle="Expected production against market demand"
      icon={TrendingUp}
      height={280}
      actions={
        <Tabs
          variant="pill"
          ariaLabel="Forecast range"
          tabs={Object.keys(FORECASTS).map((r) => ({ key: r, label: r }))}
          value={range}
          onChange={setRange}
        />
      }
    >
      <HarvestChart {...forecast} height={240} />
    </ChartFrame>
  );
}
