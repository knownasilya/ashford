/**
 * Map legend: one character per tile. Maps in src/story/scenes.ts use these.
 * `solid` tiles block walking.
 * `over` tiles (roofs, the cross) draw on top of characters, so you can walk
 * behind them. `under` is the sprite drawn beneath an `over` tile that has
 * see-through pixels.
 */
export interface TileDef {
  sprite: string;
  solid: boolean;
  over?: boolean;
  under?: string;
}

export const TILES: Record<string, TileDef> = {
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
  '^': { sprite: 'stoneTop', solid: false, over: true }, // stone roof
  'M': { sprite: 'stoneTop', solid: true }, // battlement: a wall top you cannot pass
  'W': { sprite: 'woodWall', solid: true },
  'R': { sprite: 'woodRoof', solid: false, over: true },
  '+': { sprite: 'cross', solid: false, over: true, under: 'grass' },
  'p': { sprite: 'pew', solid: true },
  'a': { sprite: 'altar', solid: true },
  'c': { sprite: 'candle', solid: true },
  'n': { sprite: 'anvil', solid: true },
  'f': { sprite: 'forge', solid: true },
  'b': { sprite: 'barrel', solid: true },
};
