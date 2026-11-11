// Pawn Champ - The island ferry. A scene location, batch B (docs/quests/BATCHES.md, LOCATIONS.md).
//   ferry         - the open after-deck in thick fog at midday: rail, life rings, benches, the
//                   wheelhouse, a bell buoy out in the grey   (The Ferry Captain's Bet)
//   ferryLanding  - the town slip at first light: pilings, the ticket hut, the ramp, the first
//                   boat coming in from Gannet Island   (Static on Channel 16)
'use strict';

addPlace('ferry', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(111);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // fog, all the way up: no sky, no horizon
    for (let y = 0; y < 230; y++) r(0, y, NW, 1, lerpColor('#c8ced2', '#a4afb6', y / 230));
    for (let y = 150; y < 230; y++) r(0, y, NW, 1, `rgba(90,110,124,${(y - 150) / 160})`); // the sea, just
    for (let i = 0; i < 70; i++) r(R() * NW, 186 + R() * 44, 8 + R() * 16, 1, 'rgba(70,90,104,0.35)');
    // the wheelhouse on the right: white steel, big square windows, a horn on top
    r(452, 40, 188, 190, '#e8e6e0'); r(452, 40, 188, 4, '#f4f2ee'); r(452, 226, 188, 4, '#a8a6a0');
    for (let i = 0; i < 3; i++) { const x = 470 + i * 56; r(x, 70, 44, 50, '#3a4a58'); r(x + 2, 72, 40, 46, '#5a6c7a'); r(x + 4, 74, 12, 20, 'rgba(255,255,255,0.18)'); }
    r(486, 84, 12, 10, '#2a2a30'); r(484, 80, 16, 5, '#1e2a40'); // the captain, behind the glass, in a cap
    r(450, 30, 192, 10, '#c84a3a'); pixText(g, 'GANNET LINE', 504, 32, '#f4f2ee');
    r(560, 10, 6, 20, '#2a2a30'); r(554, 10, 18, 6, '#c8a050');
    r(470, 140, 60, 86, '#c8c6c0'); r(474, 144, 52, 78, '#d8d6d0'); r(518, 180, 4, 6, '#2a2a30'); // door
    pixText(g, 'CREW ONLY', 478, 132, '#5a5a5a');
    for (let k = 0; k < 6; k++) r(560, 136 + k * 14, 60, 2, '#a8a6a0'); // a ladder up the side
    r(558, 136, 2, 90, '#a8a6a0'); r(620, 136, 2, 90, '#a8a6a0');
    // life rings on the wheelhouse wall
    for (const x of [580, 610]) { g.fillStyle = '#e86a2a'; g.beginPath(); g.arc(x, 100, 12, 0, 7); g.fill(); g.fillStyle = '#e8e6e0'; g.beginPath(); g.arc(x, 100, 6, 0, 7); g.fill();
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; r(x + Math.cos(a) * 9 - 2, 100 + Math.sin(a) * 9 - 2, 4, 4, '#f4f2ee'); } }
    // the rail, across the whole stern
    r(0, 214, 452, 4, '#e8e6e0'); r(0, 240, 452, 3, '#e8e6e0');
    for (let x = 6; x < 452; x += 30) r(x, 214, 3, 46, '#d8d6d0');
    r(0, 258, NW, 6, '#c84a3a'); // the gunwale
    // the deck: painted steel, non-slip grey-green, with rivet lines and a hatch
    for (let y = 264; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a7a6e', '#4a5a50', (y - 264) / 96));
    for (let i = 0; i < 6; i++) r(0, 276 + i * 16, NW, 1, '#5a6a5e');
    for (let i = 0; i < 400; i++) r(R() * NW, 266 + R() * 94, 1, 1, '#7a8a7e');
    r(190, 300, 90, 40, '#5a6a5e'); r(192, 302, 86, 36, '#6a7a6e'); r(230, 316, 10, 4, '#3a4a40');
    // benches along the rail, and a crate of life jackets
    for (const x of [30, 300]) { r(x, 244, 110, 6, '#8a6a4a'); r(x, 244, 110, 1, '#aa8a62'); r(x + 4, 250, 4, 14, '#3a3a3a'); r(x + 102, 250, 4, 14, '#3a3a3a'); r(x, 232, 110, 3, '#8a6a4a'); }
    r(150, 232, 30, 30, '#e8a02a'); r(150, 232, 30, 3, '#f8c050'); pixText(g, 'PFD', 156, 242, '#5a3a10');
    // a coil of rope and a cleat
    for (let k = 0; k < 4; k++) { g.strokeStyle = '#c8b890'; g.lineWidth = 2; g.beginPath(); g.ellipse(390, 300, 18 - k * 4, 6 - k, 0, 0, 7); g.stroke(); }
    r(404, 270, 18, 4, '#3a3a40'); r(410, 266, 6, 8, '#3a3a40');
    return c;
  },
  animate(g, now) {
    // the bell buoy, rocking out in the fog
    const t = Math.sin(now / 900);
    const bx = 150 + t * 2, by = 176;
    rect(g, bx - 1, by - 22, 2, 22, 'rgba(110,60,60,0.55)'); rect(g, bx - 8, by - 4, 16, 6, 'rgba(150,60,50,0.55)'); rect(g, bx - 4, by - 18 + t, 8, 6, 'rgba(90,90,90,0.5)');
    // swell under the hull
    for (let i = 0; i < 14; i++) rect(g, (i * 53 + now / 30) % 452, 196 + (i * 7) % 30, 12, 1, 'rgba(230,236,240,0.5)');
    // fog rolling across the deck
    for (let i = 0; i < 6; i++) { const x = ((now / (30 + i * 7) + i * 140) % 900) - 160; glow(g, x, 140 + i * 30, 10, 120, '214,220,226', 0.22); }
  },
  light() {},
  wash: 'rgba(200,210,216,0.18)',
  vignette: 0.3
}, 1.5);

addPlace('ferryLanding', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(113);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // first light: indigo going to rose over the water
    for (let y = 0; y < 196; y++) r(0, y, NW, 1, y < 100 ? lerpColor('#2a3060', '#7a6a98', y / 100) : lerpColor('#7a6a98', '#f0b0a0', (y - 100) / 96));
    for (let i = 0; i < 30; i++) r(R() * NW, R() * 60, 1, 1, 'rgba(255,255,255,0.5)');
    for (let i = 0; i < 7; i++) { const x = R() * NW, y = 60 + R() * 110, w = 70 + R() * 120; r(x, y, w, 3, 'rgba(255,200,190,0.45)'); }
    // Gannet Island, low on the horizon, and the first ferry coming in from it
    r(380, 186, 200, 10, '#4a4060'); for (let i = 0; i < 50; i++) r(380 + i * 4, 186 - Math.sin(i / 50 * Math.PI) * 9, 4, 9, '#4a4060');
    r(520, 176, 2, 10, '#3a3050');
    // the harbor
    r(0, 196, NW, 70, '#5a6088'); for (let i = 0; i < 160; i++) r(R() * NW, 197 + R() * 68, 6 + R() * 14, 1, R() < 0.5 ? '#7a7aa0' : '#e8b0a0');
    // the slip: a ramp down to a floating dock, pilings, a hinged gangway
    for (const x of [40, 110, 180, 250, 420, 500]) { r(x, 150, 14, 140, '#4a3a2e'); r(x, 150, 14, 3, '#6a5a44'); r(x + 2, 154, 3, 132, '#5a4a38'); r(x - 1, 236, 16, 4, '#2a4a3a'); }
    r(0, 244, 330, 14, '#6a5a4a'); r(0, 244, 330, 3, '#8a7a62'); for (let x = 0; x < 330; x += 10) r(x, 247, 1, 11, '#5a4a3a');
    g.fillStyle = '#7a6a56'; g.beginPath(); g.moveTo(330, 244); g.lineTo(420, 236); g.lineTo(420, 246); g.lineTo(330, 258); g.fill(); // the gangway
    for (let k = 0; k < 6; k++) r(334 + k * 14, 240 - k * 1.3, 2, 6, '#c8c0b0');
    // the ticket hut: green shingles, a hatch window, the timetable
    r(64, 170, 80, 74, '#3a6a5a'); for (let y = 172; y < 244; y += 5) r(64, y, 80, 1, '#2e5a4a');
    for (let i = 0; i < 12; i++) r(58 + i, 170 - i, 92 - i * 2, 1, '#2a2a2a');
    r(80, 188, 34, 22, '#2a2a30'); r(82, 190, 30, 18, '#e8c890'); r(78, 210, 38, 3, '#e8e4dc');
    r(120, 186, 18, 30, '#e8e4dc'); for (let k = 0; k < 6; k++) r(122, 190 + k * 4, 14 - (k % 2) * 4, 1, '#3a3a40');
    r(66, 158, 76, 10, '#e8e4dc'); pixText(g, 'GANNET LINE', 72, 160, '#2a4a3a');
    // the wharf you stand on: grey boards, a bollard, lobster crates, a bench
    for (let y = 258; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a6058', '#4a423c', (y - 258) / 102));
    for (let y = 262; y < NH; y += 9) r(0, y, NW, 1, '#3a342e');
    for (let i = 0; i < 40; i++) r(R() * NW, 262 + R() * 96, 2, 2, '#2a2420');
    r(520, 276, 20, 22, '#2a2a30'); r(516, 272, 28, 6, '#3a3a40');
    for (let k = 0; k < 3; k++) { const x = 560 + (k % 2) * 30, y = 296 - k * 18; r(x, y, 34, 20, '#c8a040'); for (let i = 0; i < 4; i++) r(x + 2 + i * 8, y + 2, 2, 16, '#8a6a2a'); }
    r(420, 300, 80, 6, '#8a6a4a'); r(424, 306, 4, 12, '#3a3a3a'); r(492, 306, 4, 12, '#3a3a3a');
    // a streetlamp still on
    r(300, 150, 4, 110, '#2a2a30'); r(290, 146, 24, 6, '#2a2a30'); r(294, 152, 16, 3, '#f8e0a0');
    return c;
  },
  animate(g, now) {
    // the first ferry, slowly getting bigger
    const p = (now / 30000) % 1, x = 520 - p * 120, s = 1 + p * 0.6;
    rect(g, x, 184 - 4 * s, 24 * s, 5 * s, '#e8e4dc'); rect(g, x + 6 * s, 180 - 6 * s, 10 * s, 5 * s, '#e8e4dc'); rect(g, x, 189 - 1 * s, 24 * s, 2, '#2a2a3a');
    if (Math.sin(now / 300) > 0) rect(g, x + 22 * s, 182 - 4 * s, 2, 2, '#f84a3a');
    for (let i = 0; i < 16; i++) rect(g, (i * 41 + now / 50) % NW, 200 + (i * 11) % 60, 10, 1, 'rgba(255,220,210,0.45)');
    // gulls on the pilings
    for (const [px, k] of [[40, 0], [180, 1], [500, 2]]) { const b = Math.sin(now / 700 + k) > 0.9 ? 1 : 0; rect(g, px + 3, 144 - b, 8, 5, '#f4f4f4'); rect(g, px + 9, 142 - b, 3, 3, '#f4f4f4'); rect(g, px + 3, 146 - b, 5, 2, '#9a9aa8'); }
  },
  light(g, now) {
    glow(g, 302, 154, 2, 70, '255,220,150', 0.2);
    glow(g, 97, 199, 2, 50, '255,200,120', 0.16);
    glow(g, 480, 186, 20, 260, '255,190,170', 0.12 + Math.sin(now / 4000) * 0.02);
  },
  vignette: 0.35
}, 1.5);

// ---- moved from js/quests/fog.js
// the ferry landing at night, for the last ferry
addNightVariant('ferryLandingNight', 'ferryLanding', { tint: '60,80,110', amount: 0.6, light: (g) => glow(g, 160, 200, 4, 90, '255,210,140', 0.22) });

// ---- moved from js/quests/lisbon.js
// The town landing at noon (js/places/ferry.js draws it at first light): the same slip in daylight.
addDayVariant('ferryLandingNoon', 'ferryLanding', { sky: '210,214,200', amount: 0.4 });

// ---- moved from js/quests/nightferry.js
// ---------------------------------------------------------------- places: the ferry at 2 a.m., Gannet's back dock
// The island ferry's after-deck (js/places/ferry.js) at two in the morning, no fog lights, crates
// strapped to the deck and one work lamp on the wheelhouse.
addNightVariant('ferryNight', 'ferry', {
  tint: '14,18,46', amount: 0.94,
  paint(g) {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (const [x, y, w, h] of [[214, 242, 70, 46], [292, 254, 58, 34], [236, 214, 44, 30]]) { // crates, strapped down
      r(x, y, w, h, '#4a3a28'); r(x, y, w, 2, '#6a5236'); for (let k = 6; k < w; k += 10) r(x + k, y, 1, h, '#3a2c1e');
      r(x, y + (h >> 1), w, 2, '#c8a040');
    }
    pixText(g, 'MARINE PARTS', 218, 262, '#d8c8a0'); pixText(g, 'GANNET', 300, 266, '#d8c8a0');
    r(470, 120, 8, 6, '#2a2a30'); r(472, 126, 4, 3, '#f8e0a0'); // the work lamp
  },
  light(g, now) {
    glow(g, 474, 128, 3, 130, '255,214,150', 0.22 + Math.sin(now / 120) * 0.01);
    glow(g, 470, 96, 10, 60, '120,200,150', 0.08); // the radar screen, green, in the wheelhouse
  }
});
