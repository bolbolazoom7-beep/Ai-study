/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  FileQuestion,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  BookOpen,
  MessageSquare,
  ImagePlus,
  Camera,
  Trash2,
  SlidersHorizontal,
  Flame,
  Check,
} from 'lucide-react';
import { Quiz, QuizDifficulty, QuizQuestion } from '../types.ts';
import { fileToDataUrl, compressImageDataUrl } from '../utils/image.ts';
import { THANAWYA_EXAM_BANK, getFallbackQuiz } from '../utils/quizParser.ts';
import {
  enhanceAndColorizeSvg,
  buildColorfulCircuitSvg,
  buildColorfulMagneticFieldSvg,
  buildColorfulDnaSvg,
  buildColorfulChemistrySvg,
  buildColorfulGalvanicCellSvg,
} from '../utils/scientificIllustrator.ts';

interface QuizScreenProps {
  quizzes: Quiz[];
  onSaveQuiz: (quiz: Quiz) => void;
  onGenerateQuiz: (
    topic: string,
    count: number,
    content?: string,
    difficulty?: QuizDifficulty,
    images?: string[]
  ) => Promise<Quiz | null>;
  onAskTutorAboutMistakes: (quiz: Quiz) => void;
  initialTopic?: string;
}

// Built-in authentic Thanawya Amma quizzes with real diagrams
const THANAWYA_STARTER_QUIZZES: Quiz[] = [
  {
    id: 'starter-physics-3sec',
    title: 'فيزياء 3 ثانوي: قانون أوم للدائرة المغلقة وقوانين كيرشوف',
    subject: 'الفيزياء',
    difficulty: 'thanawya_standard',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'في الدائرة الكهربية الموضحة بالشكل: إذا كانت القوة الدافعة الكهربية للبطارية VB = 12V ومقاومتها الداخلية r = 1Ω، والمقاومة الخارجية R = 5Ω، فما قراءة الفولتميتر بين طرفي البطارية؟',
        options: ['10 فولت', '12 فولت', '2 فولت', '6 فولت'],
        correctAnswer: 0,
        explanation: 'شدة التيار الكلي I = VB ÷ (R + r) = 12 ÷ (5 + 1) = 2 أمبير. قراءة الفولتميتر بين طرفي البطارية V = VB - (I × r) = 12 - (2 × 1) = 10V.',
        diagramSvg: buildColorfulCircuitSvg({ vb: '12V', r: '1Ω', R: '5Ω', vReading: '10V', iReading: '2A' }),
        diagramDescription: 'دائرة كهربية مغلقة ملونة توضح بطارية ومقاومة بألوان الكود وفولتميتر رقمي',
      },
      {
        id: 'q2',
        question: 'سلك مستقيم يمر به تيار كهربي شدته 4A وموضوع عمودياً في فيض مغناطيسي كثافته 0.5T، فإذا كان طول السلك 50cm، فما القوة المغناطيسية المؤثرة عليه؟',
        options: ['1 نيوتن', '2 نيوتن', '0.5 نيوتن', '4 نيوتن'],
        correctAnswer: 0,
        explanation: 'القوة المغناطيسية F = B × I × L × sin(90) = 0.5 × 4 × 0.5 × 1 = 1 نيوتن.',
        diagramSvg: buildColorfulMagneticFieldSvg({ bField: '0.5 T', current: '4 A', length: '0.5 m', force: '1 N' }),
        diagramDescription: 'سلك مستقيم يمر به تيار في مجال مغناطيسي عمودي للداخل مع اتجاه القوة F',
      },
    ],
  },
  {
    id: 'starter-biology-3sec',
    title: 'أحياء 3 ثانوي: تركيب DNA والبيولوجيا الجزيئية',
    subject: 'الأحياء',
    difficulty: 'high_achievers',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'qb1',
        question: 'في عينة من قطعة لولب مزدوج لـ DNA تحتوي على 600 قاعدة نيتروجينية، إذا كانت نسبة الثايمين (T) تمثل 20%، فكم يكون عدد قواعد الجوانين (G)؟',
        options: ['180 قاعدة', '120 قاعدة', '240 قاعدة', '60 قاعدة'],
        correctAnswer: 0,
        explanation: 'نسبة A = T = 20%، إذن مجموعهما = 40%. النسبة المتبقية لـ (G + C) = 60%. وبما أن G = C، فإن نسبة الجوانين G = 30%. عدد قواعد G = 600 × 30% = 180 قاعدة.',
        diagramSvg: buildColorfulDnaSvg({ adenine: '20%', thymine: '20%', guanine: '30%', cytosine: '30%' }),
        diagramDescription: 'توزيع القواعد النيتروجينية في لولب مزدوج لـ DNA وتكامل القواعد.',
      },
    ],
  },
];

export const QuizScreen: React.FC<QuizScreenProps> = ({
  quizzes,
  onSaveQuiz,
  onGenerateQuiz,
  onAskTutorAboutMistakes,
  initialTopic = '',
}) => {
  const [topicInput, setTopicInput] = useState(initialTopic);
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('thanawya_standard');
  const [lessonImage, setLessonImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const raw = await fileToDataUrl(file);
    const compressed = await compressImageDataUrl(raw, 1200, 1200, 0.85);
    setLessonImage(compressed);
  };

  const handleStartGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!topicInput.trim() && !lessonImage) || isGenerating) return;

    setIsGenerating(true);
    try {
      const generated = await onGenerateQuiz(
        topicInput.trim() || 'امتحان من صفحة الدرس المرفقة',
        questionCount,
        undefined,
        difficulty,
        lessonImage ? [lessonImage] : []
      );
      if (generated && generated.questions && generated.questions.length > 0) {
        startQuiz(generated);
      } else {
        const fallback = getFallbackQuiz(topicInput);
        startQuiz(fallback);
      }
    } catch {
      const fallback = getFallbackQuiz(topicInput);
      startQuiz(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswersMap({});
    setIsAnswerSubmitted(false);
    setIsQuizCompleted(false);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !activeQuiz) return;
    setIsAnswerSubmitted(true);
    setAnswersMap((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedAnswer,
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate final score
      let correct = 0;
      activeQuiz.questions.forEach((q, idx) => {
        const userAns = answersMap[idx] !== undefined ? answersMap[idx] : selectedAnswer;
        if (userAns === q.correctAnswer) {
          correct++;
        }
      });
      const updatedQuiz: Quiz = {
        ...activeQuiz,
        userAnswers: { ...answersMap, [currentQuestionIndex]: selectedAnswer! },
        score: correct,
        completed: true,
      };
      setActiveQuiz(updatedQuiz);
      onSaveQuiz(updatedQuiz);
      setIsQuizCompleted(true);
    }
  };

  const currentQ: QuizQuestion | undefined = activeQuiz?.questions[currentQuestionIndex];

  // Priority: Curated Thanawya Amma exam bank first with latest rich colorful diagrams
  const allQuizzes = [
    ...Object.values(THANAWYA_EXAM_BANK),
    ...quizzes.filter((q) => !Object.values(THANAWYA_EXAM_BANK).some((b) => b.id === q.id || b.title === q.title) && q.id !== 'starter-physics-3sec' && q.id !== 'starter-biology-3sec'),
  ];

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto max-w-2xl mx-auto w-full px-3 sm:px-4 pt-3 pb-36">
      {/* Hidden file inputs for lesson photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageAttach}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageAttach}
        className="hidden"
      />

      {/* When in Active Quiz Player */}
      {activeQuiz && currentQ && !isQuizCompleted ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Quiz Top Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              ← إنهاء الاختبار
            </button>
            <div className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
              سؤال {currentQuestionIndex + 1} من {activeQuiz.questions.length}
            </div>
          </div>

          {/* Question Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>{activeQuiz.subject} • الصف الثالث الثانوي</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                امتحان وزاري
              </span>
            </div>

            {/* Visual SVG Diagram if available */}
            {currentQ.diagramSvg && (
              <div className="my-2.5 p-2 bg-slate-900 rounded-2xl border border-purple-500/30 flex flex-col items-center justify-center overflow-hidden shadow-md">
                <div
                  className="w-full flex items-center justify-center max-h-56 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: enhanceAndColorizeSvg(currentQ.diagramSvg, activeQuiz.subject) }}
                />
                {currentQ.diagramDescription && (
                  <span className="text-[11px] font-bold text-purple-300/80 mt-1.5 text-center">
                    {currentQ.diagramDescription}
                  </span>
                )}
              </div>
            )}

            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Multiple Choice Options */}
            <div className="space-y-2 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = currentQ.correctAnswer === idx;

                let btnStyle =
                  'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:border-purple-300';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-600/20';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-2xl border text-start text-xs sm:text-sm transition-all flex items-center justify-between active:scale-[0.99] ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mr-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer is submitted */}
            {isAnswerSubmitted && (
              <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs sm:text-sm text-purple-950 dark:text-purple-200 space-y-1 animate-fadeIn">
                <div className="font-extrabold flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                  <Sparkles className="w-4 h-4" />
                  <span>تفسير الإجابة النموذجية:</span>
                </div>
                <p className="leading-relaxed pr-1">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next / Submit Button */}
            <div className="pt-2">
              {!isAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={selectedAnswer === null}
                  onClick={handleSubmitAnswer}
                  className="w-full h-11 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center transition-all active:scale-95 shadow-md"
                >
                  تأكيد الإجابة
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
                >
                  <span>
                    {currentQuestionIndex + 1 < activeQuiz.questions.length ? 'السؤال التالي ←' : 'عرض النتيجة النهائية 🏆'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : activeQuiz && isQuizCompleted ? (
        /* Final Scorecard */
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-lg animate-slideUp">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              أحسنت يا بطل! أنهيت الاختبار
            </h2>
            <p className="text-xs text-slate-500 mt-1">{activeQuiz.title}</p>
          </div>

          {/* Score display */}
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {activeQuiz.score} / {activeQuiz.questions.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">
              {activeQuiz.score === activeQuiz.questions.length
                ? 'ممتاز! درجة نهائية مطابقة لأوائل الثانوية العامة 🌟'
                : 'أداء رائع! راجع الأسئلة التي أخطأت فيها مع الأستاذ الآن.'}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => onAskTutorAboutMistakes(activeQuiz)}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>شرح الأخطاء بالشات</span>
            </button>
            <button
              type="button"
              onClick={() => startQuiz(activeQuiz)}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setActiveQuiz(null)}
            className="text-xs text-slate-500 hover:underline pt-2 block mx-auto"
          >
            ← العودة للاختبارات الأخرى
          </button>
        </div>
      ) : (
        /* Quiz Generator & Topic Selection Screen */
        <div className="space-y-4 animate-fadeIn">
          {/* Header */}
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-purple-600" />
              <span>بنك اختبارات الصف الثالث الثانوي</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              صوّر صفحة درس، أو اكتب الموضوع لإنشاء اختبار مطابق لامتحانات الثانوية العامة مع رسومات توضيحية.
            </p>
          </div>

          {/* Generator Form */}
          <form
            onSubmit={handleStartGenerate}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                موضوع الاختبار أو الفصل الدراسي:
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="مثال: قوانين كيرشوف، الاتزان الكيميائي، أو التكاثر في الإنسان..."
                className="w-full h-10 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-purple-600"
              />
              {/* Quick Thanawya Subject Pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: '⚡ فيزياء (كيرشوف وأوم)', val: 'فيزياء 3 ثانوي: قانون أوم وكيرشوف' },
                  { label: '🧪 كيمياء (معادلات الحديد)', val: 'كيمياء 3 ثانوي: تفاعلات الحديد والكيمياء العضوية' },
                  { label: '🧬 أحياء (DNA والمناعة)', val: 'أحياء 3 ثانوي: تركيب جزيء DNA والبيولوجيا الجزيئية' },
                  { label: '📐 رياضيات (تفاضل وتكامل)', val: 'رياضيات 3 ثانوي: التفاضل والتكامل' },
                  { label: '🇬🇧 إنجليزي (قواعد ومفردات)', val: 'لغة إنجليزية 3 ثانوي: نماذج الوزارة' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopicInput(item.val)}
                    className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-[11px] font-bold text-purple-700 dark:text-purple-300 transition-all active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo of Lesson / Textbook Page (ثالثاً: ميزة رفع صورة لدرس) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                أو ارفع صورة لصفحة درس / مسألة لتوليد الأسئلة منها:
              </label>
              {lessonImage ? (
                <div className="relative inline-block mt-1">
                  <img
                    src={lessonImage}
                    alt="Lesson preview"
                    className="w-24 h-24 object-cover rounded-2xl border-2 border-purple-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setLessonImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-md"
                  >
                    ×
                  </button>
                  <span className="block text-[10px] text-emerald-600 font-bold mt-1">
                    تم إرفاق صفحة الدرس ✅
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-9 px-3 rounded-xl border border-dashed border-purple-400 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/50 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>تصوير صفحة بالكاميرا</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-9 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>رفع من الصور</span>
                  </button>
                </div>
              )}
            </div>

            {/* Question Count & Difficulty Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Question Count */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عدد الأسئلة:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`h-8 rounded-xl border text-xs font-bold transition-all ${
                        questionCount === num
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {num} أسئلة
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  مستوى الصعوبة:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'ministry_direct', label: 'مباشر' },
                    { id: 'thanawya_standard', label: 'امتحانات' },
                    { id: 'high_achievers', label: 'متفوقين' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id as QuizDifficulty)}
                      className={`h-8 rounded-xl border text-[11px] font-bold transition-all ${
                        difficulty === d.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Generate Button */}
            <button
              type="submit"
              disabled={(!topicInput.trim() && !lessonImage) || isGenerating}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md shadow-purple-600/25 mt-2"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{isGenerating ? 'جاري إعداد الأسئلة والرسومات في ثوانٍ...' : 'توليد اختبار الثانوية العامة الآن 🚀'}</span>
            </button>
          </form>

          {/* Pre-built Starter Thanawya Amma Quizzes with Diagrams */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>نماذج امتحانات الوزارة الجاهزة (مع رسومات توضيحية):</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {allQuizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  type="button"
                  onClick={() => startQuiz(quiz)}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] shadow-xs text-start"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mb-0.5">
                      {quiz.subject} • {quiz.questions.length} أسئلة
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors truncate">
                      {quiz.title}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 shrink-0 mr-2 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    ابدأ ⚡
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
