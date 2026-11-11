// Pawn Champ - Pearl's Luncheonette on Main Street, five in the morning in January. M27 Stool Nine
// (pitched, PR #35). A long counter with chrome stools, the flat-top grill steaming, the order wheel,
// the pie case, coffee urns, a letter-board menu, and the front window with snow and the dark street.
//   PEARLS.gap = the stool number missing from the row (default 9); 0 puts every stool back
'use strict';

const PEARLS = { gap: 9 };

addPlace('pearls', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(201);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // mint-green walls and a chrome trim line, the letter-board menu
    r(0, 0, NW, 262, '#a8d0b8'); r(0, 0, NW, 8, '#6a9a80'); r(0, 120, NW, 3, '#d8dcdc'); r(0, 123, NW, 1, '#8a9090');
    r(180, 18, 280, 84, '#1a1a1a'); r(182, 20, 276, 80, '#2a2a2a');
    const menu = ['EGGS ANY STYLE 4.50', 'HASH & EGGS 6.75', 'CHOWDER CUP 4', 'PIE OF THE DAY 3.50', 'COFFEE .75'];
    menu.forEach((m, i) => pixText(g, m, 192, 26 + i * 14, '#f4f0e4', 1.5));
    pixText(g, 'SINCE 1963', 384, 26, '#e8c050');
    // the front window on the left: snow, the dark street, PEARLS backwards on the glass
    r(10, 30, 150, 150, '#d8dcdc'); for (let y = 34; y < 176; y++) r(14, y, 142, 1, lerpColor('#0c1430', '#2a3a5a', (y - 34) / 142));
    r(14, 150, 142, 26, '#c8d0e0'); for (let i = 0; i < 4; i++) r(30 + i * 34, 120, 2, 30, '#3a3a4a'); r(26, 116, 10, 4, '#f0c060');
    pixTextMirror(g, 'PEARLS', 40, 46, '#e85a6a', 2); r(84, 34, 3, 142, '#d8dcdc');
    // behind the counter: the grill, the urns, the order wheel, the pie case
    r(190, 150, 160, 60, '#5a5e62'); r(190, 150, 160, 4, '#8a8e92'); r(194, 160, 152, 30, '#2a2a2a'); // grill and its hood
    r(186, 128, 168, 22, '#a8acb0'); r(186, 128, 168, 3, '#d8dcdc');
    for (const [x, y] of [[210, 168], [250, 172], [292, 166]]) { r(x, y, 18, 8, '#e8d8a0'); r(x + 4, y + 2, 6, 4, '#f0b030'); } // eggs on the flat-top
    r(316, 170, 24, 10, '#8a5a3a'); // hash
    for (let i = 0; i < 2; i++) { r(370 + i * 30, 150, 22, 50, '#c8ccd0'); r(370 + i * 30, 146, 22, 5, '#a8acb0'); r(378 + i * 30, 186, 6, 4, '#2a2a2a'); }
    g.strokeStyle = '#a8acb0'; g.lineWidth = 2; g.beginPath(); g.arc(450, 160, 18, 0, 7); g.stroke(); // the order wheel
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; r(450 + Math.cos(a) * 18 - 3, 160 + Math.sin(a) * 18, 6, 10, i === 2 ? '#f4e8a0' : '#f4f0e4'); }
    r(490, 140, 120, 70, '#d8dcdc'); r(494, 144, 112, 62, 'rgba(200,230,240,0.5)'); // the pie case
    for (let k = 0; k < 2; k++) for (let i = 0; i < 3; i++) { const x = 500 + i * 36, y = 150 + k * 28; g.fillStyle = ['#c8843a', '#a83a4a', '#e8c86a'][(i + k) % 3]; g.beginPath(); g.arc(x + 14, y + 14, 12, Math.PI, 0); g.fill(); r(x + 2, y + 14, 24, 3, '#d8b070'); }
    // the counter itself: chrome edge, red formica top
    r(0, 210, NW, 14, '#c83a3a'); r(0, 210, NW, 3, '#e86a6a'); r(0, 224, NW, 4, '#d8dcdc'); r(0, 228, NW, 34, '#7a2a2a'); for (let x = 0; x < NW; x += 40) r(x, 228, 2, 34, '#6a2020');
    for (let i = 0; i < 6; i++) { const x = 40 + i * 100; r(x, 204, 14, 8, '#f4f4f0'); r(x + 3, 200, 8, 4, '#5a3a2a'); } // mugs
    // the floor: black and white checks
    for (let j = 0; j * 12 + 262 < NH; j++) for (let i = 0; i * 14 < NW; i++) r(i * 14, 262 + j * 12, 14, 12, (i + j) % 2 ? '#e8e8e0' : '#2a2a2a');
    return c;
  },
  animate(g, now) {
    // the stools: chrome posts, red tops, numbered on the front; one missing
    for (let i = 0; i < 12; i++) { const n = i + 1, x = 26 + i * 52; if (n === PEARLS.gap) { rect(g, x + 6, 300, 12, 3, '#5a5a5a'); continue; }
      rect(g, x + 10, 270, 4, 30, '#c8ccd0'); rect(g, x + 4, 298, 16, 4, '#a8acb0'); rect(g, x, 262, 24, 9, '#c83a3a'); rect(g, x, 262, 24, 2, '#e86a6a'); rect(g, x, 270, 24, 1, '#d8dcdc'); }
    // steam off the grill and the urns, a hiss of fat
    for (let i = 0; i < 8; i++) { const p = (now / 1500 + i / 8) % 1; g.fillStyle = `rgba(255,255,255,${0.22 * (1 - p)})`; g.beginPath(); g.ellipse(210 + i * 18 + Math.sin(p * 6 + i) * 4, 160 - p * 40, 4 + p * 8, 3 + p * 4, 0, 0, 7); g.fill(); }
    if (Math.sin(now / 130) > 0.85) rect(g, 214 + (now / 50) % 100, 164, 2, 1, '#ffe090');
    // snow past the window
    for (let i = 0; i < 26; i++) { const x = 16 + (i * 47 + Math.sin(now / 700 + i) * 6) % 138, y = 36 + (i * 29 + now / 40) % 138; rect(g, x, y, 1, 1, '#ffffff'); }
    // the wall clock says five past five
    clockFace(g, 560, 50, 16, '#d8dcdc', '#f4f4f0', null); clockHands(g, 560, 50, 16, 5, 5 + (now / 60000) % 5, '#2a2a2a');
  },
  light(g, now) {
    glow(g, 320, 120, 20, 340, '255,240,210', 0.14);
    glow(g, 270, 175, 4, 90, '255,170,90', 0.12 + Math.sin(now / 200) * 0.01);
    glow(g, 85, 110, 6, 100, '120,150,230', 0.08);
  },
  vignette: 0.4
}, 1.5);
