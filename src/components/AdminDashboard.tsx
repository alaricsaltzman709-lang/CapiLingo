import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Users, PlusCircle, Trash2, Check, Star, CornerDownRight, MessageCircleCode, ArrowLeftRight, ClipboardList, HelpCircle } from "lucide-react";
import { Module, StudentProgress, Question } from "../types";

interface AdminDashboardProps {
  initialModules: Module[];
  onModuleCreated: () => void;
}

export default function AdminDashboard({
  initialModules,
  onModuleCreated,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"students" | "create">("students");
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [loading, setLoading] = useState(false);

  // Form states for creating general module details
  const [level, setLevel] = useState<"basico" | "intermedio" | "avanzado">("basico");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vocabInput, setVocabInput] = useState("");
  const [phraseEng, setPhraseEng] = useState("");
  const [phraseSpa, setPhraseSpa] = useState("");

  // Quiz questions builder states for current module
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qType, setQType] = useState<"multiple-choice" | "fill-gap" | "arrange-word">("multiple-choice");
  const [qPrompt, setQPrompt] = useState("");
  const [qEngSolution, setQEngSolution] = useState("");
  const [qSpaSolution, setQSpaSolution] = useState("");
  const [qOptionsInput, setQOptionsInput] = useState(""); // Comma split for multiple choice or scramble
  const [qCorrectIdx, setQCorrectIdx] = useState(0);

  // Selected student chat inspection drawer log state
  const [inspectStudent, setInspectStudent] = useState<StudentProgress | null>(null);

  // Fetch student progress monitoring data
  const loadData = async () => {
    try {
      const sRes = await fetch("/api/students");
      const sData = await sRes.json();
      if (sRes.ok) setStudents(sData.students || []);

      const mRes = await fetch("/api/modules");
      const mData = await mRes.json();
      if (mRes.ok) setModules(mData.modules || []);
    } catch (err) {
      console.error("Error backing up admin tables:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialModules]);

  // Handle module delete
  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este módulo de aprendizaje?")) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}`, { method: "DELETE" });
      if (res.ok) {
        setModules(modules.filter((m) => m.id !== moduleId));
        onModuleCreated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add question to active list
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qPrompt || !qEngSolution) {
      alert("Por favor completa el prompt de la pregunta y su solución esperada.");
      return;
    }

    const optionsArray = qOptionsInput
      ? qOptionsInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newQ: Question = {
      id: "q-" + Date.now() + "-" + questions.length,
      type: qType === "multiple-choice" ? "multiple-choice" : qType === "fill-gap" ? "fill-gap" : "arrange-word",
      prompt: qPrompt,
      englishText: qEngSolution,
      spanishText: qSpaSolution,
      options: optionsArray,
      correctOptionIndex: qType === "multiple-choice" ? qCorrectIdx : undefined,
      correctGapWord: qType === "fill-gap" ? qEngSolution : undefined,
      gapText: qType === "fill-gap" ? `${qSpaSolution} ___ Capi` : undefined, // simple gap generator
    };

    setQuestions([...questions, newQ]);

    // reset fields
    setQPrompt("");
    setQEngSolution("");
    setQSpaSolution("");
    setQOptionsInput("");
    setQCorrectIdx(0);
  };

  // Submit complete module to Express Backend API
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Faltan datos requeridos (Título, Descripción)");
      return;
    }
    if (questions.length === 0) {
      alert("Debes agregar al menos una pregunta tipo juego al módulo.");
      return;
    }

    setLoading(true);
    const vocabArray = vocabInput
      ? vocabInput.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const phrasesArray = phraseEng
      ? [{ english: phraseEng, spanish: phraseSpa || phraseEng }]
      : [];

    const payload = {
      level,
      title,
      description,
      vocabulary: vocabArray,
      phrases: phrasesArray,
      questions,
    };

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Fallo al guardar en el servidor");

      // Success
      alert("¡Módulo de aprendizaje creado con éxito en db.json!");
      setTitle("");
      setDescription("");
      setVocabInput("");
      setPhraseEng("");
      setPhraseSpa("");
      setQuestions([]);
      onModuleCreated();
      loadData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Admin header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg select-none">
            👑
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-1">
              <span>Panel de Administración</span>
              <ShieldAlert className="w-4.5 h-4.5 text-amber-400" />
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Inspecciona de forma viva estadísticas de estudio, revisa chats de IA y crea nuevos desafíos en db.json
            </p>
          </div>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => {
              setActiveTab("students");
              setInspectStudent(null);
            }}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === "students" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Estudiantes
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              setInspectStudent(null);
            }}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === "create" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Crear modulo
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "students" ? (
          /* STUDENTS LIST TAB (Progress tracker) */
          <motion.div
            key="students-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Student grid table list */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase text-xs tracking-wider">
                  Listado de Estudiantes y Rendimiento
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-950/60 text-[10px] font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Estudiante</th>
                      <th className="p-4">EXP total</th>
                      <th className="p-4">Nivel</th>
                      <th className="p-4">Hechos</th>
                      <th className="p-4">Acciones / Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((st) => (
                      <tr key={st.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                        <td className="p-4">
                          <p className="font-bold text-slate-800 dark:text-slate-150">{st.name}</p>
                          <p className="text-xs text-slate-400">{st.email}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-amber-500">🏆 {st.exp} EXP</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-block text-[10px] tracking-wide font-black uppercase py-0.5 px-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-850 dark:text-emerald-300 rounded">
                            {st.level}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-slate-500">
                            {st.completedLessons.length} lecciones
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setInspectStudent(st)}
                            className="inline-flex items-center space-x-1.5 py-1.5 px-3 bg-slate-900 border border-slate-800 dark:bg-slate-800 dark:border-slate-700 text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                          >
                            <MessageCircleCode className="w-3.5 h-3.5" />
                            <span>Ver Chat Logs</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inspect Student Chat Logs Sidebar Drawer */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm min-h-[300px]">
              {inspectStudent ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-black text-slate-850 dark:text-slate-50 leading-tight">
                      Chat Logs de {inspectStudent.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">Inspecciona las conversaciones de este alumno con la IA:</p>
                  </div>

                  {/* List of active chats grouped by module */}
                  {Object.keys(inspectStudent.chats || {}).length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-dashed">
                      No hay conversaciones grabadas para este estudiante todavía.
                    </div>
                  ) : (
                    Object.keys(inspectStudent.chats).map((mId) => {
                      const chatLog = inspectStudent.chats[mId];
                      return (
                        <div key={mId} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-3.5 rounded-2xl space-y-3.5">
                          <span className="text-[10px] font-bold font-mono tracking-wide text-emerald-700 bg-emerald-100/60 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            Módulo: {mId}
                          </span>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                            {chatLog.map((c, cIdx) => (
                              <div key={cIdx} className="text-xs space-y-0.5">
                                <p className={`font-black uppercase tracking-wider text-[9px] ${
                                  c.role === "user" ? "text-emerald-500" : "text-amber-500"
                                }`}>
                                  {c.role === "user" ? "Alumno" : "Capi (IA)"}
                                </p>
                                <p className="text-slate-700 dark:text-slate-350 italic">
                                  "{c.text}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-300 dark:text-slate-700">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-xs font-bold leading-normal">
                    Selecciona un alumno de la tabla para ver su bitácora de mensajes de IA prácticos.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* MODULE CREATION FORM TAB */
          <motion.div
            key="module-creation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* 1. Main configuration panel */}
            <form onSubmit={handleSaveModule} className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-black text-slate-850 dark:text-slate-50 uppercase tracking-wide text-xs">
                  Crear Nuevo Módulo para CapyLingo
                </h3>
              </div>

              {/* level & title */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nivel</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-850 px-3 py-2.5 rounded-xl text-sm"
                  >
                    <option value="basico">🥞 Básico</option>
                    <option value="intermedio">🚇 Intermedio</option>
                    <option value="avanzado">💼 Avanzado</option>
                  </select>
                </div>

                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Título del Módulo</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Compras y Frutas"
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Descripción de Lección</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe brevemente de qué trata este set..."
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* target vocabulary */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Vocabulario Clave (Separado por comas)
                </label>
                <input
                  type="text"
                  value={vocabInput}
                  onChange={(e) => setVocabInput(e.target.value)}
                  placeholder="Ej: Shop, Fruits, Market, Price"
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-850 px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              {/* key phrase helper */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Frase Clave (Inglés)</label>
                  <input
                    type="text"
                    value={phraseEng}
                    onChange={(e) => setPhraseEng(e.target.value)}
                    placeholder="Ej: How much are the apples?"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Frase Clave (Español)</label>
                  <input
                    type="text"
                    value={phraseSpa}
                    onChange={(e) => setPhraseSpa(e.target.value)}
                    placeholder="Ej: ¿Cuánto valen las manzanas?"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* List of loaded questions inside active builder */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                  Juegos / Preguntas en el Módulo ({questions.length})
                </span>

                {questions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No has agregado ninguna pregunta todavía. Utiliza el constructor del costado 👉</p>
                ) : (
                  <div className="space-y-2.5">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 rounded-2xl flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-emerald-600">[{idx + 1}]</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350 capitalize">({q.type})</span>
                          <span className="max-w-[150px] truncate">"{q.prompt}"</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                          className="p-1 text-red-500 hover:text-red-700 bg-red-50 dark:bg-slate-900 rounded-lg"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SAVE FORM SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
                <button
                  type="submit"
                  disabled={loading || questions.length === 0}
                  className="px-8 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
                >
                  {loading ? "Registrando Módulo..." : "¡Publicar Módulo en CapyLingo!"}
                </button>
              </div>
            </form>

            {/* 2. Side Panel Question Creator Form */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-amber-600 tracking-wider">Añadir Pregunta</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Define los minijuegos interactivos de la lección para el racha Duolingo:</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/40 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Tipo de Juego</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs font-medium"
                  >
                    <option value="multiple-choice">🎯 Opción Múltiple</option>
                    <option value="fill-gap">✏️ Rellenar Huecos</option>
                    <option value="arrange-word">🧩 Reordenar Palabra</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Prompt / Consigna</label>
                  <input
                    type="text"
                    value={qPrompt}
                    onChange={(e) => setQPrompt(e.target.value)}
                    placeholder="Ej: ¿Cómo se dice Manzana?"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Solución (En Inglés)</label>
                  <input
                    type="text"
                    value={qEngSolution}
                    onChange={(e) => setQEngSolution(e.target.value)}
                    placeholder="Ej: Apple"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Pista Auxiliar (Español)</label>
                  <input
                    type="text"
                    value={qSpaSolution}
                    onChange={(e) => setQSpaSolution(e.target.value)}
                    placeholder="Ej: Manzana"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs"
                  />
                </div>

                {/* Scramble options list */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">
                    Opciones / Palabras Scramble (por comas)
                  </label>
                  <input
                    type="text"
                    value={qOptionsInput}
                    onChange={(e) => setQOptionsInput(e.target.value)}
                    placeholder="Ej: Dog, Apple, Orange, Cat"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs"
                  />
                </div>

                {/* correct index for option choice */}
                {qType === "multiple-choice" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Índice Opción Correcta (0 a 3)</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={qCorrectIdx}
                      onChange={(e) => setQCorrectIdx(parseInt(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-150 px-2 py-1.5 rounded-lg text-xs"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center justify-center space-x-1"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Capi-Añadir Pregunta</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog deletions support */}
      {activeTab === "create" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-150 pb-2">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Módulos en Curso (Catálogo)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{m.title}</p>
                  <p className="text-[10px] uppercase tracking-wide bg-slate-200 dark:bg-slate-800 text-slate-650 px-1 rounded max-w-fit mt-1">{m.level}</p>
                </div>
                <button
                  onClick={() => handleDeleteModule(m.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-slate-900 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
