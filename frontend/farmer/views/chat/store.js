/**
 * The farmer ↔ buyer conversation store.
 *
 * MAVUNO has no messaging backend yet — `/api/v1/chat` is the AI assistant,
 * not a person-to-person channel — so conversations live in the browser and
 * are persisted to localStorage. The store is deliberately shaped like the
 * eventual API (a conversation per counterparty, ordered messages, an offer
 * object with its own status) so swapping the persistence for `fetch` later
 * is a local change rather than a rewrite.
 *
 * The buyer side is simulated: a reply is scheduled a moment after the
 * farmer sends, and it answers on the price. That is what makes the
 * "agree on a price" flow real — the farmer has something to accept, counter
 * or decline.
 *
 * Every update returns a **new** state object. React compares the state by
 * reference, so mutating in place would leave the thread frozen on screen.
 */

const KEY = "mavuno_chat_v1";
const REPLY_DELAY_MS = 1100;

export const OFFER = {
  PROPOSED: "proposed",
  COUNTERED: "countered",
  AGREED: "agreed",
  DECLINED: "declined",
};

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const now = () => new Date().toISOString();

const kgLabel = (kg) => Number(kg || 0).toLocaleString("en-KE");

/* -------------------------------------------------------------------------- */
/*  Persistence                                                               */
/* -------------------------------------------------------------------------- */

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode or a full quota: the chat still works for this session */
  }
}

/* -------------------------------------------------------------------------- */
/*  Buyers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The buyers the farmer can negotiate with.
 *
 * `min` and `max` are the price band the buyer will accept, in KES per kg.
 * An offer inside the band is accepted, an offer just outside it is
 * countered, and an offer far outside it is declined.
 */
export const BUYERS = [
  {
    id: "partner:1",
    name: "Nairobi Fresh Markets",
    type: "Buyers",
    km: 68,
    listedPrice: 28,
    min: 24,
    max: 32,
    initials: "NF",
    blurb: "Grade-A tomato and French bean buyer. Picks up twice a week.",
  },
  {
    id: "partner:2",
    name: "Kagio Juice Processors",
    type: "Processors",
    km: 20,
    listedPrice: 20,
    min: 17,
    max:  24,
    initials: "KJ",
    blurb: "Processes tomatoes and mangoes. Wants consistent weekly volume.",
  },
  {
    id: "partner:3",
    name: "Nakuru Market",
    type: "Buyers",
    km: 74,
    listedPrice: 25,
    min: 21,
    max: 29,
    initials: "NK",
    blurb: "Open-air market consortium. Price moves with the daily auction.",
  },
  {
    id: "partner:4",
    name: "Kirieyaga Cold Storage",
    type: "Storage",
    km: 10,
    listedPrice: 12,
    min: 9,
    max: 16,
    initials: "KC",
    blurb: "Cold store and aggregation point. Holds up to 5,000 kg.",
  },
];

export const buyerById = (id) => BUYERS.find((b) => b.id === id) ?? null;

/* -------------------------------------------------------------------------- */
/*  Seed conversations                                                         */
/* -------------------------------------------------------------------------- */

const ago = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

const SEED = {
  "partner:1": [
    { id: "s1", from: "buyer", at: ago(190), text: "Good morning Samuel. We can take another 1,200 kg of tomatoes from Kiambaina this week." },
    { id: "s2", from: "farmer", at: ago(184), text: "Morning. The field is looking good, I expect 1,500 kg. What are you paying per kg right now?" },
    { id: "s3", from: "buyer", at: ago(176), text: "The Nairobi auction is at 28/KES. For a consistent weekly volume we can do 27." },
  ],
  "partner:2": [
    { id: "s1", from: "buyer", at: ago(320), text: "We are planning on 800 kg of French beans for the juice plant. Are you able to supply?" },
    { id: "s2", from: "farmer", at: ago(310), text: "Yes, I can do 800 kg from the Kutus plot. It would need to be KES 22/kg." },
    { id: "s3", from: "buyer", at: ago(298), text: "Let me check with procurement. I will come back to you shortly." },
  ],
  "partner:3": [
    { id: "s1", from: "farmer", at: ago(1400), text: "Hello, do you take tomatoes from Kirinyaga?" },
    { id: "s2", from: "buyer", at: ago(1390), text: "We do, when the grade is right. Send me the quantity and your price." },
  ],
};

/* -------------------------------------------------------------------------- */
/*  Store                                                                      */
/* -------------------------------------------------------------------------- */

const emptyState = () => ({ conversations: {} });

function buildInitial() {
  const state = emptyState();
  for (const buyer of BUYERS) {
    const seed = SEED[buyer.id];
    if (!seed) continue;
    state.conversations[buyer.id] = {
      id: buyer.id,
      buyer,
      messages: seed.map((m) => ({ ...m })),
      deal: null,
    };
  }
  return state;
}

/** Reads the stored conversations, seeding the demo ones on first run. */
export function loadState() {
  const stored = read();
  if (stored?.conversations) return stored;
  const seeded = buildInitial();
  write(seeded);
  return seeded;
}

export function saveState(state) {
  write(state);
  return state;
}

/* -------------------------------------------------------------------------- */
/*  Conversations                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Applies a change to one conversation and returns a new state.
 *
 * `update` receives the conversation and returns the next one. Returning the
 * same conversation means "nothing changed", and the state is passed through
 * untouched so React can skip the re-render.
 */
const updateConversation = (state, buyerId, update) => {
  const conversation = state?.conversations?.[buyerId];
  if (!conversation) return state;
  const next = update(conversation);
  if (next === conversation) return state;
  return { ...state, conversations: { ...state.conversations, [buyerId]: next } };
};

/** Creates the conversation for a buyer, if it does not exist yet. */
export function ensureConversation(state, buyer) {
  if (state?.conversations?.[buyer.id]) return state;
  return {
    ...state,
    conversations: {
      ...state.conversations,
      [buyer.id]: { id: buyer.id, buyer, messages: [], deal: null },
    },
  };
}

/** The conversation for a buyer, created on first contact. */
export function conversationFor(state, buyer) {
  const next = ensureConversation(state, buyer);
  return next.conversations[buyer.id];
}

const makeMessage = (message) => ({
  id: uid(),
  at: now(),
  from: "farmer",
  text: "",
  ...message,
});

/* -------------------------------------------------------------------------- */
/*  Offers and the buyer's answer                                              */
/* -------------------------------------------------------------------------- */

/**
 * Works out how a buyer answers an offer.
 *
 * Inside the band they accept. A little outside it they counter at the
 * nearest acceptable price. Far outside it they decline and name their best
 * price, which still leaves the farmer something to answer.
 */
export function evaluateOffer(buyer, offer) {
  const price = Number(offer.pricePerKg);
  const kg = Number(offer.kg);

  if (!Number.isFinite(price) || price <= 0) {
    return {
      outcome: "decline",
      reason: "invalid",
      reply: "That price did not come through. What did you have in mind?",
    };
  }
  if (!Number.isFinite(kg) || kg <= 0) {
    return {
      outcome: "decline",
      reason: "invalid",
      reply: "How many kilograms are you offering?",
    };
  }

  // The farmer's first asking price is kept so the card can show the move.
  const base = { ...offer, kg, offeredPrice: offer.offeredPrice ?? price };

  if (price >= buyer.min && price <= buyer.max) {
    return {
      outcome: "accept",
      deal: {
        ...base,
        pricePerKg: price,
        status: OFFER.AGREED,
        open: false,
        pending: false,
        counterPrice: null,
      },
      reply: `Done — ${kgLabel(kg)} kg at KES ${price}/kg. I will raise the purchase order now.`,
    };
  }

  if (price > buyer.max) {
    const counter = Math.round(buyer.max * 2) / 2;
    const gap = ((price - counter) / price) * 100;
    if (gap <= 15) {
      return {
        outcome: "counter",
        counterPrice: counter,
        deal: {
          ...base,
          pricePerKg: counter,
          status: OFFER.COUNTERED,
          open: true,
          pending: false,
          counterPrice: counter,
        },
        reply: `Close. I can do KES ${counter}/kg for ${kgLabel(kg)} kg — that is my ceiling for this week.`,
      };
    }
    return {
      outcome: "decline",
      counterPrice: counter,
      deal: {
        ...base,
        pricePerKg: counter,
        status: OFFER.DECLINED,
        open: true,
        pending: false,
        counterPrice: counter,
      },
      reply: `KES ${price}/kg is above what the market is paying. My best is KES ${counter}/kg — shall we settle there?`,
    };
  }

  const counter = Math.round(buyer.min * 2) / 2;
  return {
    outcome: "counter",
    counterPrice: counter,
    deal: {
      ...base,
      pricePerKg: counter,
      status: OFFER.COUNTERED,
      open: true,
      pending: false,
      counterPrice: counter,
    },
    reply: `That is below what I can resell at. I can meet you at KES ${counter}/kg for ${kgLabel(kg)} kg.`,
  };
}

/**
 * Posts a message from the farmer.
 *
 * An offer is recorded as a pending deal straight away, and the buyer's
 * answer is applied separately by `applyBuyerReply` — the UI shows the
 * farmer's message first and the answer a moment later, the way a real
 * conversation reads.
 */
export function postMessage(state, buyerId, { text, offer } = {}) {
  return updateConversation(state, buyerId, (conversation) => {
    const messages = text
      ? [...conversation.messages, makeMessage({ from: "farmer", text })]
      : conversation.messages;

    const deal = offer
      ? {
          crop: offer.crop ?? "",
          cropId: offer.cropId ?? "",
          kg: Number(offer.kg) || 0,
          pricePerKg: Number(offer.pricePerKg) || 0,
          pickupDate: offer.pickupDate ?? "",
          offeredPrice: Number(offer.pricePerKg) || 0,
          counterPrice: null,
          status: OFFER.PROPOSED,
          open: true,
          pending: true,
        }
      : conversation.deal;

    return { ...conversation, messages, deal };
  });
}

/**
 * The buyer answers the open offer. Called a moment after the farmer posts.
 */
export function applyBuyerReply(state, buyerId) {
  return updateConversation(state, buyerId, (conversation) => {
    if (!conversation.deal) return conversation;

    const verdict = evaluateOffer(conversation.buyer, conversation.deal);
    const deal = { ...conversation.deal, ...(verdict.deal ?? {}), pending: false };
    const reply = makeMessage({
      from: "buyer",
      text: verdict.reply,
      offer: deal,
      verdict: verdict.outcome,
    });

    return { ...conversation, deal, messages: [...conversation.messages, reply] };
  });
}

/**
 * The farmer answers an offer: accept it, counter it, or walk away.
 */
export function respondToOffer(state, buyerId, action, { pricePerKg } = {}) {
  return updateConversation(state, buyerId, (conversation) => {
    const deal = conversation.deal;
    if (!deal) return conversation;

    const buyer = conversation.buyer;

    if (action === "accept") {
      const agreed = { ...deal, status: OFFER.AGREED, open: false, pending: false };
      const farmerMsg = makeMessage({
        from: "farmer",
        text: `Agreed — ${kgLabel(deal.kg)} kg at KES ${deal.pricePerKg}/kg. Please send the purchase order.`,
      });
      const buyerMsg = makeMessage({
        from: "buyer",
        text: "Confirmed. The purchase order is on its way to your MAVUNO portal.",
        offer: agreed,
        verdict: "accept",
      });
      return {
        ...conversation,
        deal: agreed,
        messages: [...conversation.messages, farmerMsg, buyerMsg],
      };
    }

    if (action === "counter") {
      const price = Number(pricePerKg);
      if (!Number.isFinite(price) || price <= 0) return conversation;

      const verdict = evaluateOffer(buyer, { ...deal, pricePerKg: price });
      const nextDeal = { ...deal, ...(verdict.deal ?? {}), pending: false };
      const farmerMsg = makeMessage({
        from: "farmer",
        text: `I can meet you at KES ${price}/kg.`,
        counter: { pricePerKg: price },
      });
      const buyerMsg = makeMessage({
        from: "buyer",
        text: verdict.reply,
        offer: nextDeal,
        verdict: verdict.outcome,
      });
      return {
        ...conversation,
        deal: nextDeal,
        messages: [...conversation.messages, farmerMsg, buyerMsg],
      };
    }

    if (action === "decline") {
      const closed = { ...deal, status: OFFER.DECLINED, open: false, pending: false };
      const farmerMsg = makeMessage({
        from: "farmer",
        text: "Thank you for the offer, but we will hold this lot for another buyer.",
      });
      return {
        ...conversation,
        deal: closed,
        messages: [...conversation.messages, farmerMsg],
      };
    }

    return conversation;
  });
}

/* -------------------------------------------------------------------------- */
/*  Reading                                                                    */
/* -------------------------------------------------------------------------- */

/** The last message of a conversation, used for the list preview. */
export function lastMessage(conversation) {
  if (!conversation?.messages?.length) return null;
  return conversation.messages[conversation.messages.length - 1];
}

/** How many messages the farmer has not read in a conversation. */
export function unreadCount(conversation) {
  if (!conversation?.messages) return 0;
  return conversation.messages.filter((m) => m.from !== "farmer" && !m.read).length;
}

/** Marks every incoming message in a conversation as read. */
export function markRead(state, buyerId) {
  return updateConversation(state, buyerId, (conversation) => {
    const hasUnread = conversation.messages.some((m) => m.from !== "farmer" && !m.read);
    if (!hasUnread) return conversation;
    return {
      ...conversation,
      messages: conversation.messages.map((m) =>
        m.from !== "farmer" && !m.read ? { ...m, read: true } : m,
      ),
    };
  });
}

/** A one-line summary of a deal, used in the list and the deal card. */
export function describeDeal(deal) {
  if (!deal) return null;
  const kg = kgLabel(deal.kg);
  const price = Number(deal.pricePerKg);
  return `${deal.crop || "Produce"} · ${kg} kg · KES ${price}/kg`;
}

export { REPLY_DELAY_MS };
