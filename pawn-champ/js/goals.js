// Pawn Champ - goals and progression: the month's main aims, weekly objectives, reputation tiers
// and shop upgrades. Numbers live in js/data.js (TIERS, UPGRADES, OBJECTIVES). Design: docs/PROGRESSION.md.
'use strict';

// Saves from before progression existed lack these fields.
function ensureProgress() {
  S.upgrades = S.upgrades || {};
  S.goals = S.goals || { start: null, done: [], handPaid: 0 };
  S.goals.done = S.goals.done || [];
  S.goals.handPaid = S.goals.handPaid || 0;
  for (const k of ['inspected', 'loans']) S.stats[k] = S.stats[k] || 0;
}

// ---------------------------------------------------------------- weekly objectives
const objId = (w, i) => `${w}-${i}`;
function objDelta(o) {
  const start = (S.goals.start && S.goals.start[o.stat]) || 0;
  return (S.stats[o.stat] || 0) - start;
}
// 'done', 'failed' or 'open'. endOfWeek settles the kinds that are only judged on Friday.
function objStatus(w, i, endOfWeek) {
  if (S.goals.done.includes(objId(w, i))) return 'done';
  if (w < S.week) return 'failed';
  const o = OBJECTIVES[w - 1][i];
  if (o.kind === 'count') return objDelta(o) >= o.n ? 'done' : endOfWeek ? 'failed' : 'open';
  if (o.kind === 'none') return objDelta(o) > 0 ? 'failed' : endOfWeek ? 'done' : 'open';
  if (!endOfWeek) return 'open';
  if (o.kind === 'heatBelow') return S.heat < o.n ? 'done' : 'failed';
  if (o.kind === 'repAtLeast') return S.rep >= o.n ? 'done' : 'failed';
  return 'open';
}
function objProgress(o) {
  if (o.kind === 'count') return `${Math.min(objDelta(o), o.n)}/${o.n}`;
  if (o.kind === 'none') return objDelta(o) ? `${objDelta(o)} sold` : 'so far so good';
  if (o.kind === 'heatBelow') return `heat ${S.heat} now`;
  if (o.kind === 'repAtLeast') return `reputation ${S.rep} now`;
  return '';
}
function rewardText(r) {
  return [r.coin ? `${money(r.coin)}` : '', r.rep ? `+${r.rep} rep` : ''].filter(Boolean).join(', ');
}
function checkObjectives(endOfWeek) {
  if (!S || !OBJECTIVES[S.week - 1]) return;
  ensureProgress();
  if (!S.goals.start) S.goals.start = { ...S.stats };
  OBJECTIVES[S.week - 1].forEach((o, i) => {
    const id = objId(S.week, i);
    if (S.goals.done.includes(id) || objStatus(S.week, i, endOfWeek) !== 'done') return;
    S.goals.done.push(id);
    if (o.reward.coin) change('coin', o.reward.coin, `Objective: ${o.text}`);
    if (o.reward.rep) change('rep', o.reward.rep, o.reward.coin ? '' : `Objective: ${o.text}`);
    toast(`Objective done: ${o.text} (${rewardText(o.reward)})`, null, 'tome');
  });
}

HOOKS.morning.unshift(async () => {
  ensureProgress();
  if (S.day === 1 || !S.goals.start) S.goals.start = { ...S.stats };
  if (S.day === 1) toast(`This week: ${OBJECTIVES[S.week - 1].map(o => o.text.toLowerCase()).join('; ')}. See GOALS.`, null, 'tome');
});
HOOKS.tick.push(() => checkObjectives(false));

// ---------------------------------------------------------------- the four aims
function aims() {
  const f = S.flags, paid = S.goals.handPaid;
  const tier = tierIndex(), top = TIERS.length - 1;
  const odileSteps = [
    { text: 'Read the note Odile left behind', done: !!(f.ledger || f.burned || f.gaveLedger) },
    { text: 'Keep her proof safe', done: !!(f.ledger || f.odileFreed) },
    { text: 'Learn where she went', done: !!f.lighthouseClue },
    { text: 'Bring her home', done: !!(f.odileHome || f.odileFreed) }
  ];
  const doors = { name: 'Keep the doors open', done: !S.over && S.week === WEEKS && S.day === 5,
    detail: `Strikes ${S.strikes}/2 · heat ${S.heat}/100. Two missed ${debtOn() ? 'installments' : 'rents'} or 100 heat and the shop is gone.` };
  const name = { name: 'Make a name in Hollow Neck', done: tier === top,
    detail: `Your shop is a <b>${TIERS[tier].name}</b>. ${TIERS[tier].blurb}${tier < top ? ` Next: ${TIERS[tier + 1].name} at ${TIERS[tier + 1].min} reputation.` : ''}`,
    bar: Math.min(1, S.rep / TIERS[top].min) };
  // after the first month: Saltire Capital's installments, or the new landlord's rent (docs/SEASONS.md)
  if (paperSoldOn()) {
    return [doors, { name: 'Keep up with Saltire Capital', done: paid >= WEEKS,
      detail: `${paid} of ${WEEKS} installments paid this month. ${money(installmentDue())} a week in ${monthInfo().name}, on top of the rent.`, bar: paid / WEEKS }, name];
  }
  if (!mainStoryOn()) {
    const rent = S.goals.rentPaid || 0;
    return [doors, { name: 'Pay the new landlord', done: rent >= WEEKS,
      detail: `${rent} of ${WEEKS} Fridays' rent paid this month. ${money(rentBase())} a week in ${monthInfo().name}${monthInfo().heating ? ', with heating oil' : ''}.`, bar: rent / WEEKS }, name];
  }
  return [
    doors,
    { name: 'Clear Odile\'s debt', done: paid >= WEEKS,
      detail: `${paid} of ${WEEKS} Gilded Hand installments settled. Forgiven ones count.`, bar: paid / WEEKS },
    { name: 'Find Aunt Odile', done: odileSteps[3].done, steps: odileSteps },
    name
  ];
}
const mark = ok => (ok ? '<span class="good">&#x2714;</span>' : '<span class="muted">&#x25CB;</span>');
const barHTML = v => `<div class="goal-bar"><i style="width:${Math.round(v * 100)}%"></i></div>`;

function objectivesHTML(w, end = false) {
  return `<table>${OBJECTIVES[w - 1].map((o, i) => {
    const st = objStatus(w, i, end);
    return `<tr><td>${st === 'done' ? mark(true) : st === 'failed' ? '<span class="bad">&#x2718;</span>' : mark(false)} ${esc(o.text)}</td>
      <td class="muted">${st === 'open' ? esc(objProgress(o)) : st}</td><td class="good">${rewardText(o.reward)}</td></tr>`;
  }).join('')}</table>`;
}

function goalsModal() {
  ensureProgress();
  const a = aims();
  const owned = Object.keys(UPGRADES).filter(hasUpgrade);
  return showModal(`<h2>Goals</h2>
    ${a.map(g => `<div class="goal"><h3>${mark(g.done)} ${g.name}</h3>
      ${g.detail ? `<p>${g.detail}</p>` : ''}${g.bar !== undefined ? barHTML(g.bar) : ''}
      ${g.steps ? `<ul class="goal-steps">${g.steps.map(s => `<li>${mark(s.done)} ${s.text}</li>`).join('')}</ul>` : ''}</div>`).join('')}
    <h3>This week's objectives (week ${S.week})</h3>
    ${objectivesHTML(S.week)}
    <p class="muted">Count objectives pay out the moment you finish them. The rest are judged when you close on Friday.</p>
    <h3>Shop upgrades</h3>
    <p>${owned.length ? owned.map(k => `${UPGRADES[k].icon} ${UPGRADES[k].name}`).join(' · ') : '<span class="muted">None yet. You can buy upgrades each weekend, after the bills.</span>'}</p>
    ${typeof handHTML === 'function' ? handHTML() : ''}`);
}

// ---------------------------------------------------------------- the weekend: score the week, buy upgrades
async function weekendResults() {
  checkObjectives(true);
  const got = OBJECTIVES[S.week - 1].filter((o, i) => S.goals.done.includes(objId(S.week, i))).length;
  await showModal(`<h2>Week ${S.week} objectives</h2>${objectivesHTML(S.week, true)}
    <p>You completed <b>${got} of ${OBJECTIVES[S.week - 1].length}</b>.</p>`, [{ label: 'Continue' }]);
}

async function upgradeShop() {
  for (;;) {
    const tier = tierIndex();
    const rows = Object.entries(UPGRADES).filter(([k, u]) => upgradeInMonth(u) || hasUpgrade(k)).map(([k, u]) => {
      const state = hasUpgrade(k) ? '<span class="good">installed</span>'
        : tier < u.tier ? `<span class="muted">needs ${TIERS[u.tier].name}</span>` : `${money(u.cost)}`;
      return `<tr><td>${u.icon} <b>${u.name}</b><br><span class="muted">${esc(u.text)}</span></td><td>${state}</td></tr>`;
    }).join('');
    const buttons = Object.entries(UPGRADES)
      .filter(([k, u]) => !hasUpgrade(k) && tier >= u.tier && upgradeInMonth(u))
      .map(([k, u]) => ({ label: `Buy ${u.name} (${money(u.cost)})`, value: k, disabled: S.coin < u.cost }));
    const v = await showModal(`<h2>The weekend: improve the shop</h2>
      <p>Your shop is a <b>${TIERS[tier].name}</b>. ${TIERS[tier].blurb} Cash on hand: <b>${money(S.coin)}</b>.</p>
      <table>${rows}</table>
      <p class="muted">Next Friday's bills: ${money(rentBase() + S.rentArrears + installmentDue(S.week + 1))}. Higher reputation tiers unlock more upgrades.</p>`,
    [...buttons, { label: 'Done', value: 'done' }]);
    if (v === 'done' || v === -1) return;
    const u = UPGRADES[v];
    if (!u || S.coin < u.cost) continue;
    Sound.stamp();
    change('coin', -u.cost, `Bought ${u.name}`);
    S.upgrades[v] = S.week;
    if (u.heat) change('heat', u.heat);
    if (u.rep) change('rep', u.rep);
    toast(`Installed: ${u.name}`, null, 'tome');
    renderPanel();
  }
}

HOOKS.weekend.push(async () => {
  ensureProgress();
  await weekendResults();
  if (S.week < WEEKS && !checkLose()) { modalLocked = true; await upgradeShop(); modalLocked = false; }
});

// ---------------------------------------------------------------- ending scorecard
function goalsSummaryHTML() {
  if (!S.goals) return '';
  const a = aims();
  const objTotal = OBJECTIVES.reduce((n, w) => n + w.length, 0);
  return `<h3>Goals</h3><table>${a.map(g => `<tr><td>${mark(g.done)} ${g.name}</td></tr>`).join('')}</table>
    <p>Weekly objectives: <b>${S.goals.done.length} of ${objTotal}</b> · Upgrades installed: <b>${Object.keys(S.upgrades || {}).length} of ${Object.values(UPGRADES).filter(u => !u.months).length + Object.keys(UPGRADES).filter(k => UPGRADES[k].months && hasUpgrade(k)).length}</b> · Final standing: <b>${TIERS[tierIndex()].name}</b></p>`;
}
