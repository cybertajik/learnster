'use client';

import React from 'react';
import { Image as ImageIcon, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { UserSettings, Level } from '@/types/vocabulary';
import { saveUserSettings } from '@/lib/storage';

export type LevelFilterMode = 'ALL' | Level | 'Sentences';

interface QuizToolbarProps {
  settings: UserSettings;
  onSettingsChange: (newSettings: UserSettings) => void;
}

export const QuizToolbar: React.FC<QuizToolbarProps> = ({
  settings,
  onSettingsChange,
}) => {
  const levels: LevelFilterMode[] = ['A1', 'A2', 'B1', 'B2', 'Sentences'];

  const handleLevelSelect = (lvl: LevelFilterMode) => {
    const updated = { ...settings, levelFilter: lvl as 'ALL' | Level };
    onSettingsChange(updated);
    saveUserSettings(updated);
  };

  const handleToggleImages = () => {
    const updated = { ...settings, imagesEnabled: !settings.imagesEnabled };
    onSettingsChange(updated);
    saveUserSettings(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onSettingsChange(updated);
    saveUserSettings(updated);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-lg flex flex-col gap-3 transition-colors">
      {/* Top Row: Quick Toggles (Image ON/OFF & Sound ON/OFF switches) */}
      <div className="flex items-center justify-between px-1">
        {/* Image ON / OFF Switch */}
        <button
          onClick={handleToggleImages}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            settings.imagesEnabled
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle Images ON/OFF"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Images:</span>
          <span className={settings.imagesEnabled ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-500'}>
            {settings.imagesEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Sound ON / OFF Switch */}
        <button
          onClick={handleToggleSound}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            settings.soundEnabled
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle Sound ON/OFF"
        >
          <Volume2 className="w-4 h-4" />
          <span>Sound:</span>
          <span className={settings.soundEnabled ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-500'}>
            {settings.soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Bottom Row: Level Selection Buttons (A1 - A2 - B1 - B2 - Sentences) */}
      <div className="flex items-center justify-between gap-1 bg-slate-100 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
        {levels.map((lvl) => {
          const isSelected = settings.levelFilter === lvl;
          return (
            <button
              key={lvl}
              onClick={() => handleLevelSelect(lvl)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-900/20 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>
    </div>
  );
};
