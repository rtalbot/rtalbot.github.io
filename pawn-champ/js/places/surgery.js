// Pawn Champ - Dr. Ladd's surgery on Chapel Street, batch J (docs/quests/BACKLOG.md, LOCATIONS.md).
// The old doctor's house: the front parlor has been the surgery since 1891. Dr. Corwin Ladd has
// moved in his own things over the old ones: a paper-covered couch, a scale, a laptop on Dr. Pryne's
// roll-top desk. On the right the cellar trapdoor stands open, with a lantern on the steps.
//   surgery - after hours, by the green desk lamp and the lantern (M19 The Doctor's Cabinet, scene 1)
'use strict';

addPlace('surgery', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(198);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // Victorian wallpaper, a dark green with a faded gold trellis, over oak wainscot
    r(0, 0, NW, 262, '#2e3a32');
    for (let y = 8; y < 186; y += 18) for (let x = (y / 18 % 2) * 12; x < NW; x += 24) { r(x, y, 2, 2, '#5a5a3a'); r(x - 3, y + 3, 8, 1, '#44483a'); }
    r(0, 0, NW, 10, '#e8e0cc'); r(0, 10, NW, 3, '#a89a7a'); // the cornice
    r(0, 186, NW, 76, '#4a3220'); for (let x = 0; x < NW; x += 40) { r(x + 4, 192, 32, 64, '#5a3c26'); r(x + 4, 192, 32, 2, '#6a4a30'); } r(0, 184, NW, 4, '#6a4a30');
    // the window: night, the steeple of Saint Brine's against the clouds, rain on the glass
    r(36, 40, 110, 132, '#3a2a1a'); r(42, 46, 98, 120, '#141a2e');
    for (let y = 46; y < 166; y++) r(42, y, 98, 1, lerpColor('#141a2e', '#2a3048', (y - 46) / 120));
    r(98, 74, 12, 92, '#0c0e18'); for (let i = 0; i < 12; i++) r(104 - i / 2, 62 + i, i + 1, 1, '#0c0e18'); r(103, 52, 2, 10, '#0c0e18');
    r(60, 130, 30, 36, '#0c0e18'); r(66, 140, 4, 6, '#d8b060');
    r(90, 46, 2, 120, '#3a2a1a'); r(42, 104, 98, 2, '#3a2a1a');
    for (let i = 0; i < 30; i++) r(44 + R() * 94, 48 + R() * 116, 1, 2 + R() * 3, 'rgba(160,180,220,0.45)');
    r(28, 36, 10, 140, '#5a2a2a'); r(144, 36, 10, 140, '#5a2a2a'); r(24, 30, 134, 8, '#3a2a1a'); // curtains and the pole
    // the examination couch, with its paper roll, and a folding screen
    r(170, 236, 120, 14, '#2a3a4a'); r(170, 232, 120, 6, '#e8e8e0'); r(174, 250, 4, 24, '#8a8a90'); r(282, 250, 4, 24, '#8a8a90');
    r(162, 218, 16, 20, '#2a3a4a'); r(162, 214, 16, 6, '#e8e8e0'); r(290, 230, 6, 10, '#c8c8c0');
    for (let i = 0; i < 3; i++) { r(176 + i * 38, 120, 36, 112, '#e8e0cc'); r(176 + i * 38, 120, 36, 2, '#a89a7a'); r(176 + i * 38, 120, 2, 112, '#a89a7a'); }
    // the old dispensary cabinet: glass doors, rows of brown bottles, one shelf left empty
    const dx = 314, dw = 120;
    r(dx, 50, dw, 160, '#3a2618'); r(dx + 4, 54, dw - 8, 152, '#20160e');
    for (let s = 0; s < 4; s++) {
      const y = 62 + s * 36;
      r(dx + 6, y + 28, dw - 12, 3, '#5a3c26');
      if (s === 2) { for (let k = 0; k < 4; k++) r(dx + 14 + k * 26, y + 26, 10, 2, '#4a3220'); continue; } // the empty shelf: just the rings in the dust
      for (let i = 0; i < 9; i++) { const x = dx + 10 + i * 12, h = 12 + (R() * 10 | 0), col = R() < 0.6 ? '#6a3a14' : R() < 0.5 ? '#2a4a3a' : '#2a3a6a';
        r(x, y + 28 - h, 8, h, col); r(x + 2, y + 26 - h, 4, 3, '#c8b890'); r(x + 1, y + 28 - h + 4, 6, 4, '#e8e0c8'); r(x + 1, y + 28 - h + 1, 1, h - 3, 'rgba(255,255,255,0.18)'); }
    }
    r(dx + dw / 2 - 1, 54, 2, 152, '#3a2618');
    r(dx + 4, 54, dw - 8, 152, 'rgba(200,220,230,0.06)');
    pixText(g, 'DISPENSARY', dx + dw / 2 - textWidth('DISPENSARY') / 2, 40, '#c8a860');
    // Dr. Pryne's roll-top desk, with Dr. Ladd's laptop, a stethoscope and the green banker's lamp
    r(452, 168, 112, 10, '#5a3a22'); r(452, 178, 112, 70, '#4a3020'); r(458, 184, 44, 58, '#3e281a'); r(514, 184, 44, 58, '#3e281a');
    r(452, 120, 112, 48, '#4a3020'); r(456, 124, 104, 40, '#3a2418'); for (let i = 0; i < 6; i++) r(460 + i * 17, 128, 14, 12, '#2a1a10');
    r(480, 156, 34, 12, '#2a2a30'); r(482, 146, 30, 12, '#3a5a7a'); r(483, 147, 28, 10, '#5a8ab0');
    r(530, 150, 4, 18, '#c8a050'); r(522, 144, 20, 8, '#2a6a3a'); r(524, 144, 16, 2, '#4a9a5a'); // the lamp
    r(462, 162, 14, 2, '#2a2a30'); r(470, 158, 2, 6, '#2a2a30'); g.strokeStyle = '#2a2a30'; g.beginPath(); g.arc(468, 160, 6, 0, 3.2); g.stroke();
    r(492, 98, 40, 2, '#c8a050'); r(496, 70, 32, 28, '#e8e0cc'); r(498, 72, 28, 24, '#c8c0a8'); pixText(g, 'MD', 505, 80, '#3a2a1a'); // the diploma
    // the scale, a jar of tongue depressors, an anatomy chart
    r(588, 140, 24, 120, '#8a8a90'); r(584, 254, 32, 8, '#6a6a70'); r(586, 132, 28, 10, '#c8c8c0'); r(598, 112, 4, 20, '#8a8a90');
    r(570, 40, 52, 70, '#e8e0cc'); g.fillStyle = '#c8a888'; g.beginPath(); g.arc(596, 56, 7, 0, 7); g.fill(); r(590, 62, 12, 26, '#c8a888'); r(584, 64, 6, 20, '#c8a888'); r(602, 64, 6, 20, '#c8a888'); r(590, 88, 5, 16, '#c8a888'); r(597, 88, 5, 16, '#c8a888'); r(593, 68, 6, 8, '#b84a3a');
    // the floor: worn boards and a Turkey rug
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a3020', '#3a2418', (y - 262) / 98));
    for (const y of [272, 288, 310, 338]) r(0, y, NW, 1, '#2e1e12');
    r(150, 280, 220, 56, '#6a2a24'); r(156, 284, 208, 48, '#8a3a2a'); for (let i = 0; i < 10; i++) r(166 + i * 20, 296, 10, 22, '#c8a050'); r(150, 280, 220, 2, '#c8a050'); r(150, 334, 220, 2, '#c8a050');
    // the cellar trapdoor, open, with stone steps going down into the dark and a lantern on the top step
    r(420, 286, 110, 54, '#0a0806'); r(420, 286, 110, 3, '#2a1c12');
    for (let k = 0; k < 4; k++) r(426 + k * 4, 292 + k * 11, 98 - k * 8, 4, shade('#5a5a58', -k * 0.18));
    r(420, 240, 110, 46, '#5a3c26'); r(424, 244, 102, 38, '#4a3220'); r(470, 262, 10, 4, '#2a2a2a'); // the open hatch, leaning on the wall
    r(512, 280, 12, 6, '#2a2a2a'); r(514, 268, 8, 12, 'rgba(230,200,120,0.6)'); r(516, 264, 4, 4, '#2a2a2a');
    // cobwebs in the cornice corners, and one across the cellar steps
    g.strokeStyle = 'rgba(220,220,220,0.35)'; g.lineWidth = 1;
    for (const [x0, y0, sx] of [[0, 13, 1], [NW, 13, -1]]) for (let k = 1; k <= 4; k++) { g.beginPath(); g.moveTo(x0 + sx * k * 9, y0); g.quadraticCurveTo(x0 + sx * k * 5, y0 + k * 5, x0, y0 + k * 9); g.stroke(); }
    for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(420, 290 + k * 7); g.lineTo(530, 296 + k * 5); g.stroke(); }
    return c;
  },
  animate(g, now) {
    // rain running down the window
    for (let i = 0; i < 10; i++) rect(g, 46 + (i * 23) % 92, 48 + ((now / 30 + i * 41) % 112), 1, 4, 'rgba(170,190,230,0.5)');
    // something small crossing the cellar steps, now and then
    const t = (now / 9000) % 1;
    if (t < 0.2) { const x = 430 + t * 5 * 90; rect(g, x, 318, 3, 2, '#141010'); rect(g, x - 2, 317, 1, 1, '#141010'); rect(g, x + 3, 317, 1, 1, '#141010'); rect(g, x - 2, 320, 1, 1, '#141010'); rect(g, x + 3, 320, 1, 1, '#141010'); }
  },
  light(g, now) {
    glow(g, 532, 152, 4, 120, '200,240,180', 0.16);   // the green banker's lamp
    const fl = 0.2 + Math.sin(now / 80) * 0.02 + Math.sin(now / 31) * 0.015;
    glow(g, 518, 272, 3, 110, '255,200,120', fl);      // the lantern on the cellar steps
    glow(g, 90, 110, 6, 80, '120,140,200', 0.06);      // a little streetlight through the rain
  },
  vignette: 0.6
}, 1.5);
