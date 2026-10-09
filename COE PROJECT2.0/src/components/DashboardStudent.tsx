import React, { useState } from "react";
import { 
  User, Upload, FileText, BarChart3, Target, Award, Briefcase, Bell, Sparkles, Settings, LogOut, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, RefreshCw, FileUp, ShieldAlert, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import type { Internship } from "./MockData";
import { MOCK_INTERNSHIPS, CURRENT_STUDENT, MOCK_NOTIFICATIONS } from "./MockData";

interface DashboardStudentProps {
  onLogout: () => void;
  currentLang: string;
  translations: Record<string, string>;
}

type TabType = "dashboard" | "profile" | "resume" | "analysis" | "skills" | "matches" | "internships" | "applications" | "insights" | "settings";

export default function DashboardStudent({ onLogout, currentLang, translations }: DashboardStudentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentProfile, setStudentProfile] = useState(CURRENT_STUDENT);
  
  // Resume uploading states
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  // Applications list
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  
  // Comparison tool
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Skill Gap radar data
  const skillRadarData = [
    { subject: 'AI Modelling', A: 85, fullMark: 100 },
    { subject: 'Web Interfaces', A: 90, fullMark: 100 },
    { subject: 'SQL / Databases', A: 80, fullMark: 100 },
    { subject: 'Cloud / Infrastructure', A: 25, fullMark: 100 },
    { subject: 'Operations Research', A: 65, fullMark: 100 },
    { subject: 'Team Leadership', A: 75, fullMark: 100 },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    triggerResumeParsing("Uploaded_Transcript_CV_2026.pdf");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      triggerResumeParsing(e.target.files[0].name);
    }
  };

  const triggerResumeParsing = (fileName: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate animated line scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setResumeUploaded(true);
            // Simulate AI updating candidate score & parsed skills
            setStudentProfile(prevProfile => ({
              ...prevProfile,
              resumeName: fileName,
              atsScore: 92, // upgraded from 84 due to perfect keywords
              parsedSkills: [...prevProfile.parsedSkills, "AWS Cloud", "Docker"] // dynamically resolved gaps
            }));
            alert("NLP Scanner complete! Added: AWS Cloud, Docker. ATS Strength elevated to 92%.");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const handleApply = (id: string) => {
    if (appliedIds.includes(id)) return;
    setAppliedIds((prev) => [...prev, id]);
    alert("Application successfully disptached! Placement system queueing verified.");
  };

  const handleCompareToggle = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds((prev) => prev.filter(cId => cId !== id));
    } else {
      if (compareIds.length >= 2) {
        alert("Comparison is capped at 2 internships side-by-side.");
        return;
      }
      setCompareIds((prev) => [...prev, id]);
    }
  };

  // Translations shortcuts
  const t = translations;

  const sidebarItems = [
    { id: "dashboard", label: t.overview || "Overview", icon: Layers },
    { id: "profile", label: t.profile || "My Profile", icon: User },
    { id: "resume", label: t.resumeUpload || "Resume Upload", icon: Upload },
    { id: "analysis", label: t.resumeAnalysis || "AI Resume Analysis", icon: FileText },
    { id: "skills", label: t.matchScores || "Match Intelligence", icon: BarChart3 },
    { id: "internships", label: t.recommendations || "AI Recommendations", icon: Briefcase },
    { id: "applications", label: t.applications || "My Applications", icon: CheckCircle2 },
    { id: "insights", label: t.careerInsights || "Career Insights", icon: Target },
    { id: "settings", label: t.settings || "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex relative overflow-hidden bg-[#030712]">
      
      {/* Background Cyber Glow Accent */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* SIDEBAR NAVIGATION */}
      <aside 
        className={`bg-slate-950/80 border-r border-white/5 backdrop-blur-xl transition-all duration-300 flex flex-col z-30 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Brand Banner */}
        <div className="p-5 border-b border-slate-900/80 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white">FutureFit</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md mx-auto">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
          )}

          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden sm:block text-slate-500 hover:text-white p-1 hover:bg-slate-900 rounded-md transition-all cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card */}
        {sidebarOpen && (
          <div className="p-4 mx-4 my-4 bg-slate-900/60 rounded-2xl border border-white/5 text-left">
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Verified Candidate</p>
            <h4 className="text-xs font-bold text-white truncate mt-0.5">{studentProfile.name}</h4>
            <p className="text-[9px] text-slate-500 truncate">{studentProfile.university}</p>
          </div>
        )}

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-900/80">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {sidebarOpen && <span>{t.logout || "Log Out"}</span>}
          </button>
        </div>
      </aside>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto px-6 sm:px-8 py-6 text-left">
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b border-slate-900/80 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-white capitalize">{activeTab} Console</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Secure Allocation Access Core
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct Academic verification notice */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] text-emerald-400 font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CGPA: {studentProfile.cgpa} VERIFIED</span>
            </div>

            {/* Notification drop */}
            <div className="relative">
              <button className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer relative">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-slate-900"></span>
              </button>
            </div>
          </div>
        </div>

        {/* STATEFUL TABS CONTROLLER */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Core Analytics Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.atsScore || "ATS Strength"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-white">{studentProfile.atsScore}%</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Optimized</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500" style={{ width: `${studentProfile.atsScore}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.matchScore || "Match Score"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-white">94%</span>
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Excellent</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-cyan-400" style={{ width: "94%" }}></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.careerReadiness || "Readiness Index"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-white">82%</span>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">High Readiness</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-emerald-400" style={{ width: "82%" }}></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.profileComp || "Profile Completion"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-white">100%</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>

              {/* Main dashboard body split */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* Visual radar & skill gap analysis */}
                <div className="lg:col-span-6 glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Skill Gap radar</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">COMPARING PROFILE TO NATIONAL STANDARDS</p>
                  </div>
                  
                  {/* Recharts radar container */}
                  <div className="h-[220px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                        <Radar name="Arjun" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Skill checklist check grids */}
                  <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between text-xs font-bold mb-3 border-b border-slate-900 pb-2">
                      <span className="text-slate-300">Technical Skill Index</span>
                      <span className="text-emerald-400">Total matched: {studentProfile.parsedSkills.length}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {studentProfile.parsedSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Suggestions and Notifications */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Glowing AI recommendations prompt */}
                  <div className="bg-indigo-950/20 rounded-3xl border border-indigo-500/15 p-6 space-y-4 cyber-neon-indigo">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {t.suggestedAITip || "AI Skill Gap Suggestion"}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {t.suggestedAITipText || "Acquire AWS Cloud and Docker foundations to boost your compatibility score by 15% across MeitY schemes."}
                    </p>
                    
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2.5 py-1 rounded">Suggested course: Docker Core</span>
                      <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-bold px-2.5 py-1 rounded">Estimated time: 10h</span>
                    </div>
                  </div>

                  {/* System alerts */}
                  <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2">
                      Notification Activity Feed
                    </h4>
                    <div className="space-y-3.5 text-xs">
                      {MOCK_NOTIFICATIONS.map((notif) => (
                        <div key={notif.id} className="flex gap-2.5 text-slate-400 font-medium border-l-2 border-indigo-500/40 pl-3">
                          <div className="flex-1">
                            <p className="text-slate-300 text-[11px] leading-relaxed">{notif.text}</p>
                            <span className="text-[9px] text-slate-500 block mt-0.5">{notif.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel rounded-3xl p-8 border border-white/5 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-slate-800 pb-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-400 flex items-center justify-center shadow-lg relative">
                  <User className="w-10 h-10 text-indigo-400" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border border-slate-900 rounded-full"></span>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-lg font-bold text-white">{studentProfile.name}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{studentProfile.role}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{studentProfile.university}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 text-xs text-left">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block mb-1">Academic Credentials</span>
                  <p className="text-slate-200 font-bold">Verified National B.Tech Candidate</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block mb-1">Grade Index (CGPA)</span>
                  <p className="text-emerald-400 font-black">{studentProfile.cgpa} / 10.0</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block mb-1">Account Identity Email</span>
                  <p className="text-slate-300">{studentProfile.email}</p>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block mb-1">Primary Domain Placement</span>
                  <p className="text-slate-300">{studentProfile.domain}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "resume" && (
            <motion.div key="resume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer relative flex flex-col justify-center items-center ${
                  isDragging
                    ? "border-cyan-400 bg-cyan-500/5 shadow-2xl"
                    : "border-slate-800 bg-slate-950/20 hover:border-slate-700"
                }`}
              >
                
                {isScanning ? (
                  <div className="space-y-4 w-full max-w-sm py-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500 flex items-center justify-center mx-auto animate-spin">
                      <RefreshCw className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">AI NLP Scanning & Feature Extraction...</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Analyzing keyword nodes and CGPA transcripts</p>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative">
                      <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                      {/* Scanning neon line */}
                      <span className="absolute inset-y-0 w-1/4 bg-white/40 skew-x-12 animate-pulse"></span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/5">
                      <FileUp className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Drag & Drop Transcript Resume</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Supports verified PDF, DOCX transcript records up to 10MB.
                      </p>
                    </div>
                    <div className="pt-2">
                      <label className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer border border-indigo-400/20">
                        Select File
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {resumeUploaded && (
                <div className="bg-slate-950/80 rounded-2xl border border-white/5 p-5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    <div>
                      <h5 className="font-bold text-slate-200">{studentProfile.resumeName}</h5>
                      <span className="text-[10px] text-slate-500 font-bold">Successfully Parsed by AI NLP Engine</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg uppercase text-[10px]">
                      ATS SECURED: {studentProfile.atsScore}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "analysis" && (
            <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between border-b border-slate-900 pb-3 mb-4 text-xs font-bold uppercase text-slate-400">
                  <span>Structural NLP Parsing Results</span>
                  <span className="text-indigo-400">Arjun_Sharma_Resume_2026.pdf</span>
                </div>

                <div className="space-y-6 text-left">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">Quantifiable Technical Focus</span>
                      <div className="flex flex-wrap gap-1.5">
                        {studentProfile.parsedSkills.map((sk, id) => (
                          <span key={id} className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">Identified Soft Talents</span>
                      <div className="flex flex-wrap gap-1.5">
                        {studentProfile.softSkills.map((sk, id) => (
                          <span key={id} className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-950/10 rounded-2xl border border-indigo-500/10 p-5 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Resume Strength Tips</h4>
                    <ul className="space-y-2 text-[11px] text-slate-400 font-medium">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>High ATS keyword density on quantitative skills (React, Python, SQL).</span>
                      </li>
                      <li className="flex gap-2 text-rose-400">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>Missing cloud infrastructure keys. Consider adding 'AWS Fundamentals' or 'Cloud Orchestration'.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Match Intelligence Breakdown</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">COSINE VECTOR ANALYSIS OF PROFILE SEGMENTS</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">Quantitative & Algorithmic Modeling</span>
                      <span className="text-indigo-400">92% match probability</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">Frontend Web Engineering Systems</span>
                      <span className="text-indigo-400">90% match probability</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: "90%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-300">Relational Database Core Queries</span>
                      <span className="text-indigo-400">80% match probability</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-rose-400">
                      <span>Cloud Systems Orchestration</span>
                      <span>25% match probability (Critical Gap)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500/40" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "internships" && (
            <motion.div key="internships" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Internship Comparison Tool overlay panel */}
              {compareIds.length > 0 && (
                <div className="bg-slate-950/80 rounded-2xl border border-indigo-500/20 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs">
                    <h4 className="font-bold text-white uppercase tracking-wider">Internship Comparison Hub</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      Selected: {compareIds.length} / 2 positions. {compareIds.length < 2 && "Select 1 more to execute comparison."}
                    </p>
                  </div>
                  {compareIds.length === 2 && (
                    <button
                      onClick={() => {
                        const it1 = MOCK_INTERNSHIPS.find(i => i.id === compareIds[0]);
                        const it2 = MOCK_INTERNSHIPS.find(i => i.id === compareIds[1]);
                        if (it1 && it2) {
                          alert(`Comparing:\n\n1. ${it1.title} (${it1.company}) - Stipend: ${it1.stipend}\n2. ${it2.title} (${it2.company}) - Stipend: ${it2.stipend}\n\nDecision factors:\n- Skill overlap: ${it1.overlapSkills.join(", ")} vs ${it2.overlapSkills.join(", ")}`);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10.5px] font-extrabold tracking-wider transition-colors cursor-pointer border border-indigo-500/30"
                    >
                      Compare Matrix Specifications
                    </button>
                  )}
                </div>
              )}

              {/* Internship Listing cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_INTERNSHIPS.map((item) => {
                  const isApplied = appliedIds.includes(item.id);
                  const isCompared = compareIds.includes(item.id);
                  return (
                    <div key={item.id} className="glass-panel rounded-3xl p-5 border border-white/5 flex flex-col justify-between space-y-4 hover:border-white/15 transition-all">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase block">{item.company}</span>
                            <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-cyan-400">{item.matchScore}% Match</span>
                            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded block mt-0.5 uppercase tracking-wider">{item.confidence} FIT</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed line-clamp-2">{item.description}</p>
                        
                        {/* Skills overlap metrics */}
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {item.requiredSkills.map((sk, idx) => {
                            const isMatched = studentProfile.parsedSkills.includes(sk);
                            return (
                              <span 
                                key={idx} 
                                className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                  isMatched
                                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                    : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                                }`}
                              >
                                {sk}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between gap-4">
                        <div className="text-[10px] text-slate-500">
                          <span className="font-bold text-slate-300 block">{item.stipend}</span>
                          <span>{item.duration} | {item.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCompareToggle(item.id)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              isCompared
                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {isCompared ? "Selected" : "Compare"}
                          </button>
                          
                          <button
                            onClick={() => handleApply(item.id)}
                            disabled={isApplied}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              isApplied
                                ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed border border-emerald-500/30 flex items-center gap-1"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/20"
                            }`}
                          >
                            {isApplied && <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>{isApplied ? "Applied" : "Apply Now"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "applications" && (
            <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between border-b border-slate-900 pb-3 mb-4 text-xs font-bold uppercase text-slate-400">
                  <span>My Active Placements</span>
                  <span>Total Submitted: {appliedIds.length}</span>
                </div>

                {appliedIds.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-white">No active applications</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Explore AI Recommendations and dispatch applications to see them in this workspace.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appliedIds.map((id) => {
                      const item = MOCK_INTERNSHIPS.find(i => i.id === id);
                      if (!item) return null;
                      return (
                        <div key={item.id} className="bg-slate-950/60 rounded-xl p-4 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[8px] text-slate-500 font-extrabold uppercase block">{item.company}</span>
                            <h5 className="font-bold text-slate-200 mt-0.5">{item.title}</h5>
                            <span className="text-[9px] text-indigo-400 font-bold block mt-0.5">{item.stipend}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              QUEUE VERIFIED
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="bg-indigo-950/20 border border-indigo-500/15 rounded-3xl p-6 space-y-4 cyber-neon-indigo">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white uppercase">Predictive Career Readiness Diagnostics</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Based on Nit-Trichy quantitative academic performance indicators and parsed web competencies, the AI core yields an 82% index score. You are highly positioned for systems design and development internships.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">Top Recruiter Alignment</span>
                    <p className="text-xs text-white font-bold">TATA (94%), Reliance (89%)</p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">Domain Match Level</span>
                    <p className="text-xs text-white font-bold">AI Product Core & Web Eng</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel rounded-3xl p-6 border border-white/5 max-w-md">
              <div className="space-y-4 text-xs text-left">
                <h4 className="font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-2">Diagnostic Settings</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">Automatic Resume Parsing Updates</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">Encrypted Academic Transcript API Hook</span>
                    <span className="text-indigo-400 font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-bold">Biometric-Ready JWT Verification</span>
                    <span className="text-indigo-400 font-bold">ACTIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
