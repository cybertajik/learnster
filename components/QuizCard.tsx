'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RotateCw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion, UserSettings } from '@/types/vocabulary';
import { ImageDisplay } from './ImageDisplay';
import { playCorrectSound, playIncorrectSound, speakSpanishWord } from '@/lib/audio';

interface QuizCardProps {
  question: QuizQuestion;
  settings: UserSettings;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  settings,
  onAnswer,
  onNext,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { word, options, correctAnswer } = question;

  // Reset local card state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);

    // Speak Spanish word on load if both speech and sound are enabled
    if (settings.speechEnabled && settings.soundEnabled) {
      speakSpanishWord(word.spanish, settings.soundEnabled);
    }
  }, [question, settings.speechEnabled, settings.soundEnabled]);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered) return;

      const correct = option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      setSelectedOption(option);
      setIsAnswered(true);
      setIsCorrect(correct);

      if (correct) {
        playCorrectSound(settings.soundEnabled);
        try {
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'],
          });
        } catch (e) {
          // Ignore confetti errors if canvas fails
        }
      } else {
        playIncorrectSound(settings.soundEnabled);
      }

      onAnswer(correct);
    },
    [isAnswered, correctAnswer, settings.soundEnabled, onAnswer]
  );

  // Keyboard shortcut listener (1-4 keys for selection, Enter for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!isAnswered) {
        if (e.key === '1' && options[0]) handleSelectOption(options[0]);
        if (e.key === '2' && options[1]) handleSelectOption(options[1]);
        if (e.key === '3' && options[2]) handleSelectOption(options[2]);
        if (e.key === '4' && options[3]) handleSelectOption(options[3]);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, options, handleSelectOption, onNext]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-slate-950/60 transition-all flex flex-col items-center">
      {/* Top Level & Part of Speech Badge */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/20 dark:border-rose-500/30">
            {word.level}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 capitalize">
            {word.partOfSpeech}
          </span>
        </div>

        {/* Speaker icon with repeat loop arrow */}
        <button
          onClick={() => speakSpanishWord(word.spanish, settings.soundEnabled)}
          className="p-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700/80 shadow-sm"
          title="Repeat pronunciation"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4 text-rose-500" />
            <RotateCw className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-500 stroke-[2.5]" />
          </div>
          <span className="hidden sm:inline">Repeat</span>
        </button>
      </div>

      {/* Target Spanish Word (Shifted higher up, prompt text removed) */}
      <div className="text-center mt-0 mb-3">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white capitalize">
          {word.spanish}
        </h2>
      </div>

      {/* Image Container */}
      {settings.imagesEnabled && <ImageDisplay image={word.image} wordSpanish={word.spanish} />}

      {/* Multiple Choice Options Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isThisCorrect = option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

          let buttonStyle =
            'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600';

          if (isAnswered) {
            if (isThisCorrect) {
              buttonStyle =
                'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/60 shadow-lg font-bold scale-[1.02]';
            } else if (isSelected && !isThisCorrect) {
              buttonStyle =
                'bg-rose-500/15 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/60 shadow-lg font-bold opacity-80';
            } else {
              buttonStyle = 'bg-slate-100/50 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 opacity-50';
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`relative px-5 py-4 rounded-2xl border text-base font-semibold text-left transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center border border-slate-300 dark:border-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-700">
                  {index + 1}
                </span>
                <span className="capitalize">{option}</span>
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback Banner & Next Word Button */}
      {isAnswered && (
        <div className="w-full mt-6 flex flex-col items-center animate-fadeIn">
          <div
            className={`w-full p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
            }`}
          >
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-lg">
                  {isCorrect ? '✓ Correct!' : '✕ Incorrect'}
                </h4>
                {!isCorrect && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Correct answer:{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">
                      {correctAnswer}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-transform"
            >
              <span>Next word</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
