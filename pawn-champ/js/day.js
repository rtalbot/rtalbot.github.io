// Pawn Champ - the shop day on a clock. Customers arrive through the day instead of all at
// opening; quiet spells between them are the time to click around the shop. Going out (lunch
// errands, town outings) shuts the door for a while, and at five you choose whether to close or
// stay open an extra hour. Design: docs/SHOP_DAY.md.
// Loaded after js/runs.js and before js/secrets.js. Uses game.js globals (S, view, queue, buildDay,
// runCustomer, stepUp, shuffleQueue, leaveShop, narrate, choose, toast) and runs.js's errands and hubs.
'use strict';

// ================================================================ numbers (docs/SHOP_DAY.md#numbers)
const OPEN = 9 * 60, CLOSE = 17 * 60, LATE_HOUR = 60;
const DAY = {
  // real seconds are turned into shop minutes at these rates
  idleRate: 5,      // a quiet spell: 5 shop minutes a second, so half an hour passes in six seconds
  hurryRate: 60,    // after "Wait for a customer" (or Space)
  serveRate: 1.2,   // while someone is at the counter
  fastRate: 600,    // the test driver's fast mode
  // shop minutes each kind of visit takes, whatever the real time spent
  cost: { seller: 25, loan: 25, buyer: 20, wanted: 15, shopper: 12, redeem: 10, story: 30 },
  // how busy each half hour is, 9:00 to 16:30 (the dip is lunch)
  flow: [1.3, 1.1, 1, 1, 1, 0.9, 0.45, 0.45, 0.9, 1, 1.1, 1.1, 1, 0.8, 0.5],
  lastFrom: 16 * 60, lastTo: 16 * 60 + 40,   // beats marked "last" come in at dusk
  hubPrompt: 16 * 60,                         // a hub evening that starts at four
  lateShoppers: { busy: [1, 2], quiet: [0, 1] },
  browse: [15, 40]                            // shop minutes a shopper browses before joining the line
};

// The town's daytime outings (docs/SHOP_DAY.md#outings). Two a week, announced the day before.
const OUTINGS = {
  estate: { title: 'Estate sale', where: 'Pleasant Street', at: 10 * 60 + 30, minutes: 90,
    intro: 'Half past ten. The estate sale on Pleasant Street opens its doors about now. The good lots go in the first hour.', bring: ['read'] },
  rummage: { title: 'Rummage sale', where: 'Saint Brine\'s', at: 11 * 60, minutes: 60,
    intro: 'Eleven o\'clock. Saint Brine\'s rummage sale is open, ten dollars a box, no peeking under the newspaper.', bring: ['pry', 'unlock'] },
  flea: { title: 'Flea market', where: 'Harbor Green', at: 13 * 60, minutes: 120, evening: true,
    intro: 'One o\'clock. The flea market is up on the Green, and the day-trippers off the ferry are in a buying mood.',
    slots: 3, sell: true, note: 'Pack what you want to sell: three things fit on the table.' },
  parade: { title: 'Harbor Day parade', where: 'Water Street', at: 14 * 60, minutes: 60, evening: true,
    intro: 'Two o\'clock. You can hear the high school band tuning up at the top of Water Street. The parade goes right past the door.' }
};

// ================================================================ the clock
let pending = [];   // customers who haven't arrived yet, with .at in shop minutes
const shopDay = { clock: null, idle: false, hurry: false, closeAt: CLOSE, closing: false, lateToHub: false, missed: 0, busyEvening: false };

function clockText(m) {
  const h = Math.floor(m / 60), mm = Math.floor(m % 60);
  return `${(h + 11) % 12 + 1}:${String(mm).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}
// 0 at opening, 0.85 at five, 0.9 at six (endDay and the night scenes take it from there)
function clockTOD(m) { return m <= CLOSE ? clamp((m - OPEN) / (CLOSE - OPEN), 0, 1) * 0.85 : 0.85 + Math.min(1, (m - CLOSE) / LATE_HOUR) * 0.05; }
function setClock(m) {
  shopDay.clock = m;
  view.timeOfDay = clockTOD(m);
  const el = document.getElementById('clock');
  if (el) el.textContent = m === null ? '' : clockText(m);
}
// the panel shows the time under the day
const renderPanelBeforeClock = renderPanel;
renderPanel = function () {
  renderPanelBeforeClock();
  if (!S) return;
  const big = document.querySelector('#panel-right .big');
  if (big) big.insertAdjacentHTML('afterend', `<div id="clock" class="clock">${shopDay.clock === null ? '' : clockText(shopDay.clock)}</div>`);
};

// ================================================================ arrivals
// Customers keep buildDay()'s order (tutorial first, "first" regulars early, "last" beats at dusk)
// and get arrival times spread over the day by DAY.flow, so the flow is steady with a lunch dip.
function arrivalTimes(n) {
  const W = DAY.flow, total = W.reduce((a, b) => a + b, 0);
  const at = q => { // invert the cumulative flow
    let x = q * total;
    for (let i = 0; i < W.length; i++) { if (x <= W[i]) return OPEN + (i + x / W[i]) * 30; x -= W[i]; }
    return OPEN + W.length * 30;
  };
  const out = [];
  for (let i = 0; i < n; i++) out.push(Math.round(at((i + rand(0.15, 0.85)) / n)));
  return out;
}
function scheduleArrivals(list) {
  const day = list.filter(c => !c.last), dusk = list.filter(c => c.last);
  const times = arrivalTimes(day.length);
  day.forEach((c, i) => { c.at = times[i]; });
  if (S.week === 1 && S.day === 1 && day[0]) day[0].at = OPEN + 2; // the tutorial seller is waiting at the door
  dusk.forEach((c, i) => { c.at = Math.round(DAY.lastFrom + (i + rand(0.2, 0.8)) / dusk.length * (DAY.lastTo - DAY.lastFrom)); });
  // shoppers come in a while before their turn and browse the shelves first (BROWSE_SPOTS)
  for (const c of day) if (c.type === 'shopper') { c.browse = randi(DAY.browse[0], DAY.browse[1]); c.enter = Math.max(OPEN, c.at - c.browse); }
  return [...day, ...dusk].sort((a, b) => enterAt(a) - enterAt(b));
}
const enterAt = c => (c.enter !== undefined ? c.enter : c.at);
// story beats, loan redemptions and a card's visitors always get served, even at closing
function mustServe(c) { return c.type === 'story' || c.type === 'redeem' || !!c.cardVisitor || !!c.must; }

// someone walks in and joins the back of the line
function admit(c) {
  const i = queue.length;
  queue.push(c);
  const a = makeActor(c.look, 24, 124, { name: c.name, alpha: c.alpha });
  c.actor = a;
  if (i >= 4) a.hidden = true; // waiting outside the door
  else {
    view.doorOpen = 1.2; view.bell = 0.8; Sound.bell();
    walkTo(a, 30, 140).then(() => {
      const k = queue.indexOf(c);
      if (k >= 0 && k < 4) walkTo(a, QUEUE_X[k], FLOOR_Y - (k % 2) * 3).then(() => { a.facingLeft = false; });
    });
  }
  view.queueLeft = queue.length; renderPanel();
}
function admitDue() {
  if (shopDay.away) return;
  while (pending.length && enterAt(pending[0]) <= shopDay.clock) {
    const c = pending.shift();
    if (c.browse && c.at > shopDay.clock && startBrowsing(c)) continue;
    admit(c);
  }
  for (const c of browsers.filter(b => b.at <= shopDay.clock)) joinLine(c);
}

// ================================================================ browsing
// Shoppers wander in early and look round the room before they join the line, so there's usually
// someone to overhear (click them; js/secrets.js). Spots are feet positions on the logical
// 320x180 grid, clear of the line, the counter and the keeper's stand-points.
const BROWSE_SPOTS = [{ x: 96, y: 136, left: true }, { x: 146, y: 136 }, { x: 248, y: 170 }, { x: 292, y: 168, left: true }];
let browsers = [];
function startBrowsing(c) {
  const taken = browsers.map(b => b.spot);
  const free = BROWSE_SPOTS.filter(sp => !taken.includes(sp));
  if (!free.length) return false;
  const sp = pick(free);
  c.spot = sp; c.browsing = true;
  browsers.push(c);
  const a = makeActor(c.look, 24, 124, { name: c.name, alpha: c.alpha });
  c.actor = a;
  view.doorOpen = 1.2; view.bell = 0.8; Sound.bell();
  walkTo(a, 30, 140).then(() => walkTo(a, sp.x, sp.y)).then(() => { a.facingLeft = !!sp.left; });
  return true;
}
// done browsing: into the line
function joinLine(c) {
  browsers = browsers.filter(b => b !== c);
  c.browsing = false; c.spot = null;
  const k = queue.length;
  queue.push(c);
  if (k < 4) walkTo(c.actor, QUEUE_X[k], FLOOR_Y - (k % 2) * 3).then(() => { c.actor.facingLeft = false; });
  else walkTo(c.actor, 30, 140).then(() => { if (queue.includes(c) && queue.indexOf(c) >= 4) c.actor.hidden = true; });
  view.queueLeft = queue.length; renderPanel();
}

// ================================================================ quiet spells
// Nobody at the counter: the clock runs on its own until the next arrival or event. Click around
// the shop, or press "Wait for a customer" (Space, or the pad's A) to hurry it along.
const hurryBtn = document.createElement('button');
hurryBtn.id = 'hurry'; hurryBtn.className = 'hurry hidden';
hurryBtn.innerHTML = 'Wait for a customer &#9656;&#9656;';
hurryBtn.title = 'Let the clock run until someone comes in (Space)';
hurryBtn.addEventListener('click', e => { e.stopPropagation(); shopDay.hurry = true; hurryBtn.classList.add('on'); });
$('#stage').appendChild(hurryBtn);
// during a quiet spell a click on the room is for the room (js/secrets.js), never "hurry"
document.addEventListener('click', e => { if (shopDay.idle && e.target === canvas) e.stopPropagation(); }, true);

function idleUntil(target) {
  shopDay.idle = true; shopDay.hurry = false;
  hurryBtn.classList.remove('hidden', 'on');
  const hurry = () => { shopDay.hurry = true; hurryBtn.classList.add('on'); };
  advanceResolver = hurry; // Space, Enter and the pad's A hurry the clock
  if (!S.flags.lullHint && target - shopDay.clock >= 20) {
    S.flags.lullHint = true;
    toast('A quiet spell. Have a look around the shop while you wait.', null, 'letter');
  }
  return new Promise(res => {
    let last = performance.now();
    const step = () => {
      const now = performance.now(), dt = Math.min(0.2, (now - last) / 1000); last = now;
      if (!paused && !modalOpen) {
        const rate = fastMode ? DAY.fastRate : shopDay.hurry ? DAY.hurryRate : DAY.idleRate;
        setClock(Math.min(target, shopDay.clock + rate * dt));
      }
      if (shopDay.clock >= target) {
        shopDay.idle = false; hurryBtn.classList.add('hidden');
        if (advanceResolver === hurry) advanceResolver = null;
        return res();
      }
      setTimeout(step, 40);
    };
    step();
  });
}

// ================================================================ serving
async function serveNext() {
  const c = queue.shift();
  view.queueLeft = queue.length; renderPanel();
  if (c.actor.hidden) { c.actor.hidden = false; c.actor.x = 24; c.actor.y = 124; }
  await Promise.all([stepUp(c), shuffleQueue()]);
  const start = shopDay.clock, end = start + (c.minutes || DAY.cost[c.type] || 20);
  // the clock creeps on while you talk, and people keep coming in
  const creep = setInterval(() => {
    if (paused || modalOpen) return;
    setClock(Math.min(end, shopDay.clock + DAY.serveRate * 0.1 * (fastMode ? 5 : 1)));
    admitDue();
  }, 100);
  try { await runCustomer(c); } finally { clearInterval(creep); }
  setClock(Math.max(shopDay.clock, end));
  view.highlight = null;
  runTick();
}

// Everyone who isn't a must-serve leaves; must-serves wait (outside, if you're going out).
async function turnAway(goingOut) {
  const stay = queue.filter(mustServe), go = queue.filter(c => !mustServe(c));
  const walks = [];
  for (const c of go) {
    if (c.type === 'wanted' && c.returning && dayNum() < WEEKS * 5) S.wants.push({ ...c, actor: undefined, due: dayNum() + 1 }); // they'll try again tomorrow
    if (c.actor.hidden) removeActor(c.actor); else walks.push(leaveShop(c.actor));
  }
  for (const c of browsers) walks.push(leaveShop(c.actor));
  go.push(...browsers); browsers = [];
  if (goingOut) {
    for (const c of stay) { if (c.actor.hidden) removeActor(c.actor); else walks.push(leaveShop(c.actor)); c.actor = null; c.at = 0; }
    pending.unshift(...stay);
    queue = [];
  } else queue = stay;
  await Promise.all(walks);
  view.queueLeft = queue.length; renderPanel();
  return go.length;
}

// ================================================================ going out
// Shut the shop for `minutes` and play `scene` somewhere else. Anyone in the shop leaves (story
// beats and redemptions wait for you); anyone who would have come in meanwhile finds the door
// locked, except those must-serves, who come in when you're back. Outside a shop day it just plays.
async function goOut(minutes, scene) {
  const inDay = shopDay.clock !== null;
  const back = inDay ? shopDay.clock + minutes : 0;
  let gone = 0;
  if (inDay) gone += await turnAway(true);
  shopDay.away = true;
  const saved = { bg: view.bg, actors: view.actors, keeper, timeOfDay: view.timeOfDay, counterIcon: view.counterIcon, fog: view.fog };
  await fadeOut();
  view.actors = []; keeper = null;
  try { await scene(); } finally {
    shopDay.away = false;
    await fadeOut();
    Object.assign(view, { bg: saved.bg, actors: saved.actors, timeOfDay: saved.timeOfDay, counterIcon: saved.counterIcon, fog: saved.fog });
    keeper = saved.keeper;
  }
  if (inDay) {
    const missed = pending.filter(c => !mustServe(c) && enterAt(c) < back);
    for (const c of missed) if (c.type === 'wanted' && c.returning && dayNum() < WEEKS * 5) S.wants.push({ ...c, actor: undefined, due: dayNum() + 1 });
    pending = pending.filter(c => !missed.includes(c));
    for (const c of pending) if (c.at < back) c.at = back + randi(1, 10);
    pending.sort((a, b) => enterAt(a) - enterAt(b));
    gone += missed.length;
    shopDay.missed += gone;
    setClock(back);
  }
  Sound.music(Sound.dayTrack(dayNum()));
  renderPanel();
  await fadeIn();
  if (inDay && gone) toast(`While you were out, ${gone === 1 ? 'someone' : gone + ' people'} found the door locked.`, null, 'letter');
}

// ================================================================ the town's outings
function planOutings(run) {
  run.outings = {}; run.outingKinds = {};
  const kinds = Object.keys(OUTINGS);
  for (let w = 1; w <= WEEKS; w++) {
    const days = shuffle([1, 2, 3, 4, 5].filter(d => !(w === 1 && d < 3))).slice(0, 2).sort();
    const ks = shuffle([...kinds]).slice(0, 2);
    days.forEach((d, i) => { const id = `outing-${w}-${i}`; run.outings[id] = (w - 1) * 5 + d; run.outingKinds[id] = ks[i]; });
  }
}
function outingIdOn(d) { return S.run && S.run.outings ? Object.keys(S.run.outings).find(id => S.run.outings[id] === d) : null; }
function outingOn(d) { const id = outingIdOn(d); return id ? OUTINGS[S.run.outingKinds[id]] && { id, kind: S.run.outingKinds[id], ...OUTINGS[S.run.outingKinds[id]] } : null; }
// they go on the calendar the day before
for (let w = 1; w <= WEEKS; w++) for (let i = 0; i < 2; i++) {
  const id = `outing-${w}-${i}`;
  const o = () => S && S.run && S.run.outingKinds && OUTINGS[S.run.outingKinds[id]];
  CALENDAR.push({ id, placed: id, placedIn: 'outings', night: false, story: 'town', scene: null,
    get where() { return o() ? o().where : ''; },
    title: () => (o() ? `${o().title}, ${clockText(o().at)}` : ''),
    known: () => !!(S.run && S.run.outings && dayNum() >= S.run.outings[id] - 1) });
}

async function runOuting(o) {
  hideCard();
  await narrate(o.intro);
  const i = await choose([
    { label: `Hang the BACK SOON sign and go`, hint: `back about ${clockText(shopDay.clock + o.minutes)}; anyone who comes by finds the door locked` },
    { label: 'Stay open' }]);
  if (o.evening) shopDay.busyEvening = true;
  if (i === 1) { if (OUTING_STAY[o.kind]) await OUTING_STAY[o.kind](o); return; }
  S.flags.outings = (S.flags.outings || 0) + 1;
  await goOut(o.minutes, () => OUTING_GO[o.kind](o), o); // o tells the bag where you're going
}

// a locked cash tin at the bottom of a rummage box (docs/ITEMS_IN_USE.md)
async function rummageTin(vol) {
  await narrate('At the bottom of the box, under the newspaper: a little green cash tin, locked, that rattles.');
  const tag = bestFor('unlock') ? 'unlock' : 'pry';
  const c = await choose([
    { label: 'Open it with what you brought', needs: tag, without: 'Something to prise or pick a lock with would open it.' },
    { label: 'Leave it locked' }]);
  if (c !== 0) { await say(vol, 'Somebody\'s savings, once. Or buttons. It\'s always buttons.'); return; }
  useItem(tag);
  const coin = 10 + Math.floor(Math.random() * 30);
  change('coin', coin, 'A locked tin in a rummage box');
  await narrate(`Buttons, mostly. And under the buttons, ${money(coin)} in old bills folded small.`);
}

const OUTING_GO = {
  async estate() {
    view.bg = 'kitchen'; view.timeOfDay = 0.3;
    const k = makeActor(CAST.keeper.look, 110, 166, { name: 'You' });
    const host = makeActor(randomLook(), 214, 160, { name: 'The estate agent', facingLeft: true });
    await fadeIn();
    await narrate('A kitchen on Pleasant Street with price stickers on everything, including the kettle. Three lots are worth your while.');
    const lots = [0, 1, 2].map(() => { const it = makeItem(pick(ITEM_KEYS), { fake: Math.random() < 0.15, mark: innocentMark() }); it.price = Math.max(5, Math.round(it.guide * rand(0.5, 0.6))); return it; });
    let looked = false;
    for (;;) {
      const opts = lots.map(it => ({ label: `${it.name} (${it.condLabel}), ${money(it.price)}`, hint: looked ? (it.fake ? 'a good copy, not the real thing' : 'genuine') : `guide ${money(it.guide)}`,
        disabled: S.coin < it.price || !shelfFree() }));
      opts.push({ label: 'Look them over with the loupe first', hint: 'uses one loupe', disabled: looked || S.loupe < 1 });
      opts.push({ label: 'Nothing for you here' });
      // items in use (docs/ITEMS_IN_USE.md): a glass from your bag does the loupe's job for free
      opts.push({ label: 'Look them over with the glass you brought', hint: 'no loupe needed', needs: 'read', hidden: looked,
        without: 'A magnifying glass would spare a loupe here.' });
      const c = await choose(opts);
      if (c === 3) { looked = true; S.loupe--; Sound.loupe(); renderPanel(); continue; }
      if (c === 5) { looked = true; if (typeof useItem === 'function') useItem('read'); Sound.loupe(); continue; }
      if (c === 4) { await say(host, 'Suit yourself. The kettle\'s still going if you change your mind.'); break; }
      const it = lots[c];
      it.paid = it.price; if (looked) { it.inspected = true; it.knownFake = it.fake; it.clues = [{ text: it.fake ? 'A good copy, not the real thing.' : 'Genuine, and honestly come by.', cls: it.fake ? 'bad' : 'good' }]; }
      S.stock.push(it); S.stats.bought++;
      change('coin', -it.price, `Bought ${it.name} at an estate sale for ${money(it.price)}`);
      Sound.register();
      await say(host, `The ${it.name.toLowerCase()}. Good eye. Cash is fine.`);
      break;
    }
    removeActor(k);
  },
  async rummage() {
    view.bg = 'saintbrines'; view.timeOfDay = 0.3;
    makeActor(CAST.keeper.look, 130, 166, { name: 'You' });
    const vol = makeActor(randomLook(), 222, 160, { name: 'A volunteer', facingLeft: true });
    await fadeIn();
    await narrate('Folding tables down both sides of the hall, boxes of other people\'s attics, and a coffee urn older than you are.');
    // with the bag on, the gift comes out of the bag, so you choose it at the door
    const out = typeof bagOn === 'function' && bagOn() && S.bag && S.bag.out;
    const box = out ? packedItems().filter(fleaSellable) : forSale().filter(x => !x.curio && !x.unique);
    const c = await choose([
      { label: 'Buy a box ($10)', hint: 'two things, sight unseen', disabled: S.coin < 10 || S.stock.length + 2 > shelfCap() },
      { label: out ? 'Give them something from your bag' : 'Give them something from your shelves', hint: 'for the roof fund', disabled: !box.length },
      { label: 'Just have a coffee' }]);
    if (c === 0) {
      change('coin', -10, 'Bought a box at the rummage sale for $10');
      const got = [0, 1].map(() => { const it = makeItem(pick(ITEM_KEYS), { cond: weighted({ 0: 3, 1: 2 }), fake: Math.random() < 0.3, mark: innocentMark() }); it.paid = 5; return it; });
      S.stock.push(...got); S.stats.bought += 2;
      Sound.register();
      await say(vol, `Under the newspaper: a ${got[0].name.toLowerCase()} and a ${got[1].name.toLowerCase()}. No refunds, God bless.`);
      if (typeof bagOn === 'function' && bagOn() && Math.random() < 0.4) await rummageTin(vol);
    } else if (c === 1) {
      const it = box.sort((a, b) => a.guide - b.guide)[0];
      if (out) removeFromStock(it); else S.stock = S.stock.filter(x => x !== it);
      change('rep', 3, `Gave a ${it.name.toLowerCase()} to the rummage sale`);
      await say(vol, `A ${it.name.toLowerCase()}! That'll go in the first ten minutes. Thank you, really.`);
    } else await say(vol, 'Milk\'s in the jug. Mind the urn, it bites.');
    renderPanel();
  },
  async flea() {
    view.bg = 'greenDay'; view.timeOfDay = 0.5;
    makeActor(CAST.keeper.look, 150, 168, { name: 'You' });
    const tourist = makeActor(randomLook(), 214, 160, { name: 'A day-tripper', facingLeft: true });
    await fadeIn();
    await narrate('You rent a trestle table by the bandstand and lay out what you brought. The ferry crowd drifts past in waves.');
    const out = typeof bagOn === 'function' && bagOn() && S.bag && S.bag.out;
    const goods = (out ? packedItems().filter(fleaSellable) : forSale().filter(x => !x.curio && !x.unique && !x.noticeId)).sort((a, b) => b.guide - a.guide).slice(0, 3);
    if (!goods.length) { await narrate('Trouble is, you brought nothing worth the table. You buy a lemonade and watch the boats.'); return; }
    let sold = 0, total = 0;
    for (const it of goods) {
      if (Math.random() < 0.3) continue; // not everything finds a buyer
      if (it.fake && Math.random() < 0.3) { change('rep', -3); await say(tourist, `This ${it.name.toLowerCase()} is a copy. I know, I've got the real one at home.`); continue; }
      const price = Math.round(it.guide * rand(0.8, 0.95));
      if (out) removeFromStock(it); else S.stock = S.stock.filter(x => x !== it);
      S.coin += price; S.stats.sold++; sold++; total += price;
      log(`Sold ${it.name} at the flea market (+${money(price)})`);
      onSold(it, 'flea');
    }
    if (sold) { Sound.coin(); await narrate(`By three you've sold ${sold === 1 ? 'one thing' : sold + ' things'} for ${money(total)}, and your face is pink from the wind.`); }
    else await narrate('Plenty of lookers, no takers. You pack up with everything you came with.');
    renderPanel();
  },
  async parade() {
    view.bg = 'greenDay'; view.timeOfDay = 0.55;
    makeActor(CAST.keeper.look, 150, 168, { name: 'You' });
    const n = makeActor(randomLook(), 196, 162, { name: 'A neighbor', facingLeft: true });
    await fadeIn();
    await narrate('The band, two fire trucks, the Little League and a lobster boat on a trailer. Half the town is out, and they see you there.');
    await say(n, 'Didn\'t think the Crooked Scale ever closed. Good to see you out.');
    change('rep', 2, 'Went to the parade');
  }
};
// what staying open gets you, where it's more than an ordinary afternoon
const OUTING_STAY = {
  async parade() {
    const n = randi(1, 2);
    for (let i = 0; i < n && forSale().length; i++) pending.push({ ...genShopper(), at: shopDay.clock + randi(10, 55) });
    pending.sort((a, b) => enterAt(a) - enterAt(b));
    toast('The parade crowd spills in off Water Street.', null, 'letter');
  }
};

// ================================================================ the hub evenings that start at four
function hubTonight() {
  if (typeof scheduledTonight !== 'function') return null;
  const n = scheduledTonight().find(x => x.hub && HUBS[x.hub]);
  return n ? HUBS[n.hub] : null;
}
function hubLate() { return shopDay.lateToHub; }
async function hubCall(h) {
  hideCard();
  await narrate(`Four o'clock. ${h.title} starts about now${h.where ? `, at ${h.where}` : ''}.`);
  const i = await choose([{ label: 'Close early and go', hint: 'anyone who comes by after four finds the door locked' },
    { label: 'Stay open until five', hint: 'you get there late and miss some of it' }]);
  if (i === 0) shopDay.closeAt = shopDay.clock; else shopDay.lateToHub = true;
  shopDay.closeEarly = i === 0;
}

// ================================================================ closing
// Somewhere to be tonight: a night on the calendar or a hub. Then there's no staying late.
function bookedTonight() {
  if (hubTonight()) return true;
  return typeof calendarFor === 'function' && calendarFor(S.week, S.day).some(e => e.night && e.scene && !calendarSeen(e.id));
}
async function closingTime(first) {
  const waiting = queue.filter(c => !mustServe(c)).length + browsers.length;
  const canStay = first && !shopDay.closeEarly && !bookedTonight() && (waiting > 0 || shopDay.busyEvening);
  if (!canStay) {
    if (waiting && !shopDay.closeEarly) toast(`${clockText(shopDay.clock)}. You've somewhere to be tonight, so the sign goes to CLOSED.`, null, 'letter');
    return 'close';
  }
  hideCard();
  const why = waiting ? `${waiting === 1 ? 'Someone is' : waiting + ' people are'} still waiting.` : 'Water Street is still busy from this afternoon.';
  await narrate(`Five o'clock. ${why}`);
  const i = await choose([{ label: 'Turn the sign to CLOSED', hint: waiting ? `${waiting === 1 ? 'they leave' : 'they all leave'}` : 'and put your feet up' },
    { label: 'Stay open until six', hint: 'you\'ll be tired tomorrow: one less use of the loupe' }]);
  return i === 1 ? 'late' : 'close';
}
function addLateShoppers() {
  const [a, b] = shopDay.busyEvening ? DAY.lateShoppers.busy : DAY.lateShoppers.quiet;
  const n = Math.min(randi(a, b), forSale().length);
  for (let i = 0; i < n; i++) pending.push({ ...genShopper(), at: shopDay.clock + randi(5, 50) });
  pending.sort((x, y) => enterAt(x) - enterAt(y));
}

// ================================================================ the day
async function runDay() {
  Object.assign(shopDay, { idle: false, hurry: false, closeAt: CLOSE, closing: false, closeEarly: false, lateToHub: false, missed: 0, busyEvening: false, away: false, late: false });
  queue = []; browsers = [];
  pending = scheduleArrivals(buildDay());
  setClock(OPEN);
  renderPanel();
  const events = [];
  for (const e of (typeof errandsToday === 'function' ? errandsToday() : [])) events.push({ at: 12 * 60, run: () => runErrand(e) });
  const o = outingOn(dayNum());
  if (o && !events.length) events.push({ at: o.at, run: () => runOuting(o) });
  const hub = hubTonight();
  if (hub) events.push({ at: DAY.hubPrompt, run: () => hubCall(hub) });
  events.sort((a, b) => a.at - b.at);
  let decided = 0; // closing decisions made: 1 after five, 2 after six
  for (;;) {
    admitDue();
    if (!shopDay.closing) {
      const ev = events.find(e => !e.done && e.at <= shopDay.clock);
      if (ev) { ev.done = true; await ev.run(); if (checkLose()) break; continue; }
      if (shopDay.clock >= shopDay.closeAt) {
        const r = decided === 0 ? await closingTime(true) : 'close';
        decided++;
        if (r === 'late') {
          shopDay.late = true; shopDay.closeAt = CLOSE + LATE_HOUR;
          Sound.music('dusk');
          S.tired = dayNum() + 1; // the next shop day
          addLateShoppers();
          continue;
        }
        shopDay.closing = true;
        const gone = await turnAway(false);
        const late = pending.filter(c => !mustServe(c));
        pending = pending.filter(mustServe);
        for (const c of late) if (c.type === 'wanted' && c.returning && dayNum() < WEEKS * 5) S.wants.push({ ...c, actor: undefined, due: dayNum() + 1 });
        for (const c of pending) c.at = shopDay.clock; // the must-serves slip in as you turn the sign
        if (gone) log(`Closed with ${gone} still waiting`);
        continue;
      }
    }
    if (queue.length) { await serveNext(); if (checkLose()) break; continue; }
    if (shopDay.closing) { if (!pending.length) break; continue; }
    const next = Math.min(shopDay.closeAt, pending.length ? enterAt(pending[0]) : Infinity, ...browsers.map(b => b.at), ...events.filter(e => !e.done).map(e => e.at));
    await idleUntil(Math.max(next, shopDay.clock));
  }
  pending = [];
  for (const c of browsers) removeActor(c.actor);
  browsers = [];
  view.queueLeft = null;
  setClock(null);
  view.timeOfDay = shopDay.late ? 0.9 : 0.85;
  // tomorrow's outing, so it can be planned for
  const t = dayNum() < WEEKS * 5 && outingOn(dayNum() + 1);
  if (t && !S.over) toast(`Tomorrow: ${t.title}, ${t.where}, ${clockText(t.at)}.`, null, 'letter');
}

// ================================================================ mornings
HOOKS.morning.push(async () => {
  if (S.run && !S.run.outings) planOutings(S.run); // new runs, and runs saved before outings
  if (S.tired === dayNum()) {
    S.loupe = Math.max(1, S.loupe - 1);
    renderPanel();
    toast('You stayed open late last night. Your eyes are tired: one less use of the loupe today.', null, 'letter');
  }
  const o = outingOn(dayNum());
  if (o) toast(`Today: ${o.title}, ${o.where}, ${clockText(o.at)}.`, null, 'letter');
});
