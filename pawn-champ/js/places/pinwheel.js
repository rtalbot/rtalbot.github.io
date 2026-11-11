// Pawn Champ - Pinwheel Lanes. Batch C (docs/quests/BATCHES.md, LOCATIONS.md).
// Eight candlepin lanes on Route 9: skinny pins, balls you can hold in one hand, a snack bar, a
// carpet nobody has chosen on purpose since 1971, and a back room for parties and bands.
// Used by M12 (rehearsal in the back room) and m24 The Candlepin Trophy.
'use strict';

const PINWHEEL = { pins: null }; // m24 sets pins to an array of 10 booleans to show what's standing
addPlace('pinwheel', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(77);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // the back wall: wood panelling below, a mural of pinwheels above
    r(0, 0, NW, 200, '#1e2a4a');
    for (let i = 0; i < 9; i++) { const cx = 40 + i * 74, cy = 40 + (i % 2) * 16, cols = ['#e85a4a', '#f0c040', '#4ab0e0', '#6ac06a'];
      for (let k = 0; k < 4; k++) { g.fillStyle = cols[(k + i) % 4]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 14, k * Math.PI / 2, k * Math.PI / 2 + 1.1); g.fill(); }
      r(cx - 1, cy - 1, 3, 3, '#e8e4dc'); }
    r(0, 76, NW, 4, '#e8c040');
    // the pinsetter fascia over the lanes, and the overhead score screens
    r(0, 80, 460, 44, '#2a2a34'); r(0, 80, 460, 2, '#4a4a58');
    for (let i = 0; i < 4; i++) { const x = 20 + i * 112; r(x, 88, 80, 28, '#101418'); r(x + 2, 90, 76, 24, '#1a2a3a'); pixText(g, `LANE ${i + 5}`, x + 6, 93, '#6ab0e0', 1); }
    // the lanes: maple boards running back to the pin decks, gutters between
    for (let y = 124; y < 262; y++) {
      const t = (y - 124) / 138;
      r(0, y, 460, 1, lerpColor('#c89a5a', '#a87a42', t));
      for (let k = 0; k < 5; k++) { const xt = 10 + k * 110, xb = -50 + k * 140, cx = xt + (xb - xt) * t, w = 6 + t * 8; r(cx - w / 2, y, w, 1, '#2a2a30'); r(cx - w / 2, y, 1, 1, '#4a4a52'); }
    }
    for (let i = 0; i < 70; i++) r(R() * 460, 130 + R() * 130, 1, 4 + R() * 10, 'rgba(120,80,40,0.3)');
    // pin decks at the back: a shadowed strip where the pins stand
    r(0, 124, 460, 12, '#1a1418');
    for (let lane = 0; lane < 4; lane++) {
      if (lane === 1) continue; // lane 6's pins are drawn live (m24)
      const cx = 64 + lane * 110;
      for (let row = 0; row < 4; row++) for (let k = 0; k <= row; k++) { const px = cx - row * 3 + k * 6, py = 120 + row * 3; r(px, py, 2, 9, '#f0ece4'); r(px, py + 2, 2, 1, '#c83a2a'); }
    }
    // the ball return at the foot of lane 6, with small candlepin balls
    r(196, 240, 40, 16, '#3a3a48'); r(196, 240, 40, 3, '#5a5a6a');
    for (let i = 0; i < 3; i++) { g.fillStyle = ['#2a5aa0', '#c84a3a', '#2a2a30'][i]; g.beginPath(); g.arc(204 + i * 11, 238, 5, 0, 7); g.fill(); }
    // the snack bar on the right: a counter, a menu board, a popcorn machine
    r(460, 80, 180, 182, '#3a2a3a'); r(460, 80, 4, 182, '#2a1a2a');
    r(478, 94, 144, 62, '#1a1a20'); r(476, 92, 148, 2, '#c8a050');
    pixText(g, 'SNACK BAR', 504, 98, '#f0c040', 1);
    const menu = [['HOT DOG', '3'], ['FRIES', '3'], ['CLAM ROLL', '9'], ['FRAPPE', '5']];
    menu.forEach(([k, v], i) => { pixText(g, k, 486, 112 + i * 10, '#e8e4dc', 1); pixText(g, v, 610, 112 + i * 10, '#e8e4dc', 1); });
    r(560, 164, 30, 40, '#c83a2a'); r(562, 166, 26, 22, '#f8e8b0'); for (let i = 0; i < 20; i++) r(564 + (i * 7) % 22, 170 + (i * 5) % 16, 2, 2, '#f8f4e0');
    r(474, 204, 166, 58, '#c84a3a'); r(470, 200, 170, 6, '#e8e4dc'); for (let i = 0; i < 9; i++) r(478 + i * 18, 214, 12, 40, '#b83a2a');
    // the door to the back room, propped open with a bowling pin
    r(470, 168, 50, 32, '#2a1a2a'); pixText(g, 'BACK ROOM', 474, 172, '#e8c040', 1); r(478, 182, 34, 18, '#120a12');
    // the carpet: a loud pattern of stars and squiggles
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a1a4a', '#2a1236', (y - 262) / 98));
    for (let i = 0; i < 160; i++) { const x = R() * NW, y = 266 + R() * 92, col = ['#e8c040', '#4ab0e0', '#e85a4a', '#6ac06a'][(R() * 4) | 0];
      if (R() < 0.5) { r(x, y, 4, 1, col); r(x + 1.5, y - 1.5, 1, 4, col); } else { r(x, y, 3, 1, col); r(x + 3, y + 1, 3, 1, col); r(x + 6, y, 3, 1, col); } }
    r(0, 262, NW, 3, '#1a0a20');
    // the settee where bowlers wait, and a scoring table
    r(40, 278, 140, 18, '#c84a3a'); r(40, 270, 140, 10, '#a83a2a'); r(44, 296, 4, 10, '#2a2a30'); r(172, 296, 4, 10, '#2a2a30');
    r(222, 284, 50, 6, '#5a4a3a'); r(222, 284, 50, 1, '#7a6a5a'); r(244, 290, 6, 18, '#3a3a42'); r(232, 276, 26, 8, '#2a2a30'); r(234, 277, 22, 5, '#4a8ab0');
    return c;
  },
  animate(g, now) {
    // lane 6's pins: all standing, unless a scene says otherwise
    const cx = 174, pins = PINWHEEL.pins;
    let n = 0;
    for (let row = 0; row < 4; row++) for (let k = 0; k <= row; k++) {
      const up = !pins || pins[n]; n++;
      const px = cx - row * 3 + k * 6, py = 120 + row * 3;
      if (up) { rect(g, px, py, 2, 9, '#f0ece4'); rect(g, px, py + 2, 2, 1, '#c83a2a'); }
      else rect(g, px - 2, py + 7, 6, 2, '#d8d4cc');
    }
    // a strike sign on lane 8, blinking for somebody else
    if (Math.floor(now / 700) % 2) pixText(g, 'X', 368, 104, '#f0c040', 2);
    // the popcorn machine keeps popping
    for (let i = 0; i < 4; i++) { const p = ((now / 600) + i / 4) % 1; rect(g, 566 + i * 6, 186 - p * 16, 2, 2, '#fff8e0'); }
  },
  light(g, now) {
    glow(g, 230, 100, 10, 220, '255,220,170', 0.12);
    glow(g, 550, 130, 6, 100, '255,200,120', 0.12);
    glow(g, 575, 180, 2, 30, '255,230,170', 0.15 + Math.sin(now / 300) * 0.03);
  },
  vignette: 0.45
}, 1.5);

// ---- moved from js/quests/photobooth.js
// ---------------------------------------------------------------- the lobby at closing
// Pinwheel Lanes with the lane lights off and only the booth lit: a wooden cabinet with a red
// curtain and a sign on top, by the snack bar. PHOTOBOOTH.flash > 0 flashes the booth's lamp.
const PHOTOBOOTH = { flash: 0 };
function drawPhotoBooth(g) {
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // the cabinet
  r(40, 150, 96, 162, '#6a3a22'); r(40, 150, 96, 4, '#8a5a32'); r(132, 150, 4, 162, '#4a2614');
  for (let y = 160; y < 300; y += 14) r(44, y, 88, 1, '#5a3018');
  // the sign on top
  r(36, 118, 104, 32, '#1e1e26'); r(40, 122, 96, 24, '#e8d8a0');
  pixText(g, 'PHOTOS', 62, 125, '#b8322a', 2); pixText(g, '4 FOR 2', 66, 140, '#1e1e26', 1);
  // the curtain, half drawn, and the stool inside
  r(50, 166, 52, 120, '#2a1a14'); r(60, 236, 30, 6, '#b9bec8'); r(72, 242, 6, 40, '#8a8a92');
  for (let i = 0; i < 6; i++) r(50 + i * 5, 166, 4, 124, i % 2 ? '#9a1e1a' : '#b8322a');
  r(48, 162, 58, 4, '#c8a050');
  // the coin box, the slot where the strip drops, and a strip drying on the clip
  r(110, 200, 18, 26, '#b9bec8'); r(114, 206, 10, 2, '#1e1e26'); r(112, 216, 14, 4, '#3a3a42');
  r(112, 246, 16, 4, '#1e1e26'); r(116, 250, 8, 34, '#f4eee0');
  for (let k = 0; k < 4; k++) r(117, 252 + k * 8, 6, 6, k === 3 ? '#8a8270' : '#b8a682');
  // floor tape where the line used to wait
  r(140, 316, 60, 3, '#e2b04a');
}
addNightVariant('pinwheelLobby', 'pinwheel', { amount: 0.5, tint: '40,36,70', paint: drawPhotoBooth,
  light: (g, now) => {
    glow(g, 88, 132, 6, 90, '255,230,170', 0.16);
    glow(g, 76, 220, 6, 70, '255,240,210', 0.1 + Math.sin(now / 700) * 0.02);
    if (PHOTOBOOTH.flash > 0) { glow(g, 76, 220, 10, 220, '255,255,255', Math.min(0.8, PHOTOBOOTH.flash)); PHOTOBOOTH.flash -= 0.05; }
  } });
