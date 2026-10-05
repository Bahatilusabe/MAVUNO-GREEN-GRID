import { useState } from "react";
import { Send, Sprout } from "lucide-react";
import { PROMPTS } from "./data";

// className carries the placement/card styles from the parent page (e.g. "assistant card" or "db-card db-assistant")
export default function Assistant({ className = "" }) {
  const [msgs, setMsgs] = useState([{ from: "ai", text: "I'm here to help you make better decisions, reduce loss and improve your farm." }]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (q) => {
    const t = (q ?? text).trim();
    if (!t || loading) return;
    setMsgs((messages) => [...messages, { from: "me", text: t }, { from: "ai", text: "Thinking…" }]);
    setText("");
    setLoading(true);

    let answer;
    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: t }),
      });
      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.reply || `Backend returned HTTP ${response.status}`);
      }
      answer = data.reply || "I couldn't generate a response just now.";
    } catch (error) {
      console.error("Failed to get a MAVUNO AI response:", error);
      answer = "I couldn't connect to the AI service. Please try again in a moment.";
    } finally {
      setLoading(false);
    }

    setMsgs((messages) => [
      ...messages.slice(0, -1),
      { from: "ai", text: answer },
    ]);
  };

  return (
    <aside className={className}>
      <div className="mv-head">
        <span className="mv-ico"><Sprout aria-hidden="true" size={20} /></span>
        <div><strong>MAVUNO AI</strong><span className="mv-sub">Your farming assistant</span></div>
      </div>
      <div className="mv-chat" aria-live="polite">
        {msgs.map((m, i) => <p key={i} className={`mv-bubble ${m.from}`}>{m.text}</p>)}
      </div>
      <span className="mv-label">Suggested prompts</span>
      {PROMPTS.map((p) => <button key={p} className="mv-prompt" onClick={() => send(p)} disabled={loading}>{p}</button>)}
      <form className="mv-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask MAVUNO AI…" aria-label="Ask MAVUNO AI" disabled={loading} />
        <button className="mv-send" aria-label="Send" disabled={loading || !text.trim()}><Send aria-hidden="true" size={16} /></button>
      </form>
      <span className="mv-foot">Powered by MAVUNO AI</span>
    </aside>
  );
}