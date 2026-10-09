import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import MatchScoreRing from '../../components/MatchScoreRing';
import StudentDetailModal from '../../components/StudentDetailModal';
import { Users, Search, FileText, CheckCircle, XCircle, Video } from 'lucide-react';
import { computeMatchScore } from '../../lib/aiMatcher';

const FUNCTION_SLUG = 'send-email-notification';
const STATUS_FILTERS = ['All', 'Applied', 'Approved', 'Rejected'];

export default function ApplicantsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    load();
  }, [user]);

  async function load() {
    if (!user) return;
    try {
      const { data: company } = await insforge.database.from('companies').select('*').eq('user_id', user.id).maybeSingle();
      setCompanyData(company);
      if (!company) { setLoading(false); return; }

      const { data: interns } = await insforge.database.from('internships').select('*').eq('company_id', company.id);
      setInternships(interns || []);

      const internshipIds = (interns || []).map((i: any) => i.id);
      if (internshipIds.length === 0) { setLoading(false); return; }

      const { data: apps } = await insforge.database
        .from('applications')
        .select(`
          id, status, match_score, applied_at, internship_id,
          students:student_id (id, name, email, phone, college, department, cgpa, skills, resume_url)
        `)
        .in('internship_id', internshipIds)
        .order('match_score', { ascending: false });

      const enriched = (apps || []).map((app: any) => {
        const internship = (interns || []).find((i: any) => i.id === app.internship_id);
        const calcScore = computeMatchScore(
          {
            skills: app.students?.skills || [],
            cgpa: parseFloat(app.students?.cgpa || '0'),
            department: app.students?.department || '',
            interests: app.students?.skills || [],
          },
          {
            required_skills: internship?.required_skills || [],
            department: internship?.department || '',
          }
        );
        return { ...app, calc_score: calcScore, internship };
      });

      setApplicants(enriched);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (appId: string) => {
    try {
      await insforge.database.from('applications').update({ status: 'approved' }).eq('id', appId);
      const app = applicants.find(a => a.id === appId);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
      if (app && companyData) {
        await insforge.functions.invoke(FUNCTION_SLUG, {
          body: {
            studentEmail: app?.students?.email,
            studentName: app?.students?.name,
            action: 'approved',
            companyName: companyData?.name,
            role: app?.internship?.title,
          },
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleReject = async (appId: string) => {
    try {
      await insforge.database.from('applications').update({ status: 'rejected' }).eq('id', appId);
      const app = applicants.find(a => a.id === appId);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
      if (app && companyData) {
        await insforge.functions.invoke(FUNCTION_SLUG, {
          body: {
            studentEmail: app?.students?.email,
            studentName: app?.students?.name,
            action: 'rejected',
            companyName: companyData?.name,
            role: app?.internship?.title,
          },
        });
      }
    } catch (e) { console.error(e); }
  };

  const filtered = applicants.filter(app => {
    const matchSearch = !search ||
      app.students?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.students?.department?.toLowerCase().includes(search.toLowerCase()) ||
      app.students?.college?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Applied' && app.status === 'applied') ||
      (statusFilter === 'Approved' && (app.status === 'accepted' || app.status === 'approved')) ||
      (statusFilter === 'Rejected' && app.status === 'rejected');
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-1">Company</p>
          <h1 className="text-3xl font-bold text-slate-800">Applicants</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} across {internships.length} internship{internships.length !== 1 ? 's' : ''}
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-9 py-2.5"
              placeholder="Search by name, department, college..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  statusFilter === f ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No applicants found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filtered.map(app => (
              <div
                key={app.id}
                onClick={() => { setSelectedApp(app); setSelectedInternship(app.internship); }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer p-5 relative overflow-hidden"
              >
                {/* Status ribbon */}
                {app.status !== 'applied' && (
                  <div className={`absolute top-3 right-[-30px] rotate-45 px-10 py-0.5 text-[10px] font-bold text-white ${
                    app.status === 'approved' || app.status === 'accepted' ? 'bg-emerald-500' :
                    app.status === 'shortlisted' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}>
                    {app.status?.toUpperCase()}
                  </div>
                )}

                <div className="flex gap-4">
                  {/* Avatar + Score */}
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                      {app.students?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <MatchScoreRing score={app.calc_score} size={52} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between pr-8">
                      <div>
                        <h3 className="font-bold text-slate-800">{app.students?.name}</h3>
                        <p className="text-sm text-slate-400">{app.students?.college || 'College'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {app.students?.department} · CGPA {app.students?.cgpa}
                        </p>
                      </div>
                      <a
                        href={app.students?.resume_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <FileText size={13} /> CV
                      </a>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(app.students?.skills || []).slice(0, 4).map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 font-medium">
                          {skill}
                        </span>
                      ))}
                      {(app.students?.skills || []).length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium">
                          +{(app.students?.skills || []).length - 4}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-2 truncate max-w-[200px]">
                      Applied for: <span className="font-semibold text-slate-600">{app.internship?.title}</span>
                    </p>

                    {/* Quick Action Buttons */}
                    {app.status === 'applied' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(app.id); }}
                          className="flex-1 py-2 rounded-lg border border-rose-200 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(app.id); }}
                          className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      </div>
                    )}

                    {(app.status === 'approved' || app.status === 'accepted') && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <a
                          href="/company/interview-desk"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-1.5"
                        >
                          <Video size={14} /> Schedule Interview
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Detail Modal */}
        {selectedApp && (
          <StudentDetailModal
            app={selectedApp}
            internship={selectedInternship}
            onClose={() => setSelectedApp(null)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </main>
    </div>
  );
}
