/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserPreferences,
  SavedExplanation,
  Conversation,
  Quiz,
  Flashcard,
} from '../types.ts';

export const DEFAULT_SETTINGS: UserPreferences = {
  language: 'ar',
  dialect: 'egyptian',
  theme: 'dark',
  autoReadAloud: false,
  learningLevel: 'high',
  customApiKey: '',
};

export function addOrUpdateExplanation(
  list: SavedExplanation[],
  item: SavedExplanation
): SavedExplanation[] {
  const index = list.findIndex((e) => e.id === item.id);
  if (index >= 0) {
    const updated = [...list];
    updated[index] = item;
    return updated;
  }
  return [item, ...list];
}

export function removeExplanation(list: SavedExplanation[], id: string): SavedExplanation[] {
  return list.filter((e) => e.id !== id);
}

export function addOrUpdateConversation(
  list: Conversation[],
  conv: Conversation
): Conversation[] {
  const index = list.findIndex((c) => c.id === conv.id);
  if (index >= 0) {
    const updated = [...list];
    updated[index] = conv;
    return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  return [conv, ...list];
}

export function removeConversation(list: Conversation[], id: string): Conversation[] {
  return list.filter((c) => c.id !== id);
}

export function renameConversation(list: Conversation[], id: string, newTitle: string): Conversation[] {
  return list.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c));
}

const STORAGE_KEYS = {
  EXPLANATIONS: 'fahhemni_saved_explanations',
  CONVERSATIONS: 'fahhemni_conversations',
  SETTINGS: 'fahhemni_settings',
  QUIZZES: 'fahhemni_quizzes',
  FLASHCARDS: 'fahhemni_flashcards',
};

export function loadSettingsFromStorage(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!saved) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: UserPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

export function loadExplanationsFromStorage(): SavedExplanation[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPLANATIONS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveExplanationsToStorage(items: SavedExplanation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXPLANATIONS, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save explanations:', e);
  }
}

export function loadConversationsFromStorage(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveConversationsToStorage(items: Conversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save conversations:', e);
  }
}

export function loadQuizzesFromStorage(): Quiz[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveQuizzesToStorage(quizzes: Quiz[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  } catch (e) {
    console.warn('Failed to save quizzes:', e);
  }
}

export function loadFlashcardsFromStorage(): Flashcard[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveFlashcardsToStorage(cards: Flashcard[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (e) {
    console.warn('Failed to save flashcards:', e);
  }
}

export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXPLANATIONS);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
  } catch (e) {
    console.warn('Failed to clear data:', e);
  }
}
