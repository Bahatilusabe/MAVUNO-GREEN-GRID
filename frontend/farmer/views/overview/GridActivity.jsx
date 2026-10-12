import {
  Link2, AlertTriangle, Handshake, Truck, Warehouse, Tag, CloudRain, Bell,
} from "lucide-react";
import { ACTIVITY } from "./data";

// Backend notification icon names -> lucide components
const ICONS = {
  risk: AlertTriangle,
  deal: Handshake,
  truck: Truck,
  storage: Warehouse,
  price: Tag,
  weather: CloudRain,
};

export default function GridActivity({ items }) {
  const live = Array.isArray(items);
  const list = live ? items : ACTIVITY;

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
          <Link2 className="text-green-600" aria-hidden="true" size={20} />
          Green Grid Activity
        </h3>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          {live ? "Live Feed" : "Sample"}
        </span>
      </div>

      <div className="divide-y divide-gray-100 flex-grow">
        {list.length === 0 && (
          <p className="p-5 text-sm text-gray-500">No recent activity.</p>
        )}
        {list.map((a, index) => {
          const Icon = typeof a.icon === "string" ? ICONS[a.icon] ?? Bell : a.icon;
          return (
            <div key={a.key || a.title || index} className="flex items-start gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                a.danger ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
              }`}>
                <Icon aria-hidden="true" size={18} />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{a.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.sub}</p>
              </div>

              <span className="flex-shrink-0 text-xs font-medium text-gray-400 whitespace-nowrap pt-0.5">
                {a.ago}
              </span>
            </div>
          );
        })}
      </div>

      {!live && (
        <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
          Sample data. Connect to live events.
        </div>
      )}
    </section>
  );
} 