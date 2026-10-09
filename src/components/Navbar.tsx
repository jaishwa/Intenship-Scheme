import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '../lib/AuthContext';
import { Target } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-x-0 border-t-0 rounded-none px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
          <Target size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Smart Allocation
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <SignedOut>
          <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn-primary py-2 px-5 text-sm">
            Get Started
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
