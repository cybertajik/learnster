'use client';

import React from 'react';
import { CheckCircle2, XCircle, Percent, PartyPopper, UserPlus, LogIn } from 'lucide-react';

interface DemoCompleteScreenProps {
  correct: number;
  incorrect: number;
  onSignUp: () => void;
  onLogIn: () => void;
}

export const DemoCompleteScreen: React.FC<DemoCompleteScreenProps> = ({
  correct,
  incorrect,
  onSignUp,
  onLogIn,
}) => {
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-rose-500 selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-slate-950/80 relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mb-4">
          <PartyPopper className="w-8 h-8 text-amber-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-center mb-1">
          Demo complete!
        </h1>
        <p className="text-slate-400 text-sm font-medium text-center mb-6">
          You answered {total} demo questions. Create a free account to keep your streak going.
        </p>

        {/* Results grid */}
        <div className="w-full grid grid-cols-3 gap-2 mb-8">
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <div className="flex items-center gap-1 font-bold text-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>{correct}</span>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/80">Correct</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <div className="flex items-center gap-1 font-bold text-lg">
              <XCircle className="w-4 h-4" />
              <span>{incorrect}</span>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-rose-500/80">Incorrect</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <div className="flex items-center gap-1 font-bold text-lg">
              <Percent className="w-4 h-4" />
              <span>{accuracy}%</span>
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-400/80">Accuracy</span>
          </div>
        </div>

        <button
          onClick={onSignUp}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span>Create free account</span>
        </button>

        <button
          onClick={onLogIn}
          className="w-full mt-3 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <LogIn className="w-4 h-4" />
          <span>Log in instead</span>
        </button>
      </div>
    </div>
  );
};
