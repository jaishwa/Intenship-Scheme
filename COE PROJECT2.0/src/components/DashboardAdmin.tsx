import React, { useState } from "react";
import { 
  Users, BarChart3, Settings, Shield, Award, HelpCircle, LogOut, ChevronLeft, ChevronRight, Bell, Sparkles, 
  Cpu, Play, Download, Search, Edit2, CheckCircle2, ShieldCheck, Database, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, Legend, Cell 
} from "recharts";
import { 
  MOCK_ADMIN_STATS, MODEL_TRAINING_EPOCHS, DEMAND_TRENDS, DEPARTMENT_ALLOCATIONS, TRANSLATIONS 
} from "./MockData";

interface DashboardAdminProps {
  onLogout: () => void;
  currentLang: string;
  translations: Record<string, string>;
  adminRole: "admin" | "dept";
}

type AdminTab = "overview" | "engine" | "students" | "departments" | "analytics";

export default function DashboardAdmin({ onLogout, currentLang, translations, adminRole }: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // Allocation Batch Run Simulator State
  const [isAllocationRunning, setIsAllocationRunning] = useState(false);
  const [allocationProgress, setAllocationProgress] = useState(0);
  const [allocationComplete, setAllocationComplete] = useState(false);
  const [batchStats, setBatchStats] = useState({ matched: 0, pending: 854 });

  // Overrides list (simulated database table)
  const [allocations, setAllocations] = useState([
    { id: "S-1092", name: "Arjun Sharma", college: "NIT Trichy", company: "TATA Consultancy Services", dept: "MeitY", score: 94, status: "Verified" },
    { id: "S-1093", name: "Priya Patel", college: "IIT Bombay", company: "Reliance Digital Labs", dept: "Telecom", score: 89, status: "Verified" },
    { id: "S-1094", name: "Rohan Verma", college: "BITS Pilani", company: "Infosys Web Core", dept: "Skill Dev", score: 85, status: "Verified" },
    { id: "S-1095", name: "Neha Gupta", college: "Delhi University", company: "State Bank of India", dept: "Finance", score: 78, status: "Verified" },
    { id: "S-1096", name: "Kabir Singh", college: "VIT Vellore", company: "Adani Logistics Group", dept: "Logistics", score: 74, status: "Verified" },
    { id: "S-1097", name: "Ananya Rao", college: "IIT Madras", company: "Wipro Technologies", dept: "MeitY", score: 60, status: "Auxiliary Training" }
  ]);

  const triggerAllocationEngine = () => {
    setIsAllocationRunning(true);
    setAllocationProgress(0);
    setAllocationComplete(false);

    const interval = setInterval(() => {
      setAllocationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAllocationRunning(false);
            setAllocationComplete(true);
            setBatchStats({ matched: 854, pending: 0 });
            // Highlight table updates
            setAllocations(prevAlloc => 
              prevAlloc.map(item => ({ ...item, status: "Verified" }))
            );
            alert("National Smart Allocation Engine finished batch matching! Dispatched 854 pending placements successfully.");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleManualOverride = (id: string) => {
    const newCompany = prompt("Enter replacement enterprise partner for relocation override:");
    if (!newCompany) return;
    
    setAllocations(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, company: newCompany, score: 95, status: "Manual Override" }
          : item
      )
    );
    alert(`Placement override successful! Relocated ${id} to ${newCompany}.`);
  };

  const handleExportCSV = () => {
    alert("Compiling secure data matrix...\n\nCSV successfully dispatched to your secure download directory (futurefit_allocations_2026.csv).");
  };

  // Filtered allocations list based on search and department select
  const filteredAllocations = allocations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === "All" || item.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  const t = translations;

  const sidebarItems = [
    { id: "overview", label: t.overview || "Overview", icon: Layers },
    { id: "engine", label: "Allocation Engine", icon: Cpu },
    { id: "students", label: t.manualOverride || "Override Table", icon: Database },
    { id: "analytics", label: "Business Intel", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex relative overflow-hidden bg-[#030712]">
      
      {/* Background Neon Rings */}
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
              <span className="font-extrabold text-sm tracking-wider text-white">FutureFit Admin</span>
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
          <div className="p-4 mx-4 my-4 bg-indigo-950/20 rounded-2xl border border-indigo-500/15 text-left">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Secure Access Token</p>
            </div>
            <h4 className="text-xs font-bold text-white truncate mt-0.5">
              {adminRole === "admin" ? "National Scheme Director" : "MeitY Coordinator"}
            </h4>
            <p className="text-[9px] text-slate-500 truncate">Ministry of Skill Development</p>
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
                onClick={() => setActiveTab(item.id as AdminTab)}
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
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
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
            <h2 className="text-xl font-black text-white capitalize">{activeTab === "overview" ? "Administrative Overview" : `${activeTab} Console`}</h2>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              Secure Level-1 Ministry Allocation Terminal
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-[10px] text-indigo-400 font-extrabold">
              <Shield className="w-3.5 h-3.5" />
              <span>ROLE: OFFICIAL ADVISOR</span>
            </div>

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
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Stat Metric Widget Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.totalStudents || "Total Enrolled Students"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">
                      {MOCK_ADMIN_STATS.totalStudents.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Verified</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500 w-[85%]"></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.matchAccuracy || "Engine Accuracy"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">
                      {MOCK_ADMIN_STATS.matchAccuracy}%
                    </span>
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Hyper Stable</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-cyan-400" style={{ width: `${MOCK_ADMIN_STATS.matchAccuracy}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.allocationRate || "Successful Allocation Rate"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">
                      {MOCK_ADMIN_STATS.allocationSuccessRate}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Target Met</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-emerald-400" style={{ width: `${MOCK_ADMIN_STATS.allocationSuccessRate}%` }}></div>
                  </div>
                </div>

                <div className="glass-panel rounded-2xl p-5 border border-white/5 relative">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block mb-1">
                    {t.activePositions || "Active Placements"}
                  </span>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-white">
                      {MOCK_ADMIN_STATS.activeInternships.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active PL</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-indigo-500 w-[95%]"></div>
                  </div>
                </div>
              </div>

              {/* Grid split for visuals */}
              <div className="grid lg:grid-cols-12 gap-6">
                
                {/* AI Diagnostics Accuracy Area Curve */}
                <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.modelStatus || "AI Model Diagnostics"}</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{t.accuracyCurve || "Accuracy Curve Across Epochs"}</p>
                  </div>
                  
                  {/* Recharts Area Container */}
                  <div className="h-[220px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MODEL_TRAINING_EPOCHS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="accuracy" stroke="#6366f1" fillOpacity={1} fill="url(#colorAcc)" name="Training Acc" />
                        <Area type="monotone" dataKey="valAccuracy" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVal)" name="Validation Acc" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live batch matching queue controls */}
                <div className="lg:col-span-4 space-y-6">
                  
                  <div className="bg-indigo-950/20 rounded-3xl border border-indigo-500/15 p-6 space-y-4 cyber-neon-indigo">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white uppercase">{t.triggerRun || "Trigger AI Allocation Engine"}</h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Unallocated Candidates:</span>
                        <span className="text-white font-bold">{batchStats.pending}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Batch Match Integrity:</span>
                        <span className="text-emerald-400 font-bold">98.4%</span>
                      </div>
                    </div>

                    {isAllocationRunning ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-cyan-400">
                          <span>Processing allocations...</span>
                          <span>{allocationProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative">
                          <div className="h-full bg-cyan-400" style={{ width: `${allocationProgress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={triggerAllocationEngine}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-400/20"
                      >
                        <Play className="w-4 h-4 text-cyan-300" />
                        <span>Run Allocation Run</span>
                      </button>
                    )}
                  </div>

                  <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-3.5 text-xs text-slate-400 font-medium">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block border-b border-slate-900 pb-2">
                      Department Allocation Capacity
                    </span>
                    <div className="space-y-3">
                      {DEPARTMENT_ALLOCATIONS.map((dept, idx) => {
                        const percent = Math.round((dept.allocated / dept.capacity) * 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-300 font-bold">{dept.name} Placements</span>
                              <span>{dept.allocated} / {dept.capacity} ({percent}%)</span>
                            </div>
                            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "engine" && (
            <motion.div key="engine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/5 text-center py-12 max-w-lg space-y-4">
                <Cpu className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Matching Neural Core Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  This administrative module executes high-density cosine distance operations across 25,000 resumes. Demographics are completely anonymized to prevent pipeline matching bias.
                </p>
                <div className="pt-2">
                  <button
                    onClick={triggerAllocationEngine}
                    disabled={isAllocationRunning}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all border border-indigo-400/20"
                  >
                    Run Matrix Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Filters toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-950/60 rounded-2xl p-4 border border-white/5 text-xs">
                
                {/* Search */}
                <div className="relative w-full sm:max-w-xs flex items-center">
                  <span className="absolute left-3 text-slate-500"><Search className="w-4 h-4" /></span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search candidate name, college, company..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white transition-colors"
                  />
                </div>

                {/* Filter & Export */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 font-bold cursor-pointer"
                  >
                    <option value="All">All Departments</option>
                    <option value="MeitY">MeitY</option>
                    <option value="Telecom">Telecom</option>
                    <option value="Skill Dev">Skill Dev</option>
                    <option value="Finance">Finance</option>
                    <option value="Logistics">Logistics</option>
                  </select>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer border border-indigo-400/20 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.exportData || "Export Matrix"}</span>
                  </button>
                </div>
              </div>

              {/* Database Table */}
              <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-900 text-slate-500 font-extrabold uppercase tracking-wider">
                        <th className="p-4">ID</th>
                        <th className="p-4">Candidate</th>
                        <th className="p-4">Placement Partner</th>
                        <th className="p-4">Department</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4">Audit Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-semibold text-slate-300">
                      {filteredAllocations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 text-indigo-400 font-black">{item.id}</td>
                          <td className="p-4">
                            <span className="text-white font-bold block">{item.name}</span>
                            <span className="text-[10px] text-slate-500">{item.college}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-200">{item.company}</td>
                          <td className="p-4"><span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">{item.dept}</span></td>
                          <td className="p-4 text-center font-black text-cyan-400">{item.score}%</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              item.status === "Verified"
                                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleManualOverride(item.id)}
                              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              title="Manual Placement Relocate"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t.skillTrend || "National Talent Demand Trends"}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">COMPARING PLACEMENT AREAS BY MONTH (ACTIVE TICKERS)</p>
                </div>

                <div className="h-[250px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMAND_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }} />
                      <Legend />
                      <Bar dataKey="Machine Learning" fill="#6366f1" />
                      <Bar dataKey="Web Development" fill="#06b6d4" />
                      <Bar dataKey="Data Analytics" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
