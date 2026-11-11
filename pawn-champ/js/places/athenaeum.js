// Pawn Champ - The Athenaeum (and its basement). A scene location, batch A (docs/quests/BATCHES.md, LOCATIONS.md).
//   athenaeum          - the reading room: columns, two storeys of shelves with a gallery, green
//                        lamps on long tables, the circulation desk. Amnesty day (m9) happens here.
//   athenaeumBasement  - the 1904 foundation: granite blocks, pipes, and the cornerstone (M10's finale).
//                        Set view.boxOpen = true once the cornerstone box is out.
//   view.sign = 'AMNESTY: NO FINES'  // optional: the card propped on the desk
'use strict';

addPlace('athenaeum', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(101);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, 262, '#d8ccb0');
    r(0, 0, NW, 16, '#a89a7a'); for (let x = 0; x < NW; x += 16) r(x + 4, 4, 8, 8, '#b8aa88'); // coffered cornice
    // shelves, two storeys, with a gallery and its railing between
    const books = ['#7a2a24', '#2a4a6a', '#3a5a3a', '#8a6a2a', '#5a2a4a', '#2a2a2a', '#a8784a', '#4a3a2a'];
    const shelf = (x, w, y, h) => { r(x, y, w, h, '#4a2e1a'); for (let sy = y + 4; sy < y + h - 4; sy += 22) { r(x + 3, sy, w - 6, 18, '#2a1a10');
      for (let bx = x + 4; bx < x + w - 6;) { const bw = 3 + (R() * 4 | 0), bh = 12 + (R() * 6 | 0); r(bx, sy + 18 - bh, bw, bh, books[R() * books.length | 0]); r(bx, sy + 18 - bh + 2, bw, 1, 'rgba(230,200,120,0.5)'); bx += bw + (R() < 0.1 ? 3 : 0); }
      r(x + 2, sy + 18, w - 4, 3, '#6a4226'); } };
    for (const [x, w] of [[0, 150], [490, 150]]) { shelf(x, w, 22, 92); shelf(x, w, 128, 134); }
    r(0, 112, 150, 6, '#6a4226'); r(490, 112, 150, 6, '#6a4226');
    for (const x0 of [0, 490]) for (let x = x0; x < x0 + 150; x += 8) r(x, 100, 2, 12, '#3a2214'); for (const x0 of [0, 490]) r(x0, 98, 150, 3, '#3a2214');
    // the great arched window over the desk, with the harbor beyond (glass drawn in animate)
    r(222, 26, 196, 176, '#b8aa88'); g.fillStyle = '#b8aa88'; g.beginPath(); g.arc(320, 64, 98, Math.PI, 0); g.fill();
    // two columns framing it
    for (const x of [176, 440]) { r(x, 20, 26, 242, '#e8e0cc'); for (let k = 0; k < 4; k++) r(x + 3 + k * 6, 30, 2, 222, '#c8bca0'); r(x - 6, 18, 38, 10, '#f0e8d8'); r(x - 6, 248, 38, 14, '#c8bca0'); }
    // the circulation desk
    r(232, 196, 176, 12, '#6a4226'); r(232, 196, 176, 3, '#8a5c36'); r(236, 208, 168, 54, '#4a2e1a');
    for (let x = 242; x < 400; x += 40) r(x, 214, 32, 40, '#5a3822');
    r(250, 182, 30, 14, '#3a5a3a'); r(252, 184, 26, 10, '#5a7a5a'); // a returns tray
    for (let i = 0; i < 5; i++) r(290 + i * 6, 180 + (i % 2), 5, 16 - (i % 2), books[i + 1]);
    r(372, 176, 4, 20, '#c8a050'); r(362, 172, 24, 6, '#2e6a3a'); // a desk lamp
    // the card catalogue
    r(152, 196, 22, 66, '#7a4e2c'); for (let y = 0; y < 6; y++) for (let x = 0; x < 2; x++) { r(154 + x * 10, 200 + y * 10, 8, 8, '#8a5c36'); r(157 + x * 10, 204 + y * 10, 2, 1, '#c8a050'); }
    // marble floor in black and white
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#b8b0a0', '#d8d0c0', (y - 262) / 98));
    for (let row = 0; row < 6; row++) { const y = 262 + row * row * 3 + row * 6, h = 6 + row * 4;
      for (let i = -8; i < 20; i++) if ((i + row) % 2) { const x = 320 + i * (30 + row * 8) - (row * 4); r(x, y, 30 + row * 8, h, '#4a4a52'); } }
    r(0, 262, NW, 2, '#6a6458');
    // long reading tables with green lamps
    for (const x of [24, 474]) { r(x, 296, 142, 8, '#6a4226'); r(x, 296, 142, 2, '#8a5c36'); r(x + 6, 304, 6, 34, '#4a2e1a'); r(x + 130, 304, 6, 34, '#4a2e1a');
      for (const lx of [x + 30, x + 100]) { r(lx + 6, 282, 2, 14, '#c8a050'); r(lx, 276, 16, 7, '#2e6a3a'); r(lx + 2, 276, 12, 1, '#4a8a5a'); }
      r(x + 54, 290, 20, 6, '#e8e0cc'); r(x + 63, 290, 1, 6, '#a89a7a'); }
    return c;
  },
  animate(g, now) {
    const night = view.timeOfDay >= 0.9;
    // the arched window: day or night over the harbor
    g.save(); g.beginPath(); g.rect(232, 64, 176, 132); g.arc(320, 64, 88, Math.PI, 0); g.clip();
    for (let y = -24; y < 196; y++) rect(g, 232, y, 176, 1, night ? lerpColor('#0a1028', '#1e2a4a', (y + 24) / 220) : lerpColor('#8ab0d0', '#d0e0ea', (y + 24) / 220));
    rect(g, 232, 160, 176, 36, night ? '#0e1a30' : '#5a7a92');
    for (let i = 0; i < 8; i++) rect(g, 240 + ((i * 37 + now / 60) % 160), 166 + (i * 7) % 26, 10, 1, night ? 'rgba(200,210,240,0.3)' : 'rgba(255,255,255,0.5)');
    rect(g, 380, 130, 6, 30, night ? '#1a2238' : '#e8e4dc'); rect(g, 378, 126, 10, 5, night ? '#f0e090' : '#8a3a2a');
    g.restore();
    for (let x = 232; x < 408; x += 44) rect(g, x, 0, 3, 196, '#8a7a5a');
    rect(g, 232, 120, 176, 3, '#8a7a5a');
    if (view.sign) { const s = String(view.sign).toUpperCase().slice(0, 20), w = textWidth(s, 1) + 8; rect(g, 320 - w / 2, 186, w, 10, '#f4ecd4'); pixText(g, s, 324 - w / 2, 188, '#7a1e24', 1); }
  },
  light(g) {
    const night = view.timeOfDay >= 0.9;
    for (const x of [24, 474]) for (const lx of [x + 38, x + 108]) glow(g, lx, 290, 2, 60, '255,220,140', night ? 0.2 : 0.08);
    glow(g, 374, 182, 2, 50, '255,220,140', 0.14);
    glow(g, 320, 110, 10, 180, night ? '120,140,220' : '255,250,230', night ? 0.06 : 0.12);
  },
  vignette: 0.45
}, 1.5);

addPlace('athenaeumBasement', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(103);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, NH, '#14100c');
    // granite foundation blocks, rough-dressed, mortar between
    for (let y = 30; y < 262; y += 34) for (let x = (y / 34 % 2) * -40; x < NW; x += 80) { const t = R();
      r(x + 2, y + 2, 76, 30, t < 0.33 ? '#5a5a5e' : t < 0.66 ? '#4e4e54' : '#626066'); r(x + 2, y + 2, 76, 2, '#7a787e');
      for (let i = 0; i < 5; i++) r(x + 6 + R() * 66, y + 6 + R() * 22, 2, 2, '#3e3e44'); }
    // the ceiling: joists and pipes
    r(0, 0, NW, 30, '#2a1e14'); for (let x = 10; x < NW; x += 50) r(x, 0, 12, 30, '#3a2a1c');
    r(0, 34, NW, 6, '#6a4a3a'); r(0, 34, NW, 2, '#8a6a5a'); r(0, 46, NW, 4, '#5a5a62');
    for (const x of [120, 410]) { r(x, 34, 10, 10, '#4a3a2a'); }
    // the cornerstone: a bigger, finer block, carved with the date
    r(250, 166, 140, 62, '#8a8680'); r(250, 166, 140, 3, '#aaa6a0'); r(252, 226, 138, 2, '#5a5650');
    pixText(g, 'A.D. 1904', 268, 180, '#4a4640', 3);
    pixText(g, 'OLD HOME WEEK', 278, 204, '#5a5650', 2);
    // old shelving with boxes of minutes and a broken globe
    r(20, 150, 120, 112, '#3a2a1c'); for (let y = 160; y < 262; y += 34) { r(24, y + 26, 112, 4, '#5a4030'); for (let i = 0; i < 4; i++) r(28 + i * 27, y, 24, 26, i % 2 ? '#8a7a5a' : '#7a6a4a'); }
    r(510, 210, 44, 52, '#4a3a2a'); g.fillStyle = '#3a6a8a'; g.beginPath(); g.arc(532, 196, 16, 0, 7); g.fill(); r(526, 190, 10, 6, '#6a8a4a');
    r(560, 230, 60, 32, '#7a6a4a'); r(560, 230, 60, 3, '#8a7a5a');
    // the floor: packed earth and old brick
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a3028', '#4a3e32', (y - 262) / 98));
    for (let i = 0; i < 80; i++) r(R() * NW, 266 + R() * 90, 10 + R() * 8, 4, R() < 0.5 ? '#5a3a2e' : '#4a3226');
    // a stepladder and a crowbar, for the cornerstone
    for (let i = 0; i < 5; i++) r(430 + i * 4, 170 + i * 18, 22, 3, '#8a6a42'); r(428, 166, 3, 96, '#6a4a2a'); r(452, 166, 3, 96, '#6a4a2a');
    r(400, 240, 3, 22, '#5a5a62'); r(398, 238, 7, 3, '#5a5a62');
    return c;
  },
  animate(g, now) {
    // the cornerstone's box, once it's out: a lead box on the floor, its lid off
    if (view.boxOpen) { rect(g, 286, 166, 66, 30, '#14100c'); rect(g, 290, 262, 60, 24, '#7a7e86'); rect(g, 290, 262, 60, 3, '#9aa0a8'); rect(g, 296, 256, 48, 6, '#e8dcc0'); rect(g, 354, 270, 30, 4, '#8a8e96'); }
    // water dripping down the wall
    const p = (now % 2200) / 2200; rect(g, 608, 40 + p * 220, 1, 4, 'rgba(150,170,190,0.6)');
  },
  light(g, now) {
    const f = 0.2 + Math.sin(now / 130) * 0.015;
    glow(g, 320, 150, 6, 230, '255,210,140', f);
    glow(g, 320, 196, 4, 90, '255,220,170', 0.08);
  },
  vignette: 0.7
}, 1.5);
