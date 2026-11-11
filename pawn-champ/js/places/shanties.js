// Pawn Champ - the ice-fishing shanties on the harbor flats. Batch N, M31 The Shanty Town.
// When the inner harbor freezes behind the breakwater, the fleet drags its shacks out onto the
// flats: a crooked street of plywood huts with stovepipes, pickups parked on the ice, tip-up flags
// over the holes, and the town's lights across the water. One shanty has a red door.
//   shanties      - the flats at dusk, smoke from every stovepipe, the red door lit
//   shantyInside  - inside the red door: a card table under a hanging lantern, a propane heater, the
//                   fishing hole in the floor that nobody fishes, and Monty Varnum's chair
//   SHANTY.raid = true puts blue lights on the ice (M31's police ending)
// Ice colors come from ICE in js/places/icepond.js.
'use strict';

const SHANTY = { raid: false };
// [x, width, height, wall colour, roof color]; the one with the red door is index 3
const SHANTY_ROW = [[40, 54, 44, '#3a6a8a', '#2a2a30'], [110, 46, 40, '#d8b040', '#3a3a40'], [170, 60, 46, '#5a8a4a', '#2a2a30'],
  [256, 70, 52, '#4a4a52', '#1e1e24'], [350, 48, 40, '#c87a3a', '#3a3a40'], [418, 56, 44, '#e8e4dc', '#4a3a3a'], [500, 50, 42, '#7a4a6a', '#2a2a30']];

function buildShanties() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(331);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // dusk: the sun down behind the town, a violet sky going orange at the bottom
  for (let y = 0; y < 170; y++) r(0, y, NW, 1, lerpColor('#2a2a54', '#e89a6a', Math.pow(y / 170, 1.7)));
  for (let i = 0; i < 30; i++) r(R() * NW, R() * 60, 1, 1, '#d8d8f0');
  // the town across the water: clapboard fronts, the steeple of Saint Brine's, lit windows
  g.fillStyle = '#2a2438'; g.beginPath(); g.moveTo(0, 150);
  for (let x = 0; x <= NW; x += 22) { const h = 12 + (R() * 22 | 0); g.lineTo(x, 160 - h); g.lineTo(x + 10, 154 - h); g.lineTo(x + 22, 160 - h); }
  g.lineTo(NW, 172); g.lineTo(0, 172); g.fill();
  r(150, 104, 8, 40, '#2a2438'); g.fillStyle = '#2a2438'; g.beginPath(); g.moveTo(148, 106); g.lineTo(154, 88); g.lineTo(160, 106); g.fill();
  for (let i = 0; i < 46; i++) r(R() * NW, 140 + R() * 26, 2, 2, R() < 0.7 ? '#f0c060' : '#e8e4dc');
  // the frozen harbor: snow-dusted ice to the front of the picture, pressure ridges, a wind-scoured
  // patch of bare ice
  for (let y = 172; y < NH; y++) r(0, y, NW, 1, lerpColor('#8a90b0', ICE.snowShade, (y - 172) / 188));
  g.fillStyle = ICE.clear; g.beginPath(); g.ellipse(470, 316, 130, 18, 0, 0, 7); g.fill();
  g.strokeStyle = 'rgba(230,240,250,0.5)'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(470, 316, 40 + i * 12, 4 + i * 2, 0, 3.4, 5.8); g.stroke(); }
  for (let i = 0; i < 4; i++) { let x = R() * NW, y = 196 + R() * 30; g.strokeStyle = ICE.snow; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += 20; y += (R() - 0.5) * 6; g.lineTo(x, y); } g.stroke(); }
  for (let i = 0; i < 160; i++) r(R() * NW, 180 + R() * 180, 3 + R() * 6, 1, R() < 0.5 ? ICE.snow : '#a8b0c8');
  // the shanties
  SHANTY_ROW.forEach(([x, w, h, wall, roof], i) => {
    const y = 222 - h;
    r(x, y, w, h, wall); for (let k = 6; k < w; k += 8) r(x + k, y, 1, h, 'rgba(0,0,0,0.15)');
    g.fillStyle = roof; g.beginPath(); g.moveTo(x - 4, y + 2); g.lineTo(x + w / 2, y - 12); g.lineTo(x + w + 4, y + 2); g.fill();
    g.fillStyle = ICE.snow; g.beginPath(); g.moveTo(x - 2, y); g.lineTo(x + w / 2, y - 11); g.lineTo(x + w / 2 + 6, y - 8); g.lineTo(x + 6, y + 1); g.fill(); // snow on the roof
    r(x + w - 12, y - 22, 4, 14, '#5a5a5a'); r(x + w - 13, y - 23, 6, 2, '#3a3a3a'); // stovepipe
    if (i === 3) { r(x + 22, y + 14, 22, h - 14, '#b02a22'); r(x + 40, y + 34, 2, 2, '#e8c050'); r(x + 4, y + 10, 12, 10, '#f0b860'); pixText(g, '9', x + 28, y + 4, '#e8e4dc'); }
    else { r(x + w / 2 - 7, y + h - 26, 14, 26, 'rgba(0,0,0,0.35)'); if (i % 2) r(x + 5, y + 10, 10, 8, '#f0c870'); }
    r(x - 2, 222, w + 4, 3, 'rgba(40,50,70,0.35)'); // shadow on the ice
  });
  // a pickup parked on the ice, a sled of gear, tip-up flags over the holes
  r(560, 196, 64, 18, '#7a2a22'); r(574, 184, 28, 14, '#7a2a22'); r(578, 187, 20, 8, '#3a4a5a'); r(568, 212, 10, 10, '#1a1a1a'); r(606, 212, 10, 10, '#1a1a1a');
  r(560, 194, 64, 3, ICE.snow);
  r(30, 290, 60, 6, '#a8742a'); r(36, 278, 46, 12, '#3a5a8a'); r(26, 290, 4, 4, '#a8742a');
  for (const [x, y, up] of [[140, 262, 1], [210, 300, 0], [330, 270, 1], [380, 330, 0], [600, 280, 1]]) {
    g.fillStyle = ICE.black; g.beginPath(); g.ellipse(x, y, 6, 2, 0, 0, 7); g.fill();
    r(x - 6, y - 1, 12, 1, '#6a4a2a');
    if (up) { r(x, y - 16, 1, 16, '#2a2a2a'); r(x + 1, y - 16, 7, 5, '#f06a1a'); } else r(x - 1, y - 2, 10, 1, '#f06a1a');
  }
  return c;
}

addPlace('shanties', {
  build: buildShanties,
  animate(g, now) {
    // smoke from every stovepipe, drifting toward town
    SHANTY_ROW.forEach(([x, w, h], i) => {
      const sx = x + w - 10, sy = 222 - h - 24;
      for (let k = 0; k < 4; k++) { const p = (now / 2600 + k / 4 + i * 0.13) % 1; g.fillStyle = `rgba(210,205,215,${0.45 * (1 - p)})`; g.beginPath(); g.ellipse(sx - p * 30, sy - p * 34, 3 + p * 8, 2 + p * 5, 0, 0, 7); g.fill(); }
    });
    if (SHANTY.raid) for (const [x, k] of [[520, 0], [600, 1]]) { const on = Math.floor(now / 300 + k) % 2; rect(g, x, 240, 24, 10, '#e8e8ea'); rect(g, x + 2, 236, 8, 4, on ? '#3a6aff' : '#401a1a'); rect(g, x + 14, 236, 8, 4, on ? '#401a1a' : '#ff3a3a'); }
  },
  light(g, now) {
    glow(g, 256 + 10, 182, 2, 50, '255,190,110', 0.25 + Math.sin(now / 400) * 0.03);
    for (const [x] of SHANTY_ROW) glow(g, x + 12, 190, 2, 24, '255,200,120', 0.08);
    if (SHANTY.raid) glow(g, 560, 236, 4, 120, Math.floor(now / 300) % 2 ? '80,120,255' : '255,70,70', 0.25);
  },
  vignette: 0.45,
  snow: { ground: [[0, 172, 640, 188]], roofs: SHANTY_ROW.map(([x, w, h]) => [x - 4, 222 - h - 12, w + 8, 14]), trees: [] },
  music: 'winter'
}, 1.5);

// inside the red door
addPlace('shantyInside', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(337);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // plywood walls, a low ceiling, a small window on the dusk
    r(0, 0, NW, 260, '#8a6a46'); for (let x = 0; x < NW; x += 80) r(x, 0, 2, 260, '#6a4e32'); for (let i = 0; i < 90; i++) r(R() * NW, R() * 250, 6 + R() * 10, 1, '#7a5c3c');
    r(0, 0, NW, 24, '#4a3624'); for (let x = 20; x < NW; x += 60) r(x, 0, 8, 26, '#3a2a1c');
    r(480, 60, 90, 60, '#3a2a1c'); for (let y = 64; y < 116; y++) r(484, y, 82, 1, lerpColor('#3a3a6a', '#d88a6a', (y - 64) / 52)); r(524, 60, 3, 60, '#3a2a1c'); r(484, 104, 82, 12, ICE.snowShade);
    // coats on hooks, a hand-lettered sign
    for (const [x, col] of [[30, '#3a4a6a'], [70, '#e8a020'], [110, '#5a3a2a']]) { r(x + 8, 70, 4, 4, '#2a2a2a'); r(x, 74, 22, 50, col); r(x + 4, 74, 14, 6, 'rgba(0,0,0,0.2)'); }
    r(170, 60, 110, 34, '#e8e0cc'); pixText(g, 'CASH GAME', 182, 66, '#2a2a2a'); pixText(g, 'NO MARKERS', 180, 78, '#b02a22');
    // the floor: boards, and the fishing hole nobody fishes, a line still down it
    for (let y = 260; y < NH; y++) r(0, y, NW, 1, lerpColor('#5a4430', '#3a2c1e', (y - 260) / 100));
    for (let y = 266; y < NH; y += 12) r(0, y, NW, 1, '#2e2216');
    r(60, 300, 64, 30, '#3a2c1e'); g.fillStyle = ICE.black; g.beginPath(); g.ellipse(92, 315, 26, 10, 0, 0, 7); g.fill();
    g.fillStyle = ICE.clear; g.beginPath(); g.ellipse(92, 313, 20, 6, 0, 0, 7); g.fill(); r(110, 240, 1, 74, '#d8d8d8'); r(106, 238, 10, 4, '#c83a2a');
    // the propane heater, its grille
    r(560, 220, 50, 70, '#5a5a62'); r(564, 230, 42, 36, '#2a1a12'); r(560, 214, 50, 6, '#3a3a40');
    // the card table: green felt, chips, a deck, five chairs, a thermos lying on its side by the dealer
    r(318, 184, 26, 50, '#7a3a2a'); r(314, 180, 34, 8, '#8a4a3a'); // Monty's chair back, behind the table
    g.fillStyle = '#3a2a1c'; g.beginPath(); g.ellipse(330, 262, 150, 34, 0, 0, 7); g.fill();
    g.fillStyle = '#2a6a3a'; g.beginPath(); g.ellipse(330, 258, 142, 28, 0, 0, 7); g.fill();
    g.strokeStyle = '#3a8a4a'; g.lineWidth = 1; g.beginPath(); g.ellipse(330, 258, 120, 20, 0, 0, 7); g.stroke();
    for (let i = 0; i < 26; i++) { const a = R() * 7, d = 30 + R() * 80; r(330 + Math.cos(a) * d, 256 + Math.sin(a) * d * 0.2, 6, 2, ['#c83a2a', '#e8e4dc', '#2a4a8a', '#1a1a1a'][i % 4]); }
    for (let i = 0; i < 5; i++) r(300 + i * 12, 252, 8, 11, i === 4 ? '#e8e4dc' : '#f4f0e4');
    r(398, 252, 20, 6, '#c8ccd0'); r(398, 252, 20, 2, '#f4f8fa'); r(416, 253, 4, 4, '#2a2a2a'); // the thermos, lying flat
    for (const x of [190, 250, 410, 470]) { r(x, 280, 30, 6, '#5a3a22'); r(x + 2, 286, 3, 30, '#4a2e1a'); r(x + 25, 286, 3, 30, '#4a2e1a'); }
    return c;
  },
  animate(g, now) {
    // the heater glows and ticks, the lantern swings a hair
    for (let i = 0; i < 6; i++) rect(g, 566 + i * 7, 236, 5, 24, `rgba(255,${100 + (Math.sin(now / 300 + i) * 30 | 0)},40,0.8)`);
    const sw = Math.sin(now / 1100) * 3;
    rect(g, 330, 24, 1, 70, '#2a2a2a'); rect(g, 322 + sw, 94, 18, 22, '#3a3a3a'); rect(g, 325 + sw, 98, 12, 14, '#f8d070');
  },
  light(g, now) {
    glow(g, 331 + Math.sin(now / 1100) * 3, 105, 4, 220, '255,200,120', 0.3);
    glow(g, 585, 248, 4, 90, '255,120,50', 0.2);
  },
  vignette: 0.6,
  music: 'shuffle'
}, 1.5);
