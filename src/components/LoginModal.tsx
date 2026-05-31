import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Mail, User, BookOpen, Key, AlertCircle, ShieldCheck } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { id: string; name: string; email: string; role: "student" | "admin" }) => void;
  defaultRole?: "student" | "admin";
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultRole = "student",
}: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<"student" | "admin">(defaultRole);
  const [email, setEmail] = useState(""); // This state stores the username/email
  const [password, setPassword] = useState("");
  const [studentLevel, setStudentLevel] = useState<"basico" | "intermedio" | "avanzado">("basico");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Shortcut login helper for easier evaluation
  const handleShortcutKeys = (alias: "student" | "admin") => {
    setErrorMsg("");
    if (alias === "student") {
      setEmail("sofia@gmail.com");
      setPassword("sofia123");
      setRole("student");
      setIsRegister(false);
    } else {
      setEmail("admin@capylingo.com");
      setPassword("admin123");
      setRole("admin");
      setIsRegister(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    // Send username as 'email' property to match what backend accepts (which supports both req.body.username and req.body.email)
    const payload = isRegister
      ? { username: email, password, studentLevel }
      : { username: email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle non-JSON response gracefully (e.g., if Vercel server fails or falls back to static HTML 404)
      const contentType = res.headers.get("content-type") || "";
      let data: any = {};
      
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        console.warn("Respuesta no-JSON recibida del servidor:", textResponse.substring(0, 200));
        throw new Error(
          "El servidor de Vercel devolvió una respuesta no válida (HTML) en lugar del formato de API JSON esperado. Asegúrate de volver a compilar y desplegar con la configuración de vercel.json."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Algo salió mal al autenticar.");
      }

      // Success
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      console.error("Auth error details:", err);
      let friendlyError = err.message || "Error al conectar con el servidor.";
      
      // Translate common Safari/WebKit JSON parsers and fetch pattern errors
      if (
        friendlyError.includes("The string did not match the expected pattern") || 
        friendlyError.includes("JSON Parse error") ||
        friendlyError.includes("Unexpected token")
      ) {
        friendlyError = "El servidor no respondió en el formato JSON esperado. Comprueba que el backend de Vercel esté activo e intenta de nuevo.";
      }
      
      setErrorMsg(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-lg bg-bento-card text-bento-text rounded-3xl overflow-hidden shadow-2xl border border-bento-border"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/85 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🌿</span>
            <h2 className="text-2xl font-black tracking-tight">
              {isRegister ? "Únete a CapyLingo" : "Bienvenido(a) a bordo"}
            </h2>
          </div>
          <p className="text-emerald-100 text-sm mt-1">
            {isRegister ? "Registra tu usuario y aprende inglés con Capi" : "Inicia sesión para continuar tu racha de inglés"}
          </p>
        </div>

        {/* Shortcuts Bar for Simple Testing */}
        <div className="bg-amber-500/10 px-6 py-4 border-b border-bento-border">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>ACCESO RÁPIDO PARA EVALUAR</span>
          </p>
          <div className="flex gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => handleShortcutKeys("student")}
              className="flex-1 text-xs py-1.5 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold rounded-xl border border-amber-500/20 transition cursor-pointer"
            >
              👩‍🎓 Sofía (Estudiante)
            </button>
            <button
              type="button"
              onClick={() => handleShortcutKeys("admin")}
              className="flex-1 text-xs py-1.5 px-3 bg-bento-bg hover:bg-bento-card text-bento-text font-bold rounded-xl border border-bento-border transition cursor-pointer"
            >
              👑 Administrador
            </button>
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center space-x-2 text-xs bg-red-500/10 text-red-600 dark:text-red-400 p-3.5 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email represented as Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-bento-muted uppercase tracking-wider block">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-bento-muted" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: sofia"
                className="w-full pl-11 pr-4 py-3 bg-bento-bg text-bento-text border border-bento-border rounded-2xl focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent text-sm font-medium font-sans cursor-text"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-bento-muted uppercase tracking-wider block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-bento-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ej: sofia123"
                className="w-full pl-11 pr-4 py-3 bg-bento-bg text-bento-text border border-bento-border rounded-2xl focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent text-sm font-medium font-sans cursor-text"
              />
            </div>
          </div>

          {/* Student Proficiency Level (for registering student) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-bento-muted uppercase tracking-wider block">
                Nivel Inicial de Inglés
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["basico", "intermedio", "avanzado"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStudentLevel(lvl)}
                    className={`py-2.5 text-xs font-bold uppercase rounded-xl border transition cursor-pointer ${
                      studentLevel === lvl
                        ? "bg-bento-accent/15 border-bento-accent text-bento-accent font-black"
                        : "bg-bento-bg border-bento-border text-bento-muted hover:text-bento-text"
                    }`}
                  >
                    {lvl === "basico" ? "☕ Básico" : lvl === "intermedio" ? "🚇 Intermedio" : "💼 Avanzado"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-bento-accent hover:bg-bento-accent-hover text-white font-black rounded-2xl shadow-md transition-all font-sans text-xs uppercase tracking-widest select-none active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Validando..." : isRegister ? "Registrarme e ingresar" : "Iniciar Sesión"}
          </button>

          {/* Foot Switcher */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
              }}
              className="text-xs text-bento-accent font-black hover:underline cursor-pointer tracking-wide"
            >
              {isRegister ? "¿Ya tienes una cuenta? Inicia Sesión" : "¿No tienes cuenta? Registrate gratis aquí"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
