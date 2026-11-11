// Pawn Champ - Madame Orsolya's parlor: a fortune-teller's booth at the end of the boardwalk,
// open all winter. Velvet, fairy lights, a round table and a crystal ball. Used by The Séance (m20)
// and The Gentleman in Grey (M2). Batch E (docs/quests/BATCHES.md, LOCATIONS.md).
'use strict';

const PARLOUR = {
  lights: [], // fairy lights: x, y, color index (filled in by build)
  candles: [[118, 206], [134, 210], [520, 204], [540, 208], [306, 236]]
};
addPlace('orsolya', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(214);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // back wall: draped velvet in deep plum, gathered in folds
    for (let x = 0; x < NW; x++) {
      const f = (Math.sin(x / 9) + 1) / 2, col = lerpColor('#2a0e22', '#5a1e44', f * 0.8);
      r(x, 0, 1, 262, col);
    }
    for (let x = 0; x < NW; x += 18) r(x + 8, 0, 1, 262, 'rgba(10,0,10,0.35)');
    // a pelmet across the top with gold tassels
    r(0, 0, NW, 22, '#3a0e2a'); r(0, 22, NW, 3, '#c8a050');
    for (let x = 6; x < NW; x += 22) { r(x, 25, 2, 8, '#c8a050'); r(x - 1, 33, 4, 4, '#e2c070'); }
    // the curtains swagged back on either side
    for (const [x0, dir] of [[0, 1], [NW, -1]]) {
      for (let y = 25; y < 262; y++) {
        const w = 70 + Math.max(0, 40 - Math.abs(y - 150) * 0.6);
        const x = dir > 0 ? x0 : x0 - w;
        r(x, y, w, 1, lerpColor('#6a1a3a', '#8a2a4a', (y % 14) / 14));
      }
      r(dir > 0 ? 82 : NW - 92, 140, 10, 10, '#c8a050'); // tie-back
    }
    // the window on the right: the boardwalk at night, the Ferris wheel lit and stopped
    const wx = 430, wy = 50, ww = 120, wh = 100;
    r(wx - 6, wy - 6, ww + 12, wh + 12, '#2a1a10'); r(wx - 4, wy - 4, ww + 8, wh + 8, '#c8a050');
    for (let y = wy; y < wy + wh; y++) r(wx, y, ww, 1, lerpColor('#0a0c22', '#1a1a3a', (y - wy) / wh));
    g.strokeStyle = '#3a3a5a'; g.lineWidth = 1; g.beginPath(); g.arc(wx + 74, wy + 52, 34, 0, 7); g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(wx + 74, wy + 52); g.lineTo(wx + 74 + Math.cos(a) * 34, wy + 52 + Math.sin(a) * 34); g.stroke();
      r(wx + 73 + Math.cos(a) * 34, wy + 51 + Math.sin(a) * 34, 3, 3, ['#f0c060', '#f06a8a', '#6ad0f0'][i % 3]); }
    r(wx + 72, wy + 52, 4, wh - 52, '#2a2a40');
    r(wx, wy + wh - 14, ww, 14, '#2a1e18'); for (let x = wx; x < wx + ww; x += 8) r(x, wy + wh - 14, 1, 14, '#1a120e'); // boardwalk planks
    r(wx + ww / 2 - 1, wy, 2, wh, '#c8a050');
    // hand-painted sign on the wall: a palm with an eye in it
    r(170, 50, 90, 70, '#e8d8b0'); r(172, 52, 86, 66, '#f4e8c8'); r(170, 50, 90, 2, '#c8a050'); r(170, 118, 90, 2, '#c8a050');
    for (let i = 0; i < 4; i++) r(196 + i * 10, 62, 7, 24, '#c87a5a'); r(186, 72, 8, 18, '#c87a5a'); r(194, 84, 46, 26, '#c87a5a');
    g.fillStyle = '#f4e8c8'; g.beginPath(); g.ellipse(217, 96, 10, 6, 0, 0, 7); g.fill();
    g.fillStyle = '#3a5a9a'; g.beginPath(); g.arc(217, 96, 4, 0, 7); g.fill(); r(216, 95, 2, 2, '#0e0e14');
    pixText(g, 'PALMS', 192, 126, '#e2c070', 2);
    // a shelf of oddments: jars, a skull with a candle, a stack of cards
    r(300, 96, 100, 5, '#4a2a18'); r(300, 101, 100, 2, '#2a160c');
    for (let i = 0; i < 5; i++) { const x = 306 + i * 18, h = 10 + (i % 3) * 5; r(x, 96 - h, 12, h, ['#6a9a8a', '#9a6a3a', '#3a5a7a', '#8a8a5a', '#6a3a6a'][i]); r(x + 2, 96 - h - 2, 8, 3, '#c8a050'); r(x + 2, 96 - h + 3, 3, h - 6, 'rgba(255,255,255,0.18)'); }
    // the beaded curtain to the back room, on the left
    for (let x = 100; x < 150; x += 4) for (let y = 40; y < 258; y += 4) r(x, y, 2, 2, ['#c8a050', '#8a2a4a', '#3a6a8a'][((x / 4) + (y / 4)) % 3 | 0]);
    r(96, 34, 58, 6, '#3a1a10');
    // floor: a rug with a border over dark boards
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#24140e', '#3a2416', (y - 262) / 98));
    for (let i = -10; i < 22; i++) { g.strokeStyle = 'rgba(10,4,2,0.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(320 + i * 22, 262); g.lineTo(320 + i * 56, NH); g.stroke(); }
    r(0, 260, NW, 3, '#140a06');
    for (let y = 290; y < 352; y++) { const w = 300 + (y - 290) * 3; r(320 - w / 2, y, w, 1, (y - 290) % 10 < 2 ? '#a83a2a' : '#5a1a2a'); }
    r(320 - 150, 290, 300, 2, '#c8a050'); r(320 - 243, 350, 486, 2, '#c8a050');
    for (let i = 0; i < 10; i++) { const x = 200 + i * 24; r(x, 318, 6, 6, '#c8a050'); r(x + 2, 316, 2, 10, '#c8a050'); }
    // the round table, draped to the floor, with the crystal ball's stand
    g.fillStyle = '#3a0e2a'; g.beginPath(); g.ellipse(320, 246, 96, 20, 0, 0, 7); g.fill();
    for (let y = 246; y < 300; y++) { const w = 192 + (y - 246) * 0.8; r(320 - w / 2, y, w, 1, lerpColor('#5a1a3a', '#3a0e2a', (y - 246) / 54)); }
    for (let x = 228; x < 414; x += 10) r(x, 250, 2, 48, 'rgba(20,0,10,0.35)');
    r(230, 296, 180, 3, '#c8a050');
    g.fillStyle = '#6a1e44'; g.beginPath(); g.ellipse(320, 244, 92, 17, 0, 0, 7); g.fill();
    r(306, 232, 28, 6, '#c8a050'); r(310, 228, 20, 4, '#a88040');
    // tarot cards fanned on the cloth
    for (let i = 0; i < 5; i++) { const x = 254 + i * 9; r(x, 240 + (i % 2), 8, 12, '#f4e8c8'); r(x + 1, 241 + (i % 2), 6, 10, ['#3a5a9a', '#8a2a4a', '#c8a050', '#3a7a5a', '#6a3a8a'][i]); }
    for (let i = 0; i < 3; i++) r(368 + i * 6, 244, 5, 8, '#f4e8c8');
    // two chairs
    for (const x of [196, 430]) { r(x, 216, 18, 40, '#2a120a'); r(x + 2, 218, 14, 20, '#7a2a3a'); r(x - 2, 254, 22, 6, '#3a1a10'); r(x, 260, 3, 34, '#2a120a'); r(x + 15, 260, 3, 34, '#2a120a'); }
    // a birdcage on a stand (empty, door open)
    r(570, 120, 2, 140, '#2a1a10'); r(560, 258, 22, 3, '#2a1a10');
    g.strokeStyle = '#c8a050'; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(556 + i * 5, 92); g.lineTo(556 + i * 5, 122); g.stroke(); }
    g.beginPath(); g.arc(571, 92, 15, Math.PI, 0); g.stroke(); r(554, 122, 34, 3, '#c8a050'); r(584, 104, 8, 10, 'rgba(200,160,80,0.5)');
    // candle stands
    for (const [x, y] of PARLOUR.candles) { r(x - 3, y + 8, 6, 3, '#c8a050'); r(x - 2, y, 4, 9, '#efe6cc'); }
    // fairy lights strung in swags across the ceiling
    PARLOUR.lights = [];
    for (let s = 0; s < 4; s++) {
      const x0 = s * 160, x1 = x0 + 160;
      for (let x = x0; x < x1; x += 2) { const t = (x - x0) / 160, y = 30 + Math.sin(t * Math.PI) * 22; r(x, y, 2, 1, '#3a2a20'); }
      for (let k = 1; k < 8; k++) { const t = k / 8, x = x0 + t * 160, y = 31 + Math.sin(t * Math.PI) * 22; PARLOUR.lights.push([x, y, (s + k) % 4]); }
    }
    void R;
    return c;
  },
  animate(g, now) {
    const cols = ['#f8d070', '#f87a9a', '#7ad8f8', '#a8f08a'];
    PARLOUR.lights.forEach(([x, y, i], n) => { const on = Math.sin(now / 600 + n * 1.7) > -0.6; rect(g, x - 1, y, 3, 3, on ? cols[i] : '#3a2a30'); });
    // candle flames
    for (const [x, y] of PARLOUR.candles) { const f = Math.sin(now / 80 + x) > 0 ? 1 : 0; rect(g, x - 1, y - 4 - f, 2, 4 + f, '#f8c050'); rect(g, x, y - 3, 1, 2, '#fff0c0'); }
    // the crystal ball, with mist turning inside it
    g.fillStyle = 'rgba(160,190,230,0.55)'; g.beginPath(); g.arc(320, 216, 15, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { const a = now / 900 + i * 2.1; g.fillStyle = 'rgba(230,240,255,0.35)'; g.beginPath(); g.arc(320 + Math.cos(a) * 6, 216 + Math.sin(a * 1.3) * 5, 4, 0, 7); g.fill(); }
    rect(g, 312, 207, 3, 3, 'rgba(255,255,255,0.8)');
  },
  light(g, now) {
    glow(g, 320, 216, 4, 110, '170,200,255', 0.2 + Math.sin(now / 700) * 0.04);
    for (const [x, y] of PARLOUR.candles) glow(g, x, y - 4, 2, 50, '255,190,110', 0.12);
    glow(g, 320, 34, 10, 300, '255,160,200', 0.05);
  },
  vignette: 0.6
}, 1.5);
