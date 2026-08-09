import { UserProgress, UserSettings, ImageMetadata } from '@/types/vocabulary';
import { supabase } from './supabase';
import { getCurrentUser } from './auth';

export const DEFAULT_PROGRESS: UserProgress = {
  totalQuestions: 0,
  correct: 0,
  incorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  words: {},
};

export const DEFAULT_SETTINGS: UserSettings = {
  levelFilter: 'ALL',
  imagesEnabled: true,
  soundEnabled: true,
  speechEnabled: true,
  theme: 'dark',
};

function getProgressStorageKey(username?: string): string {
  const user = username || getCurrentUser()?.username;
  if (!user) return 'lernster_progress_guest_v1';
  return `lernster_progress_${user.trim().toLowerCase()}_v1`;
}

function getSettingsStorageKey(username?: string): string {
  const user = username || getCurrentUser()?.username;
  if (!user) return 'lernster_settings_guest_v1';
  return `lernster_settings_${user.trim().toLowerCase()}_v1`;
}

const IMAGE_CACHE_KEY = 'lernster_image_cache_v1';

/**
 * Load user progress for a specific user safely from localStorage
 */
export function loadUserProgress(username?: string): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const key = getProgressStorageKey(username);
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Error loading user progress from localStorage:', e);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Save user progress to isolated per-user localStorage key and sync to Supabase
 */
export function saveUserProgress(progress: UserProgress, username?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = getProgressStorageKey(username);
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Background async sync to Supabase
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id) {
      Promise.resolve(
        supabase.from('user_progress').upsert({
          user_id: currentUser.id,
          total_questions: progress.totalQuestions,
          correct: progress.correct,
          incorrect: progress.incorrect,
          current_streak: progress.currentStreak,
          best_streak: progress.bestStreak,
          words_data: progress.words,
          updated_at: new Date().toISOString()
        })
      ).then(({ error }) => {
        if (error) console.log('Supabase progress sync notice:', error.message);
      }).catch(() => {});
    }
  } catch (e) {
    console.error('Error saving user progress to localStorage:', e);
  }
}

/**
 * Record a question attempt in progress state for the current active user
 */
export function recordAnswerAttempt(
  wordId: number,
  isCorrect: boolean,
  currentProgress: UserProgress,
  username?: string
): UserProgress {
  const now = new Date().toISOString();
  const existingWordStat = currentProgress.words[wordId] || {
    correct: 0,
    incorrect: 0,
    lastSeen: now,
  };

  const newWordStat = {
    correct: existingWordStat.correct + (isCorrect ? 1 : 0),
    incorrect: existingWordStat.incorrect + (isCorrect ? 0 : 1),
    lastSeen: now,
  };

  const newStreak = isCorrect ? currentProgress.currentStreak + 1 : 0;
  const bestStreak = Math.max(currentProgress.bestStreak, newStreak);

  const updatedProgress: UserProgress = {
    totalQuestions: currentProgress.totalQuestions + 1,
    correct: currentProgress.correct + (isCorrect ? 1 : 0),
    incorrect: currentProgress.incorrect + (isCorrect ? 0 : 1),
    currentStreak: newStreak,
    bestStreak,
    words: {
      ...currentProgress.words,
      [wordId]: newWordStat,
    },
  };

  saveUserProgress(updatedProgress, username);
  return updatedProgress;
}

/**
 * Load user settings for a specific user from localStorage
 */
export function loadUserSettings(username?: string): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const key = getSettingsStorageKey(username);
    const raw = localStorage.getItem(key);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error loading user settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings to isolated per-user localStorage key
 */
export function saveUserSettings(settings: UserSettings, username?: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = getSettingsStorageKey(username);
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving user settings to localStorage:', e);
  }
}

/**
 * Cached images dictionary in localStorage
 */
export function getCachedImages(): Record<number, ImageMetadata> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(IMAGE_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading cached images:', e);
    return {};
  }
}

/**
 * Save image metadata for a word to localStorage cache
 */
export function setCachedImage(wordId: number, image: ImageMetadata): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getCachedImages();
    current[wordId] = image;
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error caching image to localStorage:', e);
  }
}

/**
 * Reset progress statistics for a specific user
 */
export function resetProgress(username?: string): UserProgress {
  saveUserProgress(DEFAULT_PROGRESS, username);
  return DEFAULT_PROGRESS;
}
