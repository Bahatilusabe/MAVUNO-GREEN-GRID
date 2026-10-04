import { Sparkles, Banknote, Route, Cloud } from "lucide-react";
import { toast } from "sonner";

const SAVINGS = [
  [Banknote, "KES 18,400", "Cost reduction"],
  [Route, "240 km", "Distance saved"],
  [Cloud, "320 kg CO₂e", "Emissions avoided"],
];

export default function PlanCard() {
  return (
    <section className="card">
      <h3>Recommended Transport Plan</h3>
      <div className="pg-ai"><Sparkles size={16} aria-hidden="true" /> <strong>MAVUNO AI</strong></div>
      <p className="pg-note">Bundle your tomato deliveries with 3 other farmers to fill a 10-ton truck on the Kirinyaga → Nairobi route.</p>
      <p className="pg-note">This reduces your transport cost by 32% and cuts emissions by 28%.</p>
      <button className="btn pg-block" onClick={() => toast.success("Bundle request sent to 3 nearby farmers")}>View Plan</button>
      <h4>Estimated savings</h4>
      {SAVINGS.map(([Icon, value, label]) => (
        <div key={label} className="pg-opt">
          <span className="pg-mini"><Icon size={16} aria-hidden="true" /></span>
          <div><strong>{value}</strong><small>{label}</small></div>
        </div>
      ))}
    </section>
  );
}