// Pawn Champ - The Customs House records room, after ten at night. M1 Four Minutes Late, scene 2.
// Two storeys of filing cabinets under a gallery with an iron rail, a rolling ladder, arched windows
// onto the harbor, a long table under a green-shaded lamp, and the radiator that doesn't work.
'use strict';

addPlace('customsRecords', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(141);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // plaster walls, a high cornice, the federal eagle over the door
    r(0, 0, NW, 262, '#4a4e44'); for (let y = 0; y < 262; y += 3) r(0, y, NW, 1, 'rgba(0,0,0,0.04)');
    r(0, 0, NW, 12, '#2e322a'); r(0, 12, NW, 4, '#6a6c5e'); r(0, 16, NW, 2, '#2e322a');
    // arched windows: night over the harbor, the lighthouse far off
    for (const x of [262, 346]) {
      r(x - 4, 26, 40, 96, '#2a2c26'); r(x, 30, 32, 88, '#0c1228');
      g.fillStyle = '#2a2c26'; g.beginPath(); g.arc(x + 16, 30, 20, Math.PI, 0); g.fill(); g.fillStyle = '#0c1228'; g.beginPath(); g.arc(x + 16, 30, 16, Math.PI, 0); g.fill();
      for (let i = 0; i < 12; i++) r(x + R() * 32, 18 + R() * 60, 1, 1, '#a8b0d8');
      r(x, 96, 32, 22, '#121a34'); for (let i = 0; i < 6; i++) r(x + R() * 30, 98 + R() * 18, 4, 1, '#3a4a7a');
      r(x + 15, 30, 2, 88, '#2a2c26'); r(x, 70, 32, 2, '#2a2c26');
    }
    r(366, 84, 3, 12, '#1a1e30'); r(365, 80, 5, 4, '#6ab0f0'); // Gull Point, far off
    // the gallery: a floor on posts with an iron rail, cabinets above and below
    const cabinets = (x0, x1, top, h, rows) => { for (let x = x0; x < x1; x += 28) { const col = (x / 28 | 0) % 3 ? '#6a7064' : '#5e665a';
      r(x, top, 26, h, col); r(x, top, 26, 2, shade(col, 0.12)); r(x + 24, top, 2, h, shade(col, -0.15));
      for (let k = 0; k < rows; k++) { const y = top + 4 + k * (h - 6) / rows; r(x + 3, y, 20, (h - 6) / rows - 2, shade(col, -0.05)); r(x + 9, y + 3, 8, 3, '#e8e0c8'); r(x + 11, y + 8, 4, 2, '#a8a898'); } } };
    cabinets(10, 250, 22, 92, 4); cabinets(410, 634, 22, 92, 4);
    r(0, 116, NW, 8, '#3a2e22'); r(0, 116, NW, 2, '#5a4632'); // gallery floor
    for (let x = 0; x < NW; x += 8) r(x, 104, 2, 12, '#1a1a1a'); r(0, 102, NW, 3, '#2a2a2a'); // its rail
    for (const x of [6, 250, 404, 630]) r(x, 124, 6, 138, '#2a2a2a');
    cabinets(14, 236, 132, 128, 5); cabinets(416, 630, 132, 128, 5);
    // the rolling ladder, leaning on the upper cabinets
    g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(170, 102); g.lineTo(196, 262); g.moveTo(190, 102); g.lineTo(216, 262); g.stroke();
    for (let i = 1; i < 12; i++) { const t = i / 12; r(170 + 26 * t, 102 + 160 * t, 20, 2, '#7a5a34'); }
    // the door, the eagle over it, and the dead radiator
    r(276, 150, 66, 112, '#3a2e22'); r(280, 154, 58, 108, '#4a3a2a'); r(284, 158, 24, 44, '#3e3024'); r(310, 158, 24, 44, '#3e3024'); r(330, 210, 4, 6, '#c8a050');
    r(282, 140, 54, 8, '#2a2c26'); g.fillStyle = '#b8964a'; g.beginPath(); g.moveTo(309, 126); g.lineTo(290, 136); g.lineTo(300, 134); g.lineTo(309, 140); g.lineTo(318, 134); g.lineTo(328, 136); g.fill();
    pixText(g, 'RECORDS', 296, 142, '#c8b890');
    for (let i = 0; i < 9; i++) r(352 + i * 6, 222, 4, 36, '#8a8a80'); r(350, 220, 56, 3, '#9a9a90'); r(350, 256, 56, 4, '#5a5a52');
    // the floor: worn government linoleum
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4636', '#625c46', (y - 262) / 98));
    for (let y = 270; y < NH; y += 18) r(0, y, NW, 1, 'rgba(0,0,0,0.12)');
    for (let i = -10; i < 22; i++) { g.strokeStyle = 'rgba(0,0,0,0.12)'; g.beginPath(); g.moveTo(320 + i * 30, 262); g.lineTo(320 + i * 70, NH); g.stroke(); }
    r(0, 262, NW, 3, '#2a2820');
    // the long table: boxes of certificates, a lamp, a mug of soup, a folder left open
    r(150, 280, 300, 10, '#5a3e24'); r(150, 280, 300, 2, '#7a5a34'); r(158, 290, 8, 40, '#3a2818'); r(434, 290, 8, 40, '#3a2818');
    for (let i = 0; i < 4; i++) { const x = 170 + i * 40; r(x, 262 - (i % 2) * 6, 34, 18 + (i % 2) * 6, '#c8b088'); r(x, 262 - (i % 2) * 6, 34, 3, '#d8c098'); r(x + 8, 268 - (i % 2) * 6, 18, 6, '#f0e8d0'); }
    r(170 + 2 * 40 + 6, 270, 22, 3, '#2a2a2a');
    r(360, 272, 30, 8, '#e8e0c8'); r(362, 273, 26, 1, '#8a8478'); r(362, 276, 20, 1, '#8a8478');
    r(410, 270, 10, 10, '#c83a2a'); r(420, 272, 3, 5, '#c83a2a'); // the soup mug
    r(330, 274, 16, 6, '#2a2a2a'); r(336, 248, 3, 26, '#2a2a2a'); // lamp stem
    return c;
  },
  animate(g, now) {
    // the green-shaded lamp
    g.fillStyle = '#2a6a3a'; g.beginPath(); g.moveTo(320, 252); g.lineTo(356, 252); g.lineTo(350, 242); g.lineTo(326, 242); g.fill();
    rect(g, 326, 252, 24, 2, '#fff0c0');
    // steam off Tobias's soup, dust in the lamplight
    for (let i = 0; i < 3; i++) { const p = (now / 1600 + i / 3) % 1; rect(g, 413 + Math.sin(p * 6 + i) * 3, 266 - p * 20, 1, 2, `rgba(230,230,230,${0.5 * (1 - p)})`); }
    for (let i = 0; i < 12; i++) { const p = (now / 8000 + i * 0.09) % 1; rect(g, 300 + i * 6 + Math.sin(now / 1200 + i) * 8, 250 + p * 40, 1, 1, 'rgba(255,240,200,0.5)'); }
    // the radiator ticks, now and then, as if it might
    if ((now % 7000) < 120) rect(g, 404, 224, 2, 2, '#e8e0c8');
  },
  light(g, now) {
    glow(g, 338, 262, 4, 150, '255,230,170', 0.26 + Math.sin(now / 900) * 0.01);
    glow(g, 310, 70, 10, 120, '120,140,220', 0.06);
  },
  vignette: 0.6
}, 1.5);
