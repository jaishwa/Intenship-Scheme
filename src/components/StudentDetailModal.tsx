import { useState, useEffect } from 'react';
import { X, Briefcase, GraduationCap, Phone, Mail, ExternalLink, Sparkles, CheckCircle, XCircle, AlertTriangle, Video } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { computeMatchScore, skillGap } from '../lib/aiMatcher';
import MatchScoreRing from './MatchScoreRing';
import SkillBadge from './SkillBadge';

interface StudentDetailModalProps {
  app: any;
  internship: any;
  onClose: () => void;
  onApprove: (appId: string) => Promise<void>;
  onReject: (appId: string) => Promise<void>;
}

export default function StudentDetailModal({ app, internship, onClose, onApprove, onReject }: StudentDetailModalProps) {
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);

  const student = app.students;
  const skills = student?.skills || [];
  const requiredSkills = internship?.required_skills || [];

  const matchScore = computeMatchScore(
    { skills, cgpa: parseFloat(student?.cgpa || '0'), department: student?.department || '', interests: skills },
    { required_skills: requiredSkills, department: internship?.department || '' }
  );

  const gaps = skillGap(
    { skills, cgpa: parseFloat(student?.cgpa || '0'), department: student?.department || '', interests: [] },
    { required_skills: requiredSkills, department: internship?.department || '' }
  );

  const strengths = skills.filter((s: string) =>
    requiredSkills.map((r: string) => r.toLowerCase()).includes(s.toLowerCase())
  );

  useEffect(() => {
    generateSummary();
  }, []);

  async function generateSummary() {
    setSummaryLoading(true);
    try {
      const prompt = `You are an AI recruiter assistant for FutureFit internship platform. 
Write a concise 2-3 sentence candidate summary for a recruiter about this student:

Name: ${student?.name}
Department: ${student?.department}
CGPA: ${student?.cgpa}
Skills: ${skills.join(', ')}
Internship Role: ${internship?.title}
Match Score: ${matchScore}%

Be professional, positive and highlight strengths and fit for the role. If CGPA is high mention it. Do not use bullet points.`;

      const response = await insforge.ai.chat.completions.create({
        model: 'deepseek/deepseek-v3.2',
        messages: [{ role: 'user', content: prompt }],
      });

      setSummary((response as any)?.choices?.[0]?.message?.content || 'Unable to generate summary.');
    } catch {
      setSummary('This candidate brings relevant skills and academic background that may suit this internship role.');
    } finally {
      setSummaryLoading(false);
    }
  }

  const handleApprove = async () => {
    setActionLoading('approve');
    await onApprove(app.id);
    setActionLoading(null);
    onClose();
  };

  const handleReject = async () => {
    setActionLoading('reject');
    await onReject(app.id);
    setActionLoading(null);
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Panel — slides in from right */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{student?.name}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{student?.college || 'Student'} · {student?.department}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Match Score + Quick Stats */}
          <div className="flex items-center gap-6 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50">
            <MatchScoreRing score={matchScore} size={90} />
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-slate-400 font-medium">CGPA</p>
                <p className="text-xl font-bold text-slate-800">{student?.cgpa}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-medium">Skills</p>
                <p className="text-xl font-bold text-slate-800">{skills.length}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 font-medium">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  app.status === 'accepted' || app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                  app.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{app.status}</span>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-indigo-500" />
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">AI Candidate Summary</h3>
            </div>
            {summaryLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-indigo-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-indigo-100 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-indigo-100 rounded animate-pulse w-4/6" />
              </div>
            ) : (
              <p className="text-slate-700 text-sm leading-relaxed">{summary}</p>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Mail size={18} className="text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{student?.email || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Phone size={18} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm font-semibold text-slate-700">{student?.phone || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <GraduationCap size={18} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">College</p>
                <p className="text-sm font-semibold text-slate-700">{student?.college || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Briefcase size={18} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Department</p>
                <p className="text-sm font-semibold text-slate-700">{student?.department || '—'}</p>
              </div>
            </div>
          </div>

          {/* Skills Analysis */}
          <div>
            <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Skill Analysis</h3>
            {strengths.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <p className="text-xs font-semibold text-emerald-600">Matching Skills</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {strengths.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {gaps.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <p className="text-xs font-semibold text-amber-600">Skill Gaps</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gaps.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* All skills */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">All Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s: string, i: number) => <SkillBadge key={i} skill={s} variant="neutral" />)}
              </div>
            </div>
          </div>

          {/* Resume */}
          {student?.resume_url && (
            <a
              href={student.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
            >
              <ExternalLink size={18} /> View Resume
            </a>
          )}
        </div>

        {/* Action Buttons */}
        {(app.status === 'applied' || app.status === 'shortlisted') && (
          <div className="p-6 border-t border-slate-100 flex gap-3">
            <button
              onClick={handleReject}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-rose-300 text-rose-600 font-bold hover:bg-rose-50 transition-all disabled:opacity-50"
            >
              <XCircle size={20} />
              {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
            </button>
            <button
              onClick={handleApprove}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <CheckCircle size={20} />
              {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
            </button>
          </div>
        )}

        {(app.status === 'approved' || app.status === 'accepted') && (
          <div className="p-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-bold text-emerald-700">Candidate Approved — Ready for Interview Scheduling</p>
            </div>
            <a
              href="/company/interview-desk"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all"
            >
              <Video size={18} />
              Go to Interview Desk
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
