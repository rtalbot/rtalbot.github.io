// Pawn Champ - The widow's walk on the Cliff Road roof, in a gale (M13 The Widow's Walk).
//   widowsWalk        - the platform in a gale
//   widowsWalkSpring  - the same roof on a still spring morning (One More Spring)
'use strict';

// ---- moved from js/quests/onemorespring.js
addDayVariant('widowsWalkSpring', 'widowsWalk', { sky: '235,225,195', amount: 0.55, animate: false,
  light: (g, now) => glow(g, 470, 60, 10, 160, '255,240,200', 0.25 + 0.03 * Math.sin(now / 900)) });

// ---- moved from js/quests/widow.js
// ---------------------------------------------------------------- the widow's walk in a gale (place)
// The railed platform on the Cliff Road roof: the cupola door, the harbor far below, Gull Point's
// light, and weather coming in sideways.   view.bg = 'widowsWalk'
addPlace('widowsWalk', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(1979);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // storm sky, darker at the top, a bruise of light low over the sea
    for (let y = 0; y < 210; y++) r(0, y, NW, 1, lerpColor('#0a0e1a', '#2a3448', y / 210));
    for (let i = 0; i < 26; i++) { const x = R() * NW, y = 20 + R() * 150, w = 60 + R() * 140; g.fillStyle = `rgba(${R() < 0.5 ? '20,24,36' : '50,58,78'},0.55)`; g.beginPath(); g.ellipse(x, y, w, 10 + R() * 14, 0, 0, 7); g.fill(); }
    // the sea, far below, and the dark line of the coast
    for (let y = 210; y < 300; y++) r(0, y, NW, 1, lerpColor('#141e2c', '#0a1018', (y - 210) / 90));
    r(0, 206, 210, 6, '#0c0e12'); r(0, 202, 120, 6, '#0c0e12');
    // Gull Point and its lighthouse, far off to the right
    g.fillStyle = '#0c0e12'; g.beginPath(); g.moveTo(470, 212); g.lineTo(560, 196); g.lineTo(640, 200); g.lineTo(640, 214); g.fill();
    r(566, 168, 8, 30, '#d8d4c8'); r(564, 164, 12, 5, '#2a2a2a');
    // the cupola: shingles, a lit window, the door you came up through
    r(18, 120, 136, 190, '#3a3a38'); for (let y = 124; y < 306; y += 8) for (let x = 18 + (y / 8 % 2) * 6; x < 152; x += 12) r(x, y, 11, 7, (x + y) % 3 ? '#4a4844' : '#42403c');
    g.fillStyle = '#26262a'; g.beginPath(); g.moveTo(8, 122); g.lineTo(86, 76); g.lineTo(164, 122); g.fill();
    r(84, 64, 4, 14, '#5a5a5a'); r(80, 60, 12, 3, '#5a5a5a');
    r(40, 170, 44, 40, '#1a1410'); r(44, 174, 36, 32, '#f0c070'); r(61, 174, 2, 32, '#1a1410'); r(44, 189, 36, 2, '#1a1410');
    r(100, 214, 40, 92, '#2a1c14'); r(104, 218, 32, 84, '#4a3020'); r(130, 260, 3, 4, '#c8a050');
    // the deck: wet planks, catching the light
    for (let y = 300; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a3228', '#2a241e', (y - 300) / 60));
    for (let y = 304; y < NH; y += 9) r(0, y, NW, 1, '#1e1a14');
    for (let i = 0; i < 30; i++) r(R() * NW, 304 + R() * 52, 10 + R() * 20, 1, 'rgba(160,180,200,0.25)');
    // the railing: a top rail and turned balusters, with the sea between them
    r(150, 246, NW - 150, 6, '#d8d4c8'); r(150, 252, NW - 150, 2, '#8a8678');
    r(150, 294, NW - 150, 6, '#c8c4b8');
    for (let x = 156; x < NW; x += 14) { r(x, 254, 4, 40, '#c8c4b8'); r(x - 1, 262, 6, 3, '#d8d4c8'); r(x - 1, 282, 6, 3, '#d8d4c8'); }
    for (const x of [150, 330, 510, 634]) { r(x, 236, 8, 64, '#e0dcd0'); r(x - 2, 232, 12, 5, '#e8e4d8'); }
    return c;
  },
  animate(g, now) {
    // whitecaps running in
    for (let i = 0; i < 22; i++) { const x = ((i * 53 + now / 40) % (NW + 40)) - 20, y = 218 + (i * 7) % 76; rect(g, x, y, 6 + i % 5, 1, 'rgba(220,230,240,0.35)'); }
    // the lighthouse beam swings round
    const a = (now / 1400) % (Math.PI * 2);
    if (Math.cos(a) > 0.2) { g.fillStyle = 'rgba(255,240,190,0.12)'; g.beginPath(); g.moveTo(570, 168); g.lineTo(570 - 260 * Math.cos(a), 150 - 30 * Math.sin(a)); g.lineTo(570 - 260 * Math.cos(a), 186 - 30 * Math.sin(a)); g.fill(); }
    rect(g, 566, 166, 8, 3, Math.cos(a) > 0.6 ? '#fff4c0' : '#e8c070');
    // rain, sideways
    g.strokeStyle = 'rgba(180,200,230,0.35)'; g.lineWidth = 1; g.beginPath();
    for (let i = 0; i < 90; i++) { const x = ((i * 97 + now / 3) % (NW + 60)) - 30, y = ((i * 41 + now / 2) % NH); g.moveTo(x, y); g.lineTo(x - 7, y + 12); }
    g.stroke();
  },
  light(g, now) {
    glow(g, 62, 190, 6, 110, '255,190,110', 0.18);
    glow(g, 570, 167, 2, 60, '255,240,190', 0.25);
    // lightning, now and then, from behind the clouds
    const t = now % 9000;
    if (t < 90 || (t > 180 && t < 240)) { g.fillStyle = 'rgba(210,220,255,0.35)'; g.fillRect(0, 0, NW, 220); }
  },
  vignette: 0.6
}, 1.5);
