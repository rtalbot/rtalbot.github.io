// Pawn Champ - Rory's kitchen on Thanksgiving (The Turkey Platter).
'use strict';

// ---- moved from js/quests/platter.js
// ---------------------------------------------------------------- Thanksgiving on Front Street
// Rory's kitchen at four o'clock on Thanksgiving: the window gone to dusk, the kitchen table pushed
// together with a card table under one long white cloth, four mismatched chairs, the turkey still on
// its roasting pan because there's nothing to put it on. PLATTER.on puts it on the platter.
const PLATTER = { on: false };
addPlace('thanksgiving', {
  build() {
    const c = PLACES.kitchen.build(), g = c.getContext('2d');
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // dusk in the window (the window is 252..388 x 40..132)
    for (let y = 40; y < 92; y++) r(252, y, 136, 1, lerpColor('#e88a5a', '#5a4a7a', (92 - y) / 52));
    r(252, 92, 136, 40, '#2a3a5a'); for (let i = 0; i < 6; i++) r(262 + i * 22, 96 + (i % 2) * 6, 3, 2, '#f8d070');
    r(318, 40, 3, 92, '#f4f0e4'); r(252, 85, 136, 3, '#f4f0e4');
    // the long table: kitchen table and card table under one cloth
    r(100, 262, 440, 12, '#f4f0e8'); r(100, 274, 440, 14, '#e0dcd0'); for (let x = 104; x < 540; x += 18) r(x, 274, 2, 14, '#d0ccc0');
    r(110, 288, 6, 40, '#8a6a4a'); r(316, 288, 6, 40, '#8a6a4a'); r(330, 288, 4, 40, '#5a5a5a'); r(530, 288, 4, 40, '#5a5a5a');
    // four mismatched chairs behind it
    const chairs = [[150, '#8a6a4a'], [240, '#c84a4a'], [400, '#3a6a9a'], [480, '#e8e4dc']];
    for (const [x, col] of chairs) { r(x, 230, 24, 4, col); r(x + 2, 234, 3, 28, col); r(x + 19, 234, 3, 28, col); r(x, 246, 24, 3, col); }
    // pies, a gravy boat, a bowl of potatoes, candles in jam jars, cranberry from the can, ridges and all
    g.fillStyle = '#c88a3a'; g.beginPath(); g.ellipse(160, 262, 20, 6, 0, 0, 7); g.fill(); g.fillStyle = '#d8783a'; g.beginPath(); g.ellipse(160, 260, 16, 4, 0, 0, 7); g.fill();
    g.fillStyle = '#c88a3a'; g.beginPath(); g.ellipse(486, 262, 20, 6, 0, 0, 7); g.fill(); g.fillStyle = '#5a2a3a'; g.beginPath(); g.ellipse(486, 260, 16, 4, 0, 0, 7); g.fill();
    r(206, 252, 22, 10, '#f4f0e4'); r(228, 254, 6, 3, '#f4f0e4'); r(210, 250, 14, 3, '#8a5a2a');
    r(400, 250, 26, 12, '#e8e0d0'); r(402, 246, 22, 5, '#f8f4e0');
    r(440, 252, 12, 10, '#a8203a'); for (let i = 0; i < 3; i++) r(440, 254 + i * 3, 12, 1, '#8a1a2a');
    for (const x of [260, 380]) { r(x, 248, 8, 14, 'rgba(200,220,230,0.6)'); r(x + 3, 240, 2, 8, '#f4f0e4'); }
    // a child's paper hand-turkey taped to the fridge
    r(560, 150, 18, 18, '#f4f0e4'); for (let i = 0; i < 4; i++) r(561 + i * 4, 150, 3, 8, ['#c84a3a', '#e8a030', '#3a8a5a', '#3a6aa8'][i]);
    return c;
  },
  animate(g, now) {
    PLACES.kitchen.animate(g, now);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    if (PLATTER.on) {
      // the platter: cream with a brown transfer print, the turkey in the middle of it
      g.fillStyle = '#f4ecd8'; g.beginPath(); g.ellipse(320, 262, 42, 9, 0, 0, 7); g.fill();
      g.strokeStyle = '#7a4a2a'; g.lineWidth = 2; g.beginPath(); g.ellipse(320, 262, 37, 7, 0, 0, 7); g.stroke();
    } else { r(286, 256, 68, 8, '#8a8a92'); r(284, 254, 72, 3, '#a8a8b0'); } // the roasting pan
    g.fillStyle = '#b8702a'; g.beginPath(); g.ellipse(320, 248, 24, 13, 0, 0, 7); g.fill();
    r(296, 248, 8, 5, '#a8602a'); r(338, 248, 8, 5, '#a8602a'); r(292, 250, 4, 3, '#f4f0e4'); r(344, 250, 4, 3, '#f4f0e4');
    for (let i = 0; i < 3; i++) { const t = ((now / 1100) + i / 3) % 1; r(312 + i * 8, 232 - t * 24, 2, 2, `rgba(255,255,255,${0.45 - t * 0.45})`); }
    for (const x of [263, 383]) if (Math.sin(now / 80 + x) > -0.5) r(x + 1, 238, 3, 3, 'rgba(255,210,120,0.95)');
  },
  light(g, now) {
    glow(g, 320, 250, 10, 160, '255,200,130', 0.18);
    for (const x of [264, 384]) glow(g, x, 240, 2, 40, '255,200,120', 0.14 + Math.sin(now / 90 + x) * 0.02);
  },
  vignette: 0.35
}, 1.5);
