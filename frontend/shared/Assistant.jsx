import { useEffect, useRef, useState } from "react";
import { Send, Sprout, Bot, User, Mic, MicOff, Volume2, VolumeX, Lightbulb } from "lucide-react";
import { PROMPTS } from "./data";

const GREETING_PATTERNS = [
  "hello", "hi", "hey", "hujambo", "habari", "mambo", "sasa", "good morning",
  "good afternoon", "good evening", "morning", "evening", "afternoon"
];

const isGreetingOnly = (value) => {
  const clean = value.trim().toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ");
  if (!clean) return false;
  const words = clean.split(" ");
  if (words.length > 8) return false;
  return GREETING_PATTERNS.some((pattern) => clean.includes(pattern));
};

const detectSpeechLanguage = (value = "") => {
  const clean = value.trim().toLowerCase();
  const swahiliSignals = ["habari", "hujambo", "sasa", "vipi", "shamba", "kilimo", "mazao", "kuuza", "bei", "ngapi", "msee", "naomba"];
  if (swahiliSignals.some((signal) => clean.includes(signal))) return "sw-KE";
  return "en-US";
};

const selectPreferredVoice = (lang, voices = []) => {
  if (lang === "sw-KE") {
    const femaleSwahiliNames = [
      "swahili", "kiswahili", "google swahili", "google kiswahili",
      "zira", "samantha", "female", "woman", "voice female",
      "google swahili female", "swahili female", "kiswahili female"
    ];

    const swahiliVoice = voices.find((voice) => {
      const name = (voice.name || "").toLowerCase();
      const code = (voice.lang || "").toLowerCase();
      return (
        code.startsWith("sw") ||
        name.includes("swahili") ||
        name.includes("kiswahili") ||
        femaleSwahiliNames.some((term) => name.includes(term))
      );
    });

    if (swahiliVoice) return swahiliVoice;

    const femaleVoice = voices.find((voice) => {
      const name = (voice.name || "").toLowerCase();
      return ["zira", "samantha", "female", "woman", "aria", "victoria"].some((term) => name.includes(term));
    });

    if (femaleVoice) return femaleVoice;

    return voices.find((voice) => voice.localService) ?? voices[0];
  }

  const preferredNames = {
    "en-US": ["zira", "samantha", "google uk english female", "google us english female", "female", "aria", "victoria"],
  };

  const preferred = preferredNames[lang] ?? preferredNames["en-US"];

  return (
    voices.find((voice) => {
      const name = (voice.name || "").toLowerCase();
      return preferred.some((term) => name.includes(term));
    }) ??
    voices.find((voice) => (voice.lang || "").toLowerCase().startsWith(lang.slice(0, 2))) ??
    voices[0]
  );
};

export default function Assistant({ className = "", selectedPin = null }) {
  const [msgs, setMsgs] = useState([
    { 
      from: "ai", 
      text: "Hi there! I'm your MAVUNO AI. I'm here to help you make better decisions and reduce crop loss. Feel free to ask me any questions you have about your farm!" 
    }
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [voiceLanguage, setVoiceLanguage] = useState("en-US");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const recognitionRef = useRef(null);
  const activeLanguageLabel = voiceLanguage === "sw-KE" ? "Swahili" : "English";

  const voiceFriendlyText = (textToSpeak) => {
    let cleaned = String(textToSpeak || "")
      .replace(/[*_`#>-]/g, " ")
      .replace(/\[(.*?)\]|\((.*?)\)/g, " $1$2 ")
      .replace(/\s+/g, " ")
      .trim();

    cleaned = cleaned.replace(/\bKES\b/gi, "Kenya shillings");
    cleaned = cleaned.replace(/\bKES\s*([0-9,]+)/gi, "Kenya shillings $1");
    cleaned = cleaned.replace(/\bkg\b/gi, "kilograms");
    cleaned = cleaned.replace(/\btons?\b/gi, "tonnes");
    cleaned = cleaned.replace(/\bT\b/g, "tonnes");
    cleaned = cleaned.replace(/\b\d+\.?\d*%\b/g, (match) => `${match.replace("%", " percent")}`);
    cleaned = cleaned.replace(/\b(\d+(?:\.\d+)?)\s*tonnes\b/gi, (_, value) => `${value} tonnes`);

    return cleaned;
  };

  const getSpokenChunks = (textToSpeak) => {
    const cleaned = voiceFriendlyText(textToSpeak);
    if (!cleaned) return [];

    const sentenceChunks = cleaned
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (sentenceChunks.length <= 1) return [cleaned];

    const finalChunks = [];
    let current = "";
    for (const chunk of sentenceChunks) {
      const next = current ? `${current} ${chunk}` : chunk;
      if (next.length <= 120) {
        current = next;
      } else {
        finalChunks.push(current);
        current = chunk;
      }
    }
    if (current) finalChunks.push(current);

    return finalChunks.slice(0, 3);
  };

  const speakAnswer = async (textToSpeak) => {
    if (isMuted) return;

    const speechText = voiceFriendlyText(textToSpeak);
    if (!speechText) return;

    if (voiceLanguage === "sw-KE") {
      try {
        const response = await fetch(`/api/v1/tts?lang=sw-KE&text=${encodeURIComponent(speechText)}`);
        if (!response.ok) throw new Error("TTS failed");
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.lang = "sw-KE";
        audio.volume = 1;
        audio.onended = () => URL.revokeObjectURL(audioUrl);
        audio.play();
        return;
      } catch (error) {
        console.warn("Swahili TTS backend failed, falling back to browser voice:", error);
      }
    }

    if (!("speechSynthesis" in window)) return;

    const chunks = getSpokenChunks(textToSpeak);
    if (!chunks.length) return;

    const speakChunk = (index) => {
      if (index >= chunks.length) return;
      const current = chunks[index];
      const utterance = new SpeechSynthesisUtterance(current);
      const detectedLang = detectSpeechLanguage(current);
      const lang = voiceLanguage && voiceLanguage !== "auto" ? voiceLanguage : detectedLang;
      utterance.lang = lang;
      utterance.rate = lang === "sw-KE" ? 0.74 : 0.82;
      utterance.pitch = lang === "sw-KE" ? 0.96 : 1.04;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = selectPreferredVoice(lang, voices);
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => speakChunk(index + 1);
      utterance.onerror = () => speakChunk(index + 1);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      autoDetectAndSetVoiceLanguage(transcript);
      setText(transcript);
      setIsListening(false);
      recognition.stop();
      send(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
    };
  }, []);

  const handleMicToggle = () => {
    if (!privacyAccepted) {
      alert("Please accept the voice privacy notice before using microphone input.");
      return;
    }

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use the text box instead.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.lang = voiceLanguage || "en-US";
    setIsListening(true);
    recognitionRef.current.start();
  };

  const autoDetectAndSetVoiceLanguage = (spokenText) => {
    if (!spokenText) return;
    const detected = detectSpeechLanguage(spokenText);
    if (detected === "sw-KE") {
      setVoiceLanguage("sw-KE");
    } else {
      setVoiceLanguage("en-US");
    }
  };

  const toggleMute = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsMuted((value) => !value);
  };

  const send = async (q) => {
    const t = (q ?? text).trim();
    if (!t || loading) return;

    if (isGreetingOnly(t)) {
      const lower = t.toLowerCase();
      const isSwahiliGreeting = /\b(habari|hujambo|mambo|sasa|vipi)\b/.test(lower);
      const canned = isSwahiliGreeting
        ? "Habari! Niko hapa kukusaidia kuhusu shamba lako. Unaweza kuniuliza kuhusu bei, mazao, au mtazamo wa siku zijazo."
        : "Hello! I’m here to help with your farm. You can ask about prices, crops, weather, or the best next step for your field.";
      setMsgs((messages) => [...messages, { from: "me", text: t }, { from: "ai", text: canned }]);
      setText("");
      if (!isMuted) speakAnswer(canned);
      return;
    }

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
    if (answer) await speakAnswer(answer);
  };

  return (
    <aside className={`bg-gradient-to-b from-background via-card to-card rounded-2xl border border-brand-200/70 shadow-lg flex flex-col h-full overflow-hidden ring-1 ring-white/60 ${className}`}>
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-brand-100 bg-gradient-to-r from-brand-50 via-background to-card flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-brand-200 to-brand-100 text-brand-700 rounded-xl flex-shrink-0 shadow-sm ring-2 ring-white">
          <Sprout aria-hidden="true" size={22} />
        </div>
        <div className="min-w-0">
          <strong className="block text-lg font-bold text-card-foreground truncate">MAVUNO AI</strong>
          <span className="text-sm text-brand-700 font-medium block">Your farming assistant</span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="p-4 sm:p-5 flex-grow overflow-y-auto space-y-4 max-h-[430px] sm:max-h-[500px] bg-muted" aria-live="polite">
        {msgs.map((m, i) => {
          const isAi = m.from === "ai";
          return (
            <div key={i} className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}>
              {isAi && (
                <div className="p-1.5 bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 rounded-full flex-shrink-0 mt-1 shadow-sm ring-1 ring-brand-100">
                  <Bot size={14} />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[86%] shadow-sm ${
                isAi 
                  ? "bg-white/90 border border-brand-100 text-foreground rounded-tl-md"
                  : "bg-gradient-to-br from-brand-700 to-brand-800 text-primary-foreground rounded-tr-md"
              }`}>
                {m.text}
              </div>
              {!isAi && (
                <div className="p-1.5 bg-brand-50 text-brand-800 rounded-full flex-shrink-0 mt-1 shadow-sm ring-1 ring-brand-100">
                  <User size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Prompts Section - Only show if no user messages exist yet */}
      {msgs.length <= 1 && (
        <div className="px-4 py-3 bg-gradient-to-b from-background to-muted border-t border-brand-100 space-y-3.5">
          
          {/* Awareness Tip */}
          <div className="flex items-start gap-2 p-3 bg-brand-50/70 rounded-xl border border-brand-100 shadow-sm">
            <Lightbulb className="text-brand-600 shrink-0" size={18} aria-hidden="true" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Did you know?</strong> You can chat directly with this AI assistant. Type your own questions below, or try one of these to get started:
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => (
              <button
                key={p}
                disabled={loading}
                onClick={() => send(p)}
                className="px-3.5 py-2 bg-card border border-border hover:border-primary hover:bg-brand-50/50 text-secondary-foreground text-sm font-medium rounded-lg transition-all shadow-2xs text-left disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form 
        className="p-3.5 bg-gradient-to-r from-card to-brand-50/30 border-t border-brand-100 flex items-center gap-2.5 shadow-sm"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <button
          type="button"
          onClick={handleMicToggle}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center flex-shrink-0 ${
            isListening
              ? "bg-red-600 text-white shadow-md shadow-red-200"
              : "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 shadow-sm"
          }`}
          aria-label={isListening ? "Stop listening" : "Speak to MAVUNO AI"}
          title="Use voice input"
        >
          {isListening ? <MicOff aria-hidden="true" size={16} /> : <Mic aria-hidden="true" size={16} />}
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center flex-shrink-0 ${
            isMuted
              ? "bg-white text-foreground border border-border shadow-sm"
              : "bg-brand-100 text-brand-700 border border-brand-200 shadow-sm"
          }`}
          aria-label={isMuted ? "Unmute MAVUNO AI voice" : "Mute MAVUNO AI voice"}
          title={isMuted ? "Unmute voice" : "Mute voice"}
        >
          {isMuted ? <VolumeX aria-hidden="true" size={16} /> : <Volume2 aria-hidden="true" size={16} />}
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask MAVUNO AI…"
          aria-label="Ask MAVUNO AI"
          disabled={loading}
          className="flex-1 bg-muted border border-border focus:border-primary focus:bg-card text-sm text-card-foreground rounded-xl px-3.5 py-2.75 outline-none transition-all placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="p-2.5 bg-gradient-to-br from-brand-700 to-brand-800 hover:brightness-105 text-primary-foreground rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          aria-label="Send"
          disabled={loading || !text.trim()}
        >
          <Send aria-hidden="true" size={16} />
        </button>
      </form>

      {!privacyAccepted && (
        <div className="px-3 pb-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <div className="flex items-start justify-between gap-2">
              <div className="leading-relaxed">
                <strong className="font-semibold">Voice privacy notice:</strong> speech recognition may send your audio to the browser provider for transcription. Please only use voice if you are comfortable with that.
              </div>
              <button
                type="button"
                onClick={() => setPrivacyAccepted(true)}
                className="shrink-0 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm hover:brightness-105"
              >
                I agree
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-3 pb-3 pt-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1 text-[10px]">
            <span>Voice</span>
            <select
              value={voiceLanguage}
              onChange={(e) => setVoiceLanguage(e.target.value)}
              className="rounded border border-border bg-card px-1.5 py-1 text-[10px] text-foreground"
            >
              <option value="en-US">English</option>
              <option value="sw-KE">Swahili</option>
            </select>
          </label>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2 py-1 font-medium text-brand-700">
          {activeLanguageLabel}
        </span>

        <span className="inline-flex items-center gap-1">
          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          {isMuted ? "Voice muted" : "Voice reply enabled"}
        </span>
        <span className="text-[10px] text-muted-foreground/80">
          {isListening ? "Listening…" : "Ready"}
        </span>
      </div>

      {/* Footer */}
      <div className="py-2.5 px-4 bg-gradient-to-r from-brand-50/70 via-white to-brand-50/70 border-t border-brand-100 text-center">
        <span className="text-[10px] text-brand-700 font-semibold tracking-[0.14em] uppercase">Powered by MAVUNO AI</span>
      </div>
    </aside>
  );
}