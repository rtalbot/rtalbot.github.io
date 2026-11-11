// Pawn Champ - The Old Burying Ground
// Hollow Neck's colonial graveyard on the hill behind the meetinghouse. Slate stones with
// winged heads and willows. During the Fog the dead hold a market on the box tombs.
'use strict';

addPlace('graveyard', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(61);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // night sky, lit from inside the fog
    for (let y = 0; y < 240; y++) r(0, y, NW, 1, lerpColor('#1a2234', '#4a5866', y / 240));
    for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(220,230,240,${0.05 + i * 0.03})`; g.beginPath(); g.arc(150, 70, 50 - i * 10, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(240,240,232,0.7)'; g.beginPath(); g.arc(150, 70, 14, 0, 7); g.fill();
    // far trees, soft in the fog
    for (let x = -20; x < NW; x += 26 + (R() * 20 | 0)) { const h = 50 + R() * 50; g.fillStyle = 'rgba(52,64,76,0.8)'; g.beginPath(); g.ellipse(x, 214 - h / 2, 22 + R() * 14, h / 2, 0, 0, 7); g.fill(); }
    // the meetinghouse: white clapboard, a tall steeple, one lit window
    const mx = 430;
    r(mx, 130, 120, 94, '#a8b0b4'); for (let y = 132; y < 224; y += 4) r(mx, y, 120, 1, '#98a0a6');
    for (let i = 0; i < 26; i++) r(mx - 6 + i * 2.6, 130 - i, 132 - i * 5.2, 1, '#4a5058');
    r(mx + 42, 54, 36, 76, '#b4bcc0'); r(mx + 42, 54, 36, 2, '#c8d0d4'); r(mx + 52, 70, 16, 22, '#3a4450'); r(mx + 59, 70, 2, 22, '#b4bcc0');
    r(mx + 46, 40, 28, 14, '#b4bcc0'); for (let i = 0; i < 34; i++) r(mx + 60 - (14 - i * 0.4), 40 - i, (14 - i * 0.4) * 2, 1, '#4a5058');
    r(mx + 59, 0, 2, 8, '#2a3038');
    for (const [x, lit] of [[mx + 12, false], [mx + 88, true]]) { r(x, 158, 18, 30, '#2a3440'); if (lit) { r(x + 2, 160, 14, 26, '#e8b860'); r(x + 8, 160, 2, 26, '#8a6a3a'); r(x + 2, 172, 14, 2, '#8a6a3a'); } r(x - 2, 156, 22, 3, '#c8d0d4'); }
    r(mx + 50, 190, 20, 34, '#3a2a24'); r(mx + 48, 186, 24, 4, '#c8d0d4');
    // a fieldstone wall along the back of the yard
    for (let x = 0; x < NW; x += 9) { const h = 6 + (R() * 4 | 0); r(x, 222 - h + (R() * 3 | 0), 8, h, R() < 0.5 ? '#5a6068' : '#6a7078'); }
    r(0, 222, NW, 4, '#4a5058');
    // the hill: wet grass, then the path
    for (let y = 224; y < NH; y++) r(0, y, NW, 1, lerpColor('#3a4a42', '#24302a', (y - 224) / 136));
    for (let i = 0; i < 500; i++) { const x = R() * NW, y = 226 + R() * 134; r(x, y, 1, 2 + R() * 3, R() < 0.5 ? '#4a5a4a' : '#2e3a32'); }
    for (let y = 280; y < NH; y++) { const w = 120 + (y - 280) * 1.8; r(250 - w / 2 + (y - 280) * 0.4, y, w, 1, (y % 5) ? '#4a463e' : '#3e3a34'); }
    // slate headstones: a back row, small and leaning, then larger ones nearer
    const stone = (x, y, w, h, lean, col) => {
      g.save(); g.translate(x + w / 2, y + h); g.rotate(lean);
      const s = col || '#3a3e46';
      rect(g, -w / 2, -h, w, h, s); rect(g, -w / 2 - 2, -h + 6, w + 4, h - 6, s);
      g.fillStyle = s; g.beginPath(); g.arc(0, -h + 6, w / 2, Math.PI, 0); g.fill();
      g.beginPath(); g.arc(-w / 2, -h + 7, 3, Math.PI, 0); g.fill(); g.beginPath(); g.arc(w / 2, -h + 7, 3, Math.PI, 0); g.fill();
      rect(g, -w / 2 + 1, -h + 1, 2, h - 2, shade(s, 0.18));
      // a winged head, a willow, or an urn, then lines of lettering
      const motif = (x * 7 + y) % 3;
      if (motif === 0) { g.fillStyle = shade(s, 0.3); g.beginPath(); g.arc(0, -h + 8, 3, 0, 7); g.fill(); rect(g, -w / 2 + 3, -h + 7, w / 2 - 5, 2, shade(s, 0.25)); rect(g, 3, -h + 7, w / 2 - 5, 2, shade(s, 0.25)); }
      else if (motif === 1) { rect(g, -1, -h + 4, 2, 9, shade(s, 0.28)); for (let k = 0; k < 4; k++) rect(g, -5 + k, -h + 6 + k * 2, 10 - k * 2, 1, shade(s, 0.28)); }
      else { rect(g, -3, -h + 6, 6, 6, shade(s, 0.28)); rect(g, -4, -h + 5, 8, 2, shade(s, 0.28)); }
      for (let k = 0; k < Math.min(5, (h - 18) / 5); k++) rect(g, -w / 2 + 4, -h + 18 + k * 5, w - 8 - (k % 2) * 4, 1, shade(s, 0.22));
      rect(g, -w / 2 - 3, -1, w + 6, 2, '#24302a');
      g.restore();
    };
    for (let i = 0; i < 12; i++) stone(14 + i * 52 + (R() * 14 | 0), 222 + (i % 3) * 3, 14, 20, (R() - 0.5) * 0.18, i % 4 ? '#3a3e46' : '#4a4a4a');
    for (const [x, y, w, h, l] of [[22, 250, 20, 34, -0.08], [94, 246, 18, 30, 0.06], [180, 252, 22, 36, 0.03], [540, 248, 22, 38, -0.05], [600, 256, 20, 34, 0.1], [508, 268, 18, 28, 0.04]]) stone(x, y, w, h, l, '#383c44');
    // the box tomb, the ghost market's best stall: a cloth, a lantern hook and a few wares
    r(316, 230, 92, 30, '#6a6e70'); r(312, 226, 100, 6, '#8a8e90'); r(312, 226, 100, 1, '#a8acae');
    for (let i = 0; i < 4; i++) r(320 + i * 24, 236, 16, 20, '#5a5e60');
    r(316, 222, 70, 5, '#5a4a6a'); r(316, 227, 6, 18, '#5a4a6a'); r(380, 227, 6, 14, '#5a4a6a');
    for (const [x, col] of [[328, '#c8a050'], [342, '#9ab8c8'], [356, '#d0d0d0'], [370, '#a85a4a']]) { r(x, 216, 6, 6, col); r(x + 1, 216, 2, 1, '#ffffff'); }
    r(398, 196, 2, 30, '#2a2a30'); r(396, 196, 10, 2, '#2a2a30');
    // an old bare elm leaning over the yard
    g.fillStyle = '#20262c';
    g.beginPath(); g.moveTo(232, 226); g.lineTo(240, 120); g.lineTo(248, 226); g.fill();
    const branch = (x, y, a, len, w) => { if (len < 6 || w < 1) return; const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len;
      g.strokeStyle = '#20262c'; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(ex, ey); g.stroke();
      branch(ex, ey, a - 0.45 - R() * 0.2, len * 0.72, w * 0.66); branch(ex, ey, a + 0.4 + R() * 0.2, len * 0.68, w * 0.62); };
    branch(240, 128, -Math.PI / 2 - 0.3, 40, 6); branch(240, 150, -Math.PI / 2 + 0.6, 36, 5);
    // the lantern line strung from the elm to the meetinghouse fence
    for (let i = 0; i <= 60; i++) { const t = i / 60; r(250 + t * 210, 96 + t * 60 + Math.sin(t * Math.PI) * 26, 1, 1, '#2a3038'); }
    // the iron fence and gate in front, left, with the plaque
    for (let x = 0; x < 150; x += 8) { r(x, 292, 2, 50, '#14181c'); r(x - 1, 288, 4, 4, '#14181c'); }
    r(0, 300, 150, 2, '#14181c'); r(0, 330, 150, 2, '#14181c');
    r(150, 280, 8, 62, '#4a4e54'); r(148, 276, 12, 6, '#5a5e64');
    r(110, 306, 34, 18, '#2a3a2a'); r(111, 307, 32, 16, '#3a4a38'); pixText(g, 'OLD', 114, 309, '#c8c8a8'); pixText(g, '1668', 114, 316, '#c8c8a8');
    // fallen leaves on the path
    for (let i = 0; i < 70; i++) r(150 + R() * 300, 284 + R() * 76, 2, 1, ['#8a5a2a', '#a86a2a', '#6a4a2a'][i % 3]);
    return c;
  },
  // lanterns along the line: x, y
  lanterns: [0.12, 0.32, 0.52, 0.72, 0.9].map(t => [Math.round(250 + t * 210), Math.round(96 + t * 60 + Math.sin(t * Math.PI) * 26)]),
  animate(g, now) {
    for (const [x, y] of this.lanterns) { rect(g, x, y, 1, 4, '#2a3038'); rect(g, x - 3, y + 4, 7, 9, '#2a3a48'); rect(g, x - 2, y + 5, 5, 7, `rgba(150,230,255,${0.6 + Math.sin(now / 230 + x) * 0.25})`); }
    rect(g, 397, 226 - 26, 7, 9, '#2a3a48'); rect(g, 398, 201, 5, 7, `rgba(150,230,255,${0.6 + Math.sin(now / 190) * 0.25})`);
  },
  light(g, now) {
    for (const [x, y] of this.lanterns) glow(g, x, y + 8, 2, 46, '140,220,255', 0.14 + Math.sin(now / 230 + x) * 0.04);
    glow(g, 400, 206, 2, 60, '140,220,255', 0.16);
    glow(g, 527, 172, 2, 50, '255,200,110', 0.12);
    glow(g, 150, 70, 10, 160, '210,220,235', 0.08);
    // the Fog: low banks rolling between the stones, and a pale wash over everything
    for (let i = 0; i < 9; i++) {
      const x = ((now / (40 + i * 5) + i * 110) % 880) - 120, y = 210 + (i * 37) % 150;
      glow(g, x, y, 8, 110 + (i % 3) * 20, '200,214,226', 0.2);
    }
  },
  wash: 'rgba(160,180,196,0.14)',
  vignette: 0.55
}, 1.5);

// ---- moved from js/quests/grey.js
addDayVariant('graveyardDay', 'graveyard', { sky: '180,190,200', amount: 0.4 });
