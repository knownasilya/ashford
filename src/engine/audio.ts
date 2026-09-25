import { settings } from './settings';

let ac: AudioContext | null = null;

/** Browsers allow sound only after a key press. Call this from one. */
export function unlockAudio() {
  ac ??= new AudioContext();
}

/** Short square-wave tick for typed text. */
export function blip(pitch = 1) {
  if (!ac || !settings.typingSound) return;
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

/**
 * A short tune. `notes` is a space-separated list of note:beats, such as
 * "D4:1 F#4:0.5 -:1" ('-' is a rest). `drone` holds one low note under it.
 */
export interface Tune {
  bpm: number;
  notes: string;
  drone?: string;
}

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function freq(note: string): number {
  const m = /^([A-G])(#|b)?(\d)$/.exec(note);
  if (!m) throw new Error(`Bad note "${note}" (use names like D4, F#4, Bb3)`);
  const midi = (Number(m[3]) + 1) * 12 + SEMITONES[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * 2 ** ((midi - 69) / 12);
}

/** A plucked-string note: bright attack, quick decay. */
function pluck(ac: AudioContext, out: AudioNode, f: number, t: number, len: number) {
  const g = ac.createGain();
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, t);
  filter.frequency.exponentialRampToValueAtTime(700, t + 0.3);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(1.2, len * 1.6));
  filter.connect(g).connect(out);
  for (const [type, mult, vol] of [['triangle', 1, 1], ['square', 2, 0.25]] as const) {
    const o = ac.createOscillator();
    const v = ac.createGain();
    o.type = type;
    o.frequency.value = f * mult;
    v.gain.value = vol;
    o.connect(v).connect(filter);
    o.start(t);
    o.stop(t + 1.3);
  }
}

let playing: GainNode | null = null;

/** Play a tune once. A new tune stops the one before it. */
export function playTune(tune: Tune) {
  const tokens = tune.notes.trim().split(/\s+/).map((tok) => {
    const [n, beats = '1'] = tok.split(':');
    return { f: n === '-' ? 0 : freq(n), beats: Number(beats) };
  });
  if (!ac || !settings.music) return;
  stopTune();
  const out = (playing = ac.createGain());
  out.connect(ac.destination);
  const beat = 60 / tune.bpm;
  const start = ac.currentTime + 0.05;
  let t = start;
  for (const { f, beats } of tokens) {
    if (f) pluck(ac, out, f, t, beats * beat);
    t += beats * beat;
  }
  if (tune.drone) {
    const o = ac.createOscillator();
    const lp = ac.createBiquadFilter();
    const g = ac.createGain();
    o.type = 'sawtooth';
    o.frequency.value = freq(tune.drone);
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.02, start + 0.4);
    g.gain.setValueAtTime(0.02, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
    o.connect(lp).connect(g).connect(out);
    o.start(start);
    o.stop(t + 1.1);
  }
}

export function stopTune() {
  if (!ac || !playing) return;
  const old = playing;
  playing = null;
  old.gain.setTargetAtTime(0, ac.currentTime, 0.05);
  setTimeout(() => old.disconnect(), 400);
}
