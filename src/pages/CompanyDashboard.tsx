import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import Sidebar from '../components/Sidebar';
import ApplicantCard from '../components/ApplicantCard';

export default function CompanyDashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        const { data: compDoc } = await insforge.database
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (compDoc) {
          setCompanyData(compDoc);
          
          // Fetch applicants
          const { data: appsData, error: appsErr } = await insforge.database
            .from('applications')
            .select(`
              id,
              status,
              match_score,
              students:student_id (
                id,
                name,
                cgpa,
                department,
                skills,
                resume_url
              ),
              internships!inner (
                company_id
              )
            `)
            .eq('internships.company_id', compDoc.id)
            .order('match_score', { ascending: false });

          if (!appsErr && appsData) {
            const formatted = appsData.map((app: any) => ({
              id: app.id,
              status: app.status,
              match_score: app.match_score,
              student_id: app.students.id,
              name: app.students.name,
              cgpa: parseFloat(app.students.cgpa),
              department: app.students.department,
              skills: app.students.skills || [],
              resume_url: app.students.resume_url || '#'
            }));
            setApplicants(formatted);
          }
        }
      } catch (err) {
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const updateApplicantStatus = async (id: string, status: string) => {
    try {
      await insforge.database.from('applications').update({ status }).eq('id', id);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  return (
    <div className="flex bg-[#f8f7ff] min-h-screen">
      <Sidebar role="company" />
      
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Company Dashboard</h1>
            <p className="text-slate-500 mt-1">{companyData?.name || 'Loading profile...'}</p>
          </div>
          <button className="btn-primary">Post Internship</button>
        </header>

        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
             <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
             <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
          </div>
        ) : !companyData ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl flex flex-col items-start gap-4">
            <h3 className="text-lg font-bold">Profile Incomplete</h3>
            <p>Please complete your company configuration.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                Top AI Ranked Applicants
                <span className="bg-indigo-100 text-indigo-700 text-sm py-1 px-3 rounded-full font-semibold">{applicants.length}</span>
              </h2>
              
              {applicants.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {applicants.map(app => (
                    <ApplicantCard 
                      key={app.id}
                      applicant={app}
                      onShortlist={() => updateApplicantStatus(app.id, 'shortlisted')}
                      onAccept={() => updateApplicantStatus(app.id, 'accepted')}
                      onReject={() => updateApplicantStatus(app.id, 'rejected')}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center text-slate-500">
                  <p>No applicants yet. Keep an eye out for matches!</p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
