// Pawn Champ - The boardwalk outside Neptune's Arcade.
//   arcadeFront        - the boardwalk outside the arcade at night, the sign lit (m51 The Camcorder)
//   arcadeFrontDay     - the same on an ordinary weekday lunchtime (m31)
//   arcadeFrontWinter  - winter quarters: shutters down, a stovepipe out of a stall, laundry (m46)
// The Szabo family's banner hangs over the doors once m46 ends well (S.flags.bannerEnd === 'hung').
// Batch O's carousel goes on the same boardwalk later: give it its own id (e.g. arcadeFrontCarousel).
'use strict';

// ---- moved from js/quests/busker.js
function buildArcadeFront(mode) {
  const night = mode === 'night', winter = mode === 'winter';
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(night ? 131 : winter ? 137 : 133);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  const dk = (col, n) => (night ? shade(col, -0.55) : winter ? shade(col, -0.15) : col);
  // sky
  for (let y = 0; y < 170; y++) r(0, y, NW, 1, night ? lerpColor('#0a1024', '#1c2848', y / 170) : winter ? lerpColor('#8a909a', '#c8ccd0', y / 170) : lerpColor('#5a96cc', '#d4e4ee', y / 170));
  if (night) for (let i = 0; i < 80; i++) r(R() * NW, R() * 120, 1, 1, R() < 0.2 ? '#f8f0c8' : '#d8e0f0');
  else for (const [x, y, w] of [[80, 34, 80], [380, 22, 60], [560, 54, 70]]) { g.fillStyle = winter ? 'rgba(220,222,226,0.7)' : 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(x, y, w / 2, 9, 0, 0, 7); g.ellipse(x + w / 5, y - 6, w / 4, 9, 0, 0, 7); g.fill(); }
  // the sea, flat to the horizon
  for (let y = 150; y < 214; y++) r(0, y, NW, 1, night ? lerpColor('#16223c', '#0c1424', (y - 150) / 64) : winter ? lerpColor('#6a7480', '#4a5460', (y - 150) / 64) : lerpColor('#4a86b4', '#2a5a84', (y - 150) / 64));
  for (let i = 0; i < 40; i++) r(R() * NW, 154 + R() * 56, 4 + R() * 10, 1, night ? 'rgba(160,180,230,0.22)' : 'rgba(255,255,255,0.3)');
  // the Ferris wheel at the end of the pier, stopped for the season
  { const cx = 566, cy = 92, rad = 62, col = night ? '#3a3e52' : winter ? '#7a7c86' : '#e8e4dc';
    g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.stroke(); g.beginPath(); g.arc(cx, cy, rad - 8, 0, 7); g.stroke();
    g.lineWidth = 1; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); g.stroke();
      r(cx + Math.cos(a) * rad - 4, cy + Math.sin(a) * rad, 8, 7, dk(['#c84a3a', '#e8b84a', '#3a8ab0'][i % 3], 0)); }
    g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 40, 214); g.lineTo(cx, cy); g.lineTo(cx + 40, 214); g.stroke(); r(cx - 3, cy - 3, 6, 6, col); }
  // the boardwalk railing along the water
  r(0, 200, NW, 3, dk('#8a6a4a')); r(0, 212, NW, 2, dk('#7a5a3a')); for (let x = 0; x < NW; x += 16) r(x, 198, 3, 20, dk('#6a4a2e'));
  // planks
  for (let y = 218; y < NH; y += 6) { r(0, y, NW, 6, dk(y % 12 ? '#a07a52' : '#94704a')); r(0, y + 5, NW, 1, dk('#6a4a2e')); }
  for (let i = 0; i < 160; i++) r(R() * NW, 218 + (R() * 23 | 0) * 6 + 2, 2, 1, dk('#5a3e26'));
  // two boardwalk stalls on the left, striped awnings, shuttered
  for (const [x, col, name] of [[8, '#c84a3a', 'FRIED DOUGH'], [124, '#3a8ab0', 'SALT TAFFY']]) {
    r(x, 108, 104, 112, dk('#e8dcc4')); r(x, 108, 104, 2, dk('#f8f0dc'));
    for (let i = 0; i < 8; i++) { g.fillStyle = dk(i % 2 ? '#f0ece4' : col); g.beginPath(); g.moveTo(x - 4 + i * 14, 96); g.lineTo(x + 10 + i * 14, 96); g.lineTo(x + 10 + i * 14, 112); g.lineTo(x - 4 + i * 14, 112); g.fill(); }
    for (let i = 0; i < 8; i++) { g.fillStyle = dk(i % 2 ? '#f0ece4' : col); g.beginPath(); g.arc(x + 3 + i * 14, 112, 7, 0, Math.PI); g.fill(); }
    r(x + 8, 124, 88, 66, dk('#8a8e96')); for (let y = 126; y < 190; y += 4) r(x + 8, y, 88, 1, dk('#6a6e76')); // roll-down shutter
    r(x + 14, 100, 76, 9, dk('#2a2a3a')); pixText(g, name, x + 18, 102, dk('#f8e8b8'), 1);
    r(x + 4, 190, 96, 30, dk('#c8b89c')); r(x + 4, 190, 96, 2, dk('#e0d4b8'));
  }
  if (winter) {
    // winter quarters: a stovepipe through the taffy stall's roof, a line of washing, a woodpile
    r(200, 70, 6, 40, '#3a3a40'); r(198, 66, 10, 5, '#2a2a30');
    g.strokeStyle = '#4a4a50'; g.lineWidth = 1; g.beginPath(); g.moveTo(20, 136); g.quadraticCurveTo(70, 150, 120, 136); g.stroke();
    for (const [x, col, h] of [[34, '#c8a040', 14], [52, '#e8e4dc', 18], [72, '#7a3a6a', 12], [92, '#3a6a9a', 16]]) r(x, 140 + (x - 70) * (x - 70) / 400, 12, h, col);
    for (let i = 0; i < 7; i++) r(130 + (i % 4) * 14, 204 - (i / 4 | 0) * 8, 13, 7, i % 2 ? '#7a5a3a' : '#6a4a30');
    r(140, 214, 52, 2, '#4a3a2a');
  }
  // Neptune's Arcade: a seaside front with a scalloped parapet, round windows and the big sign
  { const x = 238, w = 290, top = 54, base = 220;
    r(x, top + 30, w, base - top - 30, dk('#2a6a7a')); r(x, top + 30, w, 3, dk('#4a9aaa'));
    for (let i = 0; i < 9; i++) { g.fillStyle = dk('#2a6a7a'); g.beginPath(); g.arc(x + 16 + i * 32, top + 32, 16, Math.PI, 0); g.fill(); g.fillStyle = dk('#e8c050'); g.fillRect(x + 15 + i * 32, top + 12, 2, 4); }
    r(x - 6, top + 30, 6, base - top - 30, dk('#1e5260')); r(x + w, top + 30, 6, base - top - 30, dk('#1e5260'));
    // sign board
    r(x + 30, top + 40, w - 60, 34, dk('#1a2a3a')); r(x + 30, top + 40, w - 60, 2, dk('#e8c050')); r(x + 30, top + 72, w - 60, 2, dk('#e8c050'));
    pixText(g, 'NEPTUNE\'S ARCADE', x + 50, top + 49, night ? '#ff9ad0' : winter ? '#8a7a8a' : '#c84a8a', 2);
    // a trident either side of the sign
    for (const tx of [x + 14, x + w - 18]) { r(tx + 1, top + 42, 2, 30, dk('#e8c050')); r(tx - 3, top + 40, 10, 2, dk('#e8c050')); for (const d of [-3, 1, 5]) r(tx + d, top + 36, 2, 5, dk('#e8c050')); }
    // porthole windows with machines inside
    for (const wx of [x + 44, x + w - 74]) {
      g.fillStyle = dk('#e8c050'); g.beginPath(); g.arc(wx + 15, top + 112, 22, 0, 7); g.fill();
      g.fillStyle = night ? '#1a1030' : winter ? '#3a3e48' : '#1e2a3a'; g.beginPath(); g.arc(wx + 15, top + 112, 18, 0, 7); g.fill();
      if (!winter) { r(wx + 4, top + 104, 8, 18, night ? '#3a2a5a' : '#2a3a5a'); r(wx + 5, top + 106, 6, 5, night ? '#8ae0f0' : '#4a6a8a'); r(wx + 18, top + 100, 9, 22, night ? '#4a2a3a' : '#3a2a3a'); r(wx + 19, top + 102, 7, 6, night ? '#f0a0d0' : '#6a4a6a'); }
      else for (let y = top + 96; y < top + 128; y += 3) r(wx - 2, y, 34, 1, '#5a5e66'); // boarded
    }
    // the doors
    const dx = x + w / 2 - 34;
    r(dx - 4, top + 92, 76, base - top - 92, dk('#e8c050')); r(dx, top + 96, 68, base - top - 96, night ? '#140c22' : '#1e2a3a');
    if (winter) { r(dx, top + 96, 68, base - top - 96, '#7a7e86'); for (let y = top + 98; y < base; y += 4) r(dx, y, 68, 1, '#5a5e66');
      r(dx + 8, top + 118, 52, 14, '#e8e4dc'); pixText(g, 'CLOSED', dx + 16, top + 120, '#c83a2a', 1); pixText(g, 'TIL MAY', dx + 13, top + 127, '#3a3a40', 1); }
    else { r(dx + 33, top + 96, 2, base - top - 96, dk('#e8c050')); r(dx + 6, top + 100, 22, 30, night ? '#2a1a40' : '#3a4a5a'); r(dx + 40, top + 100, 22, 30, night ? '#2a1a40' : '#3a4a5a');
      r(dx + 26, top + 140, 4, 8, dk('#e8c050')); r(dx + 38, top + 140, 4, 8, dk('#e8c050')); }
    // steps
    r(dx - 12, base, 92, 5, dk('#8a8a90')); r(dx - 18, base + 5, 104, 5, dk('#7a7a80'));
  }
  // lampposts
  for (const lx of [226, 548]) { r(lx, 120, 3, 100, dk('#2a2a32')); r(lx - 5, 112, 13, 9, dk('#2a2a32')); r(lx - 3, 114, 9, 6, night ? '#f8e0a0' : dk('#d8d8c8')); }
  // a bench and a bin
  r(560, 236, 60, 4, dk('#5a3a24')); r(560, 226, 60, 3, dk('#5a3a24')); r(564, 240, 3, 12, dk('#2a2a2e')); r(612, 240, 3, 12, dk('#2a2a2e'));
  r(196, 226, 16, 22, dk('#3a5a3a')); r(194, 224, 20, 3, dk('#2a4a2a'));
  return c;
}
// the Szabo family's banner, hung across the arcade front (m46)
function drawSzaboBanner(g, now) {
  const x = 262, y = 30, w = 242, h = 28, sway = Math.sin(now / 1200) * 1.5;
  g.strokeStyle = '#3a2a1e'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 10, y - 6); g.lineTo(x, y + sway); g.moveTo(x + w + 10, y - 6); g.lineTo(x + w, y + sway); g.stroke();
  rect(g, x, y + sway, w, h, '#e8d8a8'); rect(g, x, y + sway, w, 2, '#c84a3a'); rect(g, x, y + h - 2 + sway, w, 2, '#c84a3a');
  pixText(g, 'THE MARVELLOUS SZABOS', x + 14, y + 10 + sway, '#7a2a2a', 2);
  for (let i = 0; i < 12; i++) rect(g, x + i * 20 + 4, y + h + sway, 10, 4, i % 2 ? '#c84a3a' : '#e8b84a');
}
function addArcadeFront(id, mode, light, vignetteAmt) {
  addPlace(id, {
    build: () => buildArcadeFront(mode),
    animate(g, now) {
      for (let i = 0; i < 12; i++) rect(g, (i * 57 + now / 60) % NW, 156 + (i * 13) % 50, 8, 1, mode === 'night' ? 'rgba(170,190,240,0.3)' : 'rgba(255,255,255,0.35)');
      if (mode === 'winter') for (let i = 0; i < 40; i++) rect(g, (i * 37 + Math.sin(now / 900 + i) * 10) % NW, (i * 23 + now / 30) % NH, 2, 2, 'rgba(240,242,248,0.8)');
      if (mode === 'winter') for (let i = 0; i < 5; i++) { const t = (now / 2400 + i / 5) % 1; g.fillStyle = `rgba(200,200,206,${0.5 * (1 - t)})`; g.beginPath(); g.arc(203 + t * 30, 62 - t * 50, 4 + t * 8, 0, 7); g.fill(); }
      if (mode === 'day') { const t = (now / 9000) % 1; rect(g, t * NW, 40 + Math.sin(now / 400) * 3, 6, 2, '#f0f0f0'); rect(g, t * NW + 2, 38 + Math.sin(now / 400) * 3, 2, 2, '#f0f0f0'); }
      if (S && S.flags && S.flags.bannerEnd === 'hung') drawSzaboBanner(g, now);
    },
    light,
    vignette: vignetteAmt
  }, 1.75);
}
addArcadeFront('arcadeFront', 'night', (g, now) => {
  const flick = Math.sin(now / 90) > -0.92 ? 1 : 0.3;
  glow(g, 383, 110, 30, 150, '255,120,200', 0.14 * flick);
  for (const lx of [227, 549]) glow(g, lx + 1, 117, 3, 70, '255,220,150', 0.22);
  glow(g, 383, 200, 20, 80, '160,120,255', 0.08);
}, 0.55);
addArcadeFront('arcadeFrontDay', 'day', (g) => glow(g, 320, 0, 20, 300, '255,240,210', 0.06), 0.3);
addArcadeFront('arcadeFrontWinter', 'winter', (g, now) => glow(g, 203, 110, 4, 50, '255,170,90', 0.08 + Math.sin(now / 300) * 0.02), 0.35);
