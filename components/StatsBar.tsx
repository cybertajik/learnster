'use client';

import React from 'react';
import { CheckCircle2, XCircle, Percent, HelpCircle } from 'lucide-react';
import { UserProgress } from '@/types/vocabulary';

interface StatsBarProps {
  progress: UserProgress;
}

export const StatsBar: React.FC<StatsBarProps> = ({ progress }) => {
  const { correct, incorrect, totalQuestions } = progress;

  const accuracy =
    totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  return (
    <div className="w-full max-w-xl mx-auto mt-6 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg transition-colors">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {/* Correct Count */}
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-lg sm:text-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
            <span>{correct}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-emerald-600/80 dark:text-emerald-500/80 uppercase tracking-wider truncate">
            Correct
          </span>
        </div>

        {/* Incorrect Count */}
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-lg sm:text-lg">
            <XCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{incorrect}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-rose-600/80 dark:text-rose-500/80 uppercase tracking-wider truncate">
            Incorrect
          </span>
        </div>

        {/* Accuracy % */}
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 min-w-0">
          <div className="flex items-center gap-1 font-bold text-lg sm:text-lg">
            <Percent className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>{accuracy}%</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-indigo-600/80 dark:text-indigo-400/80 uppercase tracking-wider truncate">
            Accuracy
          </span>
        </div>

        {/* Total Questions */}
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 px-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-lg sm:text-lg">
            <HelpCircle className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
            <span>{totalQuestions}</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            Total
          </span>
        </div>
      </div>
    </div>
  );
};
