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
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {ACTIVITY.map(([icon, activity, when]) => {
          const Icon = ACTIVITY_ICONS[icon] || TrendingUp;
          return (
            <div 
              key={activity} 
              className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50/70 border border-gray-100 hover:bg-green-50/40 transition-colors"
            >
              <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 shadow-2xs">
                <Icon aria-hidden="true" size={16} />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate leading-snug">{activity}</p>
                <small className="text-[11px] text-gray-400 font-medium block mt-0.5">{when}</small>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}