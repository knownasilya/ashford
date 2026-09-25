import type { ActorDef } from '../../engine/types';

/** Mara's talk is in src/story/ink/mara.ink. */
export const mara: ActorDef = {
  id: 'mara',
  name: 'Mara the Fisher',
  role: 'Fisher',
  sprite: 'fisher',
  voice: 1.2,
  person: true,
  introduce: 'Mara. I fish, when the fish allow it.',
  ink: 'mara',
};
