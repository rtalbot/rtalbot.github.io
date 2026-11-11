// Pawn Champ - the special-event calendar.
// Every scheduled story night has an entry here. An entry shows on the player's calendar once
// they have been told about it (known), and stays as a record once it has happened (seen).
// Surprises have known: () => false, so they appear only afterwards.
// Other code can read CALENDAR, calendarFor(week, day) and calendarSeen(id).
'use strict';

const CAL_STORIES = {
  main: { label: 'Main story', col: '#c8a050' },
  town: { label: 'Hollow Neck', col: '#8aa0b0' }
};

const CALENDAR = [
  // bills: printed on the calendar by Merrit Gaunt himself
  ...[1, 2, 3, 4].map(w => ({ id: `installment-${w}`, week: w, days: [5], night: false, story: 'main', where: 'The Crooked Scale',
    title: () => `Bills: rent + ${money(diffMoney(INSTALLMENTS[w - 1] * S.installmentMult[w - 1]))} to the Hand`, known: () => true, scene: null })),
  // after the first month the bills are the landlord's rent (docs/SEASONS.md)
  ...[1, 2, 3, 4].map(w => ({ id: `rent-${w}`, week: w, days: [5], night: false, story: 'town', where: 'The Crooked Scale', fromMonth: 2,
    title: () => paperSoldOn() ? `Bills: rent + ${money(installmentDue(w))} to Saltire` : `Bills: rent${monthInfo().heating ? ' and heating oil' : ''}, ${money(rentBase())}`, known: () => true, scene: null })),
  // the town's own calendar
  { id: 'full-moon', week: 4, days: [4], night: true, story: 'town', where: 'The sky', title: 'Full moon', known: () => true, scene: null, toMonth: 1 },
  // main story nights
  { id: 'letter', week: 1, days: [5], night: true, story: 'main', where: 'The Crooked Scale', title: 'A letter under the floor', known: () => false, scene: 'letter' },
  { id: 'docks', week: 2, days: [5], night: true, story: 'main', where: 'Pier Nine', title: 'Wren\'s crate', known: () => false, scene: 'docks' },
  { id: 'brick', week: 2, days: [5], night: true, story: 'main', where: 'The Crooked Scale', title: 'A brick through the window', known: () => false, scene: 'brick' },
  { id: 'office', week: 3, days: [5], night: true, story: 'main', where: 'Gilded Hand Finance', title: 'A word with Ms. Vantreece', known: () => false, scene: 'office' },
  { id: 'lighthouse', week: 4, days: [5], night: true, story: 'main', where: 'Gull Point', title: 'The blue light in the lighthouse', known: () => !!S.flags.lighthouseClue, scene: 'lighthouse' }
];

function calendarSeen(id) { return !!(S.flags.seen && S.flags.seen[id]); }
function calTitle(e) { return typeof e.title === 'function' ? e.title() : e.title; }
// the entries the player can see on a given day: told about it, or already lived through it
function calendarFor(week, day) {
  return CALENDAR.filter(e => calOn(e, week, day) && calInRun(e) && calInMonth(e) && (calendarSeen(e.id) || (e.known() && (!e.scene || !isPast(week, day)))))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}
// a fixed entry has week and days; a scheduled one is wherever this run placed its night
function calOn(e, week, day) {
  if (e.placed) { const d = S.run && (S.run[e.placedIn || 'nights'] || {})[e.placed]; return d === (week - 1) * 5 + day; }
  return e.week === week && e.days.includes(day);
}
// side-story entries (and Fog Week, which comes with its story) only exist in runs that drew the story
function calInRun(e) { const q = e.quest || (QUESTS[e.story] ? e.story : null); return questActive(q); }
// Main-story entries belong to the first month; `fromMonth` and `toMonth` limit any other entry.
function calInMonth(e) {
  const m = typeof monthNum === 'function' ? monthNum() : 1;
  return m >= (e.fromMonth || 1) && m <= (e.toMonth || (e.story === 'main' ? 1 : MONTHS.length));
}
function isPast(week, day) { return week < S.week || (week === S.week && day < S.day); }

// Record each scene as it happens. Scenes are called by name (story.x()), so wrapping them
// here needs no change to the scenes themselves.
function recordScene(e) {
  if (!e.scene || !story[e.scene]) return;
  const run = story[e.scene];
  story[e.scene] = function (...args) {
    S.flags.seen = S.flags.seen || {};
    S.flags.seen[e.id] = true;
    return run.apply(this, args);
  };
}
for (const e of CALENDAR) recordScene(e);

// Quests (js/quests/*.js) add their own entries. An entry belongs to the quest being defined, so it
// only shows in runs that drew it. For a night the scheduler places (questNight in js/runs.js),
// leave out week and days and give the night's id as `night`; the entry follows the night. A lunch
// errand (questErrand) works the same way with `errand: '<errand id>'`.
// `order` sorts entries on the same day (lower first). Define the scene before adding the entry.
function addCalendar(e) {
  if (questScope && !e.quest) e.quest = questScope;
  if (!CAL_STORIES[e.story] && QUESTS[e.story]) CAL_STORIES[e.story] = { label: QUESTS[e.story].title, col: QUESTS[e.story].colour || '#a0a0a0' };
  if (typeof e.night === 'string') { e.placed = e.night; e.night = true; }
  if (typeof e.errand === 'string') { e.placed = e.errand; e.placedIn = 'errands'; e.night = false; }
  if (!e.known) e.known = () => true;
  CALENDAR.push(e);
  recordScene(e);
}

// Each morning, a reminder of anything you've agreed to tonight.
HOOKS.morning.push(async () => {
  const tonight = calendarFor(S.week, S.day).filter(e => e.night && e.scene && !calendarSeen(e.id));
  for (const e of tonight) toast(`Tonight: ${calTitle(e)}, ${e.where}`, null, 'letter');
});

// The panel shows tonight's plans under the day.
const renderPanelBase = renderPanel;
renderPanel = function () {
  renderPanelBase();
  if (!S) return;
  const tonight = calendarFor(S.week, S.day).filter(e => e.night && e.scene && !calendarSeen(e.id));
  if (tonight.length) $('#panel-right').insertAdjacentHTML('beforeend', `<div class="tonight" title="${esc(tonight.map(e => e.where).join(', '))}">Tonight: ${esc(tonight.map(calTitle).join(', '))}</div>`);
};

function calendarModal() {
  const head = DAYS.map(d => `<th>${d.slice(0, 3)}</th>`).join('');
  let rows = '';
  for (let w = 1; w <= WEEKS; w++) {
    rows += `<tr><th>Week ${w}</th>`;
    for (let d = 1; d <= 5; d++) {
      const cls = w === S.week && d === S.day ? 'today' : isPast(w, d) ? 'past' : '';
      const items = calendarFor(w, d).map(e => {
        const st = CAL_STORIES[e.story];
        const done = calendarSeen(e.id) ? ' done' : '';
        return `<div class="cal-ev${done}" style="border-color:${st.col}" title="${esc(st.label)} · ${esc(e.where)}">${e.night ? '&#x1F319; ' : ''}${esc(calTitle(e))}<span class="where">${esc(e.where)}</span>${e.bring && typeof bagOn === 'function' && bagOn() ? `<span class="where bring">Bring: ${esc(bringText(e.bring))}</span>` : ''}</div>`;
      }).join('');
      rows += `<td class="${cls}">${items}</td>`;
    }
    rows += '</tr>';
  }
  const legend = Object.entries(CAL_STORIES).filter(([k]) => !QUESTS[k] || questActive(k)).map(([, s]) => s).map(s => `<span class="cal-key" style="border-color:${s.col}">${esc(s.label)}</span>`).join(' ');
  showModal(`<h2>Calendar${mainStoryOn() ? '' : `: ${monthInfo().name}`}</h2>
    <p class="muted">Aunt Odile's harbor calendar still hangs by the till. You pencil in anything you've agreed to; the rest you find out about the hard way. &#x1F319; means after closing.</p>
    <table class="calendar"><tr><th></th>${head}</tr>${rows}</table>
    <p class="cal-legend">${legend}</p>`);
}
