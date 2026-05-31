import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, AlertCircle, Sparkles, Award, ArrowRight, RefreshCw, MessageSquare } from "lucide-react";
import { Module, Question } from "../types";
import CapiMascot from "./CapiMascot";

interface LessonGameProps {
  module: Module;
  userId: string;
  onBack: () => void;
  onProgressUpdated: () => void;
  onLaunchPractice: () => void;
}

export default function LessonGame({
  module,
  userId,
  onBack,
  onProgressUpdated,
  onLaunchPractice,
}: LessonGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedTranslation, setTypedTranslation] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [expEarned, setExpEarned] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [shaking, setShaking] = useState(false);

  // For scrambled words builder (Duolingo style)
  const [scrambledSelected, setScrambledSelected] = useState<string[]>([]);

  const questions = module.questions;
  const currentQuestion: Question = questions[currentIdx];

  // Scramble word options initializer when current question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setTypedTranslation("");
    setScrambledSelected([]);
    setChecked(false);
    setIsCorrect(false);
  }, [currentIdx]);

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl text-center border">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <p className="font-bold">No hay preguntas creadas en este módulo.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-200 rounded-xl text-xs font-bold">
          Regresar al listado
        </button>
      </div>
    );
  }

  // Handle scrambled word slot click
  const toggleScrambledWord = (word: string) => {
    if (checked) return;
    if (scrambledSelected.includes(word)) {
      setScrambledSelected(scrambledSelected.filter((w) => w !== word));
    } else {
      setScrambledSelected([...scrambledSelected, word]);
    }
  };

  // String comparison normalizer helper
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Evaluate the answer
  const handleCheck = () => {
    if (checked) return;

    let correct = false;

    if (currentQuestion.type === "multiple-choice") {
      correct = selectedOption === currentQuestion.correctOptionIndex;
    } else if (currentQuestion.type === "fill-gap") {
      if (selectedOption !== null && currentQuestion.options) {
        correct = currentQuestion.options[selectedOption] === currentQuestion.correctGapWord;
      }
    } else if (currentQuestion.type === "translate") {
      const uText = normalizeText(typedTranslation);
      const targetText = normalizeText(currentQuestion.englishText);
      correct = uText === targetText;
    } else if (currentQuestion.type === "arrange-word") {
      const uText = scrambledSelected.join(" ");
      const targetText = currentQuestion.englishText;
      correct = normalizeText(uText) === normalizeText(targetText);
    }

    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      setExpEarned((prev) => prev + 15);
    } else {
      // Trigger temporary visual shake
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Quiz finished completely! Push points progress to database server
      const finalExpReward = expEarned + 10; // Extra 10 EXP bonus for module completion
      setExpEarned(finalExpReward);

      try {
        await fetch("/api/progress/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            exp: finalExpReward,
            completedModuleId: module.id,
          }),
        });
        onProgressUpdated();
      } catch (err) {
        console.error("Error saving final quiz points:", err);
      }

      setQuizFinished(true);
    }
  };

  // Layout calculations
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 md:py-8 space-y-6">
      {/* Quiz Navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-bento-muted hover:text-bento-text uppercase tracking-wider transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Abandonar Lección</span>
        </button>

        <span className="text-xs font-black font-mono text-bento-accent">
          MODO JUEGOS DUOLINGO
        </span>
      </div>

      {/* Progress slider bar */}
      <div className="space-y-1.5 bg-bento-card border border-bento-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-bento-muted">
          <span>Lección: {module.title}</span>
          <span>Pregunta {currentIdx + 1} de {questions.length}</span>
        </div>
        <div className="w-full h-3 bg-bento-bg rounded-full overflow-hidden border border-bento-border p-[1px]">
          <motion.div
            className="bg-bento-accent h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`bg-bento-card border ${
              shaking ? "animate-shake border-red-500" : "border-bento-border"
            } rounded-3xl p-6 md:p-8 shadow-sm space-y-6`}
          >
            {/* The Question Prompt Card */}
            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-bento-accent font-mono bg-bento-accent/10 px-2 py-0.5 rounded-md border border-bento-accent/20">
                {currentQuestion.type === "multiple-choice" && "🎯 OPCIÓN MÚLTIPLE"}
                {currentQuestion.type === "fill-gap" && "✏️ RELLENAR LÍNEA"}
                {currentQuestion.type === "arrange-word" && "🧩 ORDENAR FRACE"}
                {currentQuestion.type === "translate" && "💬 ESCRIBE TRADUCCIÓN"}
              </span>
              <h4 className="text-xl md:text-2xl font-black text-bento-text tracking-tight leading-tight pt-2">
                {currentQuestion.prompt}
              </h4>
            </div>

            {/* Translation helper box if exists */}
            {currentQuestion.spanishText && currentQuestion.type !== "translate" && (
              <div className="bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/10 text-center text-sm text-amber-600 dark:text-amber-400 font-medium font-sans">
                💬 Pista en español: <b>"{currentQuestion.spanishText}"</b>
              </div>
            )}

            {/* RENDER GAME PANEL DEPENDING ON TYPE */}

            {/* 1. Multiple Choice */}
            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSel = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      disabled={checked}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-4 text-left rounded-2xl border font-bold transition flex items-center justify-between text-sm cursor-pointer ${
                        isSel
                          ? "bg-bento-accent/10 border-bento-accent text-bento-accent shadow-sm"
                          : "bg-bento-bg hover:bg-bento-card border-bento-border text-bento-text"
                      }`}
                    >
                      <span>{option}</span>
                      <span className="h-6 w-6 rounded-lg bg-bento-card border border-bento-border flex items-center justify-center text-xs font-mono">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Fill Gap */}
            {currentQuestion.type === "fill-gap" && currentQuestion.options && (
              <div className="space-y-6">
                {/* Sentence with empty target slot */}
                <div className="p-6 bg-bento-bg rounded-2xl border border-bento-border text-center">
                  <p className="text-xl font-bold font-mono text-bento-text tracking-wide">
                    {currentQuestion.gapText?.split("___").map((pt, index, array) => (
                      <React.Fragment key={index}>
                        {pt}
                        {index < array.length - 1 && (
                          <span className="mx-2 inline-block min-w-[70px] border-b-2 border-dashed border-bento-accent text-bento-accent font-extrabold text-2xl text-center">
                            {selectedOption !== null ? currentQuestion.options[selectedOption] : "____"}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                </div>

                {/* Option buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSel = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        disabled={checked}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-3 text-center rounded-xl border font-bold text-xs md:text-sm transition cursor-pointer ${
                          isSel
                            ? "bg-bento-accent border-bento-accent text-white shadow-md shadow-bento-accent/10"
                            : "bg-bento-bg hover:bg-bento-card border-bento-border text-bento-text"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Scrambled Word Builder */}
            {currentQuestion.type === "arrange-word" && currentQuestion.options && (
              <div className="space-y-6">
                {/* Board displaying assembled phrase order */}
                <div className="min-h-[80px] p-4 bg-bento-bg rounded-2xl border border-bento-border flex flex-wrap gap-2 items-center justify-center">
                  {scrambledSelected.length === 0 ? (
                    <span className="text-xs font-bold text-bento-muted uppercase tracking-wider">
                      Presiona las palabras para ordenar...
                    </span>
                  ) : (
                    scrambledSelected.map((word) => (
                      <motion.button
                        layoutId={`word-${word}`}
                        key={word}
                        disabled={checked}
                        onClick={() => toggleScrambledWord(word)}
                        className="py-1.5 px-3 bg-bento-accent text-white font-bold text-sm rounded-xl shadow-sm border border-bento-accent active:scale-95 cursor-pointer"
                      >
                        {word}
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Scrambled original drawer slots */}
                <div className="flex flex-wrap justify-center gap-2.5">
                  {currentQuestion.options.map((word) => {
                    const isUsed = scrambledSelected.includes(word);
                    return (
                      <button
                        key={word}
                        disabled={checked || isUsed}
                        onClick={() => toggleScrambledWord(word)}
                        className={`py-2 px-4 font-bold text-sm rounded-xl border transition cursor-pointer ${
                          isUsed
                            ? "bg-bento-bg border-bento-border opacity-20 text-transparent"
                            : "bg-bento-card hover:bg-bento-bg border-bento-border text-bento-text shadow-sm active:scale-95"
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Text input translation direct */}
            {currentQuestion.type === "translate" && (
              <div className="space-y-4">
                {/* Target Translation Box */}
                <div className="p-6 bg-bento-bg rounded-2xl border border-bento-border text-center">
                  <span className="text-xs block text-bento-muted font-semibold uppercase font-mono">Español</span>
                  <p className="text-lg md:text-xl font-bold text-bento-text mt-1">
                    "{currentQuestion.spanishText}"
                  </p>
                </div>

                <textarea
                  disabled={checked}
                  rows={2}
                  value={typedTranslation}
                  onChange={(e) => setTypedTranslation(e.target.value)}
                  placeholder="Escribe tu traducción al inglés aquí..."
                  className="w-full p-4 bg-bento-card text-bento-text border border-bento-border rounded-2xl focus:outline-none focus:border-bento-accent focus:ring-1 focus:ring-bento-accent text-sm font-medium"
                />
              </div>
            )}

            {/* CHEKOUT / VALIDADOR DE RESPUESTA ACTION SECTION */}
            <div className="pt-4 border-t border-bento-border">
              <AnimatePresence>
                {checked ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isCorrect
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                        : "bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {isCorrect ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      )}
                      <div className="text-xs md:text-sm">
                        <p className="font-extrabold text-sm uppercase tracking-wide">
                          {isCorrect ? "¡Excelente! Respuesta correcta" : "¡Oh oh! Intenta recordar..."}
                        </p>
                        <p className="font-semibold text-bento-text mt-0.5">
                          Solución: <span className="font-mono bg-bento-bg border border-bento-border px-1.5 py-0.5 rounded text-bento-text">"{currentQuestion.englishText}"</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-bento-accent hover:bg-bento-accent-hover text-white font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-1 shrink-0 self-end"
                    >
                      <span>Siguiente</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="hidden md:flex items-center space-x-2 text-bento-muted text-xs">
                      <CapiMascot mood="thinking" size={40} />
                      <span>Capi espera tu decisión.</span>
                    </div>

                    <button
                      type="button"
                      disabled={
                        (currentQuestion.type === "multiple-choice" && selectedOption === null) ||
                        (currentQuestion.type === "fill-gap" && selectedOption === null) ||
                        (currentQuestion.type === "translate" && !typedTranslation.trim()) ||
                        (currentQuestion.type === "arrange-word" && scrambledSelected.length === 0)
                      }
                      onClick={handleCheck}
                      className="w-full md:w-auto px-10 py-3.5 bg-bento-accent hover:bg-bento-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer select-none"
                    >
                      Comprobar respuesta
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* CONGRATS CELEBRATION DASHBOARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bento-card border border-bento-border rounded-3xl p-8 shadow-md text-center space-y-6"
          >
            <div className="flex justify-center">
              <CapiMascot mood="celebrating" size={180} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NIVEL TOTALMENTE COMPLETADO</span>
              </div>
              <h3 className="text-3xl font-black text-bento-text tracking-tight">
                ¡Increíble trabajo! 🎉
              </h3>
              <p className="text-bento-muted text-sm max-w-md mx-auto leading-relaxed">
                Has completado la lección de <b>{module.title}</b> de manera sobresaliente. Capi está muy orgulloso de ti.
              </p>
            </div>

            {/* EXP Reward highlight card */}
            <div className="bg-bento-bg border border-bento-border p-5 rounded-3xl max-w-sm mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-bento-muted uppercase tracking-widest font-mono font-bold block">Recompensas totales</span>
                  <span className="text-base font-bold text-bento-text">Racha de Experiencia (EXP)</span>
                </div>
              </div>
              <span className="text-2xl font-black text-amber-500">+{expEarned} EXP</span>
            </div>

            <p className="text-xs text-bento-muted max-w-sm mx-auto">
              Hecho esto, ¡acabas de desbloquear el Agente de Conversación de Inteligencia Artificial para este módulo! Platica con Capi.
            </p>

            {/* Actions workflow */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto justify-center">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-bento-bg hover:bg-bento-card text-bento-text border border-bento-border text-xs font-bold rounded-2xl transition cursor-pointer"
              >
                Volver a Lecciones
              </button>

              <button
                onClick={onLaunchPractice}
                className="flex-1 py-3 bg-bento-accent hover:bg-bento-accent-hover text-white text-xs font-bold rounded-2xl shadow transition cursor-pointer inline-flex items-center justify-center space-x-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Conversar con Capi IA</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
