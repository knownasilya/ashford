import { BG, STEP_MS, TILE, VIEW_H, VIEW_W } from './config';
import { sprite } from './sprites';
import type { GameState } from './state';
import { TILES, type TileDef } from './tiles';
import type { ActorDef, Dir, Marker, Placement, SceneDef, Story, Warp } from './types';

export const DELTA: Record<Dir, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

/** Something that walks tile by tile, with a smooth tween between tiles. */
interface Mover {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  t: number; // 0..1 progress from (fromX, fromY) to (x, y)
  dir: Dir;
  flip: boolean;
  queue: Dir[];
  onDone?: () => void;
}

const mover = (x: number, y: number, dir: Dir = 'down'): Mover => ({
  x, y, fromX: x, fromY: y, t: 1, dir, flip: dir === 'left', queue: [],
});

function begin(m: Mover, d: Dir) {
  m.dir = d;
  if (d === 'left' || d === 'right') m.flip = d === 'left';
  m.fromX = m.x;
  m.fromY = m.y;
  m.x += DELTA[d][0];
  m.y += DELTA[d][1];
  m.t = 0;
}

/** Advance a mover. Returns true when it arrives on a new tile. */
function tick(m: Mover, dt: number, speed = 1): boolean {
  let arrived = false;
  if (m.t < 1) {
    m.t = Math.min(1, m.t + (dt * speed) / STEP_MS);
    arrived = m.t === 1;
  }
  if (m.t === 1) {
    if (m.queue.length) begin(m, m.queue.shift()!);
    else if (m.onDone) {
      const done = m.onDone;
      m.onDone = undefined;
      done();
    }
  }
  return arrived;
}

const lerp = (m: Mover) => ({ x: m.fromX + (m.x - m.fromX) * m.t, y: m.fromY + (m.y - m.fromY) * m.t });

interface ActorInst {
  def: ActorDef;
  place: Placement;
  m: Mover;
}

export class World {
  scene!: SceneDef;
  w = 0;
  h = 0;
  player = mover(0, 0);
  actors: ActorInst[] = [];
  /** Called when the player finishes a step onto a new tile. */
  onArrive?: (x: number, y: number) => void;

  private tiles: Record<string, TileDef>;

  constructor(private story: Story, private state: GameState) {
    this.tiles = { ...TILES, ...story.tiles };
  }

  load(sceneId: string, x: number, y: number, dir: Dir = 'down') {
    const scene = this.story.scenes[sceneId];
    if (!scene) throw new Error(`Unknown scene "${sceneId}"`);
    this.scene = scene;
    this.h = scene.map.length;
    this.w = scene.map[0].length;
    scene.map.forEach((row, i) => {
      if (row.length !== this.w) throw new Error(`Scene "${sceneId}" row ${i} is ${row.length} wide, expected ${this.w}`);
      for (const ch of row) if (!this.tiles[ch]) throw new Error(`Scene "${sceneId}" uses unknown tile "${ch}"`);
    });
    this.player = mover(x, y, dir);
    this.actors = [];
    this.refreshActors();
  }

  /** Add or remove actors whose `when` condition changed. */
  refreshActors() {
    const wanted = this.scene.actors.filter((p) => !p.when || p.when(this.state));
    this.actors = this.actors.filter((a) => wanted.includes(a.place));
    for (const place of wanted) {
      if (this.actors.some((a) => a.place === place)) continue;
      const def = this.story.actors[place.actor];
      if (!def) throw new Error(`Unknown actor "${place.actor}" in scene "${this.scene.id}"`);
      this.actors.push({ def, place, m: mover(place.x, place.y, place.dir) });
    }
  }

  get busy() {
    return this.player.t < 1 || this.player.queue.length > 0;
  }

  tile(x: number, y: number): string | null {
    return this.scene.map[y]?.[x] ?? null;
  }

  solid(x: number, y: number): boolean {
    const ch = this.tile(x, y);
    return !ch || this.tiles[ch].solid || !!this.actorAt(x, y);
  }

  actorAt(x: number, y: number): ActorDef | undefined {
    return this.actors.find((a) => a.m.x === x && a.m.y === y)?.def;
  }

  warpAt(x: number, y: number): Warp | undefined {
    return this.scene.warps.find((w) => w.x === x && w.y === y);
  }

  /** The actor on the tile the player faces. */
  facing(): ActorDef | undefined {
    const [dx, dy] = DELTA[this.player.dir];
    return this.actorAt(this.player.x + dx, this.player.y + dy);
  }

  /** Try to walk the player one tile. Returns a locked warp if one blocks the way. */
  step(d: Dir): Warp | undefined {
    const p = this.player;
    p.dir = d;
    if (d === 'left' || d === 'right') p.flip = d === 'left';
    const x = p.x + DELTA[d][0];
    const y = p.y + DELTA[d][1];
    const warp = this.warpAt(x, y);
    if (warp?.when && !warp.when(this.state)) return warp;
    if (!this.solid(x, y)) begin(p, d);
    return undefined;
  }

  private mover(id: string): Mover {
    if (id === 'player') return this.player;
    const a = this.actors.find((a) => a.def.id === id);
    if (!a) throw new Error(`Actor "${id}" is not in scene "${this.scene.id}"`);
    return a.m;
  }

  /** Scripted walk for cutscenes. Ignores collisions. */
  walk(id: string, path: Dir[]): Promise<void> {
    const m = this.mover(id);
    return new Promise((resolve) => {
      m.queue.push(...path);
      m.onDone = resolve;
    });
  }

  face(id: string, dir: Dir) {
    const m = this.mover(id);
    m.dir = dir;
    if (dir === 'left' || dir === 'right') m.flip = dir === 'left';
  }

  update(dt: number) {
    const speed = this.story.playerSpeed?.(this.state) ?? 1;
    if (tick(this.player, dt, speed)) this.onArrive?.(this.player.x, this.player.y);
    for (const a of this.actors) tick(a.m, dt);
  }

  private marker(def: ActorDef): Marker {
    const custom = def.marker?.(this.state);
    if (custom !== undefined) return custom;
    return def.person && !this.state.has(`talked_${def.id}`) ? '!' : null;
  }

  render(ctx: CanvasRenderingContext2D, time: number) {
    const vw = VIEW_W * TILE;
    const vh = VIEW_H * TILE;
    const p = lerp(this.player);
    const camera = (center: number, size: number, view: number) =>
      size <= view ? (size - view) / 2 : Math.max(0, Math.min(size - view, center - view / 2));
    const cx = Math.round(camera(p.x * TILE + TILE / 2, this.w * TILE, vw));
    const cy = Math.round(camera(p.y * TILE + TILE / 2, this.h * TILE, vh));

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, vw, vh);

    const frame = Math.floor(time / 500);
    const x0 = Math.max(0, Math.floor(cx / TILE));
    const y0 = Math.max(0, Math.floor(cy / TILE));
    const tiles = (layer: 'ground' | 'over') => {
      for (let y = y0; y <= Math.min(this.h - 1, y0 + VIEW_H); y++) {
        for (let x = x0; x <= Math.min(this.w - 1, x0 + VIEW_W); x++) {
          const t = this.tiles[this.tile(x, y)!];
          const own = typeof t.sprite === 'function' ? t.sprite(this.state) : t.sprite;
          const name = layer === 'over' ? (t.over ? own : null) : t.over ? t.under : own;
          if (name) ctx.drawImage(sprite(name, frame), x * TILE - cx, y * TILE - cy);
        }
      }
    };

    tiles('ground');

    const people = [
      ...this.actors.map((a) => ({ m: a.m, def: a.def as ActorDef | null })),
      { m: this.player, def: null },
    ].sort((a, b) => lerp(a.m).y - lerp(b.m).y);

    for (const { m, def } of people) {
      const pos = lerp(m);
      const sx = Math.round(pos.x * TILE - cx);
      const sy = Math.round(pos.y * TILE - cy);
      const name = def ? (typeof def.sprite === 'function' ? def.sprite(this.state) : def.sprite) : 'hero';
      ctx.save();
      if (m.flip) {
        ctx.translate(sx + TILE, sy);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite(name, frame), 0, 0);
      } else {
        ctx.drawImage(sprite(name, frame), sx, sy);
      }
      ctx.restore();
    }

    // Roofs cover whoever walks behind them.
    tiles('over');

    // Markers go on top of everything, so a roof never hides them.
    const bob = Math.floor(time / 300) % 2;
    for (const { m, def } of people) {
      const mark = def && this.marker(def);
      if (!mark) continue;
      const pos = lerp(m);
      ctx.drawImage(
        sprite(mark === '!' ? 'markExclaim' : 'markQuestion'),
        Math.round(pos.x * TILE - cx),
        Math.round(pos.y * TILE - cy) - TILE - bob,
      );
    }
  }
}
