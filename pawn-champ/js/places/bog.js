// Pawn Champ - The cranberry bog at dawn (m36 The Cranberry Bog).
'use strict';

// ---- moved from js/quests/bog.js
// ---------------------------------------------------------------- the bog at dawn
addPlace('bogDawn', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(361);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 170; y++) r(0, y, NW, 1, lerpColor(lerpColor('#4a4a7a', '#c88a9a', Math.min(1, y / 110)), '#f4c890', Math.max(0, (y - 90) / 80)));
    for (let i = 0; i < 9; i++) { const x = R() * NW, y = 30 + R() * 90, w = 60 + R() * 90; r(x, y, w, 3, 'rgba(255,200,190,0.5)'); r(x + 10, y + 3, w * 0.7, 1, 'rgba(140,90,120,0.35)'); }
    g.fillStyle = 'rgba(255,230,180,0.35)'; g.beginPath(); g.arc(470, 170, 46, 0, 7); g.fill(); // the sun, just under the trees
    // pitch pines along the far side, and the pump house
    for (let x = 0; x < NW; x += 5) { const h = 18 + Math.abs(Math.sin(x * 0.07)) * 16 + R() * 10; r(x, 170 - h, 6, h, '#2a2e2a'); if (R() < 0.3) r(x - 3, 170 - h + 4, 12, 4, '#2a2e2a'); }
    r(70, 136, 46, 34, '#5a4a3a'); for (let i = 0; i < 8; i++) r(66 + i, 136 - i, 54 - i * 2, 1, '#3a2e26'); r(86, 150, 12, 20, '#2a2018'); pixText(g, 'BOURNE', 76, 140, '#e8e0c8');
    // the flooded bog: a flat sheet of water covered in floating berries, crimson where the boom holds them
    r(0, 170, NW, 96, '#5a6a8a');
    for (let y = 170; y < 266; y++) r(0, y, NW, 1, lerpColor('#8a7a9a', '#4a5a7a', (y - 170) / 96));
    for (let i = 0; i < 2200; i++) { const x = R() * NW, y = 172 + R() * 92; r(x, y, 2, 2, R() < 0.5 ? '#a8203a' : R() < 0.5 ? '#c83a4a' : '#7a1a2a'); }
    // the boom: a yellow floating line in a long curve, and the berries packed thick inside it
    for (let t = 0; t <= 1; t += 0.002) { const x = 120 + t * 420, y = 222 + Math.sin(t * Math.PI) * 30;
      for (let k = 0; k < 40 * Math.sin(t * Math.PI); k += 2) r(x, y - k, 2, 2, (k + (x | 0)) % 6 ? '#c8283a' : '#e84a5a'); r(x, y, 2, 2, '#f0c020'); }
    // sun on the water, between the berries
    for (let y = 176; y < 260; y += 3) { const w = 34 - (y - 176) / 4; if (w > 0) r(470 - w / 2 + Math.sin(y) * 4, y, w, 1, 'rgba(255,220,170,0.55)'); }
    // the dike in front: a sand road with tire ruts, sandbags at the weeping place, Cyril's truck
    for (let y = 266; y < NH; y++) r(0, y, NW, 1, lerpColor('#b8a078', '#8a7458', (y - 266) / 94));
    for (let i = 0; i < 300; i++) r(R() * NW, 268 + R() * 90, 2, 1, R() < 0.5 ? '#a08a68' : '#c8b088');
    r(0, 300, NW, 3, '#7a6448'); r(0, 330, NW, 3, '#7a6448');
    for (let x = 0; x < NW; x += 3) { const h = 2 + (R() * 5 | 0); r(x, 268 - h, 1, h, '#6a6a3a'); }
    for (let k = 0; k < 9; k++) { const x = 300 + (k % 5) * 18 + (k > 4 ? 9 : 0), y = k > 4 ? 252 : 262; r(x, y, 16, 9, '#c8b890'); r(x, y, 16, 2, '#e0d4b0'); r(x + 7, y + 1, 2, 7, '#a89870'); }
    r(318, 270, 50, 4, 'rgba(90,110,140,0.6)'); // the leak, seeping across the road
    r(500, 270, 96, 34, '#3a5a7a'); r(500, 270, 96, 4, '#4a6a8a'); r(560, 250, 36, 24, '#3a5a7a'); r(566, 254, 24, 12, '#a8c0d8');
    g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(520, 306, 9, 0, 7); g.fill(); g.beginPath(); g.arc(578, 306, 9, 0, 7); g.fill();
    for (let k = 0; k < 6; k++) r(508 + k * 8, 262, 6, 8, '#c8283a'); // crates of berries in the bed
    // rakes and a wheelbarrow
    r(40, 240, 2, 46, '#7a5a3a'); r(32, 238, 18, 4, '#5a4a3a'); r(170, 288, 40, 14, '#4a6a4a'); r(166, 286, 48, 3, '#5a7a5a'); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(214, 302, 6, 0, 7); g.fill();
    return c;
  },
  animate(g, now) {
    for (let i = 0; i < 12; i++) rect(g, (i * 61 + now / 60) % NW, 180 + (i * 17) % 80, 6, 1, 'rgba(255,230,200,0.3)');
    for (let i = 0; i < 5; i++) { const p = (now / 3000 + i / 5) % 1; rect(g, 320 + p * 46, 271 + (i % 2), 3, 1, 'rgba(180,200,230,0.7)'); } // the seep
    for (let i = 0; i < 6; i++) { const p = (now / 5000 + i / 6) % 1; rect(g, i * 110 + p * 40, 150 - p * 30, 3, 1, `rgba(255,255,255,${0.25 * (1 - p)})`); } // mist lifting
  },
  light(g) { glow(g, 470, 170, 10, 220, '255,200,150', 0.14); },
  vignette: 0.3
}, 1.5);
