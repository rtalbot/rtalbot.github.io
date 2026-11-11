// Pawn Champ - game controller support (the browser Gamepad API). Loaded after menus.js.
// A focus cursor moves between whatever can be clicked: menu and choice buttons, the haggle card,
// windows, the stock slots, and the shop's hotspots (js/secrets.js). See docs/CONTROLLER.md.
// It drives the same buttons and keys the mouse and keyboard use, so no game code knows about it.
'use strict';

const Pad = (() => {
  // standard mapping (Xbox names; on a PlayStation pad A is Cross, B is Circle, X is Square)
  const B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, BACK: 8, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };
  const DIRS = { UP: [0, -1], DOWN: [0, 1], LEFT: [-1, 0], RIGHT: [1, 0] };
  const STICK = 0.5, REPEAT_DELAY = 380, REPEAT_EVERY = 110, SCROLL_SPEED = 14;

  let active = false;   // a pad has been used since the mouse last moved
  let target = null;    // { el } or { spot } (a hotspot id) or { cust } (a queued customer)
  let shown = false;    // the cursor is drawn
  let lastLayer = '';
  const down = {}, nextRepeat = {};

  const cursor = document.createElement('div');
  cursor.id = 'pad-cursor';
  cursor.className = 'hidden';
  document.body.appendChild(cursor);

  const visible = el => !!el && !el.closest('.hidden') && el.getClientRects().length > 0;
  const titleUp = () => !$('#title').classList.contains('hidden');

  // ---------------------------------------------------------------- what can be pressed right now
  // "Held" layers (title, pause, windows, choices, cards) keep the cursor on one of their buttons.
  // The "room" layer is the shop with nothing asked of you: the cursor only appears once you move it.
  function layer() {
    if (paused) return { id: 'pause', roots: [$('#pause')], held: true };
    if (titleUp()) return { id: 'title', roots: [$('#title')], held: true };
    if (modalOpen) return { id: 'modal', roots: [$('#modal')], held: true };
    const roots = [$('#choices'), cardEl].filter(visible);
    if (roots.length) return { id: 'choose', roots: [...roots, $('#menu')], held: true };
    return { id: 'room', roots: [$('#menu'), $('#stock-grid')], held: false };
  }
  const SEL = 'button, input[type=range], input[type=text], select, .slot:not(.empty)';
  function elements(L) {
    const out = [];
    for (const root of L.roots) {
      for (const el of root.querySelectorAll(SEL)) if (!el.disabled && visible(el)) out.push(el);
    }
    return out;
  }
  function roomOpen(L) { return L.id === 'room' && typeof canClickRoom === 'function' && canClickRoom(); }
  // native canvas pixels (640x360) to a screen rectangle
  function toScreen(r) {
    const c = canvas.getBoundingClientRect(), sx = c.width / 640, sy = c.height / 360;
    return { left: c.left + r.x * sx, top: c.top + r.y * sy, width: r.w * sx, height: r.h * sy };
  }
  function custRect(c) {
    const a = c.actor;
    if (!a || a.hidden || a.walking) return null;
    return { x: (a.x - 8) * 2, y: (a.y - 38) * 2, w: 32, h: 76 };
  }
  function targets(L) {
    const out = elements(L).map(el => ({ el }));
    if (roomOpen(L)) {
      for (const h of roomSpots()) if (h.rect()) out.push({ spot: h.id });
      if (view.bg === 'shop') for (const c of [...queue, ...(typeof browsers !== 'undefined' ? browsers : [])]) if (custRect(c)) out.push({ cust: c });
    }
    return out;
  }
  function rectOf(t) {
    if (!t) return null;
    if (t.el) return t.el.isConnected && visible(t.el) && !t.el.disabled ? t.el.getBoundingClientRect() : null;
    if (t.spot) { const h = roomSpots().find(x => x.id === t.spot), r = h && h.rect(); return r ? toScreen(r) : null; }
    if (t.cust) { const r = (queue.includes(t.cust) || (typeof browsers !== 'undefined' && browsers.includes(t.cust))) && custRect(t.cust); return r ? toScreen(r) : null; }
    return null;
  }
  const same = (a, b) => !!a && !!b && a.el === b.el && a.spot === b.spot && a.cust === b.cust;
  const center = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

  function setTarget(t) {
    target = t;
    if (t && t.el) {
      t.el.focus({ preventScroll: true });
      t.el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  }
  // first stop in a held layer: whatever menus.js focused, else the first thing that can be pressed
  function snap(L) {
    const all = targets(L);
    const focused = all.find(t => t.el && t.el === document.activeElement);
    const first = focused || all.find(t => t.el && L.roots[0].contains(t.el)) || all[0] || null;
    setTarget(first);
    shown = !!first;
  }
  // The nearest target in a direction. Things in line (same row for left/right, same column for
  // up/down) come first, so the cursor doesn't drift diagonally onto a wide slider.
  function move(L, dx, dy) {
    const from = rectOf(target);
    if (!from) { snap(L); return; }
    const fc = center(from);
    let inLine = null, inLineScore = Infinity, best = null, bestScore = Infinity;
    for (const t of targets(L)) {
      if (same(t, target)) continue;
      const r = rectOf(t); if (!r) continue;
      const c = center(r), vx = c.x - fc.x, vy = c.y - fc.y;
      const along = vx * dx + vy * dy;
      if (along <= 2) continue;
      // the gap between the two boxes sideways; 0 when they overlap
      const across = dx ? Math.max(0, r.top - (from.top + from.height), from.top - (r.top + r.height))
        : Math.max(0, r.left - (from.left + from.width), from.left - (r.left + r.width));
      const off = Math.abs(dx ? vy : vx);
      if (!across && along + 0.1 * off < inLineScore) { inLineScore = along + 0.1 * off; inLine = t; }
      if (along + 2 * off < bestScore) { bestScore = along + 2 * off; best = t; }
    }
    const pick = inLine || best;
    if (pick) { setTarget(pick); Sound.blip(); }
  }

  // ---------------------------------------------------------------- actions
  function key(k) { document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })); }
  function press(L) {
    const t = target;
    if (t.el) {
      if (t.el.type === 'range') return;
      if (t.el.tagName === 'INPUT' || t.el.tagName === 'SELECT') { t.el.focus(); return; }
      t.el.click();
      return;
    }
    if (!roomOpen(L)) return;
    const r = t.spot ? roomSpots().find(x => x.id === t.spot).rect() : custRect(t.cust);
    if (!r) return;
    if (typeof lastInput !== 'undefined') lastInput = performance.now();
    if (t.spot) roomSpots().find(x => x.id === t.spot).click(r.x + r.w / 2, r.y + r.h / 2);
    else eavesdrop(t.cust);
  }
  function nudgeRange(el, dir) {
    const min = +el.min || 0, max = +el.max || 100, step = +el.step || Math.max(1, Math.round((max - min) / 40));
    const v = clamp(+el.value + dir * step, min, max);
    if (v === +el.value) return;
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  function backOut(L) {
    if (L.id === 'pause' || L.id === 'modal') { key('Escape'); return; }
    if (L.id === 'title') {
      const back = [...$('#title').querySelectorAll('.menu-btn')].find(b => /^(Back|Cancel)$/.test(b.textContent));
      if (back) back.click();
      return;
    }
    if (L.id === 'room') { shown = false; setTarget(null); }
  }
  function scroll(L, amount) {
    const from = target && target.el;
    let box = from && from.closest('.modal-box, .card, .menu-card, #title');
    if (!box) box = L.roots.find(r => r.scrollHeight > r.clientHeight) || L.roots[0].querySelector('.modal-box, .menu-card');
    if (box) box.scrollTop += amount;
  }

  function onPress(name) {
    if (typeof Sound !== 'undefined' && Sound.unlock) Sound.unlock();
    const L = layer();
    if (!active) {
      active = true;
      document.body.classList.add('pad');
      // the first touch only wakes the cursor in a menu, so it never picks a choice by accident
      if (L.held && name !== 'START') { snap(L); return; }
    }
    if (DIRS[name]) {
      if (target && target.el && target.el.type === 'range' && name in { LEFT: 1, RIGHT: 1 } && rectOf(target)) {
        nudgeRange(target.el, DIRS[name][0]); return;
      }
      if (!shown || !rectOf(target)) {
        // the room cursor starts on the Ledger button, so the shop's secrets are still yours to find
        if (L.held) snap(L); else { setTarget(targets(L)[0] || null); shown = !!target; }
        return;
      }
      move(L, ...DIRS[name]);
      return;
    }
    if (name === 'A') {
      if (shown && rectOf(target)) press(L);
      else if (L.held) snap(L);
      else key(' ');
    } else if (name === 'X') {
      if (L.id === 'room') key(' ');
    } else if (name === 'B') {
      backOut(L);
    } else if (name === 'START') {
      if (paused) closePause();
      else if (!titleUp() && !modalOpen) openPause();
    }
  }

  // ---------------------------------------------------------------- the loop
  function readPad() {
    const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter(p => p && p.connected) : [];
    if (!pads.length) return null;
    const now = {};
    let scrollY = 0;
    for (const p of pads) {
      const btn = i => !!(p.buttons[i] && p.buttons[i].pressed);
      for (const n of ['A', 'B', 'X', 'Y', 'BACK', 'START', 'UP', 'DOWN', 'LEFT', 'RIGHT']) now[n] = now[n] || btn(B[n]);
      const ax = p.axes[0] || 0, ay = p.axes[1] || 0;
      if (ay < -STICK) now.UP = true; if (ay > STICK) now.DOWN = true;
      if (ax < -STICK) now.LEFT = true; if (ax > STICK) now.RIGHT = true;
      const ry = p.axes[3] || 0;
      if (Math.abs(ry) > 0.25) scrollY += ry;
    }
    return { now, scrollY };
  }
  function frame(t) {
    const pad = readPad();
    if (pad) {
      for (const n in pad.now) {
        if (pad.now[n] && !down[n]) { down[n] = true; nextRepeat[n] = t + REPEAT_DELAY; onPress(n); }
        else if (pad.now[n] && DIRS[n] && t >= nextRepeat[n]) { nextRepeat[n] = t + REPEAT_EVERY; onPress(n); }
        else if (!pad.now[n]) down[n] = false;
      }
      if (pad.scrollY && active) scroll(layer(), pad.scrollY * SCROLL_SPEED);
    }
    draw();
    requestAnimationFrame(frame);
  }
  function draw() {
    const L = layer();
    if (L.id !== lastLayer) {
      lastLayer = L.id;
      // a new menu or question: held layers grab the cursor, the room lets go of it
      if (active && L.held) snap(L); else { shown = false; target = null; }
    }
    let r = active && shown ? rectOf(target) : null;
    if (active && shown && !r && L.held) { snap(L); r = rectOf(target); }
    if (!r) { cursor.classList.add('hidden'); return; }
    cursor.classList.remove('hidden');
    cursor.classList.toggle('spot', !target.el);
    Object.assign(cursor.style, { left: r.left - 3 + 'px', top: r.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px' });
  }

  // the mouse takes over again as soon as it moves
  document.addEventListener('mousemove', e => {
    if (!active || (!e.movementX && !e.movementY)) return;
    active = false; shown = false; target = null;
    document.body.classList.remove('pad');
    cursor.classList.add('hidden');
  });
  window.addEventListener('gamepadconnected', () => { if (typeof toast === 'function') toast('Controller connected.'); });
  requestAnimationFrame(frame);

  // for tests (tools/gamepad.js)
  return { held: n => !!down[n], layer: () => layer().id, target: () => target, shown: () => shown, active: () => active };
})();
