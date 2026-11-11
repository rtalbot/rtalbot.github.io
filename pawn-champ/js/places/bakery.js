// Pawn Champ - The back room of Bettany's bakery on Front Street, after hours. M4 The Grey Psalter, scene 1.
// A working bakery set up for the Pack's open house: the deck oven still warm, bread racks pushed
// to the wall, flour sacks, the big mixer, folding chairs in rows, a tea urn, cider, a sign-up sheet,
// a paper garland of wolves, and the banner. The street window is dark.
'use strict';

addPlace('bakeryBack', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(151);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // white subway tile to shoulder height, cream paint above
    r(0, 0, NW, 262, '#d8ccb0'); r(0, 0, NW, 10, '#a89a7e');
    for (let y = 130; y < 262; y += 8) for (let x = (y / 8 % 2) * 8; x < NW; x += 16) { r(x, y, 15, 7, '#e8e4dc'); r(x, y + 7, 16, 1, '#b8b4aa'); }
    r(0, 128, NW, 3, '#8a8478');
    // the deck oven: three steel decks with little windows, a thermometer dial
    r(18, 60, 150, 202, '#7a7e82'); r(18, 60, 150, 4, '#a8acb0'); r(164, 60, 4, 202, '#5a5e62');
    for (let k = 0; k < 3; k++) { const y = 76 + k * 52; r(28, y, 130, 40, '#5a5e62'); r(30, y + 2, 126, 36, '#6a6e72'); r(60, y + 10, 66, 14, '#1a0e08'); r(28, y + 34, 130, 4, '#3a3e42'); r(76, y + 30, 34, 3, '#c8ccd0'); }
    g.fillStyle = '#f0ece0'; g.beginPath(); g.arc(150, 70, 6, 0, 7); g.fill(); r(150, 66, 1, 4, '#c83a2a');
    // bread racks on wheels, pushed against the wall, half full
    for (const x of [182, 226]) { r(x, 120, 3, 142, '#a8acb0'); r(x + 38, 120, 3, 142, '#a8acb0');
      for (let k = 0; k < 9; k++) { const y = 126 + k * 15; r(x, y, 41, 2, '#8a8e92'); if (R() < 0.6) for (let i = 0; i < 3; i++) { r(x + 3 + i * 12, y - 6, 10, 6, '#c8843a'); r(x + 4 + i * 12, y - 6, 8, 2, '#e0a050'); } } }
    // the mixer, big as a person, and flour sacks stacked
    r(520, 170, 50, 92, '#c8ccc8'); r(516, 150, 58, 26, '#b8bcb8'); r(534, 196, 22, 26, '#e8ecec'); r(530, 220, 30, 6, '#9a9e9a'); r(560, 160, 10, 6, '#c83a2a');
    for (let i = 0; i < 6; i++) { const x = 578 + (i % 2) * 28, y = 236 - (i >> 1) * 24; r(x, y, 26, 24, '#e8e0cc'); r(x, y, 26, 3, '#f4ecd8'); r(x + 6, y + 8, 14, 6, '#5a7a9a'); }
    // the street window, dark, BAKERY backwards on the glass
    r(282, 34, 132, 86, '#5a4a3a'); for (let y = 38; y < 116; y++) r(286, y, 124, 1, lerpColor('#0a0e22', '#18203a', (y - 38) / 78));
    for (let i = 0; i < 4; i++) r(300 + i * 30, 98, 2, 18, '#f0c060'); // streetlamps far down Front Street
    r(346, 38, 3, 78, '#5a4a3a'); pixTextMirror(g, 'BAKERY', 310, 46, '#c8a050', 2);
    // the banner, the garland of paper wolves, the sign-up sheet on the wall
    r(150, 14, 360, 18, '#7a5a8a'); r(150, 14, 360, 2, '#c8a050');
    pixText(g, 'WELCOME FRIENDS OF THE PACK', 330 - textWidth('WELCOME FRIENDS OF THE PACK', 1.5) / 2, 19, '#f4e8c8', 1.5);
    g.strokeStyle = '#6a6a6a'; g.lineWidth = 1; g.beginPath(); g.moveTo(170, 36); g.quadraticCurveTo(330, 56, 490, 36); g.stroke();
    for (let i = 0; i < 12; i++) { const t = (i + 0.5) / 12, x = 170 + t * 320, y = 36 + Math.sin(t * Math.PI) * 10;
      r(x - 3, y, 7, 6, '#9a9aa0'); r(x - 3, y - 3, 2, 3, '#9a9aa0'); r(x + 2, y - 3, 2, 3, '#9a9aa0'); r(x - 1, y + 2, 1, 1, '#2a2a2a'); r(x + 1, y + 2, 1, 1, '#2a2a2a'); }
    r(440, 70, 50, 60, '#f4f0e4'); pixText(g, 'SIGN UP', 446, 74, '#5a3a6a'); for (let i = 0; i < 6; i++) r(446, 86 + i * 7, 20 + R() * 20, 1, '#3a3a5a');
    // the floor: red quarry tile, floury
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#8a4a32', '#a85a3a', (y - 262) / 98));
    for (let i = -14; i < 26; i++) { g.strokeStyle = 'rgba(60,30,20,0.4)'; g.beginPath(); g.moveTo(320 + i * 24, 262); g.lineTo(320 + i * 60, NH); g.stroke(); }
    for (let y = 270; y < NH; y += 14 + (y - 262) / 8) r(0, y, NW, 1, 'rgba(60,30,20,0.4)');
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(250,245,235,0.18)'; g.beginPath(); g.ellipse(R() * NW, 270 + R() * 90, 6 + R() * 16, 2 + R() * 3, 0, 0, 7); g.fill(); }
    // the trestle table: tea urn, cider, paper cups, a plate of wolf-shaped cookies
    r(410, 250, 120, 6, '#e8e4dc'); r(414, 256, 4, 40, '#8a8a8a'); r(522, 256, 4, 40, '#8a8a8a');
    r(420, 222, 22, 28, '#c8ccd0'); r(418, 218, 26, 5, '#a8acb0'); r(442, 238, 6, 3, '#5a5a5a');
    for (let i = 0; i < 2; i++) { r(456 + i * 14, 232, 10, 18, '#c8843a'); r(458 + i * 14, 228, 6, 4, '#c8843a'); }
    for (let i = 0; i < 5; i++) r(488 + i * 6, 244, 4, 6, '#f4f0e8');
    r(486, 248, 36, 2, '#e8e8e8'); for (let i = 0; i < 4; i++) r(489 + i * 8, 245, 5, 3, '#b8743a');
    // folding chairs in rows, backs to you
    for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) { const x = 60 + i * 76 + row * 30, y = 300 + row * 34;
      r(x, y - 24, 22, 14, '#6a6a72'); r(x + 2, y - 22, 18, 10, '#7a7a82'); r(x, y - 10, 3, 24, '#5a5a62'); r(x + 19, y - 10, 3, 24, '#5a5a62'); r(x, y - 2, 22, 3, '#4a4a52'); }
    return c;
  },
  animate(g, now) {
    // the oven's windows still glow; heat shimmers off the top deck
    for (let k = 0; k < 3; k++) rect(g, 62, 88 + k * 52, 62, 10, `rgb(${170 + Math.sin(now / 400 + k) * 20},${70 + k * 10},20)`);
    for (let i = 0; i < 5; i++) { const p = (now / 1800 + i / 5) % 1; rect(g, 40 + i * 24 + Math.sin(p * 8) * 3, 58 - p * 30, 2, 1, `rgba(255,255,255,${0.3 * (1 - p)})`); }
    // steam from the urn
    for (let i = 0; i < 3; i++) { const p = (now / 1500 + i / 3) % 1; rect(g, 430 + Math.sin(p * 6 + i) * 3, 214 - p * 24, 2, 2, `rgba(240,240,240,${0.5 * (1 - p)})`); }
    // the garland stirs in the draught from the door
    for (let i = 0; i < 12; i += 3) { const t = (i + 0.5) / 12; rect(g, 170 + t * 320 - 3, 42 + Math.sin(t * Math.PI) * 10 + Math.sin(now / 400 + i), 7, 1, 'rgba(120,120,128,0.6)'); }
  },
  light(g, now) {
    glow(g, 320, 140, 6, 260, '255,220,160', 0.2 + Math.sin(now / 500) * 0.01);
    glow(g, 92, 140, 6, 120, '255,140,60', 0.12);
  },
  vignette: 0.45
}, 1.5);
