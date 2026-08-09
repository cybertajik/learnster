export type MascotExpression =
  | 'happy'
  | 'sad'
  | 'crying'
  | 'bored'
  | 'confused'
  | 'unhappy'
  | 'angry'
  | 'wonderful'
  | 'surprised'
  | 'sleepy';

export function getMascotImagePath(expression: MascotExpression): string {
  return `/expressions/${expression}.jpg`;
}

/**
 * Determine mascot expression based on game state & scenarios:
 * 1. User logged in default -> happy
 * 2. 5 wrong answers in a row -> crying
 * 3. 2-4 wrong answers in a row -> sad / unhappy
 * 4. User takes too long (> 12s on a question) -> confused
 * 5. User idle for > 30s -> sleepy
 * 6. User idle for 15-30s -> bored
 * 7. Correct answer with streak >= 10 -> wonderful
 * 8. Correct answer with milestone -> surprised
 * 9. Lost streak >= 5 -> angry
 */
export function calculateMascotExpression(params: {
  isLoggedIn: boolean;
  consecutiveIncorrect: number;
  timeSpentSeconds: number;
  currentStreak: number;
  lastAnswerCorrect: boolean | null;
}): MascotExpression {
  const { isLoggedIn, consecutiveIncorrect, timeSpentSeconds, currentStreak, lastAnswerCorrect } = params;

  if (!isLoggedIn) return 'happy';

  // 1. Critical failure: 5+ wrong answers in a row -> crying.jpg
  if (consecutiveIncorrect >= 5) {
    return 'crying';
  }

  // 2. High idle / timeout scenario -> confused / bored / sleepy
  if (timeSpentSeconds > 30) {
    return 'sleepy';
  }
  if (timeSpentSeconds > 20) {
    return 'bored';
  }
  if (timeSpentSeconds > 10 && lastAnswerCorrect === null) {
    return 'confused'; // Taking too long on current question -> confused.jpg
  }

  // 3. Answer state triggers
  if (lastAnswerCorrect === true) {
    if (currentStreak >= 15) return 'surprised';
    if (currentStreak >= 5) return 'wonderful';
    return 'happy';
  }

  if (lastAnswerCorrect === false) {
    if (consecutiveIncorrect >= 3) return 'sad';
    return 'unhappy';
  }

  // Default logged in state -> happy.jpg
  return 'happy';
}
