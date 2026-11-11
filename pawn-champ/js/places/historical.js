// Pawn Champ - the Historical Society, batch D (docs/quests/BATCHES.md, LOCATIONS.md).
// Captain Ezra Pike's house on Front Street, left to the town in 1931 and a museum ever since.
// The front parlor is the gallery. One background in three lights:
//   historical       - a weekday: appraisal day, a folding table under the windows  (Scrimshaw)
//   historicalGala   - the opening of "Crowns of the Stage": a string trio, canapes   (The Museum Job)
//   historicalNight  - after hours: moonlight, the alarm panel's little red eye      (The Museum Job)
// The crown is drawn live, so it can vanish (S.flags.museumCaseEmpty) without rebuilding anything.
'use strict';

function historicalBuild(mode) {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(101);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  const exhibit = mode !== 'day';
  // wallpaper: navy with a small gold anchor sprig, a heavy cornice and a dado rail
  r(0, 0, NW, 262, '#24304a');
  for (let x = 0; x < NW; x += 20) for (let y = 30 + (x / 20 % 2) * 14; y < 180; y += 28) { r(x + 9, y, 2, 6, '#7a6a3a'); r(x + 7, y + 5, 6, 1, '#7a6a3a'); r(x + 7, y + 3, 1, 2, '#7a6a3a'); r(x + 12, y + 3, 1, 2, '#7a6a3a'); }
  r(0, 0, NW, 20, '#e8e0cc'); r(0, 20, NW, 4, '#c8b890'); r(0, 24, NW, 2, '#8a7a5a');
  r(0, 180, NW, 82, '#e8e0cc'); r(0, 180, NW, 5, '#f4eedc'); r(0, 258, NW, 4, '#8a7a5a');
  for (let x = 10; x < NW; x += 46) { r(x, 192, 38, 56, '#ded4bc'); r(x, 192, 38, 1, '#f4eedc'); r(x, 247, 38, 1, '#b8ac90'); }
  // two tall sash windows with the street outside (day or night)
  for (const wx of [30, 528]) {
    r(wx - 6, 40, 92, 140, '#f4eedc'); r(wx - 3, 43, 86, 134, '#c8b890');
    for (let y = 46; y < 174; y++) r(wx, y, 80, 1, mode === 'day' ? lerpColor('#a8c8e0', '#d8e8f0', (y - 46) / 128) : lerpColor('#0e1428', '#1e2844', (y - 46) / 128));
    if (mode === 'day') { r(wx, 140, 80, 34, '#b0a890'); r(wx + 10, 118, 30, 22, '#e8e0d0'); r(wx + 50, 124, 24, 16, '#d8c8b0'); r(wx + 8, 110, 34, 8, '#6a3a2a'); r(wx + 48, 116, 28, 8, '#4a4a52'); }
    else { for (let i = 0; i < 5; i++) r(wx + 6 + R() * 66, 120 + R() * 50, 3, 3, '#f0c060'); g.fillStyle = 'rgba(240,236,210,0.8)'; g.beginPath(); g.arc(wx + 60, 66, 6, 0, 7); g.fill(); }
    r(wx + 39, 46, 3, 128, '#f4eedc'); r(wx, 108, 80, 4, '#f4eedc');
    // swagged curtains
    r(wx - 12, 34, 18, 150, '#6a1e24'); r(wx + 74, 34, 18, 150, '#6a1e24'); r(wx - 10, 34, 4, 150, '#8a2a30'); r(wx + 76, 34, 4, 150, '#8a2a30');
    r(wx - 14, 30, 108, 8, '#c8a050');
  }
  // the captain's portrait over the mantel, faceless and stern, and his ship beside him
  r(216, 34, 70, 86, '#c8a050'); r(220, 38, 62, 78, '#2a2420'); r(222, 40, 58, 74, '#3a3a40');
  g.fillStyle = '#d8b090'; g.beginPath(); g.arc(251, 66, 10, 0, 7); g.fill(); r(237, 76, 28, 38, '#1e2638'); r(249, 78, 4, 10, '#e8e0cc'); r(239, 54, 24, 6, '#e8e8e8');
  r(296, 50, 96, 60, '#c8a050'); r(300, 54, 88, 52, '#4a6a8a');
  for (let y = 86; y < 106; y++) r(300, y, 88, 1, lerpColor('#2a4a6a', '#1a2a4a', (y - 86) / 20));
  r(318, 82, 52, 8, '#3a2416'); r(320, 90, 48, 2, '#2a1a10'); for (const [x, h] of [[330, 26], [344, 30], [358, 22]]) { r(x, 82 - h, 2, h, '#3a2416'); r(x - 8, 82 - h + 4, 18, h - 10, '#e8e4dc'); }
  pixText(g, 'MERIDIAN 1849', 304, 98, '#e8d8a8');
  // the mantel and fireplace
  r(210, 150, 186, 10, '#f4eedc'); r(210, 158, 186, 4, '#c8b890'); r(220, 162, 166, 98, '#e8e0cc');
  r(262, 186, 82, 74, '#1a1410'); r(256, 180, 94, 6, '#c8b890'); r(268, 236, 70, 6, '#3a2a1a'); for (let i = 0; i < 5; i++) r(274 + i * 14, 226, 10, 10, '#4a3020');
  r(226, 140, 12, 10, '#c8a050'); r(368, 136, 10, 14, '#c8a050'); clockFace(g, 302, 136, 9, '#3a2416', '#f4eedc', [10, 10]); r(290, 142, 24, 8, '#3a2416');
  // floor: wide pine boards and a long Turkish runner
  for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a4a2c', '#8a603a', (y - 262) / 98));
  for (let i = -10; i < 22; i++) { g.strokeStyle = 'rgba(40,24,12,0.45)'; g.lineWidth = 1; g.beginPath(); g.moveTo(320 + i * 24, 262); g.lineTo(320 + i * 60, NH); g.stroke(); }
  for (let y = 300; y < 346; y++) { const w = 300 + (y - 300) * 3; r(320 - w / 2, y, w, 1, (y - 300) % 9 < 2 ? '#5a2a3a' : (y - 300) % 9 < 4 ? '#c8a050' : '#7a2a30'); }
  // the long case on the left: ship models and a sextant
  r(60, 190, 120, 70, '#4a2e1c'); r(56, 186, 128, 6, '#6a4228'); r(64, 196, 112, 40, '#1a1410'); r(66, 198, 108, 36, 'rgba(160,200,230,0.18)');
  r(82, 220, 40, 6, '#5a3a24'); r(98, 202, 2, 18, '#3a2416'); r(88, 206, 22, 10, '#e8e4dc');
  r(134, 216, 30, 10, '#c8a050'); g.strokeStyle = '#c8a050'; g.beginPath(); g.arc(149, 216, 12, Math.PI, 0); g.stroke();
  r(60, 240, 120, 2, '#6a4228');
  if (exhibit) {
    // the touring exhibition: a banner, velvet ropes and the big case on a plinth in the middle
    r(410, 34, 100, 46, '#5a1a3a'); r(410, 34, 100, 3, '#c8a050'); r(410, 77, 100, 3, '#c8a050');
    pixText(g, 'CROWNS OF', 460 - textWidth('CROWNS OF') / 2, 44, '#f0d890'); pixText(g, 'THE STAGE', 460 - textWidth('THE STAGE') / 2, 54, '#f0d890');
    pixText(g, 'ON TOUR', 460 - textWidth('ON TOUR') / 2, 66, '#c8a8b8');
    r(426, 210, 72, 52, '#2a2420'); r(422, 206, 80, 6, '#3a3430'); r(422, 258, 80, 4, '#1a1410');
    r(430, 150, 64, 58, 'rgba(180,210,240,0.16)'); r(430, 150, 64, 2, 'rgba(220,240,255,0.5)'); r(430, 150, 2, 58, 'rgba(220,240,255,0.4)'); r(492, 150, 2, 58, 'rgba(220,240,255,0.3)');
    r(446, 196, 32, 10, '#5a1a3a'); r(444, 194, 36, 3, '#7a2a4a');
    for (const x of [400, 524]) { r(x, 232, 4, 36, '#c8a050'); r(x - 2, 266, 8, 3, '#c8a050'); g.fillStyle = '#c8a050'; g.beginPath(); g.arc(x + 2, 231, 3, 0, 7); g.fill(); }
    g.strokeStyle = '#7a1a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(404, 236); g.quadraticCurveTo(464, 256, 524, 236); g.stroke();
    // the alarm panel by the hall door
    r(588, 196, 36, 64, '#3a2416'); r(586, 192, 40, 4, '#5a3a24');
    r(560, 150, 18, 24, '#d8d4c8'); r(562, 152, 14, 6, '#2a3a2a'); for (let i = 0; i < 9; i++) r(563 + (i % 3) * 4, 160 + Math.floor(i / 3) * 4, 3, 3, '#a8a49a');
  } else {
    // appraisal day: a folding table, green felt, a lamp, a hand-lettered sign
    r(400, 214, 150, 6, '#2a5a3a'); r(400, 220, 150, 4, '#3a3a40'); r(404, 224, 3, 36, '#4a4a4a'); r(543, 224, 3, 36, '#4a4a4a');
    r(500, 182, 3, 32, '#2a2a30'); r(486, 178, 30, 6, '#2a5a3a'); r(490, 184, 22, 2, '#f8e0a0');
    r(420, 206, 18, 8, '#e8e4dc'); r(444, 208, 24, 6, '#c8a050'); r(472, 204, 12, 10, '#5a3a24');
    r(400, 160, 70, 34, '#f4eedc'); r(400, 160, 70, 2, '#c8b890');
    pixText(g, 'APPRAISALS', 404, 166, '#2a3a5a'); pixText(g, 'TODAY', 404, 174, '#2a3a5a'); pixText(g, 'BY DONATION', 404, 184, '#8a3a2a');
    r(560, 192, 54, 68, '#4a2e1c'); r(556, 188, 62, 6, '#6a4228'); r(566, 198, 42, 30, '#1a1410'); r(568, 200, 38, 26, 'rgba(160,200,230,0.18)');
    r(578, 214, 18, 8, '#e8e0cc');
  }
  if (mode === 'gala') {
    // the string trio's chairs and stands, and the canapes on a white cloth
    for (let i = 0; i < 3; i++) { const x = 106 + i * 30; r(x, 264, 3, 26, '#1a1a1e'); r(x - 6, 260, 15, 5, '#1a1a1e'); r(x + 14, 272, 12, 3, '#5a3a24'); r(x + 15, 275, 2, 14, '#3a2416'); r(x + 24, 275, 2, 14, '#3a2416'); }
    r(196, 266, 90, 6, '#f4f4ee'); r(196, 272, 90, 22, '#e8e8e0'); r(200, 294, 3, 10, '#3a3a3a'); r(278, 294, 3, 10, '#3a3a3a');
    for (let i = 0; i < 7; i++) { r(204 + i * 11, 262, 7, 4, ['#e8a87a', '#f0e0a0', '#c86a6a'][i % 3]); r(204 + i * 11, 264, 7, 1, '#d8d8d0'); }
    for (let i = 0; i < 4; i++) { r(250 + i * 8, 254, 3, 8, 'rgba(240,220,160,0.8)'); r(251 + i * 8, 262, 1, 4, '#e8e8e0'); }
  }
  return c;
}

const HISTORICAL = {
  // the crown, drawn live: gold band, five points, stones that catch the light
  crown(g, now, lit) {
    if (typeof S !== 'undefined' && S && S.flags && S.flags.museumCaseEmpty) return;
    const x = 462, y = 186, gold = lit ? '#e8c050' : '#8a7040';
    rect(g, x - 14, y, 28, 8, gold); rect(g, x - 14, y + 7, 28, 1, shade(gold, -0.3));
    for (let i = 0; i < 5; i++) { const px = x - 13 + i * 6.5; g.fillStyle = gold; g.beginPath(); g.moveTo(px - 3, y); g.lineTo(px, y - 9 - (i === 2 ? 4 : 0)); g.lineTo(px + 3, y); g.fill(); }
    const stones = ['#d02a4a', '#2a8ad0', '#d02a4a', '#3ac87a', '#2a8ad0'];
    for (let i = 0; i < 5; i++) { rect(g, x - 13 + i * 6.5, y + 2, 3, 3, stones[i]); if (lit && Math.sin(now / 300 + i * 1.7) > 0.85) rect(g, x - 13 + i * 6.5, y + 1, 1, 1, '#ffffff'); }
  },
  chandelier(g, now) {
    const x = 330, y = 0;
    rect(g, x, y, 2, 26, '#8a7040'); rect(g, x - 30, y + 26, 62, 3, '#c8a050');
    for (let i = 0; i < 7; i++) { const cx = x - 28 + i * 9.5; rect(g, cx, y + 20, 2, 6, '#e8e4dc'); rect(g, cx, y + 17 + (Math.sin(now / 100 + i) > 0 ? 0 : 1), 2, 3, '#ffd070'); rect(g, cx - 1, y + 29, 1, 4 + (i % 2) * 3, 'rgba(220,240,255,0.7)'); }
  }
};

addPlace('historical', {
  build: () => historicalBuild('day'),
  animate(g, now) { for (let i = 0; i < 12; i++) rect(g, 40 + (i * 53 + now / 60) % 560, 60 + (i * 37) % 160, 1, 1, 'rgba(255,240,200,0.5)'); }, // dust in the sun
  light(g) { glow(g, 70, 120, 10, 200, '255,240,210', 0.12); glow(g, 568, 120, 10, 200, '255,240,210', 0.12); glow(g, 501, 196, 2, 60, '255,220,150', 0.12); },
  vignette: 0.25
}, 1.5);

addPlace('historicalGala', {
  build: () => historicalBuild('gala'),
  animate(g, now) {
    HISTORICAL.chandelier(g, now);
    HISTORICAL.crown(g, now, true);
    rect(g, 563, 153, 4, 3, Math.sin(now / 600) > 0 ? '#5ae07a' : '#2a6a3a'); // the alarm is set
  },
  light(g, now) {
    glow(g, 330, 30, 6, 220, '255,220,150', 0.2 + Math.sin(now / 90) * 0.01);
    glow(g, 462, 180, 2, 70, '255,240,200', 0.18);
  },
  vignette: 0.4
}, 1.5);

addPlace('historicalNight', {
  build: () => historicalBuild('night'),
  animate(g, now) {
    HISTORICAL.crown(g, now, false);
    rect(g, 563, 153, 4, 3, Math.sin(now / 300) > 0 ? '#ff3a3a' : '#6a1a1a');
  },
  light(g, now) {
    glow(g, 90, 110, 10, 180, '150,170,230', 0.14);
    glow(g, 588, 110, 10, 180, '150,170,230', 0.14);
    glow(g, 565, 154, 1, 26, '255,60,60', 0.22 + Math.sin(now / 300) * 0.1);
  },
  wash: 'rgba(10,14,40,0.5)',
  vignette: 0.6
}, 1.5);
