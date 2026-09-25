import type { ActorDef } from '../../engine/types';

/** Bryn's talk is in src/story/ink/bryn.ink. */
export const bryn: ActorDef = {
  id: 'bryn',
  name: 'Bryn the Minstrel',
  role: 'Minstrel',
  sprite: 'minstrel',
  voice: 1.1,
  person: true,
  introduce: 'Bryn of Coldwater. Remember it. I will be famous one day.',
  ink: 'bryn',
};
