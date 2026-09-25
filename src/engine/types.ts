import type { GameState } from './state';

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Cond = (s: GameState) => boolean;
export type Effect = (s: GameState) => void;
/** Plain text, or text built from the current state. */
export type Text = string | ((s: GameState) => string);

// ---------------------------------------------------------------- dialogue

/** One line of speech. `who` is an actor id, or 'you'. It defaults to the actor you talk to. */
export interface Line {
  who?: string;
  text: Text;
}
export interface Choice {
  text: Text;
  /** Show this choice only when the condition is true. */
  when?: Cond;
  do?: Effect;
  /** Node to go to, or a function that picks one. Leave out to end the conversation. */
  next?: string | ((s: GameState) => string);
}
export interface DialogueNode {
  lines: (Text | Line)[];
  /** Runs when the conversation enters this node. */
  do?: Effect;
  /** Shown after the last line. */
  choices?: Choice[];
  /** Go here after the last line when there are no choices. Leave out to end. */
  next?: string;
}
export interface Dialogue {
  /** Picks the first node from the current state. */
  start: (s: GameState) => string;
  nodes: Record<string, DialogueNode>;
}

// ---------------------------------------------------------------- actors

export type Marker = '!' | '?' | null;

/** Anyone or anything you can talk to: people, chests, signs. */
export interface ActorDef {
  id: string;
  name: string;
  sprite: string | ((s: GameState) => string);
  /**
   * Until you learn a person's name, the talk box shows their `role`
   * (or "???" if they have none). Learn it with s.reveal(id) in TS
   * dialogue, or reveal("id") in ink.
   */
  role?: string;
  /**
   * Their answer to "What is your name?". While their name is unknown,
   * that choice is added to every choice list in their talk.
   */
  introduce?: Text;
  /** Voice pitch for the text blips. 1 is normal. */
  voice?: number;
  /** People get a '!' marker until you first talk to them. */
  person?: boolean;
  /** Override the marker above the actor. Return undefined to keep the default. */
  marker?: (s: GameState) => Marker | undefined;
  /** Talk with a TypeScript dialogue graph... */
  dialogue?: Dialogue;
  /** ...or with an ink knot (see src/story/ink). */
  ink?: string;
}

// ---------------------------------------------------------------- scenes

export interface Placement {
  actor: string;
  x: number;
  y: number;
  dir?: Dir;
  /** The actor is in this scene only while this is true. */
  when?: Cond;
}
export interface Warp {
  x: number;
  y: number;
  to: string;
  tx: number;
  ty: number;
  dir: Dir;
  /** The warp works only while this is true... */
  when?: Cond;
  /** ...and when it is false, the player sees this text. */
  locked?: Text;
}
export interface SceneDef {
  id: string;
  name: string;
  map: string[];
  actors: Placement[];
  warps: Warp[];
  /**
   * Cutscenes to play on entry, in order. `once` plays it only the first
   * time; `when` plays it only while the condition is true.
   */
  onEnter?: { cutscene: string; once?: boolean; when?: Cond }[];
}

// ---------------------------------------------------------------- cutscenes

export type Step =
  | { card: string[] } // full-screen text on black
  | { fade: 'in' | 'out' }
  | { wait: number } // milliseconds
  | { move: string; path: Dir[] } // actor id or 'player'
  | { face: string; dir: Dir }
  | { say: Line[] } // quick lines without a full dialogue
  | { talk: string; node?: string } // run an actor's dialogue (node = ink knot for ink actors)
  | { ink: string; as?: string } // run an ink knot; `as` is the default speaker (else you)
  | { warp: string; x: number; y: number; dir?: Dir }
  | { do: Effect }
  | { sound: 'bell' }
  | { shake: number }
  | { end: string }; // show an ending screen

export type Cutscene = Step[];

export interface Ending {
  title: string;
  /** Lines can depend on state; an empty line is skipped. */
  text: Text[];
}

export interface Story {
  title: string;
  subtitle: string;
  year: string;
  start: { scene: string; x: number; y: number; dir: Dir; cutscene?: string; coins: number };
  scenes: Record<string, SceneDef>;
  actors: Record<string, ActorDef>;
  cutscenes: Record<string, Cutscene>;
  endings: Record<string, Ending>;
  /** Quest log lines for the HUD: the main goal first, then side quests. */
  objective: (s: GameState) => string[];
  /** Extra map tiles for this story, added to the legend in engine/tiles.ts. */
  tiles?: Record<string, import('./tiles').TileDef>;
  /** Walking speed for the player: 1 is normal, 0.5 is half speed. */
  playerSpeed?: (s: GameState) => number;
  /** Tunes that ink can play with music("name"). */
  tunes?: Record<string, import('./audio').Tune>;
  /** Compiled ink JSON, if the story uses ink. */
  ink?: string;
}
