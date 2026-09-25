let ac: AudioContext | null = null;

/** Browsers allow sound only after a key press. Call this from one. */
export function unlockAudio() {
  ac ??= new AudioContext();
}

/** Short square-wave tick for typed text. */
export function blip(pitch = 1) {
  if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = 'square';
  o.frequency.value = 180 * pitch + Math.random() * 30;
  g.gain.setValueAtTime(0.025, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.05);
  o.connect(g).connect(ac.destination);
  o.start();
  o.stop(ac.currentTime + 0.06);
}

/** A church bell: a few inharmonic partials with a long decay. */
export function bell() {
  if (!ac) return;
  const now = ac.currentTime;
  for (const [ratio, vol] of [[0.5, 0.12], [1, 0.1], [1.19, 0.06], [1.5, 0.05], [2.0, 0.04], [2.74, 0.03]]) {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = 'sine';
    o.frequency.value = 220 * ratio;
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 4);
    o.connect(g).connect(ac.destination);
    o.start(now);
    o.stop(now + 4);
  }
}
