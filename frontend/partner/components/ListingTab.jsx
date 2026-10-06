import { useState } from "react";
import { toast } from "sonner";
import { fmt } from "../../shared/utils";
import { Store } from "lucide-react";

export default function ListingTab({ listing, load, onSave }) {
  const [draft, setDraft] = useState({
    price: String(listing.price),
    capacity: String(listing.capacity),
  });

  const price = Number(draft.price),
    cap = Number(draft.capacity);

  const error = !(price > 0)
    ? "Enter a price above 0."
    : !(cap > 0)
    ? "Enter a capacity above 0."
    : cap < load
    ? `Capacity can't go below current load (${fmt(load)} kg).`
    : "";

  const edit = (k) => (e) => {
    setDraft({ ...draft, [k]: e.target.value });
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5 max-w-xl">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <div className="p-2 bg-green-100 text-green-700 rounded-lg shadow-2xs">
          <Store aria-hidden="true" size={18} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Your Listing</h3>
      </div>

      <div className="space-y-4">
        {/* Price Input */}
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Price offered (KES/kg)</span>
          <input
            type="number"
            min="1"
            value={draft.price}
            onChange={edit("price")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-green-600 transition-all font-medium"
          />
        </label>

        {/* Capacity Input */}
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Daily capacity (kg)</span>
          <input
            type="number"
            min="1"
            value={draft.capacity}
            onChange={edit("capacity")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-green-600 transition-all font-medium"
          />
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700" role="alert">
          {error}
        </div>
      )}

      <button
        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${
          Boolean(error)
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800 text-white cursor-pointer"
        }`}
        disabled={!!error}
        onClick={() => {
          onSave(price, cap);
          toast.success("Listing saved");
        }}
      >
        Save listing
      </button>

      <div className="text-center pt-1">
        <small className="text-[11px] text-gray-400 font-medium">Listing changes are local until you connect an API.</small>
      </div>
    </section>
  );
}