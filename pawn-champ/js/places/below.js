// Pawn Champ - Below the Arcade. A set-piece scene for M2 The Gentleman in Grey
// (docs/quests/MAJOR.md, docs/ART.md#set-piece-scenes).
// Behind the prize counter at Neptune's Arcade is a door marked STAFF ONLY, and the stairs behind it go
// down a long way further than the boardwalk does. At the bottom, Mr. Quillon keeps his own shop: a
// cavern lit by a river of fire, its far wall cut into shelves of glowing jars, every one with a ticket
// tied on. Mr. Quillon only works here. The shop belongs to the Proprietor: enormous, red and very
// fat, asleep on a throne of strongboxes behind Quillon's little counter, under a plaque that reads
// ALL SALES FINAL.
//
// BELOW.devil = 0..1 wakes the Proprietor (0 asleep and dim, 1 awake: eyes open, grinning, tail going).
// It eases toward the value set, so a scene can set it between lines. BELOW.laugh = true makes his
// belly shake.
'use strict';

const BELOW = { devil: 0, laugh: false, _d: 0, _l: 0 };

// the Proprietor on his throne. (x, y) is the middle of the seat. `awake` 0..1, `laugh` 0..1.
function drawProprietor(g, x, y, now, awake, laugh) {
  const red = '#c8281e', dk = '#8a1810', hi = '#e85a3a', blk = '#1a0606', horn = '#e8dcc0', hornD = '#a89a80';
  const breathe = Math.sin(now / 1200) * 2 + laugh * Math.sin(now / 60) * 3;
  const E = (cx, cy, rx, ry, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.fill(); };
  // the tail, out over the right armrest, swishing more when he's awake
  const ts = Math.sin(now / (awake > 0.5 ? 300 : 1400)) * (6 + awake * 10);
  g.strokeStyle = dk; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 40, y + 6); g.quadraticCurveTo(x + 90, y + 10, x + 76 + ts, y - 40); g.stroke(); g.lineCap = 'butt';
  g.fillStyle = dk; g.beginPath(); g.moveTo(x + 76 + ts, y - 52); g.lineTo(x + 68 + ts, y - 36); g.lineTo(x + 84 + ts, y - 36); g.fill();
  // legs: short fat thighs, shins, hooves on a footstool of ledgers
  for (const sd of [-1, 1]) { E(x + sd * 22, y + 6, 22, 14, red); E(x + sd * 22, y + 2, 16, 6, hi);
    rect(g, x + sd * 26 - 9, y + 12, 18, 22, dk); rect(g, x + sd * 26 - 11, y + 32, 22, 8, blk); rect(g, x + sd * 26 - 1, y + 32, 2, 8, '#3a1a1a'); }
  // the belly, enormous, in a waistcoat that gave up years ago
  E(x, y - 30 + breathe * 0.5, 50, 42 + breathe, red); E(x - 14, y - 44, 22, 18, hi);
  E(x + 12, y - 12 + breathe * 0.5, 36, 24, dk); E(x, y - 30 + breathe * 0.5, 50, 42 + breathe, 'rgba(0,0,0,0)');
  g.fillStyle = '#3a2a4a'; g.beginPath(); g.moveTo(x - 48, y - 46); g.lineTo(x - 34, y - 80); g.lineTo(x - 22, y - 34); g.lineTo(x - 40, y + 2); g.fill(); // waistcoat, left
  g.beginPath(); g.moveTo(x + 48, y - 46); g.lineTo(x + 34, y - 80); g.lineTo(x + 22, y - 34); g.lineTo(x + 40, y + 2); g.fill(); // and right
  for (let i = 0; i < 3; i++) rect(g, x - 26 + (i % 2) * 2, y - 52 + i * 16, 3, 3, '#e8c050'); // buttons that don't reach
  g.strokeStyle = '#e8c050'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 24, y - 30); g.quadraticCurveTo(x - 4, y - 14 + breathe, x + 18, y - 30); g.stroke(); rect(g, x + 16, y - 32, 4, 5, '#e8c050'); // watch chain
  E(x + 2, y - 26 + breathe * 0.5, 2, 3, dk); // belly button
  // shoulders and arms, resting on the armrests
  E(x, y - 82, 44, 20, red); E(x - 10, y - 88, 22, 8, hi);
  for (const sd of [-1, 1]) { E(x + sd * 46, y - 66, 13, 24, red); E(x + sd * 52, y - 34, 11, 16, dk);
    E(x + sd * 52, y - 18, 10, 7, red); for (let k = 0; k < 3; k++) rect(g, x + sd * 52 - 6 + k * 4, y - 14, 2, 5, blk); } // claws on the armrest
  // a small head on a big neck: pointed ears, curling horns, a black goatee, yellow eyes
  const hy = y - 112 + breathe * 0.3, nod = (1 - awake) * 6;
  E(x, hy + 14 + nod, 22, 12, red);
  E(x, hy + nod, 19, 18, red); E(x - 6, hy - 6 + nod, 8, 6, hi);
  for (const sd of [-1, 1]) {
    g.fillStyle = red; g.beginPath(); g.moveTo(x + sd * 16, hy - 2 + nod); g.lineTo(x + sd * 30, hy - 10 + nod); g.lineTo(x + sd * 18, hy + 8 + nod); g.fill(); // ear
    g.fillStyle = horn; g.beginPath(); g.moveTo(x + sd * 8, hy - 14 + nod); g.quadraticCurveTo(x + sd * 30, hy - 22 + nod, x + sd * 30, hy - 44 + nod); g.quadraticCurveTo(x + sd * 22, hy - 26 + nod, x + sd * 14, hy - 8 + nod); g.fill();
    g.strokeStyle = hornD; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x + sd * (12 + k * 4), hy - 14 - k * 6 + nod); g.lineTo(x + sd * (18 + k * 3), hy - 12 - k * 6 + nod); g.stroke(); }
  }
  g.fillStyle = blk; g.beginPath(); g.moveTo(x - 8, hy + 10 + nod); g.lineTo(x + 8, hy + 10 + nod); g.lineTo(x, hy + 28 + nod); g.fill(); // goatee
  rect(g, x - 9, hy - 10 + nod, 7, 2, blk); rect(g, x + 2, hy - 10 + nod, 7, 2, blk); // eyebrows
  if (awake > 0.5 && Math.sin(now / 2300) < 0.97) { rect(g, x - 9, hy - 6 + nod, 6, 4, '#ffd040'); rect(g, x + 3, hy - 6 + nod, 6, 4, '#ffd040'); rect(g, x - 6, hy - 5 + nod, 2, 3, blk); rect(g, x + 5, hy - 5 + nod, 2, 3, blk); }
  else { rect(g, x - 9, hy - 4 + nod, 6, 1, blk); rect(g, x + 3, hy - 4 + nod, 6, 1, blk); } // shut
  if (awake > 0.5) { rect(g, x - 9, hy + 5 + nod, 18, 4 + laugh * 3, blk); for (let k = 0; k < 4; k++) rect(g, x - 8 + k * 5, hy + 5 + nod, 2, 2, horn); } // the grin
  else rect(g, x - 5, hy + 6 + nod, 10, 2, dk);
  if (awake < 0.5) { const p = (now / 2200) % 1; g.globalAlpha = 1 - p; pixText(g, 'Z', x + 24 + p * 14, hy - 20 - p * 24, '#e8c050', 1 + p); g.globalAlpha = 1; } // asleep
}

addPlace('below', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(131);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // the cavern: black overhead, red where the river lights it
    for (let y = 0; y < 260; y++) r(0, y, NW, 1, lerpColor('#0a0202', '#5a1408', Math.pow(y / 260, 1.6)));
    // the far wall, cut into ledges, and on every ledge a row of jars (they glow in animate/light)
    this.jars = [];
    for (let row = 0; row < 11; row++) {
      const y = 46 + row * 14, inset = Math.abs(row - 5) * 6;
      r(60 + inset, y + 10, 520 - inset * 2, 2, '#2a0a06'); r(60 + inset, y + 12, 520 - inset * 2, 1, '#140404');
      for (let x = 64 + inset; x < 576 - inset; x += 7 + (R() * 3 | 0)) { if (R() < 0.12) continue; r(x, y + 3, 4, 7, '#1a2a2e'); r(x + 1, y + 2, 2, 1, '#3a3a3a'); this.jars.push([x, y + 3]); }
    }
    for (let i = 0; i < 30; i++) { const x = 60 + R() * 520, y = 40 + R() * 160; r(x, y, 1, 4 + R() * 10, '#200604'); } // cracks in the rock
    // stalactites and the cavern's mouth framing everything
    for (let x = 0; x < NW; x += 10) { const h = 10 + R() * 40 + (Math.abs(x - 320) > 200 ? 30 : 0); g.fillStyle = '#080101'; g.beginPath(); g.moveTo(x - 4, 0); g.lineTo(x + 6 + R() * 6, 0); g.lineTo(x + 3, h); g.fill(); }
    g.fillStyle = '#080101'; g.beginPath(); g.moveTo(0, 0); g.lineTo(60, 0); g.quadraticCurveTo(30, 120, 50, 250); g.lineTo(0, 250); g.fill();
    g.beginPath(); g.moveTo(NW, 0); g.lineTo(590, 0); g.quadraticCurveTo(620, 100, 600, 180); g.lineTo(NW, 180); g.fill();
    // obsidian spires rising from the river
    for (const [x, h, w] of [[96, 120, 22], [210, 70, 14], [396, 84, 16], [560, 130, 26]]) { g.fillStyle = '#120404'; g.beginPath(); g.moveTo(x - w, 214); g.lineTo(x - 2, 214 - h); g.lineTo(x + 3, 214 - h + 10); g.lineTo(x + w, 214); g.fill();
      g.strokeStyle = '#3a0e08'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2, 214 - h); g.lineTo(x - w * 0.6, 214); g.stroke(); }
    // the river of fire (its flow is drawn live) and its banks
    for (let y = 206; y < 252; y++) r(0, y, NW, 1, lerpColor('#e86a1a', '#a82a0a', Math.abs(y - 226) / 26));
    r(0, 204, NW, 3, '#1a0604'); r(0, 250, NW, 4, '#1a0604');
    // the near ledge: black basalt in broken hexagons, hot cracks between them (lit in animate)
    for (let y = 254; y < NH; y++) r(0, y, NW, 1, lerpColor('#1e0a08', '#2e1410', (y - 254) / 106));
    this.cracks = [];
    for (let row = 0; row < 6; row++) { const y = 262 + row * 18 + row * row * 1.2, hw = 22 + row * 6;
      for (let x = (row % 2) * hw - 10; x < NW + hw; x += hw * 2) { g.strokeStyle = '#0a0202'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x - hw, y); g.lineTo(x - hw / 2, y - 8 - row); g.lineTo(x + hw / 2, y - 8 - row); g.lineTo(x + hw, y); g.lineTo(x + hw / 2, y + 8 + row); g.lineTo(x - hw / 2, y + 8 + row); g.closePath(); g.stroke();
        if (R() < 0.3) this.cracks.push([x - hw / 2, y + 8 + row, hw]); } }
    // the stairs you came down, from the arcade's back door at the top left
    for (let i = 0; i < 14; i++) { const x = 20 + i * 10, y = 70 + i * 13; r(x, y, 34, 5, '#2a1410'); r(x, y, 34, 1, '#4a2418'); r(x, y + 5, 34, 8, '#140806'); }
    r(14, 16, 36, 56, '#0e1420'); r(16, 18, 32, 52, '#2a3a5a'); r(18, 20, 28, 48, '#1a2a4a'); r(40, 44, 3, 4, '#c8c8d0'); // the door, ajar onto blue arcade light
    r(10, 6, 44, 10, '#3a3a3a'); pixText(g, 'STAFF', 16, 8, '#e8e8e8');
    // the Proprietor's throne: a stack of iron strongboxes with a tall spiked back, on a dais
    r(472, 236, 168, 26, '#2a1012'); r(472, 236, 168, 3, '#c8a050'); r(486, 224, 154, 14, '#3a1418'); r(486, 224, 154, 2, '#a8843a');
    r(500, 40, 124, 186, '#1a0c0e'); r(500, 40, 124, 3, '#c8a050'); r(504, 46, 116, 176, '#24121a');
    for (let k = 0; k < 6; k++) { const y = 70 + k * 26; r(508, y, 108, 22, '#2e161c'); r(508, y, 108, 2, '#4a2228'); g.fillStyle = '#8a6a30'; g.beginPath(); g.arc(562, y + 11, 5, 0, 7); g.fill(); r(561, y + 9, 2, 4, '#1a0606'); }
    for (let i = 0; i < 7; i++) { g.fillStyle = '#c8a050'; g.beginPath(); g.moveTo(502 + i * 20, 40); g.lineTo(510 + i * 20, 26 - (i === 3 ? 6 : 0)); g.lineTo(518 + i * 20, 40); g.fill(); }
    r(486, 186, 26, 40, '#2e161c'); r(486, 186, 26, 3, '#c8a050'); r(612, 186, 26, 40, '#2e161c'); r(612, 186, 26, 3, '#c8a050'); // armrests
    r(470, 0, 184, 18, '#120406'); r(470, 16, 184, 2, '#c8a050');
    pixText(g, 'ALL SALES FINAL', 562 - textWidth('ALL SALES FINAL', 1.5) / 2, 5, '#e8a040', 1.5);
    for (let i = 0; i < 3; i++) { r(530 + i * 22, 228 - i * 0, 20, 8, ['#5a1a1a', '#1a2a4a', '#3a3a1a'][i]); r(530 + i * 22, 228, 20, 1, '#e8dcc0'); } // the footstool of ledgers
    // Mr. Quillon's own counter: a narrow lectern beside the throne, the ledger open on it
    r(424, 196, 56, 66, '#1a1012'); r(424, 196, 56, 4, '#c8a050'); r(424, 258, 56, 4, '#8a6a30'); r(434, 208, 36, 40, '#24161a');
    r(420, 186, 64, 12, '#e8dcc0'); r(420, 186, 64, 2, '#f8f0d8'); r(451, 186, 2, 12, '#8a7a60');
    for (let i = 0; i < 3; i++) { r(424, 190 + i * 3, 24, 1, '#6a1a1a'); r(456, 190 + i * 3, 24, 1, '#6a1a1a'); }
    r(399, 150, 2, 46, '#c8a050'); r(390, 192, 20, 4, '#8a6a30'); // the scale's post, on its own stand (the beam swings in animate)
    // a pawn ticket the size of a man, nailed to the rock by the stairs
    r(170, 120, 30, 46, '#d8c8a0'); r(170, 120, 30, 4, '#a01818'); r(184, 116, 2, 4, '#4a4a4a'); r(176, 128, 18, 10, '#1a1a1a'); r(178, 130, 14, 6, '#d8c8a0');
    for (let i = 0; i < 3; i++) r(174, 152 + i * 4, 22, 1, '#8a7a60');
    return c;
  },
  chains: [[236, 0, 90], [290, 0, 60], [356, 0, 110]],
  braziers: [[200, 262], [404, 262]],
  animate(g, now) {
    BELOW._d += (BELOW.devil - BELOW._d) * 0.05; BELOW._l += ((BELOW.laugh ? 1 : 0) - BELOW._l) * 0.1;
    // the jars: each soul flickers in its glass
    (this.jars || []).forEach(([x, y], i) => { if (Math.sin(now / (300 + (i % 7) * 90) + i * 1.9) > 0.2) rect(g, x + 1, y + 2, 2, 4, (i % 11) ? '#7ae0d8' : '#e0f0a0'); });
    // lavafalls pouring off the ledges into the river
    for (const [x, top, w] of [[150, 110, 10], [466, 60, 0], [300, 160, 6]]) { if (!w) continue;
      rect(g, x - 4, top - 4, w + 8, 5, '#1a0604');
      for (let y = top; y < 210; y += 4) { const p = ((y - now / 6) % 24 + 24) % 24; rect(g, x, y, w, 4, p < 12 ? '#f8a030' : '#e8601a'); }
      rect(g, x + w / 2 - 1, top, 2, 210 - top, 'rgba(255,240,160,0.6)'); }
    // the river: a crust that drifts and cracks over the bright flow
    for (let i = 0; i < 40; i++) { const x = ((i * 53 + now / (14 + (i % 4) * 4)) % 480) - 30, y = 210 + (i * 17) % 36;
      rect(g, x, y, 14 + (i % 5) * 4, 3, (i % 3) ? '#7a1e0a' : '#5a1408'); rect(g, x + 3, y + 1, 4, 1, '#ffd070'); }
    for (let i = 0; i < 6; i++) { const p = (now / 900 + i * 0.37) % 1; g.fillStyle = `rgba(255,220,120,${1 - p})`; g.beginPath(); g.arc(60 + i * 100 + Math.sin(i) * 30, 228 + (i % 3) * 6, 1 + p * 4, 0, 7); g.fill(); } // bubbles
    // souls lifting off the river and drifting up to the shelves
    for (let i = 0; i < 9; i++) { const p = (now / 6000 + i / 9) % 1, x = 80 + i * 60 + Math.sin(now / 700 + i) * 12, y = 214 - p * 150;
      g.globalAlpha = Math.sin(p * Math.PI) * 0.7; rect(g, x, y, 3, 4, '#c8f0ec'); rect(g, x + 1, y + 4, 1, 4, '#8ad0c8'); rect(g, x - 1, y + 1, 1, 1, '#c8f0ec'); rect(g, x + 3, y + 1, 1, 1, '#c8f0ec'); g.globalAlpha = 1; }
    // chains with cages, swinging over the river
    this.chains.forEach(([x, top, len], i) => {
      const sw = Math.sin(now / (1300 + i * 200) + i) * 6, ex = x + sw, ey = top + len;
      for (let k = 0; k < len; k += 5) rect(g, x + sw * k / len - 1, top + k, 3, 4, k % 10 ? '#2a1a14' : '#3a2418');
      if (i !== 1) { g.strokeStyle = '#3a2418'; g.lineWidth = 2; g.strokeRect(ex - 12, ey, 24, 30); for (let k = -8; k <= 8; k += 6) { g.beginPath(); g.moveTo(ex + k, ey); g.lineTo(ex + k, ey + 30); g.stroke(); } rect(g, ex - 14, ey + 30, 28, 3, '#2a1a14'); }
      else { rect(g, ex - 6, ey, 12, 4, '#3a2418'); g.strokeStyle = '#3a2418'; g.beginPath(); g.arc(ex, ey + 10, 6, 0, Math.PI); g.stroke(); } // an empty hook
    });
    drawProprietor(g, 562, 200, now, BELOW._d, BELOW._l);
    // the scale: it never settles
    const tilt = Math.sin(now / 1500) * 0.18;
    g.save(); g.translate(400, 150); g.rotate(tilt); rect(g, -30, -2, 60, 3, '#c8a050');
    for (const sd of [-1, 1]) { g.strokeStyle = '#8a6a30'; g.lineWidth = 1; g.beginPath(); g.moveTo(sd * 28, 0); g.lineTo(sd * 28 - 7, 16); g.moveTo(sd * 28, 0); g.lineTo(sd * 28 + 7, 16); g.stroke(); }
    g.restore();
    const lp = [400 - Math.cos(tilt) * 28, 150 - Math.sin(tilt) * 28 + 16], rp = [400 + Math.cos(tilt) * 28, 150 + Math.sin(tilt) * 28 + 16];
    rect(g, lp[0] - 9, lp[1], 18, 3, '#c8a050'); rect(g, rp[0] - 9, rp[1], 18, 3, '#c8a050');
    rect(g, lp[0] - 2, lp[1] - 6, 4, 6, '#7ae0d8'); for (let i = 0; i < 3; i++) rect(g, rp[0] - 6 + i * 4, rp[1] - 3 - (i % 2) * 2, 4, 3, '#e8c050'); // a soul against the coins
    // the braziers
    for (const [x, y] of this.braziers) {
      rect(g, x - 2, y - 50, 4, 50, '#1a0e0a'); rect(g, x - 10, y - 56, 20, 7, '#2a1a12'); rect(g, x - 12, y - 58, 24, 3, '#3a2418');
      for (let i = 0; i < 5; i++) { const h = 10 + Math.abs(Math.sin(now / (70 + i * 13) + i + x)) * 16; rect(g, x - 9 + i * 4, y - 58 - h, 3, h, i % 2 ? '#e04a1a' : '#f8a030'); rect(g, x - 8 + i * 4, y - 58 - h * 0.5, 1, h * 0.5, '#fff0a0'); }
    }
    // the cracks in the ledge breathe with heat
    for (const [x, y, w] of this.cracks || []) rect(g, x, y - 1, w, 2, `rgba(255,${90 + Math.sin(now / 500 + x) * 40},30,${0.5 + Math.sin(now / 700 + x * 0.1) * 0.3})`);
    // embers
    for (let i = 0; i < 24; i++) { const p = (now / 4200 + i * 0.041) % 1; rect(g, (i * 97 + Math.sin(now / 600 + i) * 20) % NW, 250 - p * 250, 1, 1, `rgba(255,${200 - p * 120},90,${1 - p})`); }
  },
  light(g, now) {
    glow(g, 320, 228, 20, 360, '255,90,30', 0.22 + Math.sin(now / 800) * 0.02);
    for (const [x, y] of this.braziers) glow(g, x, y - 66, 2, 80, '255,150,60', 0.2 + Math.sin(now / 60 + x) * 0.03);
    glow(g, 320, 120, 20, 260, '120,220,210', 0.05);
    glow(g, 32, 44, 2, 60, '90,140,255', 0.18);
    glow(g, 452, 190, 2, 50, '255,220,160', 0.1);
    glow(g, 562, 150, 10, 120, '255,80,40', 0.06 + BELOW._d * 0.08);
    if (BELOW._d > 0.5) glow(g, 562, 92, 1, 22, '255,210,80', 0.3);
  },
  vignette: 0.55
}, 1.5);
