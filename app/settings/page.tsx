'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserSettings, UserProgress, Level } from '@/types/vocabulary';
import { loadUserSettings, saveUserSettings, loadUserProgress, resetProgress } from '@/lib/storage';
import { getCurrentUser, UserProfile, logoutUser } from '@/lib/auth';
import { LoginScreen } from '@/components/LoginScreen';
import { Settings, Image, Volume2, Mic, Filter, Languages, RotateCcw, Check, Sun, Moon, User, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setAuthChecked(true);
    if (user) {
      setSettings(loadUserSettings(user.username));
      setProgress(loadUserProgress(user.username));
    }
  }, []);

  if (!authChecked) return null;
  if (!currentUser) return <LoginScreen onSuccess={(u) => setCurrentUser(u)} />;

  const handleThemeChange = (theme: 'dark' | 'light') => {
    const updated = { ...settings, theme };
    setSettings(updated);
    saveUserSettings(updated, currentUser?.username);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }

    showNotice();
  };

  const handleLevelChange = (level: 'ALL' | Level) => {
    const updated = { ...settings, levelFilter: level };
    setSettings(updated);
    saveUserSettings(updated, currentUser?.username);
    showNotice();
  };

  const handleToggleImages = () => {
    const updated = { ...settings, imagesEnabled: !settings.imagesEnabled };
    setSettings(updated);
    saveUserSettings(updated, currentUser?.username);
    showNotice();
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    saveUserSettings(updated, currentUser?.username);
    showNotice();
  };

  const handleToggleSpeech = () => {
    const updated = { ...settings, speechEnabled: !settings.speechEnabled };
    setSettings(updated);
    saveUserSettings(updated, currentUser?.username);
    showNotice();
  };

  const showNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all progress data?')) {
      const resetP = resetProgress(currentUser?.username);
      setProgress(resetP);
      showNotice();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar user={currentUser} progress={progress} settings={settings} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Settings className="w-8 h-8 text-rose-500" />
              <span>Application Settings</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Manage user profile, preferences, and visual mode.
            </p>
          </div>

          {savedNotice && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logged-in User</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name || currentUser.username}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">@{currentUser.username}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logoutUser();
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Dark / Bright (Light) Mode Selector */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Appearance Mode</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Switch between Dark and Bright (Light) visual themes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-slate-900 text-white border-rose-500 shadow-md shadow-rose-950/20'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  settings.theme === 'light'
                    ? 'bg-white text-slate-900 border-rose-500 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Bright Mode</span>
              </button>
            </div>
          </div>

          {/* Language Direction Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Translation Direction</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current quiz language pair</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-300 font-bold text-sm border border-slate-200 dark:border-slate-700">
              Spanish → English
            </div>
          </div>

          {/* Level Filter Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Vocabulary Level Filter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Filter quiz questions by CEFR proficiency level</p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    settings.levelFilter === lvl
                      ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Display & Sound Toggles Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg space-y-6">
            {/* Images Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Show Visual Images</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Display Pexels photos above quiz options</p>
                </div>
              </div>

              <button
                onClick={handleToggleImages}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${
                  settings.imagesEnabled ? 'bg-rose-600' : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.imagesEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80" />

            {/* Sound Chimes Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Sound Effects</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Play audio chime on correct / incorrect answers</p>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${
                  settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80" />

            {/* Speech Pronunciation Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Automatic Pronunciation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Speak Spanish word automatically when displayed</p>
                </div>
              </div>

              <button
                onClick={handleToggleSpeech}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${
                  settings.speechEnabled ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.speechEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Data Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Reset Progress Data</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clear all streaks, answers, and word history</p>
              </div>
            </div>

            <button
              onClick={handleResetData}
              className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-xs font-bold transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
