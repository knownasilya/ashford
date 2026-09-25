import type { Ending } from '../engine/types';

export const endings: Record<string, Ending> = {
  bell_rings: {
    title: 'The Bell Rings',
    text: [
      'Folk came out of their doors to listen.',
      'On the north road, a hooded man walked away and did not look back.',
    ],
  },
  new_voice: {
    title: 'A New Voice',
    text: [
      "Tobin's clapper gave the bell a brighter voice. Some folk liked it.",
      'In the old keep, Osric heard it and closed his eyes.',
    ],
  },
  two_ringers: {
    title: 'Two Hands on the Rope',
    text: [
      'The bell rang a breath late. No one minded.',
      'Wren rang it every evening after that. Osric stood behind her, and held the rope when it pulled too hard.',
      (s) => (s.has('elswyth_named') ? 'In the square, a woman let her veil fall and listened. Her name was Elswyth, and she stayed.' : ''),
    ],
  },
};
