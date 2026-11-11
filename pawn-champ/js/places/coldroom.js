// Pawn Champ - the fish-market cold room. Batch C (docs/quests/BATCHES.md, LOCATIONS.md).
// Inside Kittredge Fish, the shed at the end of Pier Nine: chest freezers, ice bins, a hanging
// scale, rubber aprons, one fluorescent tube that never quite settles. Used by M8.
//
// drawSeaThing() draws the thing from Dory's freezer wherever a scene puts it. A scene sets
// SEA_THING.where (a place id) and x/y in native pixels, and clears it when the scene ends.
'use strict';

// others: [[dx, dy], ...] draws more of them nearby, quieter (the March thaw, js/quests/freezerarc.js).
const SEA_THING = { where: null, x: 0, y: 0, hum: true, wet: false, others: null };
function drawSeaThing(g, place, now) {
  const t = SEA_THING;
  if (t.where !== place) return;
  for (const [dx, dy] of t.others || []) drawOneSeaThing(g, { ...t, x: t.x + dx, y: t.y + dy, hum: false }, now + dx * 37);
  drawOneSeaThing(g, t, now);
}
function drawOneSeaThing(g, t, now) {
  const bob = Math.sin(now / 500) * 1.5, x = t.x, y = t.y + bob;
  const body = '#d8e6de', dark = '#a8bcb4', fin = '#9ac8c0';
  // tail fin, then the body, then the dorsal fin
  g.fillStyle = fin; g.beginPath(); g.moveTo(x - 14, y); g.lineTo(x - 24, y - 7 + Math.sin(now / 200) * 2); g.lineTo(x - 22, y + 7 - Math.sin(now / 200) * 2); g.fill();
  g.fillStyle = body; g.beginPath(); g.ellipse(x, y, 16, 10, 0, 0, 7); g.fill();
  g.fillStyle = dark; g.beginPath(); g.ellipse(x + 1, y + 4, 13, 5, 0, 0, Math.PI); g.fill();
  g.fillStyle = fin; g.beginPath(); g.moveTo(x - 6, y - 8); g.lineTo(x + 2, y - 17); g.lineTo(x + 6, y - 8); g.fill();
  // two small hands, waving out of time with each other
  for (const [hx, ph] of [[x + 4, 0], [x + 12, 1.3]]) {
    const hy = y + 6 + Math.sin(now / 300 + ph) * 2;
    rect(g, hx, hy, 2, 5, dark); rect(g, hx - 1, hy + 5, 4, 2, body); rect(g, hx - 1, hy + 7, 1, 1, body); rect(g, hx + 2, hy + 7, 1, 1, body);
  }
  // round dark eyes and a gill
  rect(g, x + 8, y - 4, 3, 3, '#1a2428'); rect(g, x + 9, y - 4, 1, 1, '#e8f4f0');
  rect(g, x + 3, y - 2, 1, 5, dark);
  if (t.wet) for (let i = 0; i < 3; i++) rect(g, x - 10 + i * 9, y + 10 + ((now / 8 + i * 20) % 14), 1, 2, 'rgba(180,220,250,0.7)');
  // humming: little notes drift up and fade
  if (t.hum) for (let i = 0; i < 3; i++) {
    const p = ((now / 1400) + i / 3) % 1, nx = x + 6 + Math.sin(p * 6 + i) * 6, ny = y - 18 - p * 26;
    g.globalAlpha = 1 - p; rect(g, nx, ny, 3, 2, '#e8f4f0'); rect(g, nx + 2, ny - 5, 1, 5, '#e8f4f0'); g.globalAlpha = 1;
  }
}

addPlace('coldroom', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(91);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // corrugated steel walls, frosted where the cold leaks
    for (let x = 0; x < NW; x++) r(x, 0, 1, 262, (x % 10) < 5 ? '#4a5a62' : '#405058');
    for (let i = 0; i < 260; i++) r(R() * NW, R() * 70, 2 + R() * 6, 1, 'rgba(220,240,250,0.25)');
    r(0, 0, NW, 18, '#2a343a'); for (let x = 0; x < NW; x += 80) r(x, 0, 6, 262, '#2e383e'); // roof beams and posts
    // the fluorescent tube and its fitting (the light itself flickers in animate)
    r(240, 22, 160, 6, '#c8ccd0'); r(244, 28, 152, 3, '#e8f0f4');
    // a whiteboard of today's prices, in Dory's capitals
    r(40, 60, 120, 76, '#e8ecee'); r(40, 60, 120, 2, '#c8ccd0'); r(38, 58, 124, 2, '#8a9298');
    pixText(g, 'KITTREDGE FISH', 46, 66, '#2a5aa0', 1);
    pixText(g, 'SCALLOPS 16', 46, 80, '#1a1e22', 1); pixText(g, 'HADDOCK 9', 46, 90, '#1a1e22', 1); pixText(g, 'COD 11', 46, 100, '#1a1e22', 1);
    pixText(g, 'NO NAP IN', 46, 114, '#c83a2a', 1); pixText(g, 'THE FREEZER CAL', 46, 122, '#c83a2a', 1);
    // a hanging scale and rubber aprons on hooks
    r(200, 40, 2, 40, '#6a6e72'); g.fillStyle = '#d8dcd8'; g.beginPath(); g.arc(201, 92, 12, 0, 7); g.fill(); g.fillStyle = '#f0f0e8'; g.beginPath(); g.arc(201, 92, 9, 0, 7); g.fill();
    r(200, 84, 1, 8, '#c83a2a'); r(190, 104, 22, 4, '#8a9298'); r(186, 108, 30, 6, '#b8bcc0');
    for (let i = 0; i < 3; i++) { const x = 440 + i * 26; r(x + 8, 50, 4, 4, '#6a6e72'); r(x, 54, 20, 70, ['#e0a020', '#2a6a5a', '#c84a3a'][i]); r(x, 54, 20, 3, shade(['#e0a020', '#2a6a5a', '#c84a3a'][i], 0.2)); r(x + 4, 60, 12, 1, 'rgba(0,0,0,0.25)'); }
    // a clock and a calendar from a marine supply firm
    clockFace(g, 560, 50, 11, '#e8e4dc', '#f8f8f0', [11, 40]);
    r(530, 76, 60, 60, '#f0ece0'); r(530, 76, 60, 26, '#3a6a8a'); r(540, 82, 40, 14, '#e8e4dc'); for (let y = 0; y < 4; y++) for (let x = 0; x < 7; x++) r(533 + x * 8, 106 + y * 7, 6, 5, '#d8d4c8');
    // shelving with fish crates and bags of ice
    r(0, 150, 180, 4, '#6a6e72'); r(0, 196, 180, 4, '#6a6e72'); for (const x of [4, 90, 176]) r(x, 140, 3, 122, '#5a5e62');
    for (let i = 0; i < 5; i++) { const x = 8 + i * 34; r(x, 130, 30, 20, i % 2 ? '#3a6a9a' : '#d8d8d0'); r(x, 130, 30, 3, i % 2 ? '#4a7aaa' : '#e8e8e0'); for (let k = 0; k < 3; k++) r(x + 4 + k * 8, 134, 5, 2, '#9aa0a8'); }
    for (let i = 0; i < 6; i++) { const x = 6 + i * 28; r(x, 176, 26, 20, '#eef4f8'); r(x + 4, 178, 18, 6, '#3a7ab0'); pixText(g, 'ICE', x + 8, 186, '#3a7ab0', 1); }
    // the concrete floor: wet, with a drain and a coiled hose
    for (let y = 262; y < NH; y++) r(0, y, NW, 1, lerpColor('#5a6266', '#3a4246', (y - 262) / 98));
    for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(180,210,230,0.12)'; g.beginPath(); g.ellipse(R() * NW, 280 + R() * 70, 8 + R() * 24, 2 + R() * 3, 0, 0, 7); g.fill(); }
    r(310, 330, 20, 8, '#2a3034'); for (let i = 0; i < 4; i++) r(312 + i * 5, 332, 2, 4, '#1a1e22');
    g.strokeStyle = '#2a7a4a'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(600, 310, 20 - i * 4, 8 - i * 1.5, 0, 0, 7); g.stroke(); }
    r(0, 262, NW, 2, '#2a3236');
    // the chest freezers: three in a row, the middle one with its lid up
    for (let i = 0; i < 3; i++) {
      const x = 200 + i * 104, open = i === 1;
      r(x, 216, 92, 50, '#e8ecee'); r(x, 216, 92, 3, '#f8fbfc'); r(x, 262, 92, 4, '#8a9298'); r(x + 4, 226, 84, 1, '#c8ccd0');
      r(x + 70, 248, 14, 8, '#3a3e42'); r(x + 72, 250, 4, 3, i === 2 ? '#c83a2a' : '#3ac85a');
      if (open) {
        r(x + 4, 204, 84, 14, '#0e2a3a'); r(x + 8, 206, 76, 10, '#1a4a5e');
        for (let k = 0; k < 9; k++) r(x + 10 + k * 8, 207, 5, 3, 'rgba(220,240,250,0.35)');
        // the lid, leaning back against the wall
        r(x + 2, 158, 88, 46, '#c8ced2'); r(x + 2, 158, 88, 2, '#e8eef0'); r(x + 8, 164, 76, 34, '#b8c0c4'); r(x + 38, 200, 16, 3, '#8a9298');
      } else { r(x, 212, 92, 6, '#dfe4e6'); r(x + 38, 214, 16, 2, '#9aa0a8'); }
      pixText(g, i === 2 ? 'BAIT' : 'SCALLOPS', x + 8, 236, '#5a6a72', 1);
    }
    // a stack of fish boxes and a hand truck
    for (let k = 0; k < 4; k++) r(530, 226 - k * 18, 54, 16, k % 2 ? '#3a6a9a' : '#2a5a8a');
    r(596, 200, 3, 62, '#c84a3a'); r(616, 200, 3, 62, '#c84a3a'); r(592, 258, 30, 4, '#3a3a40'); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(598, 264, 5, 0, 7); g.arc(618, 264, 5, 0, 7); g.fill();
    return c;
  },
  animate(g, now) {
    // the fluorescent tube: steady, then a stutter now and then
    const stutter = (now % 5200) < 160 && Math.floor(now / 40) % 2;
    rect(g, 244, 28, 152, 3, stutter ? '#7a8288' : '#f4fcff');
    // cold mist off the open freezer
    for (let i = 0; i < 8; i++) { const p = ((now / 2600) + i / 8) % 1; g.fillStyle = `rgba(220,240,250,${0.18 * (1 - p)})`; g.beginPath(); g.ellipse(316 + Math.sin(p * 4 + i) * 20, 210 - p * 40, 10 + p * 14, 3 + p * 3, 0, 0, 7); g.fill(); }
    // a slow drip from a ceiling pipe
    const d = (now % 1800) / 1800; rect(g, 470, 18 + d * 240, 1, 3, 'rgba(180,220,250,0.6)');
    drawSeaThing(g, 'coldroom', now);
  },
  light(g, now) {
    const stutter = (now % 5200) < 160 && Math.floor(now / 40) % 2;
    glow(g, 320, 34, 10, 260, '200,230,255', stutter ? 0.04 : 0.14);
    glow(g, 350, 208, 4, 80, '120,200,230', 0.18);
  },
  vignette: 0.5
}, 1.5);

// ---- moved from js/quests/figurehead.js
// ---------------------------------------------------------------- the fish market floor
// Kittredge Fish's cold room with a long table of crushed ice across the front, the haddock moved
// to one end, and on the rest of it the figurehead, lying on her back with one hand raised.
// Gulls have got in under the eaves.
function drawFigurehead(g, x, y) {
  const r = (a, b, w, h, col) => rect(g, a, b, w, h, col);
  // her body along the ice: skirts in faded red, a white bodice, a carved face looking up
  g.fillStyle = '#9a3a2a'; g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x + 120, y - 6); g.lineTo(x + 150, y + 14); g.lineTo(x + 10, y + 22); g.closePath(); g.fill();
  for (let i = 0; i < 5; i++) r(x + 14 + i * 24, y + 2 - i * 2, 2, 18, '#7a2a1e');
  r(x + 150, y - 4, 40, 18, '#e8e0cc'); r(x + 150, y - 4, 40, 3, '#f4eee0');
  g.fillStyle = '#d8b890'; g.beginPath(); g.ellipse(x + 202, y + 4, 12, 10, 0, 0, 7); g.fill();
  r(x + 196, y - 6, 22, 6, '#4a2e1a'); r(x + 212, y + 4, 2, 2, '#4a2e1a');
  // the raised arm, straight up off the ice, the hand holding a carved scallop shell
  r(x + 172, y - 70, 8, 70, '#d8b890'); r(x + 170, y - 70, 12, 4, '#c8a880');
  g.fillStyle = '#e8d8b0'; g.beginPath(); g.arc(x + 176, y - 78, 9, Math.PI, 0); g.fill();
  for (let i = 0; i < 4; i++) r(x + 169 + i * 4, y - 86, 1, 8, '#b8a070');
  // the scroll-carved base, where the bow was
  r(x - 22, y - 2, 26, 26, '#6a4428'); g.strokeStyle = '#c8a050'; g.lineWidth = 2; g.beginPath(); g.arc(x - 10, y + 10, 7, 0, 5); g.stroke();
}
addNightVariant('fishMarket', 'coldroom', { amount: 0.06, tint: '220,235,255', paint: g => {
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // the ice table across the front
  r(60, 262, 520, 12, '#e8f0f4'); r(60, 274, 520, 30, '#8a9aa8'); for (let i = 0; i < 9; i++) r(70 + i * 60, 274, 4, 60, '#5a6a78');
  for (let i = 0; i < 160; i++) r(60 + (i * 37) % 520, 252 + (i * 13) % 14, 4, 3, i % 3 ? '#f4f8fa' : '#c8dce8');
  // haddock pushed to one end
  for (let i = 0; i < 6; i++) { const x = 470 + (i % 3) * 32, y = 248 + (i / 3 | 0) * 8; g.fillStyle = '#8a8a90'; g.beginPath(); g.ellipse(x, y, 14, 4, 0, 0, 7); g.fill(); r(x + 12, y - 3, 5, 6, '#7a7a80'); }
  drawFigurehead(g, 150, 240);
  // a chalk sign: WHOSE IS SHE
  r(470, 200, 90, 30, '#1e2a24'); pixText(g, 'WHOSE', 492, 206, '#e8e4dc', 1); pixText(g, 'IS SHE', 488, 216, '#e8e4dc', 1);
}, animate(g, now) {
  // two gulls in the rafters, one of them walking
  for (const [x0, y0, k] of [[150, 30, 0], [420, 26, 1]]) {
    const x = x0 + (k ? Math.sin(now / 1400) * 24 : 0);
    rect(g, x, y0, 14, 7, '#e8e8ea'); rect(g, x + 10, y0 - 4, 7, 6, '#e8e8ea'); rect(g, x + 16, y0 - 2, 4, 2, '#e8b030');
    rect(g, x - 2, y0 + 1, 6, 3, '#8a8a92'); rect(g, x + 4, y0 + 7, 1, 4, '#e8b030'); rect(g, x + 9, y0 + 7, 1, 4, '#e8b030');
  }
} });
