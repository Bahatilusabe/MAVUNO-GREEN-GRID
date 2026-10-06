import { useState } from "react";
import { Send, Sprout, Bot, User } from "lucide-react";
import { PROMPTS } from "./data";

export default function Assistant({ className = "", selectedPin = null }) {
  const [msgs, setMsgs] = useState([
    { 
      from: "ai", 
      text: "Hi there! I'm your MAVUNO AI. I'm here to help you make better decisions and reduce crop loss. Feel free to ask me any questions you have about your farm!" 
    }
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
    <aside className={`bg-card rounded-xl border border-border shadow-sm flex flex-col h-full overflow-hidden ${className}`}>
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-brand-50/60 to-transparent flex items-center gap-3">
        <div className="p-2.5 bg-brand-100 text-brand-700 rounded-xl flex-shrink-0 shadow-xs">
          <Sprout aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <strong className="block text-base font-bold text-card-foreground truncate">MAVUNO AI</strong>
          <span className="text-xs text-brand-700 font-medium block">Your farming assistant</span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="p-4 sm:p-5 flex-grow overflow-y-auto space-y-3.5 max-h-[380px]" aria-live="polite">
        {msgs.map((m, i) => {
          const isAi = m.from === "ai";
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
              {isAi && (
                <div className="p-1.5 bg-brand-100 text-brand-700 rounded-full flex-shrink-0 mt-1">
                  <Bot size={14} />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] shadow-xs ${
                isAi 
                  ? "bg-muted border border-border text-foreground rounded-tl-xs"
                  : "bg-brand-700 text-primary-foreground rounded-tr-xs"
              }`}>
                {m.text}
              </div>
              {!isAi && (
                <div className="p-1.5 bg-secondary text-secondary-foreground rounded-full flex-shrink-0 mt-1">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Prompts Section - Only show if no user messages exist yet */}
      {msgs.length <= 1 && (
        <div className="px-4 py-3 bg-muted border-t border-border space-y-3">
          
          {/* Awareness Tip */}
          <div className="flex items-start gap-2 p-2.5 bg-brand-50/50 rounded-lg border border-brand-100/50">
            <span className="text-brand-600 text-sm">💡</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Did you know?</strong> You can chat directly with this AI assistant. Type your own questions below, or try one of these to get started:
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => (
              <button
                key={p}
                disabled={loading}
                onClick={() => send(p)}
                className="px-3 py-1.5 bg-card border border-border hover:border-primary hover:bg-brand-50/50 text-secondary-foreground text-xs font-medium rounded-lg transition-all shadow-2xs text-left disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form 
        className="p-3 bg-card border-t border-border flex items-center gap-2"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask MAVUNO AI…"
          aria-label="Ask MAVUNO AI"
          disabled={loading}
          className="flex-1 bg-muted border border-border focus:border-primary focus:bg-card text-xs sm:text-sm text-card-foreground rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-muted-foreground"
        />
        <button
          className="p-2.5 bg-brand-700 hover:bg-brand-800 text-primary-foreground rounded-xl transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          aria-label="Send"
          disabled={loading || !text.trim()}
        >
          <Send aria-hidden="true" size={16} />
        </button>
      </form>

      {/* Footer */}
      <div className="py-2 px-4 bg-muted border-t border-border text-center">
        <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Powered by MAVUNO AI</span>
      </div>
    </aside>
  );
}