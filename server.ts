import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import { getGeneratedModules } from "./src/modules-data.ts";
import { initializeApp as initFirebaseApp } from "firebase/app";
import { getFirestore as initFirestore, doc as fireDoc, setDoc as fireSetDoc, getDoc as fireGetDoc, getDocs as fireGetDocs, collection as fireCollection, deleteDoc as fireDeleteDoc } from "firebase/firestore";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Database configuration path
const IS_VERCEL = !!process.env.VERCEL;
const ORIGINAL_DB_PATH = path.join(process.cwd(), "db.json");
const VERCEL_DB_PATH = path.join("/tmp", "db.json");
const DB_PATH = IS_VERCEL ? VERCEL_DB_PATH : ORIGINAL_DB_PATH;

let inMemoryDB: DBStructure | null = null;

// Types for our persistent database
interface Question {
  id: string;
  type: "multiple-choice" | "arrange-word" | "translate" | "fill-gap";
  prompt: string;
  englishText: string;
  spanishText: string;
  options: string[];
  correctOptionIndex?: number;
  gapText?: string;
  correctGapWord?: string;
}

interface Module {
  id: string;
  level: "basico" | "intermedio" | "avanzado";
  title: string;
  description: string;
  vocabulary: string[];
  phrases: { english: string; spanish: string }[];
  questions: Question[];
}

interface StudentChat {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

interface StudentProgress {
  userId: string;
  name: string;
  email: string;
  level: "basico" | "intermedio" | "avanzado";
  exp: number;
  completedLessons: string[]; // List of moduleIds
  lastActive: string;
  chats: { [moduleId: string]: StudentChat[] };
}

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "student" | "admin";
}

interface DBStructure {
  users: User[];
  modules: Module[];
  progress: StudentProgress[];
}

// 6 Default learning modules
const DEFAULT_MODULES: Module[] = [];

// Seed initial students
const SEED_PROGRESS: StudentProgress[] = [
  {
    userId: "st-sofia",
    name: "Sofía Martínez",
    email: "sofia@gmail.com",
    level: "basico",
    exp: 280,
    completedLessons: ["m-greetings"],
    lastActive: "Hoy",
    chats: {
      "m-greetings": [
        { role: "model", text: "Hello! Space cadet Sofía! I am Capi, your English capybara tutor. *churr churr* Let's practice Greetings! Tell me, what is your name?", timestamp: "Hace 2 horas" },
        { role: "user", text: "Hello Capi, my name is Sofia", timestamp: "Hace 2 horas" },
        { role: "model", text: "Nice to meet you, Sofia! That is excellent. Have a beautiful capy-day! *splashes in hot water*", timestamp: "Hace 2 horas" }
      ]
    }
  },
  {
    userId: "st-carlos",
    name: "Carlos Rodríguez",
    email: "carlos@gmail.com",
    level: "intermedio",
    exp: 510,
    completedLessons: ["m-greetings", "m-directions"],
    lastActive: "Ayer",
    chats: {}
  },
  {
    userId: "st-ana",
    name: "Ana Gómez",
    email: "ana@gmail.com",
    level: "avanzado",
    exp: 950,
    completedLessons: ["m-greetings", "m-food", "m-directions", "m-restaurant", "m-interview"],
    lastActive: "Hace 3 días",
    chats: {}
  },
  {
    userId: "st-adrian",
    name: "Adrian",
    email: "adrian",
    level: "basico",
    exp: 0,
    completedLessons: [],
    lastActive: "Hoy",
    chats: {}
  }
];

const SEED_USERS: User[] = [
  {
    id: "st-sofia",
    email: "sofia@gmail.com",
    passwordHash: "sofia123",
    name: "Sofía Martínez",
    role: "student"
  },
  {
    id: "st-carlos",
    email: "carlos@gmail.com",
    passwordHash: "carlos123",
    name: "Carlos Rodríguez",
    role: "student"
  },
  {
    id: "st-ana",
    email: "ana@gmail.com",
    passwordHash: "ana123",
    name: "Ana Gómez",
    role: "student"
  },
  {
    id: "adm-juan",
    email: "admin@capylingo.com",
    passwordHash: "admin123",
    name: "Don Juan (Admin)",
    role: "admin"
  },
  {
    id: "st-adrian",
    email: "adrian",
    passwordHash: "adrian123",
    name: "Adrian",
    role: "student"
  }
];

// Helper functions for file status
function loadDB(): DBStructure {
  if (inMemoryDB) {
    return inMemoryDB;
  }

  const generated = getGeneratedModules();
  
  try {
    if (IS_VERCEL) {
      // 1. On Vercel, check if we have a writable copy in /tmp
      if (fs.existsSync(VERCEL_DB_PATH)) {
        try {
          const data = fs.readFileSync(VERCEL_DB_PATH, "utf8");
          const db = JSON.parse(data) as DBStructure;
          inMemoryDB = db;
          return db;
        } catch (e) {
          console.error("Failed to read from Vercel /tmp/db.json, falling back to read-only copy", e);
        }
      }
      
      // 2. If not, copy from the original read-only workspace path to /tmp/db.json
      if (fs.existsSync(ORIGINAL_DB_PATH)) {
        try {
          const data = fs.readFileSync(ORIGINAL_DB_PATH, "utf8");
          const db = JSON.parse(data) as DBStructure;
          if (!db.modules || db.modules.length < 100) {
            db.modules = generated;
          }
          try {
            fs.writeFileSync(VERCEL_DB_PATH, JSON.stringify(db, null, 2), "utf8");
          } catch (writeErr) {
            console.error("Could not write initial Vercel /tmp/db.json copy", writeErr);
          }
          inMemoryDB = db;
          return db;
        } catch (originalErr) {
          console.error("Failed to load original read-only db.json", originalErr);
        }
      }
    } else {
      // Regular development / non-Vercel mode
      if (fs.existsSync(ORIGINAL_DB_PATH)) {
        const data = fs.readFileSync(ORIGINAL_DB_PATH, "utf8");
        const db = JSON.parse(data) as DBStructure;
        if (!db.modules || db.modules.length < 100) {
          db.modules = generated;
          saveDB(db);
        }
        inMemoryDB = db;
        return db;
      }
    }

    // Default fallback initialization if neither exists
    const initialDB: DBStructure = {
      users: SEED_USERS,
      modules: generated,
      progress: SEED_PROGRESS
    };
    
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), "utf8");
    } catch (writeErr) {
      console.error("Could not save initial DB", writeErr);
    }
    
    inMemoryDB = initialDB;
    return initialDB;
  } catch (error) {
    console.error("Error loading DB. Initializing in-memory fallback:", error);
    const fallbackDB = { users: SEED_USERS, modules: generated, progress: SEED_PROGRESS };
    inMemoryDB = fallbackDB;
    return fallbackDB;
  }
}

function saveDB(db: DBStructure) {
  inMemoryDB = db;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing to DB file at ${DB_PATH}:`, error);
  }
}

// --- Firebase Synchronizer Integration ---
let fbApp: any = null;
let fbDb: any = null;

function getFirebaseFirestore() {
  if (fbDb) return fbDb;
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      fbApp = initFirebaseApp(config);
      fbDb = initFirestore(fbApp, config.firestoreDatabaseId);
      console.log("🔥 Firebase Firestore initialized successfully on CapyLingo Server!");
      return fbDb;
    } catch (e) {
      console.error("Error initializing Firebase App/Firestore:", e);
    }
  }
  return null;
}

async function syncWithFirebase() {
  const fDb = getFirebaseFirestore();
  if (!fDb) {
    console.log("ℹ️ Firebase config file not found yet. Operating on standard local JSON database.");
    return;
  }

  try {
    console.log("🔄 Synchronizing local database with Firebase Firestore...");
    const db = loadDB();

    // 1. Fetch modules
    const modulesSnap = await fireGetDocs(fireCollection(fDb, "modules"));
    if (!modulesSnap.empty) {
      const fbModules: Module[] = [];
      modulesSnap.forEach((doc) => {
        fbModules.push(doc.data() as Module);
      });
      db.modules = fbModules;
      console.log(`✅ Sincronizados ${fbModules.length} módulos desde Firebase.`);
    } else {
      console.log("⬆️ Subiendo módulos locales a Firebase Firestore...");
      for (const m of db.modules) {
        await fireSetDoc(fireDoc(fDb, "modules", m.id), m);
      }
    }

    // 2. Fetch users
    const usersSnap = await fireGetDocs(fireCollection(fDb, "users"));
    if (!usersSnap.empty) {
      const fbUsers: User[] = [];
      usersSnap.forEach((doc) => {
        fbUsers.push(doc.data() as User);
      });
      for (const fu of fbUsers) {
        const index = db.users.findIndex(u => u.id === fu.id);
        if (index !== -1) {
          db.users[index] = fu;
        } else {
          db.users.push(fu);
        }
      }
      console.log(`✅ Sincronizados ${fbUsers.length} usuarios desde Firebase.`);
    } else {
      console.log("⬆️ Subiendo usuarios locales a Firebase Firestore...");
      for (const u of db.users) {
        await fireSetDoc(fireDoc(fDb, "users", u.id), u);
      }
    }

    // 3. Fetch progress
    const progressSnap = await fireGetDocs(fireCollection(fDb, "progress"));
    if (!progressSnap.empty) {
      const fbProgress: StudentProgress[] = [];
      progressSnap.forEach((doc) => {
        fbProgress.push(doc.data() as StudentProgress);
      });
      for (const fp of fbProgress) {
        const index = db.progress.findIndex(p => p.userId === fp.userId);
        if (index !== -1) {
          db.progress[index] = fp;
        } else {
          db.progress.push(fp);
        }
      }
      console.log(`✅ Sincronizado progreso de ${fbProgress.length} estudiantes desde Firebase.`);
    } else {
      console.log("⬆️ Subiendo progresos locales a Firebase Firestore...");
      for (const p of db.progress) {
        await fireSetDoc(fireDoc(fDb, "progress", p.userId), p);
      }
    }

    saveDB(db);
  } catch (err) {
    console.error("⚠️ Error synchronizing with Firebase Firestore:", err);
  }
}

async function syncUserToFirebase(user: User) {
  const fDb = getFirebaseFirestore();
  if (!fDb) return;
  try {
    await fireSetDoc(fireDoc(fDb, "users", user.id), user);
    console.log(`👤 Usuario ${user.email} guardado en Firestore.`);
  } catch (err) {
    console.error(`Error saving user ${user.id} to Firestore:`, err);
  }
}

async function syncProgressToFirebase(progress: StudentProgress) {
  const fDb = getFirebaseFirestore();
  if (!fDb) return;
  try {
    await fireSetDoc(fireDoc(fDb, "progress", progress.userId), progress);
    console.log(`📈 Progreso de ${progress.userId} guardado en Firestore.`);
  } catch (err) {
    console.error(`Error saving progress ${progress.userId} to Firestore:`, err);
  }
}

async function syncModuleToFirebase(module: Module) {
  const fDb = getFirebaseFirestore();
  if (!fDb) return;
  try {
    await fireSetDoc(fireDoc(fDb, "modules", module.id), module);
    console.log(`📚 Módulo de aprendizaje ${module.id} guardado en Firestore.`);
  } catch (err) {
    console.error(`Error saving module ${module.id} to Firestore:`, err);
  }
}

// --- Direct Firestore Database Drivers (Dual-Mode: Cloud Primary, Local Fallback) ---
async function fetchModules(): Promise<Module[]> {
  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      const snap = await fireGetDocs(fireCollection(fDb, "modules"));
      if (!snap.empty) {
        const list: Module[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as Module);
        });
        return list;
      }
    } catch (e) {
      console.error("Error fetching modules from Firestore:", e);
    }
  }
  return loadDB().modules;
}

async function fetchUsers(): Promise<User[]> {
  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      const snap = await fireGetDocs(fireCollection(fDb, "users"));
      if (!snap.empty) {
        const list: User[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as User);
        });
        return list;
      }
    } catch (e) {
      console.error("Error fetching users from Firestore:", e);
    }
  }
  return loadDB().users;
}

async function fetchProgressLogs(): Promise<StudentProgress[]> {
  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      const snap = await fireGetDocs(fireCollection(fDb, "progress"));
      if (!snap.empty) {
        const list: StudentProgress[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as StudentProgress);
        });
        return list;
      }
    } catch (e) {
      console.error("Error fetching progress from Firestore:", e);
    }
  }
  return loadDB().progress;
}

async function saveModule(module: Module) {
  const db = loadDB();
  const index = db.modules.findIndex(m => m.id === module.id);
  if (index !== -1) db.modules[index] = module;
  else db.modules.push(module);
  saveDB(db);

  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      await fireSetDoc(fireDoc(fDb, "modules", module.id), module);
    } catch (e) {
      console.error(`Error saving module ${module.id} to Firestore:`, e);
    }
  }
}

async function deleteModule(id: string) {
  const db = loadDB();
  const index = db.modules.findIndex(m => m.id === id);
  if (index !== -1) {
    db.modules.splice(index, 1);
    saveDB(db);
  }

  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      await fireDeleteDoc(fireDoc(fDb, "modules", id));
    } catch (e) {
      console.error(`Error deleting module ${id} from Firestore:`, e);
    }
  }
}

async function saveUser(user: User) {
  const db = loadDB();
  const index = db.users.findIndex(u => u.id === user.id);
  if (index !== -1) db.users[index] = user;
  else db.users.push(user);
  saveDB(db);

  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      await fireSetDoc(fireDoc(fDb, "users", user.id), user);
    } catch (e) {
      console.error(`Error saving user ${user.id} to Firestore:`, e);
    }
  }
}

async function saveProgress(progress: StudentProgress) {
  const db = loadDB();
  const index = db.progress.findIndex(p => p.userId === progress.userId);
  if (index !== -1) db.progress[index] = progress;
  else db.progress.push(progress);
  saveDB(db);

  const fDb = getFirebaseFirestore();
  if (fDb) {
    try {
      await fireSetDoc(fireDoc(fDb, "progress", progress.userId), progress);
    } catch (e) {
      console.error(`Error saving progress ${progress.userId} to Firestore:`, e);
    }
  }
}

// Ensure database file is generated at startup
loadDB();

// API ENDPOINTS

// 1. Module Management
app.get("/api/modules", async (req, res) => {
  try {
    const modules = await fetchModules();
    res.json({ modules });
  } catch (error) {
    res.status(500).json({ error: "Error al recuperar los módulos." });
  }
});

app.post("/api/modules", async (req, res) => {
  const { level, title, description, vocabulary, phrases, questions } = req.body;
  if (!level || !title || !description) {
    res.status(400).json({ error: "Level, Title, and Description are required properties." });
    return;
  }
  const newModule: Module = {
    id: "m-" + Date.now(),
    level,
    title,
    description,
    vocabulary: vocabulary || [],
    phrases: phrases || [],
    questions: questions || []
  };

  try {
    await saveModule(newModule);
    res.status(201).json({ success: true, module: newModule });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el módulo." });
  }
});

app.delete("/api/modules/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const modules = await fetchModules();
    const index = modules.findIndex((m) => m.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Module not found." });
      return;
    }
    await deleteModule(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el módulo." });
  }
});

// 2. Authentication APIs
app.post("/api/auth/register", async (req, res) => {
  const username = req.body.username || req.body.email;
  const password = req.body.password;
  const studentLevel = req.body.studentLevel || "basico";
  
  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos obligatorios (usuario, contraseña)" });
    return;
  }

  try {
    const users = await fetchUsers();
    const exists = users.some(u => u.email.toLowerCase() === username.toLowerCase());
    if (exists) {
      res.status(400).json({ error: "El nombre de usuario ya está registrado." });
      return;
    }

    const userId = "u-" + Date.now();
    const newUser: User = {
      id: userId,
      email: username.toLowerCase(), // Representing username in the email property for backwards compat
      passwordHash: password,
      name: username, // Use username as name
      role: "student" // ALWAYS create student, never allow admin creation!
    };

    const studentProgress: StudentProgress = {
      userId,
      name: username,
      email: username.toLowerCase(),
      level: studentLevel,
      exp: 0,
      completedLessons: [],
      lastActive: "Hoy",
      chats: {}
    };

    await saveUser(newUser);
    await saveProgress(studentProgress);

    res.status(201).json({
      success: true,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error("Error durante el registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario en Firestore." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const username = req.body.username || req.body.email;
  const password = req.body.password;
  if (!username || !password) {
    res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    return;
  }

  try {
    const users = await fetchUsers();
    const user = users.find(u => {
      const isDirectMatch = u.email.toLowerCase() === username.toLowerCase();
      const isEmailPrefixMatch = u.email.includes("@") && u.email.split("@")[0].toLowerCase() === username.toLowerCase();
      return (isDirectMatch || isEmailPrefixMatch) && u.passwordHash === password;
    });

    if (!user) {
      res.status(401).json({ error: "Credenciales incorrectas. Intenta de nuevo." });
      return;
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Error durante el login:", error);
    res.status(500).json({ error: "Error de servidor al iniciar sesión." });
  }
});

// Endpoint to change password safely and sync it with Firebase Firestore
app.post("/api/auth/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    res.status(400).json({ error: "Faltan datos obligatorios para cambiar la contraseña (userId, contraseña actual, nueva contraseña)" });
    return;
  }

  try {
    const users = await fetchUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    if (user.passwordHash !== currentPassword) {
      res.status(401).json({ error: "La contraseña actual es incorrecta." });
      return;
    }

    user.passwordHash = newPassword;
    await saveUser(user);

    res.json({ success: true, message: "¡Contraseña cambiada exitosamente!" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la contraseña." });
  }
});

// 3. Student progress and metrics
app.get("/api/progress/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const progressLogs = await fetchProgressLogs();
    const progress = progressLogs.find((p) => p.userId === userId);
    if (!progress) {
      res.status(404).json({ error: "Progress not found for this student" });
      return;
    }
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: "Error al recuperar el progreso." });
  }
});

app.get("/api/students", async (req, res) => {
  try {
    const progressLogs = await fetchProgressLogs();
    res.json({ students: progressLogs });
  } catch (error) {
    res.status(500).json({ error: "Error al recuperar alumnos." });
  }
});

app.post("/api/progress/update", async (req, res) => {
  const { userId, exp, completedModuleId, level } = req.body;
  if (!userId) {
    res.status(400).json({ error: "userId is required to update progress" });
    return;
  }

  try {
    const progressLogs = await fetchProgressLogs();
    let progress = progressLogs.find((p) => p.userId === userId);

    if (!progress) {
      const users = await fetchUsers();
      const userObj = users.find((u) => u.id === userId);
      progress = {
        userId,
        name: userObj?.name || "Estudiante",
        email: userObj?.email || "",
        level: level || "basico",
        exp: 0,
        completedLessons: [],
        lastActive: "Hoy",
        chats: {}
      };
    }

    if (exp) {
      progress.exp += exp;
    }
    if (level) {
      progress.level = level;
    }
    if (completedModuleId) {
      if (!progress.completedLessons.includes(completedModuleId)) {
        progress.completedLessons.push(completedModuleId);
      }
    }
    progress.lastActive = "Hoy";

    await saveProgress(progress);

    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el progreso." });
  }
});

// 4. Gemini AI Practice Agent Chat (lazy loading client definition)
let geminiClientCache: GoogleGenAI | null = null;
const getGeminiClient = () => {
  if (geminiClientCache) return geminiClientCache;

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("⚠️ GEMINI_API_KEY is not defined. Active Gemini proxy runs in interactive simulator mode.");
    return null;
  }

  geminiClientCache = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return geminiClientCache;
};

// Handle chat endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { userId, moduleId, message, history } = req.body;
  if (!userId || !moduleId || !message) {
    res.status(400).json({ error: "userId, moduleId, and message are required" });
    return;
  }

  try {
    const modules = await fetchModules();
    const currentModule = modules.find(m => m.id === moduleId);

    const progressLogs = await fetchProgressLogs();
    const student = progressLogs.find(p => p.userId === userId);

    if (!student) {
      res.status(404).json({ error: "Student not found in progress logs." });
      return;
    }

    const topicName = currentModule ? currentModule.title : "Inglés general";
    const vocabulary = currentModule ? currentModule.vocabulary.join(", ") : "Vocabulario general";
    const levelText = currentModule ? currentModule.level : student.level;

    if (!student.chats) {
      student.chats = {};
    }
    if (!student.chats[moduleId]) {
      student.chats[moduleId] = [];
    }

    // Push user message to persistent DB history
    const clientTimestamp = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    student.chats[moduleId].push({
      role: "user",
      text: message,
      timestamp: clientTimestamp
    });

    const aiClient = getGeminiClient();

    if (!aiClient) {
      // Elegant fallback simulation if no API Key is added yet
      const responses = [
        `¡Churr churr! *Capi mastica un poco de pasto* Me encanta hablar de "${topicName}". Has aprendido sobre: ${vocabulary}. ¡Tu inglés suena fantástico para el nivel ${levelText}! ¿Hay alguna palabra de esas que quieras que usemos en otra oración?`,
        `*Capi flota feliz en su tina de agua caliente* ¡Perfecto! Tu mensaje es muy interesante. Recuerda que con esfuerzo serás todo un experto. ¿Me puedes decir cuál es tu fruta favorita en inglés?`,
        `*Capi te guiña un ojo alegremente* ¡Excelente práctica! Sigamos platicando. ¿Qué opinas de practicar frases de agradecimiento? *churr churr*`
      ];
      const mockReply = responses[Math.floor(Math.random() * responses.length)];

      student.chats[moduleId].push({
        role: "model",
        text: mockReply,
        timestamp: clientTimestamp
      });

      await saveProgress(student);

      res.json({
        success: true,
        text: mockReply,
        simulated: true
      });
      return;
    }

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    // System instruction defining Capi's lovable capybara persona
    const systemPrompt = `Eres "Capi", el carpincho (capibara) mascota y maestro de inglés de CapyLingo. Tu personalidad es sumamente empática, tierna, motivadora, alegre y un poco cómica. Te encantan los baños termales con naranjas, masticar pasto y usar palabras graciosas de capibara (*churr churr*, "Capy-fantástico", "capy-abrazo").
Tus objetivos principales son:
1. Conversar con el estudiante sobre la lección que acaba de completar: "${topicName}".
2. Utilizar y practicar el vocabulario estudiado: [${vocabulary}]. Hazle preguntas relacionadas con esto en inglés.
3. El nivel del estudiante es "${levelText}". Adapta tu complejidad gramatical al nivel indicado.
4. Habla mayoritariamente en inglés, pero guía y explica en español si ves que el estudiante comete errores o tiene dudas.
5. Si el estudiante comete un error gramatical o de escritura en inglés en sus mensajes, corrígelo con extrema dulzura e indícale la forma correcta de decirlo. Ej: "¡Buen intento! Recuerda que 'My name has Capi' se escribe 'My name is Capi'."
6. Agrega pequeños sonidos de carpincho (como *churr churr* o ruidos de chapoteo en el agua *splish splash*) y haz comparaciones divertidas de la vida de un carpincho para mantenerlo animado.`;

    const contents = [...formattedHistory, { role: "user", parts: [{ text: message }] }];

    const geminiResponse = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const replyText = geminiResponse.text || "¡Churr! No pude escucharte bien. ¿Me lo repites? *Capi se rasca la orejita*";

    // Save model response to database history
    student.chats[moduleId].push({
      role: "model",
      text: replyText,
      timestamp: clientTimestamp
    });

    await saveProgress(student);

    res.json({
      success: true,
      text: replyText,
      simulated: false
    });

  } catch (error: any) {
    console.error("Gemini invocation failed:", error);
    const fallbackErrReply = `*Capi estornuda en el agua* ¡Achu! Perdona, hubo un pequeño cruce de cables con mi IA, pero estoy listo para seguir. ¿Seguimos repasando y practicando inglés? *churr churr*`;
    
    try {
      const progressLogs = await fetchProgressLogs();
      const student = progressLogs.find(p => p.userId === userId);
      if (student) {
        if (!student.chats) student.chats = {};
        if (!student.chats[moduleId]) student.chats[moduleId] = [];
        student.chats[moduleId].push({
          role: "model",
          text: fallbackErrReply,
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        });
        await saveProgress(student);
      }
    } catch (saveError) {
      console.error("Error saving fallback chat:", saveError);
    }

    res.json({
      success: true,
      text: fallbackErrReply,
      errorDetails: error.message || error
    });
  }
});


// 5. Integrate Vite Server for asset loading & frontend integration
async function runServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving built web files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only bind port if not running in a serverless environment like Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CapyLingo Full-Stack Server running at http://localhost:${PORT}`);
      // Perform initial backup validation/restoration with Firebase Cloud Firestore
      syncWithFirebase();
    });
  } else {
    // Under Vercel, also attempt fire-and-forget sync on startup
    syncWithFirebase();
  }
}

runServer();

export default app;
