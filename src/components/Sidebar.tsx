import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, UserCircle, ClipboardList, Sparkles, Video } from 'lucide-react';

interface SidebarProps {
  role: 'student' | 'company';
}

export default function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  const studentLinks = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'AI Recommendation', path: '/student/ai-recommendation', icon: Sparkles },
    { label: 'Internships', path: '/student/internships', icon: Briefcase },
    { label: 'Application', path: '/student/applications', icon: FileText },
    { label: 'Interview Desk', path: '/student/interview-desk', icon: Video },
    { label: 'Profile', path: '/student/profile', icon: UserCircle },
    { label: 'Setting', path: '/student/settings', icon: Settings },
  ];

  const companyLinks = [
    { label: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { label: 'Post Role', path: '/company/post', icon: Briefcase },
    { label: 'Application', path: '/company/applicants', icon: Users },
    { label: 'My Listings', path: '/company/internships', icon: ClipboardList },
    { label: 'Interview Desk', path: '/company/interview-desk', icon: Video },
    { label: 'Profile', path: '/company/profile', icon: UserCircle },
    { label: 'Setting', path: '/company/settings', icon: Settings },
  ];

  const links = role === 'student' ? studentLinks : companyLinks;

  return (
    <aside className="w-72 h-[calc(100vh-80px)] border-r border-slate-100 flex flex-col p-6 bg-white sticky top-[80px] z-40">
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' 
                : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 font-medium'
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon size={20} />
              </div>
              <span className="text-sm tracking-tight">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 bg-slate-50 rounded-3xl border border-slate-100">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support</p>
         <button className="w-full text-left text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
           Help Center
         </button>
      </div>
    </aside>
  );
}
