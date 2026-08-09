'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { QuizCard } from '@/components/QuizCard';
import { StatsBar } from '@/components/StatsBar';
import { QuizToolbar } from '@/components/QuizToolbar';
import { LoginScreen } from '@/components/LoginScreen';
import { DemoCompleteScreen } from '@/components/DemoCompleteScreen';
import { QuizQuestion, UserProgress, UserSettings, Word } from '@/types/vocabulary';
import rawWords from '@/data/words.json';
import {
  loadUserProgress,
  recordAnswerAttempt,
  loadUserSettings,
  getCachedImages,
  setCachedImage,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
} from '@/lib/storage';
import { getNextQuestions, preloadUpcomingImages } from '@/lib/quiz';
import { getCurrentUser, logoutUser, UserProfile } from '@/lib/auth';
import { calculateMascotExpression, MascotExpression } from '@/lib/mascot';
import { checkMilestoneCelebration } from '@/lib/celebration';
import { RefreshCw } from 'lucide-react';

const DEMO_QUESTION_LIMIT = 10;

export default function LearnPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoProgress, setDemoProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [demoFinished, setDemoFinished] = useState(false);

  const [allWords, setAllWords] = useState<Word[]>(rawWords as Word[]);
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mascot expression & tracking states
  const [mascotExpression, setMascotExpression] = useState<MascotExpression>('happy');
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check auth user state on load
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setAuthChecked(true);
  }, []);

  // Initialize dataset & question queue
  useEffect(() => {
    const cachedMap = getCachedImages();
    const mergedWords = (rawWords as Word[]).map((w) => {
      if (cachedMap[w.id]) {
        return { ...w, image: cachedMap[w.id] };
      }
      return w;
    });

    setAllWords(mergedWords);
    const loadedProg = loadUserProgress();
    const loadedSet = loadUserSettings();
    setProgress(loadedProg);
    setSettings(loadedSet);

    const initialQueue = getNextQuestions(mergedWords, 15, loadedProg, loadedSet);
    setQueue(initialQueue);
    setCurrentIndex(0);
    preloadUpcomingImages(initialQueue);

    setIsLoading(false);
  }, []);

  // Question idle timer (triggers confused/bored/sleepy mascot after 10s/20s/30s)
  useEffect(() => {
    setTimeSpentSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, queue]);

  // Recalculate dynamic mascot expression on state changes
  useEffect(() => {
    const expr = calculateMascotExpression({
      isLoggedIn: !!currentUser,
      consecutiveIncorrect,
      timeSpentSeconds,
      currentStreak: progress.currentStreak,
      lastAnswerCorrect,
    });
    setMascotExpression(expr);
  }, [currentUser, consecutiveIncorrect, timeSpentSeconds, progress.currentStreak, lastAnswerCorrect]);

  // Dynamic image fetching for missing images
  useEffect(() => {
    const currentQ = queue[currentIndex];
    if (!currentQ) return;

    const word = currentQ.word;
    if (word.image && word.image.enabled && !word.image.url) {
      fetch(`/api/images/search?query=${encodeURIComponent(word.imageQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.image) {
            setCachedImage(word.id, data.image);
            setQueue((prevQueue) =>
              prevQueue.map((q, idx) => {
                if (idx === currentIndex) {
                  return { ...q, word: { ...q.word, image: data.image } };
                }
                return q;
              })
            );
          }
        })
        .catch((err) => console.error('Pexels fetch error:', err));
    }
  }, [currentIndex, queue]);

  // Handle settings change from QuizToolbar or Navbar
  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
    // Regenerate queue with new filter settings
    const newQueue = getNextQuestions(allWords, isDemoMode ? DEMO_QUESTION_LIMIT : 15, progress, newSettings);
    setQueue(newQueue);
    setCurrentIndex(0);
    preloadUpcomingImages(newQueue);
  };

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const currentQ = queue[currentIndex];
      if (!currentQ) return;

      if (isDemoMode) {
        // Demo answers are tracked in-memory only; never persisted to storage or Supabase.
        setDemoProgress((prev) => {
          const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
          return {
            totalQuestions: prev.totalQuestions + 1,
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (isCorrect ? 0 : 1),
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
            words: prev.words,
          };
        });
        setLastAnswerCorrect(isCorrect);
        if (isCorrect) {
          setConsecutiveIncorrect(0);
        } else {
          setConsecutiveIncorrect((prev) => prev + 1);
        }
        return;
      }

      const updatedProgress = recordAnswerAttempt(currentQ.word.id, isCorrect, progress);
      setProgress(updatedProgress);
      setLastAnswerCorrect(isCorrect);

      if (isCorrect) {
        setConsecutiveIncorrect(0);
        // Check 50, 150, 250, 350, 450 confetti and 500 fireworks milestone
        checkMilestoneCelebration(updatedProgress.correct);
      } else {
        setConsecutiveIncorrect((prev) => prev + 1);
      }
    },
    [currentIndex, queue, progress, isDemoMode]
  );

  const handleNext = useCallback(() => {
    setLastAnswerCorrect(null);
    setTimeSpentSeconds(0);

    if (isDemoMode) {
      const nextIdx = currentIndex + 1;
      if (nextIdx >= DEMO_QUESTION_LIMIT || nextIdx >= queue.length) {
        setDemoFinished(true);
        return;
      }
      setCurrentIndex(nextIdx);
      return;
    }

    const nextIdx = currentIndex + 1;

    if (nextIdx < queue.length) {
      setCurrentIndex(nextIdx);
    } else {
      const newQueue = getNextQuestions(allWords, 15, progress, settings);
      setQueue(newQueue);
      setCurrentIndex(0);
      preloadUpcomingImages(newQueue);
    }
  }, [currentIndex, queue.length, allWords, progress, settings, isDemoMode]);

  const startDemo = useCallback(
    (demoUser: UserProfile) => {
      const demoQueue = getNextQuestions(allWords, DEMO_QUESTION_LIMIT, undefined, DEFAULT_SETTINGS);
      setCurrentUser(demoUser);
      setIsDemoMode(true);
      setDemoFinished(false);
      setDemoProgress(DEFAULT_PROGRESS);
      setSettings(DEFAULT_SETTINGS);
      setQueue(demoQueue);
      setCurrentIndex(0);
      setConsecutiveIncorrect(0);
      setLastAnswerCorrect(null);
      preloadUpcomingImages(demoQueue);
    },
    [allWords]
  );

  const exitDemo = useCallback(
    async (goToSignup: boolean) => {
      await logoutUser(true);
      setIsDemoMode(false);
      setDemoFinished(false);
      setDemoProgress(DEFAULT_PROGRESS);
      setCurrentUser(null);

      // Restore the real user's settings & rebuild a normal queue so the app
      // is ready the moment they log back in (the queue-init effect only runs once on mount).
      const realProgress = loadUserProgress();
      const realSettings = loadUserSettings();
      setProgress(realProgress);
      setSettings(realSettings);
      const restoredQueue = getNextQuestions(allWords, 15, realProgress, realSettings);
      setQueue(restoredQueue);
      setCurrentIndex(0);
      preloadUpcomingImages(restoredQueue);
      // goToSignup is currently informational; LoginScreen defaults to login mode.
      void goToSignup;
    },
    [allWords]
  );

  const handleLogout = useCallback(() => {
    setIsDemoMode(false);
    setDemoFinished(false);
    setDemoProgress(DEFAULT_PROGRESS);
    setCurrentUser(null);

    const realProgress = loadUserProgress();
    const realSettings = loadUserSettings();
    setProgress(realProgress);
    setSettings(realSettings);
    const restoredQueue = getNextQuestions(allWords, 15, realProgress, realSettings);
    setQueue(restoredQueue);
    setCurrentIndex(0);
    preloadUpcomingImages(restoredQueue);
  }, [allWords]);

  if (!authChecked) return null;

  // Show Login Screen if user is not authenticated
  if (!currentUser) {
    return <LoginScreen onSuccess={(user) => setCurrentUser(user)} onDemo={startDemo} />;
  }

  // Demo session finished after DEMO_QUESTION_LIMIT questions
  if (isDemoMode && demoFinished) {
    return (
      <DemoCompleteScreen
        correct={demoProgress.correct}
        incorrect={demoProgress.incorrect}
        onSignUp={() => exitDemo(true)}
        onLogIn={() => exitDemo(false)}
      />
    );
  }

  const activeProgress = isDemoMode ? demoProgress : progress;

  if (isLoading || queue.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
        <Navbar
          user={currentUser}
          progress={activeProgress}
          settings={settings}
          mascotExpression={mascotExpression}
          onSettingsChange={handleSettingsChange}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
            <p className="font-semibold text-sm">Preparing vocabulary quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = queue[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors">
      {/* Navbar: Logo | Learn | Progress | Settings */}
      <Navbar
        user={currentUser}
        progress={activeProgress}
        settings={settings}
        mascotExpression={mascotExpression}
        onSettingsChange={handleSettingsChange}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 flex flex-col items-center justify-center">
        {isDemoMode && (
          <div className="w-full max-w-xl mx-auto mb-4 px-4 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-500 text-xs sm:text-sm font-semibold text-center">
            Demo mode: question {currentIndex + 1} of {DEMO_QUESTION_LIMIT} · progress won&apos;t be saved
          </div>
        )}

        {/* Quiz Toolbar: Image ON/OFF, Sound ON/OFF, Level Selection A1-A2-B1-B2-Sentences */}
        <QuizToolbar settings={settings} onSettingsChange={handleSettingsChange} />

        {/* Main Quiz Flashcard */}
        <QuizCard
          question={currentQuestion}
          settings={settings}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />

        {/* Bottom Live Stats Bar */}
        <StatsBar progress={activeProgress} />
      </main>
    </div>
  );
}
