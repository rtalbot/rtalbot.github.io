// Pawn Champ - stolen goods after the sale, and the security camera over the shelves.
// Design: docs/STOLEN.md. Loaded after js/secrets.js (it adds a hotspot to HOTSPOTS) and uses
// game.js globals (S, CAST, say, enterActor, leaveShop, change, showModal, toast, dayNum).
//
// What's here:
// - "Fresh" thefts: stolen goods whose owner's mark is still on them but whose notice isn't
//   posted until next Monday. If you've read the mark, the new list tells you what you bought.
// - Stock that turns out to be stolen can be reported (Barrow collects it next morning), hidden
//   in the back (off display, a raid may still find it) or fenced through Wren as before.
// - The camera: dead at the start (a $15 cable), then on or off. While it's on and in good order
//   it tapes everyone who comes to the counter, and the recorder keeps five shop days.
//   Barrow can name a seller from the tape. Quests ask the tape with cameraFind() (BATCHES.md).
'use strict';

// ================================================================ numbers (docs/STOLEN.md#numbers)
const CAMERA = {
  fixCost: 15,        // a new cable
  faultChance: 0.08,  // each morning it's on, the old recorder may stop taping until you jiggle it
  loopDays: 5         // the recorder tapes over anything older than this
};
const STOLEN = {
  fresh: 0.2,         // share of stolen goods that aren't on a notice yet (listed 55%, filed 25%)
  hideFind: 0.4,      // a raid finds each hidden listed item this often (never with the back-room safe)
  hiddenFine: 25,     // a hidden item found in a raid costs more than one on the shelf (15)
  hiddenHeat: 6,      // and adds this much heat on top
  reward: { listed: 25, filed: 12 },   // when the tape names the seller, as at the counter
  named: { rep: 4, heat: -8 },         // reported, and the tape names the seller
  faceless: { rep: 2, heat: -4 }       // reported, but nobody to go after
};

// ================================================================ state
function cam() {
  if (!S.camera) S.camera = { state: 'dead', fault: false, tape: [], faults: 0 };
  return S.camera;
}
function freshThefts() { if (!S.fresh) S.fresh = []; return S.fresh; }

// ================================================================ the camera, for quests
// cameraWorking(): fixed. cameraRecording(): fixed, switched on and in good order.
function cameraWorking() { return !!(S && cam().state !== 'dead'); }
function cameraRecording() { return !!(S && cam().state === 'on' && !cam().fault); }
// The tape: everyone who came to the counter while it was recording, the last CAMERA.loopDays days.
// Entries: { day, at (shop minutes), name, type ('seller', 'story', ...), cast (CAST key or null), item }
function cameraTape(pred) { return S ? cam().tape.filter(e => e.day > dayNum() - CAMERA.loopDays && (!pred || pred(e))) : []; }
// Ask the tape a question. Returns { entry } with the latest match, or { why } saying why not:
// 'dead' (never fixed), 'gap' (it wasn't recording then), 'overwritten' (too long ago) or 'none'.
// Pass day to ask about one day ("who came in on Tuesday?"), so 'gap' and 'overwritten' can be told apart.
function cameraFind(pred, day) {
  const c = cam();
  if (c.state === 'dead' && !c.tape.length) return { why: 'dead' };
  if (day !== undefined && day <= dayNum() - CAMERA.loopDays) return { why: 'overwritten' };
  const hits = cameraTape(e => (day === undefined || e.day === day) && pred(e));
  if (hits.length) return { entry: hits[hits.length - 1] };
  if (day !== undefined && !(c.days || []).includes(day)) return { why: 'gap' };
  return { why: 'none' };
}
// A quest can put something on the tape that never came to the counter (a figure at the window
// after closing). Only lands if the camera is recording right now. Returns true if it did.
function cameraNote(entry) {
  if (!cameraRecording()) return false;
  cam().tape.push({ day: dayNum(), at: typeof shopDay !== 'undefined' && shopDay.clock ? Math.round(shopDay.clock) : 0, type: 'note', cast: null, item: null, ...entry });
  return true;
}
function tapeWhen(e) { return `${DAYS[(e.day - 1) % 5]}${e.at ? ', ' + clockText(e.at) : ''}`; }

// everyone who steps up to the counter goes on the tape
const runCustomerBeforeCamera = runCustomer;
runCustomer = async function (c) {
  if (cameraRecording() && c && c.name) {
    const k = cam();
    k.tape.push({ day: dayNum(), at: typeof shopDay !== 'undefined' && shopDay.clock ? Math.round(shopDay.clock) : 0,
      name: c.name, type: c.type, cast: c.cast || null, item: c.item ? c.item.name : null });
    k.days = k.days || [];
    if (!k.days.includes(dayNum())) k.days.push(dayNum());
  }
  return runCustomerBeforeCamera(c);
};

// the light: blinking when it tapes, steady when the recorder has stuck, dark when it's off
function cameraLed(now) {
  if (!S || !S.camera || S.camera.state !== 'on') return false;
  return S.camera.fault ? true : Math.floor(now / 900) % 2 === 1;
}

// ================================================================ the hotspot
HOTSPOTS.push({ id: 'camera', rect: () => ({ x: 594, y: 22, w: 26, h: 18 }), click: clickCamera });

async function clickCamera() {
  const c = cam();
  Sound.blip();
  if (c.state === 'dead') {
    const i = await showModal(`<h2>The security camera</h2>
      <p>Odile's camera, up over the shelves. The light is dark. Its cable hangs loose behind the bracket, chewed clean through.
      ${catName(true)} looks innocent.</p><p class="muted">A new cable from the hardware store on Water Street is ${money(CAMERA.fixCost)}.
      Once it works, it tapes whoever comes to the counter, and the recorder keeps ${CAMERA.loopDays} days.</p>`,
    [{ label: `Fix it (${money(CAMERA.fixCost)})`, disabled: S.coin < CAMERA.fixCost }, { label: 'Leave it' }]);
    if (i !== 0) return;
    change('coin', -CAMERA.fixCost, 'Bought a new cable for the camera');
    c.state = 'on'; c.fault = false;
    toast('You run the new cable and the little red light starts to blink. Everyone who comes to the counter is on tape now.', null, 'camera');
    return;
  }
  const tape = cameraTape();
  const status = c.state === 'off' ? 'Switched off. The light is dark.'
    : c.fault ? 'The light has stopped blinking and just glows. The old recorder has stuck, and it isn\'t taping.'
      : 'On. The light blinks, and everyone who comes to the counter goes on tape.';
  const btns = [
    c.state === 'off' ? { label: 'Switch it on', value: 'on' } : c.fault ? { label: 'Jiggle the cable', value: 'fix' } : { label: 'Switch it off', value: 'off' },
    { label: 'Watch the tape', value: 'tape', disabled: !tape.length },
    { label: 'Close', value: 'close' }];
  const v = await showModal(`<h2>The security camera</h2><p>${status}</p>
    <p class="muted">Wren won't deal in front of it. Captain Barrow likes it a lot.</p>`, btns);
  if (v === 'on') { c.state = 'on'; c.fault = false; toast('The red light blinks again.', null, 'camera'); }
  else if (v === 'off') { c.state = 'off'; toast('You switch the camera off. The light goes dark.', null, 'camera'); }
  else if (v === 'fix') { c.fault = false; Sound.stamp(); toast('You reach up and jiggle the cable. The light starts blinking again.', null, 'camera'); }
  else if (v === 'tape') await tapeModal();
}

function tapeModal() {
  const days = [...new Set(cameraTape().map(e => e.day))].sort((a, b) => b - a);
  const html = days.map(d => `<h3>${DAYS[(d - 1) % 5]}${d === dayNum() ? ' (today)' : ''}</h3><table>${cameraTape(e => e.day === d)
    .map(e => `<tr><td class="muted">${e.at ? clockText(e.at) : ''}</td><td>${esc(e.name)}</td><td class="muted">${e.item ? esc(e.item) : ''}</td></tr>`).join('')}</table>`).join('');
  return showModal(`<h2>The tape</h2><p class="muted">Grainy, from above, and the recorder only keeps ${CAMERA.loopDays} days. But you can see faces.</p>${html}`);
}

// ================================================================ stolen goods in stock
// You know it's stolen once the loupe has shown a listed mark or a filed-off engraving.
function knownStolen(it) { return !!(it && (it.knownHot || (it.inspected && it.filed && it.stolen))); }
// story items are the story's business, not Barrow's
function canDealWith(it) { return knownStolen(it) && !it.held && !it.unique && !it.questKey && !it.curio && !it.secret; }

function reportItem(it) {
  it.backroom = 'reported'; it.nosale = true; it.spot = -1;
  log(`Reported the ${it.name.toLowerCase()} to the police`);
  toast(`You call Captain Barrow about the ${it.name.toLowerCase()}. She'll come by for it first thing tomorrow.`, CAST.barrow.look);
  renderPanel();
}
function hideItem(it) {
  it.backroom = 'hidden'; it.nosale = true; it.spot = -1;
  toast(`You wrap the ${it.name.toLowerCase()} in a towel and put it in the back${hasUpgrade('safe') ? ', in the safe' : ''}.`, null, it.icon);
  renderPanel();
}
function unhideItem(it) {
  it.backroom = null; it.nosale = false; it.spot = undefined;
  renderPanel();
}
// Stock window: the notes and buttons for one item (used by stockModal in game.js)
function stolenTags(it) {
  if (it.backroom === 'reported') return '<span class="muted">Barrow collects it tomorrow</span>';
  if (it.backroom === 'hidden') return `<span class="bad">hidden in the back${hasUpgrade('safe') ? ' (in the safe)' : ''}</span>`;
  if (it.inspected && it.filed && it.stolen && !it.knownHot) return '<span class="bad">stolen (crest filed off)</span>';
  return '';
}
function stolenButtons(it) {
  if (!canDealWith(it) || it.backroom === 'reported') return '';
  return `<br><button data-report="${it.uid}">Report it</button> ` +
    (it.backroom === 'hidden' ? `<button data-unhide="${it.uid}">Put it out</button>` : `<button data-hide="${it.uid}">Hide it</button>`);
}
function wireStolenButtons(box, rerender) {
  const find = b => S.stock.find(i => i.uid === +b.dataset[Object.keys(b.dataset)[0]]);
  box.querySelectorAll('[data-report]').forEach(b => b.onclick = () => { reportItem(find(b)); rerender(); });
  box.querySelectorAll('[data-hide]').forEach(b => b.onclick = () => { hideItem(find(b)); rerender(); });
  box.querySelectorAll('[data-unhide]').forEach(b => b.onclick = () => { unhideItem(find(b)); rerender(); });
  box.querySelectorAll('[data-look]').forEach(b => b.onclick = () => {
    const it = find(b);
    inspect(it);
    if (knownStolen(it)) toast(it.knownHot ? `The ${it.name.toLowerCase()} bears ${it.mark}. It's on Barrow's list.` : `Someone filed the engraving off the ${it.name.toLowerCase()}. It's stolen.`, null, it.icon);
    rerender();
  });
}
// who sold or pawned it, for the tape (buyItem and grantLoan in game.js)
function noteSeller(it, c) { it.from = { name: c.name, day: dayNum(), cast: c.cast || null }; }

// ================================================================ Barrow comes for what you reported
async function barrowCollects() {
  const items = S.stock.filter(i => i.backroom === 'reported');
  if (!items.length) return;
  const b = await enterActor(CAST.barrow.look, CAST.barrow.name);
  await say(b, items.length > 1 ? `You called about some stolen goods. ${items.length} things. Let's have them.` : `You called about a ${items[0].name.toLowerCase()}. Let's have it.`);
  S.stock = S.stock.filter(i => !items.includes(i));
  for (const it of items) {
    S.flags.reports++;
    freshThefts().splice(0, freshThefts().length, ...freshThefts().filter(f => f.uid !== it.uid));
    const seen = it.from ? cameraFind(e => e.name === it.from.name, it.from.day) : { why: 'unknown' };
    if (seen.entry) {
      const reward = it.filed && !it.noticeId ? STOLEN.reward.filed : STOLEN.reward.listed;
      Sound.good();
      await say(b, `And here's who brought it in, on your tape: ${it.from.name}, ${tapeWhen(seen.entry)}. We know where to find them.`);
      await say(b, `Good work. ${money(reward)} for your trouble.`);
      change('coin', reward, `The police paid a reward for ${it.from.name}`);
      change('rep', STOLEN.named.rep); change('heat', STOLEN.named.heat);
      S.stats.thieves++;
    } else {
      const line = {
        dead: 'Shame about that camera over your shelves. If it worked, I\'d have a face to go with this.',
        gap: 'Your camera wasn\'t taping the day it came in. Pity. I\'d have liked a face.',
        overwritten: 'Your recorder\'s already taped over the day it came in. Call sooner next time.',
        none: 'Nobody on your tape that fits. Still, thanks for being straight with me.',
        unknown: 'No telling where this one came from. Still, thanks for being straight with me.'
      }[seen.why] || 'Thanks for being straight with me.';
      await say(b, line);
      change('rep', STOLEN.faceless.rep); change('heat', STOLEN.faceless.heat);
    }
  }
  log(`Captain Barrow collected ${items.length > 1 ? items.length + ' reported items' : 'the ' + items[0].name.toLowerCase()}`);
  await leaveShop(b);
}

// ================================================================ fresh thefts reach the list
// Called by genSeller (game.js): a stolen item whose notice comes out next Monday.
function freshTheft(key) {
  const used = usedMarks();
  const pool = MARKS.filter(m => !used.includes(m));
  if (!pool.length) return null;
  const mark = pick(pool), owner = pick(OWNERS);
  const it = makeItem(key, { stolen: true, mark });
  it.fresh = true;
  freshThefts().push({ uid: it.uid, key, mark, owner, week: S.week });
  return it;
}
function postFresh() {
  const due = freshThefts().filter(f => f.week < S.week);
  if (!due.length) return;
  S.fresh = freshThefts().filter(f => f.week >= S.week);
  const spotted = [];
  for (const f of due) {
    const n = { id: S.uid++, week: S.week, key: f.key, mark: f.mark, owner: f.owner };
    S.notices.push(n);
    const it = S.stock.find(i => i.uid === f.uid);
    if (!it) continue;
    it.noticeId = n.id;
    if (it.inspected) { it.knownHot = true; spotted.push(it); }
  }
  for (const it of spotted) toast(`Barrow's new list has ${it.mark} on it, stolen from ${S.notices.find(n => n.id === it.noticeId).owner}. That's the ${it.name.toLowerCase()} on your shelf.`, CAST.barrow.look);
}

// ================================================================ raids: what's hidden
// Called by the raid in morning() (game.js) with the listed goods in stock. Returns what Barrow finds.
function raidFinds(hot) {
  return hot.filter(i => i.backroom !== 'reported' && (i.backroom !== 'hidden' || (!hasUpgrade('safe') && Math.random() < STOLEN.hideFind)));
}
function raidFine(found) { return found.reduce((t, i) => t + (i.backroom === 'hidden' ? STOLEN.hiddenFine : 15), 0); }

// ================================================================ the day
HOOKS.morning.push(async () => {
  const c = cam();
  c.tape = c.tape.filter(e => e.day > dayNum() - CAMERA.loopDays);
  c.days = (c.days || []).filter(d => d > dayNum() - CAMERA.loopDays);
  if (c.state === 'on' && !c.fault && dayNum() > 1 && Math.random() < CAMERA.faultChance) {
    c.fault = true; c.faults++;
    if (c.faults === 1) toast('The light on the camera has stopped blinking. Odile\'s old recorder does that. It wants a jiggle.', null, 'camera');
  }
  // the camera is pointed to once, by Barrow, before it matters (SECRETS.md rule 2)
  if (dayNum() === 5 && c.state === 'dead' && !S.flags.cameraHint) {
    S.flags.cameraHint = true;
    toast('Captain Barrow, passing the window, points up at the dead camera over your shelves: "Get that working. A face on tape does half my job."', CAST.barrow.look);
  }
  if (S.day === 1) postFresh();
  await barrowCollects();
});

window.__stolen = { cam, cameraFind, cameraTape, cameraNote, cameraRecording, knownStolen, reportItem, hideItem, postFresh, barrowCollects, raidFinds, clickCamera, freshTheft };
