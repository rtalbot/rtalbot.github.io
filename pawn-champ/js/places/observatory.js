// Pawn Champ - The Signal Hill observatory, shut since 1932. M21 The Halvorsen Plates (the deep set).
//   observatory     - inside the dome at night: cracked plaster, iron ribs, the slit, the brass telescope
//                     on its stone pier, the crank wheel and its chain, Augusta's desk and plate racks
//   observatorySky  - outside on the hilltop under the open sky: the ruin to one side, the town and Gull
//                     Point below, and above the lighthouse a star that isn't one. Close up it's a lit
//                     window, with a woman at a desk inside.
// A scene drives both with:
//   OBSERVATORY.slit   = 0..1 how far the slit is cranked open (inside)
//   OBSERVATORY.window = 0..1 how close the wrong star has come: 0 a faint star, 1 a lit window
// Both ease toward the value set.
'use strict';

const OBSERVATORY = { slit: 0, window: 0, _s: 0, _w: 0 };

// the wrong star: a faint point far off; nearer, a small lit window with its frame and a figure at a desk
function drawWindowStar(g, x, y, w, now) {
  const tw = 0.7 + Math.sin(now / 300) * 0.15 + Math.sin(now / 1170) * 0.15;
  if (w < 0.25) { const s = 1 + w * 8; rect(g, x - s / 2, y - s / 2, s, s, `rgba(255,240,200,${tw})`); rect(g, x - s * 2, y, s * 4, 1, 'rgba(255,230,190,0.4)'); rect(g, x, y - s * 2, 1, s * 4, 'rgba(255,230,190,0.4)'); return; }
  const sz = 6 + (w - 0.25) * 60, hw = sz * 0.8, hh = sz;
  rect(g, x - hw / 2 - 2, y - hh / 2 - 2, hw + 4, hh + 4, '#2a2018');
  rect(g, x - hw / 2, y - hh / 2, hw, hh, '#f0c878');
  if (sz > 16) { // a lamp, a desk, a woman writing who looks up now and then
    rect(g, x - hw / 2, y + hh * 0.1, hw, hh * 0.4, '#c89048');
    rect(g, x - hw * 0.1, y - hh * 0.1, hw * 0.24, hh * 0.3, '#3a2a20');
    const look = Math.sin(now / 2600) > 0.6 ? -hh * 0.04 : 0;
    g.fillStyle = '#3a2a20'; g.beginPath(); g.arc(x + hw * 0.02, y - hh * 0.18 + look, hw * 0.08, 0, 7); g.fill();
    rect(g, x + hw * 0.18, y - hh * 0.05, 2, hh * 0.15, '#3a2a20'); g.fillStyle = '#fff4c8'; g.beginPath(); g.arc(x + hw * 0.24, y - hh * 0.08, hw * 0.06, 0, 7); g.fill();
  }
  rect(g, x - 1, y - hh / 2, 2, hh, '#2a2018'); rect(g, x - hw / 2, y - 1, hw, 2, '#2a2018'); // the frame
}

addPlace('observatory', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(241);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, NH, '#1a1a22');
    // the dome: a great arc of plaster, cracked and fallen in patches, on iron ribs
    for (let y = 0; y < 250; y++) { const t = y / 250; r(0, y, NW, 1, lerpColor('#2a2a34', '#5a5650', Math.pow(t, 0.8))); }
    for (let i = 0; i < 9; i++) { const x0 = 320 + (i - 4) * 90; g.strokeStyle = '#1a1a20'; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 + (i - 4) * 40, 250); g.quadraticCurveTo(x0, 80, 320, -20); g.stroke(); }
    for (let i = 0; i < 20; i++) { const x = R() * NW, y = 60 + R() * 170; g.fillStyle = '#2e2a28'; g.beginPath(); g.ellipse(x, y, 8 + R() * 20, 4 + R() * 10, R(), 0, 7); g.fill(); r(x - 2, y - 1, 4, 1, '#6a6660'); } // fallen plaster, lath showing
    for (let i = 0; i < 30; i++) { g.strokeStyle = 'rgba(20,20,24,0.6)'; g.lineWidth = 1; const x = R() * NW, y = 60 + R() * 180; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - 0.5) * 30, y + R() * 20); g.lineTo(x + (R() - 0.5) * 40, y + R() * 30); g.stroke(); }
    // the slit's frame: two iron rails up the middle of the dome (the shutter itself is live)
    r(286, 0, 6, 200, '#3a3a40'); r(348, 0, 6, 200, '#3a3a40');
    // the round wall below the dome: dark boards, the ring rail the dome turned on
    r(0, 196, NW, 66, '#3a2e24'); r(0, 196, NW, 6, '#6a6a70'); r(0, 202, NW, 2, '#2a2a30'); for (let x = 0; x < NW; x += 26) r(x, 204, 1, 58, '#2e241c');
    // the crank on the left wall, its wheel and chain
    r(56, 160, 10, 100, '#2a2a2e'); g.strokeStyle = '#6a6a70'; g.lineWidth = 4; g.beginPath(); g.arc(61, 180, 22, 0, 7); g.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.lineWidth = 2; g.beginPath(); g.moveTo(61, 180); g.lineTo(61 + Math.cos(a) * 22, 180 + Math.sin(a) * 22); g.stroke(); }
    for (let y = 0; y < 158; y += 6) r(60, y, 3, 4, '#5a5a60');
    // Augusta's desk on the right: logbooks, the plate rack, a lamp long dead
    r(470, 236, 140, 8, '#5a3e24'); r(470, 236, 140, 2, '#7a5a34'); r(476, 244, 8, 46, '#3a2818'); r(598, 244, 8, 46, '#3a2818');
    for (let i = 0; i < 4; i++) r(486 + i * 10, 222 - (i % 2) * 2, 8, 14, ['#3a2a4a', '#2a3a2a', '#4a2a2a', '#2a2a3a'][i]);
    r(530, 214, 50, 22, '#3a2818'); for (let i = 0; i < 8; i++) r(533 + i * 6, 216, 4, 18, 'rgba(180,200,210,0.5)'); // glass plates in their rack
    r(590, 226, 10, 10, '#2a2a2a'); r(594, 210, 2, 16, '#2a2a2a');
    r(540, 120, 60, 70, '#e8e0c8'); r(544, 124, 52, 62, '#0a0a14'); for (let i = 0; i < 40; i++) r(546 + R() * 48, 126 + R() * 58, 1, 1, '#c8c8d8'); g.strokeStyle = '#c83a2a'; g.beginPath(); g.arc(578, 146, 5, 0, 7); g.stroke(); // a star chart, one star ringed in red
    // the floor: boards with a stone pier in the middle
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a3a2a', '#5e4a34', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(20,12,6,0.4)'; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    for (let i = 0; i < 30; i++) r(R() * NW, 266 + R() * 90, 3 + R() * 6, 2, '#8a8478'); // plaster on the floor
    r(296, 210, 48, 66, '#7a7670'); r(296, 210, 48, 4, '#9a968e'); r(292, 272, 56, 8, '#5a5650'); // the pier
    return c;
  },
  animate(g, now) {
    OBSERVATORY._s += (OBSERVATORY.slit - OBSERVATORY._s) * 0.03; OBSERVATORY._w += (OBSERVATORY.window - OBSERVATORY._w) * 0.02;
    const open = OBSERVATORY._s, top = 200 - open * 200;
    // through the slit: night, stars, and the wrong one
    rect(g, 292, top, 56, 200 - top, '#060814');
    for (let i = 0; i < 24; i++) { const sy = (i * 37) % 200; if (sy > top) rect(g, 296 + (i * 17) % 48, sy, 1, 1, i % 4 ? '#8a90c0' : '#ffffff'); }
    if (OBSERVATORY._w > 0.01 && top < 60) drawWindowStar(g, 320, 40, Math.min(OBSERVATORY._w, 0.6), now);
    // the shutter, rolled up as far as it's been cranked
    for (let y = 0; y < top; y += 8) { rect(g, 292, y, 56, 7, '#4a4a52'); rect(g, 292, y + 7, 56, 1, '#2a2a30'); }
    // the crank turns while the slit is moving
    const turning = Math.abs(OBSERVATORY.slit - open) > 0.01, a = turning ? now / 150 : 0.4;
    rect(g, 61 + Math.cos(a) * 22 - 3, 180 + Math.sin(a) * 22 - 3, 6, 6, '#8a8a90');
    // the telescope on its mount, pointing up at the slit, brass catching the light
    g.save(); g.translate(320, 206); g.rotate(-1.25);
    rect(g, -10, -11, 150, 22, '#b8964a'); rect(g, -10, -11, 150, 4, '#e8c870'); rect(g, 136, -13, 10, 26, '#8a6a30'); rect(g, -26, -6, 18, 12, '#8a6a30');
    for (const x of [30, 80]) rect(g, x, -12, 6, 24, '#8a6a30');
    g.restore();
    rect(g, 312, 196, 16, 16, '#5a5a60');
    // dust, and plaster flaking now and then
    for (let i = 0; i < 12; i++) { const p = (now / 9000 + i * 0.08) % 1; rect(g, 240 + i * 14 + Math.sin(now / 1200 + i) * 6, p * 260, 1, 1, 'rgba(220,220,230,0.4)'); }
    const f = (now % 5200) / 1200; if (f < 1) rect(g, 160, 100 + f * 160, 3, 2, '#8a8478');
  },
  light(g) {
    const open = OBSERVATORY._s;
    if (open > 0.05) { g.fillStyle = `rgba(170,190,255,${0.05 * open})`; g.beginPath(); g.moveTo(292, 0); g.lineTo(348, 0); g.lineTo(420, NH); g.lineTo(220, NH); g.fill(); }
    if (OBSERVATORY._w > 0.2 && open > 0.7) glow(g, 320, 40, 2, 80, '255,220,150', 0.2 * OBSERVATORY._w);
    glow(g, 320, 200, 20, 300, '120,130,170', 0.06);
  },
  vignette: 0.6
}, 1.5);

addPlace('observatorySky', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(243);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 230; y++) r(0, y, NW, 1, lerpColor('#03040e', '#14183a', Math.pow(y / 230, 1.3)));
    for (let i = 0; i < 400; i++) r(R() * NW, R() * 220, 1, 1, R() < 0.15 ? '#ffffff' : R() < 0.5 ? '#8a90c0' : '#4a5080');
    g.fillStyle = 'rgba(160,170,220,0.05)'; g.beginPath(); g.ellipse(250, 90, 360, 40, -0.3, 0, 7); g.fill(); // the galaxy's band
    // the town below: rooftops, steeples, lit windows, the harbor and Gull Point with its light
    for (let x = 0; x < NW; x += 14) { const h = 10 + R() * 16; r(x, 230 - h, 14, h, '#0c0e1c'); if (R() < 0.5) r(x + 4, 230 - h + 4, 3, 3, '#e8c060'); }
    r(180, 186, 6, 44, '#0c0e1c'); g.fillStyle = '#0c0e1c'; g.beginPath(); g.moveTo(176, 188); g.lineTo(183, 166); g.lineTo(190, 188); g.fill();
    r(0, 230, NW, 14, '#0a1226'); for (let i = 0; i < 30; i++) r(R() * NW, 232 + R() * 10, 6, 1, '#2a3a6a');
    r(500, 196, 8, 36, '#c8c8c8'); r(500, 206, 8, 4, '#c83a2a'); r(500, 218, 8, 4, '#c83a2a'); r(498, 190, 12, 6, '#2a2a2a');
    // the hilltop: dead grass, a stone wall, the ruined observatory on the left with its dome open
    for (let y = 244; y < NH; y++) r(0, y, NW, 1, lerpColor('#2a2a1e', '#3a3828', (y - 244) / 116));
    for (let i = 0; i < 300; i++) { const x = R() * NW, y = 246 + R() * 110; r(x, y - 4, 1, 4 + R() * 4, R() < 0.5 ? '#5a5a3a' : '#4a4a2e'); }
    for (let x = 300; x < NW; x += 12) { r(x, 262 - (x % 24 ? 4 : 0), 12, 10, '#5a5a5e'); r(x, 262 - (x % 24 ? 4 : 0), 12, 2, '#7a7a7e'); }
    r(20, 150, 170, 120, '#8a8478'); for (let y = 154; y < 270; y += 10) r(20, y, 170, 1, '#6a6660');
    g.fillStyle = '#7a766e'; g.beginPath(); g.arc(105, 150, 86, Math.PI, 0); g.fill(); g.fillStyle = '#5a5650'; g.beginPath(); g.arc(105, 150, 86, Math.PI, Math.PI * 1.25); g.fill();
    r(94, 64, 22, 86, '#06080e'); r(90, 64, 4, 86, '#3a3a40'); r(116, 64, 4, 86, '#3a3a40'); // the slit, open
    r(84, 210, 40, 60, '#2a2018'); r(88, 214, 32, 56, '#14100c');
    for (let i = 0; i < 6; i++) { g.fillStyle = '#5a5650'; g.beginPath(); g.ellipse(30 + i * 30, 268, 10, 4, 0, 0, 7); g.fill(); }
    return c;
  },
  animate(g, now) {
    OBSERVATORY._w += (OBSERVATORY.window - OBSERVATORY._w) * 0.02;
    drawWindowStar(g, 504, 70, Math.max(0.05, OBSERVATORY._w), now);
    // the lighthouse lamp, and a faint line from it up to the star that only shows when the star is near
    const p = 0.6 + Math.sin(now / 700) * 0.4; rect(g, 501, 191, 6, 4, `rgba(120,180,255,${p})`);
    if (OBSERVATORY._w > 0.4) { g.strokeStyle = `rgba(255,230,180,${(OBSERVATORY._w - 0.4) * 0.3})`; g.lineWidth = 1; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(504, 190); g.lineTo(504, 70 + 40 * OBSERVATORY._w); g.stroke(); g.setLineDash([]); }
    // the grass moves in the wind
    for (let i = 0; i < 40; i++) { const x = (i * 53) % NW, y = 290 + (i * 23) % 60, s = Math.sin(now / 500 + i) * 2; g.strokeStyle = '#6a6a44'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y - 8); g.stroke(); }
  },
  light(g, now) {
    glow(g, 504, 70, 2, 30 + OBSERVATORY._w * 120, '255,220,150', 0.08 + OBSERVATORY._w * 0.22);
    glow(g, 504, 192, 2, 40, '120,180,255', 0.14 + Math.sin(now / 700) * 0.06);
  },
  vignette: 0.45
}, 1.5);
