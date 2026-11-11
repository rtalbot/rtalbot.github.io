// Pawn Champ - The Clarion building on Front Street (pitched, PR #35).
//   clarion        - downstairs: the shut newspaper office of the Hollow Neck Clarion. Desks under dust
//                    sheets, the flatbed press under its own sheet, back issues bundled to the ceiling, a
//                    typewriter left out on the columnist's desk. (m64 The Last Column)
//   clarionStudio  - upstairs: WHNK, the town's one-room radio station. A desk mic on a boom, the mixing
//                    board, egg-box foam on the walls, a reel-to-reel, the ON AIR light, the sound-effects
//                    table. (m68 The Thunder Sheet)
//   CLARION.onAir = true lights the ON AIR sign.
'use strict';

const CLARION = { onAir: true };

addPlace('clarion', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(211);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    r(0, 0, NW, 262, '#6a5a48'); for (let x = 0; x < NW; x += 22) r(x, 0, 1, 262, '#5a4a3a'); r(0, 0, NW, 10, '#3a3028');
    // back issues in tied bundles, floor to ceiling, along the back wall
    for (let col = 0; col < 9; col++) for (let k = 0; k < 11; k++) { const x = 300 + col * 38, y = 236 - k * 22; if (y < 14) continue;
      r(x, y, 34, 20, lerpColor('#d8ccb0', '#a89a7a', R())); r(x, y + 9, 34, 2, '#8a7a5a'); r(x + 16, y, 2, 20, '#8a7a5a'); }
    // the masthead sign, a wall clock, the window with the street lamp outside
    r(30, 20, 250, 40, '#2a2420'); pixText(g, 'THE HOLLOW NECK', 46, 26, '#e8dcc0', 1.5); pixText(g, 'CLARION', 46, 40, '#e8dcc0', 3);
    r(30, 80, 110, 110, '#3a3028'); for (let y = 84; y < 186; y++) r(34, y, 102, 1, lerpColor('#0c1228', '#1e2a44', (y - 84) / 102)); r(84, 84, 2, 102, '#3a3028'); r(34, 134, 102, 2, '#3a3028');
    r(60, 120, 2, 66, '#2a2a30'); r(56, 116, 10, 5, '#f0c060');
    clockFace(g, 220, 100, 14, '#3a3028', '#e8e0c8', [3, 40]); // stopped when they shut
    // the floor: old boards
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a3828', '#6a5038', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(20,12,6,0.4)'; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    // the flatbed press under a dust sheet, and the desks under theirs
    const sheet = (x, y, w, h) => { g.fillStyle = '#c8c0b0'; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + 6, y); g.lineTo(x + w - 6, y); g.lineTo(x + w, y + h); g.fill(); r(x + 4, y + 2, w - 8, 2, '#d8d0c0'); for (let i = 1; i < 4; i++) r(x + i * w / 4, y + 6, 1, h - 6, '#a8a090'); };
    sheet(330, 196, 170, 70); r(492, 186, 20, 50, '#3a3a3a'); r(498, 180, 8, 8, '#5a5a5a'); // the press, a flywheel showing
    sheet(170, 226, 90, 40); sheet(540, 230, 80, 36);
    // the columnist's desk, uncovered: the typewriter, a lamp, a cold cup, a spike of notes
    r(60, 262, 130, 8, '#5a3e24'); r(60, 262, 130, 2, '#7a5a34'); r(66, 270, 8, 40, '#3a2818'); r(176, 270, 8, 40, '#3a2818');
    r(96, 244, 50, 18, '#2a3a34'); r(100, 240, 42, 6, '#1a2a24'); for (let i = 0; i < 9; i++) r(100 + i * 5, 250, 3, 3, '#e8e0c8'); r(106, 230, 30, 12, '#f4f0e4'); r(108, 233, 22, 1, '#3a3a3a');
    r(160, 250, 8, 12, '#e8e8e0'); r(68, 252, 2, 10, '#8a8a8a'); for (let i = 0; i < 4; i++) r(65, 248 - i * 3, 8, 2, '#f4f0e4');
    r(176, 228, 2, 34, '#2a2a2a'); r(170, 222, 16, 8, '#2a5a3a');
    return c;
  },
  animate(g, now) {
    // dust in the lamplight, and the ribbon spool in the typewriter turning by itself, very slowly
    for (let i = 0; i < 12; i++) { const p = (now / 9000 + i * 0.09) % 1; rect(g, 120 + i * 6 + Math.sin(now / 1300 + i) * 8, 220 + p * 60, 1, 1, 'rgba(255,240,200,0.5)'); }
    const a = now / 4000; g.strokeStyle = '#c83a2a'; g.lineWidth = 1; g.beginPath(); g.arc(104, 241, 3, a, a + 4); g.stroke(); g.beginPath(); g.arc(138, 241, 3, a, a + 4); g.stroke();
  },
  light(g) {
    glow(g, 178, 236, 3, 120, '255,230,170', 0.26);
    glow(g, 61, 116, 2, 60, '255,200,120', 0.1);
  },
  vignette: 0.6
}, 1.5);

addPlace('clarionStudio', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(213);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // egg-box foam on every wall
    r(0, 0, NW, 262, '#4a3a5a');
    for (let y = 0; y < 262; y += 12) for (let x = (y / 12 % 2) * 6; x < NW; x += 12) { r(x, y, 10, 10, '#5a4a6a'); r(x + 2, y + 2, 4, 4, '#6a5a7a'); }
    // the window into the control booth, the station logo, the tower photo, the record shelf
    r(380, 40, 220, 110, '#2a2a30'); r(386, 46, 208, 98, '#1a2a34'); r(394, 100, 190, 30, '#3a3a3a'); for (let i = 0; i < 20; i++) r(398 + i * 9, 104, 6, 10, ['#e84a3a', '#3ae84a', '#e8e83a'][i % 3]);
    r(40, 30, 140, 46, '#e8e0c8'); pixText(g, 'WHNK', 54, 38, '#c83a2a', 4); pixText(g, '1340 AM', 132, 64, '#2a2a2a');
    r(210, 30, 60, 80, '#e8e0c8'); r(214, 34, 52, 72, '#8ab0d8'); g.strokeStyle = '#3a3a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(240, 40); g.lineTo(226, 104); g.moveTo(240, 40); g.lineTo(254, 104); g.stroke(); r(239, 36, 3, 4, '#e84a3a');
    for (let k = 0; k < 3; k++) { r(20, 120 + k * 34, 160, 4, '#5a3e24'); for (let i = 0; i < 26; i++) r(22 + i * 6, 96 + k * 34, 5, 24, ['#2a2a2a', '#8a2a2a', '#2a4a7a', '#c8a050'][(i + k) % 4]); }
    // the floor: worn carpet
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a2a2a', '#4a3434', (y - 262) / 98));
    for (let i = 0; i < 200; i++) r(R() * NW, 262 + R() * 98, 2, 1, '#2a1e1e');
    // the desk: the mixing board, the reel-to-reel, the mic on its boom
    r(300, 222, 300, 12, '#5a4a3a'); r(300, 222, 300, 2, '#7a6a52'); r(310, 234, 10, 60, '#3a2a1e'); r(580, 234, 10, 60, '#3a2a1e');
    r(400, 202, 120, 20, '#2a2a2a'); for (let i = 0; i < 12; i++) { r(406 + i * 9, 206, 3, 12, '#5a5a5a'); r(405 + i * 9, 208 + (i * 5) % 8, 5, 3, '#e8e8e8'); }
    r(320, 180, 60, 42, '#c8ccd0'); r(322, 182, 56, 30, '#8a8e92');
    r(540, 120, 4, 80, '#2a2a2a'); g.strokeStyle = '#2a2a2a'; g.lineWidth = 3; g.beginPath(); g.moveTo(542, 120); g.lineTo(480, 150); g.stroke(); r(468, 146, 16, 24, '#5a5a5a'); r(470, 148, 12, 20, '#8a8a8a');
    // the sound-effects table: a thunder sheet hanging, coconut shells, a door in a box, a wind machine
    r(40, 236, 220, 8, '#6a5a44'); r(46, 244, 6, 50, '#4a3a2a'); r(248, 244, 6, 50, '#4a3a2a');
    for (const x of [64, 76]) { g.fillStyle = '#6a4a2a'; g.beginPath(); g.arc(x, 236, 6, Math.PI, 0); g.fill(); }
    r(100, 200, 40, 36, '#8a6a42'); r(108, 206, 24, 30, '#6a4a2a'); r(126, 220, 3, 3, '#c8a050'); // door in a box
    r(160, 206, 40, 30, '#7a5a3a'); g.strokeStyle = '#5a3a2a'; g.lineWidth = 2; g.beginPath(); g.arc(180, 220, 12, 0, 7); g.stroke(); // wind machine drum
    r(220, 222, 30, 14, '#c8c8c0'); // a box of gravel for footsteps
    return c;
  },
  animate(g, now) {
    // the ON AIR light
    const on = CLARION.onAir; rect(g, 270, 8, 80, 22, '#2a2a2a'); rect(g, 273, 11, 74, 16, on ? '#e8302a' : '#4a2a2a'); pixText(g, 'ON AIR', 286, 15, on ? '#fff0e0' : '#6a4a4a', 1.5);
    // the reels turning, the needles on the board dancing
    for (const x of [336, 364]) { const a = now / (on ? 300 : 3000); g.fillStyle = '#4a4a4a'; g.beginPath(); g.arc(x, 196, 10, 0, 7); g.fill(); rect(g, x + Math.cos(a) * 6 - 1, 196 + Math.sin(a) * 6 - 1, 3, 3, '#c8c8c8'); rect(g, x - 1, 195, 2, 2, '#e8e8e8'); }
    for (let i = 0; i < 2; i++) { const v = on ? Math.abs(Math.sin(now / (120 + i * 40))) : 0; rect(g, 404 + i * 60, 190, 50, 10, '#e8e0c8'); g.strokeStyle = '#c83a2a'; g.beginPath(); g.moveTo(429 + i * 60, 200); g.lineTo(419 + i * 60 + v * 20, 191); g.stroke(); }
    // the thunder sheet, hanging from the ceiling, never quite still
    const sw = Math.sin(now / 800) * 2;
    g.strokeStyle = '#3a3a3a'; g.lineWidth = 1; g.beginPath(); g.moveTo(240, 0); g.lineTo(240 + sw, 120); g.stroke();
    g.fillStyle = '#9aa0a8'; g.beginPath(); g.moveTo(222 + sw, 120); g.lineTo(258 + sw, 120); g.lineTo(256 + sw * 1.4, 200); g.lineTo(224 + sw * 1.4, 200); g.fill(); rect(g, 226 + sw, 124, 2, 70, '#c8ccd0');
  },
  light(g) {
    if (CLARION.onAir) glow(g, 310, 19, 4, 90, '255,60,40', 0.22);
    glow(g, 480, 96, 10, 140, '120,200,160', 0.08);
    glow(g, 320, 200, 20, 260, '255,220,170', 0.14);
  },
  vignette: 0.5
}, 1.5);
