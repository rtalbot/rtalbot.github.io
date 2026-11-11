// Pawn Champ - The harbormaster's shack on the town pier. A scene location, batch B
// (docs/quests/BATCHES.md, LOCATIONS.md). One room: charts, radios, a coffee maker that never
// stops, filing cabinets back to 1970, and a window on the moorings.
//   harbormaster       - by day (Cut Lines: Tess hears the buoy dispute)
//   harbormasterNight  - after hours, desk lamp and radio glow (Static on Channel 16)
'use strict';

function harbormasterArt(night) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(121);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // knotty pine walls
  r(0, 0, NW, 262, '#a8784a');
  for (let x = 0; x < NW; x += 14) { r(x, 0, 1, 262, '#8a5e38'); for (let k = 0; k < 4; k++) { const y = (x * 13 + k * 71) % 240; g.fillStyle = '#7a5030'; g.beginPath(); g.ellipse(x + 7, y, 2, 3, 0, 0, 7); g.fill(); } }
  r(0, 0, NW, 12, '#5a3a24'); r(0, 12, NW, 3, '#c89a6a');
  // the window on the moorings
  const wx = 230, wy = 40, ww = 190, wh = 110;
  r(wx - 6, wy - 6, ww + 12, wh + 12, '#e8e4dc');
  const sky0 = night ? '#0a1028' : '#9ab0c4', sky1 = night ? '#1e2848' : '#d8dcd8', sea = night ? '#101830' : '#5a7488';
  for (let y = wy; y < wy + 62; y++) r(wx, y, ww, 1, lerpColor(sky0, sky1, (y - wy) / 62));
  r(wx, wy + 62, ww, wh - 62, sea);
  for (let i = 0; i < 40; i++) r(wx + R() * (ww - 12), wy + 64 + R() * (wh - 66), 8, 1, night ? '#2a3458' : '#8aa0b0');
  r(wx, wy + 50, ww, 12, night ? '#0e1426' : '#7a8a96'); for (let i = 0; i < 10; i++) r(wx + i * 19, wy + 44 + (i % 3) * 2, 12, 8, night ? '#141a2e' : '#8a98a2');
  if (night) for (let i = 0; i < 8; i++) r(wx + 6 + i * 23, wy + 52, 2, 2, '#f0c060');
  r(wx + ww / 2 - 2, wy, 4, wh, '#e8e4dc'); r(wx, wy + 54, ww, 3, '#e8e4dc');
  r(wx - 10, wy + wh + 6, ww + 20, 8, '#e8e4dc'); r(wx - 10, wy + wh + 6, ww + 20, 2, '#f8f4ee');
  // on the sill: a pair of binoculars, a barometer, a dying plant
  r(wx + 10, wy + wh - 6, 16, 10, '#2a2a30'); r(wx + 12, wy + wh - 8, 5, 4, '#3a3a40'); r(wx + 20, wy + wh - 8, 5, 4, '#3a3a40');
  r(wx + 150, wy + wh - 12, 14, 18, '#a85a3a'); for (let i = 0; i < 5; i++) r(wx + 152 + i * 2, wy + wh - 20 + (i % 2) * 3, 1, 9, '#8a8a4a');
  // charts pinned on the left wall: the harbor, the approaches, the tide table
  const chart = (x, y, w, h, seed) => { const RR = rng(seed);
    r(x, y, w, h, '#e8e0c8'); r(x, y, w, 2, '#f4eedc'); r(x + 2, y + 2, w - 4, h - 4, '#d8e4e0');
    for (let k = 0; k < 6; k++) { g.strokeStyle = 'rgba(80,120,160,0.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 4, y + 8 + k * (h / 7)); for (let i = 1; i < 10; i++) g.lineTo(x + 4 + i * (w - 8) / 9, y + 8 + k * (h / 7) + (RR() - 0.5) * 8); g.stroke(); }
    g.fillStyle = '#e8d8a0'; g.beginPath(); g.ellipse(x + w * 0.6, y + h * 0.5, w * 0.18, h * 0.12, 0.3, 0, 7); g.fill();
    for (let k = 0; k < 12; k++) r(x + 4 + RR() * (w - 8), y + 4 + RR() * (h - 8), 1, 1, '#3a4a6a');
    r(x + w / 2 - 1, y - 2, 3, 3, '#c83a3a'); };
  chart(20, 30, 90, 70, 7); chart(116, 40, 84, 60, 8);
  r(20, 110, 70, 64, '#f4f0e4'); pixText(g, 'TIDES', 30, 114, '#2a3a5a'); for (let k = 0; k < 8; k++) r(26, 124 + k * 6, 56 - (k % 3) * 8, 1, '#6a6a7a');
  // a cork board of notices, and the clock
  r(96, 112, 110, 62, '#b8875a'); r(96, 112, 110, 3, '#8a5a34');
  for (const [x, y, col] of [[102, 118, '#f4f0e4'], [128, 122, '#f8e070'], [156, 116, '#e8f0f8'], [180, 124, '#f4f0e4'], [110, 146, '#f8c0c0'], [146, 148, '#f4f0e4']]) { r(x, y, 22, 22, col); for (let k = 0; k < 3; k++) r(x + 3, y + 5 + k * 5, 15, 1, '#7a7a80'); r(x + 10, y, 2, 2, '#c83a3a'); }
  clockFace(g, 460, 34, 12, '#2a2a30', '#f4f0e4', [night ? 11 : 12, night ? 40 : 15]);
  // the radio shelf: a bank of sets with dials and channel readouts (lit live)
  r(440, 70, 190, 90, '#5a3a24'); r(440, 70, 190, 3, '#7a5234'); r(440, 114, 190, 3, '#7a5234'); r(440, 157, 190, 3, '#7a5234');
  for (let i = 0; i < 4; i++) { const x = 446 + i * 46; r(x, 80, 40, 30, '#2a2a30'); r(x + 2, 82, 36, 26, '#3a3a42'); r(x + 4, 86, 18, 8, '#0a0a0e'); for (let k = 0; k < 3; k++) { g.fillStyle = '#8a8a90'; g.beginPath(); g.arc(x + 28 + (k % 2) * 6, 88 + k * 6, 2, 0, 7); g.fill(); } }
  for (let i = 0; i < 3; i++) { const x = 448 + i * 60; r(x, 122, 52, 30, '#e8e4dc'); r(x + 4, 126, 44, 10, '#2a2a30'); r(x + 4, 140, 20, 8, '#3a3a40'); }
  r(620, 60, 2, 12, '#2a2a30'); r(614, 58, 14, 2, '#2a2a30'); // a handset hanging on its cord
  // filing cabinets, decades of them
  for (let i = 0; i < 3; i++) { const x = 440 + i * 64; r(x, 176, 56, 86, i === 1 ? '#6a7a6a' : '#7a7a80'); r(x, 176, 56, 2, '#9a9aa0'); for (let k = 0; k < 4; k++) { r(x + 4, 182 + k * 20, 48, 16, shade(i === 1 ? '#6a7a6a' : '#7a7a80', 0.08)); r(x + 22, 188 + k * 20, 12, 3, '#c8c8d0'); r(x + 24, 184 + k * 20, 8, 3, '#f4f0e4'); } }
  pixText(g, '1991', 530, 205, '#2a2a30');
  // the desk: logbooks, a mug, the coffee maker, a VHF handset on its charger
  r(214, 214, 214, 10, '#7a5234'); r(214, 214, 214, 2, '#9a6a44'); r(222, 224, 198, 38, '#5a3a24'); r(226, 228, 90, 30, '#4a2e1c'); r(324, 228, 90, 30, '#4a2e1c');
  r(232, 200, 40, 14, '#2a4a7a'); r(234, 202, 36, 2, '#e8e4dc'); r(236, 190, 36, 10, '#7a2a2a'); r(238, 192, 32, 1, '#e8e4dc');
  r(290, 204, 10, 10, '#e8e4dc'); r(300, 206, 3, 5, '#e8e4dc'); r(291, 205, 8, 2, '#4a2a1a');
  r(372, 186, 26, 28, '#2a2a30'); r(374, 200, 22, 12, 'rgba(120,80,40,0.8)'); r(376, 188, 18, 8, '#3a3a40'); r(394, 194, 3, 3, night ? '#f04a3a' : '#4af06a');
  r(330, 200, 14, 14, '#2a2a30'); r(334, 188, 6, 14, '#3a3a40'); r(336, 182, 2, 6, '#2a2a30');
  // the floor: linoleum, worn grey path from the door to the desk
  for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a6a5a', '#4a4a3e', (y - 262) / 98));
  for (let y = 262; y < NH; y += 14) for (let x = (y / 14 % 2) * 14; x < NW; x += 28) r(x, y, 14, 14, 'rgba(0,0,0,0.06)');
  for (let y = 262; y < NH; y++) { const w = 80 + (y - 262) * 0.6; r(320 - w / 2, y, w, 1, 'rgba(160,160,150,0.12)'); }
  r(0, 262, NW, 2, '#3a2a1a');
  // life jackets on hooks, oilskins, a boathook in the corner
  for (const [x, col] of [[16, '#e86a2a'], [44, '#e8a02a'], [72, '#e86a2a']]) { r(x + 6, 182, 4, 4, '#3a3a3a'); r(x, 186, 18, 36, col); r(x + 8, 186, 2, 36, shade(col, -0.25)); r(x, 196, 18, 2, '#2a2a30'); }
  r(104, 184, 22, 60, '#e8d040'); r(104, 184, 22, 4, '#c8b030'); r(112, 180, 6, 4, '#3a3a3a');
  r(150, 150, 3, 112, '#8a6a4a'); r(146, 146, 10, 6, '#a8a8b0');
  // a stool and a battered armchair for visitors
  r(140, 262, 40, 8, '#6a2a2a'); r(136, 240, 48, 24, '#7a3a3a'); r(136, 240, 8, 30, '#6a2a2a'); r(176, 240, 8, 30, '#6a2a2a');
  return c;
}

function harbormasterAnim(night) {
  return function (g, now) {
    // channel readouts and blinking scan lights
    for (let i = 0; i < 4; i++) { const x = 450 + i * 46; rect(g, x, 87, 16, 6, '#0a0a0e'); pixText(g, String(i === 0 ? 16 : [9, 13, 72][i - 1]), x + 1, 87, i === 0 ? '#ff7a3a' : '#5af07a');
      if (Math.sin(now / (300 + i * 70)) > 0.5) rect(g, x + 34, 82, 2, 2, '#f84a3a'); }
    // coffee steam
    for (let i = 0; i < 4; i++) { const p = (now / 1800 + i / 4) % 1; rect(g, 380 + Math.sin(now / 300 + i) * 3, 186 - p * 26, 2, 3, `rgba(240,240,240,${0.5 * (1 - p)})`); }
    // the boats on their moorings, rocking
    for (let i = 0; i < 3; i++) { const x = 250 + i * 54, y = 128 + Math.sin(now / 900 + i) * 1.5; rect(g, x, y, 22, 4, night ? '#3a4458' : '#e8e4dc'); rect(g, x + 6, y - 6, 8, 6, night ? '#2a3448' : '#d8d4cc'); rect(g, x + 9, y - 22, 1, 16, night ? '#4a5468' : '#8a8a90');
      if (night && i === 1) rect(g, x + 9, y - 23, 1, 1, '#f8f8f8'); }
  };
}

addPlace('harbormaster', {
  build: () => harbormasterArt(false),
  animate: harbormasterAnim(false),
  light(g) { glow(g, 325, 95, 10, 220, '230,236,240', 0.12); },
  vignette: 0.3
}, 1.5);

addPlace('harbormasterNight', {
  build: () => harbormasterArt(true),
  animate: harbormasterAnim(true),
  light(g, now) {
    glow(g, 300, 196, 4, 150, '255,210,140', 0.22);
    for (let i = 0; i < 4; i++) glow(g, 460 + i * 46, 90, 2, 34, i === 0 ? '255,140,70' : '110,240,140', 0.12 + Math.sin(now / 500 + i) * 0.02);
  },
  vignette: 0.55
}, 1.5);
