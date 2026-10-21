/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ImagePlus,
  Sparkles,
  RotateCw,
  Trash2,
  Bookmark,
  Check,
  Copy,
  Volume2,
  VolumeX,
  FileQuestion,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { EducationalAnalysis, AnalysisMode, ImageItem } from '../types.ts';
import { fileToDataUrl, compressImageDataUrl, rotateImageDataUrl } from '../utils/image.ts';
import { sanitizeTextForSpeech } from '../utils/text.ts';
import { FormattedStudyContent } from './FormattedStudyContent.tsx';
import { playInstantSpeech, stopInstantSpeech } from '../utils/speech.ts';

interface ScanScreenProps {
  onAnalyze: (images: string[], instruction: string, mode: AnalysisMode) => Promise<EducationalAnalysis | null>;
  isAnalyzing: boolean;
  onSaveToLibrary: (analysis: EducationalAnalysis) => void;
  onAskTutor: (context: string) => void;
  onGenerateQuiz: (title: string, markdown: string) => void;
  savedIds: string[];
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onAnalyze,
  isAnalyzing,
  onSaveToLibrary,
  onAskTutor,
  onGenerateQuiz,
  savedIds,
}) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [instruction, setInstruction] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('solve_question');
  const [analysisResult, setAnalysisResult] = useState<EducationalAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const raw = await fileToDataUrl(file);
      const compressed = await compressImageDataUrl(raw, 1400, 1400, 0.85);
      newItems.push({
        id: `img-${Date.now()}-${i}`,
        dataUrl: compressed,
        name: file.name,
        size: Math.round(compressed.length * 0.75),
      });
    }
    setImages((prev) => [...prev, ...newItems]);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRotate = async (id: string) => {
    const target = images.find((img) => img.id === id);
    if (!target) return;
    const rotated = await rotateImageDataUrl(target.dataUrl);
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, dataUrl: rotated } : img)));
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleStartSolving = async () => {
    if (images.length === 0 || isAnalyzing) return;
    const result = await onAnalyze(
      images.map((img) => img.dataUrl),
      instruction,
      mode
    );
    if (result) {
      setAnalysisResult(result);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      stopInstantSpeech();
    };
  }, []);

  const handlePlayAudio = async () => {
    if (!analysisResult) return;
    if (isPlayingAudio) {
      stopInstantSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      const started = await playInstantSpeech(analysisResult.markdown, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false),
      });

      if (!started) {
        setIsPlayingAudio(false);
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const isSaved = analysisResult ? savedIds.includes(analysisResult.id) : false;

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto max-w-2xl mx-auto w-full px-3 sm:px-4 pt-3 pb-36">
      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFiles}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {/* Screen Title */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span>حل وشرح المسائل من الصور</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          صوّر صفحة كتاب، مسألة رياضية، أو رسمة بيانية، وسيقوم الأستاذ الذكي بحلها خطوة بخطوة.
        </p>
      </div>

      {/* Upload & Action Card if not showing result */}
      {!analysisResult ? (
        <div className="space-y-4 animate-fadeIn">
          {images.length === 0 ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-purple-500/50 hover:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 dark:hover:bg-purple-950/40 text-center transition-all cursor-pointer group active:scale-[0.98] shadow-sm min-h-[160px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md shadow-purple-600/30">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  التقاط بالكاميرا
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  تصوير فوري للمسألة
                </span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-400 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-850 text-center transition-all cursor-pointer group active:scale-[0.98] shadow-sm min-h-[160px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <ImagePlus className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  رفع من الصور
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  صورة أو أكثر من جهازك
                </span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  الصور المحددة ({images.length}):
                </span>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة صفحة</span>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto mb-4">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/10 dark:bg-black/40 aspect-[4/3] flex items-center justify-center shadow-xs"
                  >
                    <img src={item.dataUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-contain" />
                    <div className="absolute top-1 right-1 flex items-center gap-1 bg-black/75 backdrop-blur-sm rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handleRotate(item.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-white hover:bg-white/20"
                        title="تدوير"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="w-6 h-6 rounded flex items-center justify-center text-red-400 hover:bg-white/20"
                        title="حذف"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mode Selector */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  نوع الشرح المطلوب:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'solve_question', label: 'حل مسألة 📐' },
                    { id: 'detailed_explanation', label: 'شرح درس 📖' },
                    { id: 'summarize', label: 'تلخيص قوانين ⚡' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as AnalysisMode)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                        mode === m.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 shadow-xs ring-1 ring-purple-600/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional instruction */}
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="ملاحظة إضافية (مثال: ركز على السؤال رقم 2)..."
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none mb-4 focus:border-purple-600"
              />

              {/* Submit Solve Button */}
              <button
                type="button"
                onClick={handleStartSolving}
                disabled={isAnalyzing}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{isAnalyzing ? 'جاري الحل والشرح في ثوانٍ...' : 'حل واشرح المسألة الآن ⚡'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Organized Solution View */
        <div className="space-y-4 animate-slideUp">
          {/* Action bar: Back, Audio, Save, Copy */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAnalysisResult(null)}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>← حل مسألة أخرى</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayAudio}
                className={`h-8 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isPlayingAudio
                    ? 'bg-purple-600 text-white border-purple-500 animate-pulse'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'إيقاف' : 'استماع'}</span>
              </button>

              <button
                type="button"
                onClick={() => onSaveToLibrary(analysisResult)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
                  isSaved
                    ? 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="حفظ في مكتبتي"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center"
                title="نسخ"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Solution Title */}
          <div>
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mb-1">
              {analysisResult.subject || 'مادة دراسية'}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {analysisResult.title}
            </h2>
          </div>

          {/* Main Solution Box formatted cleanly with FormattedStudyContent */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-md">
            <FormattedStudyContent content={analysisResult.markdown} />
          </div>

          {/* Next Steps: Ask Tutor or Quiz */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => onAskTutor(`بخصوص مسألة "${analysisResult.title}": وضح لي بالتفصيل خطوات الحل والقانون المستخدم.`)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>اسأل الأستاذ في الشات</span>
            </button>

            <button
              type="button"
              onClick={() => onGenerateQuiz(analysisResult.title, analysisResult.markdown)}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <FileQuestion className="w-4 h-4" />
              <span>اختبرني في هذا الدرس</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
