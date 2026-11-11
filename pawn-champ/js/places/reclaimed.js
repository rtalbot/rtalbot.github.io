// Pawn Champ - Reclaimed & Co., Bryony Kettle's shop across the street from yours. Batch I
// (docs/quests/BACKLOG.md, MAJOR.md#m16-the-rival-shop).
// Exposed brick, Edison bulbs on long wires, candles on reclaimed-wood shelves, a lobster-trap coffee
// table at $340, and through the front window, across Main Street, your own PAWN sign.
//   reclaimed      - early evening, every candle lit (the opening party, the reckoning)
//   reclaimedNight - after midnight, the bulbs turned down (the window war)
// RECLAIMED.sign hangs Odile's old sign on her counter (she bought it); RECLAIMED.closing hangs a
// CLOSING DOWN banner in the window (the crushed ending).
'use strict';

const RECLAIMED = { sign: false, closing: false };
const REC_CANDLES = [[64, 120], [92, 120], [118, 120], [70, 170], [104, 170], [300, 112], [330, 112], [356, 112], [216, 272], [244, 272]]; // x, y of each flame
const REC_BULBS = [[60, 46], [150, 58], [240, 42], [330, 62], [410, 48]];

addPlace('reclaimed', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(161);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // exposed brick, every brick a slightly different red, mortar picked out pale
    r(0, 0, 470, 262, '#c8b8a0');
    for (let row = 0; row < 33; row++) {
      const y = row * 8, off = row % 2 ? 0 : 11;
      for (let x = -off; x < 470; x += 22) {
        const k = R(), col = k < 0.15 ? '#7a3a2e' : k < 0.3 ? '#a85a42' : k < 0.45 ? '#8e4a38' : '#9a4e3c';
        r(x + 1, y + 1, 20, 6, col); r(x + 1, y + 1, 20, 1, shade(col, 0.07)); if (R() < 0.12) r(x + 4 + R() * 12, y + 3, 3, 2, shade(col, -0.1));
      }
    }
    // a pale ghost of an old painted sign on the brick: this was a shoe repair once
    g.globalAlpha = 0.22; pixText(g, 'SHOE REPAIR', 160, 10, '#f0e8d0', 3); g.globalAlpha = 1;
    // the ceiling: black-painted joists, and the bulbs' cloth wires
    r(0, 0, 470, 6, '#1a1614'); for (let x = 10; x < 470; x += 46) r(x, 0, 6, 10, '#22201c');
    for (const [x, y] of REC_BULBS) { r(x, 0, 1, y - 6, '#2a2420'); r(x - 2, y - 7, 5, 4, '#5a4a32'); }
    // reclaimed-wood shelves on iron pipe brackets, left, and their wares
    const shelf = (x, y, w) => { r(x, y, w, 6, '#6a4a30'); r(x, y, w, 1, '#8a6a48'); for (let i = 0; i < w; i += 14) r(x + i, y + 2, 9, 1, '#5a3a24'); r(x + 6, y + 6, 3, 10, '#2a2a2e'); r(x + w - 9, y + 6, 3, 10, '#2a2a2e'); };
    shelf(40, 130, 120); shelf(40, 180, 120);
    // candles in jars: amber glass, white wax, little kraft labels
    for (const [x, y] of REC_CANDLES.slice(0, 5)) { r(x - 6, y + 2, 13, 8, '#c8902a'); r(x - 5, y + 1, 11, 2, '#f0e8d8'); r(x - 4, y + 5, 9, 3, '#e8d8b8'); r(x, y - 1, 1, 3, '#2a2a2a'); }
    // mason jars, a lobster buoy, a stack of linen
    r(134, 112, 10, 16, 'rgba(200,220,220,0.55)'); r(134, 110, 10, 3, '#a8a8a0'); r(136, 120, 6, 6, '#7a9a5a');
    r(132, 160, 20, 18, '#e8e0d0'); r(132, 166, 20, 1, '#c8c0b0'); r(132, 172, 20, 1, '#c8c0b0');
    r(136, 148, 8, 12, '#d84a3a'); r(136, 152, 8, 3, '#f0e8d8'); r(139, 142, 2, 6, '#5a4a3a');
    // a ship's wheel and a single oar on the brick, for "authenticity"
    g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.arc(214, 92, 22, 0, 7); g.stroke();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(214, 92); g.lineTo(214 + Math.cos(a) * 32, 92 + Math.sin(a) * 32); g.stroke(); }
    g.fillStyle = '#4a3220'; g.beginPath(); g.arc(214, 92, 6, 0, 7); g.fill();
    r(170, 150, 4, 90, '#a87a4a'); r(166, 230, 12, 26, '#a87a4a'); r(168, 232, 8, 2, '#c84a3a');
    // the chalkboard: the shop's name in careful chalk
    r(258, 26, 132, 62, '#5a3a24'); r(262, 30, 124, 54, '#24302a');
    pixText(g, 'RECLAIMED', 324 - textWidth('RECLAIMED', 2) / 2, 36, '#f0ece0', 2);
    pixText(g, '& CO.', 324 - textWidth('& CO.') / 2, 52, '#e8c8a0');
    pixText(g, 'CURATED GOODS', 324 - textWidth('CURATED GOODS') / 2, 62, '#c8d8c8');
    pixText(g, 'CANDLES - DECOR - FINDS', 324 - textWidth('CANDLES - DECOR - FINDS') / 2, 72, '#a8b8a8');
    // the register counter: a butcher block on an old dresser, a brass register, a bell
    shelf(280, 120, 100);
    for (const [x, y] of REC_CANDLES.slice(5, 8)) { r(x - 5, y + 2, 11, 8, '#8a5aa0'); r(x - 4, y + 1, 9, 2, '#f0e8d8'); r(x, y - 1, 1, 3, '#2a2a2a'); }
    r(292, 176, 150, 10, '#c8a070'); r(292, 176, 150, 2, '#e0c090'); r(296, 186, 142, 70, '#5a7a8a');
    for (let i = 0; i < 3; i++) { r(302 + i * 46, 194, 40, 26, '#4a6a7a'); r(318 + i * 46, 204, 8, 3, '#c8a050'); }
    r(396, 150, 34, 26, '#b8902a'); r(398, 152, 30, 10, '#d8b04a'); r(400, 154, 26, 6, '#1a1a1a'); pixText(g, '$0.00', 401, 155, '#e8e0a0');
    for (let i = 0; i < 6; i++) r(400 + (i % 3) * 9, 164 + (i / 3 | 0) * 5, 6, 3, '#f0e8d8');
    g.fillStyle = '#c8a040'; g.beginPath(); g.arc(352, 174, 4, Math.PI, 0); g.fill(); r(348, 174, 9, 2, '#8a6a20');
    // the floor: wide reclaimed planks, nail holes and all, and a faded runner
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#7a5a3a', '#5a3e28', (y - 262) / 98));
    for (let y = 262; y < NH; y += 14) { r(0, y, NW, 1, '#4a321e'); for (let x = (y * 13) % 90; x < NW; x += 90 + (y % 30)) { r(x, y, 1, 14, '#4a321e'); r(x + 4, y + 6, 1, 1, '#2a1e12'); } }
    r(20, 322, 150, 30, '#6a3a3a'); r(24, 326, 142, 22, '#8a4a44'); for (let x = 30; x < 160; x += 12) r(x, 330, 6, 14, '#a85a50');
    // the lobster-trap coffee table, glass top, price tag on a string
    r(196, 282, 110, 4, 'rgba(200,230,230,0.6)'); r(200, 286, 102, 26, '#8a7a4a');
    for (let x = 202; x < 300; x += 6) r(x, 286, 1, 26, '#c8b878'); for (let y = 288; y < 312; y += 6) r(200, y, 102, 1, '#c8b878');
    r(196, 312, 6, 8, '#4a3a2a'); r(296, 312, 6, 8, '#4a3a2a');
    r(306, 290, 18, 10, '#f0e8d0'); pixText(g, '$340', 307, 292, '#8a2a2a'); r(302, 288, 4, 1, '#8a8a8a');
    // candles on the coffee table
    for (const [x, y] of REC_CANDLES.slice(8)) { r(x - 6, y + 2, 13, 9, '#e8e0d0'); r(x - 6, y + 2, 13, 1, '#f8f4ec'); r(x, y - 1, 1, 3, '#2a2a2a'); }
    // the front window, right: Main Street in the blue hour, and across it, your shop
    r(470, 0, 170, 262, '#2a2420'); r(478, 30, 154, 210, '#24304a');
    for (let y = 30; y < 150; y++) r(478, y, 154, 1, lerpColor('#2a3a64', '#8a6a7a', (y - 30) / 120));
    // across the street: the pawnshop facade, its window lit, a dark doorway
    r(486, 92, 138, 112, '#4a3a3a'); for (let y = 96; y < 204; y += 6) r(486, y, 138, 1, '#3e3030');
    r(496, 126, 70, 50, '#d8b070'); r(498, 128, 66, 46, '#f0d090'); for (let i = 0; i < 5; i++) r(502 + i * 12, 150 + (i % 2) * 6, 8, 12 - (i % 2) * 6, '#6a4a2a');
    pixText(g, 'WE BUY GOLD', 500, 166, '#c8a040');
    r(578, 130, 30, 60, '#1a1416'); r(600, 158, 2, 4, '#c8a050');
    // the street and the near sidewalk under the window
    r(478, 204, 154, 14, '#3a3a40'); for (let x = 480; x < 630; x += 22) r(x, 210, 10, 1, '#c8c060');
    r(478, 218, 154, 22, '#6a6a68'); r(478, 218, 154, 1, '#8a8a88');
    // the window's own lettering, backwards from in here, and the mullions
    pixTextMirror(g, 'RECLAIMED & CO.', 494, 36, '#e8d8b0', 1);
    r(552, 30, 4, 210, '#2a2420'); r(478, 120, 154, 3, '#2a2420');
    // a window display: an old bicycle and a galvanised tub of dried hydrangeas
    g.strokeStyle = '#2a4a4a'; g.lineWidth = 2; g.beginPath(); g.arc(498, 226, 10, 0, 7); g.arc(532, 226, 10, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(498, 226); g.lineTo(512, 212); g.lineTo(532, 226); g.moveTo(512, 212); g.lineTo(524, 210); g.stroke();
    r(574, 220, 34, 20, '#9aa0a0'); r(574, 220, 34, 2, '#b8bcbc'); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#c8a8c8' : '#b8c8d8'; g.beginPath(); g.arc(578 + i * 3.5, 214 - (i % 3) * 3, 5, 0, 7); g.fill(); }
    return c;
  },
  animate(g, now) {
    // Odile's old sign on the front of her counter, once Bryony has it
    if (RECLAIMED.sign) {
      const sx = 322, sy = 224;
      rect(g, sx, sy, 92, 22, '#2a2a30'); rect(g, sx + 2, sy + 2, 88, 18, '#e8e0c8'); rect(g, sx + 4, sy + 4, 84, 14, '#1e3a6a');
      pixText(g, 'ODILE\'S', sx + 46 - textWidth('ODILE\'S') / 2, sy + 6, '#f0e8d0'); pixText(g, 'LOANS - BOUGHT & SOLD', sx + 46 - textWidth('LOANS - BOUGHT & SOLD') / 2, sy + 13, '#e8c040');
      for (const [x, y] of [[sx + 4, sy + 4], [sx + 84, sy + 4], [sx + 4, sy + 14], [sx + 84, sy + 14]]) rect(g, x, y, 2, 2, '#7a5a3a'); // rust at the screw holes
    }
    // the closing-down banner in the window
    if (RECLAIMED.closing) {
      rect(g, 482, 180, 146, 18, '#f0ece0'); rect(g, 482, 180, 146, 2, '#c83a2a'); rect(g, 482, 196, 146, 2, '#c83a2a');
      pixText(g, 'CLOSING DOWN SALE', 555 - textWidth('CLOSING DOWN SALE') / 2, 186, '#c83a2a');
    }
    // every candle flickers on its own
    for (const [x, y] of REC_CANDLES) {
      const f = Math.sin(now / 90 + x) * 0.5 + Math.sin(now / 37 + y) * 0.5;
      rect(g, x - 1, y - 4 + (f > 0.6 ? -1 : 0), 3, 3, '#f8c040'); rect(g, x, y - 5 + (f > 0.2 ? -1 : 0), 1, 2, '#fff0b0');
    }
    // the bulbs sway a little on their long wires
    for (const [x, y] of REC_BULBS) { const s = Math.sin(now / 1600 + x) * 1.5; rect(g, x - 2 + s, y - 3, 5, 7, '#f8d890'); rect(g, x - 1 + s, y - 1, 3, 3, '#fff4d0'); }
    // across the street, your PAWN neon buzzes in its window
    const buzz = Math.sin(now / 53) > -0.92;
    pixText(g, 'PAWN', 507, 108, buzz ? '#ff5a6a' : '#7a2a32', 3);
  },
  light(g, now) {
    for (const [x, y] of REC_BULBS) glow(g, x + Math.sin(now / 1600 + x) * 1.5, y, 4, 70, '255,200,120', 0.16);
    for (const [x, y] of REC_CANDLES) glow(g, x, y - 3, 1, 22, '255,190,90', 0.18 + Math.sin(now / 90 + x) * 0.03);
    if (Math.sin(now / 53) > -0.92) glow(g, 530, 116, 6, 60, '255,80,100', 0.18);
  },
  vignette: 0.45
}, 1.5);

// after midnight: the bulbs turned down, the street outside dark, the candles still going
addNightVariant('reclaimedNight', 'reclaimed', {
  tint: '40,40,80', amount: 0.72,
  light: (g, now) => {
    for (const [x, y] of REC_CANDLES) glow(g, x, y - 3, 1, 26, '255,190,90', 0.22 + Math.sin(now / 90 + x) * 0.04);
    glow(g, 410, 160, 4, 90, '255,210,150', 0.2); // the lamp by the register
    if (Math.sin(now / 53) > -0.92) glow(g, 530, 116, 6, 70, '255,80,100', 0.26);
  }
});
