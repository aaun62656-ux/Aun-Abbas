import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  if (typeof window === 'undefined') return;

  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A55EEA', '#2ED573'],
    });

    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#A55EEA', '#2ED573'],
    });

    // Center star shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['circle', 'square'],
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1'],
      });
    }, 200);
  } catch {
    // Fallback if canvas-confetti has an issue
  }
}
