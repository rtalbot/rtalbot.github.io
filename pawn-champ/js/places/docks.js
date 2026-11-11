// Pawn Champ - Pier Nine, the fish pier on the harbor at night: the first story scene (Four Minutes Late and
// many after). A clapboard fish shack, a lamp, lobster traps, and the container ship and crane across
// the water. Daytime and the blessing of the fleet are variants (docksDay, docksFleet, below).
'use strict';

function buildDocks() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(21);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // night sky and stars
  for (let y = 0; y < 212; y++) r(0, y, NW, 1, lerpColor('#080c22', '#2a3258', y / 212));
  for (let i = 0; i < 160; i++) { const x = R() * NW, y = R() * 170; r(x, y, 1, 1, R() < 0.25 ? '#ffffff' : '#8a98c8'); }
  // moon with a halo and craters
  for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(220,220,240,${0.04 + i * 0.02})`; g.beginPath(); g.arc(516, 56, 34 - i * 6, 0, 7); g.fill(); }
  g.fillStyle = '#f2ecd2'; g.beginPath(); g.arc(516, 56, 19, 0, 7); g.fill();
  r(506, 46, 6, 4, '#dcd4b4'); r(520, 60, 5, 5, '#dcd4b4'); r(512, 64, 3, 3, '#dcd4b4'); r(524, 48, 3, 2, '#dcd4b4');
  // far shore: Hollow Neck across the water, a church steeple and the point light
  for (let x = 0; x < NW; x += 14 + (R() * 10 | 0)) {
    const w = 14 + (R() * 12 | 0), h = 10 + (R() * 22 | 0), y = 210 - h;
    r(x, y, w, h, '#141a32');
    for (let i = 0; i < 4; i++) r(x - 1 + i, y - 4 + i, w + 2 - i * 2, 1, '#141a32');
    if (R() < 0.6) r(x + 3 + (R() * (w - 6) | 0), y + 4 + (R() * (h - 8) | 0), 2, 2, R() < 0.8 ? '#f0c060' : '#c8d8f0');
  }
  r(94, 162, 8, 40, '#141a32'); for (let i = 0; i < 14; i++) r(98 - i / 3, 148 + i, 1 + (i / 1.5 | 0), 1, '#141a32');
  r(96, 174, 4, 5, '#f0c060');
  // sea
  r(0, 208, NW, 152, '#10182f');
  for (let i = 0; i < 260; i++) r(R() * NW, 212 + R() * 70, 4 + R() * 12, 1, R() < 0.5 ? '#1c2848' : '#24325a');
  // moonlight on the water
  for (let y = 212; y < 290; y += 3) { const w = 34 - (y - 212) / 4; r(500 + Math.sin(y * 0.7) * 6 - w / 2 + 16, y, w, 1, '#5a6278'); }
  // cargo ship: hull, containers, bridge, mast lights
  r(268, 182, 196, 22, '#0a0c18'); r(276, 204, 180, 4, '#0a0c18'); r(268, 186, 196, 2, '#7a2a24');
  const box = ['#5a2a24', '#24384a', '#2e3a26', '#4a3a1e', '#3a2440'];
  for (let i = 0; i < 9; i++) for (let j = 0; j < 1 + (i * 7 % 3); j++) {
    const bx = 282 + i * 14, by = 172 - j * 10, col = box[(i + j * 2) % box.length];
    r(bx, by, 13, 10, col); for (let k = 2; k < 13; k += 3) r(bx + k, by + 1, 1, 8, shade(col, -0.25));
  }
  r(418, 146, 34, 36, '#121626'); r(414, 144, 42, 3, '#0a0c18');
  for (let i = 0; i < 4; i++) r(422 + i * 7, 152, 5, 4, '#f0c060');
  r(432, 128, 3, 16, '#0a0c18'); r(426, 132, 15, 2, '#0a0c18'); r(433, 126, 1, 2, '#ff4040');
  r(458, 194, 3, 3, '#c03030'); r(272, 194, 3, 3, '#30c060');
  // harbor crane
  r(540, 76, 6, 132, '#0e1222'); r(568, 76, 6, 132, '#0e1222');
  for (let y = 84; y < 204; y += 14) { for (let i = 0; i < 28; i++) r(540 + i, y + (i / 2 | 0), 1, 1, '#0e1222'); r(540, y, 34, 2, '#0e1222'); }
  r(460, 72, 168, 6, '#0e1222'); for (let x = 466; x < 624; x += 10) r(x, 70, 1, 2, '#0e1222');
  r(478, 78, 1, 50, '#1a1e30'); r(474, 128, 9, 6, '#0e1222'); r(626, 68, 2, 2, '#ff4040');
  // pier deck
  const top = 280;
  r(0, top, NW, 80, '#3e2e22');
  for (let x = 0; x < NW; x += 22) { r(x, top, 1, 80, '#2c2018'); for (let y = top + 10; y < NH; y += 26) { r(x + 4, y + ((x / 22) % 2) * 9, 1, 1, '#7a6a5a'); r(x + 17, y + ((x / 22) % 2) * 9, 1, 1, '#7a6a5a'); } }
  for (let i = 0; i < 60; i++) r(R() * NW, top + 4 + R() * 76, 3 + R() * 10, 1, R() < 0.5 ? '#4a382a' : '#342619');
  r(0, top, NW, 3, '#6a523c'); r(0, top + 3, NW, 2, '#2a1e16');
  // pilings below the deck edge, standing in the water
  for (const x of [32, 214, 400, 590]) { r(x, 252, 12, 30, '#2a1e16'); r(x, 252, 12, 2, '#4a3828'); r(x + 2, 254, 2, 26, '#3a2a1e'); r(x - 2, 270, 16, 3, '#3a3a2a'); }
  // bollards with a mooring line
  for (const x of [176, 520]) { r(x, 266, 14, 16, '#1e1e24'); r(x - 2, 264, 18, 4, '#2a2a32'); r(x + 2, 268, 3, 10, '#3a3a44'); }
  for (let i = 0; i < 40; i++) r(190 + i, 270 - Math.sin(i / 40 * Math.PI) * -10, 1, 1, '#a89070');
  // fish market shed on the left, with its dumpsters (the stakeout hides here)
  r(0, 150, 66, 132, '#5a6a72'); for (let y = 152; y < 280; y += 4) r(0, y, 66, 1, '#4c5c64');
  r(0, 142, 74, 8, '#2a2e34'); r(64, 150, 2, 130, '#e8e4dc');
  r(6, 160, 54, 16, '#e8e4dc'); pixText(g, 'FISH', 14, 163, '#2a5a8a', 2);
  r(10, 196, 20, 20, '#1a2028'); r(12, 198, 16, 16, '#f0c060'); r(19, 198, 2, 16, '#1a2028');
  r(40, 220, 22, 60, '#3a3a40'); r(42, 222, 18, 56, '#2a2a30');
  r(72, 250, 46, 32, '#2a5a3a'); r(70, 246, 50, 6, '#1e4a2c'); r(74, 256, 42, 1, '#1e4a2c'); r(76, 262, 4, 4, '#c8c8b8');
  r(122, 256, 34, 26, '#3a4a6a'); r(120, 252, 38, 6, '#2a3a58');
  // lobster traps and buoys
  const trap = (x, y) => { r(x, y, 34, 22, '#2a4a3a'); for (let i = 0; i < 34; i += 4) r(x + i, y, 1, 22, '#4a7a5a'); for (let j = 0; j < 22; j += 4) r(x, y + j, 34, 1, '#4a7a5a'); r(x, y, 34, 2, '#5a8a6a'); };
  trap(452, 260); trap(486, 260); trap(468, 238);
  for (const [x, y, a, b] of [[514, 246, '#e8e4dc', '#c84a3a'], [524, 252, '#e0b040', '#2a5aa0']]) { r(x, y, 7, 16, a); r(x, y + 5, 7, 5, b); r(x + 3, y - 4, 1, 4, '#8a7050'); }
  // the stencilled crates
  for (const [x, y, w, h] of [[586, 240, 48, 44], [560, 256, 30, 28], [592, 208, 32, 32]]) {
    r(x, y, w, h, '#5a4028'); r(x, y, w, 2, '#7a5838'); r(x, y, 2, h, '#6a4a30');
    r(x, y + (h / 3 | 0), w, 2, '#3a2a1a'); r(x, y + (2 * h / 3 | 0), w, 2, '#3a2a1a');
  }
  pixText(g, 'DESTROYED', 590, 262, '#241810');
  // lamp post
  r(124, 168, 4, 112, '#1a1a22'); r(120, 276, 12, 4, '#1a1a22');
  r(114, 156, 24, 4, '#1a1a22'); r(116, 160, 20, 10, '#1a1a22'); r(118, 162, 16, 6, '#f8d070'); r(124, 150, 4, 6, '#1a1a22');
  // rope coil
  for (let i = 0; i < 4; i++) r(272 + i * 2, 300 - i * 2, 28 - i * 4, 2, i % 2 ? '#9a8060' : '#8a7050');
  return c;
}

addPlace('docks', {
  build: buildDocks,
  animate(g, now) {
    for (let i = 0; i < 18; i++) rect(g, (i * 71 + now / 40) % NW, 214 + (i * 23) % 60, 8, 1, 'rgba(150,170,220,0.35)');
    const blink = Math.sin(now / 500) > 0.6;
    if (blink) { rect(g, 433, 126, 1, 2, '#ffa0a0'); rect(g, 626, 68, 2, 2, '#ffa0a0'); }
  },
  light(g) {
    glow(g, 126, 166, 4, 130, '255,190,90', 0.3);
    glow(g, 20, 206, 2, 40, '255,190,90', 0.15);
  },
  vignette: 0.55
}, 1.5);

// ---- moved from js/quests/blessing.js
// ---------------------------------------------------------------- places: Pier Nine by day and dressed, the Grange in a storm
// Pier Nine by daylight (the main story draws it at midnight, js/art.js): the fish market's roll-up door,
// the auction floor, scallopers along the pier. Dressed, it's the Blessing at dusk: every boat dressed
// overall in signal flags, wreaths on the bows, a dais with a microphone on the end of the pier.
function docksDayBuild(dressed) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(dressed ? 181 : 183);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  for (let y = 0; y < 200; y++) r(0, y, NW, 1, dressed ? (y < 110 ? lerpColor('#3a3a72', '#c86a6a', y / 110) : lerpColor('#c86a6a', '#f8c070', (y - 110) / 90)) : lerpColor('#8ab4d8', '#d8e8f0', y / 200));
  for (let i = 0; i < 9; i++) { const x = R() * NW, y = 30 + R() * 120, w = 50 + R() * 110; r(x, y, w, 4, dressed ? 'rgba(255,190,150,0.5)' : 'rgba(255,255,255,0.7)'); r(x + 12, y - 3, w * 0.5, 3, dressed ? 'rgba(255,200,170,0.4)' : 'rgba(255,255,255,0.6)'); }
  // the far shore and the point light
  r(0, 190, NW, 10, dressed ? '#4a3a5a' : '#6a8a7a'); for (let x = 0; x < NW; x += 6) r(x, 190 - Math.abs(Math.sin(x * 0.03)) * 7, 6, 10, dressed ? '#4a3a5a' : '#6a8a7a');
  r(94, 162, 8, 30, dressed ? '#3a2e4a' : '#e8e4dc'); r(92, 158, 12, 5, dressed ? '#2a2238' : '#c84a3a');
  // water
  r(0, 200, NW, 90, dressed ? '#4a4a7a' : '#3a6a8a'); for (let i = 0; i < 200; i++) r(R() * NW, 202 + R() * 86, 4 + R() * 14, 1, dressed ? (R() < 0.5 ? '#6a5a8a' : '#e8a080') : (R() < 0.5 ? '#5a8aa8' : '#8ab8d0'));
  // scallopers moored along the pier: hulls, wheelhouses, outriggers, the dredges hung up
  const boat = (x, hull, name) => {
    r(x, 222, 150, 22, hull); r(x + 4, 244, 142, 4, shade(hull, -0.3)); r(x, 222, 150, 3, shade(hull, 0.25));
    g.fillStyle = hull; g.beginPath(); g.moveTo(x + 150, 222); g.lineTo(x + 172, 216); g.lineTo(x + 150, 244); g.fill();
    r(x + 90, 184, 44, 38, '#e8e4dc'); r(x + 94, 190, 36, 12, '#3a4a5a'); r(x + 88, 182, 48, 4, shade(hull, -0.2));
    r(x + 30, 130, 3, 92, '#4a4a4a'); r(x + 10, 150, 50, 2, '#4a4a4a'); r(x + 32, 200, 30, 20, '#6a6a62'); for (let k = 0; k < 4; k++) r(x + 33 + k * 7, 202, 2, 16, '#3a3a36'); // the dredge
    pixText(g, name, x + 8, 230, '#f4f0e8');
    if (dressed) { // wreath on the bow
      g.strokeStyle = '#2a6a32'; g.lineWidth = 3; g.beginPath(); g.arc(x + 158, 212, 7, 0, 7); g.stroke(); r(x + 156, 218, 4, 6, '#c82a2a');
    }
  };
  boat(150, '#8a2a2a', 'NOSSA SENHORA');
  boat(390, '#2a5a3a', 'PEG H');
  if (dressed) { // dressed overall: a line of signal flags from bow to masthead to stern on each boat, and between them
    const fl = ['#e8c040', '#c84a3a', '#3a6ab8', '#f4f0e8', '#2a8a4a', '#1e1e22'];
    for (const [x0, y0, x1, y1] of [[140, 220, 180, 130], [180, 130, 320, 216], [380, 220, 420, 130], [420, 130, 562, 216], [320, 216, 380, 220]])
      for (let i = 0; i <= 12; i++) { const t = i / 12, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 6; r(x, y, 7, 7, fl[(i + x0) % fl.length]); r(x, y, 7, 1, 'rgba(0,0,0,0.25)'); }
  }
  // the fish market on the left: roll-up door, KITTREDGE FISH, the auction board
  r(0, 120, 120, 170, '#5a6a72'); for (let y = 122; y < 290; y += 4) r(0, y, 120, 1, '#4c5c64'); r(0, 112, 128, 8, '#2a2e34');
  r(10, 128, 100, 16, '#e8e4dc'); pixText(g, 'KITTREDGE FISH', 16, 133, '#2a5a8a');
  r(14, 186, 92, 100, '#8a9298'); for (let y = 188; y < 286; y += 6) r(14, y, 92, 1, '#6a7278');
  if (!dressed) { r(14, 186, 92, 30, '#1a2028'); r(20, 194, 80, 18, '#2a2e34'); pixText(g, 'AUCTION 6AM', 26, 200, '#f0c060'); }
  // the pier deck
  r(0, 286, NW, 74, '#7a6a58'); for (let x = 0; x < NW; x += 22) r(x, 286, 1, 74, '#5a4a3a');
  for (let i = 0; i < 70; i++) r(R() * NW, 290 + R() * 68, 3 + R() * 10, 1, R() < 0.5 ? '#8a7a64' : '#6a5a48');
  r(0, 286, NW, 3, '#9a8a72');
  for (const x of [130, 370, 600]) { r(x, 274, 14, 14, '#2a2a30'); r(x - 2, 272, 18, 4, '#3a3a42'); }
  if (dressed) { // the dais: bunting, a microphone, a lectern with a cloth
    r(500, 262, 120, 26, '#e8e4dc'); r(500, 262, 120, 3, '#c8a050'); for (let x = 500; x < 620; x += 12) { r(x, 266, 12, 6, x % 24 ? '#c84a3a' : '#3a6ab8'); }
    r(548, 230, 24, 32, '#5a3a24'); r(544, 228, 32, 4, '#e8e4dc'); r(560, 210, 2, 20, '#2a2a30'); r(558, 208, 6, 4, '#2a2a30');
    pixText(g, 'BLESSING OF THE FLEET', 210, 92, '#f8f0e0', 2);
  } else { // fish totes and ice on the floor
    for (let k = 0; k < 4; k++) { const x = 160 + k * 46, y = 300 + (k % 2) * 10; r(x, y, 40, 24, k % 2 ? '#3a7aa8' : '#e8a020'); r(x + 2, y + 2, 36, 6, '#e8f0f4'); }
  }
  return c;
}
addPlace('docksDay', {
  build() { return docksDayBuild(false); },
  animate(g, now) {
    for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 40) % NW, 210 + (i * 13) % 70, 10, 1, 'rgba(230,240,250,0.5)');
    for (let k = 0; k < 3; k++) { const x = (now / (40 + k * 9) + k * 220) % (NW + 40) - 20, y = 60 + k * 26 + Math.sin(now / 300 + k) * 3; rect(g, x, y, 6, 1, '#f4f4f4'); rect(g, x + 2, y - 1, 2, 1, '#f4f4f4'); }
  },
  light() {},
  vignette: 0.25
}, 1.5);
addPlace('docksFleet', {
  build() { return docksDayBuild(true); },
  animate(g, now) {
    for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 50) % NW, 210 + (i * 13) % 70, 10, 1, 'rgba(255,210,180,0.45)');
    // the flags stirring
    for (let i = 0; i < 10; i++) if (Math.sin(now / 200 + i) > 0.7) rect(g, 190 + i * 34, 150 + (i % 3) * 18, 6, 1, 'rgba(255,255,255,0.5)');
  },
  light(g, now) { glow(g, 320, 190, 20, 340, '255,170,110', 0.12 + Math.sin(now / 5000) * 0.02); },
  vignette: 0.35
}, 1.5);
