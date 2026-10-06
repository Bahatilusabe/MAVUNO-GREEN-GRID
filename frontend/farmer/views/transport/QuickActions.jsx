import { Search, Users, MapPin, Zap } from "lucide-react";
import { toast } from "sonner";

export default function QuickActions({ go }) {
  const actions = [
    { 
      icon: Search, 
      label: "Find Transport", 
      desc: "Browse available logistics and routes", 
      run: () => go("opportunities") 
    },
    { 
      icon: Users, 
      label: "Bundle Capacity", 
      desc: "Pool harvest with nearby farmers", 
      run: () => toast.success("Bundle request sent to 3 nearby farmers") 
    },
    { 
      icon: MapPin, 
      label: "Track Delivery", 
      desc: "Jump to active shipment status", 
      run: () => document.getElementById("deliveries")?.scrollIntoView({ behavior: "smooth" }) 
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-transparent flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-green-900">
            <Zap className="text-green-600" aria-hidden="true" size={20} /> 
            Quick Actions
          </h3>
          <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
            Shortcuts
          </span>
        </div>

        {/* Actions Grid */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actions.map(({ icon: Icon, label, desc, run }) => (
            <button
              key={label}
              onClick={run}
              className="text-left bg-gray-50 hover:bg-green-50/50 border border-gray-200 hover:border-green-300 p-4 rounded-xl transition-all group flex flex-col justify-between shadow-xs hover:shadow-sm"
            >
              <div className="p-2.5 bg-green-100 text-green-700 rounded-lg w-fit group-hover:bg-green-700 group-hover:text-white transition-colors mb-3">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-gray-900 group-hover:text-green-800 transition-colors">
                  {label}
                </strong>
                <small className="text-xs text-gray-500 block mt-0.5 leading-relaxed">
                  {desc}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}