/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sanitizeTextForSpeech } from './text.ts';

let cachedVoices: SpeechSynthesisVoice[] = [];
let activeAudioElement: HTMLAudioElement | null = null;
let isCurrentlyPlaying = false;

// Preload voices if Web Speech is available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function isSpeechPlaying(): boolean {
  return isCurrentlyPlaying;
}

/**
 * Universal Instant Speech Engine:
 * 1. Tries native browser Web Speech API for 0-latency playback if Arabic voice exists.
 * 2. If Web Speech is unavailable, fails, or has no Arabic voice, smoothly falls back to
 *    server-side Gemini Flash Lite TTS (/api/tts) which returns high-fidelity Arabic speech audio.
 */
export async function playInstantSpeech(
  rawText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): Promise<boolean> {
  // Always stop any ongoing speech first
  stopInstantSpeech();

  const cleanText = sanitizeTextForSpeech(rawText).slice(0, 450).trim();
  if (!cleanText) return false;

  isCurrentlyPlaying = true;

  // 1. Try Native Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices();
      }

      const arabicVoice =
        cachedVoices.find((v) => v.lang === 'ar-EG') ||
        cachedVoices.find((v) => v.lang === 'ar-SA') ||
        cachedVoices.find((v) => v.lang.toLowerCase().startsWith('ar')) ||
        null;

      // If a suitable voice is found (or browser supports language tag)
      if (arabicVoice || cachedVoices.length > 0) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }
        utterance.lang = arabicVoice ? arabicVoice.lang : 'ar-SA';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        let hasStarted = false;

        utterance.onstart = () => {
          hasStarted = true;
          isCurrentlyPlaying = true;
          callbacks?.onStart?.();
        };

        utterance.onend = () => {
          isCurrentlyPlaying = false;
          callbacks?.onEnd?.();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error, falling back to server TTS:', e);
          isCurrentlyPlaying = false;
          // Fall back to server TTS on synthesis error
          playServerTTS(cleanText, callbacks);
        };

        window.speechSynthesis.speak(utterance);

        // Fallback safety check: If speak doesn't fire onstart within 1200ms, use server TTS
        setTimeout(() => {
          if (!hasStarted && isCurrentlyPlaying) {
            window.speechSynthesis.cancel();
            playServerTTS(cleanText, callbacks);
          }
        }, 1200);

        return true;
      }
    } catch (e) {
      console.warn('Native speech failed, using server TTS:', e);
    }
  }

  // 2. Server-side TTS fallback (Gemini 3.8 Flash Lite TTS)
  return playServerTTS(cleanText, callbacks);
}

/**
 * Server-side high quality TTS playback
 */
async function playServerTTS(
  cleanText: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): Promise<boolean> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!res.ok) {
      throw new Error('TTS server request failed');
    }

    const data = await res.json();
    if (!data.audioUrl) {
      throw new Error('No audio URL returned');
    }

    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement = null;
    }

    const audio = new Audio(data.audioUrl);
    activeAudioElement = audio;

    audio.onplay = () => {
      isCurrentlyPlaying = true;
      callbacks?.onStart?.();
    };

    audio.onended = () => {
      isCurrentlyPlaying = false;
      activeAudioElement = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      isCurrentlyPlaying = false;
      activeAudioElement = null;
      callbacks?.onError?.(e);
    };

    await audio.play();
    return true;
  } catch (err) {
    console.error('Server TTS failed:', err);
    isCurrentlyPlaying = false;
    callbacks?.onError?.(err);
    return false;
  }
}

/**
 * Stops any active speech playback (both browser synthesis and audio element)
 */
export function stopInstantSpeech(): void {
  isCurrentlyPlaying = false;

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
}
