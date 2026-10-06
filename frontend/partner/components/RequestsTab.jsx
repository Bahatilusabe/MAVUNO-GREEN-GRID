import { Leaf, Check, X, AlertCircle } from "lucide-react";
import { fmt } from "../../shared/utils";

const STATUS_STYLES = {
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function RequestsTab({ requests, stats, accepting, onDecide }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
          <Leaf aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Incoming Farmer Requests</h3>
      </div>

      <div className="space-y-3">
        {requests.map((r) => {
          const tooBig = r.kg > stats.remaining;
          const blocked = tooBig || !accepting;
          const statusStyle = STATUS_STYLES[r.status.toLowerCase()] || STATUS_STYLES.default;

          return (
            <div 
              key={r.id} 
              className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 mt-0.5 shadow-2xs">
                  <Leaf aria-hidden="true" size={18} />
                </div>

                <div className="min-w-0 space-y-1">
                  <strong className="block text-sm font-bold text-gray-900 truncate">{r.farmer}</strong>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600 font-medium">
                    <span>{r.crop}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">{fmt(r.kg)} kg</span>
                    <span>•</span>
                    <span>{r.county}</span>
                    <span>•</span>
                    <span>{r.km} km away</span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Offer: <span className="font-bold text-green-800">KES {r.price}/kg</span> • Pickup: {r.date}
                  </div>

                  {r.status === "Pending" && tooBig && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1" role="alert">
                      <AlertCircle size={14} /> Exceeds free capacity ({fmt(stats.remaining)} kg).
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {r.status === "Pending" ? (
                  <>
                    <button
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-2xs ${
                        blocked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800 text-white cursor-pointer"
                      }`}
                      disabled={blocked}
                      title={blocked ? "Not enough capacity or partner accepting is paused" : ""}
                      onClick={() => onDecide(r, true)}
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                      onClick={() => onDecide(r, false)}
                    >
                      <X size={14} /> Decline
                    </button>
                  </>
                ) : (
                  <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusStyle}`}>
                    {r.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!requests.length && (
        <div className="p-12 text-center text-gray-500 text-sm font-medium bg-white">
          No incoming requests at the moment.
        </div>
      )}
    </section>
  );
}