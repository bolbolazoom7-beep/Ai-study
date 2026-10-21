/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Moon, Sun, Settings, Heart } from 'lucide-react';
import { AppTheme, ArabicDialect } from '../types.ts';

interface HeaderProps {
  theme: AppTheme;
  dialect: ArabicDialect;
  onToggleDialect: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  dialect,
  onToggleDialect,
  onToggleTheme,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-[#0B0F19]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shrink-0">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 h-13 flex items-center justify-between gap-2">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/20 text-white shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                فهّمني
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
                <span>بلال أحمد</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
              أستاذ الثانوية العامة الذكي
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5">
          {/* Dialect Switcher Button */}
          <button
            type="button"
            onClick={onToggleDialect}
            className="h-7 sm:h-8 px-2 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold transition-all active:scale-95"
            title="تبديل أسلوب الشرح (مصري ودود / فصحى مبسطة)"
          >
            {dialect === 'egyptian' ? '🇪🇬 مصري' : '📜 فصحى'}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 transition-colors flex items-center justify-center active:scale-95"
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-purple-600" />
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 transition-colors flex items-center justify-center active:scale-95"
            title="الإعدادات وإضافة مفتاح"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
