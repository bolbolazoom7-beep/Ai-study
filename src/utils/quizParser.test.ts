import test from 'node:test';
import assert from 'node:assert/strict';
import { safeParseQuizJson, determineSubject, THANAWYA_EXAM_BANK } from './quizParser.ts';

test('determineSubject correctly identifies physics, chemistry, biology, math', () => {
  assert.equal(determineSubject('قانون أوم للدائرة المغلقة'), 'فيزياء');
  assert.equal(determineSubject('تفاعلات الحديد والأكاسيد'), 'كيمياء');
  assert.equal(determineSubject('تركيب جزيء DNA'), 'أحياء');
  assert.equal(determineSubject('التفاضل والتكامل'), 'رياضيات');
  assert.equal(determineSubject('English Grammar'), 'لغة إنجليزية');
});

test('safeParseQuizJson parses valid JSON response from Gemini', () => {
  const sampleJson = JSON.stringify({
    title: 'اختبار فيزياء',
    subject: 'فيزياء',
    questions: [
      {
        id: 'q1',
        question: 'ما هي وحدة قياس القوة؟',
        options: ['نيوتن', 'جول', 'فولت', 'أوم'],
        correctAnswer: 0,
        explanation: 'النيوتن هو وحدة قياس القوة.'
      }
    ]
  });

  const parsed = safeParseQuizJson(sampleJson);
  assert.equal(parsed.title, 'اختبار فيزياء');
  assert.equal(parsed.questions.length, 1);
  assert.equal(parsed.questions[0].correctAnswer, 0);
});

test('safeParseQuizJson handles raw newlines in SVGs and markdown fences', () => {
  const rawWithSvgAndNewlines = `\`\`\`json
{
  "title": "اختبار الكهربية",
  "subject": "فيزياء",
  "questions": [
    {
      "id": "q1",
      "question": "احسب شدة التيار في الدائرة؟",
      "options": ["2A", "4A", "6A", "8A"],
      "correctAnswer": 0,
      "explanation": "القانون I = V / R.",
      "diagramSvg": "<svg viewBox='0 0 100 100'>\\n  <circle cx='50' cy='50' r='20' />\\n</svg>"
    }
  ]
}
\`\`\``;

  const parsed = safeParseQuizJson(rawWithSvgAndNewlines);
  assert.equal(parsed.title, 'اختبار الكهربية');
  assert.equal(parsed.questions.length, 1);
  assert.ok(parsed.questions[0].diagramSvg?.includes('<svg'));
});

test('safeParseQuizJson gracefully falls back to authentic Thanawya exam if input is invalid', () => {
  const invalidJson = 'This is not json at all';
  const parsed = safeParseQuizJson(invalidJson, 'كيمياء');
  assert.equal(parsed.subject, 'كيمياء');
  assert.ok(parsed.questions.length >= 2);
  assert.ok(parsed.questions[0].options.length === 4);
});
