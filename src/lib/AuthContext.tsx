import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface UserProfile {
  name: string;
}

interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile;
}

interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
}

interface UserState {
  user: AuthUser | null;
}

// Contexts
const AuthContext = createContext<AuthState>({ isLoaded: false, isSignedIn: false });
const UserContext = createContext<UserState>({ user: null });
const AuthActionsContext = createContext<{
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}>({
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: () => {},
});

// Storage keys
const AUTH_STORAGE_KEY = 'futurefit_auth_user';
const USERS_STORAGE_KEY = 'futurefit_users';

// Helper to get stored users
function getStoredUsers(): Record<string, { email: string; password: string; name: string; id: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function generateId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// Provider
export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ isLoaded: false, isSignedIn: false });
  const [user, setUser] = useState<AuthUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setAuthState({ isLoaded: true, isSignedIn: true });
      } else {
        setAuthState({ isLoaded: true, isSignedIn: false });
      }
    } catch {
      setAuthState({ isLoaded: true, isSignedIn: false });
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const userEntry = users[email.toLowerCase()];
    
    if (!userEntry) {
      return { success: false, error: 'No account found with this email. Please sign up first.' };
    }
    
    if (userEntry.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const authUser: AuthUser = {
      id: userEntry.id,
      email: userEntry.email,
      profile: { name: userEntry.name }
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setAuthState({ isLoaded: true, isSignedIn: true });
    return { success: true };
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    
    if (users[email.toLowerCase()]) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const id = generateId();
    users[email.toLowerCase()] = { email, password, name, id };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const authUser: AuthUser = {
      id,
      email,
      profile: { name }
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    setAuthState({ isLoaded: true, isSignedIn: true });
    return { success: true };
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setAuthState({ isLoaded: true, isSignedIn: false });
  };

  return (
    <AuthContext.Provider value={authState}>
      <UserContext.Provider value={{ user }}>
        <AuthActionsContext.Provider value={{ signIn, signUp, signOut }}>
          {children}
        </AuthActionsContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

// Hooks (match InsForge API)
export function useAuth() {
  return useContext(AuthContext);
}

export function useUser() {
  return useContext(UserContext);
}

export function useAuthActions() {
  return useContext(AuthActionsContext);
}

// Components (match InsForge API)
export function SignedIn({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

export function SignInButton() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : 'Sign In'}
      </button>
    </form>
  );
}

export function SignUpButton() {
  const { signUp } = useAuthActions();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
        />
      </div>
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </span>
        ) : 'Create Account'}
      </button>
    </form>
  );
}

export function UserButton() {
  const { user } = useUser();
  const { signOut } = useAuthActions();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initial = user.profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-sm"
      >
        {initial}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <p className="font-bold text-slate-800 text-sm">{user.profile?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => { signOut(); setOpen(false); window.location.href = '/login'; }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
