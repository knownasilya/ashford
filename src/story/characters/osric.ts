import type { ActorDef } from '../../engine/types';

export const osric: ActorDef = {
  id: 'osric',
  name: 'Osric',
  sprite: 'hooded',
  voice: 0.6,
  person: true,
  // A '?' shows when you know enough to change his mind.
  marker: (s) =>
    s.has('osric_admitted') && s.has('wren_afraid') && !s.has('osric_coming') && !s.has('osric_bitter') ? '?' : undefined,
  dialogue: {
    start: (s) =>
      s.has('osric_coming') ? 'waiting'
      : s.has('osric_bitter') ? 'after'
      : s.has('met_osric') ? 'again'
      : 'intro',
    nodes: {
      intro: {
        lines: ['Another visitor. Did the priest send you?'],
        do: (s) => s.set('met_osric'),
        choices: [
          { text: "Did you take the bell's clapper?", next: 'admit' },
          { text: 'Who are you?', next: 'who' },
        ],
      },
      who: {
        do: (s) => s.reveal('osric'),
        lines: [
          'Osric. I rang the bell of Ashford for forty years.',
          'Now I keep company with rats. They do not tell me my hands are too slow.',
        ],
        next: 'menu',
      },
      admit: {
        lines: ['Aye. It is behind me, wrapped in sacking.', 'If my hands cannot ring that bell, then no hands will.'],
        do: (s) => s.set('osric_admitted'),
        next: 'menu',
      },
      again: { lines: ['Back again?'], next: 'menu' },
      menu: {
        lines: ['Well?'],
        choices: [
          { text: 'Did you take the clapper?', next: 'admit', when: (s) => !s.has('osric_admitted') },
          { text: 'Why take it?', next: 'why', when: (s) => s.has('osric_admitted') && !s.has('osric_why') },
          {
            text: 'Wren is afraid of the rope. She needs a teacher, not a rival.',
            next: 'teach',
            when: (s) => s.has('osric_admitted') && s.has('wren_afraid'),
          },
          { text: 'Give it back, old man. Now.', next: 'threat', when: (s) => s.has('osric_admitted') && !s.holds('clapper') },
          { text: 'I will leave you in peace.' },
        ],
      },
      why: {
        lines: [
          'Aldric gave my rope to a child. He says my hands are too slow.',
          'Maybe so. But the bell and I understood each other.',
        ],
        do: (s) => s.set('heard_reason', 'osric_why'),
        next: 'menu',
      },
      threat: {
        lines: ['You would strike an old man for a lump of iron?'],
        choices: [
          { text: 'If I must.', next: 'give' },
          { text: 'No. I spoke in anger.', next: 'menu' },
        ],
      },
      give: {
        lines: ['...Take it, then. Take it and go.', 'Tell Aldric he has his bell. He does not have me.'],
        do: (s) => {
          s.give('clapper');
          s.set('osric_bitter');
        },
      },
      teach: {
        lines: [
          'Afraid? The girl?',
          'The rope pulls hard for small arms. I forgot that. I was small once too.',
          { who: 'you', text: 'Then come down and hold it with her.' },
          '...Aye. Aye, I will. Go on ahead. I will meet you in the church.',
        ],
        do: (s) => s.set('osric_coming'),
      },
      after: { lines: ['You have what you came for. Leave me.'] },
      waiting: { lines: ['Go on. Tell Aldric I am here.'] },
    },
  },
};
