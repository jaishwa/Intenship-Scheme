import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  XCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  BarChart3,
  Sparkles,
  Download,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Star
} from "lucide-react";
import type { Assessment, MCQQuestion } from "./MockData";
import { MOCK_ASSESSMENTS, SAMPLE_MCQ_QUESTIONS, ASSESSMENT_LEADERBOARD } from "./MockData";

interface AssessmentSystemProps {
  mode: "student" | "company";
  translations: Record<string, string>;
}

export default function AssessmentSystem({ mode, translations }: AssessmentSystemProps) {
  const [view, setView] = useState<"list" | "active" | "results">("list");
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [score, setScore] = useState<number | null>(null);

  // Start timer for active assessment
  useEffect(() => {
    let timer: any = null;
    if (view === "active" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [view, timeLeft]);

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQ(0);
    setAnswers([]);
    setScore(null);
    setTimeLeft(assessment.duration * 60);
    setView("active");
  };

  const submitAssessment = () => {
    const total = SAMPLE_MCQ_QUESTIONS.length;
    const correct = answers.filter((ans, idx) => ans === SAMPLE_MCQ_QUESTIONS[idx].correctIndex).length;
    const computedScore = Math.round((correct / total) * 100);
    setScore(computedScore);
    setView("results");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Badge colors based on type
  const typeBadge = (type: string) => {
    const map: Record<string, string> = {
      mcq: "indigo",
      coding: "cyan",
      aptitude: "amber",
      behavioral: "emerald"
    };
    const color = map[type.toLowerCase()] || "gray";
    return (
      <span
        className={`px-2 py-1 text-xs rounded bg-${color}-500/10 border border-${color}-500/20 text-${color}-400`}
      >
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <AnimatePresence mode="wait">
        {/* LIST VIEW */}
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Available Assessments</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {MOCK_ASSESSMENTS.map((asmt) => (
                <div key={asmt.id} className="glass-panel rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{asmt.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">{typeBadge(asmt.type)}</div>
                    <p className="mt-2 text-sm text-slate-400">Duration: {asmt.duration} min</p>
                    <p className="text-sm text-slate-400">Questions: {asmt.questions}</p>
                    <p className="text-sm text-slate-400">Avg Score: {asmt.avgScore}%</p>
                  </div>
                  <button
                    onClick={() => startAssessment(asmt)}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-1 text-xs font-medium"
                  >
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>
            {mode === "company" && (
              <div className="mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl">
                  <Plus className="w-4 h-4" /> Create New Assessment
                </button>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white">Assessment Leaderboard</h3>
                  <table className="w-full mt-2 text-sm border-collapse">
                    <thead className="bg-slate-950/80 text-slate-400">
                      <tr>
                        <th className="p-2 text-left">Rank</th>
                        <th className="p-2 text-left">User</th>
                        <th className="p-2 text-left">Score</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      {ASSESSMENT_LEADERBOARD.map((row, idx) => (
                        <tr key={idx} className="border-t border-slate-800">
                          <td className="p-2">{row.rank || idx + 1}</td>
                          <td className="p-2">{row.name} ({row.university})</td>
                          <td className="p-2">{row.score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ACTIVE VIEW */}
        {view === "active" && selectedAssessment && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{selectedAssessment.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-green-400" /> AI Proctoring Active
                <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${((currentQ) / SAMPLE_MCQ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
            <div className="glass-panel rounded-xl p-4 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-2">Question {currentQ + 1}</h3>
              <p className="text-slate-300 mb-4">{SAMPLE_MCQ_QUESTIONS[currentQ].question}</p>
              <div className="grid gap-2">
                {SAMPLE_MCQ_QUESTIONS[currentQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[currentQ] = idx;
                      setAnswers(newAnswers);
                    }}
                    className={`p-2 text-left border rounded ${
                      answers[currentQ] === idx ? "border-indigo-400 bg-indigo-900/50" : "border-slate-700 bg-slate-900"
                    } text-slate-200`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
                disabled={currentQ === 0}
                className="px-4 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 inline" /> Prev
              </button>
              {currentQ < SAMPLE_MCQ_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentQ((c) => Math.min(SAMPLE_MCQ_QUESTIONS.length - 1, c + 1))}
                  className="px-4 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                >
                  Next <ArrowRight className="w-4 h-4 inline" />
                </button>
              ) : (
                <button
                  onClick={submitAssessment}
                  className="px-4 py-1 bg-green-600 hover:bg-green-500 text-white rounded"
                >
                  Submit Assessment
                </button>
              )}
            </div>
            {/* Question Navigator Sidebar */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {SAMPLE_MCQ_QUESTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQ(idx)}
                  className={`w-full py-1 text-xs rounded ${
                    idx === currentQ
                      ? "bg-indigo-600 text-white"
                      : answers[idx] !== undefined
                      ? "bg-green-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULTS VIEW */}
        {view === "results" && score !== null && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="relative inline-block">
                <div className="w-48 h-48 bg-indigo-800/50 rounded-full flex items-center justify-center" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{score}%</span>
                </div>
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Assessment Completed</h2>
            <p className="text-slate-300">You answered {score}% of questions correctly.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setView("list")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
              >
                Back to Assessments
              </button>
              <button
                onClick={() => {
                  setScore(null);
                  setView("list");
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded"
              >
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Helper Plus icon import */
import { Plus } from "lucide-react";

/* Note: The mock data structures (MOCK_ASSESSMENTS, SAMPLE_MCQ_QUESTIONS, ASSESSMENT_LEADERBOARD) must conform to the required fields used above. */
