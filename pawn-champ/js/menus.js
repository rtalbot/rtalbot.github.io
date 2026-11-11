// Pawn Champ - title screen, pause menu, settings and credits.
// Loaded last. Uses game.js globals: S, view, paused, Sound, textDelay, play(), newState(),
// loadSave(), clearSave(), DAYS, modalOpen, fadeOut(), clearActors(), placeKeeper().
'use strict';

// ================================================================ settings (kept apart from the save)
const SETTINGS_KEY = 'pawnchamp-settings-v1';
const TEXT_SPEEDS = [
  { id: 'slow', label: 'Slow', delay: 30 },
  { id: 'normal', label: 'Normal', delay: 14 },
  { id: 'fast', label: 'Fast', delay: 5 },
  { id: 'instant', label: 'Instant', delay: 0 }
];
// volume is the master level; music and sfx are mixed under it (see js/audio.js).
const Settings = { volume: 70, music: 60, sfx: 80, textSpeed: 'normal' };
const VOLUME_ROWS = [['volume', 'Master', 'master'], ['music', 'Music', 'music'], ['sfx', 'Effects', 'sfx']];

function loadSettings() {
  try { Object.assign(Settings, JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}); } catch (e) { /* use defaults */ }
  applySettings();
}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings)); } catch (e) { /* ignore */ } }
function applySettings() {
  for (const [k, , bus] of VOLUME_ROWS) {
    Settings[k] = clamp(Number(Settings[k]) || 0, 0, 100);
    Sound.setVolume(bus, Settings[k] / 100);
  }
  const sp = TEXT_SPEEDS.find(t => t.id === Settings.textSpeed) || TEXT_SPEEDS[1];
  Settings.textSpeed = sp.id;
  textDelay = sp.delay;
}

// ================================================================ fullscreen
// Not a saved setting: browsers only allow fullscreen from a click or key press. Desktop builds
// may provide window.pawnDesktop.setFullscreen (the Electron preload) to use the real window.
const canFullscreen = () => !!(window.pawnDesktop?.setFullscreen || document.fullscreenEnabled);
const isFullscreen = () => window.pawnDesktop?.isFullscreen ? window.pawnDesktop.isFullscreen() : !!document.fullscreenElement;
async function setFullscreen(on) {
  try {
    if (window.pawnDesktop?.setFullscreen) await window.pawnDesktop.setFullscreen(on);
    else if (on && !document.fullscreenElement) await document.documentElement.requestFullscreen();
    else if (!on && document.fullscreenElement) await document.exitFullscreen();
  } catch (e) { /* refused (e.g. an iframe without allowfullscreen) */ }
}

// ================================================================ shared menu panels
// A menu is one panel at a time drawn into a host element (the title overlay or the pause overlay).
// `back` returns to the panel that opened it.
function menuButtons(host, items) {
  const list = document.createElement('div');
  list.className = 'menu-list';
  for (const it of items) {
    const b = document.createElement('button');
    b.className = 'menu-btn' + (it.quiet ? ' quiet' : '');
    b.innerHTML = esc(it.label) + (it.sub ? `<small>${esc(it.sub)}</small>` : '');
    b.disabled = !!it.disabled;
    b.onclick = e => { e.stopPropagation(); Sound.blip(); it.act(); };
    list.appendChild(b);
  }
  host.appendChild(list);
  const first = list.querySelector('button:not(:disabled)');
  if (first) first.focus({ preventScroll: true });
}

function settingsPanel(host, back) {
  host.innerHTML = `<div class="menu-card">
    <h2>Settings</h2>
    ${VOLUME_ROWS.map(([k, label]) => `<label class="menu-row"><span>${label}</span>
      <input type="range" min="0" max="100" step="5" data-vol="${k}" value="${Settings[k]}">
      <b data-vol-val="${k}">${Settings[k] === 0 ? 'Off' : Settings[k]}</b></label>`).join('')}
    <div class="menu-row"><span>Text speed</span>
      <div class="seg" role="radiogroup">${TEXT_SPEEDS.map(t =>
        `<button role="radio" data-speed="${t.id}" aria-checked="${t.id === Settings.textSpeed}">${t.label}</button>`).join('')}</div></div>
    ${canFullscreen() ? `<div class="menu-row"><span>Fullscreen</span>
      <div class="seg" role="radiogroup">${[['off', 'Off'], ['on', 'On']].map(([id, label]) =>
        `<button role="radio" data-full="${id}" aria-checked="${(id === 'on') === isFullscreen()}">${label}</button>`).join('')}</div></div>` : ''}
    <p class="menu-sample" id="set-sample"></p>
  </div>`;
  host.querySelectorAll('[data-vol]').forEach(vol => {
    const k = vol.dataset.vol, volVal = host.querySelector(`[data-vol-val="${k}"]`);
    vol.oninput = () => { Settings[k] = Number(vol.value); volVal.textContent = Settings[k] === 0 ? 'Off' : Settings[k]; applySettings(); saveSettings(); };
    if (k !== 'music') vol.onchange = () => Sound.coin(); // music changes are heard in the loop itself
  });
  const sample = host.querySelector('#set-sample');
  let sampleTimer = null;
  const showSample = () => {
    clearInterval(sampleTimer);
    const text = 'This is how fast people talk at your counter.';
    const d = textDelay;
    if (!d) { sample.textContent = text; return; }
    let i = 0;
    sampleTimer = setInterval(() => { i++; sample.textContent = text.slice(0, i); if (i >= text.length) clearInterval(sampleTimer); }, d);
  };
  host.querySelectorAll('[data-full]').forEach(b => b.onclick = async e => {
    e.stopPropagation(); Sound.blip();
    await setFullscreen(b.dataset.full === 'on');
    host.querySelectorAll('[data-full]').forEach(x => x.setAttribute('aria-checked', (x.dataset.full === 'on') === isFullscreen()));
  });
  host.querySelectorAll('[data-speed]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    Settings.textSpeed = b.dataset.speed; applySettings(); saveSettings(); Sound.blip();
    host.querySelectorAll('[data-speed]').forEach(x => x.setAttribute('aria-checked', x === b));
    showSample();
  });
  showSample();
  menuButtons(host.querySelector('.menu-card'), [{ label: 'Back', act: () => { clearInterval(sampleTimer); back(); } }]);
}

function creditsPanel(host, back) {
  host.innerHTML = `<div class="menu-card credits">
    <h2>Credits</h2>
    <dl>
      <dt>Created by</dt><dd>Rich</dd>
      <dt>Code, writing and pixel art</dt><dd>Made with Claude, an AI model by Anthropic</dd>
      <dt>Music and sound</dt><dd>Composed in code and synthesised live in your browser</dd>
      <dt>Built with</dt><dd>Plain HTML, CSS and JavaScript</dd>
      <dt>Fonts</dt><dd>Pixelify Sans and Silkscreen (SIL Open Font License)</dd>
      <dt>Version</dt><dd>${esc(VERSION)}</dd>
    </dl>
    <p class="muted">Every character, item and picture in this game was made for it.</p>
  </div>`;
  menuButtons(host.querySelector('.menu-card'), [{ label: 'Back', act: back }]);
}

function confirmPanel(host, question, yesLabel, onYes, back) {
  host.innerHTML = `<div class="menu-card"><h2>Are you sure?</h2><p>${esc(question)}</p></div>`;
  menuButtons(host.querySelector('.menu-card'), [{ label: yesLabel, act: onYes }, { label: 'Cancel', act: back }]);
}

// ================================================================ title screen
function titleScreen() {
  view.bg = 'shop'; view.timeOfDay = 0.75; clearActors(); placeKeeper();
  Sound.music('title');
  const t = $('#title');
  t.classList.remove('hidden');
  titleMain(t);
}

function titleMain(t) {
  const existing = loadSave();
  t.innerHTML = `<div class="title-sign"><span class="neon">PAWN</span><span class="neon alt">CHAMP</span></div>
    <div class="title-sub">The Crooked Scale · a pawnshop in Hollow Neck</div>
    <div class="title-menu"></div>
    <div class="title-hint"><span class="kb-only">Click or press Space to talk · Esc pauses</span><span class="pad-only">A picks and talks · B goes back · Start pauses</span></div>
    <div class="title-version">v${esc(VERSION)}</div>`;
  const host = t.querySelector('.title-menu');
  const back = () => titleMain(t);
  const begin = (state, code) => startGame(t, state, code);
  menuButtons(host, [
    existing && { label: 'Continue', sub: `${existing.month > 1 ? MONTHS[existing.month - 1].name + ', w' : 'W'}eek ${existing.week}, ${DAYS[existing.day - 1]}${existing.difficulty && existing.difficulty !== 'normal' ? ` (${DIFFICULTY[existing.difficulty].label})` : ''}`, act: () => begin(existing) },
    { label: 'New game', act: () => newGamePanel(host, back, begin, !!existing) },
    (loadBook().runs > 0 || Object.keys(loadBook().secrets || {}).length > 0) && { label: 'Storybook', act: () => storybookPanel(host, back) },
    { label: 'Settings', act: () => settingsPanel(host, back) },
    { label: 'Credits', act: () => creditsPanel(host, back) },
    window.pawnDesktop && { label: 'Quit', quiet: true, act: () => window.pawnDesktop.quit() }
  ].filter(Boolean));
}

async function startGame(t, state, code) {
  t.classList.add('hidden');
  t.innerHTML = '';
  if (!state.run && state.week === 1 && state.day === 1) state.run = makeRun(code, state.hand); // older saves keep every story
  else if (state.run) planRun(state.run);
  S = state;
  if (typeof applyHand === 'function') applyHand(); // cards (js/cards.js)
  await fadeOut();
  play();
}

// ================================================================ pause menu
function openPause() {
  if (!S || paused || modalOpen || titleShown()) return;
  paused = true;
  const p = $('#pause');
  p.classList.remove('hidden');
  pauseMain(p.querySelector('.pause-host'));
}

function closePause() {
  paused = false;
  const p = $('#pause');
  p.classList.add('hidden');
  p.querySelector('.pause-host').innerHTML = '';
}

function pauseMain(host) {
  host.innerHTML = `<div class="menu-card"><h2>Paused</h2>
    <p class="muted">Week ${S.week}, ${DAYS[S.day - 1]}. The game saves itself at the start of each day.</p></div>`;
  const card = host.querySelector('.menu-card');
  const back = () => pauseMain(host);
  menuButtons(card, [
    { label: 'Resume', act: closePause },
    { label: 'Settings', act: () => settingsPanel(host, back) },
    { label: 'How to play', act: () => helpPanel(host, back) },
    { label: 'Quit to title', act: () => confirmPanel(host, 'Anything since this morning is lost. You can continue from the start of today.', 'Quit to title', () => location.reload(), back) },
    { label: 'Restart from week 1', quiet: true, act: () => confirmPanel(host, 'This deletes your autosave and starts a new game.', 'Restart', () => { clearSave(); location.reload(); }, back) }
  ]);
}

function helpPanel(host, back) {
  host.innerHTML = `<div class="menu-card"><h2>How to play</h2>
    <ul class="menu-help">
      <li><b>Click</b> or press <b>Space</b> to move the conversation on.</li>
      <li><b>Number keys</b> pick a choice.</li>
      <li><b>Esc</b> pauses, or closes a window.</li>
      <li>Ledger, Stock and Notices sit under the shop.</li>
      <li><b>Controller:</b> the d-pad or stick moves the highlight, <b>A</b> presses it (or moves the conversation on when nothing is highlighted), <b>B</b> goes back, <b>X</b> moves the conversation on, <b>Start</b> pauses. Left and right slide the haggle offer; the right stick scrolls.</li>
    </ul></div>`;
  menuButtons(host.querySelector('.menu-card'), [{ label: 'Back', act: back }]);
}

// The pause overlay sits above everything, so a click on it never reaches the shop.
(function buildPause() {
  const p = document.createElement('div');
  p.id = 'pause';
  p.className = 'hidden';
  p.innerHTML = '<div class="pause-host"></div>';
  document.body.appendChild(p);
})();

// Capture phase, so this runs before game.js's handler (which closes windows on Esc and
// turns Space/Enter into "advance").
const titleShown = () => !$('#title').classList.contains('hidden');
document.addEventListener('keydown', e => {
  if (e.key === 'F11' && canFullscreen()) { e.preventDefault(); e.stopPropagation(); setFullscreen(!isFullscreen()); return; }
  if ((e.key === ' ' || e.key === 'Enter') && (titleShown() || paused)) { e.stopPropagation(); return; }
  if (e.key !== 'Escape' || titleShown()) return;
  if (paused) {
    // Esc backs out of a sub-panel first, then resumes.
    const backBtn = [...document.querySelectorAll('#pause .menu-btn')].find(b => /^(Back|Cancel)$/.test(b.textContent));
    if (backBtn) backBtn.click(); else closePause();
    e.preventDefault();
  } else if (!modalOpen) openPause();
}, true);
// Leaving the tab or window pauses the shop.
window.addEventListener('blur', () => { if (!titleShown() && !modalOpen) openPause(); });

// ================================================================ boot
loadSettings();
titleScreen();
window.__pawn.settings = Settings;
window.__pawn.pause = openPause;
window.__pawn.resume = closePause;
