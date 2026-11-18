import { Handshake, MapPin, MessageCircle } from "lucide-react";
import { cn } from "../../../src/lib/utils";
import { lastMessage, unreadCount, describeDeal } from "./store";
import { OFFER } from "./store";

/**
 * The list of counterparties.
 *
 * Each row shows who the farmer is talking to, the last thing that was
 * said, and — when there is one — where the negotiation stands, so a
 * half-agreed price is never buried in the thread.
 */
export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold text-foreground">Buyers</h2>
        <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
          Negotiate price and confirm a lot
        </p>
      </div>

      <ul className="scrollbar-thin flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const last = lastMessage(c);
          const active = c.id === activeId;
          // The conversation on screen is being read, so it carries no badge.
          const unread = active ? 0 : unreadCount(c);
          const deal = c.deal;
          const settled = deal?.status === OFFER.AGREED;

          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors",
                  active
                    ? "bg-brand-50/70 dark:bg-brand-50/30"
                    : "hover:bg-muted/70",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 flex-none place-items-center rounded-xl text-xs font-extrabold",
                    active
                      ? "bg-brand-700 text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  {c.buyer.initials}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <strong
                      className={cn(
                        "truncate text-sm",
                        active ? "text-brand-800" : "text-foreground",
                      )}
                    >
                      {c.buyer.name}
                    </strong>
                    {unread > 0 && (
                      <span className="flex-none rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </span>

                  <span className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                    <MapPin size={10} aria-hidden="true" />
                    {c.buyer.km} km · {c.buyer.type}
                  </span>

                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {last ? last.text : "Start the conversation"}
                  </span>

                  {deal && (
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        settled
                          ? "bg-brand-100 text-brand-800"
                          : deal.status === OFFER.DECLINED
                            ? "bg-destructive/10 text-destructive"
                            : "bg-amber-100 text-amber-800",
                      )}
                    >
                      {settled ? (
                        <>
                          <Handshake size={10} aria-hidden="true" /> Agreed · KES{" "}
                          {Number(deal.pricePerKg).toLocaleString("en-KE")}/kg
                        </>
                      ) : deal.status === OFFER.DECLINED ? (
                        deal.open ? (
                          `Best offer KES ${Number(deal.pricePerKg).toLocaleString("en-KE")}/kg`
                        ) : (
                          "Declined"
                        )
                      ) : (
                        describeDeal(deal)
                      )}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}

        {!conversations.length && (
          <li className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <MessageCircle size={22} className="text-muted-foreground" aria-hidden="true" />
            <p className="text-xs font-medium text-muted-foreground">
              No conversations yet. Pick a buyer to start one.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}
