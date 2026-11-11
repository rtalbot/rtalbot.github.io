// Pawn Champ - The Hollow Neck post office after hours. M23 The Dead Letter Office (pitched, PR #35).
// The sorting room behind the counter: a wall of wooden pigeonholes stuffed with letters, a wall of
// brass PO box doors, canvas mail hampers, a parcel scale, and at the back the caged door of the
// dead-letter room, open a crack. One hanging lamp is on.
//   postoffice      - the night scene
//   postofficeLast  - the last day: half the pigeonholes empty, the sorting case off the wall, boxes
'use strict';

function buildPostOffice(last) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(171);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  r(0, 0, NW, 262, '#c8b890'); r(0, 0, NW, 10, '#8a7a5a'); r(0, 200, NW, 62, '#5a4a32'); r(0, 200, NW, 3, '#7a6a4a');
  // brass PO box doors on the left wall
  r(10, 40, 130, 156, '#5a4628');
  for (let y = 0; y < 9; y++) for (let x = 0; x < 6; x++) { const bx = 14 + x * 21, by = 44 + y * 17;
    r(bx, by, 19, 15, '#b8964a'); r(bx + 1, by + 1, 17, 13, '#a8863a'); r(bx + 3, by + 3, 8, 7, '#3a2a1a'); r(bx + 13, by + 6, 3, 3, '#e8c870'); }
  // the great wall of pigeonholes, and letters in them
  r(160, 30, 300, 170, '#6a4a2a'); r(160, 30, 300, 4, '#8a6a42');
  for (let y = 0; y < 10; y++) for (let x = 0; x < 15; x++) { const px = 164 + x * 19.6, py = 36 + y * 16;
    r(px, py, 17, 14, '#3a2614');
    if (R() < (last ? 0.3 : 0.85)) { const n = 1 + (R() * 3 | 0); for (let k = 0; k < n; k++) r(px + 1 + k * 2, py + 4 + k, 14 - k * 2, 9 - k, ['#f4f0e4', '#e8e0c8', '#d8e4f0', '#f0d8d8'][(x + y + k) % 4]); } }
  if (!last) { r(160, 30, 300, 1, '#a88a5a'); pixText(g, 'SORTING', 292, 20, '#3a2a14'); }
  // the dead-letter room: a caged door at the back right, open a crack, dark inside
  r(486, 60, 110, 202, '#2a2218'); r(492, 66, 98, 196, '#0e0a08');
  for (let x = 492; x < 590; x += 7) r(x, 66, 2, 196, '#7a7a72'); for (let y = 66; y < 262; y += 14) r(492, y, 98, 1, '#5a5a52');
  r(480, 40, 122, 18, '#3a2a1a'); pixText(g, 'DEAD LETTERS', 492, 46, '#e8d8a8');
  r(570, 150, 6, 10, '#c8a050');
  // the floor: dark tile
  for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4a42', '#6a685a', (y - 262) / 98));
  for (let i = -10; i < 22; i++) { g.strokeStyle = 'rgba(0,0,0,0.2)'; g.beginPath(); g.moveTo(320 + i * 28, 262); g.lineTo(320 + i * 66, NH); g.stroke(); }
  for (let y = 272; y < NH; y += 14 + (y - 262) / 6) r(0, y, NW, 1, 'rgba(0,0,0,0.2)');
  // canvas mail hampers on wheels, and the parcel scale
  for (const [x, full] of [[30, 1], [120, 0]]) { r(x, 236, 70, 52, '#7a6a4a'); r(x + 3, 238, 64, 46, '#8a7a5a'); pixText(g, 'US MAIL', x + 10, 266, '#3a3a5a');
    if (full) for (let i = 0; i < 9; i++) r(x + 6 + i * 7, 230 - (i % 3) * 3, 8, 10, ['#e8e0c8', '#c8a878', '#f4f0e4'][i % 3]);
    r(x, 288, 70, 3, '#3a3a3a'); g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(x + 8, 294, 4, 0, 7); g.arc(x + 62, 294, 4, 0, 7); g.fill(); }
  r(390, 238, 50, 6, '#8a8a82'); r(410, 244, 10, 30, '#5a5a52'); r(400, 272, 30, 4, '#4a4a42'); g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(415, 226, 10, 0, 7); g.fill(); r(415, 218, 1, 8, '#c83a2a');
  if (last) { // packed up: boxes stacked, the sorting case leaning against the wall
    for (let i = 0; i < 6; i++) { const x = 210 + (i % 3) * 52, y = 288 - Math.floor(i / 3) * 30; r(x, y, 48, 28, '#b8946a'); r(x, y, 48, 3, '#c8a47a'); r(x + 20, y, 8, 28, '#d8c8a0'); }
  } else { r(250, 286, 140, 8, '#6a4a2a'); r(250, 286, 140, 2, '#8a6a42'); r(256, 294, 6, 30, '#4a3220'); r(378, 294, 6, 30, '#4a3220'); // the sorting table
    for (let i = 0; i < 12; i++) r(262 + i * 10, 280 - (i % 2) * 2, 8, 6, ['#f4f0e4', '#e8e0c8', '#d8e4f0'][i % 3]); }
  return c;
}
const POSTOFFICE = {
  animate(g, now) {
    // the one lamp, on its chain
    const sw = Math.sin(now / 1500) * 3;
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 1; g.beginPath(); g.moveTo(320, 0); g.lineTo(320 + sw, 70); g.stroke();
    g.fillStyle = '#2a4a3a'; g.beginPath(); g.moveTo(304 + sw, 82); g.lineTo(336 + sw, 82); g.lineTo(326 + sw, 70); g.lineTo(314 + sw, 70); g.fill(); rect(g, 308 + sw, 82, 24, 2, '#fff0c0');
    // now and then a letter slips out of its pigeonhole and drifts down
    const p = (now % 9000) / 2200;
    if (p < 1) { const x = 300 + Math.sin(p * 9) * 16, y = 120 + p * 160; rect(g, x, y, 8, 5, '#f4f0e4'); rect(g, x + 1, y + 1, 6, 1, '#8a8478'); }
    // something moves behind the bars of the dead-letter room
    const q = (now % 11000) / 11000; if (q > 0.6 && q < 0.75) { g.fillStyle = 'rgba(200,200,190,0.18)'; g.beginPath(); g.ellipse(500 + (q - 0.6) * 500, 160, 8, 30, 0, 0, 7); g.fill(); }
  },
  light(g, now) { glow(g, 320, 90, 4, 240, '255,230,170', 0.22 + Math.sin(now / 1500) * 0.01); },
  vignette: 0.55
};
addPlace('postoffice', { build: () => buildPostOffice(false), ...POSTOFFICE }, 1.5);
addPlace('postofficeLast', { build: () => buildPostOffice(true), animate: (g, now) => POSTOFFICE.animate(g, now),
  light: (g) => glow(g, 320, 120, 10, 360, '230,230,220', 0.14), vignette: 0.35 }, 1.5);
