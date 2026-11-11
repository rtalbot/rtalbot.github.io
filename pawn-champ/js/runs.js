// Pawn Champ - runs: which side stories this playthrough tells, its run code, and the Storybook
// that remembers what you've seen across playthroughs. Design: docs/quests/RUNS.md.
//
// Quests are defined with defineQuest() in js/sidestories.js (see js/game.js). A new game draws
// RUN_MAJORS of them from the run code; only their beats, hooks and calendar entries play.
'use strict';

const RUN_MAJORS = 3;
const QUEST_FAMILIES = ['uncanny', 'crime', 'town'];
const FAMILY_LABEL = { uncanny: 'Uncanny', crime: 'Crime', town: 'Town' };
// The first run a player starts is always this one (Rich's call, 2026-11-01). Quests that aren't
// built yet are skipped and the rest of the run is drawn as usual.
const FIRST_RUN = { seed: 'first-light', majors: ['hollis', 'psalter', 'twins'] };
const CROSSING_CHANCE = 0.5;
// A run may take a fourth major when it's a crossing partner from the same family as one already
// drawn (Rich, 2026-11-01): M5 + M10 at the Benefit Auction, M5 + M11 at Town Meeting. Uncanny
// stays at one a run (README decision 3), so only these families pair, plus the exceptions below.
const PAIR_CHANCE = 0.4;
const PAIR_FAMILIES = ['town', 'crime'];
// Pairs allowed even though they break the one-Uncanny rule (Rich, 2026-11-01): M3 Fog Week + M13
// The Widow's Walk, so the drowned husband can walk out of the fog.
const PAIR_EXCEPTIONS = [['fog', 'widow']];
function pairException(a, b) { return PAIR_EXCEPTIONS.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }
function questsCross(a, b) { return (QUESTS[a].crosses || []).includes(b) || (QUESTS[b].crosses || []).includes(a); }

// ---------------------------------------------------------------- run codes
const SEED_A = ['salt', 'fog', 'harbor', 'tide', 'brass', 'neon', 'gull', 'amber', 'iron', 'lantern', 'ferry', 'marsh',
  'copper', 'pier', 'storm', 'velvet', 'scallop', 'grey', 'ledger', 'moon', 'cedar', 'buoy', 'pewter', 'kelp'];
const SEED_B = ['lantern', 'anchor', 'compass', 'ticket', 'locket', 'bell', 'scale', 'clock', 'harpoon', 'spoon', 'chart',
  'ring', 'kettle', 'whistle', 'trophy', 'mirror', 'decoy', 'brooch', 'candle', 'reel', 'veil', 'globe', 'key', 'crown'];

function cleanSeed(s) { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40); }
function randomSeed() { return `${pick(SEED_A)}-${pick(SEED_B)}`; }

// A small seeded generator (mulberry32 on a string hash), so a run code always draws the same stories.
function seededRandom(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  let a = h >>> 0;
  return () => {
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- the draw
function majorQuests() { return Object.values(QUESTS).filter(q => q.kind === 'major').sort((a, b) => (a.id < b.id ? -1 : 1)); }

// Which months of a stay a quest can be drawn in (docs/SEASONS.md): `from: 2` keeps a story out of
// the first month, `months: [1]` keeps it to October (the Fog only comes in autumn). In a stay,
// `requires: () => bool` asks the game so far (how October ended, the shop's standing).
function questInMonth(q, month = 1) {
  if ((q.arc || q.sequel) && month === 1) return false; // chapters of a long arc or sequel (js/stay.js)
  return (q.from || 1) <= month && (!q.months || q.months.includes(month)) && (month === 1 || !q.requires || !!q.requires());
}

// Pure: the same run code always gives the same stories (for a given set of built quests).
// Later months of a stay draw again with `used` (every story already told this stay) left out.
function drawMajors(seed, used = [], month = 1, want = RUN_MAJORS) {
  const r = seededRandom(seed);
  const rpick = arr => arr[Math.floor(r() * arr.length)];
  const pool = majorQuests().filter(q => !q.arc && !q.sequel && !used.includes(q.id) && questInMonth(q, month));
  const picked = seed === FIRST_RUN.seed && month === 1 ? FIRST_RUN.majors.filter(id => QUESTS[id]) : [];
  const families = QUEST_FAMILIES.slice();
  for (let i = families.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [families[i], families[j]] = [families[j], families[i]]; }
  // crossings: half the time, later picks come from the first pick's crossing partners
  const preferCrossing = c => {
    const first = picked.length && QUESTS[picked[0]];
    if (!first || !first.crosses || r() >= CROSSING_CHANCE) return c;
    const x = c.filter(q => first.crosses.includes(q.id));
    return x.length ? x : c;
  };
  // one quest from each family
  for (const fam of families) {
    if (picked.length >= want) break;
    if (picked.some(id => QUESTS[id].family === fam)) continue;
    const c = pool.filter(q => q.family === fam && !picked.includes(q.id));
    if (c.length) picked.push(rpick(preferCrossing(c)).id);
  }
  // While some families have no quests built yet, the run is filled from whatever is left.
  while (picked.length < want) {
    const c = pool.filter(q => !picked.includes(q.id));
    if (!c.length) break;
    picked.push(rpick(preferCrossing(c)).id);
  }
  // the bonus pair: a same-family crossing partner of one of the three
  if ((seed !== FIRST_RUN.seed || month > 1) && r() < PAIR_CHANCE) {
    const partners = pool.filter(q => !picked.includes(q.id) && picked.some(id => questsCross(id, q.id)
      && (pairException(id, q.id) || (PAIR_FAMILIES.includes(q.family) && QUESTS[id].family === q.family))));
    if (partners.length) picked.push(rpick(partners).id);
  }
  return picked;
}

// Unseen stories first: weight 3 if never started, 1.5 if never finished, 1 otherwise.
// A story card in the hand doubles its quest's weight (js/cards.js; off with the flag).
function questWeight(book, id, hand) {
  const e = book.quests[id];
  const w = !e || !e.met ? 3 : !(e.endings && e.endings.length) ? 1.5 : 1;
  return w * (typeof handWeight === 'function' ? handWeight(hand, id) : 1);
}
// The run code is chosen from a dozen random ones, weighted by how new their stories are to this
// player. That keeps the draw itself a pure function of the code, so a code can be shared.
function chooseSeed(book, hand) {
  const cands = [];
  for (let i = 0; i < 12; i++) {
    const seed = randomSeed();
    const w = drawMajors(seed).reduce((m, id) => m * questWeight(book, id, hand), 1);
    cands.push({ seed, w });
  }
  let x = Math.random() * cands.reduce((s, c) => s + c.w, 0);
  for (const c of cands) { x -= c.w; if (x <= 0) return c.seed; }
  return cands[cands.length - 1].seed;
}

function makeRun(code, hand) {
  const book = loadBook();
  let seed = cleanSeed(code);
  if (!seed) seed = book.runs === 0 ? FIRST_RUN.seed : chooseSeed(book, hand);
  return planRun({ seed, majors: drawMajors(seed), met: {} });
}
// minors and the night schedule; also fills them in for a run saved before they existed
function planRun(run) {
  if (!run.minors) run.minors = drawMinors(run.seed, run.majors);
  if (!run.nights) run.nights = scheduleNights(run);
  if (!run.errands) run.errands = {};
  return run;
}

// ---------------------------------------------------------------- the Storybook (kept across runs)
const BOOK_KEY = 'pawnchamp-book-v1';
function loadBook() {
  try { const b = JSON.parse(localStorage.getItem(BOOK_KEY)); if (b && b.quests) return b; } catch (e) { /* ignore */ }
  return { runs: 0, quests: {} };
}
function saveBook(b) { try { localStorage.setItem(BOOK_KEY, JSON.stringify(b)); } catch (e) { /* storage may be blocked */ } }

// the ending each quest in this run reached, or null if it never got going
function runOutcomes() {
  if (!S.run) return [];
  return [...S.run.majors, ...(S.run.minors || [])].filter(id => QUESTS[id]).map(id => {
    const q = QUESTS[id];
    const met = !!(S.run.met && S.run.met[id]);
    const end = met && q.outcome ? q.outcome(S.flags) : null;
    return { q, met, end };
  });
}

HOOKS.ending.push(() => {
  if (!S.run) return;
  const book = loadBook();
  book.runs++;
  if (S.month > 1) book.longestStay = Math.max(book.longestStay || 1, S.month);
  for (const { q, met, end } of runOutcomes()) {
    const e = book.quests[q.id] = book.quests[q.id] || { met: false, endings: [] };
    if (met) e.met = true;
    if (end && !e.endings.includes(end)) e.endings.push(end);
  }
  saveBook(book);
});

// the stories in this run, on the ending screen
function runSummaryHTML() {
  if (!S.run) return '';
  const rows = runOutcomes().map(({ q, met, end }) =>
    `<tr><td>${esc(q.title)}</td><td>${met ? esc(end ? q.endings[end] : 'Unfinished') : '<span class="muted">Never crossed your counter</span>'}</td></tr>`).join('');
  return `<h3>Stories this ${S.run.month > 1 ? 'month' : 'run'}</h3><table>${rows}</table>
    <p class="muted">Run code: <b>${esc(S.run.seed)}</b>. Enter it under New game to play the same ${S.run.month > 1 ? 'first month' : 'stories'} again.</p>`;
}

// ---------------------------------------------------------------- title screen panels
let newGameDifficulty = 'normal'; // the last one picked this session
function newGamePanel(host, back, begin, replacing) {
  host.innerHTML = `<div class="menu-card">
    <h2>New game</h2>
    ${replacing ? '<p>Starting over replaces your autosave.</p>' : ''}
    <p class="muted">Every month in Hollow Neck tells a few different stories.</p>
    <div class="diff-pick">${Object.entries(DIFFICULTY).map(([k, d]) => `<button data-diff="${k}" class="${k === newGameDifficulty ? 'on' : ''}">${esc(d.label)}</button>`).join('')}</div>
    <p class="muted diff-text">${esc(DIFFICULTY[newGameDifficulty].text)}</p>
    <label class="seed-field">Run code <input id="seed-input" maxlength="40" placeholder="leave blank for a new month" autocomplete="off" spellcheck="false"></label>
  </div>`;
  const input = host.querySelector('#seed-input');
  host.querySelectorAll('[data-diff]').forEach(b => { b.onclick = () => {
    newGameDifficulty = b.dataset.diff;
    host.querySelectorAll('[data-diff]').forEach(x => x.classList.toggle('on', x === b));
    host.querySelector('.diff-text').textContent = DIFFICULTY[newGameDifficulty].text;
  }; });
  input.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') start(); });
  const start = () => {
    clearSave();
    const state = newState();
    state.difficulty = newGameDifficulty;
    state.loupe = LOUPES_PER_DAY + DIFFICULTY[newGameDifficulty].loupes;
    const hand = getHand();
    if (hand.length) state.hand = hand; // the cards brought into this month (js/cards.js)
    begin(state, input.value);
  };
  menuButtons(host.querySelector('.menu-card'), [{ label: 'Start', act: start }, { label: 'Back', act: back }]);
  const getHand = typeof cardPicker === 'function' ? cardPicker(host, loadBook()) : () => [];
}

function storybookPanel(host, back) {
  const book = loadBook();
  const quests = [...majorQuests(), ...minorQuests()].map(q => {
    const e = book.quests[q.id];
    const kind = q.kind === 'minor' ? 'Minor' : FAMILY_LABEL[q.family];
    if (!e || !e.met) return `<div class="book-quest unmet"><b>???</b> <span class="muted">${esc(kind)}</span><p class="muted">${esc(q.rumour)}</p></div>`;
    const all = Object.keys(q.endings);
    const found = all.filter(k => e.endings.includes(k));
    return `<div class="book-quest"><b>${esc(q.title)}</b> <span class="muted">${esc(kind)} · ${found.length} of ${all.length} endings</span>
      <p>${all.map(k => found.includes(k) ? esc(q.endings[k]) : '<span class="muted">· · ·</span>').join(' &nbsp;/&nbsp; ')}</p></div>`;
  }).join('');
  host.innerHTML = `<div class="menu-card storybook">
    <h2>Storybook</h2>
    <p class="muted">${book.runs} month${book.runs === 1 ? '' : 's'} at the counter${book.longestStay > 1 ? `, and ${book.longestStay} in a row at the longest` : ''}. Each month tells a few of these stories.</p>
    <div class="book-list">${quests}</div>
    ${typeof townBookHTML === 'function' ? townBookHTML(book) : ''}
    ${typeof secretsBookHTML === 'function' ? secretsBookHTML(book) : ''}
    ${typeof soundingsBookHTML === 'function' ? soundingsBookHTML(book) : ''}
    ${typeof cardsBookHTML === 'function' ? cardsBookHTML(book) : ''}
  </div>`;
  menuButtons(host.querySelector('.menu-card'), [{ label: 'Back', act: back }]);
}

// ================================================================ minor quests in the draw
const RUN_MINORS = [6, 8];
const MINORS_PER_PLACE = 2;
// A minor can name a group (q.group, e.g. 'deep' for the Lovecraftian set): at most one of a group a
// run, or two if a drawn major is in the same group, so those stay rare.
const MINORS_PER_GROUP = 1;
function minorQuests() { return Object.values(QUESTS).filter(q => q.kind === 'minor').sort((a, b) => (a.id < b.id ? -1 : 1)); }
// Minors are drawn after the majors from the same code: six to eight, at most two at one location,
// and none that needs a story the run doesn't have (q.needs, e.g. 'fog' for the Fog Week minors).
function drawMinors(seed, majors, used = [], month = 1) {
  const r = seededRandom(seed + '/minors');
  const want = RUN_MINORS[0] + Math.floor(r() * (RUN_MINORS[1] - RUN_MINORS[0] + 1));
  const pool = minorQuests().filter(q => !q.arc && !q.sequel && (!q.needs || majors.includes(q.needs)) && !used.includes(q.id) && questInMonth(q, month));
  const picked = [], at = {}, inGroup = {};
  while (picked.length < want) {
    const c = pool.filter(q => !picked.includes(q.id) && (at[q.location] || 0) < MINORS_PER_PLACE &&
      (!q.group || (inGroup[q.group] || 0) < MINORS_PER_GROUP + (majors.some(m => QUESTS[m] && QUESTS[m].group === q.group) ? 1 : 0)));
    if (!c.length) break;
    const q = c[Math.floor(r() * c.length)];
    picked.push(q.id); at[q.location] = (at[q.location] || 0) + 1; if (q.group) inGroup[q.group] = (inGroup[q.group] || 0) + 1;
  }
  return picked;
}

// ================================================================ scheduled nights
// A quest night with a window instead of a fixed date. The run places it on the earliest free
// weeknight in its window when the run starts, so quests drawn together never share a night.
//   questNight({ id, window: ['2-1', '3-4'], weekdays: [1, 2, 3, 4], when: () => S.flags.x, run: () => story.x() })
// `when` is checked on the night: if it's false the night passes quietly. Fridays belong to the
// main story unless `weekdays` includes 5. Give the calendar entry `night: '<id>'` to follow it.
const NIGHTS = [];
function questNight(n) { NIGHTS.push({ weekdays: [1, 2, 3, 4], ...n, quest: n.quest !== undefined ? n.quest : questScope }); }
const dayOf = key => { const [w, d] = key.split('-').map(Number); return (w - 1) * 5 + d; };

function nightInRun(n, run) {
  if (n.hub) return hubInRun(n.hub, run);
  return !n.quest || run.majors.includes(n.quest) || (run.minors || []).includes(n.quest);
}
function scheduleNights(run) {
  const inRun = id => !id || run.majors.includes(id) || (run.minors || []).includes(id);
  const load = new Map(); // nights already spoken for, and by how many scenes
  const add = d => load.set(d, (load.get(d) || 0) + 1);
  for (const [key, sc] of Object.entries(SCRIPT)) if ((sc.nights || []).some(n => inRun(n.quest))) add(dayOf(key));
  const nights = {};
  const todo = NIGHTS.filter(n => nightInRun(n, run)).sort((a, b) => dayOf(a.window[1]) - dayOf(b.window[1]) || dayOf(a.window[0]) - dayOf(b.window[0]));
  for (const n of todo) {
    const days = [];
    for (let d = dayOf(n.window[0]); d <= dayOf(n.window[1]); d++) if (n.weekdays.includes((d - 1) % 5 + 1)) days.push(d);
    if (!days.length) continue;
    // the earliest free night in the window; if it's full, the first night of the window, after whatever
    // else is on (the scenes play one after the other)
    const d = days.find(x => !load.get(x)) || days[0];
    nights[n.id] = d; add(d);
  }
  return nights;
}
function scheduledTonight() {
  if (!S.run || !S.run.nights) return [];
  return NIGHTS.filter(n => S.run.nights[n.id] === dayNum() && nightInRun(n, S.run) && (!n.when || n.when()));
}

// ================================================================ hub scenes
// One evening that carries beats from several quests (the Harvest Fair, the Benefit Auction, Town
// Meeting). The quest that owns the hub defines it with addHub; any quest adds a vignette with
// addVignette, from its own file, in any load order. The evening happens in a run if any of its
// vignettes' quests is in the run. The player picks vignettes one at a time, up to `picks`.
//   addHub('fair', { title: 'The Harvest Fair', where: 'Harbor Green', window: ['3-1', '4-3'], picks: 2,
//     open: async () => { view.bg = 'green'; ... }, close: async () => {} })
//   addVignette('fair', { label: 'The dunk tank', when: () => S.flags.x, run: async () => { ... } })
// A vignette with crossing: true only plays if the hub is in the run for some other reason; it
// doesn't bring the evening into the run by itself.
const HUBS = {}, VIGNETTES = {};
function addHub(id, h) {
  HUBS[id] = { picks: 2, ...h, id, quest: questScope };
  questNight({ id: 'hub-' + id, hub: id, quest: null, window: h.window, weekdays: h.weekdays || [1, 2, 3, 4], run: () => runHub(id) });
}
function addVignette(hub, v) { (VIGNETTES[hub] = VIGNETTES[hub] || []).push({ ...v, quest: questScope }); }
function hubInRun(id, run) {
  const has = q => run.majors.includes(q) || (run.minors || []).includes(q);
  return !!HUBS[id] && ((HUBS[id].quest && has(HUBS[id].quest)) || (VIGNETTES[id] || []).some(v => !v.crossing && has(v.quest)));
}
async function runHub(id) {
  const h = HUBS[id];
  const done = new Set();
  if (h.open) await h.open();
  // staying open until five gets you there late (js/day.js): one thing fewer to see
  const picks = Math.max(1, h.picks - (typeof hubLate === 'function' && hubLate() ? 1 : 0));
  for (let n = 0; n < picks; n++) {
    const opts = (VIGNETTES[id] || []).filter(v => !done.has(v) && questActive(v.quest) && (!v.when || v.when()));
    if (!opts.length) break;
    const i = await choose([...opts.map(v => v.label), n ? 'Head home' : 'Just look around']);
    if (i === opts.length) break;
    done.add(opts[i]);
    if (opts[i].quest) questMet(opts[i].quest);
    await opts[i].run();
    if (checkLose()) return;
  }
  if (h.close) await h.close();
}

// ================================================================ lunch errands
// A minor quest's one away scene. Something at the counter calls planErrand(id) and the errand
// comes up at noon on the next free day (within three). Going shuts the shop for an hour (goOut in
// js/day.js): anyone who comes by finds the door locked. Staying open lets the errand go.
//   questErrand({ id, title: 'Bingo at the Grange', where: 'The Grange Hall', run: async () => { ... } })
// ---------------------------------------------------------------- beats that drift (first written for batch D)
// Beats that drift from run to run: a beat added with addDriftBeat(id, from, to, entry) lands on one
// day in [from, to], picked from the run code, so the same run code always has it on the same day.
// `offset` puts a follow-up beat that many days after the first. Quests and stories as data
// (docs/STORY_DATA.md) use them.
function driftDay(id, from, to) {
  const a = dayOf(from), b = dayOf(to);
  if (!S || !S.run || !S.run.seed) return a;
  return a + Math.floor(seededRandom(S.run.seed + '/' + id)() * (b - a + 1));
}
function dayKey(d) { return `${Math.ceil(d / 5)}-${(d - 1) % 5 + 1}`; }
function addDriftBeat(id, from, to, entry, offset = 0) {
  const when = entry.when;
  for (let d = dayOf(from) + offset; d <= Math.min(dayOf(to) + offset, WEEKS * 5); d++) {
    addBeat(dayKey(d), 'customers', { ...entry, when: () => dayNum() === driftDay(id, from, to) + offset && (!when || when()) });
  }
}
// a night scene's opening: fade, set the place, clear the stage
async function openScene(bg) { await fadeOut(); view.bg = bg; clearActors(); }

const ERRANDS = {};
function questErrand(e) { ERRANDS[e.id] = { ...e, quest: questScope }; }
function planErrand(id, after = 1) {
  if (!S.run || !ERRANDS[id]) return;
  S.run.errands = S.run.errands || {};
  const used = new Set(Object.values(S.run.errands));
  let d = dayNum() + after;
  while (used.has(d) && d < dayNum() + after + 3) d++;
  if (d > WEEKS * 5) return;
  S.run.errands[id] = d;
}
function errandsToday() {
  if (!S.run || !S.run.errands) return [];
  return Object.entries(S.run.errands).filter(([id, d]) => d === dayNum() && ERRANDS[id] && questActive(ERRANDS[id].quest)).map(([id]) => ERRANDS[id]);
}
async function runErrand(e) {
  hideCard();
  await narrate(`Noon. ${e.title}, at ${e.where}.`);
  const i = await choose([{ label: 'Close for an hour and go', hint: 'anyone who comes by finds the door locked' }, 'Stay open']);
  S.run.errands[e.id] = -1;
  if (i === 1) return;
  await goOut(60, async () => {
    if (e.quest) questMet(e.quest);
    S.flags.errandsDone = (S.flags.errandsDone || 0) + 1;
    await e.run();
  });
}

// ================================================================ unique items
// One-of-a-kind items (docs/quests/ITEMS.md). addUnique defines one; makeUnique(id) makes it.
//   addUnique('chowderRing', { name: 'The chowder ring', icon: 'ring', cat: 'jewelry', guide: 70,
//     tells: ['Engraved R & J 1975.'],          // what the loupe shows
//     questKey: true,                           // held for its quest: not for sale until released
//     wantedBy: { name: 'June Tibbets', mult: 1.5 }, wantedKnown: () => S.flags.x,
//     set: 'Old Home Week spoons',              // part of a set
//     effect: { loupe: 1 }, effectText: '+1 inspection a day',  // works while in stock (loupe, raidMult)
//     ghost: { name: 'Sea glass', guide: 2 } }) // turns into this at dawn
// releaseUnique(item) clears questKey once the quest lets go of it.
const UNIQUES = {};
function addUnique(id, u) { UNIQUES[id] = { ...u, quest: questScope }; }
function makeUnique(id, o = {}) {
  const u = { ...UNIQUES[id], ...o };
  return {
    uid: S.uid++, key: 'unique', uniqueId: id, unique: true, name: u.name, icon: u.icon || 'curio', cat: u.cat || 'curio',
    cond: u.cond !== undefined ? u.cond : 2, condLabel: u.condLabel || 'One of a kind', guide: u.guide || 0,
    fake: !!u.fake, stolen: !!u.stolen, noticeId: u.noticeId || null, mark: u.mark || null, filed: false,
    paid: 0, inspected: false, knownFake: false, knownHot: false, clues: [], held: null, tells: u.tells,
    questKey: !!u.questKey, nosale: !!u.questKey || !!u.nosale, wantedBy: u.wantedBy || null,
    set: u.set || null, effect: u.effect || null, effectText: u.effectText || null, ghost: u.ghost || null, ghostBorn: dayNum()
  };
}
function releaseUnique(it) { it.questKey = false; it.nosale = false; renderPanel(); }
// A story customer offers you an item over the counter, with the usual haggling card. Returns
// 'deal' (it's in your stock), 'refused', 'left' or 'watch' (you called the police; they've gone).
async function counterSale(c, item, { persona = 'honest', asking, min }) {
  const a = c.actor;
  const cc = { item, persona, asking, min: min || Math.ceil(asking * 0.7), name: c.name || a.name, look: c.look || a.look };
  view.counterIcon = item.icon;
  const r = await negotiate(cc, a, 'buy');
  hideCard();
  if (r.result === 'deal') buyItem(cc, r.price);
  else if (r.result === 'watch') await callWatch({ ...cc, actor: a });
  view.counterIcon = null;
  return r.result;
}
// The weekday a scheduled night (questNight) or errand landed on in this run, for dialogue: 'Thursday'.
function placedDay(id) {
  const d = S.run && ((S.run.nights || {})[id] || (S.run.errands || {})[id]);
  return d > 0 ? DAYS[(d - 1) % 5] : 'soon';
}
// functions don't survive the save, so look them up again from the definition
function uniqueDef(it) { return it.uniqueId ? UNIQUES[it.uniqueId] : null; }

// ghost goods change at dawn
HOOKS.morning.push(async () => {
  for (const it of S.stock) {
    if (!it.ghost) continue;
    if (it.ghostBorn < dayNum()) {
      toast(`At dawn, the ${it.name.toLowerCase()} turned into ${it.ghost.name.toLowerCase()}.`, null, it.icon);
      Object.assign(it, { name: it.ghost.name, guide: it.ghost.guide || 0, icon: it.ghost.icon || it.icon, ghost: null, condLabel: 'Ordinary' });
    }
  }
  renderPanel();
});
