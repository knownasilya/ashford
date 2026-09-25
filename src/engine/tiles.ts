/**
 * Map legend: one character per tile. Maps in src/story/scenes.ts use these.
 * `solid` tiles block walking.
 */
export const TILES: Record<string, { sprite: string; solid: boolean }> = {
  '.': { sprite: 'grass', solid: false },
  ',': { sprite: 'tallgrass', solid: false },
  ':': { sprite: 'dirt', solid: false },
  '_': { sprite: 'path', solid: false },
  '=': { sprite: 'bridge', solid: false },
  '-': { sprite: 'floor', solid: false },
  'D': { sprite: 'door', solid: false },
  'T': { sprite: 'pine', solid: true },
  'O': { sprite: 'oak', solid: true },
  '~': { sprite: 'water', solid: true },
  'r': { sprite: 'rock', solid: true },
  'F': { sprite: 'fence', solid: true },
  '#': { sprite: 'stoneWall', solid: true },
  '^': { sprite: 'stoneTop', solid: true },
  'W': { sprite: 'woodWall', solid: true },
  'R': { sprite: 'woodRoof', solid: true },
  '+': { sprite: 'cross', solid: true },
  'p': { sprite: 'pew', solid: true },
  'a': { sprite: 'altar', solid: true },
  'c': { sprite: 'candle', solid: true },
  'n': { sprite: 'anvil', solid: true },
  'f': { sprite: 'forge', solid: true },
  'b': { sprite: 'barrel', solid: true },
};
