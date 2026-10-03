import { ChartColumnIncreasing } from "lucide-react";
import { BarsChart } from "../../shared/charts";
import { WEEKLY } from "../data";

export default function VolumeCard() {
  return (
    <section className="pp-card">
      <h3 className="pp-chart-title">
        <ChartColumnIncreasing aria-hidden="true" size={18} /> Weekly throughput
        (kg)
      </h3>
      <BarsChart data={WEEKLY} xKey="day" yKey="kg" />
      <small>Sample data. Replace with real deliveries.</small>
    </section>
  );
}
