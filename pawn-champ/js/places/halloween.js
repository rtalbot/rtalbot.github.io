// Pawn Champ - Main Street on Halloween night, for m63 The Robot Costume.
'use strict';

// ---- moved from js/quests/robot.js
// ---------------------------------------------------------------- Main Street on Halloween night
// The clapboard fronts of Main Street after dark on the last night of October: jack-o'-lanterns on
// every step, paper bats in the windows, leaves in the gutter, the Crooked Scale's own window lit
// at the end of the row. Trick-or-treaters are cast by the scene.
//   HALLOWEEN.robot - an actor: the robot suit's lights blink on whoever wears it
const HALLOWEEN = { robot: null };
addPlace('halloween', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(1031);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // a clear cold sky, a fat moon, bare branches
    for (let y = 0; y < 120; y++) r(0, y, NW, 1, lerpColor('#0e1026', '#2a2240', y / 120));
    for (let i = 0; i < 70; i++) r(R() * NW, R() * 90, 1, 1, '#c8c8e0');
    g.fillStyle = '#f0e8c8'; g.beginPath(); g.arc(520, 40, 20, 0, 7); g.fill(); g.fillStyle = '#d8d0b0'; g.beginPath(); g.arc(514, 36, 4, 0, 7); g.arc(526, 46, 3, 0, 7); g.fill();
    // the row of fronts
    const fronts = [[0, 120, '#5a4a6a'], [120, 110, '#3a5a5a'], [230, 130, '#6a3a3a'], [360, 120, '#4a4a5a'], [480, 160, '#2e4a3a']];
    for (const [x, w, col] of fronts) {
      const top = 70 + ((x / 10) % 3) * 8;
      r(x, top, w, 190 - top, col);
      for (let y = top + 4; y < 190; y += 5) r(x, y, w, 1, shade(col, -0.12));
      r(x - 2, top - 6, w + 4, 8, shade(col, -0.35));
      // upstairs windows, some lit, one with a paper bat; the shop window below
      for (let k = 0; k < 2; k++) { const wx = x + 20 + k * (w - 54), lit = (x + k) % 3 !== 0; r(wx, top + 16, 22, 26, lit ? '#e8b860' : '#1a1a26'); r(wx + 10, top + 16, 2, 26, shade(col, -0.4)); if (k && lit) { r(wx + 4, top + 22, 14, 3, '#1a1a1a'); r(wx + 8, top + 20, 6, 6, '#1a1a1a'); } }
      r(x + 10, 134, w - 20, 46, x === 480 ? '#e8c070' : '#2a2a3a'); r(x + 10, 134, w - 20, 3, shade(col, 0.2));
    }
    // the Crooked Scale at the end: its sign and its lit window full of stock
    r(490, 112, 140, 16, '#1e3a2e'); pixText(g, 'THE CROOKED SCALE', 500, 116, '#e2b04a', 1);
    for (let i = 0; i < 8; i++) r(500 + i * 15, 150 + (i % 2) * 10, 8, 10, ['#e2b04a', '#b9bec8', '#b8322a', '#3b6fd0'][i % 4]);
    // signs on the others
    r(130, 118, 90, 12, '#e8e0cc'); pixText(g, 'HALEY HARDWARE', 133, 121, '#2a2a2a', 1);
    r(250, 120, 90, 12, '#2a2a2a'); pixText(g, 'PEARL\'S', 274, 123, '#e86a5a', 1);
    // steps, and a jack-o'-lantern on every step (lit live)
    for (const x of [40, 160, 290, 400, 560]) { r(x, 180, 40, 6, '#6a6a6a'); r(x - 4, 186, 48, 6, '#5a5a5a'); }
    // the pavement and the street, leaves everywhere
    r(0, 192, NW, 22, '#5a5a62'); r(0, 192, NW, 2, '#7a7a82');
    for (let y = 214; y < NH; y++) r(0, y, NW, 1, lerpColor('#2a2a34', '#1e1e26', (y - 214) / 146));
    r(0, 214, NW, 4, '#8a8a8a');
    for (let i = 0; i < 160; i++) r(R() * NW, 196 + R() * 160, 3, 2, ['#c86a2a', '#e8a040', '#a83a1a', '#8a5a2a'][i % 4]);
    // lamp posts
    for (const x of [100, 350, 610]) { r(x, 110, 4, 104, '#1a1a1e'); r(x - 6, 104, 16, 8, '#1a1a1e'); r(x - 4, 108, 12, 4, '#f0d890'); }
    // a hay bale and a scarecrow by the hardware store
    r(196, 166, 34, 20, '#c8a050'); for (let i = 0; i < 6; i++) r(198 + i * 5, 168, 1, 16, '#a8803a');
    r(212, 130, 3, 36, '#6a4a2a'); r(202, 140, 24, 3, '#6a4a2a'); r(206, 126, 12, 10, '#e8b060'); r(204, 124, 16, 3, '#4a3a2a'); r(207, 138, 10, 16, '#4a6a8a');
    return c;
  },
  animate(g, now) {
    // jack-o'-lanterns flicker
    for (const x of [48, 168, 298, 408, 568]) {
      const f = Math.sin(now / 120 + x) > 0.4;
      rect(g, x, 170, 14, 11, '#d86a1a'); rect(g, x + 6, 167, 2, 3, '#3a5a2a');
      rect(g, x + 3, 173, 2, 2, f ? '#ffe070' : '#f0b040'); rect(g, x + 9, 173, 2, 2, f ? '#ffe070' : '#f0b040'); rect(g, x + 4, 177, 6, 1, f ? '#ffe070' : '#f0b040');
    }
    // leaves blowing across
    for (let i = 0; i < 8; i++) { const x = ((now / (20 + i * 4)) + i * 90) % (NW + 40) - 20, y = 220 + ((i * 37) % 120) + Math.sin(now / 300 + i) * 6; rect(g, x, y, 3, 2, ['#c86a2a', '#e8a040'][i % 2]); }
  },
  light(g, now) {
    for (const x of [48, 168, 298, 408, 568]) glow(g, x + 7, 176, 2, 26, '255,160,60', 0.18 + Math.sin(now / 120 + x) * 0.03);
    for (const x of [100, 350, 610]) glow(g, x + 2, 110, 4, 90, '255,220,140', 0.14);
    glow(g, 560, 156, 10, 120, '255,200,120', 0.16);
    glow(g, 520, 40, 10, 80, '240,240,220', 0.08);
    // the robot suit's chest lights and the red light on its helmet, on whoever wears it
    const a = HALLOWEEN.robot;
    if (a) {
      const x = a.x * 2, y = a.y * 2, ph = Math.floor(now / 250) % 3, big = a.look.kid ? 1 : 1.62;
      for (let i = 0; i < 3; i++) if (i === ph) { rect(g, x - 8 + i * 6, y - 36 * big, 4, 4, ['#ff4040', '#40ff40', '#4080ff'][i]); glow(g, x - 6 + i * 6, y - 34 * big, 2, 12, ['255,64,64', '64,255,64', '64,128,255'][i], 0.35); }
      if (Math.floor(now / 400) % 2) { rect(g, x - 1, y - 72 * big, 3, 3, '#ff4040'); glow(g, x, y - 71 * big, 2, 14, '255,60,60', 0.3); }
    }
  },
  vignette: 0.5
}, 1.5);
