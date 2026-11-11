// Pawn Champ - A kitchen on Front Street: a small house kitchen at midday, used for home visits.
// Used by Mister Fathom's Other Families (m14). Batch E (docs/quests/BATCHES.md, LOCATIONS.md).
// Set KITCHEN.cat = true for the shop cat on the windowsill, eating somebody else's sardines.
'use strict';

const KITCHEN = { cat: false };
addPlace('kitchen', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(377);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // wall: pale yellow paper with a small blue sprig, a tiled splashback behind the counter
    r(0, 0, NW, 262, '#e8dca8');
    for (let x = 0; x < NW; x += 20) for (let y = 10 + (x / 20 % 2) * 10; y < 150; y += 20) { r(x + 8, y, 2, 2, '#9ab0c8'); r(x + 7, y + 2, 4, 1, '#b8c8d0'); }
    r(0, 0, NW, 8, '#f4ecd0'); r(0, 8, NW, 2, '#c8b880');
    // the window over the sink: the harbor at noon
    const wx = 252, wy = 40, ww = 136, wh = 92;
    r(wx - 8, wy - 8, ww + 16, wh + 16, '#f4f0e4'); r(wx - 5, wy - 5, ww + 10, wh + 10, '#d8d0bc');
    for (let y = wy; y < wy + wh; y++) r(wx, y, ww, 1, lerpColor('#8ac0e8', '#c8e0f0', (y - wy) / 52));
    r(wx, wy + 52, ww, wh - 52, '#3a6a8a'); for (let i = 0; i < 14; i++) r(wx + R() * ww, wy + 56 + R() * 30, 8, 1, '#8ab0c8');
    r(wx + 10, wy + 40, 30, 14, '#6a7a8a'); r(wx + 12, wy + 34, 6, 8, '#8a9aa8'); // houses on the far shore
    r(wx + 92, wy + 44, 22, 10, '#f4f0e4'); r(wx + 100, wy + 30, 2, 16, '#3a3a3a'); r(wx + 102, wy + 30, 10, 8, '#e8e0d0'); // a boat
    r(wx + ww / 2 - 1, wy, 3, wh, '#f4f0e4'); r(wx, wy + wh / 2 - 1, ww, 3, '#f4f0e4');
    // gingham curtains
    for (const x of [wx - 26, wx + ww + 6]) { for (let y = wy - 10; y < wy + 70; y++) r(x, y, 20, 1, ((y >> 2) % 2) ? '#c84a4a' : '#f0e0e0'); for (let k = 0; k < 20; k += 4) r(x + k, wy - 10, 2, 80, 'rgba(200,74,74,0.25)'); }
    r(wx - 30, wy - 12, ww + 60, 3, '#8a6a4a');
    // the sill (the cat sits here), with a pot of herbs
    r(wx - 10, wy + wh + 6, ww + 20, 8, '#f4f0e4'); r(wx - 10, wy + wh + 13, ww + 20, 2, '#b8b0a0');
    r(wx + ww - 22, wy + wh - 8, 14, 14, '#c86a3a'); for (let i = 0; i < 6; i++) r(wx + ww - 22 + i * 2, wy + wh - 16 + (i % 2) * 3, 2, 9, '#4a8a3a');
    // splashback tiles, counter and cabinets
    for (let y = 150; y < 206; y += 8) for (let x = 0; x < NW; x += 8) r(x, y, 7, 7, (x / 8 + y / 8) % 2 ? '#f4f4ec' : '#dce8ec');
    r(0, 206, NW, 8, '#8a6a4a'); r(0, 206, NW, 2, '#b08a64');
    r(0, 214, NW, 48, '#c8d8c0'); for (let x = 4; x < NW; x += 62) { r(x, 218, 56, 40, '#b8ccb0'); r(x + 26, 232, 6, 2, '#8a8a7a'); }
    // the sink under the window
    r(wx + 18, 200, 100, 8, '#c8ccd0'); r(wx + 22, 202, 92, 4, '#9aa0a8'); r(wx + 64, 184, 4, 18, '#b8bcc4'); r(wx + 60, 182, 16, 4, '#b8bcc4');
    // upper cabinets on the left, an open shelf with plates on the right
    r(14, 20, 200, 90, '#c8d8c0'); r(14, 20, 200, 3, '#e0ecd8');
    for (let i = 0; i < 4; i++) { r(20 + i * 49, 28, 44, 76, '#b8ccb0'); r(56 + i * 49, 64, 2, 8, '#8a8a7a'); }
    r(420, 60, 200, 5, '#8a6a4a'); r(420, 108, 200, 5, '#8a6a4a');
    for (let i = 0; i < 8; i++) { g.fillStyle = ['#f4f0e4', '#9ab8d8', '#f4f0e4', '#e8c86a'][i % 4]; g.beginPath(); g.arc(436 + i * 24, 48, 10, 0, 7); g.fill(); r(436 + i * 24 - 1, 47, 3, 3, 'rgba(0,0,0,0.12)'); }
    for (let i = 0; i < 6; i++) { r(432 + i * 30, 90, 14, 18, ['#c84a4a', '#3a6a9a', '#e8c86a'][i % 3]); r(446 + i * 30, 96, 4, 6, ['#c84a4a', '#3a6a9a', '#e8c86a'][i % 3]); } // mugs
    // the stove with a kettle, and the fridge with magnets and a child's drawing
    r(40, 166, 120, 96, '#e8e4dc'); r(40, 166, 120, 4, '#f8f4ec'); r(48, 200, 104, 54, '#d0ccc4'); r(56, 208, 88, 30, '#2a2a2e');
    for (let i = 0; i < 4; i++) r(52 + i * 28, 176, 14, 6, '#3a3a3e');
    r(70, 148, 26, 18, '#c84a4a'); r(76, 144, 14, 4, '#c84a4a'); r(94, 152, 8, 3, '#c84a4a'); r(78, 140, 10, 4, '#2a2a2e');
    r(530, 120, 80, 142, '#f0f0ec'); r(530, 120, 80, 3, '#ffffff'); r(530, 176, 80, 2, '#c8c8c4'); r(536, 140, 3, 26, '#b8b8b4'); r(536, 186, 3, 40, '#b8b8b4');
    r(552, 132, 30, 22, '#ffffff'); r(556, 138, 8, 8, '#e8c040'); r(568, 142, 10, 4, '#3a9a52'); r(558, 148, 18, 2, '#3a6ad0');
    r(590, 190, 8, 8, '#c84a4a'); r(560, 200, 8, 8, '#3a6ad0'); r(548, 224, 30, 10, '#f4f0e4'); // magnets, a takeout menu
    // a wall calendar and a clock
    r(176, 120, 40, 26, '#f4f0e4'); r(176, 120, 40, 8, '#c84a4a'); for (let i = 0; i < 12; i++) r(180 + (i % 6) * 6, 131 + (i / 6 | 0) * 6, 4, 4, '#c8c0b0');
    g.fillStyle = '#f4f0e4'; g.beginPath(); g.arc(452, 140, 14, 0, 7); g.fill(); g.strokeStyle = '#3a3a3a'; g.lineWidth = 2; g.beginPath(); g.arc(452, 140, 14, 0, 7); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(452, 140); g.lineTo(452, 131); g.stroke(); g.beginPath(); g.moveTo(452, 140); g.lineTo(458, 141); g.stroke();
    // floor: black-and-white linoleum in perspective
    for (let y = 262; y < NH; y++) {
      const t = (y - 262) / 98, sz = 14 + t * 22, row = Math.floor((y - 262) / (6 + t * 10)), off = row % 2 ? 0 : sz / 2;
      r(0, y, NW, 1, '#e8e4dc');
      for (let x = (NW / 2) % sz - sz * 2 + off; x < NW + sz; x += sz) r(x, y, sz / 2, 1, '#7a7a88');
    }
    r(0, 262, NW, 2, '#6a5a4a');
    // the kitchen table with an oilcloth, two chairs, and cat bowls by the door
    r(250, 268, 150, 10, '#e8e0c8'); for (let x = 250; x < 400; x += 10) r(x, 268, 5, 10, '#c84a4a'); r(250, 278, 150, 3, '#b8a888');
    r(258, 281, 6, 50, '#8a6a4a'); r(386, 281, 6, 50, '#8a6a4a');
    r(300, 260, 18, 8, '#f4f0e4'); r(304, 256, 10, 4, '#c8c0b0'); // a teapot
    r(340, 262, 22, 6, '#c8ccd0'); r(342, 263, 18, 3, '#9aa0a8'); // a sardine tin
    for (const x of [214, 418]) { r(x, 244, 20, 4, '#8a6a4a'); r(x + 2, 220, 3, 26, '#8a6a4a'); r(x + 15, 220, 3, 26, '#8a6a4a'); r(x, 248, 3, 40, '#8a6a4a'); r(x + 17, 248, 3, 40, '#8a6a4a'); }
    r(480, 330, 16, 6, '#3a6ad0'); r(500, 330, 16, 6, '#c84a4a'); pixText(g, 'B', 486, 331, '#f4f0e4', 1);
    return c;
  },
  animate(g, now) {
    // steam from the kettle
    for (let i = 0; i < 4; i++) { const t = ((now / 900) + i / 4) % 1; rect(g, 82 + Math.sin(t * 8 + i) * 4, 138 - t * 36, 3, 3, `rgba(255,255,255,${0.5 - t * 0.5})`); }
    // gulls past the window
    const gx = 252 + ((now / 60) % 180) - 20;
    if (gx > 254 && gx < 384) { rect(g, gx, 60, 4, 1, '#f4f4f4'); rect(g, gx + 4, 59, 4, 1, '#f4f4f4'); }
    if (!KITCHEN.cat) return;
    // the shop cat on the sill, the same grey cat with the yellow eyes, eating somebody else's sardines
    const x = 296, y = 124;
    rect(g, x, y, 22, 10, '#3a3436'); rect(g, x + 18, y - 6, 10, 9, '#3a3436'); rect(g, x + 18, y - 9, 2, 3, '#3a3436'); rect(g, x + 26, y - 9, 2, 3, '#3a3436');
    rect(g, x + 2, y + 10, 3, 4, '#3a3436'); rect(g, x + 16, y + 10, 3, 4, '#3a3436');
    const blink = Math.sin(now / 1500) > 0.85;
    if (!blink) { rect(g, x + 21, y - 3, 1, 1, '#c8d050'); rect(g, x + 25, y - 3, 1, 1, '#c8d050'); }
    const tail = Math.sin(now / 350) > 0.3 ? -3 : 0;
    rect(g, x - 8, y + 2 + tail, 9, 2, '#3a3436'); rect(g, x - 10, y - 2 + tail, 3, 5, '#3a3436');
    rect(g, x + 28, y + 8, 12, 4, '#c8ccd0'); rect(g, x + 30, y + 8, 4, 2, '#a8b0b8');
  },
  light(g, now) {
    glow(g, 320, 86, 10, 220, '255,248,220', 0.16);
    void now;
  },
  vignette: 0.25
}, 1.5);

// After dark, for evening home visits (M25 Leland's house, M27 Ernie's kitchen, M28's first stop):
// the same kitchen with the lamp over the table on and the window black.
addNightVariant('kitchenNight', 'kitchen', { tint: '30,32,72', amount: 0.8,
  paint: g => { // the window is black, with the harbor lights across the water
    for (let y = 40; y < 132; y++) rect(g, 252, y, 136, 1, lerpColor('#05070f', '#141a30', (y - 40) / 92));
    for (let i = 0; i < 9; i++) rect(g, 258 + i * 14, 92 + (i % 3) * 3, 2, 2, i % 2 ? '#f0c060' : '#e8e0b0');
    rect(g, 318, 40, 3, 92, '#5a5a6a'); rect(g, 252, 85, 136, 3, '#5a5a6a');
  },
  light: (g, now) => { glow(g, 320, 150, 10, 200, '255,210,140', 0.3 + Math.sin(now / 900) * 0.01); } });
