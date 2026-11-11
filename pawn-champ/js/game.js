// Pawn Champ - game engine, economy, encounters and story.
'use strict';

// ================================================================ utilities
const $ = sel => document.querySelector(sel);
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// `paused` is set by the pause menu (js/menus.js). Timers, walking and typing all hold while it is on.
let paused = false;
const sleep = async ms => {
  await new Promise(r => setTimeout(r, ms));
  while (paused) await new Promise(r => setTimeout(r, 100));
};
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : '');
function weighted(obj) {
  const total = Object.values(obj).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [k, w] of Object.entries(obj)) { if ((r -= w) < 0) return k; }
  return Object.keys(obj)[0];
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = randi(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Dollar amounts everywhere: "$1,250", with thousands separators.
function money(n) { return (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US'); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ================================================================ state
const SAVE_KEY = 'pawnchamp-save-v1';
let S = null;

function newState() {
  return {
    month: 1, week: 1, day: 1, coin: 100, rep: 50, heat: 10, strikes: 0, rentArrears: 0, borrowed: null,
    stock: [], loans: [], wants: [], notices: [], complaints: [], log: [], flags: { reports: 0, fenceDeals: 0 },
    stats: { bought: 0, sold: 0, fakesCaught: 0, thieves: 0, cheated: 0, inspected: 0, loans: 0 },
    upgrades: {}, goals: { start: null, done: [], handPaid: 0 },
    installmentMult: [1, 1, 1, 1], uid: 1, loupe: LOUPES_PER_DAY, over: null
  };
}
const dayNum = () => (S.week - 1) * 5 + S.day;
// Which month of a stay this is (docs/SEASONS.md). Month 1 is the main story's month; later months
// only happen when the player chooses to Stay on.
const monthNum = () => (S && S.month) || 1;
const monthInfo = () => MONTHS[monthNum() - 1];
const mainStoryOn = () => monthNum() === 1;
// Saves carry SAVE_VERSION (js/version.js). Saves from before versioning count as version 1.
// When the save's shape changes, bump SAVE_VERSION and add SAVE_MIGRATIONS[old] = s => { ...; return s; }
// so a player's run survives the update. A save from a newer build is not offered as Continue.
const SAVE_MIGRATIONS = {};
function save() { try { S.saveVersion = SAVE_VERSION; localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage may be blocked */ } }
function migrateSave(s) {
  if (!s || typeof s !== 'object') return null;
  let v = s.saveVersion || 1;
  if (v > SAVE_VERSION) return null;
  while (v < SAVE_VERSION) {
    if (!SAVE_MIGRATIONS[v]) return null; // no way forward: start fresh rather than crash mid-run
    s = SAVE_MIGRATIONS[v](s); v++;
  }
  s.saveVersion = SAVE_VERSION;
  return s;
}
function loadSave() { try { const s = localStorage.getItem(SAVE_KEY); return s ? migrateSave(JSON.parse(s)) : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ } }
function log(text) { S.log.unshift(`W${S.week} ${DAYS[S.day - 1].slice(0, 3)}: ${text}`); S.log = S.log.slice(0, 120); }

// Audio (music, ambience, sound effects) lives in js/audio.js as `Sound`.

// ================================================================ view + render loop
const canvas = $('#scene'), g = canvas.getContext('2d');
g.imageSmoothingEnabled = false;
const view = { bg: 'shop', timeOfDay: 0, doorOpen: 0, bell: 0, stock: [], counterIcon: null, highlight: null, actors: [], candleX: 200 };
// Setting view.bg also sets the place's music (PLACE_MUSIC in js/places.js).
{
  let bg = view.bg;
  Object.defineProperty(view, 'bg', {
    enumerable: true,
    get() { return bg; },
    set(v) { bg = v; Sound.place(placeMusic(v)); }
  });
}
let lastT = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  if (!paused) updateActors(dt);
  view.doorOpen = Math.max(0, view.doorOpen - dt);
  view.bell = Math.max(0, view.bell - dt);
  view.stock = S ? S.stock : [];
  g.setTransform(2, 0, 0, 2, 0, 0); // logical 320x180 grid on a 640x360 canvas
  drawScene(g, view, now);
  const sorted = view.actors.filter(a => !a.hidden).sort((a, b) => a.y - b.y);
  for (const a of sorted) {
    const talking = a === bubbleActor && typing;
    const f = a.walking ? 2 + (Math.floor(now / 130) % 4) : a.pose !== undefined ? a.pose : talking && Math.floor(now / 150) % 2 ? 6 : (Math.floor((now + a.phase) / 900) % 2);
    drawCharacter(g, a.look, a.x, a.y, f, a.facingLeft, a.alpha, figureScale(view.bg));
  }
  if (view.bg === 'shop' || view.bg === 'shopNight') drawShopFront(g, view, now);
  drawSceneLight(g, view, now);
  positionBubble();
  requestAnimationFrame(frame);
}

function makeActor(look, x, y, opts = {}) {
  const a = { look, x, y, tx: x, ty: y, speed: opts.speed || 42, facingLeft: !!opts.facingLeft, walking: false,
    alpha: opts.alpha, phase: Math.random() * 1000, name: opts.name || '', hidden: false, onArrive: null };
  view.actors.push(a);
  return a;
}
function removeActor(a) { view.actors = view.actors.filter(x => x !== a); }
function walkTo(a, x, y) {
  a.tx = x; a.ty = y === undefined ? a.y : y;
  if (Math.abs(a.tx - a.x) > 0.5) a.facingLeft = a.tx < a.x;
  a.walking = true;
  return new Promise(res => { a.onArrive = res; });
}
function updateActors(dt) {
  for (const a of view.actors) {
    if (!a.walking) continue;
    const dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy);
    const step = a.speed * dt * (fastMode ? 2.5 : 1);
    if (d <= step) {
      a.x = a.tx; a.y = a.ty; a.walking = false;
      const cb = a.onArrive; a.onArrive = null; if (cb) cb();
    } else { a.x += dx / d * step; a.y += dy / d * step; }
  }
}

// keeper stands behind the counter (feet hidden by the counter)
let keeper = null;
function placeKeeper() {
  keeper = makeActor(CAST.keeper.look, 236, 141, { facingLeft: true, name: 'You' });
}

// ================================================================ dialogue
let advanceResolver = null, typing = null, fastMode = false;
let textDelay = 14; // ms per letter; 0 shows the whole line at once. Set from Settings.
const bubble = $('#bubble'), narration = $('#narration');
let bubbleActor = null;

function waitAdvance() { return new Promise(r => { advanceResolver = r; }); }
function advance() {
  if (typing) { typing.finish(); return; }
  if (advanceResolver) { const r = advanceResolver; advanceResolver = null; r(); }
}
function typeInto(el, text) {
  return new Promise(res => {
    el.textContent = '';
    let i = 0;
    const speed = fastMode ? 2 : textDelay;
    const finish = () => { clearInterval(iv); el.textContent = text; typing = null; res(); };
    const iv = setInterval(() => {
      if (paused) return;
      i += 1; el.textContent = text.slice(0, i);
      if (i % 3 === 0) Sound.blip();
      if (i >= text.length) finish();
    }, speed);
    typing = { finish };
    if (!speed) finish();
  });
}
async function say(actor, text) {
  bubbleActor = actor;
  bubble.querySelector('.who').textContent = actor && actor.name ? actor.name : '';
  bubble.classList.remove('hidden', 'done');
  positionBubble();
  await typeInto(bubble.querySelector('.txt'), text);
  bubble.classList.add('done');
  await waitAdvance();
  bubble.classList.add('hidden');
  bubbleActor = null;
}
async function narrate(text) {
  narration.classList.remove('hidden', 'done');
  await typeInto(narration.querySelector('.txt'), text);
  narration.classList.add('done');
  await waitAdvance();
  narration.classList.add('hidden');
}
function positionBubble() {
  if (!bubbleActor || bubble.classList.contains('hidden')) return;
  const st = $('#stage').getBoundingClientRect();
  const k = st.width / W;
  const a = bubbleActor;
  const top = (a.y - figureHeight(a.look) * figureScale(view.bg) - 4) * k;
  const bw = bubble.offsetWidth;
  let left = a.x * k;
  const minL = bw / 2 + 4, maxL = st.width - bw / 2 - 4;
  const clamped = clamp(left, minL, maxL);
  bubble.style.left = clamped + 'px';
  bubble.style.top = Math.max(bubble.offsetHeight + 4, top) + 'px';
  bubble.style.setProperty('--tail', clamp(50 + (left - clamped) / bw * 100, 8, 92) + '%');
}
function choose(options) {
  // options: [{label, hint, disabled}] or strings
  const box = $('#choices');
  box.innerHTML = '';
  box.classList.remove('hidden');
  return new Promise(res => {
    const done = i => { Sound.choice(); box.classList.add('hidden'); box.innerHTML = ''; document.removeEventListener('keydown', onKey); res(i); };
    const opts = options.map(o => typeof o === 'string' ? { label: o } : o);
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.innerHTML = `<span class="key">${i + 1}.</span>${o.icon ? `<img class="ch-ico" src="${iconURL(o.icon)}">` : ''}${esc(o.label)}${o.hint ? `<span class="hint">${esc(o.hint)}</span>` : ''}`;
      b.disabled = !!o.disabled;
      if (o.card) b.classList.add('card-choice'); // a choice a card opened (js/cards.js)
      if (o.needs) b.classList.add('bag-choice'); // a choice something in your bag opened (js/bag.js)
      b.onclick = e => { e.stopPropagation(); done(i); };
      box.appendChild(b);
    });
    const onKey = e => {
      if (modalOpen || paused) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= opts.length && !opts[n - 1].disabled) done(n - 1);
    };
    document.addEventListener('keydown', onKey);
  });
}

$('#stage').addEventListener('click', e => {
  if (e.target.closest('button, input, .card, .choices, #title')) return;
  advance();
});
document.addEventListener('keydown', e => {
  if (paused) return;
  if (modalOpen) { if (e.key === 'Escape') closeModal(); return; }
  if (e.key === ' ' || e.key === 'Enter') {
    if (document.activeElement && document.activeElement.tagName === 'BUTTON') document.activeElement.blur();
    e.preventDefault(); advance();
  }
});

// ================================================================ toasts, banner, fades
// A toast is a side pop-up. It only shows, and only counts down, while nothing covers it: the
// narration box, a modal, the pause menu or the title. One that arrives under the narration waits
// for it to close, and one already up when the narration opens hides and keeps its time.
const TOAST_MS = 4200;
const toastWaiting = [];
const toastBlocked = () => paused || modalOpen || !narration.classList.contains('hidden') || !$('#title').classList.contains('hidden');
function toast(text, look, icon) {
  const t = document.createElement('div');
  t.className = 'toast';
  const img = look ? `<img src="${portraitURL(look)}">` : icon ? `<img src="${iconURL(icon)}">` : '';
  t.innerHTML = `${img}<span>${esc(text)}</span>`;
  t._left = Math.max(TOAST_MS, 1500 + String(text).length * 50); // long ones (the week's goals) stay up long enough to read
  if (toastBlocked()) toastWaiting.push(t); else showToast(t);
}
function showToast(t) { Sound.toast(); $('#toasts').appendChild(t); }
let toastLast = performance.now();
setInterval(() => {
  const now = performance.now(), dt = now - toastLast;
  toastLast = now;
  const blocked = toastBlocked();
  $('#toasts').classList.toggle('held', blocked);
  if (blocked) return;
  while (toastWaiting.length) showToast(toastWaiting.shift());
  for (const t of $('#toasts').children) {
    if (t.classList.contains('out')) continue;
    t._left = (t._left ?? TOAST_MS) - dt;
    if (t._left <= 0) { t.classList.add('out'); setTimeout(() => t.remove(), 800); }
  }
}, 100);
function setBanner() {
  $('#week-banner').classList.remove('hidden');
  $('#week-text').textContent = `Week ${S.week} · ${DAYS[S.day - 1]}`;
}
async function fadeOut() { $('#fade').classList.add('on'); await sleep(550); }
async function fadeIn() { $('#fade').classList.remove('on'); await sleep(450); }

// ================================================================ resources
function change(field, n, reason) {
  if (!n) return;
  if (field === 'rep' && n <= -4 && typeof standingWord === 'function') n = standingWord(n); // a friend's good word (js/favours.js)
  const before = S[field];
  if (field === 'coin') S.coin = Math.max(0, S.coin + n);
  else S[field] = clamp(S[field] + n, 0, 100);
  const real = S[field] - before;
  if (reason) log(`${reason} (${field === 'coin' ? `${n > 0 ? '+' : '-'}${money(Math.abs(n))}` : `${n > 0 ? '+' : ''}${n} ${field}`})`);
  renderPanel();
  const el = document.querySelector(`.res[data-k="${field}"]`);
  if (el && real) {
    const f = document.createElement('div');
    const goodUp = field !== 'heat';
    f.className = 'float ' + ((real > 0) === goodUp ? 'up' : 'down');
    f.textContent = (real > 0 ? '+' : '') + real;
    el.appendChild(f);
    setTimeout(() => f.remove(), 1400);
  }
  if (field === 'coin') { if (n > 0) Sound.coin(); }
  else if (field === 'rep' && real) (real > 0 ? Sound.repUp : Sound.repDown)();
  else if (field === 'heat' && real > 0) Sound.heat();
}
// progression helpers (data in js/data.js, screens in js/goals.js)
function hasUpgrade(k) { return !!(S.upgrades && S.upgrades[k]); }
function tierIndex(rep = S.rep) { let t = 0; TIERS.forEach((x, i) => { if (rep >= x.min) t = i; }); return t; }
function shelfCap() { return STOCK_SIZE + (hasUpgrade('shelving') ? UPGRADES.shelving.slots : 0); }
function loupeCap() { return LOUPES_PER_DAY + diffInfo().loupes + (hasUpgrade('loupe') ? UPGRADES.loupe.loupes : 0) + itemEffect('loupe') + (typeof cardLoupes === 'function' ? cardLoupes() : 0) + (typeof stayLoupes === 'function' ? stayLoupes() : 0); }
// unique items with an effect (js/runs.js, addUnique) work while they're in stock: numbers add up, multipliers multiply
function itemEffect(k, mult) {
  let v = mult ? 1 : 0;
  for (const it of (S ? S.stock : [])) if (it.effect && it.effect[k] !== undefined) v = mult ? v * it.effect[k] : v + it.effect[k];
  return v;
}
function shelfFree() { return S.stock.length < shelfCap(); }
// Items a customer could buy right now: not pawn surety, not marked not-for-sale.
function forSale() { return S.stock.filter(i => !i.held && !i.nosale); }
// Who the Friday installment goes to (docs/SEASONS.md): the Gilded Hand in the first month. In a stay,
// if October left the Hand's debt unpaid, it is sold on to Saltire Capital (the spine "The Paper Is
// Sold On") and the old rent stays. Otherwise the building has a new owner whose rent is the bill.
const paperSoldOn = () => !mainStoryOn() && !!S.stay && S.stay.spine === 'paper';
const debtOn = () => mainStoryOn() || paperSoldOn();
const creditor = () => (mainStoryOn() ? { name: 'Gilded Hand Finance', short: 'the Hand' } : { name: 'Saltire Capital', short: 'Saltire' });
// Difficulty, picked at New game (docs/MECHANICS.md#difficulty): bills, loupes, and in js/bag.js the
// item hints and wear. Normal is the game as balanced.
const DIFFICULTY = {
  easy: { label: 'Easy', bills: 0.8, loupes: 1, text: 'Bills 20% lower, one more loupe a day, and hints for what to bring are always shown.' },
  normal: { label: 'Normal', bills: 1, loupes: 0, text: 'The month as it was meant: tight, but fair.' },
  hard: { label: 'Hard', bills: 1.2, loupes: 0, text: 'Bills 20% higher, no hints for what to bring, and things you take out wear twice as fast.' }
};
const diffInfo = () => DIFFICULTY[(S && S.difficulty) || 'normal'] || DIFFICULTY.normal;
const diffMoney = v => Math.round(v * diffInfo().bills);
function installmentDue(w = S.week) {
  if (paperSoldOn()) return saltireOff() ? 0 : monthInfo().rent - RENT; // the same Friday total as the new landlord's rent
  if (!mainStoryOn()) return 0;
  return diffMoney(INSTALLMENTS[w - 1] * S.installmentMult[w - 1]) + (S.lateInstallment && S.lateInstallment.week === w ? S.lateInstallment.amt : 0);
}
// rent before arrears, with the month's heating oil: a Tax Abatement or Gordie's Jingle card moves it (js/cards.js)
function rentBase() { return diffMoney((debtOn() ? RENT : monthInfo().rent) + monthInfo().heating) + (typeof cardRent === 'function' ? cardRent() : 0); }
function billsDue() { return rentBase() + S.rentArrears + installmentDue() + (typeof loanDueNow === 'function' && loanDueNow() ? S.borrowed.owed : 0); }
function billsLabel() { return (debtOn() ? `rent + ${creditor().name}` : 'rent') + (monthInfo().heating ? ' and heating oil' : ''); }

function renderPanel() {
  if (!S) return;
  const grid = $('#stock-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${Math.ceil(shelfCap() / 3)}, 1fr)`;
  for (let i = 0; i < shelfCap(); i++) {
    const it = S.stock[i];
    const d = document.createElement('div');
    d.className = 'slot' + (it ? '' : ' empty');
    if (it) {
      d.title = `${it.name} (${it.condLabel})${it.held ? ' - held for a loan' : ''}${it.spot >= 0 ? ', ' + spotWhere(it) : ''}`;
      d.innerHTML = `<img src="${iconURL(it.icon)}">` +
        (it.held ? '<span class="flag held">LOAN</span>' : it.curio ? '<span class="flag curio">CURIO</span>' : it.knownFake ? '<span class="flag fake">FAKE</span>' : it.knownHot ? '<span class="flag hot">HOT</span>' : '');
      d.onclick = () => openMenu('stock');
    }
    grid.appendChild(d);
  }
  const heatCol = S.heat > 70 ? 'var(--red)' : S.heat > 40 ? '#d08a2a' : 'var(--green)';
  $('#resources').innerHTML = `
    <div class="res" data-k="coin" title="Cash"><span class="ico">&#x1F4B5;</span><span class="num">${money(S.coin)}</span><span class="lbl">Cash</span></div>
    <div class="res" data-k="rep" title="Reputation around town: more walk-in sales. Your shop is a ${TIERS[tierIndex()].name}."><span class="ico">&#x1F3AD;</span><span class="num">${S.rep}</span><span class="lbl">${TIERS[tierIndex()].name}</span></div>
    <div class="res" data-k="heat" title="Police suspicion: raids. At 100 the shop is shut."><span class="ico">&#x1F6E1;</span><span class="num">${S.heat}</span><div class="bar"><i style="width:${S.heat}%;background:${heatCol}"></i></div><span class="lbl">Heat</span></div>
    <div class="res" title="Due this Friday: ${billsLabel()}"><span class="ico">&#x1F4DC;</span><span class="num">${money(billsDue())}</span><span class="lbl">Bills due</span></div>
    <div class="divider"></div>
    <div class="res small" title="Loupe uses left today"><span class="ico">&#x1F50D;</span><span class="num">${S.loupe}</span><span class="lbl">Loupe</span></div>
    <div class="res small" title="Items on loan"><span class="ico">&#x1F91D;</span><span class="num">${S.loans.length}</span><span class="lbl">Loans out</span></div>
    <div class="res small" title="${debtOn() ? `Missed ${creditor().name} payments. Two and they take the shop.` : 'Unpaid rent. Two missed Fridays and the landlord changes the locks.'}"><span class="ico">&#x2620;</span><span class="num">${S.strikes}/2</span><span class="lbl">Strikes</span></div>
    <div class="res small" title="Room for stock: shelves, glass case, pegboard and window"><span class="ico">&#x1F4E6;</span><span class="num">${S.stock.length}/${shelfCap()}</span><span class="lbl">Stock</span></div>`;
  const left = view.queueLeft;
  $('#panel-right').innerHTML = `<div class="big">${DAYS[S.day - 1]}</div>
    <div>${mainStoryOn() ? '' : monthInfo().name + ', '}Week ${S.week} of ${WEEKS}</div>
    <div>${left !== undefined && left !== null ? `${left} waiting` : '&nbsp;'}</div>
    <div class="muted">${S.day === 5 ? 'Bills due tonight' : `Bills due in ${5 - S.day} day${5 - S.day === 1 ? '' : 's'}`}</div>`;
}

// ================================================================ modals + menus
let modalOpen = false, modalClose = null;
function showModal(html, buttons = [{ label: 'Close' }], onRender) {
  return new Promise(res => {
    const m = $('#modal'), box = m.querySelector('.modal-box');
    box.innerHTML = html + '<div class="actions"></div>';
    const act = box.querySelector('.actions');
    const finish = v => { modalOpen = false; modalClose = null; m.classList.add('hidden'); res(v); };
    buttons.forEach((b, i) => {
      const el = document.createElement('button');
      el.textContent = b.label; el.disabled = !!b.disabled;
      el.onclick = () => finish(b.value !== undefined ? b.value : i);
      act.appendChild(el);
    });
    modalClose = () => finish(-1);
    modalOpen = true;
    m.classList.remove('hidden');
    if (onRender) onRender(box, finish);
  });
}
function closeModal() { if (modalClose) modalClose(); }
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && !modalLocked) closeModal(); });
let modalLocked = false;

document.querySelectorAll('#menu button').forEach(b => b.addEventListener('click', () => openMenu(b.dataset.menu)));

function openMenu(which) {
  if (!S || modalOpen) return;
  if (which === 'ledger') { Sound.paper(); return ledgerModal(); }
  if (which === 'stock') { Sound.paper(); return stockModal(); }
  if (which === 'notices') { Sound.paper(); return noticesModal(); }
  if (which === 'goals') { Sound.paper(); return goalsModal(); }
  if (which === 'calendar') { Sound.paper(); return calendarModal(); }
  if (which === 'options') return openPause();
}

function itemTags(it) {
  const t = [];
  if (it.held) t.push('<span class="muted">held for loan</span>');
  if (it.knownFake) t.push('<span class="bad">fake</span>');
  if (it.knownHot) t.push('<span class="bad">stolen</span>');
  if (it.inspected && !it.knownFake) t.push('<span class="good">genuine</span>');
  if (it.questKey) t.push('<span class="muted">kept for a story</span>');
  const ud = it.uniqueId && typeof UNIQUES !== 'undefined' ? UNIQUES[it.uniqueId] : null;
  if (it.wantedBy && (!ud || !ud.wantedKnown || ud.wantedKnown())) t.push(`<span class="good">${esc(it.wantedBy.name)} wants this</span>`);
  if (it.set) t.push(`<span class="muted">part of a set: ${esc(it.set)}</span>`);
  if (it.effectText) t.push(`<span class="good">${esc(it.effectText)}</span>`);
  if (it.inspected) t.push(`<span class="muted">${it.mark ? 'mark: ' + esc(it.mark) : it.filed ? 'crest filed off' : 'no marks'}</span>`);
  return t.join(' · ');
}

function ledgerModal() {
  const loans = S.loans.map(l => {
    const it = S.stock.find(i => i.uid === l.itemUid);
    const due = dueText(l.due);
    return `<tr><td>${it ? `<img src="${iconURL(it.icon)}"> ${esc(it.name)}` : '?'}</td><td>${esc(l.who)}</td><td>${money(l.lent)}</td><td>${money(l.owed)}</td><td>${due}</td></tr>`;
  }).join('') || '<tr><td colspan="5" class="muted">No loans outstanding.</td></tr>';
  const sched = INSTALLMENTS.map((v, i) => `<td class="${i + 1 === S.week ? 'good' : i + 1 < S.week ? 'muted' : ''}">${money(diffMoney(v * S.installmentMult[i]))}</td>`).join('');
  showModal(`<h2>Ledger</h2>
    <h3>This week</h3>
    <table><tr><td>Rent${monthInfo().heating ? ' and heating oil' : ''}${S.rentArrears ? ' (with arrears)' : ''}</td><td>${money(rentBase() + S.rentArrears)}</td></tr>
    ${debtOn() ? `<tr><td>${creditor().name} installment</td><td>${money(installmentDue())}</td></tr>` : ''}
    ${S.borrowed ? `<tr><td>Loan from ${esc(S.borrowed.name)}, due ${loanDueText(S.borrowed.week)}</td><td>${money(S.borrowed.owed)}</td></tr>` : ''}
    <tr><td>Strikes (${debtOn() ? 'missed installments' : 'unpaid rent'})</td><td>${S.strikes} of 2</td></tr></table>
    ${mainStoryOn() ? `<h3>Gilded Hand schedule</h3><table><tr><th>Week 1</th><th>Week 2</th><th>Week 3</th><th>Week 4</th></tr><tr>${sched}</tr></table>` : ''}
    <h3>Wanted by customers</h3>${wantsTable()}
    <h3>Loans out</h3><table><tr><th>Surety</th><th>Customer</th><th>Lent</th><th>Owed back</th><th>Due</th></tr>${loans}</table>
    ${typeof rolodexHTML === 'function' ? rolodexHTML() : ''}
    <h3>Record</h3><div class="log">${S.log.map(l => `<div>${esc(l)}</div>`).join('') || '<div class="muted">Nothing yet.</div>'}</div>`,
  [{ label: S.borrowed ? 'Phone (a loan is out)' : 'Phone for a loan', value: 'phone', disabled: !!S.borrowed }, { label: 'Close' }])
    .then(v => { if (v === 'phone') return phoneForLoan(); }); // a short-term loan (js/borrow.js)
}

function dueText(d) { return d > 20 ? 'end of the month' : `W${Math.ceil(d / 5)} ${DAYS[(d - 1) % 5]}`; }
function wantsTable() {
  const rows = (S.wants || []).map(w => `<tr><td><img src="${iconURL(ITEMS[w.key].icon)}"> ${esc(ITEMS[w.key].name)}</td><td>${esc(w.name)}</td><td>about ${money(Math.round(ITEMS[w.key].base * w.mult))}</td><td>${dueText(w.due)}</td></tr>`).join('');
  return rows ? `<table><tr><th>Item</th><th>Customer</th><th>Pays (fair condition)</th><th>Back on</th></tr>${rows}</table>` : '<p class="muted">Nobody is waiting on anything.</p>';
}
function junkPrice(it) { return it.fake ? Math.max(2, Math.round(it.guide * 0.06)) : Math.round(it.guide * 0.5); }
function fencePrice(it) { return it.fake ? Math.max(3, Math.round(it.guide * 0.1)) : Math.round(it.guide * (it.stolen ? 0.7 : 0.6) * (typeof hasCard === 'function' && hasCard('wren') ? 1.1 : 1)); }

function stockModal() {
  const render = (box) => {
    const rows = S.stock.map(it => `<tr>
      <td><img src="${iconURL(it.icon)}"></td>
      <td>${esc(it.name)}<br><span class="muted">${it.condLabel} · ${CAT_LABEL[it.cat]} · ${spotWhere(it)}</span></td>
      <td>${money(it.guide)}</td><td>${money(it.paid)}</td><td>${[itemTags(it), stolenTags(it)].filter(Boolean).join(' · ') || '<span class="muted">not inspected</span>'}</td>
      <td>${it.inspected ? '' : `<button data-look="${it.uid}" ${S.loupe <= 0 && !freeLook(it) ? 'disabled' : ''}>Loupe (${freeLook(it) ? 'free' : `${S.loupe} left`})</button><br>`}
          ${it.held || it.nosale ? (it.nosale && !it.backroom ? '<span class="muted">not for sale</span>' : '') : `<button data-junk="${it.uid}">Scrap: ${money(junkPrice(it))}</button>`}
          ${!it.held && (!it.nosale || it.backroom === 'hidden') && S.flags.fence && !S.flags.wrenGone ? `<br><button data-fence="${it.uid}" ${cameraRecording() ? 'disabled title="Wren won\'t deal in front of the camera"' : ''}>${cameraRecording() ? 'Wren: not on camera' : `Wren: ${money(fencePrice(it))}`}</button>` : ''}
          ${stolenButtons(it)}</td></tr>`).join('');
    box.querySelector('.stock-body').innerHTML = rows || '<tr><td colspan="6" class="muted">The shop is empty.</td></tr>';
    box.querySelectorAll('[data-junk]').forEach(b => b.onclick = () => {
      const it = S.stock.find(i => i.uid === +b.dataset.junk);
      sellOff(it, junkPrice(it), 'Sal the scrap dealer'); render(box);
    });
    box.querySelectorAll('[data-fence]').forEach(b => b.onclick = () => {
      const it = S.stock.find(i => i.uid === +b.dataset.fence);
      sellOff(it, fencePrice(it), 'Wren'); S.flags.fenceDeals++;
      change('heat', it.stolen ? 4 : 1); render(box);
    });
    wireStolenButtons(box, () => render(box)); // loupe, report and hide (js/stolen.js)
  };
  showModal(`<h2>Stock</h2>
    <p class="muted">Everything you own is on display: jewelry and watches in the glass case, guitars and knives on the pegboard, art and silver in the window, the rest on the shelves. Shoppers come in through the day and ask about what they see, and a few more buy at closing time. Anything you haven't looked at yet can go under the loupe here, and if it turns out to be stolen you can report it or hide it in the back. Need cash fast? Sal the scrap dealer pays half the guide price for genuine goods and pennies for fakes${S.flags.fence && !S.flags.wrenGone ? '. Wren pays more and asks no questions, but it draws police attention' : ''}.</p>
    <table><tr><th></th><th>Item</th><th>Guide</th><th>Paid</th><th>Notes</th><th></th></tr><tbody class="stock-body"></tbody></table>
    <h3>Wanted by customers</h3>${wantsTable()}`,
  [{ label: 'Close' }], box => render(box));
}
function sellOff(it, price, to) {
  S.stock = S.stock.filter(i => i !== it);
  change('coin', price, `Sold ${it.name} to ${to}`);
  S.stats.sold++;
  onSold(it, 'dump');
  renderPanel();
}

function noticesModal() {
  const rows = S.notices.map(n => `<tr><td><img src="${iconURL(ITEMS[n.key].icon)}"></td><td>${ITEMS[n.key].name}</td><td>bearing <b>${esc(n.mark)}</b></td><td>${esc(n.owner)}</td><td class="muted">week ${n.week}</td></tr>`).join('');
  showModal(`<h2>Police notices: stolen goods</h2>
    <p class="muted">Emailed over by Captain Barrow and taped up by the till. Use your loupe to read an item's marks. Buying a listed item risks a raid; calling the police when a thief walks in earns a reward. Thefts from this week go on next Monday's list. If the camera over the shelves is working, it puts a face to whoever sold you something.</p>
    <table><tr><th></th><th>Item</th><th>Mark</th><th>Stolen from</th><th>Posted</th></tr>${rows || '<tr><td colspan="5" class="muted">No notices yet.</td></tr>'}</table>`);
}

// ================================================================ items + customers
function makeItem(key, o = {}) {
  const t = ITEMS[key];
  const ci = o.cond !== undefined ? o.cond : weighted({ 0: 3, 1: 5, 2: 3, 3: 1 });
  const cond = CONDITIONS[ci];
  return {
    uid: S.uid++, key, name: o.name || t.name, icon: o.icon || t.icon, cat: o.cat || t.cat,
    cond: +ci, condLabel: cond.label, guide: o.guide || Math.round(t.base * cond.mult),
    fake: !!o.fake, stolen: !!o.stolen, noticeId: o.noticeId || null, mark: o.mark || null, filed: !!o.filed,
    paid: 0, inspected: false, knownFake: false, knownHot: false, clues: [], held: null
  };
}
function randomLook() {
  const style = pick(STYLES);
  const hat = style === 'suit' ? null : pick(HATS);
  return {
    skin: pick(SKINS), hair: pick(HAIRS), hs: randi(0, 5), coat: pick(COATS), style,
    trim: pick(['#e8e4dc', '#c8c0b0', '#2a2a2e', '#8a2a2a', '#3a5a8a']), logo: Math.random() < 0.5 ? pick(COATS) : undefined,
    pants: pick(['#2a3a5a', '#3a4a6a', '#2a2a2e', '#5a4a3a', '#4a4a50', '#6a5a4a']),
    hat, hatc: pick(['#2a2430', '#c84a3a', '#2a3a6a', '#3a5a3a', '#6a6a5a', '#e8a020', '#1e1e22']), long: style === 'jacket' && Math.random() < 0.3,
    vest: pick(['#d8e040', '#e8a020']), glasses: Math.random() < 0.18 ? '#141416' : undefined,
    bag: Math.random() < 0.2 ? pick(['#3a2a1e', '#8a2a4a', '#2a2a2e', '#5a7a9a']) : undefined,
    beard: Math.random() < 0.2 ? pick(HAIRS) : undefined, stout: Math.random() < 0.25, apron: Math.random() < 0.05 ? '#b8a682' : undefined
  };
}
function randomName() { return Math.random() < 0.6 ? `${pick(FIRST)} ${pick(TRADES)}` : pick(FIRST); }
// What sellers, borrowers and wanted customers bring: the staples, plus tools when the bag is on (js/bag.js)
function pickTradeKey() { return FEATURES.bag && Math.random() < 0.125 ? pick(TOOL_KEYS) : pick(ITEM_KEYS); }
function usedMarks() { return S.notices.map(n => n.mark).concat((S.fresh || []).map(f => f.mark)); }
function innocentMark() { const pool = MARKS.filter(m => !usedMarks().includes(m)); return Math.random() < 0.5 ? pick(pool) : null; }

function addNotices(count, forced) {
  const list = forced ? [...forced] : [];
  while (list.length < count) {
    const key = pick(ITEM_KEYS);
    const pool = MARKS.filter(m => !usedMarks().includes(m) && !list.some(x => x.mark === m));
    list.push({ key, mark: pick(pool), owner: pick(OWNERS) });
  }
  for (const n of list) S.notices.push({ id: S.uid++, week: S.week, ...n });
}

function genSeller() {
  const w = S.week;
  const kind = weighted({ genuine: 60 - w * 4, fake: 24 + w * 2, stolen: 14 + w * 3 });
  let item;
  if (kind === 'stolen') {
    const r = Math.random();
    if (S.notices.length && r < 0.8 - STOLEN.fresh) {
      const n = pick(S.notices);
      item = makeItem(n.key, { stolen: true, noticeId: n.id, mark: n.mark });
    } else if (r < 0.8) item = freshTheft(pick(ITEM_KEYS)); // not on a notice until next Monday (js/stolen.js)
    if (!item) item = makeItem(pickTradeKey(), { stolen: true, filed: true });
  } else {
    // decoys: genuine goods of the same kind as a listed item, but with a different mark
    const key = S.notices.length && Math.random() < 0.25 ? pick(S.notices).key : pickTradeKey();
    item = makeItem(key, { fake: kind === 'fake', mark: innocentMark() });
  }
  const persona = weighted(PERSONA_WEIGHTS[kind]);
  let f;
  if (kind === 'stolen') f = rand(0.3, 0.5);
  else if (kind === 'fake') f = rand(0.62, 0.88);
  else f = persona === 'proud' ? rand(0.85, 1.05) : persona === 'desperate' ? rand(0.45, 0.65) : rand(0.6, 0.85);
  const asking = Math.max(4, Math.round(item.guide * f));
  const P = PERSONAS[persona];
  return { type: 'seller', kind, item, persona, asking, min: Math.round(asking * rand(P.min[0], P.min[1])),
    look: randomLook(), name: randomName() };
}
function genLoanSeeker() {
  const r = Math.random();
  const kind = r < 0.65 ? 'genuine' : r < 0.9 ? 'fake' : 'stolen';
  const item = kind === 'stolen' ? makeItem(pickTradeKey(), { stolen: true, filed: true }) : makeItem(pickTradeKey(), { fake: kind === 'fake', mark: innocentMark() });
  const persona = kind === 'genuine' ? weighted({ honest: 60, desperate: 40 }) : kind === 'fake' ? 'smooth' : 'shifty';
  const asking = Math.max(5, Math.round(item.guide * rand(0.35, 0.55)));
  const days = randi(2, 3);
  return { type: 'loan', kind, item, persona, asking, min: Math.round(asking * rand(0.7, 0.85)), days,
    returns: kind === 'genuine' ? Math.random() < 0.8 : Math.random() < 0.08, look: randomLook(), name: randomName() };
}
function genBuyer() {
  const cats = S.stock.filter(i => !i.held).map(i => i.cat);
  const cat = cats.length && Math.random() < 0.7 ? pick(cats) : pick(Object.keys(CATS));
  return { type: 'buyer', cat, mult: rand(BUYER_MULT[0], BUYER_MULT[1]), sharp: Math.random() < 0.35, look: randomLook(), name: randomName() };
}
// half the wanted customers in a later month ask for that month's things (MONTHS[].wants)
function pickWantedKey() {
  const pool = (monthInfo().wants || []).filter(k => ITEMS[k] && (!ITEMS[k].tool || FEATURES.bag));
  return pool.length && Math.random() < 0.5 ? pick(pool) : pickTradeKey();
}
// what the month does to a shopper's price for this kind of thing (MONTHS[].likes)
const seasonLike = it => (monthInfo().likes || {})[it.cat] || 1;
function genWanted() {
  return { type: 'wanted', key: pickWantedKey(), mult: rand(WANTED_MULT[0], WANTED_MULT[1]), sharp: Math.random() < 0.35, look: randomLook(), name: randomName() };
}
function genShopper() {
  return { type: 'shopper', sharp: Math.random() < SHOPPERS.sharp, look: randomLook(), name: randomName() };
}
function shopperCount() {
  const n = forSale().length;
  if (!n) return 0;
  const sign = hasUpgrade('sign') ? UPGRADES.sign.shoppers : 0;
  const k = randi(SHOPPERS.base[0], SHOPPERS.base[1]) + Math.floor(n / SHOPPERS.perStock) + (S.rep >= SHOPPERS.repBonus ? 1 : 0) + sign
    + (typeof bonusShoppers === 'function' ? bonusShoppers() : 0) // a week of opening on time (js/secrets.js)
    + monthInfo().shoppers // the season: December's rush, January's empty streets
    + (typeof standingShoppers === 'function' ? standingShoppers() : 0); // regulars' favours and grudges (js/favours.js)
  return Math.max(0, Math.min(n, Math.min(SHOPPERS.max + sign, k) + (typeof cardShoppers === 'function' ? cardShoppers() : 0)));
}
function genRandomCustomer() {
  const r = Math.random();
  const sellable = forSale().length, buy = BUYER_CHANCE[tierIndex()];
  if (sellable >= 2 && r < buy) return genBuyer();
  if (r < buy + 0.1) return genWanted();
  if (r < buy + 0.25) return genLoanSeeker();
  return genSeller();
}

// ================================================================ the appraisal card
const cardEl = $('#card');
function cardHTML(c, ask, mode) {
  const it = c.item;
  const clues = it.inspected ? `<ul class="clues">${it.clues.map(cl => `<li class="${cl.cls || ''}">${esc(cl.text)}</li>`).join('')}</ul>` :
    '<div class="note">Not inspected. Use your loupe to check it\'s genuine and read its marks.</div>';
  const tags = (it.knownFake ? '<span class="tag fake">FAKE</span>' : '') + (it.inspected && !it.knownFake ? '<span class="tag ok">GENUINE</span>' : '') +
    (it.knownHot ? '<span class="tag hot">ON A NOTICE</span>' : '');
  const verb = mode === 'loan' ? 'Lend' : 'Pay';
  const full = !shelfFree();
  return `<div class="row"><img class="icon" src="${iconURL(it.icon)}"><div>
      <h3>${esc(it.name)}</h3>
      <div class="meta">${CAT_LABEL[it.cat]} · ${it.condLabel}<br>Guide value if genuine: <b>${money(it.guide)}</b></div>
      <div>${tags}</div></div></div>
    <div class="ask">${mode === 'loan' ? `Wants a loan of <b>${money(ask)}</b><br><span class="meta">repays ${money(Math.round(ask * 1.3))} in ${c.days} days</span>` : `Asking <b>${money(ask)}</b>`}</div>
    ${clues}
    <div class="btns">
      <button data-a="inspect" ${(S.loupe <= 0 && !freeLook(it)) || it.inspected ? 'disabled' : ''}>Inspect (${freeLook(it) ? 'free' : `${S.loupe} left`})</button>
      <button data-a="pay" ${S.coin < ask || full ? 'disabled' : ''}>${verb} ${money(ask)}</button>
      <div class="haggle"><input type="range" min="1" max="${Math.max(1, ask - 1)}" value="${Math.max(1, Math.round(ask * 0.7))}"><span class="val"></span><button data-a="offer" ${full ? 'disabled' : ''}>Offer</button></div>
      <button data-a="watch">Call the police</button>
      <button data-a="refuse">Refuse</button>
    </div>
    ${(S.wants || []).filter(w => w.key === it.key).map(w => `<div class="note want">WANTED: ${esc(w.name)} will pay about ${money(Math.round(it.guide * w.mult))} for this.</div>`).join('')}
    ${full ? '<div class="note">The shop is full. Sell something from STOCK first.</div>' : ''}
    ${S.coin < ask ? '<div class="note">You can\'t afford the asking price.</div>' : ''}`;
}
function cardAction(c, ask, mode) {
  cardEl.innerHTML = cardHTML(c, ask, mode);
  cardEl.classList.remove('hidden');
  const range = cardEl.querySelector('input'), val = cardEl.querySelector('.haggle .val');
  const offerBtn = cardEl.querySelector('[data-a="offer"]');
  const sync = () => { val.textContent = '$' + range.value; if (!offerBtn.dataset.full) offerBtn.disabled = +range.value > S.coin || !shelfFree(); };
  range.oninput = sync; sync();
  return new Promise(res => {
    cardEl.querySelectorAll('button').forEach(b => b.onclick = e => {
      e.stopPropagation();
      cardEl.querySelectorAll('button').forEach(x => { x.disabled = true; });
      res({ type: b.dataset.a, amount: +range.value });
    });
  });
}
function hideCard() { cardEl.classList.add('hidden'); cardEl.innerHTML = ''; }

// a card can make a look free: Odile's Loupe (jewelry, once a day), An Overdue Slip (books)
function freeLook(it) { return typeof cardFreeLook === 'function' && !it.inspected && cardFreeLook(it); }
function inspect(it) {
  if (freeLook(it)) cardUsedLook(it); else S.loupe--;
  it.inspected = true; S.stats.inspected = (S.stats.inspected || 0) + 1;
  const t = ITEMS[it.key] || ITEMS.ring;
  it.clues = [];
  if (it.unique) {
    it.clues.push(...(it.tells || [{ text: 'One of a kind.' }]).map(x => (typeof x === 'string' ? { text: x, cls: it.fake ? 'bad' : 'good' } : x)));
    if (it.fake) it.knownFake = true; // a fake one-of-a-kind shows FAKE on its card, like any other fake
  }
  else if (it.key === 'amber') it.clues.push({ text: 'Real amber, with an ancient insect caught inside. Collectors love these.', cls: 'good' });
  else if (it.fake) { it.clues.push({ text: pick(t.fake), cls: 'bad' }); it.knownFake = true; }
  else it.clues.push({ text: pick(t.real), cls: 'good' });
  if (it.mark) it.clues.push({ text: `Engraved with ${it.mark}${it.mark.endsWith('.') ? '' : '.'}` });
  else if (it.filed) it.clues.push({ text: 'An owner\'s engraving has been filed away, leaving raw scratches.', cls: 'bad' });
  else it.clues.push({ text: 'No owner\'s marks.' });
  if (it.noticeId) it.knownHot = true;
  (it.fake ? Sound.loupeFake : Sound.loupe)();
  renderPanel();
}

// Haggle loop shared by sellers and loan seekers.
async function negotiate(c, actor, mode) {
  const P = PERSONAS[c.persona];
  if (typeof onCounter === 'function') onCounter(c.item); // the cat and the scale notice it (js/secrets.js)
  let ask = c.asking, rounds = 0;
  for (;;) {
    const act = await cardAction(c, ask, mode);
    if (act.type === 'inspect') { inspect(c.item); continue; }
    if (act.type === 'pay') { Sound.accept(); return { result: 'deal', price: ask }; }
    if (act.type === 'refuse') { hideCard(); Sound.reject(); await say(actor, pick(P.refused)); return { result: 'refused' }; }
    if (act.type === 'watch') return { result: 'watch' };
    if (act.type === 'offer') {
      const n = act.amount;
      Sound.haggle();
      if (n >= c.min) { Sound.accept(); await say(actor, pick(P.accept)); return { result: 'deal', price: n }; }
      rounds++;
      if (rounds > P.patience) { hideCard(); Sound.reject(); await say(actor, pick(P.leave)); return { result: 'left' }; }
      ask = Math.min(ask, Math.max(Math.ceil(c.min * 1.05), Math.round((n + ask) / 2)));
      Sound.counter();
      await say(actor, fill(pick(P.counter), { n: ask }));
    }
  }
}

// ================================================================ walking customers in and out
const COUNTER_X = 156, FLOOR_Y = 152, QUEUE_X = [128, 104, 80, 56];
let queue = [];

function spawnQueue(list) {
  queue = list.map((c, i) => {
    const a = makeActor(c.look, i < 4 ? QUEUE_X[i] : 24, i < 4 ? FLOOR_Y - (i % 2) * 3 : 124, { name: c.name, alpha: c.alpha });
    a.hidden = i >= 4;
    c.actor = a;
    return c;
  });
  view.queueLeft = list.length; renderPanel();
}
async function shuffleQueue() {
  const moves = [];
  queue.forEach((c, i) => {
    if (i >= 4) return;
    const a = c.actor;
    if (a.hidden) { a.hidden = false; a.x = 24; a.y = 124; view.doorOpen = 1.2; view.bell = 0.8; Sound.bell(); moves.push(walkTo(a, 30, 140).then(() => walkTo(a, QUEUE_X[i], FLOOR_Y - (i % 2) * 3))); }
    else if (Math.abs(a.x - QUEUE_X[i]) > 1) moves.push(walkTo(a, QUEUE_X[i], FLOOR_Y - (i % 2) * 3));
  });
  await Promise.all(moves);
  queue.forEach(c => { if (c.actor) c.actor.facingLeft = false; });
}
async function stepUp(c) {
  await walkTo(c.actor, COUNTER_X, FLOOR_Y);
  c.actor.facingLeft = false;
}
async function leaveShop(a, hurry) {
  if (hurry) a.speed = 70;
  await walkTo(a, 30, 140);
  view.doorOpen = 1; view.bell = 0.8; Sound.bell();
  await walkTo(a, 24, 124);
  removeActor(a);
}
async function enterActor(look, name, x = COUNTER_X, y = FLOOR_Y) {
  const a = makeActor(look, 24, 124, { name });
  view.doorOpen = 1.2; view.bell = 0.8; Sound.bell();
  await walkTo(a, 30, 140);
  await walkTo(a, x, y);
  a.facingLeft = x > 200;
  if (x <= 200) a.facingLeft = false;
  return a;
}

// ================================================================ encounters
async function runSeller(c) {
  const a = c.actor;
  if (typeof cardSeller === 'function') cardSeller(c);
  if (c.intro) await say(a, c.intro); // visitors a card sends introduce themselves
  await say(a, fill(pick(PERSONAS[c.persona].pitch), { item: c.item.name.toLowerCase() }));
  view.counterIcon = c.item.icon;
  const r = await negotiate(c, a, 'buy');
  hideCard();
  if (r.result === 'deal') {
    buyItem(c, r.price);
  } else if (r.result === 'watch') {
    await callWatch(c);
    view.counterIcon = null;
    return;
  }
  view.counterIcon = null;
  await leaveShop(a);
}

function buyItem(c, price) {
  const it = c.item;
  it.paid = price;
  noteSeller(it, c); // for the camera (js/stolen.js)
  S.stock.push(it);
  S.stats.bought++;
  change('coin', -price, `Bought ${it.name} from ${c.name} for ${money(price)}`);
  Sound.register();
  if (typeof standingDeal === 'function') standingDeal(c, 'bought', it, price); // a regular in week 1 (js/standing.js)
  if (!it.fake && (c.persona === 'desperate' || c.persona === 'honest') && price < it.guide * 0.45) {
    change('rep', -2); toast(`Word gets round that you squeezed ${c.name}.`, c.look);
  } else if (!it.fake && c.persona === 'honest' && price >= it.guide * 0.75) {
    change('rep', 1);
  }
}

async function runLoan(c) {
  const a = c.actor;
  await say(a, fill(pick(LOAN_PITCH), { n: c.asking, item: c.item.name.toLowerCase(), when: `in ${c.days} days` }));
  view.counterIcon = c.item.icon;
  const r = await negotiate(c, a, 'loan');
  hideCard();
  if (r.result === 'deal') {
    grantLoan(c, r.price, dayNum() + c.days, c.returns);
    await say(a, c.returns ? 'Thank you. I\'ll be back for it, you\'ll see.' : 'Much appreciated.');
  } else if (r.result === 'watch') { await callWatch(c); view.counterIcon = null; return; }
  view.counterIcon = null;
  await leaveShop(a);
}
function grantLoan(c, lent, due, returns, key) {
  const it = c.item;
  it.paid = lent;
  noteSeller(it, c);
  it.held = S.uid++;
  S.stock.push(it);
  S.stats.loans = (S.stats.loans || 0) + 1;
  S.loans.push({ id: it.held, itemUid: it.uid, who: c.name, look: c.look, lent, owed: Math.round(lent * 1.3), due, returns, key: key || null });
  change('coin', -lent, `Lent ${money(lent)} to ${c.name} against a ${it.name.toLowerCase()}`);
}

async function runBuyer(c) {
  const a = c.actor;
  if (c.intro) await say(a, c.intro);
  if (c.onArrive) c.onArrive();
  await say(a, fill(pick(BUYER_PITCH), { cat: CATS[c.cat] }));
  const matches = S.stock.filter(i => !i.held && !i.nosale && i.cat === c.cat);
  if (!matches.length) {
    await say(keeper, 'Sorry, nothing like that on the shelves today.');
    await say(a, 'Another time, then.');
    await leaveShop(a); return;
  }
  const offers = matches.map(it => ({ it, price: Math.round(it.guide * c.mult) }));
  cardEl.innerHTML = `<h3>${esc(c.name)} wants ${CAT_LABEL[c.cat].toLowerCase()}</h3>
    <div class="meta">They'll pay for any of these:</div>
    <div class="sell-list">${offers.map((o, i) => `<button data-i="${i}"><img src="${iconURL(o.it.icon)}"><span>${esc(o.it.name)} (${o.it.condLabel})${o.it.knownFake ? ' <b style="color:#9a2010">FAKE</b>' : ''}<br><b>${money(o.price)}</b> <span class="meta">paid ${money(o.it.paid)}</span></span></button>`).join('')}
    <button data-i="-1">Nothing for you today</button></div>`;
  cardEl.classList.remove('hidden');
  const i = await new Promise(res => cardEl.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); res(+b.dataset.i); }));
  hideCard();
  if (i < 0) { await say(a, 'Pity. See you.'); await leaveShop(a); return; }
  const { it, price } = offers[i];
  await sellTo(c, a, it, price);
}

// Hand an item over the counter. Fakes can be caught by a sharp customer, or come back as a
// complaint tomorrow. Returns true if the sale went through.
async function sellTo(c, a, it, price) {
  view.counterIcon = it.icon;
  view.highlight = null;
  if (it.fake && c.sharp) {
    Sound.bad();
    await say(a, 'Hold on. This is a fake! Do you take me for a fool?');
    change('rep', -8, `${c.name} caught you selling a fake`);
    if (typeof standingDeal === 'function') standingDeal(c, 'caught', it, price);
    change('heat', 4);
    S.stats.cheated++;
    view.counterIcon = null;
    await leaveShop(a, true); return false;
  }
  S.stock = S.stock.filter(x => x !== it);
  S.stats.sold++;
  change('coin', price, `Sold ${it.name} to ${c.name}`);
  Sound.register();
  onSold(it, c.type); // 'buyer', 'shopper' or 'wanted'
  if (typeof standingDeal === 'function') standingDeal(c, 'sold', it, price);
  if (it.fake) {
    S.stats.cheated++;
    if (Math.random() < 0.5) S.complaints.push({ due: dayNum() + 1, refund: price, name: c.name, look: c.look, item: it.name });
  } else change('rep', 1);
  if (it.noticeId) change('heat', 6);
  await say(a, pick(['Perfect. Just what I wanted.', 'Nice piece. Thanks.', 'My partner is going to love this.', 'Great. Can I get a bag?']));
  view.counterIcon = null;
  await leaveShop(a);
  return true;
}

// A shopper has looked round the displays and wants one thing they saw.
async function runShopper(c) {
  const a = c.actor;
  placeStock(S.stock);
  const items = forSale().filter(i => i.spot >= 0);
  if (!items.length) { await say(a, 'Just looking, thanks.'); await leaveShop(a); return; }
  const it = pick(items);
  view.highlight = it.uid;
  await say(a, fill(pick(SHOPPER_PITCH), { item: it.name.toLowerCase(), where: spotWhere(it) }));
  view.counterIcon = it.icon;
  const showcase = hasUpgrade('showcase') && UPGRADES.showcase.cats.includes(it.cat) ? UPGRADES.showcase.priceMult : 1;
  const plant = typeof shopperBonus === 'function' ? shopperBonus() : 1; // the rubber plant in flower (js/secrets.js)
  const offer = it.curio ? Math.round(it.guide * (typeof hasCard === 'function' && hasCard('callingCard') ? 1.1 : 1)) : Math.max(3, Math.round(it.guide * (SHOPPERS.price + S.rep / SHOPPERS.priceRep) * rand(0.92, 1.06) * showcase * plant * seasonLike(it)));
  const more = Math.round(offer * (1 + SHOPPERS.more));
  const tags = (it.knownFake ? '<span class="tag fake">FAKE</span>' : '') + (it.knownHot ? '<span class="tag hot">ON A NOTICE</span>' : '');
  cardEl.innerHTML = `<div class="row"><img class="icon" src="${iconURL(it.icon)}"><div>
      <h3>${esc(it.name)}</h3>
      <div class="meta">${CAT_LABEL[it.cat]} · ${it.condLabel} · ${spotWhere(it)}<br>Guide value: <b>${money(it.guide)}</b> · you paid ${money(it.paid)}</div>
      <div>${tags}</div></div></div>
    <div class="ask">${esc(c.name)} offers <b>${money(offer)}</b></div>
    <div class="btns">
      <button data-a="sell">Sell for ${money(offer)}</button>
      <button data-a="more">Ask for ${money(more)}</button>
      <button data-a="no">Not for sale</button>
    </div>
    <div class="note">Ask for more and they might pay it, or walk out. A good reputation helps.</div>`;
  cardEl.classList.remove('hidden');
  const act = await new Promise(res => cardEl.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); res(b.dataset.a); }));
  hideCard();
  if (act === 'no') { view.highlight = null; view.counterIcon = null; Sound.reject(); await say(a, pick(['Fair enough.', 'Oh well. Worth asking.'])); await leaveShop(a); return; }
  if (act === 'more') {
    Sound.haggle();
    if (Math.random() >= SHOPPERS.moreChance + S.rep / SHOPPERS.moreRep) {
      view.highlight = null; view.counterIcon = null; Sound.reject();
      await say(a, pick(['Too rich for me. Thanks anyway.', 'Hm. No, I\'ll leave it.'])); await leaveShop(a); return;
    }
    await say(a, pick([`Fine. ${money(more)}.`, `You drive a hard bargain. ${money(more)} it is.`]));
    await sellTo(c, a, it, more); return;
  }
  await sellTo(c, a, it, offer);
}

// Someone after one particular thing. If you don't have it they leave word and come back.
async function runWanted(c) {
  const a = c.actor;
  const t = ITEMS[c.key];
  if (c.returning) await say(a, `Me again. Did a ${t.name.toLowerCase()} turn up?`);
  else if (!c.pitched) await say(a, fill(pick(WANTED_PITCH), { item: t.name.toLowerCase() })); // a regular asks in their own words (js/townmonths.js)
  const matches = forSale().filter(i => i.key === c.key);
  if (!matches.length) {
    await say(keeper, `Not right now, sorry.`);
    const due = dayNum() + randi(2, 3);
    if (c.returning || due > WEEKS * 5) { await say(a, c.returning ? 'Oh well. I\'ll try online.' : 'Pity. Never mind.'); await leaveShop(a); return; }
    const d = (due - 1) % 5, when = Math.ceil(due / 5) > S.week ? `next ${DAYS[d]}` : `on ${DAYS[d]}`;
    S.wants.push({ key: c.key, mult: c.mult, sharp: c.sharp, name: c.name, look: c.look, due });
    await say(a, fill(pick(WANTED_LATER), { when }));
    toast(`Wanted: a ${t.name.toLowerCase()} for ${c.name}, back ${when}`, c.look);
    await leaveShop(a); return;
  }
  const offers = matches.map(it => ({ it, price: Math.round(it.guide * c.mult) }));
  cardEl.innerHTML = `<h3>${esc(c.name)} wants a ${esc(t.name.toLowerCase())}</h3>
    <div class="meta">They'll pay well for the right one:</div>
    <div class="sell-list">${offers.map((o, i) => `<button data-i="${i}"><img src="${iconURL(o.it.icon)}"><span>${esc(o.it.name)} (${o.it.condLabel})${o.it.knownFake ? ' <b style="color:#9a2010">FAKE</b>' : ''}<br><b>${money(o.price)}</b> <span class="meta">paid ${money(o.it.paid)}</span></span></button>`).join('')}
    <button data-i="-1">Not for sale</button></div>`;
  cardEl.classList.remove('hidden');
  const i = await new Promise(res => cardEl.querySelectorAll('button').forEach(b => b.onclick = e => { e.stopPropagation(); res(+b.dataset.i); }));
  hideCard();
  if (i < 0) { await say(a, 'Really? Shame.'); await leaveShop(a); return; }
  await sellTo(c, a, offers[i].it, offers[i].price);
}

async function runRedemption(c) {
  const a = c.actor;
  const loans = c.loans;
  const items = loans.map(l => S.stock.find(i => i.uid === l.itemUid)).filter(Boolean);
  await say(a, `I'm back for my ${items.map(i => i.name.toLowerCase()).join(' and ')}, as promised.`);
  const owed = loans.reduce((s, l) => s + l.owed, 0);
  S.stock = S.stock.filter(i => !items.includes(i));
  S.loans = S.loans.filter(l => !loans.includes(l));
  change('coin', owed, `${c.name} repaid a loan`);
  toast(`${c.name} repaid ${owed}`, a.look);
  await say(a, 'Thank you for keeping it safe.');
  await leaveShop(a);
}

async function callWatch(c) {
  const a = c.actor;
  hideCard();
  await say(keeper, '(You keep smiling and quietly text the police station.)');
  Sound.siren();
  const barrow = await enterActor(CAST.barrow.look, CAST.barrow.name, 120, 152);
  barrow.facingLeft = false;
  const it = c.item;
  const fraud = it.fake && c.persona === 'smooth';
  if (it.stolen || fraud) {
    const reward = it.stolen ? (it.noticeId ? 25 : 12) : 10;
    Sound.good();
    await say(a, it.stolen ? 'Wait, no! I can explain!' : 'This is an outrage! It is a perfectly genuine...');
    if (it.fresh && !it.noticeId) S.fresh = (S.fresh || []).filter(f => f.uid !== it.uid); // solved before it reached the list
    await say(barrow, it.stolen ? (it.noticeId ? `That's off my list. ${it.mark ? 'Bearing ' + it.mark + '.' : ''} You're coming with me.` : it.filed ? 'Engraving filed off. Stolen, then. Come along.' : `Bearing ${it.mark}? That was reported stolen yesterday. It isn't even on my list yet. Come along.`) :
      'Painted glass and lies. Fraud is still a crime, friend.');
    await say(barrow, `Good eye. Here's ${money(reward)} for your trouble.`);
    change('coin', reward, `The police paid a reward for ${c.name}`);
    change('rep', it.stolen ? 4 : 3); change('heat', -8);
    S.flags.reports++; S.stats.thieves++;
    if (fraud) S.stats.fakesCaught++;
    a.facingLeft = true;
    await Promise.all([leaveShop(a), sleep(300).then(() => leaveShop(barrow))]);
  } else {
    Sound.bad();
    await say(a, 'The police? I\'ve done nothing wrong!');
    await say(barrow, it.fake ? 'Just a fake, and this one didn\'t know it. Not a crime to be fooled.' : 'Nothing on my list, and no sign it\'s stolen. Don\'t waste my time.');
    if (typeof cardReady === 'function' && hasCard('amabel') && S.cardWeek !== S.week) { // Sister Amabel Vouches for You
      S.cardWeek = S.week;
      await say(barrow, 'Sister Amabel says you\'re careful, that\'s all. No harm done.');
    } else change('rep', -6, `You falsely accused ${c.name}`);
    await Promise.all([leaveShop(a, true), sleep(400).then(() => leaveShop(barrow))]);
  }
}

// ================================================================ story
// Each scripted beat is an async function. Morning beats run before the queue
// forms; "customer" beats take a turn at the counter like anyone else.
const story = {};

story.intro = async () => {
  await narrate('Hollow Neck, Massachusetts. A foggy harbor town where the island ferry runs twice a day and the boardwalk arcade has seen better decades.\n\nThree weeks ago your Aunt Odile vanished without a word, leaving you her pawnshop, The Crooked Scale...');
  await narrate('...and her debts.');
  const m = await enterActor(CAST.merrit.look, CAST.merrit.name);
  await say(m, 'Morning. Merrit Gaunt, Gilded Hand Finance. Collections.');
  await say(m, 'Your aunt took out a great deal of credit with us. Since she is... elsewhere, the debt passes to the business. And the business is you.');
  await say(m, `Every Friday evening you pay an installment. ${money(diffMoney(INSTALLMENTS[0]))} this week, more after. Miss two and we repossess the shop.`);
  const i = await choose(['Where is my aunt?', 'You\'ll get your money. Now get out.']);
  if (i === 0) await say(m, 'If we knew that, we would not be talking to you. Have a nice day.');
  else await say(m, 'Spirit! She had that too. Look where it got her.');
  await leaveShop(m);
  const b = await enterActor(CAST.barrow.look, CAST.barrow.name);
  await say(b, 'Captain Barrow, Hollow Neck Police. You\'re Odile\'s family? Then listen.');
  await say(b, 'There\'s been a run of break-ins. I\'ll send you a list of stolen goods every week. Check what you buy against it.');
  await say(b, 'Buy stolen goods and I\'ll find them. Spot a thief and call me, and there\'s a reward in it.');
  await leaveShop(b);
  toast('New police notices posted', CAST.barrow.look);
  await narrate('How to run the shop:\n• Customers sell, pawn or buy. Haggle with the slider, or pay what they ask.\n• Your loupe (3 uses a day) shows if an item is genuine and what marks it bears.\n• Check marks against the NOTICES list. Call the police if someone tries to cheat you.\n• Everything you buy goes on display. Shoppers ask about it through the day, and some want one thing in particular.\n• Bills are due every Friday.');
};

story.pellLoan = (n) => async (c) => {
  const a = c.actor;
  const lines = [
    ['Morning. Pell. I knew your aunt. Crewed with her father, once, on the scallopers.', 'This was my Ada\'s music box. She\'d hate to see it here. I need 30 to see out the month.', 'I\'ll come back for it when scallop season opens. End of the month, say?'],
    ['Pell again. Don\'t look at me like that.', 'Ada\'s brooch. She wore it at our wedding. Forty would keep the heating on.', 'Same as before: I\'ll redeem the lot at month\'s end.'],
    ['Last one. My own wedding ring.', 'Fifty, if you can. The boat needs a new engine part or there\'s no fishing for me at all.', 'Month\'s end. I swear it on Ada.']
  ][n];
  for (const l of lines) await say(a, l);
  const item = [makeItem('musicbox', { cond: 2, mark: 'the initials A.P.' }), makeItem('brooch', { cond: 1, mark: 'the initials A.P.' }), makeItem('ring', { cond: 1, mark: 'the initials A.P.' })][n];
  const ask = [30, 40, 50][n];
  const cc = { item, persona: 'honest', asking: ask, min: Math.round(ask * 0.6), days: 18 - dayNum(), name: 'Old Pell' };
  view.counterIcon = item.icon;
  const r = await negotiate(cc, a, 'loan');
  hideCard();
  if (r.result === 'deal') {
    grantLoan({ ...cc, look: a.look }, r.price, 18, true, 'pell');
    S.flags.pellLoans = (S.flags.pellLoans || 0) + 1;
    if (r.price < ask * 0.8) { S.flags.pellSqueezed = true; await say(a, 'Less than I hoped. Still. Thank you.'); }
    else await say(a, 'Ada always said Odile\'s people were good people.');
  } else if (r.result === 'watch') {
    await callWatch(cc && { ...cc, actor: a, look: a.look }); view.counterIcon = null; return;
  } else S.flags.pellRefused = true;
  if (n === 2 && S.flags.pellLoans >= (typeof hasCard === 'function' && hasCard('pell') ? 1 : 2) && !S.flags.pellSqueezed) {
    await say(a, 'You\'ve been kind to an old man. So I\'ll tell you something I\'ve told no one.');
    await say(a, 'Night fishing off Gull Point, I\'ve seen a blue light in the old lighthouse. It\'s been shut for thirty years. Your aunt had a camping lantern just that color.');
    S.flags.lighthouseClue = true;
    toast('Clue: a blue light in the old lighthouse', a.look);
  }
  view.counterIcon = null;
  await leaveShop(a);
};

story.kidsAmber = async (c) => {
  const lark = c.actor;
  const linnet = makeActor(CAST.linnet.look, lark.x - 14, FLOOR_Y + 2, { name: CAST.linnet.name });
  await say(lark, 'Hey! We found a shiny rock with the metal detector! Well, near it.');
  await say(linnet, 'It\'s got a bug inside. Is it magic? You can have it for five bucks.');
  const item = makeItem('amber', { cond: 2, name: 'Amber with insect', guide: 48 });
  view.counterIcon = 'amber';
  await narrate('It\'s real amber with a perfect beetle inside. A collector would pay nearly fifty.');
  const i = await choose([
    { label: 'Pay them the 5 they asked for', disabled: !shelfFree() || S.coin < 5 },
    { label: 'Explain what it is and pay a fair 30', disabled: !shelfFree() || S.coin < 30 },
    { label: 'Not today, kids' }]);
  if (i === 0) { item.paid = 5; S.stock.push(item); change('coin', -5, 'Bought amber from Lark and Linnet'); S.flags.kidsCheated = true; await say(lark, 'Five whole dollars! Clam shack, Linnet! CLAM SHACK!'); }
  else if (i === 1) { item.paid = 30; S.stock.push(item); change('coin', -30, 'Paid Lark and Linnet fairly for amber'); change('rep', 6); S.flags.kidsFair = true; await say(linnet, 'THIRTY?! We\'re rich!'); await say(lark, 'We\'ll bring you everything we find. Promise!'); }
  else await say(lark, 'Aww.');
  view.counterIcon = null;
  await Promise.all([leaveShop(lark), sleep(250).then(() => leaveShop(linnet))]);
};

story.wrenGoblet = async (c) => {
  const a = c.actor;
  await say(a, 'Afternoon. Cute shop. Cuter goblet.');
  await say(a, 'Fifteen. Cheap, because I like your face. Don\'t ask where it\'s been.');
  const n = S.notices.find(x => x.key === 'goblet');
  const item = makeItem('goblet', { cond: 2, stolen: true, noticeId: n ? n.id : null, mark: n ? n.mark : null, filed: !n });
  const cc = { item, persona: 'shifty', asking: 15, min: 10, name: 'Wren', look: a.look };
  view.counterIcon = 'goblet';
  const r = await negotiate(cc, a, 'buy');
  hideCard();
  if (r.result === 'deal') { buyItem(cc, r.price); S.flags.wrenTrust = true; await say(a, 'I knew you had sense. See you around.'); }
  else if (r.result === 'watch') {
    await say(a, 'Oh, you didn\'t.');
    await narrate('Wren reads your face before you\'ve finished dialling. She\'s out of the door, and the goblet goes with her.');
    S.flags.wrenHostile = true; change('rep', 2); change('heat', -5);
    view.counterIcon = null; removeActor(a); view.doorOpen = 1; Sound.bell(); return;
  } else await say(a, 'Suit yourself. We\'ll talk again.');
  view.counterIcon = null;
  await leaveShop(a);
};

story.letter = async () => {
  await fadeOut();
  view.bg = 'shopNight'; view.candleX = 236; clearActors(); placeKeeper();
  await fadeIn();
  await narrate('After closing you cash up under the desk lamp. A loose floor tile behind the counter shifts beneath your boot.\n\nUnderneath: a letter in Odile\'s handwriting.');
  await narrate('"If you\'re reading this, the Hand came for me before I could set things right. They\'ve cheated half the town with their interest rates, and I kept the proof.\n\nIt\'s behind the clock. Burn it if you want a quiet life. Keep it if you want to be free of them.  - O."');
  const i = await choose(['Take the ledger from behind the clock', 'Burn the letter. Leave the past where it is.']);
  if (i === 0) { S.flags.ledger = true; await narrate('Taped to the back of the wall clock, in a freezer bag: a slim ledger full of numbers that don\'t add up. Not by accident.'); toast('Found: Odile\'s ledger', null, 'tome'); }
  else { S.flags.burned = true; await narrate('The letter curls and blackens in the sink with a match. Whatever is behind the clock can stay there.'); }
};

story.amabel = async (c) => {
  const a = c.actor;
  await say(a, 'Bless this shop. I\'m Sister Amabel, from Saint Brine\'s children\'s home.');
  await say(a, 'The storm took half the roof off the kids\' dormitory and the insurance won\'t pay. Could you spare anything?');
  const i = await choose([{ label: 'Give $20', disabled: S.coin < 20 }, { label: 'Give $5', disabled: S.coin < 5 }, 'Not this week, Sister.']);
  if (i === 0) { change('coin', -20, 'Donated to Saint Brine\'s'); change('rep', 8); S.flags.charity = 2; await say(a, 'God will remember this. So will I.'); }
  else if (i === 1) { change('coin', -5, 'Donated to Saint Brine\'s'); change('rep', 2); S.flags.charity = 1; await say(a, 'Every dollar helps. Thank you.'); }
  else { change('rep', -1); await say(a, 'I understand. Times are hard for everyone.'); }
  await leaveShop(a);
};

story.wrenOffer = async (c) => {
  const a = c.actor;
  if (S.flags.wrenHostile && typeof hasCard === 'function' && hasCard('wren')) { // Wren's Number
    await say(a, 'Your number\'s still in my phone. Don\'t ask me why. Let\'s pretend last week didn\'t happen.');
    S.flags.wrenHostile = false;
  }
  if (S.flags.wrenHostile) {
    await say(a, 'Well, if it isn\'t the shopkeeper who calls the cops.');
    await say(a, 'Nice windows you\'ve got. Be a shame.');
    S.flags.wrenThreat = true;
    await leaveShop(a); return;
  }
  await say(a, 'So. I need someone who buys quietly and sells quieter.');
  await say(a, 'Anything hot, filed or awkward, I\'ll take off your hands at a fair price. No questions either way.');
  const i = await choose(['Deal. (Wren will fence goods from your STOCK)', 'No. That\'s not my kind of business.']);
  if (i === 0) { S.flags.fence = true; await say(a, 'Lovely. You won\'t regret it. Probably.'); toast('Wren will now buy from your Stock', a.look); }
  else { S.flags.wrenRefused = true; await say(a, 'Your loss. Offer stands, if you get hungry.'); }
  await leaveShop(a);
};

story.barrowAsks = async (c) => {
  const a = c.actor;
  await say(a, 'A woman with red hair and a silver tooth. Calls herself Wren. Seen her?');
  const i = await choose(['Yes. She\'s been in here.', 'Never heard of her.']);
  if (i === 0) {
    S.flags.toldOnWren = true; change('heat', -15); change('rep', 3);
    await say(a, 'I thought so. Thank you. We\'ll be waiting for her.');
  } else if (S.heat > 40 || S.flags.fence) {
    change('heat', 6);
    await say(a, 'Hm. Your mouth says one thing and your eyes say another.');
  } else await say(a, 'If you do, call me.');
  await leaveShop(a);
};

story.docks = async () => {
  await fadeOut();
  view.bg = 'docks'; clearActors();
  const k = makeActor(CAST.keeper.look, 120, 160, { name: 'You' });
  const w = makeActor(CAST.wren.look, 200, 158, { name: 'Wren', facingLeft: true });
  await fadeIn();
  await narrate('A text from a number you don\'t know: "Pier Nine. Midnight. Bring nothing. - W."');
  await say(w, 'You came. Good. I\'ve got a crate that needs a quiet basement for a week.');
  await say(w, 'It sits, nobody asks, you get sixty. Easy money for someone with bills.');
  const i = await choose(['Take the crate. (+$60, the police may notice)', 'No crates. Goodnight, Wren.']);
  if (i === 0) { change('coin', 60, 'Wren paid you to hide a crate'); change('heat', 10); S.flags.crate = true; await say(w, 'Pleasure, partner.'); }
  else { await say(w, 'Cautious. Can\'t say I blame you.'); }
  void k;
};

story.brick = async () => {
  await fadeOut();
  view.bg = 'shopNight'; view.candleX = 236; clearActors(); placeKeeper();
  await fadeIn();
  Sound.smash();
  await narrate('CRASH.\n\nA brick sails through the front window and skids across the linoleum. A note is taped around it: "Careful who you call."');
  change('coin', -Math.min(S.coin, 20), 'Paid the glazier for the window');
};

story.kidsDagger = async (c) => {
  const lark = c.actor;
  const linnet = makeActor(CAST.linnet.look, lark.x - 14, FLOOR_Y + 2, { name: CAST.linnet.name });
  const n = S.notices.find(x => x.key === 'dagger');
  const item = makeItem('dagger', { cond: 2, stolen: true, noticeId: n.id, mark: n.mark });
  view.counterIcon = 'dagger';
  if (S.flags.kidsFair) await say(lark, 'Hey! We brought you something, like we promised!');
  else await say(lark, 'You again. We found a knife in the river with the magnet. How much?');
  await say(linnet, 'It\'s got a little fox on the handle.');
  await narrate(`A good hunting knife with ${n.mark} on the handle. It's on the police list: stolen from ${n.owner}. A thief must have ditched it.`);
  const i = await choose([
    { label: 'Buy it for 10', disabled: !shelfFree() || S.coin < 10 },
    'Tell them to take it to the police. There\'s a reward.',
    'Call the police yourself and give the kids the reward']);
  if (i === 0) { item.paid = 10; S.stock.push(item); change('coin', -10, 'Bought a river knife from the kids'); item.inspected = true; item.knownHot = true; item.clues = [{ text: 'Genuine.', cls: 'good' }, { text: `Engraved with ${n.mark}.` }]; await say(lark, 'Ten! Arcade! ARCADE!'); }
  else if (i === 1) { change('rep', 5); S.flags.kidsHonest = true; await say(linnet, 'A reward? Come on, Lark, run!'); }
  else { change('rep', 4); change('heat', -6); S.flags.reports++; S.flags.kidsHonest = true; await say(lark, 'You\'re the best shop in Hollow Neck!'); }
  view.counterIcon = null;
  await Promise.all([leaveShop(lark), sleep(250).then(() => leaveShop(linnet))]);
};

story.raid = Sound.during('tension', async (c) => {
  const a = c.actor;
  Sound.siren();
  if (S.flags.crate) {
    await say(a, 'A little bird says you\'re keeping something in your basement for a certain redhead.');
    const barrowCard = typeof cardReady === 'function' && cardReady('barrow');
    const i = await choose(['Hand over the crate', 'Bluff: "What crate?"', barrowCard && { label: 'Captain Barrow Owes You: "You owe me one, Captain."', card: true }].filter(Boolean));
    if (i === 2) {
      playCard('barrow');
      await say(a, '...I do, don\'t I. Fine. I never came in. But that\'s us square.');
    } else if (i === 0) {
      change('heat', -10); change('rep', 4); S.flags.crate = false; S.flags.wrenHostile = true; S.flags.wrenGone = true;
      await say(a, 'Smuggled phones, and the name of who sent them. You did right.');
    } else if (Math.random() < 1 - S.heat / 100) {
      change('heat', 6);
      await say(a, '...Fine. But I\'ll be watching this shop.');
    } else {
      S.flags.crate = false;
      await say(a, 'Then you won\'t mind my officers looking. Ah. Smuggled phones. That\'s a fine.');
      change('coin', -Math.min(S.coin, 40), 'Fined for hiding smuggled goods'); change('heat', 20); change('rep', -5);
    }
  } else if (S.flags.toldOnWren) {
    await say(a, 'We caught your redhead at Pier Nine last night. Thanks to you.');
    await say(a, 'The force pays its debts. Here.');
    change('coin', 20, 'Reward for Wren\'s arrest'); S.flags.wrenGone = true; S.flags.wrenArrested = true;
  }
  await leaveShop(a);
});

story.office = async () => {
  await fadeOut();
  view.bg = 'office'; clearActors();
  const k = makeActor(CAST.keeper.look, 110, 160, { name: 'You' });
  const v = makeActor(CAST.vantreece.look, 196, 150, { name: CAST.vantreece.name, facingLeft: true });
  const m = makeActor(CAST.merrit.look, 270, 148, { name: CAST.merrit.name, facingLeft: true });
  await fadeIn();
  await narrate('A black car is waiting at closing time. Merrit Gaunt holds the door. "Ms. Vantreece would like a word." It is not a request.');
  await say(v, 'So this is Odile\'s heir. Sit. No? Stand, then.');
  await say(v, 'Your aunt took something from my office. A ledger. I would like it back.');
  if (S.flags.ledger) {
    const i = await choose([
      'Threaten: "Halve what I owe, or the ledger goes to the papers."',
      'Bargain: "The ledger for the rest of the debt. All of it."',
      'Lie: "I don\'t know what you\'re talking about."']);
    if (i === 0) {
      S.installmentMult[2] = 0.5; S.installmentMult[3] = 0.5; S.flags.leveraged = true; change('heat', 5);
      await say(v, '...Clever. Odile\'s blood, certainly. Very well. Half.');
      await say(m, 'Ms. Vantreece never forgets a threat. Remember that.');
    } else if (i === 1) {
      S.installmentMult[2] = 0; S.installmentMult[3] = 0; S.flags.gaveLedger = true; S.flags.ledger = false;
      await say(v, 'Done. Your debt is wiped. Odile\'s, however, is another matter.');
      await narrate('You hand over the ledger. With it goes any hope of proving what the Hand has done.');
    } else {
      await say(v, 'Of course you don\'t. Then pay. And keep paying.');
    }
  } else {
    await say(keeper || k, 'I don\'t have any ledger.');
    await say(v, 'Then you are of no use to me except as a revenue stream. Pay. And keep paying.');
  }
  void k;
};

story.barrowThanks = async (c) => {
  const a = c.actor;
  if (S.flags.reports >= 3) {
    await say(a, `You've helped us ${S.flags.reports} times this month. The selectmen noticed.`);
    change('coin', 40, 'The selectmen\'s thanks'); change('rep', 5); change('heat', -10);
    await say(a, 'Hollow Neck needs more shops like this one.');
  } else if (S.heat >= 50) {
    await say(a, 'Too much stolen gear has passed through this street lately. I\'m watching you.');
    change('heat', 5);
  } else {
    await say(a, 'Quiet month. Let\'s keep it that way.');
  }
  await leaveShop(a);
};

story.pellReturns = async (c) => {
  const a = c.actor;
  const loans = S.loans.filter(l => l.key === 'pell');
  await say(a, 'Scallop season came in! Best haul in ten years.');
  if (!loans.length) { await say(a, 'Just came to say so. See ya.'); await leaveShop(a); return; }
  const items = loans.map(l => S.stock.find(i => i.uid === l.itemUid)).filter(Boolean);
  const owed = loans.reduce((s, l) => s + l.owed, 0);
  await say(a, `I've come for Ada's things. ${money(owed)}, as we agreed.`);
  S.stock = S.stock.filter(i => !items.includes(i));
  S.loans = S.loans.filter(l => !loans.includes(l));
  change('coin', owed, 'Old Pell redeemed his loans');
  S.flags.pellRedeemed = true;
  if (S.flags.lighthouseClue) await say(a, 'And... that blue light was on again last night. Go and look. Tonight.');
  else await say(a, 'You kept them safe. Ada would have liked you.');
  await leaveShop(a);
};

story.wrenCrown = async (c) => {
  const a = c.actor;
  await say(a, 'Last job of the season, partner. A jewelled crown, liberated from the museum\'s travelling exhibition.');
  await say(a, 'You buy it for 150. My buyer in New York pays you 300 tonight. Every cop in the state will be looking for it.');
  const i = await choose([{ label: 'Buy the crown (150, big heat)', disabled: S.coin < 150 }, 'Too hot. Pass.']);
  if (i === 0) { change('coin', -150, 'Bought a stolen crown from Wren'); S.flags.crown = true; change('heat', 30); await say(a, 'That\'s my partner.'); }
  else await say(a, 'Can\'t blame you. Be seeing you.');
  await leaveShop(a);
};

story.lighthouse = async () => {
  await fadeOut();
  view.bg = 'lighthouse'; clearActors();
  const k = makeActor(CAST.keeper.look, 210, 122, { name: 'You' });
  const o = makeActor(CAST.odile.look, 236, 117, { name: CAST.odile.name, facingLeft: true });
  await fadeIn();
  await narrate('Dawn at Gull Point. The blue light still glows in the old lighthouse. A figure steps out of the door.');
  await say(o, 'You found me. Of course you did. You always were the clever one.');
  await say(o, 'Gilded Hand cooks its books to bleed half the town dry. I ran before they could bury me with my proof.');
  if (S.flags.ledger) {
    await say(o, 'You kept the ledger? Then we finish this together. The attorney general\'s office opens at nine.');
    S.flags.odileFreed = true; S.installmentMult[3] = 0;
    await narrate('With Odile\'s testimony and the ledger, state investigators raid Gilded Hand Finance. Your final installment is never collected.');
  } else {
    await say(o, 'Without the ledger we can\'t touch them. But I\'m done hiding. Let\'s go home.');
    S.flags.odileHome = true;
  }
  void k;
};

// ---- quests: the side stories a run can tell. js/runs.js draws a few per run (docs/quests/RUNS.md).
// Each side story calls defineQuest() first; the beats and hooks it registers after that belong to it
// and only play when the quest is in this run. endQuestScope() closes the last one.
const QUESTS = {};
let questScope = null;
function defineQuest(q) { QUESTS[q.id] = q; questScope = q.id; }
function endQuestScope() { questScope = null; }
// saves from before runs existed have no S.run: every quest plays, as it used to
function questActive(id) { return !id || !S || !S.run || S.run.majors.includes(id) || (S.run.minors || []).includes(id); }
function questMet(id) { if (S && S.run) (S.run.met = S.run.met || {})[id] = true; }
// wrap a hook so it only runs when the current quest is in this run
function scoped(fn) {
  const id = questScope;
  if (!id) return fn;
  return function (...args) { return questActive(id) ? fn.apply(this, args) : null; };
}

// Side stories (js/sidestories.js) register extra beats and hooks through these.
function addBeat(key, part, entry) {
  const id = questScope;
  if (id && typeof entry === 'function') { // nights and mornings
    const f = entry;
    entry = () => { if (!questActive(id)) return null; const p = f(); if (p) questMet(id); return p; };
    entry.quest = id;
  } else if (id) { // customers
    const run = entry.run;
    entry = { ...entry, quest: id, run: c => { questMet(id); return run(c); } };
  }
  SCRIPT[key] = SCRIPT[key] || {};
  (SCRIPT[key][part] = SCRIPT[key][part] || []).push(entry);
}
const HOOKS = { morning: [], sold: [], ending: [], tick: [], weekend: [], day: [] };
function runTick() { for (const h of HOOKS.tick) h(); }
function onSold(it, how) { for (const h of HOOKS.sold) h(it, how); }
async function runNights() {
  const sc = SCRIPT[`${S.week}-${S.day}`] || {};
  for (const n of (sc.nights || [])) {
    if (!n.quest && !mainStoryOn()) continue; // the main story's nights belong to the first month
    Sound.music('night');
    const p = n();
    if (p) { await p; if (checkLose()) return; }
  }
  // nights the run's scheduler placed (questNight and hubs in js/runs.js)
  for (const n of (typeof scheduledTonight === 'function' ? scheduledTonight() : [])) {
    Sound.music('night');
    if (n.quest) questMet(n.quest);
    await n.run();
    if (checkLose()) return;
  }
}

function clearActors() { view.actors = []; keeper = null; }

// Scripted beats by week-day. "morning" runs before the queue; "customers" join it.
const SCRIPT = {
  '1-1': { morning: [story.intro], customers: [{ cast: 'tutorial' }] },
  '1-2': { customers: [{ cast: 'pell', run: story.pellLoan(0) }] },
  '1-3': { customers: [{ cast: 'lark', run: story.kidsAmber }] },
  '1-4': { customers: [{ cast: 'wren', run: story.wrenGoblet }] },
  '1-5': { nights: [() => story.letter()] },
  '2-1': { customers: [{ cast: 'amabel', run: story.amabel }] },
  '2-2': { customers: [{ cast: 'wren', run: story.wrenOffer }] },
  '2-3': { customers: [{ cast: 'pell', run: story.pellLoan(1) }] },
  '2-4': { customers: [{ cast: 'barrow', run: story.barrowAsks }] },
  '2-5': { nights: [() => (S.flags.fence && !S.flags.toldOnWren ? story.docks() : S.flags.wrenThreat ? story.brick() : null)] },
  '3-1': { customers: [{ cast: 'lark', run: story.kidsDagger }] },
  '3-2': { customers: [{ cast: 'barrow', run: story.raid, when: () => S.flags.crate || S.flags.toldOnWren }] },
  '3-3': { customers: [{ cast: 'pell', run: story.pellLoan(2) }] },
  '3-5': { nights: [() => story.office()] },
  '4-1': { customers: [{ cast: 'barrow', run: story.barrowThanks }] },
  '4-3': { customers: [{ cast: 'pell', run: story.pellReturns, when: () => S.flags.pellLoans > 0 }] },
  '4-4': { customers: [{ cast: 'wren', run: story.wrenCrown, when: () => S.flags.fence && !S.flags.wrenGone }] },
  '4-5': { nights: [() => (S.flags.lighthouseClue ? story.lighthouse() : null)] }
};

function tutorialCustomer() {
  const item = makeItem('ring', { cond: 1, mark: 'the initials T.M.' });
  return { type: 'seller', kind: 'genuine', item, persona: 'honest', asking: 38, min: 30, name: 'Hobb the cab driver',
    look: { skin: '#c89070', hair: '#7a4a28', hs: 0, coat: '#6a5a3a', hat: 'cap', hatc: '#4a3a2a', beard: '#7a4a28', stout: true } };
}

// ================================================================ the day
function buildDay() {
  const key = `${S.week}-${S.day}`;
  const sc = SCRIPT[key] || {};
  const list = [];
  const total = 6 + (S.week >= 3 ? 1 : 0);
  // loan redemptions due today (Pell is handled by his own beat)
  const due = S.loans.filter(l => l.due === dayNum() && l.returns && l.key !== 'pell');
  const byWho = {};
  for (const l of due) (byWho[l.who] = byWho[l.who] || []).push(l);
  for (const [who, loans] of Object.entries(byWho)) list.push({ type: 'redeem', name: who, look: loans[0].look, loans });
  for (const s of (sc.customers || [])) {
    if (s.quest && !questActive(s.quest)) continue;
    if (!s.quest && !mainStoryOn()) continue; // main-story beats belong to the first month
    if (s.when && !s.when()) continue;
    if (s.cast === 'tutorial') { list.push(tutorialCustomer()); continue; }
    list.push({ type: 'story', run: s.run, cast: s.cast, name: CAST[s.cast].name, look: CAST[s.cast].look, alpha: s.alpha, last: s.last });
  }
  while (list.length < total) list.push(genRandomCustomer());
  // the town's regulars (js/town.js) come in on the days their run plan gives them. They come on top
  // of the day's trade: filling the day after them cost about 20 trading customers a month, which
  // was enough to sink most runs by week 2.
  for (const h of HOOKS.day) h(list);
  if (typeof cardCustomers === 'function') list.push(...cardCustomers()); // visitors a card sends (js/cards.js)
  // customers back to see if what they wanted came in
  for (const w of S.wants.filter(x => x.due === dayNum())) list.push({ type: 'wanted', returning: true, ...w });
  S.wants = S.wants.filter(x => x.due > dayNum());
  // shoppers who come for what's on display
  for (let i = shopperCount(); i > 0; i--) list.push(genShopper());
  // keep story beats from always being first: shuffle all but the tutorial
  let out = key === '1-1' ? [list[0], ...shuffle(list.slice(1))] : shuffle(list);
  // "last" beats arrive at dusk
  out = [...out.filter(c => !c.last), ...out.filter(c => c.last)];
  // the town's regulars never open the day: the first two people in are ordinary buyers and sellers
  // (Rich: the first interactions should show buying and selling). One with a rumour comes next.
  const town = out.filter(c => c.town && !c.last);
  if (town.length) {
    out = out.filter(c => !town.includes(c));
    // a story-heavy day still gets its two ordinary customers ahead of the town
    for (let n = out.filter(c => c.type !== 'story' && !c.last).length; n < 2; n++) out.unshift(genRandomCustomer());
    let after = 0, at = out.length;
    for (let i = 0; i < out.length; i++) if (out[i].type !== 'story' && ++after === 2) { at = i + 1; break; }
    town.sort((a, b) => (b.first ? 1 : 0) - (a.first ? 1 : 0));
    for (const c of town) {
      const end = out.filter(x => !x.last).length;
      const i = c.first ? at : at + Math.floor(Math.random() * (end - at + 1));
      out.splice(Math.min(i, end), 0, c);
      if (c.first) at++;
    }
  }
  return out;
}

async function runCustomer(c) {
  if (c.type === 'seller') return runSeller(c);
  if (c.type === 'loan') return runLoan(c);
  if (c.type === 'buyer') return runBuyer(c);
  if (c.type === 'shopper') return runShopper(c);
  if (c.type === 'wanted') return runWanted(c);
  if (c.type === 'redeem') return runRedemption(c);
  if (c.type === 'story') return c.run(c);
}

async function morning() {
  S.loupe = loupeCap();
  S.wants = S.wants || []; // saves from before the wanted list
  view.bg = 'shop'; view.timeOfDay = 0; clearActors(); placeKeeper();
  Sound.season = monthInfo().season; // the daytime music follows the month of a stay
  Sound.music(Sound.dayTrack(dayNum()));
  Sound.shutter();
  setBanner(); renderPanel();
  await fadeIn();
  if (S.day === 1) {
    if (S.week === 1 && mainStoryOn()) addNotices(3, [{ key: 'goblet', mark: 'a swan crest', owner: 'House Harrowgate' }]);
    else if (S.week === 1) addNotices(3);
    else if (S.week === 3 && mainStoryOn()) addNotices(2, [{ key: 'dagger', mark: 'a fox-head seal', owner: 'Selectman Vey' }]);
    else addNotices(2);
    if (S.week > 1 || !mainStoryOn()) toast(`Captain Barrow posted ${S.week === 3 ? 2 : 2} new notices`, CAST.barrow.look);
  }
  // complaints about fakes sold yesterday
  for (const cp of S.complaints.filter(x => x.due <= dayNum())) {
    const a = await enterActor(cp.look, cp.name);
    await say(a, `This ${cp.item.toLowerCase()} you sold me is a fake! I want my ${money(cp.refund)} back.`);
    const paid = Math.min(S.coin, cp.refund);
    change('coin', -paid, `Refunded ${cp.name} for a fake`); change('rep', -6);
    await leaveShop(a, true);
  }
  S.complaints = S.complaints.filter(x => x.due > dayNum());
  // loans that were not redeemed are forfeit
  for (const l of S.loans.filter(x => x.due < dayNum())) {
    const it = S.stock.find(i => i.uid === l.itemUid);
    if (it) { it.held = null; toast(`${l.who} never came back. The ${it.name.toLowerCase()} is yours to sell.`, l.look); log(`${l.who} forfeited a ${it.name.toLowerCase()}`); }
  }
  S.loans = S.loans.filter(x => x.due >= dayNum());
  renderPanel();
  // Watch raid if you're holding listed goods
  // (reported goods are waiting for Barrow; hidden ones may be missed, js/stolen.js)
  const hot = S.stock.filter(i => i.noticeId && !i.held && i.backroom !== 'reported');
  if (hot.length && Math.random() < (0.15 + S.heat / 200) * (hasUpgrade('safe') ? UPGRADES.safe.raidMult : 1) * itemEffect('raidMult', true)
    * (typeof standingRaid === 'function' ? standingRaid() : 1) // a regular on the force (js/favours.js)
    && !(typeof standingRaidWarned === 'function' && standingRaidWarned())) {
    const b = await enterActor(CAST.barrow.look, CAST.barrow.name);
    await say(b, 'Morning. Routine inspection. Stand aside.');
    const found = raidFinds(hot);
    if (found.length) {
      const fine = raidFine(found), hid = found.some(i => i.backroom === 'hidden');
      S.stock = S.stock.filter(i => !found.includes(i));
      await say(b, `${found.map(i => i.name).join(', ')}. All on my list${hid ? ', and somebody went to the trouble of hiding it' : ''}. I'll take ${found.length > 1 ? 'those' : 'that'}, and a fine of ${money(fine)}.`);
      change('coin', -Math.min(S.coin, fine), 'Fined by the police for stolen goods');
      change('heat', 12 + (hid ? STOLEN.hiddenHeat : 0)); change('rep', -5);
    } else await say(b, 'Hm. Clean. For now.');
    await leaveShop(b);
  }
  for (const h of HOOKS.morning) await h();
  const sc = SCRIPT[`${S.week}-${S.day}`] || {};
  for (const m of (sc.morning || [])) if (m.quest || mainStoryOn()) await m();
}

// runDay(), the day on a clock, is in js/day.js

async function endDay() {
  view.timeOfDay = 0.9;
  // walk-in trade
  const sold = [];
  const walkIn = it => {
    const showcase = hasUpgrade('showcase') && UPGRADES.showcase.cats.includes(it.cat) ? UPGRADES.showcase.priceMult : 1;
    const quillon = it.curio && typeof hasCard === 'function' && hasCard('callingCard') ? 1.1 : 1; // Mr. Quillon's Calling Card
    const price = Math.round(it.guide * (WALKIN.price + S.rep / WALKIN.priceRep) * rand(0.95, 1.05) * showcase * quillon * seasonLike(it));
    S.stock = S.stock.filter(x => x !== it);
    S.coin += price; S.stats.sold++;
    sold.push({ it, price });
    log(`Walk-in bought ${it.name} for ${money(price)}`);
    onSold(it, 'walkin');
    if (it.fake && Math.random() < 0.6) S.complaints.push({ due: dayNum() + 1, refund: price, name: randomName(), look: randomLook(), item: it.name });
    if (it.noticeId && Math.random() < 0.35) S.heat = clamp(S.heat + 8, 0, 100);
  };
  for (const it of [...S.stock]) {
    if (it.held || it.nosale) continue;
    if (Math.random() < (it.curio ? 0.75 : WALKIN.chance + S.rep / WALKIN.chanceRep + (hasUpgrade('sign') ? UPGRADES.sign.walkin : 0))) walkIn(it);
  }
  // Lucky Dauber (js/cards.js): once, a day with no closing-time sale gets one
  if (!sold.length && typeof cardReady === 'function' && cardReady('dauber')) {
    const left = S.stock.filter(it => !it.held && !it.nosale);
    if (left.length) { playCard('dauber'); walkIn(pick(left)); }
  }
  const before = S.heat;
  S.heat = clamp(S.heat - 3, 0, 100);
  renderPanel();
  if (sold.length) Sound.coin();
  runTick();
  await showModal(`<h2>${DAYS[S.day - 1]} closes</h2>
    <h3>Sold at closing time</h3>
    ${sold.length ? `<table>${sold.map(s => `<tr><td><img src="${iconURL(s.it.icon)}"> ${esc(s.it.name)}</td><td>paid ${s.it.paid}</td><td class="good">sold ${s.price}</td><td class="${s.price - s.it.paid >= 0 ? 'good' : 'bad'}">${s.price - s.it.paid >= 0 ? '+' : ''}${s.price - s.it.paid}</td></tr>`).join('')}</table>` : '<p class="muted">No last-minute sales today.</p>'}
    <p>Cash: <b>${money(S.coin)}</b> · Reputation: <b>${S.rep}</b> · Heat: <b>${S.heat}</b>${before !== S.heat ? ' <span class="muted">(cooled off a little overnight)</span>' : ''}</p>
    ${S.day === 5 ? `<p class="bad">Friday: bills of ${money(billsDue())} are due tonight.</p>` : ''}`,
  [{ label: S.day === 5 ? 'Close up for the week' : 'Close up for the night' }]);
  Sound.shutterDown();
}

async function endWeek() {
  await runNights();
  if (S.flags.crown) {
    S.flags.crown = false;
    if (S.heat < 100) { change('coin', 300, 'Wren\'s buyer paid for the crown'); S.flags.fenceDeals += 3; toast('Wren\'s buyer paid $300 for the crown', CAST.wren.look); }
  }
  if (checkLose()) return;
  if (typeof standingBeforeBills === 'function') await standingBeforeBills(); // a friend's loan (js/favours.js)
  await Sound.during('tension', bills)();
  for (const h of HOOKS.weekend) await h();
  await fadeOut();
}

async function bills() {
  let rentPaid = false, instPaid = false, loanPaid = false;
  const rent = rentBase() + S.rentArrears, inst = installmentDue();
  S.strikeBy = null;
  const strikesBefore = S.strikes;
  modalLocked = true;
  for (;;) {
    const v = await showModal(`<h2>Friday bills: week ${S.week}</h2>
      <table>
        <tr><td>Rent to the landlord${monthInfo().heating ? ', with heating oil' : ''}${S.rentArrears ? ' (with arrears)' : ''}</td><td>${money(rent)}</td><td>${rentPaid ? '<span class="good">paid</span>' : ''}</td></tr>
        ${debtOn() ? `<tr><td>${creditor().name} installment${inst === 0 ? ' (forgiven)' : ''}</td><td>${money(inst)}</td><td>${instPaid || inst === 0 ? '<span class="good">paid</span>' : ''}</td></tr>` : ''}
        ${loanBillRow(loanPaid)}
      </table>
      <p>Cash on hand: <b>${money(S.coin)}</b></p>
      <p class="muted">${debtOn() ? `Unpaid rent rolls over with a 25% late fee and costs you reputation. A missed ${creditor().name} installment is a strike: two strikes and they repossess the shop.` : 'Unpaid rent rolls over with a 25% late fee, costs you reputation and is a strike: two strikes and the landlord changes the locks.'} Short of cash? Sell stock to Sal the scrap dealer, or phone for a short-term loan.</p>`,
    [{ label: `Pay rent (${money(rent)})`, value: 'rent', disabled: rentPaid || S.coin < rent },
      debtOn() && { label: `Pay ${creditor().short} (${money(inst)})`, value: 'inst', disabled: instPaid || inst === 0 || S.coin < inst },
      loanDueNow() && { label: `Pay back ${S.borrowed.short} (${money(S.borrowed.owed)})`, value: 'loan', disabled: S.coin < S.borrowed.owed },
      !S.borrowed && !loanPaid && { label: 'Phone for a loan', value: 'phone' },
      { label: 'Sell stock', value: 'stock' }, { label: 'Done', value: 'done' }].filter(Boolean));
    if (v === 'rent' || v === 'inst') Sound.stamp();
    if (v === 'rent') { change('coin', -rent, 'Paid rent'); rentPaid = true; }
    else if (v === 'inst') { change('coin', -inst, mainStoryOn() ? 'Paid the Gilded Hand' : `Paid ${creditor().name}`); instPaid = true; }
    else if (v === 'loan') { Sound.stamp(); repayLoan(); loanPaid = true; }
    else if (v === 'phone') { modalLocked = false; await phoneForLoan(); modalLocked = true; }
    else if (v === 'stock') { modalLocked = false; await new Promise(res => { stockModal(); const iv = setInterval(() => { if (!modalOpen) { clearInterval(iv); res(); } }, 100); }); modalLocked = true; }
    else if (v === 'done') break;
  }
  modalLocked = false;
  if (instPaid || inst === 0) S.goals.handPaid++;
  if (rentPaid) { S.rentArrears = 0; S.goals.rentPaid = (S.goals.rentPaid || 0) + 1; } else { S.rentArrears = Math.round(rent * 1.25) - rentBase(); change('rep', -5, 'Rent unpaid'); }
  if (!rentPaid && !debtOn()) {
    S.strikes++; log('Missed the rent');
    Sound.knock();
    await showModal(`<h2>A letter from the landlord</h2><p>The new owner's lawyer has written. One more Friday without rent and he changes the locks. <b>Strike ${S.strikes} of 2.</b></p>`, [{ label: 'Continue' }]);
  }
  if (!instPaid && inst > 0 && mainStoryOn() && S.week < WEEKS && typeof cardReady === 'function' && cardReady('merrit')) {
    // A Note for Merrit (js/cards.js): one installment a week late, no strike
    playCard('merrit');
    S.lateInstallment = { week: S.week + 1, amt: inst };
    Sound.knock();
    await showModal(`<h2>A visit in the night</h2><p>Merrit Gaunt finds Odile's note pinned to the door. He reads it twice, sighs, and writes "next Friday" on his clipboard. <b>No strike.</b> The ${money(inst)} is added to next week's installment.</p>`, [{ label: 'Continue' }]);
  } else if (!instPaid && inst > 0) {
    S.strikes++; log(`Missed a ${creditor().name} installment`);
    Sound.knock();
    await showModal(mainStoryOn() ? `<h2>A visit in the night</h2><p>Merrit Gaunt leaves a FINAL NOTICE envelope taped to your door, and a black ribbon tied to the handle. <b>Strike ${S.strikes} of 2.</b></p>`
      : `<h2>A letter from Saltire Capital</h2><p>Cream paper, a watermark, two paragraphs of regret and a deadline. Nobody comes to the door. Nobody needs to. <b>Strike ${S.strikes} of 2.</b></p>`, [{ label: 'Continue' }]);
  }
  await missedLoan(strikesBefore); // a short-term loan that was due (js/borrow.js)
  renderPanel();
}

function checkLose() {
  if (S.heat >= 100) { S.over = 'raided'; return true; }
  // the last strike decides who takes the shop: a defaulted short-term loan (js/borrow.js) names its lender
  if (S.strikes >= 2) { S.over = S.strikeBy === 'hand' ? 'seized' : S.strikeBy === 'saltire' ? 'foreclosed' : mainStoryOn() ? 'seized' : paperSoldOn() ? 'foreclosed' : 'evicted'; return true; }
  return false;
}

async function ending() {
  clearSave();
  await fadeOut();
  view.bg = 'shop'; view.timeOfDay = 0.95; clearActors(); placeKeeper();
  Sound.music(S.over ? 'lost' : 'ending');
  await fadeIn();
  let title, lines = [];
  if (S.over === 'raided') {
    title = 'Shut Down by the Police';
    lines.push('Captain Barrow tapes the closure order to your door herself. Too much stolen gear passed over your counter. The Crooked Scale\'s license is revoked.');
  } else if (S.over === 'seized') {
    title = 'The Hand Closes';
    lines.push('Merrit Gaunt arrives with two sheriff\'s deputies and a court order. Gilded Hand Finance takes the shop, the stock, and the neon sign.');
  } else if (S.over === 'foreclosed') {
    title = 'Under New Management';
    lines.push(`Saltire Capital sends a property manager with a tablet and a smile. By the end of ${monthInfo().name} the Crooked Scale is a coffee bar called Scale. It does well.`);
  } else if (S.over === 'evicted') {
    title = 'Locked Out';
    lines.push(`A locksmith is at the door before you are. The landlord\'s lawyer has a box for your personal things. The Crooked Scale\'s sign comes down in ${monthInfo().name}.`);
  } else if (!mainStoryOn()) {
    ({ title, lines } = monthEnding());
  } else {
    if (S.flags.odileFreed) { title = 'Free and Clear'; lines.push('With Odile home and Gilded Hand\'s crooked books in front of the attorney general, the debt is gone. Two keepers now stand behind the counter of The Crooked Scale.'); }
    else if (S.flags.odileHome) { title = 'Family Business'; lines.push('Odile comes home. The Hand still circles, but now there are two of you to keep it at bay.'); }
    else if (S.rep >= 75) { title = 'Pillar of the Community'; lines.push('Everyone in Hollow Neck says: if you need a fair price, go to The Crooked Scale. You have four and a half stars online.'); }
    else if (S.flags.fenceDeals >= 3) { title = 'Friend of the Night Market'; lines.push('Your shelves are full and your bank balance is healthy, and nobody asks where any of it came from. Not yet.'); }
    else { title = 'Still Standing'; lines.push('You made it through the month. The bills keep coming, but so do the customers.'); }
    if (S.flags.kidsFair || S.flags.kidsHonest) lines.push('Lark and Linnet still bring you every shiny thing they find on the beach.');
    else if (S.flags.kidsCheated) lines.push('Lark and Linnet learned what amber is worth. They sell everything online now.');
    if (S.flags.pellRedeemed) lines.push('Old Pell has Ada\'s music box back on his mantel. He brings you scallops every Friday.');
    else if (S.flags.pellRefused) lines.push('Old Pell sold Ada\'s things to the chain store out on Route 1. He doesn\'t come by anymore.');
    if (S.flags.wrenArrested) lines.push('Wren is doing eighteen months. She sends a postcard, unsigned.');
    else if (S.flags.fence) lines.push('Wren still slips in after closing with something wrapped in a hoodie.');
    if (S.flags.charity) lines.push('A new roof covers the kids\' dormitory at Saint Brine\'s.');
  }
  for (const h of HOOKS.ending) title = h(title, lines) || title;
  const v = await showModal(`<h2>${esc(title)}</h2>${lines.map(l => `<p>${esc(l)}</p>`).join('')}
    <h3>${mainStoryOn() ? 'Your month' : `Your ${monthNum()} months`} at The Crooked Scale</h3>
    <table><tr><td>Cash</td><td>${money(S.coin)}${S.borrowed ? ` (${money(S.borrowed.owed)} borrowed)` : ''}</td><td>Reputation</td><td>${S.rep}</td></tr>
    <tr><td>Items bought</td><td>${S.stats.bought}</td><td>Items sold</td><td>${S.stats.sold}</td></tr>
    <tr><td>Thieves and frauds caught</td><td>${S.stats.thieves}</td><td>Fakes you sold on</td><td>${S.stats.cheated}</td></tr></table>
    ${goalsSummaryHTML()}${typeof runSummaryHTML === 'function' ? runSummaryHTML() : ''}${typeof cardsEndingHTML === 'function' ? cardsEndingHTML() : ''}${!S.over && canStayOn() ? stayOnHTML() : ''}`,
  [!S.over && canStayOn() && { label: `Stay on into ${MONTHS[monthNum()].name}`, value: 'stay' }, { label: 'Play again', value: 'again' }].filter(Boolean));
  if (v === 'stay') return true;
  location.reload();
  return false;
}

// ================================================================ main loop + title
async function play() {
  for (;;) {
    save();
    await morning();
    if (!checkLose()) await runDay();
    if (checkLose()) break;
    await endDay();
    await fadeOut();
    if (S.day !== 5) { await runNights(); if (checkLose()) break; await fadeOut(); }
    if (S.day === 5) {
      await endWeek();
      if (checkLose()) break;
      if (S.week === WEEKS) break;
      S.week++; S.day = 1;
    } else S.day++;
  }
  // a finished month can carry on into the next one (js/stay.js)
  if (await ending()) { startNextMonth(); return play(); }
}

S = newState();
renderPanel();
requestAnimationFrame(frame);
// The title screen is shown by js/menus.js once every script has loaded.

// expose a tiny hook for automated tests
window.__pawn = { get S() { return S; }, view, advance, fast() { fastMode = true; } };
