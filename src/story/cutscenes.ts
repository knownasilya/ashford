import type { Cutscene } from '../engine/types';

/** The bell rings three times, then the ending plays. */
const finale = (ending: string, card: string[]): Cutscene => [
  { fade: 'out' },
  { warp: 'village', x: 26, y: 15, dir: 'up' },
  { fade: 'in' },
  { wait: 700 },
  { sound: 'bell' },
  { shake: 500 },
  { wait: 1600 },
  { sound: 'bell' },
  { shake: 500 },
  { wait: 1600 },
  { sound: 'bell' },
  { shake: 500 },
  { wait: 2400 },
  { fade: 'out' },
  { card },
  { end: ending },
];

export const cutscenes: Record<string, Cutscene> = {
  intro: [
    { card: ['1257 AD', 'The road north to Ashford.', 'You have walked for nine days.'] },
    { fade: 'in' },
    { move: 'player', path: ['up', 'up', 'up'] },
    { say: [{ who: 'hal', text: 'You there! Hold a moment!' }] },
    { move: 'hal', path: ['down', 'left'] },
    { face: 'hal', dir: 'left' },
    { face: 'player', dir: 'right' },
    { talk: 'hal' },
    { move: 'hal', path: ['right', 'up'] },
    { face: 'hal', dir: 'down' },
  ],

  // This one's lines live in src/story/ink/scenes.ink.
  keep_enter: [{ ink: 'keep_enter' }],

  finale_bell: finale('bell_rings', ['At dusk, the bell of Ashford spoke again.']),
  finale_new: finale('new_voice', ['At dusk, the bell of Ashford spoke with a new voice.']),
  finale_two: finale('two_ringers', ['At dusk, an old man and a small girl climbed the tower together.']),
};
