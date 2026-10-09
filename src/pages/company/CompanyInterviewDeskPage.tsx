import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import {
  Video,
  Calendar,
  Plus,
  CheckCircle,
  Award,
  ExternalLink,
  Activity,
  Users
} from 'lucide-react';

export default function CompanyInterviewDeskPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [companyDoc, setCompanyDoc] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  
  // Schedule Form State
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewType, setInterviewType] = useState('Technical Interview');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/abc-defg-hij');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Evaluation State
  const [evaluatingIntvId, setEvaluatingIntvId] = useState<string | null>(null);
  const [evalScore, setEvalScore] = useState(85);
  const [evalFeedback, setEvalFeedback] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        // 1. Fetch Company profile
        const { data: company } = await insforge.database
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setCompanyDoc(company);

        if (!company) {
          setLoading(false);
          return;
        }

        // 2. Fetch company's internships
        const { data: internships } = await insforge.database
          .from('internships')
          .select('id, title')
          .eq('company_id', company.id);

        const internshipIds = (internships || []).map((i: any) => i.id);

        // 3. Fetch applicants for scheduling dropdown
        if (internshipIds.length > 0) {
          const { data: apps } = await insforge.database
            .from('applications')
            .select(`
              id,
              status,
              student_id,
              internship_id,
              students:student_id (
                id,
                name,
                user_id,
                email
              ),
              internships:internship_id (
                title
              )
            `)
            .in('internship_id', internshipIds);
          
          setApplicants(apps || []);
        }

        // 4. Fetch all interviews
        const { data: allIntvs } = await insforge.database
          .from('interviews')
          .select('*');

        // Filter interviews matching this company
        const filtered = (allIntvs || []).filter((i: any) => 
          i.company_id === company.id || i.companyName === company.name
        );
        setInterviews(filtered);

      } catch (err) {
        console.error('Error loading company interview desk data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Handle Schedule Submit
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!selectedAppId || !date || !time || !meetUrl) {
      setFormError('Please fill in all scheduling fields.');
      return;
    }

    const app = applicants.find(a => a.id === selectedAppId);
    if (!app || !app.students) {
      setFormError('Could not locate student profile.');
      return;
    }

    try {
      const newInterview = {
        company_id: companyDoc.id,
        user_id: app.students.user_id, // Student's Auth user ID so they see it
        companyName: companyDoc.name,
        roleTitle: app.internships.title,
        date: new Date(date).toLocaleDateString(),
        time,
        type: interviewType,
        status: 'scheduled',
        url: meetUrl
      };

      const { data, error } = await insforge.database
        .from('interviews')
        .insert(newInterview);

      if (error) throw error;

      // Refresh list
      setInterviews(prev => [...prev, Array.isArray(data) ? data[0] : data]);
      setFormSuccess(true);
      setSelectedAppId('');
      setDate('');
      setTime('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to schedule interview.');
    }
  };

  // Submit Evaluation
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingIntvId || !evalFeedback.trim()) return;

    try {
      // Fetch selected interview to preserve other fields
      const intv = interviews.find(i => i.id === evaluatingIntvId);
      if (!intv) return;

      const updated = {
        ...intv,
        status: 'completed',
        score: evalScore,
        feedback: evalFeedback
      };

      const { error } = await insforge.database
        .from('interviews')
        .upsert(updated, { onConflict: 'id' });

      if (error) throw error;

      // Update local state
      setInterviews(prev => prev.map(i => i.id === evaluatingIntvId ? updated : i));
      setEvaluatingIntvId(null);
      setEvalFeedback('');
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
    }
  };

  const scheduledList = interviews.filter(i => i.status === 'scheduled');
  const completedList = interviews.filter(i => i.status === 'completed');

  // Approved candidates who are awaiting interview scheduling
  const approvedAwaitingSchedule = applicants.filter(app => {
    const isApproved = app.status === 'approved' || app.status === 'accepted' || app.status === 'shortlisted';
    if (!isApproved) return false;
    
    // Check if there is already a scheduled interview for this student and role
    const hasScheduled = interviews.some(i => 
      i.user_id === app.students?.user_id && 
      i.roleTitle === app.internships?.title && 
      i.status === 'scheduled'
    );
    return !hasScheduled;
  });

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Video className="text-indigo-500" size={18} />
            <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">
              Candidate Selection Desk
            </p>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Interview Desk</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            Schedule live assessments and grade performances for applicants in the PM Scheme.
          </p>
        </header>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
        ) : !companyDoc ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-8 rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-2">Complete Profile First</h3>
            <p className="text-amber-700">Setup your company details to enable candidate scheduling capabilities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left/Middle: Live Lists */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Upcoming Rounds</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{scheduledList.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Completed Evaluations</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">{completedList.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle size={18} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Avg score given</p>
                    <p className="text-2xl font-black text-slate-800 mt-1">
                      {completedList.length > 0 
                        ? `${Math.round(completedList.reduce((a, b) => a + (b.score || 0), 0) / completedList.length)}%`
                        : '—'
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Award size={18} />
                  </div>
                </div>
              </div>

              {/* Lists Sections */}
              <div className="space-y-6">
                {/* Approved Candidates Awaiting Scheduling */}
                <div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Approved Candidates (Awaiting Scheduling)</h3>
                  {approvedAwaitingSchedule.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                      <Users className="mx-auto mb-2 opacity-30 text-indigo-600" size={24} />
                      <p className="text-xs font-bold">No approved candidates awaiting scheduling</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Approve applicants from the Application tab first.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {approvedAwaitingSchedule.map(app => (
                        <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <Users size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{app.students?.name}</span>
                                <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                  Approved
                                </span>
                              </div>
                              <h4 className="text-xs font-semibold text-slate-500 mt-1">
                                Applied for: <span className="font-bold text-slate-700">{app.internships?.title}</span>
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedAppId(app.id);
                                const formEl = document.getElementById('schedule-form-container');
                                if (formEl) {
                                  formEl.scrollIntoView({ behavior: 'smooth' });
                                }
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase transition-colors shadow-sm"
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Upcoming Interviews</h3>
                  {scheduledList.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                      <Calendar className="mx-auto mb-2 opacity-30 text-indigo-600" size={24} />
                      <p className="text-xs font-bold">No interviews scheduled yet</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Use the scheduling panel to set up rounds.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scheduledList.map(intv => (
                        <div key={intv.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                              <Video size={20} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {intv.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{intv.date} · {intv.time}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-700 mt-1">{intv.roleTitle}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setEvaluatingIntvId(intv.id)}
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase transition-colors"
                            >
                              Grade / Complete
                            </button>
                            <a
                              href={intv.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                              title="Join Room"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Completed Assessments</h3>
                  {completedList.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                      <CheckCircle className="mx-auto mb-2 opacity-30 text-emerald-500" size={24} />
                      <p className="text-xs font-bold">No completed rounds yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedList.map(intv => (
                        <div key={intv.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle size={20} />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {intv.type}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">Completed on {intv.date}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-700">{intv.roleTitle}</h4>
                              <p className="text-xs text-slate-400 font-semibold italic">"{intv.feedback}"</p>
                            </div>
                          </div>
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black">
                            Score: {intv.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right Panel: Schedule Form / Evaluation */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Form/Context Switching */}
              {evaluatingIntvId ? (
                // Evaluation Card
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">Record Grade</h3>
                    <button
                      onClick={() => setEvaluatingIntvId(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleSaveEvaluation} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Score (%)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={evalScore}
                          onChange={e => setEvalScore(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-sm font-black text-slate-700 whitespace-nowrap">{evalScore}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Comments</label>
                      <textarea
                        rows={4}
                        required
                        value={evalFeedback}
                        onChange={e => setEvalFeedback(e.target.value)}
                        placeholder="Highlight candidate's technical skills, performance levels, and fit for the scheme..."
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium resize-none bg-slate-50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
                    >
                      Submit Candidate Grade
                    </button>
                  </form>
                </div>
              ) : (
                // Schedule Round Card
                <div id="schedule-form-container" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-6 pb-2 border-b border-slate-50">
                    Schedule Round
                  </h3>
                  
                  {formSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-xl mb-4">
                      Round successfully scheduled! The student has been notified.
                    </div>
                  )}

                  {formError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-xl mb-4">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSchedule} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Select Candidate</label>
                      <select
                        value={selectedAppId}
                        onChange={e => setSelectedAppId(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium bg-slate-50"
                      >
                        <option value="">-- Choose Candidate --</option>
                        {applicants
                          .filter(a => a.status === 'approved' || a.status === 'accepted' || a.status === 'shortlisted')
                          .map(app => (
                            <option key={app.id} value={app.id}>
                              {app.students?.name} - {app.internships?.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Round Category</label>
                      <select
                        value={interviewType}
                        onChange={e => setInterviewType(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium bg-slate-50"
                      >
                        <option value="Technical Interview">Technical Interview</option>
                        <option value="System Design Round">System Design Round</option>
                        <option value="Behavioral Round">Behavioral Round</option>
                        <option value="HR / Culture Fit">HR / Culture Fit</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium bg-slate-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Time Slot</label>
                        <input
                          type="text"
                          value={time}
                          placeholder="e.g. 10:00 AM"
                          onChange={e => setTime(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Meeting Room URL</label>
                      <input
                        type="url"
                        value={meetUrl}
                        onChange={e => setMeetUrl(e.target.value)}
                        placeholder="Google Meet or Zoom Link"
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-xs font-medium bg-slate-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      <Plus size={14} /> Schedule Interview
                    </button>
                  </form>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-slate-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                <Activity className="text-emerald-400 mb-4 animate-pulse" size={24} />
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2">Scheme Standards</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                  Under the PM Scheme, selectees must undergo transparent evaluations. Recording diagnostic review scores on the dashboard coordinates directly with student matching criteria.
                </p>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
}
