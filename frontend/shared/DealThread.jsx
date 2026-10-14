import { useCallback, useEffect, useRef, useState } from "react";
import { X, Send, Check } from "lucide-react";
import { api } from "../src/lib/api";

const OFFER_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  superseded: "bg-gray-100 text-gray-500",
};
const CLOSED = ["declined", "cancelled"];
const AGREED = ["scheduled", "in_transit", "delivered"];

const when = (iso) =>
  new Date(iso).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function DealThread({ dealId, blockAccept = false, onClose, onChanged }) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [price, setPrice] = useState("");
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setData(await api.get(`/deals/${dealId}`));
      setLoadError("");
    } catch (e) {
      setLoadError(e.message);
    }
  }, [dealId]);

  useEffect(() => {
    load();
    const t = setInterval(() => {
      if (!document.hidden) load();
    }, 8000);
    return () => clearInterval(t);
  }, [load]);

  const messageCount = data?.messages.length ?? 0;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  const act = async (fn) => {
    setBusy(true);
    setError("");
    try {
      setData(await fn());
      onChanged?.();
    } catch (e) {
      setError(e.message);
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <Shell onClose={onClose}>
        <p className="p-6 text-sm text-gray-500">{loadError || "Loading conversation..."}</p>
      </Shell>
    );
  }

  const { deal, offers, messages } = data;
  const pending = offers.find((o) => o.status === "pending");
  const open = deal.status === "pending";
  const canRespond = open && pending && pending.madeBy !== deal.side;
  const waiting = open && pending && pending.madeBy === deal.side;
  const closed = CLOSED.includes(deal.status);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    act(async () => {
      const r = await api.post(`/deals/${dealId}/messages`, { body: text.trim() });
      setText("");
      return r;
    });
  };

  const sendOffer = (e) => {
    e.preventDefault();
    const p = parseFloat(price);
    if (!(p > 0)) return setError("Enter a price greater than 0");
    act(async () => {
      const r = await api.post(`/deals/${dealId}/offers`, { price_per_kg: p });
      setPrice("");
      return r;
    });
  };

  const respond = (action) => act(() => api.post(`/deals/${dealId}/offers/${pending.id}/${action}`));

  return (
    <Shell onClose={onClose} title={`${deal.crop ?? "Crop"} • ${deal.kg.toLocaleString()} kg`} sub={deal.status.replace("_", " ")}>
      {AGREED.includes(deal.status) && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-sm font-semibold text-green-800">
          Agreed at KES {deal.pricePerKg}/kg
        </div>
      )}
      {closed && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
          This deal is {deal.status}.
        </div>
      )}

      <div className="px-4 pt-3 space-y-1.5 max-h-36 overflow-y-auto">
        {offers.map((o) => (
          <div key={o.id} className="flex items-center justify-between text-xs">
            <span className="text-gray-700">
              {o.madeBy === deal.side ? "You" : "They"} offered{" "}
              <strong className="text-gray-900">KES {o.pricePerKg}/kg</strong>
              <span className="text-gray-400"> • {when(o.createdAt)}</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full font-semibold ${OFFER_STYLES[o.status]}`}>{o.status}</span>
          </div>
        ))}
      </div>

      {open && (
        <div className="m-4 p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
          {canRespond && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-800">
                Their offer: <strong>KES {pending.pricePerKg}/kg</strong>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={busy || blockAccept}
                  title={blockAccept ? "Not enough capacity, or you have paused accepting" : ""}
                  onClick={() => respond("accept")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 flex items-center gap-1"
                >
                  <Check size={14} /> Accept
                </button>
                <button
                  disabled={busy}
                  onClick={() => respond("decline")}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 flex items-center gap-1"
                >
                  <X size={14} /> Decline
                </button>
              </div>
            </div>
          )}
          {waiting && (
            <p className="text-sm text-gray-600">
              Your offer of <strong>KES {pending.pricePerKg}/kg</strong> is waiting for a response.
            </p>
          )}
          {!waiting && (
            <form onSubmit={sendOffer} className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per kg (KES)"
                className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
              <button
                disabled={busy}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-50"
              >
                {canRespond ? "Counter" : "Make offer"}
              </button>
            </form>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="mx-4 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {!messages.length && <p className="text-xs text-gray-400 text-center pt-6">No messages yet.</p>}
        {messages.map((m) => {
          const mine = m.senderRole === deal.side;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  mine ? "bg-green-700 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <span className={`block text-[10px] mt-0.5 ${mine ? "text-green-100" : "text-gray-400"}`}>
                  {when(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={closed}
          maxLength={2000}
          placeholder={closed ? "Conversation closed" : "Write a message"}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:bg-gray-50"
        />
        <button
          disabled={busy || closed || !text.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400"
        >
          <Send size={16} />
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children, onClose, title = "Conversation", sub }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg h-full bg-white flex flex-col shadow-xl"
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
            {sub && <p className="text-xs text-gray-500 capitalize">{sub}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X size={18} />
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
}