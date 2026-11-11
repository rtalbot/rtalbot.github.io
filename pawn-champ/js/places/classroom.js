// Pawn Champ - Desmond Wick's classroom at Saint Brine's school, after dark. M4 The Grey Psalter, optional night.
// Small desks with chairs up on them, a chalkboard with the week's spelling word written over and over,
// an alphabet frieze, the children's paintings pinned up (all moons this week), a globe, a radiator,
// and one lamp on the teacher's desk. The full moon looks in through the tall windows.
'use strict';

addPlace('classroom', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(161);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, 262, '#5a6a5e'); r(0, 0, NW, 8, '#3a4a3e'); r(0, 190, NW, 72, '#6a4a32'); r(0, 190, NW, 3, '#8a6a4a'); // paint over wainscot
    for (let x = 0; x < NW; x += 18) r(x, 193, 1, 69, '#5a3e2a');
    // the chalkboard, and the spelling word, twenty times
    r(150, 52, 300, 110, '#5a3e24'); r(156, 58, 288, 98, '#1e3428'); r(150, 158, 300, 6, '#7a5a3a');
    for (let i = 0; i < 4; i++) r(170 + i * 50, 159, 10, 2, '#e8e8e0');
    pixText(g, 'SPELLING', 166, 64, '#d8dcd0', 2);
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) pixText(g, 'MOON', 168 + i * 44, 86 + row * 16, i + row * 6 < 20 ? '#c8ccc0' : '#6a7a6c', 1.5);
    // the alphabet frieze
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 26; i++) { const x = 10 + i * 24; r(x, 14, 20, 22, ['#e8c84a', '#e86a4a', '#4a9ae8', '#6ac86a'][i % 4]); pixText(g, ABC[i], x + 6, 20, '#2a2a2a', 2); }
    // the children's paintings: every one a moon this week
    for (let i = 0; i < 6; i++) { const x = 470 + (i % 3) * 52, y = 60 + (i >> 1 & 1) * 0 + Math.floor(i / 3) * 56;
      r(x, y, 44, 46, '#f4f0e4'); r(x + 20, y - 2, 4, 3, '#c83a2a');
      r(x + 4, y + 4, 36, 38, ['#1a2a5a', '#2a1a4a', '#0a1a3a'][i % 3]);
      g.fillStyle = ['#f4e8a0', '#f0f0f0', '#f4c060'][i % 3]; g.beginPath(); g.arc(x + 22 + (R() - 0.5) * 8, y + 22 + (R() - 0.5) * 6, 8 + R() * 6, 0, 7); g.fill();
      if (i === 4) { r(x + 8, y + 32, 28, 8, '#2a2a2a'); r(x + 12, y + 28, 2, 4, '#2a2a2a'); r(x + 16, y + 28, 2, 4, '#2a2a2a'); } } // one has a row of people with ears
    // tall windows on the left, the full moon in one
    for (const x of [16, 84]) { r(x, 50, 56, 136, '#e8e4d8'); r(x + 4, 54, 48, 128, '#0c1430'); r(x + 26, 54, 3, 128, '#e8e4d8'); r(x + 4, 116, 48, 3, '#e8e4d8');
      for (let i = 0; i < 8; i++) r(x + 6 + R() * 44, 56 + R() * 60, 1, 1, '#c8d0f0'); r(x + 2, 46, 52, 6, '#c8c0a8'); }
    // the globe on its stand and the radiator under the windows
    for (let i = 0; i < 7; i++) r(26 + i * 8, 228, 6, 30, '#9a9a90'); r(24, 226, 56, 3, '#aaaaa0');
    // the floor: worn maple boards
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#7a5a3a', '#9a7448', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(60,40,20,0.35)'; g.beginPath(); g.moveTo(320 + i * 20, 262); g.lineTo(320 + i * 52, NH); g.stroke(); }
    // small desks in rows, chairs up on them for the cleaner
    const desk = (x, y, s) => { r(x, y, 34 * s, 5 * s, '#c8a060'); r(x, y, 34 * s, 1, '#e0b878'); r(x + 2 * s, y + 5 * s, 3 * s, 18 * s, '#5a5a5a'); r(x + 29 * s, y + 5 * s, 3 * s, 18 * s, '#5a5a5a');
      r(x + 6 * s, y - 14 * s, 22 * s, 3 * s, '#3a6aa0'); r(x + 6 * s, y - 14 * s, 3 * s, 14 * s, '#5a5a5a'); r(x + 25 * s, y - 14 * s, 3 * s, 14 * s, '#5a5a5a'); r(x + 6 * s, y - 24 * s, 22 * s, 10 * s, '#3a6aa0'); };
    for (let i = 0; i < 5; i++) desk(150 + i * 64, 248, 1);
    for (let i = 0; i < 4; i++) desk(110 + i * 112, 296, 1.4);
    // the teacher's desk on the right with its lamp, a stack of tests, an apple
    r(470, 256, 130, 10, '#6a4a2a'); r(470, 256, 130, 2, '#8a6a42'); r(474, 266, 30, 44, '#5a3e24'); r(566, 266, 30, 44, '#5a3e24');
    for (let i = 0; i < 5; i++) r(500 + i, 248 - i * 2, 30, 2, i % 2 ? '#f4f0e4' : '#e8e4d8');
    g.fillStyle = '#c83a2a'; g.beginPath(); g.arc(560, 251, 5, 0, 7); g.fill(); r(560, 244, 1, 3, '#4a2a1a');
    r(578, 250, 14, 6, '#2a2a2a'); r(584, 228, 2, 22, '#2a2a2a');
    return c;
  },
  animate(g, now) {
    // the moon in the second window, and its light on the floor
    g.fillStyle = '#f6efd0'; g.beginPath(); g.arc(112, 84, 13, 0, 7); g.fill();
    g.fillStyle = 'rgba(200,210,255,0.06)'; g.beginPath(); g.moveTo(88, 186); g.lineTo(136, 186); g.lineTo(240, 340); g.lineTo(150, 340); g.fill();
    // the globe turns, a little, on its own
    const a = now / 3000;
    g.fillStyle = '#3a7ab0'; g.beginPath(); g.arc(440, 228, 13, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { const x = 440 + Math.sin(a + i * 2) * 10; if (Math.cos(a + i * 2) > 0) rect(g, x - 3, 220 + i * 6, 6, 4, '#6ab06a'); }
    rect(g, 438, 241, 4, 16, '#6a5a3a'); rect(g, 430, 256, 20, 3, '#6a5a3a');
    // the lamp
    g.fillStyle = '#2a5a3a'; g.beginPath(); g.moveTo(574, 228); g.lineTo(596, 228); g.lineTo(592, 220); g.lineTo(578, 220); g.fill(); rect(g, 578, 228, 14, 1, '#fff0c0');
    // the wall clock, nearly ten
    clockFace(g, 600, 160, 12, '#2a2a2a', '#f4f0e4', null); clockHands(g, 600, 160, 12, 9, 50 + (now / 1000) % 10 / 10, '#2a2a2a');
  },
  light(g) {
    glow(g, 585, 236, 3, 150, '255,230,170', 0.28);
    glow(g, 112, 84, 6, 90, '200,210,255', 0.12);
  },
  vignette: 0.55
}, 1.5);
