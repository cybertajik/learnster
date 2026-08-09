import { UserProgress, UserSettings, ImageMetadata, Word } from '@/types/vocabulary';

const PROGRESS_STORAGE_KEY = 'spanishly_user_progress_v1';
const SETTINGS_STORAGE_KEY = 'spanishly_user_settings_v1';
const IMAGE_CACHE_KEY = 'spanishly_image_cache_v1';

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

/**
 * Load user progress from localStorage safely
 */
export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Error loading user progress from localStorage:', e);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Save user progress to localStorage
 */
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving user progress to localStorage:', e);
  }
}

/**
 * Record a question attempt in progress state
 */
export function recordAnswerAttempt(
  wordId: number,
  isCorrect: boolean,
  currentProgress: UserProgress
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

  saveUserProgress(updatedProgress);
  return updatedProgress;
}

/**
 * Load user settings from localStorage
 */
export function loadUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error loading user settings from localStorage:', e);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings to localStorage
 */
export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
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
 * Reset all progress statistics
 */
export function resetProgress(): UserProgress {
  saveUserProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}
