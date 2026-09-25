import type { ActorDef } from '../../engine/types';

/** A chest that gives coins once. Its flag is its own id. */
function chest(id: string, coins: number, found: string): ActorDef {
  return {
    id,
    name: 'Chest',
    sprite: (s) => (s.has(id) ? 'chestOpen' : 'chest'),
    dialogue: {
      start: (s) => (s.has(id) ? 'empty' : 'full'),
      nodes: {
        full: {
          lines: [found, `You take ${coins} coins.`],
          do: (s) => {
            s.set(id);
            s.coins += coins;
          },
        },
        empty: { lines: ['The chest is empty.'] },
      },
    },
  };
}

export const chestVillage = chest('chest_village', 4, 'Under an old blanket, a purse.');
export const chestKeep = chest('chest_keep', 5, 'Behind a loose stone, a small chest. Someone hid it long ago.');

export const sign: ActorDef = {
  id: 'sign',
  name: 'Signpost',
  sprite: 'sign',
  dialogue: {
    start: () => 'read',
    nodes: {
      read: {
        lines: ['ASHFORD. North over the bridge.', 'Someone has scratched a small bell under the words. There is a line through it.'],
      },
    },
  },
};

export const rope: ActorDef = {
  id: 'rope',
  name: 'Bell Rope',
  sprite: 'rope',
  dialogue: {
    start: (s) => (s.holds('clapper') ? 'ready' : 'still'),
    nodes: {
      still: { lines: ['The bell rope hangs still.', 'High above, the bell waits without its tongue.'] },
      ready: { lines: ['You could pull it. But it is Aldric\'s bell. Give him the clapper first.'] },
    },
  },
};
