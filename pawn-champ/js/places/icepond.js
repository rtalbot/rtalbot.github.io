// Pawn Champ - Hob's Pond, frozen clear, in January. Batch N, ice and snow (docs/quests/BACKLOG.md).
// The pond in the hollow past the marsh road: Teague's Hill on the left with its sled tracks, a dark
// line of pines, the stone shell of the old ice house on the far bank with its loading ramp running
// down to the ice, and in front the pond itself: black ice so clear you can see down into it.
// In the middle, under the ice, the windows of a drowned farmhouse.
//   icepond       - a bright January afternoon, skaters going round       (m72, M29's middle)
//   icepondNight  - the same pond after dark, the window under the ice lit  (M29 Under the Ice)
//   icepondSled   - the first-snow run: a crowd and lanterns on the hill    (m71 The Toboggan)
//   icepondRace   - race day: a course of flags and the iceboat on the ice  (m74 The Iceboat)
//   POND.lit = false puts the window under the ice out (M29's endings); POND.boat = false hides the
//   iceboat; POND.toboggan = false hides the toboggan on the hill.
//
// ICE is the batch's one ice palette, shared by every icy place in batch N: this pond, the shanties
// on the harbor flats (js/places/shanties.js), the rink on the Green and the plunge at the
// breakwater (js/quests/skates.js, plunge.js). Keep new ice in these colors.
//
// Snow marks for the season overlay (docs/SEASONS.md#art): each icy place lists its ground, roofs and
// trees as rectangles in `snow`, so the overlay can find them. These places are winter-only, so they
// are drawn with their snow already on; the overlay should only deepen it.
'use strict';

const ICE = {
  black: '#14202c', deep: '#1e3040', clear: '#2c465c', sheen: '#6a8aa8', frost: '#c8dceb',
  crack: '#e6f0f8', snow: '#eef3f8', snowShade: '#c4d0de', snowBlue: '#9aaec4', pine: '#1e3a2e', pineD: '#122a20'
};
const POND = { lit: true, boat: true, toboggan: true };

// a snowy pine, base at (x, y)
function icePine(g, x, y, h, col = ICE.pine, snow = true) {
  for (let i = 0; i < 4; i++) {
    const w = h * (0.42 - i * 0.08), top = y - h + i * h * 0.18, bot = top + h * 0.38;
    g.fillStyle = col; g.beginPath(); g.moveTo(x, top); g.lineTo(x - w, bot); g.lineTo(x + w, bot); g.closePath(); g.fill();
    if (snow) { g.fillStyle = ICE.snow; g.beginPath(); g.moveTo(x - w, bot); g.lineTo(x - w * 0.55, bot - 4); g.lineTo(x + w * 0.2, bot - 2); g.lineTo(x + w * 0.9, bot - 3); g.lineTo(x + w, bot); g.closePath(); g.fill(); }
  }
  rect(g, x - 2, y - 4, 4, 6, '#3a2a1e');
}

// the iceboat: a long runner plank across, a backbone, the mast and a red sail
function drawIceboat(g, x, y, s = 1) {
  const r = (a, b, w, h, col) => rect(g, x + a * s, y + b * s, w * s, h * s, col);
  r(-40, 0, 80, 4, '#a87a4a'); r(-40, 0, 80, 1, '#c8a070');                  // runner plank
  r(-42, 4, 6, 3, '#c8ccd0'); r(36, 4, 6, 3, '#c8ccd0');                      // runners
  r(-6, -2, 70, 4, '#8a5a3a');                                                // backbone, to the steering runner
  r(60, 2, 6, 3, '#c8ccd0');
  r(10, -6, 18, 6, '#5a3a2a');                                                // the cockpit
  r(0, -86, 3, 84, '#d8c8a8');                                                // mast
  g.fillStyle = '#c83a2a'; g.beginPath(); g.moveTo(x + 3 * s, y - 84 * s); g.lineTo(x + 3 * s, y - 6 * s); g.lineTo(x + 52 * s, y - 8 * s); g.closePath(); g.fill();
  g.fillStyle = '#e85a3a'; g.beginPath(); g.moveTo(x + 3 * s, y - 84 * s); g.lineTo(x + 3 * s, y - 50 * s); g.lineTo(x + 24 * s, y - 34 * s); g.closePath(); g.fill();
  r(4, -60, 30, 1, '#8a2a1e'); r(4, -36, 40, 1, '#8a2a1e');                   // battens
  pixText(g, '7', x + 20 * s, y - 28 * s, '#f4f0e4', s);
}

function buildIcePond(mode) {
  const night = mode === 'night';
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(night ? 307 : 301);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // sky: a low January sun, or a hard clear night
  for (let y = 0; y < 190; y++) r(0, y, NW, 1, night ? lerpColor('#060a18', '#1a2440', y / 190) : lerpColor('#8ab0d4', '#f0e2cc', Math.pow(y / 190, 1.4)));
  if (night) {
    for (let i = 0; i < 200; i++) r(R() * NW, R() * 150, 1, 1, R() < 0.25 ? '#ffffff' : '#8a96c0');
    g.fillStyle = '#eef0f4'; g.beginPath(); g.arc(560, 40, 8, 0, 7); g.fill();
  } else {
    g.fillStyle = 'rgba(255,240,210,0.8)'; g.beginPath(); g.arc(520, 150, 14, 0, 7); g.fill();
    for (const [x, y, w] of [[90, 50, 80], [330, 34, 110]]) { g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(x, y, w / 2, 6, 0, 0, 7); g.fill(); }
  }
  // far hills and the pine line
  g.fillStyle = night ? '#141c2c' : '#8a9aac'; g.beginPath(); g.moveTo(0, 170); for (let x = 0; x <= NW; x += 40) g.lineTo(x, 150 + Math.sin(x / 70) * 10); g.lineTo(NW, 200); g.lineTo(0, 200); g.fill();
  for (let i = 0; i < 46; i++) { const x = 180 + i * 10 + R() * 6; icePine(g, x, 206, 30 + R() * 26, night ? '#0a1612' : ICE.pine, !night || R() < 0.6); }
  // the old ice house on the far bank: a stone shell, its roof half in, the ramp down to the ice
  const st = night ? '#2a2e38' : '#8a8680', stD = night ? '#1a1e26' : '#6a665e';
  r(470, 150, 130, 58, st); for (let y = 152; y < 206; y += 8) for (let x = 470 + (y % 16 ? 6 : 0); x < 598; x += 14) r(x, y, 12, 1, stD);
  r(500, 170, 16, 38, night ? '#0a0c12' : '#2a2620'); r(540, 166, 20, 14, night ? '#0a0c12' : '#2a2620');
  g.fillStyle = night ? '#1e2028' : '#5a504a'; g.beginPath(); g.moveTo(462, 152); g.lineTo(536, 118); g.lineTo(560, 132); g.lineTo(520, 152); g.fill();
  r(462, 146, 60, 6, ICE.snow); r(560, 144, 44, 6, ICE.snow); // snow along what's left of the roof
  for (let i = 0; i < 6; i++) r(560 + i * 7, 140 - i * 3, 6, 4, night ? '#3a3226' : '#6a5038'); // rafters standing up like ribs
  g.fillStyle = night ? '#2a241e' : '#7a6046'; g.beginPath(); g.moveTo(440, 214); g.lineTo(476, 196); g.lineTo(480, 200); g.lineTo(446, 218); g.fill(); // the ramp
  pixText(g, 'HOB POND ICE CO', 478, 158, night ? '#4a4e58' : '#d8d0c0');
  // Teague's Hill on the left, down to the pond, sled tracks in it
  g.fillStyle = night ? '#9aa6bc' : ICE.snow; g.beginPath(); g.moveTo(0, 110); g.quadraticCurveTo(120, 112, 200, 180); g.quadraticCurveTo(240, 214, 300, 222); g.lineTo(300, 300); g.lineTo(0, 300); g.fill();
  g.fillStyle = night ? '#6a768e' : ICE.snowShade; g.beginPath(); g.moveTo(0, 150); g.quadraticCurveTo(100, 160, 170, 196); g.quadraticCurveTo(220, 220, 300, 222); g.lineTo(300, 300); g.lineTo(0, 300); g.fill();
  g.strokeStyle = night ? '#5a6680' : ICE.snowBlue; g.lineWidth = 1;
  for (const k of [0, 6, 13]) { g.beginPath(); g.moveTo(20 + k, 114 + k); g.quadraticCurveTo(130 + k, 140 + k, 250 + k * 2, 214); g.stroke(); }
  for (const [x, y] of [[40, 126], [96, 132]]) icePine(g, x, y, 40, night ? '#0a1612' : ICE.pine);
  // a stone wall running down the hill, and the Teague cellar hole at the top of it
  for (let i = 0; i < 18; i++) r(10 + i * 9, 118 + i * 3.4, 8, 5, night ? '#4a4e5a' : '#9a968e');
  // the pond: black ice, clear as glass, snow pushed to the edges by the skaters
  g.fillStyle = night ? '#0a121c' : ICE.black; g.beginPath(); g.ellipse(360, 262, 300, 52, 0, 0, 7); g.fill();
  for (let y = 214; y < 314; y++) { const t = Math.abs(y - 262) / 50; g.fillStyle = `rgba(${night ? '40,70,100' : '60,100,130'},${0.25 * (1 - t)})`; g.fillRect(70, y, 580, 1); }
  // what's under it: the farmhouse's roof ridge and two windows, very faint, deep down
  g.fillStyle = night ? 'rgba(30,44,60,0.9)' : 'rgba(40,62,80,0.6)';
  g.beginPath(); g.moveTo(290, 258); g.lineTo(340, 238); g.lineTo(392, 258); g.closePath(); g.fill(); r(296, 258, 92, 30, night ? 'rgba(26,38,52,0.9)' : 'rgba(34,54,70,0.6)');
  r(308, 264, 18, 14, night ? '#101820' : '#1a2a36'); r(358, 264, 18, 14, night ? '#101820' : '#1a2a36');
  // skate scratches, cracks, and the snow banks at the edge
  g.strokeStyle = night ? 'rgba(160,190,220,0.25)' : 'rgba(220,235,250,0.45)';
  for (let i = 0; i < 30; i++) { g.beginPath(); const a = R() * 7; g.ellipse(360 + Math.cos(a) * 40, 262, 120 + R() * 150, 24 + R() * 22, 0, a, a + 0.8 + R()); g.stroke(); }
  g.strokeStyle = night ? 'rgba(200,220,240,0.35)' : ICE.crack;
  for (let i = 0; i < 7; i++) { let x = 120 + R() * 460, y = 230 + R() * 60; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 4; k++) { x += 10 + R() * 20; y += (R() - 0.5) * 12; g.lineTo(x, y); } g.stroke(); }
  for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2; g.fillStyle = night ? '#7a869c' : ICE.snow; g.beginPath(); g.ellipse(360 + Math.cos(a) * 300, 262 + Math.sin(a) * 52, 10 + R() * 16, 3 + R() * 3, 0, 0, 7); g.fill(); }
  // the near bank: trodden snow, a bench, a fire barrel, a hockey net dragged off the ice
  for (let y = 300; y < NH; y++) r(0, y, NW, 1, night ? lerpColor('#6a768e', '#4a546a', (y - 300) / 60) : lerpColor(ICE.snow, ICE.snowShade, (y - 300) / 60));
  for (let i = 0; i < 120; i++) r(R() * NW, 304 + R() * 54, 3, 1, night ? '#5a647a' : ICE.snowBlue);
  r(40, 316, 70, 5, '#6a4a32'); r(44, 321, 4, 14, '#4a3222'); r(102, 321, 4, 14, '#4a3222'); r(40, 304, 70, 4, '#6a4a32'); // bench
  r(42, 300, 66, 3, ICE.snow);
  r(560, 300, 30, 42, '#5a5a62'); r(560, 300, 30, 3, '#3a3a40'); for (let i = 0; i < 4; i++) r(564 + i * 7, 314, 3, 3, '#2a2a2e'); // fire barrel (flames in animate)
  g.strokeStyle = '#c8302a'; g.lineWidth = 2; g.strokeRect(470, 318, 44, 24); g.strokeStyle = 'rgba(240,240,240,0.6)'; g.lineWidth = 1;
  for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(472 + i * 8, 320); g.lineTo(472 + i * 8, 340); g.stroke(); }
  return c;
}

const ICEPOND_SNOW = {
  ground: [[0, 300, 640, 60], [0, 110, 300, 130]],
  roofs: [[462, 118, 140, 34]],
  trees: [[180, 150, 470, 56], [20, 80, 100, 56]]
};

function icePondAnimate(night) {
  return function (g, now) {
    // flames in the barrel
    for (let i = 0; i < 5; i++) { const h = 6 + Math.abs(Math.sin(now / (90 + i * 13) + i)) * 10; rect(g, 562 + i * 6, 300 - h, 5, h, i % 2 ? '#e86a1a' : '#f8b030'); }
    for (let i = 0; i < 4; i++) { const p = (now / 2200 + i / 4) % 1; g.fillStyle = `rgba(200,200,210,${0.4 * (1 - p)})`; g.beginPath(); g.ellipse(575 + Math.sin(p * 6 + i) * 6, 290 - p * 60, 4 + p * 10, 3 + p * 6, 0, 0, 7); g.fill(); }
    if (!night) {
      // skaters going round, small and far
      const cols = ['#c83a2a', '#2a5a9a', '#e8b030', '#3a8a5a', '#8a3a8a'];
      for (let i = 0; i < 5; i++) {
        const a = now / (5200 + i * 700) + i * 1.3, x = 360 + Math.cos(a) * (190 - i * 18), y = 258 + Math.sin(a) * (24 - i * 2);
        rect(g, x - 2, y - 14, 5, 9, cols[i]); rect(g, x - 1, y - 18, 3, 4, '#e8c0a0'); rect(g, x - 2, y - 19, 5, 2, cols[(i + 2) % 5]);
        rect(g, x - 2, y - 5, 2, 5, '#2a2a30'); rect(g, x + 1, y - 5, 2, 5, '#2a2a30'); rect(g, x - 3, y, 7, 1, '#c8ccd0');
      }
    } else if (POND.lit) {
      // the lamp in the window under the ice: warm, and breathing
      const f = 0.75 + Math.sin(now / 700) * 0.12 + Math.sin(now / 173) * 0.04;
      rect(g, 309, 265, 16, 12, `rgba(255,${190 + f * 30 | 0},110,${0.55 * f})`);
      rect(g, 316, 265, 1, 12, 'rgba(40,30,20,0.6)'); rect(g, 309, 270, 16, 1, 'rgba(40,30,20,0.6)');
      // a shape crosses the window now and then
      const p = (now / 9000) % 1; if (p > 0.55 && p < 0.7) rect(g, 311 + (p - 0.55) * 80, 266, 4, 11, 'rgba(20,16,12,0.55)');
    }
  };
}
function icePondLight(night) {
  return function (g, now) {
    glow(g, 575, 296, 4, night ? 110 : 50, '255,160,70', night ? 0.28 + Math.sin(now / 90) * 0.03 : 0.08);
    if (night && POND.lit) glow(g, 317, 271, 4, 90, '255,200,120', 0.22 + Math.sin(now / 700) * 0.04);
  };
}

addPlace('icepond', { build: () => buildIcePond('day'), animate: icePondAnimate(false), light: icePondLight(false), vignette: 0.25, snow: ICEPOND_SNOW, music: 'winter' }, 1.5);
addPlace('icepondNight', { build: () => buildIcePond('night'), animate: icePondAnimate(true), light: icePondLight(true), vignette: 0.6, snow: ICEPOND_SNOW, music: 'eerie' }, 1.5);

// the first-snow run: lanterns up Teague's Hill and the crowd at the top (m71)
addVariant('icepondSled', 'icepond', { keepLight: true,
  paint(g) {
    const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
    for (const [x, y] of [[30, 112], [80, 120], [130, 140], [170, 166], [210, 196]]) { r(x, y - 14, 1, 14, '#3a3a3a'); r(x - 3, y - 20, 7, 7, '#f0c060'); r(x - 3, y - 21, 7, 1, '#2a2a2a'); }
    const cols = ['#c83a2a', '#2a5a9a', '#e8b030', '#3a8a5a', '#e8e4dc', '#8a3a8a', '#5a5a5a'];
    for (let i = 0; i < 14; i++) { const x = 6 + i * 9, y = 108 - (i % 3) * 2; r(x, y - 12, 6, 9, cols[i % 7]); r(x + 1, y - 16, 4, 4, '#e8c0a0'); r(x, y - 17, 6, 2, cols[(i + 3) % 7]); }
    pixText(g, 'FIRST RUN', 10, 80, '#c83a2a');
  },
  animate(g) {
    if (!POND.toboggan) return;
    // the toboggan, eight seats, at the top of the run
    rect(g, 60, 116, 64, 4, '#b8864a'); rect(g, 56, 106, 8, 12, '#b8864a'); rect(g, 56, 104, 6, 3, '#8a5a2a');
    for (let i = 0; i < 6; i++) rect(g, 68 + i * 9, 117, 6, 1, '#6a4422');
  },
  light(g) { for (const [x, y] of [[30, 112], [80, 120], [130, 140], [170, 166], [210, 196]]) glow(g, x, y - 16, 2, 26, '255,200,110', 0.2); },
  music: 'winter'
});

// race day: a course of orange flags round the pond, Nils Solberg's iceboat on the line (m74)
addVariant('icepondRace', 'icepond', { keepLight: true,
  paint(g) {
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, x = 360 + Math.cos(a) * 240, y = 262 + Math.sin(a) * 40; rect(g, x, y - 16, 1, 16, '#2a2a2a'); rect(g, x + 1, y - 16, 8, 5, '#f08a1a'); }
    rect(g, 140, 296, 120, 2, '#c83a2a'); pixText(g, 'START', 176, 286, '#c83a2a'); // the start line, sprayed on the ice
    rect(g, 280, 304, 70, 18, '#e8e4dc'); pixText(g, 'HOB POND CUP', 282, 310, '#2a4a6a'); // the trophy table's banner
  },
  animate(g, now) { if (POND.boat) drawIceboat(g, 400 + Math.sin(now / 1500) * 2, 292, 1.3); },
  music: 'winter'
});
