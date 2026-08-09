import confetti from 'canvas-confetti';

/**
 * Trigger confetti falling from top to bottom (at 50, 150, 250, 350, 450 correct answers)
 */
export function triggerTopToBottomConfetti() {
  if (typeof window === 'undefined') return;

  try {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 90,
        spread: 120,
        origin: { x: Math.random(), y: -0.1 }, // Top to bottom falling
        colors,
        startVelocity: 15,
        gravity: 0.8,
        scalar: 1.2,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.error('Confetti error:', e);
  }
}

/**
 * Trigger grand Fireworks animation (at 500 correct answers)
 */
export function triggerFireworks() {
  if (typeof window === 'undefined') return;

  try {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fireworks bursts from random x positions
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  } catch (e) {
    console.error('Fireworks error:', e);
  }
}

/**
 * Check if the correct answer count reached a milestone
 */
export function checkMilestoneCelebration(correctCount: number) {
  const confettiMilestones = [50, 150, 250, 350, 450];
  
  if (confettiMilestones.includes(correctCount)) {
    triggerTopToBottomConfetti();
    return 'confetti';
  }

  if (correctCount === 500) {
    triggerFireworks();
    return 'fireworks';
  }

  return null;
}
