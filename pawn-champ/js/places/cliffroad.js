// Pawn Champ - The Cliff Road house. A scene location, batch A (docs/quests/BATCHES.md, LOCATIONS.md).
// Ellery Thorne's big shingled house above the harbor: the dining room, with clocks, ship models
// in cases, a fire, a long table laid for dinner, and a dog asleep on a dog. M10's dinner; M2 and
// later quests can borrow it as any rich house on the cliff.
//   view.bg = 'cliffroad'
'use strict';

addPlace('cliffroad', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(111);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // oxblood paper over dark panelling
    r(0, 0, NW, 262, '#5a1e1e');
    for (let x = 0; x < NW; x += 20) { r(x, 0, 10, 200, '#621f20'); for (let y = 10 + (x / 20 % 2) * 16; y < 196; y += 32) { r(x + 4, y, 3, 3, '#7a3a2a'); } }
    r(0, 0, NW, 14, '#2a1410'); r(0, 14, NW, 3, '#a8804a');
    r(0, 196, NW, 66, '#3a2014'); r(0, 196, NW, 3, '#6a4226'); for (let x = 6; x < NW; x += 46) { r(x, 206, 38, 48, '#341c12'); r(x, 206, 38, 1, '#5a3822'); }
    // the bay window: the harbor, the moon and the lighthouse (glass in animate)
    r(240, 34, 160, 150, '#2a1410'); r(232, 182, 176, 10, '#6a4226'); r(232, 182, 176, 2, '#8a5c36');
    // a portrait of a stern woman holding a spoon
    r(96, 40, 70, 88, '#c8a050'); r(100, 44, 62, 80, '#2a2a22'); for (let y = 44; y < 124; y++) r(100, y, 62, 1, lerpColor('#3a3a2a', '#1e1e16', (y - 44) / 80));
    r(120, 60, 22, 22, '#d8b898'); r(116, 56, 30, 10, '#4a4a4a'); r(112, 82, 38, 42, '#2a2a3a'); r(124, 84, 14, 4, '#e8e4dc'); r(142, 96, 3, 16, '#d8dce4'); r(141, 94, 5, 4, '#d8dce4');
    // clocks: a banjo clock and a ship's clock
    r(196, 54, 16, 70, '#6a3a20'); clockFace(g, 204, 50, 10, '#c8a050', '#efe6cc', [10, 10]); r(198, 108, 12, 14, '#efe6cc');
    clockFace(g, 450, 60, 12, '#c8a050', '#f4eedc', [3, 40]);
    // ship models in glass cases on the sideboard
    r(424, 140, 196, 10, '#6a4226'); r(424, 140, 196, 2, '#8a5c36'); r(430, 150, 184, 46, '#4a2a18'); for (let x = 436; x < 610; x += 60) r(x, 156, 52, 34, '#3a2010');
    for (const [x, w] of [[440, 74], [530, 80]]) { r(x, 92, w, 48, 'rgba(180,200,210,0.18)'); r(x, 92, w, 2, '#c8a050'); r(x, 138, w, 2, '#c8a050');
      r(x + 10, 124, w - 20, 8, '#3a2a1e'); r(x + 14, 122, w - 28, 3, '#5a3a24'); for (let m = 0; m < 3; m++) { r(x + 18 + m * (w - 36) / 2, 98, 1, 26, '#3a2a1e'); r(x + 13 + m * (w - 36) / 2, 102, 12, 9, '#e8e0cc'); r(x + 14 + m * (w - 36) / 2, 112, 10, 8, '#f0ead8'); } }
    // the fireplace with two dogs, one asleep on the other
    r(20, 150, 120, 112, '#6a5a50'); r(14, 144, 132, 10, '#8a7a6a'); r(40, 176, 80, 86, '#140c08');
    r(30, 158, 100, 4, '#4a3a30');
    r(52, 246, 56, 6, '#2a2a2a'); // andirons
    // the long table, laid for three, with candles
    r(156, 262, 330, 14, '#4a2a18'); r(150, 254, 342, 10, '#6a3a20'); r(150, 254, 342, 2, '#8a5a34');
    r(166, 276, 8, 44, '#3a2010'); r(468, 276, 8, 44, '#3a2010');
    r(150, 252, 342, 3, '#f0ece0'); // the cloth's edge
    for (const x of [200, 320, 440]) { g.fillStyle = '#f4f0e8'; g.beginPath(); g.ellipse(x, 252, 18, 4, 0, 0, 7); g.fill(); g.fillStyle = '#c8a050'; g.beginPath(); g.ellipse(x, 252, 12, 2.5, 0, 0, 7); g.fill(); r(x + 22, 246, 2, 8, '#d8dce4'); r(x - 24, 246, 2, 8, '#d8dce4'); }
    for (const x of [262, 380]) { r(x, 226, 4, 24, '#d8dce4'); r(x - 4, 248, 12, 3, '#d8dce4'); r(x + 1, 216, 2, 10, '#f4f0e0'); }
    // a parquet floor and a Turkey rug
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#4a2e1a', '#6a4426', (y - 262) / 98));
    for (let y = 266; y < NH; y += 10) for (let x = (y % 20 ? 0 : 10); x < NW; x += 20) r(x, y, 10, 1, '#3a2214');
    for (let y = 290; y < 352; y++) { const w = 380 + (y - 290) * 3; r(320 - w / 2, y, w, 1, (y - 290) % 12 < 2 ? '#c8a050' : (y >> 3) % 2 ? '#7a2a24' : '#6a2420'); }
    // the dogs: a big grey wolfhound on the hearth rug, and a small terrier asleep on top of him
    g.fillStyle = '#8a8a90'; g.beginPath(); g.ellipse(80, 282, 40, 12, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(118, 278, 12, 9, 0, 0, 7); g.fill(); r(122, 268, 6, 6, '#7a7a80');
    g.fillStyle = '#c89a5a'; g.beginPath(); g.ellipse(76, 268, 18, 7, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(92, 266, 7, 6, 0, 0, 7); g.fill(); r(94, 261, 3, 3, '#8a6a3a');
    return c;
  },
  animate(g, now) {
    // the bay window: night over the harbor, the lighthouse turning
    for (let y = 40; y < 180; y++) rect(g, 246, y, 148, 1, lerpColor('#0a1028', '#22304e', (y - 40) / 140));
    g.fillStyle = '#ece6d0'; g.beginPath(); g.arc(290, 70, 10, 0, 7); g.fill();
    rect(g, 246, 140, 148, 40, '#0c1830'); for (let i = 0; i < 8; i++) rect(g, 250 + ((i * 31 + now / 80) % 140), 146 + (i * 5) % 30, 8, 1, 'rgba(220,220,240,0.35)');
    rect(g, 360, 112, 6, 28, '#e8e4dc'); rect(g, 358, 108, 10, 5, '#2a2a2a');
    if (Math.sin(now / 600) > 0.4) rect(g, 352, 108, 22, 3, 'rgba(255,240,180,0.8)');
    for (const x of [318]) rect(g, x, 34, 4, 150, '#2a1410');
    rect(g, 246, 108, 148, 3, '#2a1410');
    // the fire
    for (let i = 0; i < 9; i++) { const h = 12 + Math.abs(Math.sin(now / (90 + i * 11) + i)) * 20, x = 56 + i * 6;
      rect(g, x, 246 - h, 4, h, i % 2 ? '#e8702a' : '#f0a030'); rect(g, x + 1, 246 - h * 0.5, 2, h * 0.5, '#ffe090'); }
    // candle flames
    for (const x of [263, 381]) { const f = Math.sin(now / 90 + x) > 0; rect(g, x, f ? 211 : 212, 2, 4, f ? '#ffd070' : '#ffb040'); }
    // the small dog breathes
    const b = Math.sin(now / 700) > 0 ? 1 : 0; rect(g, 66, 261 - b, 20, 1, '#c89a5a');
  },
  light(g, now) {
    glow(g, 80, 220, 6, 170, '255,150,70', 0.22 + Math.sin(now / 70) * 0.02);
    for (const x of [264, 382]) glow(g, x, 214, 2, 90, '255,210,130', 0.18);
    glow(g, 290, 70, 4, 80, '200,210,240', 0.08);
  },
  vignette: 0.55
}, 1.5);

// ---- moved from js/quests/longcon.js
// ---------------------------------------------------------------- the places: the estate sale, and the Anchor's back booth
// The Cliff Road dining room by day, every surface tagged.   view.bg = 'cliffroadSale'
addPlace('cliffroadSale', {
  build() {
    const c = PLACES.cliffroad.build(), g = c.getContext('2d'), R = rng(1993);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(200,190,170,0.34)'; g.fillRect(0, 0, NW, NH); g.globalCompositeOperation = 'source-over';
    // a banner across the panelling
    r(180, 16, 280, 18, '#e8e0c8'); r(180, 34, 280, 2, '#8a7a5a'); pixText(g, 'ESTATE SALE  -  ALL ITEMS AS SEEN', 194, 21, '#7a2a3a', 1);
    // the long table, crowded with lots, each with a white tag on a string
    const lots = [[176, '#d8dce4', 10, 18], [204, '#c8a050', 14, 12], [232, '#e8e4dc', 8, 22], [268, '#6a3a20', 22, 14], [300, '#d8dce4', 12, 16], [338, '#3a5a8a', 16, 20], [372, '#c8a050', 10, 10], [404, '#e8e4dc', 18, 14], [440, '#8a8a90', 12, 18]];
    for (const [x, col, w, h] of lots) { r(x, 252 - h, w, h, col); r(x, 252 - h, w, 1, shade(col, 0.15)); r(x + w - 2, 252 - h - 6, 7, 5, '#f8f4ea'); r(x + w - 3, 252 - h - 2, 1, 3, '#6a6a6a'); }
    // the sword in pride of place on a velvet stand
    r(250, 200, 70, 4, '#d8dce4'); r(244, 196, 8, 12, '#c8a050'); r(238, 200, 6, 4, '#c8a050'); r(246, 210, 80, 6, '#5a1a2a');
    // tags on the ship-model cases and the clocks
    for (const [x, y] of [[470, 94], [560, 94], [206, 108], [130, 40]]) { r(x, y, 9, 6, '#f8f4ea'); r(x + 4, y - 4, 1, 4, '#6a6a6a'); }
    // a box of kitchen junk on the floor, the porringer's handle sticking out
    r(520, 290, 54, 30, '#a8804a'); r(520, 290, 54, 3, '#c8a060'); r(530, 284, 10, 8, '#8a8a90'); r(548, 286, 14, 6, '#a8a8b0'); r(564, 282, 6, 10, '#d8dce4');
    pixText(g, 'ALL $1', 528, 304, '#3a2a1e', 1);
    void R;
    return c;
  },
  animate(g, now) {
    for (let y = 40; y < 180; y++) rect(g, 246, y, 148, 1, lerpColor('#8ab0d0', '#c8d8e0', (y - 40) / 140));
    rect(g, 246, 140, 148, 40, '#5a7a9a'); for (let i = 0; i < 8; i++) rect(g, 250 + ((i * 31 + now / 80) % 140), 146 + (i * 5) % 30, 8, 1, 'rgba(255,255,255,0.5)');
    rect(g, 360, 112, 6, 28, '#e8e4dc'); rect(g, 358, 108, 10, 5, '#2a2a2a');
    rect(g, 318, 34, 4, 150, '#2a1410'); rect(g, 246, 108, 148, 3, '#2a1410');
  },
  light(g) { glow(g, 320, 110, 10, 200, '255,250,230', 0.12); },
  vignette: 0.25
}, 1.5);
