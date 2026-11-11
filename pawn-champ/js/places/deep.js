// Pawn Champ - places for the deep set (docs/quests/MAJOR.md#the-deep-set-m20-to-m22-lovecraftian-proposed).
//   lowtide - the harbor drained past the breakwater at dawn: a ring of dark stones in the mud and a
//             square stair going down, water breathing at the bottom   (The Sounding, finale)
//   launch  - Tess's launch over the Neck at night: black water, the line going down, the
//             lighthouse turning   (The Sounding, scene 2)
'use strict';

// ================================================================ the lowest tide
function lowtideArt() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(2028);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // a dawn that has gone a little green
  for (let y = 0; y < 130; y++) r(0, y, NW, 1, lerpColor('#2a3a4a', '#d8d0a4', Math.pow(y / 130, 1.1)));
  for (let i = 0; i < 30; i++) r(R() * NW, R() * 40, 1, 1, 'rgba(230,240,230,0.4)');
  for (let i = 0; i < 6; i++) { const x = R() * NW, y = 70 + R() * 40, w = 80 + R() * 120; r(x, y, w, 3, 'rgba(60,70,60,0.35)'); }
  // the far shore, Gull Point and the lighthouse, very small
  for (let x = 0; x < NW; x += 4) { const h = 4 + Math.abs(Math.sin(x * 0.03)) * 6 + R() * 2; r(x, 130 - h, 5, h, '#3a4440'); }
  r(578, 100, 6, 26, '#d8d4c4'); r(578, 106, 6, 4, '#a84a3a'); r(576, 96, 10, 5, '#2a2a30');
  // the sea, a thin bright line very far out where it should never be
  r(0, 130, NW, 4, '#5a6a64'); for (let i = 0; i < 40; i++) r(R() * NW, 131 + R() * 2, 6 + R() * 10, 1, '#b8c8b0');
  // the drained harbor floor: mud, eelgrass, a dragged mooring chain, an old hull
  for (let y = 134; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a3a30', '#5a5444', Math.min(1, (y - 134) / 200)));
  for (let i = 0; i < 260; i++) { const x = R() * NW, y = 140 + R() * 220; r(x, y, 4 + R() * 12, 1, R() < 0.5 ? '#2a3024' : '#4a4a3a'); }
  for (let i = 0; i < 30; i++) { const x = R() * NW, y = 150 + R() * 200, h = 3 + R() * 6; r(x, y - h, 1, h, '#4a5a34'); r(x + 2, y - h + 1, 1, h - 1, '#3a4a2a'); }
  for (let x = 40; x < 260; x += 3) r(x, 300 + Math.sin(x / 18) * 6, 2, 2, '#2a2420'); // the chain
  g.fillStyle = '#2a2622'; g.beginPath(); g.moveTo(470, 196); g.lineTo(560, 186); g.lineTo(574, 196); g.lineTo(484, 210); g.fill(); // a sunk hull on its side
  for (let x = 480; x < 566; x += 8) r(x, 192 - (x - 470) * 0.1, 2, 10, '#1e1a16');
  // the breakwater, standing high and dry, and the seawall with the town on it
  for (let i = 0; i < 22; i++) { const x = 400 + i * 11, y = 150 - i * 0.6; r(x, y, 12, 14, i % 2 ? '#6a6a64' : '#5e5e58'); r(x, y, 12, 2, '#8a8a82'); }
  r(0, 236, 120, 12, '#7a7a70'); r(0, 234, 120, 2, '#9a9a90'); r(0, 248, 120, 112, '#4a4a40');
  // townsfolk along the seawall in dressing gowns and coats, very still
  const cols = ['#8a6a8a', '#c8b48a', '#4a6a8a', '#a84a3a', '#d8d0c0', '#6a8a5a', '#3a3a4a'];
  for (let i = 0; i < 14; i++) { const x = 6 + i * 8 + (R() * 3 | 0), col = cols[i % cols.length]; r(x, 222, 5, 12, col); r(x + 1, 216, 3, 5, '#d8b090'); }
  // the ring: eleven dark stones, leaning, slick, carved
  const cx = 330, cy = 236;
  for (let i = 0; i < 11; i++) {
    const a = i / 11 * Math.PI * 2, x = cx + Math.cos(a) * 120, y = cy + Math.sin(a) * 40, near = Math.sin(a) > 0;
    const h = (near ? 54 : 38) + (i * 13) % 14, w = near ? 16 : 11;
    r(x - w / 2, y - h, w, h, '#1a1e1c'); r(x - w / 2, y - h, 2, h, '#2e3632'); r(x + w / 2 - 2, y - h, 2, h, '#101210');
    for (let k = 0; k < 4; k++) r(x - w / 2 + 3, y - h + 8 + k * 9, w - 6, 1, '#3a4440'); // the carving, the same marks as the tallow
    r(x - w / 2 - 2, y - 2, w + 4, 3, '#2a2a22'); // its foot in the mud
  }
  // the square hole in the middle and the steps going down into it
  r(cx - 40, cy - 16, 80, 34, '#060808');
  for (let k = 0; k < 7; k++) { r(cx - 38 + k * 3, cy - 16 + k * 4, 76 - k * 6, 3, k % 2 ? '#3a423c' : '#4a544c'); r(cx - 38 + k * 3, cy - 13 + k * 4, 76 - k * 6, 1, '#141816'); }
  r(cx - 42, cy - 18, 84, 2, '#5a645a'); r(cx - 42, cy - 18, 2, 36, '#2a2e2a'); r(cx + 40, cy - 18, 2, 36, '#2a2e2a');
  return c;
}

addPlace('lowtide', {
  build: lowtideArt,
  animate(g, now) {
    // the water at the bottom of the stair, rising and falling like breath
    const b = (Math.sin(now / 1400) + 1) / 2;
    rect(g, 312, 246 - b * 3, 36, 6 + b * 3, `rgba(30,70,62,${0.75 + b * 0.2})`);
    rect(g, 314, 246 - b * 3, 32, 1, `rgba(150,220,190,${0.3 + b * 0.4})`);
    // the far line of the sea, crawling no nearer
    for (let i = 0; i < 12; i++) rect(g, (i * 57 + now / 120) % NW, 131 + (i % 2), 8, 1, 'rgba(220,235,220,0.5)');
    // drips from the stones
    for (let i = 0; i < 6; i++) { const t = ((now / 900 + i * 0.37) % 1); rect(g, 230 + i * 40, 200 + t * 30, 1, 2, `rgba(160,190,180,${1 - t})`); }
  },
  light(g, now) {
    glow(g, 330, 248, 6, 70, '120,200,170', 0.10 + (Math.sin(now / 1400) + 1) * 0.04);
    glow(g, 320, 40, 10, 300, '210,230,190', 0.08);
  },
  vignette: 0.45
}, 1.5);

// ================================================================ the launch over the Neck
function launchArt() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(1968);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  for (let y = 0; y < 150; y++) r(0, y, NW, 1, lerpColor('#04060e', '#141c30', y / 150));
  for (let i = 0; i < 240; i++) r(R() * NW, R() * 140, 1, 1, R() < 0.15 ? '#ffffff' : '#5a6488');
  // the town far off: a few lit windows, the church spire, the breakwater beacon
  for (let x = 0; x < 360; x += 4) { const h = 3 + Math.abs(Math.sin(x * 0.05)) * 5; r(x, 150 - h, 5, h, '#0a0e18'); }
  for (let i = 0; i < 12; i++) r(20 + i * 26, 145 - (i % 3), 2, 2, '#e8b860');
  r(96, 128, 2, 20, '#0a0e18');
  // Gull Point, black, and the lighthouse
  g.fillStyle = '#080a12'; g.beginPath(); g.moveTo(440, 150); g.lineTo(520, 136); g.lineTo(NW, 132); g.lineTo(NW, 150); g.fill();
  r(560, 100, 8, 34, '#20242e'); r(558, 96, 12, 6, '#14161c');
  // the water: black, with long slow swells
  for (let y = 150; y < NH; y++) r(0, y, NW, 1, lerpColor('#0c1220', '#05070c', (y - 150) / 210));
  for (let i = 0; i < 160; i++) { const y = 152 + R() * 200, w = 6 + R() * 30 * (y / 200); r(R() * NW, y, w, 1, 'rgba(70,90,130,0.35)'); }
  // the launch: the bow and gunwales in the foreground, a coil of line, a lantern, the depth reel
  g.fillStyle = '#5a5a5e'; g.beginPath(); g.moveTo(60, NH); g.lineTo(150, 250); g.lineTo(500, 250); g.lineTo(600, NH); g.fill();
  g.fillStyle = '#3a3a40'; g.beginPath(); g.moveTo(90, NH); g.lineTo(165, 262); g.lineTo(486, 262); g.lineTo(570, NH); g.fill();
  r(150, 248, 350, 4, '#8a8a8a'); r(150, 252, 350, 2, '#2a2a2e');
  for (let x = 170; x < 480; x += 40) r(x, 262, 4, 98, '#2e2e34'); // ribs
  r(440, 230, 26, 22, '#6a3a2a'); r(444, 224, 18, 8, '#4a2a1e'); r(452, 214, 2, 10, '#8a8a8a'); // the reel
  g.strokeStyle = '#c8b890'; g.lineWidth = 1; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(250, 300, 22 - k * 3, 8 - k, 0, 0, 7); g.stroke(); } // a coil of line
  return c;
}

addPlace('launch', {
  build: launchArt,
  animate(g, now) {
    // the line running off the reel and down over the side into the black
    const sway = Math.sin(now / 900) * 3;
    g.strokeStyle = 'rgba(220,210,170,0.9)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(453, 214); g.quadraticCurveTo(520 + sway, 200, 540 + sway, 262); g.lineTo(546 + sway, 360); g.stroke();
    // slow swells
    for (let i = 0; i < 16; i++) rect(g, (i * 47 + now / 80) % NW, 170 + (i * 13) % 70 + Math.sin(now / 1100 + i) * 2, 14 + (i % 3) * 8, 1, 'rgba(120,140,190,0.3)');
    // the lantern on the thwart
    rect(g, 330, 236, 8, 12, '#2a2a30'); rect(g, 331, 238, 6, 8, `rgba(255,220,150,${0.85 + Math.sin(now / 150) * 0.08})`);
  },
  light(g, now) {
    glow(g, 334, 242, 4, 110, '255,210,140', 0.24);
    // the lighthouse beam swinging round
    const a = (now / 3200) % (Math.PI * 2), on = Math.cos(a) > 0.2;
    if (on) for (let k = 1; k < 9; k++) glow(g, 564 - Math.sin(a) * k * 40, 100 + k * 2, 2, 10 + k * 4, '230,240,255', 0.06);
    glow(g, 564, 99, 3, 30, '230,240,255', on ? 0.4 : 0.08);
    // something faint and green very far down under the line
    glow(g, 546, 330, 8, 60, '90,200,160', 0.05 + (Math.sin(now / 2000) + 1) * 0.03);
  },
  vignette: 0.6
}, 1.5);

// ================================================================ the thirteenth room
// Through the door in the back room the shop goes on: the same counter and scale, room after room,
// each a little older and a little wrong, corners that don't meet.   (The Thirteenth Room)
function thirteenArt() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(1961);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  r(0, 0, NW, NH, '#0c0a08');
  // nested rooms, each smaller, each tilted a little more, receding to a point that isn't the middle
  for (let i = 0; i < 9; i++) {
    const t = i / 9, w = NW * (1 - t * 0.88), h = NH * (1 - t * 0.86);
    const cx = NW / 2 + Math.sin(i * 0.9) * 40 * t, cy = NH * 0.46 + Math.cos(i * 1.3) * 16 * t;
    g.save(); g.translate(cx, cy); g.rotate((i % 2 ? 1 : -1) * t * 0.06);
    const x0 = -w / 2, y0 = -h / 2;
    const wall = lerpColor('#5a3a2a', '#1a1410', t), floor = lerpColor('#4a3424', '#120e0a', t);
    g.fillStyle = wall; g.fillRect(x0, y0, w, h);
    g.fillStyle = floor; g.fillRect(x0, y0 + h * 0.7, w, h * 0.3);
    // shelves on the side walls, with dim shapes of stock
    for (let s = 0; s < 3; s++) {
      g.fillStyle = shade(wall, -0.25); g.fillRect(x0 + w * 0.04, y0 + h * (0.2 + s * 0.16), w * 0.16, Math.max(1, h * 0.01));
      g.fillRect(x0 + w * 0.8, y0 + h * (0.2 + s * 0.16), w * 0.16, Math.max(1, h * 0.01));
      for (let k = 0; k < 4; k++) { g.fillStyle = shade(wall, (R() - 0.5) * 0.5); g.fillRect(x0 + w * (0.05 + k * 0.035), y0 + h * (0.2 + s * 0.16) - h * 0.05, w * 0.025, h * 0.05);
        g.fillRect(x0 + w * (0.81 + k * 0.035), y0 + h * (0.2 + s * 0.16) - h * 0.05, w * 0.025, h * 0.05); }
    }
    // the counter, and Odile's scale on it, in every room
    g.fillStyle = shade(floor, 0.12); g.fillRect(x0 + w * 0.3, y0 + h * 0.6, w * 0.4, h * 0.1);
    g.fillStyle = lerpColor('#c8a050', '#3a2e1a', t); g.fillRect(x0 + w * 0.48, y0 + h * 0.5, w * 0.01 + 1, h * 0.1);
    g.fillRect(x0 + w * 0.44, y0 + h * 0.5, w * 0.09, Math.max(1, h * 0.008));
    // the doorway to the next room is the next rectangle; frame it
    g.strokeStyle = lerpColor('#8a6a4a', '#2a2018', t); g.lineWidth = Math.max(1, 4 * (1 - t));
    g.strokeRect(x0, y0, w, h);
    g.restore();
  }
  // the near room's floorboards and a dropped pawn ticket
  for (let y = 300; y < NH; y += 8) r(0, y, NW, 1, '#2a1e14');
  r(408, 330, 14, 8, '#e8e0c8'); r(410, 332, 10, 1, '#8a2a2a');
  return c;
}
addPlace('roomThirteen', {
  build: thirteenArt,
  animate(g, now) {
    // a lamp swinging a long way off, in a room it shouldn't be able to reach
    const sw = Math.sin(now / 1500) * 10;
    rect(g, 330 + sw, 150, 4, 6, `rgba(255,220,150,${0.6 + Math.sin(now / 200) * 0.1})`);
    // dust in the doorways
    for (let i = 0; i < 10; i++) rect(g, (i * 61 + now / 50) % NW, 80 + (i * 37) % 200, 1, 1, 'rgba(220,200,160,0.35)');
  },
  light(g, now) {
    glow(g, 332 + Math.sin(now / 1500) * 10, 152, 3, 80, '255,210,140', 0.18);
    glow(g, 160, 260, 10, 160, '255,200,130', 0.12);
  },
  vignette: 0.6
}, 1.5);
