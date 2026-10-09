import { CheckCircle2, Clock, Mail, Briefcase, Sparkles } from 'lucide-react';

interface ApplicationStatusTrackerProps {
  status: 'applied' | 'shortlisted' | 'approved' | 'rejected' | 'accepted';
  companyName: string;
  role: string;
  date: string;
}

export default function ApplicationStatusTracker({ status, companyName, role, date }: ApplicationStatusTrackerProps) {
  const steps = [
    { id: 'applied', label: 'Applied', icon: Briefcase },
    { id: 'review', label: 'AI Matching', icon: Sparkles },
    { id: 'selection', label: 'Company Review', icon: Clock },
    { id: 'result', label: 'Final Result', icon: CheckCircle2 },
  ];

  const getStepStatus = (index: number) => {
    if (status === 'rejected') {
       if (index < 3) return 'completed';
       return 'failed';
    }
    if (status === 'approved' || status === 'accepted') return 'completed';
    
    if (status === 'applied') {
        if (index === 0) return 'completed';
        if (index === 1) return 'completed'; // AI Matching is instant
        if (index === 2) return 'current';
        return 'pending';
    }
    
    // Add other cases if needed
    return 'pending';
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="font-bold text-slate-800 text-lg">{role}</h4>
          <p className="text-slate-500 text-sm font-medium">{companyName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied on</p>
          <p className="text-xs font-bold text-slate-600">{new Date(date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="relative flex justify-between items-center px-2">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 -z-0 transition-all duration-1000" 
          style={{ width: status === 'approved' || status === 'accepted' ? '100%' : '66%' }}
        />

        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(idx);
          const Icon = step.icon;
          
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                stepStatus === 'completed' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' :
                stepStatus === 'current' ? 'bg-white border-indigo-500 text-indigo-600 animate-pulse' :
                stepStatus === 'failed' ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100' :
                'bg-white border-slate-200 text-slate-300'
              }`}>
                {stepStatus === 'completed' && idx === 3 ? <CheckCircle2 size={20} /> : <Icon size={18} />}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                stepStatus === 'completed' || stepStatus === 'current' ? 'text-indigo-600' :
                stepStatus === 'failed' ? 'text-rose-500' : 'text-slate-400'
              }`}>
                {stepStatus === 'failed' && idx === 3 ? 'Rejected' : step.label}
              </span>
            </div>
          );
        })}
      </div>

      {(status === 'approved' || status === 'accepted') && (
        <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 animate-bounce-subtle">
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
             <Mail size={20} />
           </div>
           <div>
             <p className="text-sm font-bold text-emerald-800">You're Selected! 🎉</p>
             <p className="text-xs text-emerald-600">Check your email for instructions.</p>
           </div>
        </div>
      )}
    </div>
  );
}
