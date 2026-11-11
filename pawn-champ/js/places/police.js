// Pawn Champ - the police station, batch D (docs/quests/BATCHES.md, LOCATIONS.md).
// Hollow Neck Police, the old brick firehouse on School Street. Captain Barrow's office behind a
// glass partition on the left; the evidence cage on the right, chain link over steel shelving.
//   police - by day, under the fluorescent tubes (The Evidence Room)
'use strict';

addPlace('police', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(121);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // painted cinderblock, institutional green over cream
    r(0, 0, NW, 262, '#c8d0b8');
    for (let y = 0; y < 262; y += 12) { r(0, y, NW, 1, '#b4bca4'); for (let x = (y / 12 % 2) * 16; x < NW; x += 32) r(x, y, 1, 12, '#b4bca4'); }
    r(0, 150, NW, 112, '#7a9a7a'); for (let y = 156; y < 262; y += 12) { r(0, y, NW, 1, '#6a8a6a'); for (let x = (y / 12 % 2) * 16; x < NW; x += 32) r(x, y, 1, 12, '#6a8a6a'); }
    r(0, 148, NW, 4, '#5a7a5a');
    // ceiling with the fluorescent fixtures (lit live)
    r(0, 0, NW, 14, '#e8e8e0'); for (let x = 0; x < NW; x += 40) r(x, 0, 1, 14, '#c8c8c0');
    // Barrow's office: a glass partition with half-drawn blinds, her desk, a flag stand, a plant
    r(14, 40, 210, 222, '#3a3a40'); r(18, 44, 202, 214, '#5a6a78');
    for (let y = 46; y < 150; y += 4) r(18, y, 202, 2, '#c8ccd0');
    r(18, 150, 202, 108, 'rgba(160,190,210,0.25)');
    r(118, 40, 4, 222, '#3a3a40');
    pixText(g, 'CAPT. BARROW', 132, 160, '#e8e4dc');
    r(36, 196, 120, 8, '#5a4a3a'); r(36, 204, 120, 40, '#4a3a2c'); r(40, 208, 54, 32, '#3e3024');
    r(52, 180, 30, 16, '#2a2a30'); r(54, 182, 26, 12, '#4a7aa0'); r(64, 194, 6, 2, '#2a2a30');
    r(104, 188, 22, 8, '#e8e4dc'); r(130, 190, 14, 6, '#c8c0a8'); r(146, 186, 6, 10, '#e8e4dc'); r(147, 182, 4, 4, '#3a2a1a');
    r(176, 170, 22, 26, '#5a3a24'); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#3a7a3a' : '#4a8a4a'; g.beginPath(); g.ellipse(187 + Math.cos(i) * 10, 160 - i * 3, 8, 4, i, 0, 7); g.fill(); }
    // the front counter, the sign-out log, a bell, the town seal plaque
    r(232, 66, 84, 60, '#8a6a44'); r(236, 70, 76, 52, '#2a3a5a');
    g.fillStyle = '#c8a050'; g.beginPath(); g.arc(274, 92, 16, 0, 7); g.fill(); g.fillStyle = '#2a3a5a'; g.beginPath(); g.arc(274, 92, 12, 0, 7); g.fill();
    g.fillStyle = '#e8e0c8'; g.beginPath(); g.ellipse(272, 93, 7, 3, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(278, 93); g.lineTo(284, 88); g.lineTo(283, 93); g.lineTo(284, 98); g.fill();
    pixText(g, 'HOLLOW NECK POLICE', 274 - textWidth('HOLLOW NECK POLICE') / 2, 114, '#e8d8a8');
    // the notice board: wanted posters, a lost cat, the softball schedule
    r(236, 140, 96, 70, '#a87a4a'); r(238, 142, 92, 66, '#b88a5a');
    for (const [x, y, w, h, col] of [[244, 148, 24, 30, '#f4eedc'], [272, 146, 22, 26, '#f4eedc'], [298, 150, 26, 22, '#f0e0a0'], [246, 182, 34, 22, '#f4eedc'], [286, 178, 38, 26, '#e8e4dc']]) {
      r(x, y, w, h, col); r(x + w / 2 - 1, y - 1, 3, 3, '#c83a3a'); for (let k = 0; k < 3; k++) r(x + 3, y + h - 8 + k * 2, w - 6, 1, '#8a8a90'); }
    g.fillStyle = '#d8b090'; g.beginPath(); g.arc(256, 158, 5, 0, 7); g.fill(); g.beginPath(); g.arc(283, 156, 5, 0, 7); g.fill();
    rect(g, 304, 156, 12, 8, '#e8a040'); rect(g, 302, 154, 4, 4, '#e8a040'); rect(g, 314, 154, 4, 4, '#e8a040');
    // coffee machine and water cooler
    r(342, 196, 40, 6, '#5a5a60'); r(346, 160, 24, 36, '#2a2a30'); r(350, 186, 12, 10, '#5a3a2a'); r(366, 166, 2, 4, '#e83a3a');
    r(392, 168, 22, 60, '#e8e8f0'); r(394, 136, 18, 32, 'rgba(140,190,240,0.55)'); r(398, 132, 10, 4, '#2a6ab0');
    // the evidence cage: chain link over steel shelves of bagged, boxed, tagged things
    const cx = 428, cw = 206;
    r(cx, 30, cw, 232, '#2a2a30');
    for (let s = 0; s < 4; s++) {
      const y = 60 + s * 50;
      r(cx + 8, y + 36, cw - 16, 4, '#8a8a90');
      for (let i = 0; i < 9; i++) { const x = cx + 12 + i * 21 + (R() * 4 | 0), h = 18 + (R() * 16 | 0), col = R() < 0.6 ? '#a8885a' : R() < 0.5 ? '#d8d8d0' : '#5a5a62';
        r(x, y + 36 - h, 18, h, col); r(x, y + 36 - h, 18, 2, shade(col, 0.15)); r(x + 4, y + 36 - h + 5, 10, 6, '#f4eedc'); r(x + 5, y + 36 - h + 7, 8, 1, '#c83a3a'); }
    }
    r(cx + 6, 30, 3, 232, '#8a8a90'); r(cx + cw - 9, 30, 3, 232, '#8a8a90');
    g.strokeStyle = 'rgba(190,195,205,0.55)'; g.lineWidth = 1;
    for (let k = -cw; k < 232; k += 8) { g.beginPath(); g.moveTo(cx, 30 + k); g.lineTo(cx + cw, 30 + k + cw); g.stroke(); g.beginPath(); g.moveTo(cx + cw, 30 + k); g.lineTo(cx, 30 + k + cw); g.stroke(); }
    // the cage door, padlocked, with its little window and clipboard
    r(cx + 70, 120, 66, 142, '#3a3a40'); r(cx + 74, 124, 58, 134, 'rgba(60,60,70,0.4)'); r(cx + 124, 186, 8, 12, '#c8a050'); r(cx + 126, 182, 4, 5, '#8a8a90');
    r(cx + 30, 180, 30, 40, '#5a3a24'); r(cx + 32, 184, 26, 34, '#f4eedc'); r(cx + 40, 178, 10, 4, '#8a8a90'); pixText(g, 'LOG', cx + 38, 188, '#2a2a3a');
    for (let k = 0; k < 6; k++) r(cx + 35, 196 + k * 3, 20, 1, '#8a8a90');
    r(cx, 22, cw, 10, '#c8a050'); pixText(g, 'EVIDENCE - SIGN IN', cx + 30, 24, '#2a2420');
    // floor: speckled grey linoleum tiles
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#8a8e8a', '#a0a4a0', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(60,64,60,0.3)'; g.beginPath(); g.moveTo(320 + i * 28, 262); g.lineTo(320 + i * 72, NH); g.stroke(); }
    for (const y of [276, 296, 322, 352]) r(0, y, NW, 1, 'rgba(60,64,60,0.3)');
    for (let i = 0; i < 400; i++) r(R() * NW, 264 + R() * 96, 1, 1, R() < 0.5 ? '#6a6e6a' : '#babeba');
    r(0, 262, NW, 3, '#4a5a4a');
    // a bench for whoever's waiting, and a mop bucket nobody has moved since spring
    r(240, 262, 120, 6, '#6a4a2c'); r(244, 268, 4, 22, '#3a3a3a'); r(352, 268, 4, 22, '#3a3a3a'); r(240, 240, 120, 4, '#6a4a2c'); r(244, 244, 4, 18, '#3a3a3a'); r(352, 244, 4, 18, '#3a3a3a');
    r(378, 296, 26, 22, '#e8c020'); r(376, 294, 30, 4, '#f0d040'); r(388, 260, 3, 36, '#8a8a8a');
    return c;
  },
  tubes: [[60, 14], [190, 14], [330, 14], [470, 14], [590, 14]],
  animate(g, now) {
    for (const [x, y] of this.tubes) {
      const dead = x === 330 && Math.sin(now / 37) + Math.sin(now / 113) > 1.5; // one tube that's been "on order" since March
      rect(g, x - 26, y, 52, 6, '#d8d8d0'); rect(g, x - 24, y + 2, 48, 3, dead ? '#9a9a98' : '#fbfbf4');
    }
  },
  light(g, now) {
    for (const [x, y] of this.tubes) { if (x === 330 && Math.sin(now / 37) + Math.sin(now / 113) > 1.5) continue; glow(g, x, y + 6, 6, 120, '230,245,255', 0.1); }
    glow(g, 66, 186, 2, 40, '120,170,230', 0.1);
  },
  vignette: 0.3
}, 1.5);
