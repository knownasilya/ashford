import type { GameState } from '../engine/state';

/** The main goal. Check the most advanced state first. */
function main(s: GameState): string {
  if (s.has('osric_coming')) return 'Meet the old ringer at the church.';
  if (s.holds('clapper')) return 'Bring the clapper to Brother Aldric.';
  if (!s.has('quest')) return s.has('met_hal') ? 'Find Brother Aldric at the church.' : 'Walk north to Ashford.';
  if ((s.has('clue_keep') || s.has('heard_voice')) && !s.has('keep_open')) {
    if (!s.has('heard_voice')) return 'Search the old keep, north of the village.';
    const help = ['help_tobin', 'help_hal'].filter(s.has).length;
    return help === 2 ? 'Go back to the keep. Help is on the way.' : `Someone is trapped in the keep. Find strong hands. (${help}/2)`;
  }
  if (s.has('keep_open') && !s.has('met_osric')) return 'Talk to the man you freed in the keep.';
  if (s.has('osric_admitted')) return `${s.knows('osric') ? 'Osric' : 'The hooded man'} has the clapper. What now?`;
  if (s.has('clue_keep')) return 'Search the old keep, north of the village.';
  return 'Ask the villagers about the clapper.';
}

/** Side quest: the veiled woman's name. */
function veil(s: GameState): string | null {
  if (!s.has('veil_met') || s.has('elswyth_named')) return null;
  const clues = ['clue_e', 'clue_elves', 'clue_names'].filter(s.has).length;
  return clues === 3 ? 'You can guess her name now. Find her.' : `Learn the veiled woman's name. Clues: ${clues}/3`;
}

/** Side task: fuel for Tobin's forge, one bundle per trip. */
function wood(s: GameState): string | null {
  if (!s.has('need_wood') || s.has('forge_lit')) return null;
  const n = s.count('wood_delivered');
  return s.holds('wood') ? `Carry the wood to Tobin. (${n}/3 delivered)` : `Fetch wood from the farm east of town. (${n}/3)`;
}

export function objectives(s: GameState): string[] {
  return [main(s), wood(s), veil(s)].filter((o): o is string => !!o);
}
