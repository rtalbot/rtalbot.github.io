// Pawn Champ art page (docs/ART_REVIEW.md). Shows every piece of the game's art as the game draws
// it: the places (backgrounds), the characters and the item icons, each with the stories that use
// it, and takes notes on any of them for the next art pass. Notes are saved through tools/editor.js
// in docs/art-notes.json. The game runs in a hidden frame and does the drawing (artEditorInfo,
// drawArtPlace and artCharacterFrame at the end of js/art.js); who uses what comes from
// docs/catalogue/uses.json, which node tools/catalogue.js keeps current.
'use strict';

const $ = s => document.querySelector(s);
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k in e && typeof v !== 'string') e[k] = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k !== null && k !== undefined && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
  return e;
}
const put = (node, ...kids) => { node.replaceChildren(...kids.flat(Infinity).filter(k => k !== null && k !== undefined && k !== false)); return node; };
async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || r.statusText);
  return j;
}
const pretty = id => String(id).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
const MONTHS = ['', 'October', 'November', 'December', 'January', 'February', 'March'];

// ---------------------------------------------------------------- state
let G = null, INFO = null, USES = null;
const A = { tab: 'places', piece: null, month: 1, search: '', notedOnly: false, notes: [], pieces: [], animating: 0 };
const TABS = { places: 'Places', characters: 'Characters', icons: 'Items' };

async function start() {
  if (location.protocol === 'file:') {
    put($('#page'), el('div', { class: 'card' }, el('h2', { text: 'Start the editor from its server' }),
      el('p', {}, 'In the game folder, run ', el('code', { text: 'node tools/editor.js' }), ' and open ', el('code', { text: 'http://localhost:8017/editor/art.html' }), '. The server is what saves your notes.')));
    return;
  }
  await new Promise(ok => {
    const f = $('#game');
    const ready = () => { try { if (f.contentWindow.artEditorInfo && f.contentWindow.document.readyState === 'complete') return ok(); } catch (e) { /* not yet */ } setTimeout(ready, 100); };
    ready();
  });
  G = $('#game').contentWindow;
  INFO = G.artEditorInfo();
  USES = await api('GET', '/docs/catalogue/uses.json').catch(() => ({ stories: {}, places: {}, characters: {} }));
  A.notes = await api('GET', '/api/art-notes');
  A.pieces = buildPieces();
  const q = new URLSearchParams(location.search);
  if (TABS[q.get('tab')]) A.tab = q.get('tab');
  if (q.get('month')) A.month = +q.get('month') || 1;
  $('#month').value = A.month;
  const want = q.get('piece');
  if (want && A.pieces.some(p => p.key === want)) { A.piece = want; A.tab = tabOf(want); }
  renderAll();
}

// ---------------------------------------------------------------- the pieces
// One list of everything, each with a key ("place:docks", "character:barrow", "icon:ring") that
// the notes use, a name, where it lives in the code, and the stories that use it.
const tabOf = key => ({ place: 'places', character: 'characters', icon: 'icons' })[key.split(':')[0]];
function buildPieces() {
  const out = [];
  // places, grouped by the place they are a version of
  for (const p of INFO.places) {
    const u = USES.places[p.id] || { name: pretty(p.id), base: p.id, variant: 'main', stories: [] };
    out.push({ key: 'place:' + p.id, kind: 'place', id: p.id, name: u.name, sub: u.variant === 'main' ? '' : u.variant, group: u.base,
      groupName: (USES.places[u.base] || u).name, stories: u.stories || [], file: p.file, scale: p.scale, outdoor: p.outdoor });
  }
  // characters: you, then the people stories use most
  for (const [id, c] of Object.entries(INFO.cast)) {
    const stories = USES.characters[id] || [];
    out.push({ key: 'character:' + id, kind: 'character', id, name: c.name, sub: id, look: c.look, stories,
      group: id === 'keeper' ? 'you' : stories.length > 1 ? 'recurring' : stories.length ? 'one' : 'none' });
  }
  out.push({ key: 'character:shoppers', kind: 'character', id: 'shoppers', name: 'Everyday shoppers', sub: 'randomLook() in js/game.js', group: 'you', stories: [], shoppers: true });
  // icons, with the things in the game drawn with each
  for (const icon of INFO.icons) {
    const items = INFO.items.filter(i => i.icon === icon), uniques = INFO.uniques.filter(u => u.icon === icon);
    const stories = [...new Set(uniques.map(u => u.quest).filter(Boolean))];
    out.push({ key: 'icon:' + icon, kind: 'icon', id: icon, name: pretty(icon), sub: [...items, ...uniques].length ? `${items.length + uniques.length} thing${items.length + uniques.length > 1 ? 's' : ''}` : 'not used',
      things: [...items.map(i => i.name), ...uniques.map(u => u.name)], stories, group: 'icons' });
  }
  const groupRank = { you: 0, recurring: 1, one: 2, none: 3 };
  const byUse = (a, b) => b.stories.length - a.stories.length || a.name.localeCompare(b.name);
  const placeGroupUse = {};
  for (const p of out.filter(p => p.kind === 'place')) for (const id of p.stories) (placeGroupUse[p.group] = placeGroupUse[p.group] || new Set()).add(id);
  for (const p of out.filter(p => p.kind === 'place')) placeGroupUse[p.group] = placeGroupUse[p.group] || new Set();
  const order = (a, b) => {
    if (a.kind === 'place') return a.group === b.group ? (a.sub === '' ? -1 : b.sub === '' ? 1 : a.sub.localeCompare(b.sub))
      : placeGroupUse[b.group].size - placeGroupUse[a.group].size || a.groupName.localeCompare(b.groupName);
    if (a.kind === 'character') return (groupRank[a.group] - groupRank[b.group]) || (a.id === 'keeper' ? -1 : b.id === 'keeper' ? 1 : byUse(a, b));
    return byUse(a, b);
  };
  return ['place', 'character', 'icon'].flatMap(k => out.filter(p => p.kind === k).sort(order));
}
const piece = key => A.pieces.find(p => p.key === key);
const openNotes = key => A.notes.filter(n => n.piece === key && n.status !== 'done');
function visible() {
  const s = A.search.trim().toLowerCase();
  return A.pieces.filter(p => tabOf(p.key) === A.tab && (!A.notedOnly || openNotes(p.key).length) &&
    (!s || [p.name, p.sub, p.id, p.groupName, ...(p.things || [])].some(x => x && String(x).toLowerCase().includes(s))));
}

// ---------------------------------------------------------------- drawing with the game
// Places draw on a 640x360 canvas; the thumbnails are drawn at that size and shown smaller.
function placeCanvas(id, now, look) {
  const c = el('canvas', { width: 640, height: 360 });
  G.drawArtPlace(c, id, now, A.month, look);
  return c;
}
function spriteCanvas(look, frame, zoom) {
  const spr = G.artCharacterFrame(look, frame, A.month);
  const c = el('canvas', { width: spr.width * zoom, height: spr.height * zoom });
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(spr, 0, 0, c.width, c.height);
  return c;
}
function iconCanvas(icon, zoom) {
  const src = G.iconCanvas(icon);
  const c = el('canvas', { width: 12 * zoom, height: 12 * zoom });
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
function shoppers(n, zoom) { return Array.from({ length: n }, () => spriteCanvas(G.randomLook(), 0, zoom)); }

// thumbnails are drawn as they scroll into view, so a long grid opens at once
const lazy = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { lazy.unobserve(e.target); drawThumb(e.target); }
}, { root: null, rootMargin: '200px' });
function drawThumb(box) {
  const p = piece(box.dataset.key);
  try {
    if (p.kind === 'place') box.replaceChildren(placeCanvas(p.id, 1500));
    else if (p.shoppers) box.replaceChildren(...shoppers(3, 1));
    else if (p.kind === 'character') box.replaceChildren(spriteCanvas(p.look, 0, 2));
    else box.replaceChildren(iconCanvas(p.id, 5));
  } catch (e) { box.replaceChildren(el('span', { class: 'muted', text: 'Couldn\'t draw: ' + e.message })); }
}

// ---------------------------------------------------------------- the page
function go(key) {
  A.piece = key;
  if (key) A.tab = tabOf(key);
  const q = new URLSearchParams({ tab: A.tab });
  if (key) q.set('piece', key);
  if (A.month !== 1) q.set('month', A.month);
  history.replaceState(null, '', '?' + q);
  renderSide(); renderPage();
  $('#page').scrollTop = 0;
}
function renderAll() { renderSide(); renderPage(); renderNotes(); }

function renderSide() {
  const count = tab => A.pieces.filter(p => tabOf(p.key) === tab).length;
  const noted = tab => A.notes.filter(n => n.status !== 'done' && tabOf(n.piece) === tab).length;
  const search = el('input', { class: 't', placeholder: 'Find…', value: A.search, oninput: e => { A.search = e.target.value; A.piece = null; renderPage(); } });
  put($('#side'),
    el('h3', { text: 'Art' }),
    Object.entries(TABS).map(([tab, label]) => el('button', { class: 'nav-item' + (A.tab === tab && !A.piece ? ' on' : ''), onclick: () => { A.tab = tab; go(null); } },
      noted(tab) ? el('span', { class: 'count', text: noted(tab) }) : null, label,
      el('span', { class: 'sub', text: { places: `${count(tab)} backgrounds`, characters: `${count(tab) - 1} people, and the shoppers`, icons: `${count(tab)} icons` }[tab] }))),
    el('h3', { text: 'Show' }),
    search,
    el('label', { class: 'check' }, el('input', { type: 'checkbox', checked: A.notedOnly, onchange: e => { A.notedOnly = e.target.checked; A.piece = null; renderPage(); } }), ' Only ones with notes'),
    el('h3', { text: 'About' }),
    el('p', { class: 'muted small', text: 'Everything here is drawn by the game itself, so it\'s what a player sees. Click a piece to see it big, moving, and where it\'s used, and to leave a note for the next art pass.' }));
}

function renderPage() {
  A.animating++; // stops the last piece's animation
  const page = $('#page');
  if (A.piece) return put(page, ...detailPage(piece(A.piece)));
  $('#story-title').textContent = `${TABS[A.tab]} · ${MONTHS[A.month]}`;
  const list = visible();
  const card = p => {
    const n = openNotes(p.key).length;
    const thumb = el('div', { class: 'thumb ' + p.kind, 'data-key': p.key });
    lazy.observe(thumb);
    return el('button', { class: 'art-card ' + p.kind + (n ? ' has-note' : ''), onclick: () => go(p.key), title: p.key },
      thumb,
      el('div', { class: 'art-name' }, n ? el('span', { class: 'count', text: '✎ ' + n }) : null, p.kind === 'place' && p.sub ? p.sub : p.name),
      el('div', { class: 'art-sub', text: p.kind === 'place' ? `${p.id} · ${uses(p)}` : p.kind === 'character' ? (p.shoppers ? p.sub : p.id === 'keeper' ? 'every day' : uses(p)) : `${p.sub}${p.stories.length ? ' · ' + uses(p) : ''}` }));
  };
  if (!list.length) return put(page, el('p', { class: 'muted', text: 'Nothing here matches.' }));
  if (A.tab === 'places') {
    const groups = [];
    for (const p of list) { let g = groups.find(g => g.base === p.group); if (!g) groups.push(g = { base: p.group, name: p.groupName, items: [] }); g.items.push(p); }
    return put(page, el('h1', { text: 'Places' }),
      el('p', { class: 'scene-meta', text: `${list.length} backgrounds in ${groups.length} places, most-used first, as they look in ${MONTHS[A.month]}. Every place is drawn in code, in its own file in js/places/.` }),
      groups.map(g => [el('h2', { class: 'art-group', text: g.name }), el('div', { class: 'art-grid places' }, g.items.map(card))]));
  }
  if (A.tab === 'characters') {
    const heads = { you: 'You, and the everyday shoppers', recurring: 'In more than one story', one: 'In one story', none: 'Not in a story yet' };
    return put(page, el('h1', { text: 'Characters' }),
      el('p', { class: 'scene-meta', text: `Every named person, most-travelled first, dressed for ${MONTHS[A.month]}. A person is drawn from their look (docs/ART.md#characters): no faces, recognised by silhouette, hair, hat and clothes.` }),
      Object.entries(heads).map(([g, h]) => { const items = list.filter(p => p.group === g); return items.length ? [el('h2', { class: 'art-group', text: `${h} (${items.length})` }), el('div', { class: 'art-grid characters' }, items.map(card))] : null; }));
  }
  return put(page, el('h1', { text: 'Item icons' }),
    el('p', { class: 'scene-meta', text: `${list.length} icons, 12 pixels square (ICONS in js/art.js, and in story files), most-used first. Many things share one icon.` }),
    el('div', { class: 'art-grid icons' }, list.map(card)));
}
const uses = p => p.stories.length ? `${p.stories.length} stor${p.stories.length > 1 ? 'ies' : 'y'}` : 'not used yet';
const storyTitle = id => (USES.stories[id] || {}).title || pretty(id);
function storyLink(id) {
  const s = USES.stories[id];
  return s && s.data ? el('a', { href: `index.html?story=${id}`, text: storyTitle(id), title: 'Open it in the story editor' }) : el('span', { text: storyTitle(id) });
}

// one piece, big and moving, with what uses it and its notes
function detailPage(p) {
  const list = visible().length && visible().some(x => x.key === p.key) ? visible() : A.pieces.filter(x => x.kind === p.kind);
  const i = list.findIndex(x => x.key === p.key);
  const prev = list[i - 1], next = list[i + 1];
  $('#story-title').textContent = `${p.kind === 'place' ? p.name + (p.sub ? ` (${p.sub})` : '') : p.name} · ${MONTHS[A.month]}`;
  const nav = el('div', { class: 'art-nav' },
    el('button', { text: '← All ' + TABS[A.tab].toLowerCase(), onclick: () => go(null) }),
    el('button', { text: '‹ Previous', disabled: !prev, onclick: () => go(prev.key), title: 'Left arrow' }),
    el('button', { text: 'Next ›', disabled: !next, onclick: () => go(next.key), title: 'Right arrow' }),
    el('span', { class: 'muted', text: `${i + 1} of ${list.length}` }));
  const facts = [];
  let stage;
  if (p.kind === 'place') {
    const c = el('canvas', { width: 640, height: 360, class: 'art-stage' });
    const who = el('select', { title: 'Someone standing in the middle of the floor, at the size the cast is drawn here' },
      el('option', { value: '', text: 'Nobody' }), el('option', { value: 'keeper', text: 'You' }), el('option', { value: 'shopper', text: 'A shopper' }));
    let look = null;
    who.addEventListener('change', () => { look = who.value === 'keeper' ? INFO.cast.keeper.look : who.value === 'shopper' ? G.randomLook() : null; });
    const pause = el('button', { text: 'Pause' });
    let paused = false;
    pause.addEventListener('click', () => { paused = !paused; pause.textContent = paused ? 'Play' : 'Pause'; });
    animate(now => { if (!paused) G.drawArtPlace(c, p.id, now, A.month, look); });
    stage = [c, el('div', { class: 'art-controls' }, pause, p.id.startsWith('shop') ? null : el('label', {}, 'Stand in it: ', who),
      el('button', { text: 'Save picture', onclick: () => download(c, p.id) }))];
    facts.push(['Id', el('code', { text: p.id })], ['Drawn in', el('code', { text: p.file || '?' })], ['Cast size', `${p.scale}× the shop`],
      ['Snow in winter', p.outdoor ? 'yes (outdoors)' : 'no']);
    const sibs = A.pieces.filter(x => x.kind === 'place' && x.group === p.group && x.key !== p.key);
    if (sibs.length) facts.push(['Other versions', sibs.map((x, j) => [j ? ', ' : '', el('button', { class: 'link', text: x.sub || 'main', onclick: () => go(x.key) })])]);
  } else if (p.kind === 'character' && p.shoppers) {
    const box = el('div', { class: 'art-shoppers' }, shoppers(12, 3));
    stage = [box, el('div', { class: 'art-controls' }, el('button', { text: 'Another twelve', onclick: () => box.replaceChildren(...shoppers(12, 3)) }))];
    facts.push(['Drawn by', el('code', { text: 'randomLook() in js/game.js' })], ['Seen', 'every day, at the counter']);
  } else if (p.kind === 'character') {
    const c = el('canvas', { width: 40 * 5, height: 80 * 5, class: 'art-sprite' });
    const g = c.getContext('2d');
    const mode = el('select', {}, ['Standing', 'Walking', 'Talking'].map(m => el('option', { text: m })));
    const frames = { Standing: [0, 1], Walking: [2, 3, 4, 5], Talking: [0, 6] };
    animate(now => {
      const fs = frames[mode.value], f = fs[Math.floor(now / (mode.value === 'Walking' ? 140 : 420)) % fs.length];
      g.imageSmoothingEnabled = false; g.clearRect(0, 0, c.width, c.height);
      g.drawImage(G.artCharacterFrame(p.look, f, A.month), 0, 0, c.width, c.height);
    });
    const sizes = el('div', { class: 'art-sizes' }, [1, 2, 3].map(z => el('figure', {}, spriteCanvas(p.look, 0, z), el('figcaption', { text: z === 1 ? 'as in the shop' : z + '×' }))));
    stage = [el('div', { class: 'art-person' }, c, sizes), el('div', { class: 'art-controls' }, mode, el('button', { text: 'Save picture', onclick: () => download(c, p.id) }))];
    facts.push(['Id', el('code', { text: p.id })], ['Look', el('code', { class: 'mono wrap', text: JSON.stringify(p.look) })]);
  } else {
    const big = iconCanvas(p.id, 16);
    big.className = 'art-icon';
    stage = [el('div', { class: 'art-person' }, big, el('div', { class: 'art-sizes' }, [2, 4].map(z => el('figure', {}, iconCanvas(p.id, z), el('figcaption', { text: z === 2 ? 'in the game' : 'twice that' })))))];
    facts.push(['Id', el('code', { text: p.id })], ['Drawn on', (p.things || []).join(', ') || 'nothing yet']);
  }
  if (p.id === 'keeper') facts.push(['Seen', 'behind the counter, every day']);
  else if (!p.shoppers) facts.push(['Used by', p.stories.length ? p.stories.map((id, j) => [j ? ', ' : '', storyLink(id)]) : el('span', { class: 'muted', text: p.kind === 'icon' && (p.things || []).length ? 'everyday stock' : 'no story yet' })]);
  return [nav, el('h1', { text: p.kind === 'place' ? p.name + (p.sub ? ` (${p.sub})` : '') : p.name }),
    ...stage,
    el('div', { class: 'card' }, facts.map(([k, v]) => el('div', { class: 'field' }, el('span', { text: k }), el('div', {}, v)))),
    notesCard(p)];
}
function animate(draw) {
  const mine = ++A.animating;
  const tick = now => { if (A.animating !== mine) return; try { draw(now); } catch (e) { console.error(e); return; } requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function download(c, name) {
  const a = el('a', { href: c.toDataURL('image/png'), download: `${name}-${MONTHS[A.month].toLowerCase()}.png` });
  document.body.append(a); a.click(); a.remove();
}

// ---------------------------------------------------------------- notes
// docs/art-notes.json: [{ id, piece: "place:docks", name, text, status: "open" | "done", at }]
async function saveNotes() { await api('PUT', '/api/art-notes', A.notes); renderNotes(); renderSide(); }
function nameOfPiece(p) { return p.kind === 'place' ? `${p.name}${p.sub ? ` (${p.sub})` : ''}` : p.kind === 'icon' ? `${p.name} icon` : p.name; }
function notesCard(p) {
  const ta = el('textarea', { class: 'note-input', placeholder: 'What should change? Too dark, wrong era, the hat reads as a helmet… It goes on the list for the next art pass.' });
  const add = async () => {
    const text = ta.value.trim();
    if (!text) return;
    A.notes.push({ id: Date.now().toString(36), piece: p.key, name: nameOfPiece(p), month: A.month !== 1 ? MONTHS[A.month] : undefined, text, status: 'open', at: new Date().toISOString().slice(0, 16) });
    await saveNotes();
    refreshNotesCard();
  };
  ta.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') add(); });
  const mine = A.notes.filter(n => n.piece === p.key);
  return el('div', { class: 'card', id: 'piece-notes' }, el('h2', { text: 'Notes' }),
    mine.map(noteEl),
    ta, el('div', { class: 'adder' }, el('button', { class: 'primary', text: 'Add note', onclick: add }), el('span', { class: 'muted small', text: 'Ctrl+Enter' })));
}
// the notes under the piece on show, redrawn without stopping its animation
function refreshNotesCard() { const c = $('#piece-notes'); if (c && A.piece) c.replaceWith(notesCard(piece(A.piece))); else if (!A.piece) renderPage(); }
function noteEl(n) {
  return el('div', { class: 'note' + (n.status === 'done' ? ' done' : '') },
    el('div', { class: 'where', text: `${n.name || n.piece}${n.month ? ' in ' + n.month : ''} · ${n.at}` }),
    el('div', { text: n.text }),
    el('div', { class: 'acts' },
      A.piece !== n.piece && piece(n.piece) ? el('button', { class: 'link', text: 'Go to', onclick: () => go(n.piece) }) : null,
      el('button', { class: 'link', text: n.status === 'done' ? 'Reopen' : 'Done', onclick: async () => { n.status = n.status === 'done' ? 'open' : 'done'; await saveNotes(); refreshNotesCard(); } }),
      el('button', { class: 'link', text: 'Delete', onclick: async () => { if (confirm('Delete this note?')) { A.notes = A.notes.filter(x => x !== n); await saveNotes(); refreshNotesCard(); } } })));
}
function renderNotes() {
  const open = A.notes.filter(n => n.status !== 'done'), done = A.notes.filter(n => n.status === 'done');
  put($('#notes'),
    el('h3', { text: `Art notes (${open.length} open)` }),
    el('div', { class: 'adder' }, el('button', { text: 'Copy as art requests', disabled: !open.length, onclick: copyRequests })),
    open.length ? open.map(noteEl) : el('p', { class: 'muted small', text: 'No notes yet. Open any piece and add one.' }),
    done.length ? el('h3', { text: `Done (${done.length})` }) : null,
    done.map(noteEl));
}
function artRequests() {
  const open = A.notes.filter(n => n.status !== 'done');
  return 'Art notes (docs/art-notes.json):\n\n' + open.map((n, i) => {
    const p = piece(n.piece) || {};
    const where = p.kind === 'place' ? p.file : p.kind === 'character' ? (p.shoppers ? 'js/game.js randomLook()' : `CAST.${p.id}`) : p.kind === 'icon' ? `ICONS.${p.id}` : n.piece;
    return `${i + 1}. ${n.name || n.piece}${n.month ? ` (in ${n.month})` : ''} [${n.piece}, ${where}]\n   ${n.text.replace(/\n/g, '\n   ')}`;
  }).join('\n\n') + '\n';
}
async function copyRequests() {
  const text = artRequests();
  try { await navigator.clipboard.writeText(text); } catch (e) { /* show it instead */ }
  const ta = el('textarea', { class: 'code', readonly: true });
  ta.value = text;
  const d = el('dialog', {}, el('h2', { text: 'Art requests' }),
    el('p', { class: 'muted', text: 'Copied. Paste this into the project chat for the next art pass. The notes are also saved in docs/art-notes.json, so a thread can read them there.' }), ta,
    el('div', { class: 'row' }, el('button', { class: 'primary', text: 'Close', onclick: () => { d.close(); d.remove(); } })));
  document.body.append(d); d.showModal();
}

// ---------------------------------------------------------------- keys, month
$('#month').addEventListener('change', e => { A.month = +e.target.value; go(A.piece); });
document.addEventListener('keydown', e => {
  if (e.target.matches('textarea, input, select') || !A.piece) return;
  const b = [...document.querySelectorAll('.art-nav button')];
  if (e.key === 'ArrowLeft' && b[1] && !b[1].disabled) b[1].click();
  else if (e.key === 'ArrowRight' && b[2] && !b[2].disabled) b[2].click();
  else if (e.key === 'Escape') go(null);
});
start().catch(e => put($('#page'), el('div', { class: 'problems', text: 'The art page couldn\'t start: ' + e.message })));
