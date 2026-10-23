import { useState } from "react";
import { Coins, Send, X } from "lucide-react";
import { cn } from "../../../src/lib/utils";
import Button from "../../../shared/ui/Button";
import Field from "../../../shared/ui/Field";

const CROPS = ["Tomatoes", "French Beans", "Rice", "Mangoes", "Avocado", "Potatoes"];

const today = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

/**
 * The message box, with the offer form folded into it.
 *
 * A farmer either writes a message or makes an offer — the two actions share
 * one send button so the thread never has two half-empty composers.
 */
export default function Composer({
  buyer,
  crops = [],
  onSend,
  onOffer,
  busy = false,
  disabled = false,
}) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("message"); // message | offer

  const [crop, setCrop] = useState(crops[0]?.crop_type ?? CROPS[0]);
  const [cropId, setCropId] = useState(crops[0]?.id ?? "");
  const [kg, setKg] = useState(crops[0]?.expected_yield ? String(crops[0].expected_yield) : "");
  const [price, setPrice] = useState(buyer?.listedPrice ? String(buyer.listedPrice) : "");
  const [date, setDate] = useState(today());
  const [error, setError] = useState(null);

  const sendMessage = () => {
    const value = text.trim();
    if (!value) return;
    onSend?.({ text: value });
    setText("");
  };

  const sendOffer = () => {
    const weight = Number(kg);
    const unitPrice = Number(price);
    if (!Number.isFinite(weight) || weight <= 0) {
      setError("Enter the weight you are offering.");
      return;
    }
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      setError("Enter the price per kg you are asking for.");
      return;
    }
    setError(null);
    onOffer?.({
      crop,
      cropId,
      kg: weight,
      pricePerKg: unitPrice,
      pickupDate: date,
    });
    setMode("message");
  };

  return (
    <div className="border-t border-border bg-card px-3 py-3 sm:px-4">
      {mode === "offer" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Coins size={14} aria-hidden="true" className="text-brand-600" />
              New price offer
            </span>
            <button
              type="button"
              onClick={() => setMode("message")}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close the offer form"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Crop" id="offer-crop">
              <select
                id="offer-crop"
                value={cropId || crop}
                onChange={(e) => {
                  const picked = crops.find((c) => c.id === e.target.value);
                  if (picked) {
                    setCropId(picked.id);
                    setCrop(picked.crop_type);
                    if (picked.expected_yield) setKg(String(picked.expected_yield));
                  } else {
                    setCropId("");
                    setCrop(e.target.value);
                  }
                }}
                className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-colors focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30"
              >
                {crops.length > 0 && <option value="">Choose a crop…</option>}
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.crop_type} · {Number(c.expected_yield || 0).toLocaleString("en-KE")} kg
                  </option>
                ))}
                {crops.length === 0 &&
                  CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Weight (kg)" id="offer-kg">
              <input
                id="offer-kg"
                type="number"
                min="1"
                step="10"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                placeholder="1200"
              />
            </Field>

            <Field
              label="Asking price (KES/kg)"
              id="offer-price"
              hint={buyer ? `${buyer.name} is buying around KES ${buyer.listedPrice}/kg.` : null}
            >
              <input
                id="offer-price"
                type="number"
                min="1"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="28"
              />
            </Field>

            <Field label="Pickup date" id="offer-date">
              <input
                id="offer-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>

          {error && <p className="text-xs font-semibold text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setMode("message")}>
              Cancel
            </Button>
            <Button size="sm" onClick={sendOffer} loading={busy} icon={Send}>
              Send offer
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setMode("offer")}
            disabled={disabled}
            title="Make a price offer"
            className={cn(
              "grid h-11 w-11 flex-none place-items-center rounded-xl border border-border bg-muted/60 text-muted-foreground transition-colors",
              "hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50",
            )}
            aria-label="Make a price offer"
          >
            <Coins size={18} aria-hidden="true" />
          </button>

          <textarea
            rows={1}
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={disabled ? "This conversation is closed" : `Message ${buyer?.name ?? "the buyer"}…`}
            aria-label="Message"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus:border-brand-500 focus:bg-card focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <Button
            onClick={sendMessage}
            disabled={disabled || !text.trim()}
            loading={busy}
            icon={Send}
            className="h-11 px-4"
            aria-label="Send message"
          >
            <span className="sr-only sm:not-sr-only">Send</span>
          </Button>
        </div>
      )}
    </div>
  );
}
