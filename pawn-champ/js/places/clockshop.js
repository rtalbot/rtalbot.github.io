// Pawn Champ - Moss Clock Repair
// Agathe Moss's late father's shop on Water Street, reopened in her retirement.
// Every wall is clocks. The live clocks (pendulums and hands) are drawn per frame.
'use strict';

const CLOCKSHOP = {
  pendulums: [ // x, top y, length, bob color, period ms
    [52, 150, 70, '#d8b060', 2000], [600, 150, 70, '#d8b060', 2100], [298, 124, 42, '#c8a050', 1300]],
  live: [[556, 112, 12], [300, 64, 12], [440, 50, 20], [52, 104, 15], [600, 104, 15]] // x, y, radius
};
addPlace('clockshop', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(51);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // papered wall: a dark green stripe with a small gold sprig
    r(0, 0, NW, 262, '#2c3a2e');
    for (let x = 0; x < NW; x += 16) { r(x, 0, 8, 262, '#304034'); for (let y = 8 + (x / 16 % 2) * 12; y < 230; y += 24) { r(x + 3, y, 2, 2, '#6a6a3a'); r(x + 2, y + 2, 4, 1, '#55583a'); } }
    r(0, 0, NW, 14, '#1c241e'); r(0, 14, NW, 3, '#7a5a34'); // cornice
    // wainscot
    r(0, 220, NW, 42, '#4a2e1c'); r(0, 220, NW, 3, '#7a5234'); r(0, 258, NW, 4, '#2e1a10');
    for (let x = 8; x < NW; x += 40) { r(x, 228, 32, 26, '#42281a'); r(x, 228, 32, 1, '#5a3a24'); r(x, 253, 32, 1, '#2e1a10'); }
    // floor: worn boards in perspective
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a3020', '#6a4630', (y - 262) / 98));
    for (let i = -10; i < 22; i++) { g.strokeStyle = 'rgba(30,18,10,0.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    for (let i = 0; i < 70; i++) r(R() * NW, 266 + R() * 92, 4 + R() * 14, 1, R() < 0.5 ? '#3a2416' : '#7a5438');
    r(0, 262, NW, 2, '#24140c');
    // the shop window, with the street outside in the rain
    const wx = 84, wy = 44, ww = 150, wh = 160;
    r(wx - 6, wy - 6, ww + 12, wh + 12, '#5a3a24'); r(wx - 4, wy - 4, ww + 8, wh + 8, '#7a5234');
    for (let y = wy; y < wy + wh; y++) r(wx, y, ww, 1, lerpColor('#0e1428', '#1e2640', (y - wy) / wh));
    for (let i = 0; i < 7; i++) { const bx = wx + i * 24 - 4, bh = 30 + (R() * 50 | 0); r(bx, wy + wh - bh, 22, bh, i % 2 ? '#1a2034' : '#161c2e');
      for (let k = 0; k < 4; k++) if (R() < 0.5) r(bx + 4 + (k % 2) * 9, wy + wh - bh + 8 + (k >> 1) * 14, 4, 5, '#f0c060'); }
    r(wx, wy + wh - 16, ww, 16, '#141a26'); r(wx, wy + wh - 16, ww, 1, '#4a5a70'); // wet sidewalk
    r(wx + 110, wy + 70, 3, 74, '#0a0e18'); r(wx + 104, wy + 64, 15, 7, '#0a0e18'); r(wx + 106, wy + 66, 11, 4, '#f8d070'); // street lamp
    r(wx + ww / 2 - 1, wy, 3, wh, '#5a3a24'); r(wx, wy + 56, ww, 3, '#5a3a24'); // glazing bars
    pixTextMirror(g, 'MOSS', wx + 18, wy + 14, '#e2b04a', 3);
    pixTextMirror(g, 'CLOCK REPAIR', wx + 20, wy + 34, '#e2b04a', 1);
    r(wx - 8, wy + wh + 6, ww + 16, 8, '#5a3a24'); r(wx - 8, wy + wh + 6, ww + 16, 2, '#8a6240'); // sill
    // the sill: a row of mantel clocks waiting to be collected, with paper tickets
    for (let i = 0; i < 4; i++) { const x = wx + 4 + i * 37; r(x, wy + wh - 18, 26, 18, i % 2 ? '#6a3a20' : '#3a2416'); r(x, wy + wh - 20, 26, 3, shade(i % 2 ? '#6a3a20' : '#3a2416', 0.2));
      clockFace(g, x + 13, wy + wh - 10, 6, '#c8a050', '#efe6cc', [2 + i * 3, i * 13]); r(x + 18, wy + wh - 2, 6, 8, '#e8e0c8'); r(x + 20, wy + wh - 1, 1, 6, '#c84a3a'); }
    // wall clocks, every size, all at slightly different times
    const fixed = [[110, 26, 7, '#5a3a24'], [206, 26, 7, '#3a2416'], [16, 30, 7, '#8a6a40'], [282, 28, 6, '#8a6a40'], [340, 30, 7, '#5a3a24'], [372, 70, 10, '#c8a050'],
      [404, 112, 7, '#3a2416'], [490, 34, 9, '#5a3a24'], [520, 84, 8, '#7a2a20'], [480, 118, 6, '#c8a050'], [330, 110, 9, '#3a2416'], [624, 30, 7, '#5a3a24']];
    fixed.forEach(([x, y, rad, rim], i) => clockFace(g, x, y, rad, rim, i % 3 ? '#efe6cc' : '#f4eedc', [(i * 5) % 12, (i * 17) % 60]));
    // a sunburst clock
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; g.strokeStyle = '#c8a050'; g.lineWidth = 2; g.beginPath(); g.moveTo(560 + Math.cos(a) * 12, 40 + Math.sin(a) * 12); g.lineTo(560 + Math.cos(a) * (i % 2 ? 22 : 28), 40 + Math.sin(a) * (i % 2 ? 22 : 28)); g.stroke(); }
    clockFace(g, 560, 40, 10, '#c8a050', '#1e2a24', null);
    // a cuckoo clock: carved house, leaves, pine-cone weights
    { const x = 244, y = 62;
      for (let i = 0; i < 14; i++) r(x - 2 + i, y - i, 34 - i * 2, 1, '#3a2416');
      r(x, y, 30, 34, '#5a3a24'); r(x + 2, y + 2, 26, 30, '#6a4630'); r(x + 11, y + 3, 8, 7, '#1a0e08'); r(x + 13, y + 5, 4, 3, '#e8d090');
      clockFace(g, x + 15, y + 20, 7, '#3a2416', '#efe6cc', [9, 10]);
      for (let i = 0; i < 6; i++) r(x - 4 + i * 7, y - 16 + (i % 2) * 3, 6, 4, '#3a5a2a');
      r(x + 8, y + 34, 1, 40, '#2a2a2a'); r(x + 21, y + 34, 1, 54, '#2a2a2a'); r(x + 6, y + 74, 5, 12, '#4a2a18'); r(x + 19, y + 88, 5, 12, '#4a2a18'); }
    // tall-case clocks standing at each side
    for (const x of [32, 580]) {
      r(x - 6, 70, 52, 12, '#3a2012'); for (let i = 0; i < 8; i++) r(x - 6 + i, 70 - i, 52 - i * 2, 1, '#3a2012'); // bonnet
      r(x, 82, 40, 44, '#4a2a18'); r(x + 2, 84, 36, 40, '#2a160c');
      r(x, 126, 40, 104, '#4a2a18'); r(x + 6, 132, 28, 90, '#24120a'); r(x + 7, 133, 26, 88, 'rgba(120,150,170,0.18)'); r(x + 8, 134, 2, 80, 'rgba(200,220,230,0.18)');
      r(x - 4, 228, 48, 34, '#4a2a18'); r(x - 4, 228, 48, 3, '#6a4228'); r(x - 6, 258, 52, 4, '#2a160c');
    }
    // a pendulum regulator on the back wall
    r(282, 100, 32, 84, '#5a3a24'); r(286, 104, 24, 76, '#20120a'); r(287, 105, 22, 74, 'rgba(120,150,170,0.18)'); r(278, 96, 40, 6, '#6a4630'); r(278, 182, 40, 4, '#6a4630');
    // tool board above the bench: screwdrivers, tweezers, a loupe on a hook
    r(326, 140, 150, 58, '#6a5034'); r(326, 140, 150, 2, '#8a6a48');
    const tool = ['#c84a3a', '#2a5aa0', '#e2b04a', '#3a7a4a', '#7a3a7a', '#c8c8c8'];
    for (let i = 0; i < 14; i++) { const x = 334 + i * 10; r(x, 148, 3, 10, tool[i % tool.length]); r(x + 1, 158, 1, 18 + (i % 3) * 4, '#b8b8c0'); }
    for (let i = 0; i < 4; i++) { r(486 + i * 8, 150, 2, 22, '#c8c8d0'); }
    // the drawer cabinet: dozens of tiny labelled drawers
    r(486, 140, 68, 80, '#5a3a24'); r(486, 140, 68, 2, '#7a5234');
    for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) { r(489 + x * 13, 145 + y * 11, 11, 9, '#6a4630'); r(493 + x * 13, 149 + y * 11, 3, 1, '#c8a050'); r(490 + x * 13, 146 + y * 11, 6, 2, '#e8dcc0'); }
    // the workbench, at the back wall under the tool board
    r(312, 214, 264, 10, '#8a6240'); r(312, 214, 264, 2, '#a8805a'); r(312, 224, 264, 38, '#4a2e1c'); r(316, 228, 120, 30, '#3a2214'); r(442, 228, 130, 30, '#3a2214');
    for (let i = 0; i < 3; i++) r(320 + i * 40, 240, 30, 1, '#5a3a24');
    r(330, 206, 110, 8, '#2a5a3a'); r(330, 206, 110, 1, '#3a7a4a'); // bench mat
    // the open watch, its parts laid out on the mat, a loupe and a tray of gears
    clockFace(g, 372, 208, 5, '#c8c8c8', '#efe6cc', null); r(380, 205, 6, 3, '#c8a050');
    for (let i = 0; i < 9; i++) { const x = 392 + i * 5, y = 207 + (i % 2) * 3; r(x, y, 2 + (i % 3), 2, i % 3 ? '#e2b04a' : '#b8b8c0'); }
    r(346, 204, 8, 6, '#1a1a1e'); r(347, 205, 6, 4, '#4a6a8a');
    r(450, 206, 30, 8, '#3a3a40'); for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#e2b04a' : '#c8a050'; g.beginPath(); g.arc(455 + i * 4, 209, 2, 0, 7); g.fill(); }
    // the bench lamp, angled over the mat
    r(430, 212, 18, 3, '#2a2a30'); r(437, 180, 3, 32, '#2a2a30'); r(410, 178, 30, 3, '#2a2a30');
    for (let i = 0; i < 8; i++) r(400 + i, 180 + i, 18 - i, 2, '#2a5a3a');
    r(402, 188, 14, 2, '#f8e0a0');
    // a stool
    r(406, 256, 26, 5, '#6a4630'); r(408, 261, 3, 30, '#3a2416'); r(428, 261, 3, 30, '#3a2416'); r(410, 280, 20, 2, '#3a2416');
    // a coat stand by the door with an umbrella, and a rug
    r(276, 196, 4, 66, '#2a160c'); r(268, 260, 20, 3, '#2a160c'); r(270, 196, 16, 3, '#2a160c'); r(266, 200, 12, 24, '#3a3a52'); r(268, 200, 8, 3, '#4a4a6a');
    for (let y = 300; y < 342; y++) { const w = 240 + (y - 300) * 2.2; r(320 - w / 2, y, w, 1, (y - 300) % 8 < 2 ? '#8a3a2a' : '#6a2a20'); }
    r(320 - 166, 300, 332, 2, '#c8a050'); r(320 - 212, 340, 424, 2, '#c8a050');
    return c;
  },
  animate(g, now) {
    for (const [x, y, len, bob, per] of CLOCKSHOP.pendulums) {
      if (!len) continue;
      const a = Math.sin(now / per * Math.PI * 2) * 0.16;
      const ex = x + Math.sin(a) * len, ey = y + Math.cos(a) * len;
      g.strokeStyle = '#a88040'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 14); g.lineTo(ex, ey); g.stroke();
      g.fillStyle = bob; g.beginPath(); g.arc(ex, ey, len > 50 ? 6 : 4, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,240,200,0.6)'; g.fillRect(ex - 2, ey - 3, 2, 2);
    }
    // the live clocks keep time together: eleven minutes to midnight, and counting
    const sec = Math.floor(now / 1000), mins = 49 + (sec / 60) % 10;
    for (const [x, y, rad] of CLOCKSHOP.live) {
      clockFace(g, x, y, rad, '#5a3a24', '#efe6cc', null);
      clockHands(g, x, y, rad, 11, mins, '#2a1e16');
      const sa = (sec % 60) / 60 * Math.PI * 2 - Math.PI / 2;
      g.strokeStyle = '#a02020'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(sa) * rad * 0.9, y + Math.sin(sa) * rad * 0.9); g.stroke();
    }
    // rain on the window
    for (let i = 0; i < 20; i++) { const x = 86 + (i * 37) % 146, y = 46 + ((now / 5 + i * 47) % 150); rect(g, x, y, 1, 5, 'rgba(160,180,220,0.4)'); }
  },
  light(g, now) {
    glow(g, 409, 196, 4, 150, '255,210,140', 0.26);
    glow(g, 160, 124, 6, 120, '120,150,210', 0.08);
    glow(g, 190, 108, 2, 30, '255,200,110', 0.08);
  },
  vignette: 0.5
}, 1.5);

// ---- moved from js/quests/cuckoo.js
addDayVariant('clockshopDay', 'clockshop', { sky: '190,190,170', amount: 0.32 });
