import { Handshake, Check, X } from "lucide-react";

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function PartnersCard({ partners, onDecide }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
          <Handshake aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Partners</h3>
      </div>

      {/* Partners List */}
      <div className="space-y-3">
        {partners.map((p) => {
          const statusKey = p.status.toLowerCase();
          const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

          return (
            <div 
              key={p.id} 
              className="bg-gray-50/70 border border-gray-100 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:bg-gray-100/50 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <strong className="block text-sm font-bold text-gray-900 truncate">{p.name}</strong>
                <small className="text-xs text-gray-500 font-medium block truncate">
                  {p.type} • {p.county}
                </small>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {p.status === "Pending" ? (
                  <>
                    <button 
                      className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer" 
                      onClick={() => onDecide(p.id, "Approved")}
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button 
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer" 
                      onClick={() => onDecide(p.id, "Rejected")}
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusStyle}`}>
                    {p.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}