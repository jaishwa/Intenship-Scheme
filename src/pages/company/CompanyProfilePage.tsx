import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import { Save, Building2, Globe, MapPin, FileText, Cpu, CheckCircle2, Upload } from 'lucide-react';

const INDUSTRIES = ['Software Technology', 'Data Analytics', 'FinTech', 'EdTech', 'HealthTech', 'E-Commerce', 'Cybersecurity', 'AI / ML', 'Cloud Services', 'Manufacturing', 'Consulting', 'Other'];

export default function CompanyProfilePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', industry: '', description: '', website: '', location: '', logo_url: '',
  });

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data } = await insforge.database.from('companies').select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setForm({
          name: data.name || '',
          email: data.email || user.email || '',
          industry: data.industry || '',
          description: data.description || '',
          website: data.website || '',
          location: data.location || '',
          logo_url: data.logo_url || '',
        });
      } else {
        setIsNew(true);
        setForm(f => ({ ...f, email: user.email || '' }));
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Check if profile exists again to be absolutely sure
      const { data: existing } = await insforge.database
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const payload: any = {
        user_id: user.id,
        name: form.name,
        email: form.email,
        industry: form.industry,
        description: form.description,
        website: form.website,
        location: form.location,
        logo_url: form.logo_url,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (existing) {
        // Update existing record
        const { error: updateError } = await insforge.database
          .from('companies')
          .update(payload)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await insforge.database
          .from('companies')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      
      setIsNew(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      console.error('Save error details:', e);
      alert(`Failed to save profile: ${e.message || 'Check your internet connection or database permissions.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    try {
      setSaving(true);
      const { data, error } = await insforge.storage
        .from('company_logos')
        .upload(fileName, file);

      if (error) throw error;
      if (data?.url) {
        set('logo_url', data.url);
        alert('Logo uploaded successfully! Please click Save to keep changes.');
      }
    } catch (err: any) {
      console.error('Error uploading logo:', err);
      alert(`Error uploading logo: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-1">Company</p>
          <h1 className="text-3xl font-bold text-slate-800">Company Profile</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isNew ? 'Set up your company profile to start posting internships' : 'Keep your company information up to date'}
          </p>
        </header>

        {loading ? (
          <div className="max-w-2xl space-y-4">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            {isNew && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3">
                <Cpu size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-indigo-800 text-sm">Welcome to FutureFit! 🎉</p>
                  <p className="text-indigo-600 text-sm mt-0.5">Complete your company profile to start posting internships and attract AI-matched candidates.</p>
                </div>
              </div>
            )}

            {/* Avatar Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-4 border-white">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  form.name?.charAt(0)?.toUpperCase() || '?'
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{form.name || 'Your Company'}</h2>
                <p className="text-slate-400 text-sm">{form.industry || 'Industry not set'} · {form.location || 'Location not set'}</p>
                <div className="mt-3 flex gap-2">
                   <label className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors flex items-center gap-2">
                      <Upload size={14} className="inline" />
                      Upload Logo
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={saving} />
                   </label>
                   {form.logo_url && (
                     <button onClick={() => set('logo_url', '')} className="px-4 py-2 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-50 transition-colors">
                        Remove
                     </button>
                   )}
                </div>
              </div>
            </div>

            {/* Logo Link (Backup) */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <label className="block text-sm font-semibold text-slate-600 mb-1.5 font-bold uppercase tracking-tight text-[10px]">Or provide a direct image URL</label>
              <input className="input-field text-sm" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="https://example.com/logo.png" />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={18} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Name *</label>
                  <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. TechCorp India" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Official Email</label>
                  <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="hr@yourcompany.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Industry Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind}
                      onClick={() => set('industry', ind)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-center ${
                        form.industry === ind ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={18} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800">Contact & Location</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    <Globe size={14} className="inline mr-1" />
                    Website
                  </label>
                  <input className="input-field" type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourcompany.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">
                    <MapPin size={14} className="inline mr-1" />
                    Location
                  </label>
                  <input className="input-field" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bengaluru, India" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-500" />
                <h3 className="font-bold text-slate-800">Company Description</h3>
              </div>
              <textarea
                className="input-field resize-none"
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Tell students about your company's mission, culture, and what makes you a great place to intern..."
              />
              <p className="text-xs text-slate-400 mt-1.5">This description is visible to students when they browse your internship listings.</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saved ? (
                <><CheckCircle2 size={20} /> Profile Saved!</>
              ) : (
                <><Save size={20} /> {saving ? 'Saving...' : isNew ? 'Create Company Profile' : 'Save Changes'}</>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
