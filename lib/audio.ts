/**
 * Web Audio API synthesizer for sound effects (correct / incorrect feedback)
 * and Neural Spanish Text-to-Speech audio player.
 */

let audioCtx: AudioContext | null = null;
let activeAudioElement: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a pleasant ascending chime when the answer is correct
 */
export function playCorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    // Harmonic pitch sequence (E5 -> A5)
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    osc2.frequency.setValueAtTime(1318.51, now + 0.05); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (e) {
    console.error('Error playing correct audio:', e);
  }
}

/**
 * Play a subtle low double tone when answer is incorrect
 */
export function playIncorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.setValueAtTime(164.81, now + 0.12); // E3

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.error('Error playing incorrect audio:', e);
  }
}

/**
 * Speak Spanish text using High Quality Natural Neural Audio API with Web Speech fallback
 */
export function speakSpanishWord(text: string, enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined' || !text.trim()) return;

  try {
    // Stop any ongoing audio playback
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // High quality natural Spanish speech via serverless API route
    const ttsUrl = `/api/audio/tts?text=${encodeURIComponent(text.trim())}`;
    const audio = new Audio(ttsUrl);
    activeAudioElement = audio;

    audio.play().catch(() => {
      // Fallback to browser SpeechSynthesis if audio element fails
      fallbackBrowserSpeech(text);
    });
  } catch (e) {
    fallbackBrowserSpeech(text);
  }
}

function fallbackBrowserSpeech(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    
    // Select natural Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(
      (v) => (v.lang.startsWith('es') || v.lang.includes('ES')) && !v.name.toLowerCase().includes('robot')
    );
    if (esVoice) utterance.voice = esVoice;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Fallback speech synthesis error:', e);
  }
}
