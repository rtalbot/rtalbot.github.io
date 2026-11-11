// Pawn Champ - Saint Brine's with the crèche (The Donkey). drawCreche and drawDonkey are used by the
// vigil too (js/places/vigil.js).
'use strict';

// ---- moved from js/quests/donkey.js
// ---------------------------------------------------------------- the crèche (native px; floor line at y)
function drawCreche(g, cx, y) {
  const r = (a, b, w, h, col) => rect(g, a, b, w, h, col);
  // straw, posts, a slanted plank roof and a tin star
  r(cx - 58, y - 6, 116, 8, '#c8a858'); for (let i = 0; i < 20; i++) r(cx - 56 + i * 6, y - 8 + (i % 3), 4, 2, '#e0c070');
  r(cx - 56, y - 74, 5, 68, '#6a4428'); r(cx + 51, y - 74, 5, 68, '#6a4428');
  g.fillStyle = '#5a3a20'; g.beginPath(); g.moveTo(cx - 64, y - 70); g.lineTo(cx, y - 96); g.lineTo(cx + 64, y - 70); g.lineTo(cx + 64, y - 64); g.lineTo(cx, y - 90); g.lineTo(cx - 64, y - 64); g.closePath(); g.fill();
  for (let i = 0; i < 6; i++) r(cx - 60 + i * 21, y - 72 + Math.abs(i - 2.5) * 4, 1, 6, '#3a2414');
  g.fillStyle = '#e8c860'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 3 : 7; g.lineTo(cx + Math.cos(a) * rr, y - 104 + Math.sin(a) * rr); } g.closePath(); g.fill();
  // Mary in blue, kneeling; Joseph in brown with a staff
  r(cx - 44, y - 30, 14, 24, '#3a5a9a'); r(cx - 42, y - 40, 10, 10, '#d8b890'); r(cx - 45, y - 42, 16, 6, '#3a5a9a');
  r(cx - 26, y - 46, 14, 40, '#7a4e2c'); r(cx - 24, y - 56, 10, 10, '#c8a070'); r(cx - 24, y - 58, 10, 4, '#5a5a5a'); r(cx - 30, y - 62, 2, 56, '#4a2e1a');
  // the manger, with hay and the baby
  r(cx - 8, y - 18, 22, 12, '#7a5030'); r(cx - 10, y - 20, 26, 3, '#8a6038'); r(cx - 6, y - 24, 18, 5, '#e0c070'); r(cx, y - 25, 6, 4, '#f0d8c0');
  // a sheep with a knitted hat, at the front
  r(cx - 54, y - 14, 14, 9, '#e8e4dc'); r(cx - 58, y - 16, 6, 6, '#3a3a3a'); r(cx - 58, y - 19, 6, 3, '#c84a3a');
}
// the donkey: carved and painted pine, about the size of a big dog, head to the manger (feet at y)
function drawDonkey(g, x, y, night) {
  const c = night ? { body: '#5a5048', dark: '#3a322c', belly: '#8a8070', mane: '#2a221c' } : { body: '#8a7a6a', dark: '#5a4a3e', belly: '#c8b8a0', mane: '#3a2e26' };
  const r = (a, b, w, h, col) => rect(g, a, b, w, h, col);
  r(x + 12, y - 30, 30, 16, c.body); r(x + 14, y - 16, 26, 3, c.belly);
  for (const lx of [x + 13, x + 19, x + 33, x + 38]) { r(lx, y - 14, 4, 13, c.body); r(lx, y - 2, 4, 2, c.dark); }
  r(x + 6, y - 42, 9, 16, c.body); r(x + 12, y - 44, 3, 18, c.mane);
  r(x - 4, y - 48, 16, 10, c.body); r(x - 6, y - 44, 6, 6, c.dark); r(x + 2, y - 46, 2, 2, '#1a1410');
  r(x + 6, y - 58, 3, 10, c.body); r(x + 10, y - 56, 3, 8, c.dark);
  r(x + 42, y - 28, 2, 12, c.mane); r(x + 41, y - 17, 4, 3, c.mane);
  for (let i = 0; i < 3; i++) r(x + 16 + i * 8, y - 26 + i, 6, 1, c.dark); // carved grain
}
// ---------------------------------------------------------------- Saint Brine's with the crèche (day)
const CRECHE = { notes: 0 };
addPlace('creche', {
  build() {
    const c = PLACES.saintbrines.build(), g = c.getContext('2d');
    drawCreche(g, 452, 268);
    // a strip of masking tape on the straw where the donkey goes: DONKEY
    rect(g, 470, 262, 32, 6, '#e8e0b8'); pixText(g, 'DONKEY', 472, 263, '#3a3a3a', 1);
    return c;
  },
  animate(g, now) {
    PLACES.saintbrines.animate(g, now);
    // the ransom notes pinned over the kids' drawings, letters cut from magazines
    for (let i = 0; i < Math.min(5, CRECHE.notes); i++) {
      const x = 116 + (i % 3) * 36, y = 72 + (i / 3 | 0) * 38;
      rect(g, x, y, 28, 30, '#f4f0e4'); rect(g, x + 13, y - 1, 2, 2, '#c84a3a');
      for (let l = 0; l < 4; l++) for (let w = 0; w < 4; w++) rect(g, x + 3 + w * 6, y + 5 + l * 6, 4, 4, ['#c84a3a', '#3a6aa8', '#2a2a2a', '#e8a030', '#3a8a5a'][(i + l * 3 + w) % 5]);
    }
    if (donkeyInCreche()) drawDonkey(g, 464, 268, false);
  },
  light(g, now) { PLACES.saintbrines.light.call(PLACES.saintbrines, g, now); },
  vignette: 0.6
}, 1.5);
