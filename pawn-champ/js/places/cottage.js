// Pawn Champ - A shut summer cottage on Cliff Road (The Caretaker's Keys).
'use strict';

// ---- moved from js/quests/caretaker.js
// ---------------------------------------------------------------- a shut summer cottage on Cliff Road
// Somebody's summer place, closed since Labor Day: white dust sheets over every chair, the shutters
// closed, the moon through the gaps, footprints in the dust and a woodstove that's still warm.
addPlace('cottage', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(907);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // beadboard walls, a sea-chart print, the closed shutters with moonlight through the slats
    for (let y = 0; y < 236; y++) r(0, y, NW, 1, lerpColor('#3a4048', '#2e343c', y / 236));
    for (let x = 0; x < NW; x += 10) r(x, 0, 1, 236, '#2a3038');
    for (const x of [90, 430]) {
      r(x, 50, 110, 120, '#1a1e26'); r(x - 4, 46, 118, 6, '#4a4a52'); r(x - 4, 168, 118, 6, '#4a4a52');
      for (let y = 56; y < 166; y += 8) r(x + 2, y, 106, 4, '#3a3e48');
    }
    r(260, 60, 100, 70, '#4a4a40'); r(264, 64, 92, 62, '#8a9a9a'); for (let i = 0; i < 6; i++) r(270 + i * 14, 80 + (i % 3) * 10, 8, 1, '#5a6a6a');
    // dust sheets over a sofa, two armchairs and something tall (a grandfather clock, or a coat stand)
    const sheet = (x, y, w, h, peak) => {
      g.fillStyle = '#c8c8c0'; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + 6, y + peak); g.quadraticCurveTo(x + w / 2, y - 6, x + w - 6, y + peak); g.lineTo(x + w, y + h); g.closePath(); g.fill();
      for (let i = 1; i < 5; i++) r(x + i * w / 5, y + peak + 4, 1, h - peak - 4, '#a8a8a0');
      r(x, y + h - 3, w, 3, '#9a9a92');
    };
    sheet(150, 210, 200, 70, 18); sheet(40, 220, 90, 70, 14); sheet(500, 218, 96, 72, 14);
    g.fillStyle = '#c0c0b8'; g.beginPath(); g.moveTo(380, 250); g.lineTo(392, 110); g.lineTo(412, 106); g.lineTo(424, 250); g.closePath(); g.fill();
    // the woodstove on the right, a kettle, a pile of split logs, a child's drawing on the stovepipe
    r(600, 190, 40, 60, '#1e1e22'); r(604, 120, 10, 70, '#1e1e22'); r(606, 204, 26, 20, '#2a1a14');
    r(610, 182, 16, 10, '#5a5a62');
    for (let i = 0; i < 6; i++) r(560 + (i % 3) * 12, 262 - (i / 3 | 0) * 9, 11, 8, '#8a6a42');
    r(600, 140, 14, 18, '#e8e4dc'); r(602, 144, 6, 6, '#e8a020'); r(606, 152, 6, 4, '#3a7ad0');
    // the floor: painted boards with footprints in the dust
    for (let y = 236; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4a50', '#3a3a40', (y - 236) / 124));
    for (let x = 0; x < NW; x += 24) r(x, 236, 1, 124, '#34343a');
    for (let y = 250; y < NH; y++) if (R() < 0.6) r(R() * NW, y, 2, 1, '#5a5a62');
    for (let i = 0; i < 9; i++) { const x = 120 + i * 50, y = 340 - i * 10 + (i % 2) * 8; r(x, y, 6, 4, '#2a2a30'); r(x + 1, y + 4, 4, 2, '#2a2a30'); }
    for (let i = 0; i < 6; i++) { const x = 140 + i * 40, y = 330 - i * 7 + (i % 2) * 6; r(x, y, 4, 3, '#2a2a30'); }
    return c;
  },
  animate(g, now) {
    // the stove glows through its window; a moth
    rect(g, 608, 206, 22, 16, Math.sin(now / 200) > 0 ? '#c8501a' : '#a8401a');
    const mx = 240 + Math.sin(now / 400) * 40, my = 100 + Math.cos(now / 300) * 20; rect(g, mx, my, 2, 1, '#d8d0c0');
  },
  light(g, now) {
    for (const x of [145, 485]) glow(g, x, 110, 10, 90, '190,210,255', 0.1);
    glow(g, 620, 214, 4, 70, '255,140,60', 0.16 + Math.sin(now / 200) * 0.03);
  },
  vignette: 0.65
}, 1.5);
