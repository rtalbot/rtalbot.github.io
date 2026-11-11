// Pawn Champ story editor (docs/STORY_EDITOR.md). Shows a story written as data (js/stories/,
// docs/STORY_DATA.md) as a readable script, lets you change the words, the choices and the numbers,
// takes notes on any line, checks the story with the game's own checkStory() and saves it back
// through tools/editor.js. The game runs in a hidden frame so the editor knows its characters,
// places and items, and can draw portraits.
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
// replace a node's children; lists are flattened and nothing (null, false) is skipped
const clean = kids => kids.flat(Infinity).filter(k => k !== null && k !== undefined && k !== false);
function put(node, ...kids) { node.replaceChildren(...clean(kids)); return node; }
async function api(method, url, body) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(j.error || r.statusText); e.status = r.status; throw e; }
  return j;
}
const clone = v => JSON.parse(JSON.stringify(v));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const whenText = at => { const [w, d] = String(at).split('-').map(Number); return `Week ${w}, ${DAYS[d - 1] || '?'}`; };
const pretty = id => String(id).replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

// ---------------------------------------------------------------- state
let G = null, INFO = null;           // the game's window, and what it told us
const E = {
  stories: [], id: null, data: null, base: null, notes: [], view: 'overview',
  undo: [], redo: [], dirty: false, problems: [], typingSnap: false
};

// ---------------------------------------------------------------- start
async function start() {
  if (location.protocol === 'file:') {
    put($('#page'), el('div', { class: 'card' }, el('h2', { text: 'Start the editor from its server' }),
      el('p', {}, 'In the game folder, run ', el('code', { text: 'node tools/editor.js' }), ' and open ', el('code', { text: 'http://localhost:8017/editor/' }), '. The server is what saves your changes.')));
    return;
  }
  await new Promise(ok => {
    const f = $('#game');
    // once the whole game has loaded, not just js/storydata.js, so every story's characters are there
    const ready = () => { try { if (f.contentWindow.storyEditorInfo && f.contentWindow.document.readyState === 'complete') return ok(); } catch (e) { /* not yet */ } setTimeout(ready, 100); };
    ready();
  });
  G = $('#game').contentWindow;
  INFO = G.storyEditorInfo();
  INFO.placeNames = await api('GET', '/api/places').catch(() => ({}));
  E.stories = await api('GET', '/api/stories');
  const want = new URLSearchParams(location.search).get('story') || (E.stories[0] && E.stories[0].id);
  if (want) await openStory(want, new URLSearchParams(location.search).get('scene'));
  else renderAll();
}

async function openStory(id, scene) {
  if (E.dirty && !confirm('You have changes that aren\'t saved. Leave them?')) return;
  const s = await api('GET', `/api/stories/${id}`);
  E.id = id; E.data = s.data; E.base = s.text; E.undo = []; E.redo = []; E.dirty = false;
  E.notes = await api('GET', `/api/notes/${id}`);
  E.view = scene && E.data.scenes && E.data.scenes[scene] ? 'scene:' + scene : 'overview';
  history.replaceState(null, '', `?story=${id}${scene ? '&scene=' + scene : ''}`);
  validate();
  renderAll();
}

// ---------------------------------------------------------------- editing, undo
function snapshot() { E.undo.push(JSON.stringify(E.data)); if (E.undo.length > 200) E.undo.shift(); E.redo = []; }
// a change to the structure: snapshot, change, redraw
function change(fn) { snapshot(); fn(); touched(); renderPage(); renderSide(); }
// a change as you type: one snapshot per field you focus, no redraw
function typed() { if (!E.typingSnap) { snapshot(); E.typingSnap = true; } touched(); }
function touched() { E.dirty = true; validateSoon(); status(); }
function undo() { if (!E.undo.length) return; E.redo.push(JSON.stringify(E.data)); E.data = JSON.parse(E.undo.pop()); touched(); renderAll(); }
function redo() { if (!E.redo.length) return; E.undo.push(JSON.stringify(E.data)); E.data = JSON.parse(E.redo.pop()); touched(); renderAll(); }

let validateTimer = null;
function validateSoon() { clearTimeout(validateTimer); validateTimer = setTimeout(() => { validate(); renderNotes(); status(); }, 250); }
function validate() {
  try { E.problems = G.checkStory(clone(E.data)); } catch (e) { E.problems = [`The checker stopped: ${e.message}`]; }
}

async function save() {
  if (!E.data || !E.dirty) return;
  validate();
  if (E.problems.length) { status(); renderNotes(); alert('Fix the problems listed on the right first. A story with problems could break the game.'); return; }
  try {
    const r = await api('PUT', `/api/stories/${E.id}`, { data: E.data, base: E.base });
    E.base = r.text; E.dirty = false;
    status('Saved');
  } catch (e) { alert(e.message); }
}
async function saveNotes() { await api('PUT', `/api/notes/${E.id}`, E.notes); renderNotes(); renderSide(); }

function status(msg) {
  const s = $('#status');
  s.className = 'status';
  if (msg) s.textContent = msg;
  else if (E.problems.length) { s.textContent = `${E.problems.length} problem${E.problems.length > 1 ? 's' : ''}`; s.classList.add('bad'); }
  else if (E.dirty) { s.textContent = 'Not saved'; s.classList.add('dirty'); }
  else s.textContent = E.data ? 'Saved' : '';
  $('#save').disabled = !E.dirty || E.problems.length > 0;
  $('#undo').disabled = !E.undo.length;
  $('#redo').disabled = !E.redo.length;
}

// ---------------------------------------------------------------- little editing widgets
function autosize(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
// a text that depends on a condition, { "if", "then", "else" }: both are shown, to edit either
const isCondText = v => !!v && typeof v === 'object' && !Array.isArray(v);
function condText(t, box) {
  return el('span', { class: 'cond-text' }, el('span', { class: 'badge' }, 'if', condBox(t, 'if')), box(t, 'then'),
    el('span', { class: 'badge hint' }, 'otherwise'), t.else !== undefined ? box(t, 'else') : el('button', { class: 'small', text: '+', title: 'Add what it says otherwise', onclick: () => change(() => { t.else = ''; }) }));
}
// a text box bound to obj[key]
function textBox(obj, key, opts = {}) {
  if (isCondText(obj[key])) return condText(obj[key], textBox);
  const t = el('textarea', { class: 't', rows: 1, placeholder: opts.placeholder || '', spellcheck: true });
  t.value = obj[key] == null ? '' : obj[key];
  t.addEventListener('focus', () => { E.typingSnap = false; });
  t.addEventListener('input', () => { typed(); obj[key] = t.value; autosize(t); });
  requestAnimationFrame(() => autosize(t));
  return t;
}
function lineBox(obj, key, opts = {}) {
  if (isCondText(obj[key])) return condText(obj[key], lineBox);
  const t = el('input', { class: 't', placeholder: opts.placeholder || '' });
  t.value = obj[key] == null ? '' : obj[key];
  t.addEventListener('focus', () => { E.typingSnap = false; });
  t.addEventListener('input', () => { typed(); obj[key] = t.value; });
  return t;
}
function numBox(obj, key) {
  const t = el('input', { class: 'num', type: 'number' });
  t.value = obj[key];
  t.addEventListener('focus', () => { E.typingSnap = false; });
  t.addEventListener('input', () => { if (t.value === '' || isNaN(+t.value)) return; typed(); obj[key] = +t.value; });
  return t;
}
function condBox(obj, key) {
  const t = el('input', { class: 'cond', spellcheck: false, title: 'A condition: flag.mott && coin >= 80 (docs/STORY_DATA.md#conditions)' });
  t.value = obj[key] === true ? 'true' : obj[key] == null ? '' : obj[key];
  t.size = Math.max(6, t.value.length + 1);
  t.addEventListener('focus', () => { E.typingSnap = false; });
  t.addEventListener('input', () => { typed(); obj[key] = t.value === 'true' ? true : t.value; t.size = Math.max(6, t.value.length + 1); });
  return t;
}

// ---------------------------------------------------------------- dialogs
function dialog(title, body, buttons) {
  return new Promise(ok => {
    const d = el('dialog', {}, el('h2', { text: title }), body, el('div', { class: 'row' },
      buttons.map(b => el('button', { class: b.primary ? 'primary' : '', text: b.label, onclick: async () => { const v = b.act ? await b.act() : b.value; if (v === false) return; d.close(); d.remove(); ok(v); } }))));
    d.addEventListener('cancel', () => { d.remove(); ok(null); });
    document.body.append(d);
    d.showModal();
  });
}
// the raw data of one step (or option, or anything), for changes the page has no box for
async function rawEdit(obj, title, replace) {
  const ta = el('textarea', { class: 'code', spellcheck: false });
  ta.value = JSON.stringify(obj, null, 2);
  const err = el('div', { class: 'err' });
  const v = await dialog(title, el('div', {}, el('p', { class: 'muted', text: 'The data behind this, as the story file holds it (docs/STORY_DATA.md).' }), ta, err), [
    { label: 'Cancel', value: null },
    { label: 'Apply', primary: true, act: () => { try { return JSON.parse(ta.value); } catch (e) { err.textContent = 'That isn\'t valid: ' + e.message; return false; } } }]);
  if (v !== null) change(() => replace(v));
}

// ---------------------------------------------------------------- notes
const pathKey = p => p.join('.');
function notesAt(p) { const k = pathKey(p); return E.notes.filter(n => n.path === k && n.status !== 'done'); }
function quoteOf(o) {
  if (!o || typeof o !== 'object') return '';
  const t = o.text || o.narrate || o.label || o.toast || o.line || o.title || '';
  return (Array.isArray(t) ? t[0] : String(t)).slice(0, 120);
}
async function addNote(p, quote, where) {
  const ta = el('textarea', { placeholder: 'What should change? It becomes a fix request.' });
  const v = await dialog('Add a note', el('div', {}, quote ? el('p', { class: 'muted' }, el('i', { text: '“' + quote + '”' })) : null, ta),
    [{ label: 'Cancel', value: null }, { label: 'Add note', primary: true, act: () => ta.value.trim() || false }]);
  if (!v) return;
  E.notes.push({ id: Date.now().toString(36), path: pathKey(p), where, quote, text: v, status: 'open', at: new Date().toISOString().slice(0, 16) });
  await saveNotes();
  renderPage();
}
function noteBubbles(p) {
  const ns = notesAt(p);
  return ns.length ? el('div', {}, ns.map(n => el('div', { class: 'badge hint', title: n.text }, '✎ ' + n.text.slice(0, 60) + (n.text.length > 60 ? '…' : '')))) : null;
}
function fixRequests() {
  const open = E.notes.filter(n => n.status !== 'done');
  return `Story notes for ${E.data.title} (js/stories/${E.id}.js):\n\n` + open.map((n, i) =>
    `${i + 1}. ${n.where || 'General'}${n.quote ? ` — "${n.quote}"` : ''}\n   ${n.text.replace(/\n/g, '\n   ')}\n   (at ${n.path || 'the story'})`).join('\n\n') + '\n';
}

// ---------------------------------------------------------------- the people in a scene
function lookOf(cast) { return (E.data.cast || {})[cast] ? E.data.cast[cast].look : INFO.cast[cast] ? INFO.cast[cast].look : null; }
function nameOf(cast) { return (E.data.cast || {})[cast] ? E.data.cast[cast].name : INFO.cast[cast] ? INFO.cast[cast].name : cast; }
const faceCache = new Map();
function face(look) {
  if (!look) return el('div', { class: 'face' });
  const k = JSON.stringify(look);
  if (!faceCache.has(k)) { try { faceCache.set(k, G.portraitURL(look)); } catch (e) { faceCache.set(k, ''); } }
  return el('img', { class: 'face', src: faceCache.get(k), alt: '' });
}
function sceneActors(name, sc) {
  const m = {};
  if (sc.customer) {
    const b = (E.data.beats || []).find(b => b.scene === name);
    const cast = b ? b.cast : sc.customer;
    m[sc.customer] = { name: nameOf(cast), look: lookOf(cast) };
  }
  const walk = list => (list || []).forEach(s => {
    if (!s || typeof s !== 'object') return;
    if ('then' in s) { walk(s.then); walk(s.else); return; }
    // two actors can share an id, each with its own "if": the line is said by whichever came
    const add = spec => {
      if (!spec || !spec.id) return;
      for (const a of G.storyCrowd(spec)) {
        const was = m[a.id], name = actorName(a);
        m[a.id] = was && spec.if !== undefined && was.name !== name ? { name: `${was.name} or ${name}`, look: was.look } : { name, look: a.cast ? lookOf(a.cast) : null };
      }
    };
    if (s.stage !== undefined) (s.actors || []).forEach(add);
    if (s.enter) add(s.enter);
    if (s.choose) s.choose.forEach(o => walk(o.then));
  });
  walk(sc.steps);
  return m;
}

// ---------------------------------------------------------------- steps as a script
// The step kinds, their fields and how to say them come from the game (STORY_STEPS in
// js/storydata.js, through storyEditorInfo), so a new kind shows up here with nothing to add.
function kindOf(s) { return G.storyKind(s); }
const actorName = a => a.name || (a.cast ? nameOf(a.cast) : a.id);
// an actor, or a crowd ("A ghost ×3")
function actorText(spec) { const n = G.storyCrowd(spec).length; return actorName(spec) + (n > 1 ? ` ×${n}` : ''); }

function renderSteps(list, path, ctx) {
  const box = el('div', { class: 'steps' });
  list.forEach((s, i) => box.append(renderStep(list, i, path.concat(i), ctx)));
  box.append(adder(list, path, ctx));
  return box;
}

function stepTools(list, i, p, ctx, where) {
  const s = list[i];
  return el('div', { class: 'tools' },
    el('button', { title: 'Add a note', text: '✎ Note', onclick: () => addNote(p, quoteOf(s), where) }),
    el('button', { title: 'Move up', text: '↑', disabled: i === 0, onclick: () => change(() => list.splice(i - 1, 0, list.splice(i, 1)[0])) }),
    el('button', { title: 'Move down', text: '↓', disabled: i === list.length - 1, onclick: () => change(() => list.splice(i + 1, 0, list.splice(i, 1)[0])) }),
    el('button', { title: 'See or change the data', text: '{ }', onclick: () => rawEdit(s, 'This step', v => { list[i] = v; }) }),
    el('button', { title: 'Delete', text: '✕', onclick: () => { if (confirm('Delete this?')) change(() => list.splice(i, 1)); } }));
}

function guard(s) {
  if (s.if === undefined || 'then' in s) return null;
  return el('span', { class: 'badge' }, 'only if', condBox(s, 'if'));
}

function renderStep(list, i, p, ctx) {
  const s = list[i];
  const kind = kindOf(s);
  const where = ctx.where + (kind === 'say' ? ` · ${(ctx.actors[s.say] || {}).name || s.say}` : '');
  const wrap = el('div', { class: 'step' + (notesAt(p).length ? ' has-note' : '') });
  wrap.append(stepTools(list, i, p, ctx, where));
  const body = renderBody(s, kind, p, ctx);
  wrap.append(...clean([body, noteBubbles(p)]));
  return wrap;
}

// lines that can be one string or a list: each gets a box, with + and − to add or remove one
function linesEditor(s, key) {
  const arr = Array.isArray(s[key]) ? s[key] : null;
  const rows = (arr || [s[key]]).map((_, j) => el('div', { class: 'text-row' },
    arr ? textBox(arr, j) : textBox(s, key),
    el('span', { class: 'row-tools' },
      el('button', { class: 'small', title: 'Add a line after this one', text: '+', onclick: () => change(() => { const a = Array.isArray(s[key]) ? s[key] : (s[key] = [s[key]]); a.splice(j + 1, 0, ''); }) }),
      arr && arr.length > 1 ? el('button', { class: 'small', title: 'Remove this line', text: '−', onclick: () => change(() => { arr.splice(j, 1); if (arr.length === 1) s[key] = arr[0]; }) }) : null)));
  return el('div', {}, rows);
}

function speakerPicker(s, ctx) {
  const sel = el('select', { class: 'who', title: 'Who says it', onchange: () => change(() => { s.say = sel.value; }) });
  const ids = Object.keys(ctx.actors);
  if (!ids.includes(s.say)) ids.push(s.say);
  for (const id of ids) sel.append(el('option', { value: id, text: (ctx.actors[id] || {}).name || id, selected: id === s.say }));
  return sel;
}

function itemText(spec) {
  if (!spec) return '?';
  if (spec.unique) return ((E.data.uniques || {})[spec.unique] || {}).name || spec.unique;
  return spec.name || pretty(spec.item);
}

function effect(kindLabel, ...kids) { return el('div', { class: 'effect' }, el('span', { class: 'kind', text: kindLabel }), ...kids); }

// A field shown by its type (STORY_TYPES in js/storydata.js): words you can change in a box,
// numbers and conditions in theirs, everything else as words.
function fieldView(s, key, type, ctx) {
  const v = s[key], base = String(type).replace(/[?\[\]]/g, '');
  if (base === 'text') return Array.isArray(v) ? el('div', { style: 'flex:1 1 100%' }, linesEditor(s, key)) : textBox(s, key);
  if (base === 'number') return numBox(s, key);
  if (base === 'cond') return condBox(s, key);
  if (base === 'who' || base === 'look') return (ctx.actors[v] || {}).name || nameOf(v);
  if (base === 'item') return itemText(v);
  if (base === 'scene') return el('button', { class: 'link', text: ((E.data.scenes || {})[v] || {}).title || v, onclick: () => go('scene:' + v) });
  if (base === 'actor') return (Array.isArray(v) ? v : [v]).map((a, i) => [i ? ', ' : '', actorText(a), a.if !== undefined ? el('span', { class: 'badge' }, 'only if', condBox(a, 'if')) : null]);
  if (base === 'any' && v && typeof v === 'object') return anyView(v);
  if (base === 'object') return el('code', { text: Object.entries(v).map(([k, x]) => x === true ? k : x === false ? 'not ' + k : `${k} = ${Array.isArray(x) ? x.join('/') : JSON.stringify(x)}`).join(', ') });
  return typeof v === 'string' ? pretty(v) : JSON.stringify(v);
}
// Anything else made of fields (what a hook is given, "with"): every line in it gets a box, every
// number its own, named by its key, so words a hook says are in the editor like any other line. A
// single word is a name (an item's id) and stays as it is.
function anyView(v) {
  const entries = Array.isArray(v) ? v.map((x, i) => [i, x]) : Object.entries(v);
  return el('div', { class: 'anyview' }, entries.map(([k, x]) => el('div', { class: 'anyrow' },
    Array.isArray(v) ? null : el('span', { class: 'anykey', text: pretty(k) }),
    typeof x === 'string' && /\s/.test(x) ? textBox(v, k) : typeof x === 'string' ? el('code', { text: x }) : typeof x === 'number' ? numBox(v, k)
      : x && typeof x === 'object' ? anyView(x) : el('code', { text: JSON.stringify(x) }))));
}
// a step's sentence (its "says" in STORY_STEPS): {key} shows a field, {?key} nothing, and a part in
// [brackets] only when every key in it has a value
function sentence(tpl, s, kind, ctx) {
  const types = INFO.steps[kind].fields;
  const there = k => s[k] !== undefined && s[k] !== false;
  return [...tpl.matchAll(/\[([^\]]*)\]|\{(\??)(\w+)\}|[^[{]+/g)].map(m =>
    m[1] !== undefined ? ([...m[1].matchAll(/\{\??(\w+)\}/g)].every(k => there(k[1])) ? sentence(m[1], s, kind, ctx) : null)
      : m[3] ? (m[2] ? null : fieldView(s, m[3], types[m[3]], ctx))
        : m[0]);
}

// Most steps are a label and a sentence. These read better laid out as a script.
const SCRIPT_STEPS = {
  say(s, p, ctx) {
    const a = ctx.actors[s.say] || {};
    return el('div', { class: 'line' }, face(a.look), el('div', {}, el('div', { class: 'who' }, speakerPicker(s, ctx), ' ', guard(s)), linesEditor(s, 'text')));
  },
  narrate: s => el('div', { class: 'line narrate' }, el('div', {}, guard(s), linesEditor(s, 'narrate'))),
  line: s => el('div', { class: 'line epilogue' }, el('div', {}, guard(s), el('div', { class: 'text-row' }, textBox(s, 'line')))),
  choose: (s, p, ctx) => el('div', { class: 'choice' }, el('div', { class: 'label' }, 'The player chooses ', guard(s)),
    s.choose.map((o, j) => renderOption(s.choose, j, p.concat('choose', j), ctx)),
    el('div', { class: 'adder' }, el('button', { text: '+ Option', onclick: () => change(() => s.choose.push({ label: 'A new choice', then: [] })) }))),
  if: (s, p, ctx) => el('div', { class: 'ifblock' },
    el('div', { class: 'ifhead' }, 'If', condBox(s, 'if')),
    el('div', { class: 'branch' }, renderSteps(s.then, p.concat('then'), ctx)),
    s.else ? el('div', {}, el('div', { class: 'ifhead' }, 'Otherwise'), el('div', { class: 'branch' }, renderSteps(s.else, p.concat('else'), ctx)))
      : el('div', { class: 'adder' }, el('button', { text: '+ Otherwise', onclick: () => change(() => { s.else = []; }) }))),
  stage(s, p, ctx) {
    const v = s.view ? Object.entries(s.view).map(([k, x]) => `${pretty(k)}: ${x}`).join(', ') : '';
    const names = (s.actors || []).map(actorText);
    return el('div', { class: 'stage' }, '📍 ', pretty(s.stage), v ? el('span', { class: 'who', text: `(${v})` }) : null, el('span', { class: 'who', text: names.length ? 'with ' + names.join(', ') : '' }), guard(s));
  }
};

function renderBody(s, kind, p, ctx) {
  if (SCRIPT_STEPS[kind]) return SCRIPT_STEPS[kind](s, p, ctx);
  const def = INFO.steps[kind];
  if (!def) return effect('?', el('code', { text: JSON.stringify(s) }));
  return effect(def.says[0], sentence(def.says[1], s, kind, ctx), guard(s));
}

function renderOption(opts, j, p, ctx) {
  const o = opts[j];
  if (!o.then) o.then = [];
  const head = el('div', { class: 'option-head' }, el('span', { class: 'num', text: `${j + 1}.` }), textBox(o, 'label'),
    o.if !== undefined ? el('span', { class: 'badge' }, 'only offered if', condBox(o, 'if')) : null,
    o.disabled !== undefined ? el('span', { class: 'badge' }, 'greyed out when', condBox(o, 'disabled')) : null,
    o.needs ? el('span', { class: 'badge' }, `needs something to ${o.needs} from the bag`) : null,
    o.hint !== undefined ? el('span', { class: 'badge hint' }, 'hint ', lineBox(o, 'hint')) : null);
  const off = o.off ? el('div', { class: 'option-head muted' }, el('span', { class: 'num', text: '' }), 'when greyed out:', lineBox(o.off, 'label'), o.off.hint !== undefined ? lineBox(o.off, 'hint') : null) : null;
  const tools = el('div', { class: 'tools' },
    el('button', { text: '✎ Note', onclick: () => addNote(p, o.label, ctx.where + ' · choice ' + (j + 1)) }),
    el('button', { text: '↑', disabled: j === 0, onclick: () => change(() => opts.splice(j - 1, 0, opts.splice(j, 1)[0])) }),
    el('button', { text: '↓', disabled: j === opts.length - 1, onclick: () => change(() => opts.splice(j + 1, 0, opts.splice(j, 1)[0])) }),
    el('button', { text: '{ }', onclick: () => rawEdit(o, 'This choice', v => { opts[j] = v; }) }),
    el('button', { text: '✕', disabled: opts.length < 2, onclick: () => { if (confirm('Delete this choice and what follows it?')) change(() => opts.splice(j, 1)); } }));
  return el('div', { class: 'option step' + (notesAt(p).length ? ' has-note' : '') }, tools, head, off, noteBubbles(p),
    el('div', { class: 'branch' }, o.then.length ? null : el('div', { class: 'branch-empty', text: 'Nothing else happens.' }), renderSteps(o.then, p.concat('then'), ctx)));
}

function adder(list, path, ctx) {
  const lastSpeaker = [...list].reverse().find(s => s && s.say);
  const speaker = lastSpeaker ? lastSpeaker.say : Object.keys(ctx.actors)[0];
  const add = kind => change(() => list.push(clone(INFO.steps[kind].example)));
  // any other kind, from the game's own list
  const other = el('select', { title: 'Add another kind of step', onchange: () => { if (other.value) add(other.value); } },
    el('option', { value: '', text: '+ Other…' }),
    Object.entries(INFO.steps).filter(([, d]) => !ctx.lines || d.instant).map(([k, d]) => el('option', { value: k, text: `${d.says[0]} (${k})` })));
  return el('div', { class: 'adder' },
    ctx.lines ? el('button', { text: '+ Ending line', onclick: () => add('line') }) : null,
    !ctx.lines && speaker ? el('button', { text: '+ Line', onclick: () => change(() => list.push({ say: speaker, text: '' })) }) : null,
    !ctx.lines ? el('button', { text: '+ Narration', onclick: () => add('narrate') }) : null,
    !ctx.lines ? el('button', { text: '+ Choice', onclick: () => add('choose') }) : null,
    el('button', { text: '+ If', onclick: () => add('if') }),
    other);
}

// ---------------------------------------------------------------- pages
function go(view) { E.view = view; history.replaceState(null, '', `?story=${E.id}${view.startsWith('scene:') ? '&scene=' + view.slice(6) : ''}`); renderPage(); renderSide(); $('#page').scrollTop = 0; }

function renderAll() { renderSide(); renderPage(); renderNotes(); status(); }

function renderSide() {
  const side = $('#side');
  const d = E.data;
  const count = prefix => E.notes.filter(n => n.status !== 'done' && (n.path || '').startsWith(prefix)).length;
  const item = (view, label, sub, prefix) => el('button', { class: 'nav-item' + (E.view === view ? ' on' : ''), onclick: () => go(view) },
    prefix && count(prefix) ? el('span', { class: 'count', text: count(prefix) }) : null, label, sub ? el('span', { class: 'sub', text: sub }) : null);
  put(side, 
    el('h3', { text: 'Stories' }),
    el('select', { style: 'width:100%', onchange: e => openStory(e.target.value) },
      E.stories.map(s => el('option', { value: s.id, text: s.title, selected: s.id === E.id }))),
    el('div', { class: 'adder' }, el('button', { text: '+ New story', onclick: newStory })),
    d ? [
      el('h3', { text: 'About' }),
      item('read', 'Read it as a story', 'the whole story, start to end'),
      item('overview', 'The story', 'title, summary, rumour, endings'),
      item('people', 'People and things', 'characters, items'),
      item('when', 'When it happens', 'visits, nights, calendar'),
      el('h3', { text: 'Scenes' }),
      Object.entries(d.scenes || {}).map(([name, sc]) => item('scene:' + name, sc.title || name, name, 'scenes.' + name + '.')),
      el('div', { class: 'adder' }, el('button', { text: '+ New scene', onclick: newScene })),
      el('h3', { text: 'Around the story' }),
      item('mornings', 'Mornings', 'what happens at the start of a day', 'mornings'),
      d.afterwards ? item('afterwards', 'Afterwards', 'every morning of every run, drawn or not', 'afterwards') : null,
      d.sold ? item('sold', 'When sold', 'what selling one of its items does', 'sold') : null,
      item('epilogue', 'Epilogue', 'lines at the end of the month', 'epilogue')
    ] : null);
}

function renderPage() {
  const page = $('#page');
  const d = E.data;
  if (!d) { put(page, el('p', { class: 'muted', text: 'No story open.' })); return; }
  $('#story-title').textContent = `${d.title} · js/stories/${E.id}.js`;
  const v = E.view;
  if (v.startsWith('scene:')) return put(page, ...scenePage(v.slice(6)));
  if (v === 'people') return put(page, ...peoplePage());
  if (v === 'read') return put(page, readPage());
  if (v === 'when') return put(page, ...whenPage());
  if (v === 'sold') {
    const ctx = { actors: {}, where: 'When sold' };
    return put(page, el('h1', { text: 'When sold' }),
      el('p', { class: 'scene-meta', text: 'When one of these items is sold, however it goes (off the shelf, to a story customer, to the ghosts), its steps run at once. They call the item "it", and how it went "how".' }),
      Object.entries(d.sold || {}).map(([u, steps]) => [
        el('h2', { text: ((d.uniques || {})[u] || {}).name || u }),
        renderSteps(steps, ['sold', u], ctx)]));
  }
  if (v === 'mornings' || v === 'epilogue' || v === 'afterwards') {
    if (!d[v]) d[v] = [];
    const head = { mornings: 'Mornings', epilogue: 'Epilogue', afterwards: 'Afterwards' }[v];
    const ctx = { actors: {}, where: head, lines: v === 'epilogue' };
    return put(page, el('h1', { text: head }),
      el('p', { class: 'scene-meta', text: {
        mornings: 'These run at the start of every day while the story is in the run. Most are guarded by a week and day.',
        epilogue: 'At the end of the month, each line whose condition holds is added to the ending.',
        afterwards: 'These run at the start of every day of every run, whether the story was drawn or not: what it leaves behind in later months. Keep them to checks on this story\'s own flags and items.' }[v] }),
      renderSteps(d[v], [v], ctx));
  }
  put(page, ...overviewPage());
}

function scenePage(name) {
  const d = E.data, sc = d.scenes[name];
  if (!sc) return [el('p', { text: 'No such scene.' })];
  const ctx = { actors: sceneActors(name, sc), where: sc.title || name };
  const uses = [...(d.beats || []).filter(b => b.scene === name || JSON.stringify(b.steps || []).includes(`"run":"${name}"`)).map(b => b.drift ? `${whenText(b.from)} to ${whenText(b.to)}, at the counter` : b.every ? `every day from ${whenText(b.from)} to ${whenText(b.to)}, at the counter` : b.scene ? `${whenText(b.at)}, at the counter` : `${whenText(b.at)}, at night`),
    ...(d.errands || []).filter(n => n.scene === name).map(n => `an errand: ${n.title}`),
    ...(d.calendar || []).filter(e => e.scene === name).map(e => `calendar: ${e.title}`), ...(d.nights || []).filter(n => n.scene === name).map(n => `a night between ${whenText(n.window[0])} and ${whenText(n.window[1])}`),
    ...(d.hub && (d.hub.open === name || d.hub.close === name) ? [`${d.hub.open === name ? 'opens' : 'closes'} the evening: ${d.hub.title}`] : []),
    ...(d.vignettes || []).filter(v => v.scene === name).map(v => `part of an evening (${v.hub}): ${v.label}`),
    ...(d.cues || []).filter(c => c.scene === name).map(c => `inside another story's scene, on its "${c.cue}" cue`)];
  const title = el('input', { 'aria-label': 'Scene title' });
  title.value = sc.title || '';
  title.placeholder = name;
  title.addEventListener('focus', () => { E.typingSnap = false; });
  title.addEventListener('input', () => { typed(); sc.title = title.value; });
  title.addEventListener('change', renderSide);
  return [
    el('h1', {}, title),
    el('div', { class: 'scene-meta' }, el('code', { text: name }), sc.music ? el('span', { text: '♪ ' + sc.music }) : null,
      uses.length ? el('span', { text: uses.join(' · ') }) : el('span', { text: 'played from another scene' }),
      el('button', { text: '▶ Play this scene', onclick: () => playScene(name) }),
      el('button', { text: '✎ Note on the scene', onclick: () => addNote(['scenes', name], '', sc.title || name) })),
    noteBubbles(['scenes', name]),
    renderSteps(sc.steps, ['scenes', name, 'steps'], ctx)
  ];
}

function overviewPage() {
  const d = E.data;
  const ends = Object.keys(d.endings || {});
  return [
    el('h1', { text: d.title }),
    el('div', { class: 'scene-meta' }, el('code', { text: d.id }), el('span', { text: `${d.kind}${d.family ? ' · ' + d.family : ''}` }),
      el('button', { text: '✎ Note on the story', onclick: () => addNote([], '', 'The story') })),
    el('div', { class: 'card' }, el('h2', { text: 'The story' }),
      el('div', { class: 'field' }, el('span', { text: 'Title' }), lineBox(d, 'title')),
      el('div', { class: 'field' }, el('span', { text: 'What it\'s about' }), aboutBox(d)),
      el('div', { class: 'field' }, el('span', { text: 'Rumour' }), textBox(d, 'rumour')),
      d.teaser !== undefined ? el('div', { class: 'field' }, el('span', { text: 'Teaser' }), textBox(d, 'teaser')) : null,
      d.arc ? el('div', { class: 'field' }, el('span', { text: 'Long arc' }), el('div', { class: 'muted' }, `a chapter of "${d.arc}"${d.after ? `, after ${d.after.join(' or ')}` : ''}${d.code ? ` · shares its code half, js/quests/${d.code}.js` : ''}`)) : null,
      el('div', { class: 'field' }, el('span', { text: 'Writer\'s notes' }), textBox(d, 'notes', { placeholder: 'Anything a writer should know. The game ignores it.' }))),
    el('div', { class: 'card' }, el('h2', { text: 'Endings' }),
      ends.map(k => el('div', { class: 'field' }, el('span', { class: 'mono', text: k }), lineBox(d.endings, k))),
      el('h2', { style: 'margin-top:12px', text: 'Which ending: the first that holds' }),
      typeof d.outcome === 'string' ? el('div', { class: 'field' }, el('span', { text: 'The ending named by' }), el('div', {}, condBox(d, 'outcome')))
        : (d.outcome || []).map(o => el('div', { class: 'field' }, el('span', { text: d.endings[o.ending] || o.ending }), el('div', {}, 'if ', condBox(o, 'if'))))),
    d.talk ? el('div', { class: 'card' }, el('h2', { text: `What the town says (${nameOf(d.talk.by)})` }),
      d.talk.rumour.map((_, j) => el('div', { class: 'field' }, el('span', { text: j ? '' : 'Before it starts' }), textBox(d.talk.rumour, j))),
      typeof d.talk.react === 'string' ? el('div', { class: 'field' }, el('span', { text: 'After' }), textBox(d.talk, 'react'))
        : Object.keys(d.talk.react || {}).map(k => el('div', { class: 'field' }, el('span', { text: 'After ' + ((d.endings || {})[k] || k) }), textBox(d.talk.react, k)))) : null,
    el('div', { class: 'card' }, el('h2', { text: 'Scenes' }),
      Object.entries(d.scenes || {}).map(([n, sc]) => el('div', {}, el('button', { class: 'link', text: sc.title || n, onclick: () => go('scene:' + n) }))))
  ];
}

// the summary: paragraphs, one per blank line; §{sceneName} links a scene in the narrative
function aboutBox(d) {
  const t = el('textarea', { class: 't', rows: 3, spellcheck: true, placeholder: 'What the story is about, how it unfolds, its turning choices and what each ending means. A blank line starts a paragraph; §{sceneName} points to a scene.' });
  t.value = (Array.isArray(d.about) ? d.about : d.about ? [d.about] : []).join('\n\n');
  t.addEventListener('focus', () => { E.typingSnap = false; });
  t.addEventListener('input', () => {
    typed();
    const ps = t.value.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
    if (ps.length) d.about = ps; else delete d.about;
    autosize(t);
  });
  requestAnimationFrame(() => autosize(t));
  return t;
}

// the story told start to end (tools/narrative.js, docs/NARRATIVES.md): to read, not to edit
function readPage() {
  const names = INFO.names || {};
  const place = id => INFO.placeNames[id] || INFO.placeNames[Object.keys(INFO.placeNames).filter(b => id.startsWith(b) && /^[A-Z]/.test(id.slice(b.length))).sort((a, b) => b.length - a.length)[0]];
  const look = { cast: id => (INFO.cast[id] || {}).name, quest: id => (names.quests || {})[id], hub: id => (names.hubs || {})[id], item: k => (names.items || {})[k], place };
  const box = el('div', { class: 'read' });
  try { box.innerHTML = narrativeHTML(storyNarrative(E.data, look)); }
  catch (e) { box.textContent = 'The narrative couldn\'t be made: ' + e.message; }
  box.addEventListener('click', e => {
    const edit = e.target.closest('[data-scene]');
    if (edit) { go('scene:' + edit.dataset.scene); return; }
    const a = e.target.closest('a[data-sec]');
    if (a) { e.preventDefault(); const to = box.querySelector('#' + a.dataset.sec); if (to) to.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
  return box;
}

function peoplePage() {
  const d = E.data;
  return [
    el('h1', { text: 'People and things' }),
    el('div', { class: 'card' }, el('h2', { text: 'Characters this story adds' }),
      Object.entries(d.cast || {}).map(([id, c]) => el('div', { class: 'person' }, face(c.look), lineBox(c, 'name'), el('code', { class: 'muted', text: id }))),
      el('p', { class: 'muted', text: 'Changing how someone looks is easiest in the data ({ }) for now. Character ids are shared by every story: check docs/catalogue/CHARACTERS.md before adding one.' }),
      el('div', { class: 'adder' }, el('button', { text: '+ Character', onclick: () => rawEdit({ id: 'newPerson', name: 'A new person', look: { skin: '#e8c8b0', hair: '#5a4a3a', hs: 0, coat: '#4a5a6a', pants: '#3a3a40' } }, 'A new character', v => { d.cast = d.cast || {}; const { id, ...c } = v; d.cast[id] = c; }) }))),
    el('div', { class: 'card' }, el('h2', { text: 'Unique items' }),
      Object.entries(d.uniques || {}).map(([id, u]) => el('div', { style: 'margin:10px 0' },
        el('div', { class: 'field' }, el('span', { class: 'mono', text: id }), lineBox(u, 'name')),
        el('div', { class: 'field' }, el('span', { text: 'Guide price' }), el('div', { class: 'effect' }, '$', numBox(u, 'guide'))),
        (u.tells || []).map((_, j) => el('div', { class: 'field' }, el('span', { text: j ? '' : 'What you notice' }), textBox(u.tells, j))))),
      el('div', { class: 'adder' }, el('button', { text: '+ Item', onclick: () => rawEdit({ id: 'newThing', name: 'A new thing', icon: 'curio', cat: 'curio', guide: 40, tells: ['What you notice about it.'] }, 'A new unique item', v => { d.uniques = d.uniques || {}; const { id, ...u } = v; d.uniques[id] = u; }) }))),
    // things to click in the story's places (docs/STORY_DATA.md#scene-spots): a line per click, and a find
    d.spots ? el('div', { class: 'card' }, el('h2', { text: 'Things to click in its places' }),
      Object.entries(d.spots).map(([place, list]) => el('div', { style: 'margin:10px 0' }, el('h3', { class: 'mono', text: place }),
        list.map(sp => el('div', { style: 'margin:8px 0' },
          (sp.lines || []).map((_, j) => el('div', { class: 'field' }, el('span', { class: j ? '' : 'mono', text: j ? '' : sp.id }), textBox(sp.lines, j))),
          sp.find ? el('div', { class: 'field' }, el('span', { text: `Found on click ${(sp.find.on || 0) + 1}` }), textBox(sp.find, 'line')) : null))))) : null
  ];
}

function whenPage() {
  const d = E.data;
  const sceneLink = n => el('button', { class: 'link', text: ((d.scenes || {})[n] || {}).title || n, onclick: () => go('scene:' + n) });
  return [
    el('h1', { text: 'When it happens' }),
    el('div', { class: 'card' }, el('h2', { text: 'Visits and fixed nights' }),
      (d.beats || []).slice().sort((a, b) => (a.at || a.from).localeCompare(b.at || b.from)).map(b => el('div', { class: 'field' }, el('span', { text: b.drift || b.every ? `${whenText(b.from)} to ${whenText(b.to)}` : whenText(b.at) }),
        b.drift || b.every ? el('div', {}, `${nameOf(b.cast)} comes to the counter ${b.every ? 'every day' : 'one day'} in that time${b.if !== undefined ? ', if ' : ''}`, b.if !== undefined ? condBox(b, 'if') : null, ': ', sceneLink(b.scene))
        : b.scene ? el('div', {}, `${nameOf(b.cast)} comes to the counter: `, sceneLink(b.scene), b.last ? el('span', { class: 'muted', text: ' (last of the day)' }) : null)
          : el('div', {}, 'At night, if ', condBox(b, 'if'), ': ', (b.steps || []).map(s => s.run ? el('span', {}, sceneLink(s.run), s.if ? el('span', { class: 'muted', text: ` (if ${s.if}) ` }) : ' ') : null)),
      ))),
    el('div', { class: 'card' }, el('h2', { text: 'Nights the run places' }),
      (d.nights || []).map(n => el('div', { class: 'field' }, el('span', { class: 'mono', text: n.id }), el('div', {}, `between ${whenText(n.window[0])} and ${whenText(n.window[1])}, if `, condBox(n, 'if'), ': ', sceneLink(n.scene))))),
    d.errands ? el('div', { class: 'card' }, el('h2', { text: 'Errands (trips out by day, planned by a "plan" step)' }),
      d.errands.map(n => el('div', { class: 'field' }, el('span', { class: 'mono', text: n.id }), el('div', {}, lineBox(n, 'title'), lineBox(n, 'where'), sceneLink(n.scene))))) : null,
    d.hub ? el('div', { class: 'card' }, el('h2', { text: 'An evening other stories join (a hub)' }),
      el('div', { class: 'field' }, el('span', { class: 'mono', text: d.hub.id }), el('div', {}, lineBox(d.hub, 'title'), lineBox(d.hub, 'where'))),
      el('div', { class: 'field' }, el('span', { text: 'When' }), el('div', {}, `a night between ${whenText(d.hub.window[0])} and ${whenText(d.hub.window[1])}; ${d.hub.picks || 2} things to see`,
        d.hub.town ? el('span', { class: 'muted', text: ' (the town\'s: it happens whenever a story with a part in it is drawn)' }) : null)),
      el('div', { class: 'field' }, el('span', { text: 'Scenes' }), el('div', {}, d.hub.open ? el('span', {}, 'opens with ', sceneLink(d.hub.open)) : null, d.hub.close ? el('span', {}, ' · closes with ', sceneLink(d.hub.close)) : null))) : null,
    d.cues ? el('div', { class: 'card' }, el('h2', { text: 'Inside other stories\' scenes (cues)' }),
      d.cues.map(c => el('div', { class: 'field' }, el('span', { class: 'mono', text: c.cue }), el('div', {}, 'when that story is drawn too, at its cue, if ', condBox(c, 'if'), ': ', sceneLink(c.scene),
        c.note ? el('span', { class: 'muted', text: ` (${c.note})` }) : null)))) : null,
    d.vignettes ? el('div', { class: 'card' }, el('h2', { text: 'Parts in evenings (vignettes: the player picks a few)' }),
      d.vignettes.map(v => el('div', { class: 'field' }, el('span', { class: 'mono', text: v.hub }), el('div', {}, lineBox(v, 'label'), ' if ', condBox(v, 'if'), ': ', sceneLink(v.scene),
        v.crossing ? el('span', { class: 'muted', text: ' (only if the evening is on for another story)' }) : null)))) : null,
    el('div', { class: 'card' }, el('h2', { text: 'Calendar' }),
      (d.calendar || []).map(e => el('div', { style: 'margin:8px 0' },
        el('div', { class: 'field' }, el('span', { text: e.week ? `${whenText(e.week + '-' + e.days[0])}${e.days.length > 1 ? ' on' : ''}${e.night ? ', night' : ''}` : e.errand ? `errand: ${e.errand}` : `night: ${e.night === true ? '' : e.placed || e.night}` }), lineBox(e, 'title')),
        el('div', { class: 'field' }, el('span', { text: 'Where' }), lineBox(e, 'where')),
        el('div', { class: 'field' }, el('span', { text: 'On the calendar once' }), el('div', {}, condBox(e, 'known'), e.scene ? el('span', {}, ' · ', sceneLink(e.scene)) : null)))))
  ];
}

// ---------------------------------------------------------------- notes and problems panel
function renderNotes() {
  const box = $('#notes');
  if (!E.data) { put(box, ); return; }
  const open = E.notes.filter(n => n.status !== 'done'), done = E.notes.filter(n => n.status === 'done');
  const jump = n => {
    const parts = (n.path || '').split('.');
    if (parts[0] === 'scenes' && parts[1]) go('scene:' + parts[1]);
    else if (parts[0] === 'mornings' || parts[0] === 'epilogue' || parts[0] === 'sold' || parts[0] === 'afterwards') go(parts[0]);
    else go('overview');
  };
  const noteEl = n => el('div', { class: 'note' + (n.status === 'done' ? ' done' : '') },
    el('div', { class: 'where', text: `${n.where || 'The story'} · ${n.at}` }), n.quote ? el('div', { class: 'quote', text: '“' + n.quote + '”' }) : null,
    el('div', { text: n.text }),
    el('div', { class: 'acts' },
      el('button', { class: 'link', text: 'Go to', onclick: () => jump(n) }),
      el('button', { class: 'link', text: n.status === 'done' ? 'Reopen' : 'Done', onclick: () => { n.status = n.status === 'done' ? 'open' : 'done'; saveNotes(); renderPage(); } }),
      el('button', { class: 'link', text: 'Delete', onclick: () => { if (confirm('Delete this note?')) { E.notes = E.notes.filter(x => x !== n); saveNotes(); renderPage(); } } })));
  put(box, 
    el('h3', { text: 'Checks' }),
    E.problems.length ? el('div', { class: 'problems' }, `${E.problems.length} problem${E.problems.length > 1 ? 's' : ''} to fix before saving:`, el('ul', {}, E.problems.map(p => el('li', { text: p.replace(/^\w+: /, '') }))))
      : el('div', { class: 'ok-box', text: 'The story checks out.' }),
    el('h3', { text: `Notes (${open.length} open)` }),
    el('div', { class: 'adder' },
      el('button', { text: '+ General note', onclick: () => addNote([], '', 'The story') }),
      el('button', { text: 'Copy as fix requests', disabled: !open.length, onclick: copyFixes })),
    open.map(noteEl),
    done.length ? el('h3', { text: `Done (${done.length})` }) : null,
    done.map(noteEl));
}
async function copyFixes() {
  const text = fixRequests();
  try { await navigator.clipboard.writeText(text); } catch (e) { /* show it instead */ }
  const ta = el('textarea', { class: 'code', readonly: true });
  ta.value = text;
  await dialog('Fix requests', el('div', {}, el('p', { class: 'muted', text: 'Copied. Paste this into the project chat and Claude will make the changes. The notes are also saved in docs/story-notes/, so a thread can read them there.' }), ta), [{ label: 'Close', primary: true, value: true }]);
}

// ---------------------------------------------------------------- new things, playing
async function newStory() {
  const id = el('input', { placeholder: 'lantern' }), title = el('input', { placeholder: 'The Lantern' });
  const kind = el('select', {}, el('option', { value: 'minor', text: 'Minor' }), el('option', { value: 'major', text: 'Major' }));
  const err = el('div', { class: 'err' });
  const v = await dialog('A new story', el('div', {}, el('label', { text: 'Id (short, letters only; it names the file)' }), id, el('label', { text: 'Title' }), title, el('label', { text: 'Kind' }), kind, err,
    el('p', { class: 'muted', text: 'This makes js/stories/<id>.js with one scene and adds it to the game. Give it a visit in "When it happens" so it plays.' })), [
    { label: 'Cancel', value: null },
    { label: 'Create', primary: true, act: async () => { try { await api('POST', '/api/stories', { id: id.value.trim(), title: title.value.trim(), kind: kind.value }); return id.value.trim(); } catch (e) { err.textContent = e.message; return false; } } }]);
  if (!v) return;
  E.stories = await api('GET', '/api/stories');
  $('#game').contentWindow.location.reload(); // the game now loads the new file
  await new Promise(ok => { const f = $('#game'); f.addEventListener('load', ok, { once: true }); });
  await new Promise(ok => { const t = () => { try { if (f().storyEditorInfo) return ok(); } catch (e) { /* loading */ } setTimeout(t, 100); }; const f = () => $('#game').contentWindow; t(); });
  G = $('#game').contentWindow; INFO = G.storyEditorInfo();
  E.dirty = false;
  await openStory(v);
}
async function newScene() {
  const id = el('input', { placeholder: 'atTheDocks' }), title = el('input', { placeholder: 'Meeting at the docks' });
  const err = el('div', { class: 'err' });
  const v = await dialog('A new scene', el('div', {}, el('label', { text: 'Name (letters only; other scenes and the calendar use it)' }), id, el('label', { text: 'Title' }), title, err), [
    { label: 'Cancel', value: null },
    { label: 'Create', primary: true, act: () => { const n = id.value.trim(); if (!/^[a-z][a-zA-Z0-9]*$/.test(n)) { err.textContent = 'Letters and digits, starting with a small letter.'; return false; } if (E.data.scenes[n] || INFO.scenes.includes(n)) { err.textContent = 'That name is taken.'; return false; } return n; } }]);
  if (!v) return;
  change(() => { E.data.scenes[v] = { title: title.value.trim() || v, steps: [{ narrate: '' }] }; });
  go('scene:' + v);
}
async function playScene(name) {
  const flags = [...new Set((JSON.stringify(E.data).match(/flag\.\w+/g) || []).map(f => f.slice(5)))].sort();
  const boxes = flags.map(f => el('label', {}, el('input', { type: 'checkbox', value: f }), f));
  const full = el('input', { type: 'checkbox' });
  const v = await dialog('Play this scene', el('div', {},
    E.dirty ? el('p', { class: 'err', text: 'You have changes that aren\'t saved. The game plays what is saved, so Play saves first.' }) : null,
    el('p', { class: 'muted', text: 'The game opens in a new tab and plays just this scene, in a throwaway game (your save is untouched). Tick anything that has already happened:' }),
    el('div', { class: 'flags' }, boxes),
    el('label', {}, full, ' A full shop, with the bag packed')), [
    { label: 'Cancel', value: null }, { label: 'Play', primary: true, value: true }]);
  if (!v) return;
  if (E.dirty) { await save(); if (E.dirty) return; }
  const on = boxes.map(b => b.querySelector('input')).filter(i => i.checked).map(i => i.value);
  window.open(`../index.html?story=${E.id}&scene=${name}${on.length ? '&flags=' + on.join(',') : ''}${full.checked ? '&shop=full' : ''}`, '_blank');
}

// ---------------------------------------------------------------- keys
$('#save').addEventListener('click', save);
$('#undo').addEventListener('click', undo);
$('#redo').addEventListener('click', redo);
document.addEventListener('keydown', e => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
  else if (mod && e.key.toLowerCase() === 'z' && !e.target.matches('textarea, input')) { e.preventDefault(); e.shiftKey ? redo() : undo(); }
});
window.addEventListener('beforeunload', e => { if (E.dirty) { e.preventDefault(); e.returnValue = ''; } });
start().catch(e => put($('#page'), el('div', { class: 'problems', text: 'The editor couldn\'t start: ' + e.message })));
