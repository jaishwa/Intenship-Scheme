import { CheckCircle, XCircle, FileText, Bookmark } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreRing from './MatchScoreRing';

export interface Applicant {
  id: string; // application id
  student_id: string;
  name: string;
  cgpa: number;
  department: string;
  skills: string[];
  resume_url: string;
  match_score: number;
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected';
}

interface ApplicantCardProps {
  applicant: Applicant;
  onShortlist?: (id: string) => void;
  onReject?: (id: string) => void;
  onAccept?: (id: string) => void;
}

export default function ApplicantCard({ applicant, onShortlist, onReject, onAccept }: ApplicantCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Status Ribbon */}
      {applicant.status !== 'applied' && (
        <div className={`absolute top-4 right-[-32px] rotate-45 px-10 py-1 text-xs font-bold text-white shadow-sm
          ${applicant.status === 'shortlisted' ? 'bg-amber-500' : ''}
          ${applicant.status === 'accepted' ? 'bg-emerald-500' : ''}
          ${applicant.status === 'rejected' ? 'bg-rose-500' : ''}
        `}>
          {applicant.status.toUpperCase()}
        </div>
      )}

      <div className="flex gap-6">
        <div className="shrink-0 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-2xl font-bold border-2 border-white shadow-sm">
            {applicant.name.charAt(0).toUpperCase()}
          </div>
          <MatchScoreRing score={applicant.match_score} size={60} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{applicant.name}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {applicant.department} • {applicant.cgpa} CGPA
              </p>
            </div>
            
            <a 
              href={applicant.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <FileText size={16} />
              Resume
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {applicant.skills.map((skill, index) => (
              <SkillBadge key={index} skill={skill} variant="neutral" />
            ))}
          </div>

          {applicant.status === 'applied' && (
            <div className="mt-5 flex gap-3">
              <button 
                onClick={() => onShortlist?.(applicant.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-amber-400 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 hover:border-amber-500 transition-all"
              >
                <Bookmark size={18} />
                Shortlist
              </button>
              <button 
                onClick={() => onAccept?.(applicant.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <CheckCircle size={18} />
                Accept
              </button>
              <button 
                onClick={() => onReject?.(applicant.id)}
                className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium"
              >
                <XCircle size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
