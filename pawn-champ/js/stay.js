// Pawn Champ - staying on: carrying the shop past the first month, up to a half-year in March.
// Design: docs/SEASONS.md. Behind FEATURES.stayOn (js/data.js); ?stay=1 or ?stay=0 in the URL
// overrides it. With the flag off the ending screen only offers Play again, as before.
//
// Month 1 is the main story's month and is unchanged. From month 2 the main story's beats are
// skipped (mainStoryOn() in js/game.js), the Friday bills are the new landlord's rent and heating oil
// (MONTHS in js/data.js), and each month draws fresh stories that haven't been told this stay.
'use strict';

try { const v = new URLSearchParams(location.search).get('stay'); if (v === '1' || v === '0') FEATURES.stayOn = v === '1'; } catch (e) { /* no URL */ }

function canStayOn() { return !!FEATURES.stayOn && monthNum() < MONTHS.length; }

function stayOnHTML() {
  const next = MONTHS[monthNum()];
  return `<h3>Stay on?</h3>
    <p>You can keep the shop open into <b>${next.name}</b>, with everything you have now: cash, stock, reputation and upgrades.
    New stories come to the counter, and the rent will be ${money(next.rent + next.heating)} a week${next.heating ? ' with heating oil' : ''}.</p>`;
}

// The ending screen for months 2 and on.
function monthEnding() {
  const m = monthNum(), name = monthInfo().name, lines = [];
  const rent = (S.goals && S.goals.rentPaid) || 0;
  let title;
  if (m === MONTHS.length) {
    title = 'Half a Year';
    lines.push(`Six months behind the counter. The ice is off the harbor, the first boats are back in the water, and The Crooked Scale is still open.`);
  } else if (paperSoldOn()) {
    const paid = (S.goals && S.goals.handPaid) || 0;
    title = paid >= WEEKS ? `Still Standing in ${name}` : `Scraping Through ${name}`;
    lines.push(paid >= WEEKS ? `${name} is over. Saltire Capital got every installment, and sent a card to say so.` : `${name} is over. Saltire Capital noted the late payments in grey ink, and nothing else, which is worse.`);
  } else if (rent >= WEEKS) {
    title = `Still Standing in ${name}`;
    lines.push(`${name} is over. You paid the new landlord every Friday, and he has stopped writing letters. For now.`);
  } else {
    title = `Scraping Through ${name}`;
    lines.push(`${name} is over. The rent was late ${WEEKS - rent === 1 ? 'once' : `${WEEKS - rent} times`}, and the landlord's lawyer knows your name.`);
  }
  if (S.stay && S.stay.saltire && S.stay.saltire.end === 'signed') lines.push('Saltire\'s partnership papers are in the drawer under the till. When the lease is up, The Crooked Scale will be the heritage tenant of Harborside Commons.');
  if (S.flags.odileHome || S.flags.odileFreed) lines.push('Odile still argues with you about prices. She is usually right.');
  if (S.flags.pellRedeemed) lines.push('Old Pell still brings scallops on Fridays, when there are any.');
  return { title, lines };
}

// Carry the shop into the next month: same cash, stock, reputation, upgrades and friendships;
// a fresh week count, weekly objectives and strikes; and a new draw of stories.
function startNextMonth() {
  const prev = S.run;
  S.stay = S.stay || { seed: prev ? prev.seed : randomSeed(), told: [] };
  if (!S.stay.spine) chooseSpines();
  if (prev) S.stay.told.push(...prev.majors, ...(prev.minors || []));
  recordEndings(prev);
  S.month = monthNum() + 1;
  S.week = 1; S.day = 1;
  S.strikes = 0;
  S.over = null;
  // things due "end of the month" or later move into the new month's days
  const shift = WEEKS * 5;
  for (const l of S.loans) l.due -= shift;
  if (S.borrowed) S.borrowed.week -= WEEKS; // a short-term loan due next month (js/borrow.js)
  for (const c of S.complaints) c.due -= shift;
  S.wants = (S.wants || []).filter(w => w.due > shift).map(w => ({ ...w, due: w.due - shift }));
  S.goals = { start: null, done: [], handPaid: 0, rentPaid: 0 };
  S.flags.seen = {}; // the calendar's record is per month
  S.flags.monthOpened = false;
  // M35 Saltire Capital: once Saltire is exposed, a receiver sells the building on, and the rent is the landlord's
  if (S.stay.saltire && S.stay.saltire.end === 'exposed') S.stay.spine = 'building';
  S.run = drawMonth(S.stay.seed, S.month, S.stay.told);
  // the town moves on too (js/town.js planTown): threads already started stay finished, and last
  // month's faces are less likely to be back
  const thr = (S.town && S.town.thr) || {};
  S.run.townAfter = { started: Object.keys(thr).filter(id => thr[id].step > 0 || thr[id].end), last: prev && prev.town ? prev.town.present : [] };
  log(`${monthInfo().name} begins`);
}

// How October ended decides the rest of the stay (docs/SEASONS.md#what-keeps-the-pressure-on-after-the-hand):
//   spine 'paper'     the Hand's debt wasn't cleared, so it is sold on to Saltire Capital and the
//                     installments go on (The Paper Is Sold On);
//   spine 'building'  the debt is gone, and the building's new owner raises the rent instead
//                     (The Building Changes Hands).
//   odile 'home'      she's behind the counter with you (Two Keepers): one more loupe a day;
//   odile 'search'    she was never found, and a postcard comes each month (The Search Goes On).
// Called once, at the end of October, before the month's goals are reset.
function chooseSpines() {
  const f = S.flags;
  const cleared = !!f.odileFreed || ((S.goals.handPaid || 0) >= WEEKS && !S.strikes);
  S.stay.spine = cleared ? 'building' : 'paper';
  S.stay.odile = f.odileHome || f.odileFreed ? 'home' : 'search';
}
const odileHome = () => !mainStoryOn() && !!S.stay && S.stay.odile === 'home';
const odileSearch = () => !mainStoryOn() && !!S.stay && S.stay.odile === 'search';
// M35 Saltire Capital (js/quests/saltire.js): signing their partnership ends the installments for the
// rest of the stay; exposing them ends this month's, and the next month's bills are the landlord's.
function saltireOff() {
  const s = S && S.stay && S.stay.saltire;
  return !!s && (s.end === 'signed' || (s.end === 'exposed' && s.month === S.month));
}
function stayLoupes() { return odileHome() ? 1 : 0; } // Odile's eye, in loupeCap() (js/game.js)

// The stories for a later month: the same rules as the first month's draw, from the stories not yet
// told in this stay and allowed in this month (questInMonth in js/runs.js).
function drawMonth(seed, month, told) {
  const s = `${seed}/m${month}`;
  const owed = owedChapters(month, told);
  const chMajors = owed.filter(id => QUESTS[id].kind === 'major'), chMinors = owed.filter(id => QUESTS[id].kind !== 'major');
  const majors = [...chMajors, ...drawMajors(s, [...told, ...owed], month, Math.max(1, RUN_MAJORS - chMajors.length))];
  const minors = [...chMinors, ...drawMinors(s, majors, [...told, ...owed], month)];
  return planRun({ seed, month, majors, minors, met: {} });
}

// ---------------------------------------------------------------- long arcs and sequels
// (docs/SEASONS.md#which-stories-can-be-extended) A chapter is a quest of its own that continues an
// earlier one:
//   defineQuest({ id: 'grey2', arc: 'grey', after: ['keeper', 'rewritten'], months: [3], teaser: '...', ... })
//   arc: '<id>'     a long-arc chapter: the next part of <id>, for as long as `months` allows
//   sequel: '<id>'  a one-scene second chapter; if it can't be drawn the month after <id> ends, it
//                   waits one more month and then lapses
//   after: [...]    the endings of <id> that lead here (left out: any ending)
//   teaser          narrated on the first morning of the month it's drawn, after the letter
// Chapters are never drawn in October or as ordinary stories. Each month, up to ARC_SLOTS of the
// chapters owed take their slots before the fresh draw: oldest first, arcs before sequels.
const ARC_SLOTS = 2;
const chapterOf = q => q.arc || q.sequel || null;
// how each story told so far this stay ended, and in which month
function recordEndings(run) {
  if (!run) return;
  S.stay.ended = S.stay.ended || {};
  for (const id of [...run.majors, ...(run.minors || [])]) {
    const q = QUESTS[id];
    if (!q || S.stay.ended[id]) continue;
    S.stay.ended[id] = { end: q.outcome ? q.outcome(S.flags) || null : null, month: monthNum() };
  }
}
// How a story ended: as recorded at the end of its month in a stay, or (in its own month, and in the
// test tools) from its flags. A chapter uses it to tell which way its story went.
function endedAs(id) {
  const e = S && S.stay && S.stay.ended && S.stay.ended[id];
  if (e) return e.end;
  const q = QUESTS[id];
  return q && q.outcome ? q.outcome(S.flags) || null : null;
}
function owedChapters(month, told) {
  const ended = (S.stay && S.stay.ended) || {};
  const owed = [];
  for (const q of Object.values(QUESTS)) {
    const parent = chapterOf(q);
    if (!parent || told.includes(q.id) || !ended[parent]) continue;
    const e = ended[parent];
    if (!e.end || (q.after && !q.after.includes(e.end))) continue;
    if (q.sequel && month > e.month + 2) continue; // lapsed
    if (!questInMonth(q, month)) continue;
    owed.push({ id: q.id, at: e.month, arc: q.arc ? 0 : 1 });
  }
  owed.sort((a, b) => a.at - b.at || a.arc - b.arc || (a.id < b.id ? -1 : 1));
  return owed.slice(0, ARC_SLOTS).map(o => o.id);
}

// The first morning of a new month: the season, the month's letter, and Odile.
const MONTH_SEASON = {
  2: 'November. The maples on Main Street are bare, and there\'s frost on the inside of the shop window before the radiator wakes up.',
  3: 'December. Snow came in overnight, and someone has strung lights along the clapboard fronts across the street.',
  4: 'January. The plow has left a wall of grey snow along the curb, and there is ice in the corners of the harbor.',
  5: 'February. Slush, a grey sky and nobody on the street before ten.',
  6: 'March. The snow is going grey and the gutters are running. The first boats are back in the water.'
};
const MONTH_LETTER = {
  building: {
    2: 'A letter is waiting under the door. Old Mr. Szabo, who owned the building for forty years, has died. His nephew owns it now, and the rent goes up to {rent} a week, with heating oil, from this Friday.',
    3: 'The nephew\'s letter is shorter this month. Rent: {rent} a week. He hopes you have a merry Christmas.',
    4: 'No letter this month, only a new figure on the rent book in the nephew\'s handwriting: {rent}.',
    5: 'The rent goes up again, to {rent}. The oil man says it\'s the coldest winter since 2015.',
    6: 'Rent: {rent}, and the heating is nearly off. The nephew writes that he\'s "exploring options" for the building.'
  },
  paper: {
    2: 'A letter on cream paper is waiting under the door. Gilded Hand Finance has sold Aunt Odile\'s debt to Saltire Capital, of Boston. Nothing changes, it says, except the name, and the installments, which are now {inst} a week until further notice.',
    3: 'Saltire Capital\'s December statement comes with a calendar. Every Friday is circled in a tasteful grey. {inst} a week.',
    4: 'Saltire\'s January statement: {inst} a week. At the bottom, a printed signature and "Happy New Year from all of us at Saltire."',
    5: '{inst} a week to Saltire Capital. The statement has a new section called Opportunities, and your address is in it.',
    6: 'Saltire\'s March statement: {inst} a week. They would welcome a conversation about the building\'s future.'
  }
};
const ODILE_MORNING = {
  home: {
    2: 'Odile is already behind the counter when you come down, with two coffees and the loupe in her eye. "Go on, then. Show me what you\'ve been paying for things."',
    3: 'Odile has hung a wreath on the door and is pretending she didn\'t.',
    4: 'Odile\'s knee is bad in the cold. She appraises from a stool now, and is still faster than you.',
    5: 'Odile has started telling customers the story of every thing on the shelves. Some of the stories are true.',
    6: 'Odile stands in the open door with her coffee, looking at the boats. "Every March," she says. "Every single March."'
  },
  search: {
    2: 'In the mail, a postcard of a lighthouse you don\'t know: Port Esther, Maine. No message. The handwriting on the address is Odile\'s.',
    3: 'A second postcard, from further up the coast: Cutler\'s Reach. On the back, in Odile\'s hand: "Don\'t sell the brass scale."',
    4: 'A postcard from Little Sable Light. "Cold. Fine. Not alone." Nothing else.',
    5: 'No postcard this month. Then, on the Tuesday, one with no stamp at all, pushed under the door in the night.',
    6: 'A postcard of the Gull Point light, Hollow Neck. Our own. Posted locally. "Soon," it says.'
  }
};
HOOKS.morning.push(async () => {
  if (mainStoryOn() || S.week !== 1 || S.day !== 1 || S.flags.monthOpened) return;
  S.flags.monthOpened = true;
  const m = monthNum(), st = S.stay || {};
  const vars = { rent: money(rentBase()), inst: money(installmentDue()) };
  const lines = [MONTH_SEASON[m], (MONTH_LETTER[st.spine] || MONTH_LETTER.building)[m], ODILE_MORNING[st.odile] && ODILE_MORNING[st.odile][m]];
  for (const id of [...S.run.majors, ...(S.run.minors || [])]) if (QUESTS[id] && QUESTS[id].teaser) lines.push(QUESTS[id].teaser); // an arc pulling
  for (const t of lines) if (t) await narrate(fill(t, vars));
});
