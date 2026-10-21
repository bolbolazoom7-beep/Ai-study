/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  Trash2,
  BookOpen,
  Copy,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SavedExplanation } from '../types.ts';
import { playInstantSpeech, stopInstantSpeech } from '../utils/speech.ts';

interface LibraryScreenProps {
  savedItems: SavedExplanation[];
  onOpenItem: (item: SavedExplanation) => void;
  onDeleteItem: (id: string) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  savedItems,
  onOpenItem,
  onDeleteItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopInstantSpeech();
    };
  }, []);

  const filteredItems = savedItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.markdown.toLowerCase().includes(q) ||
      (item.subject && item.subject.toLowerCase().includes(q))
    );
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayAudio = async (id: string, text: string) => {
    if (playingAudioId === id) {
      stopInstantSpeech();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(id);
    try {
      const started = await playInstantSpeech(text, {
        onStart: () => setPlayingAudioId(id),
        onEnd: () => setPlayingAudioId(null),
        onError: () => setPlayingAudioId(null),
      });

      if (!started) {
        setPlayingAudioId(null);
      }
    } catch {
      setPlayingAudioId(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto max-w-2xl mx-auto w-full px-3 sm:px-4 pt-3 pb-36">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>مكتبتي الدراسية</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          الشروحات والمسائل التي قمت بحفظها للرجوع إليها ومراجعتها قبل الامتحان.
        </p>
      </div>

      {/* Search bar */}
      {savedItems.length > 0 && (
        <div className="relative mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في شروحاتك المحفوظة..."
            className="w-full h-10 pr-9 pl-4 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-purple-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      )}

      {/* Content */}
      {savedItems.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center mx-auto text-purple-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            لا توجد شروحات محفوظة بعد
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            عند حل أي مسألة أو سؤال مع الأستاذ، اضغط على زر "حفظ" لتجده هنا في أي وقت دون الحاجة للبحث مجدداً.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500">
          لا توجد نتائج مطابقة لبحثك "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    {item.subject || 'مادة دراسية'} • {item.date}
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {item.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  className="w-7 h-7 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors"
                  title="حذف من المكتبة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Preview */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {item.markdown.replace(/[#*`_]/g, '')}
              </p>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onOpenItem(item)}
                  className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 active:scale-95"
                >
                  <span>مراجعة ومناقشة مع الأستاذ</span>
                  <span>←</span>
                </button>

                <div className="flex items-center gap-2 text-slate-400">
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(item.id, item.markdown)}
                    className="hover:text-purple-600 flex items-center gap-1"
                    title="استماع صوتي فوري"
                  >
                    {playingAudioId === item.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-purple-600" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>{playingAudioId === item.id ? 'إيقاف' : 'استماع'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.markdown)}
                    className="hover:text-purple-600 flex items-center gap-1"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
