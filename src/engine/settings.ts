/** Player options, kept in this browser. Changed from the Esc menu. */
export type TextSpeed = 'slow' | 'normal' | 'fast';

export const settings = {
  typingSound: true,
  music: true,
  textSpeed: 'normal' as TextSpeed,
};

export const TEXT_SPEEDS: Record<TextSpeed, number> = { slow: 0.6, normal: 1, fast: 1.8 };

const KEY = 'ashford-settings';
try {
  Object.assign(settings, JSON.parse(localStorage.getItem(KEY) ?? '{}'));
} catch {
  /* storage can be blocked; defaults apply */
}

export function saveSettings() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}
