// Pawn Champ - the Clam Shack, batch D (docs/quests/BATCHES.md, LOCATIONS.md).
// Dot's Clam Shack at the end of Water Street: a take-out window, picnic tables and a deck built
// out over the harbor on pilings. Open April to the first frost.
//   clamshack      - midday, gulls working the tables              (Something Borrowed)
//   clamshackDusk  - evening, string lights on, a party on the deck (The Selectmen's Race)
// PLACES.clamshack.arch = true draws a flower arch at the rail for a wedding.
'use strict';

function clamshackBuild(dusk) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(111);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // sky and harbor
  for (let y = 0; y < 170; y++) r(0, y, NW, 1, dusk ? lerpColor('#3a3a6a', '#e89a6a', y / 170) : lerpColor('#6aa8d8', '#d0e8f0', y / 170));
  if (dusk) { g.fillStyle = 'rgba(255,200,120,0.9)'; g.beginPath(); g.arc(520, 160, 18, Math.PI, 0); g.fill(); }
  for (let x = 0; x < NW; x += 4) { const h = 4 + Math.abs(Math.sin(x * 0.015 + 1)) * 8 + R() * 2; r(x, 166 - h, 5, h, dusk ? '#4a3a5a' : '#6a8a7a'); }
  for (let y = 166; y < 236; y++) r(0, y, NW, 1, dusk ? lerpColor('#c88a6a', '#4a4a6a', (y - 166) / 70) : lerpColor('#4a8aaa', '#2a6a8a', (y - 166) / 70));
  for (let i = 0; i < 80; i++) r(R() * NW, 168 + R() * 66, 6 + R() * 12, 1, dusk ? '#e8b08a' : '#7ab0ca');
  // Gull Point and its lighthouse, far off
  r(590, 150, 50, 16, dusk ? '#3a2e4a' : '#5a7a6a'); r(612, 124, 6, 28, '#e8e4dc'); r(610, 120, 10, 5, '#c84a3a');
  // moored boats
  for (const [x, col] of [[170, '#e8e4dc'], [300, '#c84a3a'], [430, '#2a6a9a']]) { r(x, 190, 40, 8, col); r(x + 4, 198, 32, 2, shade(col, -0.4)); r(x + 18, 160, 2, 30, '#e8e4dc'); r(x + 10, 184, 16, 6, '#e8e4dc'); }
  // the deck rail along the water, then the deck itself, planks in perspective
  for (let y = 236; y < NH; y++) r(0, y, NW, 1, lerpColor('#9a8060', '#b89a74', (y - 236) / 124));
  for (let y = 238; y < NH; y += 6 + ((y - 236) / 20 | 0)) r(0, y, NW, 1, '#7a6044');
  for (let i = 0; i < 60; i++) r(R() * NW, 240 + R() * 118, 1, 3, '#6a5038');
  r(0, 214, NW, 4, '#e8e0cc'); r(0, 228, NW, 3, '#d8d0bc'); for (let x = 4; x < NW; x += 40) r(x, 214, 5, 24, '#e8e0cc');
  r(0, 234, NW, 3, '#6a5038');
  // the shack: grey shingles, a red and white awning, the take-out window and the menu board
  r(0, 60, 196, 178, '#8a8a86');
  for (let y = 64; y < 236; y += 6) for (let x = (y / 6 % 2) * 6; x < 196; x += 12) r(x, y, 11, 5, (x * 7 + y) % 5 ? '#9a9a94' : '#86867e');
  for (let i = 0; i < 30; i++) r(-10 + i * 0.5, 60 - i, 216 - i, 1, '#5a3a32');
  r(30, 18, 110, 26, '#f4eedc'); r(30, 18, 110, 2, '#c8b890'); pixText(g, "DOT'S", 54, 22, '#c84a3a', 2); pixText(g, 'CLAM SHACK', 46, 34, '#2a4a6a');
  g.fillStyle = '#f0e0c0'; g.beginPath(); g.arc(160, 30, 12, Math.PI, 0); g.fill(); for (let i = 0; i < 5; i++) r(150 + i * 4, 20, 1, 10, '#c8a880');
  r(20, 100, 150, 56, '#2a2420'); r(24, 104, 142, 44, '#3a3028'); r(24, 132, 142, 16, '#c8b090');
  r(36, 112, 22, 20, '#f4eedc'); r(60, 108, 30, 24, '#e8e4dc'); r(110, 114, 40, 18, '#f0c060');
  for (let i = 0; i < 9; i++) { r(14 + i * 18, 88, 18, 14, i % 2 ? '#f4eedc' : '#c84a3a'); g.fillStyle = i % 2 ? '#f4eedc' : '#c84a3a'; g.beginPath(); g.arc(23 + i * 18, 102, 9, 0, Math.PI); g.fill(); }
  r(20, 160, 70, 66, '#2a2a30'); r(22, 162, 66, 62, '#3a3a40');
  pixText(g, 'CHOWDER', 26, 166, '#f4eedc'); pixText(g, 'CLAM ROLL', 26, 176, '#f4eedc'); pixText(g, 'LOBSTER', 26, 186, '#f4eedc'); pixText(g, 'FRIES', 26, 196, '#f4eedc');
  pixText(g, '8', 78, 166, '#f0c060'); pixText(g, '24', 74, 176, '#f0c060'); pixText(g, 'MKT', 70, 186, '#f0c060'); pixText(g, '6', 78, 196, '#f0c060');
  pixText(g, 'CASH OK', 28, 212, '#e88a6a');
  r(110, 162, 60, 72, '#5a3a2a'); r(114, 166, 52, 30, '#2a3a4a'); r(150, 200, 4, 6, '#c8a050');
  // picnic tables with umbrellas
  const table = (x, y, s, um) => {
    r(x, y, 60 * s, 5 * s, '#6a4a32'); r(x - 6 * s, y + 12 * s, 72 * s, 3 * s, '#5a3a24'); r(x + 6 * s, y + 5 * s, 3 * s, 18 * s, '#4a2e1c'); r(x + 50 * s, y + 5 * s, 3 * s, 18 * s, '#4a2e1c');
    r(x + 29 * s, y - 50 * s, 2 * s, 50 * s, '#e8e4dc');
    for (let i = 0; i < 18; i++) { const w = (i + 1) * 2.6 * s; r(x + 30 * s - w, y - 62 * s + i * s, w * 2, s, (i % 4 < 2) ? um : '#f4eedc'); }
  };
  table(230, 250, 1, '#2a6a9a'); table(470, 262, 1.15, '#3a8a5a');
  // lobster traps stacked by the shack, a bucket of shells, gulls on the rail
  for (let i = 0; i < 3; i++) { r(176 + i * 4, 236 - i * 16, 36, 16, '#c8a050'); for (let k = 0; k < 6; k++) r(178 + i * 4 + k * 6, 236 - i * 16, 1, 16, '#8a6a30'); }
  r(560, 300, 22, 22, '#5a6a7a'); for (let i = 0; i < 6; i++) r(562 + i * 3, 296 + (i % 2) * 2, 4, 3, '#e8e0cc');
  return c;
}

const CLAMSHACK_LIGHTS = (() => { const out = []; for (let i = 0; i <= 24; i++) { const t = i / 24; out.push([Math.round(200 + t * 440), Math.round(70 + Math.sin(t * Math.PI * 2) * 8 + t * 20)]); } return out; })();
function clamshackAnimate(g, now, dusk) {
  // gulls drifting and one on the rail that keeps looking at your fries
  for (let i = 0; i < 3; i++) { const x = ((now / (34 + i * 8) + i * 220) % 760) - 60, y = 40 + i * 24 + Math.sin(now / 380 + i) * 5, f = Math.sin(now / 110 + i) > 0 ? 2 : 0;
    rect(g, x, y, 4, 1, '#f4f4f4'); rect(g, x - 4, y - f, 4, 1, '#f4f4f4'); rect(g, x + 4, y - f, 4, 1, '#f4f4f4'); }
  const hop = Math.sin(now / 900) > 0.9 ? 1 : 0;
  rect(g, 360, 206 - hop, 10, 6, '#f4f4f4'); rect(g, 358, 204 - hop, 5, 4, '#f4f4f4'); rect(g, 356, 206 - hop, 2, 1, '#e8a020'); rect(g, 364, 206 - hop, 6, 3, '#9a9aa4');
  for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 30) % NW, 172 + (i * 19) % 60, 6, 1, dusk ? 'rgba(255,220,180,0.5)' : 'rgba(220,240,255,0.5)');
  if (dusk) {
    for (let i = 0; i < CLAMSHACK_LIGHTS.length - 1; i++) { const [x0, y0] = CLAMSHACK_LIGHTS[i], [x1, y1] = CLAMSHACK_LIGHTS[i + 1]; for (let k = 0; k < 18; k++) rect(g, x0 + (x1 - x0) * k / 18, y0 + (y1 - y0) * k / 18, 1, 1, '#2a2430'); }
    for (const [x, y] of CLAMSHACK_LIGHTS) rect(g, x - 1, y + 1, 3, 3, Math.sin(now / 400 + x) > -0.6 ? '#ffe08a' : '#c8a050');
  }
  if (PLACES.clamshack.arch) {
    const x = 420, y = 230;
    g.strokeStyle = '#e8e0cc'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 40, Math.PI, 0); g.stroke();
    const fl = ['#f4f4f4', '#e8a8b8', '#f0e0a0', '#f4f4f4', '#a8c8e8'];
    for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; rect(g, x + Math.cos(a) * 40 - 2, y + Math.sin(a) * 40 - 2, 5, 5, fl[i % fl.length]); rect(g, x + Math.cos(a) * 40 + 2, y + Math.sin(a) * 40, 3, 2, '#5a8a4a'); }
    rect(g, x - 42, y, 4, 70, '#e8e0cc'); rect(g, x + 38, y, 4, 70, '#e8e0cc');
  }
}

addPlace('clamshack', {
  build: () => clamshackBuild(false),
  animate(g, now) { clamshackAnimate(g, now, false); },
  light(g) { glow(g, 500, 30, 10, 220, '255,250,220', 0.1); },
  vignette: 0.2,
  arch: false
}, 1.5);

addPlace('clamshackDusk', {
  build: () => clamshackBuild(true),
  animate(g, now) { clamshackAnimate(g, now, true); },
  light(g, now) {
    for (const [x, y] of CLAMSHACK_LIGHTS) if (Math.sin(now / 400 + x) > -0.6) glow(g, x, y + 2, 1, 22, '255,220,140', 0.14);
    glow(g, 95, 124, 6, 120, '255,200,120', 0.16);
    glow(g, 520, 160, 10, 200, '255,170,110', 0.12);
  },
  vignette: 0.4
}, 1.5);
