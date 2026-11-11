// Pawn Champ - The Hollow in Hob's Wood. A set-piece scene for M4 The Grey Psalter
// (docs/quests/MAJOR.md, docs/ART.md#set-piece-scenes).
// The marsh is where the Pack howls for an audience. This is where it goes afterwards: a clearing in
// the pines past the end of the causeway, under a red moon. A ring of old stones with deer skulls on
// them, a carved post hung with pelts and bone chimes, the Psalter open on a flat rock, a bonfire
// taller than a man, and eyes in the trees that don't belong to anyone in the circle.
//
// WOLFWOOD.demon = 0..1 raises the thing the book feeds: a grey wolf's head made of smoke, rising out of
// the bonfire. It eases toward the value set, so a scene can set it and carry on talking.
'use strict';

const WOLFWOOD = { demon: 0, _d: 0 };

function pine(g, x, base, h, col, R) {
  const w = h * 0.36;
  for (let k = 0; k < 5; k++) {
    const ty = base - h + k * h * 0.17, bw = w * (0.35 + k * 0.17);
    g.fillStyle = col; g.beginPath(); g.moveTo(x, ty); g.lineTo(x + bw + (R ? R() * 3 : 0), ty + h * 0.26); g.lineTo(x - bw - (R ? R() * 3 : 0), ty + h * 0.26); g.fill();
  }
  rect(g, x - h * 0.03, base - h * 0.1, Math.max(2, h * 0.06), h * 0.1, col);
}

// a wolf's head, face on, made of smoke: the vertices waver, the jaw breathes, the eyes burn
function drawSmokeWolf(g, cx, cy, size, now, a) {
  if (a <= 0.01) return;
  const P = [[0, -0.42], [0.35, -0.5], [0.75, -1.0], [0.9, -0.3], [1.08, 0.12], [0.86, 0.42], [0.56, 0.6], [0.26, 0.98], [-0.26, 0.98], [-0.56, 0.6], [-0.86, 0.42], [-1.08, 0.12], [-0.9, -0.3], [-0.75, -1.0], [-0.35, -0.5]];
  const jaw = Math.max(0, Math.sin(now / 900)) * 0.08;
  const pt = ([px, py], i, k) => [cx + (px + Math.sin(now / 260 + i * 1.7 + k) * 0.035) * size, cy + (py + (py > 0.5 ? jaw : 0) + Math.cos(now / 310 + i + k) * 0.03) * size];
  g.save();
  for (let k = 0; k < 4; k++) { // layered smoke, outer to inner
    const grow = 1 + (3 - k) * 0.06;
    g.fillStyle = `rgba(${60 + k * 14},${56 + k * 14},${66 + k * 14},${a * (0.14 + k * 0.06)})`;
    g.beginPath(); P.forEach((p, i) => { const [x, y] = pt([p[0] * grow, p[1] * grow], i, k); g[i ? 'lineTo' : 'moveTo'](x, y); }); g.closePath(); g.fill();
  }
  // the ruff: smoke tearing off the cheeks
  for (let i = 0; i < 10; i++) { const side = i % 2 ? 1 : -1, p = (now / 1800 + i * 0.13) % 1;
    g.fillStyle = `rgba(150,150,160,${a * 0.25 * (1 - p)})`; g.beginPath();
    g.ellipse(cx + side * (0.95 + p * 0.5) * size, cy + (0.1 + (i % 5) * 0.1 - p * 0.6) * size, 10 + p * 18, 5 + p * 6, 0, 0, 7); g.fill(); }
  // the bridge of the snout and the dark of the mouth
  g.fillStyle = `rgba(170,170,180,${a * 0.18})`; g.beginPath(); g.moveTo(cx, cy - 0.34 * size); g.lineTo(cx + 0.2 * size, cy + 0.68 * size); g.lineTo(cx - 0.2 * size, cy + 0.68 * size); g.fill();
  g.fillStyle = `rgba(10,4,6,${a * 0.8})`; g.beginPath(); g.ellipse(cx, cy + (0.82 + jaw) * size, 0.2 * size, (0.06 + jaw) * size, 0, 0, 7); g.fill();
  rect(g, cx - 0.1 * size, cy + 0.66 * size, 0.2 * size, 0.07 * size, `rgba(20,16,20,${a})`); // nose
  // eyes: slanted coals
  for (const side of [-1, 1]) {
    const ex = cx + side * 0.36 * size, ey = cy + 0.02 * size;
    g.fillStyle = `rgba(255,200,80,${a})`; g.beginPath(); g.moveTo(ex - side * 0.16 * size, ey - 0.06 * size); g.lineTo(ex + side * 0.14 * size, ey + 0.02 * size); g.lineTo(ex - side * 0.1 * size, ey + 0.07 * size); g.fill();
    rect(g, ex - 2, ey - 1, 4, 3, `rgba(255,250,220,${a})`);
  }
  g.restore();
}

addPlace('wolfwood', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(127);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // a red-black sky, a few stars, and the moon gone the color of rust
    for (let y = 0; y < 210; y++) r(0, y, NW, 1, lerpColor('#0a0408', '#3a1014', Math.pow(y / 210, 1.4)));
    for (let i = 0; i < 70; i++) r(R() * NW, R() * 120, 1, 1, R() < 0.3 ? '#e8c8c0' : '#8a5a5a');
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(200,60,40,${0.04 + i * 0.02})`; g.beginPath(); g.arc(470, 70, 64 - i * 8, 0, 7); g.fill(); }
    g.fillStyle = '#b8402e'; g.beginPath(); g.arc(470, 70, 30, 0, 7); g.fill();
    for (const [x, y, rr] of [[460, 60, 7], [482, 78, 6], [466, 86, 4], [486, 58, 3], [454, 76, 3]]) { g.fillStyle = '#962e22'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    for (let i = 0; i < 4; i++) { const y = 56 + i * 12, x = 410 + R() * 60; r(x, y, 70 + R() * 50, 2, 'rgba(20,6,10,0.7)'); }
    // three rows of pines, the far ones lit faintly red
    for (let x = -10; x < NW + 20; x += 14) pine(g, x + R() * 8, 214, 70 + R() * 50, '#2a0e12', R);
    for (let x = -10; x < NW + 20; x += 22) pine(g, x + R() * 10, 232, 110 + R() * 60, '#1a080a', R);
    for (let x = -20; x < NW + 30; x += 34) { if (x > 220 && x < 420) continue; pine(g, x + R() * 12, 258, 170 + R() * 70, '#0e0406', R); }
    // the clearing: trodden earth, needles, roots, a low mist line
    for (let y = 214; y < NH; y++) r(0, y, NW, 1, lerpColor('#1a0e0c', '#2e1e16', (y - 214) / 146));
    for (let i = 0; i < 500; i++) { const y = 216 + R() * 144; r(R() * NW, y, 2 + R() * 3, 1, R() < 0.5 ? '#3a2618' : '#140a08'); }
    for (let i = 0; i < 16; i++) { const x = R() * NW, y = 250 + R() * 100; g.strokeStyle = '#120806'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 20, y - 8, x + 40 + R() * 30, y + 4); g.stroke(); }
    // a scorched ring burnt into the ground round the fire
    g.fillStyle = '#0e0606'; g.beginPath(); g.ellipse(320, 262, 70, 16, 0, 0, 7); g.fill();
    g.fillStyle = '#1a0c08'; g.beginPath(); g.ellipse(320, 262, 54, 11, 0, 0, 7); g.fill();
    // the standing stones, each with a skull on top and a wolf scratched into its face
    const stone = (x, y, w, h) => {
      r(x, y - h, w, h, '#4a4448'); r(x, y - h, 3, h, '#5e5860'); r(x + w - 3, y - h, 3, h, '#2e282c'); r(x + 2, y - h - 3, w - 4, 3, '#4a4448');
      for (let i = 0; i < 6; i++) r(x + 4 + R() * (w - 8), y - h + 6 + R() * (h - 10), 2 + R() * 3, 1, '#3a3438');
      const wx = x + w / 2, wy = y - h * 0.5; // the scratched wolf: ears, head, a long snout
      g.strokeStyle = '#8a3a30'; g.lineWidth = 1; g.beginPath(); g.moveTo(wx - 4, wy - 6); g.lineTo(wx - 3, wy - 1); g.lineTo(wx, wy + 6); g.lineTo(wx + 3, wy - 1); g.lineTo(wx + 4, wy - 6); g.lineTo(wx + 1, wy - 2); g.lineTo(wx - 1, wy - 2); g.closePath(); g.stroke();
      // a deer skull: the braincase, the long face, the antlers
      const sx = wx, sy = y - h - 4;
      r(sx - 4, sy - 4, 8, 5, '#d8d0c0'); r(sx - 2, sy + 1, 4, 6, '#c8c0b0'); r(sx - 3, sy - 2, 2, 2, '#1a1010'); r(sx + 1, sy - 2, 2, 2, '#1a1010');
      g.strokeStyle = '#c8c0b0'; g.lineWidth = 1; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sx + sd * 3, sy - 4); g.lineTo(sx + sd * 9, sy - 14); g.lineTo(sx + sd * 12, sy - 22); g.moveTo(sx + sd * 7, sy - 11); g.lineTo(sx + sd * 13, sy - 13); g.moveTo(sx + sd * 10, sy - 18); g.lineTo(sx + sd * 6, sy - 24); g.stroke(); }
    };
    for (const [x, y, w, h] of [[118, 238, 22, 50], [196, 228, 18, 40], [420, 228, 18, 42], [496, 238, 22, 54], [44, 258, 28, 66], [576, 256, 28, 70]]) stone(x, y, w, h);
    // the carved post on the left: a wolf's head on top, pelts and ribbons hanging, a red handprint
    r(84, 92, 16, 170, '#2a1a12'); r(84, 92, 4, 170, '#3a2618'); r(97, 92, 3, 170, '#160c08');
    g.fillStyle = '#2a1a12'; g.beginPath(); g.moveTo(78, 100); g.lineTo(82, 74); g.lineTo(88, 88); g.lineTo(96, 88); g.lineTo(102, 74); g.lineTo(106, 100); g.lineTo(98, 118); g.lineTo(86, 118); g.closePath(); g.fill();
    r(87, 98, 3, 2, '#c84a30'); r(95, 98, 3, 2, '#c84a30'); r(89, 110, 6, 2, '#120806');
    for (const [y, col, h] of [[128, '#5a5458', 40], [150, '#7a6a5a', 32]]) { r(76, y, 32, 3, '#120806'); g.fillStyle = col; g.beginPath(); g.moveTo(76, y + 2); g.lineTo(108, y + 2); g.lineTo(104, y + h); g.lineTo(98, y + h - 6); g.lineTo(92, y + h + 2); g.lineTo(84, y + h - 4); g.lineTo(78, y + h); g.fill(); }
    r(88, 196, 8, 9, '#8a1a1a'); r(86, 194, 2, 4, '#8a1a1a'); r(90, 192, 1, 3, '#8a1a1a'); r(93, 192, 1, 3, '#8a1a1a'); r(96, 194, 2, 4, '#8a1a1a');
    // the stake on the right, where they'll tie whoever the book asks for
    r(508, 168, 12, 112, '#2a1a12'); r(508, 168, 3, 112, '#3a2618'); g.fillStyle = '#2a1a12'; g.beginPath(); g.moveTo(508, 168); g.lineTo(514, 154); g.lineTo(520, 168); g.fill();
    for (const y of [210, 236]) { r(504, y, 20, 3, '#a89060'); r(504, y + 3, 20, 1, '#6a5a3a'); }
    // big trunks framing the shot, with a pelt hung from a low branch on each
    for (const [x, w] of [[-6, 34], [612, 34]]) { r(x, 0, w, NH, '#0a0404'); r(x + (x < 0 ? w - 4 : 0), 0, 4, NH, '#1a0c0a'); }
    g.strokeStyle = '#0a0404'; g.lineWidth = 8; g.beginPath(); g.moveTo(28, 60); g.quadraticCurveTo(100, 40, 170, 56); g.moveTo(612, 50); g.quadraticCurveTo(540, 30, 470, 48); g.stroke();
    return c;
  },
  // bone chimes and pelts on the branches: x, y on the branch, string length
  chimes: [[56, 54, 30], [120, 48, 44], [158, 54, 24], [596, 46, 34], [530, 36, 50], [486, 44, 28]],
  eyes: [[160, 196], [236, 186], [402, 192], [460, 200], [560, 210], [24, 230], [200, 206], [600, 236]],
  candles: [[276, 262], [362, 262], [252, 250], [388, 250], [150, 244], [470, 244]],
  animate(g, now) {
    WOLFWOOD._d += (WOLFWOOD.demon - WOLFWOOD._d) * 0.03;
    // mist creeping round the stones
    for (let i = 0; i < 12; i++) { const x = ((now / (60 + i * 7)) + i * 90) % 760 - 60, y = 236 + (i * 13) % 50;
      g.fillStyle = 'rgba(160,140,150,0.06)'; g.beginPath(); g.ellipse(x, y, 60 + (i % 3) * 20, 7, 0, 0, 7); g.fill(); }
    // eyes in the trees: pairs that open, hold, and close
    this.eyes.forEach(([x, y], i) => { const p = (now / 3000 + i * 0.29) % 1; if (p < 0.55) {
      const h = p < 0.05 || p > 0.5 ? 1 : 2; rect(g, x, y, 2, h, '#e8c040'); rect(g, x + 5, y, 2, h, '#e8c040'); } });
    // the bone chimes, swinging and knocking
    this.chimes.forEach(([x, y, len], i) => {
      const sw = Math.sin(now / (700 + i * 90) + i) * 4, ex = x + sw, ey = y + len;
      g.strokeStyle = '#3a2a1a'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(ex, ey); g.stroke();
      if (i % 3 === 1) { rect(g, ex - 6, ey, 12, 2, '#c8c0b0'); for (let k = 0; k < 4; k++) rect(g, ex - 5 + k * 3 + Math.sin(now / 200 + k) * 1, ey + 2, 1, 8 + (k % 2) * 4, '#d8d0c0'); }
      else { rect(g, ex - 4, ey, 8, 5, '#d8d0c0'); rect(g, ex - 2, ey + 5, 4, 7, '#c8c0b0'); rect(g, ex - 3, ey + 1, 2, 2, '#1a1010'); rect(g, ex + 1, ey + 1, 2, 2, '#1a1010'); }
    });
    // black candles round the rock and the stones
    for (const [x, y] of this.candles) { rect(g, x, y - 8, 4, 10, '#141014'); const f = Math.sin(now / 80 + x) > 0; rect(g, x + 1, y - 12 + (f ? 0 : 1), 2, 4, f ? '#ffd070' : '#ff9a40'); }
    // the bonfire: a stack of split logs and flames taller than a man
    const fx = 320, fy = 262;
    for (const [dx, a] of [[-26, -0.5], [26, 0.5], [-10, -0.2], [12, 0.25]]) { g.save(); g.translate(fx + dx * 0.3, fy); g.rotate(a); rect(g, -4, -34, 8, 40, '#2a1a10'); rect(g, -4, -34, 2, 40, '#4a2e18'); g.restore(); }
    const tongue = (x, w, h, sway, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - w, fy); g.quadraticCurveTo(x - w * 0.6, fy - h * 0.5, x + sway, fy - h); g.quadraticCurveTo(x + w * 0.6, fy - h * 0.5, x + w, fy); g.fill(); };
    for (let i = 0; i < 9; i++) {
      const x = fx - 32 + i * 8, h = (50 + Math.abs(Math.sin(now / (110 + i * 17) + i * 1.3)) * 60) * (1 - Math.abs(i - 4) / 7), sw = Math.sin(now / 150 + i) * 6;
      tongue(x, 12, h, sw, '#c83a14'); tongue(x, 8, h * 0.75, sw * 0.8, '#f07a20'); tongue(x, 5, h * 0.48, sw * 0.6, '#f8c050'); tongue(x, 2, h * 0.22, sw * 0.4, '#fff4c0');
    }
    // the flat rock in front of the fire, with the Psalter open on it, black against the flames
    rect(g, 270, 262, 100, 18, '#4a4448'); rect(g, 270, 262, 100, 3, '#6e6870'); rect(g, 274, 278, 92, 8, '#241e22');
    rect(g, 304, 254, 32, 9, '#8a8a90'); rect(g, 304, 254, 15, 9, '#9a9aa0'); rect(g, 319, 254, 2, 9, '#5a5a60');
    rect(g, 306, 252, 13, 3, '#e8dcc0'); rect(g, 321, 252, 13, 3, '#e0d4b8'); rect(g, 308, 253, 9, 1, '#6a2a2a'); rect(g, 323, 253, 9, 1, '#6a2a2a');
    rect(g, 290, 258, 7, 4, '#3a1a1a'); rect(g, 344, 258, 7, 4, '#3a1a1a');
    for (let i = 0; i < 18; i++) { const p = (now / 1700 + i * 0.057) % 1; rect(g, fx - 20 + Math.sin(now / 260 + i * 2) * (14 + p * 30) + i * 2, fy - 60 - p * 170, p < 0.5 ? 2 : 1, p < 0.5 ? 2 : 1, `rgba(255,${180 - p * 100},80,${1 - p})`); }
    // smoke climbing out of the fire, and in it, when the book is fed, the wolf
    for (let i = 0; i < 8; i++) { const p = (now / 3200 + i / 8) % 1; g.fillStyle = `rgba(60,50,56,${0.18 * (1 - p)})`; g.beginPath();
      g.ellipse(fx + Math.sin(p * 5 + i) * 20, fy - 100 - p * 120, 16 + p * 40, 10 + p * 18, 0, 0, 7); g.fill(); }
    drawSmokeWolf(g, 320, 104, 92, now, WOLFWOOD._d);
  },
  light(g, now) {
    const fl = 0.34 + Math.sin(now / 70) * 0.04 + Math.sin(now / 31) * 0.03;
    glow(g, 320, 220, 10, 300, '255,110,40', fl);
    glow(g, 470, 70, 20, 160, '220,60,40', 0.1);
    for (const [x, y] of this.candles) glow(g, x + 2, y - 10, 1, 24, '255,180,90', 0.12);
    if (WOLFWOOD._d > 0.05) { glow(g, 284, 106, 1, 26, '255,190,80', 0.35 * WOLFWOOD._d); glow(g, 356, 106, 1, 26, '255,190,80', 0.35 * WOLFWOOD._d); }
  },
  vignette: 0.6
}, 1.5);
