// Pawn Champ - The Nest, under Saint Brine's attic floor. A set-piece scene for M19 The Doctor's Cabinet
// (docs/quests/MAJOR.md#m19-the-doctors-cabinet, docs/ART.md#set-piece-scenes).
// The hollow between the attic boards and the humped plaster back of the nave's vaulted ceiling, grown
// over with silk. Candlelight from the nave leaks up through the cracks. Egg sacs pulse on the
// timbers, wrapped things hang and turn, spiders run the threads, and the queen sits in the funnel's
// mouth at the back.
//
// NEST is how a scene stages the queen:
//   NEST.queen = 0..1   how far out of the funnel she has come (0 hidden in the dark, 1 fully out)
//   NEST.stir  = true   her front legs lift and the small spiders run faster (when she's angry)
// Both ease toward the value set, so a scene can just set them between lines.
'use strict';

const NEST = { queen: 1, stir: false, _q: 1, _s: 0 };

// a spider seen from above-ish: two body parts and eight jointed legs; `phase` drives the gait
function drawSpider(g, x, y, size, phase, col, eye) {
  const s = size;
  g.strokeStyle = col; g.lineWidth = Math.max(1, s / 5);
  for (let side = -1; side <= 1; side += 2) for (let k = 0; k < 4; k++) {
    const step = Math.sin(phase + k * 1.6 + (side > 0 ? Math.PI : 0)) * s * 0.25;
    const hx = x + side * s * 0.3, hy = y - s * 0.15 + k * s * 0.18;
    const kx = x + side * s * (0.9 + k * 0.05), ky = hy - s * 0.55 + step * 0.4;
    const fx = x + side * s * (1.3 + (k === 0 || k === 3 ? 0.1 : 0.25)), fy = y - s * 0.5 + k * s * 0.42 + step;
    g.beginPath(); g.moveTo(hx, hy); g.lineTo(kx, ky); g.lineTo(fx, fy); g.stroke();
  }
  g.fillStyle = col; g.beginPath(); g.ellipse(x, y + s * 0.5, s * 0.55, s * 0.62, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(x, y - s * 0.1, s * 0.36, s * 0.32, 0, 0, 7); g.fill();
  if (eye) { rect(g, x - s * 0.2, y - s * 0.3, Math.max(1, s / 6), Math.max(1, s / 6), eye); rect(g, x + s * 0.1, y - s * 0.3, Math.max(1, s / 6), Math.max(1, s / 6), eye); }
}

// the queen, facing you from the funnel: a swollen banded abdomen behind, the head low and forward,
// eight eyes, two fangs. `out` 0..1 brings her forward out of the dark; `stir` lifts her front legs.
function drawQueen(g, cx, cy, now, out, stir) {
  if (out <= 0.01) return;
  const s = 0.65 + out * 0.6, x = cx, y = cy + (1 - out) * -20, breathe = Math.sin(now / 700) * 1.5;
  g.save(); g.globalAlpha = Math.min(1, out * 1.6);
  const body = '#221a1e', mid = '#36262e', hi = '#6a5260', band = '#9a8462';
  // legs: four a side, long and many-jointed, feet planted on the funnel's lip
  for (let side = -1; side <= 1; side += 2) for (let k = 0; k < 4; k++) {
    const front = k === 0, lift = front ? stir * (10 + Math.sin(now / 160) * 8) : Math.sin(now / 900 + k) * 1.5;
    const hx = x + side * 14 * s, hy = y + (6 + k * 4) * s;
    const kx = x + side * (52 + k * 12) * s, ky = y + (-38 + k * 10) * s - lift;
    const fx = x + side * (78 + k * 20 - (front ? 26 : 0)) * s, fy = y + (44 + k * 6) * s - lift * 2.2 + (front ? -10 * s : 0);
    g.strokeStyle = body; g.lineWidth = 6 * s; g.lineCap = 'round';
    g.beginPath(); g.moveTo(hx, hy); g.lineTo(kx, ky); g.lineTo(fx, fy); g.stroke();
    g.strokeStyle = hi; g.lineWidth = 2 * s;
    g.beginPath(); g.moveTo(hx, hy - 1); g.lineTo(kx, ky - 1); g.stroke();
    for (const t of [0.35, 0.7]) rect(g, kx + (fx - kx) * t - 1, ky + (fy - ky) * t - 1, 3 * s, 3 * s, band); // joint bands
  }
  g.lineCap = 'butt';
  // abdomen, looming up behind the head, with pale chevrons
  g.fillStyle = body; g.beginPath(); g.ellipse(x, y - 34 * s + breathe, 44 * s, 40 * s + breathe, 0, 0, 7); g.fill();
  g.strokeStyle = hi; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y - 34 * s + breathe, 44 * s, 40 * s + breathe, 0, 3.5, 5.6); g.stroke();
  g.fillStyle = mid; g.beginPath(); g.ellipse(x - 8 * s, y - 46 * s + breathe, 26 * s, 22 * s, -0.3, 0, 7); g.fill();
  g.fillStyle = band;
  for (let i = 0; i < 4; i++) { const yy = y - (62 - i * 12) * s + breathe, w = (14 + i * 5) * s;
    g.beginPath(); g.moveTo(x - w, yy); g.lineTo(x, yy + 6 * s); g.lineTo(x + w, yy); g.lineTo(x + w - 3 * s, yy + 3 * s); g.lineTo(x, yy + 9 * s); g.lineTo(x - w + 3 * s, yy + 3 * s); g.fill(); }
  // head and thorax
  g.fillStyle = body; g.beginPath(); g.ellipse(x, y + 8 * s, 24 * s, 18 * s, 0, 0, 7); g.fill();
  g.fillStyle = hi; g.beginPath(); g.ellipse(x - 6 * s, y + 2 * s, 10 * s, 5 * s, -0.2, 0, 7); g.fill();
  // fangs, working slowly
  const f = Math.sin(now / 380) * 2 * s;
  g.fillStyle = '#0c080a';
  g.beginPath(); g.moveTo(x - 10 * s, y + 18 * s); g.lineTo(x - 4 * s - f, y + 36 * s); g.lineTo(x - 2 * s, y + 20 * s); g.fill();
  g.beginPath(); g.moveTo(x + 10 * s, y + 18 * s); g.lineTo(x + 4 * s + f, y + 36 * s); g.lineTo(x + 2 * s, y + 20 * s); g.fill();
  rect(g, x - 5 * s - f, y + 34 * s, 2, 2, '#c8d8b0'); rect(g, x + 3 * s + f, y + 34 * s, 2, 2, '#c8d8b0'); // a bead of venom
  // eight eyes: two big, six small, and they blink out of step
  const eyes = [[-6, 2, 4], [6, 2, 4], [-14, 0, 2], [14, 0, 2], [-10, -6, 2], [10, -6, 2], [-3, -8, 2], [3, -8, 2]];
  eyes.forEach(([ex, ey, er], i) => {
    if (Math.sin(now / 1700 + i * 2.1) > 0.97) return; // a blink
    g.fillStyle = '#ff3a2a'; g.beginPath(); g.arc(x + ex * s, y + ey * s, er * s, 0, 7); g.fill();
    rect(g, x + ex * s - er * s * 0.4, y + ey * s - er * s * 0.5, Math.max(1, er * s * 0.4), Math.max(1, er * s * 0.4), '#ffd0c0');
  });
  g.restore();
}

addPlace('nest', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(119);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    const VX = 320, VY = 150; // where everything recedes to: the dark at the back
    r(0, 0, NW, NH, '#0c080a');
    // the underside of the attic floor: boards and joists running away into the dark
    for (let y = 0; y < 120; y++) r(0, y, NW, 1, lerpColor('#2a1e18', '#0e0a0a', y / 120));
    for (let i = -14; i <= 14; i++) { g.strokeStyle = i % 3 ? 'rgba(10,6,4,0.7)' : '#1a120c'; g.lineWidth = i % 3 ? 1 : 7;
      g.beginPath(); g.moveTo(VX + i * 6, VY - 30); g.lineTo(VX + i * 60, -10); g.stroke(); }
    // slivers of the attic bulb through gaps in the boards
    for (let i = 0; i < 9; i++) { const x0 = 40 + R() * 560; g.strokeStyle = 'rgba(255,220,150,0.35)'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x0, 0); g.lineTo(VX + (x0 - VX) * 0.35, VY - 40); g.stroke(); }
    // the floor: the humped plaster back of the nave's vault, ribbed, cracked, receding
    for (let y = 150; y < NH; y++) { const t = (y - 150) / 210; r(0, y, NW, 1, lerpColor('#0e0a0a', '#3a3430', Math.pow(t, 0.8))); }
    for (let i = -10; i <= 10; i++) { g.strokeStyle = 'rgba(20,14,12,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(VX + i * 8, VY + 4); g.lineTo(VX + i * 90, NH); g.stroke(); }
    for (let k = 0; k < 8; k++) { const y = VY + 8 + Math.pow(k / 8, 1.8) * 210; g.strokeStyle = 'rgba(90,82,72,0.45)'; g.lineWidth = 1 + k / 3;
      g.beginPath(); g.moveTo(0, y + 18 + k * 4); g.quadraticCurveTo(VX, y - 6, NW, y + 18 + k * 4); g.stroke(); } // the vault's curve
    // timber posts and braces, near ones big at the sides
    for (const [x, w, top, bot] of [[16, 26, 0, NH], [598, 28, 0, NH], [150, 12, 40, 250], [478, 12, 40, 250], [228, 6, 96, 196], [404, 6, 96, 196]]) {
      r(x, top, w, bot - top, '#1e1410'); r(x, top, Math.max(2, w / 5), bot - top, '#2e2018'); r(x + w - 2, top, 2, bot - top, '#0e0806');
    }
    g.strokeStyle = '#1e1410'; g.lineWidth = 8; g.beginPath(); g.moveTo(42, 120); g.lineTo(150, 60); g.moveTo(598, 120); g.lineTo(490, 60); g.stroke();
    // silk: sheets slung between the timbers, thick enough to hide whatever is behind them
    const sheet = (pts, a) => { g.fillStyle = `rgba(200,200,210,${a})`; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fill(); };
    sheet([[42, 0], [150, 40], [162, 120], [130, 230], [60, 260], [42, 200]], 0.13);
    sheet([[598, 0], [490, 40], [478, 140], [520, 250], [598, 230]], 0.13);
    sheet([[150, 60], [228, 100], [234, 196], [200, 230], [162, 210]], 0.10);
    sheet([[490, 60], [410, 100], [404, 190], [440, 230], [478, 200]], 0.10);
    sheet([[0, 0], [NW, 0], [NW, 30], [VX, 70], [0, 30]], 0.08);
    for (let i = 0; i < 70; i++) { const x0 = R() * NW, y0 = R() * 60, x1 = x0 + (R() - 0.5) * 160, y1 = 120 + R() * 140;
      g.strokeStyle = `rgba(210,210,220,${0.08 + R() * 0.18})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + 20, x1, y1); g.stroke(); }
    // the funnel at the back: rings of silk drawing down into a black throat
    for (let k = 9; k >= 0; k--) { const rx = 44 + k * 22, ry = 22 + k * 11;
      g.fillStyle = k === 0 ? '#020101' : `rgba(6,3,4,${0.16 + (9 - k) * 0.03})`; g.beginPath(); g.ellipse(VX, VY + 20, rx, ry, 0, 0, 7); g.fill();
      g.strokeStyle = `rgba(200,200,210,${0.1 + k * 0.012})`; g.lineWidth = 1; g.beginPath(); g.ellipse(VX, VY + 20, rx, ry, 0, 0, 7); g.stroke(); }
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.strokeStyle = 'rgba(220,220,230,0.2)';
      g.beginPath(); g.moveTo(VX + Math.cos(a) * 30, VY + 20 + Math.sin(a) * 16); g.lineTo(VX + Math.cos(a) * 260, VY + 20 + Math.sin(a) * 130); g.stroke(); }
    // an orb web strung across the upper left corner
    const orb = (cx, cy, rad) => { g.strokeStyle = 'rgba(220,220,230,0.35)'; g.lineWidth = 1;
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); g.stroke(); }
      for (let k = 1; k < 9; k++) { g.beginPath(); for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI * 2, rr = rad * k / 9 * (0.92 + (i % 2) * 0.08);
        g[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.stroke(); } };
    orb(96, 64, 46); orb(560, 70, 34);
    // egg sacs crusted along the timbers (their glow pulses in light())
    this.sacs = [];
    for (const [x, y, n] of [[60, 150, 5], [176, 160, 4], [470, 150, 4], [570, 170, 6], [250, 120, 3], [392, 118, 3]]) for (let i = 0; i < n; i++) {
      const sx = x + (R() - 0.5) * 30, sy = y + (R() - 0.5) * 40, rr = 6 + R() * 6;
      g.fillStyle = '#b8bca0'; g.beginPath(); g.ellipse(sx, sy, rr, rr * 1.2, 0, 0, 7); g.fill();
      g.fillStyle = '#d8dcc0'; g.beginPath(); g.ellipse(sx - rr * 0.3, sy - rr * 0.4, rr * 0.4, rr * 0.4, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(120,124,100,0.6)'; g.beginPath(); g.ellipse(sx, sy, rr, rr * 1.2, 0, 0, 7); g.stroke();
      this.sacs.push([sx, sy, rr]);
    }
    // the cracks in the vault, where the nave's candles show through (lit in light())
    this.cracks = [];
    for (const [x, y, len] of [[110, 300, 70], [250, 338, 60], [420, 290, 80], [540, 330, 50], [330, 252, 40], [190, 262, 34]]) {
      const pts = [[x, y]]; let px = x, py = y;
      for (let i = 0; i < 6; i++) { px += len / 6; py += (R() - 0.5) * 10; pts.push([px, py]); }
      g.strokeStyle = '#120a06'; g.lineWidth = 3; g.beginPath(); pts.forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](a, b)); g.stroke();
      this.cracks.push(pts);
    }
    // what's on the floor: dropped hymnals, a gull's bones, a glass drawer of pinned beetles, its glass broken
    for (const [x, y, col] of [[80, 318, '#5a1a1a'], [96, 324, '#1a2a4a'], [520, 300, '#5a1a1a']]) { r(x, y, 16, 6, col); r(x, y, 16, 1, '#c8b890'); }
    for (let i = 0; i < 6; i++) r(560 + i * 5, 340 + (i % 2) * 3, 4, 1, '#d8d0c0'); r(556, 336, 6, 4, '#d8d0c0');
    r(200, 300, 46, 26, '#3a2618'); r(202, 302, 42, 22, '#6a5a40');
    for (let i = 0; i < 8; i++) { const bx = 206 + (i % 4) * 9, by = 306 + (i > 3 ? 9 : 0); if (i === 5) continue; r(bx, by, 3, 4, ['#2a6a4a', '#6a3a1a', '#1a1a2a', '#8a6a1a'][i % 4]); r(bx + 1, by - 1, 1, 6, '#c8c8c8'); }
    g.strokeStyle = 'rgba(220,230,240,0.7)'; g.beginPath(); g.moveTo(204, 302); g.lineTo(222, 316); g.lineTo(236, 304); g.moveTo(222, 316); g.lineTo(218, 324); g.stroke();
    // silk drifted over everything on the floor
    for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(200,200,210,0.07)'; g.beginPath(); g.ellipse(R() * NW, 230 + R() * 130, 20 + R() * 50, 3 + R() * 6, 0, 0, 7); g.fill(); }
    return c;
  },
  // wrapped things hanging on threads: x, thread top, length, width, height
  cocoons: [[120, 0, 120, 12, 30], [196, 36, 70, 8, 16], [452, 30, 96, 10, 22], [548, 0, 150, 22, 64], [270, 60, 60, 6, 12], [376, 60, 50, 7, 14]],
  // threads the small spiders run along: x0, y0, x1, y1, speed
  runs: [[40, 20, 160, 130], [598, 10, 480, 150], [150, 60, 236, 190], [490, 60, 404, 180], [0, 260, 200, 330], [640, 250, 450, 310], [228, 120, 320, 170], [404, 120, 320, 170]],
  animate(g, now) {
    NEST._q += (NEST.queen - NEST._q) * 0.04; NEST._s += ((NEST.stir ? 1 : 0) - NEST._s) * 0.06;
    const fast = 1 + NEST._s * 2;
    // the cocoons turn slowly on their threads; the big one at the right sometimes kicks
    this.cocoons.forEach(([x, top, len, w, h], i) => {
      const sw = Math.sin(now / (1400 + i * 230) + i) * (3 + len / 40), bx = x + sw, by = top + len;
      g.strokeStyle = 'rgba(220,220,230,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, top); g.lineTo(bx, by); g.stroke();
      const kick = i === 3 && (now % 6100) < 260 ? Math.sin(now / 30) * 2 : 0;
      g.fillStyle = '#c8c8c0'; g.beginPath(); g.ellipse(bx + kick, by + h / 2, w / 2, h / 2, sw * 0.02, 0, 7); g.fill();
      g.fillStyle = '#a8a8a0'; g.beginPath(); g.ellipse(bx + kick + w * 0.15, by + h / 2, w * 0.3, h * 0.45, sw * 0.02, 0, 7); g.fill();
      g.strokeStyle = 'rgba(120,120,110,0.7)'; for (let k = 1; k < 5; k++) { const yy = by + h * k / 5; g.beginPath(); g.moveTo(bx - w / 2 + 1, yy - 2); g.lineTo(bx + w / 2 - 1, yy + 2); g.stroke(); }
    });
    // spiders running the threads, pausing, running again
    this.runs.forEach(([x0, y0, x1, y1], i) => {
      const cyc = ((now / (5200 / fast) + i * 0.37) % 2), t = cyc < 1 ? cyc : 2 - cyc;
      const eased = Math.max(0, Math.min(1, (t - 0.1) / 0.8)), x = x0 + (x1 - x0) * eased, y = y0 + (y1 - y0) * eased;
      g.strokeStyle = 'rgba(220,220,230,0.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      drawSpider(g, x, y, 3 + (y / NH) * 4, now / 50 * fast, '#16100e', i % 3 ? null : '#c83a2a');
    });
    // two dropping on threads from the boards, then climbing back up
    for (const [x, ph] of [[300, 0], [352, 0.5], [100, 0.25]]) {
      const p = (now / 4000 + ph) % 1, y = 10 + Math.sin(p * Math.PI) * (90 + NEST._s * 60);
      g.strokeStyle = 'rgba(220,220,230,0.5)'; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, y); g.stroke();
      drawSpider(g, x, y + 4, 4, now / 70, '#1a1210', null);
    }
    // a few crossing the floor
    for (let i = 0; i < 4; i++) {
      const p = ((now / (7000 / fast)) + i * 0.27) % 1, x = -20 + p * 680, y = 286 + i * 18 + Math.sin(p * 20 + i) * 3;
      drawSpider(g, i % 2 ? NW - x : x, y, 5 + i, now / 40 * fast, '#120c0a', null);
    }
    drawQueen(g, 320, 160, now, NEST._q, NEST._s);
    // dust and loose silk drifting down
    for (let i = 0; i < 14; i++) { const p = (now / 9000 + i * 0.071) % 1; rect(g, 60 + i * 40 + Math.sin(now / 1500 + i) * 10, p * 300, 2, 1, 'rgba(220,220,230,0.35)'); }
  },
  light(g, now) {
    // candlelight from the nave below, up through the cracks
    for (const pts of this.cracks || []) {
      const fl = 0.55 + Math.sin(now / 120 + pts[0][0]) * 0.1;
      g.strokeStyle = `rgba(255,170,80,${fl})`; g.lineWidth = 1; g.beginPath(); pts.forEach(([a, b], i) => g[i ? 'lineTo' : 'moveTo'](a, b)); g.stroke();
      const [mx, my] = pts[3]; glow(g, mx, my, 2, 46, '255,150,70', 0.12);
      g.fillStyle = 'rgba(255,170,90,0.035)'; g.beginPath(); g.moveTo(mx - 20, my); g.lineTo(mx + 20, my); g.lineTo(mx + 6, my - 120); g.lineTo(mx - 6, my - 120); g.fill();
    }
    // the egg sacs: a sick green pulse, each to its own beat
    (this.sacs || []).forEach(([x, y, rr], i) => glow(g, x, y, 1, rr * 2.4, '160,230,120', 0.03 + (Math.sin(now / 600 + i * 0.9) + 1) * 0.04));
    // the queen's eyes
    if (NEST._q > 0.2) glow(g, 320, 168, 2, 40, '255,60,40', 0.16 * NEST._q);
    // your torch, from the hatch you came in by
    g.fillStyle = 'rgba(255,240,200,0.06)'; g.beginPath(); g.moveTo(0, 340); g.lineTo(300, 120); g.lineTo(380, 210); g.lineTo(0, 360); g.fill();
  },
  vignette: 0.7
}, 1.5);
