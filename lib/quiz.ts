import { Word, QuizQuestion, UserSettings, UserProgress } from '@/types/vocabulary';
import rawSentences from '@/data/sentences.json';

/**
 * Fisher-Yates array shuffle utility
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate 4 multiple-choice options for a given target word/sentence.
 * Guarantees 1 correct answer and 3 distinct distractor options.
 */
export function generateQuestionOptions(targetWord: Word, allWords: Word[]): string[] {
  const correctAnswer = targetWord.english;

  // Filter candidate distractors (must have unique English translations)
  const candidateDistractors = allWords
    .filter(
      (w) =>
        w.id !== targetWord.id &&
        w.english.toLowerCase().trim() !== correctAnswer.toLowerCase().trim()
    )
    .map((w) => w.english);

  // Deduplicate candidate translations
  const uniqueDistractors = Array.from(new Set(candidateDistractors));

  // Shuffle distractors and pick 3
  const selectedDistractors = shuffleArray(uniqueDistractors).slice(0, 3);

  // Fallback in case pool is tiny
  while (selectedDistractors.length < 3) {
    const defaultFallbacks = [
      'Hello, how are you?',
      'Where is the bathroom?',
      'I would like a coffee, please.',
      'How much does this cost?',
      'It is a very beautiful day.',
      'The book is on the table.',
      'I love traveling around the world.',
      'See you tomorrow morning.'
    ];
    for (const fb of defaultFallbacks) {
      if (
        fb !== correctAnswer &&
        !selectedDistractors.includes(fb) &&
        selectedDistractors.length < 3
      ) {
        selectedDistractors.push(fb);
      }
    }
  }

  // Combine correct answer and 3 distractors, then shuffle
  return shuffleArray([correctAnswer, ...selectedDistractors]);
}

/**
 * Clean abstraction to retrieve the next queue of quiz questions.
 * Supports Level filtering (A1, A2, B1, B2, Sentences) and Spaced Repetition.
 */
export function getNextQuestions(
  allWords: Word[],
  count: number = 15,
  progress?: UserProgress,
  settings?: UserSettings
): QuizQuestion[] {
  if (!allWords || allWords.length === 0) return [];

  // Filter by user level settings if specified
  let filtered = allWords;
  if (settings) {
    const filter = (settings.levelFilter as string) || 'ALL';
    if (filter === 'Sentences') {
      filtered = rawSentences as unknown as Word[];
    } else if (filter !== 'ALL') {
      filtered = allWords.filter((w) => w.level === filter);
    }
  }

  if (filtered.length === 0) {
    filtered = allWords; // Fallback to all if filter returns zero
  }

  // Weight words based on progress (words with lower accuracy or fewer attempts get higher priority)
  const weightedList: Word[] = [];

  filtered.forEach((word) => {
    const stat = progress?.words[word.id];
    let weight = 3; // base weight

    if (!stat) {
      weight = 5; // New unpracticed words have high priority
    } else if (stat.incorrect > stat.correct) {
      weight = 6; // Incorrectly answered words get top priority
    } else if (stat.correct > 0 && stat.incorrect === 0) {
      weight = 1; // Mastered words appear less frequently
    }

    for (let i = 0; i < weight; i++) {
      weightedList.push(word);
    }
  });

  const shuffledPool = shuffleArray(weightedList);

  // Pick unique words for queue
  const chosenWords: Word[] = [];
  const chosenIds = new Set<number>();

  for (const word of shuffledPool) {
    if (!chosenIds.has(word.id)) {
      chosenWords.push(word);
      chosenIds.add(word.id);
    }
    if (chosenWords.length >= count) break;
  }

  // If pool was smaller than requested count, fill remaining from filtered
  if (chosenWords.length < count) {
    const remaining = shuffleArray(filtered).filter((w) => !chosenIds.has(w.id));
    for (const w of remaining) {
      chosenWords.push(w);
      if (chosenWords.length >= count) break;
    }
  }

  // Convert words into full QuizQuestion objects
  return chosenWords.map((word) => ({
    word,
    options: generateQuestionOptions(word, filtered.length > 5 ? filtered : allWords),
    correctAnswer: word.english,
  }));
}

/**
 * Preload images for upcoming words without blocking current execution
 */
export function preloadUpcomingImages(questions: QuizQuestion[]): void {
  if (typeof window === 'undefined') return;

  questions.forEach((q) => {
    if (q.word.image && q.word.image.enabled && q.word.image.url) {
      const img = new Image();
      img.src = q.word.image.url;
    }
  });
}
