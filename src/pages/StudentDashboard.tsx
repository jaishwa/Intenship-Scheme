import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import { computeMatchScore, StudentProfile, InternshipProfile } from '../lib/aiMatcher';
import Sidebar from '../components/Sidebar';
import InternshipCard from '../components/InternshipCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import InternshipDetailModal from '../components/InternshipDetailModal';
import { 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Trophy, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layout,
  Briefcase
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

function StatCard({ label, value, icon: Icon, color, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-5 ${color}`} />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-4xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [stats, setStats] = useState({ applied: 0, approved: 0, rejected: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [selectedInternship, setSelectedInternship] = useState<any>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        const { data: studentDoc } = await insforge.database
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (studentDoc) {
          const rawSkills = studentDoc.skills || [];
          const parsedSkills: string[] = Array.isArray(rawSkills)
            ? rawSkills.flatMap((s: string) =>
                s.includes(',') ? s.split(',').map((x: string) => x.trim()) : [s.trim()]
              )
            : typeof rawSkills === 'string'
            ? rawSkills.split(',').map((s: string) => s.trim())
            : [];

          const parsedDoc = {
            ...studentDoc,
            skills: parsedSkills
          };
          setStudentData(parsedDoc);
          
          const { data: apps } = await insforge.database
            .from('applications')
            .select(`
              id, status, applied_at, internship_id,
              internships:internship_id (
                title,
                companies:company_id (name)
              )
            `)
            .eq('student_id', studentDoc.id);

          const appList = apps || [];
          setStats({
            applied: appList.length,
            approved: appList.filter((a: any) => a.status === 'approved' || a.status === 'accepted').length,
            rejected: appList.filter((a: any) => a.status === 'rejected').length
          });
          setRecentApps(appList.slice(0, 3).sort((a: any, b: any) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()));
          setAppliedIds(new Set(appList.map((a: any) => a.internship_id)));

          const { data: internships } = await insforge.database
            .from('internships')
            .select(`
              *,
              companies:company_id (
                name,
                logo_url,
                description,
                location,
                industry
              )
            `)
            .eq('is_active', true);

          const studentProfile: StudentProfile = {
            skills: parsedSkills,
            cgpa: parseFloat(studentDoc.cgpa) || 0,
            department: studentDoc.department || '',
            interests: studentDoc.interests || []
          };

          const matches = (internships || []).map((int: any) => {
            const intProfile: InternshipProfile = {
              required_skills: int.required_skills || [],
              department: int.department || ''
            };
            const score = computeMatchScore(studentProfile, intProfile);
            return {
              ...int,
              company_name: int.companies?.name || 'Unknown',
              logo_url: int.companies?.logo_url || '',
              matchScore: score
            };
          })
          .sort((a: any, b: any) => b.matchScore - a.matchScore);

          setRecommendations(matches.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  async function handleApply(internship: any) {
    if (!studentData) return;
    try {
      if (appliedIds.has(internship.id)) return;

      const { error } = await insforge.database
        .from('applications')
        .insert({
          student_id: studentData.id,
          internship_id: internship.id,
          status: 'applied',
          match_score: internship.matchScore || 0,
          applied_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setAppliedIds(prev => new Set(prev).add(internship.id));
      setStats(prev => ({ ...prev, applied: prev.applied + 1 }));
      
      // Update recent apps locally
      const newApp = {
        id: Math.random().toString(),
        status: 'applied',
        applied_at: new Date().toISOString(),
        internship_id: internship.id,
        internships: {
          title: internship.title,
          companies: { name: internship.companies?.name }
        }
      };
      setRecentApps(prev => [newApp, ...prev].slice(0, 3));

    } catch (err) {
      console.error('Error applying:', err);
    }
  }

  return (
    <div className="flex bg-[#fcfcff] min-h-screen">
      <Sidebar role="student" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Match Enabled</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                {studentData ? `Hello, ${studentData.name.split(' ')[0]}!` : 'Dashboard'}
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Your career path is being optimized by the Smart Allocation Engine.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                   <Trophy size={24} />
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">AI Rank Score</p>
                   <p className="text-xl font-black text-slate-900">850</p>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <LoadingSkeleton />
        ) : !studentData ? (
          <div className="relative overflow-hidden bg-white p-16 rounded-[3rem] border border-slate-100 shadow-2xl text-center max-w-3xl mx-auto mt-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full -translate-y-48 translate-x-48 blur-3xl opacity-60" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-indigo-200">
                <BrainCircuit size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Activate Your AI Profile</h3>
              <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed max-w-xl mx-auto">
                Join the PM Internship Scheme by completing your academic profile. Our engine will then match you with the highest-tier opportunities.
              </p>
              <a href="/student/profile" className="btn-primary px-12 py-5 text-xl rounded-2xl shadow-xl hover:shadow-indigo-200 group">
                Let's Get Started <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="In Progress" value={stats.applied - stats.approved - stats.rejected} icon={Clock} color="bg-amber-500" gradient="bg-gradient-to-br from-amber-400 to-orange-500" />
              <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} color="bg-emerald-500" gradient="bg-gradient-to-br from-emerald-400 to-teal-500" />
              <StatCard label="Total Applications" value={stats.applied} icon={Briefcase} color="bg-indigo-500" gradient="bg-gradient-to-br from-indigo-500 to-blue-600" />
              <StatCard label="Match Ranking" value={142} icon={TrendingUp} color="bg-purple-500" gradient="bg-gradient-to-br from-purple-500 to-pink-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Recommendations */}
              <div className="xl:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                          <Layout size={24} />
                       </div>
                       <div>
                         <h2 className="text-3xl font-black text-slate-900 tracking-tight">Top AI Recommendations</h2>
                         <p className="text-slate-400 font-medium text-sm">Personalized roles matching your skill density index</p>
                       </div>
                    </div>
                    <a href="/student/ai-recommendation" className="text-indigo-600 font-black hover:text-indigo-700 flex items-center gap-2 group transition-colors">
                      Explore All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                  
                  {recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {recommendations.slice(0, 4).map(int => (
                        <InternshipCard 
                          key={int.id}
                          internship={int}
                          matchScore={int.matchScore}
                          hasApplied={appliedIds.has(int.id)}
                          onApply={() => handleApply(int)}
                          onViewDetails={() => setSelectedInternship(int)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-16 text-center rounded-[3rem] border border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Briefcase size={32} />
                      </div>
                      <p className="text-slate-500 font-bold text-xl mb-2">No active internships found</p>
                      <p className="text-slate-400 font-medium">We couldn't find any active internship opportunities at the moment. Please check back later.</p>
                    </div>
                  )}
                </section>
              </div>

              {/* Sidebar/Activity */}
              <div className="space-y-10">
                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-16 translate-x-16" />
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Clock size={24} className="text-indigo-500" />
                    Status Feed
                  </h3>
                  <div className="space-y-6">
                    {recentApps.length > 0 ? (
                      recentApps.map(app => (
                        <div key={app.id} className="relative pl-8 before:absolute before:left-[11px] before:top-8 before:bottom-0 before:w-0.5 before:bg-slate-100 last:before:hidden group">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                             app.status === 'approved' || app.status === 'accepted' ? 'bg-emerald-500' :
                             app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                          }`} />
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                              {app.internships?.title}
                            </p>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">{app.internships?.companies?.name}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest ${
                                app.status === 'approved' || app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {app.status}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
                                {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-slate-400 font-bold text-sm">No activity recorded yet.</p>
                      </div>
                    )}
                  </div>
                  <a href="/student/applications" className="block w-full text-center mt-10 py-4 rounded-2xl bg-slate-50 text-slate-600 font-black text-xs hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
                    View Application History
                  </a>
                </section>

                <section className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 group-hover:scale-125 transition-transform duration-1000" />
                   <div className="relative z-10">
                     <BrainCircuit size={40} className="mb-6 text-indigo-300 animate-pulse" />
                     <h3 className="text-2xl font-black mb-3">Matching Intelligence</h3>
                     <p className="text-indigo-100/80 text-sm font-medium mb-8 leading-relaxed">Our neural engine is analyzing your skill density across {studentData?.skills?.length || 0} core competencies to optimize your ranking.</p>
                     
                     <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-md border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Neural Hot-Skill</p>
                           <Sparkles size={14} className="text-yellow-400" />
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl border border-white/10">
                             #1
                           </div>
                           <p className="font-black text-xl tracking-tight uppercase">{studentData?.skills?.[0] || 'Unoptimized'}</p>
                        </div>
                     </div>
                   </div>
                </section>
              </div>
            </div>

            {selectedInternship && (
              <InternshipDetailModal
                internship={selectedInternship}
                matchScore={selectedInternship.matchScore}
                hasApplied={appliedIds.has(selectedInternship.id)}
                onClose={() => setSelectedInternship(null)}
                onApply={() => { handleApply(selectedInternship); setSelectedInternship(null); }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
