import { useEffect, useState } from "react";
import { Leaf, Banknote, Cloud, Droplets, TrendingUp, Award } from "lucide-react";
import { fetchSurplusAlerts } from "../../shared/data";
import Loader from "../../shared/Loader";
import { STATS, TRENDS } from "./impact/data";
import Trend from "./impact/Trend";
import Recovery from "./impact/Recovery";
import Sources from "./impact/Sources";
import Reports from "./impact/Reports";
import Interventions from "./impact/Interventions";

export default function Impact() {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchSurplusAlerts()
      .then((response) => {
        if (active && response?.status === "success" && response.global_impact) {
          setImpactData(response.global_impact);
        }
      })
      .catch((error) => {
        console.error("Unable to load live impact data:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loader className="system-loader--section" label="Loading impact" words={["produce", "value", "water", "climate"]} />;
  }

  const saved = impactData
    ? `${Number(impactData.tonnes_saved ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`
    : STATS.produce;
  const protectedValue = impactData
    ? `KES ${Number(impactData.net_value_kes ?? impactData.revenue_kes ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`
    : STATS.value;
  const co2Avoided = impactData
    ? `${Number(impactData.co2e_avoided_t ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} t`
    : STATS.co2;

  const statCardsData = [
    { label: "Produce Saved", value: saved, trend: TRENDS.produce, icon: Leaf, tone: "green" },
    { label: "Value Protected", value: protectedValue, trend: TRENDS.value, icon: Banknote, tone: "green" },
    { label: "CO₂e Avoided", value: co2Avoided, trend: TRENDS.co2, icon: Cloud, tone: "blue" },
    { label: "Water Efficiency", value: STATS.water, trend: TRENDS.water, icon: Droplets, tone: "blue" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCardsData.map(({ label, value, trend, icon: Icon, tone }) => (
          <div key={label} className="relative p-5 rounded-xl border border-gray-200 bg-white shadow-sm flex items-start justify-between transition-all hover:shadow-md">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h4>
              <div className="flex items-center pt-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-green-100 text-green-700">
                  <TrendingUp size={12} /> {trend}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl flex items-center justify-center ${
              tone === "green" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}>
              <Icon aria-hidden="true" size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Impact Trend Chart */}
      <Trend />

      {/* Recovery & Sources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Recovery />
        </div>
        <div className="lg:col-span-6">
          <Sources />
        </div>
      </div>

      {/* Reports, Interventions & Green Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Reports />
          <Interventions />
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-green-800 to-green-950 text-white rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-green-700/20 pointer-events-none">
            <Leaf size={160} />
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="p-3 bg-white/10 w-fit rounded-xl backdrop-blur-xs text-white">
              <Leaf size={28} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Green Impact</h3>
              <p className="text-xs text-green-200 font-medium mt-0.5">Kirinyaga County</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-green-100 leading-relaxed relative z-10">
            <p className="font-semibold text-white">Small actions, big changes.</p>
            <p className="text-green-200/90 text-xs sm:text-sm">
              By using MAVUNO Green Grid, you're protecting farmer income, reducing food waste and fighting climate change.
            </p>
          </div>

          <div className="pt-4 border-t border-green-700/50 flex items-center gap-2 text-xs text-green-300 relative z-10 font-medium">
            <Award size={16} /> Verified Sustainable Producer
          </div>
        </div>
      </div>
    </div>
  );
}