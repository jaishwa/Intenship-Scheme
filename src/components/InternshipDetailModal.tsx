import { X, Building, MapPin, DollarSign, Clock, FileText, CheckCircle2 } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreRing from './MatchScoreRing';

interface InternshipDetailModalProps {
  internship: any;
  matchScore?: number;
  hasApplied?: boolean;
  onApply?: () => void;
  onClose: () => void;
}

export default function InternshipDetailModal({
  internship,
  matchScore,
  hasApplied,
  onApply,
  onClose
}: InternshipDetailModalProps) {
  if (!internship) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="flex gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              {internship.companies?.logo_url || internship.logo_url ? (
                <img src={internship.companies?.logo_url || internship.logo_url} alt={internship.companies?.name || internship.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building size={28} className="text-slate-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {internship.title}
              </h2>
              <p className="text-base font-semibold text-indigo-600 mt-1">
                {internship.companies?.name || internship.company_name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                <DollarSign size={20} className="text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Stipend</p>
                <p className="text-sm font-bold text-slate-800">INR {internship.stipend}/mo</p>
             </div>
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                <Clock size={20} className="text-indigo-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm font-bold text-slate-800">{internship.duration}</p>
             </div>
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                <MapPin size={20} className="text-rose-500 mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm font-bold text-slate-800">{internship.location || internship.companies?.location || 'Remote'}</p>
             </div>
             <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex flex-col items-center justify-center relative overflow-hidden">
                {matchScore !== undefined ? (
                  <>
                    <MatchScoreRing score={matchScore} size={48} />
                    <p className="text-xs font-bold text-indigo-600 mt-2">AI Match</p>
                  </>
                ) : (
                  <>
                    <FileText size={20} className="text-amber-500 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="text-sm font-bold text-slate-800 text-center">{internship.department}</p>
                  </>
                )}
             </div>
          </div>

          <div className="space-y-8">
            {/* Description */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <FileText size={20} className="text-indigo-500" />
                 About the Role
              </h3>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {internship.description || "No description provided for this role."}
              </div>
            </section>

            {/* About Company */}
            {internship.companies?.description && (
              <section>
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                   <Building size={20} className="text-indigo-500" />
                   About {internship.companies?.name || internship.company_name}
                </h3>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  {internship.companies.description}
                </div>
              </section>
            )}

            {/* Required Skills */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                 <CheckCircle2 size={20} className="text-emerald-500" />
                 Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(internship.required_skills || []).map((skill: string, idx: number) => (
                  <SkillBadge key={idx} skill={skill} variant="neutral" />
                ))}
                {(!internship.required_skills || internship.required_skills.length === 0) && (
                  <p className="text-sm text-slate-400 italic">No specific skills listed.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors"
          >
            Close
          </button>
          
          <button 
            onClick={hasApplied ? undefined : onApply}
            disabled={hasApplied}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              hasApplied 
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed border border-emerald-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl active:scale-95'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 size={20} /> Already Applied
              </>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
