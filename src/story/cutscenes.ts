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

  // Tobin and Hal dig Osric out of the fallen gate.
  keep_rescue: [
    {
      say: [
        { who: 'tobin', text: 'There you are. Is he still alive in there?' },
        { who: 'osric', text: 'Barely. Stop talking and lift.' },
        { who: 'hal', text: 'Charming. On three, then. One. Two...' },
      ],
    },
    { fade: 'out' },
    { shake: 600 },
    { wait: 800 },
    { shake: 600 },
    { do: (s) => s.set('keep_open') },
    { fade: 'in' },
    {
      say: [
        { who: 'tobin', text: 'There. The way is open. His leg is bruised, not broken. He will live.' },
        { who: 'hal', text: 'We will get back to our work. Mind the loose stones.' },
      ],
    },
    { fade: 'out' },
    { do: (s) => s.set('helpers_home') },
    { fade: 'in' },
  ],

  finale_bell: finale('bell_rings', ['At dusk, the bell of Ashford spoke again.']),
  finale_new: finale('new_voice', ['At dusk, the bell of Ashford spoke with a new voice.']),
  finale_two: finale('two_ringers', ['At dusk, an old man and a small girl climbed the tower together.']),
};
