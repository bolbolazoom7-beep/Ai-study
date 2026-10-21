/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppTab = 'tutor' | 'scanner' | 'quiz' | 'library';

export type AnalysisMode = 'solve_question' | 'detailed_explanation' | 'summarize' | 'auto';

export type ArabicDialect = 'egyptian' | 'msa';

export type AppLanguage = 'ar' | 'en';

export type AppTheme = 'dark' | 'light';

export type LearningLevel = 'middle' | 'high' | 'university' | 'general';

export type QuizDifficulty = 'ministry_direct' | 'thanawya_standard' | 'high_achievers';

export interface ImageItem {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
}

export interface SavedExplanation {
  id: string;
  title: string;
  subject?: string;
  markdown: string;
  date: string;
  images?: string[];
  instruction?: string;
  mode?: string;
}

export interface EducationalAnalysis {
  id: string;
  title: string;
  subject?: string;
  markdown: string;
  mode: AnalysisMode;
  images: string[];
  instruction?: string;
  date: string;
  model?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[];
  timestamp: string;
  model?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  contextPage?: {
    title: string;
    markdownSnippet: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  diagramSvg?: string; // Optional SVG code for scientific/circuit/biology diagrams
  diagramDescription?: string;
  imageUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty?: QuizDifficulty;
  sourceLessonImage?: string;
  questions: QuizQuestion[];
  createdAt: string;
  userAnswers?: Record<number, number>;
  score?: number;
  completed?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  mastered?: boolean;
}

export interface UserPreferences {
  language: AppLanguage;
  dialect: ArabicDialect;
  theme: AppTheme;
  autoReadAloud: boolean;
  learningLevel: LearningLevel;
  customApiKey?: string;
}
