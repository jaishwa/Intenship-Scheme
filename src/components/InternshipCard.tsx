import { Building, MapPin, DollarSign, Clock } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreRing from './MatchScoreRing';

export interface Internship {
  id: string;
  title: string;
  company_name: string;
  logo_url: string;
  required_skills: string[];
  department: string;
  stipend: number;
  duration: string;
}

interface InternshipCardProps {
  internship: Internship;
  matchScore?: number;
  hasApplied?: boolean;
  onApply?: () => void;
  onViewDetails?: () => void;
}

export default function InternshipCard({ internship, matchScore, hasApplied, onApply, onViewDetails }: InternshipCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 items-start flex-1">
          <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            {internship.logo_url ? (
              <img src={internship.logo_url} alt={internship.company_name} className="w-full h-full object-cover" />
            ) : (
              <Building size={24} className="text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {internship.title}
            </h3>
            <p className="text-sm font-medium text-slate-500">{internship.company_name}</p>
          </div>
        </div>
        {matchScore !== undefined && (
          <div className="shrink-0" title="AI Match Score">
            <MatchScoreRing score={matchScore} size={64} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 mt-2">
        <div className="flex items-center gap-1.5">
          <DollarSign size={16} className="text-emerald-500" />
          <span>${internship.stipend}/mo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={16} className="text-indigo-500" />
          <span>{internship.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-rose-500" />
          <span>{internship.department}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {internship.required_skills.slice(0, 4).map((skill, index) => (
          <SkillBadge key={index} skill={skill} variant="neutral" />
        ))}
        {internship.required_skills.length > 4 && (
          <span className="text-xs font-medium text-slate-500 self-center">
            +{internship.required_skills.length - 4} more
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
        {onApply && (
          <button 
            onClick={hasApplied ? undefined : onApply} 
            disabled={hasApplied}
            className={`py-2.5 flex-1 text-sm transition-all duration-200 ${
              hasApplied 
                ? 'bg-slate-100 text-slate-400 font-bold cursor-not-allowed rounded-xl border border-slate-200' 
                : 'btn-primary bg-gradient-to-r hover:scale-[1.02]'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        )}
        <button 
          onClick={onViewDetails}
          className="btn-secondary py-2.5 flex-1 text-sm hover:scale-[1.02]"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
