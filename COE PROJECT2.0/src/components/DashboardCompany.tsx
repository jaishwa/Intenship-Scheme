import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  BriefcaseBusiness,
  BarChart3,
  Layers,
  Calendar,
  ClipboardCheck,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sparkles,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Trophy,
  Zap,
  TrendingUp,
  Shield,
  Globe,
  Send,
  Video,
  User,
  Menu,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import type { Candidate, Company, PipelineStage, Interview, Assessment } from './MockData';
import {
  MOCK_CANDIDATES,
  MOCK_COMPANIES,
  PIPELINE_STAGES,
  MOCK_INTERVIEWS,
  MOCK_ASSESSMENTS,
  COMPANY_ANALYTICS_DATA,
  SKILL_DEMAND_DATA,
  MOCK_MESSAGES,
} from './MockData';

interface DashboardCompanyProps {
  onLogout: () => void;
  currentLang: string;
  translations: Record<string, string>;
}

const tabs = [
  'overview',
  'post',
  'applications',
  'ranking',
  'pipeline',
  'interviews',
  'assessments',
  'shortlisted',
  'analytics',
  'messages',
  'profile',
  'settings',
] as const;

type Tab = typeof tabs[number];

export default function DashboardCompany({ onLogout, currentLang, translations }: DashboardCompanyProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Helper components
  const MetricCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 shadow-lg shadow-indigo-500/20">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-semibold mt-1">{value}</p>
    </div>
  );

  const StatusBadge = ({ text, color }: { text: string; color: string }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} text-white`}>{text}</span>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="Applications Received" value={847} />
              <MetricCard label="AI Shortlisted" value={312} />
              <MetricCard label="Interviews Today" value={4} />
              <MetricCard label="Hired This Month" value={24} />
            </div>
            {/* Area chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={COMPANY_ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Mini candidate cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {MOCK_CANDIDATES.slice(0, 4).map((c) => (
                <div key={c.id} className="glass-panel rounded-xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    {c.name.split(' ')[0][0] + c.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">{c.name}</p>
                    <p className="text-slate-400 text-sm">Match {c.matchScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'post':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form className="glass-panel rounded-2xl p-6 space-y-4">
              <h2 className="text-white text-xl font-semibold mb-4">Create Internship Posting</h2>
              <div>
                <label className="block text-slate-300 mb-1">Job Title</label>
                <input type="text" className="w-full bg-slate-900/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Department</label>
                  <input type="text" className="w-full bg-slate-900/50 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Location</label>
                  <input type="text" className="w-full bg-slate-900/50 rounded px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Work Mode</label>
                  <select className="w-full bg-slate-900/50 rounded px-3 py-2">
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Duration (months)</label>
                  <input type="number" className="w-full bg-slate-900/50 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Stipend Range</label>
                  <input type="text" placeholder="e.g., 15k-25k" className="w-full bg-slate-900/50 rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Required Skills</label>
                {/* Simulated tag input – for brevity just a textarea */}
                <textarea rows={2} className="w-full bg-slate-900/50 rounded px-3 py-2" placeholder="Enter skills separated by commas" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea rows={4} className="w-full bg-slate-900/50 rounded px-3 py-2" />
              </div>
              <button
                type="button"
                onClick={() => alert('Internship posted successfully!')}
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
              >
                Post Internship
              </button>
            </form>
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-2">Live Preview</h3>
              <p className="text-slate-400">(Preview will appear here as you fill the form)</p>
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="glass-panel rounded-2xl p-4">
            <h2 className="text-white text-lg mb-4">All Applications</h2>
            <div className="flex items-center mb-3 space-x-2">
              <input placeholder="Filter by status" className="bg-slate-900/50 px-3 py-1 rounded text-sm" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-slate-800">
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Name / University</th>
                    <th className="px-4 py-2">Skills</th>
                    <th className="px-4 py-2">Match %</th>
                    <th className="px-4 py-2">ATS Score</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CANDIDATES.map((c, idx) => (
                    <tr key={c.id} className="border-b border-slate-700">
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2 flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">
                          {c.name.split(' ')[0][0] + c.name.split(' ')[1][0]}
                        </div>
                        <div>
                          <p>{c.name}</p>
                          <p className="text-slate-500 text-xs">{c.university}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {c.skills.map((s) => (
                          <span key={s} className="inline-block bg-indigo-600 text-xs px-2 py-0.5 rounded mr-1 mb-1">
                            {s}
                          </span>
                        ))}
                      </td>
                      <td className="px-4 py-2">{c.matchScore}%</td>
                      <td className="px-4 py-2">{c.atsScore}</td>
                      <td className="px-4 py-2">
                        {c.status === 'shortlisted' ? (
                          <StatusBadge text="Shortlisted" color="bg-green-600" />
                        ) : c.status === 'interview' ? (
                          <StatusBadge text="Interview" color="bg-blue-600" />
                        ) : (
                          <StatusBadge text="Applied" color="bg-gray-600" />
                        )}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button className="text-indigo-400 hover:text-indigo-300"><Eye size={16} /></button>
                        <button className="text-green-400 hover:text-green-300"><CheckCircle2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'ranking':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {MOCK_CANDIDATES.slice(0, 8).map((c, idx) => (
                <div key={c.id} className="glass-panel rounded-xl p-4 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx < 3 ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                    {idx + 1}
                  </div>
                  <p className="text-white mt-2 font-medium">{c.name}</p>
                  <p className="text-slate-400 text-sm">{c.university}</p>
                  <div className="my-2">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-700">
                        <div
                          style={{ width: `${c.matchScore}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white bg-indigo-600"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">Match {c.matchScore}%</p>
                  </div>
                  <div className="flex flex-wrap justify-center">
                    {c.skills.map((s) => (
                      <span key={s} className="bg-indigo-600 text-xs px-1.5 py-0.5 rounded mr-1 mb-1">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* BarChart of top 5 candidates */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CANDIDATES.slice(0, 5)}>
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="matchScore" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'pipeline':
        return (
          <div className="flex overflow-x-auto space-x-4 py-4">
            {PIPELINE_STAGES.map((stage) => {
              const stageCandidates = MOCK_CANDIDATES.filter((c) => c.status === stage.id);
              return (
                <div key={stage.id} className="min-w-[240px] glass-panel rounded-xl p-4 flex flex-col">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: stage.color }} />
                    {stage.label}
                  </h3>
                  <p className="text-slate-400 text-sm mb-2">{stageCandidates.length} candidates</p>
                  {stageCandidates.map((c) => (
                    <div key={c.id} className="flex items-center space-x-2 mb-2 p-2 bg-slate-900/60 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white">
                        {c.name.split(' ')[0][0]}
                      </div>
                      <span className="text-slate-300 text-sm truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        );
      case 'interviews':
        return (
          <div className="space-y-6">
            {MOCK_INTERVIEWS.map((i) => (
              <div key={i.id} className="glass-panel rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{i.candidateName}</p>
                    <p className="text-slate-400 text-sm">{i.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {i.status === 'live' && (
                    <span className="px-2 py-0.5 bg-green-600 text-xs rounded-full animate-pulse shadow-lg shadow-green-500/30">LIVE</span>
                  )}
                  {i.status === 'scheduled' && (
                    <span className="px-2 py-0.5 bg-blue-600 text-xs rounded-full">Scheduled</span>
                  )}
                  {i.status === 'completed' && (
                    <span className="px-2 py-0.5 bg-gray-600 text-xs rounded-full">Done</span>
                  )}
                  <button className="text-indigo-400 hover:text-indigo-300"><Play size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'assessments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_ASSESSMENTS.map((a) => (
              <div key={a.id} className="glass-panel rounded-xl p-4">
                <h4 className="text-white font-medium mb-1">{a.title}</h4>
                <p className="text-slate-400 text-sm mb-2">Type: {a.type}</p>
                <p className="text-slate-400 text-sm mb-2">Duration: {a.duration} mins</p>
                <p className="text-slate-400 text-sm mb-2">Questions: {a.questions}</p>
                <div className="flex justify-between items-center mt-2">
                  <button className="text-indigo-400 hover:text-indigo-300" onClick={() => alert('Start assessment: ' + a.title)}>
                    Start Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'shortlisted':
        return (
          <div className="glass-panel rounded-2xl p-4">
            <h2 className="text-white mb-4">Shortlisted Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_CANDIDATES.filter((c) => ['shortlisted', 'final_review', 'selected'].includes(c.status)).map((c) => (
                <div key={c.id} className="glass-panel rounded-xl p-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg">
                    {c.name.split(' ')[0][0]}
                  </div>
                  <p className="text-white mt-2 font-medium">{c.name}</p>
                  <p className="text-slate-400 text-sm">{c.university}</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="text-green-400 hover:text-green-300" onClick={() => alert('Offer sent to ' + c.name)}>
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="text-blue-400 hover:text-blue-300" onClick={() => alert('Schedule interview for ' + c.name)}>
                      <Calendar size={16} />
                    </button>
                    <button className="text-red-400 hover:text-red-300" onClick={() => alert('Rejected ' + c.name)}>
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Area chart applications trend */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={COMPANY_ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip />
                  <Area type="monotone" dataKey="applications" stroke="#f43f5e" fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Skill demand bar chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKILL_DEMAND_DATA}>
                  <XAxis dataKey="skill" stroke="#9ca3af" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="flex h-[70vh]">
            <div className="w-1/3 border-r border-slate-800 overflow-y-auto">
              {MOCK_MESSAGES.map((msg) => (
                <div key={msg.id} className="p-3 hover:bg-slate-800 cursor-pointer">
                  <p className="text-white font-medium">{msg.from}</p>
                  <p className="text-slate-400 text-sm truncate">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-2">
                {/* Placeholder for selected conversation */}
                <p className="text-slate-500">Select a conversation to view messages.</p>
              </div>
              <div className="flex space-x-2">
                <input placeholder="Type a message..." className="flex-1 bg-slate-900/50 rounded px-3 py-2 text-white" />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"><Send size={16} /></button>
              </div>
            </div>
          </div>
        );
      case 'profile':
        const company = MOCK_COMPANIES[0];
        return (
          <div className="glass-panel rounded-2xl p-6 mx-auto max-w-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {company.name.split(' ')[0][0]}
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">{company.name}</h2>
                <p className="text-slate-400 text-sm">{company.industry} • {company.size} employees • {company.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <p className="text-slate-300 text-sm">Active Postings</p>
                <p className="text-white font-medium">{company.activePostings}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-slate-300 text-sm">Total Hires</p>
                <p className="text-white font-medium">{company.totalHires}</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4">{company.description}</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">Edit Profile</button>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between glass-panel rounded-xl p-4">
              <span className="text-white">AI Auto-screening</span>
              <label className="inline-flex items-center">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-slate-300">ON</span>
              </label>
            </div>
            <div className="flex items-center justify-between glass-panel rounded-xl p-4">
              <span className="text-white">Interview Reminders</span>
              <label className="inline-flex items-center">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-indigo-600" />
                <span className="ml-2 text-slate-300">ON</span>
              </label>
            </div>
            <button onClick={onLogout} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
              Log Out
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] relative overflow-hidden">
      {/* Glowing background orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/4 top-1/4 w-80 h-80 bg-indigo-500 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-cyan-500 opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      {/* Sidebar */}
      <div className={`bg-slate-950/80 backdrop-blur-xl border-r border-white/5 transition-width duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          <span className="text-indigo-400 font-bold text-lg">FutureFit</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white">
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        <nav className="flex-1 mt-2 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center w-full px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${activeTab === tab ? 'bg-slate-700' : ''}`}
            >
              <span className="mr-3">
                {(() => {
                  switch (tab) {
                    case 'overview':
                      return <Layers size={18} />;
                    case 'post':
                      return <BriefcaseBusiness size={18} />;
                    case 'applications':
                      return <Users size={18} />;
                    case 'ranking':
                      return <Star size={18} />;
                    case 'pipeline':
                      return <BarChart3 size={18} />;
                    case 'interviews':
                      return <Video size={18} />;
                    case 'assessments':
                      return <ClipboardCheck size={18} />;
                    case 'shortlisted':
                      return <Trophy size={18} />;
                    case 'analytics':
                      return <TrendingUp size={18} />;
                    case 'messages':
                      return <MessageSquare size={18} />;
                    case 'profile':
                      return <User size={18} />;
                    case 'settings':
                      return <Settings size={18} />;
                    default:
                      return <Menu size={18} />;
                  }
                })()}
              </span>
              {sidebarOpen && <span className="text-slate-200 capitalize">{tab}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button onClick={onLogout} className="flex items-center w-full text-red-400 hover:text-red-300">
            <LogOut size={18} className="mr-2" />
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </div>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white capitalize">{activeTab} Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-indigo-400 font-medium">TCS VERIFIED</span>
            <Bell size={20} className="text-slate-400 hover:text-white cursor-pointer" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
