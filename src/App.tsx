import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, User, LogOut, Sun, Moon, ArrowRight, ShieldCheck, Heart, Sparkles, LogIn } from "lucide-react";
import { Module, StudentProgress } from "./types";

// Import modular components
import LandingPage from "./components/LandingPage";
import LoginModal from "./components/LoginModal";
import StudentHome from "./components/StudentHome";
import LessonGame from "./components/LessonGame";
import PracticeAgent from "./components/PracticeAgent";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: "student" | "admin" } | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  // Navigation views: 'landing' | 'home' | 'game' | 'practice' | 'admin'
  const [view, setView] = useState<"landing" | "home" | "game" | "practice" | "admin">("landing");
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  // Auth modals toggle
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"student" | "admin">("student");

  // Style Theme State (Light vs Dark mode)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme Synchronizer
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Fetch learning modules catalog
  const fetchModules = async () => {
    try {
      const res = await fetch("/api/modules");
      if (res.ok) {
        const data = await res.json();
        setModules(data.modules || []);
      }
    } catch (err) {
      console.error("Error loading modules from Server:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Fetch student progress details when logged in
  const fetchStudentProgress = async (userId: string) => {
    try {
      const res = await fetch(`/api/progress/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setStudentProgress(data.progress);
      }
    } catch (err) {
      console.error("Error retrieving student progress:", err);
    }
  };

  const handleLoginSuccess = async (loggedInUser: { id: string; name: string; email: string; role: "student" | "admin" }) => {
    setUser(loggedInUser);

    if (loggedInUser.role === "student") {
      await fetchStudentProgress(loggedInUser.id);
      setView("home");
    } else {
      setView("admin");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStudentProgress(null);
    setActiveModule(null);
    setView("landing");
  };

  const handleProgressUpdated = async () => {
    if (user && user.role === "student") {
      await fetchStudentProgress(user.id);
    }
    await fetchModules();
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-bento-bg bento-grid-pattern text-bento-text flex flex-col justify-between">
      {/* GLOBAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-bento-card/85 backdrop-blur-md border-b border-bento-border/85 select-none">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Logo brand */}
          <div
            onClick={() => {
              if (user) {
                setView(user.role === "student" ? "home" : "admin");
              } else {
                setView("landing");
              }
            }}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-xl bg-bento-accent flex items-center justify-center text-white font-bold text-lg shadow-md hover:bg-bento-accent-hover transition-all">
              🌿
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-bento-text">
                Capy<span className="text-bento-accent">Lingo</span>
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase tracking-wide font-bold bg-bento-bg text-bento-muted ml-1.5 px-1 py-0.5 rounded">
                v1.5
              </span>
            </div>
          </div>

          {/* Right action controls */}
          <div className="flex items-center space-x-3">
            {/* Theme state switcher button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-bento-border bg-bento-card hover:bg-bento-bg transition text-bento-muted hover:text-bento-accent active:scale-95 cursor-pointer"
              title="Cambiar Tema Color"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Authentication actions */}
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Active user status tag */}
                <div className="hidden sm:flex flex-col text-right text-xs mr-1">
                  <span className="font-bold text-bento-text">{user.name}</span>
                  <span className="text-[9px] uppercase tracking-wide font-bold text-bento-muted">
                    {user.role === "student" ? "Estudiante" : "Administrador"}
                  </span>
                </div>

                {/* Dashboard home redirect shortcut wrapper */}
                <button
                  onClick={() => setView(user.role === "student" ? "home" : "admin")}
                  className="p-2.5 bg-bento-bg hover:bg-bento-card text-bento-text rounded-xl border border-bento-border transition cursor-pointer"
                  title="Dashboard"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* Logout action */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 py-2 px-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthRole("student");
                  setIsAuthOpen(true);
                }}
                className="inline-flex items-center space-x-1.5 py-2 px-4.5 bg-bento-accent hover:bg-bento-accent-hover text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* DYNAMIC SCREEN BOUNDARIES */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* LANDING PAGE ROUTE */}
            {view === "landing" && (
              <LandingPage
                onStartLearning={() => {
                  setAuthRole("student");
                  setIsAuthOpen(true);
                }}
                onOpenAuth={(role) => {
                  setAuthRole(role);
                  setIsAuthOpen(true);
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {/* STUDENT HOME / DASHBOARD */}
            {view === "home" && studentProgress && (
              <StudentHome
                progress={studentProgress}
                modules={modules}
                onSelectLesson={(pkg) => {
                  setActiveModule(pkg);
                  setView("game");
                }}
                onOpenPracticeAgent={(pkg) => {
                  // Direct practice allow if student finished it before
                  if (studentProgress.completedLessons.includes(pkg.id)) {
                    setActiveModule(pkg);
                    setView("practice");
                  } else {
                    alert("¡Churr churr! Debes completar la lección primero en modo juego antes de platicar con Capi IA sobre ella.");
                  }
                }}
              />
            )}

            {/* DUOLINGO GAME SET SCREEN */}
            {view === "game" && activeModule && user && (
              <LessonGame
                module={activeModule}
                userId={user.id}
                onBack={() => setView("home")}
                onProgressUpdated={handleProgressUpdated}
                onLaunchPractice={() => setView("practice")}
              />
            )}

            {/* AI CHAT TUTOR PARTNER SCREEN */}
            {view === "practice" && activeModule && user && (
              <PracticeAgent
                module={activeModule}
                userId={user.id}
                onBack={() => setView("home")}
              />
            )}

            {/* ADMINISTRATOR CONSOLE PANEL */}
            {view === "admin" && (
              <AdminDashboard
                initialModules={modules}
                onModuleCreated={handleProgressUpdated}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-xs py-6 mt-16 select-none max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-500">
            <span className="text-base">🎓</span>
            <span className="font-bold text-slate-700 dark:text-slate-350">CapyLingo © 2026</span>
            <span className="text-[10px]">— Hecho con Amor de Carpincho</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Diseños fluidos e IA real por Google Gemini</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION LOGIN / REGISTER MODAL */}
      <AnimatePresence>
        {isAuthOpen && (
          <LoginModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
            defaultRole={authRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
