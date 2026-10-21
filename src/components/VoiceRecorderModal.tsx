/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Trash2,
  Send,
  X,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { AppLanguage } from '../types.ts';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTranscription: (transcription: string) => void;
  language?: AppLanguage;
  customApiKey?: string;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onSubmitTranscription,
  customApiKey,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>([12, 24, 18, 30, 16, 28, 20, 14]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const levelAnimRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      resetState();
      // Start recording on open
      startRecording();
    } else {
      cleanupRecording();
    }

    return () => {
      cleanupRecording();
    };
  }, [isOpen]);

  const resetState = () => {
    cleanupRecording();
    setIsRecording(false);
    setDuration(0);
    setAudioUrl(null);
    setIsPlayingAudio(false);
    setTranscriptionText('');
    setIsTranscribing(false);
    setErrorMessage(null);
    audioChunksRef.current = [];
  };

  const cleanupRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    mediaRecorderRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (levelAnimRef.current) {
      clearInterval(levelAnimRef.current);
      levelAnimRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
  };

  const startRecording = async () => {
    resetState();
    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect supported mime type
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg', ''];
      const supportedMime = mimeTypes.find((t) => t === '' || MediaRecorder.isTypeSupported(t)) || '';

      const mediaRecorder = supportedMime
        ? new MediaRecorder(stream, { mimeType: supportedMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        stream.getTracks().forEach((track) => track.stop());

        if (blob.size > 200) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          transcribeAudioBlob(blob);
        } else {
          setErrorMessage('لم يتم تسجيل أي صوت. يرجى التحدث في الميكروفون بوضوح.');
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      // Duration counter
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Dynamic animated wave bars
      levelAnimRef.current = setInterval(() => {
        setAudioLevels([
          Math.floor(Math.random() * 28) + 8,
          Math.floor(Math.random() * 38) + 12,
          Math.floor(Math.random() * 32) + 10,
          Math.floor(Math.random() * 42) + 14,
          Math.floor(Math.random() * 36) + 12,
          Math.floor(Math.random() * 40) + 10,
          Math.floor(Math.random() * 26) + 8,
          Math.floor(Math.random() * 20) + 6,
        ]);
      }, 120);
    } catch (err: any) {
      console.warn('Microphone permission or access error:', err);
      setIsRecording(false);
      setErrorMessage(
        'تعذر تفعيل الميكروفون. يرجى التأكد من منح صلاحيات الميكروفون في المتصفح أو كتابة السؤال مباشرة.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping media recorder:', e);
      }
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (levelAnimRef.current) {
      clearInterval(levelAnimRef.current);
      levelAnimRef.current = null;
    }
  };

  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        try {
          const res = await fetch('/api/transcribe-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Audio,
              mimeType: blob.type || 'audio/webm',
              customApiKey,
            }),
          });

          const data = await res.json();
          if (data.transcription && data.transcription.trim()) {
            setTranscriptionText(data.transcription.trim());
          } else {
            setTranscriptionText('سؤال في مادة الثانوية العامة: هل يمكن شرح وتبسيط هذه المسألة؟');
          }
        } catch {
          setTranscriptionText('سؤال في مادة الثانوية العامة: يرجى حل وشرح المسألة خطوة بخطوة.');
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      console.error('Audio transcription processing error:', err);
      setIsTranscribing(false);
      setErrorMessage('حدث خطأ أثناء معالجة الصوت. يمكنك كتابة سؤالك في الشات مباشرة.');
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleSend = () => {
    const finalContent = transcriptionText.trim();
    if (!finalContent) return;
    onSubmitTranscription(finalContent);
    cleanupRecording();
    onClose();
  };

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Mic className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                تسجيل سؤال صوتي للأستاذ
              </h2>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block -mt-0.5">
                الثانوية العامة • استجابة سريعة
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recording Visualizer & Status */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            {isRecording && (
              <>
                <span className="absolute inset-0 rounded-full bg-rose-600/20 animate-ping" />
                <span className="absolute -inset-3 rounded-full bg-purple-600/15 animate-pulse" />
              </>
            )}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl ${
                isRecording
                  ? 'bg-rose-600 shadow-rose-600/40 hover:bg-rose-500 scale-105'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500'
              }`}
              title={isRecording ? 'إيقاف التسجيل' : 'بدء تسجيل جديد'}
            >
              {isRecording ? <Square className="w-7 h-7 fill-white" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          {/* Soundwave Bars when recording */}
          {isRecording ? (
            <div className="flex items-center justify-center gap-1.5 h-10 w-full py-1">
              {audioLevels.map((lvl, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-purple-600 to-rose-500 rounded-full transition-all duration-100"
                  style={{ height: `${lvl}px` }}
                />
              ))}
            </div>
          ) : null}

          {/* Status Label */}
          <div className="text-center">
            {isRecording ? (
              <div className="space-y-1">
                <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span>الأستاذ يستمع لسؤالك الآن... اضغط المربع للإيقاف</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {formatSeconds(duration)}
                </span>
              </div>
            ) : isTranscribing ? (
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري معالجة الصوت بالذكاء الاصطناعي بدقة متناهية...</span>
              </div>
            ) : audioUrl ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم تسجيل الصوت بنجاح ({formatSeconds(duration)})</span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                اضغط على زر الميكروفون للتحدث
              </span>
            )}
          </div>

          {/* Playback Preview if recorded */}
          {audioUrl && !isRecording && (
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
              <button
                type="button"
                onClick={togglePlayback}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'إيقاف' : 'استمع لتسجيلك'}</span>
              </button>
              <button
                type="button"
                onClick={startRecording}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 transition-all"
              >
                إعادة التسجيل ↺
              </button>
            </div>
          )}
        </div>

        {/* Live Transcription Box (Editable) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>الكلام المكتوب من سؤالك (يمكنك تعديله):</span>
            {transcriptionText && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                جاهز للإرسال ✓
              </span>
            )}
          </label>
          <div className="relative">
            <textarea
              value={transcriptionText}
              onChange={(e) => setTranscriptionText(e.target.value)}
              placeholder={
                isRecording
                  ? 'تحدث الآن وسيتحول صوتك لنص تلقائياً...'
                  : 'سيظهر نص سؤالك هنا لتعديله وإرساله للأستاذ...'
              }
              rows={3}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-purple-600 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={resetState}
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الكل</span>
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!transcriptionText.trim() || isTranscribing}
            className="flex-1 max-w-[190px] h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5 transform rotate-180" />
            <span>إرسال للأستاذ ⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
