import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import Sidebar from '../components/Sidebar';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function StudentApplicationsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;
      try {
        const { data: studentDoc } = await insforge.database
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (studentDoc) {
          const { data: apps } = await insforge.database
            .from('applications')
            .select(`
              id, status, applied_at, match_score,
              internships:internship_id (
                title,
                location,
                type,
                companies:company_id (name, logo_url)
              )
            `)
            .eq('student_id', studentDoc.id)
            .order('applied_at', { ascending: false });

          setApplications(apps || []);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [user]);

  const filtered = applications.filter(app => {
    const matchesSearch = app.internships?.title?.toLowerCase().includes(search.toLowerCase()) || 
                          app.internships?.companies?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'accepted':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-100',
          icon: <CheckCircle2 size={16} />
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-100',
          icon: <XCircle size={16} />
        };
      case 'shortlisted':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-100',
          icon: <Sparkles size={16} />
        };
      default:
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-100',
          icon: <Clock size={16} />
        };
    }
  };

  return (
    <div className="flex bg-[#fcfcff] min-h-screen">
      <Sidebar role="student" />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="text-indigo-600" size={24} />
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Applications</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl">
            Track and manage all your internship applications in one place. Your progress within the PM Internship Scheme is monitored by our AI engine.
          </p>
        </header>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium bg-white"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            {['All', 'Applied', 'Shortlisted', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  statusFilter === status 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(app => {
              const style = getStatusStyle(app.status);
              return (
                <div 
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        {app.internships?.companies?.logo_url ? (
                          <img src={app.internships.companies.logo_url} alt="" className="w-10 h-10 object-contain" />
                        ) : (
                          <Briefcase className="text-slate-400" size={28} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                          {app.internships?.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <p className="font-semibold text-slate-600">{app.internships?.companies?.name}</p>
                          <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                          <p className="flex items-center gap-1 text-sm text-slate-400">
                            <MapPin size={14} /> {app.internships?.location}
                          </p>
                          <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                          <p className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                            <Clock size={14} /> Applied {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden lg:block mr-4">
                         <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">AI Match Score</p>
                         <div className="flex items-center justify-end gap-2">
                           <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${app.match_score}%` }} />
                           </div>
                           <span className="text-sm font-bold text-slate-700">{app.match_score}%</span>
                         </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${style.bg} ${style.text} border ${style.border}`}>
                        {style.icon}
                        {app.status?.toUpperCase()}
                      </div>
                      
                      <button className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No applications found</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
              You haven't applied to any internships yet, or your search filters are hiding them.
            </p>
            <a href="/student/internships" className="btn-primary inline-flex px-8 py-3.5 text-base gap-2 group">
              Start Exploring <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
