// Pawn Champ - Main Street in miniature: Cornelius Webb's 1952 scale model, seen at model height by
// flashlight in your back room. M26 Main Street in Miniature (pitched, PR #35).
// A row of clapboard model shopfronts at 1:48, the paint and glue seams showing, the tiny Crooked
// Scale with tiny goods in its window, model street lamps and a model car. Past the edge of the
// table the real back room looms, out of focus, with boxes the size of buildings; a giant hand rests
// at the edge of the frame. Three things disagree with the real 1952 street: a bricked-up door, a sign
// with a different name, and a small figure at an upstairs window.
//   MINIATURE.hand = false hides the hand; MINIATURE.torch = [x, y] moves the flashlight's spot.
'use strict';

const MINIATURE = { hand: true, torch: [320, 200] };

addPlace('miniature', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(231);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // the real back room, huge and blurred: shelving, a box the size of a building, a hanging bulb
    r(0, 0, NW, 200, '#2a221c');
    for (let i = 0; i < 4; i++) r(0, 20 + i * 50, NW, 8, '#3a3028');
    r(470, 10, 170, 190, '#5a4632'); r(470, 10, 170, 6, '#6a5642'); r(540, 10, 14, 190, '#4a3a2a'); // a cardboard box, enormous
    g.fillStyle = 'rgba(42,34,28,0.5)'; g.fillRect(0, 0, NW, 200); // out of focus
    // the buildings: model clapboard fronts at model height
    const front = (x, w, h, col, sign, signCol) => {
      const y = 214 - h; r(x, y, w, h, col);
      for (let k = y + 4; k < 214; k += 5) r(x, k, w, 1, shade(col, -0.08));
      r(x - 3, y - 6, w + 6, 8, shade(col, -0.25)); r(x, y - 1, w, 1, 'rgba(255,255,255,0.3)'); // cornice, a glue seam
      for (let i = 0; i < Math.floor(w / 34); i++) { r(x + 8 + i * 34, y + 12, 20, 26, '#1a2030'); r(x + 8 + i * 34, y + 12, 20, 2, '#e8e0c8'); r(x + 17 + i * 34, y + 12, 2, 26, '#e8e0c8'); }
      r(x + 6, 214 - 64, w - 12, 18, '#2a2a2a'); pixText(g, sign, x + w / 2 - textWidth(sign, 1.5) / 2, 214 - 59, signCol, 1.5);
      r(x + 10, 214 - 42, w - 50, 32, '#2a3a4a'); r(x + 10, 214 - 42, w - 50, 2, '#e8e0c8'); r(x + w - 34, 214 - 44, 22, 44, shade(col, -0.3));
      return y; };
    front(0, 116, 150, '#c8a878', 'HARDWARE', '#e8e0c8');
    const ys = front(124, 140, 166, '#5a7a8a', 'CROOKED SCALE', '#e8c050');
    for (let i = 0; i < 8; i++) r(140 + (i % 4) * 16, 180 + Math.floor(i / 4) * 10, 8, 6, ['#e8c050', '#c8ccd0', '#a83a3a', '#3a6aa0'][i % 4]); // tiny goods in the window
    front(272, 120, 140, '#a84a3a', 'MERRILLS', '#f4e8c8'); // the sign that should say something else
    front(400, 130, 158, '#e8e4d8', 'SHIPLEYS', '#2a5a8a');
    r(546, 120, 94, 94, '#7a7a6a'); r(546, 114, 94, 8, '#5a5a4a'); for (let y = 122; y < 214; y += 6) for (let x = 546 + ((y / 6) % 2) * 6; x < 640; x += 12) r(x, y, 11, 5, '#8a5a3a'); // the alley, brick
    r(574, 160, 30, 54, '#8a5a3a'); for (let y = 162; y < 214; y += 6) for (let x = 574 + ((y / 6) % 2) * 5; x < 604; x += 10) r(x, y, 9, 5, '#9a6a4a'); r(572, 158, 34, 3, '#5a5a4a'); // the bricked-up door
    void ys;
    // the street and pavement: painted card, a crack in the paint, a model car, model lamps
    r(0, 214, NW, 14, '#a8a090'); r(0, 214, NW, 2, '#c8c0b0'); for (let x = 0; x < NW; x += 30) r(x, 216, 1, 12, '#8a8478');
    for (let y = 228; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4a50', '#3a3a40', (y - 228) / 132));
    for (let x = 10; x < NW; x += 60) r(x, 290, 30, 4, '#e8d870');
    g.strokeStyle = '#2a2a2e'; g.lineWidth = 1; g.beginPath(); g.moveTo(200, 230); g.lineTo(230, 260); g.lineTo(226, 300); g.stroke();
    r(420, 240, 90, 30, '#3a6a8a'); r(436, 226, 54, 18, '#3a6a8a'); r(440, 230, 20, 12, '#a8c8d8'); r(464, 230, 20, 12, '#a8c8d8'); g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(440, 270, 9, 0, 7); g.arc(492, 270, 9, 0, 7); g.fill();
    for (const x of [100, 360, 600]) { r(x, 140, 4, 76, '#2a2a2a'); r(x - 6, 134, 16, 8, '#2a2a2a'); }
    // the table edge in the foreground: a slab of plywood, a ruler, a tube of glue
    r(0, 336, NW, 24, '#a8844a'); r(0, 336, NW, 3, '#c8a46a'); for (let i = 0; i < 8; i++) r(R() * NW, 340 + R() * 16, 30 + R() * 40, 1, '#8a6a3a');
    r(60, 326, 220, 12, '#e8d870'); for (let i = 0; i < 22; i++) r(64 + i * 10, 326, 1, i % 5 ? 4 : 8, '#2a2a2a');
    return c;
  },
  animate(g, now) {
    // the lamps are lit, which they shouldn't be: there are no bulbs in them
    for (const x of [100, 360, 600]) rect(g, x - 3, 141, 10, 3, '#fff0b0');
    // the figure at the upstairs window of MERRILLS: there, and then not
    const p = (now % 7000) / 7000; if (p > 0.15 && p < 0.75) { rect(g, 290, 132 + 4, 6, 10, '#2a2a2a'); rect(g, 291, 129 + 4, 4, 4, '#d8b8a0'); }
    // the giant hand at the right edge, resting, a finger tapping
    if (MINIATURE.hand) { const tap = Math.max(0, Math.sin(now / 400)) * 6;
      g.fillStyle = '#e0b898'; g.beginPath(); g.ellipse(660, 300, 70, 46, -0.3, 0, 7); g.fill();
      for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(600 - i * 6, 250 + i * 20 - (i === 1 ? tap : 0), 34, 9, -0.15, 0, 7); g.fill(); }
      g.fillStyle = '#c8987a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(572 - i * 6, 252 + i * 20 - (i === 1 ? tap : 0), 6, 5, 0, 0, 7); g.fill(); } }
    // dust drifting through the torch beam, which wavers a little in a real hand
    const [tx, ty] = MINIATURE.torch, wx = tx + Math.sin(now / 900) * 6, wy = ty + Math.cos(now / 1100) * 4;
    for (let i = 0; i < 16; i++) { const q = (now / 7000 + i * 0.07) % 1; rect(g, wx - 60 + i * 8 + Math.sin(now / 1000 + i) * 6, wy - 100 + q * 200, 2, 2, 'rgba(255,240,210,0.35)'); }
    this.spot = [wx, wy];
  },
  light(g) {
    const [x, y] = this.spot || MINIATURE.torch;
    glow(g, x, y, 10, 220, '255,240,200', 0.26);
    for (const lx of [100, 360, 600]) glow(g, lx + 2, 146, 1, 30, '255,230,150', 0.2);
  },
  vignette: 0.75
}, 1.5);
