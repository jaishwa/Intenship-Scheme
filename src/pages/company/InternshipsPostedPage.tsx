import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import { Briefcase, Edit2, Trash2, Users, EyeOff, Eye, X, Save, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DURATIONS = ['1 Month', '2 Months', '3 Months', '6 Months'];
const TYPES = ['Remote', 'Hybrid', 'Onsite'];

export default function InternshipsPostedPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<any[]>([]);
  const [applicantCounts, setApplicantCounts] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, [user]);

  async function load() {
    if (!user) return;
    try {
      const { data: company } = await insforge.database.from('companies').select('*').eq('user_id', user.id).maybeSingle();
      if (!company) { setLoading(false); return; }

      const { data: interns } = await insforge.database
        .from('internships').select('*').eq('company_id', company.id).order('created_at', { ascending: false });
      setInternships(interns || []);

      // Count applicants per internship
      const counts: Record<string, number> = {};
      for (const i of (interns || [])) {
        const { data: apps } = await insforge.database.from('applications').select('id').eq('internship_id', i.id);
        counts[i.id] = (apps || []).length;
      }
      setApplicantCounts(counts);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const startEdit = (intern: any) => {
    setEditingId(intern.id);
    setEditForm({
      title: intern.title, domain: intern.domain, type: intern.type,
      duration: intern.duration, openings: intern.openings,
      location: intern.location, description: intern.description,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await insforge.database.from('internships').update(editForm).eq('id', editingId);
      setInternships(prev => prev.map(i => i.id === editingId ? { ...i, ...editForm } : i));
      setEditingId(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const toggleClose = async (id: string, currentStatus: boolean) => {
    await insforge.database.from('internships').update({ is_active: !currentStatus }).eq('id', id);
    setInternships(prev => prev.map(i => i.id === id ? { ...i, is_active: !currentStatus } : i));
  };

  const deleteInternship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship? This cannot be undone.')) return;
    await insforge.database.from('internships').delete().eq('id', id);
    setInternships(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-1">Company</p>
            <h1 className="text-3xl font-bold text-slate-800">Internships Posted</h1>
            <p className="text-slate-400 mt-1 text-sm">{internships.length} total internship{internships.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => navigate('/company/post')} className="btn-primary">
            + Post New
          </button>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-500">No internships yet</h3>
            <p className="text-slate-400 mb-6">Post your first internship to start finding AI-matched candidates.</p>
            <button onClick={() => navigate('/company/post')} className="btn-primary">Post Internship</button>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map(intern => (
              <div key={intern.id} className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden ${intern.is_active ? 'border-slate-100' : 'border-slate-200 opacity-75'}`}>

                {/* Edit Mode */}
                {editingId === intern.id ? (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-800">Editing Internship</h3>
                      <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Role Title</label>
                        <input className="input-field py-2" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Location</label>
                        <input className="input-field py-2" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                        <select className="input-field py-2" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                          {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Duration</label>
                        <select className="input-field py-2" value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })}>
                          {DURATIONS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Openings</label>
                        <input type="number" min={1} className="input-field py-2" value={editForm.openings} onChange={e => setEditForm({ ...editForm, openings: parseInt(e.target.value) || 1 })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                      <textarea className="input-field resize-none" rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setEditingId(null)} className="flex-1 py-2 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button onClick={saveEdit} disabled={saving} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2">
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-slate-800">{intern.title}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${intern.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {intern.is_active ? 'Active' : 'Closed'}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">{intern.domain} · {intern.type} · {intern.location}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(intern)}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleClose(intern.id, intern.is_active)}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 transition-all"
                          title={intern.is_active ? 'Close internship' : 'Reopen internship'}
                        >
                          {intern.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => deleteInternship(intern.id)}
                          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Users size={14} className="text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Applicants</p>
                          <p className="font-bold text-slate-800 text-sm">{applicantCounts[intern.id] || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Briefcase size={14} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Openings</p>
                          <p className="font-bold text-slate-800 text-sm">{intern.openings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <span className="text-[10px] font-bold">₹</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Stipend</p>
                          <p className="font-bold text-slate-800 text-sm">₹{intern.stipend || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                          <Clock size={14} className="text-violet-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Duration</p>
                          <p className="font-bold text-slate-800 text-sm">{intern.duration}</p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <button
                          onClick={() => navigate('/company/applicants')}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          View Applicants →
                        </button>
                      </div>
                    </div>

                    {/* Skills */}
                    {intern.required_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {intern.required_skills.slice(0, 6).map((s: string, i: number) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-600 font-medium border border-indigo-100">
                            {s}
                          </span>
                        ))}
                        {intern.required_skills.length > 6 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 font-medium">
                            +{intern.required_skills.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
