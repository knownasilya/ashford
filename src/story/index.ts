import type { Story } from '../engine/types';
import { aldric } from './characters/aldric';
import { bryn } from './characters/bryn';
import { veiled } from './characters/veiled';
import { hal } from './characters/hal';
import { mara } from './characters/mara';
import { chestKeep, chestVillage, rope, sign } from './characters/objects';
import { osric } from './characters/osric';
import { tobin } from './characters/tobin';
import { wren } from './characters/wren';
import { cutscenes } from './cutscenes';
import { endings } from './endings';
import { objectives } from './quest';
import { scenes } from './scenes';
import inkStory from './ink/main.ink';

const actors = [hal, aldric, mara, tobin, wren, osric, bryn, veiled, sign, rope, chestVillage, chestKeep];

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
  ink: inkStory,
};
