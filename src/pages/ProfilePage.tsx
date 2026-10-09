import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import Sidebar from '../components/Sidebar';
import { UserCircle, Upload, Save, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cgpa: '0.0',
    department: '',
    skills: '', // comma separated string for easy editing
    interests: '',
    resume_url: ''
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const { data } = await insforge.database
          .from('students')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setFormData({
            name: data.name || user.profile?.name || '',
            cgpa: data.cgpa ? data.cgpa.toString() : '0.0',
            department: data.department || '',
            skills: data.skills ? data.skills.join(', ') : '',
            interests: data.interests ? data.interests.join(', ') : '',
            resume_url: data.resume_url || ''
          });
        } else {
           // pre-fill with auth user metadata if table row is empty
           setFormData(f => ({ ...f, name: user.profile?.name || '' }));
        }
      } catch (err) {
        console.error('Error loading profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const interestsArray = formData.interests.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        user_id: user.id,
        email: user.email || '',
        name: formData.name,
        cgpa: parseFloat(formData.cgpa) || 0,
        department: formData.department,
        skills: skillsArray,
        interests: interestsArray,
        resume_url: formData.resume_url,
        updated_at: new Date().toISOString()
      };

      // Upsert student profile
      const { error } = await insforge.database
        .from('students')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;
      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile', err);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      setSaving(true);
      const { data: uploadData, error: uploadError } = await insforge.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError || !uploadData) throw uploadError || new Error('Upload failed');

      setFormData(prev => ({ ...prev, resume_url: uploadData.url }));
      alert('Resume uploaded! Save profile to keep changes.');
    } catch (err) {
      console.error('Error uploading file', err);
      alert('Error uploading file.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="student" />
      
      <main className="flex-1 p-8 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your details and AI resume data</p>
        </header>

        {loading ? (
          <div className="glass-card p-8 animate-pulse h-96"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Main form */}
             <div className="md:col-span-2 space-y-6">
                <form onSubmit={handleSave} className="glass-card bg-white p-8 border border-slate-100 shadow-sm rounded-2xl">
                   <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <UserIcon size={20} className="text-indigo-600" /> Basic Information
                   </h2>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">CGPA (out of 10)</label>
                        <input type="number" step="0.01" min="0" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} required className="input-field" placeholder="8.50" />
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      <label className="text-sm font-semibold text-slate-700">Department / Major</label>
                      <input type="text" name="department" value={formData.department} onChange={handleChange} required className="input-field" placeholder="Computer Science" />
                   </div>

                   <hr className="my-8 border-slate-100" />

                   <h2 className="text-xl font-bold text-slate-800 mb-6">AI Knowledge Graph</h2>

                   <div className="space-y-2 mb-6">
                      <label className="text-sm font-semibold text-slate-700 flex justify-between">
                         <span>Skills <span className="text-slate-400 font-normal">(comma separated)</span></span>
                      </label>
                      <textarea name="skills" value={formData.skills} onChange={handleChange} rows={3} className="input-field resize-none rounded-xl" placeholder="React, Node.js, Python, Scikit-learn..." />
                   </div>

                   <div className="space-y-2 mb-8">
                      <label className="text-sm font-semibold text-slate-700 flex justify-between">
                         <span>Interests <span className="text-slate-400 font-normal">(comma separated)</span></span>
                      </label>
                      <textarea name="interests" value={formData.interests} onChange={handleChange} rows={2} className="input-field resize-none rounded-xl" placeholder="Machine Learning, Full Stack, Product Management..." />
                   </div>

                   <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                         {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                      </button>
                   </div>
                </form>
             </div>

             {/* Right sidebar */}
             <div className="space-y-6">
                <div className="glass-card bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-4xl font-bold mb-4 shadow-sm border border-white">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : <UserCircle size={40} />}
                   </div>
                   <h3 className="text-lg font-bold text-slate-800">{formData.name || 'Anonymous'}</h3>
                   <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
                   
                   <div className="mt-8 w-full">
                      <p className="text-sm font-semibold text-indigo-900 mb-3 text-left">Resume Upload</p>
                      
                      {formData.resume_url ? (
                        <div className="mb-4 text-left p-3 bg-white rounded-lg border border-indigo-100 flex items-center justify-between text-sm">
                           <span className="text-slate-600 truncate flex-1 mr-2">resume.pdf</span>
                           <a href={formData.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline shrink-0">View</a>
                        </div>
                      ) : null}

                      <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-indigo-200 rounded-xl text-indigo-700 font-medium hover:bg-indigo-50 cursor-pointer transition-colors">
                         <Upload size={18} />
                         <span>{saving ? 'Uploading...' : 'Upload PDF'}</span>
                         <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={saving} />
                      </label>
                      <p className="text-xs text-slate-500 mt-3">Upload your resume for our AI to extract relevant skills.</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
