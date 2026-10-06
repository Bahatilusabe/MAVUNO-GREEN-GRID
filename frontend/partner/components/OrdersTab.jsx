import { fmt } from "../../shared/utils";
import { NEXT_LABEL } from "../data";
import { ShoppingCart } from "lucide-react";

const STATUS_STYLES = {
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  "in-transit": "bg-amber-100 text-amber-800 border-amber-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function OrdersTab({ orders, onAdvance }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shadow-2xs">
          <ShoppingCart aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Orders Management</h3>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="p-3.5 sm:px-5">Farmer</th>
              <th className="p-3.5 sm:px-5">Crop</th>
              <th className="p-3.5 sm:px-5">Quantity</th>
              <th className="p-3.5 sm:px-5">Value</th>
              <th className="p-3.5 sm:px-5">Pickup</th>
              <th className="p-3.5 sm:px-5">Status</th>
              <th className="p-3.5 sm:px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {orders.map((o) => {
              const statusKey = o.status.replace(" ", "-").toLowerCase();
              const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.default;
              const nextLabel = NEXT_LABEL[o.status];

              return (
                <tr key={o.id} className="hover:bg-gray-50/65 transition-colors">
                  <td className="p-3.5 sm:px-5">
                    <strong className="font-bold text-gray-900">{o.farmer}</strong>
                  </td>
                  <td className="p-3.5 sm:px-5 text-gray-700 font-medium">{o.crop}</td>
                  <td className="p-3.5 sm:px-5 text-gray-800 font-semibold">{fmt(o.kg)} kg</td>
                  <td className="p-3.5 sm:px-5 text-gray-800 font-semibold">KES {fmt(o.kg * o.price)}</td>
                  <td className="p-3.5 sm:px-5 text-gray-500 font-medium">{o.date}</td>
                  <td className="p-3.5 sm:px-5">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusStyle}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-5 text-right">
                    {nextLabel && (
                      <button 
                        className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                        onClick={() => onAdvance(o.id)}
                      >
                        {nextLabel}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!orders.length && (
          <div className="p-12 text-center text-gray-500 text-sm font-medium bg-white">
            No active orders available.
          </div>
        )}
      </div>
    </section>
  );
}