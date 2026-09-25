import '@fontsource/press-start-2p';
import './style.css';
import { unlockAudio } from './engine/audio';
import { TILE, VIEW_H, VIEW_W } from './engine/config';
import { play, type Director } from './engine/cutscene';
import { DialogueBox, nodeConversation, txt, withNameQuestion, type Conversation } from './engine/dialogue';
import { InkRunner } from './engine/ink';
import { input } from './engine/input';
import { paintIcon } from './engine/sprites';
import { clearSave, GameState, loadGame, saveGame } from './engine/state';
import type { ActorDef, Warp } from './engine/types';
import { UI } from './engine/ui';
import { World } from './engine/world';
import { story } from './story';

// ------------------------------------------------------------------ setup
const screen = document.getElementById('screen')!;
const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = VIEW_W * TILE;
canvas.height = VIEW_H * TILE;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

function fit() {
  const s = Math.max(1, Math.floor(Math.min(innerWidth / canvas.width, innerHeight / canvas.height)));
  screen.style.width = `${canvas.width * s}px`;
  screen.style.height = `${canvas.height * s}px`;
  document.documentElement.style.setProperty('--u', `${s}px`);
  document.documentElement.style.setProperty('--fs', `${s >= 6 ? 16 : s >= 4 ? 12 : 8}px`);
}
addEventListener('resize', fit);
fit();
addEventListener('keydown', unlockAudio, { once: true });
addEventListener('pointerdown', unlockAudio, { once: true });

document.getElementById('game-title')!.textContent = story.title;
document.getElementById('game-subtitle')!.textContent = story.subtitle;
paintIcon(document.getElementById('coin-icon') as HTMLCanvasElement, 'coin');

const state = new GameState();
const you: ActorDef = { id: 'you', name: 'You', sprite: 'hero', voice: 1.4 };
const narrator: ActorDef = { id: 'narrator', name: '', sprite: '', voice: 0.5 };
const actor = (id: string): ActorDef => {
  if (id === 'narrator') return narrator;
  const a = story.actors[id];
  if (!a) throw new Error(`Unknown actor "${id}"`);
  return a;
};
const world = new World(story, state);
const ui = new UI();
const dialogue = new DialogueBox(state, actor, you);
const ink = story.ink ? new InkRunner(story.ink, state) : null;

// ------------------------------------------------------------------ flow
type Mode = 'title' | 'play' | 'busy' | 'ending';
let mode: Mode = 'title';
let lockedWarp: Warp | undefined;

const director: Director = {
  world, ui, dialogue, state, you, ink, actor,
  async talk(id, node) {
    const def = actor(id);
    let conv: Conversation;
    if (def.ink) {
      if (!ink) throw new Error(`Actor "${id}" uses ink, but the story has no ink file`);
      conv = ink.conversation(node ?? def.ink);
    } else if (def.dialogue) {
      conv = nodeConversation(def.dialogue, state, node);
    } else return;
    await dialogue.open(def, withNameQuestion(conv, def, state));
    state.set(`talked_${id}`);
    world.refreshActors();
  },
  warp(scene, x, y, dir) {
    world.load(scene, x, y, dir);
    ui.banner(world.scene.name);
  },
  ending(id) {
    const e = story.endings[id];
    if (!e) throw new Error(`Unknown ending "${id}"`);
    mode = 'ending';
    clearSave();
    ui.showHud(false);
    ui.showEnding(e, story.year, state);
  },
};

function cutscene(id: string) {
  const c = story.cutscenes[id];
  if (!c) throw new Error(`Unknown cutscene "${id}"`);
  return play(c, director);
}

/** Block player control while `fn` runs, then play any queued cutscenes. */
async function busy(fn: () => Promise<void>) {
  mode = 'busy';
  await fn();
  while (state.queued.length) await cutscene(state.queued.shift()!);
  if (mode !== 'busy') return; // an ending took over
  mode = 'play';
  save();
}

async function enterScene() {
  const on = world.scene.onEnter;
  if (!on) return;
  const seen = `seen_${on.cutscene}`;
  if (on.once && state.has(seen)) return;
  state.set(seen);
  await cutscene(on.cutscene);
}

function useWarp(w: Warp) {
  busy(async () => {
    await ui.fade('out');
    director.warp(w.to, w.tx, w.ty, w.dir);
    await ui.fade('in');
    await enterScene();
  });
}

world.onArrive = (x, y) => {
  lockedWarp = undefined;
  const w = world.warpAt(x, y);
  if (mode === 'play' && w) useWarp(w);
};

function save() {
  saveGame({
    scene: world.scene.id, x: world.player.x, y: world.player.y,
    flags: [...state.flags], items: [...state.items], coins: state.coins,
    ink: ink?.save(),
  });
}

function reset() {
  state.flags.clear();
  state.items.clear();
  state.queued = [];
  state.coins = story.start.coins;
  ink?.reset();
}

function newGame() {
  reset();
  clearSave();
  ui.hideTitle();
  ui.showHud(true);
  ui.setBlack(true);
  const { scene, x, y, dir, cutscene: intro } = story.start;
  world.load(scene, x, y, dir);
  busy(async () => {
    if (intro) await cutscene(intro);
    else await ui.fade('in');
  });
}

function continueGame() {
  const s = loadGame();
  if (!s) return newGame();
  reset();
  s.flags.forEach((f) => state.flags.add(f));
  s.items.forEach((i) => state.items.add(i));
  state.coins = s.coins;
  if (s.ink) ink?.load(s.ink);
  ui.hideTitle();
  ui.showHud(true);
  ui.setBlack(false);
  director.warp(s.scene, s.x, s.y, 'down');
  mode = 'play';
}

function toTitle() {
  mode = 'title';
  ui.hideEnding();
  ui.showHud(false);
  ui.setBlack(false);
  reset();
  world.load(story.start.scene, 19, 16, 'down'); // a backdrop behind the menu
  const items = [{ label: 'New Game', run: newGame }];
  if (loadGame()) items.unshift({ label: 'Continue', run: continueGame });
  ui.showTitle(items);
}

// ------------------------------------------------------------------ loop
function playerInput() {
  if (world.busy) return;
  const d = input.dir();
  if (d) {
    const locked = world.step(d);
    if (locked && locked !== lockedWarp) {
      lockedWarp = locked;
      const text = txt(locked.locked ?? 'It will not open.', state);
      busy(() => play([{ say: [{ who: 'you', text }] }], director));
    }
    return;
  }
  if (input.take('confirm')) {
    const a = world.facing();
    if (a?.dialogue || a?.ink) busy(() => director.talk(a.id));
  }
}

function update(dt: number, now: number) {
  if (!ui.update()) {
    dialogue.update(dt);
    if (mode === 'play' && !dialogue.isOpen) playerInput();
    if (mode === 'ending' && input.take('confirm')) toTitle();
  }
  world.update(dt);
  world.render(ctx, now);
  ui.updateHud(state, story.objective(state));
  input.endFrame();
}

let last = performance.now();
function frame(now: number) {
  update(Math.min(50, now - last), now);
  last = now;
  requestAnimationFrame(frame);
}

toTitle();
requestAnimationFrame(frame);

// Dev-only console helpers: ashford.state.flags, ashford.step(500), ...
if (import.meta.env.DEV) {
  Object.assign(window, {
    ashford: {
      state, world, story,
      get mode() { return mode; },
      /** Run the game for `ms` of game time, in 16 ms frames. */
      step(ms = 16) {
        for (let t = 0; t < ms; t += 16) update(16, performance.now());
      },
    },
  });
}
