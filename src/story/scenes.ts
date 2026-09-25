import type { SceneDef } from '../engine/types';

/*
 * Map legend (see src/engine/tiles.ts):
 *   .  grass     ,  tall grass   :  dirt      _  path     =  bridge / dock
 *   T  pine      O  oak          ~  water     r  rock     F  fence
 *   W  wood wall R  wood roof*   D  door      +  cross*
 *   <  roof slope left*          >  roof slope right*     A  roof peak*
 *   #  stone wall ^ stone roof*  M  battlement  -  wood floor
 *   (* = drawn over characters: you can walk behind it)
 *   p  pew       a  altar        c  candle    n  anvil    f  forge   b  barrel
 */

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
    'T..................__...<RRR>..........T',
    'T...RRRRRR.........__..<RRRRR>.........T',
    'T...RRRRRR.........__..RRRRRRR.^^^^^^..T',
    'T...WWWWWW.........__..WWWWWWW.######..T',
    'T...WWDWWW.........__..WWWDWWW.##D###..T',
    'T.____________________________________.T',
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
    { actor: 'hal', x: 21, y: 23, dir: 'down' },
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
    '#ff::n::bb#',
    '#:::::::::#',
    '#:::::::::#',
    '#b::::::::#',
    '#:::::::::#',
    '#####D#####',
  ],
  actors: [{ actor: 'tobin', x: 4, y: 2, dir: 'right' }],
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
    'T.#::::::::::::::..T',
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
    { actor: 'chest_keep', x: 4, y: 4 },
    { actor: 'elswyth', x: 6, y: 8, dir: 'right', when: (s) => s.has('veil_1') && !s.has('veil_2') && !s.has('elswyth_named') },
  ],
  warps: [
    { x: 9, y: 13, to: 'village', tx: 19, ty: 1, dir: 'down' },
    { x: 10, y: 13, to: 'village', tx: 20, ty: 1, dir: 'down' },
  ],
  onEnter: { cutscene: 'keep_enter', once: true },
};

export const scenes = { village, church, smithy, keep };
