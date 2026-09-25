import type { ActorDef } from '../../engine/types';

export const tobin: ActorDef = {
  id: 'tobin',
  name: 'Tobin the Smith',
  role: 'Smith',
  sprite: 'smith',
  voice: 0.7,
  person: true,
  introduce: 'Tobin. I am the smith, if the hammer did not tell you.',
  dialogue: {
    start: (s) => (s.has('talked_tobin') ? 'menu' : 'intro'),
    nodes: {
      intro: {
        lines: ['Mind the sparks.'],
        next: 'name',
      },
      name: {
        do: (s) => s.reveal('tobin'),
        lines: [
          'Tobin. I am the smith here, if the hammer did not tell you.',
          'You are the pilgrim. The whole village talks about you. There is little else to talk about.',
        ],
        next: 'menu',
      },
      menu: {
        lines: [(s) => (s.has('forged') && s.holds('clapper') ? 'Take it to Aldric. It will sing.' : 'What do you need?')],
        choices: [
          {
            text: 'Could you forge a new clapper?',
            next: 'forge',
            when: (s) => s.has('quest') && !s.holds('clapper') && !s.has('osric_coming'),
          },
          { text: 'Who could carry a bell clapper?', next: 'clue', when: (s) => !s.has('tobin_clue') },
          { text: 'Goodbye.' },
        ],
      },
      clue: {
        lines: [
          'A strong man. Or a stubborn one.',
          'I walked the north road yesterday. Something heavy was dragged there. Iron scrapes on the stones.',
        ],
        do: (s) => s.set('clue_keep', 'tobin_clue'),
        next: 'menu',
      },
      forge: {
        lines: ['I could. Good iron costs money, though. Ten coins.'],
        choices: [
          {
            text: 'Here are ten coins.',
            when: (s) => s.coins >= 10,
            do: (s) => {
              s.coins -= 10;
              s.give('clapper');
              s.set('forged');
            },
            next: 'forged',
          },
          { text: (s) => `I have only ${s.coins}.`, when: (s) => s.coins < 10, next: 'poor' },
          { text: 'Maybe later.' },
        ],
      },
      forged: {
        lines: ['Give me a moment.', '...', 'There. It is not the old voice, but it is a good one. Take it to Aldric.'],
      },
      poor: { lines: ['Then find more. Travellers leave things in odd places. Try the old keep.'] },
    },
  },
};
