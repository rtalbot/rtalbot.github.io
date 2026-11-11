// Pawn Champ - The sugarhouse in the woods past Hob's Marsh, March. m73 The Sugar Pan (pitched, PR #35).
// A board-and-batten shed under bare maples, steam pouring from the vent on its roof, the door open on
// the arch and its fire, buckets on the trees, a woodpile, a sap tank on a sled, snow going in patches.
//   SUGARHOUSE.boiling = false stops the steam and dims the fire (the pan is in your shop).
'use strict';

const SUGARHOUSE = { boiling: true };

addPlace('sugarhouse', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(221);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (let y = 0; y < 220; y++) r(0, y, NW, 1, lerpColor('#8aa0c0', '#e8d0b8', y / 220)); // late-afternoon sky
    // bare maples behind, grey trunks and a lace of branches
    const tree = (x, base, h, w, col) => { r(x - w / 2, base - h, w, h, col); g.strokeStyle = col; g.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const y = base - h + 10 + i * h / 9, d = (i % 2 ? 1 : -1) * (20 + R() * 30); g.beginPath(); g.moveTo(x, y); g.lineTo(x + d, y - 20 - R() * 20); g.lineTo(x + d * 1.3, y - 30 - R() * 20); g.stroke(); } };
    for (let i = 0; i < 16; i++) tree(R() * NW, 220, 120 + R() * 60, 4, '#9a9690');
    // the ground: mud, last snow in patches, dead leaves
    for (let y = 220; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a5a44', '#5a4a36', (y - 220) / 140));
    for (let i = 0; i < 26; i++) { g.fillStyle = '#eef0f4'; g.beginPath(); g.ellipse(R() * NW, 236 + R() * 120, 20 + R() * 50, 4 + R() * 8, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 300; i++) r(R() * NW, 226 + R() * 134, 2, 1, ['#8a5a2a', '#a8742a', '#5a3a1a'][i % 3]);
    // the sugarhouse: grey boards, a tin roof with snow sliding off, the vent cupola (steam in animate)
    r(240, 120, 240, 120, '#7a6e60'); for (let x = 240; x < 480; x += 12) r(x, 120, 2, 120, '#5a5046');
    g.fillStyle = '#8a8a90'; g.beginPath(); g.moveTo(224, 124); g.lineTo(360, 64); g.lineTo(496, 124); g.fill();
    g.fillStyle = '#f0f2f6'; g.beginPath(); g.moveTo(240, 118); g.lineTo(300, 92); g.lineTo(306, 98); g.lineTo(256, 120); g.fill();
    r(336, 40, 48, 34, '#7a6e60'); g.fillStyle = '#8a8a90'; g.beginPath(); g.moveTo(330, 42); g.lineTo(360, 24); g.lineTo(390, 42); g.fill(); for (let i = 0; i < 4; i++) r(340 + i * 11, 48, 6, 22, '#2a2420');
    r(300, 150, 70, 90, '#1a120c'); r(296, 146, 78, 4, '#5a5046'); // the open door, dark inside
    r(310, 210, 50, 30, '#3a3a3a'); r(306, 206, 58, 6, '#5a5a5a'); // the arch
    r(390, 150, 40, 30, '#2a2420'); r(394, 154, 32, 22, '#e8b860'); r(409, 154, 2, 22, '#2a2420');
    // the woodpile under a lean-to
    r(480, 180, 120, 60, '#5a4a3a'); g.fillStyle = '#6a6a70'; g.beginPath(); g.moveTo(474, 182); g.lineTo(606, 170); g.lineTo(606, 178); g.lineTo(474, 190); g.fill();
    for (let y = 0; y < 6; y++) for (let x = 0; x < 11; x++) { const cx = 488 + x * 10 + (y % 2) * 5, cy = 196 + y * 8; g.fillStyle = '#c8a070'; g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill(); r(cx - 1, cy - 1, 2, 2, '#a87a4a'); }
    // big maples in front with taps and buckets
    for (const [x, w] of [[60, 26], [170, 18], [560, 30]]) { r(x, 0, w, 300, '#6a645c'); r(x + 3, 0, 4, 300, '#7a746c'); for (let y = 20; y < 300; y += 14) r(x + R() * w, y, 3, 8, '#5a544c');
      r(x + w / 2 - 6, 200, 12, 14, '#a8acb0'); r(x + w / 2 - 7, 198, 14, 3, '#c8ccd0'); r(x + w / 2 - 1, 196, 2, 4, '#5a5a5a'); r(x + w / 2 - 5, 192, 10, 6, '#c8ccd0'); }
    // the sap tank on a sled
    r(40, 300, 110, 8, '#5a3a2a'); r(50, 268, 90, 32, '#9aa0a8'); r(50, 268, 90, 4, '#c8ccd0'); g.fillStyle = '#9aa0a8'; g.beginPath(); g.ellipse(50, 284, 6, 16, 0, 0, 7); g.ellipse(140, 284, 6, 16, 0, 0, 7); g.fill();
    return c;
  },
  animate(g, now) {
    const on = SUGARHOUSE.boiling;
    // steam out of the cupola, rolling off into the trees
    if (on) for (let i = 0; i < 12; i++) { const p = (now / 3000 + i / 12) % 1; g.fillStyle = `rgba(250,250,250,${0.55 * (1 - p)})`; g.beginPath();
      g.ellipse(360 + p * 80 + Math.sin(p * 5 + i) * 10, 36 - p * 60, 12 + p * 30, 8 + p * 16, 0, 0, 7); g.fill(); }
    // the arch fire through the door, and sparks
    for (let i = 0; i < 6; i++) { const h = (on ? 6 : 2) + Math.abs(Math.sin(now / (80 + i * 11) + i)) * (on ? 8 : 2); rect(g, 314 + i * 7, 230 - h, 5, h, i % 2 ? '#e86a1a' : '#f8b030'); }
    // a drip from each tap into its bucket
    for (const [x, w] of [[60, 26], [170, 18], [560, 30]]) { const p = (now / 1600 + x) % 1; rect(g, x + w / 2 - 1, 198 + p * 6, 1, 2, 'rgba(220,230,240,0.8)'); }
    // snowmelt dripping off the roof edge
    for (let i = 0; i < 6; i++) { const p = (now / 1200 + i / 6) % 1; rect(g, 250 + i * 40, 122 + p * 20, 1, 2, 'rgba(200,220,240,0.7)'); }
  },
  light(g, now) {
    if (SUGARHOUSE.boiling) glow(g, 335, 222, 4, 70, '255,160,70', 0.22 + Math.sin(now / 90) * 0.02);
    glow(g, 410, 165, 2, 50, '255,210,140', 0.1);
    glow(g, 320, 200, 40, 360, '255,220,180', 0.06);
  },
  vignette: 0.3
}, 1.5);
