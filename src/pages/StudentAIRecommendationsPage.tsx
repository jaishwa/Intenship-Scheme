import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import { computeMatchScore, skillGap, StudentProfile, InternshipProfile } from '../lib/aiMatcher';
import Sidebar from '../components/Sidebar';
import InternshipDetailModal from '../components/InternshipDetailModal';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';

export default function StudentAIRecommendationsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'gaps'>('all');

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        // Fetch student doc
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

          // Fetch applications to see which ones are already applied
          const { data: apps } = await insforge.database
            .from('applications')
            .select('internship_id')
            .eq('student_id', studentDoc.id);

          const appIds = new Set<string>((apps || []).map((a: any) => a.internship_id as string));
          setAppliedIds(appIds);

          // Fetch internships (simple flat select — local DB doesn't support joins)
          const { data: internships } = await insforge.database
            .from('internships')
            .select('*')
            .eq('is_active', true);

          // Fetch all companies separately and build a lookup map
          const { data: companies } = await insforge.database
            .from('companies')
            .select('*');

          const companyMap: Record<string, any> = {};
          (companies || []).forEach((c: any) => {
            companyMap[c.id] = c;
          });


          const studentProfile: StudentProfile = {
            skills: parsedSkills,
            cgpa: parseFloat(studentDoc.cgpa) || 0,
            department: studentDoc.department || '',
            interests: studentDoc.interests || []
          };

          const enriched = (internships || []).map((int: any) => {
            const company = companyMap[int.company_id] || {};
            const intProfile: InternshipProfile = {
              required_skills: int.required_skills || [],
              department: int.department || ''
            };
            const score = computeMatchScore(studentProfile, intProfile);
            const gaps = skillGap(studentProfile, intProfile);

            return {
              ...int,
              company_name: company.name || 'Unknown Company',
              logo_url: company.logo_url || '',
              matchScore: score,
              gaps: gaps
            };
          })
          .sort((a: any, b: any) => b.matchScore - a.matchScore);

          setRecommendations(enriched);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    } catch (err) {
      console.error('Error applying:', err);
    }
  }

  // Filter recommendations based on activeTab
  const filteredRecommendations = recommendations.filter(item => {
    if (activeTab === 'high') return item.matchScore >= 80;
    if (activeTab === 'gaps') return item.gaps.length > 0;
    return true;
  });

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-500 border-emerald-500 bg-emerald-50/50';
    if (score >= 60) return 'text-amber-500 border-amber-500 bg-amber-50/50';
    if (score >= 40) return 'text-orange-500 border-orange-500 bg-orange-50/50';
    return 'text-rose-500 border-rose-500 bg-rose-50/50';
  };

  return (
    <div className="flex bg-[#fcfcff] min-h-screen">
      <Sidebar role="student" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Matching Active</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Smart Recommendations</h1>
              <p className="text-slate-500 font-medium text-lg">
                Discover internship roles aligned with your capabilities and bridge skill gaps instantly.
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="space-y-6">
            <div className="h-44 bg-white rounded-3xl animate-pulse border border-slate-100" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-60 bg-white rounded-3xl animate-pulse border border-slate-100" />
              ))}
            </div>
          </div>
        ) : !studentData ? (
          <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-xl text-center max-w-3xl mx-auto mt-12">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <Sparkles size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Profile Incomplete</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Please finalize your profile details first to allow the AI Match engine to run.
            </p>
            <a href="/student/profile" className="btn-primary px-8 py-3.5 rounded-xl">Complete Profile</a>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Score Analysis Panel */}
            <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-48 translate-x-48 blur-3xl pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black tracking-tight">Your Matching Profile</h2>
                  <div className="flex flex-wrap gap-2">
                    {studentData.skills?.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 rounded-xl bg-white/10 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                    {(!studentData.skills || studentData.skills.length === 0) && (
                      <span className="text-sm text-slate-400 italic">No skills registered yet</span>
                    )}
                  </div>
                  <p className="text-indigo-200/80 text-sm">
                    CGPA: <strong className="text-white">{studentData.cgpa}</strong> · Department: <strong className="text-white">{studentData.department || 'N/A'}</strong>
                  </p>
                </div>

                <div className="flex gap-6 justify-around lg:border-x lg:border-white/10 py-2">
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-300">Top Match Score</p>
                    <p className="text-5xl font-black text-white mt-1">{recommendations[0]?.matchScore || 0}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-300">Excellent Matches</p>
                    <p className="text-5xl font-black text-emerald-400 mt-1">
                      {recommendations.filter(r => r.matchScore >= 80).length}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-amber-400" size={20} />
                    <span className="text-sm font-bold text-slate-200">How matching works:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-indigo-200">
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> Skills similarity: 50%</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> CGPA target: 20%</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> Department: 10%</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-indigo-400" /> Interests overlap: 20%</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Recommendations' },
                  { id: 'high', label: 'Excellent Fit (80%+)' },
                  { id: 'gaps', label: 'With Skills Gaps' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredRecommendations.length} roles
              </span>
            </div>

            {/* Recommendation Cards */}
            {filteredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredRecommendations.map(int => {
                  const hasApplied = appliedIds.has(int.id);
                  return (
                    <div
                      key={int.id}
                      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                    >
                      <div>
                        {/* Top Meta info */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                              {int.logo_url ? (
                                <img src={int.logo_url} alt="" className="w-10 h-10 object-contain" />
                              ) : (
                                <Briefcase className="text-slate-300" size={24} />
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {int.company_name}
                              </span>
                              <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors uppercase mt-0.5">
                                {int.title}
                              </h3>
                            </div>
                          </div>

                          {/* Match Score Indicator */}
                          <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center font-black ${getScoreColorClass(int.matchScore)}`}>
                            <span className="text-xs font-bold text-slate-400 -mb-1">FIT</span>
                            <span className="text-lg">{int.matchScore}%</span>
                          </div>
                        </div>

                        {/* Description & Location */}
                        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed mb-4">
                          {int.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                          <span>{int.location}</span>
                          <span>·</span>
                          <span className="text-indigo-500 uppercase tracking-widest">{int.department}</span>
                        </div>

                        {/* Skills and Gaps */}
                        <div className="space-y-4 border-t border-slate-50 pt-4 mb-6">
                          <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Required Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {int.required_skills?.map((skill: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 text-slate-600 border border-slate-100 font-semibold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Skill Gap Analysis */}
                          {int.gaps.length > 0 ? (
                            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4">
                              <div className="flex items-center gap-2 mb-2 text-amber-800">
                                <AlertTriangle size={15} />
                                <span className="text-xs font-bold uppercase tracking-wide">AI Skill Gap Analysis</span>
                              </div>
                              <p className="text-xs text-amber-700/80 mb-3 font-semibold">
                                You need the following skills to reach a 100% match score:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {int.gaps.map((skill: string, idx: number) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-amber-500 text-white font-black uppercase tracking-wider">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between">
                                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">Recommended Resource:</span>
                                <a
                                  href={`https://www.youtube.com/results?search_query=learn+${encodeURIComponent(int.gaps[0])}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1"
                                >
                                  Learn {int.gaps[0]} <ArrowRight size={10} />
                                </a>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
                              <CheckCircle size={18} className="text-emerald-500" />
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wide">Excellent Skills Alignment!</p>
                                <p className="text-[11px] text-emerald-700/80 font-medium">You possess all critical competencies required for this role.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-3 pt-4 border-t border-slate-50">
                        <button
                          onClick={() => setSelectedInternship(int)}
                          className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleApply(int)}
                          disabled={hasApplied}
                          className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            hasApplied
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                          }`}
                        >
                          {hasApplied ? 'Applied' : 'Instant Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center shadow-sm">
                <p className="text-slate-400 font-bold text-lg">No recommended roles with a match score above 75% found.</p>
                <p className="text-slate-400 text-sm mt-1">Try expanding your skills or updating details on your profile page.</p>
                <a href="/student/profile" className="btn-primary mt-6 inline-flex px-8 py-3">Update Profile</a>
              </div>
            )}

            {/* Detail Modal */}
            {selectedInternship && (
              <InternshipDetailModal
                internship={selectedInternship}
                matchScore={selectedInternship.matchScore}
                hasApplied={appliedIds.has(selectedInternship.id)}
                onClose={() => setSelectedInternship(null)}
                onApply={() => {
                  handleApply(selectedInternship);
                  setSelectedInternship(null);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
