import { Search, Users, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function QuickActions({ go }) {
  const actions = [
    [Search, "Find Transport", () => go("opportunities")],
    [Users, "Bundle Capacity", () => toast.success("Bundle request sent to 3 nearby farmers")],
    [MapPin, "Track Delivery", () => document.getElementById("deliveries")?.scrollIntoView({ behavior: "smooth" })],
  ];
  return (
    <section className="card">
      <h3>Quick Actions</h3>
      <div className="pg-quick">
        {actions.map(([Icon, label, run]) => (
          <button key={label} onClick={run}><Icon size={18} aria-hidden="true" /> {label}</button>
        ))}
      </div>
    </section>
  );
}