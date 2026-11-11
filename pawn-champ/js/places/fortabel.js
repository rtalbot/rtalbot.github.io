// Pawn Champ - Fort Abel, the old gun battery on the headland past Gull Point, at night. A scene
// location, batch B (docs/quests/BATCHES.md, LOCATIONS.md). LOCATIONS.md planned it as a Gull Point
// variant; it's drawn on its own so it can stand at the end of the headland, with the lighthouse
// dark in the distance. Concrete casemates, sixty years of graffiti, the brick-lined magazine and
// the drainage pipe Dutch gets stuck in.
//   fortabel  - The Twins' Map (step two)
'use strict';

addPlace('fortabel', {
  build() {
    const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(131);
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    // night sky over the open sea
    for (let y = 0; y < 170; y++) r(0, y, NW, 1, lerpColor('#05081a', '#1a2444', y / 170));
    for (let i = 0; i < 260; i++) r(R() * NW, R() * 150, 1, 1, R() < 0.2 ? '#ffffff' : '#6a78a8');
    g.fillStyle = '#f0ecd8'; g.beginPath(); g.arc(560, 44, 13, 0, 7); g.fill();
    g.fillStyle = 'rgba(240,236,216,0.08)'; g.beginPath(); g.arc(560, 44, 34, 0, 7); g.fill();
    // the sea, with the moon's path on it, and Gull Point's lighthouse off to the left, dark
    r(0, 150, NW, 30, '#0e1630'); for (let i = 0; i < 80; i++) r(R() * NW, 151 + R() * 28, 4 + R() * 10, 1, '#1e2a50');
    for (let y = 152; y < 180; y += 2) r(540 + Math.sin(y) * 6, y, 30 - (y - 150) * 0.4, 1, '#c8c4b0');
    g.fillStyle = '#0a0e1e'; g.beginPath(); g.moveTo(0, 158); g.lineTo(40, 140); g.lineTo(110, 146); g.lineTo(150, 158); g.fill();
    r(66, 112, 7, 30, '#1a1e2e'); r(64, 106, 11, 6, '#141826'); r(66, 102, 7, 4, '#20263a');
    // the headland: rough grass, rock showing through
    g.fillStyle = '#1a2218'; g.beginPath(); g.moveTo(0, 196); g.quadraticCurveTo(200, 170, 400, 176); g.quadraticCurveTo(540, 180, NW, 172); g.lineTo(NW, NH); g.lineTo(0, NH); g.fill();
    for (let y = 196; y < NH; y++) r(0, y, NW, 1, lerpColor('#1e2a1e', '#283224', (y - 196) / 164));
    for (let i = 0; i < 600; i++) { const x = R() * NW, y = 176 + R() * 184, h = 2 + R() * 6; r(x, y - h, 1, h, R() < 0.5 ? '#2e3a28' : '#3a4630'); }
    for (let i = 0; i < 14; i++) { const x = R() * NW, y = 220 + R() * 130; r(x, y, 14 + R() * 20, 6, '#3a3e44'); r(x + 2, y, 10, 2, '#4a4e56'); }
    // the battery: a long low concrete casemate, its gun gone, an embrasure facing the sea
    const bx = 150, by = 132;
    r(bx, by, 360, 100, '#5a5e60'); r(bx, by, 360, 4, '#6e7274'); r(bx, by + 96, 360, 4, '#3a3e40');
    for (let i = 0; i < 22; i++) r(bx + R() * 350, by + 6 + R() * 86, 4 + R() * 20, 1, '#4a4e50'); // form lines and cracks
    for (let i = 0; i < 6; i++) r(bx + i * 60, by + 4, 1, 92, '#4e5254');
    g.fillStyle = '#3a4a2e'; g.beginPath(); g.moveTo(bx - 20, by + 4); g.quadraticCurveTo(bx + 180, by - 30, bx + 380, by + 4); g.lineTo(bx + 360, by + 6); g.lineTo(bx, by + 6); g.fill(); // turf roof
    for (let i = 0; i < 120; i++) { const x = bx - 10 + R() * 380, h = 2 + R() * 6; r(x, by - 4 - R() * 14 - h + 10, 1, h, '#4a5a38'); }
    // the gun embrasure: a wide dark slot with the old mounting ring
    r(bx + 24, by + 22, 110, 34, '#14161a'); r(bx + 22, by + 20, 114, 3, '#7a7e80'); r(bx + 30, by + 46, 98, 6, '#24282c');
    for (let k = 0; k < 9; k++) r(bx + 38 + k * 10, by + 48, 4, 3, '#5a4a3a');
    // the magazine door: a black arch, the brick lining just visible inside, a rusted gate swung open
    const mx = bx + 200, my = by + 26;
    r(mx, my + 12, 56, 62, '#0a0c10'); g.fillStyle = '#0a0c10'; g.beginPath(); g.arc(mx + 28, my + 12, 28, Math.PI, 0); g.fill();
    for (let y = my + 4; y < my + 74; y += 6) for (let x = mx + 8 + ((y / 6) % 2) * 6; x < mx + 48; x += 12) r(x, y, 10, 4, 'rgba(120,60,40,0.35)');
    r(mx - 4, my - 18, 64, 4, '#7a7e80'); pixText(g, 'MAGAZINE 2', mx + 2, my - 26, '#8a8e90');
    for (let k = 0; k < 6; k++) r(mx + 58 + k * 5, my + 14 - k, 2, 60, '#5a3020'); r(mx + 58, my + 20, 28, 2, '#5a3020'); r(mx + 58, my + 60, 28, 2, '#5a3020');
    // graffiti, sixty years deep
    const tags = [['CLASS OF 88', bx + 150, by + 64, '#c84a6a'], ['ABEL', bx + 12, by + 64, '#e8d040'], ['T+M', bx + 280, by + 30, '#5ac8e8'], ['NO SWIM', bx + 300, by + 70, '#e8e4dc'], ['WOLVES', bx + 90, by + 82, '#8a8ac8']];
    for (const [t, x, y, col] of tags) pixText(g, t, x, y, col, t === 'ABEL' ? 2 : 1);
    g.strokeStyle = 'rgba(200,90,120,0.6)'; g.lineWidth = 2; g.beginPath(); g.arc(bx + 340, by + 48, 9, 0, 7); g.stroke(); g.beginPath(); g.moveTo(bx + 334, by + 54); g.lineTo(bx + 346, by + 42); g.stroke();
    // a rusted ladder up to the observation slit, and the concrete steps
    r(bx + 352, by - 30, 3, 130, '#5a3020'); r(bx + 366, by - 30, 3, 130, '#5a3020'); for (let k = 0; k < 10; k++) r(bx + 352, by - 26 + k * 12, 17, 2, '#5a3020');
    for (let k = 0; k < 5; k++) r(bx - 40 + k * 6, by + 70 + k * 6, 46 - k * 6, 6, k % 2 ? '#4a4e50' : '#5a5e60');
    // the drainage pipe at the foot of the wall: a big round mouth
    g.fillStyle = '#3a3e40'; g.beginPath(); g.ellipse(bx + 130, by + 106, 24, 18, 0, 0, 7); g.fill();
    g.fillStyle = '#08090c'; g.beginPath(); g.ellipse(bx + 130, by + 106, 18, 13, 0, 0, 7); g.fill();
    r(bx + 108, by + 116, 44, 6, '#2a2e30');
    // a sign, older than anyone who reads it
    r(70, 214, 3, 40, '#4a3a2a'); r(44, 200, 56, 18, '#c8c4a8'); pixText(g, 'FORT ABEL', 48, 203, '#3a3a2a'); pixText(g, '1898-1946', 50, 210, '#5a5a4a');
    // the path you came up, worn into the turf
    for (let y = 240; y < NH; y++) { const w = 40 + (y - 240) * 1.1; r(360 - w / 2 - (y - 240) * 0.3, y, w, 1, (y % 5) ? '#3a3a30' : '#34342a'); }
    return c;
  },
  animate(g, now) {
    // two flashlight discs wandering the casemate wall
    for (let k = 0; k < 2; k++) { const x = 300 + Math.sin(now / (900 + k * 300) + k * 2) * 120, y = 180 + Math.cos(now / (1100 + k * 200)) * 30; glow(g, x, y, 2, 26, '255,250,220', 0.2); }
    // the moon on the water
    for (let i = 0; i < 6; i++) rect(g, 540 + ((i * 7 + now / 120) % 30), 156 + i * 4, 3, 1, 'rgba(240,236,216,0.7)');
    // wind in the turf on the roof
    for (let i = 0; i < 14; i++) { const x = 150 + i * 26, s = Math.sin(now / 400 + i) * 2; rect(g, x + s, 120 + (i % 3) * 3, 1, 6, '#5a6a44'); }
  },
  light(g, now) {
    glow(g, 560, 44, 10, 220, '200,200,230', 0.08);
    for (let k = 0; k < 2; k++) { const x = 300 + Math.sin(now / (900 + k * 300) + k * 2) * 120, y = 180 + Math.cos(now / (1100 + k * 200)) * 30; glow(g, x, y, 4, 44, '255,250,220', 0.14); }
  },
  vignette: 0.55
}, 1.5);
