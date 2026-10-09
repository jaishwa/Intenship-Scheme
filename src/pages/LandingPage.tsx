import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { MoveRight, Zap, Target, Star, BrainCircuit, Users } from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Redirect to onboarding to resolve specific role-based dash
      navigate('/onboarding');
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center flex-1">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-indigo-100 text-indigo-700 font-medium mb-8 float-animation">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            PM Internship Scheme
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            AI-Based Smart <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 underline decoration-indigo-200 decoration-8 underline-offset-8">
              Allocation Engine
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-slate-500 font-bold block mt-4">
              for PM Internship Scheme
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A state-of-the-art intelligent matching platform designed to streamline the PM Internship Scheme. 
            We use advanced match algorithms to connect students with their ideal corporate opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
              Get Started <MoveRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
              Login to Account
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Image/Mockup */}
        <div className="relative z-10 max-w-6xl mx-auto mt-24 px-4 w-full float-animation shadow-2xl rounded-2xl overflow-hidden glass-card p-2 border border-white/40">
           <div className="bg-white rounded-xl aspect-[2/1] w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50/30">
              {/* Abstract Mockup Elements */}
              <div className="absolute top-6 left-6 right-6 h-12 glass-card rounded-lg flex items-center px-4 gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100" />
                <div className="w-32 h-4 rounded bg-slate-200" />
                <div className="ml-auto w-12 h-12 relative flex items-center justify-center rounded-full border-4 border-emerald-500 text-emerald-600 font-bold bg-emerald-50">92</div>
              </div>
              <div className="absolute top-24 left-6 w-64 bottom-6 glass-card rounded-lg p-4 space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 rounded bg-slate-100 w-full" />)}
              </div>
              <div className="absolute top-24 left-80 right-6 bottom-6 flex gap-6">
                <div className="flex-1 glass-card rounded-lg p-6 flex flex-col items-center justify-center text-indigo-200">
                   <BrainCircuit size={64} className="text-indigo-400 mb-4" />
                   <p className="text-lg font-medium text-slate-600">AI Matching Engine Active</p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How FutureFit Works</h2>
            <p className="text-lg text-slate-600">A structured 4-step process for success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Profile', desc: 'Sign up and build your portfolio', icon: UserCircle },
              { step: 2, title: 'AI Analysis', desc: 'Our engine extracts skills from your resume', icon: Target },
              { step: 3, title: 'Companies Post', desc: 'Employers publish exciting opportunities', icon: Users },
              { step: 4, title: 'Smart Match', desc: 'Get ranked and matched instantly', icon: Zap },
            ].map((s) => (
              <div key={s.step} className="relative group">
                <div className="glass-card p-8 h-full bg-slate-50/50 hover:bg-white transition-all hover:shadow-xl hover:-translate-y-2 cursor-default border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mb-6 group-hover:scale-110 transition-transform">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                  <p className="text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Premium Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Built with cutting edge matching technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="AI Smart Matching" desc="High performance compatibility algorithms linking skills to roles." icon={BrainCircuit} />
            <FeatureCard title="Resume Skill Analysis" desc="NLP-based extraction of your core capabilities from uploaded documents." icon={FileText} />
            <FeatureCard title="Real-time Match Scores" desc="Instant percentage feedback comparing your profile against listings." icon={Star} />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="p-10 rounded-3xl bg-indigo-50 border border-indigo-100">
             <h3 className="text-3xl font-bold text-indigo-900 mb-6">For Students</h3>
             <ul className="space-y-4">
               {['Find internships faster', 'Discover skill gaps', 'Receive AI recommendations based on your CV'].map((b,i) => (
                 <li key={i} className="flex items-center gap-3 text-lg text-indigo-800">
                   <div className="w-6 h-6 rounded-full bg-indigo-200 flex flex-shrink-0 items-center justify-center">
                     <CheckCircle size={14} className="text-indigo-700" />
                   </div>
                   {b}
                 </li>
               ))}
             </ul>
          </div>
          <div className="p-10 rounded-3xl bg-purple-50 border border-purple-100">
             <h3 className="text-3xl font-bold text-purple-900 mb-6">For Companies</h3>
             <ul className="space-y-4">
               {['Find the right talent instantly', 'View AI ranked applicants', 'Save hours of recruitment time'].map((b,i) => (
                 <li key={i} className="flex items-center gap-3 text-lg text-purple-800">
                   <div className="w-6 h-6 rounded-full bg-purple-200 flex flex-shrink-0 items-center justify-center">
                     <CheckCircle size={14} className="text-purple-700" />
                   </div>
                   {b}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Start Your Future With AI</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/register?role=student" className="btn-primary bg-indigo-500 hover:bg-indigo-400 border-none text-lg px-8 py-4 text-white">
               Register as Student
             </Link>
             <Link to="/register?role=company" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
               Register as Company
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon }: any) {
  return (
    <div className="glass-card p-8 bg-white border border-slate-100 hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h4 className="text-xl font-bold text-slate-800 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

// Ensure icons used above are imported.
// In a real app we would deduplicate but for simplicity we keep it inline.
import { UserCircle, FileText, CheckCircle } from 'lucide-react';
