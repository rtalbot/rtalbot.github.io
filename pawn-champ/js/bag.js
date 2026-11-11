// Pawn Champ - the bag: taking things out of the shop and using them in scenes.
// Design: docs/ITEMS_IN_USE.md. Loaded after js/wander.js, before the quests.
//
// When you go out (an errand, an outing, tonight's plans) you can pack two things from stock.
// Things have tags, which are verbs (dig, light, pry...). Scenes ask for a tag, not an item:
//   if (carrying('light')) ...                       // something packed has it
//   const it = useItem('pry', { hard: true });       // use the best one; it may come back worse
//   await choose(['Wait', { label: 'Dig where the sand is soft', needs: 'dig' }]);
//   addSceneSpot('sandbar', { id: 'post', rect, needs: 'dig', without: '...', use: { line: '...', find: { coin: 15 } } });
//   addCalendar({ ..., bring: ['dig', 'light'] });   // the hear-first line on the calendar
//   addUnique('clamRake', { ..., tags: ['dig'] });   // or { dig: 'proper', cut: 'makeshift' }
//   addUnique('brassKey', { ..., pocket: true });    // small things travel free
//   questErrand({ ..., takes: ['urnBronze'] });      // the errand's own things travel free too
// On by default (FEATURES.bag); ?bag=0 switches it off for a session. With it off, nothing is packed, carrying() is
// false, choices that need a tag are hidden (their indices still map), and carried(id) means
// "in stock", as scenes have always assumed.
'use strict';

(function () {
  try { const v = new URLSearchParams(location.search).get('bag'); if (v === '1' || v === '0') FEATURES.bag = v === '1'; } catch (e) { /* no URL */ }
})();
function bagOn() { return !!FEATURES.bag; }

const BAG = {
  slots: 2,               // a third from the duffel upgrade
  wear: { proper: 0.1, makeshift: 0.5 },
  breakHard: 0.15,         // a makeshift tool on a hard job
  toolShare: 0.125         // of trade items (pickTradeKey in js/game.js)
};

// what each tag means, for hints ("If you'd brought something to dig with...")
const TAGS = {
  dig: 'something to dig with', detect: 'something to find metal with', light: 'a light',
  pry: 'something to pry with', cut: 'something to cut with', climb: 'a rope', unlock: 'a way through a lock',
  play: 'something that plays', photo: 'a camera', record: 'something to record on', call: 'a whistle or a bell',
  'find-way': 'a compass', 'see-far': 'something to see a long way with', time: 'a watch',
  warm: 'something warm', wade: 'boots', fix: 'some tools', silver: 'some real silver', gift: 'something to give',
  read: 'something to read small print with'
};

// staples: proper (made for it) or makeshift (it works, but it's harder on the thing)
const STAPLE_TAGS = {
  spade: { dig: 'proper' }, flashlight: { light: 'proper' }, prybar: { pry: 'proper' }, boltcutters: { cut: 'proper' },
  rope: { climb: 'proper' }, boots: { wade: 'proper' }, toolbox: { fix: 'proper' }, detector: { detect: 'proper' },
  dagger: { pry: 'makeshift', cut: 'makeshift', dig: 'makeshift', fix: 'makeshift' },
  candlestick: { light: 'makeshift' }, goblet: { dig: 'makeshift' },
  compass: { 'find-way': 'proper', detect: 'makeshift' }, spyglass: { photo: 'proper', 'see-far': 'makeshift' },
  watch: { time: 'proper' }, musicbox: { play: 'makeshift' }, lute: { play: 'proper' }, tome: { read: 'makeshift' }
};
const GIFT_CATS = ['jewelry', 'art', 'instrument'];
// tags for uniques that already exist (a quest's own addUnique({ tags }) wins). docs/ITEMS_IN_USE.md#tags
const UNIQUE_TAGS = {
  hurricaneLamp: ['light'], tourLantern: ['light'], wetLantern: ['light'], blueLantern: ['light'],
  dutchDetector: { detect: 'proper', dig: 'makeshift' }, clamRake: ['dig'], bogScoop: { dig: 'makeshift' },
  lockpicks: ['unlock'], caretakerKeys: { unlock: 'makeshift' }, vhfRadio: { play: 'makeshift', call: 'makeshift' },
  bwDeck: ['play', 'record'], camcorder: ['photo', 'record'], answeringMachine: { record: 'makeshift' },
  halvorsenScope: ['see-far'], benchLoupe: ['read'], fieldBook: { 'find-way': 'makeshift' },
  wetStone: { call: 'makeshift' }, wetBell: ['call'], brineBell: ['call'], bwJacket: ['warm']
};
const addUniqueBeforeBag = addUnique;
addUnique = function (id, u) { return addUniqueBeforeBag(id, UNIQUE_TAGS[id] && !u.tags ? { ...u, tags: UNIQUE_TAGS[id] } : u); };

// the duffel: one more slot, from the weekend upgrades
if (bagOn()) {
  UPGRADES.duffel = { name: 'A proper duffel bag', cost: 30, tier: 0, icon: '\u{1F45C}', bagSlots: 1,
    text: 'One more thing to take with you when you go out: three instead of two.' };
  CATS.tools = 'some decent tools, nothing fancy';
}
function bagSlots() { return BAG.slots + (S && S.upgrades && S.upgrades.duffel ? 1 : 0) + (typeof hasCard === 'function' && hasCard('goodBag') ? 1 : 0); }

// ---------------------------------------------------------------- difficulty (docs/ITEMS_IN_USE.md)
// Hints for a missing tag: always on Easy, the first two a run on Normal, never on Hard.
function difficulty() { return (S && S.difficulty) || 'normal'; }
const HINTS_BY_MODE = { easy: Infinity, normal: 2, hard: 0 };
const WEAR_BY_MODE = { easy: 1, normal: 1, hard: 2 };

// ---------------------------------------------------------------- state
function bagState() {
  if (!S.bag) S.bag = { packed: [], last: [], takes: [], hints: 0, gifts: {}, report: [], out: false, where: '' };
  return S.bag;
}
const byUid = uid => S.stock.find(i => i.uid === uid);
// what a flea-market table can take: ordinary stock, nothing promised to anyone
function fleaSellable(it) { return !it.held && !it.nosale && !it.curio && !it.unique && !it.noticeId && !it.questKey; }
function packedItems() { return S && S.bag ? S.bag.packed.map(byUid).filter(Boolean) : []; }

// ---------------------------------------------------------------- tags
// The tags an item really has. A fake candlestick isn't silver and a fake camera takes no photos;
// a fake tool is only makeshift. `shown` uses what the player knows instead of the truth.
function itemTagMap(it, shown) {
  const fake = shown ? it.knownFake : it.fake;
  const out = {};
  const ud = it.uniqueId ? UNIQUES[it.uniqueId] : null;
  const base = ud ? ud.tags : STAPLE_TAGS[it.key];
  if (Array.isArray(base)) base.forEach(t => { out[t] = 'proper'; });
  else if (base) Object.assign(out, base);
  if (it.cat === 'silver' && !fake) out.silver = 'proper';
  if (!it.broken) out.gift = GIFT_CATS.includes(it.cat) || it.cat === 'curio' ? 'proper' : 'makeshift';
  if (fake) {
    delete out.silver; delete out.photo; delete out.time;
    for (const k of Object.keys(out)) if (out[k] === 'proper' && k !== 'gift') out[k] = 'makeshift';
  }
  if (it.broken) for (const k of Object.keys(out)) delete out[k];
  return out;
}
function hasTag(it, tag, shown) { return !!itemTagMap(it, shown)[tag]; }
function tagList(it, shown) { return Object.keys(itemTagMap(it, shown)).filter(t => t !== 'gift'); }

// ---------------------------------------------------------------- asking about the bag
// friends who stand in for a tag (js/standing.js, later): functions (tag) => { name } or null
const BAG_HELPERS = [];
function carrying(tag) {
  if (!bagOn() || !S) return false;
  const packed = packedItems();
  if (packed.some(it => hasTag(it, tag))) return true;
  if (BAG_HELPERS.some(h => h(tag))) return true;
  // you packed it for this, and it turned out not to be what it looked like
  for (const it of packed) if (hasTag(it, tag, true)) { const st = bagState(); st.fakeMiss = st.fakeMiss || []; if (!st.fakeMiss.includes(it.uid)) st.fakeMiss.push(it.uid); }
  return false;
}
// that exact unique is with you: packed, in your pocket, or one of the errand's own things.
// With the bag off it means "in stock", which is what scenes have always assumed.
function carried(uniqueId) {
  const it = S.stock.find(i => i.uniqueId === uniqueId);
  if (!it) return false;
  if (!bagOn() || !bagState().out) return true;
  const ud = UNIQUES[uniqueId] || {};
  return ud.pocket || S.bag.takes.includes(uniqueId) || S.bag.packed.includes(it.uid);
}
// A scene that used to reach into the whole shop for something (any silver, any instrument) asks
// the bag instead while you're out with it on; otherwise, as before, the shop's stock.
function fromBag(pred) {
  if (bagOn() && S.bag && S.bag.out) return packedItems().find(x => !x.questKey && pred(x)) || null;
  return S.stock.find(x => !x.held && !x.nosale && pred(x)) || null;
}
function bagWord() { return bagOn() && S.bag && S.bag.out ? 'in your bag' : 'on your shelves'; }
// in the shop after hours everything is at hand
function stockHas(tag) { return !!S && S.stock.some(it => !it.held && hasTag(it, tag)); }

// the best packed thing for a tag: proper before makeshift, then the cheaper one
function bestFor(tag) {
  const cands = packedItems().filter(it => hasTag(it, tag));
  cands.sort((a, b) => (itemTagMap(a)[tag] === 'proper' ? 0 : 1) - (itemTagMap(b)[tag] === 'proper' ? 0 : 1) || a.guide - b.guide);
  return cands[0] || null;
}

// Use the best packed thing with the tag. It may come back worn, or broken on a hard job;
// `lose: true` means the scene keeps it (the tide took it). Uniques only change if the scene
// says so. Returns the item, or null if nothing packed has the tag.
function useItem(tag, o = {}) {
  if (!bagOn()) return null;
  const it = bestFor(tag);
  if (!it) return null;
  const st = bagState();
  if (o.lose) { removeFromStock(it); st.report.push(`The ${it.name.toLowerCase()} didn't come back.`); return it; }
  if (it.unique) return it;
  const grade = itemTagMap(it)[tag];
  const mult = WEAR_BY_MODE[difficulty()] || 1;
  if (o.hard && grade === 'makeshift' && Math.random() < BAG.breakHard * mult) { breakItem(it); st.report.push(`The ${it.name.toLowerCase()} broke. Sal might give you something for it.`); return it; }
  const p = (o.wear !== undefined ? o.wear : BAG.wear[grade] || 0.1) * mult;
  if (Math.random() < p && it.cond > 0) { wearItem(it); st.report.push(`The ${it.name.toLowerCase()} came back the worse for it: now ${it.condLabel}.`); }
  return it;
}
function wearItem(it) {
  it.cond = Math.max(0, it.cond - 1);
  const c = CONDITIONS[it.cond];
  it.condLabel = c.label;
  if (ITEMS[it.key]) it.guide = Math.round(ITEMS[it.key].base * c.mult);
}
function breakItem(it) {
  it.broken = true; it.cond = 0; it.condLabel = 'Broken'; it.guide = Math.max(1, Math.round(it.guide * 0.2));
}
function removeFromStock(it) {
  S.stock = S.stock.filter(x => x !== it);
  if (S.bag) S.bag.packed = S.bag.packed.filter(u => u !== it.uid);
  if (typeof placeStock === 'function') placeStock(S.stock);
  renderPanel();
}

// ---------------------------------------------------------------- gifts
// Open the bag to give someone something. Returns { item, liked } or null. Once a week each:
// a second gift in the same week is still given, but `again` is true and standing doesn't move.
async function giveFromBag(who, o = {}) {
  if (!bagOn()) return null;
  const st = bagState();
  const cands = packedItems().filter(it => !it.questKey && hasTag(it, 'gift'));
  if (!cands.length) return null;
  const i = await choose([...cands.map(it => ({ label: `Give the ${it.name.toLowerCase()}`, icon: it.icon })), 'Keep it']);
  if (i === cands.length) return null;
  const it = cands[i];
  removeFromStock(it);
  const key = typeof who === 'string' ? who : (who && who.name) || '?';
  const week = Math.ceil(dayNum() / 5);
  const again = st.gifts[key] === week;
  st.gifts[key] = week;
  const liked = !!o.likes && (Array.isArray(o.likes) ? o.likes : [o.likes]).includes(it.cat);
  const sharpFake = it.knownFake && o.sharp;
  // gifts are soft standing (js/standing.js): they warm someone up, but a friend is made by deeds
  if (!again && typeof shiftStanding === 'function') shiftStanding(key, sharpFake ? -2 : liked ? 2 : 1, sharpFake ? 'gave them a fake' : 'a gift', true);
  return { item: it, liked, again, fake: !!it.fake };
}

// ---------------------------------------------------------------- choices that need a tag
// { label, needs: 'pry', hint } in choose(). Carrying it: the option is there, with the item's
// icon. Not carrying it: greyed with a hint while the run's hints last (by difficulty), else
// hidden. Hidden options keep their index, so scenes don't change. `hidden: true` hides any option.
const chooseBeforeBag = choose;
choose = function (options) {
  const opts = options.map(o => typeof o === 'string' ? { label: o } : o);
  if (!opts.some(o => o.needs || o.hidden)) return chooseBeforeBag(options);
  const map = [], shown = [];
  let hinted = false;
  opts.forEach((o, i) => {
    if (o.hidden) return; // kept for its index, never shown
    if (!o.needs) { map.push(i); shown.push(o); return; }
    const it = bagOn() ? bestFor(o.needs) : null;
    if (it || carrying(o.needs)) { map.push(i); shown.push({ ...o, icon: it ? it.icon : 'bag', hint: o.hint || (it ? `your ${it.name.toLowerCase()}` : undefined) }); return; }
    if (bagOn() && bagState().hints < (HINTS_BY_MODE[difficulty()] ?? 2)) {
      map.push(i); hinted = true;
      shown.push({ ...o, disabled: true, needs: undefined, hint: o.without || `If you'd brought ${TAGS[o.needs] || o.needs}...` });
    }
  });
  if (hinted) bagState().hints++;
  return chooseBeforeBag(shown).then(j => map[j]);
};

// ---------------------------------------------------------------- packing
// Opens the bag screen. info: { where, title, bring: [tags], takes: [uniqueIds] }. Returns when you go.
function bagCandidates() {
  return S.stock.filter(it => !it.held && !(it.uniqueId && (UNIQUES[it.uniqueId] || {}).carry === false));
}
async function packBag(info = {}) {
  if (!bagOn() || !S) return;
  const st = bagState();
  const slots = info.slots || bagSlots();
  const takes = (info.takes || []).filter(id => S.stock.some(i => i.uniqueId === id));
  const pocket = S.stock.filter(it => it.uniqueId && (UNIQUES[it.uniqueId] || {}).pocket);
  const bring = (info.bring || []).filter(t => TAGS[t]);
  let picked = st.last.filter(u => { const it = byUid(u); return it && !it.held && !takes.includes(it.uniqueId); }).slice(0, slots);
  const cands = bagCandidates().filter(it => !takes.includes(it.uniqueId) && !pocket.includes(it))
    .map(it => ({ it, tags: tagList(it, true), match: info.sell ? fleaSellable(it) : bring.some(t => hasTag(it, t, true)) }))
    .sort((a, b) => (b.match - a.match) || (info.sell ? b.it.guide - a.it.guide : 0) || (b.tags.length > 0) - (a.tags.length > 0) || a.it.guide - b.it.guide);
  const free = [...takes.map(id => S.stock.find(i => i.uniqueId === id).name), ...pocket.map(i => i.name)];
  const row = c => `<button class="bag-item${picked.includes(c.it.uid) ? ' on' : ''}${c.match ? ' match' : ''}" data-bag="${c.it.uid}" title="${esc(c.it.name)}">
      <img src="${iconURL(c.it.icon)}"><span class="nm">${esc(c.it.name)}${c.it.knownHot ? ' <b class="bad">HOT</b>' : ''}${c.it.knownFake ? ' <b class="bad">FAKE</b>' : ''}</span>
      <span class="tags">${c.tags.map(t => `<i>${esc(t)}</i>`).join('') || '<span class="muted">-</span>'}</span></button>`;
  const html = () => `<h2><img src="${iconURL('bag')}" class="h-ico"> Take anything?</h2>
    <p>${esc(info.title || 'Going out')}${info.where ? ` · ${esc(info.where)}` : ''}${bring.length ? `<br><b>Bring:</b> ${esc(bring.map(t => TAGS[t]).join(', '))}.` : ''}${info.note ? `<br>${esc(info.note)}` : ''}</p>
    <p class="muted">Room for ${slots} thing${slots === 1 ? '' : 's'} (${picked.length} packed). They come back with you, maybe a little worse for it.${free.length ? ` With you anyway: ${esc(free.join(', '))}.` : ''}</p>
    <div class="bag-list">${cands.map(row).join('') || '<p class="muted">Nothing in stock you could carry.</p>'}</div>`;
  await showModal(html(), [{ label: 'Go' }, { label: 'Go empty-handed', value: 'empty' }], (box) => {
    const wire = () => box.querySelectorAll('[data-bag]').forEach(b => {
      b.onclick = () => {
        const u = +b.dataset.bag;
        if (picked.includes(u)) picked = picked.filter(x => x !== u);
        else if (picked.length < slots) picked.push(u);
        else picked = [...picked.slice(1), u];
        const act = box.querySelector('.actions');
        box.querySelectorAll('h2, p, .bag-list').forEach(e => e.remove());
        act.insertAdjacentHTML('beforebegin', html());
        wire();
      };
    });
    wire();
  }).then(v => { if (v === 'empty') picked = []; });
  st.packed = picked; st.last = picked.slice(); st.takes = takes; st.out = true; st.where = info.where || ''; st.report = []; st.fakeMiss = [];
}
// Back at the shop: anything that changed gets one toast each.
async function unpackBag() {
  if (!bagOn() || !S || !S.bag || !S.bag.out) return;
  const st = S.bag;
  for (const line of st.report) toast(line, null, 'bag');
  for (const it of (st.fakeMiss || []).map(byUid).filter(Boolean)) toast(`The ${it.name.toLowerCase()} wasn't what it looked like. Worth a closer look.`, null, it.icon);
  st.packed = []; st.takes = []; st.out = false; st.report = []; st.fakeMiss = [];
  renderPanel();
}

// ---------------------------------------------------------------- where you pack
// Errands and outings pack at the door (goOut gets their info); tonight's plans pack at closing.
let bagNextInfo = null; // set by runErrand for the goOut it makes
const goOutBeforeBag = goOut;
goOut = async function (minutes, scene, info) {
  info = info || bagNextInfo || outingInfo();
  if (!bagOn() || !info || info.bag === false) return goOutBeforeBag(minutes, scene);
  await packBag(info);
  try { return await goOutBeforeBag(minutes, scene); } finally { await unpackBag(); }
};
const runNightsBeforeBag = runNights;
runNights = async function () {
  if (!bagOn()) return runNightsBeforeBag();
  const tonight = calendarFor(S.week, S.day).filter(e => e.night && e.scene && !calendarSeen(e.id));
  if (!tonight.length) return runNightsBeforeBag();
  const nights = typeof scheduledTonight === 'function' ? scheduledTonight() : [];
  await packBag({
    title: `Tonight: ${tonight.map(calTitle).join(', ')}`, where: tonight[0].where,
    bring: [...new Set(tonight.flatMap(e => e.bring || []))],
    takes: [...new Set([...nights.flatMap(n => n.takes || []), ...tonight.flatMap(e => e.takes || [])])]
  });
  try { return await runNightsBeforeBag(); } finally { await unpackBag(); }
};
// errands and outings tell goOut where they're going
const runErrandBeforeBag = runErrand;
runErrand = async function (e) {
  if (!bagOn()) return runErrandBeforeBag(e);
  const cal = CALENDAR.find(c => c.placed === e.id && c.placedIn === 'errands');
  bagNextInfo = { where: e.where, title: e.title, bring: e.bring || (cal && cal.bring) || [], takes: e.takes || [], bag: e.bag };
  try { return await runErrandBeforeBag(e); } finally { bagNextInfo = null; }
};
function outingInfo() {
  const o = bagOn() && typeof outingOn === 'function' && S && S.run ? outingOn(dayNum()) : null;
  return o ? { where: o.where, title: o.title, bring: o.bring || [], bag: o.bag, slots: o.slots, sell: o.sell, note: o.note } : undefined;
}

// ---------------------------------------------------------------- the Stock window and calendar
const itemTagsBeforeBag = itemTags;
itemTags = function (it) {
  const base = itemTagsBeforeBag(it);
  if (!bagOn()) return base;
  const t = tagList(it, true);
  const extra = [it.broken ? '<span class="bad">broken</span>' : '', t.length ? `<span class="muted">useful to ${esc(t.join(', '))}</span>` : ''].filter(Boolean);
  return [base, ...extra].filter(Boolean).join(' · ');
};
function bringText(tags) { return (tags || []).filter(t => TAGS[t]).map(t => TAGS[t]).join(', '); }
