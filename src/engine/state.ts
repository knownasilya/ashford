/**
 * Everything the story remembers. Flags are plain strings, so a story can
 * invent new ones anywhere: s.set('met_hal'), s.has('met_hal').
 */
export class GameState {
  flags = new Set<string>();
  items = new Set<string>();
  coins = 0;
  /** Cutscenes to play after the current dialogue ends. */
  queued: string[] = [];

  has = (flag: string) => this.flags.has(flag);
  set = (...flags: string[]) => flags.forEach((f) => this.flags.add(f));
  unset = (flag: string) => this.flags.delete(flag);

  holds = (item: string) => this.items.has(item);
  give = (item: string) => this.items.add(item);
  take = (item: string) => this.items.delete(item);

  /** Names: a person shows as "???" until revealed. */
  knows = (actor: string) => this.flags.has(`known_${actor}`);
  reveal = (...actors: string[]) => actors.forEach((a) => this.flags.add(`known_${a}`));

  /** Play a cutscene once the current conversation closes. */
  queue = (cutscene: string) => this.queued.push(cutscene);
}

const SAVE_KEY = 'ashford-save';

export interface SaveData {
  scene: string;
  x: number;
  y: number;
  flags: string[];
  items: string[];
  coins: number;
  /** ink's own state: variables, visit counts. */
  ink?: string;
}

export function saveGame(data: SaveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    /* storage can be blocked; the game still works */
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}
