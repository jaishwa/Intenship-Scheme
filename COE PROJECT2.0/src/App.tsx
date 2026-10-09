import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import DashboardStudent from "./components/DashboardStudent";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardCompany from "./components/DashboardCompany";
import Chatbot from "./components/Chatbot";
import { TRANSLATIONS } from "./components/MockData";

type ViewState = "landing" | "auth" | "student" | "admin" | "dept" | "company";
type LangType = "en" | "ta" | "hi";

export default function App() {
  const [view, setView] = useState<ViewState>("landing");
  const [lang, setLang] = useState<LangType>("en");
  const [isDark, setIsDark] = useState(true);

  // Sync dark class with document.documentElement on theme toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const handleLoginSuccess = (selectedRole: "student" | "admin" | "dept" | "company") => {
    setView(selectedRole);
  };

  const handleLogout = () => {
    setView("landing");
  };

  const handleLaunch = () => {
    setView("auth");
  };

  const handleBackToHome = () => {
    setView("landing");
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDark ? "dark-canvas" : "light-canvas"}`}>
      
      {/* 1. STATEFUL VIEW ROUTER */}
      {view === "landing" && (
        <LandingPage
          onLaunchPlatform={handleLaunch}
          currentLang={lang}
          onChangeLang={(val) => setLang(val as LangType)}
        />
      )}

      {view === "auth" && (
        <Auth
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={handleBackToHome}
          currentLang={lang}
          translations={t}
        />
      )}

      {view === "student" && (
        <DashboardStudent
          onLogout={handleLogout}
          currentLang={lang}
          translations={t}
        />
      )}

      {(view === "admin" || view === "dept") && (
        <DashboardAdmin
          onLogout={handleLogout}
          currentLang={lang}
          translations={t}
          adminRole={view}
        />
      )}

      {view === "company" && (
        <DashboardCompany
          onLogout={handleLogout}
          currentLang={lang}
          translations={t}
        />
      )}

      {/* 2. GLOBAL AI CHATBOT & VOICE COMPANION */}
      <Chatbot currentLang={lang} translations={t} />

      {/* 3. DOCK FLOATING CONTROLS: THEME SWITCHER */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-11 h-11 rounded-full bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur border border-slate-800 hover:border-slate-700 dark:border-white/10 dark:hover:border-white/20 text-indigo-400 hover:text-indigo-300 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-all"
          title={isDark ? "Toggle Enterprise Light Mode" : "Toggle Cyber Dark Mode"}
        >
          {isDark ? (
            <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: "16s" }} />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

    </div>
  );
}
