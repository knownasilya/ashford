import { bell } from './audio';
import { nodeConversation, type DialogueBox } from './dialogue';
import type { InkRunner } from './ink';
import type { GameState } from './state';
import type { UI } from './ui';
import type { World } from './world';
import type { ActorDef, Cutscene } from './types';

export interface Director {
  world: World;
  ui: UI;
  dialogue: DialogueBox;
  state: GameState;
  you: ActorDef;
  ink: InkRunner | null;
  actor(id: string): ActorDef;
  talk(actorId: string, node?: string): Promise<void>;
  warp(scene: string, x: number, y: number, dir?: 'up' | 'down' | 'left' | 'right'): void;
  ending(id: string): void;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Run cutscene steps one after another. */
export async function play(steps: Cutscene, d: Director) {
  for (const s of steps) {
    if ('card' in s) await d.ui.card(s.card);
    else if ('fade' in s) await d.ui.fade(s.fade);
    else if ('wait' in s) await sleep(s.wait);
    else if ('move' in s) await d.world.walk(s.move, s.path);
    else if ('face' in s) d.world.face(s.face, s.dir);
    else if ('say' in s) await d.dialogue.open(d.you, nodeConversation({ start: () => 'say', nodes: { say: { lines: s.say } } }, d.state));
    else if ('ink' in s) {
      if (!d.ink) throw new Error('This story has no ink file');
      await d.dialogue.open(s.as ? d.actor(s.as) : d.you, d.ink.conversation(s.ink));
    }
    else if ('talk' in s) await d.talk(s.talk, s.node);
    else if ('warp' in s) d.warp(s.warp, s.x, s.y, s.dir);
    else if ('do' in s) s.do(d.state);
    else if ('sound' in s) bell();
    else if ('shake' in s) d.ui.shake(s.shake);
    else if ('end' in s) d.ending(s.end);
  }
}
