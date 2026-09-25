import type { TileDef } from '../engine/tiles';

/** Tiles only this story needs. They join the legend in src/engine/tiles.ts. */
export const tiles: Record<string, TileDef> = {
  // Smoke over the smithy chimney: only while Tobin's forge burns.
  '%': { sprite: (s) => (s.has('forge_lit') ? 'smoke' : ''), solid: false, over: true, under: 'grass' },
};
