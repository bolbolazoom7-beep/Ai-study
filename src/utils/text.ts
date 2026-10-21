/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Strips markdown symbols, asterisks, hash signs, and backticks for clean speech synthesis.
 */
export function sanitizeTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/[#*_`~>-]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates estimated reading time in minutes (assuming 150 words per minute for educational text).
 */
export function calculateReadingTimeMinutes(text: string): number {
  if (!text) return 0;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 150));
}

/**
 * Filters a list of items (explanations or conversations) by a search query in Arabic or English.
 */
export function filterBySearchQuery<T extends { title?: string; text?: string; preview?: string; subject?: string }>(
  items: T[],
  query: string
): T[] {
  if (!query || !query.trim()) return items;
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    const titleMatch = item.title ? item.title.toLowerCase().includes(q) : false;
    const textMatch = item.text ? item.text.toLowerCase().includes(q) : false;
    const prevMatch = item.preview ? item.preview.toLowerCase().includes(q) : false;
    const subjMatch = item.subject ? item.subject.toLowerCase().includes(q) : false;
    return titleMatch || textMatch || prevMatch || subjMatch;
  });
}
