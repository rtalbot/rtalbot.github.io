// Pawn Champ - The vigil's hall on the longest night (M30 The Longest Night). VIGIL is its state;
// the story's hooks are in js/quests/longestnight.js.
'use strict';

// ---- moved from js/quests/longestnight.js
// ---------------------------------------------------------------- the vigil (Saint Brine's, lantern-lit)
// Saint Brine's hall after dark: a rope strung wall to wall with the town's lanterns, the benches
// turned to face the altar, the crèche by the altar (drawCreche in js/quests/donkey.js), and in front
// of the altar the keeper's row: whichever lanterns you brought. Built on the base hall, with no snow
// of its own: the season overlay covers the windows when it lands (docs/quests/LOCATIONS.md).
const VIGIL = { ours: [], out: 0, dawn: 0 };
const VIGIL_ROPE = [44, 100, 156, 212, 428, 484, 540, 596];    // x of each town lantern on the rope
const VIGIL_ROW = [280, 308, 340, 368];                          // x of the keeper's row, feet at y 300
const VIGIL_GLASS = { watch: '255,90,60', storm: '255,200,110', rail: '240,240,255', friend: '255,210,130' };
const ropeY = x => 36 + Math.sin(Math.PI * x / 640) * 22;
function drawLantern(g, x, y, glass) { // a hanging lantern by its ring at x, y
  rect(g, x - 1, y, 2, 4, '#1a1a1e'); rect(g, x - 6, y + 4, 12, 3, '#2a2a30');
  rect(g, x - 5, y + 7, 10, 12, glass); rect(g, x - 5, y + 7, 1, 12, '#2a2a30'); rect(g, x + 4, y + 7, 1, 12, '#2a2a30');
  rect(g, x - 6, y + 19, 12, 3, '#2a2a30');
}
addPlace('vigil', {
  build() {
    const c = PLACES.saintbrines.build(), g = c.getContext('2d');
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    if (typeof drawCreche === 'function') drawCreche(g, 452, 268);
    // night over the whole hall
    g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.74; g.fillStyle = 'rgb(34,30,64)'; g.fillRect(0, 0, NW, NH);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    // the rope, wall to wall, and the town's lanterns on it (their glass is lit in animate)
    g.strokeStyle = '#5a4a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, ropeY(0));
    for (let x = 0; x <= NW; x += 16) g.lineTo(x, ropeY(x)); g.stroke();
    for (const x of VIGIL_ROPE) drawLantern(g, x, ropeY(x), '#3a3024');
    // candles along the altar shelf, and a folding table of thermoses by the left bench
    for (let i = 0; i < 6; i++) r(290 + i * 12, 140, 3, 10, '#d8d0c0');
    r(40, 236, 70, 4, '#4a3a2a'); r(44, 240, 3, 22, '#2a2018'); r(103, 240, 3, 22, '#2a2018');
    for (let i = 0; i < 4; i++) { r(48 + i * 15, 222, 9, 14, ['#7a2a2a', '#2a4a6a', '#5a5a5a', '#2a5a3a'][i]); r(49 + i * 15, 220, 7, 2, '#8a8a8a'); }
    // the keeper's row: four empty hooks on a stand in front of the altar
    r(268, 262, 112, 4, '#3a2a1e');
    for (const x of VIGIL_ROW) { r(x - 1, 266, 2, 18, '#2a2018'); r(x - 6, 282, 12, 3, '#2a2018'); }
    return c;
  },
  animate(g, now) {
    const lit = k => Math.max(0, 1 - VIGIL.out * (k + 1) / 9);
    // the town's lanterns
    VIGIL_ROPE.forEach((x, i) => {
      const a = lit(i % 8); if (a <= 0) return;
      const f = 0.75 + Math.sin(now / 110 + i * 1.7) * 0.15;
      rect(g, x - 4, ropeY(x) + 8, 8, 10, `rgba(255,${190 + i * 6},110,${a * f})`);
    });
    // altar candles
    for (let i = 0; i < 6; i++) { const f = Math.sin(now / 90 + i * 2.1) > -0.6 ? 2 : 1; rect(g, 290 + i * 12, 140 - f - 1, 3, f + 1, 'rgba(255,220,140,0.95)'); }
    // the keeper's row: whatever you brought, lit or not
    VIGIL.ours.forEach((o, i) => {
      const x = VIGIL_ROW[i], col = VIGIL_GLASS[o.kind] || VIGIL_GLASS.friend;
      drawLantern(g, x, 262, o.lit ? `rgba(${col},${0.8 + Math.sin(now / 100 + i) * 0.15})` : '#2a2620');
    });
    if (typeof drawDonkey === 'function' && typeof donkeyInCreche === 'function' && donkeyInCreche()) drawDonkey(g, 464, 268, true);
  },
  light(g, now) {
    const a = Math.max(0, 1 - VIGIL.out / 9);
    VIGIL_ROPE.forEach((x, i) => glow(g, x, ropeY(x) + 14, 2, 50, '255,190,110', (0.14 + Math.sin(now / 130 + i) * 0.02) * a));
    glow(g, 320, 140, 4, 120, '255,210,140', 0.16);
    VIGIL.ours.forEach((o, i) => { if (o.lit) glow(g, VIGIL_ROW[i], 276, 2, 70, VIGIL_GLASS[o.kind] || VIGIL_GLASS.friend, 0.2); });
    if (VIGIL.dawn) glow(g, 600, 140, 10, 360, '255,200,170', 0.22 * VIGIL.dawn);
  },
  vignette: 0.7,
  music: 'tender'
}, 1.5);
