/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Quiz, QuizDifficulty, QuizQuestion } from '../types.ts';
import {
  buildColorfulCircuitSvg,
  buildColorfulMagneticFieldSvg,
  buildColorfulGalvanicCellSvg,
  buildColorfulChemistrySvg,
  buildColorfulBenzeneSvg,
  buildColorfulDnaSvg,
  buildColorfulSarcomereSvg,
  buildColorfulCalculusSvg,
  generateColorfulDiagram,
  enhanceAndColorizeSvg,
} from './scientificIllustrator.ts';

/**
 * Authentic question bank for Egyptian Thanawya Amma (الصف الثالث الثانوي)
 * Enhanced with rich, vibrant, high-definition colorful scientific SVG diagrams.
 */
export const THANAWYA_EXAM_BANK: Record<string, Quiz> = {
  physics: {
    id: 'thanawya-physics-final',
    title: 'امتحان مادة الفيزياء - الثانوية العامة (كهربية وفيزياء حديثة)',
    subject: 'فيزياء',
    difficulty: 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'phys-1',
        question: 'في الدائرة الكهربية الموضحة بالشكل: إذا كانت القوة الدافعة للبطارية VB = 12V ومقاومتها الداخلية r = 1Ω والمقاومة الخارجية R = 5Ω، ما هي قراءة الفولتميتر الموصل بين طرفي البطارية؟',
        options: ['10 فولت', '12 فولت', '2 فولت', '6 فولت'],
        correctAnswer: 0,
        explanation: 'التيار الكلي للدائرة: I = VB ÷ (R + r) = 12 ÷ (5 + 1) = 2 أمبير. قراءة الفولتميتر بين طرفي البطارية في حالة التفريغ: V = VB - (I × r) = 12 - (2 × 1) = 10 فولت.',
        diagramSvg: buildColorfulCircuitSvg({ vb: '12V', r: '1Ω', R: '5Ω', vReading: '10V', iReading: '2A' }),
        diagramDescription: 'دائرة كهربية مغلقة ملونة توضح بطارية ومقاومة بألوان الكود وفولتميتر رقمي',
      },
      {
        id: 'phys-2',
        question: 'سلك مستقيم يمر به تيار كهربي شدته 4 أمبير موضوع عمودياً في مجال مغناطيسي منتظم كثافة فيضه 0.5 تسلا. إذا كان طول السلك 50 سم، فإن القوة المغناطيسية المؤثرة عليه تساوي:',
        options: ['1 نيوتن', '2 نيوتن', '0.5 نيوتن', '4 نيوتن'],
        correctAnswer: 0,
        explanation: 'القوة المغناطيسية: F = B × I × L × sin(θ). حيث B = 0.5 T، I = 4 A، L = 0.5 m، و sin(90°) = 1. إذن F = 0.5 × 4 × 0.5 × 1 = 1 نيوتن.',
        diagramSvg: buildColorfulMagneticFieldSvg({ bField: '0.5 T', current: '4 A', length: '0.5 m', force: '1 N' }),
        diagramDescription: 'سلك مستقيم يمر به تيار في مجال مغناطيسي عمودي للداخل مع اتجاه القوة F',
      },
      {
        id: 'phys-3',
        question: 'في تجربة الانبعاث الكهروضوئي، إذا سقط ضوء تردده أكبر من التردد الحرج لمعدن ما، ثم تضاعفت شدة الضوء الساقط، فإن طاقة الحركة العظمى للإلكترونات المنبعثة:',
        options: ['تظل ثابتة لا تتغير', 'تتضاعف', 'تزداد لأربعة أمثالها', 'تقل للنصف'],
        correctAnswer: 0,
        explanation: 'طاقة حركة الإلكترونات المنبعثة تتوقف فقط على تردد الضوء الساقط ودالة الشغل للمعدن وفق معادلة أينشتاين (KE = hν - E_w)، بينما زيادة شدة الضوء تزيد فقط من عدد الإلكترونات الكهروضوئية المنبعثة (شدة التيار الكهروضوئي) وليس طاقتها.',
        diagramSvg: buildColorfulCircuitSvg({ vb: 'hν > Ew', r: '0Ω', R: 'أنود', vReading: 'KE max', iReading: 'تيار ضوئي' }),
        diagramDescription: 'الخلية الكهروضوئية وسقوط الفوتونات وانبعاث الإلكترونات',
      },
    ],
  },
  chemistry: {
    id: 'thanawya-chemistry-final',
    title: 'امتحان مادة الكيمياء - الثانوية العامة (العناصر الانتقالية والعضوية)',
    subject: 'كيمياء',
    difficulty: 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'chem-1',
        question: 'عند تسخين كبريتات الحديد (II) بشدة يتكون أكسيد الحديد (III) ويتصاعد غازان هما:',
        options: ['ثاني أكسيد الكبريت وثالث أكسيد الكبريت', 'ثاني أكسيد الكربون والماء', 'أول أكسيد الكربون وثاني أكسيد الكربون', 'كبريتيد الهيدروجين والأكسجين'],
        correctAnswer: 0,
        explanation: 'المعادلة الكيميائية الموزونة:\n2FeSO4 --(حرارة Δ)--> Fe2O3 + SO2↑ + SO3↑\nحيث يتأكسد الحديد من +2 إلى +3 بفعل SO3 الذي يعمل كعامل مؤكسد ذاتي.',
        diagramSvg: buildColorfulChemistrySvg({
          equation: '2FeSO₄(s) ⟶ Fe₂O₃(s) + SO₂(g) + SO₃(g)',
          temperature: 'تسخين للاحمرار (Δ)',
        }),
        diagramDescription: 'مخطط تفاعل الانحلال الحراري لكبريتات الحديد مع لهب بنسن الملون',
      },
      {
        id: 'chem-2',
        question: 'أي من المركبات العضوية التالية يخضع لتفاعل الإضافة عند تفاعله مع ماء البروم الأحمر المذاب في رابع كلوريد الكربون CCl4 ويزيل لونه؟',
        options: ['الإيثين (C2H4)', 'الإيثان (C2H6)', 'الميثان (CH4)', 'البنزين العطري'],
        correctAnswer: 0,
        explanation: 'الإيثين هيدروكربون غير مشبع يحتوي على رابطة مزدوجة (C=C)، فيتفاعل مع ماء البروم الأحمر بالاضافة وتنكسر الرابطة باي π ويتكون 1,2-ثنائي برومو إيثان عديم اللون:\nCH2=CH2 + Br2 (في CCl4) -> CH2Br-CH2Br',
        diagramSvg: buildColorfulBenzeneSvg(),
        diagramDescription: 'الصيغ البنائية للهيدروكربونات الأليفاتية والعطرية',
      },
      {
        id: 'chem-3',
        question: 'في خلية دانيال الجلفانية، عند استبدال نصف خلية الخارصين بنصف خلية ماغنسيوم، فإن القوة الدافعة الكهربية للخلية (EMF):',
        options: ['تزداد لأن الماغنسيوم يسبق الخارصين في متسلسلة الجهود الكهربية', 'تقل لأن الماغنسيوم أقل نشاطاً', 'تظل ثابتة', 'تصبح صفراً'],
        correctAnswer: 0,
        explanation: 'الماغنسيوم Mg يسبق الخارصين Zn في السلسلة الكهروكيميائية، وبالتالي جهد تأكسده القياسي أكبر (+2.37V مقارنة بـ +0.76V للزنك)، مما يجعل الفرق في الجهد بين الأنود والكاثود (النحاس) أكبر فتزداد الـ EMF.',
        diagramSvg: buildColorfulGalvanicCellSvg(),
        diagramDescription: 'خلية دانيال الجلفانية والأقطاب وحركة الإلكترونات',
      },
    ],
  },
  biology: {
    id: 'thanawya-biology-final',
    title: 'امتحان مادة الأحياء - الثانوية العامة (الحركة والمناعة والـ DNA)',
    subject: 'أحياء',
    difficulty: 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'bio-1',
        question: 'عينة من جزيء DNA مزدوج تتكون من 600 زوج من القواعد النيتروجينية. إذا كانت نسبة الثايمين (T) تمثل 20%، فما هو عدد نيوكليوتيدات الجوانين (G) في هذه العينة؟',
        options: ['360 نيوكليوتيدة', '180 نيوكليوتيدة', '240 نيوكليوتيدة', '120 نيوكليوتيدة'],
        correctAnswer: 0,
        explanation: 'العدد الكلي للنيوكليوتيدات = 600 زوج = 1200 نيوكليوتيدة. بما أن A = T = 20%، فإن مجموعهما = 40%. إذن نسبة (G + C) = 60%، وبالتالي نسبة G = 30%. عدد نيوكليوتيدات الجوانين = 1200 × 30% = 360 نيوكليوتيدة.',
        diagramSvg: buildColorfulDnaSvg({ adenine: '20%', thymine: '20%', guanine: '30%', cytosine: '30%' }),
        diagramDescription: 'توزيع القواعد النيتروجينية الملون في جزيء DNA وتكامل القواعد',
      },
      {
        id: 'bio-2',
        question: 'أثناء الانقباض العضلي التام للقطعة العضلية (الـ Sarcomere)، أي من المناطق التالية ينعدم طولها تقريباً؟',
        options: ['المنطقة شبه المضيئة (H)', 'المنطقة الداكنة (A)', 'المنطقة المضيئة (I)', 'خط Z'],
        correctAnswer: 0,
        explanation: 'وفق نظرية الخيوط المنزلقة لهكسلي، عند الانقباض العضلي التام تتقارب خيوط الأكتين من بعضها البعض حتى تتلامس فوق خيوط الميوسين، فتنعدم المنطقة شبه المضيئة (H) وتتقارب خطوط Z، بينما تظل المنطقة الداكنة (A) ثابتة الطول دائماً.',
        diagramSvg: buildColorfulSarcomereSvg(),
        diagramDescription: 'مخطط القطعة العضلية وانزلاق خيوط الأكتين والميوسين',
      },
    ],
  },
  math: {
    id: 'thanawya-math-final',
    title: 'امتحان مادة الرياضيات - الثانوية العامة (التفاضل والتكامل ونهايات الدوال)',
    subject: 'رياضيات',
    difficulty: 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'math-1',
        question: 'إذا كان ميل المماس للمنحنى y = x² - 4x + 5 عند نقطة ما يساوي صفراً، فإن إحداثيات نقطة التماس هي:',
        options: ['(2, 1)', '(1, 2)', '(0, 5)', '(4, 5)'],
        correctAnswer: 0,
        explanation: 'المشتقة الأولى تمثل ميل المماس: dy/dx = 2x - 4. بوضع الميل = 0: 2x - 4 = 0 => 2x = 4 => x = 2. بالتعويض في معادلة المنحنى: y = (2)² - 4(2) + 5 = 4 - 8 + 5 = 1. إذن نقطة التماس هي (2, 1) وهي رأس المنحنى (نهاية صغرى محلية).',
        diagramSvg: buildColorfulCalculusSvg({ equation: 'y = x² - 4x + 5', slope: 'dy/dx = 0 عند (2, 1)' }),
        diagramDescription: 'منحنى الدالة التربيعية ومماس الرأس الأفقي الملون',
      },
    ],
  },
};

/**
 * Robust JSON extraction and sanitization for Quiz Generation output from Gemini.
 * Enhances any generated SVGs with rich colors and gradients.
 */
export function safeParseQuizJson(rawText: string, fallbackTopic?: string): Quiz {
  if (!rawText || typeof rawText !== 'string') {
    return getFallbackQuiz(fallbackTopic);
  }

  // 1. Strip markdown code fences
  let cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // 2. Find outermost JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 3. First attempt: standard JSON.parse
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return sanitizeQuizFields(parsed, fallbackTopic);
    }
  } catch {}

  // 4. Second attempt: repair unescaped newlines inside strings and bad backslashes
  try {
    const fixedBackslashes = cleaned.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    let inString = false;
    let stringChar = '';
    let repaired = '';

    for (let i = 0; i < fixedBackslashes.length; i++) {
      const char = fixedBackslashes[i];
      const prev = i > 0 ? fixedBackslashes[i - 1] : '';

      if ((char === '"' || char === "'") && prev !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (inString && (char === '\n' || char === '\r')) {
        repaired += '\\n';
      } else {
        repaired += char;
      }
    }

    const parsed = JSON.parse(repaired);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return sanitizeQuizFields(parsed, fallbackTopic);
    }
  } catch {}

  // 5. Fallback to curated exam if all else fails
  return getFallbackQuiz(fallbackTopic);
}

function sanitizeQuizFields(parsed: any, fallbackTopic?: string): Quiz {
  const subject = parsed.subject || determineSubject(fallbackTopic || '');
  return {
    id: parsed.id || `quiz-${Date.now()}`,
    title: parsed.title || `اختبار الثانوية العامة: ${fallbackTopic || 'شامل'}`,
    subject,
    difficulty: parsed.difficulty || 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: parsed.questions.map((q: any, i: number) => {
      let finalSvg = q.diagramSvg && q.diagramSvg.includes('<svg') ? enhanceAndColorizeSvg(q.diagramSvg, subject) : undefined;

      // Smart Visual Infusion: Generate authentic colorful vector diagram
      if (!finalSvg) {
        finalSvg = generateColorfulDiagram(
          q.diagramType,
          q.diagramParams || {},
          subject,
          `${q.question || ''} ${q.explanation || ''}`
        );
      }

      return {
        id: q.id || `q-${i + 1}`,
        question: q.question || 'سؤال امتحاني من نماذج الوزارة',
        options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['أ) خيار 1', 'ب) خيار 2', 'ج) خيار 3', 'د) خيار 4'],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || 'التفسير العلمي للحل مدعم بقوانين كتاب الوزارة.',
        diagramSvg: finalSvg,
        diagramDescription: q.diagramDescription || (finalSvg ? 'رسم توضيحي علمي ملون عالي الدقة' : undefined),
      };
    }),
  };
}

export function determineSubject(text: string): string {
  const t = (text || '').toLowerCase();
  if (t.includes('فيزيا') || t.includes('أوم') || t.includes('كيرشوف') || t.includes('كهرب') || t.includes('دينامو') || t.includes('فاراداي')) {
    return 'فيزياء';
  }
  if (t.includes('كيميا') || t.includes('عضو') || t.includes('حديد') || t.includes('تفاعل') || t.includes('معادل') || t.includes('غاز')) {
    return 'كيمياء';
  }
  if (t.includes('أحياء') || t.includes('dna') || t.includes('مناع') || t.includes('وراث') || t.includes('خلية') || t.includes('عضل')) {
    return 'أحياء';
  }
  if (t.includes('رياض') || t.includes('تفاضل') || t.includes('تكامل') || t.includes('جبر') || t.includes('هندس') || t.includes('ميكانيك')) {
    return 'رياضيات';
  }
  if (t.includes('انجليز') || t.includes('english') || t.includes('grammar')) {
    return 'لغة إنجليزية';
  }
  if (t.includes('عرب') || t.includes('نحو') || t.includes('بلاغ')) {
    return 'لغة عربية';
  }
  return 'فيزياء';
}

export function getFallbackQuiz(topic?: string): Quiz {
  const subject = determineSubject(topic || '');
  if (subject === 'كيمياء') return { ...THANAWYA_EXAM_BANK.chemistry, id: `quiz-${Date.now()}` };
  if (subject === 'أحياء') return { ...THANAWYA_EXAM_BANK.biology, id: `quiz-${Date.now()}` };
  if (subject === 'رياضيات') return { ...THANAWYA_EXAM_BANK.math, id: `quiz-${Date.now()}` };
  return { ...THANAWYA_EXAM_BANK.physics, id: `quiz-${Date.now()}` };
}
