import { Cherry, Droplets, Tractor, TrendingUp } from "lucide-react";
import { ACTIVITY } from "../data";

const ACTIVITY_ICONS = {
  tomato: Cherry,
  forecast: TrendingUp,
  water: Droplets,
  farm: Tractor,
};

export default function ActivityCard() {
  return (
    <section className="db-card">
      <h3>Recent Activity</h3>
      {ACTIVITY.map(([icon, activity, when]) => {
        const Icon = ACTIVITY_ICONS[icon] || TrendingUp;
        return (
          <div key={activity} className="db-row">
            <span className="db-ico sm">
              <Icon aria-hidden="true" size={16} />
            </span>
            <div className="grow">
              <small className="ink">{activity}</small>
              <small>{when}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
}
