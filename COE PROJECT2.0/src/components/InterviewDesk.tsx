import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Camera, Mic, Monitor, XCircle, Play, Zap, Clock, CheckCircle2, BarChart3, ShieldCheck, Sparkles, ChevronsLeftRight, Volume2
} from "lucide-react";
import type { Interview } from "./MockData";
import { MOCK_INTERVIEWS } from "./MockData";

interface InterviewDeskProps {
  mode: "student" | "company";
  onClose?: () => void;
  translations: Record<string, string>;
}

export default function InterviewDesk({ mode, onClose, translations }: InterviewDeskProps) {
  const [view, setView] = useState<"lobby" | "live">("lobby");
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [liveTimer, setLiveTimer] = useState(0); // seconds elapsed
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const [liveScores, setLiveScores] = useState({
    communication: 82,
    technical: 78,
    confidence: 75,
    response: 80
  });
  const liveTips = [
    "Good eye contact maintained",
    "Technical answer needs more depth",
    "Speak slightly slower for clarity",
    "Strong use of examples",
    "Excellent STAR format response"
  ];
  const [tipIndex, setTipIndex] = useState(0);

  // Initialize countdowns for scheduled interviews
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newCounts: Record<string, number> = {};
      MOCK_INTERVIEWS.forEach((iv) => {
        if (iv.status === "scheduled") {
          const target = Date.now() + 3600 * 1000;
          const diff = Math.max(0, Math.floor((target - now) / 1000));
          newCounts[iv.id] = diff;
        }
      });
      setCountdowns(newCounts);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live score simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveScores((prev) => ({
        communication: Math.min(100, Math.max(70, prev.communication + (Math.random() * 4 - 2))),
        technical: Math.min(100, Math.max(70, prev.technical + (Math.random() * 4 - 2))),
        confidence: Math.min(100, Math.max(70, prev.confidence + (Math.random() * 4 - 2))),
        response: Math.min(100, Math.max(70, prev.response + (Math.random() * 4 - 2)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Tip ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % liveTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Live interview timer
  useEffect(() => {
    let timer: any = null;
    if (view === "live") {
      timer = setInterval(() => setLiveTimer((t) => t + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleJoinLive = (interview: Interview) => {
    setSelectedInterview(interview);
    setView("live");
    setLiveTimer(0);
  };

  const endInterview = () => {
    alert(
      `Interview completed!\nCommunication: ${liveScores.communication.toFixed(0)}%\nTechnical: ${liveScores.technical.toFixed(
        0
      )}%\nConfidence: ${liveScores.confidence.toFixed(0)}%\nResponse Quality: ${liveScores.response.toFixed(0)}%`
    );
    setView("lobby");
    setSelectedInterview(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        {view === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">AI Interview Desk</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {MOCK_INTERVIEWS.slice(0, 3).map((iv) => (
                <div
                  key={iv.id}
                  className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">{iv.candidateName}</h3>
                    <p className="text-sm text-slate-400">{iv.role}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
                      {iv.type}
                    </span>
                  </div>
                  <div className="mt-3">
                    {iv.status === "live" && (
                      <span className="flex items-center gap-1 text-green-400 font-bold">
                        <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full" /> LIVE NOW
                      </span>
                    )}
                    {iv.status === "scheduled" && (
                      <span className="text-slate-300">
                        Starts in: {formatTime(countdowns[iv.id] ?? 0)}
                      </span>
                    )}
                    {iv.status === "completed" && (
                      <span className="text-indigo-300">AI Score: {iv.aiScore}%</span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {iv.status === "live" && (
                      <button
                        onClick={() => handleJoinLive(iv)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-1 text-xs font-medium"
                      >
                        Join Interview Room
                      </button>
                    )}
                    {mode === "student" && iv.status === "scheduled" && (
                      <button
                        onClick={() => handleJoinLive(iv)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl py-1 text-xs font-medium"
                      >
                        Start AI Mock Interview
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Tips sidebar */}
            <div className="mt-6 p-4 glass-panel rounded-xl border border-white/5 max-w-md">
              <h3 className="text-sm font-semibold text-white mb-2">AI Interview Tips</h3>
              <ul className="list-disc list-inside text-slate-300 text-xs">
                <li>Maintain eye contact</li>
                <li>Structure answers with STAR</li>
                <li>Speak clearly and at a moderate pace</li>
                <li>Highlight measurable achievements</li>
              </ul>
            </div>
          </motion.div>
        )}

        {view === "live" && selectedInterview && (
          <motion.div
            key="live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-12 gap-4"
          >
            {/* Left Video Panel */}
            <div className="col-span-4 space-y-4">
              <div className="aspect-video bg-slate-900/80 rounded-xl flex items-center justify-center relative">
                <Camera className="w-12 h-12 text-indigo-400" />
                <span className="absolute bottom-2 left-2 text-xs text-slate-400">Your Camera – {mode === "student" ? "Arjun Sharma" : "Interviewer"}</span>
              </div>
              <div className="flex gap-2 justify-center">
                <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300">
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={endInterview}
                  className="p-2 bg-rose-600 rounded-full hover:bg-rose-500 text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-slate-400">Elapsed: {formatTime(liveTimer)}</div>
            </div>

            {/* Center Content Panel */}
            <div className="col-span-5 space-y-4">
              <div className="glass-panel rounded-xl p-4 border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-2">Interview Question</h3>
                <p className="text-slate-300">
                  {/* Hardcoded question list */}
                  {[
                    "Describe a challenging project you led and the outcome.",
                    "How do you handle tight deadlines and pressure?",
                    "Explain a time when you had to resolve a conflict within a team."
                  ][liveTimer % 3]}
                </p>
              </div>
              <textarea
                placeholder="Your Answer Notes..."
                className="w-full h-32 glass-panel rounded-xl p-3 text-slate-200 border border-white/5 resize-none focus:outline-none"
              />
              {/* Voice Wave Equalizer */}
              <div className="flex justify-center space-x-1">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-indigo-400 rounded"
                    style={{
                      animation: "pulse 1s infinite",
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
              <p className="text-sm text-slate-400 text-center mt-2">AI is listening and analyzing your response...</p>
            </div>

            {/* Right AI Analysis Panel */}
            <div className="col-span-3 space-y-4">
              <div className="glass-panel rounded-xl p-4 border border-white/5">
                <h3 className="text-md font-medium text-white mb-2">AI Cognitive Analysis</h3>
                {Object.entries(liveScores).map(([key, val]) => (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs text-slate-300 capitalize">
                      <span>{key}</span>
                      <span>{val.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded">
                      <div
                        className="h-full bg-indigo-500 rounded"
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-panel rounded-xl p-4 border border-white/5">
                <h4 className="text-sm font-semibold text-white mb-1">Live AI Feedback</h4>
                <p className="text-xs text-slate-300">{liveTips[tipIndex]}</p>
              </div>
              <div className="glass-panel rounded-xl p-4 border border-white/5 flex items-center gap-2">
                <span className="text-sm font-medium text-white">Emotion Analysis:</span>
                <span className="text-2xl">😊</span>
                <span className="text-2xl">🎯</span>
                <span className="text-2xl">😌</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Simple keyframe for voice bars */
const style = document.createElement("style");
style.textContent = `
@keyframes pulse {
  0% { height: 20%; }
  50% { height: 100%; }
  100% { height: 20%; }
}
`;
document.head.appendChild(style);
