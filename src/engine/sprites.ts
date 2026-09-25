import { BG, TILE } from './config';

/**
 * Every sprite is an 8x8 grid of characters. '.' is empty (the sprite's bg
 * shows through). Other characters look up a colour: first in the sprite's
 * own `colors`, then in PALETTE. Add a frame to animate (water, fire...).
 */
export interface SpriteDef {
  frames: string[][];
  bg?: string;
  colors?: Record<string, string>;
}

const PALETTE: Record<string, string> = {
  g: '#3f6b2a', G: '#6e9a34', T: '#2e8f64',
  b: '#6d8ce0',
  R: '#8c4a2b', r: '#4a2416', o: '#9a6440',
  S: '#b9c0c9', s: '#6c737d',
  Y: '#c9a13a', F: '#b0823f',
  X: '#d9493c', w: '#ecebe4',
};

const DIRT = '#2e160d';
const FLOOR = '#24130c';
const STONE = '#1c212a';

const sp = (rows: string[], bg?: string, colors?: Record<string, string>): SpriteDef => ({ frames: [rows], bg, colors });
const anim = (frames: string[][], bg?: string): SpriteDef => ({ frames, bg });
const shift = (rows: string[], n: number) => rows.map((r) => r.slice(n) + r.slice(0, n));

const WATER = [
  '........',
  '.bb...bb',
  'b..bbb..',
  '........',
  '........',
  'bb...bb.',
  '..bbb..b',
  '........',
];

// Wood roof rows; the slope tiles cut this pattern to a triangle.
const ROOF = ['RRRRRRRR', 'dddddddd', 'RRRRRRRR', 'dodododo', 'RRRRRRRR', 'dddddddd', 'RRRRRRRR', 'dodododo'];

/** Cut the roof pattern with a mask: 'in' keeps it, 'edge' draws the trim, else empty. */
function roofShape(mask: (x: number, y: number) => 'in' | 'edge' | null, top: string[] = []): SpriteDef {
  const rows = ROOF.map((row, y) =>
    [...row].map((ch, x) => (top[y]?.[x] && top[y][x] !== '.' ? top[y][x] : mask(x, y) === 'edge' ? 'F' : mask(x, y) ? ch : '.')).join(''),
  );
  return { frames: [rows], colors: { d: DIRT } };
}

/** Put a 4-pixel-wide chimney (columns 2-5) on top of a roof tile. */
function chimney(roof: string[], brick: string[], bg: string, colors?: Record<string, string>): SpriteDef {
  const rows = roof.map((row, y) => row.slice(0, 2) + brick[y] + row.slice(6));
  return { frames: [rows], bg, colors };
}
const WOOD_ROOF = ['RRRRRRRR', '........', 'RRRRRRRR', '.o.o.o.o', 'RRRRRRRR', '........', 'RRRRRRRR', '.o.o.o.o'];
const STONE_ROOF = ['SS..SS..', 'SS..SS..', 'SSSSSSSS', 'S.S.S.S.', 'SSSSSSSS', '........', 'SSSSSSSS', '........'];
const STONE_STACK = ['kkkk', 'sSSs', 'SSsS', 'sSSs', 'SsSS', 'sSSs', 'SSsS', 'sSSs'];
const BRICK_STACK = ['kkkk', 'RoRR', 'RRoR', 'oRRo', 'RoRR', 'RRoR', 'oRRo', 'RoRR'];
// Smoke puffs. Each frame shifts them up two pixels, so the smoke rises.
const SMOKE = ['...SS...', '..SSSs..', '...Ss...', '........', '....Ss..', '...SSSs.', '....sS..', '........'];
const rise = (rows: string[], k: number) => [...rows.slice(k), ...rows.slice(0, k)];

export const SPRITES: Record<string, SpriteDef> = {
  // ---------- terrain ----------
  grass: sp(['........', '..g.....', '........', '.....g..', '........', '.g......', '......g.', '........']),
  tallgrass: sp(['........', '........', '.G...G..', '.G.G.G.G', 'GG.G.GG.', '.GGG.GG.', '........', '........']),
  pine: sp(['...T....', '..TTT...', '..TTT...', '.TTTTT..', '.TTTTT..', 'TTTTTTT.', '...R....', '...R....']),
  oak: sp(['.GGgGG..', 'GGgGGgG.', 'GgGGGgGG', 'GGGgGGGG', '.GGGgGG.', '...RR...', '...RR...', '..RRRR..']),
  water: anim([WATER, shift(WATER, 2)], '#233675'),
  bridge: sp(['RRRRRRRR', 'r......r', 'RRRRRRRR', 'r......r', 'RRRRRRRR', 'r......r', 'RRRRRRRR', 'r......r'], DIRT),
  dirt: sp(['.o...o..', '....o...', 'o.o....o', '.....o..', '..o.o...', 'o......o', '...o..o.', '.o....o.'], DIRT),
  path: sp(['s...s...', '........', '..s...s.', '........', 's...s...', '........', '..s...s.', '........'], '#151c2a'),
  rock: sp(['........', '..sss...', '.sSSSs..', '.SSSSSs.', 'sSSSSSSs', 'sSSSSSSs', '.ssssss.', '........']),
  fence: sp(['........', '.F....F.', 'FFFFFFFF', '.F....F.', 'FFFFFFFF', '.F....F.', '.F....F.', '........']),

  // ---------- buildings ----------
  stoneWall: sp(['SSS.SSSS', 'SSS.SSSS', '........', 'S.SSSS.S', 'S.SSSS.S', '........', 'SSS.SSSS', 'SSS.SSSS'], STONE),
  stoneTop: sp(['SS..SS..', 'SS..SS..', 'SSSSSSSS', 'S.S.S.S.', 'SSSSSSSS', '........', 'SSSSSSSS', '........'], STONE),
  woodWall: sp(['RRRRRRRR', 'R.RR.RR.', 'R.RR.RR.', 'R.RR.RR.', 'RRRRRRRR', 'R.RR.RR.', 'R.RR.RR.', 'R.RR.RR.'], DIRT),
  woodRoof: sp(['RRRRRRRR', '........', 'RRRRRRRR', '.o.o.o.o', 'RRRRRRRR', '........', 'RRRRRRRR', '.o.o.o.o'], DIRT),
  windowWood: sp(['RRRRRRRR', 'R.oooo.R', 'R.oYYo.R', 'R.oooo.R', 'R.oYYo.R', 'R.oooo.R', 'R.RRRR.R', 'R.RR.RR.'], DIRT),
  windowStone: sp(['SSS.SSSS', 'SSS.SSSS', '..ssss..', 'S.sYYs.S', 'S.sYYs.S', '..ssss..', 'SSS.SSSS', 'SSS.SSSS'], STONE),
  chimneyWood: chimney(WOOD_ROOF, STONE_STACK, DIRT, { k: '#05080e' }),
  chimneyStone: chimney(STONE_ROOF, BRICK_STACK, STONE, { k: '#05080e' }),
  smoke: anim([rise(SMOKE, 0), rise(SMOKE, 2), rise(SMOKE, 4), rise(SMOKE, 6)]),
  door: sp(['.RRRRRR.', 'RR....RR', 'R......R', 'R......R', 'R....Y.R', 'R......R', 'R......R', 'R......R'], '#150a06'),
  cross: sp(['........', '........', '...YY...', '...YY...', '.YYYYYY.', '.YYYYYY.', '...YY...', '...YY...']),
  // Pointed roof: left slope, right slope, and the peak (with the cross's foot).
  roofLeft: roofShape((x, y) => (x === 7 - y ? 'edge' : x > 7 - y ? 'in' : null)),
  roofRight: roofShape((x, y) => (x === y ? 'edge' : x < y ? 'in' : null)),
  roofPeak: roofShape(
    (x, y) => (y < 4 ? null : x === 7 - y || x === y ? 'edge' : x > 7 - y && x < y ? 'in' : null),
    ['...YY...', '...YY...', '...YY...', '...YY...'],
  ),

  // ---------- interiors ----------
  floor: sp(['....r...', '....r...', '....r...', 'rrrrrrrr', 'r.......', 'r.......', 'r.......', 'rrrrrrrr'], FLOOR),
  pew: sp(['........', 'RRRRRRRR', 'R......R', 'RRRRRRRR', 'R......R', 'R......R', '........', '........'], FLOOR),
  altar: sp(['YYYYYYYY', 'wwwwwwww', 'wXXwwXXw', 'wwwwwwww', '.w....w.', '.w....w.', '.w....w.', '........'], FLOOR),
  candle: anim([
    ['...Y....', '..YXY...', '...Y....', '..www...', '..www...', '..www...', '.YYYYY..', '........'],
    ['....Y...', '...YXY..', '...Y....', '..www...', '..www...', '..www...', '.YYYYY..', '........'],
  ], FLOOR),
  anvil: sp(['........', '........', 'sssssss.', '.sSSSSSs', '...ss...', '...ss...', '..ssss..', '.ssssss.'], DIRT),
  forge: anim([
    ['ssssssss', 's..X...s', 's.XYX..s', 's.XYYX.s', 'sXYYYXXs', 'sXXXXXXs', 'ssssssss', 'ssssssss'],
    ['ssssssss', 's...X..s', 's..XYX.s', 's.XYYX.s', 'sXXYYYXs', 'sXXXXXXs', 'ssssssss', 'ssssssss'],
  ], STONE),
  table: sp(['........', 'RRRRRRRR', 'oooooooo', '.R....R.', '.R....R.', '.R....R.', '........', '........'], FLOOR),
  wheat: anim([
    ['.Y...Y..', '.YF..YF.', '..F...F.', '..F...F.', 'Y...Y...', 'YF..YF..', '.F...F..', '.F...F..'],
    ['..Y...Y.', '.FY..FY.', '..F...F.', '..F...F.', '.Y...Y..', 'FY..FY..', '.F...F..', '.F...F..'],
  ], DIRT),
  forgeCold: sp(['ssssssss', 's......s', 's......s', 's......s', 's.s..s.s', 'sSsSSsSs', 'ssssssss', 'ssssssss'], STONE),
  rubble: sp(['..ss....', '.sSSs.s.', 'sSSSsSSs', 'sSSsSSSs', '.ssSSSs.', 'sSSssSSs', 'sSSSSSSs', '.ssssss.']),
  logs: sp(['........', '.oo..oo.', 'oRRooRRo', 'oRRooRRo', '.oooooo.', 'oRRooRRo', 'oRRooRRo', '.oo..oo.']),
  wood: sp(['........', '..RRRR..', '.oRRRRo.', '..YYYY..', '.oRRRRo.', '..RRRR..', '........', '........']),
  sickbed: sp(['........', 'R......R', 'Rwwhbbbb', 'Rwhhbbbb', 'RRRRRRRR', 'R......R', '........', '........'], FLOOR, { h: '#e8c9a0', b: '#6d8ce0' }),
  barrel: sp(['..RRRR..', '.RrrrrR.', '.YYYYYY.', '.RrrrrR.', '.RrrrrR.', '.YYYYYY.', '.RrrrrR.', '..RRRR..'], DIRT),

  // ---------- people (h = head/hood, c = body, x = held thing) ----------
  hero: sp(['..hh....', '..cc..Y.', '.cccc.Y.', 'c.cc.cY.', 'c.cc..Y.', '..cc..Y.', '.c..c.Y.', '.c..c...'], undefined, { h: '#2f8fb0', c: '#5ccbe8' }),
  priest: sp(['...hh...', '...hh...', '..cxxc..', '.ccxxcc.', 'c.cxxc.c', '..cxxc..', '.ccxxcc.', '.cccccc.'], undefined, { h: '#e8c9a0', c: '#ecebe4', x: '#d9493c' }),
  fisher: sp(['...hh..x', '...cc.x.', '..cccx..', '.c.ccc..', '.c.cc.c.', '..cccc..', '..c..c..', '..c..c..'], undefined, { h: '#c9a13a', c: '#4a9fd0', x: '#b0823f' }),
  smith: sp(['...hh..x', '...cc.xx', '.cccccx.', 'c.cccc..', 'c.cccc..', '..cccc..', '..c..c..', '.cc..cc.'], undefined, { h: '#e8c9a0', c: '#c0703f', x: '#b9c0c9' }),
  child: sp(['........', '...hh...', '...cc...', '..cccc..', '.c.cc.c.', '...cc...', '..c..c..', '..c..c..'], undefined, { h: '#e0b050', c: '#e07a9a' }),
  hooded: sp(['..cccc..', '.cc..cc.', '.c.hh.c.', '.cccccc.', 'cccccccc', '.cccccc.', '.cccccc.', '..c..c..'], undefined, { c: '#8a8f99', h: '#c9a13a' }),
  minstrel: sp(['..hhhh..', '...cc...', '..cccc..', '.cc.xx..', 'c.cxxxx.', '..cxxx..', '..c..c..', '..c..c..'], undefined, { h: '#d9493c', c: '#9b6bd0', x: '#b0823f' }),
  veiled: sp(['..cccc..', '.cchhcc.', '.ch..hc.', '.cccccc.', 'cccccccc', '.cccccc.', '.cccccc.', '..c..c..'], undefined, { c: '#b8a9d9', h: '#7d6fa3' }),
  farmer: sp(['...hh...', '...cc...', '..cccc..', '.c.xx.c.', '.c.xx.c.', '..cxxc..', '..c..c..', '..c..c..'], undefined, { h: '#8c4a2b', c: '#6e9a34', x: '#ecebe4' }),
  girl: sp(['........', '...hh...', '...cc...', '..cccc..', '.c.cc.c.', '...cc...', '..c..c..', '..c..c..'], undefined, { h: '#8c4a2b', c: '#d9a53a' }),
  goose: sp(['........', '....ww..', '....wwY.', '....w...', '.wwwww..', 'wwwwwww.', '.wwwww..', '..Y..Y..']),
  guard: sp(['.x.hh...', '.x.cc...', '.xcccc..', '.xccccc.', '.x.ccc.c', '.x.cc...', '.xc..c..', '.xc..c..'], undefined, { h: '#e8c9a0', c: '#6e9a34', x: '#b9c0c9' }),

  // ---------- objects & icons ----------
  chest: sp(['........', '.YYYYYY.', 'YRRRRRRY', 'YYYYYYYY', 'YRRYYRRY', 'YRRRRRRY', 'YYYYYYYY', '........']),
  chestOpen: sp(['.YYYYYY.', '.Y....Y.', 'YYYYYYYY', 'YrrrrrrY', 'YRRYYRRY', 'YRRRRRRY', 'YYYYYYYY', '........']),
  sign: sp(['........', '.RRRRRR.', '.RYYYYR.', '.RRRRRR.', '...RR...', '...RR...', '...RR...', '........']),
  rope: sp(['...F....', '...F....', '...F....', '...F....', '...F....', '...F....', '..FFF...', '..FFF...']),
  markExclaim: sp(['...YY...', '...YY...', '...YY...', '...YY...', '...YY...', '........', '...YY...', '........']),
  markQuestion: sp(['..YYYY..', '.YY..YY.', '.....YY.', '....YY..', '...YY...', '........', '...YY...', '........']),
  coin: sp(['........', '..YYYY..', '.YY..YY.', '.Y.YY.Y.', '.Y.YY.Y.', '.YY..YY.', '..YYYY..', '........']),
  clapper: sp(['..YYYY..', '..Y..Y..', '...YY...', '...ss...', '...ss...', '..ssss..', '.ssssss.', '..ssss..']),
};

const cache = new Map<string, HTMLCanvasElement>();

function bake(name: string, frame: number): HTMLCanvasElement {
  const def = SPRITES[name];
  if (!def) throw new Error(`Unknown sprite "${name}"`);
  const rows = def.frames[frame % def.frames.length];
  const c = document.createElement('canvas');
  c.width = c.height = TILE;
  const ctx = c.getContext('2d')!;
  if (def.bg) {
    ctx.fillStyle = def.bg;
    ctx.fillRect(0, 0, TILE, TILE);
  }
  rows.forEach((row, y) => {
    if (row.length !== TILE || rows.length !== TILE) throw new Error(`Sprite "${name}" must be 8x8 (row ${y})`);
    [...row].forEach((ch, x) => {
      if (ch === '.') return;
      const color = def.colors?.[ch] ?? PALETTE[ch];
      if (!color) throw new Error(`Sprite "${name}" uses unknown colour "${ch}"`);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });
  return c;
}

/** A baked 8x8 canvas for a sprite. `frame` loops over the sprite's frames. */
export function sprite(name: string, frame = 0): HTMLCanvasElement {
  const key = `${name}:${frame % (SPRITES[name]?.frames.length ?? 1)}`;
  let c = cache.get(key);
  if (!c) cache.set(key, (c = bake(name, frame)));
  return c;
}

/** Draw a sprite into a small DOM canvas (portraits, HUD icons). */
export function paintIcon(target: HTMLCanvasElement, name: string, bg = BG) {
  target.width = target.height = TILE;
  const ctx = target.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, TILE, TILE);
  if (name) ctx.drawImage(sprite(name), 0, 0);
}
