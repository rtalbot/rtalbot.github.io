// Pawn Champ - the shop's hidden layer: things in the room you can click, daily habits that pay off
// if you keep them up (pet the cat every day), and secrets that take a few runs to find.
// Design: docs/quests/SECRETS.md. Loaded after js/runs.js; uses game.js globals (S, view, queue,
// HOOKS, toast, say, enterActor, leaveShop, change, dayNum) and the Storybook (loadBook/saveBook).
//
// Everything a run remembers lives in S.habits; secrets found are kept across runs in the Storybook.
// Quests read the cat through catName(), catGuards() and catNoticed(), and can add overheard lines
// with addOverheard().
'use strict';

// ================================================================ state
const CAT_NAME = 'Mister Fathom';
const PET_SCRATCH = 5;           // pets in one day before he scratches you
const RAIN_CHANCE = 0.2;         // the window shows rain about one day in five
const RARE_FIND_CHANCE = 1 / 15; // rummaging the boxes
const DUSK = 0.6;                // view.timeOfDay from which the blue light shows
const NOON = [0.35, 0.55];
const IDLE_NAP_MS = 120000;
// the pegboard is five notes, left to right (MIDI)
const PEG_NOTES = [60, 62, 64, 67, 69];
const ADA_TUNE = [2, 1, 0, 1, 3];   // Pell's music box
const FOG_RIFF = [3, 4, 3, 2, 0];   // the Breakwaters' "Odile in the Fog" (M12)

function newHabits() {
  return {
    cat: { streak: 0, last: 0, day: 0, count: 0, days: 0, best: 0, named: false, gift: 0, giftDay: 0, tellDay: 0, scratchDay: 0, hat: false },
    plant: { streak: 0, last: 0, best: 0, day: 0, count: 0, overs: 0, wilted: false, cutting: false, wiltNote: false },
    neon: { streak: 0, last: 0, discount: false },
    open: { streak: 0, last: 0, day: 0, on: false, bonusWeek: 0 },
    till: { day: 0, count: 0, weeks: [] },
    coffee: { day: 0, count: 0 },
    clock: { day: 0, count: 0, slow: 0 },
    scale: { day: 0 },
    boxes: { day: 0 },
    tile: { day: 0, count: 0, found: false, dripNote: false },
    blue: { days: [], told: false },
    wave: { streak: 0, last: 0, came: false, noted: 0 },
    lamp: { offDay: 0, ghosts: false },
    rain: {}, notes: [], hints: {}, served: 0, ada: false, adaTold: false, nap: false, feather: false
  };
}
function habits() {
  if (!S.habits) S.habits = newHabits();
  const d = newHabits();
  for (const k of Object.keys(d)) if (S.habits[k] === undefined) S.habits[k] = d[k]; // older saves
  return S.habits;
}
// a counter that only counts today
function today(o) { const d = dayNum(); if (o.day !== d) { o.day = d; o.count = 0; } return o; }
// a daily streak: true the first time it's kept today. Missing a day starts it again from 1.
function keepStreak(o) {
  const d = dayNum();
  if (o.last === d) return false;
  o.streak = o.last === d - 1 ? o.streak + 1 : 1;
  o.last = d;
  return true;
}
function isRainy() {
  const h = habits(), d = dayNum();
  if (h.rain[d] === undefined) h.rain[d] = d > 1 && Math.random() < RAIN_CHANCE;
  return h.rain[d];
}
const inShop = () => view.bg === 'shop' || view.bg === 'shopNight';
const atDusk = () => view.bg === 'shopNight' || view.timeOfDay >= DUSK;

// ---------------------------------------------------------------- for quests
function catName(cap) { return S && S.habits && S.habits.cat.named ? CAT_NAME : cap ? 'The cat' : 'the cat'; }
// 15 days in a row: he sits on contracts, keeps ghosts back, growls at the Psalter (SECRETS.md)
function catGuards() { return !!(S && S.habits && S.habits.cat.best >= 15); }
// the cat watches customers from the counter once he's been petted 3 days running
function catAtCounter() { return !!(S && S.habits && S.habits.cat.best >= 3) && !(typeof hasCard === 'function' && hasCard('callingCard')); } // Quillon's card keeps him off it
function clockSlowToday() { return !!(S && S.habits && S.habits.clock.slow === dayNum()); }
const OVERHEARD = [];
// A line a queueing customer can be overheard saying (click them). Called inside a quest file, the
// line only plays in runs that drew that quest. `when` is optional.
function addOverheard(line, when) { OVERHEARD.push({ line, when, quest: typeof questScope !== 'undefined' ? questScope : null, used: false }); }

// ================================================================ the Storybook's Secrets page
const SECRETS = [
  { id: 'fathom', name: 'His name', hint: 'Mind the cat, and someone will tell you what to call him.' },
  { id: 'faithful', name: 'Every single day', hint: 'A month of minding him.' },
  { id: 'opinion', name: 'The cat\'s opinion', hint: 'Introduce the cat to the Hand.' },
  { id: 'nap', name: 'The long nap', hint: 'Let him have the shop to himself for a while.' },
  { id: 'hat', name: 'The cat\'s hat', hint: 'A word typed where every month begins.' },
  { id: 'bloom', name: 'A white flower', hint: 'Somebody has to water it.' },
  { id: 'tin', name: 'Odile\'s tin box', hint: 'Something above the leak.' },
  { id: 'blue', name: 'The blue light', hint: 'Somebody is signalling across the harbor.' },
  { id: 'ada', name: 'Ada\'s tune', hint: 'Five notes from a music box.' },
  { id: 'riff', name: 'Odile in the Fog', hint: 'A riff from an old cassette.' },
  { id: 'midnight', name: 'The scale at midnight', hint: 'Weigh nothing, after dark.' },
  { id: 'headache', name: 'Merrit\'s headache', hint: 'Ring for service.' },
  { id: 'fogclock', name: 'The fog in the clock', hint: 'Noon, in Fog Week.' },
  { id: 'ghosts', name: 'Lights out', hint: 'Who browses when the lamp is off?' },
  { id: 'boxset', name: 'A full set of finds', hint: 'Four small things, the exact ones.' },
  { id: 'regular', name: 'The window regular', hint: 'Wave back.' }
];
function secretFound(id) {
  const book = loadBook();
  book.secrets = book.secrets || {};
  if (book.secrets[id]) return;
  book.secrets[id] = true;
  saveBook(book);
  const s = SECRETS.find(x => x.id === id);
  if (s) setTimeout(() => toast(`Secret for the Storybook: ${s.name}`, null, 'tin'), 1200);
}
function secretsBookHTML(book) {
  const found = book.secrets || {};
  const n = SECRETS.filter(s => found[s.id]).length;
  return `<h3>Secrets <span class="muted">${n} of ${SECRETS.length}</span></h3><div class="book-list">${SECRETS.map(s => found[s.id]
    ? `<div class="book-quest"><b>${esc(s.name)}</b></div>`
    : `<div class="book-quest unmet"><b>???</b><p class="muted">${esc(s.hint)}</p></div>`).join('')}</div>`;
}

// ================================================================ items the room gives you
Object.assign(ICONS, {
  coin: ['............', '....kkkk....', '...kyYYyk...', '..kyYyyoyk..', '..kYyooyok..', '..kyyoYyok..',
    '..kyyoyyok..', '..kyoyyook..', '...kyooyk...', '....kkkk....', '............', '............'],
  feather: ['..........k.', '.........kck', '........kcck', '.......kccPk', '......kccPk.', '.....kccPk..',
    '....kccPk...', '...kccPk....', '..kcPkk.....', '..kkk.......', '.k..........', 'k...........'],
  key: ['............', '..kkkk......', '.kyYYyk.....', '.kyk.kyk....', '.kyk.kyk....', '..kyyyk.....',
    '...kyk......', '...kyk......', '...kyykk....', '...kyk......', '...kyyk.....', '....kk......'],
  pick: ['............', '..kkkkkkk...', '.kRRRRRRrk..', '.kRRRRRrrk..', '.kRRRRrrrk..', '..kRRrrrk...',
    '..kRrrrrk...', '...krrrk....', '...krrk.....', '....kk......', '............', '............'],
  button: ['............', '...kkkkk....', '..kbBBBbk...', '.kbBbbbBbk..', '.kBbkbkbBk..', '.kBbbbbbBk..',
    '.kBbkbkbBk..', '.kbBbbbBbk..', '..kbBBBbk...', '...kkkkk....', '............', '............'],
  token: ['............', '...kkkkkk...', '..ksSSSSsk..', '.ksSkkkkSsk.', '.kSk.kk.kSk.', '.kSkkkkkkSk.',
    '.kSk.kk.kSk.', '.ksSkkkkSsk.', '..ksSSSSsk..', '...kkkkkk...', '............', '............'],
  cap: ['............', '..k.k.k.k...', '.krkrkrkrk..', '.krRRRRRrk..', 'krRcccccRrk.', 'krRcrrrcRrk.',
    'krRcccccRrk.', '.krRRRRRrk..', '.krkrkrkrk..', '..k.k.k.k...', '............', '............'],
  tin: ['............', '.kkkkkkkkkk.', 'kdssssssssdk', 'kkkkkkkkkkkk', 'kbBBBBBBBBbk', 'kbByyyyyyBbk',
    'kbBy.kk.yBbk', 'kbByyyyyyBbk', 'kbBBBBBBBBbk', 'kbbbbbbbbbbk', '.kkkkkkkkkk.', '............'],
  marbles: ['............', '.....kk.....', '....kPPk....', '...kPkkPk...', '..kPPPPPPk..', '.kPPPPPPPPk.',
    '.kPkBkGkPPk.', '.kPkkRkkPPk.', '.kPPkkkPPPk.', '..kPPPPPPk..', '...kkkkkk...', '............']
});
// a small thing with its own name (not one of the staple types)
function oddItem(o) {
  return { uid: S.uid++, key: 'curio', name: o.name, icon: o.icon, cat: o.cat || 'curio', cond: 1, condLabel: o.condLabel || 'Used', guide: o.guide || 0,
    fake: false, stolen: false, noticeId: null, mark: null, filed: false, paid: 0, inspected: true, knownFake: false, knownHot: false,
    clues: o.clue ? [{ text: o.clue }] : [], held: null, nosale: !!o.nosale, secret: o.secret || null };
}
function giveItem(it, quiet) {
  if (!shelfFree()) { if (!quiet) toast(`No room on the shelves for the ${it.name.toLowerCase()}. You put it back.`, null, it.icon); return false; }
  S.stock.push(it); renderPanel();
  return true;
}
const BOX_FINDS = [
  { secret: 'pick', name: 'Guitar pick', icon: 'pick', guide: 1, clue: 'Tortoiseshell-pattern celluloid, chewed at one corner.' },
  { secret: 'button', name: 'Brass-rimmed button', icon: 'button', guide: 1, clue: 'Off a navy peacoat. Four holes.' },
  { secret: 'token', name: 'Bus token', icon: 'token', guide: 1, clue: 'HOLLOW NECK TRANSIT, GOOD FOR ONE FARE. The buses stopped taking these in 1994.' },
  { secret: 'cap', name: 'Bottle cap', icon: 'cap', guide: 1, clue: 'From a root beer bottled in Gloucester. The cork liner is still in it.' }
];
const RARE_BOX = [ // from docs/quests/ITEMS.md, rare finds: the cheap ones that fit in a box
  { name: 'Polaroid of the whole town', icon: 'letter', cat: 'art', guide: 15, clue: 'Taken in 1983 from the water tower. You can see this shop, with the sign lit.' },
  { name: 'Marbles in a velvet bag', icon: 'marbles', guide: 30, clue: 'One is a sulphide with a tiny lamb inside.' },
  { name: 'Union pin from the cannery strike', icon: 'brooch', guide: 35, clue: '1934. Enamel, a fish and a fist.' },
  { name: 'Gold tooth in a matchbox', icon: 'ring', cat: 'jewelry', guide: 45, clue: 'The matchbox says DON\'T ASK in Odile\'s handwriting.' }
];

// ================================================================ the hotspots
// Native-pixel rectangles (the canvas is 640x360). Some move or only exist at certain times.
function catSpot() { return catAtCounter() ? { x: 332, y: 224, w: 20, h: 28 } : { x: 206, y: 196, w: 40, h: 20 }; }
const HOTSPOTS = [
  { id: 'cat', rect: catSpot, click: petCat },
  { id: 'scale', rect: () => ({ x: 532, y: 220, w: 32, h: 30 }), click: clickScale },
  { id: 'clock', rect: () => ({ x: 360, y: 44, w: 24, h: 24 }), click: clickClock },
  { id: 'neon', rect: () => ({ x: 420, y: 28, w: 132, h: 44 }), click: clickNeon },
  { id: 'open', rect: () => ({ x: 182, y: 94, w: 66, h: 26 }), click: clickOpen },
  { id: 'plant', rect: () => ({ x: 0, y: 278, w: 36, h: 82 }), click: waterPlant },
  { id: 'tile', rect: () => ({ x: 204, y: 0, w: 40, h: 10 }), click: clickTile },
  { id: 'peg', rect: () => ({ x: 284, y: 64, w: 62, h: 122 }), click: (nx) => strum(nx) },
  { id: 'lamp', rect: () => ({ x: 510, y: 214, w: 22, h: 36 }), click: clickLamp },
  { id: 'coffee', rect: () => (view.bg === 'shop' ? { x: 442, y: 236, w: 16, h: 16 } : null), click: sipCoffee },
  { id: 'boxes', rect: () => ({ x: 596, y: 298, w: 44, h: 62 }), click: rummage },
  { id: 'blue', rect: () => (atDusk() ? { x: 144, y: 104, w: 24, h: 18 } : null), click: clickBlue },
  { id: 'walker', rect: walkerSpot, click: wave },
  { id: 'till', rect: () => ({ x: 572, y: 224, w: 54, h: 26 }), click: dingTill }
];
// the passer-by drawn by drawOutside in js/art.js, while they're behind the glass
function walkerX(now) { return 300 - ((now % 14000) / 14000) * 340; }
function walkerSpot() {
  if (view.bg !== 'shop') return null;
  const x = walkerX(performance.now());
  const behindGlass = (x > SHOP.win.x && x < SHOP.win.x + SHOP.win.w - 6) || (x > SHOP.door.x && x < SHOP.door.x + SHOP.door.w - 6);
  return behindGlass ? { x: x - 4, y: 178, w: 14, h: 34 } : null;
}
// people waiting in the queue (not the one at the counter): logical coordinates, feet at a.y
function queuedAt(nx, ny) {
  if (typeof queue === 'undefined' || view.bg !== 'shop') return null;
  const lx = nx / 2, ly = ny / 2;
  for (const c of [...queue, ...(typeof browsers !== 'undefined' ? browsers : [])]) { // the line, and shoppers browsing (js/day.js)
    const a = c.actor;
    if (!a || a.hidden || a.walking) continue;
    if (lx > a.x - 8 && lx < a.x + 8 && ly > a.y - 38 && ly < a.y) return c;
  }
  return null;
}
// the clickables in the room you're in: the shop's, or another scene's (js/scenespots.js)
function roomSpots() { return inShop() ? HOTSPOTS : typeof sceneSpots === 'function' ? sceneSpots() : []; }
function hotspotAt(nx, ny) {
  for (const h of roomSpots()) {
    const r = h.rect();
    if (r && nx >= r.x && nx < r.x + r.w && ny >= r.y && ny < r.y + r.h) return h;
  }
  const c = inShop() && queuedAt(nx, ny);
  return c ? { id: 'queue', click: () => eavesdrop(c) } : null;
}
function canClickRoom() {
  if (!S || S.over || paused || modalOpen) return false;
  if (!inShop() && !(typeof SCENE_SPOTS !== 'undefined' && SCENE_SPOTS[view.bg])) return false;
  if (!$('#title').classList.contains('hidden')) return false;
  return $('#choices').classList.contains('hidden');
}
function toNative(e) {
  const r = canvas.getBoundingClientRect();
  return [(e.clientX - r.left) / r.width * 640, (e.clientY - r.top) / r.height * 360];
}
let lastInput = performance.now();
// Capture phase on the document, so a click on a hotspot never reaches game.js's "advance" handler.
document.addEventListener('click', e => {
  lastInput = performance.now();
  if (e.target !== canvas || !canClickRoom()) return;
  const h = hotspotAt(...toNative(e));
  if (!h) return;
  e.stopPropagation();
  h.click(...toNative(e));
}, true);
canvas.addEventListener('mousemove', e => {
  lastInput = performance.now();
  canvas.style.cursor = canClickRoom() && hotspotAt(...toNative(e)) ? 'pointer' : '';
});
document.addEventListener('keydown', () => { lastInput = performance.now(); }, true);

// ================================================================ little animations
const FX = [];
function fx(type, x, y, dur = 900, o = {}) { FX.push({ type, x, y, t0: performance.now(), dur, ...o }); }
function fxAge(f, now) { return (now - f.t0) / f.dur; }
function heart(g, x, y, a) {
  g.save(); g.globalAlpha = a;
  for (const [dx, dy, w] of [[1, 0, 2], [5, 0, 2], [0, 1, 8], [0, 2, 8], [1, 3, 6], [2, 4, 4], [3, 5, 2]]) rect(g, x + dx, y + dy, w, 1, '#ff6a8a');
  g.restore();
}
function note(g, x, y, a) {
  g.save(); g.globalAlpha = a;
  rect(g, x, y + 4, 3, 2, '#f0ead8'); rect(g, x + 2, y, 1, 5, '#f0ead8'); rect(g, x + 3, y, 2, 1, '#f0ead8');
  g.restore();
}

// The cat: on the amp under the window, or (3 days of petting) sitting up at the end of the counter.
function drawCat(g, now, front) {
  const h = S && S.habits ? S.habits.cat : null;
  const counter = catAtCounter();
  if (counter !== front || napping) return;
  const stretch = FX.some(f => f.type === 'stretch' && fxAge(f, now) < 1);
  const col = '#3a3436', hi = '#4a4446', eye = '#c8d050';
  if (!counter) {
    if (stretch) { // up on all fours, back arched
      rect(g, 216, 202, 22, 8, col); rect(g, 218, 200, 16, 2, col); rect(g, 236, 198, 9, 8, col);
      rect(g, 236, 196, 2, 3, col); rect(g, 243, 196, 2, 3, col); rect(g, 239, 201, 1, 1, eye); rect(g, 242, 201, 1, 1, eye);
      for (const lx of [217, 221, 231, 235]) rect(g, lx, 210, 2, 4, col);
      rect(g, 210, 196, 2, 8, col); rect(g, 212, 202, 4, 2, col);
    } else drawSleepingCat(g, now);
    if (h && h.hat) { rect(g, 234, 198, 9, 3, '#c83a3a'); rect(g, 237, 196, 3, 2, '#e8e4dc'); }
  } else { // sitting up on the counter, watching the customer
    const x = 339, y = 250; // left of the item on the counter (SHOP.counterItem)
    rect(g, x, y - 14, 12, 14, col); rect(g, x + 1, y - 14, 10, 1, hi);
    rect(g, x - 1, y - 22, 9, 9, col); rect(g, x - 1, y - 24, 2, 3, col); rect(g, x + 6, y - 24, 2, 3, col);
    const blink = Math.sin(now / 2100) > 0.93;
    if (!blink) { rect(g, x, y - 19, 1, 1, eye); rect(g, x + 4, y - 19, 1, 1, eye); }
    const sway = Math.round(Math.sin(now / 500) * 2);
    rect(g, x - 4, y - 3, 4, 2, col); rect(g, x - 5, y - 2 + sway, 2, 6, col); // tail over the edge
    if (stretch) rect(g, x + 10, y - 10, 3, 2, col); // a paw out
    if (h && h.hat) { rect(g, x - 1, y - 25, 9, 3, '#c83a3a'); rect(g, x + 2, y - 27, 3, 2, '#e8e4dc'); }
  }
}

// back layer: called at the end of drawShop (native pixels)
function drawSecretsBack(g, st, now) {
  habits();
  // rain on the glass, and the drip from the stained ceiling tile
  if (st.bg === 'shop' && isRainy()) {
    for (const r of [SHOP.win, SHOP.door]) {
      for (let i = 0; i < 26; i++) {
        const x = r.x + ((i * 37) % r.w), y = r.y + ((now / 3 + i * 53) % r.h);
        rect(g, x, y, 1, 5, 'rgba(190,210,230,0.35)');
      }
    }
    const p = (now % 1600) / 1600;
    if (p < 0.7) rect(g, 224, 10 + p / 0.7 * 232, 1, 2, '#9ab8d0');
    else rect(g, 221, 242, 7, 1, 'rgba(154,184,208,0.6)');
  }
  // the blue light across the harbor shows from dusk
  if (st.bg === 'shop' && st.timeOfDay >= DUSK && st.timeOfDay <= 0.82) rect(g, 155, 113, 2, 2, Math.sin(now / 600) > 0 ? '#7ab8f0' : '#3a5a80');
  // the OPEN sign is dark until you switch it on
  if (st.bg === 'shop' && openSignOff()) {
    rect(g, SHOP.win.x + 89, SHOP.win.y + 13, 60, 20, '#14161a');
    neonText(g, 'OPEN', SHOP.win.x + 92, SHOP.win.y + 16, 2, false, '#ff5a6a', '#ffc0c8');
  }
  drawCat(g, now, false);
  for (const f of FX) {
    const a = fxAge(f, now);
    if (a > 1) continue;
    if (f.type === 'heart') heart(g, f.x, f.y - a * 24, 1 - a);
    else if (f.type === 'note') note(g, f.x + Math.sin(a * 6) * 3, f.y - a * 30, 1 - a);
    else if (f.type === 'ding') { g.save(); g.globalAlpha = 1 - a; pixText(g, 'DING', f.x, f.y - a * 12, '#f6d77e'); g.restore(); }
    else if (f.type === 'tick') { g.save(); g.globalAlpha = 1 - a; pixText(g, 'TICK', f.x, f.y - a * 8, '#ece8dc'); g.restore(); }
    else if (f.type === 'drop') rect(g, f.x + (f.i || 0), f.y + a * 30, 1, 2, '#9ab8d0');
    else if (f.type === 'dust') rect(g, f.x + Math.sin(a * 9 + f.y) * 6, f.y - a * 14, 2, 2, `rgba(200,180,140,${1 - a})`);
    else if (f.type === 'zap') { g.save(); g.globalAlpha = 1 - a; g.strokeStyle = '#ffe070'; g.strokeRect(f.x + 0.5, f.y + 0.5, 132, 44); g.restore(); }
  }
}
// front layer: called at the end of drawShopFront (native pixels)
function drawSecretsFront(g, st, now) {
  if (!S) return;
  const h = habits(), p = h.plant;
  // the rubber plant: perked up, wilted, in flower
  if (p.wilted) for (const [x, y] of [[6, 300], [22, 298], [12, 292], [26, 306]]) rect(g, x, y, 4, 2, '#7a6a3a');
  else if (p.streak >= 5 || p.best >= 5) for (const [x, y] of [[10, 284], [20, 282], [15, 278], [26, 288], [6, 290]]) { rect(g, x, y, 4, 2, '#4e9a5a'); rect(g, x, y, 2, 1, '#7aca8a'); }
  if (!p.wilted && p.best >= 10) { rect(g, 15, 276, 3, 3, '#f8f4ec'); rect(g, 16, 277, 1, 1, '#f0d050'); }
  if (!p.wilted && p.best >= 15) { rect(g, 25, 284, 3, 3, '#f8f4ec'); rect(g, 26, 285, 1, 1, '#f0d050'); }
  drawCat(g, now, true);
  if (napping) drawNap(g, now);
  const sip = st.bg === 'shop' && sipping(now), m = sip && mugInHand(sip, now);
  if (keeper) keeper.pose = m && m.up === 1 ? 6 : undefined; // head tipped back for the sip
  if (m) {
    drawMug(g, m.x, m.y, sip.empty);
    if (!sip.empty && m.up < 1 && m.a < 0.5) for (let i = 0; i < 2; i++) rect(g, m.x + 2 + i * 3 + Math.round(Math.sin(now / 120 + i) ), m.y - 3 - i * 2, 1, 2, 'rgba(240,236,220,0.5)');
  }
  for (const f of FX) {
    const a = fxAge(f, now);
    if (a > 1) continue;
    if (f.type === 'fheart') heart(g, f.x, f.y - a * 24, 1 - a);
    else if (f.type === 'wobble') {
      const s = Math.round(Math.sin(a * 20) * 3 * (1 - a));
      rect(g, 536, 236 + s, 9, 2, '#e2b04a'); rect(g, 553, 234 - s, 9, 2, '#e2b04a');
    } else if (f.type === 'sink') rect(g, 536, 246, 9, 2, '#e2b04a');
    else if (f.type === 'water') rect(g, f.x + a * 10, f.y + a * a * 40, 1, 2, '#9ad0f0');
    else if (f.type === 'hiss') { g.save(); g.globalAlpha = 1 - a; pixText(g, 'HSS', f.x, f.y - a * 8, '#e85a5a'); g.restore(); }
  }
  while (FX.length && fxAge(FX[0], now) > 1.5) FX.shift();
}

// ================================================================ the cat
function petCat() {
  const h = habits(), c = today(h.cat);
  const sp = catSpot();
  fx('stretch', 0, 0, 700);
  fx(catAtCounter() ? 'fheart' : 'heart', sp.x + sp.w / 2 - 4, sp.y - 2);
  c.count++;
  for (let i = 0; i < 3; i++) Sound.tone(48 + i * 3, 0.18, 'sawtooth', 0.012, i * 0.16); // purr
  // the Gilded Hand's man, in the shop
  if (view.actors.some(a => a.name === CAST.merrit.name && !a.hidden)) {
    fx('hiss', sp.x, sp.y);
    toast('Merrit Gaunt steps back from the cat. "Odile\'s cat. It never liked me either."', CAST.merrit.look);
    secretFound('opinion');
  }
  if (c.count > PET_SCRATCH) {
    if (h.cat.scratchDay !== dayNum()) {
      h.cat.scratchDay = dayNum();
      S.loupe = Math.max(0, S.loupe - 1); renderPanel();
      Sound.reject();
      toast(`${catName(true)} has had enough and scratches you. You're bleeding on the loupe. (One loupe use lost today.)`, null, 'pick');
    }
    return;
  }
  if (!keepStreak(h.cat)) return;
  h.cat.days++;
  const before = h.cat.best;
  h.cat.best = Math.max(h.cat.best, h.cat.streak);
  const reached = n => before < n && h.cat.best >= n;
  if (reached(3)) toast('The cat hops down off the amp and takes up a post at the end of the counter, watching the door.');
  if (reached(5)) pendingLines.push('name');
  if (reached(15)) toast(`${catName(true)} has started sleeping on the counter itself, right where people sign things.`);
  if (h.cat.days >= WEEKS * 5) secretFound('faithful');
}
// lines said by the next customer on their way out (after the one at the counter now)
const pendingLines = [];

// The cat's tell (7 days running): once a day he hisses at a stolen item on the counter.
// game.js calls onCounter() when a seller or pawner puts something down.
let counterItem = null;
function onCounter(it) {
  counterItem = it;
  const h = habits();
  if (!it || !it.stolen || h.cat.best < 7 || h.cat.tellDay === dayNum()) return;
  h.cat.tellDay = dayNum();
  setTimeout(() => {
    fx('hiss', 344, 222, 1200);
    Sound.tone(220, 0.25, 'sawtooth', 0.02);
    toast(`${catName(true)} flattens his ears at the ${it.name.toLowerCase()} and hisses.`);
  }, 700);
}

// The long nap: idle in the shop for two minutes and he walks the counter, once a run.
let napping = null;
function drawNap(g, now) {
  const p = Math.min(1, (now - napping) / 5000), x = 340 + p * 230, y = 250;
  const col = '#3a3436', step = Math.floor(now / 160) % 2;
  rect(g, x, y - 10, 18, 7, col); rect(g, x + 16, y - 15, 8, 7, col); rect(g, x + 16, y - 17, 2, 3, col); rect(g, x + 22, y - 17, 2, 3, col);
  rect(g, x + 1 + step, y - 3, 2, 3, col); rect(g, x + 13 - step, y - 3, 2, 3, col); rect(g, x - 5, y - 12, 6, 2, col);
  if (p > 0.55 && p < 0.75) rect(g, 422 + (p - 0.55) * 40, 240 + (p - 0.55) * 300, 1, 8, '#2a2a6a'); // the pen goes over the edge
}
setInterval(() => {
  if (!S || !S.habits || S.habits.nap || napping || !inShop() || paused || modalOpen) return;
  if (!$('#title').classList.contains('hidden')) return;
  if (performance.now() - lastInput < IDLE_NAP_MS) return;
  S.habits.nap = true;
  napping = performance.now();
  setTimeout(() => {
    napping = null;
    Sound.tone(1400, 0.05, 'square', 0.02);
    toast(`${catName(true)} strolls the length of the counter, knocks your pen off the edge, and goes back to sleep.`);
    secretFound('nap');
  }, 5000);
}, 1000);

// ================================================================ the rest of the room
function clickScale() {
  const h = habits();
  fx('wobble', 0, 0, 900);
  Sound.tone(1320, 0.12, 'sine', 0.03);
  // The scale at midnight: weigh nothing, during a night in the shop
  if (view.bg === 'shopNight') {
    if (S.flags.devil) { fx('sink', 0, 0, 2500); toast('You set nothing on the scale. The empty pan sinks all the way down and stays there.'); }
    else toast('You set nothing on the scale. It stays level. The cat sits down to watch it.');
    secretFound('midnight');
    return;
  }
  const it = counterItem;
  if (!it || !$('#card').innerHTML || !['jewelry', 'silver'].includes(it.cat) || h.scale.day === dayNum()) return;
  h.scale.day = dayNum();
  setTimeout(() => toast(it.fake ? `You weigh the ${it.name.toLowerCase()} on Odile's scale. Light for its size.` : `You weigh the ${it.name.toLowerCase()} on Odile's scale. Heavier than it looks.`, null, it.icon), 600);
}

function clickClock() {
  const h = habits(), c = today(h.clock);
  c.count++;
  fx('tick', 364, 40, 600);
  Sound.tone(2200, 0.03, 'square', 0.03); Sound.tone(1800, 0.03, 'square', 0.03, 0.12);
  if (c.count === 4 && h.clock.slow !== dayNum()) { h.clock.slow = dayNum(); toast('You nudge the clock back. It\'s four minutes slow today.'); }
  // The fog in the clock: noon in Fog Week
  if (view.fog && view.timeOfDay >= NOON[0] && view.timeOfDay <= NOON[1] && !h.feather) {
    h.feather = true;
    if (CAST.mott) toast('Captain Mott\'s head pokes out of the clock face. "Must you? Some of us are trying to drift."', CAST.mott.look);
    giveItem(oddItem({ name: 'Gull feather', icon: 'feather', guide: 1, condLabel: 'Damp', clue: 'It smells of the sea and it\'s cold to the touch. It fell out of the clock.' }), true);
    toast('A puff of sea air, and a gull feather drifts down onto the counter.', null, 'feather');
    secretFound('fogclock');
  }
}

function clickNeon() {
  const h = habits();
  fx('zap', 420, 28, 400);
  Sound.stamp();
  if (!keepStreak(h.neon)) return;
  toast('You smack the PAWN sign. It steadies, for today.');
  if (h.neon.streak >= 5 && !h.neon.discount) {
    h.neon.discount = true;
    applyDiscounts();
    toast(`The neon man calls. He heard you've been fixing the sign yourself. "${money(NEON_DISCOUNT)} off new tubes. You've been doing my job."`);
  }
}
const NEON_DISCOUNT = 20;
const SIGN_COST = UPGRADES.sign.cost;
function applyDiscounts() { UPGRADES.sign.cost = SIGN_COST - (S && S.habits && S.habits.neon.discount ? NEON_DISCOUNT : 0); }
function neonSteady() { return !!(S && S.habits && S.habits.neon.last === dayNum()); }

function clickOpen() {
  const h = habits(), o = h.open;
  if (o.day !== dayNum()) { o.day = dayNum(); o.on = false; }
  o.on = !o.on;
  Sound.blip();
  if (!o.on || h.served > 0 || o.last === dayNum()) return;
  // switched on before the first customer is served
  keepStreak(o);
  if (o.streak === 5) {
    change('rep', 1, 'The regulars noticed you open on time');
    o.bonusWeek = S.day < 5 ? S.week : S.week + 1;
    toast('A regular, on the step: "Lights on at nine sharp, every day this week. Odile would approve."');
  }
}
// one extra shopper on the Friday after a week of opening on time (js/game.js shopperCount)
function bonusShoppers() { return S && S.habits && S.habits.open.bonusWeek === S.week && S.day === 5 ? 1 : 0; }

function waterPlant() {
  const h = habits(), p = today(h.plant);
  p.count++;
  for (let i = 0; i < 6; i++) fx('water', 8 + i * 3, 284, 600 + i * 60);
  Sound.paper();
  if (p.count === 2) {
    p.overs++;
    if (p.overs >= 3 && !p.wilted) { p.wilted = true; p.streak = 0; p.best = 0; p.overs = 0; pendingLines.push('wilt'); }
    else toast('The pot is already soaked.');
    return;
  }
  if (p.count > 2) return;
  if (!keepStreak(p)) return;
  p.wilted = false;
  p.best = Math.max(p.best || 0, p.streak);
  if (p.streak === 5) toast('The rubber plant has perked up.');
  if (p.streak === 10 && !p.cutting) { p.cutting = true; pendingLines.push('cutting'); secretFound('bloom'); }
  if (p.streak === 15) toast('A second white bloom. The whole shop smells faintly sweet.');
}
// +2% on shoppers' offers once the plant has flowered twice (js/game.js runShopper)
function shopperBonus() { return S && S.habits && !S.habits.plant.wilted && (S.habits.plant.best || 0) >= 15 ? 1.02 : 1; }

function clickTile() {
  const h = habits(), t = h.tile;
  for (let i = 0; i < 3; i++) fx('drop', 222, 10, 500, { i: i * 2 });
  Sound.tone(1200, 0.05, 'sine', 0.03);
  if (!isRainy() || t.found) return;
  if (t.day !== dayNum()) { t.day = dayNum(); t.count = 0; }
  if (++t.count < 3) return;
  t.found = true;
  change('coin', 25, 'Found in Odile\'s tin box');
  giveItem(oddItem({ name: 'Odile\'s first pawn ticket', icon: 'letter', nosale: true, condLabel: 'Water-stained',
    clue: 'Ticket 0001, 1979: "One guitar, sunburst. $15." On the back, in Odile\'s hand: "Ask Pell about the light."' }), true);
  toast('The tile lifts. Above it, wedged on a pipe, is a tin box: $25, and Odile\'s very first pawn ticket.', null, 'tin');
  secretFound('tin');
}

// the pegboard, left to right, is five notes
function strum(nx = 315) {
  const h = habits();
  const zone = clamp(Math.floor((nx - 284) / (62 / 5)), 0, 4);
  const midi = PEG_NOTES[zone], f = 440 * Math.pow(2, (midi - 69) / 12);
  Sound.tone(f, 0.5, 'triangle', 0.05); Sound.tone(f * 2, 0.2, 'sawtooth', 0.008);
  fx('note', 284 + zone * 12 + 4, 120, 900);
  h.notes = [...(h.notes || []), zone].slice(-5);
  const match = tune => tune.every((z, i) => h.notes[i] === z);
  if (h.notes.length === 5 && match(ADA_TUNE) && !h.ada) {
    h.ada = true; h.notes = [];
    toast('You play the five notes from Ada\'s music box. Somewhere, it sounds like someone is listening.');
    secretFound('ada');
  } else if (h.notes.length === 5 && match(FOG_RIFF) && !S.flags.fogRiff) {
    S.flags.fogRiff = true; h.notes = []; // the Breakwaters quest (M12) picks this up
    if (!(typeof questActive === 'function' && QUESTS.breakwaters && questActive('breakwaters'))) pendingLines.push('riff');
    secretFound('riff');
  }
}

// ---------------------------------------------------------------- the coffee
// The mug by the ledger (drawMug in js/art.js). Click it for a sip; in a quiet spell
// you walk back behind the counter for it first (js/wander.js). It goes cold, then runs out.
const MUG = { x: 446, y: 240 }; // native px, top left of the mug (drawMug in js/art.js)
function sipping(now) { return FX.find(f => f.type === 'sip' && fxAge(f, now) < 1); }
function sipCoffee() {
  if (sipping(performance.now())) return;
  const c = today(habits().coffee);
  c.count++;
  fx('sip', 0, 0, 1700, { empty: c.count > 6 });
  if (c.count <= 6) Sound.tone(180, 0.12, 'sine', 0.02, 0.55);
  if (c.count === 4) toast('Gone cold. You drink it anyway.');
  else if (c.count === 6) toast('That was the last of it.');
  else if (c.count === 7) toast('Empty. You check anyway.');
}
// where the mug is in your hand: lifted from the counter to your mouth and back down
function mugInHand(f, now) {
  const k = keeper;
  if (!k || k.hidden || k.walking || !view.actors.includes(k)) return null;
  const a = fxAge(f, now), up = a < 0.22 ? a / 0.22 : a > 0.8 ? (1 - a) / 0.2 : 1;
  const mx = Math.round(k.x * 2 + (k.facingLeft ? -12 : 4)), my = Math.round(k.y * 2 - 58);
  return { x: Math.round(MUG.x + (mx - MUG.x) * up), y: Math.round(MUG.y + (my - MUG.y) * up), up, a };
}
// for drawShopFront (js/art.js): the mug is in your hand, or drunk dry today
function mugInUse() { const now = performance.now(), f = view.bg === 'shop' && sipping(now); return !!(f && mugInHand(f, now)); }
function coffeeGone() { return !!(S && today(habits().coffee).count >= 6); }
function clickLamp() {
  const h = habits(), l = h.lamp;
  const off = l.offDay === dayNum();
  l.offDay = off ? 0 : dayNum();
  Sound.blip();
  // Lights out in Fog Week, after dusk: the ghost customers are still browsing
  if (!off && view.fog && atDusk() && !l.ghosts && typeof ghostLook === 'function') {
    l.ghosts = true;
    const ghosts = [0, 1, 2].map(i => makeActor(ghostLook(), 196 + i * 30, 150 + (i % 2) * 3, { alpha: 0.3, name: 'A ghost', facingLeft: i === 2 }));
    toast('With the lamp off, you can see them: three shoppers in old coats, browsing the shelves in the dark.');
    setTimeout(() => {
      ghosts.forEach(removeActor);
      giveItem(oddItem({ name: 'Old doubloon', icon: 'coin', cat: 'silver', guide: 30, condLabel: 'Worn', clue: 'Spanish gold, 1714, and cold as the sea. It was on the shelf where the ghosts stood.' }), true);
      toast('When you switch the lamp back on they\'re gone. One left a doubloon on the shelf.', null, 'coin');
      secretFound('ghosts');
    }, 4000);
  }
}
function openSignOff() { return !!(S && S.habits && !(S.habits.open.day === dayNum() && S.habits.open.on)); }
function lampOff() { return !!(S && S.habits && S.habits.lamp.offDay === dayNum()); }

function rummage() {
  const h = habits(), b = h.boxes;
  for (let i = 0; i < 5; i++) fx('dust', 604 + i * 6, 300, 700 + i * 80);
  Sound.paper();
  if (b.day === dayNum()) { toast('Nothing else in there but packing peanuts.'); return; }
  b.day = dayNum();
  if (Math.random() < RARE_FIND_CHANCE * (typeof hasCard === 'function' && hasCard('detector') ? 2 : 1)) { // Dutch's Detector (js/cards.js)
    const r = pick(RARE_BOX);
    if (giveItem(oddItem({ ...r, condLabel: 'Dusty' }))) toast(`At the bottom of a box: ${r.name.toLowerCase()}.`, null, r.icon);
    return;
  }
  const f = pick(BOX_FINDS);
  if (giveItem(oddItem({ ...f, condLabel: 'Found' }))) toast(`You find a ${f.name.toLowerCase()} in the boxes.`, null, f.icon);
}
const boxSetInStock = () => BOX_FINDS.every(f => S.stock.some(i => i.secret === f.secret));

function clickBlue() {
  const h = habits();
  Sound.tone(660, 0.15, 'sine', 0.03);
  if (!h.blue.days.includes(dayNum())) h.blue.days.push(dayNum());
  if (h.blue.days.length === 3 && !S.flags.blueLight) {
    S.flags.blueLight = true;
    toast('The blue light blinks back. Long, short, short, long. It isn\'t random. Old Pell would know.');
    secretFound('blue');
  }
}

// Dot Haskell is a town regular (js/town.js), and owns Dot's Clam Shack
const WALKER = { name: 'Dot Haskell', look: { skin: '#c89070', hair: '#2a1e16', hs: 1, coat: '#3a4a6a', style: 'puffer', pants: '#2a2a30', bag: '#8a5a3a' } };
function wave() {
  const h = habits(), w = h.wave;
  Sound.blip();
  if (w.came) { toast(`${WALKER.name} waves through the glass.`, WALKER.look); return; }
  if (!keepStreak(w)) { toast('She\'s already waved today.', WALKER.look); return; }
  const lines = ['A woman in a blue coat passing the window looks surprised, then waves back.', 'The woman in the blue coat waves back.',
    'The woman in the blue coat waves back, and slows down a little.', 'The woman in the blue coat waves and nearly stops. She looks at the door.',
    'The woman in the blue coat waves, and points at the door: tomorrow.'];
  toast(lines[Math.min(w.streak, 5) - 1], WALKER.look);
}

function dingTill() {
  const h = habits(), t = today(h.till);
  t.count++;
  fx('ding', 586, 214, 600);
  Sound.tone(1568, 0.35, 'sine', 0.05);
  if (t.count === 10 && !t.weeks.includes(S.week)) {
    t.weeks.push(S.week);
    secretFound('headache');
  }
}

// Eavesdropping on the queue: one overheard line per person.
const OVERHEARD_GENERIC = [
  { type: 'seller', line: 'Mutters to themselves: "Just say forty. Say forty and don\'t blink."' },
  { type: 'seller', line: 'On the phone: "No, I\'m AT the pawn shop. I\'m doing it. Stop asking."' },
  { type: 'loan', line: 'Quietly: "Only till the end of the month. That\'s all it is."' },
  { type: 'buyer', line: 'To nobody: "They had one in the window last week. I should have bought it then."' },
  { type: 'shopper', line: 'Peering at the shelves: "Is that a real one? It can\'t be a real one."' },
  { line: 'To the person behind them: "My gran swore a shop cat can smell a thief. Something about the hands."' },
  { line: 'Humming five notes, then: "Odile used to hum that. I can\'t get it out of my head."' },
  { line: 'Looking up: "That ceiling\'s dripped since the eighties. Odile never let anyone fix it."' },
  { line: 'On the phone: "The ferry\'s running late again. No, the other ferry."' },
  { line: 'Whispering: "Don\'t look, but that\'s the man from the Hand\'s car outside. Every Friday."', months: [1] },
  { line: 'Checking their watch: "Four minutes. It\'s always four minutes with that clock."' },
  { line: 'To a friend: "Odile? She\'d smack that sign and it would behave for a week."' },
  // the season, when you stay on (docs/SEASONS.md): months 2 November ... 6 March
  { line: 'Stamping their feet: "Frost on the windshield this morning. Here we go."', months: [2] },
  { line: 'To a friend: "The Haskells are doing Thanksgiving for twenty-two. Twenty-two! In that kitchen."', months: [2] },
  { line: 'Looking out at the street: "They took the maples down to nothing overnight. One wind."', months: [2] },
  { line: 'Brushing snow off a sleeve: "Plow went by at four. Every light in the house came on."', months: [3, 4] },
  { line: 'On the phone: "No, get her something from here. Everything from here has a story. That\'s the present."', months: [3] },
  { line: 'To the person behind them: "Saint Brine\'s has the lights on the steeple again. Took three men and a ladder they shouldn\'t own."', months: [3] },
  { line: 'Unwinding a very long scarf: "Hob\'s Pond froze clear. You can see the leaves under it."', months: [4, 5] },
  { line: 'Quietly: "The harbor\'s iced in past the breakwater. Tess says twice in her lifetime."', months: [4, 5] },
  { line: 'Blowing on their hands: "My truck said four below. My truck lies, but not by much."', months: [4, 5] },
  { line: 'To a friend: "Mud season. I lost a boot on Cliff Road. Just the boot. I kept going."', months: [6] },
  { line: 'Shaking out an umbrella: "Rain, finally. Rain I can do. Rain doesn\'t need shovelling."', months: [6] },
  { line: 'Looking at the boats: "First lobster boat went out at five. You could hear the whole town listening."', months: [6] }
];
function eavesdrop(c) {
  const a = c.actor;
  if (a.heard) { toast(`${c.name} has gone quiet.`, a.look); return; }
  a.heard = true;
  const quest = OVERHEARD.filter(o => !o.used && (!o.quest || questActive(o.quest)) && (!o.when || o.when(c)));
  let line;
  if (quest.length) { const o = quest[0]; o.used = true; line = typeof o.line === 'function' ? o.line(c) : o.line; }
  else {
    const h = habits(); h.heardLines = h.heardLines || [];
    const inMonth = o => !o.months || o.months.includes(monthNum());
    const pool = OVERHEARD_GENERIC.filter((o, i) => !h.heardLines.includes(i) && (!o.type || o.type === c.type) && inMonth(o));
    const o = pool.length ? pick(pool) : pick(OVERHEARD_GENERIC.filter(inMonth));
    h.heardLines.push(OVERHEARD_GENERIC.indexOf(o));
    line = o.line;
  }
  toast(`${c.name}, ${c.browsing ? 'by the shelves' : 'in the queue'}. ${line}`, a.look);
}

// ================================================================ the day: hints, gifts, visits
// Each thing in the room is pointed to once, by name, early in the run (rule 2 in SECRETS.md).
const HINTS = [
  { day: 2, morning: true, text: 'The OPEN sign in the window is still dark. Odile always switched it on first thing.' },
  { day: 3, morning: true, text: 'The PAWN sign is buzzing again. Odile used to fix it with the flat of her hand.' },
  { day: 4, morning: true, text: 'Odile never threw anything out. The boxes in the corner haven\'t been opened in years.' },
  { day: 6, morning: true, look: 'amabel', text: 'Sister Amabel, passing the window: "That poor plant. A little water every day, that\'s all it wants."' },
  { day: 7, morning: true, text: 'Odile\'s brass scale still weighs true. Gold sits heavy in the pan. Plate doesn\'t.' },
  { day: 8, morning: true, text: 'Odile used to ring the till whenever the Gilded Hand\'s car went by. She said it gave Merrit headaches.' }
];
function hintFor(d) { return HINTS.find(x => x.day === d); }
HOOKS.morning.push(async () => {
  const h = habits();
  applyDiscounts();
  h.served = 0; counterItem = null;
  if (h.open.day !== dayNum()) { h.open.day = dayNum(); h.open.on = false; }
  if (pendingHat) { h.cat.hat = true; pendingHat = false; }
  const hint = hintFor(dayNum());
  if (hint && !h.hints[hint.day]) { h.hints[hint.day] = true; toast(hint.text, hint.look && CAST[hint.look] ? CAST[hint.look].look : null); }
  if (isRainy() && !h.tile.dripNote) { h.tile.dripNote = true; toast('Rain. Drip, drip: the stained ceiling tile is leaking again. Odile always said she\'d get up there one day.'); }
  if (view.fog && !h.hints.fog) { h.hints.fog = true; toast('Odile never switched the desk lamp off in Fog Week. She said the shop felt fuller in the dark.'); }
  // ten days of petting: a gift on the mat, then a key
  if (h.cat.best >= 10 && h.cat.gift === 0) {
    h.cat.gift = 1; h.cat.giftDay = dayNum();
    toast(`A present on the doormat: a dead crab, arranged with care. ${catName(true)} looks proud.`);
  } else if (h.cat.gift === 1 && dayNum() > h.cat.giftDay) {
    h.cat.gift = 2;
    toast(`Another present on the mat: a small brass key. ${catName(true)} dug it out from somewhere. It fits the bottom drawer of Odile's desk.`, null, 'key');
    openDrawer();
  }
  // a full set of finds on the shelf: a kid comes in for them
  if (boxSetInStock() && !h.boxSetSold) await kidBuysSet();
  // five days of waving: the window regular comes in
  if (h.wave.streak >= 5 && !h.wave.came && h.wave.last < dayNum()) await regularComesIn();
  // the blue light, worked out: Pell tells you what it means (from week 4)
  if (S.flags.blueLight && !h.blue.told && S.week >= 4 && S.day <= 4) await pellBlueLight();
  // Ada's tune: Pell heard it, or will
  if (h.ada && !h.adaTold) await pellAdaStory();
});
// after each customer
HOOKS.tick.push(() => {
  if (!S) return;
  const h = habits();
  h.served++;
  counterItem = null;
  // Pell's first visit: the cat hint and the music box tune
  if (S.week === 1 && S.day === 2 && !h.hints.pell && (S.flags.pellLoans || S.flags.pellRefused)) {
    h.hints.pell = true;
    toast('Old Pell, on his way out, nods at the cat: "Odile always said that cat\'s luck, if you mind him."', CAST.pell.look);
    if (S.flags.pellLoans) {
      setTimeout(() => { ADA_TUNE.forEach((z, i) => Sound.tone(440 * Math.pow(2, (PEG_NOTES[z] + 12 - 69) / 12), 0.4, 'triangle', 0.04, i * 0.35)); }, 600);
      toast('As you shelve Ada\'s music box, the lid slips and it plays its five notes.', null, 'musicbox');
    }
  }
  while (pendingLines.length) counterLine(pendingLines.shift());
});
function counterLine(k) {
  if (k === 'name') {
    S.habits.cat.named = true;
    toast(`The last customer, on the way out, scratches the cat's ears: "Hello, ${CAT_NAME}. Odile's still away, then?" So that's his name.`, CAST.pell.look);
    secretFound('fathom');
  } else if (k === 'wilt') toast('A customer, leaving: "Your plant\'s drowning, you know. Easy on the watering can."');
  else if (k === 'cutting') { change('coin', 30, 'Sold a cutting of the rubber plant'); toast('A shopper admires the white flower on the rubber plant and pays $30 for a cutting.'); }
  else if (k === 'riff') toast('A customer stops at the door. "That riff. I know that riff. Where do I know it from?"');
}

function openDrawer() {
  const m = S.run ? S.run.majors : [];
  let it;
  if (m.includes('grey')) it = oddItem({ name: 'Odile\'s notes on Abner Crooke', icon: 'letter', nosale: true, condLabel: 'Folded',
    clue: 'Abner Crooke kept this shop in 1952. "He signed something. After that he never lost a sale and never slept." Odile underlined it twice.' });
  else if (m.includes('breakwaters')) it = oddItem({ name: 'Photo: Odile and Dee, 1987', icon: 'letter', nosale: true, condLabel: 'Faded',
    clue: 'Two young women in a rowing boat, laughing. On the back: "O. and D., the summer of the band."' });
  else if (m.includes('psalter')) it = oddItem({ name: 'Desmond Wick\'s library card', icon: 'letter', nosale: true, condLabel: 'Expired',
    clue: 'Hollow Neck Athenaeum, 1998. The last book stamped is in a language you don\'t recognise.' });
  if (it) { giveItem(it, true); toast(`In the drawer: ${it.name.toLowerCase()}.`, null, 'letter'); }
  else { change('coin', 40, 'Found in Odile\'s desk'); toast('In the drawer: $40 and a note in Odile\'s hand. "For the cat\'s food. Not for the Hand."', null, 'key'); }
}

const KID = { name: 'A kid with a skateboard', look: { kid: true, skin: '#e0b090', hair: '#c8883a', hs: 4, coat: '#3a6ab0', style: 'hoodie', pants: '#2a2a30' } };
async function kidBuysSet() {
  const h = habits();
  h.boxSetSold = true;
  const a = await enterActor(KID.look, KID.name);
  await say(a, 'You\'ve got a guitar pick, a button, a bus token and a bottle cap on your shelf. Right?');
  await say(a, 'I\'ll give you twenty for all four. Not other ones. Those ones. They\'re the exact ones.');
  S.stock = S.stock.filter(i => !BOX_FINDS.some(f => f.secret === i.secret));
  change('coin', 20, 'A kid bought the box finds');
  Sound.coin(); renderPanel();
  await say(a, 'Don\'t ask what for.');
  await leaveShop(a);
  secretFound('boxset');
}

async function regularComesIn() {
  const h = habits();
  h.wave.came = true;
  const a = await enterActor(WALKER.look, WALKER.name);
  await say(a, 'I\'m Dot. I walk past every morning to open the Clam Shack. You\'re the first one in here who ever waved back since Odile.');
  await say(a, 'I\'ve been meaning to get rid of this. I\'d rather it went to someone who waves.');
  const it = makeItem(pick(['watch', 'compass', 'vase', 'brooch']), { cond: 1 });
  const price = Math.round(it.guide * 0.4);
  view.counterIcon = it.icon;
  const i = await choose([{ label: `Buy the ${it.name.toLowerCase()} for ${money(price)}`, hint: `guide ${money(it.guide)}`, disabled: S.coin < price || !shelfFree() }, 'Not today, thanks']);
  view.counterIcon = null;
  if (i === 0) {
    it.paid = price; it.inspected = true;
    S.stock.push(it); S.stats.bought++;
    change('coin', -price, `Bought a ${it.name.toLowerCase()} from Dot`);
    await say(a, 'Good. I\'ll wave tomorrow.');
  } else await say(a, 'Another time. I\'ll still wave.');
  await leaveShop(a);
  secretFound('regular');
}

async function pellBlueLight() {
  const h = habits();
  h.blue.told = true;
  const a = await enterActor(CAST.pell.look, CAST.pell.name);
  await say(a, 'You\'ve been watching that blue light across the harbor. I saw you at the window.');
  if (S.flags.lighthouseClue) await say(a, 'So you\'ve seen the pattern too. Long, short, short, long. That\'s O in the old fishermen\'s code. It always was.');
  else {
    await say(a, 'Long, short, short, long. That\'s O, in the code we used on the boats. Someone at the old lighthouse is signing their name.');
    await say(a, 'I wasn\'t going to tell you. But you watched for it. Go out to Gull Point, Friday night.');
    S.flags.lighthouseClue = true;
    toast('Clue: someone signals from the old lighthouse', a.look);
  }
  await leaveShop(a);
}

async function pellAdaStory() {
  const h = habits();
  h.adaTold = true;
  if (S.flags.pellRefused && !S.flags.pellLoans) return; // he doesn't come by any more
  const a = await enterActor(CAST.pell.look, CAST.pell.name);
  await say(a, 'I was passing yesterday and I heard it through the door. Ada\'s tune. On a guitar, of all things.');
  await say(a, 'She wrote it on the ferry, the year we married. Hummed it every time she was frightened, and she was never frightened for long.');
  await say(a, 'Thank you. That\'s all. Thank you.');
  change('rep', 2);
  await leaveShop(a);
}

// Friday: Merrit's headache, if you rang the till ten times this week
HOOKS.weekend.push(async () => {
  const h = habits();
  if (!h.till.weeks.includes(S.week)) return;
  toast(S.week === WEEKS && h.till.weeks.length >= WEEKS
    ? 'Merrit Gaunt, collecting, presses a hand to his ear. "There\'s a ringing. There\'s been a ringing for a month."'
    : 'Merrit Gaunt, collecting, rubs his temple. "Is there a bell in here? There\'s always a bell."', CAST.merrit.look);
});

// The epilogue: if you minded the cat every day of the run
HOOKS.ending.push((title, lines) => {
  if (!S.habits || S.habits.cat.days < WEEKS * 5) return;
  if (S.over === 'seized') lines.push(`The new owners keep the cat. Within a year they've renamed the place ${CAT_NAME}'s.`);
  else if (S.over) lines.push(`${CAT_NAME} moves in with Old Pell, and supervises the scallop boat.`);
  else if (S.flags.odileHome || S.flags.odileFreed) lines.push(`When Odile gets home, ${CAT_NAME} is waiting on the step. She asks if you looked after him. You did.`);
  else lines.push(`${CAT_NAME} has the stool by the till now. It's his shop as much as yours.`);
});

// ================================================================ the cat's hat: type FATHOM on the title screen
let pendingHat = false, typed = '';
document.addEventListener('keydown', e => {
  if ($('#title').classList.contains('hidden') || e.target.tagName === 'INPUT' || e.key.length !== 1) return;
  typed = (typed + e.key.toUpperCase()).slice(-6);
  if (typed === 'FATHOM' && !pendingHat) {
    pendingHat = true;
    Sound.accept();
    toast('Somewhere, a tiny hat is being knitted.');
    secretFound('hat');
  }
}, true);

// for tests (tools/secrets.js)
window.__secrets = { habits, hotspotAt, HOTSPOTS, click: id => HOTSPOTS.find(h => h.id === id).click(), onCounter, isRainy, SECRETS, catAtCounter, catGuards };
