import { useState } from "react";
import { ArrowLeftRight, CalendarDays, Check, CircleCheck, Coins, Package, X } from "lucide-react";
import { toneStyle } from "../../../shared/kit/tones";
import { cn } from "../../../src/lib/utils";
import Button from "../../../shared/ui/Button";
import Field from "../../../shared/ui/Field";
import { OFFER } from "./store";

/**
 * The status a deal is in, and how it reads.
 *
 * The tone names map onto the shared `--tone-*` tokens, so the card follows
 * the active theme in both light and dark mode.
 */
const STATUS = {
  [OFFER.PROPOSED]: { label: "Awaiting reply", tone: "amber" },
  [OFFER.COUNTERED]: { label: "Countered", tone: "blue" },
  [OFFER.AGREED]: { label: "Price agreed", tone: "green" },
  [OFFER.DECLINED]: { label: "Declined", tone: "red" },
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-KE", {
    minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

/**
 * A price offer inside the thread.
 *
 * It carries the terms (crop, weight, price, pickup day), the buyer's
 * answer, and the actions that move the negotiation: accept, counter, or
 * walk away. When both sides land on the same number the card shows the
 * agreed value and offers to turn it into a real match request.
 */
export default function OfferCard({
  offer,
  mine = false,
  onAccept,
  onCounter,
  onDecline,
  onCreateMatch,
  busy = false,
  className,
}) {
  const [countering, setCountering] = useState(false);
  const [price, setPrice] = useState("");

  if (!offer) return null;

  const status = STATUS[offer.status] ?? STATUS[OFFER.PROPOSED];
  const kg = Number(offer.kg) || 0;
  const agreedPrice = Number(offer.pricePerKg) || 0;
  const total = kg * agreedPrice;
  const settled = offer.status === OFFER.AGREED;
  // The deal carries its own `open` flag: a buyer may decline an offer and
  // still leave a price the farmer can take.
  const open =
    offer.open ?? (offer.status === OFFER.PROPOSED || offer.status === OFFER.COUNTERED);
  const waiting = Boolean(offer.pending);

  const submitCounter = () => {
    const value = Number(price);
    if (!Number.isFinite(value) || value <= 0) return;
    onCounter?.(value);
    setCountering(false);
    setPrice("");
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card",
        settled ? "border-brand-300" : "border-border",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Coins size={14} aria-hidden="true" className="text-brand-600" />
          {mine ? "Your offer" : "Buyer's terms"}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          style={toneStyle(status.tone)}
        >
          {status.label}
        </span>
      </div>

      <div className="space-y-3 px-4 py-4">
        {/* Terms */}
        <dl className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Package size={11} aria-hidden="true" /> Crop
            </dt>
            <dd className="mt-0.5 truncate text-xs font-bold text-foreground">
              {offer.crop || "—"}
            </dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <ArrowLeftRight size={11} aria-hidden="true" /> Weight
            </dt>
            <dd className="mt-0.5 text-xs font-bold tabular text-foreground">
              {kg.toLocaleString("en-KE")} kg
            </dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <CalendarDays size={11} aria-hidden="true" /> Pickup
            </dt>
            <dd className="mt-0.5 truncate text-xs font-bold text-foreground">
              {offer.pickupDate || "To agree"}
            </dd>
          </div>
        </dl>

        {/* Price */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Agreed price
            </span>
            <span className="mt-0.5 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold tracking-tight tabular text-foreground">
                KES {money(agreedPrice)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">/kg</span>
            </span>
          </div>
          {kg > 0 && (
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Lot value
              </span>
              <span className="mt-0.5 block text-sm font-extrabold tabular text-brand-700">
                KES {money(total)}
              </span>
            </div>
          )}
        </div>

        {/* The farmer's original number, when the buyer moved it. */}
        {offer.offeredPrice != null && Number(offer.offeredPrice) !== agreedPrice && (
          <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            You asked KES {money(offer.offeredPrice)}/kg. The buyer came back at{" "}
            <strong className="text-foreground">KES {money(agreedPrice)}/kg</strong>.
          </p>
        )}

        {/* Settled */}
        {settled && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5">
            <span className="flex items-center gap-2 text-xs font-bold text-brand-800">
              <CircleCheck size={15} aria-hidden="true" />
              Both sides agreed on KES {money(agreedPrice)}/kg
            </span>
            {onCreateMatch && (
              <Button size="sm" onClick={onCreateMatch} loading={busy} icon={Package}>
                Create match request
              </Button>
            )}
          </div>
        )}

        {/* Open negotiation */}
        {open && (
          <div className="space-y-2.5 border-t border-border pt-3">
            {waiting ? (
              <p className="text-xs font-semibold text-muted-foreground">
                Waiting for {mine ? "the buyer" : "you"} to reply…
              </p>
            ) : countering ? (
              <div className="space-y-2">
                <Field
                  label="Your counter price (KES/kg)"
                  type="number"
                  min="1"
                  step="0.5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={String(agreedPrice)}
                  autoFocus
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={submitCounter} icon={ArrowLeftRight}>
                    Send counter
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setCountering(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={onAccept} icon={Check}>
                  Accept KES {money(agreedPrice)}/kg
                </Button>
                {onCounter && (
                  <Button size="sm" variant="secondary" onClick={() => setCountering(true)} icon={ArrowLeftRight}>
                    Counter
                  </Button>
                )}
                {onDecline && (
                  <Button size="sm" variant="ghost" onClick={onDecline} icon={X}>
                    Decline
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {offer.status === OFFER.DECLINED && (
          <p className="rounded-xl bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
            {open
              ? "The buyer will not go that far. Take their best price or send a counter."
              : "This lot was not agreed. You can send a fresh offer at any time."}
          </p>
        )}
      </div>
    </div>
  );
}
