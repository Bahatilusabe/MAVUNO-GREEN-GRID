import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "../../../src/lib/utils";
import EmptyState from "../../../shared/ui/EmptyState";
import OfferCard from "./OfferCard";
import { OFFER } from "./store";

const time = (iso) =>
  new Date(iso).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit", hour12: false });

const day = (iso) =>
  new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short" });

/**
 * The message thread for one counterparty.
 *
 * Messages from the farmer sit on the right, the buyer's on the left, and
 * price offers appear as cards inside the bubble that carries them. Only the
 * most recent offer carries the accept / counter / decline actions — older
 * ones stay as a record of how the price got there.
 */
export default function Thread({
  conversation,
  onAccept,
  onCounter,
  onDecline,
  onCreateMatch,
  busy = false,
}) {
  const endRef = useRef(null);
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, conversation?.deal?.status]);

  // The newest offer is the live one; the rest are history.
  let latestOfferId = null;
  for (const m of messages) {
    if (m.offer) latestOfferId = m.id;
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          text="Say hello, or make a price offer to open the negotiation."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.map((m, i) => {
        const mine = m.from === "farmer";
        const showDay =
          i === 0 || day(messages[i - 1].at) !== day(m.at);

        return (
          <div key={m.id} className="space-y-3">
            {showDay && (
              <p className="flex items-center gap-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {day(m.at)}
                <span className="h-px flex-1 bg-border" />
              </p>
            )}

            <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] space-y-1.5 sm:max-w-[75%]", mine && "items-end")}>
                {m.text && (
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed",
                      mine
                        ? "rounded-br-md bg-brand-700 text-primary-foreground"
                        : "rounded-bl-md border border-border bg-card text-foreground",
                    )}
                  >
                    {m.text}
                  </div>
                )}

                {m.offer && (
                  <OfferCard
                    offer={
                      m.id === latestOfferId
                        ? (conversation.deal ?? m.offer)
                        : { ...m.offer, open: false }
                    }
                    mine={mine}
                    busy={busy}
                    onAccept={m.id === latestOfferId ? onAccept : undefined}
                    onCounter={m.id === latestOfferId ? onCounter : undefined}
                    onDecline={m.id === latestOfferId ? onDecline : undefined}
                    onCreateMatch={
                      m.id === latestOfferId &&
                      (conversation.deal ?? m.offer).status === OFFER.AGREED
                        ? onCreateMatch
                        : undefined
                    }
                    className={cn(mine && "ml-auto")}
                  />
                )}

                <p
                  className={cn(
                    "px-1 text-[10px] font-semibold text-muted-foreground",
                    mine ? "text-right" : "text-left",
                  )}
                >
                  {mine ? "You" : conversation.buyer?.name ?? "Buyer"} · {time(m.at)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
