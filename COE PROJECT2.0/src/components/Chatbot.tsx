import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Volume2, Mic, MicOff, X, Sparkles, VolumeX, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  currentLang: string;
  translations: Record<string, string>;
}

export default function Chatbot({ currentLang, translations }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am FutureFit's neural allocation advisor. How can I help optimize your resume or explain your PM Scheme allocation match today?",
      timestamp: "Just now",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      // Select appropriate language code
      if (currentLang === "ta") {
        utterance.lang = "ta-IN";
      } else if (currentLang === "hi") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-US";
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      setIsSpeaking(true);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Cancel speech if speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    // AI logic response simulation
    setTimeout(() => {
      let reply = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("resume") || lower.includes("ats") || lower.includes("மறுதொடக்க")) {
        reply = "To maximize your resume strength, ensure you format it using a single-column layout, use clear headings, and integrate keyword tokens like 'Python', 'React', 'TypeScript', and 'SQL'. Our real-time NLP scanner also tracks academic performance and project domain tags to score alignment.";
      } else if (lower.includes("skills") || lower.includes("demand") || lower.includes("திறன்")) {
        reply = "Current national metrics for 2026 indicate that 'React/Next.js' is leading web engineering demand (130 open placements/month), followed closely by 'Python & Pandas Data Modeling' (120 placements/month) and 'AWS Cloud Systems Orchestration' (65 placements/month).";
      } else if (lower.includes("bias") || lower.includes("explainable") || lower.includes("சார்பு")) {
        reply = "Our Explainable AI (XAI) engine runs structured compliance algorithms that completely strip student profiles of demographic indicators (gender, religion, region). It then analyzes strictly quantifiable capabilities (skills, academic verified CGPA, projects) and yields a mathematically explainable confidence index.";
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("வணக்கம்")) {
        reply = "Hello there! I am ready to guide you. Ask me about custom resume tips, skill gap recommendations, or how our PM Allocation runs are executed.";
      } else {
        reply = "I've processed your query. Under the PM Internship guidelines, the smart matching core targets a minimal skill overlap of 70% and a high academic threshold (CGPA > 8.0) to deliver premium talent allocation. Let me know if you would like me to analyze a specific area!";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate listening and answering
      setTimeout(() => {
        setIsListening(false);
        const voiceQuery = currentLang === "ta" ? "எனது மறுதொடக்கத்தை மேம்படுத்தவும்" : currentLang === "hi" ? "कौशल मांग दिखाएं" : "Show me the top high-demand skills for 2026";
        handleSend(voiceQuery);
      }, 3000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="glass-panel w-96 h-[500px] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-indigo-500/20 cyber-neon-indigo mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/80 border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    {translations.chatBotTitle || "FutureFit Assistant"}
                  </h3>
                  <p className="text-[10px] text-indigo-300 font-medium">Neural Matching Core v1.4</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs relative ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-900/90 text-slate-100 border border-white/5 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    
                    <div className="mt-1 flex items-center justify-between text-[8px] text-slate-400/80 gap-4">
                      <span>{msg.timestamp}</span>
                      {msg.sender === "ai" && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                          title="Read out loud"
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/90 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-950/40 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSend(translations.chatPrompt1 || "How do I improve my resume ATS score?")}
                className="text-[10px] bg-slate-900 text-indigo-300 hover:bg-slate-800/80 hover:text-white px-2 py-1 rounded-full border border-indigo-500/10 transition-all truncate max-w-full"
              >
                📝 ATS Score Tips
              </button>
              <button
                onClick={() => handleSend(translations.chatPrompt2 || "Show me the top high-demand skills for 2026")}
                className="text-[10px] bg-slate-900 text-indigo-300 hover:bg-slate-800/80 hover:text-white px-2 py-1 rounded-full border border-indigo-500/10 transition-all truncate max-w-full"
              >
                🔥 Demand Skills
              </button>
              <button
                onClick={() => handleSend(translations.chatPrompt3 || "Explain how explainable AI prevents bias")}
                className="text-[10px] bg-slate-900 text-indigo-300 hover:bg-slate-800/80 hover:text-white px-2 py-1 rounded-full border border-indigo-500/10 transition-all truncate max-w-full"
              >
                ⚖️ Eliminate Bias
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-900/60 flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-rose-500/20 border border-rose-500 text-rose-400 animate-pulse"
                    : "bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
                }`}
                title={isListening ? "Listening..." : "Simulate Voice Search"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder={
                    isListening
                      ? "Listening to voice input..."
                      : "Type dynamic message..."
                  }
                  disabled={isListening}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-3 pr-10 text-xs text-white focus:border-indigo-500 placeholder:text-slate-500 transition-colors disabled:opacity-50"
                />
                
                {isListening && (
                  <div className="absolute right-3 flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-rose-400 animate-pulse h-2"></span>
                    <span className="w-0.5 bg-rose-400 animate-pulse h-3"></span>
                    <span className="w-0.5 bg-rose-400 animate-pulse h-1"></span>
                    <span className="w-0.5 bg-rose-400 animate-pulse h-2.5"></span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="w-9 h-9 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white shadow-2xl relative border border-white/20 cyber-neon-indigo group cursor-pointer focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="absolute">
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="absolute flex items-center justify-center">
              <Bot className="w-6 h-6 animate-float" />
              {/* Outer pulsing ring */}
              <span className="absolute -inset-1 rounded-full border border-indigo-400/50 animate-ping opacity-60"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
