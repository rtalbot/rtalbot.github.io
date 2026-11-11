// Pawn Champ - the boardwalk carousel in winter, at night. M28 The Brass Ring (batch G,
// docs/quests/MAJOR.md#m28-the-brass-ring). The carousel at the end of the boardwalk, past Neptune's
// Arcade: a striped canopy with a scalloped valance of bulbs, a mirrored center drum, the ring arm on
// its post, the sea and the stopped Ferris wheel behind, snow on the planks and still falling.
//   CAROUSEL.tarp    = true: a canvas tarp roped over it for the winter (the default)
//   CAROUSEL.lit     = true: every bulb on. With it off, a few bulbs come on by themselves, one at a time
//   CAROUSEL.turning = true: the horses go round and rise and fall
//   CAROUSEL.horses  = how many of the 24 horses are on their poles (default 1: the rest were sold off)
//   CAROUSEL.riders  = true: pale children on the horses, from every decade it ran
'use strict';

const CAROUSEL = { tarp: true, lit: false, turning: false, horses: 1, riders: false };
const CAROUSEL_CX = 330, CAROUSEL_TOP = 64, CAROUSEL_RX = 190;

// one horse, side on, galloping left or right; `lift` raises it on its pole
function carouselHorse(g, x, y, col, mane, facing, alpha) {
  const r = (a, b, w, h, c) => rect(g, facing > 0 ? a : 2 * x - a - w, b, w, h, c);
  g.save(); g.globalAlpha = alpha;
  r(x - 15, y, 30, 12, col); r(x - 13, y - 2, 26, 2, col); r(x - 15, y + 12, 30, 2, shade(col, -0.25)); // body
  r(x + 12, y - 12, 8, 16, col); r(x + 16, y - 16, 12, 8, col); r(x + 26, y - 13, 3, 4, shade(col, -0.2)); // neck, head, nose
  r(x + 18, y - 19, 3, 4, col); r(x + 22, y - 14, 2, 2, '#1a1410'); // ear, eye
  for (let i = 0; i < 5; i++) r(x + 10 - i, y - 14 + i * 3, 4, 3, mane); // mane
  r(x - 20, y + 2, 6, 3, mane); r(x - 22, y + 4, 4, 8, mane); // tail
  r(x - 7, y + 2, 12, 6, '#c83a3a'); r(x - 7, y + 2, 12, 1, '#e8c050'); r(x - 2, y + 8, 2, 6, '#e8c050'); // saddle and stirrup
  r(x + 8, y + 12, 4, 10, col); r(x + 12, y + 18, 8, 3, col); r(x + 18, y + 18, 3, 3, '#3a3a3a'); // front legs, tucked
  r(x - 14, y + 12, 4, 8, col); r(x - 18, y + 18, 6, 3, col); r(x - 22, y + 18, 3, 3, '#3a3a3a'); // back legs, kicked
  g.restore();
}

addPlace('carousel', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(461);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // sky, a few stars between the clouds, the sea, and the far headland
    for (let y = 0; y < 170; y++) r(0, y, NW, 1, lerpColor('#070a18', '#1e2440', y / 170));
    for (let i = 0; i < 40; i++) r(R() * NW, R() * 110, 1, 1, R() < 0.3 ? '#c8d0f0' : '#6a7090');
    for (let i = 0; i < 6; i++) { const x = R() * NW, y = 20 + R() * 60; g.fillStyle = 'rgba(40,46,70,0.7)'; g.beginPath(); g.ellipse(x, y, 60 + R() * 50, 8 + R() * 5, 0, 0, 7); g.fill(); }
    r(0, 150, NW, 30, '#141c30'); for (let i = 0; i < 30; i++) r(R() * NW, 154 + R() * 22, 6 + R() * 10, 1, '#2a3a58');
    r(0, 146, 120, 6, '#0e121e'); r(0, 142, 60, 4, '#0e121e');
    // the stopped Ferris wheel on the right, and the arcade's dark end wall on the left
    g.strokeStyle = '#2a2e44'; g.lineWidth = 2; g.beginPath(); g.arc(580, 96, 56, 0, 7); g.stroke();
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.beginPath(); g.moveTo(580, 96); g.lineTo(580 + Math.cos(a) * 56, 96 + Math.sin(a) * 56); g.stroke(); r(576 + Math.cos(a) * 56, 94 + Math.sin(a) * 56, 9, 8, '#22263a'); }
    g.beginPath(); g.moveTo(580, 96); g.lineTo(552, 180); g.moveTo(580, 96); g.lineTo(608, 180); g.stroke();
    r(0, 60, 70, 190, '#1a1824'); r(0, 54, 74, 8, '#e8ecf4'); r(6, 80, 52, 30, '#22202e'); pixText(g, 'NEPTUNE', 8, 70, '#4a3a5a', 1);
    // the railing and the boardwalk: planks running away from us, snow drifted against the rail
    r(0, 178, NW, 4, '#3a3036'); for (let x = 0; x < NW; x += 22) r(x, 178, 3, 22, '#3a3036'); r(0, 176, NW, 2, '#e8ecf4');
    for (let y = 196; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4048', '#6a5a5a', (y - 196) / 164));
    for (let y = 200; y < NH; y += 6 + (y - 196) / 14) r(0, y, NW, 1, '#3a3036');
    for (let i = 0; i < 90; i++) { const x = R() * NW, y = 200 + R() * 160; r(x, y, 10 + R() * 30, 2 + R() * 2, R() < 0.7 ? '#e8ecf4' : '#c8d0dc'); }
    for (let x = 0; x < NW; x += 4) r(x, 192 - Math.abs(Math.sin(x / 30)) * 6, 4, 10, '#e8ecf4');
    // the carousel's platform: a round deck on a skirt of painted panels
    const cx = CAROUSEL_CX, rx = CAROUSEL_RX;
    g.fillStyle = '#5a3a2a'; g.beginPath(); g.ellipse(cx, 262, rx, 26, 0, 0, 7); g.fill();
    g.fillStyle = '#7a5a3a'; g.beginPath(); g.ellipse(cx, 256, rx, 24, 0, 0, 7); g.fill();
    for (let i = 0; i < 16; i++) { const x = cx - rx + 10 + i * 23; r(x, 262, 20, 16, i % 2 ? '#c83a3a' : '#e8c050'); r(x + 4, 266, 12, 8, i % 2 ? '#e8c050' : '#c83a3a'); }
    g.fillStyle = 'rgba(240,244,250,0.85)'; g.beginPath(); g.ellipse(cx, 252, rx - 30, 12, 0, 0, Math.PI); g.fill(); // snow on the deck
    // the center drum: mirrors and painted panels
    r(cx - 34, CAROUSEL_TOP + 50, 68, 140, '#3a2a4a');
    for (let i = 0; i < 4; i++) { r(cx - 30 + i * 16, CAROUSEL_TOP + 60, 12, 60, '#8a9ab0'); r(cx - 29 + i * 16, CAROUSEL_TOP + 62, 4, 50, '#c8d4e8'); r(cx - 30 + i * 16, CAROUSEL_TOP + 128, 12, 50, i % 2 ? '#e8c050' : '#3a7a8a'); }
    // the ring arm on its post, with the brass ring still in the chute
    r(574, 150, 6, 110, '#4a4a52'); r(520, 150, 60, 5, '#4a4a52'); r(516, 148, 10, 14, '#6a6a72'); r(519, 160, 5, 5, '#e8c050');
    return c;
  },
  animate(g, now) {
    const cx = CAROUSEL_CX, top = CAROUSEL_TOP;
    // poles and horses: 8 places round the front half; how many are filled is CAROUSEL.horses (of 24)
    const spin = CAROUSEL.turning ? now / 4000 : 0.07;
    const filled = Math.max(0, Math.min(24, CAROUSEL.horses | 0));
    const cols = ['#e8e4dc', '#8a8a92', '#c8843a', '#3a2a24', '#e8d8b0', '#a85a3a'];
    const slots = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24 + spin) % 1 * Math.PI * 2, front = Math.sin(a);
      if (front < -0.15) continue; // the far side is behind the drum
      slots.push({ i, x: cx + Math.cos(a) * (CAROUSEL_RX - 26), depth: front, a });
    }
    slots.sort((p, q) => p.depth - q.depth);
    for (const s of slots) {
      const y = 190 + s.depth * 34, lift = CAROUSEL.turning ? Math.sin(now / 500 + s.i * 1.3) * 8 : (s.i % 3) * 4;
      rect(g, s.x - 1, top + 54, 3, y - top - 30, '#e8c050'); rect(g, s.x, top + 54, 1, y - top - 30, '#fff0b0');
      const has = s.i < filled;
      if (has) {
        const ghost = CAROUSEL.riders ? 0.95 : 1;
        carouselHorse(g, s.x, y - 26 - lift, cols[s.i % cols.length], s.i % 2 ? '#3a2a24' : '#e8e0c8', Math.cos(s.a) < 0 ? 1 : -1, ghost);
        if (CAROUSEL.riders && s.depth > 0.2) { // a pale child on the saddle, from some year it ran
          g.save(); g.globalAlpha = 0.45 + Math.sin(now / 900 + s.i) * 0.1;
          rect(g, s.x - 5, y - 52 - lift, 10, 14, '#c8dcf0'); rect(g, s.x - 4, y - 62 - lift, 8, 9, '#dfefff'); rect(g, s.x - 3, y - 38 - lift, 3, 8, '#a8c0e0');
          g.restore();
        }
      } else rect(g, s.x - 5, y - 6, 11, 2, '#2a2a30'); // an empty pole's foot-plate
    }
    // the canopy: a striped cone, the valance with its bulbs
    for (let k = 0; k < 18; k++) {
      const x0 = cx - CAROUSEL_RX + k * (CAROUSEL_RX * 2 / 18);
      g.fillStyle = k % 2 ? '#c83a3a' : '#f0e8d4';
      g.beginPath(); g.moveTo(cx, top - 26); g.lineTo(x0, top + 40); g.lineTo(x0 + CAROUSEL_RX * 2 / 18, top + 40); g.closePath(); g.fill();
    }
    rect(g, cx - 4, top - 40, 8, 16, '#e8c050'); rect(g, cx - 8, top - 44, 16, 5, '#c83a3a');
    rect(g, cx - CAROUSEL_RX, top + 40, CAROUSEL_RX * 2, 14, '#e8c050'); rect(g, cx - CAROUSEL_RX, top + 40, CAROUSEL_RX * 2, 2, '#fff0b0');
    for (let i = 0; i < 19; i++) { g.fillStyle = '#c83a3a'; g.beginPath(); g.arc(cx - CAROUSEL_RX + 10 + i * 20, top + 54, 10, 0, Math.PI); g.fill(); }
    for (let i = 0; i < 38; i++) {
      const x = cx - CAROUSEL_RX + 5 + i * 10, y = top + 46;
      const on = CAROUSEL.lit ? (Math.sin(now / 300 + i) > -0.8) : (((now / 1400 | 0) * 7 + i * 13) % 38 < 3); // unlit: a few come on by themselves
      rect(g, x, y, 3, 3, on ? '#fff4c0' : '#6a5a3a');
    }
    // the tarp: gray-green canvas roped down over the canopy, snow lying on it
    if (CAROUSEL.tarp) {
      g.fillStyle = '#4a5a4a'; g.beginPath(); g.moveTo(cx, top - 30); g.lineTo(cx - CAROUSEL_RX - 10, top + 50);
      for (let i = 0; i <= 10; i++) g.lineTo(cx - CAROUSEL_RX - 10 + i * (CAROUSEL_RX * 2 + 20) / 10, top + 62 + (i % 2) * 10);
      g.lineTo(cx + CAROUSEL_RX + 10, top + 50); g.closePath(); g.fill();
      g.fillStyle = '#e8ecf4'; g.beginPath(); g.moveTo(cx, top - 30); g.lineTo(cx - CAROUSEL_RX + 20, top + 36); g.lineTo(cx + CAROUSEL_RX - 20, top + 36); g.closePath(); g.fill();
      for (const x of [cx - 150, cx - 60, cx + 60, cx + 150]) rect(g, x, top + 60, 1, 140, '#c8b890'); // ropes
    }
    // snow falling, steadily, slanting a little
    for (let i = 0; i < 70; i++) { const x = (i * 97 + now / 30 + Math.sin(now / 900 + i) * 8) % NW, y = (i * 53 + now / 22) % NH; rect(g, x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, '#ffffff'); }
  },
  light(g, now) {
    if (CAROUSEL.lit) { glow(g, CAROUSEL_CX, CAROUSEL_TOP + 60, 30, 300, '255,220,150', 0.3 + Math.sin(now / 400) * 0.02); glow(g, CAROUSEL_CX, 240, 20, 220, '255,200,120', 0.16); }
    else glow(g, CAROUSEL_CX + Math.sin(now / 2100) * 120, CAROUSEL_TOP + 48, 2, 40, '255,240,190', 0.18);
    if (CAROUSEL.riders) glow(g, CAROUSEL_CX, 200, 10, 260, '170,210,255', 0.1);
    glow(g, 522, 162, 2, 24, '255,220,120', 0.2); // the ring in its chute
  },
  vignette: 0.55,
  music: 'winter'
}, 1.5);
