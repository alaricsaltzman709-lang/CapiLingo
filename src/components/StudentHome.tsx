import React, { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Star, MessageSquare, Gamepad2, ArrowRight, CheckCircle2, BookOpen, Search } from "lucide-react";
import { Module, StudentProgress } from "../types";
import CapiMascot from "./CapiMascot";

interface StudentHomeProps {
  progress: StudentProgress;
  modules: Module[];
  onSelectLesson: (module: Module) => void;
  onOpenPracticeAgent: (module: Module) => void;
}

export default function StudentHome({
  progress,
  modules,
  onSelectLesson,
  onOpenPracticeAgent,
}: StudentHomeProps) {
  const [activeLevel, setActiveLevel] = useState<"basico" | "intermedio" | "avanzado">(progress.level);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter modules based on the selected level and search criteria
  const baseInLevel = modules.filter((mod) => mod.level === activeLevel);
  const filteredModules = baseInLevel.filter((mod) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mod.title.toLowerCase().includes(query) ||
      mod.description.toLowerCase().includes(query) ||
      mod.vocabulary.some((v) => v.toLowerCase().includes(query))
    );
  });

  // Count progress percentages for decorative progress metrics
  const totalInLevel = baseInLevel.length;
  const completedInLevel = baseInLevel.filter((mod) =>
    progress.completedLessons.includes(mod.id)
  ).length;

  const progressPercent = totalInLevel > 0 ? Math.round((completedInLevel / totalInLevel) * 100) : 0;

  // Capi bubble phrases depending on EXP
  const getCapiAdvice = () => {
    if (progress.exp === 0) {
      return "¡Hola! Bienvenido. Elige una lección básica para empezar a ganar EXP. *churr churr*";
    }
    if (completedInLevel === totalInLevel && totalInLevel > 0) {
      return "¡Guau! Completaste todas las lecciones de este nivel. ¡Eres un capibara excelente! *salpica agua feliz*";
    }
    return `¡Tienes ${progress.exp} EXP! Sigue practicando las lecciones de nivel ${activeLevel}. ¡Capi cree en ti!`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Student Welcome & Score Dashboard Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 bg-gradient-to-br from-bento-accent to-[#4F46E5] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Subtle design elements */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-white/10 skew-x-12 translate-x-10 pointer-events-none" />

          <div className="space-y-3 z-10">
            <div className="flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-full max-w-fit text-xs font-bold tracking-wider uppercase border border-white/10">
              <Star className="w-4 h-4 fill-amber-300 stroke-amber-400" />
              <span>Estudiante en racha</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ¡Hola, {progress.name}!
            </h2>
            <p className="text-indigo-100 max-w-lg text-sm md:text-base leading-relaxed">
              Estás sumergido en el nivel <span className="font-bold underline uppercase">{progress.level}</span>.
              Completa lecciones para habilitar el agente de conversación en inglés con Capi.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/20 z-10 text-center md:text-left">
            <div>
              <span className="text-xs text-indigo-200 font-semibold block uppercase tracking-wider">Total EXP</span>
              <span className="text-2xl md:text-3xl font-black text-amber-300 flex items-center justify-center md:justify-start gap-1">
                🏆 {progress.exp}
              </span>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-semibold block uppercase tracking-wider">Lecciones</span>
              <span className="text-2xl md:text-3xl font-black text-white">
                {progress.completedLessons.length}
              </span>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-semibold block uppercase tracking-wider">Nivel Actual</span>
              <span className="text-2xl md:text-3xl font-black text-white px-2 py-0.5 rounded-lg bg-white/15 inline-block uppercase text-xs tracking-wider">
                {progress.level}
              </span>
            </div>
          </div>
        </div>

        {/* Mascot companion sidebar (Bento styled widget) */}
        <div className="md:col-span-4 bg-bento-card border border-bento-border rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center">
          <CapiMascot
            mood={progress.exp > 400 ? "celebrating" : "happy"}
            size={130}
            bubbleText={getCapiAdvice()}
          />
        </div>
      </div>

      {/* Level SELECTOR bar (Duolingo style tabs in Bento grid layout) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-bento-border pb-4 gap-4">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-bento-text">
              Módulos de Aprendizaje
            </h3>
            <p className="text-bento-muted text-sm">
              Selecciona un nivel del curso para revisar tus lecciones disponibles:
            </p>
          </div>

          {/* Level Switch tabs */}
          <div className="flex bg-bento-card p-1 rounded-2xl border border-bento-border shrink-0 self-start sm:self-center">
            {(["basico", "intermedio", "avanzado"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-xl transition cursor-pointer ${
                  activeLevel === lvl
                    ? "bg-bento-accent text-white shadow-sm"
                    : "text-bento-muted hover:text-bento-text"
                }`}
              >
                {lvl === "basico" ? "Básico" : lvl === "intermedio" ? "Intermedio" : "Avanzado"}
              </button>
            ))}
          </div>
        </div>

        {/* Level summary bar */}
        {totalInLevel > 0 && (
          <div className="bg-bento-card p-4 rounded-3xl border border-bento-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono text-bento-muted">
            <span className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-bento-accent animate-pulse" />
              <span>Progreso en {activeLevel}: {completedInLevel}/{totalInLevel} Módulos</span>
            </span>
            <div className="w-full sm:w-1/3 bg-bento-bg h-3.5 rounded-full overflow-hidden border border-bento-border p-[2px]">
              <div
                className="bg-bento-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Search & Filter Bar for 100+ modules */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-bento-muted" />
          <input
            type="text"
            placeholder="Buscar por título, descripción o vocabulario (p. ej. 'restaurant', 'supermarket', 'hotel', 'clima', 'dentista')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bento-card border border-bento-border text-bento-text rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-bento-accent/50 transition-all placeholder:text-bento-muted/70"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3 text-xs bg-bento-bg hover:bg-bento-border text-bento-muted px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* List of filtered modules */}
        {filteredModules.length === 0 ? (
          <div className="bg-bento-card p-12 rounded-3xl text-center border-2 border-dashed border-bento-border">
            <BookOpen className="w-12 h-12 text-bento-muted mx-auto mb-3" />
            <p className="text-bento-text font-bold">No hay módulos disponibles en este nivel todavía</p>
            <p className="text-bento-muted text-xs mt-1">Los administradores pueden agregar nuevos módulos desde el panel de arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((pkg, idx) => {
              const isCompleted = progress.completedLessons.includes(pkg.id);

              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ y: -4 }}
                  className={`relative overflow-hidden bg-bento-card p-6 rounded-3xl border shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? "border-bento-accent/50 ring-2 ring-bento-accent/5"
                      : "border-bento-border"
                  }`}
                >
                  {/* Decorative tag */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-bento-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Completado</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="inline-block text-[10px] tracking-widest font-bold uppercase py-0.5 px-2 bg-bento-bg text-bento-accent rounded-md border border-bento-border">
                      Módulo {idx + 1}
                    </span>
                    <h4 className="text-xl font-bold text-bento-text pr-20 leading-tight">
                      {pkg.title}
                    </h4>
                    <p className="text-bento-muted text-xs md:text-sm line-clamp-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Vocab badges count */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {pkg.vocabulary.slice(0, 4).map((voc) => (
                        <span
                          key={voc}
                          className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-bento-bg text-bento-text border border-bento-border"
                        >
                          {voc}
                        </span>
                      ))}
                      {pkg.vocabulary.length > 4 && (
                        <span className="text-[10px] font-mono text-bento-muted px-1.5 py-0.5">
                          +{pkg.vocabulary.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    {/* Game Lesson launcher button */}
                    <button
                      onClick={() => onSelectLesson(pkg)}
                      className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-bento-accent hover:bg-bento-accent-hover text-white text-xs font-bold rounded-2xl shadow transition active:scale-95 cursor-pointer"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>{isCompleted ? "Repetir Juegos" : "Jugar Lección"}</span>
                    </button>

                    {/* Chat with Gemini Agent launcher button */}
                    <button
                      onClick={() => onOpenPracticeAgent(pkg)}
                      className={`flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 text-xs font-bold rounded-2xl border transition active:scale-95 cursor-pointer ${
                        isCompleted
                          ? "bg-bento-bg hover:bg-bento-card border-bento-accent/50 text-bento-accent"
                          : "bg-bento-card hover:bg-bento-bg border-bento-border text-bento-muted"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-bento-accent" />
                      <span>Chat con Capi IA</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
