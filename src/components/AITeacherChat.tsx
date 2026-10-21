/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  ImagePlus,
  Mic,
  Copy,
  Volume2,
  VolumeX,
  Trash2,
  Plus,
  Check,
  Bot,
  User,
  Sparkles,
  Edit2,
  X,
  Camera,
  Layers,
  GraduationCap,
  Heart,
  ArrowDown,
} from 'lucide-react';
import { Conversation, ChatMessage, ArabicDialect, SavedExplanation } from '../types.ts';
import { fileToDataUrl, compressImageDataUrl } from '../utils/image.ts';
import { FormattedStudyContent } from './FormattedStudyContent.tsx';
import { playInstantSpeech, stopInstantSpeech } from '../utils/speech.ts';

interface AITeacherChatProps {
  conversation: Conversation;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onSendMessage: (text: string, images?: string[]) => Promise<void>;
  onSaveToLibrary: (item: SavedExplanation) => void;
  onStartVoice: () => void;
  isGenerating: boolean;
  onStopGeneration: () => void;
  dialect: ArabicDialect;
  onQuickScan: () => void;
}

export const AITeacherChat: React.FC<AITeacherChatProps> = ({
  conversation,
  conversations,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  onSendMessage,
  onSaveToLibrary,
  onStartVoice,
  isGenerating,
  onStopGeneration,
  onQuickScan,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleText, setNewTitleText] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(conversation.messages.length > 1 ? 'smooth' : 'auto');
  }, [conversation.messages.length, isGenerating]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopInstantSpeech();
    };
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 150);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && attachedImages.length === 0) || isGenerating) return;

    const textToSend = inputText.trim();
    const imagesToSend = attachedImages.length > 0 ? [...attachedImages] : undefined;

    setInputText('');
    setAttachedImages([]);
    await onSendMessage(textToSend, imagesToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const raw = await fileToDataUrl(file);
      const compressed = await compressImageDataUrl(raw, 1200, 1200, 0.85);
      setAttachedImages((prev) => [...prev, compressed]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Instant zero-lag audio playback (starts immediately with 0 delay)
  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      stopInstantSpeech();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msgId);
    try {
      const started = await playInstantSpeech(text, {
        onStart: () => setPlayingAudioId(msgId),
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

  const handleSaveMessage = (msg: ChatMessage) => {
    onSaveToLibrary({
      id: `saved-${Date.now()}`,
      title: conversation.title || 'شرح درس من الأستاذ',
      markdown: msg.text,
      date: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
      images: msg.images,
      subject: 'الثانوية العامة',
    });
    setSavedId(msg.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const thanawyaPrompts = [
    {
      title: '⚡ فيزياء 3 ثانوي: قانون كيرشوف',
      prompt: 'اشرح لي قانون كيرشوف الأول والثاني في الدوائر الكهربية وكيف أطبقهم على مسائل امتحان الثانوية العامة خطوة بخطوة:',
    },
    {
      title: '🧪 كيمياء 3 ثانوي: معادلات الحديد',
      prompt: 'لخص لي مخطط تحويلات وتفاعلات أكاسيد الحديد في الباب الأول كيمياء 3 ثانوي بأبسط طريقة:',
    },
    {
      title: '🧬 أحياء 3 ثانوي: تضاعف DNA',
      prompt: 'وضح لي خطوات تضاعف DNA والإنزيمات المشاركة (اللولب، البلمرة، الربط) مع تكات الامتحان:',
    },
    {
      title: '📐 رياضيات: تفاضل وتكامل',
      prompt: 'حل لي مسألة معدلات زمنية مرتبطة أو تطبيقات على القيم العظمى والصغرى بالتفصيل:',
    },
  ];

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col max-w-3xl mx-auto w-full relative overflow-hidden bg-slate-50/50 dark:bg-transparent">
      {/* Hidden image input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAttachImage}
        className="hidden"
        aria-hidden="true"
      />

      {/* Top Bar inside Chat */}
      <div className="px-3 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md flex items-center justify-between gap-2 shrink-0 z-10">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDrawer(!showDrawer)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all active:scale-95 shadow-2xs"
            aria-label="سجل المحادثات"
          >
            <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="truncate max-w-[130px] sm:max-w-[180px]">
              {conversation.title || 'محادثة المذاكرة'}
            </span>
          </button>

          <button
            type="button"
            onClick={onNewConversation}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-all active:scale-95 shadow-2xs"
            title="محادثة جديدة"
            aria-label="New chat"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Camera Action */}
        <button
          type="button"
          onClick={onQuickScan}
          className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>صوّر مسألة</span>
        </button>
      </div>

      {/* Conversations Drawer Modal */}
      {showDrawer && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-start animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#0E131F] border-b border-slate-200 dark:border-slate-800 p-4 shadow-2xl rounded-b-3xl animate-slideUp">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>محادثاتك السابقة</span>
              </span>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {conversations.map((c) => {
                const isSelected = c.id === conversation.id;
                return (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    {editingTitleId === c.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={newTitleText}
                          onChange={(e) => setNewTitleText(e.target.value)}
                          className="flex-1 h-7 px-2 text-xs rounded bg-white dark:bg-slate-950 border border-purple-500 text-slate-900 dark:text-white outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newTitleText.trim()) onRenameConversation(c.id, newTitleText.trim());
                            setEditingTitleId(null);
                          }}
                          className="p-1 rounded text-emerald-600 hover:text-emerald-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectConversation(c.id);
                          setShowDrawer(false);
                        }}
                        className="text-start flex-1 truncate text-xs mr-2"
                      >
                        {c.title}
                      </button>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTitleId(c.id);
                          setNewTitleText(c.title);
                        }}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        title="تعديل العنوان"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {conversations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteConversation(c.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-500"
                          title="حذف المحادثة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Message History Container (Scrollable Area) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 space-y-3.5"
      >
        {/* Empty state greeting */}
        {conversation.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-4 px-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-2 shadow-md shadow-purple-600/25">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-0.5">
              أهلاً بك يا بطل الثانوية العامة! 🎓
            </h2>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[11px] font-bold mb-3 border border-purple-200 dark:border-purple-800">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>مصنوع بواسطة بلال أحمد</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-3">
              أستاذك في مواد 3 ثانوي: اكتب سؤالك بالأسفل أو صوّر المسألة مباشرة وهشرحهالك خطوة بخطوة.
            </p>

            {/* Quick Thanawya Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {thanawyaPrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(item.prompt);
                    chatInputRef.current?.focus();
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600 text-start text-xs font-bold text-slate-800 dark:text-slate-200 transition-all active:scale-95 shadow-2xs flex items-center justify-between"
                >
                  <span className="line-clamp-1">{item.title}</span>
                  <span className="text-purple-600 dark:text-purple-400 text-sm shrink-0 mr-1">←</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Bubbles */}
        {conversation.messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-2 max-w-[96%] sm:max-w-[88%] animate-slideUp ${
                isUser ? 'mr-auto flex-row' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                  isUser
                    ? 'bg-purple-700 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-500/20 shadow-md'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>

              {/* Bubble Body */}
              <div
                className={`p-3 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed transition-all shadow-xs ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-xs shadow-purple-600/10'
                    : 'bg-white dark:bg-[#0E131F] text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/90 dark:border-slate-800/90 shadow-sm'
                }`}
              >
                {/* User Images if any */}
                {msg.images && msg.images.length > 0 && (
                  <div className="flex gap-2 mb-2.5 overflow-x-auto pb-1">
                    {msg.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Question attachment"
                        className="w-32 h-32 object-cover rounded-2xl border-2 border-white/30 shadow-md cursor-pointer hover:opacity-95"
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                {isUser ? (
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                ) : (
                  <div className="space-y-2">
                    <FormattedStudyContent content={msg.text} />
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-purple-600 dark:bg-purple-400 animate-cursorBlink rounded-xs mr-1 align-middle" />
                    )}
                  </div>
                )}

                {/* Actions for Assistant Message */}
                {!isUser && !msg.isStreaming && msg.text && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors active:scale-95"
                      title="نسخ الشرح"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'تم النسخ' : 'نسخ'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePlayAudio(msg.id, msg.text)}
                      className={`hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors active:scale-95 ${
                        playingAudioId === msg.id ? 'text-purple-600 dark:text-purple-400 font-bold' : ''
                      }`}
                      title="استماع صوتي فوري بدون انتظار"
                    >
                      {playingAudioId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{playingAudioId === msg.id ? 'إيقاف' : 'استماع فوري'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveMessage(msg)}
                      className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors active:scale-95"
                      title="حفظ في مكتبتي"
                    >
                      {savedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <GraduationCap className="w-3.5 h-3.5" />}
                      <span>{savedId === msg.id ? 'تم الحفظ' : 'حفظ'}</span>
                    </button>

                    <span className="mr-auto text-[10px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Real-time Loading Indicator */}
        {isGenerating && (!conversation.messages.length || !conversation.messages[conversation.messages.length - 1].isStreaming) && (
          <div className="flex gap-2 max-w-[80%] ml-auto flex-row-reverse animate-fadeIn">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-xs flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-semibold text-slate-500">الأستاذ يجهز الإجابة النموذجية...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating scroll to bottom button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          className="absolute bottom-20 left-4 z-20 w-8 h-8 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-500 active:scale-95 transition-all animate-bounce"
          title="الانتقال لآخر رسالة"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* 
        Chat Input Dock:
        Pinned, high-contrast, fully visible above bottom navigation, never cut off
      */}
      <div className="shrink-0 p-2 sm:p-3 border-t-2 border-purple-500/20 dark:border-purple-600/30 bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-30">
        {/* Attached previews */}
        {attachedImages.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {attachedImages.map((img, idx) => (
              <div key={idx} className="relative group shrink-0">
                <img
                  src={img}
                  alt="Attachment preview"
                  className="w-14 h-14 object-cover rounded-xl border-2 border-purple-500 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setAttachedImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md text-xs hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-1.5 sm:gap-2">
          {/* Action buttons: Attach image and Voice */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-slate-700 hover:text-purple-600 dark:text-slate-200 dark:hover:text-purple-400 bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-2xs"
              title="إرفاق صورة مسألة أو صفحة كتاب"
            >
              <ImagePlus className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            <button
              type="button"
              onClick={onStartVoice}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-slate-700 hover:text-purple-600 dark:text-slate-200 dark:hover:text-purple-400 bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center transition-all active:scale-95 shrink-0 shadow-2xs"
              title="سؤال صوتي فوري للأستاذ"
            >
              <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* Text Area Input */}
          <div className="flex-1 relative">
            <textarea
              ref={chatInputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك، مسألتك، أو ما تريد فهمه في 3 ثانوي هنا..."
              rows={1}
              className="w-full resize-none max-h-24 min-h-[42px] px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all leading-relaxed shadow-inner"
            />
          </div>

          {/* Send / Stop Button */}
          <div className="shrink-0">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="w-10 h-10 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all active:scale-95 shadow-md shadow-red-600/30"
                title="إيقاف التوليد"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputText.trim() && attachedImages.length === 0}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95 shadow-md shadow-purple-600/30"
                title="إرسال السؤال للأستاذ"
              >
                <Send className="w-4 h-4 transform rotate-180" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
