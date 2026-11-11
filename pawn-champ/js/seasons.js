// Pawn Champ - the season on screen (docs/SEASONS.md#what-changes-with-the-season).
// October looks exactly as it always has. From November on (staying on, js/stay.js) the month sets a
// season, and three things follow it:
//   - the street through the shop window: bare tree, snow on the roofs and sills, lights and a wreath,
//     plowed banks, puddles in March (seasonStreet, called from drawOutside in js/art.js);
//   - every outdoor place: a cold wash, snow on the tops of things and on the ground, falling snow or
//     rain (seasonBg and seasonWeather, called from drawScene in js/art.js). A place joins by being in
//     OUTDOOR_PLACES or by passing `outdoor: true` to addPlace; `season: false` opts out (a place that
//     is already drawn in winter, like the ice pond). A place can draw its own season with
//     `season(g, s)` in addPlace: it's called on the built backdrop instead of the automatic pass;
//   - the cast: coats over tees, scarves, hats, snow on the shoulders, hoods in the March rain
//     (seasonLook, called from drawCharacter). The keeper and the uncanny keep their looks.
'use strict';

// month 1 is October, 2 November ... 6 March (MONTHS in js/data.js)
const SEASON_BY_MONTH = { 1: 'autumn', 2: 'late', 3: 'winter', 4: 'deep', 5: 'deep', 6: 'thaw' };
function seasonNow() { return SEASON_BY_MONTH[typeof monthNum === 'function' ? monthNum() : 1] || 'autumn'; }
const seasonCold = s => s === 'winter' || s === 'deep';

// Built outdoor places. Places already drawn in winter (icepond, shanties, motorinn, the arcade's
// winter quarters) aren't listed, and nor are interiors.
const OUTDOOR_PLACES = new Set(['docks', 'docksDay', 'docksFleet', 'lighthouse', 'gullpointDay', 'marsh', 'marshDay', 'marshHives',
  'graveyard', 'graveyardDay', 'gannet', 'gannetDock', 'wolfwood', 'sandbar', 'sandbarNight', 'sandbarBoat', 'lowtide',
  'clamshack', 'clamshackDusk', 'townhallRoof', 'green', 'greenNight', 'greenDay', 'greenMoon', 'weighoff', 'ferry', 'ferryNight',
  'ferryLanding', 'ferryLandingNight', 'ferryLandingNoon', 'observatorySky', 'bonnieDeck',
  'widowsWalk', 'cedarStump', 'bogDawn', 'fortabel', 'arcadeFront', 'arcadeFrontDay']);
function seasonOutdoor(bg) {
  const p = typeof PLACES !== 'undefined' && PLACES[bg];
  if (p && p.season === false) return false;
  return OUTDOOR_PLACES.has(bg) || !!(p && p.outdoor);
}

// ---------------------------------------------------------------- outdoor places
// The backdrop for this place in this season: the plain one in October, else a copy with the
// season painted on, cached per season.
function seasonBg(bg, build) {
  const s = seasonNow();
  if (s === 'autumn' || !seasonOutdoor(bg)) return cachedBg(bg, build);
  return cachedBg(`${bg}@${s}`, () => {
    const base = build(), c = mkCanvas(base.width, base.height), g = c.getContext('2d');
    g.drawImage(base, 0, 0);
    const p = typeof PLACES !== 'undefined' && PLACES[bg];
    if (p && typeof p.season === 'function') p.season(g, s);
    else paintSeason(g, c.width, c.height, s);
    return c;
  });
}

// The automatic pass. It reads the picture, not a map of it, so it works on every place:
//   late    grass and leaves go brown, the light goes grey
//   winter  a cold wash; snow sits on every flat top (roofs, sills, rails, rocks) and creeps over
//           the ground in the bottom of the picture
//   deep    as winter, deeper
//   thaw    wet and grey-green: darker ground, a sheen on the low half
function paintSeason(g, w, h, s) {
  const img = g.getImageData(0, 0, w, h), d = img.data;
  let lum = 0;
  for (let i = 0; i < d.length; i += 4 * 61) lum += (d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11);
  lum /= (d.length / (4 * 61)) * 255; // 0 dark .. 1 bright
  const out = new Uint8ClampedArray(d);
  const at = (x, y) => (y * w + x) * 4;
  const green = i => d[i + 1] > d[i + 2] + 6 && d[i + 1] >= d[i] - 10; // grass, leaves, weed
  const earth = i => d[i] >= d[i + 2] + 4 && d[i + 1] >= d[i + 2]; // brown, ochre, sand, grass
  const set = (i, r, gg, b, k) => { out[i] = out[i] + (r - out[i]) * k; out[i + 1] = out[i + 1] + (gg - out[i + 1]) * k; out[i + 2] = out[i + 2] + (b - out[i + 2]) * k; };
  // snow takes the scene's light: bright on a winter noon, blue-grey at night
  const k = Math.max(0.42, Math.min(1, lum * 1.5 + 0.3));
  const snow = [Math.round(236 * k), Math.round(242 * k), Math.round(250 * k)];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = at(x, y), low = y / h;
    if (s === 'late') {
      if (green(i)) set(i, d[i] * 0.9 + 40, d[i + 1] * 0.75 + 10, d[i + 2] * 0.7, 0.55); // brown, not green
      set(i, 150, 150, 158, 0.08);
    } else if (seasonCold(s)) {
      if (green(i)) set(i, d[i + 1] * 0.55, d[i + 1] * 0.6, d[i + 1] * 0.62, 0.6); // the green gone out of it
      set(i, 150, 168, 196, s === 'deep' ? 0.16 : 0.12); // cold air
      const ground = s === 'deep' ? 0.62 : 0.7;
      if (low > ground && earth(i)) set(i, snow[0], snow[1], snow[2], Math.min(0.8, (low - ground) * (s === 'deep' ? 3.4 : 2.6)));
    } else if (s === 'thaw') {
      set(i, 120, 135, 125, 0.1);
      if (low > 0.62 && earth(i)) set(i, d[i] * 0.7, d[i + 1] * 0.72, d[i + 2] * 0.75, 0.5); // wet
    }
  }
  if (seasonCold(s)) {
    // snow on top of things: wherever a solid run of pixels has something quite different above it
    const depth = s === 'deep' ? 3 : 2;
    const diff = (a, b) => Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
    const edge = (x, y) => y > 0 && diff(at(x, y), at(x, y - 1)) > 70 && diff(at(x, y), at(x, y + 1 < h ? y + 1 : y)) < 40;
    // (only above the ground: lower down, plank seams and ripples would all get a stripe)
    for (let y = Math.floor(h * 0.12); y < Math.floor(h * 0.7); y++) for (let x = 1; x < w - 1; x++) {
      if (!edge(x, y) || !edge(x - 1, y) || !edge(x + 1, y)) continue;
      const i = at(x, y);
      if (d[i + 2] > d[i] + 30 && d[i + 2] > d[i + 1] + 10) continue; // not on open water
      for (let j = 0; j < depth; j++) { const o = at(x, y + j); set(o, snow[0], snow[1], snow[2], j === depth - 1 ? 0.55 : 0.92); }
    }
  }
  img.data.set(out);
  g.putImageData(img, 0, 0);
}

// Falling snow, or rain in March, over an outdoor place (native px).
function seasonWeather(g, bg, now) {
  const s = seasonNow();
  if (!seasonOutdoor(bg)) return;
  if (seasonCold(s)) {
    const n = s === 'deep' ? 90 : 55;
    for (let i = 0; i < n; i++) {
      const sp = 18 + (i * 7) % 23, x = (i * 97 + Math.sin(now / 1400 + i) * 14 + now / 90) % NW, y = (i * 53 + now / sp) % NH;
      rect(g, x, y, i % 5 ? 1 : 2, i % 5 ? 1 : 2, 'rgba(240,244,252,0.8)');
    }
  } else if (s === 'thaw') {
    for (let i = 0; i < 70; i++) {
      const x = (i * 89 + now / 30) % NW, y = (i * 61 + now / 3) % NH;
      rect(g, x, y, 1, 6, 'rgba(190,205,225,0.35)');
    }
  }
}

// ---------------------------------------------------------------- the street through the window
// Called by drawOutside after the buildings and pavement, before the cars.
function seasonStreet(g, t, now, dusk, night) {
  const s = seasonNow();
  if (s === 'autumn') { // leaves blowing past, as before the stay
    for (let i = 0; i < 4; i++) { const x = (i * 83 + now / 25) % 300 - 10, y = 150 + ((i * 37 + now / 60) % 90); if (x > 0 && x < 278) rect(g, x, y, 2, 1, ['#d8742a', '#c8a030', '#a8442a'][i % 3]); }
    return;
  }
  const cold = seasonCold(s), snowCol = lerpColor('#f2f4f8', '#6a7088', dusk * 0.8);
  // the tree by the lamp, bare from November
  const tx = 214;
  rect(g, tx, 96, 3, 54, '#3a3028');
  for (const [bx, by, bw, dir] of [[tx - 10, 100, 11, 1], [tx + 3, 92, 12, -1], [tx - 7, 112, 8, 1], [tx + 3, 108, 9, -1], [tx - 4, 86, 6, 1]]) {
    for (let i = 0; i < bw; i++) rect(g, dir > 0 ? bx + i : bx + i, by - Math.floor(i / 3) * (dir > 0 ? 1 : 1), 1, 1, '#3a3028');
    if (cold) rect(g, bx, by - Math.floor(bw / 3) - 1, bw, 1, snowCol);
  }
  if (s === 'late') { for (let x = 6; x < 278; x += 19) rect(g, x, 176 + (x % 3), 3, 1, '#8a5a2a'); return; } // leaves in the gutter
  if (cold) {
    // snow on the roofs and sills across the street
    for (const h of STREET.houses) {
      const y = 150 - h.h;
      if (h.roof) for (let i = 0; i < 6; i++) rect(g, h.x - 1 + i, y - 7 + i, 2, 1, snowCol), rect(g, h.x + h.w - 1 - i, y - 7 + i, 2, 1, snowCol);
      rect(g, h.x - 1, h.roof ? y - 7 : y - 1, h.roof ? 3 : h.w + 2, 2, snowCol);
      if (h.roof) rect(g, h.x + 4, y - 2, h.w - 8, 2, snowCol);
      for (let wy = y + 15; wy < 140; wy += 16) for (let wx = h.x + 4; wx < h.x + h.w - 6; wx += 10) rect(g, wx - 1, wy, 7, 1, snowCol);
      // strung lights in December
      if (s === 'winter') for (let x = h.x + 2, k = 0; x < h.x + h.w - 2; x += 4, k++) rect(g, x, y + 2 + (k % 2), 1, 1, ['#ff5a5a', '#5ae07a', '#ffe060', '#5aa0ff'][k % 4]);
      // chimney smoke in the deep winter
      if (s === 'deep' && h.roof && h.w > 30) for (let i = 0; i < 5; i++) { const sy = y - 10 - i * 4 - (now / 200 + i * 4) % 4; g.fillStyle = `rgba(220,224,232,${0.25 - i * 0.04})`; g.fillRect(h.x + h.w - 8 + Math.sin(now / 700 + i) * 2, sy, 3 + i, 2); }
    }
    // a wreath on the lamp in December
    if (s === 'winter') { rect(g, 193, 78, 6, 6, '#2a6a3a'); rect(g, 195, 80, 2, 2, '#1e1e22'); rect(g, 195, 84, 2, 2, '#c83a3a'); }
    // the plowed bank along the kerb, and snow on the pavement
    for (let x = 0; x < 280; x += 2) rect(g, x, 172 - ((x * 7) % 5 > 2 ? 1 : 0) - (s === 'deep' ? 2 : 0), 2, 5 + (s === 'deep' ? 2 : 0), lerpColor(s === 'deep' ? '#c8ccd2' : '#e8ecf2', '#4a4e60', dusk * 0.8));
    g.fillStyle = s === 'deep' ? 'rgba(236,240,246,0.55)' : 'rgba(236,240,246,0.35)'; g.fillRect(0, 179, 280, 66);
    // ice at the harbor's edge
    if (s === 'deep') rect(g, 120, 132, 60, 3, lerpColor('#d8e4ec', '#3a4a60', dusk));
  } else if (s === 'thaw') {
    // puddles that catch the neon, crocuses by the step
    for (const [x, w] of [[22, 30], [96, 22], [188, 34]]) { rect(g, x, 196 + (x % 9), w, 3, lerpColor('#8a9aa8', '#3a3a52', dusk)); if (night || dusk > 0.5) rect(g, x + 6, 197 + (x % 9), 6, 1, 'rgba(255,90,110,0.6)'); }
    for (let i = 0; i < 6; i++) rect(g, 246 + i * 5, 238 - (i % 2), 2, 3, i % 2 ? '#a07ae0' : '#f0e8f8');
  }
}
// Falling snow or rain through the window (after the cars and the walker).
function seasonStreetWeather(g, now) {
  const s = seasonNow();
  if (seasonCold(s)) for (let i = 0; i < (s === 'deep' ? 40 : 26); i++) rect(g, (i * 71 + Math.sin(now / 1100 + i) * 6 + now / 120) % 280, 56 + (i * 37 + now / (16 + i % 9)) % 190, 1, 1, 'rgba(244,246,252,0.85)');
  else if (s === 'thaw') for (let i = 0; i < 30; i++) rect(g, (i * 53 + now / 40) % 280, 56 + (i * 41 + now / 4) % 190, 1, 4, 'rgba(190,205,225,0.4)');
}

// ---------------------------------------------------------------- the cast
// Everyone who comes in from outside is dressed for it. The same person dresses the same way every
// time (a hash of their look), and the change is drawn, not stored: a save never holds a coat.
const SEASON_LOOKS = new Map();
const SCARVES = ['#c83a3a', '#2a5a9a', '#e8c040', '#3a7a4a', '#8a3a6a', '#e8e4dc', '#d8742a'];
function lookHash(look) { let h = 7; const s = JSON.stringify(look); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
function seasonLook(look) {
  const s = seasonNow();
  if (s === 'autumn' || !look || look.ghost || look.eye || look.robe || look.noSeason) return look;
  if (typeof CAST !== 'undefined' && CAST.keeper && look === CAST.keeper.look) return look; // you're indoors
  const key = s + ':' + JSON.stringify(look);
  if (SEASON_LOOKS.has(key)) return SEASON_LOOKS.get(key);
  const h = lookHash(look), L = { ...look };
  const bare = L.style === 'tee';
  if (s === 'late') {
    if (bare) { L.style = 'jacket'; L.trim = L.trim || '#e8e4dc'; }
    if (h % 3 === 0) L.scarf = SCARVES[h % SCARVES.length];
  } else if (seasonCold(s)) {
    if (bare || L.style === 'dress' || (L.style === 'hoodie' && h % 2)) { L.style = h % 2 ? 'puffer' : 'jacket'; L.long = L.style === 'jacket'; }
    if (h % 4 !== 0) L.scarf = SCARVES[(h >> 3) % SCARVES.length];
    if (!L.hat && h % 5 < 3 && L.hs !== 4) { L.hat = 'beanie'; L.hatc = L.hatc || SCARVES[(h >> 5) % SCARVES.length]; }
    if (s === 'deep') L.snowy = true;
  } else if (s === 'thaw') {
    if (bare) { L.style = 'jacket'; }
    if (!L.hat && h % 3 === 0) { L.hat = 'hood'; L.hatc = ['#e8c040', '#2a5a9a', '#3a7a4a'][h % 3]; } // a raincoat hood
  }
  SEASON_LOOKS.set(key, L);
  return L;
}

// ---------------------------------------------------------------- inside the shop
// Called from drawShop (js/art.js) after the room and before the stock, and from drawShopFront after
// the counter. October shows only Odile's harbor calendar, turned to October.
//   November on: the radiator under the window, ticking (heat shimmer above it).
//   December and deep winter: wet footprints from the door; frost in the window corners in deep
//   winter, and a space heater glowing by the bike. A small tree on the counter in December if you
//   bought it at a weekend (the 'tree' upgrade, js/data.js).
//   March: the bucket under the leak, and the drip that fills it (snowmelt, every day).
const CAL_MONTHS = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
function drawHarborCalendar(g, m, now) {
  const x = 572, y = 180, r = (a, b, w, h, c) => rect(g, a, b, w, h, c);
  r(x + 12, y - 3, 2, 3, '#2a2a2e'); // the nail
  r(x - 1, y - 1, 28, 36, '#3a3430'); r(x, y, 26, 34, '#f0ead8');
  // this month's picture
  const P = { x: x + 1, y: y + 1, w: 24, h: 13 };
  const sky = ['#8ab4dc', '#9aa4ae', '#5a6a8a', '#c8d4e0', '#2a3456', '#a8c8a0'][m - 1] || '#8ab4dc';
  r(P.x, P.y, P.w, P.h, sky);
  if (m === 1) { r(P.x, P.y + 10, P.w, 3, '#5a7a3a'); r(P.x + 11, P.y + 6, 2, 5, '#4a3020'); r(P.x + 6, P.y + 1, 12, 6, '#d8742a'); r(P.x + 8, P.y, 8, 2, '#c84a2a'); }
  else if (m === 2) { r(P.x, P.y + 8, P.w, 5, '#4a5a6a'); r(P.x + 8, P.y + 6, 9, 2, '#c84a3a'); r(P.x + 12, P.y + 2, 1, 4, '#2a2a2e'); }
  else if (m === 3) { r(P.x, P.y + 9, P.w, 4, '#f0f4f8'); r(P.x + 15, P.y + 2, 3, 8, '#f0ece4'); r(P.x + 15, P.y + 4, 3, 1, '#c84a3a'); r(P.x + 15, P.y + 1, 3, 1, '#ffe080'); for (let i = 0; i < 6; i++) r(P.x + (i * 5) % 23, P.y + (i * 3) % 8, 1, 1, '#fff'); }
  else if (m === 4) { r(P.x, P.y + 7, P.w, 6, '#e4eef4'); r(P.x + 3, P.y + 9, 18, 1, '#b8c8d4'); r(P.x + 10, P.y + 5, 1, 3, '#c83a3a'); }
  else if (m === 5) { r(P.x, P.y + 9, P.w, 4, '#d8e0ea'); r(P.x + 18, P.y + 2, 3, 3, '#f0ecd0'); r(P.x + 4, P.y + 7, 7, 2, '#5a4a3a'); r(P.x + 7, P.y + 4, 1, 3, '#2a2a2e'); }
  else { r(P.x, P.y + 8, P.w, 5, '#5a8a4a'); for (let i = 0; i < 5; i++) { r(P.x + 3 + i * 4, P.y + 7, 1, 2, '#3a6a2a'); r(P.x + 3 + i * 4, P.y + 6, 2, 1, i % 2 ? '#a07ae0' : '#f0e0f8'); } }
  pixText(g, CAL_MONTHS[m - 1] || 'OCT', x + 7, y + 15, '#a83a2a');
  for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) r(x + 2 + col * 3 + (col > 3 ? 1 : 0), y + 23 + row * 3, 2, 2, '#c8c0a8');
}
function seasonShop(g, st, now) {
  const m = typeof monthNum === 'function' ? monthNum() : 1, s = seasonNow(), r = (a, b, w, h, c) => rect(g, a, b, w, h, c);
  drawHarborCalendar(g, m, now);
  if (s === 'autumn') return;
  // the radiator under the window, from November
  const RX = 166, RY = 216;
  r(RX, RY, 40, 28, '#8a8a84'); r(RX, RY, 40, 2, '#b8b8b0');
  for (let i = 0; i < 8; i++) { r(RX + 2 + i * 5, RY + 3, 3, 23, '#a2a29a'); r(RX + 2 + i * 5, RY + 3, 1, 23, '#c0c0b8'); }
  r(RX - 3, RY + 22, 4, 3, '#6a6a64'); r(RX + 38, RY + 4, 3, 3, '#c8a050'); // the pipe and the valve
  for (let i = 0; i < 3; i++) { const p = (now / 900 + i / 3) % 1; g.fillStyle = `rgba(255,255,255,${0.1 * (1 - p)})`; g.fillRect(RX + 8 + i * 11 + Math.sin(now / 300 + i) * 2, RY - 2 - p * 12, 2, 3); }
  if (seasonCold(s)) {
    // wet footprints from the door to the counter
    for (let i = 0; i < 9; i++) { const x = 80 + i * 26, y = 262 + i * 5 + (i % 2) * 4; g.fillStyle = `rgba(70,80,96,${0.22 - i * 0.015})`; g.fillRect(x, y, 5, 3); }
  }
  if (s === 'deep') {
    // frost in the window corners (and the door glass)
    const W = SHOP.win, D = SHOP.door;
    for (const [cx, cy, dx, dy, n] of [[W.x, W.y, 1, 1, 26], [W.x + W.w, W.y, -1, 1, 22], [W.x, W.y + W.h, 1, -1, 30], [W.x + W.w, W.y + W.h, -1, -1, 34], [D.x, D.y + D.h, 1, -1, 16], [D.x + D.w, D.y + D.h, -1, -1, 14]]) {
      for (let k = 0; k < n; k++) { g.fillStyle = `rgba(232,242,252,${0.55 * (1 - k / n)})`; g.fillRect(dx > 0 ? cx : cx - (n - k), dy > 0 ? cy + k : cy - k - 1, n - k, 1); }
      for (let k = 0; k < 6; k++) r(cx + dx * ((k * 7) % n), cy + dy * ((k * 5) % n), 1, 1, '#ffffff');
    }
    // the space heater by the bike, coils glowing
    const HX = 352, HY = 228, glowA = 0.75 + Math.sin(now / 500) * 0.15;
    r(HX, HY, 18, 18, '#3a3a40'); r(HX + 2, HY + 2, 14, 12, '#1e1e22');
    for (let i = 0; i < 4; i++) r(HX + 3, HY + 3 + i * 3, 12, 1, `rgba(255,${110 + i * 10},50,${glowA})`);
    r(HX + 1, HY + 18, 4, 2, '#2a2a2e'); r(HX + 13, HY + 18, 4, 2, '#2a2a2e');
    glow(g, HX + 9, HY + 9, 2, 28, '255,140,60', 0.12);
  }
  if (s === 'thaw') {
    // the bucket under the stained tile, and the snowmelt coming through
    const p = (now % 1400) / 1400;
    if (p < 0.75) r(224, 10 + p / 0.75 * 240, 1, 2, '#9ab8d0');
    else { r(222, 250, 5, 1, 'rgba(154,184,208,0.8)'); }
    r(216, 250, 18, 12, '#8a9098'); r(215, 249, 20, 2, '#b8bcc4'); r(217, 252, 16, 1, '#6a7078'); r(218, 251, 14, 1, '#5a7a9a');
  }
}
function seasonShopFront(g, st, now) {
  if (seasonNow() !== 'winter' || typeof hasUpgrade !== 'function' || !hasUpgrade('tree')) return;
  // a small tree on the counter, by the register
  const x = 560, y = 214, r = (a, b, w, h, c) => rect(g, a, b, w, h, c);
  r(x + 6, y + 24, 4, 4, '#6a4a2a'); r(x + 3, y + 28, 10, 3, '#c83a3a');
  for (let i = 0; i < 4; i++) r(x + 8 - (i + 1) * 2, y + 4 + i * 5, (i + 1) * 4, 5, i % 2 ? '#2a6a3a' : '#3a7a44');
  r(x + 7, y + 1, 2, 3, '#ffe060');
  for (let i = 0; i < 6; i++) if (Math.sin(now / 400 + i * 1.7) > -0.3) r(x + 3 + (i * 5) % 10, y + 8 + i * 3, 1, 1, ['#ff5a5a', '#5aa0ff', '#ffe060'][i % 3]);
}
