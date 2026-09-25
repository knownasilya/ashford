import type { GameState } from '../engine/state';
import type { SceneDef } from '../engine/types';

/*
 * Map legend (see src/engine/tiles.ts):
 *   .  grass     ,  tall grass   :  dirt      _  path     =  bridge / dock
 *   T  pine      O  oak          ~  water     r  rock     F  fence
 *   W  wood wall R  wood roof*   D  door      +  cross*
 *   [  wood wall with window      ]  stone wall with window
 *   H  chimney on wood roof*      h  chimney on stone roof*    *  smoke*
 *   %  smithy smoke* (story tile: src/story/tiles.ts, only while the forge burns)
 *   <  roof slope left*          >  roof slope right*     A  roof peak*
 *   #  stone wall ^ stone roof*  M  battlement  -  wood floor
 *   (* = drawn over characters: you can walk behind it)
 *   p  pew       a  altar        c  candle    n  anvil    f  forge   b  barrel
 *   t  table     w  wheat
 */

/** Tobin and Hal left town to dig Osric out, and have not gone home yet. */
const helpersAway = (s: GameState) => s.has('help_tobin') && s.has('help_hal') && !s.has('helpers_home');

const village: SceneDef = {
  id: 'village',
  name: 'Ashford',
  map: [
    'TTTTTTTTTTTTTTTTTTT__TTTTTTTTTTTTTTTTTTT',
    'TTTT.T.TTTTTTT.TTT.__.TTT.TTTTTT.TTTTTTT',
    'TT.,..T.TTT.T....,.__...T..T.TT..,.TTTTT',
    'T..,...T.T..T......__.,.....T...,...T.TT',
    'T.,......T.........__..........,....,.TT',
    'T..................__.....+............T',
    'T..O....,..........__.....A......O.....T',
    'T.OOO..............__....<R>....OOO....T',
    'T.......*..........__...<RRR>..........T',
    'T...RRRRHR.........__..<RRRRR>.....%...T',
    'T...RRRRRR.........__..RRRRRRR.^^^^h^..T',
    'T...W[WW[W.........__..W[WWW[W.#]##]#..T',
    'T...WWDWWW.........__..WWWDWWW.##D###..T',
    'T.______________________________________',
    'T.,.........FFFF...__...,.........O....T',
    'T..,.....,..:::::..__........,..,......T',
    'T.O.........:::::..__.....O........,...T',
    'T,,................__...........,.....,T',
    'T,,,...............__...r.......r......T',
    'T..................__..................T',
    '~~~~~~~~=~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~=~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~~',
    'T.,................__..............,...T',
    'T..T..,.....,......__..,..T.....T......T',
    'TT.....T...........__..........T.....TTT',
    'TTT..,......T......__......T......,.TTTT',
    'TTTT.T.............__....,......T.TTTTTT',
    'TTTTTTT..TTT.T.....__..T.TTTTTTTTTTTTTTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  actors: [
    { actor: 'hal', x: 21, y: 23, dir: 'down', when: (s) => !helpersAway(s) },
    { actor: 'mara', x: 8, y: 20, dir: 'up' },
    { actor: 'wren', x: 11, y: 17 },
    { actor: 'bryn', x: 23, y: 15, dir: 'left' },
    // The veiled woman moves each time she slips away from you.
    { actor: 'elswyth', x: 34, y: 18, dir: 'left', when: (s) => !s.has('veil_1') && !s.has('elswyth_named') },
    { actor: 'sign', x: 18, y: 24 },
    { actor: 'chest_village', x: 3, y: 17 },
  ],
  warps: [
    { x: 26, y: 12, to: 'church', tx: 6, ty: 8, dir: 'up' },
    { x: 33, y: 12, to: 'smithy', tx: 5, ty: 5, dir: 'up' },
    { x: 19, y: 0, to: 'keep', tx: 9, ty: 12, dir: 'up' },
    { x: 39, y: 13, to: 'farm', tx: 1, ty: 7, dir: 'right' },
    { x: 20, y: 0, to: 'keep', tx: 10, ty: 12, dir: 'up' },
    // A locked door: `when` is never true, so the player only sees the text.
    { x: 6, y: 12, to: 'village', tx: 6, ty: 13, dir: 'down', when: () => false, locked: "Mara's door is barred. She must be down at the dock." },
  ],
};

const church: SceneDef = {
  id: 'church',
  name: 'Church of St. Brigid',
  map: [
    'WWWWWWWWWWWWW',
    'Wc---aaa---cW',
    'W-----------W',
    'W-pppp-pppp-W',
    'W-----------W',
    'W-pppp-pppp-W',
    'W-----------W',
    'W-pppp-pppp-W',
    'W-----------W',
    'WWWWWWDWWWWWW',
  ],
  actors: [
    { actor: 'aldric', x: 6, y: 2 },
    { actor: 'rope', x: 11, y: 2 },
    { actor: 'osric', x: 8, y: 2, when: (s) => s.has('osric_coming') },
    { actor: 'elswyth', x: 1, y: 8, dir: 'right', when: (s) => s.has('veil_2') || (s.has('veil_1') && s.has('elswyth_named')) },
  ],
  warps: [{ x: 6, y: 9, to: 'village', tx: 26, ty: 13, dir: 'down' }],
};

const smithy: SceneDef = {
  id: 'smithy',
  name: "Tobin's Smithy",
  map: [
    '###########',
    '#::::n::bb#',
    '#:::::::::#',
    '#:::::::::#',
    '#b::::::::#',
    '#:::::::::#',
    '#####D#####',
  ],
  actors: [
    { actor: 'tobin', x: 4, y: 2, dir: 'right', when: (s) => !helpersAway(s) },
    { actor: 'forge', x: 1, y: 1 },
    { actor: 'forge', x: 2, y: 1 },
  ],
  warps: [{ x: 5, y: 6, to: 'village', tx: 33, ty: 13, dir: 'down' }],
};

const keep: SceneDef = {
  id: 'keep',
  name: 'The Old Keep',
  map: [
    'TTTTTTTTTTTTTTTTTTTT',
    'TTMMMMMMMMMMMMMMMMTT',
    'TT#::::::::::::::#TT',
    'T.#::r:::::::::::#.T',
    'T.#::::::::::::r:#.T',
    'T.#::::::::::::::#.T',
    'T.#::::::::::::::r.T',
    'T.#######::#######.T',
    'T..,.....__....,...T',
    'TT..O....__...O...TT',
    'TTT......__....,TTTT',
    'TTTTT.,..__..TTTTTTT',
    'TTTTTTTT.__.TTTTTTTT',
    'TTTTTTTTT__TTTTTTTTT',
  ],
  actors: [
    { actor: 'osric', x: 13, y: 3, dir: 'left', when: (s) => !s.has('osric_coming') },
    { actor: 'chest_keep', x: 3, y: 9 },
    // The fallen wall seals the gate until Tobin and Hal clear it.
    { actor: 'rubble', x: 9, y: 7, when: (s) => !s.has('keep_open') },
    { actor: 'rubble', x: 10, y: 7, when: (s) => !s.has('keep_open') },
    { actor: 'tobin', x: 8, y: 8, dir: 'right', when: helpersAway },
    { actor: 'hal', x: 11, y: 8, dir: 'left', when: helpersAway },
    { actor: 'elswyth', x: 6, y: 8, dir: 'right', when: (s) => s.has('veil_1') && !s.has('veil_2') && !s.has('elswyth_named') },
  ],
  warps: [
    { x: 9, y: 13, to: 'village', tx: 19, ty: 1, dir: 'down' },
    { x: 10, y: 13, to: 'village', tx: 20, ty: 1, dir: 'down' },
  ],
  onEnter: [
    { cutscene: 'keep_enter', once: true },
    { cutscene: 'keep_rescue', once: true, when: helpersAway },
  ],
};

const farm: SceneDef = {
  id: 'farm',
  name: 'Hollin Farm',
  map: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TTT.....,........,...........TTT',
    'T.......*.O..RRRRRRRRO.....*..TT',
    'T..RRRRRHR...RRRRRRRR.O.RRRHR..T',
    'T..RRRRRRR...RRRRRRRR...RRRRR..T',
    'T..W[WWW[W...WWWWWW[W...W[W[W..T',
    'T..WWWDWWW...WWWDWWWW...WWDWW..T',
    '______________________________.T',
    'T.........._,........._..,.....T',
    'T.,........_........,._..*.....T',
    'T..FFFFFFFF_FFFFFFFF.._.RHRRR..T',
    'T..FwwwwwwwwwwwwwwwF.._.RRRRR..T',
    'TO.FwwwwwwwwwwwwwwwF.._.W[W[W..T',
    'TO.FwwwwwwwwwwwwwwwF.._.WWDWW..T',
    'T..FwwwwwwwwwwwwwwwF.._____....T',
    'T.,FwwwwwwwwwwwwwwwF...........T',
    'T..FwwwwwwwwwwwwwwwF..,....,O..T',
    'TT.FFFFFFFFFFFFFFFFF...O......TT',
    'TTT..,........,..............TTT',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
  actors: [
    { actor: 'hild', x: 8, y: 8, dir: 'left' },
    { actor: 'ebba', x: 14, y: 8 },
    { actor: 'goose', x: 16, y: 9, dir: 'left' },
    { actor: 'woodpile', x: 10, y: 6 },
  ],
  warps: [
    { x: 0, y: 7, to: 'village', tx: 38, ty: 13, dir: 'left' },
    { x: 6, y: 6, to: 'farmhouse', tx: 5, ty: 5, dir: 'up' },
    { x: 16, y: 6, to: 'farm', tx: 16, ty: 7, dir: 'down', when: () => false, locked: 'The barn is barred. Something inside says "moo".' },
    { x: 26, y: 6, to: 'farm', tx: 26, ty: 7, dir: 'down', when: () => false, locked: 'No one answers. The neighbours must be out in the fields.' },
    { x: 26, y: 13, to: 'farm', tx: 26, ty: 14, dir: 'down', when: () => false, locked: 'The door is locked. A cat watches you from the window.' },
  ],
};

const farmhouse: SceneDef = {
  id: 'farmhouse',
  name: "Col's House",
  map: [
    'WWWWWWWWWWW',
    'Wc-------bW',
    'W---------W',
    'W---tt----W',
    'W---------W',
    'W---------W',
    'WWWWWDWWWWW',
  ],
  actors: [{ actor: 'col', x: 8, y: 2 }],
  warps: [{ x: 5, y: 6, to: 'farm', tx: 6, ty: 7, dir: 'down' }],
};

export const scenes = { village, church, smithy, keep, farm, farmhouse };
