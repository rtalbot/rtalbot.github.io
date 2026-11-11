// Pawn Champ - places: every scene away from the shop (docs/ART.md#places).
// A place is drawn at native resolution (640x360) in three parts:
//   build()          paints the still backdrop once; the result is cached (cachedBg in js/art.js)
//   animate(g, now)  draws what moves, every frame (water, rain, blinking lights, creatures)
//   light(g, now)    adds glows on top of the cast, before the vignette
// plus `vignette` (0..1), and optionally `wash` (a colour laid over the light), `music`, `outdoor`,
// `season` (js/seasons.js). Each place lives in its own file in js/places/ and registers itself with
// addPlace; a version of another place (by day, after dark, with props added) uses addVariant.
// node tools/places.js checks them all.
'use strict';

const PLACES = {};
// Register a place, with how large to draw the cast in it. `place.music` gives it its own track
// (or put a row in PLACE_MUSIC below). Missing animate/light are filled in as doing nothing.
const PLACE_FILES = {}; // id -> the file that registered it, for tools/places.js
function addPlace(id, place, scale = 1.5) {
  if (!place.animate) place.animate = () => {};
  if (!place.light) place.light = () => {};
  PLACES[id] = place; FIGURE_SCALE[id] = scale;
  if (place.music) PLACE_MUSIC[id] = place.music;
  const script = typeof document !== 'undefined' && document.currentScript;
  PLACE_FILES[id] = script ? script.getAttribute('src') : null;
}

// Which track plays in a place (docs/AUDIO.md#music-by-place). Whenever view.bg changes, the game asks
// placeMusic() and plays the answer; a place that isn't listed keeps the time of day's music (the
// daytime rotation, or 'night' for night scenes). A story beat wrapped in Sound.during('<track>', fn)
// still wins over its place. Track ids are in js/soundtrack.js.
const PLACE_MUSIC = {
  // set pieces
  below: 'infernal', arcade: 'infernal',                 // The Gentleman in Grey: Mr. Quillon's shop below the arcade
  nest: 'nest',                                          // M19: the nest under Saint Brine's attic
  wolfwood: 'moon', marsh: 'moon',                       // The Grey Psalter: the wolf ritual, the Moon Table
  observatory: 'stars', observatorySky: 'stars',         // M21 The Halvorsen Plates
  launch: 'deep', lowtide: 'deep',                       // M22 The Sounding
  roomThirteen: 'room13',                                // The Thirteenth Room
  graveyard: 'fog',                                      // the Old Burying Ground, in the fog
  orsolya: 'eerie',                                      // Madame Orsolya's parlor
  // the town
  grange: 'reel', green: 'reel', weighoff: 'reel',       // the Grange Hall, the Harvest Fair, the weigh-off
  rustyanchor: 'shuffle',                                // the harbor bar
  clarion: 'tender',                                     // the shut newspaper office (The Last Column)
  // on the water by day
  ferry: 'sea', ferryLanding: 'sea', gannet: 'sea', sandbar: 'sea', clamshack: 'sea',
  // winter places
  icepond: 'winter', shanties: 'winter', pearls: 'winter', motorinn: 'winter'
};
function placeMusic(bg) { return PLACE_MUSIC[bg] || null; }
// A version of another place: its backdrop, then an optional colour wash and props painted on top.
// By default it keeps the base's motion but not its light (a day version has no lamp glow).
//   wash        { mode: 'screen' | 'multiply', color: 'r,g,b', amount }  daylight lifts, night dims
//   paint(g)    props drawn onto the backdrop once
//   animate, light   extra motion and light; keepAnimate / keepLight say whether the base's run too
//   vignette, scale  default to the base's; anything else (music, outdoor, season) is passed on
//   addVariant('rink', 'greenDay', { paint: g => { ... }, keepLight: true })
function addVariant(id, base, { wash = null, paint = null, animate = null, light = null, keepAnimate = true, keepLight = false, vignette, scale, ...rest } = {}) {
  addPlace(id, {
    ...rest,
    build() {
      const c = PLACES[base].build(), g = c.getContext('2d');
      if (wash && wash.mode === 'screen') {
        g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(${wash.color},${wash.amount})`; g.fillRect(0, 0, NW, NH);
        g.globalCompositeOperation = 'source-over';
      } else if (wash) {
        g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(${wash.color},1)`; g.globalAlpha = wash.amount; g.fillRect(0, 0, NW, NH);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      }
      if (paint) paint(g);
      return c;
    },
    animate(g, now) { if (keepAnimate) PLACES[base].animate(g, now); if (animate) animate(g, now); },
    light(g, now) { if (keepLight) PLACES[base].light(g, now); if (light) light(g, now); },
    get vignette() { return vignette !== undefined ? vignette : PLACES[base].vignette; }
  }, scale || FIGURE_SCALE[base] || 1.5);
}
// The two common washes:
//   addDayVariant('arcadeDay', 'arcade')   the night backdrop in daylight, without its lamps
// (`animate: false` drops the base's motion; a function adds motion of its own on top of it)
function addDayVariant(id, base, { sky = '200,190,170', amount = 0.42, animate = true, ...rest } = {}) {
  addVariant(id, base, { wash: { mode: 'screen', color: sky, amount }, vignette: 0.25, ...motion(animate), ...rest });
}
//   addNightVariant('customsNight', 'townhall', { light: (g, now) => glow(g, 300, 200, 4, 90, '255,210,140', 0.3) })
function addNightVariant(id, base, { tint = '30,36,70', amount = 0.62, animate = true, ...rest } = {}) {
  addVariant(id, base, { wash: { mode: 'multiply', color: tint, amount }, vignette: 0.6, ...motion(animate), ...rest });
}
function motion(animate) { return typeof animate === 'function' ? { animate } : { keepAnimate: !!animate }; }

// mirrored lettering, as seen from inside a shop window
function pixTextMirror(g, str, x, y, col, s) {
  const w = textWidth(str, s) + 2, h = 5 * s + 2;
  const c = mkCanvas(w, h), cg = c.getContext('2d');
  pixText(cg, str, 1, 1, col, s);
  g.save(); g.translate(x + w, y); g.scale(-1, 1); g.drawImage(c, 0, 0); g.restore();
}
// a clock face: rim, face, hour ticks, and optionally fixed hands
function clockFace(g, cx, cy, rad, rim, face, hands) {
  g.fillStyle = shade(rim, -0.3); g.beginPath(); g.arc(cx, cy + 1, rad + 3, 0, 7); g.fill();
  g.fillStyle = rim; g.beginPath(); g.arc(cx, cy, rad + 3, 0, 7); g.fill();
  g.fillStyle = shade(rim, 0.25); g.beginPath(); g.arc(cx, cy, rad + 3, 3.6, 5.4); g.lineTo(cx, cy); g.fill();
  g.fillStyle = face; g.beginPath(); g.arc(cx, cy, rad, 0, 7); g.fill();
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2, d = rad - (rad > 9 ? 3 : 2);
    rect(g, cx + Math.cos(a) * d, cy + Math.sin(a) * d, i % 3 ? 1 : 2, i % 3 ? 1 : 2, '#3a2a1e');
  }
  if (hands) clockHands(g, cx, cy, rad, hands[0], hands[1], '#2a1e16');
}
function clockHands(g, cx, cy, rad, hour, min, col) {
  g.strokeStyle = col; g.lineWidth = Math.max(1, rad / 8);
  const ha = (hour % 12 + min / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = min / 60 * Math.PI * 2 - Math.PI / 2;
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ha) * rad * 0.5, cy + Math.sin(ha) * rad * 0.5); g.stroke();
  g.lineWidth = Math.max(1, rad / 12);
  g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ma) * rad * 0.8, cy + Math.sin(ma) * rad * 0.8); g.stroke();
}
