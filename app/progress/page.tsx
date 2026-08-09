'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserProgress, UserSettings, Word } from '@/types/vocabulary';
import rawWords from '@/data/words.json';
import { loadUserProgress, loadUserSettings, resetProgress } from '@/lib/storage';
import { getCurrentUser, UserProfile } from '@/lib/auth';
import { LoginScreen } from '@/components/LoginScreen';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Flame,
  Zap,
  Target,
  BookOpen,
  Award,
  Trash2,
} from 'lucide-react';

export default function ProgressPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    setAuthChecked(true);
    setProgress(loadUserProgress());
    setSettings(loadUserSettings());
  }, []);

  if (!authChecked) return null;
  if (!currentUser) return <LoginScreen onSuccess={(u) => setCurrentUser(u)} />;

  const { totalQuestions, correct, incorrect, currentStreak, bestStreak, words } = progress;

  const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  const practicedWordIds = Object.keys(words).map((id) => parseInt(id, 10));
  const totalPracticedCount = practicedWordIds.length;

  const masteredCount = Object.values(words).filter(
    (stat) => stat.correct >= 3 && stat.correct > stat.incorrect * 2
  ).length;

  const wordsList = rawWords as Word[];
  const a1Count = wordsList.filter((w) => w.level === 'A1').length;
  const a2Count = wordsList.filter((w) => w.level === 'A2').length;
  const b1Count = wordsList.filter((w) => w.level === 'B1').length;
  const b2Count = wordsList.filter((w) => w.level === 'B2').length;

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all your progress data? This cannot be undone.')) {
      const fresh = resetProgress();
      setProgress(fresh);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar user={currentUser} progress={progress} settings={settings} onSettingsChange={setSettings} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400" />
              <span>Learning Progress</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Track your Spanish vocabulary acquisition and mastery statistics.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Stats</span>
          </button>
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Accuracy Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Overall Accuracy
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{accuracy}%</h3>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 fill-amber-500/20" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Streak
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{currentStreak} 🔥</h3>
            </div>
          </div>

          {/* Best Streak */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Best Streak
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{bestStreak} 🔥</h3>
            </div>
          </div>

          {/* Mastered Words */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Words Mastered
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{masteredCount}</h3>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Question Breakdown Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>Questions Answered</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Correct Answers
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{correct}</span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Incorrect Answers
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{incorrect}</span>
              </div>

              <div className="flex items-center justify-between text-sm border-t border-slate-200 dark:border-slate-800 pt-3 text-slate-700 dark:text-slate-300">
                <span>Total Quiz Questions</span>
                <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Level Distribution Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span>Vocabulary Levels</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">A1 Beginner</h4>
                <span className="text-rose-600 dark:text-rose-400 font-extrabold text-lg mt-1">{a1Count} Words</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">A2 Elementary</h4>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold text-lg mt-1">{a2Count} Words</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">B1 Intermediate</h4>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg mt-1">{b1Count} Words</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">B2 Upper Int.</h4>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg mt-1">{b2Count} Words</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-4">
              Total Practiced: <strong className="text-slate-900 dark:text-white">{totalPracticedCount}</strong> / {wordsList.length} words
            </div>
          </div>
        </div>

        {/* Words History Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Practiced Words Detail</h3>

          {practicedWordIds.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">
              No vocabulary practiced yet. Start learning to see your detailed word statistics!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="p-3 rounded-l-lg">Spanish</th>
                    <th className="p-3">English</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Correct</th>
                    <th className="p-3">Incorrect</th>
                    <th className="p-3 rounded-r-lg">Last Practiced</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {practicedWordIds.map((id) => {
                    const wordObj = wordsList.find((w) => w.id === id);
                    const stat = words[id];
                    if (!wordObj || !stat) return null;

                    return (
                      <tr key={id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white capitalize">{wordObj.spanish}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300 capitalize">{wordObj.english}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700">
                            {wordObj.level}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{stat.correct}</td>
                        <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">{stat.incorrect}</td>
                        <td className="p-3 text-xs text-slate-500 dark:text-slate-400">
                          {new Date(stat.lastSeen).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
