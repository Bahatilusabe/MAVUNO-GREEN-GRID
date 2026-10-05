import { useEffect, useState } from "react";
import { Leaf, Banknote, Cloud, Droplets } from "lucide-react";
import { fetchSurplusAlerts } from "../../shared/data";
import { StatCard } from "../components/page-parts";
import { STATS, TRENDS } from "./impact/data";
import Trend from "./impact/Trend";
import Recovery from "./impact/Recovery";
import Sources from "./impact/Sources";
import Reports from "./impact/Reports";
import Interventions from "./impact/Interventions";

export default function Impact() {
  const [impactData, setImpactData] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSurplusAlerts().then((response) => {
      if (active && response?.status === "success" && response.global_impact) {
        setImpactData(response.global_impact);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const saved = impactData
    ? `${Number(impactData.tonnes_saved ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`
    : STATS.produce;
  const protectedValue = impactData
    ? `KES ${Number(impactData.net_value_kes ?? impactData.revenue_kes ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
    : STATS.value;
  const co2Avoided = impactData
    ? `${Number(impactData.co2e_avoided_t ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`
    : STATS.co2;

  return (
    <div className="pg">
      <div className="pg-stats">
        <StatCard icon={Leaf} tone="green" label="Produce Saved" value={saved} trend={TRENDS.produce} />
        <StatCard icon={Banknote} tone="green" label="Value Protected" value={protectedValue} trend={TRENDS.value} />
        <StatCard icon={Cloud} tone="blue" label="CO₂e Avoided" value={co2Avoided} trend={TRENDS.co2} />
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