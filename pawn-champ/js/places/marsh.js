// Pawn Champ - Hob's Marsh
// The salt marsh behind town, where the Pack of the Grey Psalter keeps its Moon Table:
// a granite slab on the old causeway, ringed with candles in jam jars, beside the
// last posts of a jetty the tide took decades ago.
'use strict';

addPlace('marsh', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(71);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor('#0a0c24', '#2a2a4e', y / 200));
    for (let i = 0; i < 180; i++) r(R() * NW, R() * 180, 1, 1, R() < 0.25 ? '#ffffff' : '#8a90c0');
    // the full moon, huge and low, with a halo
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(240,230,190,${0.04 + i * 0.02})`; g.beginPath(); g.arc(330, 96, 70 - i * 9, 0, 7); g.fill(); }
    g.fillStyle = '#f6efd0'; g.beginPath(); g.arc(330, 96, 38, 0, 7); g.fill();
    for (const [x, y, rr] of [[318, 84, 8], [344, 104, 6], [326, 112, 4], [348, 82, 4], [310, 102, 3]]) { g.fillStyle = '#e2d8b4'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
    // thin clouds across the moon
    for (let i = 0; i < 6; i++) { const x = 200 + R() * 260, y = 70 + R() * 70, w = 50 + R() * 80; r(x, y, w, 2, 'rgba(60,60,100,0.6)'); r(x + 10, y + 2, w * 0.6, 1, 'rgba(60,60,100,0.5)'); }
    // the town far off: a tree line, a few lights, the lighthouse on the point
    for (let x = 0; x < NW; x += 6) { const h = 8 + Math.abs(Math.sin(x * 0.05) * 10) + R() * 6; r(x, 200 - h, 7, h, '#141830'); }
    for (let i = 0; i < 14; i++) r(380 + R() * 240, 190 + R() * 8, 2, 2, R() < 0.8 ? '#f0c060' : '#c8d8f0');
    r(600, 168, 6, 32, '#1a1e36'); r(598, 164, 10, 4, '#1a1e36'); r(601, 160, 4, 4, '#7ab8f0');
    // the marsh flats: dark grass cut by bright tidal channels
    r(0, 200, NW, 90, '#1e2a26');
    for (let i = 0; i < 400; i++) { const y = 202 + R() * 86; r(R() * NW, y, 1, 1 + (y - 200) / 30, R() < 0.5 ? '#2a3a30' : '#34402e'); }
    const channel = (pts, w0, shine) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
      for (let t = 0; t <= 1; t += 0.01) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t, w = w0 * (0.6 + (y - 200) / 90);
        r(x - w / 2, y, w, 2, '#2a3458'); if (shine && Math.abs(x - 330) < 60) r(x - w / 4, y, w / 2, 1, '#a8a8a0'); } } };
    channel([[0, 214], [120, 218], [220, 210], [330, 222], [420, 216], [520, 226], [NW, 220]], 16, true);
    channel([[300, 222], [320, 240], [300, 262], [340, 286]], 22);
    // moonlight running down the main channel
    // the old causeway: a raised bank of packed earth and stones, where everyone stands
    for (let y = 272; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a3a2e', '#2a2a22', (y - 272) / 88));
    for (let i = 0; i < 90; i++) { const x = R() * NW, y = 278 + R() * 80; r(x, y, 3 + R() * 6, 2 + R() * 2, R() < 0.5 ? '#4a4a40' : '#24241c'); }
    for (let x = 0; x < NW; x += 2) { const h = 2 + (R() * 7 | 0); r(x, 274 - h, 1, h, R() < 0.5 ? '#4a5a3a' : '#5a6a44'); } // salt hay on the bank top
    // the jetty posts the tide left behind, the tallest one at the Moon Table
    for (const [x, h] of [[96, 34], [130, 26], [168, 30], [202, 20], [548, 28], [580, 22], [614, 34]]) { r(x, 252 - h, 8, h + 10, '#2a2218'); r(x, 252 - h, 8, 2, '#4a3a28'); r(x + 2, 254 - h, 2, h, '#3a2e20'); }
    r(462, 222, 16, 74, '#3a2c1e'); r(462, 222, 16, 3, '#5a4630'); r(465, 226, 3, 66, '#4a3a28'); r(460, 252, 20, 3, '#6a6a6a'); r(460, 262, 20, 2, '#6a6a6a');
    // the Moon Table: a granite slab on two stones
    r(372, 286, 18, 18, '#4a4a52'); r(426, 286, 18, 18, '#4a4a52');
    r(364, 276, 88, 12, '#6a6a74'); r(364, 276, 88, 2, '#8a8a94'); r(364, 286, 88, 2, '#3a3a42');
    for (let i = 0; i < 6; i++) r(370 + i * 13, 280, 5, 1, '#5a5a62');
    // the offerings: silver and jewelry from your shelves, and a cup for catching things
    for (const [x, col] of [[378, '#d0d4dc'], [392, '#e2b04a'], [404, '#d0d4dc'], [418, '#a8c8e8'], [432, '#e2b04a']]) { r(x, 272, 6, 4, col); r(x + 1, 272, 2, 1, '#ffffff'); }
    r(410, 264, 8, 10, '#c8ccd4'); r(408, 262, 12, 3, '#d8dce4'); r(412, 274, 4, 2, '#a8acb4');
    // a ring of painted stones around the table
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, x = 408 + Math.cos(a) * 92, y = 300 + Math.sin(a) * 24; r(x, y, 6, 4, '#c8c4b8'); r(x, y + 3, 6, 1, '#6a6a60'); }
    // the Pack's things: a folding table with cookies, a cooler, a cardboard banner
    r(510, 294, 46, 4, '#d8d8d0'); r(512, 298, 2, 18, '#8a8a8a'); r(552, 298, 2, 18, '#8a8a8a');
    for (let i = 0; i < 6; i++) r(514 + i * 6, 290, 4, 3, '#c89060');
    r(566, 302, 26, 16, '#2a6aa0'); r(566, 302, 26, 4, '#e8e8e8');
    r(498, 250, 70, 16, '#c8b090'); pixText(g, 'AWOO', 512, 254, '#5a2a2a', 2); r(498, 266, 2, 34, '#6a5a40'); r(566, 266, 2, 34, '#6a5a40');
    // cattails at the edges of the bank
    for (let i = 0; i < 26; i++) { const x = i < 13 ? i * 6 : 560 + (i - 13) * 6, h = 30 + R() * 30, y = NH - 10;
      r(x, y - h, 1, h, '#3a4a2a'); r(x - 1, y - h + 4, 3, 10, '#5a3a22'); r(x + 1, y - h + 10, 4, 1, '#4a5a32'); }
    return c;
  },
  candles: [[366, 270], [446, 270], [356, 294], [460, 294], [320, 306], [496, 306], [380, 318], [436, 318]],
  fire: [600, 282],
  animate(g, now) {
    for (const [x, y] of this.candles) { rect(g, x, y, 6, 8, 'rgba(200,220,230,0.5)'); rect(g, x + 2, y + 3, 2, 4, '#e8e0c8'); const f = Math.sin(now / 90 + x) > 0; rect(g, x + 2, y + (f ? 0 : 1), 2, 3, f ? '#ffd070' : '#ffb040'); }
    // a small driftwood fire on the bank
    const [fx, fy] = this.fire;
    rect(g, fx - 14, fy + 8, 28, 4, '#3a2a1a'); rect(g, fx - 10, fy + 6, 20, 3, '#4a3020');
    for (let i = 0; i < 7; i++) { const h = 10 + Math.abs(Math.sin(now / (80 + i * 13) + i)) * 14, x = fx - 9 + i * 3;
      rect(g, x, fy + 7 - h, 3, h, i % 2 ? '#e8702a' : '#f0a030'); rect(g, x + 1, fy + 7 - h * 0.6, 1, h * 0.6, '#ffe090'); }
    for (let i = 0; i < 4; i++) { const p = (now / 1400 + i * 0.25) % 1; rect(g, fx - 4 + Math.sin(now / 300 + i) * 6, fy - 10 - p * 40, 1, 1, `rgba(255,200,120,${1 - p})`); }
    // moonlight shimmer on the channels
    for (let i = 0; i < 10; i++) rect(g, 300 + ((i * 29 + now / 50) % 60), 226 + (i * 7) % 60, 4, 1, 'rgba(240,236,210,0.5)');
  },
  light(g, now) {
    glow(g, 330, 96, 30, 260, '200,200,240', 0.1);
    const fl = 0.24 + Math.sin(now / 70) * 0.03 + Math.sin(now / 33) * 0.02;
    glow(g, this.fire[0], this.fire[1], 4, 130, '255,150,70', fl);
    glow(g, 408, 290, 4, 110, '255,200,110', 0.16);
  },
  vignette: 0.5
}, 1.5);

// ---- moved from js/quests/honey.js
// Philippa's bank of the marsh by day: the marsh backdrop with her seven hives and the wildflowers
addPlace('marshHives', {
  build() {
    const c = PLACES.marsh.build(), g = c.getContext('2d'), R = rng(503);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // a noon sky over the moonlit marsh, and the far tree line drawn again in daylight
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor('#6a9ad8', '#c8dcec', y / 200));
    for (let i = 0; i < 8; i++) { const x = R() * NW, y = 20 + R() * 120, w = 50 + R() * 90; r(x, y, w, 6, 'rgba(255,255,255,0.7)'); r(x + 10, y - 4, w * 0.6, 5, 'rgba(255,255,255,0.6)'); }
    for (let x = 0; x < NW; x += 6) { const h = 8 + Math.abs(Math.sin(x * 0.05) * 10) + R() * 6; r(x, 200 - h, 7, h, '#4a6a4a'); }
    r(600, 168, 6, 32, '#e8e4dc'); r(598, 164, 10, 4, '#3a3a3a');
    g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(170,190,150,0.45)'; g.fillRect(0, 200, NW, NH - 200); g.globalCompositeOperation = 'source-over';
    // bramble and goldenrod over the far end of the causeway
    for (let i = 0; i < 700; i++) { const x = 480 + R() * 160, y = 238 + R() * 72; r(x, y, 4, 3, R() < 0.6 ? '#4a7a3a' : '#6a9a4a'); if (R() < 0.3) r(x, y - 2, 2, 2, '#e8c040'); }
    for (let i = 0; i < 120; i++) { const x = 20 + R() * 330, y = 262 + R() * 24; r(x, y, 2, 2, ['#e8c040', '#e8e0f0', '#c86a9a', '#8a7ae0'][i % 4]); r(x, y + 2, 1, 3, '#4a6a3a'); }
    for (let k = 0; k < 7; k++) {
      const x = 30 + k * 46, y = 236 + (k % 2) * 6;
      r(x + 4, y + 36, 4, 10, '#5a4a3a'); r(x + 26, y + 36, 4, 10, '#5a4a3a');
      for (let b = 0; b < 3; b++) { r(x, y + 4 + b * 11, 34, 10, '#f0ece0'); r(x, y + 4 + b * 11, 34, 1, '#ffffff'); r(x, y + 13 + b * 11, 34, 1, '#c8c4b8'); }
      r(x - 2, y, 38, 5, '#8a8a90'); r(x - 2, y, 38, 1, '#b8b8c0'); r(x + 12, y + 34, 10, 2, '#2a2218');
    }
    r(370, 242, 30, 40, '#7a6a5a'); r(372, 244, 26, 36, '#9a8a6a'); r(366, 238, 38, 6, '#5a4a3a'); // her smoker shed
    return c;
  },
  animate(g, now) {
    for (let i = 0; i < 26; i++) { const t = now / 700 + i * 2.3; rect(g, 40 + (i * 13) % 320 + Math.sin(t) * 14, 236 + (i * 7) % 40 + Math.cos(t * 1.3) * 8, 1, 1, '#2a2218'); }
  },
  light(g) { glow(g, 200, 200, 10, 220, '255,230,170', 0.08); },
  vignette: 0.25
}, 1.5);

// ---- moved from js/quests/dog.js
addDayVariant('marshDay', 'marsh', { sky: '190,200,190', amount: 0.4 });
