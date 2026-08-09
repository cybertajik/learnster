'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { QuizCard } from '@/components/QuizCard';
import { StatsBar } from '@/components/StatsBar';
import { QuizToolbar } from '@/components/QuizToolbar';
import { LoginScreen } from '@/components/LoginScreen';
import { QuizQuestion, UserProgress, UserSettings, Word } from '@/types/vocabulary';
import rawWords from '@/data/words.json';
import {
  loadUserProgress,
  recordAnswerAttempt,
  loadUserSettings,
  saveUserSettings,
  getCachedImages,
  setCachedImage,
} from '@/lib/storage';
import { getNextQuestions, preloadUpcomingImages } from '@/lib/quiz';
import { getCurrentUser, UserProfile } from '@/lib/auth';
import { calculateMascotExpression, MascotExpression } from '@/lib/mascot';
import { checkMilestoneCelebration } from '@/lib/celebration';
import { RefreshCw } from 'lucide-react';

export default function LearnPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

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

  // Initialize dataset & question queue for the current logged-in user
  useEffect(() => {
    if (!authChecked) return;

    const username = currentUser?.username;
    const cachedMap = getCachedImages();
    const mergedWords = (rawWords as Word[]).map((w) => {
      if (cachedMap[w.id]) {
        return { ...w, image: cachedMap[w.id] };
      }
      return w;
    });

    setAllWords(mergedWords);
    const loadedProg = loadUserProgress(username);
    const loadedSet = loadUserSettings(username);
    setProgress(loadedProg);
    setSettings(loadedSet);

    const initialQueue = getNextQuestions(mergedWords, 15, loadedProg, loadedSet);
    setQueue(initialQueue);
    setCurrentIndex(0);
    preloadUpcomingImages(initialQueue);

    setIsLoading(false);
  }, [authChecked, currentUser]);

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
    saveUserSettings(newSettings, currentUser?.username);
    // Regenerate queue with new filter settings
    const newQueue = getNextQuestions(allWords, 15, progress, newSettings);
    setQueue(newQueue);
    setCurrentIndex(0);
    preloadUpcomingImages(newQueue);
  };

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const currentQ = queue[currentIndex];
      if (!currentQ) return;

      const updatedProgress = recordAnswerAttempt(currentQ.word.id, isCorrect, progress, currentUser?.username);
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
    [currentIndex, queue, progress, currentUser?.username]
  );

  const handleNext = useCallback(() => {
    setLastAnswerCorrect(null);
    setTimeSpentSeconds(0);
    const nextIdx = currentIndex + 1;

    if (nextIdx < queue.length) {
      setCurrentIndex(nextIdx);
    } else {
      const newQueue = getNextQuestions(allWords, 15, progress, settings);
      setQueue(newQueue);
      setCurrentIndex(0);
      preloadUpcomingImages(newQueue);
    }
  }, [currentIndex, queue.length, allWords, progress, settings]);

  if (!authChecked) return null;

  // Show Login Screen if user is not authenticated
  if (!currentUser) {
    return <LoginScreen onSuccess={(user) => setCurrentUser(user)} />;
  }

  if (isLoading || queue.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
        <Navbar
          user={currentUser}
          progress={progress}
          settings={settings}
          mascotExpression={mascotExpression}
          onSettingsChange={handleSettingsChange}
          onLogout={() => setCurrentUser(null)}
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
        progress={progress}
        settings={settings}
        mascotExpression={mascotExpression}
        onSettingsChange={handleSettingsChange}
        onLogout={() => setCurrentUser(null)}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-0 pb-4 flex flex-col items-center justify-start gap-2">
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
        <StatsBar progress={progress} />
      </main>
    </div>
  );
}
