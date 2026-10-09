import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import { computeMatchScore, StudentProfile, InternshipProfile } from '../lib/aiMatcher';
import Sidebar from '../components/Sidebar';
import InternshipCard from '../components/InternshipCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import InternshipDetailModal from '../components/InternshipDetailModal';
import { Search, Filter, Rocket } from 'lucide-react';

export default function InternshipListingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    fetchInternships();
  }, [user]);

  async function fetchInternships() {
    if (!user) return;
    try {
      // Fetch student profile 
      const { data: studentDoc } = await insforge.database
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentDoc) {
        const rawSkills = studentDoc.skills || [];
        const parsedSkills: string[] = Array.isArray(rawSkills)
          ? rawSkills.flatMap((s: string) =>
              s.includes(',') ? s.split(',').map((x: string) => x.trim()) : [s.trim()]
            )
          : typeof rawSkills === 'string'
          ? rawSkills.split(',').map((s: string) => s.trim())
          : [];

        const parsedDoc = {
          ...studentDoc,
          skills: parsedSkills
        };
        setStudentData(parsedDoc);
      }

      // Fetch applications
      if (studentDoc) {
        const { data: apps } = await insforge.database
          .from('applications')
          .select('internship_id')
          .eq('student_id', studentDoc.id);
        const ids = new Set<string>((apps || []).map((a: any) => a.internship_id));
        setAppliedIds(ids);
      }

      // Fetch all active internships
      const { data: intsData, error: intErr } = await insforge.database
          .from('internships')
          .select(`
            *,
            companies:company_id (
              name,
              logo_url,
              description,
              location,
              industry
            )
          `)
          .eq('is_active', true);

      if (intErr) throw intErr;

      if (intsData) {
        const studentProfile: StudentProfile = {
          skills: studentDoc?.skills || [],
          cgpa: parseFloat(studentDoc?.cgpa) || 0,
          department: studentDoc?.department || '',
          interests: studentDoc?.interests || []
        };

        const matched = intsData.map((int: any) => {
          const intProfile: InternshipProfile = {
            required_skills: int.required_skills || [],
            department: int.department || ''
          };
          const score = studentDoc ? computeMatchScore(studentProfile, intProfile) : 0;
          return {
            ...int,
            company_name: int.companies?.name || 'Unknown',
            logo_url: int.companies?.logo_url || '',
            matchScore: score
          };
        }).sort((a: any, b: any) => b.matchScore - a.matchScore);

        setInternships(matched);
      }
    } catch (err) {
      console.error('Error fetching internships', err);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = async (internship: any) => {
    if (!studentData) return;
    try {
      if (appliedIds.has(internship.id)) return;

      const { error } = await insforge.database
        .from('applications')
        .insert({
          student_id: studentData.id,
          internship_id: internship.id,
          status: 'applied',
          match_score: internship.matchScore || 0,
          applied_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setAppliedIds(prev => new Set(prev).add(internship.id));
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const filtered = internships.filter(int => 
    int.title.toLowerCase().includes(search.toLowerCase()) || 
    int.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="student" />
      
      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="text-indigo-500" size={20} />
              <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">
                 Opportunities
              </p>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Explore Internships</h1>
            <p className="text-slate-500 font-medium mt-1">AI-Ranked opportunities tailored for you</p>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by role or company..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm whitespace-nowrap">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(int => (
              <InternshipCard 
                key={int.id}
                internship={int}
                matchScore={int.matchScore}
                hasApplied={appliedIds.has(int.id)}
                onApply={() => handleApply(int)}
                onViewDetails={() => setSelectedInternship(int)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 border border-dashed border-slate-200 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
               <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No internships found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        {/* Details Modal */}
        {selectedInternship && (
          <InternshipDetailModal
            internship={selectedInternship}
            matchScore={selectedInternship.matchScore}
            hasApplied={appliedIds.has(selectedInternship.id)}
            onClose={() => setSelectedInternship(null)}
            onApply={() => { handleApply(selectedInternship); setSelectedInternship(null); }}
          />
        )}
      </main>
    </div>
  );
}
