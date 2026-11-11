// Pawn Champ - The Grange Hall. A scene location, batch A (docs/quests/BATCHES.md, LOCATIONS.md).
// A wooden hall on Front Street with a stage, folding chairs, bunting and a coffee urn. It hosts the
// Benefit Auction (M5), bingo (m3), the Tibbets' anniversary lunch (m2), and other batches' evenings.
//   view.bg = 'grange'
//   view.sign = 'BENEFIT AUCTION'   // optional: the banner over the stage (pixText capitals)
// The windows show day or night from view.timeOfDay (0.9 and later is night, as after closing).
'use strict';

addPlace('grange', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(81);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // pine board walls, honey colored and darkened by a century of coffee and woodsmoke
    r(0, 0, NW, 262, '#7a4e2c');
    for (let x = 0; x < NW; x += 12) { r(x, 0, 1, 262, '#5e3a20'); r(x + 1, 0, 1, 262, '#8a5c36'); for (let i = 0; i < 3; i++) r(x + 3 + (R() * 7 | 0), R() * 250, 1, 4 + R() * 8, '#6a4226'); }
    r(0, 214, NW, 48, '#5e3a20'); r(0, 214, NW, 3, '#9a6a40'); r(0, 258, NW, 4, '#3a2214'); // wainscot rail
    // the ceiling: dark trusses and a plank roof
    r(0, 0, NW, 26, '#3e2614');
    for (let x = -40; x < NW; x += 160) { g.strokeStyle = '#2e1a0e'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, 26); g.lineTo(x + 80, 0); g.lineTo(x + 160, 26); g.stroke(); }
    r(0, 24, NW, 6, '#2e1a0e');
    // tall windows at each side
    for (const x of [26, 562]) { r(x - 5, 54, 62, 138, '#4a2e1a'); r(x - 3, 56, 58, 134, '#d8c8a0'); r(x + 24, 58, 4, 130, '#d8c8a0'); r(x, 120, 52, 4, '#d8c8a0'); r(x - 8, 190, 68, 6, '#9a6a40'); }
    // the stage: a proscenium, maroon curtains, the apron and three steps
    r(186, 40, 268, 168, '#1e1410');
    for (let y = 70; y < 200; y++) r(196, y, 248, 1, lerpColor('#2a1e2a', '#3a2a30', (y - 70) / 130)); // backdrop
    r(180, 34, 280, 12, '#9a6a40'); r(180, 34, 280, 2, '#c8965a'); r(180, 44, 280, 2, '#5e3a20');
    for (const [x0, dir] of [[186, 1], [454, -1]]) for (let i = 0; i < 44; i++) { const x = x0 + dir * i, h = 166 - Math.max(0, (i - 30)) * 3; r(dir > 0 ? x : x - 1, 46, 1, h, i % 6 < 3 ? '#7a1e24' : '#601820'); }
    r(186, 46, 268, 14, '#601820'); for (let x = 186; x < 454; x += 10) r(x, 58, 6, 4, '#7a1e24'); // valance
    r(176, 206, 288, 10, '#a8784a'); r(176, 206, 288, 2, '#c8965a'); r(176, 216, 288, 46, '#5e3a20');
    for (let x = 180; x < 460; x += 24) r(x, 220, 20, 38, '#6a4226');
    for (let i = 0; i < 3; i++) { r(298 + i * 4, 262 - (i + 1) * 12, 44 - i * 8, 12, '#8a5c36'); r(298 + i * 4, 262 - (i + 1) * 12, 44 - i * 8, 2, '#b0804e'); }
    // a lectern on the stage, with a gavel
    r(370, 168, 30, 38, '#4a2e1a'); r(366, 164, 38, 6, '#6a4226'); r(372, 172, 26, 2, '#8a5c36'); r(380, 160, 10, 4, '#3a2214');
    // an upright piano below the stage, a fern on top
    r(110, 196, 60, 66, '#2e1a10'); r(110, 196, 60, 4, '#4a2e1a'); r(114, 228, 52, 6, '#f0ece0'); for (let i = 0; i < 13; i++) r(115 + i * 4, 228, 2, 3, '#1a1a1a');
    r(130, 186, 14, 10, '#8a4a2a'); for (let i = 0; i < 7; i++) r(124 + i * 4, 172 + (i % 3) * 3, 3, 16 - (i % 3) * 3, '#3a6a32');
    // the honor roll: past Masters of the Grange in gold paint
    r(482, 70, 64, 92, '#3a2214'); r(484, 72, 60, 88, '#2a3a2a'); pixText(g, 'GRANGE', 490, 78, '#e2c070', 2);
    for (let i = 0; i < 9; i++) r(490, 96 + i * 7, 36 + (R() * 12 | 0), 2, '#b89a58');
    // the trestle table: the urn, cups, a cash box and a donation jar
    r(470, 226, 96, 6, '#e8e0cc'); r(470, 232, 96, 8, '#d8d0bc'); r(474, 240, 3, 22, '#5a5a5a'); r(558, 240, 3, 22, '#5a5a5a');
    r(484, 198, 22, 28, '#b8bcc4'); r(482, 196, 26, 4, '#d8dce4'); r(486, 202, 2, 20, '#e8ecf4'); r(490, 222, 10, 4, '#3a3a3a'); r(504, 214, 6, 3, '#3a3a3a');
    for (let i = 0; i < 5; i++) r(514 + i * 7, 220, 5, 6, '#f4f0e8');
    r(546, 214, 14, 12, 'rgba(200,220,230,0.6)'); r(546, 212, 14, 2, '#c8a050'); r(549, 220, 3, 4, '#3a8a4a'); r(553, 219, 3, 5, '#3a8a4a');
    // maple floor in perspective
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#9a6a3e', '#b8834e', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(70,40,20,0.35)'; g.lineWidth = 1; g.beginPath(); g.moveTo(320 + i * 20, 262); g.lineTo(320 + i * 52, NH); g.stroke(); }
    for (let i = 0; i < 60; i++) r(R() * NW, 266 + R() * 92, 6 + R() * 18, 1, R() < 0.5 ? '#8a5a32' : '#c8925a');
    r(0, 262, NW, 2, '#4a2a16');
    // folding chairs, two blocks with an aisle up the middle
    const chair = (x, y, s) => { const k = s; r(x, y, 14 * k, 3 * k, '#6a6e78'); r(x, y + 3 * k, 14 * k, 2, '#4a4e58'); r(x + 1, y - 12 * k, 12 * k, 10 * k, '#7a7e88'); r(x + 2, y - 11 * k, 10 * k, 2, '#8a8e98');
      r(x + 1, y + 3 * k, 2, 14 * k, '#3a3e48'); r(x + 11 * k, y + 3 * k, 2, 14 * k, '#3a3e48'); };
    for (let row = 0; row < 2; row++) for (let i = 0; i < 5; i++) { chair(16 + i * 26 + row * 6, 290 + row * 26, 1 + row * 0.15); chair(500 + i * 26 - row * 6, 290 + row * 26, 1 + row * 0.15); }
    // bunting, three swags of little flags
    const flags = ['#c84a3a', '#e8c040', '#3a7ab8', '#f0ece0', '#3a8a5a'];
    for (const [x0, x1, y0, sag] of [[0, 220, 30, 26], [210, 430, 30, 18], [420, NW, 30, 26]]) {
      for (let i = 0; i <= 22; i++) { const t = i / 22, x = x0 + (x1 - x0) * t, y = y0 + Math.sin(t * Math.PI) * sag;
        r(x, y, 10, 1, '#d8d0c0'); if (i < 22) for (let k = 0; k < 6; k++) r(x + 2 + k * 0.5, y + 1 + k, 6 - k, 1, flags[i % flags.length]); } }
    return c;
  },
  lamps: [[150, 62], [320, 70], [490, 62]],
  animate(g, now) {
    const night = view.timeOfDay >= 0.9;
    // the windows: blue night or a white winter day
    for (const x of [26, 562]) for (const [px, py, pw, ph] of [[x, 58, 24, 62], [x + 28, 58, 24, 62], [x, 124, 24, 64], [x + 28, 124, 24, 64]]) {
      for (let y = py; y < py + ph; y++) rect(g, px, y, pw, 1, night ? lerpColor('#0e1630', '#22304e', (y - 58) / 130) : lerpColor('#a8c4dc', '#dce8f0', (y - 58) / 130));
      if (!night) rect(g, px + 3, py + 4, 2, ph - 8, 'rgba(255,255,255,0.5)');
    }
    // hanging lamps
    for (const [x, y] of this.lamps) { rect(g, x, 26, 1, y - 26, '#2a1a10'); rect(g, x - 10, y, 21, 6, '#2e4a3a'); rect(g, x - 12, y + 6, 25, 2, '#2e4a3a'); rect(g, x - 6, y + 8, 13, 2, '#fff0c0'); }
    // the banner over the stage
    if (view.sign) {
      const s = String(view.sign).toUpperCase().slice(0, 22), w = textWidth(s, 2) + 20, x = 320 - w / 2;
      rect(g, x, 66, w, 22, '#f0e8d0'); rect(g, x, 86, w, 2, '#c8b890'); rect(g, x - 2, 64, 2, 26, '#c8b890'); rect(g, x + w, 64, 2, 26, '#c8b890');
      pixText(g, s, x + 10, 72, '#7a1e24', 2);
    }
    // steam from the urn
    for (let i = 0; i < 4; i++) { const p = (now / 2200 + i * 0.25) % 1; rect(g, 494 + Math.sin(now / 400 + i * 2) * 3, 192 - p * 30, 2, 2, `rgba(240,240,240,${0.5 * (1 - p)})`); }
  },
  light(g) {
    for (const [x, y] of this.lamps) glow(g, x, y + 10, 4, 150, '255,214,150', 0.16);
    glow(g, 320, 160, 10, 200, '255,200,140', 0.06);
  },
  vignette: 0.45
}, 1.5);

// ---- moved from js/quests/blessing.js
// The Grange Hall (js/places/grange.js) in a nor'easter: the power out, candles on every table, rain
// sheeting down the tall windows and the lightning showing the harbor for half a second at a time.
addNightVariant('grangeStorm', 'grange', {
  tint: '30,28,52', amount: 0.66,
  paint(g) {
    for (const [x, y] of [[36, 180], [72, 180], [572, 180], [608, 180], [200, 198], [262, 198], [378, 198], [440, 198], [150, 178]]) { rect(g, x, y, 3, 8, '#f4f0e0'); rect(g, x, y - 3, 3, 3, '#f8d070'); }
    for (const [x, y] of [[488, 214], [520, 214], [552, 214]]) { rect(g, x, y, 3, 10, '#f4f0e0'); rect(g, x, y - 3, 3, 3, '#f8d070'); }
  },
  light(g, now) {
    for (const [x, y] of [[37, 177], [73, 177], [573, 177], [609, 177], [201, 195], [263, 195], [379, 195], [441, 195], [151, 175], [489, 211], [521, 211], [553, 211]]) glow(g, x, y, 2, 44, '255,200,120', 0.2 + Math.sin(now / 90 + x) * 0.02);
    const flash = Math.sin(now / 1700) > 0.985 || Math.sin(now / 2300 + 1) > 0.992;
    if (flash) for (const x of [26, 562]) { rect(g, x, 58, 52, 130, 'rgba(200,210,255,0.6)'); }
    for (const x of [26, 562]) for (let i = 0; i < 10; i++) { const y = 58 + ((now / 4 + i * 37) % 130); rect(g, x + (i * 5) % 52, y, 1, 8, 'rgba(160,180,220,0.5)'); }
    if (flash) { g.globalCompositeOperation = 'source-over'; g.fillStyle = 'rgba(200,210,255,0.08)'; g.fillRect(0, 0, NW, NH); }
  }
});
