import { useState } from "react";
import { toast } from "sonner";
import { fmt } from "../../shared/utils";

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
    <section className="pp-card pp-form">
      <h3>Your listing</h3>
      <label>
        Price offered (KES/kg)
        <input
          type="number"
          min="1"
          value={draft.price}
          onChange={edit("price")}
        />
      </label>
      <label>
        Daily capacity (kg)
        <input
          type="number"
          min="1"
          value={draft.capacity}
          onChange={edit("capacity")}
        />
      </label>
      {error && (
        <small className="warn" role="alert">
          {error}
        </small>
      )}
      <button
        className="pp-btn"
        disabled={!!error}
        onClick={() => {
          onSave(price, cap);
          toast.success("Listing saved");
        }}
      >
        Save listing
      </button>
      <small>Listing changes are local until you connect an API.</small>
    </section>
  );
}
