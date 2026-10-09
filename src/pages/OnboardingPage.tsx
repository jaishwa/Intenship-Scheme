import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';

export default function OnboardingPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      navigate('/login');
      return;
    }

    const initializeUser = async () => {
      try {
        // Did they come from register page with a role param, or do we have a cached role?
        const role = searchParams.get('role') || localStorage.getItem('futurefit_signup_role');
        const email = user.email || '';
        const name = user.profile?.name || (email ? email.split('@')[0] : 'User');

        // 1. Check if they already exist in companies
        const { data: existingCompany } = await insforge.database
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingCompany) {
          navigate('/company/dashboard');
          return;
        }

        // 2. Check if they already exist in students
        const { data: existingStudent } = await insforge.database
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingStudent) {
          navigate('/student/dashboard');
          return;
        }

        // 3. First time login - Create their profile based on requested role
        if (role === 'company') {
          // Initialize empty company profile
          await insforge.database.from('companies').insert([{
            user_id: user.id,
            name: name,
            email: email,
            description: '',
            industry: '',
            website: '',
            location: ''
          }]);
          localStorage.removeItem('futurefit_signup_role');
          navigate('/company/dashboard');
        } else {
          // Default to student
          await insforge.database.from('students').insert([{
            user_id: user.id,
            name: name,
            email: email,
            student_email: email,
            skills: [],
            cgpa: 0,
            department: '',
            college: '',
            phone: ''
          }]);
          localStorage.removeItem('futurefit_signup_role');
          navigate('/student/dashboard');
        }

      } catch (err: any) {
        console.error('Error during onboarding initializing user:', err);
        setError(err.message || 'Failed to initialize account');
      }
    };

    initializeUser();
  }, [isLoaded, isSignedIn, user, navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white glass-card">
          <h2 className="text-2xl text-red-600 mb-2 font-bold">Setup Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="text-xl font-medium text-slate-700">Setting up your account...</h2>
        <p className="text-sm text-slate-500">Please wait while we prepare your dashboard.</p>
      </div>
    </div>
  );
}
