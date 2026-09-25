import type { GameState } from '../engine/state';

/** The main goal. Check the most advanced state first. */
function main(s: GameState): string {
  if (s.has('osric_coming')) return 'Meet the old ringer at the church.';
  if (s.holds('clapper')) return 'Bring the clapper to Brother Aldric.';
  if (!s.has('quest')) return s.has('met_hal') ? 'Find Brother Aldric at the church.' : 'Walk north to Ashford.';
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

export function objectives(s: GameState): string[] {
  return [main(s), veil(s)].filter((o): o is string => !!o);
}
