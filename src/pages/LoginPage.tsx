import { SignInButton, useAuth } from '../lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/onboarding');
    }
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: Illustration / Gradient */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-hero overflow-hidden items-center justify-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 px-12 text-center max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <span className="text-4xl text-white font-bold">F</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Welcome Back</h1>
          <p className="text-lg text-indigo-100 leading-relaxed">
            Continue your journey with FutureFit's AI-powered intelligent matching engine.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
          ← Back to home
        </Link>
        
        <div className="w-full max-w-md space-y-8 glass-card p-10 border-slate-100 shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to continue</p>
          </div>

          <div className="space-y-4">
             <SignInButton />
             
             <p className="text-center text-sm text-slate-600 pt-4">
               Don't have an account?{' '}
               <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                 Sign up
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
