import { Leaf, Banknote, Cloud, Droplets } from "lucide-react";
import { StatCard } from "../components/page-parts";
import { STATS, TRENDS } from "./impact/data";
import Trend from "./impact/Trend";
import Recovery from "./impact/Recovery";
import Sources from "./impact/Sources";
import Reports from "./impact/Reports";
import Interventions from "./impact/Interventions";

export default function Impact() {
  return (
    <div className="pg">
      <div className="pg-stats">
        <StatCard icon={Leaf} tone="green" label="Produce Saved" value={STATS.produce} trend={TRENDS.produce} />
        <StatCard icon={Banknote} tone="green" label="Value Protected" value={STATS.value} trend={TRENDS.value} />
        <StatCard icon={Cloud} tone="blue" label="CO₂e Avoided" value={STATS.co2} trend={TRENDS.co2} />
        <StatCard icon={Droplets} tone="blue" label="Water Efficiency" value={STATS.water} trend={TRENDS.water} />
      </div>
      <Trend />
      <div className="pg-two">
        <Recovery />
        <Sources />
      </div>
      <div className="pg-two wide">
        <div className="pg-col">
          <Reports />
          <Interventions />
        </div>
        <section className="pg-green">
          <Leaf size={28} aria-hidden="true" />
          <h3>Your Green Impact</h3>
          <small>Kirinyaga County</small>
          <p>Small actions, big changes.</p>
          <p>By using MAVUNO Green Grid, you're protecting farmer income, reducing food waste and fighting climate change.</p>
        </section>
      </div>
    </div>
  );
}