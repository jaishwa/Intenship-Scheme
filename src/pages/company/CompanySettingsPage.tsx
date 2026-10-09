import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Shield, Bell, Key, Trash2, LogOut, User, Globe, Settings as SettingsIcon } from 'lucide-react';
import { useUser } from '../../lib/AuthContext';

export default function CompanySettingsPage() {
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    publicProfile: true,
    twoFactor: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
     window.location.href = '/login';
  };

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <SettingsIcon size={22} />
             </div>
             <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
          </div>
          <p className="text-slate-500 font-medium ml-13">Configure your workspace and management preferences</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-8">
           {/* Left Navigation Tabs (Visual only for now) */}
           <div className="space-y-1">
              {['Account', 'Security', 'Notifications', 'Team'].map((tab, i) => (
                <button 
                  key={tab} 
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* Main Content Areas */}
           <div className="md:col-span-3 space-y-8">
              {/* Account Overview */}
              <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <User size={18} className="text-indigo-500" /> Administrative Contact
                 </h2>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Login Email</p>
                          <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
                       </div>
                       <button className="text-xs font-bold text-indigo-600 hover:underline">Verify Identity</button>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account ID</p>
                          <p className="text-sm font-semibold text-slate-500 font-mono text-xs">{user?.id}</p>
                       </div>
                       <button className="text-xs font-bold text-slate-400">Copy</button>
                    </div>
                 </div>
              </section>

              {/* Security Preferences */}
              <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                 <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Shield size={18} className="text-emerald-500" /> Security Safeguards
                 </h2>
                 <div className="divide-y divide-slate-50">
                    {[
                      { id: 'twoFactor', label: '2-Step Verification', sub: 'Require a secondary code for sign-ins', icon: Key },
                      { id: 'publicProfile', label: 'External Visibility', sub: 'Allow candidate-side profile indexing', icon: Globe },
                      { id: 'emailNotifications', label: 'Real-time Alerts', sub: 'Email notifications for incoming applicants', icon: Bell },
                    ].map((item) => (
                      <div key={item.id} className="py-5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-400">
                               <item.icon size={18} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-700">{item.label}</p>
                               <p className="text-xs text-slate-400">{item.sub}</p>
                            </div>
                         </div>
                         <button 
                           onClick={() => toggleSetting(item.id as any)}
                           className={`w-12 h-6 rounded-full transition-colors relative ${settings[item.id as keyof typeof settings] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${settings[item.id as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                         </button>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Advanced Zone */}
              <section className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8">
                 <div className="flex items-start gap-5">
                    <div className="bg-white p-3 rounded-2xl border border-rose-100 text-rose-500 shadow-sm">
                       <Trash2 size={22} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-rose-900">Decommission Account</h3>
                       <p className="text-sm text-rose-700/70 mt-1 mb-6 max-w-lg">
                          This process will permanently erase all posted internships, candidate logs, and company metadata from the Smart Allocation Engine.
                       </p>
                       
                       {!showDeleteConfirm ? (
                          <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all hover:shadow-lg hover:shadow-rose-100 active:scale-95"
                          >
                             Request Deletion
                          </button>
                       ) : (
                          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
                             <button 
                               onClick={() => setShowDeleteConfirm(false)}
                               className="px-6 py-3 rounded-2xl border-2 border-rose-200 text-rose-700 font-bold text-sm hover:bg-white transition-all"
                             >
                                Abort
                             </button>
                             <button className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-200 hover:bg-rose-700">
                                Confirm Wipe Data
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
              </section>

              <div className="pt-6">
                 <button 
                   onClick={handleLogout}
                   className="w-full py-5 rounded-3xl border-2 border-slate-200 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 group"
                 >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    Terminate Current Session
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
