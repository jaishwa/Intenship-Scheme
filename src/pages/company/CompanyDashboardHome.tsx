import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import { BarChart2, Briefcase, Users, CheckCircle, Clock, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  trend?: string;
}

function StatCard({ label, value, icon, color, bg, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-10 ${bg}`} />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} mb-4`}>
        <span className={color}>{icon}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      {trend && <p className="text-xs text-emerald-600 font-medium mt-2">{trend}</p>}
    </div>
  );
}

function MiniBarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg transition-all duration-500"
            style={{
              height: `${Math.max((d.count / max) * 100, 4)}%`,
              background: `linear-gradient(180deg, #4f46e5, #7c3aed)`,
              opacity: 0.7 + (i / data.length) * 0.3,
            }}
          />
          <span className="text-[10px] text-slate-400 truncate w-full text-center">{d.label.slice(0, 6)}</span>
        </div>
      ))}
    </div>
  );
}

export default function CompanyDashboardHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [stats, setStats] = useState({ internships: 0, applicants: 0, approved: 0, pending: 0 });
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [approvedApplicants, setApprovedApplicants] = useState<any[]>([]);
  const [internshipChartData, setInternshipChartData] = useState<{ label: string; count: number }[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        // Fetch company profile
        const { data: company } = await insforge.database
          .from('companies').select('*').eq('user_id', user.id).maybeSingle();
        setCompanyData(company);

        if (!company) { setLoading(false); return; }

        // Fetch internships
        const { data: internships } = await insforge.database
          .from('internships').select('id, title').eq('company_id', company.id);

        const internshipIds = (internships || []).map((i: any) => i.id);

        if (internshipIds.length === 0) {
          setStats({ internships: 0, applicants: 0, approved: 0, pending: 0 });
          setLoading(false);
          return;
        }

        // Fetch applications
        const { data: apps } = await insforge.database
          .from('applications')
          .select('id, status, match_score, applied_at, internship_id, students:student_id(name, department, cgpa)')
          .in('internship_id', internshipIds)
          .order('applied_at', { ascending: false });

        const appList = apps || [];
        const approved = appList.filter((a: any) => a.status === 'accepted' || a.status === 'approved').length;
        const pending = appList.filter((a: any) => a.status === 'applied').length;

        setStats({
          internships: internships?.length || 0,
          applicants: appList.length,
          approved,
          pending,
        });

        setRecentApplicants(appList.slice(0, 5));
        setApprovedApplicants(appList.filter((a: any) => a.status === 'accepted' || a.status === 'approved').slice(0, 5));

        // Chart data: applicant count per internship
        const chartData = (internships || []).map((intern: any) => ({
          label: intern.title,
          count: appList.filter((a: any) => a.internship_id === intern.id).length,
        }));
        setInternshipChartData(chartData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const statusColor = (s: string) => {
    if (s === 'accepted' || s === 'approved') return 'bg-emerald-100 text-emerald-700';
    if (s === 'rejected') return 'bg-rose-100 text-rose-700';
    return 'bg-amber-100 text-amber-700';
  };

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="text-indigo-500" size={16} />
              <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">
                AI-Based Smart Allocation Engine
              </p>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {loading ? 'Loading...' : companyData ? `${companyData.name} Dashboard` : 'Set Up Your Company'}
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">PM Internship Scheme Platform</p>
          </div>
          <button
            onClick={() => navigate('/company/post')}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus size={18} /> Post New Internship
          </button>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : !companyData ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-8 rounded-2xl text-center">
            <Briefcase size={40} className="mx-auto mb-3 text-amber-400" />
            <h3 className="text-xl font-bold mb-2">Complete Your Company Profile</h3>
            <p className="text-amber-700 mb-4">Set up your profile to start posting internships and finding AI-matched candidates.</p>
            <button onClick={() => navigate('/company/profile')} className="btn-primary">
              Complete Profile
            </button>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total Internships" value={stats.internships} icon={<Briefcase size={22} />} color="text-indigo-600" bg="bg-indigo-100" trend="Active listings" />
              <StatCard label="Total Applicants" value={stats.applicants} icon={<Users size={22} />} color="text-violet-600" bg="bg-violet-100" trend={`${stats.pending} pending review`} />
              <StatCard label="Approved Students" value={stats.approved} icon={<CheckCircle size={22} />} color="text-emerald-600" bg="bg-emerald-100" trend="Confirmed selections" />
              <StatCard label="Pending Review" value={stats.pending} icon={<Clock size={22} />} color="text-amber-600" bg="bg-amber-100" trend="Awaiting decision" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              {/* Bar Chart */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 size={20} className="text-indigo-500" />
                  <h2 className="text-lg font-bold text-slate-800">Applications per Internship</h2>
                </div>
                {internshipChartData.length > 0 ? (
                  <MiniBarChart data={internshipChartData} />
                ) : (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
                    No internship data yet
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-indigo-500" />
                  <h2 className="text-lg font-bold text-slate-800">Status Breakdown</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Pending', count: stats.pending, color: 'bg-amber-400', pct: stats.applicants ? Math.round((stats.pending / stats.applicants) * 100) : 0 },
                    { label: 'Approved', count: stats.approved, color: 'bg-emerald-400', pct: stats.applicants ? Math.round((stats.approved / stats.applicants) * 100) : 0 },
                    { label: 'Rejected', count: stats.applicants - stats.approved - stats.pending, color: 'bg-rose-400', pct: stats.applicants ? Math.round(((stats.applicants - stats.approved - stats.pending) / stats.applicants) * 100) : 0 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 font-medium">{item.label}</span>
                        <span className="text-slate-800 font-bold">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent & Approved Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applicants */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users size={20} className="text-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-800">Recent Applicants</h2>
                  </div>
                  <button onClick={() => navigate('/company/applicants')} className="text-sm text-indigo-600 font-semibold hover:underline">
                    View All →
                  </button>
                </div>
                {recentApplicants.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No applicants yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {recentApplicants.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between py-3 hover:bg-slate-50 rounded-xl px-3 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {app.students?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{app.students?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400">{app.students?.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-indigo-600">
                            {app.match_score}%
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Selections */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-emerald-500" />
                    <h2 className="text-lg font-bold text-slate-800">Approved Selections</h2>
                  </div>
                  <button onClick={() => navigate('/company/applicants')} className="text-sm text-indigo-600 font-semibold hover:underline">
                    Manage →
                  </button>
                </div>
                {approvedApplicants.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle size={32} className="mx-auto mb-2 opacity-40" />
                    <p>No approved candidates yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {approvedApplicants.map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between py-3 hover:bg-emerald-50/50 rounded-xl px-3 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
                            {app.students?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{app.students?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400">Approved for {app.match_score}% match</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-500 text-white shadow-sm shadow-emerald-100">
                            APPROVED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
