import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Handshake, Info, MapPin, Phone, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { api, getToken } from "../../src/lib/api";
import { useOpportunities } from "../../src/hooks/useOpportunities";
import Composer from "./chat/Composer";
import ConversationList from "./chat/ConversationList";
import Thread from "./chat/Thread";
import {
  BUYERS,
  OFFER,
  REPLY_DELAY_MS,
  applyBuyerReply,
  ensureConversation,
  loadState,
  markRead,
  postMessage,
  respondToOffer,
  saveState,
} from "./chat/store";

/** "KES 28/kg" -> 28. Returns null when the price is not listed. */
const parsePrice = (text) => {
  const match = String(text ?? "").match(/([\d,.]+)/);
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
};

const initials = (name) =>
  String(name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/**
 * A buyer the farmer can negotiate with.
 *
 * Live opportunities win, so the chat talks to the buyers the API actually
 * returned. The sample list is the fallback for a signed-out visitor, and
 * it carries the same price band so the negotiation behaves identically.
 */
function toPerson(o) {
  const listed = parsePrice(o.price);
  const base = listed ?? 25;
  return {
    id: o.id,
    refId: o.refId ?? o.id,
    kind: o.kind ?? "partner",
    name: o.name,
    type: o.type ?? "Buyers",
    km: o.km ?? "—",
    listedPrice: base,
    // The band the buyer will actually accept.
    min: Math.round(base * 0.85 * 2) / 2,
    max: Math.round(base * 1.15 * 2) / 2,
    initials: initials(o.name) || "??",
    blurb: o.note ?? "",
    phone: o.phone ?? null,
  };
}

const SAMPLE_PEOPLE = BUYERS.filter((b) => b.type === "Buyers" || b.type === "Processors").map((b) => ({
  ...b,
  refId: b.id.replace(/^partner:/, ""),
  kind: "partner",
}));

/**
 * The farmer ↔ buyer chat.
 *
 * A farmer opens a conversation with a buyer, talks about the lot, makes a
 * price offer, and counters until the two sides land on the same number.
 * When they do, the agreed deal can be turned into a real match request
 * against the API.
 */
export default function Chat({ farm, crops = [] }) {
  const [state, setState] = useState(() => loadState());
  const [activeId, setActiveId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);

  const farmId = typeof farm?.id === "string" ? farm.id : undefined;
  const { opportunities, isLive } = useOpportunities({ farmId });

  // Live buyers when the API answers, the sample list otherwise.
  const people = useMemo(() => {
    const live = opportunities
      .filter((o) => o.type === "Buyers" || o.type === "Processors")
      .map(toPerson);
    if (live.length) return live;
    return SAMPLE_PEOPLE;
  }, [opportunities]);

  /**
   * Makes sure every person has a conversation in the real state.
   *
   * A conversation is only created when the farmer first writes to a buyer,
   * so this runs on the way into every mutation — otherwise the first
   * message to a new buyer would have nowhere to land.
   */
  const ensure = useCallback(
    (st) => people.reduce((acc, person) => ensureConversation(acc, person), st),
    [people],
  );

  // The list shows one row per person, whether or not it has been opened.
  // Conversations the farmer already had are kept even when the buyer is no
  // longer in the current list, so signing in never loses the history.
  const conversations = useMemo(() => {
    const byId = state.conversations ?? {};
    const listed = people.map(
      (person) =>
        byId[person.id] ?? { id: person.id, buyer: person, messages: [], deal: null },
    );
    const kept = Object.values(byId).filter(
      (c) => !people.some((p) => p.id === c.id),
    );
    return [...listed, ...kept];
  }, [state, people]);

  // Persist every change to the browser store.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0] ?? null;
  const activeConversationId = active?.id ?? null;

  // The conversation on screen, so a reply that lands in it is not counted
  // as unread.
  const activeIdRef = useRef(null);
  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Opening a conversation clears its unread badge.
  const select = useCallback((id) => {
    setActiveId(id);
    setState((cur) => markRead(cur, id));
  }, []);

  /** The buyer reads the offer and answers a moment later. */
  const scheduleReply = useCallback(
    (buyerId) => {
      clearTimeout(timerRef.current);
      setTyping(true);
      timerRef.current = setTimeout(() => {
        setTyping(false);
        setState((cur) => {
          const next = applyBuyerReply(cur, buyerId);
          // The farmer is reading this one, so it is already read.
          return activeIdRef.current === buyerId ? markRead(next, buyerId) : next;
        });
      }, REPLY_DELAY_MS);
    },
    [],
  );

  const send = useCallback(
    ({ text }) => {
      if (!active) return;
      setState((cur) => postMessage(ensure(cur), active.id, { text }));
    },
    [active, ensure],
  );

  const makeOffer = useCallback(
    (offer) => {
      if (!active) return;
      setState((cur) => postMessage(ensure(cur), active.id, { offer }));
      scheduleReply(active.id);
    },
    [active, ensure, scheduleReply],
  );

  const act = useCallback(
    (action, extra) => {
      if (!active) return;
      setState((cur) => respondToOffer(ensure(cur), active.id, action, extra));
    },
    [active, ensure],
  );

  /**
   * Turns the agreed conversation into a real match request.
   *
   * The API needs a crop on the farm, so the lot is attached to the first
   * crop the farmer has. A public site (not a MAVUNO partner) has to carry
   * the agreed price, because the partner rate does not apply to it.
   */
  const createMatch = useCallback(async () => {
    if (!active) return;
    const deal = active.deal;
    if (!deal) return;

    if (!getToken()) {
      toast.info("Sign in to turn an agreed deal into a match request.");
      return;
    }

    const crop =
      crops.find((c) => c.id === deal.cropId) ?? crops[0];
    if (!crop) {
      toast.error("Add a crop to one of your farms before creating a match.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        crop_id: crop.id,
        kg: Math.round(Number(deal.kg)),
      };
      if (active.buyer.kind === "place") {
        payload.place_id = active.buyer.refId;
        payload.price_per_kg = Number(deal.pricePerKg);
      } else {
        payload.partner_id = active.buyer.refId;
      }

      const body = await api.post("/matches", payload);
      toast.success(`Match request sent to ${active.buyer.name}`, {
        description: `${Number(deal.kg).toLocaleString("en-KE")} kg at KES ${Number(
          deal.pricePerKg,
        ).toLocaleString("en-KE")}/kg. Waiting for confirmation.`,
      });
      if (body?.match) {
        toast("The request is now on your Opportunities page.", {
          action: { label: "View", onClick: () => window.location.hash = "#/farmer/opportunities" },
        });
      }
    } catch (e) {
      toast.error(e.message || "Could not create the match request.");
    } finally {
      setBusy(false);
    }
  }, [active, crops]);

  const sorted = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const last = (c) => c.messages[c.messages.length - 1]?.at ?? "";
        return last(b).localeCompare(last(a));
      }),
    [conversations],
  );

  if (!active) {
    return (
      <div className="surface flex flex-col items-center justify-center gap-3 p-12 text-center">
        <Handshake size={26} className="text-brand-600" aria-hidden="true" />
        <strong className="text-sm font-bold text-foreground">No buyers to talk to yet</strong>
        <p className="max-w-sm text-xs font-medium text-muted-foreground">
          Save a farm location and MAVUNO will list the buyers, processors and cold stores
          around you.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
      {/* Conversation list */}
      <div className="surface overflow-hidden lg:col-span-4 xl:col-span-3">
        <div className="h-[32rem] lg:h-[calc(100vh-16rem)]">
          <ConversationList
            conversations={sorted}
            activeId={active.id}
            onSelect={select}
          />
        </div>
      </div>

      {/* Thread */}
      <div className="surface flex min-h-[32rem] flex-col overflow-hidden lg:col-span-8 xl:col-span-9 lg:h-[calc(100vh-16rem)]">
        {/* Counterparty header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-brand-700 text-xs font-extrabold text-primary-foreground"
              aria-hidden="true"
            >
              {active.buyer.initials}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-foreground">{active.buyer.name}</h2>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={10} aria-hidden="true" />
                  {active.buyer.km} km away
                </span>
                <span className="flex items-center gap-1">
                  <Truck size={10} aria-hidden="true" />
                  Buying near KES {Number(active.buyer.listedPrice).toLocaleString("en-KE")}/kg
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-none items-center gap-2">
            {active.buyer.phone && (
              <a
                href={`tel:${active.buyer.phone}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                <Phone size={14} aria-hidden="true" />
                Call
              </a>
            )}
            <span className="hidden items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2 text-[11px] font-bold text-brand-800 sm:inline-flex">
              <Info size={13} aria-hidden="true" />
              Agreed price creates a match
            </span>
          </div>
        </header>

        {!isLive && (
          <p className="flex items-center gap-2 border-b border-border bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
            <Sparkles size={13} aria-hidden="true" />
            Sample buyers. Sign in to negotiate with the buyers around your farm.
          </p>
        )}

        <Thread
          conversation={active}
          busy={busy}
          onAccept={() => act("accept")}
          onCounter={(price) => act("counter", { pricePerKg: price })}
          onDecline={() => act("decline")}
          onCreateMatch={createMatch}
        />

        {/* Typing indicator */}
        {typing && (
          <p className="flex items-center gap-1.5 px-4 pb-1 text-[11px] font-medium text-muted-foreground">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
            {active.buyer.name} is typing…
          </p>
        )}

        <Composer
          buyer={active.buyer}
          crops={crops}
          onSend={send}
          onOffer={makeOffer}
          busy={busy}
          disabled={active.deal?.status === OFFER.AGREED}
        />
      </div>
    </div>
  );
}
