import { Story } from 'inkjs';
import { playTune, type Tune } from './audio';
import type { Beat, Conversation } from './dialogue';
import type { GameState } from './state';

/**
 * Runs ink conversations and connects them to the game.
 *
 * Ink calls these game functions (declare them with EXTERNAL in ink):
 *   flag(name)  set_flag(name)  clear_flag(name)
 *   holds(item) give(item)      take(item)
 *   coins()     add_coins(n)    reveal(actor)   cutscene(id)
 *   count(name) add_count(name, n)   music(tune)
 *
 * A line tagged #who:<actor id> (or #who:you) changes the speaker.
 */
export class InkRunner {
  readonly story: Story;

  constructor(json: string, state: GameState, tunes: Record<string, Tune> = {}) {
    const st = (this.story = new Story(json));
    const bind = (name: string, fn: (...args: any[]) => unknown, lookaheadSafe = false) =>
      st.BindExternalFunction(name, fn, lookaheadSafe);
    bind('flag', (f: string) => state.has(f), true);
    bind('set_flag', (f: string) => state.set(f));
    bind('clear_flag', (f: string) => state.unset(f));
    bind('holds', (i: string) => state.holds(i), true);
    bind('give', (i: string) => state.give(i));
    bind('take', (i: string) => state.take(i));
    bind('coins', () => state.coins, true);
    bind('add_coins', (n: number) => (state.coins += n));
    bind('count', (name: string) => state.count(name), true);
    bind('add_count', (name: string, n: number) => state.add(name, n));
    bind('reveal', (a: string) => state.reveal(a));
    bind('cutscene', (id: string) => state.queue(id));
    bind('music', (name: string) => {
      const tune = tunes[name];
      if (!tune) throw new Error(`Unknown tune "${name}"`);
      playTune(tune);
    });
  }

  /** Start a conversation at a knot, such as "mara" or "bryn.song". */
  conversation(knot: string): Conversation {
    const st = this.story;
    st.ChoosePathString(knot);
    return {
      next(): Beat | null {
        while (st.canContinue) {
          const text = (st.Continue() ?? '').trim();
          if (!text) continue;
          let who: string | undefined;
          for (const tag of st.currentTags ?? []) {
            const m = /^who:\s*(\S+)$/.exec(tag.trim());
            if (m) who = m[1];
          }
          return { who, text };
        }
        return null;
      },
      choices: () => st.currentChoices.map((c) => c.text),
      choose: (i) => st.ChooseChoiceIndex(i),
    };
  }

  save = () => this.story.state.ToJson();
  load = (json: string) => this.story.state.LoadJson(json);
  reset = () => this.story.ResetState();
}
