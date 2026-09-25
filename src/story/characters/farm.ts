import type { ActorDef } from '../../engine/types';

/*
 * Hollin Farm, east of town. Col is Tobin's son and helper at the forge;
 * he is sick in bed. Hild is his wife, Ebba their daughter.
 * Their talk is in src/story/ink/farm.ink.
 */

export const hild: ActorDef = {
  id: 'hild',
  name: 'Hild',
  role: 'Farmer',
  sprite: 'farmer',
  voice: 1.15,
  person: true,
  introduce: 'Hild. This is our farm, mine and Col\'s.',
  ink: 'hild',
};

export const col: ActorDef = {
  id: 'col',
  name: 'Col',
  sprite: 'sickbed',
  voice: 0.85,
  person: true,
  ink: 'col',
};

export const ebba: ActorDef = {
  id: 'ebba',
  name: 'Ebba',
  sprite: 'girl',
  voice: 2,
  person: true,
  introduce: 'Ebba! I am in charge of the goose.',
  ink: 'ebba',
};

export const goose: ActorDef = {
  id: 'goose',
  name: 'Goose',
  sprite: 'goose',
  voice: 2.4,
  ink: 'goose',
};

/**
 * The woodpile. You carry one bundle at a time (see playerSpeed in
 * src/story/index.ts: carrying wood slows you down).
 */
export const woodpile: ActorDef = {
  id: 'woodpile',
  name: 'Woodpile',
  sprite: 'logs',
  dialogue: {
    start: (s) =>
      s.has('forge_lit') ? 'done'
      : !s.has('need_wood') ? 'idle'
      : !s.has('wood_ok') ? 'ask'
      : s.holds('wood') ? 'full'
      : 'take',
    nodes: {
      idle: { lines: ['A neat stack of split firewood.'] },
      ask: { lines: ['A neat stack of split firewood. It belongs to someone. Better ask before you take any.'] },
      full: { lines: ['Your arms are full. Take this bundle to Tobin first.'] },
      take: {
        do: (s) => s.give('wood'),
        lines: [(s) => `You heave a bundle of wood onto your shoulder. It is heavy. (Bundle ${s.count('wood_delivered') + 1} of 3)`],
      },
      done: { lines: ['Tobin has all the wood he needs.'] },
    },
  },
};

/** Tobin's forge: cold until you bring the wood. */
export const forge: ActorDef = {
  id: 'forge',
  name: 'Forge',
  sprite: (s) => (s.has('forge_lit') ? 'forge' : 'forgeCold'),
  dialogue: {
    start: (s) => (s.has('forge_lit') ? 'lit' : 'cold'),
    nodes: {
      cold: { lines: ['The coals are grey and cold.'] },
      lit: { lines: ['The fire roars. You step back from the heat.'] },
    },
  },
};
