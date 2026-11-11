// Pawn Champ - Town Hall, batch D (docs/quests/BATCHES.md, LOCATIONS.md).
//   townhall      - the meeting room on a weeknight: Town Meeting (hub), and the debate when the
//                   Grange Hall isn't drawn yet                     (The Selectmen's Race, m10, m23)
//   townhallRoof  - the roof at midday, the cupola and its empty weathervane post (The Weathervane)
'use strict';

// the town seal: a whale in a ring, as on the warrant and the trucks
function townSeal(g, cx, cy, rad, ring, field, whale) {
  g.fillStyle = ring; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
  g.fillStyle = field; g.beginPath(); g.arc(cx, cy, rad - 3, 0, 7); g.fill();
  const s = rad / 14;
  g.fillStyle = whale; g.beginPath(); g.ellipse(cx - 1 * s, cy + 1 * s, 8 * s, 3.5 * s, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(cx + 6 * s, cy + 1 * s); g.lineTo(cx + 11 * s, cy - 3 * s); g.lineTo(cx + 10 * s, cy + 1 * s); g.lineTo(cx + 11 * s, cy + 5 * s); g.fill();
  rect(g, cx - 2 * s, cy + 3 * s, 2 * s, 2 * s, whale);
}
// the copper whale itself, for the roof (and anyone who wants to draw it)
function copperWhale(g, x, y, s, col) {
  const c = col || '#3a9a7a', d = shade(c, -0.25), l = shade(c, 0.2);
  g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 16 * s, 5 * s, 0, 0, 7); g.fill();
  g.fillStyle = l; g.beginPath(); g.ellipse(x - 3 * s, y - 2 * s, 11 * s, 2 * s, 0, 0, 7); g.fill();
  g.fillStyle = c; g.beginPath(); g.moveTo(x + 13 * s, y); g.lineTo(x + 22 * s, y - 7 * s); g.lineTo(x + 19 * s, y); g.lineTo(x + 22 * s, y + 6 * s); g.fill();
  rect(g, x - 10 * s, y - 1 * s, 2 * s, 2 * s, d); rect(g, x - 6 * s, y + 4 * s, 6 * s, 2 * s, d);
}

addPlace('townhall', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(91);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // plaster walls, a picture rail and a tall wainscot
    r(0, 0, NW, 262, '#d6ccb4');
    for (let i = 0; i < 260; i++) r(R() * NW, R() * 200, 2, 1, '#cfc4aa');
    r(0, 0, NW, 18, '#b8ac92'); r(0, 18, NW, 3, '#8a7a5a'); r(0, 60, NW, 2, '#a89a7c');
    r(0, 186, NW, 76, '#6a4a30'); r(0, 186, NW, 4, '#8a6644'); r(0, 258, NW, 4, '#3a2618');
    for (let x = 6; x < NW; x += 34) { r(x, 196, 28, 56, '#5e4028'); r(x, 196, 28, 1, '#7a5638'); r(x, 251, 28, 1, '#3a2618'); }
    // three tall windows, night outside, with the harbor lights
    for (const wx of [24, 110, 556]) {
      r(wx - 5, 64, 70, 118, '#f2ecdc'); r(wx - 3, 66, 66, 114, '#e2dac6');
      for (let y = 70; y < 176; y++) r(wx, y, 60, 1, lerpColor('#141c34', '#2a3450', (y - 70) / 106));
      g.fillStyle = '#141c34'; g.beginPath(); g.arc(wx + 30, 70, 30, Math.PI, 0); g.fill();
      for (let i = 0; i < 6; i++) r(wx + 4 + R() * 52, 150 + R() * 20, 2, 2, R() < 0.7 ? '#f0c060' : '#c8d8f0');
      r(wx + 29, 40, 2, 136, '#f2ecdc'); r(wx, 118, 60, 2, '#f2ecdc'); r(wx, 146, 60, 2, '#f2ecdc');
      r(wx - 7, 180, 74, 6, '#f2ecdc'); r(wx - 7, 184, 74, 2, '#b8ac92');
    }
    // the stage at the back: a platform with bunting, the head table and the moderator's lectern
    r(196, 150, 340, 40, '#7a5434'); r(196, 150, 340, 3, '#a07448'); r(196, 186, 340, 4, '#4a3020');
    for (let i = 0; i < 9; i++) r(206 + i * 37, 160, 30, 22, '#6a4a2e');
    // proscenium and a curtain swag
    r(190, 22, 8, 168, '#8a6a44'); r(534, 22, 8, 168, '#8a6a44'); r(190, 22, 352, 10, '#8a6a44');
    for (let i = 0; i < 16; i++) { const x = 198 + i * 21; g.fillStyle = i % 2 ? '#7a2a2a' : '#8a3030'; g.beginPath(); g.arc(x + 10, 32, 11, 0, Math.PI); g.fill(); }
    r(198, 32, 14, 118, '#7a2a2a'); r(520, 32, 14, 118, '#7a2a2a'); r(202, 32, 3, 118, '#9a3a3a'); r(524, 32, 3, 118, '#9a3a3a');
    // the town seal, the clock and the portraits of selectmen past (faceless, like everyone)
    townSeal(g, 366, 66, 22, '#c8a050', '#2a4a6a', '#e8e0c8');
    pixText(g, 'HOLLOW NECK', 366 - textWidth('HOLLOW NECK') / 2, 92, '#6a4a2a');
    for (const [x, col] of [[236, '#3a4a6a'], [280, '#5a3a2a'], [442, '#3a5a4a'], [486, '#4a3a5a']]) {
      r(x - 2, 44, 28, 36, '#c8a050'); r(x, 46, 24, 32, '#2a2420');
      g.fillStyle = '#d8b090'; g.beginPath(); g.arc(x + 12, 58, 5, 0, 7); g.fill(); r(x + 4, 64, 16, 14, col);
    }
    // the head table: a long skirted table, three chairs, name cards and a water jug
    r(250, 128, 156, 6, '#e8e4d8'); r(250, 134, 156, 16, '#2a3a5a'); r(250, 134, 156, 2, '#1e2a44');
    for (let i = 0; i < 3; i++) { r(268 + i * 52, 112, 18, 16, '#4a3020'); r(266 + i * 52, 110, 22, 3, '#5a3a24'); r(264 + i * 52, 124, 10, 4, '#f2ecdc'); }
    r(392, 118, 6, 10, 'rgba(200,220,240,0.7)'); r(393, 116, 4, 2, '#c8d8e8');
    // the lectern, with a gavel and a reading lamp
    r(434, 104, 36, 46, '#5a3a24'); r(430, 100, 44, 6, '#7a5234'); r(440, 112, 24, 16, '#4a2e1c');
    townSeal(g, 452, 124, 7, '#c8a050', '#2a4a6a', '#e8e0c8');
    r(440, 96, 10, 3, '#3a2416'); r(448, 94, 3, 6, '#7a5234'); r(456, 86, 2, 14, '#2a2a30'); r(452, 84, 10, 4, '#2a5a3a');
    // floor: varnished boards in perspective
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#8a6440', '#a07450', (y - 262) / 98));
    for (let i = -12; i < 24; i++) { g.strokeStyle = 'rgba(60,40,20,0.4)'; g.lineWidth = 1; g.beginPath(); g.moveTo(320 + i * 20, 262); g.lineTo(320 + i * 52, NH); g.stroke(); }
    for (let i = 0; i < 60; i++) r(R() * NW, 266 + R() * 92, 6 + R() * 16, 1, R() < 0.5 ? '#7a5636' : '#b08458');
    // the aisle runner up the middle, and the floor microphone on its stand
    for (let y = 262; y < NH; y++) { const w = 40 + (y - 262) * 0.9; r(326 - w / 2, y, w, 1, (y - 262) % 10 < 1 ? '#5a2a2a' : '#7a3434'); }
    r(318, 230, 2, 54, '#2a2a30'); r(310, 282, 18, 3, '#2a2a30'); r(314, 226, 8, 6, '#3a3a40'); r(316, 224, 4, 2, '#5a5a60');
    // folding chairs in rows on either side of the aisle, the back rows smaller
    const chair = (x, y, s, col) => {
      r(x, y, 10 * s, 2 * s, col); r(x + 1 * s, y - 9 * s, 8 * s, 6 * s, col); r(x + 2 * s, y - 8 * s, 6 * s, 1, shade(col, 0.2));
      r(x, y + 2 * s, 1 * s, 7 * s, shade(col, -0.3)); r(x + 9 * s, y + 2 * s, 1 * s, 7 * s, shade(col, -0.3)); r(x + 1 * s, y - 3 * s, 1 * s, 3 * s, shade(col, -0.3)); r(x + 8 * s, y - 3 * s, 1 * s, 3 * s, shade(col, -0.3));
    };
    for (let row = 0; row < 3; row++) {
      const y = 254 + row * 14, s = 1.2 + row * 0.25, n = 6 - row;
      for (let i = 0; i < n; i++) { chair(30 + i * (14 * s + 4), y, s, '#4a5a6a'); chair(380 + row * 20 + i * (14 * s + 4), y, s, '#4a5a6a'); }
    }
    // the coffee table at the left wall: an urn, cups, a plate of something homemade
    r(16, 220, 86, 5, '#e8e4d8'); r(18, 225, 3, 30, '#4a4a4a'); r(96, 225, 3, 30, '#4a4a4a');
    r(28, 192, 22, 28, '#b8bcc4'); r(26, 190, 26, 4, '#d0d4dc'); r(34, 186, 10, 4, '#2a2a30'); r(50, 206, 6, 2, '#2a2a30'); r(30, 194, 3, 22, '#d8dce4');
    for (let i = 0; i < 6; i++) r(60 + (i % 3) * 8, 212 - (i > 2 ? 6 : 0), 6, 6, '#f2ecdc');
    g.fillStyle = '#e8e4d8'; g.beginPath(); g.ellipse(86, 218, 10, 3, 0, 0, 7); g.fill();
    for (let i = 0; i < 5; i++) r(80 + i * 3, 214, 3, 2, '#a86a3a');
    pixText(g, 'COFFEE 1.00', 22, 230, '#3a2a1a');
    // the warrant: a big printed sheet pinned on a board by the right windows
    r(556, 192, 72, 64, '#5a3a24'); r(560, 196, 64, 56, '#f2ecdc');
    pixText(g, 'WARRANT', 566, 199, '#2a2a3a');
    for (let i = 0; i < 8; i++) { r(564, 208 + i * 5, 4, 2, '#2a2a3a'); r(570, 208 + i * 5, 46 - (i * 7) % 18, 2, '#8a8a90'); }
    return c;
  },
  // pendant lamps over the hall: x, y
  lamps: [[120, 40], [250, 36], [400, 36], [530, 40]],
  animate(g, now) {
    for (const [x, y] of this.lamps) { rect(g, x, 0, 1, y, '#3a3028'); rect(g, x - 9, y, 19, 6, '#2a4a3a'); rect(g, x - 6, y + 6, 13, 2, '#f8e0a0'); }
    // the hall clock over the stage, keeping proper time
    const d = new Date(), h = d.getHours(), m = d.getMinutes();
    clockFace(g, 366, 140 - 104, 9, '#5a3a24', '#f2ecdc', [h, m]);
  },
  light(g) {
    for (const [x, y] of this.lamps) glow(g, x, y + 10, 4, 120, '255,220,150', 0.14);
    glow(g, 457, 92, 2, 50, '255,220,150', 0.16);
  },
  vignette: 0.4
}, 1.5);

addPlace('townhallRoof', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(93);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // a bright noon sky over the harbor
    for (let y = 0; y < 200; y++) r(0, y, NW, 1, lerpColor('#5a9ad0', '#c8e0ec', y / 200));
    // the harbor: the far shore, the water, the breakwater and the ferry
    for (let x = 0; x < NW; x += 4) { const h = 6 + Math.abs(Math.sin(x * 0.02)) * 10 + R() * 3; r(x, 168 - h, 5, h, '#6a8a7a'); }
    r(0, 166, NW, 50, '#3a7a9a'); for (let i = 0; i < 90; i++) r(R() * NW, 168 + R() * 46, 6 + R() * 10, 1, '#5a9aba');
    r(420, 180, 160, 5, '#8a8a84'); r(420, 179, 160, 1, '#b0b0a8');
    r(560, 152, 6, 28, '#e8e4dc'); r(558, 148, 10, 5, '#c84a3a'); r(560, 144, 6, 4, '#2a2a30');
    r(120, 182, 46, 8, '#e8e4dc'); r(126, 176, 30, 6, '#e8e4dc'); r(132, 172, 6, 4, '#c84a3a'); r(120, 190, 46, 2, '#2a3a4a');
    // the town below: rooftops, a steeple and the chimneys of Front Street
    const roofs = ['#6a3a2a', '#4a4a52', '#7a5a3a', '#3a4a5a', '#5a3a3a'];
    for (let i = 0; i < 16; i++) { const x = -10 + i * 42 + (R() * 10 | 0), w = 40 + (R() * 20 | 0), y = 200 + (R() * 16 | 0), col = roofs[i % roofs.length];
      r(x, y, w, 40, '#e8e0d0'); for (let k = 0; k < 10; k++) r(x - 2 + k, y - k, w + 4 - k * 2, 1, col);
      r(x + 8, y + 10, 6, 8, '#3a4a5a'); r(x + w - 16, y + 10, 6, 8, '#3a4a5a'); if (R() < 0.5) r(x + w / 2, y - 16, 6, 10, '#7a4a3a'); }
    r(92, 140, 14, 70, '#e8e4dc'); for (let i = 0; i < 26; i++) r(99 - (7 - i * 0.27), 140 - i, (7 - i * 0.27) * 2, 1, '#e8e4dc');
    // the Town Hall roof: grey shingles sloping across the front, the ridge running left to right
    for (let y = 236; y < NH; y++) r(0, y, NW, 1, lerpColor('#5a5e66', '#3e424a', (y - 236) / 124));
    for (let y = 240; y < NH; y += 8) for (let x = ((y / 8) % 2) * 9; x < NW; x += 18) { r(x, y, 17, 7, (x + y) % 3 ? '#565a62' : '#4e525a'); r(x, y + 6, 17, 1, '#34383e'); }
    r(0, 234, NW, 5, '#7a7e86'); r(0, 234, NW, 1, '#9a9ea6');
    // the cupola: white louvred octagon, green copper dome, and the post where the whale should be
    const cx = 448;
    r(cx - 40, 150, 80, 90, '#eeeae0'); r(cx - 40, 150, 6, 90, '#d4d0c4'); r(cx + 34, 150, 6, 90, '#c8c4b8');
    for (let k = 0; k < 3; k++) { r(cx - 30 + k * 22, 162, 16, 58, '#3a3e44'); for (let y = 164; y < 218; y += 4) r(cx - 30 + k * 22, y, 16, 2, '#d8d4c8'); }
    r(cx - 46, 146, 92, 6, '#f6f2e8'); r(cx - 46, 236, 92, 4, '#c8c4b8');
    for (let i = 0; i < 40; i++) { const w = 46 - i * 1.05; r(cx - w, 146 - i, w * 2, 1, i % 6 < 1 ? '#2a7a5a' : '#3a9a7a'); }
    r(cx - 4, 100, 8, 8, '#2a7a5a');
    r(cx - 1, 40, 3, 62, '#2a2a30'); g.fillStyle = '#c8a050'; g.beginPath(); g.arc(cx + 0.5, 98, 4, 0, 7); g.fill();
    r(cx - 18, 78, 37, 2, '#2a2a30'); r(cx - 1, 66, 3, 26, '#2a2a30');
    pixText(g, 'N', cx + 4, 62, '#2a2a30'); pixText(g, 'W', cx - 26, 76, '#2a2a30'); pixText(g, 'E', cx + 22, 76, '#2a2a30');
    // the roofer's things: a ladder over the eave, a bucket, a coil of rope, a blue tarp
    for (let i = 0; i < 2; i++) r(70 + i * 28, 240, 4, 120, '#c8a050');
    for (let y = 250; y < NH; y += 16) r(70, y, 32, 3, '#c8a050');
    r(150, 290, 22, 20, '#e8702a'); r(148, 288, 26, 4, '#f08a3a'); r(156, 282, 10, 6, '#2a2a30');
    g.strokeStyle = '#c8b080'; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(214, 300, 16 - k * 3, 6 - k, 0, 0, 7); g.stroke(); }
    g.fillStyle = '#2a6ab0'; g.beginPath(); g.moveTo(540, 260); g.lineTo(630, 250); g.lineTo(640, 300); g.lineTo(560, 310); g.fill();
    r(548, 264, 3, 3, '#e8e8e8'); r(620, 254, 3, 3, '#e8e8e8');
    return c;
  },
  animate(g, now) {
    // clouds drifting, and gulls
    for (let i = 0; i < 4; i++) { const x = ((now / (90 + i * 30) + i * 190) % 800) - 100, y = 24 + i * 22;
      g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(x, y, 34, 8, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 18, y - 5, 18, 7, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 3; i++) { const x = ((now / (30 + i * 9) + i * 240) % 760) - 60, y = 60 + i * 26 + Math.sin(now / 400 + i) * 6, f = Math.sin(now / 120 + i) > 0 ? 2 : 0;
      rect(g, x, y, 4, 1, '#f4f4f4'); rect(g, x - 4, y - f, 4, 1, '#f4f4f4'); rect(g, x + 4, y - f, 4, 1, '#f4f4f4'); }
    // the whale, if it's back where it belongs (m10)
    if (typeof S !== 'undefined' && S && S.flags && S.flags.vaneUp) copperWhale(g, 449, 50 + Math.sin(now / 900) * 0.5, 1.4);
  },
  light(g) { glow(g, 560, 40, 10, 200, '255,250,220', 0.1); },
  vignette: 0.2
}, 1.5);

// ---- moved from js/quests/ballot.js
// ---------------------------------------------------------------- the Town Hall vault
// Under the meeting room: a round steel door standing open, steel shelving of annual reports back
// to 1854, old ballot boxes on the top shelf, one bulb on a chain.
addPlace('townhallVault', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(1956);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // painted brick, institutional green
    for (let y = 0; y < 250; y++) r(0, y, NW, 1, lerpColor('#5a6a5a', '#46544a', y / 250));
    for (let y = 6; y < 250; y += 10) { r(0, y, NW, 1, '#4a584c'); for (let x = (y / 10 % 2) * 14; x < NW; x += 28) r(x, y - 9, 1, 9, '#4a584c'); }
    // the vault door, open, on the left: a round steel slab with bolts and a wheel
    g.fillStyle = '#2a2a2e'; g.beginPath(); g.arc(90, 160, 86, 0, 7); g.fill();
    g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(90, 160, 74, 0, 7); g.fill();
    g.fillStyle = '#8a8e96'; g.beginPath(); g.ellipse(26, 160, 22, 80, 0, 0, 7); g.fill();
    g.fillStyle = '#a8acb4'; g.beginPath(); g.ellipse(22, 160, 14, 72, 0, 0, 7); g.fill();
    for (let i = 0; i < 6; i++) r(30, 104 + i * 22, 14, 6, '#6a6e76');
    g.strokeStyle = '#5a5e66'; g.lineWidth = 3; g.beginPath(); g.ellipse(18, 160, 6, 22, 0, 0, 7); g.stroke();
    // steel shelving, three bays of annual reports with year labels
    for (let bay = 0; bay < 3; bay++) {
      const x0 = 190 + bay * 140;
      r(x0, 40, 4, 210, '#7a7e86'); r(x0 + 126, 40, 4, 210, '#7a7e86');
      for (let s = 0; s < 5; s++) {
        const y = 80 + s * 40;
        r(x0, y, 130, 4, '#8a8e96');
        if (s === 0) continue;
        for (let b = 0; b < 15; b++) {
          const col = ['#2a3a5a', '#5a2a2a', '#3a4a2a', '#4a3a2a', '#2a2a3a'][(b + s + bay) % 5], h = 26 + (b * 7 + s) % 8;
          r(x0 + 6 + b * 8, y - h, 7, h, col); r(x0 + 7 + b * 8, y - h + 4, 5, 2, '#c8b880');
        }
      }
      r(x0 + 30, 20, 70, 12, '#e8e0c8'); pixText(g, ['1854-1899', '1900-1955', '1956-NOW'][bay], x0 + 36, 23, '#2a2a2a', 1);
    }
    // the ballot boxes on the top shelf, and one gap where the walnut box used to be
    for (let i = 0; i < 6; i++) {
      const x = 196 + i * 66; if (i === 3) { r(x + 4, 74, 40, 1, '#5a5e66'); continue; }
      r(x, 50, 46, 30, i % 2 ? '#6a4428' : '#5a3a22'); r(x, 50, 46, 3, '#8a6438'); r(x + 18, 48, 10, 3, '#1a1a1e');
      r(x + 44, 60, 6, 3, '#b9bec8'); r(x + 48, 60, 3, 10, '#b9bec8');
    }
    // the bulb's chain
    r(330, 0, 2, 30, '#3a3a3a');
    // a reading table and a stool, the floor in grey linoleum squares
    for (let y = 250; y < NH; y++) r(0, y, NW, 1, lerpColor('#6a6a66', '#4a4a48', (y - 250) / 110));
    for (let x = 0; x < NW; x += 32) for (let y = 250; y < NH; y += 22) if (((x / 32) + (y / 22 | 0)) % 2) r(x, y, 32, 22, 'rgba(0,0,0,0.08)');
    r(360, 250, 160, 10, '#7a5a3a'); r(366, 260, 8, 46, '#5a3a22'); r(506, 260, 8, 46, '#5a3a22');
    for (let i = 0; i < 4; i++) { r(380 + i * 30, 242, 22, 8, '#e8e0c8'); r(382 + i * 30, 244, 18, 1, '#8a8a8a'); }
    for (let i = 0; i < 30; i++) r(R() * NW, 252 + R() * 100, 2, 1, '#7a7a76');
    return c;
  },
  animate() {},
  light(g, now) { glow(g, 331, 36, 6, 170, '255,230,170', 0.2 + Math.sin(now / 900) * 0.01); },
  vignette: 0.55
}, 1.5);
