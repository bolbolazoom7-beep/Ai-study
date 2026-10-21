/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lightbulb,
  Compass,
  Award,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Atom,
  Copy,
  Check,
  Maximize2,
} from 'lucide-react';
import { enhanceAndColorizeSvg, generateColorfulDiagram } from '../utils/scientificIllustrator.ts';

interface FormattedStudyContentProps {
  content: string;
  className?: string;
}

// Clean unescaped or broken technical strings into clean Arabic text
export function sanitizeMathAndMarkdown(text: string): string {
  if (!text) return '';
  return text
    // Replace LaTeX fraction: \frac{a}{b} -> (a ÷ b)
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 ÷ $2)')
    // Common math symbols
    .replace(/\\times/g, ' × ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\leq?/g, ' ≤ ')
    .replace(/\\geq?/g, ' ≥ ')
    .replace(/\\neq?/g, ' ≠ ')
    .replace(/\\infty/g, ' ∞ ')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    // Remove raw dollar signs for inline/block latex
    .replace(/\$\$/g, '')
    .replace(/\$([^\$]+)\$/g, '$1');
}

/**
 * Checks if a line or block represents a balanced chemical equation
 */
function isChemicalEquation(text: string): boolean {
  if (text.includes('[CHEMICAL_EQUATION]')) return true;
  // Common chemical reaction signs
  const hasReactionArrow = /-->|->|⇌|⇄|⟶|←|\+.*->/.test(text);
  // Common chemical elements and formulas (Fe, Cu, Cl2, H2O, CO2, etc.)
  const hasChemicalElements = /\b(Fe|Cu|Al|Zn|Mg|Na|K|Ca|Cl2|O2|H2|N2|H2O|CO2|SO2|SO3|FeSO4|Fe2O3|FeCl3|HCl|H2SO4|HNO3|CH4|C2H4|C2H6|C2H5OH|CH3COOH|KMnO4)\b/.test(text);
  return hasReactionArrow && hasChemicalElements;
}

export const FormattedStudyContent: React.FC<FormattedStudyContentProps> = ({
  content,
  className = '',
}) => {
  const [copiedEq, setCopiedEq] = useState<string | null>(null);
  const [expandedSvg, setExpandedSvg] = useState<string | null>(null);

  if (!content) return null;

  const handleCopyEquation = (eqText: string) => {
    navigator.clipboard.writeText(eqText);
    setCopiedEq(eqText);
    setTimeout(() => setCopiedEq(null), 2000);
  };

  // 1. First, extract any [DIAGRAM_SVG] or raw <svg> blocks
  // 2. Also extract [CHEMICAL_EQUATION] blocks
  const parts: React.ReactNode[] = [];

  // Parse blocks separated by double newlines or special tags
  const sanitized = sanitizeMathAndMarkdown(content);
  const rawBlocks = sanitized.split('\n\n').filter((b) => b.trim().length > 0);

  rawBlocks.forEach((block, idx) => {
    const trimmed = block.trim();

    // Check for explicit [CHEMICAL_EQUATION] block
    if (trimmed.includes('[CHEMICAL_EQUATION]')) {
      const match = trimmed.match(/\[CHEMICAL_EQUATION\]([\s\S]*?)\[\/CHEMICAL_EQUATION\]/);
      const eqBody = match ? match[1].trim() : trimmed.replace(/\[\/?CHEMICAL_EQUATION\]/g, '').trim();

      parts.push(
        <div
          key={`chem-${idx}`}
          className="my-3 p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border-2 border-indigo-500/40 shadow-lg relative overflow-hidden"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <FlaskConical className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-black text-indigo-300">معادلة كيميائية موزونة</span>
                <span className="text-[10px] text-purple-400 block -mt-0.5">منهج كيمياء الثانوية العامة</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopyEquation(eqBody)}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/60 text-indigo-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="نسخ المعادلة"
            >
              {copiedEq === eqBody ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEq === eqBody ? 'تم النسخ' : 'نسخ'}</span>
            </button>
          </div>
          <div className="font-mono text-sm sm:text-base font-extrabold text-white tracking-wide leading-relaxed py-1 text-center" dir="ltr">
            {renderChemicalFormula(eqBody)}
          </div>
        </div>
      );
      return;
    }

    // Check for explicit [DIAGRAM_TYPE: ...] tag
    if (trimmed.includes('[DIAGRAM_TYPE:')) {
      const match = trimmed.match(/\[DIAGRAM_TYPE:\s*([a-zA-Z0-9_-]+)\]/);
      const diagramType = match ? match[1].trim() : '';
      const svgCode = generateColorfulDiagram(diagramType, {}, '', trimmed);

      if (svgCode) {
        parts.push(
          <div
            key={`diag-type-${idx}`}
            className="my-3.5 p-3 rounded-3xl bg-slate-900 border-2 border-purple-500/40 flex flex-col items-center justify-center shadow-lg relative group overflow-hidden"
          >
            <div className="w-full flex items-center justify-between pb-1.5 mb-1.5 text-[11px] font-bold text-purple-300 border-b border-purple-500/20">
              <span className="flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-purple-400" />
                <span>رسم توضيحي علمي ملون عالي الدقة</span>
              </span>
              <button
                type="button"
                onClick={() => setExpandedSvg(expandedSvg === svgCode ? null : svgCode)}
                className="hover:text-purple-200 p-1 rounded"
                title="تكبير الرسم"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div
              className={`w-full flex items-center justify-center transition-all ${
                expandedSvg === svgCode ? 'max-h-96' : 'max-h-56'
              } overflow-hidden`}
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          </div>
        );
        return;
      }
    }

    // Check for explicit [DIAGRAM_SVG] or raw <svg> block
    if (trimmed.includes('[DIAGRAM_SVG]') || (trimmed.includes('<svg') && trimmed.includes('</svg>'))) {
      let svgCode = '';
      if (trimmed.includes('[DIAGRAM_SVG]')) {
        const match = trimmed.match(/\[DIAGRAM_SVG\]([\s\S]*?)\[\/DIAGRAM_SVG\]/);
        svgCode = match ? match[1].trim() : '';
      } else {
        const match = trimmed.match(/<svg[\s\S]*?<\/svg>/);
        svgCode = match ? match[0].trim() : '';
      }

      if (svgCode) {
        const enhancedSvg = enhanceAndColorizeSvg(svgCode);
        parts.push(
          <div
            key={`svg-${idx}`}
            className="my-3.5 p-3 rounded-3xl bg-slate-900 border-2 border-purple-500/40 flex flex-col items-center justify-center shadow-lg relative group overflow-hidden"
          >
            <div className="w-full flex items-center justify-between pb-1.5 mb-1.5 text-[11px] font-bold text-purple-300 border-b border-purple-500/20">
              <span className="flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-purple-400" />
                <span>رسم توضيحي علمي ملون عالي الدقة (3 ثانوي)</span>
              </span>
              <button
                type="button"
                onClick={() => setExpandedSvg(expandedSvg === enhancedSvg ? null : enhancedSvg)}
                className="hover:text-purple-200 p-1 rounded"
                title="تكبير الرسم"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div
              className={`w-full flex items-center justify-center transition-all ${
                expandedSvg === enhancedSvg ? 'max-h-96' : 'max-h-56'
              } overflow-hidden`}
              dangerouslySetInnerHTML={{ __html: enhancedSvg }}
            />
          </div>
        );
        return;
      }
    }

    // Check for auto-detected chemical equation line
    if (isChemicalEquation(trimmed)) {
      parts.push(
        <div
          key={`auto-chem-${idx}`}
          className="my-2.5 p-3.5 rounded-2xl bg-indigo-950/40 dark:bg-indigo-950/50 border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm font-bold shadow-sm"
        >
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-indigo-500/20 text-indigo-400 text-xs">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              <span>معادلة التفاعل الكيميائي:</span>
            </span>
            <button
              type="button"
              onClick={() => handleCopyEquation(trimmed)}
              className="text-[10px] text-indigo-300 hover:text-white"
            >
              {copiedEq === trimmed ? 'تم النسخ ✓' : 'نسخ'}
            </button>
          </div>
          <div className="font-mono text-center text-white py-1 font-extrabold text-sm sm:text-base tracking-wide" dir="ltr">
            {renderChemicalFormula(trimmed)}
          </div>
        </div>
      );
      return;
    }

    // 1. Headings
    if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const title = trimmed.replace(/^#+\s*/, '');
      let icon = <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      let cardStyle = 'border-purple-200 dark:border-purple-800/60 bg-purple-50/70 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200';

      if (title.includes('قانون') || title.includes('القاعدة') || title.includes('📐')) {
        icon = <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
        cardStyle = 'border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200';
      } else if (title.includes('ناتج') || title.includes('النتيجة') || title.includes('🎯')) {
        icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
        cardStyle = 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
      } else if (title.includes('نصيحة') || title.includes('💡') || title.includes('تنبيه') || title.includes('تكة')) {
        icon = <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
        cardStyle = 'border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200';
      }

      parts.push(
        <div
          key={`head-${idx}`}
          className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs sm:text-sm ${cardStyle} shadow-2xs mt-2`}
        >
          {icon}
          <span>{title}</span>
        </div>
      );
      return;
    }

    // 2. Final Result Callout Card
    if (trimmed.startsWith('🎯') || trimmed.includes('الناتج النهائي:') || trimmed.includes('الإجابة النهائية:')) {
      parts.push(
        <div
          key={`result-${idx}`}
          className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 font-bold space-y-1 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Award className="w-4 h-4" />
            <span>النتيجة الصحيحة والمؤكدة:</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-800 dark:text-emerald-100 font-extrabold pr-1">
            {trimmed.replace(/^🎯\s*/, '')}
          </p>
        </div>
      );
      return;
    }

    // 3. Tip / Golden Advice Card ("تكة الامتحان")
    if (trimmed.startsWith('💡') || trimmed.includes('تكة امتحان') || trimmed.includes('نصيحة ذهبية')) {
      parts.push(
        <div
          key={`tip-${idx}`}
          className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 flex items-start gap-2.5 text-xs sm:text-sm shadow-xs"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">
            {trimmed.replace(/^💡\s*/, '')}
          </div>
        </div>
      );
      return;
    }

    // 4. Numbered Steps or Bullet Lists
    const lines = trimmed.split('\n');
    if (lines.length > 1 && lines.some((l) => /^\s*(\d+|[٠-٩]+|[*-])[\.\)]\s*/.test(l))) {
      parts.push(
        <div key={`list-${idx}`} className="space-y-1.5 my-1.5">
          {lines.map((line, lIdx) => {
            const stepMatch = line.match(/^\s*(\d+|[٠-٩]+)[\.\)]\s*(.*)$/);
            const bulletMatch = line.match(/^\s*[*-]\s*(.*)$/);

            if (stepMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {stepMatch[1]}
                  </span>
                  <p className="flex-1 text-slate-800 dark:text-slate-200 leading-relaxed">
                    {renderBoldText(stepMatch[2])}
                  </p>
                </div>
              );
            }

            if (bulletMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pr-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                  <p className="flex-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                    {renderBoldText(bulletMatch[1])}
                  </p>
                </div>
              );
            }

            return (
              <p key={lIdx} className="text-slate-800 dark:text-slate-200 leading-relaxed">
                {renderBoldText(line)}
              </p>
            );
          })}
        </div>
      );
      return;
    }

    // 5. Normal paragraph
    parts.push(
      <p key={`p-${idx}`} className="text-slate-800 dark:text-slate-200 leading-relaxed">
        {renderBoldText(trimmed)}
      </p>
    );
  });

  return (
    <div className={`space-y-3 text-xs sm:text-sm leading-relaxed ${className}`}>
      {parts}
    </div>
  );
};

// Subscript numbers in chemical formulas (H2O -> H₂O, Fe2O3 -> Fe₂O₃)
function renderChemicalFormula(formula: string): React.ReactNode {
  return formula;
}

// Helper to parse **bold** text and render clean span tags with styled contrast
function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-extrabold text-purple-700 dark:text-purple-300 px-0.5">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
