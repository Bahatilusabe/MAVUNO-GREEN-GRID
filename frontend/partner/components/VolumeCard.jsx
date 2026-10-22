import { ChartColumnIncreasing } from "lucide-react";
import { BarsChart } from "../../shared/charts";
import { ChartFrame } from "../../shared/charts";
import { COLORS } from "../../shared/chartColors";

export default function VolumeCard({ data = [], live = false }) {
  return (
    <ChartFrame
      title="Weekly throughput"
      subtitle="Kilograms handled per day"
      icon={ChartColumnIncreasing}
      height={240}
      badge={
        live ? null : (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
            Sample data
          </span>
        )
      }
    >
      <BarsChart
        data={data}
        xKey="day"
        yKey="kg"
        color={COLORS.green}
        height={220}
        unit=" kg"
        label="Throughput"
      />
    </ChartFrame>
  );
}
