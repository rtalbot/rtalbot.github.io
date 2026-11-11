// Pawn Champ - Harbor Green. Batch C (docs/quests/BATCHES.md, LOCATIONS.md).
//   green       - the town green on the night of the Harvest Fair: the bandstand, tents, a dunk
//                 tank, strings of bulbs, the war memorial and the harbor beyond
//   greenNight  - the same green after everyone has gone home, where the breakwater starts
//   greenDay    - an ordinary weekday lunchtime: Gus Lindqvist's chess table by the memorial
// Used by M8 The Thing in Dory's Freezer, M12 The Breakwaters Reunion, the Harvest Fair hub and
// m1 The Missing Queen. The sea thing itself is drawn by drawSeaThing() in js/places/coldroom.js.
'use strict';

const GREEN = {
  // bulbs strung between the poles: [x0, y0, x1, y1, sag]
  strings: [[0, 92, 150, 104, 16], [150, 104, 330, 96, 20], [330, 96, 470, 110, 14], [470, 110, 640, 98, 18]],
  bulbCols: ['#f8d070', '#f08a5a', '#8ad0f0', '#a8e08a', '#f0a0d0']
};
function greenBulbs(each) {
  for (const [x0, y0, x1, y1, sag] of GREEN.strings) {
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag;
      each(x, y, i);
    }
  }
}

function buildGreen(mode) {
  const night = mode === 'night', day = mode === 'day';
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(night ? 83 : 81);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // sky: a late-autumn dusk for the fair, full dark after
  for (let y = 0; y < 200; y++) r(0, y, NW, 1, night ? lerpColor('#0c1226', '#1e2a44', y / 200) : day ? lerpColor('#6aa0d0', '#d8e6ee', y / 200) : lerpColor('#2a2448', '#e08a5a', Math.pow(y / 200, 1.6)));
  if (day) for (const [x, y, w] of [[60, 40, 70], [300, 64, 90], [500, 30, 60]]) { g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(x, y, w / 2, 8, 0, 0, 7); g.ellipse(x + w / 5, y - 6, w / 4, 8, 0, 0, 7); g.fill(); }
  else for (let i = 0; i < (night ? 90 : 25); i++) r(R() * NW, R() * (night ? 160 : 70), 1, 1, night ? '#e8ecf8' : '#f0e0d0');
  if (night) { g.fillStyle = 'rgba(230,236,250,0.12)'; g.beginPath(); g.arc(520, 46, 26, 0, 7); g.fill(); g.fillStyle = '#e8ecf0'; g.beginPath(); g.arc(520, 46, 12, 0, 7); g.fill(); }
  // far shore: Gull Point and its lighthouse on the headland
  g.fillStyle = night ? '#141a2a' : day ? '#6a8a7a' : '#4a3a52';
  g.beginPath(); g.moveTo(380, 196); g.lineTo(440, 180); g.lineTo(520, 176); g.lineTo(600, 184); g.lineTo(640, 190); g.lineTo(640, 200); g.lineTo(380, 200); g.fill();
  r(560, 150, 6, 30, night ? '#2a3040' : '#d8d0c8'); r(558, 146, 10, 5, night ? '#1a2030' : '#3a3040'); r(560, 140, 6, 6, night ? '#1a2030' : '#3a3040');
  // the harbor, with moored boats
  for (let y = 196; y < 236; y++) r(0, y, NW, 1, night ? lerpColor('#141e34', '#0e1626', (y - 196) / 40) : day ? lerpColor('#5a8ab0', '#2a5a80', (y - 196) / 40) : lerpColor('#7a6a8a', '#3a4a6a', (y - 196) / 40));
  for (let i = 0; i < 60; i++) r(R() * NW, 198 + R() * 36, 4 + R() * 12, 1, night ? 'rgba(160,180,230,0.25)' : day ? 'rgba(255,255,255,0.35)' : 'rgba(250,200,160,0.35)');
  for (const [x, w, col] of [[40, 34, '#e8e4dc'], [120, 26, '#c84a3a'], [250, 40, '#e8e4dc'], [420, 30, '#3a6a8a']]) {
    r(x, 210, w, 6, night ? shade(col, -0.6) : col); r(x + 3, 216, w - 6, 3, night ? '#0a0e18' : '#2a2a3a');
    r(x + w / 2, 176, 1, 34, night ? '#3a4050' : '#5a5060'); r(x + w / 2 - 6, 204, 8, 6, night ? '#2a3040' : '#e8e4dc');
  }
  // the seawall along the green
  r(0, 236, NW, 10, night ? '#3a3e48' : '#7a7480'); for (let x = 0; x < NW; x += 18) r(x, 236, 1, 10, night ? '#2a2e38' : '#5a5460'); r(0, 236, NW, 2, night ? '#4a505a' : '#9a94a0');
  // the grass, mown for the fair
  for (let y = 246; y < NH; y++) r(0, y, NW, 1, night ? lerpColor('#1a2a22', '#101a14', (y - 246) / 114) : day ? lerpColor('#6a9a4a', '#4a7a3a', (y - 246) / 114) : lerpColor('#4a6a3a', '#2e4a2a', (y - 246) / 114));
  for (let i = 0; i < 600; i++) r(R() * NW, 248 + R() * 112, 1, 2 + R() * 2, night ? (R() < 0.5 ? '#22342a' : '#142018') : (R() < 0.5 ? '#5a7a44' : '#3a5a32'));
  // the path across the green, worn into the grass
  for (let y = 250; y < NH; y++) { const w = 30 + (y - 250) * 1.1; r(300 - w / 2 + (y - 250) * 0.5, y, w, 1, night ? '#2a2a26' : (y % 6 ? '#8a7a5a' : '#7a6a4a')); }
  // the war memorial: a granite obelisk on a plinth, wreath at the foot
  { const x = 96, base = 262;
    r(x - 18, base - 10, 36, 10, night ? '#3a3e46' : '#8a8a90'); r(x - 14, base - 18, 28, 8, night ? '#444852' : '#9a9aa0');
    for (let i = 0; i < 70; i++) { const w = 14 - i * 0.12; r(x - w / 2, base - 18 - i, w, 1, night ? (i % 9 ? '#4a4e58' : '#3a3e48') : (i % 9 ? '#a8a8ae' : '#9a9aa2')); }
    r(x - 2, base - 92, 4, 4, night ? '#4a4e58' : '#b0b0b6');
    pixText(g, '1917', x - 7, base - 34, night ? '#2a2e36' : '#6a6a72', 1);
    if (!night) { g.fillStyle = '#3a6a3a'; g.beginPath(); g.arc(x, base - 4, 7, 0, 7); g.fill(); g.fillStyle = '#4a2e1a'; g.beginPath(); g.arc(x, base - 4, 3, 0, 7); g.fill(); r(x - 1, base - 2, 6, 6, '#c83a2a'); } }
  // the bandstand: an octagonal gazebo with a pointed roof and a railing
  { const x = 196, w = 120, floor = 236;
    r(x - 6, floor, w + 12, 18, night ? '#2a2420' : '#e8e0d0'); r(x - 6, floor, w + 12, 2, night ? '#3a3430' : '#f8f4ea');
    for (let i = 0; i < 6; i++) r(x + i * 24, floor + 4, 14, 10, night ? '#1a1612' : '#4a3a2e');
    for (let i = 0; i < 6; i++) r(x + i * (w / 5) - 2, floor - 74, 4, 74, night ? '#3a3430' : '#f0ece4');
    for (let i = 0; i < 30; i++) r(x + i * 4, floor - 22, 2, 22, night ? '#2e2a26' : '#e0dace'); r(x - 2, floor - 24, w + 4, 3, night ? '#3a3430' : '#f4f0e8');
    for (let i = 0; i < 40; i++) r(x - 12 + i * 0.4, floor - 78 - i, w + 24 - i * 0.8, 1, night ? '#24201e' : (i % 4 ? '#5a6a7a' : '#4a5a6a'));
    r(x + w / 2 - 1, floor - 126, 2, 10, night ? '#3a3430' : '#c8a050');
    r(x - 12, floor - 80, w + 24, 4, night ? '#3a3430' : '#e8e4dc');
    if (!night) { for (let i = 0; i < 12; i++) { const bx = x - 10 + i * 12; g.fillStyle = i % 2 ? '#c83a2a' : '#e8e4dc'; g.beginPath(); g.moveTo(bx, floor - 76); g.lineTo(bx + 12, floor - 76); g.lineTo(bx + 6, floor - 68); g.fill(); } } }
  if (day) {
    // Gus's stone chess table by the memorial, two stools, and a pigeon who has seen it all
    r(150, 278, 56, 6, '#8a8a90'); r(150, 278, 56, 2, '#a8a8ae'); r(172, 284, 12, 22, '#7a7a80'); r(164, 304, 28, 4, '#6a6a70');
    for (let i = 0; i < 8; i++) r(156 + i * 5.5, 274, 5, 4, i % 2 ? '#2a2a2e' : '#e8e4dc');
    for (const x of [130, 214]) { r(x, 292, 14, 5, '#8a8a90'); r(x + 4, 297, 6, 12, '#7a7a80'); }
    r(240, 300, 8, 5, '#8a8a98'); r(246, 298, 4, 3, '#6a6a7a'); r(249, 299, 2, 1, '#e0a020');
    // the poles stand bare until the fair
    for (const x of [150, 330, 470]) { r(x - 1, 90, 3, 160, '#5a4e44'); r(x - 3, 248, 7, 3, '#3a3228'); }
  } else if (!night) {
    // Sandoval's tent: a black pop-up with a TV-show banner and a camera on legs
    { const x = 360;
      r(x, 196, 100, 62, '#1e1e26'); for (let i = 0; i < 16; i++) r(x - 6 + i * 0.4, 196 - i, 112 - i * 0.8, 1, '#2a2a34');
      r(x + 10, 206, 80, 14, '#e8c040'); pixText(g, 'STRANGE', x + 18, 209, '#1a1a1e', 1); pixText(g, 'SHORES', x + 52, 209, '#c83a2a', 1);
      r(x + 30, 226, 40, 32, '#0e0e14'); r(x + 34, 230, 32, 24, '#3a2a4a');
      r(x + 104, 226, 8, 6, '#2a2a30'); r(x + 112, 227, 4, 3, '#4a6a8a'); r(x + 107, 232, 1, 26, '#3a3a40'); r(x + 101, 232, 1, 26, '#3a3a40'); r(x + 113, 232, 1, 26, '#3a3a40'); }
    // the dunk tank: a cage, a seat on an arm, a target, and a lot of water
    { const x = 492;
      r(x, 226, 60, 34, 'rgba(120,180,220,0.55)'); r(x, 226, 60, 2, '#d8f0ff'); r(x - 2, 224, 2, 38, '#c8c8d0'); r(x + 60, 224, 2, 38, '#c8c8d0');
      for (let i = 0; i < 6; i++) r(x + i * 12, 190, 1, 36, '#a8a8b0'); r(x - 2, 188, 64, 3, '#c8c8d0');
      r(x + 8, 216, 30, 4, '#c84a3a'); r(x + 4, 258, 56, 4, '#3a3a40');
      r(x + 66, 196, 2, 50, '#5a5a62'); g.fillStyle = '#e8e4dc'; g.beginPath(); g.arc(x + 67, 196, 9, 0, 7); g.fill();
      g.fillStyle = '#c83a2a'; g.beginPath(); g.arc(x + 67, 196, 6, 0, 7); g.fill(); g.fillStyle = '#e8e4dc'; g.beginPath(); g.arc(x + 67, 196, 3, 0, 7); g.fill();
      r(x + 4, 180, 52, 8, '#2a5aa0'); pixText(g, 'DUNK', x + 15, 182, '#f8f4e8', 1); }
    // the chowder tent, striped, with a hand-lettered board
    { const x = 576;
      r(x, 206, 64, 52, '#e8e4dc'); for (let i = 0; i < 8; i++) r(x + i * 8, 200, 4, 58, '#c83a2a');
      for (let i = 0; i < 12; i++) r(x - 4 + i * 0.3, 200 - i, 72 - i * 0.6, 1, i % 2 ? '#e8e4dc' : '#c83a2a');
      r(x + 6, 236, 52, 22, '#6a4630'); r(x + 6, 236, 52, 2, '#8a6240');
      r(x + 14, 228, 14, 8, '#b9bec8'); r(x + 34, 228, 14, 8, '#b9bec8'); }
    // pumpkins and hay bales along the front
    for (const [x, y] of [[20, 300], [520, 318], [560, 296], [606, 330]]) { r(x, y, 34, 16, '#c8a04a'); r(x, y, 34, 2, '#e0c060'); for (let i = 0; i < 4; i++) r(x + 2 + i * 8, y + 4, 1, 10, '#a8803a'); }
    for (const [x, y] of [[30, 292], [62, 304], [540, 310], [586, 288]]) { g.fillStyle = '#e07a2a'; g.beginPath(); g.ellipse(x, y, 7, 5, 0, 0, 7); g.fill(); r(x - 1, y - 7, 2, 3, '#3a5a2a'); }
    // poles for the bulb strings
    for (const x of [150, 330, 470]) { r(x - 1, 90, 3, 160, '#3a2e24'); r(x - 3, 248, 7, 3, '#2a221a'); }
  } else {
    // after the fair: an old lamppost and the first granite blocks of the breakwater
    r(420, 150, 3, 98, '#1a1e24'); r(414, 144, 15, 8, '#1a1e24'); r(416, 146, 11, 5, '#f0d080');
    for (let i = 0; i < 9; i++) {
      const bx = 470 + i * 20 - i * i * 0.6, by = 226 - i * 3, bw = 34 - i * 2, bh = 22 - i * 1.4;
      r(bx, by, bw, bh, i % 2 ? '#4a4e58' : '#545862'); r(bx, by, bw, 2, '#6a6e78'); r(bx + bw - 3, by, 3, bh, '#3a3e48');
    }
    for (let i = 0; i < 6; i++) { const bx = 470 + i * 34, by = 248 + (i % 2) * 6; r(bx, by, 32, 26, i % 2 ? '#4a4e58' : '#545862'); r(bx, by, 32, 2, '#6a6e78'); r(bx + 29, by, 3, 26, '#3a3e48'); }
    r(462, 270, 178, 4, '#2a2e36');
    // a bench, and a forgotten paper cup
    r(30, 286, 70, 4, '#3a2e24'); r(30, 276, 70, 3, '#3a2e24'); r(34, 290, 3, 14, '#1a1612'); r(94, 290, 3, 14, '#1a1612');
    r(118, 300, 4, 5, '#c8c0b0');
  }
  return c;
}

addPlace('green', {
  build: () => buildGreen('fair'),
  animate(g, now) {
    // the bulbs twinkle a little, out of step with each other
    greenBulbs((x, y, i) => { const on = Math.sin(now / 400 + i * 1.7 + x) > -0.8; rect(g, x - 1, y, 3, 3, on ? GREEN.bulbCols[i % GREEN.bulbCols.length] : '#4a3a2a'); rect(g, x, y - 2, 1, 2, '#2a2420'); });
    for (const [x0, y0, x1, y1, sag] of GREEN.strings) { g.strokeStyle = 'rgba(30,24,20,0.8)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 + sag * 2, x1, y1); g.stroke(); }
    // ripples in the dunk tank and on the harbor
    for (let i = 0; i < 5; i++) rect(g, 496 + ((now / 30 + i * 13) % 52), 230 + i * 5, 6, 1, 'rgba(230,245,255,0.5)');
    for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 50) % NW, 200 + (i * 17) % 34, 8, 1, 'rgba(255,210,170,0.3)');
    drawSeaThing(g, 'green', now);
  },
  light(g, now) {
    greenBulbs((x, y, i) => { if (i % 3 === 0) glow(g, x, y + 1, 1, 22, '255,200,120', 0.08 + Math.sin(now / 500 + i) * 0.02); });
    glow(g, 256, 210, 10, 90, '255,190,120', 0.1);
    glow(g, 410, 240, 4, 40, '160,120,220', 0.12);
  },
  vignette: 0.4
}, 1.5);

addPlace('greenNight', {
  build: () => buildGreen('night'),
  animate(g, now) {
    for (let i = 0; i < 16; i++) rect(g, (i * 47 + now / 70) % NW, 200 + (i * 13) % 34, 8, 1, 'rgba(170,190,240,0.3)');
    // surf breaking against the breakwater
    const f = (Math.sin(now / 600) + 1) / 2;
    for (const [x, y, w] of [[470, 248, 30], [540, 238, 26], [600, 232, 20]]) rect(g, x, y - f * 3, w * (0.6 + f * 0.4), 2, 'rgba(230,240,255,0.6)');
    drawSeaThing(g, 'greenNight', now);
  },
  light(g, now) {
    glow(g, 421, 150, 3, 90, '255,210,130', 0.22);
    glow(g, 520, 46, 6, 80, '200,210,240', 0.08);
    glow(g, 563, 146, 1, 16, '255,240,200', 0.3 + Math.sin(now / 900) * 0.15);
  },
  vignette: 0.55
}, 1.5);

addPlace('greenDay', {
  build: () => buildGreen('day'),
  animate(g, now) {
    for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 50) % NW, 200 + (i * 17) % 34, 8, 1, 'rgba(255,255,255,0.35)');
  },
  light(g) { glow(g, 320, 0, 20, 300, '255,240,210', 0.06); },
  vignette: 0.3
}, 1.5);

// ---- moved from js/quests/prizeseed.js
// ---------------------------------------------------------------- the weigh-off on the Green
// The fair green with the weigh-off set up in front of the bandstand: a yellow forklift with a
// pumpkin the size of a hatchback on its forks, a platform scale and a big red readout.
const WEIGH = { reading: '----', lift: 0, bare: false }; // bare: weighed without its pallet
addNightVariant('weighoff', 'green', { amount: 0.08, tint: '255,240,220', paint: g => {
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // the banner between the light poles
  r(160, 150, 200, 18, '#e8d8a0'); pixText(g, 'GIANT PUMPKIN WEIGH-OFF', 170, 155, '#a83a1a', 1);
  // the platform scale and its readout on a stand
  r(250, 296, 150, 14, '#7a7a82'); r(250, 296, 150, 3, '#a8a8b0'); r(246, 310, 158, 4, '#4a4a52');
  r(250, 168, 2, 6, '#2a2a2e'); r(282, 168, 2, 6, '#2a2a2e'); r(238, 174, 58, 24, '#1a1a1e');
  // the forklift, left of the scale
  r(80, 250, 110, 50, '#e8b830'); r(80, 250, 110, 4, '#f6d77e'); r(96, 214, 60, 40, '#2a2a2e'); r(100, 218, 52, 30, '#6a8aa0');
  r(186, 190, 8, 120, '#3a3a40'); r(198, 190, 8, 120, '#3a3a40');
  for (const x of [100, 166]) { g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(x, 304, 14, 0, 7); g.fill(); g.fillStyle = '#6a6a72'; g.beginPath(); g.arc(x, 304, 5, 0, 7); g.fill(); }
  // a second pumpkin waiting its turn on a pallet, with a hand-painted sign
  r(480, 300, 90, 8, '#a8803a');
  g.fillStyle = '#c86a1a'; g.beginPath(); g.ellipse(525, 280, 44, 24, 0, 0, 7); g.fill();
  g.fillStyle = '#a84a12'; for (const dx of [-22, 0, 22]) { g.beginPath(); g.ellipse(525 + dx, 280, 6, 22, 0, 0, 7); g.fill(); }
  r(523, 252, 5, 8, '#3a5a2a');
  r(560, 236, 50, 18, '#e8e0cc'); pixText(g, 'AMES', 572, 242, '#a83a2a', 1);
}, animate(g, now) {
  // the pumpkin on the forks rises and swings over the scale as WEIGH.lift goes 0 to 1
  const t = Math.min(1, WEIGH.lift), x = 210 + t * 115, y = 270 - Math.sin(t * Math.PI) * 30 + (t >= 1 ? 6 : 0);
  if (t < 1) rect(g, 200, y + 22, 70, 4, '#5a5a62');
  g.fillStyle = '#d8781e'; g.beginPath(); g.ellipse(x, y, 58, 30, Math.sin(now / 500) * 0.02 * (1 - t), 0, 7); g.fill();
  g.fillStyle = '#b8561a'; for (const dx of [-30, -10, 10, 30]) { g.beginPath(); g.ellipse(x + dx, y, 7, 28, 0, 0, 7); g.fill(); }
  rect(g, x - 3, y - 36, 6, 9, '#3a5a2a');
  if (t >= 1 && !WEIGH.bare) { rect(g, x - 54, y + 20, 108, 7, '#a8803a'); rect(g, x - 54, y + 23, 108, 1, '#7a5a2a'); }
  // the readout
  pixText(g, WEIGH.reading, 244, 180, '#ff4a3a', 2);
} });

// ---- moved from js/quests/skates.js
// the winter carnival rink on the Green: boards, the ice, bulbs strung between the light poles
addVariant('rink', 'greenDay', { keepLight: true,
  paint(g) {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 240, NW, 120, '#e8eef4'); for (let i = 0; i < 80; i++) r((i * 53) % NW, 244 + (i * 29) % 110, 4, 1, ICE.snowShade); // trodden snow over the grass
    r(30, 262, 580, 74, ICE.clear); r(30, 262, 580, 74, 'rgba(200,220,240,0.35)');
    g.strokeStyle = 'rgba(230,240,250,0.6)'; g.lineWidth = 1; for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(320, 299, 60 + i * 16, 10 + i * 2, 0, i, i + 2); g.stroke(); }
    r(26, 256, 588, 8, '#f4f0e4'); r(26, 336, 588, 8, '#f4f0e4'); r(26, 256, 6, 88, '#f4f0e4'); r(608, 256, 6, 88, '#f4f0e4'); r(26, 262, 588, 2, '#c83a2a');
    r(250, 214, 140, 18, '#2a4a6a'); pixText(g, 'WINTER CARNIVAL', 262, 220, '#f4f0e4');
  },
  light(g, now) {
    for (let i = 0; i <= 24; i++) { const x = 20 + i * 25, y = 70 + Math.sin(i / 24 * Math.PI) * 18; rect(g, x, y, 3, 4, ['#f8d070', '#f08a5a', '#8ad0f0', '#a8e08a'][i % 4]); glow(g, x + 1, y + 2, 1, 10, '255,220,140', 0.12 + Math.sin(now / 400 + i) * 0.04); }
  },
  music: 'winter'
});

// ---- moved from js/quests/rufus.js
const RUFUS = { dog: false, collar: false, x: 300 };
// a big shaggy dog, sitting, with or without a collar. (x, y) is where his feet are.
function drawRufusDog(g, x, y, now, collar) {
  const fur = '#b08850', dk = '#7a5a34', lt = '#d0b07a', E = (cx, cy, rx, ry, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.fill(); };
  const wag = Math.sin(now / 120) * 6, breathe = Math.sin(now / 500);
  g.strokeStyle = fur; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 20, y - 12); g.quadraticCurveTo(x + 36, y - 20, x + 34 + wag, y - 34); g.stroke(); g.lineCap = 'butt';
  E(x + 8, y - 16, 22, 16 + breathe, fur); E(x + 2, y - 22, 12, 8, lt); // body
  E(x - 6, y - 34, 12, 18, fur); E(x - 8, y - 30, 7, 10, lt); // chest
  rect(g, x - 12, y - 18, 6, 18, fur); rect(g, x - 3, y - 18, 6, 18, fur); rect(g, x - 13, y - 2, 8, 3, dk); rect(g, x - 4, y - 2, 8, 3, dk); // front legs
  E(x + 18, y - 4, 12, 6, dk); // haunch
  E(x - 10, y - 54, 13, 12, fur); E(x - 22, y - 50, 9, 6, lt); rect(g, x - 32, y - 52, 4, 3, '#1a1410'); // head, muzzle, nose
  rect(g, x - 15, y - 58, 3, 3, '#1a1410'); // eye
  E(x - 2, y - 52, 5, 10, dk); // ear, flopped
  rect(g, x - 26, y - 46, 6, 2, '#c84a5a'); // tongue
  if (collar) { rect(g, x - 16, y - 44, 14, 3, '#2a5aa0'); rect(g, x - 11, y - 41, 4, 4, '#e2b04a'); }
}
addPlace('greenMoon', {
  build() {
    const c = PLACES.greenNight.build(), g = c.getContext('2d');
    // a big full moon over the harbor, low and gold
    for (let i = 6; i > 0; i--) { g.fillStyle = `rgba(250,236,190,${0.04 * i})`; g.beginPath(); g.arc(520, 62, 34 + i * 8, 0, 7); g.fill(); }
    g.fillStyle = '#f8ecc8'; g.beginPath(); g.arc(520, 62, 34, 0, 7); g.fill(); // over the small moon greenNight draws
    for (const [x, y, s] of [[508, 52, 7], [532, 72, 5], [526, 48, 4], [512, 78, 3]]) { g.fillStyle = '#e8d8a8'; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); }
    // the moon's road on the water
    for (let y = 198; y < 236; y += 2) rect(g, 520 - (y - 190) * 0.8 - 6, y, 12 + (y - 190) * 1.6, 1, `rgba(250,236,190,${0.25 - (y - 198) / 200})`);
    // folded clothes on the bench: a man's shirt, trousers, shoes side by side
    rect(g, 40, 280, 22, 6, '#c8c0b0'); rect(g, 64, 280, 22, 6, '#3a4a6a'); rect(g, 44, 304, 8, 4, '#3a2a1e'); rect(g, 56, 304, 8, 4, '#3a2a1e');
    return c;
  },
  animate(g, now) {
    PLACES.greenNight.animate(g, now);
    if (RUFUS.dog) { g.save(); g.translate(RUFUS.x, 330); g.scale(1.6, 1.6); drawRufusDog(g, 0, 0, now, RUFUS.collar); g.restore(); }
  },
  light(g, now) {
    glow(g, 520, 62, 34, 160, '250,236,190', 0.14);
    glow(g, 421, 150, 3, 90, '255,210,130', 0.18);
    void now;
  },
  vignette: 0.5
}, 1.5);
