import { blip } from './audio';
import { TEXT_SPEED } from './config';
import { input } from './input';
import { paintIcon } from './sprites';
import type { GameState } from './state';
import type { ActorDef, Choice, Dialogue, DialogueNode, Line, Text } from './types';

export const txt = (t: Text, s: GameState) => (typeof t === 'function' ? t(s) : t);
const $ = (id: string) => document.getElementById(id)!;

/** One line to show. `who` is an actor id or 'you'; empty means the actor you talk to. */
export interface Beat {
  who?: string;
  text: string;
}

/**
 * Any source of talk: a TypeScript Dialogue graph or an ink knot.
 * The talk box pulls lines with next() until it returns null, then shows
 * choices(). An empty choices() list ends the talk.
 */
export interface Conversation {
  next(): Beat | null;
  choices(): string[];
  choose(i: number): void;
}

/** Walk a TypeScript Dialogue graph as a Conversation. */
export function nodeConversation(dlg: Dialogue, s: GameState, start?: string): Conversation {
  let node: DialogueNode | undefined;
  let idx = 0;
  let visible: Choice[] = [];
  const enter = (id: string) => {
    node = dlg.nodes[id];
    if (!node) throw new Error(`Dialogue node "${id}" not found`);
    idx = 0;
    visible = [];
    node.do?.(s);
  };
  enter(start ?? dlg.start(s));
  return {
    next() {
      while (node) {
        if (idx < node.lines.length) {
          const raw = node.lines[idx++];
          const line: Line = typeof raw === 'object' ? raw : { text: raw };
          return { who: line.who, text: txt(line.text, s) };
        }
        visible = (node.choices ?? []).filter((c) => !c.when || c.when(s));
        if (visible.length) return null;
        if (node.next) enter(node.next);
        else node = undefined;
      }
      return null;
    },
    choices: () => (node ? visible.map((c) => txt(c.text, s)) : []),
    choose(i) {
      const c = visible[i];
      visible = [];
      c.do?.(s);
      if (c.next) enter(c.next);
      else node = undefined;
    },
  };
}

export const ASK_NAME = 'What is your name?';

/**
 * Wrap a conversation so the player can ask a person's name. The extra
 * choice shows while the name is unknown; the answer reveals it, then the
 * same choices come back.
 */
export function withNameQuestion(conv: Conversation, a: ActorDef, s: GameState): Conversation {
  let answer: Beat | null = null;
  const canAsk = () => a.person && a.introduce !== undefined && !s.knows(a.id);
  return {
    next() {
      const b = answer;
      answer = null;
      return b ?? conv.next();
    },
    choices() {
      if (answer) return [];
      const cs = conv.choices();
      return cs.length && canAsk() ? [...cs, ASK_NAME] : cs;
    },
    choose(i) {
      if (canAsk() && i === conv.choices().length) {
        s.reveal(a.id);
        answer = { text: txt(a.introduce!, s) };
      } else {
        conv.choose(i);
      }
    },
  };
}

/**
 * The talk box. It types each line, shows choices after the last line,
 * and resolves open() when the talk ends.
 */
export class DialogueBox {
  private el = $('dialogue');
  private nameEl = $('speaker');
  private textEl = $('text');
  private choicesEl = $('choices');
  private moreEl = $('more');
  private portrait = $('portrait') as HTMLCanvasElement;

  private open_ = false;
  private resolve?: () => void;
  private owner!: ActorDef;
  private conv!: Conversation;
  /** The line after the one on screen, read one step ahead. */
  private pending: Beat | null = null;
  private full = '';
  private shown = 0;
  private voice = 1;
  private choices: string[] = [];
  private sel = 0;

  constructor(
    private state: GameState,
    private actor: (id: string) => ActorDef,
    private you: ActorDef,
  ) {}

  get isOpen() {
    return this.open_;
  }

  /** A person's name once the player learns it. Before that, their role or "???". */
  nameOf(a: ActorDef) {
    return a.person && !this.state.knows(a.id) ? (a.role ?? '???') : a.name;
  }

  open(owner: ActorDef, conv: Conversation): Promise<void> {
    this.owner = owner;
    this.conv = conv;
    this.open_ = true;
    this.el.classList.remove('hidden');
    this.pending = conv.next();
    const done = new Promise<void>((r) => (this.resolve = r));
    if (!this.pending && !conv.choices().length) this.close();
    else this.showNext();
    return done;
  }

  private setSpeaker(whoId?: string) {
    const who = whoId === 'you' ? this.you : whoId ? this.actor(whoId) : this.owner;
    this.nameEl.textContent = this.nameOf(who);
    const spr = typeof who.sprite === 'function' ? who.sprite(this.state) : who.sprite;
    this.portrait.classList.toggle('hidden', !spr);
    paintIcon(this.portrait, spr);
    this.voice = who.voice ?? 1;
  }

  private showNext() {
    const beat = this.pending;
    this.choices = [];
    this.choicesEl.innerHTML = '';
    this.moreEl.classList.add('hidden');
    if (!beat) {
      // No more lines, only choices: keep the box, clear the text.
      this.setSpeaker();
      this.full = '';
      this.shown = 0;
      this.renderText();
      this.lineDone();
      return;
    }
    this.setSpeaker(beat.who); // before reading ahead, so a reveal() there does not rename this line
    this.pending = this.conv.next();
    this.full = beat.text;
    this.shown = 0;
    this.renderText();
  }

  private renderText() {
    const n = Math.floor(this.shown);
    // The hidden tail keeps word wrap stable while text types in.
    this.textEl.innerHTML = '';
    const a = document.createElement('span');
    a.textContent = this.full.slice(0, n);
    const b = document.createElement('span');
    b.className = 'ghost';
    b.textContent = this.full.slice(n);
    this.textEl.append(a, b);
  }

  private lineDone() {
    const choices = this.pending ? [] : this.conv.choices();
    if (choices.length) {
      this.choices = choices;
      this.sel = 0;
      this.renderChoices();
    } else {
      this.moreEl.classList.remove('hidden');
    }
  }

  private renderChoices() {
    this.choicesEl.innerHTML = '';
    this.choices.forEach((c, i) => {
      const li = document.createElement('li');
      li.textContent = `${i + 1}. ${c}`;
      li.classList.toggle('selected', i === this.sel);
      li.onclick = () => this.choose(i);
      this.choicesEl.append(li);
    });
  }

  private choose(i: number) {
    if (!this.choices[i]) return;
    this.conv.choose(i);
    this.pending = this.conv.next();
    if (!this.pending && !this.conv.choices().length) this.close();
    else this.showNext();
  }

  private close() {
    this.open_ = false;
    this.el.classList.add('hidden');
    this.resolve?.();
  }

  update(dt: number) {
    if (!this.open_) return;

    if (this.shown < this.full.length) {
      const before = Math.floor(this.shown);
      this.shown = input.take('confirm') ? this.full.length : Math.min(this.full.length, this.shown + (dt * TEXT_SPEED) / 1000);
      const after = Math.floor(this.shown);
      if (after > before && after < this.full.length && after % 2 === 0 && this.full[after] !== ' ') blip(this.voice);
      this.renderText();
      if (this.shown >= this.full.length) this.lineDone();
      return;
    }

    if (this.choices.length) {
      const n = this.choices.length;
      if (input.take('up')) this.sel = (this.sel + n - 1) % n;
      if (input.take('down')) this.sel = (this.sel + 1) % n;
      this.renderChoices();
      const d = input.takeDigit();
      if (d && d <= n) this.choose(d - 1);
      else if (input.take('confirm')) this.choose(this.sel);
      return;
    }

    if (input.take('confirm')) {
      if (this.pending) this.showNext();
      else this.close();
    }
  }
}
