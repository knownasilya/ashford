import type { ActorDef } from '../../engine/types';

export const aldric: ActorDef = {
  id: 'aldric',
  name: 'Brother Aldric',
  role: 'Priest',
  sprite: 'priest',
  voice: 0.9,
  person: true,
  introduce: 'I am Brother Aldric. I keep the Church of St. Brigid.',
  marker: (s) => (s.holds('clapper') || s.has('osric_coming') ? '?' : undefined),
  dialogue: {
    start: (s) =>
      s.has('osric_coming') ? 'two'
      : s.holds('clapper') && s.has('forged') ? 'forged'
      : s.holds('clapper') ? 'returned'
      : s.has('quest') ? 'progress'
      : 'intro',
    nodes: {
      intro: {
        do: (s) => s.reveal('aldric'),
        lines: [
          'Peace be with you, pilgrim. I am Brother Aldric.',
          "You find us in a sorry state. Three nights ago, someone climbed the tower and took the bell's clapper.",
          'Without it, the bell is only a heavy cup of bronze.',
        ],
        choices: [
          { text: 'I will find it.', next: 'accept' },
          { text: 'Who would steal a clapper?', next: 'who' },
          { text: 'That is not my problem.', next: 'decline' },
          { text: 'A veiled woman says you gave her a name.', next: 'veil', when: (s) => s.has('veil_met') && !s.has('clue_elves') },
        ],
      },
      who: {
        lines: ['It is heavy iron. No child could carry it.', 'I had no enemies before this. Perhaps I have one now.'],
        choices: [
          { text: 'One enemy?', next: 'osric' },
          { text: 'I will find it.', next: 'accept' },
        ],
      },
      osric: {
        lines: [
          'Osric. He rang our bell for forty years.',
          'His hands shake now. The bell rang late, then early, then twice at midnight.',
          'Last month I gave the rope to young Wren. He did not take it well.',
        ],
        do: (s) => s.set('heard_reason'),
        choices: [
          { text: 'That seems hard on him.', next: 'hard' },
          { text: 'I will find the clapper.', next: 'accept', when: (s) => !s.has('quest') },
          { text: 'I understand.', when: (s) => s.has('quest') },
        ],
      },
      hard: {
        lines: ['Perhaps it was. But folk set their day by that bell.', 'I did what I thought was right. I am less sure now.'],
        choices: [
          { text: 'I will find the clapper.', next: 'accept', when: (s) => !s.has('quest') },
          { text: 'Goodbye.' },
        ],
      },
      decline: { lines: ['Then God keep you on the road. If you change your mind, I will be here.'] },
      accept: {
        lines: ['Bless you. Ask around the village. Someone must have seen something.'],
        do: (s) => s.set('quest'),
      },
      progress: {
        lines: ['Any news of the clapper?'],
        choices: [
          { text: 'Tell me about the old bell-ringer.', next: 'osric', when: (s) => !s.has('heard_reason') },
          { text: 'Someone carried it north, to the old keep.', next: 'keep', when: (s) => s.has('clue_keep') && !s.has('met_osric') },
          {
            text: (s) => (s.knows('osric') ? 'Osric has it.' : 'A hooded old man in the keep has it.'),
            next: 'osric_has',
            when: (s) => s.has('osric_admitted'),
          },
          { text: 'A veiled woman says you gave her a name.', next: 'veil', when: (s) => s.has('veil_met') && !s.has('clue_elves') },
          { text: 'Not yet.', next: 'notyet' },
        ],
      },
      keep: { lines: ['The old keep? Only rats and memories live there now.', 'Be careful. The stones are loose.'] },
      osric_has: {
        do: (s) => s.reveal('osric'),
        lines: [
          'Osric... I feared so.',
          'I will not send men against an old friend. Bring the clapper back if you can.',
          'Or bring him back, if you are a better priest than I am.',
        ],
      },
      veil: {
        lines: [
          'A veiled woman? Hm.',
          'Twenty winters ago I baptised a baby girl in the river.',
          'Her mother wanted a name with the elves in it, for luck.',
          'I have forgotten the rest. Forgive me. I have named a great many babies.',
        ],
        do: (s) => s.set('clue_elves'),
      },
      notyet: { lines: ['Then keep asking. God is patient. The village is less so.'] },

      // ---- the three ways to finish
      returned: {
        lines: [
          'You found it!',
          { who: 'you', text: 'Osric had it. He gave it up, but not gladly.' },
          'Then I think he will leave Ashford. I am sorry for that.',
          'Come. It is time the bell had its voice again.',
        ],
        do: (s) => {
          s.take('clapper');
          s.queue('finale_bell');
        },
      },
      forged: {
        lines: [
          "A new clapper? Tobin's work, I think. It is good iron.",
          'The old one may turn up one day. Or it may not.',
          'Come. Let us hear what voice this one has.',
        ],
        do: (s) => {
          s.take('clapper');
          s.queue('finale_new');
        },
      },
      two: {
        lines: [
          { who: 'osric', text: 'Aldric.' },
          'Osric. You came down from the keep.',
          { who: 'osric', text: 'The girl is afraid of the rope. She needs someone to hold it with her.' },
          { who: 'osric', text: 'And the bell needs its tongue. I brought it back.' },
          '...Then climb with us, old friend. Show her how it is done.',
        ],
        do: (s) => {
          s.take('clapper');
          s.queue('finale_two');
        },
      },
    },
  },
};
