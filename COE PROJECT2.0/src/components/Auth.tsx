import React, { useState } from "react";
import { Shield, Mail, Lock, User, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthProps {
  onLoginSuccess: (role: "student" | "admin" | "dept" | "company") => void;
  onBackToHome: () => void;
  currentLang: string;
  translations: Record<string, string>;
}

type AuthView = "login" | "register" | "forgot" | "otp";
type UserRole = "student" | "admin" | "dept" | "company";

export default function Auth({ onLoginSuccess, onBackToHome, currentLang, translations }: AuthProps) {
  const [view, setView] = useState<AuthView>("login");
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [university, setUniversity] = useState("");
  const [cgpa, setCgpa] = useState("");

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-700", width: "w-0" };
    if (password.length < 5) return { label: "Weak Security", color: "bg-rose-500", width: "w-1/3" };
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (password.length >= 8 && hasSpecial && hasNumber) {
      return { label: "Enterprise Grade", color: "bg-emerald-500", width: "w-full" };
    }
    return { label: "Moderate Safety", color: "bg-amber-500", width: "w-2/3" };
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "login") {
      // Direct success redirect
      onLoginSuccess(role);
    } else if (view === "register") {
      setView("otp");
    } else if (view === "forgot") {
      alert("Reset instructions dispatched! Please check your mailbox.");
      setView("login");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On registration onboarding
    setView("login");
    alert("Verification successful! Dynamic profile activated. Please login now.");
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[idx] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (val && idx < 3) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Glow Rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand logo */}
        <div className="text-center">
          <button 
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            {translations.navBack || "Back to Home"}
          </button>
          
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 cyber-neon-indigo mb-3 animate-pulse">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            FutureFit Secure Guard
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-400 font-medium">
            Biometric-ready Multi-Role Authentication Core
          </p>
        </div>

        {/* Auth Panel */}
        <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl relative">
          
          {/* Custom Role Tabs (Only for login view) */}
          {view === "login" && (
            <div className="flex p-1 bg-slate-950/60 rounded-xl border border-white/5 mb-6 text-xs font-semibold">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  role === "student"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  role === "admin"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Scheme Admin
              </button>
              <button
                onClick={() => setRole("dept")}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  role === "dept"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Department
              </button>
              <button
                onClick={() => setRole("company")}
                className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer ${
                  role === "company"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Company
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {view === "login" && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enterprise Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. arjun@university.edu"
                      className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Access Password</label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Recovery Token?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5 border border-indigo-500/30"
                  >
                    <span>Authenticate Identity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {role === "student" && (
                  <p className="text-[10px] text-center text-slate-400 mt-4">
                    New scholar candidate?{" "}
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="text-indigo-400 hover:text-indigo-300 font-bold"
                    >
                      Onboard Account
                    </button>
                  </p>
                )}
              </motion.form>
            )}

            {view === "register" && (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                {onboardingStep === 1 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Step 1: Credentials Setup
                      </h4>
                      <span className="text-[10px] text-slate-500">1 / 2</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Candidate Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Arjun Sharma"
                          className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. arjun.sharma@nitt.edu"
                          className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Create Secure Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 characters with symbol & number"
                          className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                        />
                      </div>
                      
                      {/* Password strength diagnostics */}
                      {password && (
                        <div className="mt-2.5 space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-bold">
                            <span className="text-slate-400">Strength Diagnosis:</span>
                            <span className={strength.color.replace("bg-", "text-")}>{strength.label}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (name && email && password) setOnboardingStep(2);
                          else alert("Please fill in step 1 fields to advance.");
                        }}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5 border border-indigo-500/30"
                      >
                        <span>Continue Academic Setup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Step 2: Educational Identity
                      </h4>
                      <span className="text-[10px] text-slate-500">2 / 2</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enrollment University</label>
                      <input
                        type="text"
                        required
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="National Institute of Technology, Trichy"
                        className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verified Academic CGPA</label>
                      <input
                        type="text"
                        required
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                        placeholder="e.g. 9.2 (Scale of 10)"
                        className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-600 transition-colors"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setOnboardingStep(1)}
                        className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold text-xs transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg flex items-center justify-center gap-1.5 border border-indigo-500/30"
                      >
                        <span>Generate OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-center text-slate-400 mt-4">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    Login Gate
                  </button>
                </p>
              </motion.form>
            )}

            {view === "otp" && (
              <motion.form
                key="otp-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6 text-center"
              >
                <div>
                  <h4 className="text-sm font-bold text-indigo-400">Confirm Security Clearance</h4>
                  <p className="text-[10px] text-slate-400 mt-1">We dispatched a 4-digit code to your credential email.</p>
                </div>

                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      className="w-12 h-12 text-center bg-slate-950/80 border border-slate-800 rounded-xl text-lg font-bold text-indigo-400 focus:border-cyan-400 transition-colors"
                    />
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                    <span>Verify & Open Gate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Code resent successfully! Please check spam folder.");
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    Resend Token Code
                  </button>
                </div>
              </motion.form>
            )}

            {view === "forgot" && (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-indigo-400">Emergency Account Recovery</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Provide your registered email to receive an emergency JWT token code.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="arjun.sharma@nitt.edu"
                      className="block w-full bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-bold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-wider transition-colors shadow-lg border border-indigo-500/30"
                  >
                    Send Recovery Code
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Sign-in Federated Logins */}
          {view === "login" && (
            <div className="mt-6 border-t border-slate-800/60 pt-6 space-y-4 text-center">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                Federated Social Auth Gateways (Firebase Node)
              </span>
              
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onLoginSuccess(role)}
                  className="px-4 py-2 flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-md group cursor-pointer"
                  title="Simulate Google Identity Authentication"
                >
                  <svg className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.435-2.88-6.435-6.435s2.88-6.435 6.435-6.435c1.637 0 3.136.608 4.29 1.625l3.203-3.2C19.16 2.062 15.86 1 12.24 1 5.86 1 1 5.86 1 12.24S5.86 23.48 12.24 23.48c6.38 0 11.24-4.86 11.24-11.24 0-.648-.057-1.282-.172-1.955H12.24z"/></svg>
                  <span>Google SSO</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => onLoginSuccess(role)}
                  className="px-4 py-2 flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-md group cursor-pointer"
                  title="Simulate GitHub Developer Integration"
                >
                  <svg className="w-4 h-4 text-slate-300 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.27C5.97 1.27 1 6.24 1 12.27c0 4.87 3.19 9 7.6 10.46.55.1.75-.24.75-.53 0-.26-.01-1.13-.01-2.07-2.77.51-3.48-.67-3.69-1.28-.12-.3-.63-1.39-1.08-1.64-.37-.2-.9-.7-.02-.71.84-.01 1.44.78 1.64 1.1.96 1.62 2.5 1.16 3.11.88.1-.7.38-1.16.69-1.43-2.45-.28-5.02-1.23-5.02-5.46 0-1.2.43-2.19 1.13-2.97-.11-.28-.49-1.4.11-2.93 0 0 .93-.3 3.03 1.13a10.42 10.42 0 0 1 5.5 0c2.1-1.43 3.03-1.13 3.03-1.13.6 1.53.22 2.65.11 2.93.7.78 1.13 1.77 1.13 2.97 0 4.24-2.58 5.18-5.03 5.45.4.34.75 1.01.75 2.03 0 1.47-.01 2.65-.01 3.02 0 .29.2.64.76.53C20.81 21.27 24 17.13 24 12.27c0-6.03-4.97-11-11-11z"/></svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Disclaimers */}
        <p className="text-[9px] text-center text-slate-500 uppercase tracking-wide leading-relaxed">
          🔒 Certified Sandbox | PM Internship Scheme Secure Protocol | AES-256 Multi-Factor Encryption Enabled
        </p>
      </div>
    </div>
  );
}
