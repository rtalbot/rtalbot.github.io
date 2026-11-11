// Pawn Champ - the Rusty Anchor. Batch C (docs/quests/BATCHES.md, LOCATIONS.md).
// A low harbor bar: nets and glass floats on the ceiling, the Prudence Gale's bell over the bar,
// a stage the size of a dinner table. Trivia on Thursdays, open mic when Ruthie asks nicely.
// Used by M12 (the gig), m6 The Second Proposal and m12 Captain Ned.
'use strict';

const ANCHOR = { stage: false }; // a scene sets stage: true to bring the stage lights up
addPlace('rustyanchor', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(71);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // knotty pine walls, dark with fifty years of fried clams
    for (let x = 0; x < NW; x += 14) { r(x, 0, 14, 262, (x / 14) % 2 ? '#5a3a24' : '#563622'); r(x, 0, 1, 262, '#3a2416'); }
    for (let i = 0; i < 90; i++) { const x = R() * NW, y = 30 + R() * 220; g.fillStyle = '#3e2618'; g.beginPath(); g.ellipse(x, y, 2, 3, 0, 0, 7); g.fill(); }
    // the low ceiling: beams, and a fishing net slung between them with glass floats
    r(0, 0, NW, 30, '#2a1a10'); for (let x = 0; x < NW; x += 90) r(x, 0, 12, 36, '#3a2416');
    g.strokeStyle = 'rgba(200,180,140,0.45)'; g.lineWidth = 1;
    for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(i * 16, 30); g.quadraticCurveTo(i * 16 + 8, 58, i * 16 + 16, 30); g.stroke(); }
    for (let i = 0; i < 40; i++) { g.beginPath(); g.moveTo(i * 16 + 8, 34); g.lineTo(i * 16 + 8, 48 + (i % 3) * 4); g.stroke(); }
    for (const [x, col] of [[60, '#3a8a7a'], [190, '#4a7ab0'], [300, '#8ab040'], [420, '#3a8a7a'], [560, '#4a7ab0']]) { g.fillStyle = col; g.beginPath(); g.arc(x, 50, 7, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(x - 3, 46, 2, 2); }
    // a window onto the harbor at night
    r(28, 70, 90, 70, '#3a2416'); r(32, 74, 82, 62, '#0e1628'); r(72, 74, 2, 62, '#3a2416'); r(32, 104, 82, 2, '#3a2416');
    for (let i = 0; i < 6; i++) r(36 + i * 13, 120 + (i % 2) * 3, 2, 2, '#f0c060'); r(32, 126, 82, 10, '#141e34');
    // the back bar: mirror, bottles, the bell, a neon sign
    r(150, 70, 280, 90, '#2a1a10'); r(156, 76, 268, 52, '#3a4a54'); r(156, 76, 268, 2, '#5a6a74');
    for (let s = 0; s < 2; s++) { r(150, 128 + s * 22, 280, 3, '#6a4630');
      for (let i = 0; i < 26; i++) { const x = 156 + i * 10 + (R() * 3 | 0), h = 12 + (R() * 8 | 0), col = ['#3a7a3a', '#8a5a2a', '#c8c0a0', '#5a2a1a', '#2a4a7a', '#a8a050'][(R() * 6) | 0];
        r(x, 128 + s * 22 - h, 6, h, col); r(x + 2, 128 + s * 22 - h - 4, 2, 4, col); r(x + 1, 128 + s * 22 - h + 3, 1, h - 6, 'rgba(255,255,255,0.25)'); } }
    // the Prudence Gale's bell, brass, hung from a bracket over the middle of the bar
    r(286, 34, 2, 14, '#2a2a2a'); r(278, 46, 18, 3, '#2a2a2a');
    g.fillStyle = '#c8a050'; g.beginPath(); g.moveTo(279, 50); g.lineTo(295, 50); g.lineTo(299, 70); g.lineTo(275, 70); g.fill();
    r(275, 68, 24, 3, '#a88030'); r(281, 52, 3, 14, '#e8c870');
    pixText(g, 'PRUDENCE GALE', 248, 74, '#c8a050', 1);
    // a dartboard and some old photographs of boats
    g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(470, 96, 16, 0, 7); g.fill();
    for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#e8e0c8' : '#1a1a1a'; g.beginPath(); g.moveTo(470, 96); g.arc(470, 96, 13, i / 20 * 7, (i + 1) / 20 * 7); g.fill(); }
    g.fillStyle = '#c83a2a'; g.beginPath(); g.arc(470, 96, 6, 0, 7); g.fill(); g.fillStyle = '#3a8a3a'; g.beginPath(); g.arc(470, 96, 3, 0, 7); g.fill();
    for (const [x, y] of [[440, 140], [478, 132], [508, 146]]) { r(x, y, 24, 18, '#2a1a10'); r(x + 2, y + 2, 20, 14, '#c8b890'); r(x + 4, y + 10, 16, 3, '#5a4a3a'); r(x + 10, y + 5, 1, 6, '#5a4a3a'); }
    // the chalkboard
    r(36, 160, 76, 56, '#2a2e2a'); r(34, 158, 80, 2, '#6a4630'); r(34, 216, 80, 2, '#6a4630');
    pixText(g, 'TRIVIA THU', 42, 166, '#e8e4dc', 1); pixText(g, 'OPEN MIC', 42, 178, '#f0c060', 1); pixText(g, 'CHOWDER', 42, 192, '#e8e4dc', 1); pixText(g, 'CUP 6', 42, 202, '#e8e4dc', 1);
    // the stage: a low platform in the corner with a mic stand, an amp and a stool
    r(466, 216, 174, 46, '#3a2416'); r(466, 216, 174, 4, '#6a4630'); for (let x = 470; x < NW; x += 22) r(x, 220, 1, 42, '#2a1a10');
    r(474, 168, 166, 48, '#1a0e0a'); r(474, 168, 166, 3, '#3a2416'); // a dark curtain behind it
    for (let x = 476; x < NW; x += 8) r(x, 171, 2, 45, '#24120c');
    r(536, 176, 2, 40, '#2a2a2e'); r(530, 214, 14, 2, '#2a2a2e'); r(533, 172, 8, 6, '#3a3a40');
    r(576, 188, 34, 28, '#1e1e22'); r(578, 190, 30, 20, '#2a2a30'); g.fillStyle = '#121214'; g.beginPath(); g.arc(593, 200, 8, 0, 7); g.fill(); r(578, 211, 30, 2, '#c8a050');
    r(504, 196, 14, 3, '#6a4630'); r(506, 199, 2, 17, '#3a2416'); r(514, 199, 2, 17, '#3a2416');
    // floorboards
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a2416', '#5a3a24', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(20,10,6,0.5)'; g.beginPath(); g.moveTo(320 + i * 20, 262); g.lineTo(320 + i * 52, NH); g.stroke(); }
    r(0, 262, NW, 2, '#1e120a');
    // the bar itself, along the left, with stools
    r(140, 214, 300, 48, '#4a2a18'); r(136, 208, 308, 8, '#7a4a2a'); r(136, 208, 308, 2, '#9a6a3a'); r(140, 256, 300, 6, '#2a160c');
    for (let i = 0; i < 7; i++) r(150 + i * 42, 222, 30, 28, '#42261a');
    r(140, 250, 300, 3, '#c8a050'); // a brass foot rail
    for (let i = 0; i < 5; i++) { const x = 168 + i * 58; r(x, 270, 18, 5, '#c84a3a'); r(x, 270, 18, 2, '#e86a5a'); r(x + 8, 275, 2, 22, '#2a2a2e'); r(x + 2, 296, 14, 2, '#2a2a2e'); }
    // two small tables in front
    for (const x of [60, 384]) { g.fillStyle = '#3a2416'; g.beginPath(); g.ellipse(x, 300, 30, 8, 0, 0, 7); g.fill(); g.fillStyle = '#6a4630'; g.beginPath(); g.ellipse(x, 298, 30, 8, 0, 0, 7); g.fill(); r(x - 2, 304, 4, 30, '#2a160c'); r(x - 12, 332, 24, 3, '#2a160c'); }
    return c;
  },
  animate(g, now) {
    // the neon in the window: ANCHOR, with a tired R
    const flick = Math.sin(now / 90) > 0.95 ? 0 : 1;
    pixText(g, 'ANCHO', 42, 86, '#e85a6a', 2);
    if (flick || (now % 3000) > 400) pixText(g, 'R', 82, 86, '#e85a6a', 2);
    // the bell sways a hair when the door goes
    const sw = Math.sin(now / 1100) * 0.6;
    rect(g, 286 + sw, 70, 2, 3, '#a88030');
    // stage lights
    if (ANCHOR.stage) for (let i = 0; i < 3; i++) rect(g, 490 + i * 50, 168, 8, 4, ['#f06a5a', '#f0d070', '#6ab0f0'][i]);
  },
  light(g, now) {
    glow(g, 290, 140, 10, 200, '255,180,100', 0.18);
    glow(g, 62, 92, 4, 50, '240,90,110', 0.16 + Math.sin(now / 90) * 0.01);
    if (ANCHOR.stage) { glow(g, 540, 200, 10, 120, '255,200,140', 0.26); glow(g, 494, 172, 2, 50, '240,110,90', 0.1); glow(g, 594, 172, 2, 50, '110,170,240', 0.1); }
  },
  vignette: 0.5
}, 1.5);

// ---- moved from js/quests/longcon.js
// The Rusty Anchor late, the stools up, and the high-backed booth at the back where deals get done.
addNightVariant('anchorBooth', 'rustyanchor', { tint: '60,50,70', amount: 0.62,
  paint: (g) => {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // the booth: two high settle backs and a table between them
    r(372, 176, 16, 140, '#3a2416'); r(372, 176, 16, 4, '#5a3a24'); r(560, 176, 16, 140, '#3a2416'); r(560, 176, 16, 4, '#5a3a24');
    r(388, 250, 172, 10, '#4a2e1a'); r(388, 250, 172, 2, '#6a4a2a'); r(470, 260, 8, 56, '#2a1a10');
    // a candle in a bottle, three glasses and a napkin with sums on it
    r(468, 230, 8, 20, '#2a5a3a'); r(470, 226, 4, 4, '#e8e0c8');
    for (const x of [420, 506, 530]) { r(x, 240, 6, 10, 'rgba(230,200,140,0.7)'); r(x, 240, 6, 1, '#f0e8d0'); }
    r(432, 246, 22, 4, '#f0ece0'); r(436, 247, 14, 1, '#4a4a6a');
  },
  light: (g, now) => { glow(g, 472, 226, 3, 120, '255,200,120', 0.3 + Math.sin(now / 90) * 0.03); rect(g, 471, Math.sin(now / 70) > 0 ? 221 : 222, 2, 4, '#ffd070'); } });
