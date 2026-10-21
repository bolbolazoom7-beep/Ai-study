/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  GraduationCap,
  Moon,
  Sun,
  Trash2,
  Check,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { UserPreferences, ArabicDialect, LearningLevel, AppTheme } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onClearData,
}) => {
  const [customKeyInput, setCustomKeyInput] = useState(preferences.customApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [keySaved, setKeySaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveCustomKey = () => {
    onUpdatePreferences({ customApiKey: customKeyInput.trim() });
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleTestKey = async () => {
    if (!customKeyInput.trim()) {
      setTestStatus({ success: false, message: 'يرجى إدخال المفتاح أولاً.' });
      return;
    }
    setTestingKey(true);
    setTestStatus(null);
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: customKeyInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus({ success: true, message: data.message || 'المفتاح سليم ومتصل بنجاح! ⚡' });
        onUpdatePreferences({ customApiKey: customKeyInput.trim() });
      } else {
        setTestStatus({ success: false, message: data.error || 'المفتاح غير صالح.' });
      }
    } catch {
      setTestStatus({ success: false, message: 'تعذر الاتصال بالخادم لفحص المفتاح.' });
    } finally {
      setTestingKey(false);
    }
  };

  const handleClear = () => {
    onClearData();
    setConfirmClear(false);
    setClearedNotice(true);
    setTimeout(() => {
      setClearedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                إعدادات المنصة والمفتاح
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                منصة فهّمني للثانوية العامة
              </p>
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

        {/* Belal Ahmed Developer Badge */}
        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                صُنع بكل فخر بواسطة بلال أحمد
              </div>
              <div className="text-[10px] text-purple-600 dark:text-purple-400">
                مطور منصة فهّمني لطلاب الثانوية العامة
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
            نسخة 2026
          </span>
        </div>

        {/* Manual API Key Input Section (رابعاً: إضافة مفتاح يدوي) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-600" />
              <span>مفتاح Google Gemini API اليدوي (اختياري):</span>
            </label>
            {preferences.customApiKey ? (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                مفتاحك مفعّل ✅
              </span>
            ) : (
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                المفتاح الافتراضي شغال ⚡
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            إذا انتهت الحصة المجانية للمفتاح الافتراضي، يمكنك وضع مفتاح Gemini الخاص بك هنا وسيعمل فوراً دون انقطاع.
          </p>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={customKeyInput}
              onChange={(e) => setCustomKeyInput(e.target.value)}
              placeholder="ضع مفتاحك الخاص هنا (يبدأ بـ AIzaSy...)"
              className="w-full h-9 pr-8 pl-16 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-purple-600"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testingKey}
              className="absolute left-1.5 top-1.5 bottom-1.5 px-2 rounded-lg bg-purple-100 dark:bg-purple-950 hover:bg-purple-200 text-purple-700 dark:text-purple-300 text-[10px] font-bold transition-colors"
            >
              {testingKey ? 'فحص...' : 'فحص 🚀'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSaveCustomKey}
              className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-xs"
            >
              {keySaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
              <span>{keySaved ? 'تم حفظ المفتاح!' : 'حفظ المفتاح اليدوي'}</span>
            </button>

            {preferences.customApiKey && (
              <button
                type="button"
                onClick={() => {
                  setCustomKeyInput('');
                  onUpdatePreferences({ customApiKey: '' });
                }}
                className="text-[10px] text-red-500 hover:underline"
              >
                إزالة المفتاح والرجوع للافتراضي
              </button>
            )}
          </div>

          {testStatus && (
            <div
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 ${
                testStatus.success
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}
            >
              <span>{testStatus.message}</span>
            </div>
          )}
        </div>

        {/* Dialect Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            أسلوب المعلم:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdatePreferences({ dialect: 'egyptian' })}
              className={`p-2 rounded-xl border text-start text-xs font-bold transition-all active:scale-95 ${
                preferences.dialect === 'egyptian'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              🇪🇬 عامية مصرية ودودة
            </button>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ dialect: 'msa' })}
              className={`p-2 rounded-xl border text-start text-xs font-bold transition-all active:scale-95 ${
                preferences.dialect === 'msa'
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 ring-2 ring-purple-600/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              📜 لغة عربية فصحى
            </button>
          </div>
        </div>

        {/* Auto Read Aloud & Theme Switcher */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Instant Auto Read Aloud Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {preferences.autoReadAloud ? (
                <Volume2 className="w-4 h-4 text-purple-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                قراءة الإجابات صوتياً تلقائياً وبسرعة فورية
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ autoReadAloud: !preferences.autoReadAloud })}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                preferences.autoReadAloud ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {preferences.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                مظهر التطبيق: {preferences.theme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 transition-colors"
            >
              تبديل 🌓
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">مسح المحادثات والدروس:</span>
          {clearedNotice ? (
            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              تم المسح
            </span>
          ) : !confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              مسح
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 font-extrabold bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-lg border border-red-300 dark:border-red-800"
              >
                تأكيد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
