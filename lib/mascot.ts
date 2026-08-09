export type MascotExpression =
  | 'happy'
  | 'sad'
  | 'crying'
  | 'bored'
  | 'logo';

export function getMascotImagePath(expression: MascotExpression): string {
  switch (expression) {
    case 'happy':
      return '/happy.png';
    case 'sad':
      return '/sad.png';
    case 'crying':
      return '/cry.png';
    case 'bored':
      return '/bored.png';
    case 'logo':
    default:
      return '/logo.png';
  }
}

/**
 * Determine mascot expression based on state & scenarios using provided PNG images:
 * - logo.png: Used on Login/Signup page & default brand icon
 * - happy.png: Logged in, correct answer, default active state
 * - sad.png: Incorrect answer (1-4 wrong in a row)
 * - cry.png: 5+ wrong answers in a row
 * - bored.png: User taking too long to answer (> 10s idle)
 */
export function calculateMascotExpression(params: {
  isLoggedIn: boolean;
  consecutiveIncorrect: number;
  timeSpentSeconds: number;
  currentStreak: number;
  lastAnswerCorrect: boolean | null;
}): MascotExpression {
  const { isLoggedIn, consecutiveIncorrect, timeSpentSeconds, lastAnswerCorrect } = params;

  if (!isLoggedIn) return 'logo';

  // 1. Critical failure: 5+ wrong answers in a row -> cry.png
  if (consecutiveIncorrect >= 5) {
    return 'crying';
  }

  // 2. Taking too long / idle (> 10 seconds) -> bored.png
  if (timeSpentSeconds >= 10 && lastAnswerCorrect === null) {
    return 'bored';
  }

  // 3. Last answer evaluation
  if (lastAnswerCorrect === false) {
    return 'sad';
  }

  if (lastAnswerCorrect === true) {
    return 'happy';
  }

  // If user has previous wrong answers before current question
  if (consecutiveIncorrect > 0) {
    return 'sad';
  }

  // Default logged in state -> happy.png
  return 'happy';
}

