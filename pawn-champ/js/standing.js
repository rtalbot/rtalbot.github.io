// Pawn Champ - friends and grudges: how each of the town's regulars feels about you
// (docs/quests/STANDING.md). Loaded after js/town.js.
//
// Standing runs from -5 (enemy) to +5 (friend) and starts at 0 every run. The player only sees the
// word. Talk and counter deals ("soft" changes) stop at warm or sore (+/-3); friend and enemy take a
// deed: a thread ending, a quest ending someone cared about, a TOWN_FALLOUT, or a quest's sway().
// It carries when you Stay on, drifting a step toward 0 each new month unless it was sealed by a
// thread ending.
//
// For quest writers:
//   standing(id), mood(id), isFriend(id[, 'warm']), isFoe(id[, 'sore']), said(id, key)
//   sway(id, delta, why)             a deed: moves standing, logs why, toasts if the word changes
//   await respond(a, id, options)    choose() with tones; returns the index picked
//   ally(moment[, opts]), foe(moment[, opts])   who turns up here: { id, name, look } or null
//   TOWN_TALK rows may carry  sway: { ending: { regularId: delta } }  for quest endings.
'use strict';

const STANDING_MIN = -5, STANDING_MAX = 5, STANDING_SOFT = 3;
const TONES = ['kind', 'straight', 'wry', 'sharp', 'sly'];
const MOMENTS = ['police', 'auction', 'vote', 'debt', 'appraise', 'night', 'witness', 'word'];
const MOODS = [
  { id: 'enemy', min: -5, word: 'Enemy' },
  { id: 'sore', min: -3, word: 'Sore' },
  { id: 'neutral', min: -1, word: 'Neutral' },
  { id: 'warm', min: 2, word: 'Warm' },
  { id: 'friend', min: 4, word: 'Friend' }
];

// Each regular's temper (tones they like and dislike), the moments they fit, their favour and their
// grudge. harm: how hard the grudge hits, in bad deals (Rich, 2026-11-01: "it depends for the enemy,
// maybe it could even be a little worse"). The favour and grudge text is a summary; the effects and
// the lines the regular says are in js/favours.js.
const STANDING_ROLES = {
  tess: { likes: ['straight'], dislikes: ['sly'], moments: ['night', 'witness', 'vote'], harm: 2,
    favour: 'The boats bring her one extra seller a day for a week.', grudge: 'Nobody on the boats sells to you for a week (two more days: she has pull).' },
  ignatius: { likes: ['kind', 'wry'], dislikes: ['sharp'], moments: ['word', 'witness'], harm: 2,
    favour: 'A kind word from the pulpit: +4 reputation.', grudge: 'A sermon on usury: -6 reputation and a quiet couple of days.' },
  hester: { likes: ['straight'], dislikes: ['sly'], moments: ['appraise', 'witness'], harm: 1,
    favour: 'She tells you the truth about one fake or stolen thing on your shelf.', grudge: 'A letter to the Gazette: your best window piece loses a fifth of its value.' },
  marguerite: { likes: ['straight'], dislikes: ['wry'], moments: ['vote', 'word'], harm: 2,
    favour: 'A good word at the selectmen\'s meeting: +3 reputation.', grudge: 'A zoning complaint about your sign: a $40 fine.' },
  dory: { likes: ['wry', 'straight'], dislikes: ['kind'], moments: ['night', 'appraise'], harm: 1,
    favour: 'Something good from the dredge, brought in cheap the next day.', grudge: 'She sells to the chain on Route 1: fewer sellers for three days.' },
  dot: { likes: ['kind'], dislikes: ['sharp'], moments: ['word', 'witness'], harm: 1,
    favour: 'She talks you up on the walk to the Shack: more shoppers for three days.', grudge: 'She talks you down on the walk past: fewer shoppers for three days.' },
  ruthie: { likes: ['wry'], dislikes: ['sharp'], moments: ['word', 'witness'], harm: 1,
    favour: 'A shout-out on trivia night: a busy next day.', grudge: 'She bars you from the Anchor and tells the teams why: fewer shoppers for three days.' },
  orsolya: { likes: ['kind'], dislikes: ['straight'], moments: ['night', 'appraise'], harm: 1,
    favour: 'Good cards: more shoppers and softer sellers for two days.', grudge: 'Bad cards, read aloud to her clients: fewer shoppers for three days.' },
  agathe: { likes: ['straight'], dislikes: ['wry'], moments: ['appraise'], harm: 1,
    favour: 'She repairs one thing on your shelf (condition up).', grudge: 'She won\'t look at anything from your shop: fewer shoppers for three days.' },
  bev: { likes: ['wry', 'sly'], dislikes: ['kind'], moments: ['auction', 'word'], harm: 1,
    favour: 'The league comes in after practice: a busy day.', grudge: 'Bets at the lanes on how long you last: fewer shoppers for three days.' },
  hal: { likes: ['straight'], dislikes: ['sly'], moments: ['night', 'witness'], harm: 1,
    favour: 'He fixes your buzzing PAWN sign: more shoppers for five days.', grudge: 'He won\'t fix it: fewer shoppers for three days.' },
  bettany: { likes: ['kind'], dislikes: ['sharp'], moments: ['witness'], harm: 1,
    favour: 'Your window\'s on the bakery bags: more shoppers for three days.', grudge: 'She stops sending people across the street: fewer shoppers for three days.' },
  skip: { likes: ['kind', 'wry'], dislikes: ['sharp'], moments: ['witness', 'night'], harm: 1,
    favour: 'He tells the parents at every stop: more shoppers for three days.', grudge: 'He tells them Route 1: fewer shoppers for three days.' },
  gordie: { likes: ['sly', 'wry'], dislikes: ['straight'], moments: ['auction', 'debt', 'vote'], harm: 2,
    favour: 'A loan of up to $40 on a Friday you can\'t cover, paid back the next week.', grudge: 'A radio spot against pawnshops: fewer shoppers for a week.' },
  nanFerreira: { likes: ['straight'], dislikes: ['kind'], moments: ['night'], harm: 1,
    favour: 'The islanders bring their attics to you: an extra seller a day for three days.', grudge: 'She sends them to Hyannis: fewer sellers for three days.' },
  marv: { likes: ['sly'], dislikes: ['sharp'], moments: ['auction', 'appraise'], harm: 1,
    favour: 'First pick of a house clearance, brought in cheap the next day.', grudge: 'His clearances go to Plymouth: fewer sellers for three days.' },
  felix: { likes: ['wry'], dislikes: ['straight'], moments: ['word', 'night'], harm: 1,
    favour: 'The ghost walk stops at your window: a busy day.', grudge: 'Stop nine tells a story about you: fewer shoppers for three days.' },
  gus: { likes: ['straight'], dislikes: ['sly'], moments: ['appraise', 'witness'], harm: 1,
    favour: 'He softens sellers on the bench outside: their lowest prices drop for three days.', grudge: 'He tells sellers what you paid the last man: their lowest prices rise for three days.' },
  dunphy: { likes: ['kind'], dislikes: ['sly'], moments: ['police', 'witness'], harm: 2,
    favour: 'He rings before a police raid, once: it\'s called off and heat drops.', grudge: 'A note on the Captain\'s desk: raids more likely for the rest of the month.' },
  otis: { likes: ['wry', 'kind'], dislikes: ['sharp'], moments: ['witness', 'word'], harm: 1,
    favour: 'Customers\' wanted items come back a day sooner.', grudge: 'Your post goes in the back of the bag: wanted items come back a day later.' },
  leon: { likes: ['straight', 'wry'], dislikes: ['sly'], moments: ['night', 'witness'], harm: 1,
    favour: 'Your stretch is first on his plow route, and he tells the swap shed you\'re fair: more shoppers for three days.', grudge: 'Your stretch is last, and the bank of snow ends up across your door: fewer shoppers for three days.' },
  vera: { likes: ['straight'], dislikes: ['sly'], moments: ['word', 'witness'], harm: 2,
    favour: 'A kind paragraph in the Gazette: +3 reputation and a busy next day.', grudge: 'A paragraph in the Gazette\'s police blotter: -3 reputation and a quiet couple of days.' },
  rhoda: { likes: ['wry', 'sly'], dislikes: ['sharp'], moments: ['night', 'witness'], harm: 1,
    favour: 'She sends her guests to you: more shoppers for three days.', grudge: 'She sends them to the shop in Plymouth: fewer shoppers for three days.' },
  lupe: { likes: ['kind', 'wry'], dislikes: ['sly'], moments: ['word', 'witness'], harm: 1,
    favour: 'Your card goes in her bouquets: +2 reputation and more shoppers for two days.', grudge: 'Black ribbons in her window, and the reason why: fewer shoppers for three days.' },
  hugo: { likes: ['kind'], dislikes: ['wry'], moments: ['appraise', 'witness'], harm: 2,
    favour: 'He tells Captain Barrow, over her prescription, that you\'re steady: heat drops by 8.', grudge: 'He mentions to the Captain what he\'s seen go in your back door: heat rises by 6.' },
  mercy: { likes: ['straight', 'wry'], dislikes: ['sly'], moments: ['vote', 'witness'], harm: 1,
    favour: 'The farms inland bring their barn finds to you: an extra seller a day for three days.', grudge: 'She tells the farms to take them to Plymouth: fewer sellers for three days.' }
};

// How each regular's own thread ending moves them. Missing endings count 0.
const THREAD_SWAY = {
  tess: { running: { tess: 3 }, halfway: { tess: 1 } },
  ignatius: { home: { ignatius: 3 }, kept: { ignatius: -1 } },
  hester: { returned: { hester: 3 }, sold: { hester: -4 }, framed: { hester: 1 } },
  marguerite: { tess: { marguerite: 1, tess: 2 }, hester: { marguerite: 1, hester: 2 }, dot: { marguerite: 1, dot: 2 }, stays: { marguerite: 2 } },
  dory: { freezer: { dory: 3 }, bargain: { dory: 2 } },
  dot: { given: { dot: 3 }, ticket: { dot: 1 }, sold: { dot: -3 } },
  ruthie: { champions: { ruthie: 3 }, close: { ruthie: 2 }, noShow: { ruthie: -2 } },
  orsolya: { redeemed: { orsolya: 3 }, market: { orsolya: 1 }, kept: { orsolya: -2 } },
  agathe: { finished: { agathe: 3 }, sold: { agathe: 1 } },
  bev: { saved: { bev: 3 }, sponsor: { bev: 2 } },
  hal: { stays: { hal: 3 }, both: { hal: 2 } },
  bettany: { home: { bettany: 3 }, copied: { bettany: 1 } },
  skip: { bought: { skip: 3 }, kids: { skip: 2 } },
  gordie: { art: { gordie: 2 }, ad: { gordie: 3 } },
  nanFerreira: { dock: { nanFerreira: 3 }, sold: { nanFerreira: -2 } },
  marv: { sealed: { marv: 3 }, opened: { marv: -2 }, posted: { marv: 1 } },
  felix: { odile: { felix: 3 }, tall: { felix: 2 } },
  gus: { quiet: { gus: 3 }, told: { gus: 1 } },
  dunphy: { sergeant: { dunphy: 3 }, retake: { dunphy: 1 } },
  otis: { posted: { otis: 3 } },
  leon: { home: { leon: 3 }, window: { leon: 2 }, roof: { leon: 1 } },
  vera: { printed: { vera: 3, ruthie: -1 }, ruthie: { vera: 2, ruthie: 2 }, stove: { vera: -1 } },
  rhoda: { posted: { rhoda: 3 }, desk: { rhoda: 2 } },
  lupe: { stone: { lupe: 3 }, name: { lupe: 3 }, march: { lupe: 1 } },
  hugo: { athenaeum: { hugo: 2, hester: 2 }, torn: { hugo: 3, hester: -1 }, sold: { hugo: -1, hester: -2 } },
  mercy: { fair: { mercy: 3 }, kept: { mercy: 2 }, sold: { mercy: 1 } }
};

// ---------------------------------------------------------------- state
function standingState() {
  S.standing = S.standing || { v: {}, said: {}, applied: {}, best: {}, sealed: {}, toned: {}, dealt: {}, month: monthNum() };
  return S.standing;
}
const clampStanding = n => Math.max(STANDING_MIN, Math.min(STANDING_MAX, n));
function standing(id) { return (S && S.standing && S.standing.v[id]) || 0; }
function moodOf(n) { let m = MOODS[0]; for (const x of MOODS) if (n >= x.min) m = x; return m; }
function mood(id) { return moodOf(standing(id)).id; }
function moodWord(id) { return moodOf(standing(id)).word; }
function isFriend(id, min) { return standing(id) >= (min === 'warm' ? 2 : 4); }
function isFoe(id, min) { return standing(id) <= (min === 'sore' ? -2 : -4); }
function said(id, key) { const s = S && S.standing && S.standing.said[id]; return s ? s[key] : undefined; }

// what you hear when someone's word for you changes
const MOOD_TOAST = {
  friend: '{name} counts you a friend now.',
  warm: '{name} thinks better of you.',
  neutralUp: '{name} has come round.',
  neutralDown: '{name} has cooled on you.',
  sore: '{name} is sore at you.',
  enemy: '{name} has it in for you now.'
};
function nameOf(id) { return (typeof TOWN !== 'undefined' && TOWN[id] && TOWN[id].name) || (CAST[id] && CAST[id].name) || id; }

// Move a regular's standing. soft: talk and counter deals, which can't carry anyone past +/-3 in
// their own direction (a friend or enemy is made by deeds). Returns the new standing.
function shiftStanding(id, delta, why, soft) {
  if (!delta || !S) return standing(id);
  const st = standingState();
  const before = st.v[id] || 0;
  let after = clampStanding(before + delta);
  if (soft) {
    if (delta > 0) after = Math.max(before, Math.min(after, STANDING_SOFT));
    else after = Math.min(before, Math.max(after, -STANDING_SOFT));
  }
  if (after === before) return before;
  st.v[id] = after;
  st.best[id] = Math.max(st.best[id] === undefined ? 0 : st.best[id], after);
  const m0 = moodOf(before).id, m1 = moodOf(after).id;
  if (why && typeof log === 'function') log(`${nameOf(id)}: ${why}`);
  if (m0 !== m1 && typeof toast === 'function') {
    const key = m1 === 'neutral' ? (after > before ? 'neutralUp' : 'neutralDown') : m1;
    toast(MOOD_TOAST[key].replace('{name}', nameOf(id)), CAST[id] && CAST[id].look);
  }
  return after;
}
function sway(id, delta, why) { return shiftStanding(id, delta, why, false); }

// ---------------------------------------------------------------- talks
// respond(actor, regularId, options): like choose(), but options can carry
//   tone: one of TONES (moves standing by the regular's temper, once a day per regular)
//   sway: a writer-set soft change (+/-1 or 2)
//   save: a key; said(id, key) remembers this answer (value: option.value, or true)
// Falsy options are dropped. Returns the index of the option picked, among the kept options.
async function respond(a, id, options) {
  const opts = options.filter(Boolean).map(o => typeof o === 'string' ? { label: o } : o);
  const i = await choose(opts.map(o => ({ label: o.label, hint: o.hint, disabled: o.disabled, card: o.card })));
  const o = opts[i], st = standingState(), role = STANDING_ROLES[id];
  if (o.save) (st.said[id] = st.said[id] || {})[o.save] = o.value === undefined ? true : o.value;
  if (o.tone && role && st.toned[id] !== dayNum()) {
    const d = role.likes.includes(o.tone) ? 1 : role.dislikes.includes(o.tone) ? -1 : 0;
    if (d) { st.toned[id] = dayNum(); shiftStanding(id, d, null, true); }
  }
  if (o.sway) shiftStanding(id, Math.max(-2, Math.min(2, o.sway)), null, true);
  return i;
}

// ---------------------------------------------------------------- talks in a visit (js/town.js townVisit)
// A regular's talk data (written in their addRegular block):
//   small:  [{ say, opts: [{ label, tone, reply, sway, save }] }]   one-stage small talk
//   reckon: { up: { say, opts }, down: { say, opts } }             after a quest ending moved them 2+;
//           {quest} in say becomes the quest's title
//   mend:   async a => boolean                                      a sore regular's mending offer;
//           true means you made it up, and the engine moves them +2 (an enemy back to sore)
async function talkStage(a, id, stage, fill) {
  if (!stage) return false;
  await say(a, fill ? stage.say.replace('{quest}', fill) : stage.say);
  if (!stage.opts || !stage.opts.length) return true;
  const opts = stage.opts.filter(Boolean);
  const i = await respond(a, id, opts);
  if (opts[i] && opts[i].reply) await say(a, opts[i].reply);
  return true;
}
async function talkSmall(a, id, stage) { return talkStage(a, id, stage); }
async function talkReckon(a, id) {
  const st = standingState(), due = st.reckon && st.reckon[id], r = TOWN[id];
  if (!due || due.done || !r || !r.reckon) return false;
  due.done = true;
  const quest = QUESTS[due.q];
  return talkStage(a, id, r.reckon[due.dir], quest ? quest.title : 'it');
}
async function talkMend(a, id) {
  const st = standingState(), r = TOWN[id];
  if (!r || !r.mend || !isFoe(id, 'sore')) return false;
  st.mended = st.mended || {};
  if (st.mended[id] === monthNum()) return false; // once a month
  st.offered = st.offered || {};
  if (st.offered[id] === dayNum()) return false;
  st.offered[id] = dayNum();
  if (await r.mend(a)) { st.mended[id] = monthNum(); sway(id, 2, `Made it up with ${r.name}`); }
  return true;
}

// ---------------------------------------------------------------- moments
// Who turns up for a moment: a regular in town this month whose role fits, and who is a friend (ally)
// or an enemy (foe). opts.min: 'warm' or 'sore' to widen; opts.prefer: ids to try first (the people
// already in the scene); opts.exclude: ids who can't be the one (they're already in it another way). Returns { id, name, look } or null.
function pickForMoment(moment, opts, test) {
  if (!S || !S.run || typeof townHere !== 'function') return null;
  const o = opts || {};
  const ids = Object.keys(STANDING_ROLES).filter(id => STANDING_ROLES[id].moments.includes(moment) && townHere(id) && test(id, o.min) && !(o.exclude || []).includes(id));
  if (!ids.length) return null;
  const prefer = (o.prefer || []).filter(id => ids.includes(id));
  const pool = prefer.length ? prefer : ids;
  const best = pool.sort((x, y) => Math.abs(standing(y)) - Math.abs(standing(x)) || (x < y ? -1 : 1))[0];
  return { id: best, name: nameOf(best), look: CAST[best] && CAST[best].look };
}
function ally(moment, opts) { return pickForMoment(moment, opts, isFriend); }
function foe(moment, opts) { return pickForMoment(moment, opts, isFoe); }

// ---------------------------------------------------------------- deeds the town already records
// A regular's thread ending: applied as soon as the step that ends it finishes.
function applyThreadEnd(id) {
  const t = S.town && S.town.thr && S.town.thr[id];
  if (!t || !t.end) return;
  const st = standingState(), key = 'thread:' + id;
  if (st.applied[key]) return;
  st.applied[key] = true;
  const row = (THREAD_SWAY[id] || {})[t.end] || {};
  for (const [who, d] of Object.entries(row)) { sway(who, d, `${TOWN[id].title}: ${TOWN[id].endings[t.end]}`); st.sealed[who] = true; }
}
for (const id of Object.keys(TOWN)) {
  TOWN[id].steps = TOWN[id].steps.map(step => async (a, t) => { await step(a, t); applyThreadEnd(id); });
}

// Quest endings: TOWN_TALK sway rows, and TOWN_FALLOUT's cold (an enemy for the rest of the run).
// Checked each morning and at the month's end, once per quest.
function applyQuestEndings() {
  if (!S || !S.run) return;
  const st = standingState();
  for (const q of [...S.run.majors, ...(S.run.minors || [])]) {
    const quest = QUESTS[q];
    if (!quest || !quest.outcome || !(S.run.met && S.run.met[q]) || st.applied['quest:' + q]) continue;
    const end = quest.outcome(S.flags);
    if (!end) continue;
    st.applied['quest:' + q] = true;
    const talk = TOWN_TALK[q], rows = (talk && talk.sway) || (typeof QUEST_SWAY !== 'undefined' && QUEST_SWAY[q]), row = rows && rows[end];
    st.reckon = st.reckon || {};
    // a big swing (2 or more) earns a reckoning on that regular's next visit
    const owe = (who, d) => { if (Math.abs(d) >= 2 && !st.reckon[who]) st.reckon[who] = { q, dir: d > 0 ? 'up' : 'down' }; };
    if (row) for (const [who, d] of Object.entries(row)) { sway(who, d, `${quest.title}: ${quest.endings[end]}`); owe(who, d); }
    const fall = TOWN_FALLOUT[q] && TOWN_FALLOUT[q][end];
    if (fall && fall.mood === 'cold' && standing(fall.id) > -4) sway(fall.id, -4 - standing(fall.id), `${quest.title}: ${quest.endings[end]}`);
  }
}
HOOKS.morning.push(async () => {
  if (!S || !S.run) return;
  const st = standingState();
  // a new month when you Stay on: everyone drifts a step toward 0, except where a thread ending sealed it
  if (st.month !== monthNum()) {
    st.month = monthNum();
    for (const id of Object.keys(st.v)) if (!st.sealed[id] && st.v[id]) st.v[id] += st.v[id] > 0 ? -1 : 1;
    st.toned = {}; st.dealt = {};
  }
  applyQuestEndings();
});

// Week 1, a regular as an ordinary customer: how you treat them across the counter. Once a month each.
// how: 'bought' (you bought from them), 'sold' (you sold to them), 'caught' (they caught a fake).
function standingDeal(c, how, it, price) {
  if (!c || !c.town || !S) return;
  const st = standingState();
  if (st.dealt[c.town]) return;
  let d = 0;
  if (how === 'caught' || (how === 'sold' && it.fake)) d = -2;
  else if (how === 'sold') d = 1;
  else if (how === 'bought' && !it.fake) d = price < it.guide * 0.45 ? -1 : price >= it.guide * 0.75 ? 1 : 0;
  if (!d) return;
  st.dealt[c.town] = true;
  shiftStanding(c.town, d, null, true);
}

// ---------------------------------------------------------------- the month's end and the Storybook
HOOKS.ending.push(() => {
  if (!S || !S.standing) return;
  applyQuestEndings();
  const book = loadBook();
  book.standing = book.standing || {};
  for (const [id, n] of Object.entries(S.standing.best)) book.standing[id] = Math.max(book.standing[id] || 0, n);
  saveBook(book);
});
function standingBookNote(id, book) {
  const n = book.standing && book.standing[id];
  return n >= 2 ? ` · ${moodOf(n).word === 'Friend' ? 'once a friend' : 'once warm'}` : '';
}

// The Rolodex: a page in the ledger, the regulars you've met this month and how they feel.
function rolodexHTML() {
  if (!S || !S.town || typeof TOWN === 'undefined') return '';
  const met = Object.keys(S.town.met || {}).filter(id => TOWN[id]);
  const gone = id => typeof townMood === 'function' && townMood(id) && townMood(id).mood === 'gone';
  const rows = met.map(id => `<tr><td><img src="${portraitURL(TOWN[id].look)}"> ${esc(TOWN[id].name)}</td><td class="muted">${esc(TOWN[id].place)}</td>
    <td class="${isFriend(id, 'warm') ? 'good' : isFoe(id, 'sore') ? 'bad' : ''}">${gone(id) ? 'Gone away' : moodWord(id)}</td></tr>`).join('');
  return `<h3>Rolodex</h3><table>${rows || '<tr><td class="muted">You haven\'t met any of the regulars yet this month.</td></tr>'}</table>
    ${met.length ? '<p class="muted">People take things differently. What charms one regular puts another\'s back up.</p>' : ''}`;
}
