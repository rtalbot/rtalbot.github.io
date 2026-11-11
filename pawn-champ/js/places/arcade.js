// Pawn Champ - Neptune's Arcade
// The arcade at the end of the boardwalk, shut for the season. The machines are
// unplugged, but they all light up when Mr. Quillon walks in.
'use strict';

addPlace('arcade', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(81);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // back wall: a painted undersea mural, faded
    for (let y = 0; y < 250; y++) r(0, y, NW, 1, lerpColor('#0e1a34', '#14304a', y / 250));
    for (let i = 0; i < 9; i++) { const y = 80 + i * 18; for (let x = 0; x < NW; x += 2) r(x, y + Math.sin(x / 24 + i) * 4, 2, 2, i % 2 ? '#1a3a58' : '#183452'); }
    for (let i = 0; i < 16; i++) { const x = R() * NW, y = 70 + R() * 150, col = ['#c86a3a', '#e2b04a', '#3a9a8a', '#a84a6a'][i % 4];
      r(x, y, 10, 5, col); r(x + 10, y - 1, 4, 7, col); r(x + 2, y + 1, 2, 2, '#0e1a34'); } // fish
    for (let i = 0; i < 20; i++) { g.fillStyle = 'rgba(180,220,240,0.35)'; g.beginPath(); g.arc(R() * NW, 40 + R() * 180, 1 + R() * 3, 0, 7); g.fill(); }
    // ceiling: black tiles and a lighting truss
    r(0, 0, NW, 26, '#0a0c14'); for (let x = 0; x < NW; x += 32) r(x, 0, 1, 26, '#16182a'); r(0, 26, NW, 3, '#2a2a3a');
    for (let x = 0; x < NW; x += 12) { r(x, 30, 12, 2, '#3a3a4a'); r(x + 3, 32, 1, 5, '#3a3a4a'); }
    // the window over the prize counter: the boardwalk, the sea and the Ferris wheel
    const wx = 404, wy = 48, ww = 150, wh = 100;
    r(wx - 4, wy - 4, ww + 8, wh + 8, '#2a2a3a');
    for (let y = wy; y < wy + wh; y++) r(wx, y, ww, 1, lerpColor('#0a0c22', '#202a4e', (y - wy) / wh));
    g.fillStyle = '#f2ecd2'; g.beginPath(); g.arc(wx + 128, wy + 18, 7, 0, 7); g.fill();
    r(wx, wy + 74, ww, 26, '#10182e'); for (let i = 0; i < 30; i++) r(wx + R() * ww, wy + 76 + R() * 22, 6, 1, '#24325a');
    g.strokeStyle = '#0a0c18'; g.lineWidth = 2; g.beginPath(); g.arc(wx + 52, wy + 44, 36, 0, 7); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.lineWidth = 1; g.beginPath(); g.moveTo(wx + 52, wy + 44); g.lineTo(wx + 52 + Math.cos(a) * 36, wy + 44 + Math.sin(a) * 36); g.stroke(); r(wx + 50 + Math.cos(a) * 36, wy + 42 + Math.sin(a) * 36, 5, 5, '#0a0c18'); }
    g.lineWidth = 3; g.beginPath(); g.moveTo(wx + 30, wy + 100); g.lineTo(wx + 52, wy + 44); g.lineTo(wx + 74, wy + 100); g.stroke();
    r(wx, wy + 60, ww, 4, '#2a2a3a'); for (let x = wx; x < wx + ww; x += 10) r(x, wy + 64, 2, 10, '#2a2a3a'); // boardwalk rail
    r(wx + ww / 2 - 1, wy, 3, wh, '#2a2a3a');
    // floor: arcade carpet, dark with bright confetti
    for (let y = 250; y < NH; y++) r(0, y, NW, 1, lerpColor('#1a0e2a', '#2a1440', (y - 250) / 110));
    const conf = ['#e23a8a', '#3ac8e2', '#e2d03a', '#8a3ae2', '#3ae27a'];
    for (let i = 0; i < 520; i++) { const x = R() * NW, y = 252 + R() * 108; r(x, y, R() < 0.5 ? 2 : 3, 1, conf[i % 5]); }
    r(0, 250, NW, 3, '#0a0610');
    // a row of upright cabinets along the back wall (screens drawn live)
    this.cabs = [];
    const cabCols = ['#a82a2a', '#2a5aa8', '#2a8a4a', '#a87a2a', '#6a2aa8'];
    for (let i = 0; i < 5; i++) {
      const x = 16 + i * 56, col = cabCols[i];
      r(x, 120, 46, 132, col); r(x + 2, 120, 4, 132, shade(col, 0.2)); r(x + 40, 120, 6, 132, shade(col, -0.3));
      r(x - 2, 108, 50, 18, shade(col, -0.2)); r(x, 110, 46, 14, '#1a1a24'); // marquee box
      r(x + 6, 134, 34, 30, '#0a0a10'); this.cabs.push([x + 8, 136, 30, 26, i]);
      r(x - 2, 176, 50, 12, shade(col, -0.35)); r(x + 8, 178, 3, 6, '#2a2a2a'); r(x + 7, 176, 5, 3, '#c83030'); r(x + 26, 180, 4, 4, '#e2d03a'); r(x + 33, 180, 4, 4, '#3ac8e2');
      r(x + 18, 206, 10, 14, '#2a2a30'); r(x + 21, 210, 4, 6, '#e2b04a'); // coin door
    }
    // the claw machine: glass box of plush
    r(300, 106, 66, 146, '#d8d8e0'); r(304, 112, 58, 86, '#14142a'); r(306, 114, 54, 82, 'rgba(160,200,240,0.12)');
    const plush = ['#e88aaa', '#8ac8e8', '#e8d07a', '#a8e88a', '#c8a8e8', '#e8a87a'];
    for (let i = 0; i < 22; i++) { const x = 308 + (i * 11) % 48, y = 172 + (i * 7) % 22 - (i > 10 ? 8 : 0); g.fillStyle = plush[i % plush.length]; g.beginPath(); g.arc(x + 4, y + 4, 5, 0, 7); g.fill(); r(x + 2, y + 2, 1, 1, '#2a2a2a'); r(x + 5, y + 2, 1, 1, '#2a2a2a'); }
    r(330, 116, 2, 30, '#c8c8d0'); r(324, 146, 14, 3, '#c8c8d0'); r(324, 149, 2, 6, '#c8c8d0'); r(336, 149, 2, 6, '#c8c8d0');
    r(300, 198, 66, 54, '#c83a6a'); r(304, 206, 22, 18, '#0a0a10'); r(334, 210, 6, 10, '#2a2a2a'); r(332, 208, 10, 4, '#e23a3a');
    r(300, 96, 66, 12, '#e23a8a'); pixText(g, 'GRAB IT', 306, 99, '#fff0f8');
    // the fortune machine: Madame Fathom in her booth, with a crystal ball (drawn live)
    r(560, 92, 70, 160, '#3a1a3a'); r(560, 92, 70, 4, '#e2b04a'); r(560, 248, 70, 4, '#e2b04a');
    r(566, 104, 58, 82, '#120814'); r(568, 106, 54, 78, 'rgba(200,160,240,0.10)');
    r(586, 128, 18, 30, '#5a8a7a'); r(588, 158, 14, 26, '#5a8a7a'); g.fillStyle = '#d8b090'; g.beginPath(); g.arc(595, 122, 7, 0, 7); g.fill(); // faceless, like everyone
    r(586, 114, 18, 6, '#7a3a8a'); r(584, 118, 4, 18, '#2a1a3a'); r(602, 118, 4, 18, '#2a1a3a');
    r(554, 82, 82, 12, '#5a2a5a'); pixText(g, 'MADAME', 572, 85, '#e2b04a');
    r(570, 192, 50, 14, '#2a1028'); pixText(g, 'FORTUNES', 579, 196, '#c8a8e8');
    r(588, 212, 14, 18, '#1a0a1a'); r(591, 216, 8, 2, '#e2b04a');
    // the prize counter under the window
    r(392, 172, 168, 78, '#2a2a3a'); r(392, 172, 168, 4, '#5a5a6a'); r(396, 180, 160, 64, 'rgba(160,200,240,0.10)');
    for (let i = 0; i < 18; i++) { const x = 400 + (i * 17) % 150, y = 196 + (i % 3) * 16; r(x, y, 10, 8, conf[i % 5]); r(x + 3, y + 2, 4, 2, '#ffffff'); }
    for (let i = 0; i < 9; i++) { g.fillStyle = plush[i % plush.length]; g.beginPath(); g.arc(404 + i * 17, 164, 7, 0, 7); g.fill(); g.beginPath(); g.arc(404 + i * 17, 154, 5, 0, 7); g.fill(); }
    // a skee-ball lane at the front left, seen from the side: a long ramp up to the rings
    g.fillStyle = '#2a4a8a'; g.beginPath(); g.moveTo(30, 284); g.lineTo(204, 252); g.lineTo(204, 284); g.closePath(); g.fill();
    g.fillStyle = '#4a7ac8'; g.beginPath(); g.moveTo(30, 278); g.lineTo(204, 246); g.lineTo(204, 252); g.lineTo(30, 284); g.closePath(); g.fill();
    for (let i = 0; i < 9; i++) { const x = 40 + i * 18; r(x, 277 - i * 3.3, 2, 6, '#e2b04a'); }
    r(26, 276, 10, 10, '#7a5a3a'); r(26, 286, 180, 4, '#3a2a1a');
    r(204, 214, 34, 72, '#3a6ab8'); r(206, 214, 4, 72, '#5a8ad8'); r(210, 222, 24, 24, '#14142a');
    for (let k = 0; k < 3; k++) { g.strokeStyle = ['#e23a3a', '#e2d03a', '#3ae27a'][k]; g.lineWidth = 2; g.beginPath(); g.arc(222, 234, 10 - k * 3, 0, 7); g.stroke(); }
    r(200, 206, 42, 9, '#e2b04a'); pixText(g, 'SKEE', 212, 208, '#3a2a12');
    for (let i = 0; i < 4; i++) { g.fillStyle = '#c86a3a'; g.beginPath(); g.arc(40 + i * 9, 273, 4, 0, 7); g.fill(); r(38 + i * 9, 271, 2, 1, '#f0a070'); }
    // spilled tickets
    for (let i = 0; i < 30; i++) r(250 + R() * 260, 300 + R() * 50, 6, 3, '#e8b84a');
    return c;
  },
  animate(g, now) {
    // attract modes: each cabinet screen cycles its own little loop
    const scr = ['#ff4a6a', '#4ad8ff', '#ffe04a', '#7aff7a', '#d07aff'];
    for (const [x, y, w, h, i] of this.cabs || []) {
      const t = now / 400 + i * 1.7;
      rect(g, x, y, w, h, '#06060c');
      for (let k = 0; k < 4; k++) rect(g, x + 2 + ((k * 9 + now / (60 + i * 15)) % (w - 6)), y + 3 + k * 6, 4, 3, scr[(i + k) % 5]);
      if (Math.sin(t) > 0.3) rect(g, x + 6, y + h - 6, w - 12, 2, '#ffffff');
      rect(g, x - 6, y - 24, 46, 12, Math.sin(t * 0.7) > -0.2 ? scr[i] : shade(scr[i], -0.5)); // marquee
    }
    // the crystal ball
    const p = (Math.sin(now / 500) + 1) / 2;
    g.fillStyle = `rgba(${150 + p * 80},${120 + p * 60},255,0.9)`; g.beginPath(); g.arc(595, 172, 8, 0, 7); g.fill();
    rect(g, 591, 168, 3, 2, '#ffffff'); rect(g, 588, 179, 14, 4, '#2a1a3a');
    // the neon over the door, one letter dying
    const flick = Math.sin(now / 47) + Math.sin(now / 131) > 1.4;
    const name = "NEPTUNE'S", xs = [0, 24, 48, 72, 96, 120, 144, 162, 180];
    for (let i = 0; i < name.length; i++) { const dead = i === 5 && flick; pixText(g, name[i], 124 + xs[i], 52, dead ? '#1a3a4a' : '#5af0e8', 5); }
  },
  light(g, now) {
    const scr = ['255,74,106', '74,216,255', '255,224,74', '122,255,122', '208,122,255'];
    for (const [x, y, w, , i] of this.cabs || []) glow(g, x + w / 2, y + 14, 2, 50, scr[i], 0.12);
    glow(g, 225, 64, 6, 160, '90,240,232', 0.14);
    glow(g, 595, 172, 2, 60, '200,160,255', 0.2 + Math.sin(now / 500) * 0.06);
    glow(g, 333, 150, 4, 70, '255,120,180', 0.1);
  },
  vignette: 0.5
}, 1.75);

// ---- moved from js/quests/highscore.js
addDayVariant('arcadeDay', 'arcade', { sky: '170,180,190', amount: 0.36 });
