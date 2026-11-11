// Pawn Champ - procedural pixel art.
// Everything is drawn in code on a 320x180 canvas that CSS scales up with crisp pixels.
'use strict';

const W = 320, H = 180;

function mkCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function rect(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, h | 0); }
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r + 255 * amt)));
  g = Math.max(0, Math.min(255, Math.round(g + 255 * amt)));
  b = Math.max(0, Math.min(255, Math.round(b + 255 * amt)));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
function lerpColor(a, b, t) {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const r = Math.round(((x >> 16) & 255) * (1 - t) + ((y >> 16) & 255) * t);
  const g = Math.round(((x >> 8) & 255) * (1 - t) + ((y >> 8) & 255) * t);
  const bl = Math.round((x & 255) * (1 - t) + (y & 255) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

// ---------------------------------------------------------------- item icons
const ICON_PAL = {
  k: '#1c1410', y: '#e2b04a', Y: '#f6d77e', o: '#9a6a26',
  s: '#b9bec8', S: '#eef0f5', d: '#6e7480',
  r: '#b8322a', R: '#e86a5a', b: '#3b6fd0', B: '#8ab8f0',
  g: '#3d9a52', G: '#8fd89c', w: '#7a4e2c', W: '#a87444', n: '#4a2e1a',
  p: '#e6d8b6', P: '#b8a682', c: '#f4eee0', a: '#e08a1e', A: '#f8c050',
  j: '#4aa880', J: '#9ae0c0', m: '#6a3a20', v: '#3a2a5a', V: '#7a6ab0'
};

const ICONS = {
  ring: [
    '............', '.....kk.....', '....kRrk....', '....krrk....', '....kyyk....', '...kyYoyk...',
    '..ky....yk..', '..kY....ok..', '..ky....yk..', '...kyooyk...', '....kkkk....', '............'],
  necklace: [
    '............', '..kk....kk..', '.kcck..kcck.', '.kck....kck.', '.kck....kck.', '..kck..kck..',
    '..kck..kck..', '...kckkck...', '....kyyk....', '...kyRRyk...', '....kyyk....', '............'],
  candlestick: [
    '.....kAk....', '.....kak....', '.....kpk....', '.....kpk....', '....ksSsk...', '.....ksk....',
    '.....ksk....', '.....kSk....', '.....ksk....', '....ksSsk...', '...ksSSssk..', '...kkkkkkk..'],
  watch: [
    '.....kkk....', '.....kyk....', '...kkkkkk...', '..kyyyyyyk..', '.kyccccccyk.', '.kycccckcyk.',
    '.kycckkccyk.', '.kyccccccyk.', '.kyccccccyk.', '..kyyyyyyk..', '...kkkkkk...', '............'],
  painting: [
    'kkkkkkkkkkkk', 'kyoyoyoyoyok', 'koBBBBBBBBok', 'kyBBBBBBBByk', 'koBBGBBBBBok', 'kyBGGGBBGByk',
    'kogGGGGGGgok', 'kyggggggggyk', 'koggwggwggok', 'kyoyoyoyoyok', 'kkkkkkkkkkkk', '............'],
  vase: [
    '...kkkkkk...', '....kBBk....', '....kcck....', '...kccbck...', '..kcbcccck..', '.kccbbbccck.',
    '.kcbcbcbcck.', '.kccbbbccck.', '..kcccccbk..', '...kcccck...', '...kkkkkk...', '............'],
  tome: [
    '............', '..kkkkkkkk..', '.kmmmmmmmmk.', '.kmyyyyyymk.', '.kmymmmmymk.', '.kmymyymymk.',
    '.kmymmmmymk.', '.kmyyyyyymk.', '.kmmmmmmmmk.', '.kppppppppk.', '.kkkkkkkkkk.', '............'],
  lute: [
    '........kk..', '.......knnk.', '......knnk..', '.....kwnk...', '....kwnk....', '..kkwWk.....',
    '.kWWWWwk....', 'kWWkkWWwk...', 'kWWkkWWwk...', 'kWWWWWWwk...', '.kwWWWwk....', '..kkkkk.....'],
  compass: [
    '....kkkk....', '..kkyyyykk..', '.kyppppppyk.', '.kypppRppyk.', 'kyppppRpppyk', 'kypppkkpppyk',
    'kypppddpppyk', 'kyppppdpppyk', '.kypppdppyk.', '.kyppppppyk.', '..kkyyyykk..', '....kkkk....'],
  goblet: [
    '..kkkkkkkk..', '..ksSSSSsk..', '..ksSrSSsk..', '..kssssssk..', '...kssssk...', '....kssk....',
    '.....kk.....', '....kSsk....', '.....kk.....', '....kssk....', '..kssssssk..', '..kkkkkkkk..'],
  brooch: [
    '............', '....kkkk....', '..kkyyyykk..', '.kyyRRRRyyk.', '.kyRRrRRRyk.', 'kyRRrrRRRRyk',
    'kyRrrRRRRRyk', '.kyRRRRrRyk.', '.kyyRRRRyyk.', '..kkyyyykk..', '....kkkk....', '............'],
  musicbox: [
    '............', '..kkkkkkkk..', '.kwWWWWWWwk.', 'kwWWWWWWWWwk', 'kkkkkkkkkkkk', 'kwyyyyyyyywk',
    'kwWWWkkWWWwk', 'kwWWWkyWWWwk', 'kwWWWWWWWWwk', 'kwwwwwwwwwwk', '.kkkkkkkkkk.', '............'],
  spyglass: [
    '............', '..........kk', '........kkyk', '.......kyyk.', '......kmmk..', '.....kmmk...',
    '....kyyk....', '...kmmk.....', '..kmmk......', '.kyyk.......', 'kcck........', 'kkk.........'],
  dagger: [
    '..........kk', '.........kSk', '........kSsk', '.......kSsk.', '......kSsk..', '.....kSsk...',
    '..k.kSsk....', '..kykssk....', '...kyyk.....', '..kmkyyk....', '.kmk..kk....', 'kyk.........'],
  amber: [
    '............', '....kkk.....', '...kAAak....', '..kAAAAak...', '..kAaAAaak..', '.kAAAaAAak..',
    '.kaAAAAaak..', '.kaaAAaaak..', '..kaaaaak...', '...kkkkk....', '............', '............'],
  statuette: [
    '....kkk.....', '...kJjjk....', '...kjJjk....', '....kjk.....', '...kjJjk....', '..kjjJjjk...',
    '..kjkJjkk...', '...kjjjk....', '...kjkjk....', '..kjjkjjk...', '..kwwwwwk...', '..kkkkkkk...'],
  crown: [
    '............', '............', 'k....kk....k', 'kk..kyyk..kk', 'kyk.kyyk.kyk', 'kyykyyyykyyk',
    'kyyyyyyyyyyk', 'kyRyybyyRyyk', 'kyyyyyyyyyyk', 'kooooooooook', 'kkkkkkkkkkkk', '............'],
  crate: [
    '............', 'kkkkkkkkkkkk', 'kWWWWWWWWWWk', 'kwkwwwwwwkwk', 'kwwkwwwwkwwk', 'kwwwkwwkwwwk',
    'kwwwwkkwwwwk', 'kwwwkwwkwwwk', 'kwwkwwwwkwwk', 'kwkwwwwwwkwk', 'kWWWWWWWWWWk', 'kkkkkkkkkkkk'],
  mirror: [
    '...kkkkkk...', '..kyyyyyyk..', '.kyBBBBBBok.', '.kyBSBBBBok.', '.kyBBSBBBok.', '.kyBBBBBBok.',
    '.kyBBBBSBok.', '..kyooooyk..', '...kkyykk..', '.....kyk....', '....kyyyk...', '....kkkkk...'],
  purse: [
    '............', '....k..k....', '...kyk.kyk..', '....kkkk....', '..kkmmmmkk..', '.kmmmmmmmmk.',
    'kmmmyyyymmmk', 'kmmmyYYymmmk', 'kmmmmyymmmmk', '.kmmmmmmmmk.', '..kkkkkkkk..', '............'],
  inkwell: [
    '.........kk.', '........kck.', '.......kck..', '......kck...', '.....kck....', '...kkkkk....',
    '..kvvvvvk...', '.kvvvVvvvk..', '.kvvvvvvvk..', '.kvvvvvvvk..', '..kkkkkkk...', '............'],
  psalter: [
    '............', '..kkkkkkkk..', '.kddsdsddsk.', '.kdsdddsdsk.', '.kddkkkkddk.', '.kdkrRRrkdk.',
    '.kddkkkkddk.', '.kdsdddsddk.', '.kddsdsddsk.', '.kppppppppk.', '.kkkkkkkkkk.', '............'],
  camera: [
    '............', '...kkk......', '.kkkdkkkkkk.', 'kssssssssssk', 'kdddkkkkdddk', 'kddkdBBdkddk',
    'kddkBbBbkddk', 'kddkdBBdkddk', 'kdddkkkkdddk', 'kddddddddddk', '.kkkkkkkkkk.', '............'],
  guitar: [
    '.........kk.', '........kdk.', '.......kdk..', '......knk...', '.....knk....', '..kkknk.....',
    '.krrrnrk....', 'krrrSnrrk...', '.krSSSrk....', 'krrrrrrrk...', '.krrrrrk....', '..kkkkk.....'],
  wristwatch: [
    '....kkkk....', '....kmmk....', '...kkkkkk...', '..ksSSSSsk..', '..kSccccSk..', '..kSckccSk..',
    '..kSckkcSk..', '..kSccccSk..', '..ksSSSSsk..', '...kkkkkk...', '....kmmk....', '....kkkk....'],
  // tools (docs/ITEMS_IN_USE.md)
  spade: [
    '...kkkkkk...', '...kw..wk...', '...kkwwkk...', '....kwwk....', '....kwwk....', '....kwwk....',
    '...kkddkk...', '..kssSSssk..', '..ksSSSssk..', '..ksSssssk..', '...kssssk...', '....kkkk....'],
  flashlight: [
    '............', '............', '........kkk.', '.kkkkkkkkYk.', 'kddddddkdYYk', 'kdsssdskdYYk',
    'kddddddkdYYk', '.kkkkkkkkYk.', '........kkk.', '............', '............', '............'],
  prybar: [
    '.kkk........', 'krrrk.......', 'krkkrk......', 'kk..krk.....', '.....krk....', '......krk...',
    '.......krk..', '........krk.', '.........krk', '........krrk', '.........kk.', '............'],
  boltcutters: [
    '....kkkk....', '...ksSSsk...', '...kssssk...', '....kddk....', '....kddk....', '...krkkrk...',
    '..krk..krk..', '..krk..krk..', '.krk....krk.', '.krk....krk.', 'kRk......kRk', 'kk........kk'],
  rope: [
    '...kkkkkk...', '.kkAaAaAakk.', 'kAakkkkkkaAk', 'kAk.kkkk.kak', 'kak.kAak.kAk', 'kAk.kakk.kak',
    'kak.kAk..kAk', 'kAk..kk..kak', 'kak......kAk', 'kAakkkkkkaAk', '.kkAaAaAakk.', '...kkkkkk...'],
  boots: [
    '..kkkkk.....', '..kyyyk.....', '..kgggk.....', '..kgggk.....', '..kgggk.....', '..kgggk.....',
    '..kgGgk.....', '..kggggkkk..', '..kgggggggk.', '..kgggggggk.', '..kkkkkkkkk.', '............'],
  toolbox: [
    '............', '............', '....kkkk....', '....k..k....', '.kkkkkkkkkk.', 'kRRRRRRRRRRk',
    'krrrrrrrrrrk', 'kkkkkssskkkk', 'krrrrrrrrrrk', 'krrrrrrrrrrk', 'kkkkkkkkkkkk', '............'],
  detector: [
    'kkk.........', 'kdk.........', 'kkkk........', '..kdk.......', '..kyyk......', '...kyyk.....',
    '....kdk.....', '.....kdk....', '......kdk...', '....kkkkkkk.', '...kddddddk.', '....kkkkkkk.'],
  bag: [
    '............', '...kkkkkk...', '..k......k..', '..k......k..', 'kkkkkkkkkkkk', 'kPPPPPPPPPPk',
    'kPppppppppPk', 'kPppppppppPk', 'kPppppppppPk', 'kPppppppppPk', 'kPPPPPPPPPPk', 'kkkkkkkkkkkk'],
  letter: [
    '............', 'kkkkkkkkkkkk', 'kpkppppppkpk', 'kppkppppkppk', 'kpppkrrkpppk', 'kppppkrkpppk',
    'kpppppppppPk', 'kppppppppPPk', 'kpppppppPPPk', 'kPPPPPPPPPPk', 'kkkkkkkkkkkk', '............']
};

const iconCache = {};
function iconCanvas(name) {
  if (iconCache[name]) return iconCache[name];
  const rows = ICONS[name] || ICONS.crate;
  const c = mkCanvas(12, 12), g = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length && x < 12; x++) {
      const ch = row[x];
      if (ch !== '.' && ICON_PAL[ch]) rect(g, x, y, 1, 1, ICON_PAL[ch]);
    }
  });
  iconCache[name] = c;
  return c;
}
const iconUrlCache = {};
function iconURL(name) {
  if (!iconUrlCache[name]) iconUrlCache[name] = iconCanvas(name).toDataURL();
  return iconUrlCache[name];
}

// ---------------------------------------------------------------- characters
// Faceless figures in the spirit of the reference: identity comes from
// silhouette, hair, hat and clothing color, not from facial detail.
// A "look" is a plain object of colors and style switches; each look is
// rendered once into a strip of frames at native resolution (2x the logical grid).
//   frames: 0-1 idle (breathing), 2-5 walk cycle, 6 talking (head lifted)
const SPR_W = 40, SPR_H = 80, SPR_FOOT = 77; // native px; the ground is row SPR_FOOT
const NFRAMES = 7;

function bodyPlan(look) {
  const s = look.stout ? 2 : 0;
  if (look.kid) return { kid: true, head: 33, hw: 10, hh: 12, hx: 15, torso: [47, 59], legs: [60, 74], tx: [14 - s, 25 + s],
    legW: 4, legL: 15, legR: 21, armW: 3, armLen: 10, stride: 1 };
  return { kid: false, head: 10, hw: 10, hh: 12, hx: 15, torso: [24, 46], legs: [47, 74], tx: [12 - s, 27 + s],
    legW: 6, legL: 13, legR: 21, armW: 3, armLen: 18, stride: 2 };
}

function renderCharacter(look, frame) {
  const c = mkCanvas(SPR_W, SPR_H), g = c.getContext('2d');
  const P = bodyPlan(look);
  const R = (x, y, w, h, col) => { if (w > 0 && h > 0) rect(g, x, y, w, h, col); };
  const coat = look.coat, coatD = shade(coat, -0.18), coatL = shade(coat, 0.1);
  const trim = look.trim || shade(coat, 0.25);
  const skin = look.skin, skinD = shade(skin, -0.14);
  const hair = look.hair || '#3a2a1e', hairD = shade(hair, -0.15), hairL = shade(hair, 0.14);
  const pants = look.pants || '#34303c', pantsD = shade(pants, -0.18);
  const shoe = look.shoe || '#1e1a1c';
  const style = look.style || (look.robe ? 'robe' : 'jacket');

  // pose for this frame
  const walk = frame >= 2 && frame <= 5 ? frame - 2 : -1;
  const breathe = frame === 1 ? 1 : 0;
  const lift = walk === 1 || walk === 3 ? -1 : 0;           // passing frames rise a pixel
  const headUp = frame === 6 ? -1 : 0;
  const stride = (walk === 0 ? 1 : walk === 2 ? -1 : 0) * P.stride;
  const up = lift + breathe;
  const [t0, t1] = P.torso, [l0, l1] = P.legs;
  const [x0, x1] = P.tx, tw = x1 - x0 + 1;
  const mid = Math.floor((x0 + x1) / 2);

  // ---- legs and shoes (or a skirt/robe)
  const longSkirt = style === 'robe' || style === 'dress';
  if (!longSkirt) {
    const ly = l0 + lift, lh = l1 - l0 + 1 - lift;
    R(P.legL - stride, ly, P.legW, lh, pants);
    R(P.legR + stride, ly, P.legW, lh, pantsD);
    R(P.legL - stride + P.legW - 1, ly, 1, lh, shade(pants, -0.08));
    const footUpL = walk === 2 ? 1 : 0, footUpR = walk === 0 ? 1 : 0;
    R(P.legL - stride, l1 + 1 - footUpL, P.legW + 2, 2, shoe);
    R(P.legR + stride, l1 + 1 - footUpR, P.legW + 2, 2, shoe);
  } else {
    const sk = style === 'dress' ? coatL : coat;
    for (let y = t1 + 1 + up; y <= l1 + 1; y++) {
      const flare = Math.floor((y - t1) / 7);
      R(x0 - flare, y, tw + flare * 2, 1, sk);
      R(x1 - 2 + flare, y, 3, 1, shade(sk, -0.18));
    }
    R(P.legL + 1 - stride, l1 + 2, 4, 1, shoe); R(P.legR + stride, l1 + 2, 4, 1, shoe);
  }

  // ---- torso
  const ty = t0 + up, th = t1 - t0 + 1;
  const puff = style === 'puffer' ? 1 : 0;
  R(x0 - puff, ty, tw + puff * 2, th, coat);
  R(x1 - 2 + puff, ty, 3, th, coatD);                        // shadow side
  R(x0 + 1 - puff, ty, tw - 2 + puff * 2, 1, coatL);         // shoulder highlight
  g.clearRect(x0 - puff, ty, 1, 1); g.clearRect(x1 + puff, ty, 1, 1);
  if (style === 'jacket') { R(mid - 1, ty + 1, 3, th - 1, trim); R(mid + 2, ty + 1, 1, th - 1, coatD); R(mid - 2, ty + 1, 1, 5, coatD); }
  else if (style === 'suit') { R(mid - 1, ty, 3, 6, '#e8e4dc'); R(mid, ty + 1, 2, th - 6, trim); R(mid - 2, ty, 1, 9, coatD); R(mid + 2, ty, 1, 9, coatD); R(x0 + 2, ty + th - 8, 3, 1, coatD); }
  else if (style === 'hoodie') { R(mid - 3, ty + th - 9, 8, 5, coatD); R(mid - 1, ty + 1, 1, 6, trim); R(mid + 2, ty + 1, 1, 6, trim); R(x0 + 2, ty - 1, tw - 4, 2, coatD); }
  else if (style === 'puffer') { for (let y = ty + 4; y < ty + th; y += 5) R(x0 - puff, y, tw + puff * 2, 1, coatD); R(mid, ty, 1, th, coatD); R(x0 + 1, ty - 1, tw - 2, 2, coatD); }
  else if (style === 'tee') { R(mid - 2, ty, 5, 1, skinD); R(mid - 1, ty + 1, 3, 1, skinD); if (look.logo) R(mid - 2, ty + 6, 5, 5, look.logo); }
  else if (style === 'uniform') { R(mid, ty + 1, 1, th - 1, coatD); R(x0 + 3, ty + 5, 3, 3, trim); R(x0 + 2, ty + 2, 5, 1, coatD); R(x1 - 6, ty + 2, 5, 1, coatD); R(x1 - 5, ty + 4, 3, 2, coatD); }
  else if (style === 'vest') { const v = look.vest || '#d8e040'; R(x0, ty + 1, 5, th - 1, v); R(x1 - 4, ty + 1, 5, th - 1, shade(v, -0.15)); R(x0, ty + th - 8, tw, 2, '#d0d0d0'); }
  if (look.apron) { R(x0 + 2, ty + 6, tw - 4, th + (P.kid ? 4 : 12), look.apron); R(x0 + 2, ty + 6, tw - 4, 1, shade(look.apron, -0.12)); R(x1 - 4, ty + 6, 2, th + (P.kid ? 4 : 12), shade(look.apron, -0.1)); }
  if (look.sash) for (let i = 0; i < th - 3; i++) R(x0 + Math.round(i * (tw - 3) / (th - 3)), ty + i, 3, 1, look.sash);
  if (look.long && !longSkirt) { // coat skirts down over the thighs
    const ch = P.kid ? 5 : 13;
    R(x0, t1 + 1 + up, tw, ch, coat); R(x1 - 2, t1 + 1 + up, 3, ch, coatD);
    if (style === 'jacket' || style === 'suit') R(mid, t1 + 1 + up, 1, ch, coatD);
  }
  R(x0, ty + th - (P.kid ? 5 : 9), tw, 2, look.belt || (look.long || style === 'hoodie' || style === 'puffer' ? coatD : shade(pants, -0.3)));

  // ---- arms (swing while walking)
  const sw = walk === 0 ? 1 : walk === 2 ? -1 : 0;
  const AL = P.armLen;
  const sleeve = style === 'tee' ? skinD : coatD, sleeveF = style === 'tee' ? skin : coat;
  const ax0 = x0 - P.armW - puff, ax1 = x1 + 1 + puff;
  R(ax0, ty + 1 - sw, P.armW, AL, sleeve);
  R(ax1, ty + 1 + sw, P.armW, AL, sleeveF);
  R(ax1 + P.armW - 1, ty + 2 + sw, 1, AL - 2, coatD);
  if (style === 'tee') { R(ax0, ty + 1 - sw, P.armW, 5, coatD); R(ax1, ty + 1 + sw, P.armW, 5, coat); }
  R(ax0, ty + 1 + AL - sw, P.armW, 3, skinD);
  R(ax1, ty + 1 + AL + sw, P.armW, 3, skin);
  if (look.lantern) { const hx = ax1, hy = ty + 2 + AL + sw; R(hx - 1, hy, 6, 3, '#3a3a42'); R(hx + 5, hy, 1, 3, '#fff2b0'); }
  if (look.bag) { R(ax0 - 3, ty + AL - 4 - sw, 6, 8, look.bag); R(ax0 - 3, ty + AL - 4 - sw, 6, 1, shade(look.bag, 0.15)); R(ax0, ty + 1 - sw, 1, AL - 5, shade(look.bag, -0.2)); }

  // ---- head
  const hy = P.head + up + headUp, hx = P.hx, HW = P.hw, HH = P.hh;
  R(hx + 3, hy + HH, 4, 2, skinD);                           // neck
  R(hx, hy, HW, HH, skin);
  R(hx + HW - 3, hy + 1, 3, HH - 1, skinD);                  // shaded far cheek
  for (const [cx, cy] of [[hx, hy], [hx + HW - 1, hy], [hx, hy + HH - 1], [hx + HW - 1, hy + HH - 1]]) g.clearRect(cx, cy, 1, 1);
  g.clearRect(hx + 1, hy + HH - 1, 1, 1);
  R(hx + HW, hy + 5, 1, 3, skin);                            // nose bump shows which way they face

  // hair
  const hs = look.hs || 0;
  const cap = () => { R(hx, hy - 1, HW, 4, hair); R(hx + 1, hy - 1, HW - 3, 1, hairL); R(hx, hy + 3, 3, 4, hair); R(hx + 3, hy + 3, 1, 2, hairD); };
  if (hs === 0) cap();
  else if (hs === 1) { R(hx - 1, hy - 1, HW + 1, 4, hair); R(hx, hy - 1, HW - 2, 1, hairL); R(hx - 1, hy + 3, 4, 14, hair); R(hx - 1, hy + 12, 3, 5, hairD); R(hx + HW - 3, hy + 3, 3, 5, hair); }
  else if (hs === 2) { R(hx, hy + 3, 3, 5, hair); R(hx + HW - 2, hy + 4, 1, 3, hairD); R(hx + 2, hy, 5, 1, shade(skin, 0.08)); }
  else if (hs === 3) { cap(); R(hx - 3, hy - 4, 5, 5, hair); R(hx - 2, hy - 4, 3, 1, hairL); }
  else if (hs === 4) { R(hx - 2, hy - 4, HW + 3, 7, hair); R(hx - 1, hy - 4, HW, 1, hairL); R(hx - 2, hy + 3, 5, 7, hair); R(hx + HW - 2, hy + 3, 2, 3, hairD); }
  else if (hs === 5) { cap(); R(hx - 3, hy + 3, 3, 11, hair); R(hx - 3, hy + 10, 2, 4, hairD); R(hx - 2, hy + 2, 3, 2, look.band || hairD); }
  if (look.beard) { R(hx + 2, hy + 7, HW - 1, 4, look.beard); R(hx + 3, hy + 11, HW - 4, 2, look.beard); R(hx + HW - 2, hy + 7, 1, 4, shade(look.beard, -0.15)); }
  if (look.moustache) R(hx + 5, hy + 8, HW - 4, 1, look.moustache);
  if (look.glasses) { R(hx + 4, hy + 5, HW - 3, 1, look.glasses); R(hx + 6, hy + 5, 2, 2, look.glasses); R(hx + HW - 1, hy + 5, 1, 2, look.glasses); }
  if (look.eye) { R(hx + 6, hy + 5, 1, 2, look.eye); R(hx + 9, hy + 5, 1, 2, look.eye); } // only the uncanny have eyes
  if (look.ears) { // felt wolf ears (very convincing)
    for (const ex of [hx, hx + 6]) { R(ex, hy - 4, 4, 4, '#77777f'); R(ex + 1, hy - 6, 2, 2, '#77777f'); R(ex + 1, hy - 3, 2, 3, '#d89a9a'); }
  }

  // a scarf, and snow on the shoulders (winter, js/seasons.js)
  if (look.scarf) { const sc = look.scarf; R(hx + 1, hy + HH - 1, HW - 1, 3, sc); R(hx + 2, hy + HH - 1, HW - 4, 1, shade(sc, 0.15)); R(hx + 2, hy + HH + 2, 3, P.kid ? 4 : 8, shade(sc, -0.12)); }
  if (look.snowy) { R(x0 - puff, ty - 1, 4, 1, '#f2f4f8'); R(x1 - 3 + puff, ty - 1, 4, 1, '#f2f4f8'); R(x0 + 3, ty, 2, 1, '#f2f4f8'); }

  // hats
  const hat = look.hat, hc = look.hatc || '#2a2430', hcD = shade(hc, -0.2), hcL = shade(hc, 0.12), band = look.band || trim;
  if (hat === 'cap') { R(hx - 1, hy - 3, HW + 1, 6, hc); R(hx, hy - 3, HW - 2, 1, hcL); R(hx + HW - 1, hy + 2, 5, 2, hcD); }
  else if (hat === 'beanie') { R(hx - 1, hy - 4, HW + 2, 7, hc); R(hx, hy - 4, HW - 1, 1, hcL); R(hx - 1, hy + 2, HW + 2, 2, hcD); R(hx + 3, hy - 6, 4, 2, hc); }
  else if (hat === 'wide') { R(hx - 4, hy + 1, HW + 8, 2, hcD); R(hx, hy - 5, HW, 6, hc); R(hx, hy - 1, HW, 2, band); R(hx + 1, hy - 5, HW - 3, 1, hcL); }
  else if (hat === 'top') { R(hx - 2, hy + 1, HW + 4, 2, hcD); R(hx, hy - 11, HW, 12, hc); R(hx, hy - 2, HW, 2, band); R(hx + HW - 3, hy - 11, 3, 9, hcD); }
  else if (hat === 'hood') { R(hx - 2, hy - 3, HW + 3, 6, hc); R(hx - 2, hy + 3, 5, 11, hc); R(hx + HW - 1, hy + 3, 1, 4, hcD); R(hx - 2, hy + 12, HW + 3, 3, hcD); R(hx - 1, hy - 3, HW, 1, hcL); }
  else if (hat === 'bonnet') { R(hx - 1, hy - 3, HW + 2, 6, hc); R(hx - 2, hy + 3, 5, 9, hc); R(hx + HW - 2, hy + 11, 3, 3, band); R(hx, hy - 3, HW - 1, 1, hcL); }
  else if (hat === 'veil') { R(hx - 1, hy - 3, HW + 2, 4, hc); R(hx, hy + 1, HW, 2, '#ece8e0'); R(hx - 3, hy + 1, 5, 19, hc); R(hx - 3, hy + 14, 3, 6, hcD); }
  else if (hat === 'helm') { R(hx - 1, hy - 4, HW + 2, 5, hc); R(hx - 1, hy + 1, HW + 2, 2, '#16161c'); R(hx + HW - 2, hy + 3, 5, 1, '#16161c'); R(hx + 4, hy - 3, 2, 2, band); R(hx, hy - 4, HW, 1, hcL); }

  // soft dark rim so figures read against busy backgrounds
  const img = g.getImageData(0, 0, SPR_W, SPR_H), d = img.data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < SPR_W && y < SPR_H && d[(y * SPR_W + x) * 4 + 3] > 0;
  const rim = [];
  for (let y = 0; y < SPR_H; y++) for (let x = 0; x < SPR_W; x++) {
    if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) rim.push([x, y]);
  }
  g.fillStyle = 'rgba(18,12,16,0.6)';
  rim.forEach(([x, y]) => g.fillRect(x, y, 1, 1));
  if (look.ghost) { // the drowned dead: pale and see-through blue
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = 'rgba(170,215,240,0.45)'; g.fillRect(0, 0, SPR_W, SPR_H);
  }
  return c;
}

const spriteCache = new Map();
function characterFrames(look) {
  const key = JSON.stringify(look);
  if (!spriteCache.has(key)) spriteCache.set(key, Array.from({ length: NFRAMES }, (_, f) => renderCharacter(look, f)));
  return spriteCache.get(key);
}
// height from the feet to the top of the head (logical px), used to place speech bubbles
function figureHeight(look) {
  const P = bodyPlan(look);
  let top = P.head - 1;
  if (look.hat === 'top') top -= 11; else if (look.hat) top -= 4;
  if (look.ears) top = Math.min(top, P.head - 6);
  if (look.hs === 4) top = Math.min(top, P.head - 4);
  return (SPR_FOOT - top) / 2;
}

// draws in logical coordinates (the stage canvas is scaled 2x), sprite pixels land 1:1 on screen
// Story scenes are drawn at a wider, roomier scale than the shop, so the cast is drawn larger
// there to match the props. 1 = shop size. Scenes not listed use 1.
const FIGURE_SCALE = {}; // per place, set by addPlace (js/places.js)
function figureScale(bg) { return FIGURE_SCALE[bg] || 1; }
function drawCharacter(g, look, x, y, frame, facingLeft, alpha, scale = 1) {
  x = Math.round(x * 2) / 2; y = Math.round(y * 2) / 2;
  g.save();
  if (alpha !== undefined) g.globalAlpha = alpha;
  g.translate(x, y); g.scale(scale, scale);
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.fillRect(-7, -0.5, 14, 1.5);
  g.fillRect(-5, -1, 10, 2.5);
  if (typeof seasonLook === 'function') look = seasonLook(look); // coats and scarves in winter (js/seasons.js)
  const spr = characterFrames(look)[frame % NFRAMES];
  g.translate(0, -SPR_FOOT / 2);
  if (facingLeft) g.scale(-1, 1);
  g.drawImage(spr, -SPR_W / 4, 0, SPR_W / 2, SPR_H / 2);
  g.restore();
}
// head-and-shoulders crop for toasts and cards
function portraitURL(look) {
  const spr = characterFrames(look)[0], P = bodyPlan(look);
  const c = mkCanvas(24, 24), g = c.getContext('2d');
  const top = P.head - (look.hat === 'top' ? 10 : 5);
  g.drawImage(spr, -8, -top);
  return c.toDataURL();
}

// ---------------------------------------------------------------- pixel lettering
// 3x5 capitals for signs, neon and stickers
const GLYPHS = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
  F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
  K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
  P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
  Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
  4: '101101111001001', 5: '111100110001110', 6: '011100111101111', 7: '111001010010010', 8: '111101111101111',
  9: '111101111001110', $: '011110010011110', '!': '010010010000010', '.': '000000000000010', '-': '000000111000000',
  '&': '010101010101011', "'": '010010000000000', ':': '000010000010000', '%': '101001010100101', ' ': '000000000000000'
};
function pixText(g, str, x, y, col, s = 1) {
  g.fillStyle = col;
  for (const ch of str.toUpperCase()) {
    const gl = GLYPHS[ch] || GLYPHS[' '];
    for (let i = 0; i < 15; i++) if (gl[i] === '1') g.fillRect(x + (i % 3) * s, y + Math.floor(i / 3) * s, s, s);
    x += 4 * s;
  }
}
function textWidth(str, s = 1) { return str.length * 4 * s - s; }
// 5x7 capitals for the neon signs, drawn as glowing tubes
const NEON = { P: '11110100011000111110100001000010000', A: '01110100011000111111100011000110001', W: '10001100011000110101101011010101010',
  N: '10001110011010110101100111000110001', O: '01110100011000110001100011000101110', E: '11111100001000011110100001000011111' };
function neonText(g, str, x, y, s, on, col, core) {
  for (const ch of str) {
    const gl = NEON[ch];
    for (let i = 0; i < 35; i++) if (gl[i] === '1') {
      const px = x + (i % 5) * s, py = y + Math.floor(i / 5) * s;
      rect(g, px, py, s, s, on ? col : '#4a2028');
      if (on && s > 2) rect(g, px + 1, py + 1, s - 2, s - 2, core);
    }
    x += 6 * s;
  }
}

// ---------------------------------------------------------------- the shop
// A modern seaside pawnshop, drawn at native resolution (640x360, twice the
// logical grid). Back layer has holes for the street outside; the counter is a
// separate front layer drawn over the keeper.
const NW = W * 2, NH = H * 2;
// Where stock is displayed, native px (top-left of a 12px icon). Every item in S.stock gets a
// spot (it.spot) the first time it is drawn and keeps it until it leaves the shop.
//   case   - the glass counter: jewelry, watches, compasses, knives
//   peg    - the pegboard: guitars on the two big hooks, knives on the small ones
//   window - the window sill, facing the street: art and silver
//   shelf  - the metal shelving behind the counter: anything
const DISPLAY_SPOTS = [
  ...[348, 370, 392, 414, 446, 468, 490, 512, 546, 568, 590, 612].map(x => ({ zone: 'case', x, y: 266 })),
  { zone: 'peg', big: true, x: 290, y: 72 }, { zone: 'peg', big: true, x: 318, y: 68 },
  ...[288, 308, 328].map(x => ({ zone: 'peg', x, y: 132 })),
  ...[104, 124, 144, 164, 184].map(x => ({ zone: 'window', x, y: 198 })),
  ...[116, 158].flatMap(y => [382, 400, 418, 488, 506, 524, 542, 560, 578].map(x => ({ zone: 'shelf', x, y })))
];
const ZONE_WHERE = { case: 'in the case', peg: 'on the wall', window: 'in the window', shelf: 'on the shelf' };
function displayPrefs(it) {
  if (it.icon === 'guitar') return ['peg-big', 'shelf', 'window'];
  if (it.cat === 'weapon') return ['peg', 'case', 'shelf'];
  if (it.cat === 'tools') return ['peg', 'shelf', 'window'];
  if (it.cat === 'jewelry' || it.key === 'watch' || it.key === 'compass') return ['case', 'shelf'];
  if (it.cat === 'art' || it.cat === 'silver') return ['window', 'shelf'];
  return ['shelf', 'window', 'case'];
}
function spotFits(sp, zone) { return zone === 'peg-big' ? sp.zone === 'peg' && sp.big : sp.zone === zone && !(sp.big && zone === 'peg'); }
// Give each item in stock a display spot, keeping the ones already placed. Returns nothing;
// items that don't fit anywhere stay in the back room (it.spot = -1).
function placeStock(stock) {
  const used = new Set();
  for (const it of stock) {
    if (it.backroom) { it.spot = -1; continue; } // hidden or waiting for the police (js/stolen.js)
    if (it.spot >= 0 && !used.has(it.spot) && (!DISPLAY_SPOTS[it.spot].big || it.icon === 'guitar')) used.add(it.spot);
    else it.spot = undefined;
  }
  for (const it of stock) {
    if (it.spot !== undefined) continue;
    it.spot = -1;
    for (const z of [...displayPrefs(it), 'shelf', 'window', 'case']) {
      const i = DISPLAY_SPOTS.findIndex((sp, k) => !used.has(k) && spotFits(sp, z));
      if (i >= 0) { it.spot = i; used.add(i); break; }
    }
  }
}
function spotWhere(it) { return it.spot >= 0 ? ZONE_WHERE[DISPLAY_SPOTS[it.spot].zone] : 'in the back'; }
const GUITAR_COLS = ['#b82a2a', '#c8883a', '#2a5aa0', '#1e1e22', '#e8e4dc', '#3a8a5a'];
// Draw stock in one layer: 'back' (shelves, pegboard, window) or 'front' (the glass case).
function drawDisplays(g, stock, layer, now, highlight) {
  placeStock(stock);
  for (const it of stock) {
    if (it.spot < 0) continue;
    const sp = DISPLAY_SPOTS[it.spot];
    if ((sp.zone === 'case') !== (layer === 'front')) continue;
    let bx = sp.x, by = sp.y, bw = 12, bh = 12;
    if (sp.big) { guitar(g, sp.x, sp.y, GUITAR_COLS[it.uid % GUITAR_COLS.length], it.uid % 3 !== 0); bx = sp.x; by = sp.y - 4; bw = 22; bh = 62; }
    else g.drawImage(iconCanvas(it.icon), sp.x, sp.y);
    // price tag, or a blue pawn ticket for surety
    if (!it.nosale) {
      const tx = sp.big ? sp.x + 15 : sp.x + 9, ty = sp.big ? sp.y + 40 : sp.y + 8;
      rect(g, tx, ty, 4, 3, it.held ? '#6aa8e0' : '#f0ead8'); rect(g, tx + 1, ty - 1, 1, 1, '#8a857c');
    }
    if (highlight === it.uid && Math.floor(now / 250) % 2) {
      g.strokeStyle = '#ffe070'; g.lineWidth = 1; g.strokeRect(bx - 2.5, by - 2.5, bw + 5, bh + 5);
    }
  }
}
const SHOP = {
  // logical coordinates for game.js
  counterItem: { x: 176, y: 119 },
  win: { x: 96, y: 84, w: 164, h: 120 },
  door: { x: 20, y: 162, w: 48, h: 82 },
  lamp: { x: 523, y: 218 }
};
const FLOOR_TOP = 244;

function buildShopBack() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(7);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);

  // ---- back wall: painted brick, sea-green, a bit tired
  r(0, 0, NW, FLOOR_TOP, '#61756d');
  for (let y = 22, row = 0; y < 196; y += 6, row++) {
    r(0, y + 5, NW, 1, '#566861');
    for (let x = (row % 2) * 9 - 9; x < NW; x += 18) {
      r(x, y, 1, 5, '#566861');
      if (R() < 0.18) r(x + 2, y + 1, 12, 3, R() < 0.5 ? '#677b73' : '#5b6e67');
    }
  }
  for (let i = 0; i < 900; i++) r(R() * NW, 22 + R() * 174, 1, 1, R() < 0.5 ? '#6b8078' : '#55675f');
  // flaking paint showing old red brick
  for (const [px, py, pw, ph] of [[300, 40, 26, 14], [598, 150, 20, 18], [80, 30, 18, 10]]) {
    for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
      const e = Math.min(x, y, pw - 1 - x, ph - 1 - y);
      if (e > 1 || R() < 0.45) r(px + x, py + y, 1, 1, ((y + py) % 6 === 5 || (x + px + ((Math.floor((y + py - 22) / 6) % 2) * 9)) % 18 === 0) ? '#5a3a30' : '#8a5444');
    }
  }
  // lower wall: dark panelling with a rail
  r(0, 196, NW, 48, '#33463f');
  for (let x = 0; x < NW; x += 16) r(x, 200, 1, 44, '#2b3c36');
  r(0, 194, NW, 3, '#7a6a52'); r(0, 194, NW, 1, '#9a876a');
  r(0, 241, NW, 3, '#1f2a26');

  // ---- drop ceiling with tiles
  r(0, 0, NW, 22, '#bdb8a6');
  for (let x = 0; x < NW; x += 40) r(x, 0, 1, 22, '#8e8a7c');
  r(0, 10, NW, 1, '#8e8a7c'); r(0, 21, NW, 1, '#6e6a60');
  r(204, 0, 40, 10, '#a8a492'); // a water-stained tile
  for (let i = 0; i < 40; i++) r(206 + R() * 36, 1 + R() * 8, 2, 1, '#9a8e70');
  // fluorescent fixtures (tubes are lit in drawShop)
  for (const fx of [140, 420]) { r(fx, 18, 84, 6, '#d8d6cc'); r(fx, 23, 84, 1, '#8e8a7c'); }

  // ---- floor: perspective checker linoleum
  const img = g.getImageData(0, FLOOR_TOP, NW, NH - FLOOR_TOP), d = img.data;
  const vy = 60, cxv = 330;
  for (let y = 0; y < NH - FLOOR_TOP; y++) {
    const sy = FLOOR_TOP + y, depth = 2600 / (sy - vy);
    for (let x = 0; x < NW; x++) {
      const u = (x - cxv) * depth / 30;
      const tile = (Math.floor(u / 16) + Math.floor(depth)) & 1;
      const n = (R() - 0.5) * 6;
      let col = tile ? [138, 130, 112] : [92, 86, 74];
      const fade = Math.min(1, y / 70); // darker toward the back wall
      col = col.map(v => v * (0.78 + 0.22 * fade) + n);
      const i = (y * NW + x) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, FLOOR_TOP);
  r(0, FLOOR_TOP, NW, 2, '#26302c');
  // scuffs and a worn path from the door to the counter
  for (let i = 0; i < 260; i++) { const x = 70 + R() * 280, y = 280 + R() * 40; r(x, y, 2 + R() * 3, 1, 'rgba(60,52,40,0.25)'); }
  // entry mat
  r(14, 256, 76, 22, '#2e2a2e'); r(16, 258, 72, 18, '#3a3438');
  for (let x = 18; x < 86; x += 3) r(x, 259, 1, 16, '#332e32');

  // ---- front door: glass in an aluminium frame (the glass is a hole)
  const D = SHOP.door;
  r(D.x - 6, D.y - 8, D.w + 12, D.h + 8, '#5d6468');
  r(D.x - 6, D.y - 8, D.w + 12, 2, '#9aa2a6');
  r(D.x - 2, D.y - 4, D.w + 4, D.h + 4, '#8c9498');
  g.clearRect(D.x, D.y, D.w, D.h);
  r(D.x - 10, FLOOR_TOP - 2, D.w + 20, 3, '#4a4e50');
  // sign above the door
  r(D.x - 4, D.y - 26, D.w + 8, 14, '#2a2a30'); pixText(g, 'EXIT', D.x + D.w / 2 - 7, D.y - 22, '#d84a3a');

  // ---- storefront window (hole), security grille, sill display
  const Wn = SHOP.win;
  r(Wn.x - 8, Wn.y - 8, Wn.w + 16, Wn.h + 16, '#4c5256');
  r(Wn.x - 6, Wn.y - 6, Wn.w + 12, Wn.h + 12, '#8c9498');
  g.clearRect(Wn.x, Wn.y, Wn.w, Wn.h);
  r(Wn.x + Wn.w / 2 - 1, Wn.y, 3, Wn.h, '#8c9498'); // mullion
  // sill and display shelf
  r(Wn.x - 10, Wn.y + Wn.h + 6, Wn.w + 20, 5, '#7a6a52'); r(Wn.x - 10, Wn.y + Wn.h + 6, Wn.w + 20, 1, '#a08a6a');
  // blinds rolled up at the top
  r(Wn.x - 4, Wn.y - 4, Wn.w + 8, 8, '#d8d2c0'); for (let y = 0; y < 8; y += 2) r(Wn.x - 4, Wn.y - 4 + y, Wn.w + 8, 1, '#b8b2a0');
  r(Wn.x + 30, Wn.y + 4, 1, 16, '#e8e4d8'); r(Wn.x + 29, Wn.y + 20, 3, 3, '#e8e4d8');

  // ---- right-hand wall section: pegboard with guitars and tools
  const pb = { x: 284, y: 64, w: 62, h: 122 };
  r(pb.x - 2, pb.y - 2, pb.w + 4, pb.h + 4, '#5a4632');
  r(pb.x, pb.y, pb.w, pb.h, '#b89a6a');
  for (let y = pb.y + 3; y < pb.y + pb.h; y += 6) for (let x = pb.x + 3; x < pb.x + pb.w; x += 6) r(x, y, 1, 1, '#8a7048');
  // the guitars on the two big hooks are stock, drawn live in drawDisplays; leave the hangers
  for (const s of DISPLAY_SPOTS.filter(d => d.zone === 'peg' && d.big)) { r(s.x + 9, s.y - 4, 4, 3, '#2a2a2a'); r(s.x + 10, s.y - 1, 2, 2, '#5a4632'); }
  // small hooks for knives and the like
  for (const s of DISPLAY_SPOTS.filter(d => d.zone === 'peg' && !d.big)) { r(s.x + 5, s.y - 3, 2, 3, '#7a7a80'); }
  // a cordless drill and a wrench hanging below
  r(pb.x + 8, pb.y + 92, 14, 6, '#e0a020'); r(pb.x + 8, pb.y + 92, 14, 1, '#f0c050'); r(pb.x + 20, pb.y + 98, 4, 10, '#2a2a2a'); r(pb.x + 4, pb.y + 94, 4, 2, '#7a7a80');
  r(pb.x + 36, pb.y + 90, 3, 24, '#9aa0a8'); r(pb.x + 34, pb.y + 88, 7, 4, '#9aa0a8'); r(pb.x + 37, pb.y + 89, 1, 2, '#b89a6a');
  r(pb.x + 46, pb.y + 92, 10, 10, '#3a6ab0'); r(pb.x + 48, pb.y + 94, 6, 6, '#c8ccd0'); r(pb.x + 50, pb.y + 96, 2, 2, '#3a3a3a');

  // a road bike leaning on the panelling
  bike(g, 280, 210);

  // ---- behind the counter
  // round wall clock (Aunt Odile hid something behind it)
  const ck = { x: 372, y: 56 };
  g.fillStyle = '#2a2a2e'; g.beginPath(); g.arc(ck.x, ck.y, 11, 0, 7); g.fill();
  g.fillStyle = '#ece8dc'; g.beginPath(); g.arc(ck.x, ck.y, 9, 0, 7); g.fill();
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; r(ck.x + Math.round(Math.cos(a) * 7), ck.y + Math.round(Math.sin(a) * 7), 1, 1, '#5a5a5e'); }
  // neon sign mount (tubes lit in drawShop)
  r(420, 28, 132, 44, '#1a1d22'); r(420, 28, 132, 1, '#3a3e44'); r(420, 71, 132, 1, '#0e1012'); r(428, 24, 2, 4, '#5a5e64'); r(542, 24, 2, 4, '#5a5e64');
  // security camera, top right
  r(606, 24, 12, 3, '#d8d8d8'); r(610, 27, 3, 4, '#a8a8a8'); r(598, 30, 18, 8, '#e8e8e4'); r(596, 32, 3, 4, '#2a2a2e'); r(598, 37, 18, 1, '#a8a8a8');
  // framed photo of Aunt Odile
  r(590, 62, 20, 24, '#c8a050'); r(592, 64, 16, 20, '#2c3a4a'); r(596, 67, 8, 8, '#e0b090'); r(595, 66, 10, 3, '#a8a8b0'); r(594, 75, 12, 9, '#3a5a8a');
  // cheap printed signs
  r(560, 56, 22, 28, '#f0ead8'); pixText(g, 'NO', 565, 59, '#c03030'); pixText(g, 'REF', 565, 66, '#c03030'); pixText(g, 'UNDS', 563, 73, '#c03030');
  r(390, 60, 30, 20, '#f0d040'); pixText(g, 'CASH', 397, 63, '#2a2a2a'); pixText(g, 'LOANS', 395, 71, '#2a2a2a');
  // wall shelving: white metal standards and two boards
  for (const sx of [374, 474, 600]) { r(sx, 92, 3, 104, '#c8ccd0'); for (let y = 94; y < 196; y += 4) r(sx + 1, y, 1, 1, '#7a7e84'); }
  for (const by of [128, 170]) {
    r(370, by, 236, 4, '#d8dce0'); r(370, by, 236, 1, '#f0f2f4'); r(370, by + 4, 236, 1, '#5a5e64');
  }
  // fixed clutter between the slots
  // top shelf: a flat TV and a stack of game cases
  r(436, 100, 40, 26, '#1a1a1e'); r(438, 102, 36, 20, '#2a3644'); r(440, 104, 12, 6, '#3a4a5a'); r(452, 126, 8, 2, '#1a1a1e');
  // bottom shelf: boxed electronics and a boombox. Every other spot holds live stock (DISPLAY_SPOTS).
  r(436, 150, 22, 20, '#d8c8a0'); r(436, 150, 22, 1, '#e8dcb8'); r(440, 156, 14, 6, '#5a7aa0');
  r(462, 156, 22, 14, '#3a3a3e'); r(464, 160, 6, 6, '#7a7a80'); r(476, 160, 6, 6, '#7a7a80'); r(470, 158, 4, 2, '#c8c8c8'); r(468, 153, 10, 3, '#5a5a5e');
  // door to the back room
  r(612, 92, 26, 152, '#3e4a46'); r(614, 94, 24, 148, '#4e5c56'); r(616, 170, 3, 2, '#c8c8c8');
  r(614, 120, 22, 14, '#f0ead8'); pixText(g, 'STAFF', 615, 125, '#2a2a2a');

  // guitar amp under the window, where the cat sleeps
  r(212, 214, 40, 30, '#1e1e20'); r(214, 216, 36, 18, '#2e2e32');
  for (let y = 217; y < 233; y += 2) r(215, y, 34, 1, '#26262a');
  r(214, 236, 36, 5, '#3a3a3e'); for (let i = 0; i < 5; i++) r(218 + i * 7, 238, 2, 2, '#c8c8c8');
  r(212, 214, 40, 1, '#4a4a4e');
  // a stack of car tires and a box by the door
  r(100, 226, 30, 18, '#202022'); r(100, 232, 30, 1, '#2e2e30'); r(100, 238, 30, 1, '#2e2e30'); r(104, 224, 22, 2, '#2a2a2c');
  r(136, 228, 26, 16, '#a8885a'); r(136, 228, 26, 1, '#c8a878'); r(148, 228, 2, 16, '#c8b08a');
  pixText(g, 'TV', 143, 234, '#5a4632');
  return c;
}

function guitar(g, x, y, col, electric) {
  const r = (a, b, w, h, c) => rect(g, a, b, w, h, c);
  r(x + 9, y - 4, 4, 3, '#2a2a2a'); // hanger
  r(x + 10, y, 2, 30, '#5a3a24'); r(x + 10, y, 1, 30, '#7a5034'); // neck
  r(x + 8, y - 2, 6, 4, '#3a2a1e');
  if (electric) {
    r(x + 3, y + 30, 16, 22, col); r(x + 1, y + 36, 20, 12, col); r(x + 5, y + 28, 4, 4, col);
    r(x + 17, y + 32, 3, 6, shade(col, -0.2)); r(x + 1, y + 44, 20, 4, shade(col, -0.2));
    r(x + 8, y + 34, 6, 2, '#e8e8e8'); r(x + 8, y + 40, 6, 2, '#e8e8e8'); r(x + 14, y + 44, 2, 2, '#c8c8c8');
  } else {
    r(x + 4, y + 30, 14, 10, col); r(x + 2, y + 40, 18, 16, col); r(x + 3, y + 54, 16, 2, shade(col, -0.25));
    r(x + 16, y + 30, 2, 26, shade(col, -0.2));
    g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(x + 11, y + 42, 3, 0, 7); g.fill();
    r(x + 7, y + 48, 8, 2, '#3a2a1e');
  }
  for (let i = 0; i < 3; i++) r(x + 10 + (i % 2), y + 2 + i * 9, 1, 1, '#e8e8e8');
}

function bike(g, x, y) {
  g.strokeStyle = '#1e1e22'; g.lineWidth = 2;
  for (const wx of [x + 8, x + 52]) { g.beginPath(); g.arc(wx, y + 22, 11, 0, 7); g.stroke(); }
  g.strokeStyle = '#8a8e94'; g.lineWidth = 1;
  for (const wx of [x + 8, x + 52]) { g.beginPath(); g.arc(wx, y + 22, 2, 0, 7); g.stroke(); }
  g.strokeStyle = '#2a7ab0'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(x + 8, y + 22); g.lineTo(x + 24, y + 6); g.lineTo(x + 46, y + 6); g.lineTo(x + 30, y + 22); g.closePath(); g.stroke();
  g.beginPath(); g.moveTo(x + 46, y + 6); g.lineTo(x + 52, y + 22); g.moveTo(x + 24, y + 6); g.lineTo(x + 30, y + 22); g.stroke();
  rect(g, x + 20, y + 1, 8, 2, '#1e1e22'); rect(g, x + 44, y, 2, 6, '#3a3a3e'); rect(g, x + 42, y, 8, 2, '#1e1e22');
}

function buildShopFront() {
  const c = mkCanvas(NW, NH), g = c.getContext('2d'), R = rng(11);
  const r = (x, y, w, h, col) => rect(g, x, y, w, h, col);
  // glass display counter
  const cx = 336, cy = 250, cw = 304, ch = 46;
  r(cx, cy + ch - 4, cw, 6, '#1a1c1e');                         // kick plate
  r(cx, cy, cw, ch - 4, '#6a7276');                              // frame
  r(cx + 4, cy + 6, cw - 8, ch - 14, '#1c1620');                 // velvet interior
  for (let x = cx + 4; x < cx + cw - 4; x += 2) r(x, cy + 6, 1, ch - 14, '#221a26');
  r(cx + 4, cy + 6, cw - 8, 1, '#f0ecd0'); r(cx + 4, cy + 7, cw - 8, 2, 'rgba(240,236,208,0.25)'); // light strip
  // velvet pads in the case; the jewelry and watches on them are live stock (drawDisplays)
  for (const sp of DISPLAY_SPOTS.filter(d => d.zone === 'case')) { r(sp.x - 2, sp.y + 10, 16, 3, '#3a2e40'); r(sp.x - 2, sp.y + 10, 16, 1, '#4a3c52'); }
  // glass reflections and frame posts
  for (const px of [cx, cx + 98, cx + 198, cx + cw - 4]) r(px, cy, 4, ch - 4, '#8c9498');
  r(cx, cy, cw, 3, '#b8e0e0'); r(cx, cy, cw, 1, '#e8fafa'); r(cx, cy + 3, cw, 1, '#5a6a6e'); // glass top edge
  // till / card terminal
  r(588, 226, 36, 24, '#2a2a2e'); r(590, 228, 32, 12, '#3a5a5a'); r(592, 230, 20, 2, '#8ad0c0'); r(592, 234, 12, 2, '#8ad0c0');
  r(590, 242, 32, 6, '#1a1a1e'); for (let i = 0; i < 6; i++) r(592 + i * 5, 243, 3, 2, '#5a5a62');
  r(574, 238, 8, 12, '#1e1e22'); r(575, 240, 6, 4, '#3a6a5a');
  // the old brass scale, the shop's namesake
  r(548, 226, 2, 22, '#c8a050'); r(538, 226, 22, 1, '#e2b04a'); r(546, 224, 6, 2, '#e2b04a');
  r(536, 236, 9, 2, '#c8a050'); r(553, 234, 9, 2, '#c8a050');
  r(539, 227, 1, 9, '#7a5a2a'); r(558, 227, 1, 7, '#7a5a2a');
  r(542, 247, 14, 3, '#9a7a3a');
  // desk lamp (its bulb glows in drawShopFront)
  r(512, 244, 18, 4, '#2a2a2e'); r(519, 226, 2, 18, '#3a3a40'); r(514, 218, 14, 7, '#2e6a4a'); r(514, 218, 14, 1, '#4a8a6a');
  // ledger and pen (the coffee mug beside them is drawn live by drawShopFront)
  r(400, 242, 26, 8, '#e8e0c8'); r(400, 248, 26, 2, '#7a2a2a'); r(412, 242, 1, 8, '#c8b890'); r(420, 240, 1, 8, '#2a2a6a');
  
  // foreground: a tired rubber plant in a pot (left) and boxes (right)
  r(4, 316, 26, 44, '#8a4a32'); r(0, 312, 34, 6, '#9a5a3a'); r(4, 324, 26, 2, '#6a3a26');
  for (let i = 0; i < 70; i++) {
    const a = R() * Math.PI, rr = 6 + R() * 26;
    const lx = 17 + Math.cos(a) * rr * 0.8, ly = 312 - Math.sin(a) * rr;
    r(lx, ly, 4, 2, R() < 0.5 ? '#2e5a3a' : '#3e7a4a'); r(lx, ly, 2, 1, '#5a9a6a');
  }
  r(596, 318, 44, 42, '#a8885a'); r(596, 318, 44, 2, '#c8a878'); r(616, 318, 3, 42, '#c8b08a');
  r(604, 300, 36, 18, '#b8986a'); r(604, 300, 36, 2, '#d8b888'); pixText(g, 'FRAGILE', 606, 307, '#a03028');
  return c;
}

let SHOP_BACK = null, SHOP_FRONT = null;
function ensureShopLayers() {
  if (!SHOP_BACK) { SHOP_BACK = buildShopBack(); SHOP_FRONT = buildShopFront(); }
}

// sky color by time of day 0..1 (morning -> night)
function skyColors(t) {
  const stops = [
    [0.0, '#9cc4e4', '#e4e8dc'],
    [0.45, '#86b6e0', '#eae6c8'],
    [0.75, '#c87a6a', '#f0b880'],
    [1.0, '#1e2444', '#3a3256']
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (t <= b[0]) {
      const k = (t - a[0]) / (b[0] - a[0]);
      return [lerpColor(a[1], b[1], k), lerpColor(a[2], b[2], k)];
    }
  }
  return [stops[3][1], stops[3][2]];
}

// the street outside, seen through the window and door (native px)
const STREET = (() => {
  const R = rng(3), houses = [];
  const cols = ['#e8e4dc', '#8a9aa8', '#9a3a32', '#3a4a66', '#d8c890', '#b8b4a8', '#6a7a6a']; // clapboard: white, gray, barn red, navy, mustard
  for (let x = 0; x < 290;) {
    const w = 24 + (R() * 22 | 0);
    if (x > 120 && x < 170) { x += 46; continue; } // a gap down to the harbor
    houses.push({ x, w, h: 50 + (R() * 30 | 0), col: cols[(R() * cols.length) | 0], roof: R() < 0.5, lit: Array.from({ length: 6 }, () => R() < 0.5) });
    x += w + 2;
  }
  return { houses };
})();

function drawOutside(g, t, now) {
  const [top, bot] = skyColors(t);
  for (let y = 56; y < 150; y++) rect(g, 0, y, 280, 1, lerpColor(top, bot, (y - 56) / 94));
  const night = t > 0.82, dusk = clamp((t - 0.55) / 0.35, 0, 1);
  // the harbor through the gap: sea and the old lighthouse on the point
  rect(g, 120, 132, 60, 16, lerpColor('#4a7a9a', '#1a2440', dusk));
  for (let i = 0; i < 8; i++) rect(g, 124 + ((i * 17 + now / 300) % 52), 136 + (i % 4) * 3, 4, 1, lerpColor('#8ab0c8', '#3a4a6a', dusk));
  rect(g, 154, 116, 4, 16, '#e8e4d8'); rect(g, 154, 120, 4, 3, '#c84a3a'); rect(g, 154, 126, 4, 3, '#c84a3a'); rect(g, 153, 112, 6, 4, '#2a2a34');
  if (night) rect(g, 155, 113, 2, 2, Math.sin(now / 600) > 0 ? '#7ab8f0' : '#3a5a80'); // that blue lamp again
  rect(g, 146, 130, 24, 3, lerpColor('#6a6a58', '#2a2a30', dusk));
  // buildings across the street
  for (const h of STREET.houses) {
    const y = 150 - h.h, col = lerpColor(h.col, '#2a2a3e', dusk * 0.8);
    rect(g, h.x, y, h.w, h.h, col);
    for (let sy = y + 2; sy < 150; sy += 3) rect(g, h.x, sy, h.w, 1, shade(col, -0.08)); // siding
    rect(g, h.x, y, 2, h.h, lerpColor('#f0ece4', '#3a3a4a', dusk)); rect(g, h.x + h.w - 2, y, 2, h.h, lerpColor('#f0ece4', '#3a3a4a', dusk)); // corner boards
    if (h.roof) { for (let i = 0; i < 6; i++) rect(g, h.x - 1 + i, y - 6 + i, h.w + 2 - i * 2, 1, lerpColor('#6a5a5a', '#1e1e2a', dusk)); }
    else rect(g, h.x - 1, y, h.w + 2, 2, lerpColor('#8a8a8a', '#2a2a34', dusk));
    for (let wy = y + 8, k = 0; wy < 140; wy += 16) for (let wx = h.x + 4; wx < h.x + h.w - 6; wx += 10, k++) {
      rect(g, wx, wy, 5, 7, night && h.lit[k % 6] ? '#f0d080' : lerpColor('#3a4a5a', '#1a1e2a', dusk));
    }
  }
  // street lamp
  rect(g, 196, 70, 2, 80, '#2a2e34'); rect(g, 190, 68, 12, 3, '#2a2e34'); rect(g, 191, 71, 6, 2, t > 0.7 ? '#fff0b0' : '#c8c8b8');
  // road, curb and pavement
  rect(g, 0, 150, 280, 26, '#3a3c42');
  for (let x = 4; x < 280; x += 28) rect(g, x, 162, 14, 2, '#d8c860');
  rect(g, 0, 176, 280, 3, '#8a8a86');
  rect(g, 0, 179, 280, 66, '#a8a49a');
  for (let x = 0; x < 280; x += 22) rect(g, x, 179, 1, 66, '#8e8a80');
  if (typeof seasonStreet === 'function') seasonStreet(g, t, now, dusk, night); // js/seasons.js
  // passing cars, both directions
  const carCols = ['#c84a3a', '#3a6ab0', '#e8e4dc', '#2a2a2e', '#e0b040'];
  for (let i = 0; i < 2; i++) {
    const period = 9000 + i * 5300, p = ((now + i * 4100) % period) / period;
    const x = i === 0 ? -60 + p * 420 : 340 - p * 420, y = i === 0 ? 162 : 152;
    if (x > -50 && x < 290) car(g, x, y, carCols[(Math.floor((now + i * 4100) / period) + i * 2) % carCols.length], i === 1, night);
  }
  // someone walking past now and then
  const wp = (now % 14000) / 14000, wx = 300 - wp * 340;
  if (wx > -10 && wx < 280) {
    const step = Math.floor(now / 180) % 2;
    rect(g, wx, 188, 6, 14, '#3a4a6a'); rect(g, wx + 1, 182, 4, 6, '#c89070'); rect(g, wx + 1, 181, 4, 2, '#2a1e16');
    rect(g, wx + step, 202, 2, 8, '#2a2a30'); rect(g, wx + 4 - step, 202, 2, 8, '#2a2a30');
  }
  // a gull
  const gx = ((now / 90) % 340) - 30;
  if (!night && gx > 0 && gx < 270) { rect(g, gx, 80, 3, 1, '#fff'); rect(g, gx + 3, 79, 2, 1, '#fff'); rect(g, gx - 2, 79, 2, 1, '#fff'); }
  if (typeof seasonStreetWeather === 'function') seasonStreetWeather(g, now);
}
function car(g, x, y, col, left, night) {
  const r = (a, b, w, h, c) => rect(g, a, b, w, h, c);
  r(x, y + 4, 46, 9, col); r(x + 8, y - 2, 26, 7, col); r(x + 10, y - 1, 10, 5, '#9ab8c8'); r(x + 22, y - 1, 10, 5, '#9ab8c8');
  r(x, y + 10, 46, 2, shade(col, -0.3));
  r(x + 6, y + 11, 8, 6, '#141416'); r(x + 32, y + 11, 8, 6, '#141416'); r(x + 9, y + 13, 2, 2, '#8a8a8a'); r(x + 35, y + 13, 2, 2, '#8a8a8a');
  r(left ? x : x + 44, y + 6, 2, 2, night ? '#fff6c0' : '#e8e4d0'); r(left ? x + 44 : x, y + 6, 2, 2, '#c03030');
}

function drawShop(g, st, now) {
  ensureShopLayers();
  const t = st.timeOfDay;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); // native pixels
  rect(g, 0, 0, NW, NH, '#000');
  drawOutside(g, t, now);
  const D = SHOP.door;
  if (st.doorOpen > 0) { rect(g, D.x, D.y, 6, D.h, '#8c9498'); rect(g, D.x + 6, D.y, 2, D.h, 'rgba(255,255,255,0.15)'); }
  else { // glass door with sticker and push bar
    rect(g, D.x, D.y, D.w, D.h, 'rgba(200,225,235,0.18)');
    for (let i = 0; i < 4; i++) rect(g, D.x + 8 + i * 9, D.y + 6 + i * 16, 1, 14, 'rgba(255,255,255,0.22)');
    rect(g, D.x + 11, D.y + 14, 26, 18, '#f0ead8'); pixText(g, 'OPEN', D.x + 17, D.y + 17, '#2a7a3a'); pixText(g, '9-6', D.x + 19, D.y + 24, '#2a2a2a');
    rect(g, D.x + 4, D.y + 42, D.w - 8, 3, '#c8ccd0');
  }
  // glass sheen and reversed window lettering
  const Wn = SHOP.win;
  rect(g, Wn.x, Wn.y, Wn.w, Wn.h, 'rgba(200,225,235,0.10)');
  for (let i = 0; i < 5; i++) rect(g, Wn.x + 12 + i * 30, Wn.y + 20 + (i % 2) * 30, 1, 40, 'rgba(255,255,255,0.18)');
  g.drawImage(SHOP_BACK, 0, 0);
  // security grille over the window
  for (let x = Wn.x + 6; x < Wn.x + Wn.w; x += 12) rect(g, x, Wn.y, 1, Wn.h, 'rgba(40,44,50,0.7)');
  rect(g, Wn.x, Wn.y + 60, Wn.w, 1, 'rgba(40,44,50,0.7)');
  // vinyl letters on the glass
  pixText(g, 'WE BUY GOLD', Wn.x + 14, Wn.y + Wn.h - 16, '#e8c040', 2);
  // OPEN neon in the window
  const onA = !(st.timeOfDay > 0.97) && (Math.sin(now / 2300) > -0.97);
  rect(g, Wn.x + 88, Wn.y + 12, 62, 22, '#14161a');
  neonText(g, 'OPEN', Wn.x + 92, Wn.y + 16, 2, onA, '#ff5a6a', '#ffc0c8');
  // fluorescent tubes, one flickers
  const flick = Math.sin(now / 97) + Math.sin(now / 41) > 1.85;
  rect(g, 142, 24, 80, 2, '#f4fbf4'); rect(g, 422, 24, 80, 2, flick ? '#9aa09a' : '#f4fbf4');
  // PAWN neon
  const buzz = secretOn('neonSteady') || Math.sin(now / 1800) > -0.985; // you can smack it steady for the day
  neonText(g, 'PAWN', 436, 36, 4, buzz, '#ff4a5a', '#ffc0c8');
  rect(g, 426, 32, 120, 2, '#3a8ae0'); rect(g, 426, 66, 120, 2, '#3a8ae0'); rect(g, 426, 32, 2, 36, '#3a8ae0'); rect(g, 544, 32, 2, 36, '#3a8ae0');
  // clock hands (real time, roughly)
  const ck = { x: 372, y: 56 }, tm = 9 + t * 9;
  const ha = (tm % 12) / 12 * Math.PI * 2 - Math.PI / 2, ma = (tm % 1) * Math.PI * 2 - Math.PI / 2;
  g.strokeStyle = '#1e1e22'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(ck.x + 0.5, ck.y + 0.5); g.lineTo(ck.x + 0.5 + Math.cos(ha) * 4, ck.y + 0.5 + Math.sin(ha) * 4); g.stroke();
  g.beginPath(); g.moveTo(ck.x + 0.5, ck.y + 0.5); g.lineTo(ck.x + 0.5 + Math.cos(ma) * 6, ck.y + 0.5 + Math.sin(ma) * 6); g.stroke();
  // camera LED
  if (typeof cameraLed === 'function' && cameraLed(now)) rect(g, 597, 33, 1, 1, '#ff3030'); // only when it's fixed and on (js/stolen.js)
  // door chime
  const swing = st.bell > 0 ? Math.round(Math.sin(now / 40) * 2) : 0;
  rect(g, D.x + D.w + 6, D.y - 4, 8, 2, '#2a2a2e'); rect(g, D.x + D.w + 9 + swing, D.y - 2, 2, 4, '#2a2a2e');
  rect(g, D.x + D.w + 7 + swing, D.y + 2, 6, 5, '#e2b04a'); rect(g, D.x + D.w + 8 + swing, D.y + 2, 2, 1, '#f6d77e');
  if (typeof seasonShop === 'function') seasonShop(g, st, now); // js/seasons.js: the radiator, frost, the bucket, Odile's calendar
  // stock on the shelves
  drawDisplays(g, st.stock, 'back', now, st.highlight);
  // the shop cat, the room's hotspots and its little animations (js/secrets.js)
  if (typeof drawSecretsBack === 'function') drawSecretsBack(g, st, now); else drawSleepingCat(g, now);
  g.restore();
}
// the shop cat, asleep on the amp (native px)
function drawSleepingCat(g, now) {
  rect(g, 220, 206, 20, 8, '#3a3436'); rect(g, 234, 202, 9, 8, '#3a3436'); rect(g, 222, 205, 14, 1, '#4a4446');
  rect(g, 234, 200, 2, 3, '#3a3436'); rect(g, 241, 200, 2, 3, '#3a3436');
  const blink = Math.sin(now / 1700) > 0.9;
  if (!blink) { rect(g, 237, 205, 1, 1, '#c8d050'); rect(g, 240, 205, 1, 1, '#c8d050'); }
  const breathe = Math.sin(now / 900) > 0 ? 1 : 0;
  rect(g, 222, 205 - breathe, 12, 1, '#3a3436');
  const tail = Math.sin(now / 400) > 0.6 ? -2 : 0;
  rect(g, 212, 210 + tail, 9, 2, '#3a3436'); rect(g, 210, 207 + tail, 3, 4, '#3a3436');
}
// hooks from js/secrets.js; each is false when that file isn't loaded
const secretOn = name => typeof window[name] === 'function' && window[name]();

// the coffee mug by the ledger (native px); js/secrets.js lifts it for a sip
function drawMug(g, x, y, empty) {
  rect(g, x, y, 7, 9, '#e8e4dc'); rect(g, x + 7, y + 2, 2, 4, '#e8e4dc'); rect(g, x + 7, y + 3, 1, 2, '#9a968e');
  rect(g, x + 1, y + 1, 5, 1, empty ? '#c8c4bc' : '#5a3a24'); rect(g, x, y + 8, 7, 1, '#b8b4ac');
}
function drawShopFront(g, st, now) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(SHOP_FRONT, 0, 0);
  if (!secretOn('mugInUse')) drawMug(g, 446, 240, secretOn('coffeeGone'));
  if (typeof seasonShopFront === 'function') seasonShopFront(g, st, now); // js/seasons.js: December's tree
  drawDisplays(g, st.stock, 'front', now, st.highlight);
  for (let i = 0; i < 6; i++) rect(g, 356 + i * 48, 258 + (i % 2) * 4, 1, 24 - (i % 2) * 6, 'rgba(255,255,255,0.18)'); // glass glints
  const L = SHOP.lamp;
  if (!secretOn('lampOff')) rect(g, L.x - 7, L.y + 7, 14, 1, '#fff6d0');
  // item under appraisal sits on the counter glass
  if (st.counterIcon) g.drawImage(iconCanvas(st.counterIcon), SHOP.counterItem.x * 2, SHOP.counterItem.y * 2);
  if (typeof drawSecretsFront === 'function') drawSecretsFront(g, st, now);
  g.restore();
}

function glow(g, x, y, r0, r1, rgb, a) {
  const rg = g.createRadialGradient(x, y, r0, x, y, r1);
  rg.addColorStop(0, `rgba(${rgb},${a})`); rg.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = rg; g.fillRect(x - r1, y - r1, r1 * 2, r1 * 2);
}

function drawShopLight(g, st, now) {
  const t = st.timeOfDay;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'lighter';
  // daylight through the window, across the floor
  const beam = t < 0.8 ? 0.06 * (1 - t) + 0.02 : 0;
  if (beam > 0) {
    g.fillStyle = `rgba(255,236,190,${beam})`;
    g.beginPath(); g.moveTo(96, 210); g.lineTo(260, 210); g.lineTo(390, 340); g.lineTo(150, 340); g.closePath(); g.fill();
  }
  // fluorescents, neon and the lamp
  glow(g, 182, 30, 4, 140, '220,240,230', 0.10);
  const flick = Math.sin(now / 97) + Math.sin(now / 41) > 1.85;
  glow(g, 462, 30, 4, 140, '220,240,230', flick ? 0.03 : 0.10);
  glow(g, 486, 50, 6, 100, '255,70,90', 0.10 + t * 0.12 + Math.sin(now / 60) * 0.005);
  if (!secretOn('openSignOff')) glow(g, SHOP.win.x + 120, SHOP.win.y + 24, 4, 50, '255,90,110', 0.08 + t * 0.1);
  if (!secretOn('lampOff')) glow(g, SHOP.lamp.x, SHOP.lamp.y + 10, 2, 60, '255,210,140', 0.10 + t * 0.14);
  g.restore();
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  // the Fog (week 3): slow pale banks drifting through
  if (st.fog) {
    for (let i = 0; i < 7; i++) {
      const x = ((now / (30 + i * 4) + i * 140) % 840) - 120, y = 120 + (i * 46) % 220;
      glow(g, x, y, 8, 120, '200,215,225', 0.22);
    }
    g.fillStyle = 'rgba(150,170,190,0.12)'; g.fillRect(0, 0, NW, NH);
  }
  // evening dimming
  if (t > 0.6) { g.fillStyle = `rgba(20,14,40,${(t - 0.6) * 0.45})`; g.fillRect(0, 0, NW, NH); }
  // dust motes in the beam
  if (t < 0.8) {
    for (let i = 0; i < 18; i++) {
      const p = ((now / 9000 + i * 0.137) % 1);
      const x = 150 + i * 9 + Math.sin(now / 1500 + i) * 10 + p * 80, y = 210 + p * 120;
      rect(g, x, y, 1, 1, 'rgba(255,240,200,0.5)');
    }
  }
  g.restore();
  vignette(g, 0.4);
}

function vignette(g, a) {
  const rg = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 200);
  rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = rg; g.fillRect(0, 0, W, H);
}

// ------------------------------------------------------------ story scenes
const BG_CACHE = {};
function cachedBg(name, fn) { if (!BG_CACHE[name]) BG_CACHE[name] = fn(); return BG_CACHE[name]; }
// Every scene but the shop is a place (js/places.js, js/places/*.js): a cached backdrop (build), its
// motion each frame (animate) and a light pass (light), then the vignette.
function drawScene(g, st, now) {
  const bg = st.bg;
  if (bg === 'shop' || bg === 'shopNight') {
    drawShop(g, st, now);
    return;
  }
  const place = PLACES[bg];
  if (!place) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); // native pixels
  g.drawImage(typeof seasonBg === 'function' ? seasonBg(bg, () => place.build()) : cachedBg(bg, () => place.build()), 0, 0); // js/seasons.js
  place.animate(g, now);
  if (typeof seasonWeather === 'function') seasonWeather(g, bg, now);
  g.restore();
}
function drawSceneLight(g, st, now) {
  if (st.bg === 'shop') { drawShopLight(g, st, now); return; }
  if (st.bg === 'shopNight') {
    g.fillStyle = 'rgba(10,10,30,0.58)'; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter';
    const fl = 0.35 + Math.sin(now / 90) * 0.03;
    const rg = g.createRadialGradient(st.candleX || 200, 96, 2, st.candleX || 200, 96, 80);
    rg.addColorStop(0, `rgba(255,180,90,${fl})`); rg.addColorStop(1, 'rgba(255,180,90,0)');
    g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
    if (st.fog) { g.fillStyle = 'rgba(150,175,200,0.16)'; g.fillRect(0, 0, W, H); }
    vignette(g, 0.6);
    return;
  }
  const place = PLACES[st.bg];
  if (!place) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  place.light(g, now);
  if (place.wash) { g.globalCompositeOperation = 'source-over'; g.fillStyle = place.wash; g.fillRect(0, 0, NW, NH); }
  g.restore();
  vignette(g, place.vignette);
}

// ---------------------------------------------------------------- the art page (docs/ART_REVIEW.md)
// The story editor's art page (editor/art.html) runs the game in a hidden frame and asks it for
// every piece of art and how to draw each one, so it always shows the art as the game draws it.
function artEditorInfo() {
  const places = ['shop', 'shopNight', ...Object.keys(PLACES).filter(id => id !== 'shop' && id !== 'shopNight')];
  return {
    places: places.map(id => ({ id, scale: figureScale(id), outdoor: typeof seasonOutdoor === 'function' && seasonOutdoor(id),
      file: id.startsWith('shop') ? 'js/art.js' : (typeof PLACE_FILES !== 'undefined' && PLACE_FILES[id]) || null })),
    cast: Object.fromEntries(Object.entries(CAST).map(([id, c]) => [id, { name: c.name, look: c.look }])),
    icons: Object.keys(ICONS),
    items: Object.entries(ITEMS).map(([id, it]) => ({ id, name: it.name, icon: it.icon })),
    uniques: Object.entries(UNIQUES).map(([id, u]) => ({ id, name: u.name, icon: u.icon || 'curio', quest: u.quest || null }))
  };
}
// in another month (1 October ... 6 March) for the length of fn: the season pass reads S.month
function artInMonth(month, fn) {
  const was = S;
  if (!S) S = newState();
  const m = S.month;
  S.month = month || 1;
  try { return fn(); } finally { S.month = m; S = was; }
}
// one frame of a place on a 640x360 canvas, light and all; with a look, that person stands in the
// middle of the floor at the place's scale, to judge the size of the cast against the room
function drawArtPlace(canvas, id, now, month, look) {
  artInMonth(month, () => {
    const g = canvas.getContext('2d');
    g.setTransform(2, 0, 0, 2, 0, 0);
    const st = { bg: id, timeOfDay: 0.3, doorOpen: 0, bell: 0, stock: [], counterIcon: null, highlight: null, actors: [], candleX: 200 };
    drawScene(g, st, now);
    if (look && !id.startsWith('shop')) drawCharacter(g, look, 160, 160, Math.floor(now / 600) % 2, false, undefined, figureScale(id));
    if (id.startsWith('shop')) drawShopFront(g, st, now); // the counter, in front of the cast
    drawSceneLight(g, st, now);
    g.setTransform(1, 0, 0, 1, 0, 0);
  });
}
// one frame of a character (0-1 breathing, 2-5 walking, 6 talking), as the month dresses them
function artCharacterFrame(look, frame, month) {
  return artInMonth(month, () => characterFrames(typeof seasonLook === 'function' ? seasonLook(look) : look)[frame || 0]);
}
