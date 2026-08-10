export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'conjunction'
  | 'preposition'
  | 'pronoun'
  | 'phrase';

export type ImageSource = 'pexels' | 'ai' | 'local' | 'none' | null;

export interface ImageMetadata {
  enabled: boolean;
  source: ImageSource;
  url: string | null;
  photographer: string | null;
  photographerUrl: string | null;
  pexelsUrl: string | null;
}

export interface Word {
  id: number;
  spanish: string;
  english: string;
  level: Level;
  partOfSpeech: PartOfSpeech;
  imageQuery: string;
  image: ImageMetadata;
}

export interface WordProgress {
  correct: number;
  incorrect: number;
  lastSeen: string;
}

export interface UserProgress {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  currentStreak: number;
  bestStreak: number;
  words: {
    [wordId: number]: WordProgress;
  };
}

export interface UserSettings {
  levelFilter: 'ALL' | Level | 'Sentences';
  imagesEnabled: boolean;
  soundEnabled: boolean;
  speechEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

export interface CSVWordRow {
  id: string | number;
  spanish: string;
  english: string;
  level: Level;
  partOfSpeech: PartOfSpeech;
  imageQuery: string;
}
