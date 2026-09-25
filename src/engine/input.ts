import type { Dir } from './types';

export type Action = Dir | 'confirm' | 'cancel';

const KEYS: Record<string, Action> = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'confirm', Enter: 'confirm', KeyE: 'confirm', KeyZ: 'confirm',
  Escape: 'cancel', KeyX: 'cancel',
};
const DIRS: Dir[] = ['up', 'down', 'left', 'right'];

const held: Action[] = []; // most recent last
const pressed = new Set<Action>();
let digit: number | null = null;

addEventListener('keydown', (e) => {
  if (/^Digit[1-9]$/.test(e.code)) digit = Number(e.code.slice(5));
  const a = KEYS[e.code];
  if (!a) return;
  e.preventDefault();
  if (!e.repeat) pressed.add(a);
  if (!held.includes(a)) held.push(a);
});
addEventListener('keyup', (e) => {
  const a = KEYS[e.code];
  const i = a ? held.indexOf(a) : -1;
  if (i >= 0) held.splice(i, 1);
});
addEventListener('blur', () => (held.length = 0));

export const input = {
  /** The direction key held most recently, if any. */
  dir(): Dir | null {
    for (let i = held.length - 1; i >= 0; i--) {
      if ((DIRS as Action[]).includes(held[i])) return held[i] as Dir;
    }
    return null;
  },
  /** True once per key press. Consumes the press so no one else sees it. */
  take(a: Action): boolean {
    return pressed.delete(a);
  },
  takeDigit(): number | null {
    const d = digit;
    digit = null;
    return d;
  },
  endFrame() {
    pressed.clear();
    digit = null;
  },
};
