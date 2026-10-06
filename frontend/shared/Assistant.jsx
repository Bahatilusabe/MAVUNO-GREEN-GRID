import { useState } from "react";
import { Send, Sprout, Bot, User } from "lucide-react";
import { PROMPTS } from "./data";

export default function Assistant({ className = "", selectedPin = null }) {
  const [msgs, setMsgs] = useState([
    { from: "ai", text: "I'm here to help you make better decisions, reduce loss and improve your farm." }
  ]);
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
        body: JSON.stringify({
          message: t,
          lat: selectedPin?.lat,
          lng: selectedPin?.lng,
        }),
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
    <aside className={`bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden ${className}`}>
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-green-50/60 to-transparent flex items-center gap-3">
        <div className="p-2.5 bg-green-100 text-green-700 rounded-xl flex-shrink-0 shadow-xs">
          <Sprout aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <strong className="block text-base font-bold text-gray-900 truncate">MAVUNO AI</strong>
          <span className="text-xs text-green-700 font-medium block">Your farming assistant</span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="p-4 sm:p-5 flex-grow overflow-y-auto space-y-3.5 max-h-[380px]" aria-live="polite">
        {msgs.map((m, i) => {
          const isAi = m.from === "ai";
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
              {isAi && (
                <div className="p-1.5 bg-green-100 text-green-700 rounded-full flex-shrink-0 mt-1">
                  <Bot size={14} />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-xs ${
                isAi 
                  ? "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-xs" 
                  : "bg-green-700 text-white rounded-tr-xs"
              }`}>
                {m.text}
              </div>
              {!isAi && (
                <div className="p-1.5 bg-gray-200 text-gray-700 rounded-full flex-shrink-0 mt-1">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Prompts Section */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 space-y-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Suggested prompts</span>
        <div className="flex flex-wrap gap-1.5">
          {PROMPTS.map((p) => (
            <button
              key={p}
              disabled={loading}
              onClick={() => send(p)}
              className="px-3 py-1.5 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-700 text-xs font-medium rounded-lg transition-all shadow-2xs text-left disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form 
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2" 
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask MAVUNO AI…"
          aria-label="Ask MAVUNO AI"
          disabled={loading}
          className="flex-1 bg-gray-50 border border-gray-200 focus:border-green-600 focus:bg-white text-xs sm:text-sm text-gray-900 rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-gray-400"
        />
        <button
          className="p-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          aria-label="Send"
          disabled={loading || !text.trim()}
        >
          <Send aria-hidden="true" size={16} />
        </button>
      </form>

      {/* Footer */}
      <div className="py-2 px-4 bg-gray-50 border-t border-gray-100 text-center">
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">Powered by MAVUNO AI</span>
      </div>
    </aside>
  );
}