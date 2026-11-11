// Pawn Champ - Gilded Hand Finance, the top floor: dark wood, brass, rain on the window and a view
// of the harbor. The loan company's office (the Hand's scenes).
'use strict';

function buildOffice() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(31);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // Gilded Hand Finance, the top floor: dark wood, brass and a view of the harbor
  r(0, 0, NW, 240, '#22302a');
  for (let x = 0; x < NW; x += 64) { r(x, 30, 58, 164, '#1c2a24'); r(x, 30, 58, 1, '#b8904a'); r(x, 193, 58, 1, '#b8904a'); r(x + 4, 34, 50, 156, '#1f2e27'); }
  r(0, 0, NW, 20, '#121a16'); r(0, 20, NW, 3, '#c8a050');
  r(0, 200, NW, 40, '#3a2418'); r(0, 200, NW, 3, '#c8a050'); r(0, 236, NW, 4, '#2a180e');
  // floor: polished marble checker with a reflection band
  for (let y = 240; y < NH; y += 20) for (let x = 0; x < NW; x += 20) {
    const dark = ((x + y) / 20) % 2; r(x, y, 20, 20, dark ? '#2e2e34' : '#d6cebe');
    if (!dark && R() < 0.4) r(x + 3 + R() * 12, y + 4 + R() * 12, 5, 1, '#c4bcaa');
  }
  for (let y = 240; y < 256; y++) r(0, y, NW, 1, `rgba(200,160,80,${0.16 - (y - 240) / 100})`);
  // the gold hand emblem
  const hx = 288, hy = 46;
  r(hx - 6, hy - 6, 60, 76, '#7a5a2a'); r(hx - 4, hy - 4, 56, 72, '#c8a050'); r(hx, hy, 48, 64, '#18241e');
  r(hx + 12, hy + 26, 22, 26, '#e2b04a'); r(hx + 12, hy + 26, 22, 2, '#f6d77e');
  for (let i = 0; i < 4; i++) { const fy = hy + 8 + (i === 0 || i === 3 ? 5 : 0); r(hx + 12 + i * 6 - (i === 3 ? 1 : 0), fy, 4, 20, '#e2b04a'); r(hx + 12 + i * 6 - (i === 3 ? 1 : 0), fy, 4, 2, '#f6d77e'); }
  r(hx + 34, hy + 30, 6, 12, '#e2b04a'); r(hx + 20, hy + 36, 6, 6, '#18241e');
  r(hx - 4, hy + 74, 56, 11, '#7a5a2a'); r(hx - 3, hy + 75, 54, 9, '#c8a050'); pixText(g, 'GILDED', hx + 2, hy + 77, '#3a2a12'); pixText(g, 'HAND', hx + 30, hy + 77, '#3a2a12');
  // bookshelves with ledgers
  r(30, 56, 104, 184, '#3a2418'); r(30, 56, 104, 4, '#5a3a24');
  const spines = ['#7a2a2a', '#2a4a6a', '#4a5a2a', '#c8a050', '#3a2a40', '#1e3a34'];
  for (let y = 68; y < 228; y += 40) {
    for (let x = 36; x < 126;) { const w = 4 + (R() * 4 | 0), h = 26 + (R() * 8 | 0), col = spines[(R() * spines.length) | 0];
      r(x, y + 34 - h, w, h, col); r(x, y + 34 - h, w, 1, shade(col, 0.25)); if (R() < 0.4) r(x + 1, y + 40 - h, w - 2, 2, '#c8a050'); x += w + 1; }
    r(34, y + 34, 96, 4, '#5a3a24');
  }
  // floor-to-ceiling window: rain over the harbor at night
  r(476, 40, 140, 160, '#c8a050'); r(480, 44, 132, 152, '#0e1428');
  for (let i = 0; i < 18; i++) { const x = 480 + i * 7 + (R() * 4 | 0), h = 8 + (R() * 30 | 0); r(x, 196 - h, 6, h, '#141c34'); if (R() < 0.5) r(x + 2, 196 - h + 4, 2, 2, '#f0c060'); }
  r(480, 182, 132, 14, '#0a1020');
  r(578, 150, 4, 20, '#e8e4d8'); r(577, 146, 6, 4, '#2a2a34'); r(578, 147, 4, 2, '#7ab8f0');
  r(544, 44, 4, 152, '#c8a050'); r(480, 118, 132, 3, '#c8a050');
  // a green banker's lamp and a heavy desk
  r(256, 224, 236, 10, '#6a2e1c'); r(256, 224, 236, 2, '#9a5a34'); r(256, 232, 236, 2, '#4a1e12');
  r(264, 234, 220, 54, '#4a1e12'); r(296, 246, 156, 30, '#3a160c'); r(298, 248, 152, 1, '#5a2a18');
  r(270, 286, 12, 6, '#2a0e06'); r(466, 286, 12, 6, '#2a0e06');
  r(278, 208, 30, 16, '#e6d8b6'); r(280, 212, 26, 1, '#b8a888'); r(280, 216, 22, 1, '#b8a888'); r(282, 206, 28, 2, '#f0e6c8');
  r(354, 212, 30, 12, '#2a2a30'); r(356, 214, 26, 8, '#3a3a44'); // a leather blotter and a phone
  r(400, 214, 22, 10, '#1a1a1e'); r(402, 212, 18, 3, '#2a2a30');
  r(424, 216, 4, 8, '#c8a050'); r(418, 222, 16, 3, '#c8a050'); r(420, 200, 4, 16, '#c8a050'); r(410, 194, 28, 8, '#1e6a3a'); r(410, 194, 28, 2, '#3a8a5a'); r(412, 202, 24, 1, '#f8e0a0');
  // a potted fern and a leather chair
  r(196, 206, 18, 34, '#2a1a12'); r(194, 204, 22, 4, '#3a2418');
  for (let i = 0; i < 14; i++) { const a = -1.4 + i * 0.2; for (let k = 0; k < 18; k++) r(205 + Math.cos(a) * k * 1.2, 204 - Math.abs(Math.sin(a)) * k * 1.6 + k * k * 0.03, 2, 2, i % 2 ? '#2a5a2a' : '#3a7a3a'); }
  r(548, 230, 50, 60, '#4a1810'); r(552, 226, 42, 6, '#5a2418'); r(552, 284, 6, 10, '#1a0a06'); r(588, 284, 6, 10, '#1a0a06');
  for (let i = 0; i < 4; i++) r(556 + i * 10, 236, 2, 2, '#c8a050');
  return c;
}

addPlace('office', {
  build: buildOffice,
  animate(g, now) {
    for (let i = 0; i < 26; i++) {
      const x = 482 + (i * 37) % 128, y = 46 + ((now / 4 + i * 53) % 136);
      rect(g, x, y, 1, 6, 'rgba(150,170,220,0.45)');
    }
  },
  light(g) {
    glow(g, 424, 200, 4, 180, '255,190,90', 0.24);
    glow(g, 316, 80, 4, 70, '255,200,110', 0.1);
  },
  vignette: 0.5
}, 1.5);

// ---- moved from js/quests/portrait.js
const PORTRAIT = { hung: 0 }; // 0 not hung, 1 hung, 2 hung facing the wall
function drawGauntPortrait(g, x, y, w, h, now) {
  rect(g, x - 4, y - 4, w + 8, h + 8, '#c8a050'); rect(g, x - 2, y - 2, w + 4, h + 4, '#7a5a2a');
  if (PORTRAIT.hung === 2) { rect(g, x, y, w, h, '#8a7a5a'); for (let i = 0; i < 5; i++) rect(g, x, y + i * (h / 5), w, 1, '#6a5a3a'); rect(g, x + 4, y + h - 10, 18, 4, '#e8e4d8'); return; }
  for (let i = 0; i < h; i++) rect(g, x, y + i, w, 1, lerpColor('#1a2a22', '#0e1612', i / h));
  const cx = x + w / 2, under = 0.25 + Math.sin(now / 1800) * 0.15; // the face beneath comes and goes
  rect(g, cx - 18, y + 46, 36, 38, '#1e1e26'); rect(g, cx - 3, y + 46, 6, 10, '#e8e4dc'); // suit
  g.fillStyle = '#e8d0c0'; g.beginPath(); g.ellipse(cx, y + 30, 11, 14, 0, 0, 7); g.fill();
  rect(g, cx - 11, y + 16, 22, 6, '#1a1a1a'); rect(g, cx - 8, y + 28, 6, 2, '#0e0e10'); rect(g, cx + 2, y + 28, 6, 2, '#0e0e10'); rect(g, cx - 4, y + 38, 8, 1, '#8a6a5a');
  g.globalAlpha = under; rect(g, cx - 12, y + 22, 24, 3, '#5a4a3a'); rect(g, cx - 13, y + 34, 26, 12, '#4a3a2a'); g.globalAlpha = 1; // side-whiskers and a high collar, 1891
}
addPlace('officeAfter', {
  build() {
    const c = buildOffice(), g = c.getContext('2d');
    g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(30,34,60,1)'; g.globalAlpha = 0.6; g.fillRect(0, 0, NW, NH);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    rect(g, 166, 56, 68, 92, 'rgba(60,70,60,0.6)'); rect(g, 196, 50, 4, 4, '#c8a050'); // the paler patch where the portrait hung, and its hook
    return c;
  },
  animate(g, now) {
    for (let i = 0; i < 26; i++) rect(g, 482 + (i * 37) % 128, 46 + ((now / 4 + i * 53) % 136), 1, 6, 'rgba(150,170,220,0.35)');
    if (PORTRAIT.hung) drawGauntPortrait(g, 168, 58, 64, 88, now);
  },
  light(g, now) {
    glow(g, 424, 200, 4, 150, '255,190,90', 0.22 + Math.sin(now / 700) * 0.01);
    if (PORTRAIT.hung === 1) glow(g, 200, 90, 4, 50, '200,220,190', 0.05);
  },
  vignette: 0.65
}, 1.5);
