import type { ActorDef } from '../../engine/types';

export const tobin: ActorDef = {
  id: 'tobin',
  name: 'Tobin the Smith',
  role: 'Smith',
  sprite: 'smith',
  voice: 0.7,
  person: true,
  marker: (s) => (s.holds('wood') ? '?' : undefined),
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
            next: (s) => (s.has('forge_lit') ? 'forge' : 'cold'),
            when: (s) => s.has('quest') && !s.holds('clapper') && !s.has('osric_coming') && !(s.has('need_wood') && !s.has('forge_lit')),
          },
          { text: 'Here is a bundle of wood.', next: 'deliver', when: (s) => s.holds('wood') },
          { text: 'A man is trapped in the old keep. The wall fell on the gate.', next: 'help', when: (s) => s.has('heard_voice') && !s.has('help_tobin') },
          {
            text: 'Where do I find the wood again?',
            next: 'where',
            when: (s) => s.has('need_wood') && !s.has('forge_lit') && !s.holds('wood'),
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
      help: {
        lines: [
          'Trapped? Then he needs iron and arms. I have both.',
          (s) => (s.has('help_hal') ? 'Hal is coming too? Good. Go on ahead, I will bring my long bar.' : 'But stones like that need two men. Ask Hal at the bridge. He is stronger than he looks.'),
        ],
        do: (s) => s.set('help_tobin'),
      },
      cold: {
        lines: [
          'I could. But look at my forge. Cold as a grave.',
          'My boy Col keeps the fire fed. He is sick in bed, and I have no wood or charcoal left.',
          'Bring me three bundles of wood and ten coins for the iron, and I will make you a clapper.',
        ],
        do: (s) => s.set('need_wood'),
        next: 'where',
      },
      where: {
        lines: [
          'Col lives on the farm east of town. Follow the main road out past my door.',
          'The woodpile is by his house. It is heavy. You will carry one bundle at a time.',
        ],
        next: 'menu',
      },
      deliver: {
        do: (s) => {
          s.take('wood');
          s.add('wood_delivered');
          if (s.count('wood_delivered') >= 3) s.set('forge_lit');
        },
        lines: [
          (s) =>
            s.has('forge_lit')
              ? 'That is the last of it. Stand back.'
              : `Good wood. That is ${s.count('wood_delivered')}. I need ${3 - s.count('wood_delivered')} more.`,
        ],
        next: 'lit',
      },
      lit: {
        lines: [(s) => (s.has('forge_lit') ? 'There. The fire is alive again. Now, about that clapper.' : 'Off you go. Mind your back.')],
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
