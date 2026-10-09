import { useState, useEffect } from 'react';
import { useUser } from '../../lib/AuthContext';
import { insforge } from '../../lib/insforge';
import Sidebar from '../../components/Sidebar';
import { PlusCircle, X, Tag, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRESET_SKILLS = ['Python', 'Java', 'React', 'Node.js', 'Machine Learning', 'SQL', 'UI/UX', 'Data Analysis', 'TypeScript', 'Docker', 'AWS', 'TensorFlow', 'Flutter', 'MongoDB', 'C++'];
const DOMAINS = ['Software Development', 'Data Science', 'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'Machine Learning', 'Mobile Development', 'DevOps'];
const DURATIONS = ['1 Month', '2 Months', '3 Months', '6 Months'];
const TYPES = ['Remote', 'Hybrid', 'Onsite'];
const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Mathematics', 'Physics', 'Any'];

const STEPS = ['Company Details', 'Internship Info', 'Skills', 'Details', 'Description'];

export default function PostInternshipPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [customSkill, setCustomSkill] = useState('');

  const [form, setForm] = useState({
    companyName: '', industry: '', website: '', location: '', companyDescription: '',
    role: '', domain: '', type: 'Remote',
    skills: [] as string[],
    duration: '3 Months', openings: 1, cgpaRequirement: 0, department: 'Computer Science',
    stipend: 0,
    description: '',
  });

  useEffect(() => {
    async function fetchCompany() {
      if (!user) return;
      try {
        const { data, error } = await insforge.database.from('companies').select('*').eq('user_id', user.id).maybeSingle();
        if (error) throw error;
        if (data) {
          setCompanyData(data);
          setForm(f => ({
            ...f,
            companyName: data.name || '',
            industry: data.industry || '',
            location: data.location || '',
            companyDescription: data.description || '',
            website: data.website || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    }
    fetchCompany();
  }, [user]);

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    const sk = customSkill.trim();
    if (!form.skills.includes(sk)) setForm(f => ({ ...f, skills: [...f.skills, sk] }));
    setCustomSkill('');
  };

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!user) {
      alert('You must be logged in to post an internship.');
      return;
    }
    if (!companyData) {
      alert('Please complete your company profile first.');
      navigate('/company/profile');
      return;
    }
    setLoading(true);
    try {
      const { error } = await insforge.database.from('internships').insert([{
        company_id: companyData.id,
        title: form.role,
        description: form.description,
        required_skills: form.skills,
        department: form.department,
        duration: form.duration,
        location: form.location,
        type: form.type,
        openings: form.openings,
        stipend: form.stipend,
        cgpa_requirement: form.cgpaRequirement,
        domain: form.domain,
        is_active: true,
      }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/company/internships'), 2000);
    } catch (e: any) {
      console.error(e);
      alert(`Failed to post internship: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex bg-[#f8f7ff] min-h-screen">
        <Sidebar role="company" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Internship Posted!</h2>
            <p className="text-slate-500">Redirecting to your internships list...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <p className="text-sm font-semibold text-indigo-500 uppercase tracking-wider mb-1">Company</p>
          <h1 className="text-3xl font-bold text-slate-800">Post New Internship</h1>
          <p className="text-slate-400 mt-1 text-sm">Fill in the details to attract the best AI-matched candidates</p>
        </header>

        {/* Step Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    i < step ? 'bg-emerald-500 text-white shadow-md' :
                    i === step ? 'bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-200' :
                    'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </button>
                <span className={`text-[10px] mt-1 font-semibold text-center ${i === step ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 rounded transition-all duration-300 ${i < step ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-3xl">
          {/* Step 0: Company Details */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Company Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Name *</label>
                  <input className="input-field" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="e.g. TechCorp India" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Industry *</label>
                  <input className="input-field" value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. Software Technology" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Website</label>
                  <input className="input-field" type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourcompany.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Location *</label>
                  <input className="input-field" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bengaluru, India" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Description</label>
                <textarea className="input-field resize-none" rows={3} value={form.companyDescription} onChange={e => set('companyDescription', e.target.value)} placeholder="Brief description of your company..." />
              </div>
            </div>
          )}

          {/* Step 1: Internship Info */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Internship Information</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Role Title *</label>
                <input className="input-field" value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Frontend Developer Intern" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Internship Domain *</label>
                <div className="grid grid-cols-2 gap-2">
                  {DOMAINS.map(d => (
                    <button
                      key={d}
                      onClick={() => set('domain', d)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                        form.domain === d ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Internship Type *</label>
                <div className="flex gap-3">
                  {TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => set('type', t)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.type === t ? 'border-indigo-500 bg-indigo-600 text-white shadow-md' : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Required Skills</h2>
              <p className="text-sm text-slate-500 mb-4">Select the skills needed for this internship. Students will be AI-matched based on these.</p>

              <div className="flex flex-wrap gap-2">
                {PRESET_SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                      form.skills.includes(skill)
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-md scale-105'
                        : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Custom skill */}
              <div className="flex gap-2 mt-4">
                <input
                  className="input-field"
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                  placeholder="Add custom skill and press Enter"
                />
                <button onClick={addCustomSkill} className="btn-primary px-4 py-2">
                  <PlusCircle size={18} />
                </button>
              </div>

              {/* Selected skills */}
              {form.skills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selected ({form.skills.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                        <Tag size={12} />
                        {skill}
                        <button onClick={() => toggleSkill(skill)} className="hover:opacity-70 ml-0.5">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Internship Details</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Duration *</label>
                <div className="grid grid-cols-2 gap-2">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => set('duration', d)}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.duration === d ? 'border-indigo-500 bg-indigo-600 text-white shadow-md' : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Number of Openings *</label>
                  <input className="input-field" type="number" min={1} value={form.openings} onChange={e => set('openings', parseInt(e.target.value) || 1)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Minimum CGPA</label>
                  <input className="input-field" type="number" min={0} max={10} step={0.1} value={form.cgpaRequirement} onChange={e => set('cgpaRequirement', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Stipend per Month (INR) *</label>
                <input className="input-field" type="number" min={0} value={form.stipend} onChange={e => set('stipend', parseInt(e.target.value) || 0)} placeholder="e.g. 15000" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Department Requirement *</label>
                <div className="grid grid-cols-3 gap-2">
                  {DEPARTMENTS.map(d => (
                    <button
                      key={d}
                      onClick={() => set('department', d)}
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                        form.department === d ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Internship Description</h2>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Describe the Internship *</label>
                <p className="text-xs text-slate-400 mb-2">Include responsibilities, projects the intern will work on, and expectations</p>
                <textarea
                  className="input-field resize-none"
                  rows={8}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder={`Responsibilities:\n• Develop and maintain frontend features using React\n• Collaborate with the design team on UI components\n\nProjects:\n• Customer-facing dashboard feature\n\nExpectations:\n• Strong communication skills\n• Self-motivated and eager to learn`}
                />
              </div>

              {/* Summary preview */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Review</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-slate-500">Role</span><span className="font-semibold text-slate-800">{form.role || '—'}</span>
                  <span className="text-slate-500">Domain</span><span className="font-semibold text-slate-800">{form.domain || '—'}</span>
                  <span className="text-slate-500">Type</span><span className="font-semibold text-slate-800">{form.type}</span>
                  <span className="text-slate-500">Duration</span><span className="font-semibold text-slate-800">{form.duration}</span>
                  <span className="text-slate-500">Openings</span><span className="font-semibold text-slate-800">{form.openings}</span>
                  <span className="text-slate-500">Skills</span><span className="font-semibold text-slate-800">{form.skills.length} selected</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} /> Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="btn-primary flex items-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !form.role || !form.domain || form.skills.length === 0}
                className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Internship 🚀'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
