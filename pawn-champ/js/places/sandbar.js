// Pawn Champ - The sandbar and breakwater at low tide. A scene location, batch B
// (docs/quests/BATCHES.md, LOCATIONS.md).
//   sandbar       - by day: wet flats, the granite breakwater, the harbor mouth, a duck blind in
//                   the salt grass at the marsh end   (Red Sea Glass, The Heron Decoy)
//   sandbarNight  - the same flats after dark, by headlamp and a camping lantern   (The Twins' Map)
'use strict';

function sandbarArt(night) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(night ? 93 : 91);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  const P = night
    ? { sky0: '#070b1e', sky1: '#24304e', sea: '#141e36', seaL: '#24345a', far: '#0e1426', sand0: '#3a3a40', sand1: '#22242c', wet: '#2a3040', pool: '#3a4a6e', stone: '#3a3e4a', stoneL: '#4e5462', stoneD: '#24262e', grass: '#2a3424', grassL: '#3a4630', dune: '#30302e' }
    : { sky0: '#8aa8c8', sky1: '#e6dcc8', sea: '#4a6a88', seaL: '#7a98b4', far: '#6a7a8a', sand0: '#c8b48e', sand1: '#a8946e', wet: '#8a8470', pool: '#a8c0d4', stone: '#8a8a88', stoneL: '#acaca6', stoneD: '#5a5a5a', grass: '#8a8a4a', grassL: '#b0a860', dune: '#d4c4a0' };
  // sky
  for (let y = 0; y < 152; y++) r(0, y, NW, 1, lerpColor(P.sky0, P.sky1, y / 152));
  if (night) {
    for (let i = 0; i < 220; i++) r(R() * NW, R() * 130, 1, 1, R() < 0.2 ? '#ffffff' : '#7a86b0');
    g.fillStyle = '#e8e6d8'; g.beginPath(); g.arc(120, 46, 9, 0, 7); g.fill();
    g.fillStyle = P.sky0; g.beginPath(); g.arc(124, 43, 8, 0, 7); g.fill(); // a thin crescent
  } else {
    for (let i = 0; i < 9; i++) { const x = R() * NW, y = 20 + R() * 90, w = 60 + R() * 110; r(x, y, w, 4, 'rgba(255,255,255,0.45)'); r(x + 12, y - 3, w * 0.5, 3, 'rgba(255,255,255,0.35)'); r(x + 6, y + 4, w - 14, 1, 'rgba(120,140,170,0.25)'); }
  }
  // the far shore: town on the left, Gull Point and its lighthouse on the right
  for (let x = 0; x < 300; x += 4) { const h = 6 + Math.abs(Math.sin(x * 0.04)) * 8 + R() * 3; r(x, 150 - h, 5, h, P.far); }
  for (let i = 0; i < 16; i++) { const x = 20 + i * 17, h = 8 + (i * 7) % 12; r(x, 150 - h, 10, h, shade(P.far, i % 2 ? -0.08 : 0.06)); r(x + 1, 150 - h - 3, 8, 3, shade(P.far, -0.15));
    if (night && i % 3) r(x + 3, 150 - h + 3, 2, 2, '#f0c060'); }
  r(120, 116, 3, 30, shade(P.far, -0.1)); r(118, 112, 7, 5, shade(P.far, -0.1)); // the church spire
  g.fillStyle = shade(P.far, -0.05); g.beginPath(); g.moveTo(470, 150); g.lineTo(520, 128); g.lineTo(600, 122); g.lineTo(NW, 126); g.lineTo(NW, 150); g.fill();
  r(574, 96, 8, 28, night ? '#2a2e3a' : '#e8e0d4'); r(574, 104, 8, 5, night ? '#3a1e1e' : '#c84a3a'); r(574, 114, 8, 5, night ? '#3a1e1e' : '#c84a3a'); r(572, 90, 12, 6, '#2a2a34');
  // the sea and the harbor mouth
  r(0, 150, NW, 30, P.sea);
  for (let i = 0; i < 140; i++) r(R() * NW, 151 + R() * 28, 3 + R() * 10, 1, P.seaL);
  // the breakwater: a long arm of granite blocks running out to a small beacon
  for (let i = 0; i < 26; i++) {
    const x = 210 + i * 16, y = 166 - i * 1.2, h = 18 - i * 0.3, w = 18 - i * 0.2;
    r(x, y, w, h, i % 3 ? P.stone : shade(P.stone, -0.06)); r(x, y, w, 2, P.stoneL); r(x + w - 2, y + 2, 2, h - 2, P.stoneD);
    if (i % 4 === 1) r(x + 3, y + 6, 6, 1, P.stoneD);
  }
  r(620, 118, 8, 26, night ? '#4a4a52' : '#d8d8d0'); r(619, 114, 10, 5, '#2a2a30');
  // the flats: wet sand nearest the water, dry sand nearer you
  for (let y = 176; y < NH; y++) r(0, y, NW, 1, lerpColor(P.wet, P.sand0, Math.min(1, (y - 176) / 120)));
  // ripple marks
  for (let y = 186; y < NH; y += 5 + ((y - 186) / 30 | 0)) for (let x = (y * 7) % 23; x < NW; x += 18 + (y - 180) / 6) r(x, y, 8 + (y - 180) / 12, 1, shade(P.sand0, -0.12));
  // tide pools, reflecting the sky
  for (const [x, y, w, h] of [[60, 206, 90, 10], [300, 196, 70, 6], [420, 236, 120, 14], [180, 262, 60, 8], [520, 300, 80, 10]]) {
    g.fillStyle = P.pool; g.beginPath(); g.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 7); g.fill();
    g.fillStyle = shade(P.pool, 0.18); g.beginPath(); g.ellipse(x + w / 2 - 6, y + h / 2 - 1, w / 4, h / 5, 0, 0, 7); g.fill();
    r(x + 6, y + h - 1, w - 12, 1, shade(P.sand1, -0.2));
  }
  // dunes and beach grass at the back left, the salt grass and the blind at the far left
  g.fillStyle = P.dune; g.beginPath(); g.moveTo(0, 196); g.quadraticCurveTo(60, 160, 130, 178); g.quadraticCurveTo(170, 186, 190, 196); g.lineTo(0, 204); g.fill();
  for (let i = 0; i < 160; i++) { const x = R() * 180, y = 172 + R() * 26; const h = 4 + R() * 9; r(x, y - h, 1, h, R() < 0.5 ? P.grass : P.grassL); }
  for (let i = 0; i < 70; i++) { const x = R() * 70, y = 210 + R() * 120, h = 10 + R() * 18; r(x, y - h, 1, h, R() < 0.5 ? P.grass : P.grassL); }
  // the duck blind: a slatted box of grey boards, grass tucked into it
  r(14, 214, 52, 34, shade(P.stone, -0.15)); for (let x = 16; x < 66; x += 6) r(x, 216, 4, 30, shade(P.stone, -0.05));
  r(10, 210, 60, 5, shade(P.stone, -0.3)); r(22, 224, 36, 6, shade(P.stone, -0.45));
  for (let i = 0; i < 30; i++) r(12 + R() * 56, 206 + R() * 10, 1, 6 + R() * 6, P.grassL);
  // the old snow fence along the dune, half buried
  for (let x = 140; x < 270; x += 5) { const h = 10 + (x % 3); r(x, 196 - h + Math.sin(x / 20) * 2, 2, h, night ? '#4a3a32' : '#8a5a3a'); }
  r(140, 190, 130, 1, night ? '#3a2e28' : '#6a4a32');
  // what the tide left: kelp, shells, a lobster buoy, a crab trap, bottle caps that fool detectors
  for (let i = 0; i < 40; i++) { const x = 80 + R() * 560, y = 200 + R() * 150; r(x, y, 6 + R() * 10, 2, night ? '#1e2a20' : '#4a5a2a'); r(x + 2, y - 1, 4, 1, night ? '#2a3a28' : '#6a7a3a'); }
  for (let i = 0; i < 70; i++) { const x = R() * NW, y = 190 + R() * 168; r(x, y, 2, 1, night ? '#5a5a60' : '#f4ecdc'); }
  for (let i = 0; i < 18; i++) { const x = 90 + R() * 540, y = 210 + R() * 140; r(x, y, 2, 2, night ? '#6a6a40' : '#d8b040'); }
  r(470, 280, 34, 18, night ? '#2a2a2a' : '#5a5a4a'); for (let x = 472; x < 504; x += 4) r(x, 282, 1, 14, night ? '#4a4a40' : '#8a8a6a'); r(470, 280, 34, 2, night ? '#3a3a3a' : '#7a7a6a');
  r(452, 282, 8, 12, night ? '#6a2a2a' : '#d84a3a'); r(452, 286, 8, 3, night ? '#8a8a6a' : '#f4ecdc'); r(455, 278, 2, 4, '#5a4a3a');
  // the near sand, dry and soft, with footprints
  for (let i = 0; i < 40; i++) { const x = 240 + i * 9 + Math.sin(i) * 6, y = 360 - i * 3; if (y > 230) { r(x, y, 4, 2, shade(P.sand0, -0.18)); r(x + 6, y - 2, 4, 2, shade(P.sand0, -0.18)); } }
  return c;
}

addPlace('sandbar', {
  build: () => sandbarArt(false),
  animate(g, now) {
    // the tide line, slipping in and out
    const t = (Math.sin(now / 1800) + 1) / 2;
    for (let i = 0; i < 24; i++) rect(g, (i * 37 + now / 60) % NW, 176 + t * 3 + (i % 3), 10 + (i % 4) * 4, 1, 'rgba(255,255,255,0.6)');
    // gulls, wheeling over the breakwater
    for (let i = 0; i < 3; i++) {
      const x = (now / (40 + i * 13) + i * 230) % (NW + 60) - 30, y = 60 + i * 22 + Math.sin(now / 700 + i) * 8, f = Math.sin(now / 120 + i) > 0;
      rect(g, x, y, 3, 1, '#f4f4f4'); rect(g, x + 3, y + (f ? -1 : 1), 3, 1, '#f4f4f4'); rect(g, x - 3, y + (f ? -1 : 1), 3, 1, '#f4f4f4');
    }
    // sun on the pools
    for (let i = 0; i < 8; i++) rect(g, 430 + ((i * 17 + now / 90) % 100), 240 + (i % 3) * 3, 3, 1, 'rgba(255,255,255,0.7)');
  },
  light(g) {
    glow(g, 520, 30, 20, 260, '255,240,210', 0.12);
  },
  vignette: 0.25
}, 1.5);

addPlace('sandbarNight', {
  build: () => sandbarArt(true),
  animate(g, now) {
    const t = (Math.sin(now / 1800) + 1) / 2;
    for (let i = 0; i < 20; i++) rect(g, (i * 41 + now / 70) % NW, 176 + t * 3 + (i % 3), 8 + (i % 4) * 4, 1, 'rgba(160,180,220,0.45)');
    // the breakwater beacon: green, every four seconds
    if ((now % 4000) < 500) rect(g, 621, 115, 6, 3, '#6af0a0');
    // the camping lantern on the sand, and a dug hole with a bucket beside it
    rect(g, 352, 296, 30, 6, '#14141a'); rect(g, 354, 296, 26, 2, '#0a0a10');
    rect(g, 388, 288, 10, 12, '#3a6aa0'); rect(g, 388, 288, 10, 2, '#5a8ac0'); rect(g, 390, 284, 6, 1, '#8a8a8a');
    rect(g, 330, 286, 8, 12, '#2a2a30'); rect(g, 331, 288, 6, 8, `rgba(255,230,160,${0.8 + Math.sin(now / 160) * 0.1})`);
  },
  light(g, now) {
    glow(g, 334, 292, 4, 120, '255,214,140', 0.26 + Math.sin(now / 160) * 0.03);
    if ((now % 4000) < 500) glow(g, 624, 116, 2, 40, '110,240,160', 0.3);
    glow(g, 122, 46, 4, 90, '200,200,230', 0.08);
    // a headlamp beam sweeping the flats
    const a = Math.sin(now / 1300) * 0.5;
    for (let k = 1; k < 7; k++) glow(g, 300 + Math.sin(a) * k * 30, 300 - k * 4 + Math.cos(a) * k * 2, 1, 14 + k * 3, '230,240,255', 0.07);
  },
  vignette: 0.55
}, 1.5);

// ---- moved from js/quests/barrowboy.js
addNightVariant('sandbarBoat', 'sandbar', {
  tint: '250,160,120', amount: 0.42,
  paint(g) {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // sawhorses, a crate with a lantern on it, a tarp thrown back
    for (const x of [404, 496]) { r(x, 268, 4, 26, '#4a3424'); r(x + 18, 268, 4, 26, '#4a3424'); r(x - 2, 266, 28, 4, '#6a4a30'); }
    r(540, 276, 26, 18, '#7a5a3a'); r(540, 276, 26, 2, '#9a7a52'); r(548, 266, 8, 10, '#2a2a30');
    g.fillStyle = '#3a5a7a'; g.beginPath(); g.moveTo(380, 262); g.lineTo(410, 248); g.lineTo(420, 270); g.lineTo(386, 288); g.fill();
  },
  light(g, now) { glow(g, 552, 270, 2, 60, '255,210,140', 0.3 + Math.sin(now / 170) * 0.03); }
});

// ---- moved from js/quests/plunge.js
// the breakwater on the Frostbite Club's January dip: a banner, a fire barrel, towels on the rocks
addVariant('plungeBeach', 'sandbar', { keepLight: true,
  paint(g) {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // the bank of snow the plow left along the sea wall, and ice at the water's edge
    for (let i = 0; i < 26; i++) { g.fillStyle = i % 3 ? ICE.snow : ICE.snowShade; g.beginPath(); g.ellipse(i * 26, 236 + (i % 4) * 2, 22, 5, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 18; i++) r(380 + i * 14, 260 + (i % 3), 12, 2, ICE.frost);
    r(260, 186, 1, 50, '#3a3a3a'); r(440, 186, 1, 50, '#3a3a3a');
    r(262, 188, 176, 18, '#2a5a8a'); pixText(g, 'FROSTBITE CLUB JAN DIP', 270, 194, '#f4f0e4');
    for (const [x, col] of [[120, '#e86a8a'], [150, '#e8b030'], [176, '#3a8a5a'], [500, '#c83a2a'], [530, '#e8e4dc']]) { r(x, 300, 22, 6, col); r(x + 2, 298, 18, 2, 'rgba(255,255,255,0.4)'); }
    r(600, 270, 26, 38, '#5a5a62'); r(600, 270, 26, 3, '#3a3a40');
    r(40, 296, 40, 4, '#a8acb0'); r(44, 300, 3, 14, '#8a8e92'); r(74, 300, 3, 14, '#8a8e92'); // folding table
    for (let i = 0; i < 3; i++) r(46 + i * 10, 284, 6, 12, ['#c83a2a', '#3a6a9a', '#e8e4dc'][i]);           // thermoses
  },
  animate(g, now) { for (let i = 0; i < 4; i++) { const h = 6 + Math.abs(Math.sin(now / (90 + i * 13) + i)) * 9; rect(g, 602 + i * 6, 270 - h, 5, h, i % 2 ? '#e86a1a' : '#f8b030'); } },
  light(g, now) { glow(g, 613, 266, 4, 60, '255,160,70', 0.18 + Math.sin(now / 90) * 0.02); },
  music: 'winter'
});
