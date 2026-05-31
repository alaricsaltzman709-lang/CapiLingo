import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Sparkles, AlertCircle, HelpCircle, Bot, Loader2 } from "lucide-react";
import { Module, StudentChat } from "../types";
import CapiMascot from "./CapiMascot";

interface PracticeAgentProps {
  module: Module;
  userId: string;
  onBack: () => void;
}

export default function PracticeAgent({
  module,
  userId,
  onBack,
}: PracticeAgentProps) {
  const [messages, setMessages] = useState<StudentChat[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  // Load chat history from progress DB on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`/api/progress/${userId}`);
        const data = await res.json();
        if (res.ok && data.progress && data.progress.chats && data.progress.chats[module.id]) {
          setMessages(data.progress.chats[module.id]);
        } else {
          // If empty, generate a friendly dynamic greeting from Capi
          const levelText = module.level;
          const vocabText = module.vocabulary.slice(0, 3).join(", ");
          const greetingText = `¡Churr churr! *splish splash* Capi salta feliz en su bañera termal. ¡Felicidades por terminar la lección "${module.title}"! Platiquemos un rato en inglés nivel ${levelText}. ¿Me podrías decir tu palabra favorita del vocabulario de hoy? Aprendimos sobre: "${vocabText}"...`;

          setMessages([
            {
              role: "model",
              text: greetingText,
              timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      } catch (err) {
        console.error("Error reading chat records:", err);
      }
    };

    fetchChatHistory();
  }, [module.id, userId]);

  // Keep chat scrolled down
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || typing) return;

    setErrorMsg("");
    setInputValue("");

    const userTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    const userMsg: StudentChat = {
      role: "user",
      text: textToSend,
      timestamp: userTime,
    };

    // Optimistic render
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          moduleId: module.id,
          message: textToSend,
          history: messages.slice(-10), // send last 10 turns back to Gemini for context coherence
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Fallo en la comunicación con el tutor.");
      }

      setIsSimulated(!!data.simulated);

      const tutorTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.text,
          timestamp: tutorTime,
        },
      ]);
    } catch (err: any) {
      setErrorMsg("Ocurrió un error conectando con el agente AI.");
      console.error(err);
    } finally {
      setTyping(false);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Automated action triggers for easy conversation guidance
  const sendQuickMacro = (type: "hint" | "fact" | "correct") => {
    if (type === "hint") {
      handleSendMessage(`Tengo dudas con la lección ${module.title}. Capi, dame un tip de gramática gracioso en inglés y español.`);
    } else if (type === "correct") {
      handleSendMessage("I am make bad English. Corrige mi frase anterior por favor.");
    } else {
      handleSendMessage("Capi, tell me a cool capybara fun fact in English!");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[550px] items-stretch">
      {/* Sidebar companion */}
      <div className="md:col-span-4 bg-bento-card border border-bento-border rounded-3xl p-5 shadow-sm flex flex-col justify-between items-center text-center">
        <div className="space-y-4 w-full">
          <div className="text-left">
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-1 py-1.5 px-3 bg-bento-bg hover:bg-bento-card text-bento-text border border-bento-border text-xs font-bold rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-bento-accent" />
              <span>Salir del Chat</span>
            </button>
          </div>

          <div className="pt-2">
            <CapiMascot
              mood={typing ? "thinking" : "happy"}
              size={120}
            />
            <h4 className="text-lg font-black text-bento-text mt-2">Capi el Tutor</h4>
            <span className="text-[10px] bg-bento-accent/10 text-bento-accent border border-bento-accent/20 font-bold px-2 py-0.5 rounded-full uppercase">
              Tutor de IA Real
            </span>
          </div>

          <div className="bg-bento-bg p-4 rounded-2xl text-xs space-y-1.5 border border-bento-border text-left">
            <p className="font-bold text-bento-text">Tema activo:</p>
            <p className="text-bento-muted font-medium italic">"{module.title}"</p>
            <p className="font-bold text-bento-text pt-1.5">Nivel del inglés:</p>
            <p className="text-bento-accent uppercase tracking-wide font-bold text-[10px] bg-bento-accent/10 px-2 py-0.5 rounded-lg border border-bento-accent/25 max-w-fit mt-0.5">
              {module.level}
            </p>
          </div>
        </div>

        {/* Quick helper keys */}
        <div className="space-y-2 w-full pt-4 border-t border-bento-border">
          <span className="text-[10px] font-bold text-bento-muted uppercase tracking-widest block text-left">Acciones rápidas:</span>
          <button
            onClick={() => sendQuickMacro("hint")}
            className="w-full py-2 px-3 text-left bg-bento-bg hover:bg-bento-card text-bento-text text-xs font-semibold rounded-xl border border-bento-border transition flex items-center justify-between cursor-pointer"
          >
            <span>💡 Dame un tip de gramática</span>
            <span className="text-bento-accent text-xs">&rarr;</span>
          </button>
          <button
            onClick={() => sendQuickMacro("fact")}
            className="w-full py-2 px-3 text-left bg-bento-bg hover:bg-bento-card text-bento-text text-xs font-semibold rounded-xl border border-bento-border transition flex items-center justify-between cursor-pointer"
          >
            <span>🍊 Cuéntame un Capy-Facto!</span>
            <span className="text-bento-accent text-xs">🍊</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-8 bg-bento-card border border-bento-border rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
        {/* Chat top header bar */}
        <div className="bg-bento-bg px-5 py-4 border-b border-bento-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-2 w-2 rounded-full bg-bento-accent animate-pulse" />
            <div>
              <p className="text-sm font-bold text-bento-text">Capi - Inteligencia Artificial</p>
              <p className="text-[10px] text-bento-muted">Siempre activo en el pantano bilingüe</p>
            </div>
          </div>

          {isSimulated && (
            <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase border border-amber-500/25">
              Modo Simulador
            </span>
          )}
        </div>

        {/* Status notice */}
        {isSimulated && (
          <div className="bg-amber-500/5 px-5 py-2.5 border-b border-bento-border text-[11px] text-amber-500 flex items-center justify-between gap-2.5 font-mono">
            <span>⚠️ API Key no configurada. Conversando en simulación local.</span>
            <span className="text-[9px] uppercase font-bold text-bento-muted">Settings &gt; Secrets</span>
          </div>
        )}

        {/* Message Viewlist */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isMe = msg.role === "user";
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end space-x-2`}
                >
                  {!isMe && (
                    <div className="h-8 w-8 rounded-full bg-bento-accent/10 border border-bento-accent/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-bento-accent" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm ${
                    isMe
                      ? "bg-bento-accent text-white rounded-br-none"
                      : "bg-bento-bg text-bento-text border border-bento-border rounded-bl-none"
                  }`}>
                    {/* Preserve line breaks for gorgeous formatting */}
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className={`block text-[9px] mt-1.5 font-mono text-right ${isMe ? "text-indigo-100" : "text-bento-muted"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing status bubble */}
            {typing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-start items-center space-x-2"
              >
                <div className="h-8 w-8 rounded-full bg-bento-accent/10 border border-bento-accent/20 flex items-center justify-center shrink-0 animate-bounce">
                  <Bot className="w-4 h-4 text-bento-accent" />
                </div>
                <div className="bg-bento-bg text-bento-text border border-bento-border p-3 rounded-2xl rounded-bl-none flex items-center space-x-2 shadow-inner">
                  <span className="text-xs italic text-bento-muted flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-bento-accent" />
                    Capi está escribiendo...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={endRef} />
        </div>

        {/* Input box */}
        <div className="p-4 bg-bento-bg border-t border-bento-border">
          {errorMsg && (
            <div className="mb-2 text-xs text-red-600 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleInputSubmit} className="flex gap-2.5">
            <input
              type="text"
              disabled={typing}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Contesta a Capi en inglés para practicar..."
              className="flex-1 px-4 py-3 border border-bento-border bg-bento-card text-bento-text rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-bento-accent focus:border-bento-accent font-medium font-sans"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || typing}
              className="px-5 py-3 bg-bento-accent hover:bg-bento-accent-hover disabled:opacity-45 text-white rounded-2xl shadow transition cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
