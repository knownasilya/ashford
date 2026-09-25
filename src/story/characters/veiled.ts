import type { ActorDef } from '../../engine/types';

/**
 * The veiled woman. Her talk is in src/story/ink/veiled.ink.
 * No role and no `introduce`: she shows as "???" until you guess her name.
 */
export const veiled: ActorDef = {
  id: 'elswyth',
  name: 'Elswyth',
  sprite: 'veiled',
  voice: 1.05,
  person: true,
  ink: 'veiled',
  marker: (s) => (s.has('veil_met') && !s.has('elswyth_named') && s.has('clue_e') && s.has('clue_elves') && s.has('clue_names') ? '?' : undefined),
};
