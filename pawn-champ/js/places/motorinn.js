// Pawn Champ - The Harborview Motor Inn on the edge of town, shut for the winter. M25 The Christmas Club
// (batch M, docs/quests/BACKLOG.md). Night, snowing: a two-storey row of rooms with an outside walkway, the pool full of
// snow behind a chain-link fence, an ice machine, a car under a drift, and the tall neon sign with half
// its letters dead. One room has a light on.
//   HARBORVIEW.room = the lit room's number (default 14); its curtain glows and a shadow crosses it.
'use strict';

const HARBORVIEW = { room: 14 };

addPlace('motorinn', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(191);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 220; y++) r(0, y, NW, 1, lerpColor('#0a0c1a', '#2a2a3e', y / 220));
    for (let x = 0; x < NW; x += 5) { const h = 10 + Math.abs(Math.sin(x / 40)) * 18 + R() * 6; r(x, 200 - h, 6, h, '#141624'); } // pines behind
    // the motel: two storeys, eight doors on each, an outside walkway and stairs
    r(150, 60, 490, 170, '#c8b8a0'); r(150, 60, 490, 6, '#f0f0f4'); r(150, 54, 490, 8, '#f4f4f8'); // snow on the roof
    r(150, 140, 490, 8, '#8a7a64'); r(150, 136, 490, 4, '#f0f0f4'); for (let x = 150; x < NW; x += 10) r(x, 120, 2, 18, '#6a6a6a'); r(150, 118, 490, 3, '#7a7a7a');
    this.doors = [];
    for (let fl = 0; fl < 2; fl++) for (let i = 0; i < 8; i++) { const x = 166 + i * 60, y = fl ? 160 : 74, n = (fl ? 10 : 20) + i + 1;
      r(x, y, 22, 44, ['#3a6a8a', '#8a3a3a', '#3a7a5a'][i % 3]); r(x + 17, y + 22, 3, 3, '#c8a050');
      r(x + 28, y + 6, 26, 22, '#1a1e2a'); r(x + 28, y + 6, 26, 2, '#8a8478'); pixText(g, String(n), x + 5, y + 4, '#f0e8d0');
      this.doors.push([n, x + 28, y + 6]); }
    r(150, 204, 490, 26, '#9a8a74');
    // the office at the end, with the ice machine
    r(80, 120, 70, 110, '#a89880'); r(80, 114, 70, 8, '#f4f4f8'); r(92, 140, 46, 34, '#1a1e2a'); pixText(g, 'OFFICE', 92, 128, '#3a2a1a');
    r(96, 188, 34, 40, '#c8ccd0'); pixText(g, 'ICE', 104, 194, '#3a7ab0');
    // the sign on its pole (the neon is live)
    r(40, 40, 6, 190, '#4a4a52'); r(14, 26, 100, 70, '#2a2a34'); r(14, 26, 100, 3, '#5a5a6a'); r(14, 20, 100, 6, '#f4f4f8');
    // the lot: snow, tire tracks, a car under a drift, the pool behind a fence
    for (let y = 230; y < NH; y++) r(0, y, NW, 1, lerpColor('#c8d0e0', '#e8ecf4', (y - 230) / 130));
    for (let i = 0; i < 2; i++) { g.strokeStyle = 'rgba(140,150,170,0.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 300 + i * 14); g.quadraticCurveTo(300, 270 + i * 10, 640, 330 + i * 12); g.stroke(); }
    g.fillStyle = '#e8ecf4'; g.beginPath(); g.ellipse(520, 262, 64, 22, 0, Math.PI, 0); g.fill(); r(470, 256, 100, 22, '#8a2a2a'); r(478, 262, 26, 10, '#1a1e2a'); r(530, 262, 26, 10, '#1a1e2a'); g.fillStyle = '#f4f6fa'; g.beginPath(); g.ellipse(520, 254, 60, 14, 0, Math.PI, 0); g.fill();
    r(180, 236, 200, 34, '#d8e0ec'); r(184, 240, 192, 26, '#e8eef6'); g.strokeStyle = '#6a7a8a'; g.lineWidth = 1; // the pool, full of snow, and its fence
    for (let x = 170; x < 392; x += 6) { g.beginPath(); g.moveTo(x, 228); g.lineTo(x + 6, 246); g.moveTo(x + 6, 228); g.lineTo(x, 246); g.stroke(); }
    r(168, 226, 226, 2, '#6a7a8a'); r(184, 238, 4, 8, '#9aa0a8'); r(320, 230, 3, 16, '#9aa0a8'); r(318, 230, 16, 3, '#9aa0a8'); // ladder, a diving board
    return c;
  },
  animate(g, now) {
    // HARBORVIEW in pink, MOTOR INN in blue, VACANCY with a dead V and the N on and off
    const word = (s, x, y, col, dead) => { for (let i = 0; i < s.length; i++) pixText(g, s[i], x + i * 8, y, dead(i) ? '#2a2a3a' : col, 2); };
    word('HARBORVIEW', 22, 34, '#ff6aa8', i => i === 3 || i === 7);
    word('MOTOR INN', 26, 52, '#6ac8ff', i => i === 6 && Math.sin(now / 90) + Math.sin(now / 37) > 1.4);
    word('VACANCY', 34, 72, '#ff4a3a', i => i === 0 || (i === 5 && Math.sin(now / 700) > 0));
    // the lit room: curtain glow, and now and then someone crosses it
    const d = this.doors && this.doors.find(([n]) => n === HARBORVIEW.room);
    if (d) { const [, x, y] = d; rect(g, x, y, 26, 22, '#e8b860'); rect(g, x + 2, y + 2, 4, 18, '#c89040'); rect(g, x + 20, y + 2, 4, 18, '#c89040');
      const p = (now % 8000) / 8000; if (p < 0.3) rect(g, x + 2 + p / 0.3 * 18, y + 6, 6, 16, 'rgba(60,40,20,0.7)'); }
    // snow falling
    for (let i = 0; i < 90; i++) { const x = (i * 71 + Math.sin(now / 900 + i) * 10) % NW, y = (i * 37 + now / (30 + (i % 4) * 10)) % NH; rect(g, x, y, i % 3 ? 1 : 2, i % 3 ? 1 : 2, 'rgba(255,255,255,0.85)'); }
  },
  light(g, now) {
    glow(g, 64, 60, 6, 120, '255,110,170', 0.16 + (Math.sin(now / 90) > 0.95 ? -0.05 : 0));
    const d = this.doors && this.doors.find(([n]) => n === HARBORVIEW.room); if (d) glow(g, d[1] + 13, d[2] + 11, 2, 80, '255,200,120', 0.25);
    glow(g, 320, 300, 20, 300, '200,210,240', 0.05);
  },
  vignette: 0.5
}, 1.5);
