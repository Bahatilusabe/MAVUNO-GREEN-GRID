import { useState } from "react";
import { PROMPTS } from "./data";
import "./Assistant.css";

const reply = (t) => {
  const l = t.toLowerCase();
  if (l.includes("surplus")) return "Reserve cold storage for 1,800 kg and match with Nairobi Fresh Markets (KES 28/kg). Act within 72 hours.";
  if (l.includes("buyer")) return "Nairobi Fresh Markets pays best at KES 28/kg, 68 km away.";
  if (l.includes("harvest")) return "Your tomatoes are ready around Oct 18. Harvest early morning for the best shelf life.";
  if (l.includes("weather")) return "I'll connect live weather soon. For now, plan around light rain mid-week.";
  return "Got it. I'm checking your farms and the market for an answer.";
};

// className carries the placement/card styles from the parent page (e.g. "assistant card" or "db-card db-assistant")
export default function Assistant({ className = "" }) {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "I'm here to help you make better decisions, reduce loss and improve your farm." }]);
  const [text, setText] = useState("");

  const send = (q) => {
    const t = (q ?? text).trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "ai", text: reply(t) }]);
    setText("");
  };

  return (
    <aside className={className}>
      <div className="mv-head">
        <span className="mv-ico">🌿</span>
        <div><strong>MAVUNO AI</strong><span className="mv-sub">Your farming assistant</span></div>
      </div>
      <div className="mv-chat" aria-live="polite">
        {msgs.map((m, i) => <p key={i} className={`mv-bubble ${m.from}`}>{m.text}</p>)}
      </div>
      <span className="mv-label">Suggested prompts</span>
      {PROMPTS.map((p) => <button key={p} className="mv-prompt" onClick={() => send(p)}>{p}</button>)}
      <form className="mv-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask MAVUNO AI…" aria-label="Ask MAVUNO AI" />
        <button className="mv-send" aria-label="Send">➤</button>
      </form>
      <span className="mv-foot">Powered by MAVUNO AI</span>
    </aside>
  );
}