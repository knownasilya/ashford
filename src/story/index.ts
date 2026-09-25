import type { Story } from '../engine/types';
import { aldric } from './characters/aldric';
import { bryn } from './characters/bryn';
import { col, ebba, forge, goose, hild, woodpile } from './characters/farm';
import { veiled } from './characters/veiled';
import { hal } from './characters/hal';
import { mara } from './characters/mara';
import { chestKeep, chestVillage, rope, rubble, sign } from './characters/objects';
import { osric } from './characters/osric';
import { tobin } from './characters/tobin';
import { wren } from './characters/wren';
import { cutscenes } from './cutscenes';
import { endings } from './endings';
import { tunes } from './music';
import { objectives } from './quest';
import { scenes } from './scenes';
import { tiles } from './tiles';
import inkStory from './ink/main.ink';

const actors = [hal, aldric, mara, tobin, wren, osric, bryn, veiled, hild, col, ebba, goose, woodpile, forge, rubble, sign, rope, chestVillage, chestKeep];

export const story: Story = {
  title: 'ASHFORD',
  subtitle: 'The Silent Bell',
  year: '1257 AD',
  start: { scene: 'village', x: 19, y: 27, dir: 'up', cutscene: 'intro', coins: 3 },
  scenes,
  actors: Object.fromEntries(actors.map((a) => [a.id, a])),
  cutscenes,
  endings,
  objective: objectives,
  tiles,
  ink: inkStory,
  // A bundle of wood is heavy.
  playerSpeed: (s) => (s.holds('wood') ? 0.55 : 1),
  tunes,
};
