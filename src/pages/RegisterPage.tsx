import { SignUpButton, useAuth } from '../lib/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, Building } from 'lucide-react';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'company' ? 'company' : 'student';
  const [role, setRole] = useState<'student' | 'company'>(initialRole);
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const savedRole = localStorage.getItem('futurefit_signup_role') || role;
      navigate(`/onboarding?role=${savedRole}`);
    }
  }, [isLoaded, isSignedIn, navigate, role]);

  return (
    <div className="min-h-screen flex bg-white flex-row-reverse">
      {/* Left side: Illustration / Gradient */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 px-12 text-center max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-4xl text-white font-bold">F</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Join FutureFit</h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Create an account to experience cutting-edge AI hiring and internship recommendations.
          </p>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative bg-slate-50">
        <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          ← Back to home
        </Link>
        
        <div className="w-full max-w-md space-y-8 glass-card p-10 bg-white border-slate-200 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="text-slate-500 mt-2">Join as a student or company</p>
          </div>

          <div className="space-y-6 pt-4">
             {/* Role Selector */}
             <div className="bg-slate-100 p-1.5 rounded-xl flex">
               <button
                 type="button"
                 onClick={() => setRole('student')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                   role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 <User size={16} /> Student
               </button>
               <button
                 type="button"
                 onClick={() => setRole('company')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                   role === 'company' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 <Building size={16} /> Company
               </button>
             </div>

             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
               <p className="text-sm text-indigo-800 font-medium text-center">
                 You are registering as a <strong>{role === 'student' ? 'Student' : 'Company'}</strong>.
                 <br/><span className="text-indigo-600 opacity-80 text-xs">(Make sure to complete your profile after signup)</span>
               </p>
             </div>

             <div 
               className="flex justify-center flex-col items-center pt-2"
               onClick={() => localStorage.setItem('futurefit_signup_role', role)}
             >
                <SignUpButton />
             </div>
             
             <p className="text-center text-sm text-slate-600 pt-6 border-t border-slate-100">
               Already have an account?{' '}
               <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                 Log in
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
