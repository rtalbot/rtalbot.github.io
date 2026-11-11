// Pawn Champ - Gull Point lighthouse, at dawn, seen from further off (the cast is drawn a
// little smaller here). Odile's scenes.
'use strict';

function buildLighthouse() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(41);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // dawn at Gull Point
  for (let y = 0; y < 224; y++) r(0, y, NW, 1, lerpColor(lerpColor('#3a4688', '#8a6aa0', Math.min(1, y / 120)), '#f4b880', Math.max(0, (y - 100) / 124)));
  for (let i = 0; i < 40; i++) r(R() * NW, R() * 60, 1, 1, 'rgba(255,255,255,0.5)');
  // the sun coming up out of the sea
  for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(255,220,170,${0.06 + i * 0.03})`; g.beginPath(); g.arc(140, 224, 70 - i * 10, 0, 7); g.fill(); }
  g.fillStyle = '#fff2cc'; g.beginPath(); g.arc(140, 224, 28, 0, 7); g.fill();
  // long dawn clouds
  for (let i = 0; i < 12; i++) {
    const x = R() * NW, y = 30 + R() * 130, w = 40 + R() * 90;
    r(x, y, w, 3, 'rgba(255,214,196,0.55)'); r(x + 8, y - 2, w * 0.6, 2, 'rgba(255,230,220,0.45)'); r(x + 4, y + 3, w - 8, 1, 'rgba(170,110,140,0.35)');
  }
  // distant islands
  r(0, 214, 60, 10, '#5a5a7a'); for (let i = 0; i < 20; i++) r(i * 3, 214 - Math.sin(i / 20 * Math.PI) * 8, 3, 8, '#5a5a7a');
  r(250, 218, 70, 6, '#6a6080'); for (let i = 0; i < 24; i++) r(250 + i * 3, 218 - Math.sin(i / 24 * Math.PI) * 5, 3, 5, '#6a6080');
  // sea
  r(0, 224, NW, 136, '#34446e');
  for (let i = 0; i < 300; i++) { const y = 226 + R() * 132; r(R() * NW, y, 4 + R() * 14 * (1 + (y - 224) / 80), 1, R() < 0.5 ? '#4a5a8a' : '#5a6a98'); }
  for (let y = 226; y < 330; y += 2) { const w = 50 - (y - 226) / 3; if (w > 0) r(140 - w / 2 + Math.sin(y) * 6, y, w, 1, '#f4cca0'); }
  // granite cliff and rocks
  g.fillStyle = '#3a3a46';
  g.beginPath(); g.moveTo(290, NH); g.lineTo(320, 300); g.lineTo(340, 262); g.lineTo(380, 242); g.lineTo(400, 234); g.lineTo(NW, 230); g.lineTo(NW, NH); g.closePath(); g.fill();
  g.fillStyle = '#4a4a58';
  g.beginPath(); g.moveTo(330, 290); g.lineTo(350, 262); g.lineTo(390, 244); g.lineTo(400, 262); g.lineTo(370, 300); g.closePath(); g.fill();
  for (let i = 0; i < 70; i++) { const x = 330 + R() * 310, y = 252 + R() * 108; r(x, y, 6 + R() * 18, 1, R() < 0.5 ? '#2a2a34' : '#5a5a6a'); }
  for (const [x, y, w] of [[296, 330, 30], [318, 318, 18], [270, 346, 24]]) { r(x, y, w, 12, '#3a3a46'); r(x + 2, y, w - 6, 2, '#5a5a6a'); r(x - 4, y + 10, w + 8, 2, '#c8d8e8'); }
  // grass on top, wind-bent, with a few beach roses
  r(388, 230, 252, 10, '#4a6a3a'); r(398, 226, 242, 6, '#5a7a44');
  for (let x = 392; x < NW; x += 3) { const h = 3 + (R() * 6 | 0); r(x, 226 - h, 1, h, R() < 0.5 ? '#6a8a4a' : '#7a9a5a'); }
  for (let i = 0; i < 10; i++) { const x = 400 + R() * 230, y = 228 + R() * 8; r(x, y, 3, 3, '#d8507a'); r(x + 1, y + 1, 1, 1, '#f8e070'); }
  // the old keeper's path and fence
  for (let x = 400; x < 470; x += 14) { r(x, 214, 2, 16, '#c8bca8'); }
  r(398, 218, 74, 2, '#c8bca8');
  // the lighthouse: tapered red and white tower, gallery, lantern room
  for (let y = 80; y < 232; y++) {
    const w = 36 + (y - 80) / 4, band = Math.floor((y - 80) / 26) % 2;
    r(504 - w / 2, y, w, 1, band ? '#c84a3a' : '#ece4d8'); r(504 + w / 2 - 6, y, 6, 1, band ? '#a83a2e' : '#cfc6b8');
  }
  r(482, 70, 44, 10, '#2a2a34'); for (let x = 480; x < 530; x += 5) r(x, 64, 1, 6, '#2a2a34'); r(478, 62, 52, 2, '#2a2a34');
  r(488, 42, 32, 22, '#2a2a34'); r(492, 46, 24, 16, '#7ab8f0'); r(503, 46, 2, 16, '#2a2a34');
  for (let i = 0; i < 9; i++) r(488 + i, 41 - i, 32 - i * 2, 1, '#2a2a34');
  r(503, 26, 2, 6, '#2a2a34'); r(501, 24, 6, 2, '#2a2a34');
  r(500, 120, 8, 12, '#1e2a3a'); r(500, 170, 8, 12, '#1e2a3a');
  r(494, 196, 16, 36, '#3a2a1e'); r(494, 196, 16, 2, '#5a4430'); r(506, 214, 2, 2, '#c8a050');
  // keeper's cottage
  r(568, 196, 66, 36, '#e8e4dc'); for (let y = 198; y < 232; y += 3) r(568, y, 66, 1, '#d8d2c6');
  for (let i = 0; i < 10; i++) r(566 + i, 196 - i, 70 - i * 2, 1, '#5a3a32');
  r(582, 208, 10, 12, '#3a4a5a'); r(612, 208, 10, 12, '#3a4a5a'); r(590, 180, 6, 12, '#7a5a4a');
  return c;
}

addPlace('lighthouse', {
  build: buildLighthouse,
  animate(g, now) {
    for (let i = 0; i < 20; i++) rect(g, (i * 53 + now / 70) % 300, 236 + (i * 29) % 110, 10, 1, 'rgba(255,220,190,0.4)');
    const f = (Math.sin(now / 300) + 1) / 2; // surf on the rocks
    for (const [x, y, w] of [[292, 340, 38], [314, 328, 26], [266, 356, 32]]) rect(g, x, y - f * 2, w * (0.7 + f * 0.3), 2, 'rgba(240,248,255,0.7)');
  },
  light(g, now) {
    const p = 0.3 + Math.sin(now / 700) * 0.08;
    glow(g, 504, 54, 2, 100, '120,180,255', p);
    glow(g, 140, 224, 10, 220, '255,200,150', 0.12);
  },
  vignette: 0.35
}, 1.25);

// ---- moved from js/quests/prisms.js
// Gull Point in the middle of the day: the lighthouse backdrop with the dawn washed out of the sky
addPlace('gullpointDay', {
  build() {
    const c = buildLighthouse(), g = c.getContext('2d');
    g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(150,190,235,0.5)'; g.fillRect(0, 0, NW, 224);
    g.fillStyle = 'rgba(120,150,190,0.25)'; g.fillRect(0, 224, NW, NH - 224);
    g.globalCompositeOperation = 'source-over';
    return c;
  },
  animate(g, now) {
    const f = (Math.sin(now / 300) + 1) / 2; // surf on the rocks
    for (const [x, y, w] of [[292, 340, 38], [314, 328, 26], [266, 356, 32]]) rect(g, x, y - f * 2, w * (0.7 + f * 0.3), 2, 'rgba(240,248,255,0.7)');
    for (let i = 0; i < 16; i++) rect(g, (i * 53 + now / 70) % 300, 236 + (i * 29) % 110, 10, 1, 'rgba(255,255,255,0.35)');
  },
  light(g) { glow(g, 504, 54, 2, 60, '160,200,255', 0.12); },
  vignette: 0.25
}, 1.25);
