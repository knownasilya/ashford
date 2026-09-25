import type { ActorDef } from '../../engine/types';

export const hal: ActorDef = {
  id: 'hal',
  name: 'Hal the Gatekeeper',
  role: 'Gatekeeper',
  sprite: 'guard',
  voice: 0.8,
  person: true,
  introduce: 'Hal. I keep the gate, such as it is.',
  dialogue: {
    start: (s) => (s.has('met_hal') ? 'again' : 'intro'),
    nodes: {
      intro: {
        lines: ['Let me look at you. A pilgrim, by the dust on you.'],
        next: 'name',
      },
      name: {
        do: (s) => s.reveal('hal'), // runs as this node starts: the line that says his name
        lines: [
          'I am Hal. I keep the gate, such as it is.',
          'Welcome to Ashford. Forgive me, we are all on edge.',
          'The church bell has not rung for three days.',
        ],
        choices: [
          { text: 'What happened to it?', next: 'what' },
          { text: 'Why does a bell matter?', next: 'why' },
        ],
      },
      why: {
        lines: [
          'The bell tells us when to wake, when to pray, when to come in from the fields.',
          'Without it, the days run into each other. Folk are uneasy.',
        ],
        next: 'what',
      },
      what: {
        lines: [
          "Someone stole its clapper. That is the iron tongue inside it.",
          'Brother Aldric can tell you more. The church is over the bridge, east of the road.',
        ],
        do: (s) => {
          s.set('met_hal');
          s.reveal('aldric'); // Hal points him out by name
        },
      },
      again: {
        lines: ['Stay out of trouble, pilgrim.'],
        choices: [
          { text: 'A man is trapped in the old keep. The wall fell on the gate.', next: 'help', when: (s) => s.has('heard_voice') && !s.has('help_hal') },
          { text: 'Who rang the bell before?', next: 'osric' },
          { text: 'Goodbye.' },
        ],
      },
      help: {
        lines: [
          'The old keep? That wall has been falling for fifty years.',
          (s) => (s.has('help_tobin') ? 'Tobin is going? Then I will bring rope. Go on ahead.' : 'I will fetch rope. But we need more hands. Tobin, if he will leave his fire.'),
        ],
        do: (s) => s.set('help_hal'),
      },
      osric: {
        lines: [
          'Old Osric, for forty years. He had arms like oak roots once.',
          'Aldric gave the rope to a girl last month. Osric took it hard.',
          'No one has seen him since.',
        ],
        next: 'again',
      },
    },
  },
};
