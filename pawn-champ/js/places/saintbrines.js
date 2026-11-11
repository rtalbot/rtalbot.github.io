// Pawn Champ - Saint Brine's (and its attic). A scene location, batch A (docs/quests/BATCHES.md, LOCATIONS.md).
//   saintbrines       - the children's home's hall, which doubles as the chapel: brick, arched windows,
//                       benches, the kids' drawings, and a bucket under the storm-damaged roof.
//                       Ambrose's show (m8) and Theo's story (m17) happen here at lunch.
//   saintbrinesAttic  - forty years of donations under the eaves, by one bare bulb (M5, scene 1).
// The roof-fund thermometer on the hall wall fills from S.flags.benefitPot (out of $600).
'use strict';

addPlace('saintbrines', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(91);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // red brick, whitewashed long ago and worn back to brick in patches
    r(0, 0, NW, 262, '#8a4a36');
    for (let y = 0; y < 262; y += 8) for (let x = (y / 8 % 2) * 10 - 10; x < NW; x += 20) { const t = R(); r(x + 1, y + 1, 18, 6, t < 0.3 ? '#9a5640' : t < 0.6 ? '#7e4230' : '#8e4c38'); }
    for (let i = 0; i < 9; i++) { const x = R() * NW, y = 20 + R() * 180; g.fillStyle = 'rgba(230,224,210,0.12)'; g.beginPath(); g.ellipse(x, y, 20 + R() * 24, 8 + R() * 10, 0, 0, 7); g.fill(); }
    r(0, 0, NW, 18, '#e8e0d0'); r(0, 18, NW, 3, '#b8ac98');
    // the water stain where the storm came in, and a crack in the plaster
    g.fillStyle = 'rgba(90,70,50,0.45)'; g.beginPath(); g.ellipse(250, 10, 60, 14, 0, 0, 7); g.fill();
    g.strokeStyle = '#6a5a48'; g.lineWidth = 1; g.beginPath(); g.moveTo(220, 18); g.lineTo(232, 40); g.lineTo(226, 58); g.lineTo(240, 80); g.stroke();
    // arched windows with plain stained glass: blue, gold, rose
    const glass = ['#3a6aa8', '#e2b04a', '#c86a7a', '#4a8a6a'];
    for (const x of [40, 496, 572]) {
      r(x - 4, 74, 48, 130, '#5a3022'); g.fillStyle = '#5a3022'; g.beginPath(); g.arc(x + 20, 74, 24, Math.PI, 0); g.fill();
      for (let y = 56; y < 200; y += 10) for (let k = 0; k < 4; k++) { const yy = Math.max(y, 74 - Math.sqrt(Math.max(0, 400 - (k * 10 - 15) ** 2))); r(x + k * 10, yy, 9, y + 9 - yy, glass[(k + y / 10) % 4 | 0]); }
      r(x - 8, 202, 56, 6, '#d8ccb4');
    }
    // the cross and the little altar shelf, with jam-jar flowers
    r(318, 52, 6, 50, '#c8a050'); r(304, 66, 34, 6, '#c8a050');
    r(282, 150, 78, 8, '#6a4226'); r(286, 158, 70, 56, '#4a2e1a'); r(282, 150, 78, 2, '#8a5c36');
    for (const x of [292, 340]) { r(x, 136, 8, 14, 'rgba(200,220,230,0.6)'); for (let i = 0; i < 4; i++) r(x - 2 + i * 3, 126 + (i % 2) * 4, 3, 3, ['#e8c040', '#c84a3a', '#f0ece0', '#c86a9a'][i]); }
    // the kids' drawings, pinned to a cork board: houses, boats, the cat, a nun with a big smile
    r(110, 66, 120, 84, '#a8784a'); r(112, 68, 116, 80, '#c89a62');
    const pics = [[118, 74, '#f0ece0'], [150, 72, '#f4e8a0'], [184, 76, '#e8f0f4'], [122, 110, '#f4e0e0'], [160, 108, '#f0ece0'], [196, 112, '#e8f4e0']];
    for (const [x, y, col] of pics) { r(x, y, 26, 28, col); r(x + 12, y - 1, 2, 2, '#c84a3a');
      const k = R(); if (k < 0.33) { r(x + 6, y + 12, 14, 10, '#c84a3a'); r(x + 4, y + 10, 18, 3, '#3a3a3a'); } else if (k < 0.66) { r(x + 4, y + 18, 18, 4, '#3a6aa8'); r(x + 11, y + 8, 2, 10, '#3a3a3a'); r(x + 13, y + 9, 6, 6, '#f0f0f0'); } else { r(x + 9, y + 8, 8, 8, '#e0b090'); r(x + 7, y + 16, 12, 10, '#2e2e3a'); } }
    // the roof-fund thermometer (filled in animate)
    r(452, 72, 28, 120, '#f0ece0'); r(452, 72, 28, 2, '#c8b890'); pixText(g, 'ROOF', 455, 76, '#7a1e24', 1); pixText(g, 'FUND', 455, 83, '#7a1e24', 1);
    r(463, 94, 6, 82, '#d8d0c0'); g.fillStyle = '#d8d0c0'; g.beginPath(); g.arc(466, 180, 7, 0, 7); g.fill();
    for (let i = 0; i < 6; i++) r(470, 98 + i * 14, 4, 1, '#7a6a5a');
    // wainscot and floor
    r(0, 214, NW, 48, '#6a4226'); r(0, 214, NW, 3, '#8a5c36'); for (let x = 0; x < NW; x += 32) r(x, 222, 28, 34, '#5e3a20');
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#6e4a2e', '#8a5e3a', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(40,24,12,0.35)'; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    r(0, 262, NW, 2, '#3a2214');
    // benches pushed to the walls for the kids to sit on the floor
    for (const [x, w] of [[8, 150], [482, 150]]) { r(x, 276, w, 8, '#7a4e2c'); r(x, 276, w, 2, '#9a6a40'); r(x + 6, 284, 4, 16, '#4a2e1a'); r(x + w - 10, 284, 4, 16, '#4a2e1a'); r(x, 252, w, 6, '#6a4226'); r(x + 2, 258, 3, 18, '#4a2e1a'); r(x + w - 5, 258, 3, 18, '#4a2e1a'); }
    // a braided rug in the middle, where shows happen
    for (let y = 300; y < 346; y++) { const w = 220 + (y - 300) * 2.4; r(320 - w / 2, y, w, 1, ['#3a6aa8', '#c84a3a', '#e8c040', '#3a8a5a'][(y >> 2) % 4]); }
    // a bucket under the leak
    r(236, 270, 26, 22, '#8a9098'); r(234, 268, 30, 4, '#a8b0b8'); r(240, 272, 18, 3, '#4a6a8a');
    return c;
  },
  animate(g, now) {
    // the drip from the stain into the bucket
    const p = (now % 1600) / 1600;
    if (p < 0.8) rect(g, 248, 22 + p / 0.8 * 246, 2, 4, 'rgba(160,190,220,0.8)');
    else rect(g, 242 + (p - 0.8) * 40, 270, 14 - (p - 0.8) * 40, 1, 'rgba(200,220,240,0.7)');
    // the thermometer fills as the benefit raises money
    const pot = Math.min(1, ((S && S.flags && S.flags.benefitPot) || 120) / 600);
    rect(g, 464, 176 - pot * 80, 4, pot * 80 + 2, '#c83a2a'); g.fillStyle = '#c83a2a'; g.beginPath(); g.arc(466, 180, 5, 0, 7); g.fill();
    // light through the colored glass, drifting with the clouds
    const k = 0.5 + Math.sin(now / 3000) * 0.5;
    for (const x of [40, 496, 572]) rect(g, x + 4, 210, 34, 2, `rgba(255,220,160,${0.15 + k * 0.15})`);
  },
  light(g, now) {
    const k = 0.5 + Math.sin(now / 3000) * 0.5;
    for (const x of [60, 516, 592]) glow(g, x, 140, 6, 120, '255,220,170', 0.06 + k * 0.04);
    glow(g, 320, 80, 4, 90, '255,210,130', 0.08);
  },
  vignette: 0.4
}, 1.5);

addPlace('saintbrinesAttic', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(93);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, NH, '#1a120c');
    // the gable end: boards, and the hole the storm tore, under a blue tarp that doesn't quite cover it
    for (let y = 0; y < 262; y++) { const half = 60 + y * 1.25; r(320 - half, y, half * 2, 1, lerpColor('#3a2618', '#4a3220', y / 262)); }
    for (let x = 0; x < NW; x += 14) r(x, 0, 1, 262, 'rgba(20,12,6,0.6)');
    r(380, 40, 90, 60, '#0c1430'); for (let i = 0; i < 30; i++) r(382 + R() * 86, 42 + R() * 56, 1, 1, '#c8d0f0');
    g.fillStyle = '#e8e4d0'; g.beginPath(); g.arc(440, 62, 9, 0, 7); g.fill(); g.fillStyle = '#0c1430'; g.beginPath(); g.arc(444, 59, 8, 0, 7); g.fill();
    for (let i = 0; i < 9; i++) r(370 + i * 3, 36 + i * 8, 6, 8, '#2a1a10'); for (let i = 0; i < 6; i++) r(470 - i * 2, 40 + i * 10, 6, 10, '#2a1a10');
    r(360, 26, 70, 22, '#2a5a9a'); r(360, 26, 70, 3, '#3a6aaa'); r(420, 46, 14, 12, '#2a5a9a');
    // rafters slanting down to the floor on both sides
    for (let i = 0; i < 7; i++) { const x = 40 + i * 44; g.strokeStyle = '#2a1a10'; g.lineWidth = 10; g.beginPath(); g.moveTo(320 - (6 - i) * 8, 0); g.lineTo(x - 200, 262); g.stroke();
      g.beginPath(); g.moveTo(320 + (6 - i) * 8, 0); g.lineTo(NW - x + 200, 262); g.stroke(); }
    r(0, 120, NW, 8, '#2e1c10'); r(0, 120, NW, 2, '#4a3020'); // collar tie
    // floorboards
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a2818', '#5a4028', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(20,12,6,0.5)'; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    // forty years of donations: trunks, boxes, a dress form, a rocking horse, lamps, a birdcage
    const box = (x, y, w, h, col) => { r(x, y, w, h, col); r(x, y, w, 3, shade(col, 0.12)); r(x + w / 2 - 1, y, 2, h, shade(col, -0.12)); };
    box(20, 210, 70, 52, '#8a6a42'); box(30, 176, 50, 34, '#9a7a4e'); box(96, 226, 50, 36, '#7a5a38');
    r(150, 220, 64, 42, '#4a2e22'); r(150, 220, 64, 6, '#6a3e2a'); r(150, 236, 64, 3, '#c8a050'); r(178, 230, 8, 10, '#c8a050'); // trunk
    r(520, 200, 18, 40, '#c8b8a0'); g.fillStyle = '#c8b8a0'; g.beginPath(); g.ellipse(529, 196, 14, 8, 0, 0, 7); g.fill(); r(527, 240, 4, 18, '#3a2a1e'); r(518, 258, 22, 3, '#3a2a1e'); // dress form
    r(440, 230, 50, 14, '#c84a3a'); r(450, 216, 16, 16, '#c84a3a'); r(444, 212, 10, 8, '#e8d8c0'); r(440, 244, 4, 12, '#5a3a24'); r(486, 244, 4, 12, '#5a3a24');
    g.strokeStyle = '#6a4226'; g.lineWidth = 3; g.beginPath(); g.arc(465, 258, 30, 0.2, Math.PI - 0.2); g.stroke(); // rocking horse
    box(560, 214, 64, 48, '#8a6a42'); box(570, 182, 44, 32, '#7a5a38');
    g.strokeStyle = '#b8a060'; g.lineWidth = 1; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(586 + i * 2, 150); g.lineTo(580 + i * 4, 182); g.stroke(); } g.beginPath(); g.arc(592, 152, 6, Math.PI, 0); g.stroke();
    r(240, 238, 30, 24, '#6a7a8a'); r(244, 230, 22, 8, '#e8e0d0'); // a box of plates
    r(380, 226, 40, 36, '#5a4a6a'); r(384, 216, 32, 10, '#d8b878'); // a hatbox stack
    // sheets over furniture, grey ghosts in the dark
    for (const [x, w, h] of [[278, 70, 60], [96, 46, 40]]) { g.fillStyle = '#9a9488'; g.beginPath(); g.moveTo(x, 262); g.quadraticCurveTo(x + w / 2, 262 - h * 2, x + w, 262); g.fill(); r(x + 8, 262 - h * 0.6, 2, h * 0.5, '#8a8478'); }
    return c;
  },
  animate(g, now) {
    // the bare bulb, swinging a little on its cord
    const a = Math.sin(now / 900) * 0.08, bx = 300 + Math.sin(a) * 90, by = 20 + Math.cos(a) * 90;
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 1; g.beginPath(); g.moveTo(300, 20); g.lineTo(bx, by); g.stroke();
    rect(g, bx - 3, by, 6, 4, '#4a4a4a'); g.fillStyle = '#fff4c8'; g.beginPath(); g.arc(bx, by + 8, 5, 0, 7); g.fill();
    this.bulb = [bx, by + 8];
    // dust in the light
    for (let i = 0; i < 16; i++) { const p = (now / 7000 + i * 0.13) % 1; rect(g, 240 + i * 9 + Math.sin(now / 1300 + i) * 8, 120 + p * 140, 1, 1, 'rgba(255,240,200,0.5)'); }
    // the tarp flaps
    const f = Math.sin(now / 240) > 0.3 ? 2 : 0; rect(g, 420, 46 + f, 14, 12 - f, '#2a5a9a');
  },
  light(g) {
    const [x, y] = this.bulb || [300, 110];
    glow(g, x, y, 4, 260, '255,220,150', 0.24);
    glow(g, 425, 70, 4, 60, '140,160,230', 0.08);
  },
  vignette: 0.65
}, 1.5);
