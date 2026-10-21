/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquareText, Camera, FileQuestion, Bookmark } from 'lucide-react';
import { AppTab } from '../types.ts';

interface NavigationProps {
  currentTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  savedCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onChangeTab,
  savedCount = 0,
}) => {
  const navItems = [
    {
      id: 'tutor' as AppTab,
      label: 'الأستاذ الذكي',
      icon: MessageSquareText,
    },
    {
      id: 'scanner' as AppTab,
      label: 'حل بالصور',
      icon: Camera,
    },
    {
      id: 'quiz' as AppTab,
      label: 'اختبر نفسك',
      icon: FileQuestion,
    },
    {
      id: 'library' as AppTab,
      label: 'مكتبتي',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-40 w-full bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 transition-colors shadow-lg shrink-0"
      aria-label="شريط التنقل السفلي"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-14 sm:h-15 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <IconComponent
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-purple-600 dark:text-purple-400' : 'text-slate-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-purple-600 text-white rounded-full min-w-[14px] text-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] tracking-tight mt-0.5 truncate">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full animate-fadeIn" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
