import React, { useState, useEffect } from "react";
import { Sparkles, Play, Award, CheckCircle2, TrendingUp, AlertCircle, Cpu, ShieldAlert, BarChart3, Database, MessageSquare, ChevronDown, UserCheck, Settings, Globe, ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TRANSLATIONS } from "./MockData";

interface LandingPageProps {
  onLaunchPlatform: () => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
}

export default function LandingPage({ onLaunchPlatform, currentLang, onChangeLang }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [demoMatchPercent, setDemoMatchPercent] = useState(65);
  const [activeSandboxStudent, setActiveSandboxStudent] = useState("Developer");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Live match simulator ticker in Hero
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickers = [
    { student: "Candidate #8493 (NIT Trichy)", company: "TATA Consultancy Services", score: 94, dept: "Ministry of IT" },
    { student: "Candidate #7732 (IIT Madras)", company: "Reliance Digital Labs", score: 89, dept: "Telecom Dept" },
    { student: "Candidate #2190 (BITS Pilani)", company: "Infosys Web Core", score: 85, dept: "Skill Ministry" },
    { student: "Candidate #3409 (Delhi Univ)", company: "State Bank of India", score: 78, dept: "Finance Ministry" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sandbox simulation values based on role
  const getSandboxValues = () => {
    switch (activeSandboxStudent) {
      case "Developer":
        return {
          skills: ["Python", "React", "TypeScript", "SQL", "Machine Learning"],
          missing: ["AWS Cloud", "Docker"],
          score: 94,
          reasoning: "Candidate matches core language and framework variables. Highly optimized for software development positions under Digital India initiatives.",
          confidence: "High Compatibility"
        };
      case "Analyst":
        return {
          skills: ["Python", "Pandas", "SQL", "Excel", "Tableau"],
          missing: ["Machine Learning", "Scikit-Learn"],
          score: 82,
          reasoning: "Excellent descriptive modeling capabilities. High compatibility index for state financial analytics and reporting branches.",
          confidence: "High Compatibility"
        };
      case "DevOps":
        return {
          skills: ["Linux", "Bash", "Python", "Docker"],
          missing: ["AWS Cloud", "Kubernetes", "TypeScript"],
          score: 64,
          reasoning: "Satisfies baseline Linux automation tools. High missing factors in orchestration frameworks suggest supplementary training paths.",
          confidence: "Moderate Compatibility"
        };
      default:
        return { skills: [], missing: [], score: 0, reasoning: "", confidence: "" };
    }
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS["en"];
  const sandbox = getSandboxValues();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden">
      
      {/* Moving Cyber Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 -z-20 pointer-events-none"></div>
      
      {/* Background Neon Accent Glows */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Modern Floating Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-md border-b border-slate-900/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider m-0 leading-none">
              {t.title}
            </h1>
            <p className="text-[9px] text-slate-400 font-semibold tracking-widest mt-0.5 uppercase">AI Matching Core</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">{t.navHome}</a>
          <a href="#engine" className="hover:text-cyan-400 transition-colors">AI Engine</a>
          <a href="#benefits" className="hover:text-cyan-400 transition-colors">{t.navBenefits}</a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">{t.navFaq}</a>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          
          {/* Language Toggle Dropdown */}
          <div className="relative flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-indigo-300 font-bold shadow-md">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value)}
              className="bg-transparent text-xs text-indigo-300 font-bold border-none cursor-pointer focus:outline-none"
            >
              <option value="en" className="bg-slate-950 text-white">English</option>
              <option value="ta" className="bg-slate-950 text-white">தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-950 text-white">हिन्दी (Hindi)</option>
            </select>
          </div>

          <button
            onClick={onLaunchPlatform}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg border border-indigo-400/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            {t.navLogin}
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
            <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest">
              PM INTERNSHIP SCHEME OFFICIAL PORTAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight text-left">
            {t.subtitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 max-w-xl font-medium leading-relaxed text-left">
            {t.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onLaunchPlatform}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs tracking-wider transition-all shadow-lg shadow-indigo-500/20 cursor-pointer border border-indigo-400/30 flex items-center gap-2 group"
            >
              <span>{t.launchBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#engine"
              className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.demoBtn}</span>
            </a>
          </div>

          {/* Real-time Ticker Simulator */}
          <div className="pt-4 border-t border-slate-900/60 max-w-xl">
            <div className="flex items-center gap-3 text-xs bg-slate-950/60 border border-white/5 rounded-2xl p-3.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  <span>Engine Diagnostic Live Feed</span>
                  <span className="text-cyan-400">Match Allocated</span>
                </div>
                <p className="text-[11px] text-slate-300 font-semibold truncate">
                  ⚡ Matching <span className="text-indigo-400">{tickers[tickerIndex].student}</span> with <span className="text-white">{tickers[tickerIndex].company}</span>
                </p>
                <div className="flex justify-between text-[10px] text-slate-400/80 mt-0.5">
                  <span>Scheme: {tickers[tickerIndex].dept}</span>
                  <span className="text-emerald-400 font-bold">Accuracy: {tickers[tickerIndex].score}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Dashboard Representation */}
        <div className="md:col-span-5 relative">
          <div className="glass-panel rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden cyber-neon-indigo">
            {/* Embedded glowing circles inside layout */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Neural Core Dashboard</h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-full">
                ACTIVE STATE
              </span>
            </div>

            {/* Neural scan visualization layout */}
            <div className="space-y-4 text-left">
              <div className="bg-slate-950/80 rounded-xl p-4 border border-white/5 space-y-3 relative overflow-hidden">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-indigo-400">NLP Resume Parse Stage</span>
                  <span className="text-cyan-300">84% ATS Score</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-[84%]"></div>
                  {/* Moving scanner line overlay */}
                  <span className="absolute inset-y-0 w-1/3 bg-white/30 skew-x-12 animate-pulse"></span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded">Python</span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded">React.js</span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded">TensorFlow</span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded">SQL Core</span>
                </div>
              </div>

              {/* Progress allocations */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/80 rounded-xl p-3 border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Match Index</span>
                  <span className="text-xl font-black text-white">98.4%</span>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-3 border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Allocation Rate</span>
                  <span className="text-xl font-black text-white">94.2%</span>
                </div>
              </div>

              {/* Live allocation vector animation lines */}
              <div className="bg-slate-950/80 rounded-xl p-3.5 border border-white/5 text-xs font-semibold space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Ministry Scheme Distribution</span>
                  <span className="text-indigo-400">7 active loops</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300">MeitY (Electronics & IT)</span>
                    <span className="text-emerald-400 font-bold">90% Capacity</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[90%]"></div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-300">Telecom AI Operations</span>
                    <span className="text-cyan-400 font-bold">91% Capacity</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[91%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT VS SOLUTION */}
      <section id="problem" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Reimagining National Talent Allocation</h2>
          <p className="text-slate-400 dark:text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            Legacy allocation processes fail students and enterprise partners. FutureFit transforms this dynamic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Legacy Problems */}
          <div className="bg-slate-950/40 rounded-3xl border border-rose-500/10 p-8 space-y-6 relative hover:border-rose-500/20 transition-colors">
            <div className="absolute top-4 right-4 w-12 h-12 bg-rose-500/5 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            
            <h3 className="text-lg font-bold text-rose-400 uppercase tracking-wide">LEGACY MANUAL INEFFICIENCIES</h3>
            
            <ul className="space-y-4 text-xs font-semibold text-slate-400">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Spreadsheet Nightmare: Manual matching of thousands of CVs results in errors and allocation delays.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Unconscious Bias: Matching candidates manually introduces localized pedigree and background biases.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Opacity & Frustration: Students are left without transparent reasons for missing internship matches.</span>
              </li>
            </ul>
          </div>

          {/* Solution FutureFit */}
          <div className="bg-indigo-950/10 rounded-3xl border border-cyan-500/15 p-8 space-y-6 relative hover:border-cyan-500/30 transition-colors cyber-neon-cyan">
            <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-500/5 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>

            <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wide">FUTUREFIT AI SMART ENGINE</h3>

            <ul className="space-y-4 text-xs font-semibold text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Fully Automated Dispatch: Matches 25,000+ students with verified positions in under 3 minutes.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Zero Bias Guarantee: Algorithmic screening strips demographics to analyze strictly parsed competencies.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Explainable AI (XAI): Dynamic profiles show skill overlaps and clear text metrics for transparent matching.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HOW THE MATCHING ENGINE WORKS (EXPLAINABLE AI SANDBOX) */}
      <section id="engine" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest">Interactive Sandbox</span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white">How the Matching Engine Computes Placements</h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 leading-relaxed font-semibold">
              Move between candidate tracks below to simulate how our neural parsing engines score skill alignments and format transparent, explainable matches.
            </p>

            {/* Sandbox Selector Tabs */}
            <div className="flex p-1 bg-slate-950/60 border border-white/5 rounded-xl text-xs font-semibold gap-1 max-w-sm">
              <button
                onClick={() => setActiveSandboxStudent("Developer")}
                className={`flex-1 py-2 text-center rounded-lg cursor-pointer transition-colors ${
                  activeSandboxStudent === "Developer" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Developer
              </button>
              <button
                onClick={() => setActiveSandboxStudent("Analyst")}
                className={`flex-1 py-2 text-center rounded-lg cursor-pointer transition-colors ${
                  activeSandboxStudent === "Analyst" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Data Analyst
              </button>
              <button
                onClick={() => setActiveSandboxStudent("DevOps")}
                className={`flex-1 py-2 text-center rounded-lg cursor-pointer transition-colors ${
                  activeSandboxStudent === "DevOps" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                DevOps Engineer
              </button>
            </div>
          </div>

          {/* Dynamic Sandbox Display Board */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl relative text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explainable AI Core Simulator</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">COSINE ALIGNMENT MATCH SCATTER</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-xs font-black text-white">{sandbox.score}% Match Score</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Visual Skill Overlap Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Evaluated Candidate Profile Matrix</span>
                    <span className="text-cyan-400">{sandbox.confidence}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-400" style={{ width: `${sandbox.score}%` }}></div>
                    <div className="h-full bg-rose-500/40" style={{ width: `${100 - sandbox.score}%` }}></div>
                  </div>
                </div>

                {/* Overlap & Missing Matrices */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase block mb-2 tracking-wider">Identified Competency Vectors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sandbox.skills.map((skill, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase block mb-2 tracking-wider">Required Auxiliary Gaps</span>
                    <div className="flex flex-wrap gap-1.5">
                      {sandbox.missing.map((skill, idx) => (
                        <span key={idx} className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Reasoning Block */}
                <div className="bg-indigo-950/20 rounded-2xl p-4 border border-indigo-500/15">
                  <span className="text-[9px] text-indigo-400 font-extrabold uppercase block mb-1 tracking-wider">Explainable NLP Reasoning Feedback</span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    "{sandbox.reasoning}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTERPRISE SCALABILITY & INFRASTRUCTURE */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Engineered for State & Corporate Scalability</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            Powering transparent matches with robust cloud architectures, continuous learning models, and high ATS parsing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel-interactive rounded-3xl p-6 text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Resume Parsing Intelligence</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Integrates highly advanced NLP algorithms that parse PDF and Word resumes, extracting hard coding competencies, soft team-player skills, and domain categories.
            </p>
          </div>

          <div className="glass-panel-interactive rounded-3xl p-6 text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Continuous Adaptive Learning</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Our models constantly adjust allocation vectors using batch feedback hooks, increasing student-enterprise alignment accuracy from 65% to a stunning 98.4%.
            </p>
          </div>

          <div className="glass-panel-interactive rounded-3xl p-6 text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <h4 className="text-base font-bold text-white">Enterprise Scalability Suite</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Fully customized dashboard layouts allow national department officers to review allocations, trigger batch processing, and export databases instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SEC */}
      <section id="benefits" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Unparalleled Benefits Across Ecosystems</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm font-semibold">
            How FutureFit satisfies student candidates, academic entities, and national scheme managers simultaneously.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* For students */}
          <div className="bg-slate-950/40 rounded-3xl border border-white/5 p-8 text-left space-y-4">
            <h4 className="text-lg font-bold text-indigo-400">For Student Candidates</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Discover internships matching profile capabilities with 1 click.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Receive personalized skill gap suggestions (e.g. AWS Cloud).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent match scores prevent biased manual sorting.</span>
              </li>
            </ul>
          </div>

          {/* For Departments */}
          <div className="bg-slate-950/40 rounded-3xl border border-white/5 p-8 text-left space-y-4">
            <h4 className="text-lg font-bold text-cyan-400">For Schemes & Departments</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Complete automation eliminates manual administrative audits.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Real-time demand analytics track national resource skill gaps.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Verified academic transcripts prevent credentials fraud.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FAQ (ACCORDION) */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-slate-900/60">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-white">Frequently Answered Diagnostics</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold">
            Common questions regarding NLP parsing mechanics, algorithmic accuracy, and student data policies.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the NLP resume parser extract skills?",
              a: "Our NLP parser reads structural layers in uploaded PDFs or DOCX files. It isolates text segments, applies token dictionaries, and maps sentences into domain-specific skill categories, checking for coding languages, operating tools, and quantitative capabilities."
            },
            {
              q: "What is the CGPA verification process?",
              a: "Universities hook into the FutureFit administrative node using secure APIs to instantly transmit verified transcripts, preventing credential falsification and ensuring fair quantitative scoring."
            },
            {
              q: "Is there a mechanism to handle manual overrides?",
              a: "Yes. In the high-security scheme admin console, authorized personnel can override individual matches, filter entries by specific ministry requirements, and run manual corrections."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-white/5 rounded-2xl overflow-hidden text-left">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-200 hover:text-white cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-900"
                  >
                    <p className="p-5 text-xs text-slate-400 font-semibold leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT & DEMO REQUEST */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-900/60 text-center">
        <div className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
          
          <h2 className="text-3xl font-extrabold text-white">Connect with Our AI Architects</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm font-semibold mt-2 mb-8">
            Deploy FutureFit at your university campus, state ministry office, or corporate headquarters. Request a deep-dive AI briefing session.
          </p>

          {contactSubmitted ? (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-indigo-950/40 border border-indigo-500/20 p-8 rounded-2xl space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">AI Briefing Scheduled!</h4>
              <p className="text-xs text-slate-400 font-medium">Our platform architecture team will contact you in under 12 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                required
                placeholder="Enter enterprise email..."
                className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg cursor-pointer"
              >
                Request Access
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. PREMIUM FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900/80 px-6 py-12 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-white tracking-wider">{t.title}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              Automating fair, scalable, and transparent digital matches under the PM Scheme.
            </p>
          </div>

          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Architectures</span>
            <ul className="space-y-2 text-[10px] text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">NLP CV Parsing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">XAI Optimization</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Verification Systems</a></li>
            </ul>
          </div>

          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Compliance</span>
            <ul className="space-y-2 text-[10px] text-slate-500">
              <li><a href="#" className="hover:text-white transition-colors">Data Privacy Node</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zero-Bias Protocol</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Official Guidelines</a></li>
            </ul>
          </div>

          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">National Offices</span>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              PM Scheme Allocation HQ<br />
              Ministry of Electronics & IT (MeitY)<br />
              New Delhi, India
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
          <p>© 2026 FutureFit AI Systems Ltd. All privileges reserved globally.</p>
          <p className="text-slate-600">Secure Protocol v1.4.0-build-983 | ISO-27001 Certified</p>
        </div>
      </footer>
    </div>
  );
}
