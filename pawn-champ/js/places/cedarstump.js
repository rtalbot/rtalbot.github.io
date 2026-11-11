// Pawn Champ - The cedar stump in the woods (m45 The Burl Bowl).
'use strict';

// ---- moved from js/quests/burl.js
// Hob's Marsh at dusk, from the edge of the mud where the storm tore out the bank: the boundary cedar's stump
addPlace('cedarStump', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(452);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor(lerpColor('#1e2448', '#5a4a6a', Math.min(1, y / 120)), '#c87a5a', Math.max(0, (y - 130) / 70)));
    for (let i = 0; i < 40; i++) r(R() * NW, R() * 90, 1, 1, 'rgba(255,255,255,0.6)');
    for (let i = 0; i < 6; i++) { const x = R() * NW, y = 100 + R() * 70, w = 60 + R() * 120; r(x, y, w, 2, 'rgba(240,150,120,0.45)'); }
    // the far shore: tree line, the town's lights coming on, the lighthouse on its point
    for (let x = 0; x < NW; x += 6) { const h = 8 + Math.abs(Math.sin(x * 0.04)) * 12 + R() * 6; r(x, 200 - h, 7, h, '#1a1c2a'); }
    for (let i = 0; i < 12; i++) r(360 + R() * 240, 192 + R() * 6, 2, 2, '#f0c060');
    r(604, 170, 5, 30, '#1a1c2a'); r(603, 166, 7, 4, '#1a1c2a');
    // the marsh: grass and channels, the bank torn open by the storm
    r(0, 200, NW, 80, '#2a3428');
    for (let i = 0; i < 360; i++) { const y = 202 + R() * 76; r(R() * NW, y, 1, 1 + (y - 200) / 30, R() < 0.5 ? '#3a4a34' : '#44502e'); }
    for (let t = 0; t <= 1; t += 0.004) { const x = t * NW, y = 218 + Math.sin(t * 7) * 6; r(x, y, 12, 2, '#3a4268'); if (Math.abs(x - 140) < 40) r(x, y, 6, 1, '#c8a090'); }
    // the mud in front, wet and shining, where the storm stripped the peat
    for (let y = 268; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a3026', '#2a221a', (y - 268) / 92));
    for (let i = 0; i < 160; i++) r(R() * NW, 272 + R() * 86, 4 + R() * 10, 1, R() < 0.5 ? 'rgba(200,160,130,0.25)' : '#221a14');
    // the stump: huge, grey, split, older than anything here; roots spread through the mud like hands
    g.fillStyle = '#4a4440';
    for (const [x0, y0, x1, y1, w] of [[300, 300, 190, 340, 10], [300, 300, 220, 360, 8], [380, 300, 500, 344, 10], [370, 304, 460, 360, 9], [330, 310, 300, 360, 9], [360, 310, 400, 360, 8]]) {
      g.strokeStyle = '#4a4440'; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, y0 + 20, x1, y1); g.stroke();
      g.strokeStyle = '#6a625a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0 - 3); g.quadraticCurveTo((x0 + x1) / 2, y0 + 16, x1, y1 - 3); g.stroke();
    }
    g.fillStyle = '#4a4440'; g.beginPath(); g.moveTo(270, 304); g.lineTo(282, 214); g.lineTo(306, 196); g.lineTo(326, 220); g.lineTo(350, 190); g.lineTo(378, 206); g.lineTo(396, 230); g.lineTo(404, 304); g.closePath(); g.fill();
    for (let k = 0; k < 14; k++) r(282 + k * 8, 214 + (k % 3) * 8, 2, 88 - (k % 3) * 8, k % 2 ? '#5a544e' : '#3a3632'); // the grain, in ridges
    g.fillStyle = '#141210'; g.beginPath(); g.ellipse(338, 254, 26, 32, 0, 0, 7); g.fill(); // the hollow
    r(316, 300, 46, 4, '#3a3632');
    // the scar where the burl came off: pale, fresh-cut, glistening with sap
    g.fillStyle = '#c8a878'; g.beginPath(); g.ellipse(386, 262, 10, 14, 0.2, 0, 7); g.fill(); r(384, 256, 2, 10, '#a8885a');
    // cattails and a few gulls
    for (let i = 0; i < 24; i++) { const x = i < 12 ? i * 7 : 556 + (i - 12) * 7, h = 26 + R() * 30, y = NH - 12;
      r(x, y - h, 1, h, '#3a4a2a'); r(x - 1, y - h + 4, 3, 9, '#4a3020'); }
    for (const [x, y] of [[120, 80], [150, 64], [470, 90]]) { r(x, y, 4, 1, '#2a2a3a'); r(x + 4, y - 1, 4, 1, '#2a2a3a'); }
    return c;
  },
  animate(g, now) {
    // things glinting in the hollow, and the green coming up out of it
    for (let i = 0; i < 6; i++) { const on = Math.sin(now / 400 + i * 1.7) > 0.4; if (on) rect(g, 326 + (i * 7) % 24, 252 + (i * 5) % 20, 2, 2, i % 2 ? '#e8e0a0' : '#c8d8e8'); }
    for (let i = 0; i < 8; i++) { const p = (now / 2600 + i / 8) % 1; rect(g, 330 + Math.sin(now / 500 + i) * 10, 250 - p * 60, 1, 1, `rgba(150,255,170,${0.7 * (1 - p)})`); }
  },
  light(g, now) {
    const p = 0.22 + Math.sin(now / 900) * 0.06;
    glow(g, 338, 254, 6, 120, '120,255,150', p);
    glow(g, 140, 220, 10, 160, '255,160,120', 0.08);
  },
  vignette: 0.55
}, 1.5);
