export interface Question {
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

export interface Module {
  id: string;
  level: "basico" | "intermedio" | "avanzado";
  title: string;
  description: string;
  vocabulary: string[];
  phrases: { english: string; spanish: string }[];
  questions: Question[];
}

export interface StudentChat {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface StudentProgress {
  userId: string;
  name: string;
  email: string;
  level: "basico" | "intermedio" | "avanzado";
  exp: number;
  completedLessons: string[];
  lastActive: string;
  chats: { [moduleId: string]: StudentChat[] };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
}
