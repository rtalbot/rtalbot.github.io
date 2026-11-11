// Pawn Champ - Gannet Island at dusk, off the evening ferry. A scene location, batch B
// (docs/quests/BATCHES.md, LOCATIONS.md). The one-room schoolhouse (shut since 1961), its bell
// post, scrub pines, and behind them a shack with a garden and a radio mast of fishing rods.
//   gannet  - The Twins' Map (the time capsule), Static on Channel 16 (Royce's shack)
'use strict';

addPlace('gannet', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(101);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // dusk: violet overhead, a band of orange where the sun went down behind the mainland
    for (let y = 0; y < 190; y++) r(0, y, NW, 1, y < 110 ? lerpColor('#2a2a5a', '#8a5a7a', y / 110) : lerpColor('#8a5a7a', '#f0a060', (y - 110) / 80));
    for (let i = 0; i < 60; i++) r(R() * NW, R() * 70, 1, 1, 'rgba(255,255,255,0.6)');
    for (let i = 0; i < 8; i++) { const x = R() * NW, y = 90 + R() * 80, w = 50 + R() * 120; r(x, y, w, 3, 'rgba(255,190,150,0.45)'); r(x + 10, y + 3, w * 0.7, 1, 'rgba(120,70,110,0.4)'); }
    // the mainland, far off: Hollow Neck's lights coming on, the ferry halfway home
    r(0, 184, NW, 8, '#4a3a5a'); for (let x = 0; x < NW; x += 5) r(x, 184 - Math.abs(Math.sin(x * 0.02)) * 6, 6, 8, '#4a3a5a');
    for (let i = 0; i < 26; i++) r(R() * NW, 182 + R() * 6, 2, 1, '#f8d080');
    r(0, 190, NW, 30, '#4a4a78'); for (let i = 0; i < 90; i++) r(R() * NW, 191 + R() * 28, 4 + R() * 12, 1, R() < 0.5 ? '#6a5a88' : '#e8a070');
    r(56, 196, 30, 6, '#e8e4dc'); r(62, 190, 14, 6, '#e8e4dc'); r(68, 186, 2, 4, '#2a2a30'); r(56, 202, 30, 2, '#2a2a3a'); // the ferry
    // the island: a low hump of bayberry and grass
    g.fillStyle = '#3a4a32'; g.beginPath(); g.moveTo(0, 230); g.quadraticCurveTo(160, 196, 320, 206); g.quadraticCurveTo(500, 214, NW, 200); g.lineTo(NW, NH); g.lineTo(0, NH); g.fill();
    for (let y = 230; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a5a3a', '#5a5a3a', (y - 230) / 130));
    for (let i = 0; i < 700; i++) { const x = R() * NW, y = 204 + R() * 156, h = 2 + R() * 5; r(x, y - h, 1, h, ['#6a7a4a', '#5a6a3e', '#7a7a4a', '#8a7a5a'][i % 4]); }
    // scrub pines, wind-shaped, leaning away from the sea
    const pine = (x, y, s) => { r(x, y - 30 * s, 3 * s, 30 * s, '#2a1e18');
      for (let k = 0; k < 5; k++) { const w = (30 - k * 5) * s, yy = y - 18 * s - k * 9 * s; g.fillStyle = k % 2 ? '#1e3226' : '#24382a'; g.beginPath(); g.ellipse(x + 6 * s + k * 2 * s, yy, w / 2, 5 * s, -0.12, 0, 7); g.fill(); } };
    for (const [x, y, s] of [[18, 226, 1.4], [100, 214, 1.1], [258, 210, 0.9], [560, 212, 1.2], [612, 220, 1.5], [520, 206, 0.8]]) pine(x, y, s);
    // the schoolhouse: white clapboard gone grey, one room, boarded windows, a date board
    const sx = 150, sy = 140;
    r(sx, sy, 120, 80, '#c8c0b4'); for (let y = sy + 2; y < sy + 80; y += 4) r(sx, y, 120, 1, '#b0a89c');
    for (let i = 0; i < 30; i++) r(sx - 6 + i * 2, sy - i, 132 - i * 4, 1, i % 6 ? '#5a4a4a' : '#4a3a3a');
    for (const x of [sx + 10, sx + 88]) { r(x, sy + 22, 22, 30, '#2a2a30'); for (let k = 0; k < 3; k++) r(x - 2, sy + 26 + k * 9, 26, 4, '#8a7a62'); r(x - 2, sy + 20, 26, 3, '#e8e4dc'); }
    r(sx + 46, sy + 30, 28, 50, '#4a3a2e'); r(sx + 44, sy + 26, 32, 4, '#e8e4dc'); r(sx + 58, sy + 30, 2, 50, '#3a2a20'); r(sx + 68, sy + 54, 3, 3, '#c8a050');
    r(sx + 30, sy + 8, 60, 12, '#e8e4dc'); pixText(g, 'GANNET SCHOOL 1889', sx + 33, sy + 11, '#3a3a40');
    r(sx + 116, sy - 30, 10, 22, '#6a4a3a'); r(sx + 114, sy - 32, 14, 3, '#4a3a2e'); // chimney
    r(sx - 2, sy + 78, 124, 4, '#7a6a5a');
    // the bell post: a weathered frame with the school bell still in it
    const bx = 312;
    r(bx, 150, 6, 92, '#5a4a3a'); r(bx + 40, 150, 6, 92, '#5a4a3a'); r(bx - 4, 146, 54, 6, '#4a3a2e'); r(bx + 1, 152, 2, 88, '#7a6a52');
    r(bx + 6, 196, 34, 3, '#4a3a2e');
    g.fillStyle = '#7a5a2a'; g.beginPath(); g.moveTo(bx + 14, 152); g.lineTo(bx + 32, 152); g.lineTo(bx + 36, 176); g.lineTo(bx + 10, 176); g.fill();
    r(bx + 8, 174, 30, 4, '#8a6a32'); r(bx + 21, 176, 4, 5, '#3a2a1a'); r(bx + 16, 156, 3, 16, '#a88040');
    for (let i = 0; i < 6; i++) r(bx - 6 + i * 11, 242, 8, 3, '#3a4a2a'); // a ring of stones at its foot
    // the shack behind the pines: tar paper, a stovepipe, a lit window, a garden, the rod mast
    const hx = 430, hy = 166;
    r(hx, hy, 74, 52, '#3a3a36'); for (let y = hy + 4; y < hy + 52; y += 8) r(hx, y, 74, 1, '#2e2e2a');
    for (let i = 0; i < 14; i++) r(hx - 4 + i * 2, hy - i, 82 - i * 4, 1, '#2a2a2a');
    r(hx + 8, hy + 14, 16, 14, '#f0b860'); r(hx + 15, hy + 14, 2, 14, '#5a3a24'); r(hx + 8, hy + 20, 16, 2, '#5a3a24');
    r(hx + 40, hy + 18, 16, 34, '#5a4030'); r(hx + 52, hy + 34, 2, 2, '#c8a050');
    r(hx + 60, hy - 26, 5, 24, '#2a2a2a'); r(hx + 58, hy - 28, 9, 3, '#1a1a1a');
    // the mast: a dozen fishing rods lashed end to end with wire, stays out to tent pegs
    const mx = hx + 90;
    for (let k = 0; k < 6; k++) { const y0 = 220 - k * 30; r(mx - (k > 3 ? 0 : 1), y0 - 30, k > 3 ? 1 : 2, 32, k % 2 ? '#2a2a2a' : '#4a3a2a'); r(mx - 2, y0 - 2, 5, 2, '#a0a0a8'); }
    for (let k = 0; k < 6; k++) r(mx - 1, 216 - k * 30, 3, 3, k % 2 ? '#c8a050' : '#d84a3a'); // reels still on
    g.strokeStyle = 'rgba(40,40,50,0.8)'; g.lineWidth = 1;
    for (const [ex, ey] of [[mx - 48, 222], [mx + 40, 226], [mx - 16, 224]]) { g.beginPath(); g.moveTo(mx, 70); g.lineTo(ex, ey); g.stroke(); }
    r(mx - 10, 62, 21, 2, '#a0a0a8'); r(mx - 1, 52, 2, 10, '#a0a0a8'); // the dipole
    // the garden: bean poles, a scarecrow in a Coast Guard jacket, a water butt
    for (let i = 0; i < 6; i++) { const x = 400 + i * 14; r(x, 226, 2, 22, '#6a5a3a'); r(x - 3, 230, 8, 3, '#4a7a3a'); r(x - 2, 238, 6, 3, '#5a8a3a'); }
    for (let i = 0; i < 3; i++) r(396, 252 + i * 8, 90, 3, '#4a3a2a');
    r(372, 214, 2, 40, '#5a4a3a'); r(362, 222, 22, 2, '#5a4a3a'); r(366, 218, 14, 14, '#d8602a'); r(368, 210, 10, 8, '#e8d0a0'); r(366, 208, 14, 3, '#4a3a2a');
    r(504, 230, 16, 20, '#3a4a5a'); r(504, 230, 16, 2, '#5a6a7a');
    // a path of crushed shell from the landing to the schoolhouse
    for (let y = 222; y < NH; y++) { const w = 26 + (y - 222) * 0.9; r(300 - w / 2 + (y - 222) * 0.6, y, w, 1, (y % 4) ? '#a8a490' : '#98947e'); }
    for (let i = 0; i < 120; i++) r(270 + R() * 140, 230 + R() * 128, 2, 1, '#e8e4dc');
    // a picket fence, mostly fallen, round the schoolyard
    for (let x = 120; x < 300; x += 7) { const lean = (R() - 0.5) * 3; r(x + lean, 226, 3, 16, '#d8d0c4'); r(x + lean, 224, 3, 2, '#e8e4dc'); }
    r(120, 232, 180, 2, '#b8b0a4');
    return c;
  },
  animate(g, now) {
    // the mast's tip light, and the ferry crawling home
    if (Math.sin(now / 600) > 0.2) rect(g, 519, 50, 2, 2, '#ff6a5a');
    const fx = 56 + (now / 400) % 120;
    rect(g, fx + 30, 197, 3, 2, '#f8e0a0');
    // grass in the wind
    for (let i = 0; i < 26; i++) { const x = (i * 29) % NW, y = 250 + (i * 13) % 100, s = Math.sin(now / 500 + i) * 2; rect(g, x + s, y - 6, 1, 6, '#9a9a5a'); }
    // smoke from the stovepipe
    for (let i = 0; i < 5; i++) { const p = (now / 2400 + i / 5) % 1; rect(g, 492 + p * 30 + Math.sin(now / 400 + i) * 3, 136 - p * 50, 4, 3, `rgba(200,190,200,${0.4 * (1 - p)})`); }
  },
  light(g, now) {
    glow(g, 440, 186, 4, 70, '255,190,100', 0.2 + Math.sin(now / 300) * 0.02);
    glow(g, 300, 196, 30, 320, '255,160,90', 0.1);
  },
  vignette: 0.4
}, 1.5);

// ---- moved from js/quests/nightferry.js
// The back of Gannet Island at 2 a.m.: an old coal dock nobody uses, a boathouse with its doors open,
// a hand truck, and the black water where a launch comes in without lights.
addPlace('gannetDock', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(141);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor('#04060e', '#141c38', y / 200));
    for (let i = 0; i < 220; i++) r(R() * NW, R() * 180, 1, 1, R() < 0.3 ? '#ffffff' : '#6a78a8');
    for (let i = 0; i < 40; i++) r(120 + i * 8 + R() * 6, 30 + Math.sin(i / 6) * 18 + R() * 10, 1, 1, '#a8b0d0'); // the Milky Way, faintly
    // far off, the mainland: Hollow Neck asleep, the point light turning
    r(0, 194, NW, 6, '#0c1024'); for (let i = 0; i < 18; i++) r(R() * 380, 194 + R() * 3, 2, 1, '#e8c070');
    r(372, 186, 4, 10, '#0c1024'); r(372, 184, 4, 2, '#f8f0c0');
    // the sea
    r(0, 200, NW, 90, '#070c1c'); for (let i = 0; i < 200; i++) r(R() * NW, 202 + R() * 86, 4 + R() * 14, 1, R() < 0.5 ? '#101a34' : '#16224a');
    // the bluff and the boathouse, right: shingles, big doors open, a bare bulb inside
    g.fillStyle = '#0e1410'; g.beginPath(); g.moveTo(420, 200); g.quadraticCurveTo(500, 120, NW, 110); g.lineTo(NW, 300); g.lineTo(420, 300); g.fill();
    const bx = 450, by = 150;
    r(bx, by, 150, 110, '#3a3430'); for (let y = by + 3; y < by + 110; y += 5) r(bx, y, 150, 1, '#2e2a26');
    for (let i = 0; i < 26; i++) r(bx - 8 + i * 2, by - i, 166 - i * 4, 1, '#22201e');
    r(bx + 30, by + 30, 90, 80, '#1a1612'); for (let y = by + 32; y < by + 110; y++) r(bx + 32, y, 86, 1, lerpColor('#3a2e1e', '#2a2016', (y - by) / 110));
    r(bx + 74, by + 34, 2, 10, '#2a2a2a'); r(bx + 72, by + 44, 6, 5, '#f8e8b0');
    r(bx + 18, by + 30, 12, 80, '#4a4038'); r(bx + 120, by + 30, 12, 80, '#4a4038'); // the doors, swung back
    r(bx + 40, by + 70, 30, 40, '#5a4630'); r(bx + 80, by + 80, 26, 30, '#5a4630'); r(bx + 40, by + 88, 30, 2, '#c8a040'); // crates waiting inside
    r(bx + 10, by + 10, 70, 10, '#d8d0c0'); pixText(g, 'GANNET COAL CO', bx + 13, by + 12, '#3a3430');
    // the dock: old black timbers on pilings, a ladder down, a bollard, a hand truck
    for (const x of [10, 90, 170, 250, 330, 410]) { r(x, 240, 12, 70, '#1a140e'); r(x, 240, 12, 2, '#3a2c1e'); r(x - 1, 286, 14, 4, '#2a3a2a'); }
    r(0, 254, 460, 14, '#2e241a'); r(0, 254, 460, 2, '#4a3a28'); for (let x = 0; x < 460; x += 11) r(x, 256, 1, 12, '#20180f');
    for (let k = 0; k < 6; k++) r(424, 268 + k * 8, 14, 2, '#3a2c1e'); r(424, 268, 2, 46, '#3a2c1e'); r(436, 268, 2, 46, '#3a2c1e');
    r(60, 238, 16, 16, '#141418'); r(56, 234, 24, 6, '#202024');
    r(300, 214, 30, 40, '#3e3020'); r(300, 230, 30, 2, '#c8a040'); r(296, 206, 4, 48, '#5a5a62'); r(296, 250, 40, 4, '#5a5a62'); // hand truck and a crate
    for (let y = 290; y < NH; y++) r(0, y, NW, 1, lerpColor('#2a2218', '#1a140e', (y - 290) / 70)); // the foreshore
    for (let i = 0; i < 160; i++) r(R() * NW, 292 + R() * 66, 2, 1, R() < 0.5 ? '#3a3024' : '#4a4234');
    for (let i = 0; i < 18; i++) { const x = R() * NW, y = 300 + R() * 50; r(x, y, 10 + R() * 14, 5, '#1e1a16'); r(x + 2, y, 8, 1, '#3a342c'); } // rocks
    return c;
  },
  animate(g, now) {
    // the launch, no running lights, idling off the end of the dock
    const bob = Math.sin(now / 700) * 1.5;
    rect(g, 140, 236 + bob, 64, 10, '#0a0a10'); rect(g, 150, 228 + bob, 22, 8, '#0a0a10'); rect(g, 146, 246 + bob, 56, 2, '#1a2440');
    if (Math.sin(now / 2600) > 0.95) rect(g, 160, 230 + bob, 2, 2, '#f84a3a'); // a cigarette
    for (let i = 0; i < 16; i++) rect(g, (i * 47 + now / 60) % NW, 214 + (i * 13) % 60, 10, 1, 'rgba(120,140,200,0.3)');
    // the point light across the water, turning
    const p = (Math.sin(now / 800) + 1) / 2; rect(g, 366, 184, 16 * p, 1, `rgba(255,240,200,${0.6 * p})`);
  },
  light(g, now) {
    glow(g, 525, 196, 4, 120, '255,220,150', 0.22 + Math.sin(now / 150) * 0.015);
    glow(g, 374, 185, 1, 30, '255,240,200', 0.2);
  },
  vignette: 0.6
}, 1.5);
