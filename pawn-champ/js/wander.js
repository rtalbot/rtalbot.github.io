// Pawn Champ - click-to-walk. Click a hotspot in the shop during a quiet spell, or a spot in
// another scene while it waits on a line, and you walk over to it before its line plays.
// The script's staging is kept: in a scene you step back to where you stood as soon as the
// dialogue moves on, and in the shop you go back behind the counter when the quiet spell ends.
// Design: docs/SHOP_DAY.md#walking-over. Loaded after js/scenespots.js; wraps roomSpots()
// (js/secrets.js), advance() and walkTo() (js/game.js).
//   A scene spot can say where to stand, or that you look from where you are:
//   addSceneSpot('docks', { id: 'ship', rect, stand: { x: 200 }, lines }) // logical x (and y)
//   addSceneSpot('docks', { id: 'gull', rect, walk: false, lines })
'use strict';

const WANDER = {
  speed: 80,          // logical pixels a second; scripted walks use 42
  near: 6,            // closer than this and you just turn to look
  gap: 10,            // stop this far short of the middle of the thing
  minX: 14, maxX: 306,
  // the shop: behind the counter (feet hidden) or out on the floor in front of the window
  counterY: 141, counterMinX: 178, counterMaxX: 308, counterFrom: 172,
  floorMinX: 22, floorMaxX: 150,
  shopStay: ['boxes', 'walker', 'queue']  // in front of the counter glass, or moving: look from where you are
};

let wanderToken = 0, wanderMoving = false;

// "You" in this room: the keeper behind the counter, or the scene's own "You" actor
function wanderer() {
  if (view.bg === 'shop') return keeper && !keeper.hidden && view.actors.includes(keeper) ? keeper : null;
  if (inShop()) return null; // the shop at night is all story; you stay with the candle
  return view.actors.find(a => a.name === 'You' && !a.hidden) || null;
}
// the floor out front is free when nobody is queueing or browsing there
function shopFloorFree() {
  const seen = a => a && !a.hidden && view.actors.includes(a);
  if (typeof queue !== 'undefined' && queue.some(c => seen(c.actor))) return false;
  if (typeof browsers !== 'undefined' && browsers.some(b => seen(b && b.actor ? b.actor : b))) return false;
  return true;
}

// where to stand for a spot, in logical pixels, or null to look from where you are
function standFor(a, id, r, spot) {
  const mid = (r.x + r.w / 2) / 2;
  const short = x => (a.x < mid ? x - WANDER.gap : x + WANDER.gap);
  if (view.bg === 'shop') {
    if (!shopDay.idle || WANDER.shopStay.includes(id)) return null;
    if (mid >= WANDER.counterFrom) return { x: clamp(short(mid), WANDER.counterMinX, WANDER.counterMaxX), y: WANDER.counterY };
    if (!shopFloorFree()) return null;
    return { x: clamp(short(mid), WANDER.floorMinX, WANDER.floorMaxX), y: FLOOR_Y };
  }
  if (!spot || spot.walk === false) return null;
  if (spot.stand) return { x: spot.stand.x, y: spot.stand.y === undefined ? a.y : spot.stand.y };
  return { x: clamp(short(mid), WANDER.minX, WANDER.maxX), y: a.y };
}

function wanderWalk(a, x, y) {
  wanderMoving = true;
  const p = walkTo(a, x, y);
  wanderMoving = false;
  return p;
}

// walk over, face the thing, then do what the click does
function wanderThen(h, args) {
  const a = wanderer(), r = h.rect();
  const spot = h.spot;
  const at = a && r && standFor(a, h.id, r, spot);
  const token = ++wanderToken;
  if (!at || Math.hypot(at.x - a.x, at.y - a.y) < WANDER.near) {
    if (a && r && !a.walking) a.facingLeft = (r.x + r.w / 2) / 2 < a.x;
    return h.click(...args);
  }
  if (!a.wanderHome) a.wanderHome = { x: a.x, y: a.y, facingLeft: a.facingLeft, speed: a.speed };
  a.speed = WANDER.speed;
  const bg = view.bg;
  wanderWalk(a, at.x, at.y).then(() => {
    if (token !== wanderToken || view.bg !== bg || !view.actors.includes(a)) return;
    a.facingLeft = (r.x + r.w / 2) / 2 < a.x;
    if (bg === 'shop' && !shopDay.idle) return;
    if (!canClickRoom()) return;
    h.click(...args);
  });
}

// back to where the script put you
function wanderHome(a) {
  if (!a || !a.wanderHome) return;
  const home = a.wanderHome;
  a.wanderHome = null;
  wanderToken++;
  a.speed = WANDER.speed;
  wanderWalk(a, home.x, home.y).then(() => {
    a.speed = home.speed;
    if (!a.wanderHome) a.facingLeft = home.facingLeft;
  });
}

// every clickable in the room walks you over first
const roomSpotsBeforeWander = roomSpots;
roomSpots = function () {
  return roomSpotsBeforeWander().map(h => ({ ...h, click: (...args) => wanderThen(h, args) }));
};
// scene spots carry their definition, so a spot can say where to stand
const sceneSpotsBeforeWander = sceneSpots;
sceneSpots = function () {
  return sceneSpotsBeforeWander().map((h, i) => ({ ...h, spot: (SCENE_SPOTS[view.bg] || [])[i] }));
};
// the dialogue moving on brings you back to your mark
const advanceBeforeWander = advance;
advance = function () {
  if (!inShop()) wanderHome(view.actors.find(a => a.wanderHome));
  return advanceBeforeWander();
};
// a scripted walk takes over: the script has a new mark for you
const walkToBeforeWander = walkTo;
walkTo = function (a, x, y) {
  if (!wanderMoving && a.wanderHome) { a.speed = a.wanderHome.speed; a.wanderHome = null; }
  return walkToBeforeWander(a, x, y);
};
// the shop: back behind the counter when the quiet spell ends (someone comes in, or you go out)
setInterval(() => {
  if (view.bg === 'shop' && keeper && keeper.wanderHome && !shopDay.idle) wanderHome(keeper);
}, 80);

window.__wander = { WANDER, wanderer, standFor };
