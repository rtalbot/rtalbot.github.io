// Pawn Champ - The Bonnie Dee, a scallop boat. M24 Waypoints (pitched, PR #35).
//   bonnieWheelhouse - inside the wheelhouse at the fish pier in the rain: the wheel, the radio, the
//                      cracked chartplotter glowing green with its list of waypoints
//   bonnieDeck       - out on the closed bed at night, running dark: the deck, the dredge coming up
//                      on its gantry, the wheelhouse lit only by the plotter, Gannet Island far off
'use strict';

addPlace('bonnieWheelhouse', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(181);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, NH, '#3a3e3a'); r(0, 0, NW, 24, '#2a2e2a'); for (let x = 0; x < NW; x += 40) r(x, 0, 3, 24, '#1e221e');
    // the windows: rain on the glass, the pier outside under its lamps
    for (let i = 0; i < 4; i++) { const x = 30 + i * 150; r(x, 34, 136, 120, '#1a1e1a');
      for (let y = 38; y < 150; y++) r(x + 4, y, 128, 1, lerpColor('#0e1424', '#1e2a3a', (y - 38) / 112));
      r(x + 4, 120, 128, 30, '#1a1e26'); for (let k = 0; k < 3; k++) { r(x + 20 + k * 40, 70, 2, 50, '#2a2a30'); r(x + 16 + k * 40, 66, 10, 4, '#3a3a40'); }
      for (let k = 0; k < 8; k++) r(x + 8 + R() * 120, 122 + R() * 26, 6, 2, '#2a3a5a'); }
    // the console: wheel, throttle, VHF, compass, and the plotter (its screen is live)
    r(0, 170, NW, 92, '#5a4a3a'); r(0, 170, NW, 4, '#7a6a52'); r(0, 258, NW, 4, '#2a2218');
    r(250, 180, 140, 74, '#1a1a1a'); r(254, 184, 132, 66, '#0a0e0a'); // plotter bezel
    g.strokeStyle = '#8a9a8a'; g.lineWidth = 1; g.beginPath(); g.moveTo(300, 184); g.lineTo(318, 210); g.lineTo(312, 230); g.lineTo(330, 250); g.stroke(); // the crack
    r(80, 186, 90, 30, '#2a2a2a'); r(86, 192, 40, 10, '#3a6a3a'); pixText(g, '16', 132, 194, '#e84a3a', 2); r(86, 206, 70, 4, '#4a4a4a'); // VHF
    r(176, 182, 16, 10, '#2a2a2a'); g.fillStyle = '#c8a050'; g.beginPath(); g.arc(184, 200, 10, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(184, 200, 7, 0, 7); g.fill(); // compass
    r(430, 196, 20, 40, '#2a2a2a'); r(434, 186, 10, 14, '#c83a2a'); // throttle
    r(480, 186, 60, 40, '#e8e4d8'); r(480, 186, 60, 12, '#3a6a9a'); for (let i = 0; i < 12; i++) r(484 + (i % 6) * 9, 202 + Math.floor(i / 6) * 9, 7, 7, '#d8d4c8'); // tide calendar
    r(560, 200, 14, 40, '#3a5a8a'); r(562, 194, 10, 6, '#2a2a2a'); // thermos
    // the floor: diamond-plate, wet
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a4e4a', '#5a5e5a', (y - 262) / 98));
    for (let y = 266; y < NH; y += 8) for (let x = (y / 8 % 2) * 8; x < NW; x += 16) { r(x, y, 5, 1, '#6a6e6a'); r(x + 2, y + 1, 1, 1, '#3a3e3a'); }
    for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(150,170,190,0.12)'; g.beginPath(); g.ellipse(R() * NW, 280 + R() * 70, 10 + R() * 20, 2, 0, 0, 7); g.fill(); }
    // oilskins on a hook
    r(600, 40, 4, 4, '#2a2a2a'); r(590, 44, 26, 80, '#e8a020'); r(590, 44, 26, 4, '#f0b840');
    return c;
  },
  animate(g, now) {
    // rain running down the glass
    for (let i = 0; i < 60; i++) { const x = 34 + (i * 37) % 580, y = 38 + ((now / (20 + (i % 5) * 6) + i * 31) % 116); if (x % 150 > 136) continue; rect(g, x, y, 1, 4, 'rgba(180,200,230,0.5)'); }
    // the wheel
    const a = Math.sin(now / 2000) * 0.2; g.save(); g.translate(210, 236); g.rotate(a); g.strokeStyle = '#7a5a34'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 24, 0, 7); g.stroke();
    for (let i = 0; i < 8; i++) { const t = i / 8 * Math.PI * 2; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(t) * 30, Math.sin(t) * 30); g.stroke(); } g.restore();
    // the plotter: a green chart, a dotted track over the closed bed, waypoints blinking
    rect(g, 256, 186, 128, 62, '#04140a');
    for (let i = 0; i < 6; i++) rect(g, 258, 190 + i * 10, 124, 1, 'rgba(60,200,100,0.15)');
    const pts = [[270, 236], [290, 220], [310, 226], [330, 206], [352, 214], [370, 198]];
    pts.forEach(([x, y], i) => { if (i) { const [px, py] = pts[i - 1]; for (let t = 0; t < 1; t += 0.12) rect(g, px + (x - px) * t, py + (y - py) * t, 1, 1, '#5af08a'); }
      if (Math.sin(now / 300 + i) > -0.3) rect(g, x - 1, y - 1, 3, 3, '#cfffd8'); });
    pixText(g, 'WPT 23', 262, 190, '#5af08a');
  },
  light(g, now) {
    glow(g, 320, 216, 4, 140, '90,240,140', 0.18 + Math.sin(now / 300) * 0.01);
    for (let i = 0; i < 4; i++) glow(g, 100 + i * 150, 70, 4, 80, '255,210,140', 0.05);
  },
  vignette: 0.6
}, 1.5);

addPlace('bonnieDeck', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(183);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // a black sky full of stars, and Gannet Island low on the horizon (the sea is drawn live: it rocks)
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor('#02040c', '#0e1630', y / 200));
    for (let i = 0; i < 260; i++) r(R() * NW, R() * 170, 1, 1, R() < 0.2 ? '#ffffff' : '#7a86b8');
    return c;
  },
  animate(g, now) {
    const roll = Math.sin(now / 1400) * 0.035, heave = Math.sin(now / 1100) * 4;
    // the horizon tilts with the boat
    g.save(); g.translate(320, 190 + heave); g.rotate(roll);
    rect(g, -400, 0, 800, 200, '#0a1224');
    g.fillStyle = '#04060e'; g.beginPath(); g.moveTo(-260, 1); g.quadraticCurveTo(-200, -16, -120, -8); g.quadraticCurveTo(-90, -14, -60, 1); g.fill(); // Gannet Island
    for (let i = 0; i < 40; i++) rect(g, -400 + ((i * 61 + now / 30) % 800), 6 + (i * 13) % 80, 8 + (i % 4) * 4, 1, 'rgba(120,140,190,0.35)');
    g.restore();
    // the deck (the boat moves with you, so it holds still on screen)
    rect(g, 0, 246, NW, 114, '#3a3226'); for (let y = 250; y < NH; y += 10) rect(g, 0, y, NW, 1, '#2a2418');
    rect(g, 0, 236, NW, 12, '#5a4a3a'); rect(g, 0, 236, NW, 3, '#7a6a52'); // gunwale
    // the wheelhouse on the right, dark but for the plotter
    rect(g, 470, 90, 170, 160, '#c8c8c0'); rect(g, 470, 90, 170, 6, '#e8e8e0'); rect(g, 470, 80, 170, 12, '#2a3a5a');
    rect(g, 486, 110, 60, 50, '#0a120c'); rect(g, 560, 110, 60, 50, '#0a120c');
    rect(g, 500, 140, 30, 18, `rgb(40,${150 + Math.sin(now / 400) * 20},80)`);
    pixText(g, 'BONNIE DEE', 498, 176, '#2a3a5a', 1.5);
    // the gantry and the dredge coming up full, swinging, streaming water
    rect(g, 150, 40, 8, 206, '#6a6a6a'); rect(g, 330, 40, 8, 206, '#6a6a6a'); rect(g, 150, 36, 188, 8, '#7a7a7a');
    const sw = Math.sin(now / 900) * 14, dy = 120 + Math.sin(now / 2200) * 10;
    g.strokeStyle = '#9a9a9a'; g.lineWidth = 2; g.beginPath(); g.moveTo(244, 44); g.lineTo(244 + sw, dy); g.stroke();
    rect(g, 214 + sw, dy, 60, 6, '#4a4a4a'); // the dredge frame
    for (let y = 0; y < 44; y += 4) for (let x = 0; x < 56; x += 4) rect(g, 216 + sw + x + (y % 8 ? 2 : 0), dy + 6 + y, 2, 2, '#5a5a5a'); // chain bag
    for (let i = 0; i < 14; i++) { const x = 220 + sw + (i * 13) % 48, y = dy + 12 + (i * 7) % 30; g.fillStyle = i === 9 ? '#c8a050' : '#d8b8a0'; g.beginPath(); g.arc(x, y, 4, Math.PI, 0); g.fill(); }
    for (let i = 0; i < 8; i++) { const p = (now / 500 + i / 8) % 1; rect(g, 220 + sw + i * 7, dy + 50 + p * 70, 1, 3, `rgba(180,210,240,${1 - p})`); }
    // a pile of scallops on the culling table
    rect(g, 40, 268, 120, 8, '#6a5a44'); for (let i = 0; i < 24; i++) { g.fillStyle = ['#d8b8a0', '#c8a088', '#e8c8b0'][i % 3]; g.beginPath(); g.arc(48 + (i * 11) % 104, 266 - (i % 3) * 3, 4, Math.PI, 0); g.fill(); }
  },
  light(g, now) {
    glow(g, 515, 150, 4, 120, '90,240,140', 0.16);
    glow(g, 320, 0, 20, 300, '120,140,220', 0.04);
  },
  vignette: 0.65
}, 1.5);
