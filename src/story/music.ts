import type { Tune } from '../engine/audio';

/** Bryn's three song variants. Ink plays them with ~ music("name"). About 5 seconds each. */
export const tunes: Record<string, Tune> = {
  // A cheerful dance in D dorian.
  miller: {
    bpm: 168,
    drone: 'D3',
    notes: 'D4 F4 A4 G4:2 F4 E4 D4 E4 F4:2 -:1 A4 C5 D5 C5 A4 G4 F4 E4 D4:3',
  },
  // A silly, jumpy tune.
  goose: {
    bpm: 150,
    drone: 'G3',
    notes: 'G4:0.5 G4:0.5 B4 G4:0.5 G4:0.5 D5 C5:0.5 B4:0.5 A4 G4:0.5 A4:0.5 B4:0.5 A4:0.5 G4 D4 G4:2',
  },
  // A slow, sad air.
  bell: {
    bpm: 96,
    drone: 'D3',
    notes: 'A4:2 G4 F4 E4:2 D4:2 F4 E4 D4 C4 D4:3',
  },
};
