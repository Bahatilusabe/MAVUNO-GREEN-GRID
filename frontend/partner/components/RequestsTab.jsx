import { useState } from "react";
import { Leaf, MessageSquare, AlertCircle } from "lucide-react";
import { fmt } from "../../shared/utils";
import DealThread from "../../shared/DealThread";

const STATUS_STYLES = {
  scheduled: "bg-green-100 text-green-800 border-green-200",
  in_transit: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function RequestsTab({ requests, stats, accepting, onChanged }) {
  const [openId, setOpenId] = useState(null);
  const openReq = requests.find((r) => r.id === openId);

  const blockedFor = (r) => r.kg > stats.remaining || !accepting;

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
          <Leaf aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Incoming Farmer Requests</h3>
      </div>

      <div className="space-y-3">
        {requests.map((r) => {
          const status = r.status.toLowerCase();
          const isPending = status === "pending";
          const tooBig = r.kg > stats.remaining;
          const yourTurn = isPending && r.pendingFrom === "farmer";
          const price = r.pendingPrice ?? r.pricePerKg;

          return (
            <div
              key={r.id}
              className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 mt-0.5">
                  <Leaf aria-hidden="true" size={18} />
                </div>
                <div className="min-w-0 space-y-1">
                  <strong className="block text-sm font-bold text-gray-900 truncate">{r.farmerName}</strong>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600 font-medium">
                    <span>{r.crop}</span>
                    <span>•</span>
                    <span className="font-semibold text-gray-900">{fmt(r.kg)} kg</span>
                    {r.county && (
                      <>
                        <span>•</span>
                        <span>{r.county}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {isPending ? (r.pendingFrom === "partner" ? "Your offer: " : "Their offer: ") : "Price: "}
                    <span className="font-bold text-green-800">KES {price}/kg</span>
                    {r.pickupDate && <> • Pickup: {r.pickupDate}</>}
                  </div>
                  {isPending && tooBig && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold pt-1" role="alert">
                      <AlertCircle size={14} /> Exceeds free capacity ({fmt(stats.remaining)} kg).
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {!isPending && (
                  <span
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${
                      STATUS_STYLES[status] ?? "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </span>
                )}
                {yourTurn && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800">
                    Your turn
                  </span>
                )}
                <button
                  onClick={() => setOpenId(r.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-green-700 hover:bg-green-800 text-white flex items-center gap-1"
                >
                  <MessageSquare size={14} /> {isPending ? "Negotiate" : "View"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!requests.length && (
        <div className="p-12 text-center text-gray-500 text-sm font-medium">No incoming requests at the moment.</div>
      )}

      {openReq && (
        <DealThread
          dealId={openReq.id}
          blockAccept={blockedFor(openReq)}
          onClose={() => setOpenId(null)}
          onChanged={onChanged}
        />
      )}
    </section>
  );
}