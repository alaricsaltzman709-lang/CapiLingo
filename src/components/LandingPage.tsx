import React from "react";
import { motion } from "motion/react";
import { BookOpen, Trophy, Compass, Sparkles, LogIn, ShieldAlert } from "lucide-react";
import CapiMascot from "./CapiMascot";

interface LandingProps {
  onStartLearning: () => void;
  onOpenAuth: (roleDefault: "student" | "admin") => void;
  isDarkMode: boolean;
}

export default function LandingPage({
  onStartLearning,
  onOpenAuth,
  isDarkMode,
}: LandingProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Hero Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Creative Pitch */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left bg-bento-card border border-bento-border rounded-3xl p-8 md:p-12 shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-bento-accent/10 px-3.5 py-1.5 rounded-full text-bento-accent text-xs md:text-sm font-semibold max-w-fit border border-bento-accent/20"
          >
            <Sparkles className="w-4 h-4 text-bento-accent animate-spin" />
            <span>Aprende inglés gratis con Inteligencia Artificial</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-bento-text leading-tight"
          >
            Domina el inglés con{" "}
            <span className="text-bento-accent border-b-4 border-bento-accent/50 pb-0.5">
              Capi
            </span>
            , el carpincho sabio.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-bento-muted max-w-xl leading-relaxed"
          >
            Un método interactivo estructurado de lecciones del <b>Modo Duolingo</b>, divertidos minijuegos y un interactivo <b>Agente de Práctica con IA (Gemini)</b> donde conversas directamente sobre lo aprendido.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <button
              onClick={onStartLearning}
              className="px-8 py-4 bg-bento-accent hover:bg-bento-accent-hover text-white font-bold rounded-2xl shadow-lg shadow-bento-accent/20 transition-all duration-200 transform hover:-translate-y-0.5 text-center text-base active:scale-95 cursor-pointer"
            >
              Comenzar a aprender
            </button>

            <button
              onClick={() => onOpenAuth("admin")}
              className="inline-flex items-center justify-center space-x-2 px-6 py-4 bg-bento-bg hover:bg-bento-card text-bento-text font-semibold rounded-2xl border border-bento-border shadow-sm transition-all text-sm active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Panel de Administración</span>
            </button>
          </motion.div>

          <div className="flex items-center space-x-6 pt-2 text-xs font-mono text-bento-muted">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-bento-accent animate-pulse" />
              <span>Inglés Básico, Intermedio y Avanzado</span>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Interactive Mascot Center (Bento-styled) */}
        <div className="lg:col-span-5 flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative w-full bg-bento-card p-8 rounded-3xl border border-bento-border shadow-sm flex flex-col items-center justify-between"
          >
            {/* Absolute badge */}
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-500 text-xs px-3 py-1 rounded-full font-bold border border-amber-500/20">
              🔥 Tu Mascota
            </div>

            <div className="my-auto pt-4">
              <CapiMascot
                mood="happy"
                size={180}
                bubbleText="¡Churr churr! Hola, soy Capi. Te ayudaré a aprender inglés en remojo, sin presiones y con divertidos juegos. ¡Vamos!"
              />
            </div>

            <div className="mt-4 w-full bg-bento-bg p-4 rounded-2xl border border-bento-border text-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-bento-muted">Estado de Capi</span>
              <p className="text-sm font-semibold text-bento-text">Tomando un baño de cítricos caliente 🍊</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Columns - Structured nicely in Bento Grid design layouts */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-bento-card p-6 rounded-3xl border border-bento-border shadow-sm flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-bento-accent/10 border border-bento-accent/20 flex items-center justify-center text-bento-accent shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-bento-text">Modo Duolingo</h3>
            <p className="text-bento-muted text-sm leading-relaxed">
              Completa lecciones con divertidas dinámicas: opción múltiple, ordenar palabras desordenadas, traducción directa y rellenos de vacíos que miden tu retención de vocabulario y gramática.
            </p>
          </div>
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-bento-accent flex items-center gap-1">
            Recomenzar diario &rarr;
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-bento-card p-6 rounded-3xl border border-bento-border shadow-sm flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-bento-text">Agente de Práctica Con IA</h3>
            <p className="text-bento-muted text-sm leading-relaxed">
              Charla libremente con Capi después de cada lección. El agente recuerda exactamente el vocabulario del módulo y te hace preguntas interactivas. Corrige tus errores de manera muy dulce.
            </p>
          </div>
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-amber-500 flex items-center gap-1">
            Práctica Interactiva &rarr;
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-bento-card p-6 rounded-3xl border border-bento-border shadow-sm flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-bento-text">Progreso Adaptativo</h3>
            <p className="text-bento-muted text-sm leading-relaxed">
              Toma lecciones alineadas a tu nivel ideal (Básico, Intermedio o Avanzado). Acumula experiencia (EXP) y demuestra que eres el carpincho bilingüe definitivo del pantano.
            </p>
          </div>
          <span className="text-xs uppercase font-mono tracking-wider font-bold text-emerald-500 flex items-center gap-1">
            Gana hasta 150 EXP &rarr;
          </span>
        </motion.div>
      </div>

      {/* Trust Quote / Stats bar inside beautiful Bento panel */}
      <div className="mt-8 p-8 bg-gradient-to-br from-bento-card to-bento-bg rounded-3xl border border-bento-border text-center">
        <blockquote className="text-base italic font-medium text-bento-text max-w-3xl mx-auto leading-relaxed">
          "El secreto para hablar inglés fluido no es estudiar 5 horas de gramática aburrida, sino tomarse un buen té caliente en el agua con Capi y platicar cinco minutos al día."
        </blockquote>
        <cite className="block mt-3 text-xs font-semibold font-mono text-bento-accent">
          — Filosofía Zen del Carpincho Bilingüe
        </cite>
      </div>
    </div>
  );
}
