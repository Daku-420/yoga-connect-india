/**
 * Synthesizes a soothing Himalayan bronze singing bowl tone using Web Audio API.
 * Uses 432 Hz Pythagorean sacred tuning with warm harmonics and exponential decay.
 * Zero external audio downloads required.
 */
export function playHimalayanChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
    masterGain.connect(ctx.destination);

    // Harmonic frequencies resembling a Tibetan bronze singing bowl (fundamental ~432Hz)
    const harmonics = [
      { freq: 432, gain: 0.55 },
      { freq: 864, gain: 0.25 },
      { freq: 1296, gain: 0.12 },
      { freq: 2160, gain: 0.04 },
    ];

    harmonics.forEach(({ freq, gain: hGain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(hGain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  } catch {
    // Fail silently if browser blocks audio autoplay/policy
  }
}
