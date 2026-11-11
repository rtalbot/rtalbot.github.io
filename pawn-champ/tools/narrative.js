// Turns a story file's data (js/stories/<id>.js) into a narrative a person can read from start to
// finish, like a gamebook: numbered sections in the order the month plays them, the lines and
// choices as prose, each choice's consequences under it, and the game's effects (flags, money,
// items) as small notes. It's for understanding a story before editing it; the data stays the
// source of truth. See docs/NARRATIVES.md.
// No dependencies, so the story editor (editor/) and the doc builder (tools/narratives.js) share it:
//   storyNarrative(data, look)  the narrative as a plain object (sections of blocks)
//   narrativeMarkdown(doc)      as Markdown, for docs/narratives/<id>.md
//   narrativeHTML(doc)          as HTML, for the editor's "Read it as a story" page
// `look` is what the data alone can't say: { cast(id), place(id), quest(id), hub(id), item(key) },
// each returning a name or nothing.
'use strict';

const NARRATIVE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const NARRATIVE_MONTHS = { 1: 'October', 2: 'November', 3: 'December', 4: 'January', 5: 'February', 6: 'March' };

// ---------------------------------------------------------------- small words
// Inline text is a tiny Markdown: `code`, **bold**, *italic*, [§3](#s3), and backslash escapes.
const nEsc = s => String(s).replace(/([\\`*_[\]<>#|])/g, '\\$1');
const nWhen = at => { const [w, d] = String(at).split('-').map(Number); return `week ${w}, ${NARRATIVE_DAYS[d - 1] || '?'}`; };
const nCap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const nPretty = id => String(id).replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/[-_]/g, ' ').toLowerCase();
const nList = xs => xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

function storyNarrative(d, look = {}) {
  const L = {
    cast: id => (d.cast && d.cast[id] && d.cast[id].name) || (look.cast && look.cast(id)) || nCap(nPretty(id)),
    place: id => (look.place && look.place(id)) || nCap(nPretty(id)),
    quest: id => id === d.id ? d.title : (look.quest && look.quest(id)) || nCap(nPretty(id)),
    hub: id => (d.hub && d.hub.id === id && d.hub.title) || (look.hub && look.hub(id)) || nCap(nPretty(id)),
    item: key => (look.item && look.item(key)) || nPretty(key)
  };
  const scenes = d.scenes || {};
  const sec = {};          // scene name -> its section
  const order = [];        // scene names, in reading order

  // ---- when each scene plays, and a sort key ("week-day-slot") to put them in the order of the month
  const when = {}, key = {};
  const addWhen = (name, text, k, cond) => {
    if (!scenes[name]) return;
    (when[name] = when[name] || []).push(cond ? `${text}, if ${condText(cond, {})}` : text);
    if (k !== undefined && (key[name] === undefined || k < key[name])) key[name] = k;
  };
  const visits = {};
  const k = (at, slot) => { const [w, dd] = String(at).split('-').map(Number); return w * 100 + dd * 10 + slot; };
  for (const b of d.beats || []) {
    if (b.night) for (const s of b.steps || []) {
      if (s.run) addWhen(s.run, `${nCap(nWhen(b.at))} night`, k(b.at, 5 + (b.steps.indexOf(s) * 0.1)), s.if !== undefined ? s.if : b.if);
    }
    else if (b.drift) addWhen(b.scene, `${L.cast(b.cast)} comes to the counter one day between ${nWhen(b.from)} and ${nWhen(b.to)}`, k(b.from, 2), b.if);
    else if (b.every) addWhen(b.scene, `${L.cast(b.cast)} comes to the counter every day from ${nWhen(b.from)} to ${nWhen(b.to)}`, k(b.from, 2), b.if);
    else (visits[[b.scene, b.cast, b.if, b.first, b.last].join('|')] = visits[[b.scene, b.cast, b.if, b.first, b.last].join('|')] || []).push(b);
  }
  // the same visitor on several days (until something happens): one line, "week 3, Monday, Tuesday; week 4, Monday"
  for (const list of Object.values(visits)) {
    const b = list[0];
    const byWeek = {};
    for (const x of list) { const [w, dd] = x.at.split('-').map(Number); (byWeek[w] = byWeek[w] || []).push(NARRATIVE_DAYS[dd - 1]); }
    const days = Object.entries(byWeek).map(([w, ds]) => `week ${w}, ${ds.join(', ')}`).join('; ');
    addWhen(b.scene, `${nCap(days)}: ${L.cast(b.cast)} comes to the counter${list.length > 1 ? ' (on any of these days, while the condition holds)' : ''}${b.first ? ' (first of the day)' : b.last ? ' (last of the day)' : ''}`,
      k(b.at, b.first ? 1 : b.last ? 3 : 2), b.if);
  }
  for (const n of d.nights || []) addWhen(n.scene, `A night between ${nWhen(n.window[0])} and ${nWhen(n.window[1])} (the run picks which)`, k(n.window[0], 6), n.if);
  for (const e of d.errands || []) addWhen(e.scene, `A trip out by day: ${e.title}${e.where ? ` (${e.where})` : ''}`);
  if (d.hub) {
    addWhen(d.hub.open, `Opens the evening of ${d.hub.title}${d.hub.where ? `, ${d.hub.where}` : ''}, a night between ${nWhen(d.hub.window[0])} and ${nWhen(d.hub.window[1])}`, k(d.hub.window[0], 7));
    addWhen(d.hub.close, `Closes the evening of ${d.hub.title}`, k(d.hub.window[0], 9));
  }
  for (const v of d.vignettes || []) {
    const own = d.hub && d.hub.id === v.hub;
    addWhen(v.scene, `At ${L.hub(v.hub)}, if the player picks “${textOf(v.label)}”${v.crossing ? ' (only when the evening is on for another story)' : ''}`,
      own ? k(d.hub.window[0], 8) : undefined, v.if);
  }
  for (const c of d.cues || []) addWhen(c.scene, `Inside another story's scene, at its “${c.cue}” cue`, undefined, c.if);
  for (const e of d.calendar || []) if (e.scene && !when[e.scene] && e.week) addWhen(e.scene, `${nCap(nWhen(e.week + '-' + e.days[0]))}${e.night ? ' night' : ''}: ${textOf(e.title)}`, k(e.week + '-' + e.days[0], e.night ? 5 : 2), e.known === true ? undefined : e.known);

  // ---- walk every scene once to find runs, plans and flags: who plays whom, who sets what
  const runs = {}, plans = {}, sets = {}, reads = {};
  const note = (map, n, v) => { (map[n] = map[n] || []).push(v); };
  const condFlags = c => typeof c === 'string' ? [...c.matchAll(/flag\.(\w+)/g)].map(m => m[1]) : [];
  const walk = (steps, where, path) => {
    for (const s of steps || []) {
      if (s.if !== undefined && typeof s.if === 'string') condFlags(s.if).forEach(f => note(reads, f, where));
      if (s.run) note(runs, s.run, where.scene);
      if (s.plan) note(plans, s.plan, where.scene);
      if (s.set) for (const [f, v] of Object.entries(s.set)) note(sets, f, { ...where, path: path.slice(), on: !!v, v });
      if (s.choose) for (const o of s.choose) {
        for (const c of [o.if, o.disabled]) condFlags(c).forEach(f => note(reads, f, where));
        walk(o.then, where, [...path, textOf(o.label)]);
      }
      if (s.then) walk(s.then, where, path);
      if (s.else) walk(s.else, where, path);
    }
  };
  for (const [name, sc] of Object.entries(scenes)) walk(sc.steps, { scene: name }, []);
  for (const [name, list] of Object.entries(runs)) for (const from of list) if (from !== name) addWhen(name, `Played from §${'{' + from + '}'}`);
  for (const e of d.errands || []) for (const from of plans[e.id] || []) addWhen(e.scene, `Booked in §${'{' + from + '}'}`);

  // reading order: by the month, scenes played from another right after it, the rest at the end
  const placed = new Set();
  const after = {};
  for (const [name, list] of Object.entries(runs)) if (key[name] === undefined) for (const from of list) (after[from] = after[from] || []).push(name);
  for (const e of d.errands || []) if (key[e.scene] === undefined) for (const from of plans[e.id] || []) (after[from] = after[from] || []).push(e.scene);
  const put = name => {
    if (placed.has(name) || !scenes[name]) return;
    placed.add(name); order.push(name);
    for (const n of after[name] || []) put(n);
  };
  const names = Object.keys(scenes);
  names.filter(n => key[n] !== undefined).sort((a, b) => key[a] - key[b] || names.indexOf(a) - names.indexOf(b)).forEach(put);
  names.forEach(n => { if (!(runs[n] || []).some(f => !placed.has(f))) put(n); });
  names.forEach(put);
  order.forEach((n, i) => { sec[n] = i + 1; });
  const ref = name => sec[name] ? `[§${sec[name]}](#s${sec[name]}) ${nEsc((scenes[name].title || nPretty(name)))}` : nEsc(name);
  const fixRefs = s => s.replace(/§\{(\w+)\}/g, (_, n) => ref(n));

  // ---- conditions in words
  function condText(c, vars) {
    if (c === undefined || c === null) return '';
    if (typeof c !== 'string') return nEsc(JSON.stringify(c));
    const toks = c.match(/'[^']*'|\d+(\.\d+)?|[A-Za-z_][\w.]*|&&|\|\||==|!=|<=|>=|[<>!()]/g) || [];
    const lit = t => t[0] === "'" ? `“${nEsc(t.slice(1, -1))}”` : nEsc(t);
    const OPS = { '==': 'is', '!=': 'isn\'t', '<': 'under', '<=': 'at most', '>': 'over', '>=': 'at least' };
    const out = [];
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t === '&&') out.push('and');
      else if (t === '||') out.push('or');
      else if (t === '(' || t === ')') out.push(t);
      else if (t === '!') { out.push('not'); }
      else if (/^[A-Za-z_]/.test(t) && !['true', 'false', 'null'].includes(t)) {
        const op = toks[i + 1], v = toks[i + 2];
        const cmp = OPS[op] && v !== undefined && !/^[A-Za-z_(!]/.test(v) ? [op, v] : null;
        const neg = out[out.length - 1] === 'not';
        const phrase = name(t, cmp, neg, vars);
        if (phrase.absorbsNot) out.pop();
        out.push(phrase.text);
        if (cmp) i += 2;
      } else out.push(OPS[t] || lit(t));
    }
    return out.join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');
  }
  // one name in a condition, with its comparison if it has one
  function name(t, cmp, neg, vars) {
    const [head, ...rest] = t.split('.');
    const tail = rest.join('.');
    const val = cmp ? cmp[1] : null;
    const valW = val === null ? '' : val[0] === "'" ? `“${nEsc(val.slice(1, -1))}”` : nEsc(val);
    const op = cmp ? cmp[0] : null;
    const OPW = { '==': 'is', '!=': 'isn\'t', '<': 'under', '<=': 'at most', '>': 'over', '>=': 'at least' };
    const plain = text => ({ text: cmp ? `${text} ${OPW[op]} ${valW}` : text });
    switch (head) {
      case 'flag': return plain('`' + tail + '`');
      case 'quest': return { text: `*${nEsc(L.quest(tail))}* is ${neg ? 'not ' : ''}in the run`, absorbsNot: neg };
      case 'ended': return plain(`how *${nEsc(L.quest(tail))}* ended`);
      case 'seen': return { text: `${neg ? 'you haven\'t' : 'you\'ve'} seen ${nPretty(tail)}`, absorbsNot: neg };
      case 'card': return { text: `you ${neg ? 'don\'t ' : ''}hold the ${nPretty(tail)} card`, absorbsNot: neg };
      case 'errand': return plain(`the day of the errand ${nPretty(tail)}`);
      case 'week': case 'day': case 'month': {
        if (cmp && op === '==' && head === 'day') return { text: `it's ${NARRATIVE_DAYS[+val - 1] || 'day ' + val}` };
        if (cmp && op === '==' && head === 'month') return { text: `it's ${NARRATIVE_MONTHS[+val] || 'month ' + val}` };
        return plain(head);
      }
      case 'coin': return plain('your money');
      case 'rep': return plain('your reputation');
      case 'heat': return plain('police heat');
      case 'shelf': return { text: `there's ${neg ? 'no ' : ''}room on the shelves`, absorbsNot: neg };
      case 'bag': return { text: tail === 'out' ? `you're ${neg ? 'not ' : ''}out with the bag` : `the bag is ${neg ? 'off' : 'on'}`, absorbsNot: neg };
      case 'hook': return plain(`the game's check “${nEsc(tail)}”`);
      case 'standing': return plain(`how ${nEsc(L.cast(tail))} feels about you`);
      case 'mood': return plain(`${nEsc(L.cast(tail))}'s mood`);
      case 'said': { const [who, k2] = rest; return plain(`what you told ${nEsc(L.cast(who))} (${nEsc(nPretty(k2 || ''))})`); }
      case 'ally': case 'foe': return { text: `you ${neg ? 'don\'t ' : ''}have ${head === 'ally' ? 'a friend' : 'an enemy'} in town for ${nPretty(tail)}`, absorbsNot: neg };
      case 'town': return { text: `${nEsc(L.cast(tail))} is ${neg ? 'not ' : ''}in town`, absorbsNot: neg };
      case 'random': return plain('a dice roll');
      case 'cue': return plain('the cue');
      case 'offer': case 'result': {
        const RES = { deal: 'you made a deal', refused: 'you turned it down', left: 'they walked out', watch: 'you called the police' };
        if (cmp && val[0] === "'" && RES[val.slice(1, -1)]) return { text: op === '!=' ? `not (${RES[val.slice(1, -1)]})` : RES[val.slice(1, -1)] };
        return plain('the haggle');
      }
      default: {
        const v = vars[head];
        if (v && v.found) {
          if (tail === 'count') return cmp ? plain(`the number of ${v.found}`) : { text: `you have ${neg ? 'no' : 'any'} ${v.found}`, absorbsNot: neg };
          if (!tail && !cmp) return { text: `you ${neg ? 'don\'t have' : 'have'} ${v.found}`, absorbsNot: neg };
        }
        if (v && v.offer) {
          const RES = { deal: 'you made a deal', refused: 'you turned it down', left: 'they walked out', watch: 'you called the police' };
          if (cmp && val[0] === "'" && RES[val.slice(1, -1)]) return { text: op === '!=' ? `not (${RES[val.slice(1, -1)]})` : RES[val.slice(1, -1)] };
        }
        if (v && v.actor && !tail && !cmp) return { text: `${nEsc(v.actor)} is ${neg ? 'not ' : ''}here`, absorbsNot: neg };
        return plain('`' + t + '`');
      }
    }
  }

  // ---- text: templates and conditional text
  function textOf(v, vars) {
    if (v === undefined || v === null) return '';
    if (Array.isArray(v)) return v.map(x => textOf(x, vars)).join(' ');
    if (typeof v === 'object') {
      const a = textOf(v.then, vars), b = v.else !== undefined ? textOf(v.else, vars) : '';
      const c = condText(v.if, vars || {});
      if (!a) return b ? `${b} (if not ${c})` : '';
      return b ? `${a} \\[or, if not ${c}: “${b}”\\]` : `${a} (only if ${c})`;
    }
    return String(v).split(/(\{[^}]+\})/).map((part, pi) => pi % 2 ? template(part.slice(1, -1), vars) : nEsc(part)).join('');
  }
  function template(t, vars) {
      const [what, ...filters] = t.split('|');
      const [kind, arg] = what.split(':');
      const or = filters.find(f => f.startsWith('or:'));
      // every name reads as ‹…›: the one mark the write-back (narrativeApply) maps back to the {…}
      if (kind === 'tonight') return '‹tonight›';
      if (kind === 'placed') return '‹that day›';
      if (kind === 'when') return or ? `‹${nEsc(or.slice(3))}›` : '‹that day›';
      if (kind === 'bagWord') return '‹in your bag›';
      if (kind === 'hook') return `‹${nPretty(arg)}›`;
      const [h, field] = what.split('.');
      const vv = vars && vars[h];
      if (vv && vv.found && (field === 'name' || !field)) return `‹${vv.found.replace(/^(the|a|an|any|your) /, '')}›`;
      if (field === 'count') return '‹how many›';
      return `‹${nEsc(nPretty(what))}›`;
  }
  const lines = v => (Array.isArray(v) ? v : [v]).map(x => textOf(x, cur.vars));
  // where a piece of wording lives in the data, so an edited narrative can be written back:
  // { path: 'scenes.fogMarket.steps.6.text.1', hash } for a plain string, else null (conditional text)
  const anchor = (path, v) => path && typeof v === 'string' ? { path: path.join('.'), hash: nHash(v) } : null;
  const anchors = (path, field, v) => (Array.isArray(v) ? v : [v]).map((x, j) => anchor(path && [...path, field, ...(Array.isArray(v) ? [j] : [])], x));

  // ---- steps to blocks
  // A block: { say, who, lines } | { narrate: lines } | { toast } | { fx: [..] } | { choose: [{label, tags, blocks}] }
  //          | { branch: [{ head, blocks }] } | { stage } | { go } | { line } | { when } (a step's own if, as a lead-in)
  let cur = { vars: {} };
  function items(spec) {
    if (!spec) return 'something';
    if (spec.unique) return `*${nEsc(((d.uniques || {})[spec.unique] || {}).name || nPretty(spec.unique))}*`;
    const n = spec.name || L.item(spec.item);
    return `${nEsc(n.toLowerCase())}${spec.mark ? ` (${nEsc(spec.mark)})` : ''}${spec.fake ? ' (a fake)' : ''}`;
  }
  function matchText(m) {
    if (!m) return 'anything';
    const bits = [];
    for (const [k2, v] of Object.entries(m)) {
      if (k2 === 'key') bits.unshift(nEsc(L.item(v).toLowerCase()));
      else if (k2 === 'cat') bits.unshift((Array.isArray(v) ? v : [v]).map(nEsc).join(' or '));
      else if (k2 === 'fake') bits.push(v ? 'fakes' : 'genuine');
      else if (k2 === 'held' || k2 === 'nosale') { if (v) bits.push(k2 === 'held' ? 'held' : 'not for sale'); }
      else if (k2 === 'unique') bits.unshift(v === true ? 'one-of-a-kind' : `*${nEsc(((d.uniques || {})[v] || {}).name || nPretty(v))}*`);
      else if (k2 === 'tag' || k2 === 'tags') bits.push(`good for ${(Array.isArray(v) ? v : [v]).map(nEsc).join(' or ')}`);
      else if (v === true || v === false) bits.push(`${v ? '' : 'not '}${nEsc(nPretty(k2))}`);
      else bits.push(`${nEsc(nPretty(k2))} ${nEsc(Array.isArray(v) ? v.join(' or ') : String(v))}`);
    }
    return bits.join(', ') || 'anything';
  }
  // a speaker's name, without "(deceased)" and the like: the cast list says that once
  const short = n => String(n).replace(/\s*\([^)]*\)$/, '');
  function actorName(a) { return short(actorFull(a)); }
  function actorFull(a) {
    if (typeof a === 'string') {
      const v = cur.vars[a];
      if (v && v.actor) return v.actor;
      const m = /^(.*?)(\d+)$/.exec(a);
      if (m && cur.vars[m[1]] && cur.vars[m[1]].actor) return `${cur.vars[m[1]].actor.replace(/^(A|An) /, 'a ')} (${m[2]})`.replace(/^a /, 'A ');
      if (a === 'you' || a === 'keeper') return 'You';
      return L.cast(a);
    }
    return a.name || (a.cast ? (a.cast === 'keeper' ? 'You' : L.cast(a.cast)) : nCap(nPretty(a.id)));
  }
  // an actor arrives: remember their name; a crowd reads "three ghosts"
  const NUM = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const crowd = (nm, n) => n > 1 ? `${NUM[n] || n} ${nm.replace(/^(A|An|The) /i, '').replace(/^(\S+)/, w => /s$/.test(w) ? w : w + 's')}` : nm;
  function meet(a) {
    const n = Array.isArray(a.at) && Array.isArray(a.at[0]) ? a.at.length : 1;
    cur.vars[a.id] = { actor: actorName(a) };
    return { name: actorName(a), n };
  }
  // a list of actors, the same name counted once: "Mott, two neighbors and three ghosts"
  function group(list) {
    const counts = new Map();
    for (const { name: nm, n } of list) { const key2 = nm.replace(/^(A|An) /, 'a '); counts.set(key2, (counts.get(key2) || 0) + n); }
    return nList([...counts].map(([nm, n]) => nEsc(n > 1 ? crowd(nm, n) : nm)));
  }
  const fxOf = (s, kind) => {
    if (kind === 'set') return Object.entries(s.set).map(([f, v]) => v === true ? `sets \`${f}\`` : v === false || v === null ? `clears \`${f}\`` : `\`${f}\` = ${nEsc(typeof v === 'string' ? `“${v}”` : JSON.stringify(v))}`).join(', ');
    if (kind === 'rep') return `${s.rep > 0 ? '+' : ''}${s.rep} reputation${s.why ? ` (${textOf(s.why, cur.vars)})` : ''}`;
    if (kind === 'coin') return `${s.coin < 0 ? '−' : '+'}$${Math.abs(s.coin)}${s.why ? ` (${textOf(s.why, cur.vars)})` : ''}`;
    if (kind === 'heat') return `${s.heat > 0 ? '+' : ''}${s.heat} police heat${s.why ? ` (${textOf(s.why, cur.vars)})` : ''}`;
    if (kind === 'sway') return `${nEsc(L.cast(s.sway))} ${s.by > 0 ? 'warms to you' : 'cools on you'} (${s.by > 0 ? '+' : ''}${s.by})${s.why ? `: ${textOf(s.why, cur.vars)}` : ''}`;
    if (kind === 'find') {
      const where = { stock: 'your stock', bag: 'the bag', forSale: 'what\'s for sale' }[s.in] || s.in || 'your stock';
      const what = matchText(s.match);
      cur.vars[s.find] = { found: s.all ? `${what} items` : `the ${nPretty(s.find)}` };
      return `looks in ${where} for ${s.all ? 'every' : s.cheapest ? 'the cheapest' : 'a'} ${what}${s.all ? ' item' : ''} (call it “${nEsc(nPretty(s.find))}”)`;
    }
    if (kind === 'take') return `takes ${cur.vars[s.take] && cur.vars[s.take].found || 'the ' + nPretty(s.take)} out of stock`;
    if (kind === 'sell') return `sells ${cur.vars[s.sell] && cur.vars[s.sell].found || 'the ' + nPretty(s.sell)}${s.to ? ` (to ${nEsc(s.to)})` : ''}`;
    if (kind === 'add') { if (s.as) cur.vars[s.as] = { found: 'it' }; return `puts ${items(s.add)} on your shelves`; }
    if (kind === 'edit') {
      const bits = [];
      if (s.set) bits.push(Object.entries(s.set).map(([f, v]) => f === 'nosale' && v ? 'not for sale' : `${nPretty(f)}: ${nEsc(JSON.stringify(v))}`).join(', '));
      if (s.price) bits.push(`price ×${s.price.times}${s.price.min ? ` (at least $${s.price.min})` : ''}`);
      if (s.clue) bits.push(`a clue: “${textOf(s.clue, cur.vars)}”`);
      return `marks the ${nPretty(s.edit)}: ${bits.join('; ')}`;
    }
    if (kind === 'use') { if (s.as) cur.vars[s.as] = { found: `something for ${s.use}` }; return `uses the best thing in your bag for *${nEsc(s.use)}*${s.hard ? ' (a hard one)' : ''}`; }
    if (kind === 'sounding') return `a Look: “${textOf((d.soundings || {})[s.sounding] || s.sounding, cur.vars)}”`;
    if (kind === 'plan') { const e = (d.errands || []).find(x => x.id === s.plan); return `books a trip out: ${e ? `${ref(e.scene)}` : nEsc(s.plan)}${s.after > 1 ? `, ${s.after} days on` : ''}`; }
    if (kind === 'roll') return Object.entries(s.roll).map(([f, vs]) => `\`${f}\` is picked at random from ${vs.map(v => nEsc(JSON.stringify(v))).join(', ')}`).join('; ');
    if (kind === 'hook') { for (const n of s.sets || []) cur.vars[n] = { found: `the ${nPretty(n)}` }; return `the game's code does “${nEsc(nPretty(s.hook.split('.')[0]))}”${(s.sets || []).length ? ` (finds ${s.sets.map(nPretty).join(', ')})` : ''}`; }
    if (kind === 'view') return null;
    if (kind === 'refresh') return null;
    return null;
  };
  // `at` is the path of the steps in the data (['scenes', name, 'steps']), for the anchors
  function blocks(steps, at) {
    const out = [];
    const push = (b, s) => { if (s && s.if !== undefined && !('then' in s && Object.keys(s)[0] === 'if')) b.cond = condText(s.if, cur.vars); out.push(b); };
    (steps || []).forEach((s, si) => {
      const kind = Object.keys(s)[0];
      const sp = at ? [...at, si] : null;
      if (kind === 'say') push({ say: actorName(s.say), lines: lines(s.text), at: anchors(sp, 'text', s.text) }, s);
      else if (kind === 'narrate') push({ narrate: lines(s.narrate), at: anchors(sp, 'narrate', s.narrate) }, s);
      else if (kind === 'toast') push({ toast: Array.isArray(s.toast) ? s.toast.map(x => textOf(x, cur.vars)) : [textOf(s.toast, cur.vars)], pick: s.pick, at: anchors(sp, 'toast', s.toast) }, s);
      else if (kind === 'line') push({ line: textOf(s.line, cur.vars), at: anchor(sp && [...sp, 'line'], s.line) }, s);
      else if (kind === 'choose') {
        if (s.as) cur.vars[s.as] = { choice: true };
        const opts = s.choose.map((o, oi) => {
          const tags = [];
          if (o.if !== undefined) tags.push(`only if ${condText(o.if, cur.vars)}`);
          const bare = h => textOf(h, cur.vars).replace(/^\((.*)\)$/, '$1');
          // a hint shown only when the option is greyed out is the reason it's greyed out
          const h1 = o.hint && typeof o.hint === 'object' && !Array.isArray(o.hint) ? o.hint : null;
          const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
          const why = !h1 || o.disabled === undefined ? null
            : !textOf(h1.else) && same(h1.if, o.disabled) ? h1.then
            : !textOf(h1.then) && h1.else !== undefined ? h1.else : null;
          const off = o.off && o.off.hint ? o.off.hint : why;
          if (o.disabled !== undefined) tags.push(`greyed out if ${condText(o.disabled, cur.vars)}${off ? `: “${bare(off)}”` : ''}`);
          if (o.needs) tags.push(`needs something for *${nEsc([].concat(o.needs).join(' or '))}* in the bag`);
          if (o.card) tags.push('a card');
          if (o.tone) tags.push(`${o.tone}`);
          if (o.hint && !why) {
            const h = o.hint;
            if (h1 && !textOf(h1.else)) tags.push(`${bare(h1.then)}, if ${condText(h1.if, cur.vars)}`);
            else if (h1 && !textOf(h1.then)) tags.push(`${bare(h1.else)}, unless ${condText(h1.if, cur.vars)}`);
            else tags.push(bare(h));
          }
          const op = sp && [...sp, 'choose', oi];
          return { label: textOf(o.label, cur.vars), at: anchor(op && [...op, 'label'], o.label), tags, blocks: blocks(o.then, op && [...op, 'then']) };
        });
        push({ choose: opts, with: s.with ? L.cast(s.with) : null }, s);
      }
      else if (kind === 'if') {
        const arms = [{ head: `If ${condText(s.if, cur.vars)}`, blocks: blocks(s.then, sp && [...sp, 'then']) }];
        if (s.else) arms.push({ head: 'Otherwise', blocks: blocks(s.else, sp && [...sp, 'else']) });
        // nothing to read in either arm (only scene display changes): leave it out
        if (arms.some(a => a.blocks.length)) push({ branch: arms });
      }
      else if (kind === 'stage') {
        const who = (s.actors || []).filter(a => a.id !== 'you' && a.id !== 'keeper' && a.if === undefined).map(meet);
        (s.actors || []).filter(a => a.id === 'you' || a.id === 'keeper' || a.if !== undefined).forEach(meet);
        push({ stage: `${nEsc(cur.where || L.place(s.stage))}${who.length ? `. ${nCap(group(who))} ${who.length > 1 || who[0].n > 1 ? 'are' : 'is'} there` : ''}` }, s);
      }
      else if (kind === 'enter') { const m = meet(s.enter); push({ enter: `${nCap(nEsc(crowd(m.name, m.n)))} ${m.n > 1 ? 'appear' : 'appears'}` }, s); }
      else if (kind === 'remove') push({ enter: `${nEsc(actorName(s.remove))} goes` }, s);
      else if (kind === 'leave') { if (s.if !== undefined || s.hurry) push({ enter: `${nEsc(actorName(s.leave))} leaves${s.hurry ? ', in a hurry' : ''}` }, s); }
      else if (kind === 'walk' || kind === 'face') { /* stage directions: left out */ }
      else if (kind === 'offer') {
        const as = s.result || 'offer';
        cur.vars[as] = { offer: true };
        if (s.as) cur.vars[s.as] = { found: items(s.offer).replace(/\*/g, '') };
        push({ offer: `${nEsc(actorName(cur.customer || ''))} offers you ${items(s.offer)}, asking $${s.asking}${s.min ? ` (will go down to $${s.min})` : ''}${s.persona ? `, ${/^([aeiou]|hon|hou)/.test(s.persona) ? 'an' : 'a'} ${nEsc(s.persona)} seller` : ''}` }, s);
      }
      else if (kind === 'run') push({ go: ref(s.run) }, s);
      else if (kind === 'cue') push({ cue: `Other stories in the run can step in here (their “${nEsc(s.cue)}” scenes).` }, s);
      else if (kind === 'end') push({ end: true }, s);
      else {
        const f = fxOf(s, kind);
        if (f) {
          const last = out[out.length - 1];
          if (last && last.fx && !last.cond && s.if === undefined) last.fx.push(f);
          else push({ fx: [f] }, s);
        }
      }
    });
    return out;
  }
  // a hook's "with" lines read as lines (The Benefit's attic)
  const sceneBlocks = (name) => {
    const sc = scenes[name];
    // where the scene is staged, in the words the calendar uses
    const cal = (d.calendar || []).find(e => e.scene === name && typeof e.where === 'string');
    const er = (d.errands || []).find(e => e.scene === name && e.where);
    const hubWhere = d.hub && (d.hub.open === name || d.hub.close === name || (d.vignettes || []).some(v => v.scene === name && v.hub === d.hub.id)) ? d.hub.where : null;
    cur = { vars: {}, customer: sc.customer, where: cal ? cal.where : er ? er.where : hubWhere };
    if (sc.customer) cur.vars[sc.customer] = { actor: L.cast(sc.customer) };
    return blocks(sc.steps, ['scenes', name, 'steps']);
  };

  // ---- what a scene leads to: other scenes whose trigger needs a flag this one sets
  const triggers = [];
  for (const b of d.beats || []) {
    if (b.night) for (const s of b.steps || []) { if (s.run) triggers.push({ scene: s.run, cond: s.if !== undefined ? s.if : b.if }); }
    else triggers.push({ scene: b.scene, cond: b.if });
  }
  for (const n of d.nights || []) triggers.push({ scene: n.scene, cond: n.if });
  for (const v of d.vignettes || []) triggers.push({ scene: v.scene, cond: v.if });
  const leadsTo = name => {
    const mine = new Set(Object.entries(sets).filter(([, ws]) => ws.some(w => w.scene === name && w.on)).map(([f]) => f));
    const out = [];
    for (const t of triggers) {
      if (sec[t.scene] <= sec[name] || typeof t.cond !== 'string') continue;
      const fl = [...t.cond.matchAll(/(^|[^!])flag\.(\w+)/g)].map(m => m[2]).filter(f => mine.has(f));
      if (fl.length && !out.some(o => o.scene === t.scene)) out.push({ scene: t.scene, cond: t.cond });
    }
    return out.sort((a, b) => sec[a.scene] - sec[b.scene]).map(o => `${ref(o.scene)}, if ${condText(o.cond, {})}`);
  };

  // where a flag is set, in words: "§5, choosing “Sell them your fakes”"
  const setWhere = (f, only) => (sets[f] || []).filter(w => only === undefined || w.v === only).map(w => `[§${sec[w.scene]}](#s${sec[w.scene]})${w.path.length ? ` (${w.path.map(p => /^["“]/.test(p) ? p : `“${p}”`).join(' → ')})` : ''}`)
    .filter((x, i, a) => a.indexOf(x) === i);

  // for an ending's condition: where each flag it tests is set, to the value it tests for if it names one
  const endSets = c => {
    if (typeof c !== 'string') return [];
    const seen = new Set(), out = [];
    for (const m of c.matchAll(/flag\.(\w+)(?:\s*==\s*'([^']*)')?/g)) {
      const key = m[1] + '=' + (m[2] || '');
      if (seen.has(key)) continue;
      seen.add(key);
      const w = setWhere(m[1], m[2]);
      if (w.length) out.push(`\`${m[1]}\` ${m[2] ? `becomes “${nEsc(m[2])}”` : 'is set'} in ${w.join(' or ')}`);
    }
    return out;
  };

  // ---- the document
  const doc = { id: d.id, title: d.title, sections: [] };
  const meta = [d.kind === 'major' ? 'A major story' : 'A minor story'];
  if (d.family) meta.push(d.family);
  if (d.months) meta.push(d.months.map(m => NARRATIVE_MONTHS[m] || `month ${m}`).join(' or '));
  if (d.arc) meta.push(`a chapter of the long arc “${nEsc(L.quest(d.arc))}”${d.after ? `, after it ended ${nList(d.after.map(a => `“${nEsc(a)}”`)).replace(/ and ([^,]*)$/, ' or $1')}` : ''}`);
  if (d.crosses && d.crosses.length) meta.push(`crosses with ${nList(d.crosses.map(q => `*${nEsc(L.quest(q))}*`))}`);
  doc.meta = meta.join(' · ');
  doc.rumour = textOf(d.rumour);
  doc.rumourAt = anchor(['rumour'], d.rumour);
  if (d.teaser !== undefined) { doc.teaser = textOf(d.teaser); doc.teaserAt = anchor(['teaser'], d.teaser); }
  doc.about = (Array.isArray(d.about) ? d.about : d.about ? [d.about] : []).map(p => nEsc(p).replace(/§\{(\w+)\}/g, (_, n) => sec[n] ? `[§${sec[n]}](#s${sec[n]})` : n));
  doc.aboutAt = anchors([], 'about', d.about === undefined ? [] : d.about);
  doc.secs = Object.fromEntries(order.map(n => [sec[n], n]));
  doc.notes = d.notes ? nEsc(d.notes) : '';

  // who and what
  const appear = {};
  const scan = (name, v) => { const t = JSON.stringify(v); for (const id of Object.keys(d.cast || {})) if (t.includes(`"${id}"`)) (appear[id] = appear[id] || new Set()).add(name); };
  for (const n of order) scan(n, scenes[n]);
  doc.cast = Object.entries(d.cast || {}).map(([id, c]) => ({ name: nEsc(c.name), in: [...(appear[id] || [])].sort((a, b) => sec[a] - sec[b]).map(n => `[§${sec[n]}](#s${sec[n]})`) }));
  doc.things = Object.entries(d.uniques || {}).map(([id, u]) => ({ name: nEsc(u.name), guide: u.guide, tells: (u.tells || []).map(t => textOf(t)),
    in: order.filter(n => JSON.stringify(scenes[n]).includes(`"${id}"`)).map(n => `[§${sec[n]}](#s${sec[n]})`)
      .concat(JSON.stringify(d.mornings || []).includes(`"${id}"`) ? ['the mornings'] : []) }));

  // the month at a glance
  doc.timeline = order.filter(n => key[n] !== undefined).map(n => ({ when: (when[n] || [])[0] ? fixRefs(when[n][0]) : '', ref: ref(n) }));

  // the scenes
  for (const n of order) {
    const sc = scenes[n];
    doc.sections.push({ n: sec[n], scene: n, title: nEsc(sc.title || nPretty(n)), at: anchor(['scenes', n, 'title'], sc.title), when: (when[n] || ['Not played from anywhere in this story']).map(fixRefs),
      blocks: sceneBlocks(n), leads: leadsTo(n) });
  }

  // around the story
  cur = { vars: {} };
  doc.around = [];
  if ((d.mornings || []).length) doc.around.push({ title: 'Every morning', intro: 'At the start of each day of the month, while the story is in the run:', blocks: blocks(d.mornings, ['mornings']) });
  if (d.sold) doc.around.push({ title: 'When its things are sold', intro: 'However they go:', blocks: Object.entries(d.sold).flatMap(([u, steps]) => [{ head: `*${nEsc(((d.uniques || {})[u] || {}).name || u)}*` }, ...blocks(steps, ['sold', u])]) });
  if ((d.afterwards || []).length) doc.around.push({ title: 'Afterwards, in later runs', intro: 'Every morning of every run, drawn or not:', blocks: blocks(d.afterwards, ['afterwards']) });
  if (d.talk) doc.around.push({ title: `What the town says (${nEsc(L.cast(d.talk.by))})`, intro: 'Before it starts:', blocks: [
    ...(d.talk.rumour || []).map((r, i) => ({ say: L.cast(d.talk.by), lines: [textOf(r)], at: [anchor(['talk', 'rumour', i], r)] })),
    ...(typeof d.talk.react === 'string' ? [{ head: 'After it ends' }, { say: L.cast(d.talk.by), lines: [textOf(d.talk.react)], at: [anchor(['talk', 'react'], d.talk.react)] }]
      : Object.entries(d.talk.react || {}).flatMap(([e, l]) => [{ head: `After “${nEsc((d.endings || {})[e] || e)}”` }, { say: L.cast(d.talk.by), lines: [textOf(l)], at: [anchor(['talk', 'react', e], l)] }]))] });
  if ((d.overheard || []).length) doc.around.push({ title: 'Overheard in the queue', blocks: d.overheard.map((o, i) => ({ line: textOf(o.line), at: anchor(['overheard', i, 'line'], o.line), cond: o.if ? condText(o.if, {}) : undefined })) });

  // the endings: the first that holds
  if (typeof d.outcome === 'string') doc.endings = { by: condText(d.outcome, {}), list: Object.entries(d.endings || {}).map(([k2, t]) => ({ title: nEsc(t), at: anchor(['endings', k2], t), how: `when ${condText(d.outcome, {})} is “${nEsc(k2)}”`, set: [] })) };
  else {
    const list = (d.outcome || []).map((o, i) => ({ title: nEsc((d.endings || {})[o.ending] || o.ending), at: anchor(['endings', o.ending], (d.endings || {})[o.ending]), how: `${i ? 'otherwise, ' : ''}if ${condText(o.if, {})}`,
      set: endSets(o.if) }));
    const reached = new Set((d.outcome || []).map(o => o.ending));
    for (const [k2, t] of Object.entries(d.endings || {})) if (!reached.has(k2)) list.push({ title: nEsc(t), at: anchor(['endings', k2], t), how: 'never chosen by the outcome (set elsewhere, or unused)', set: [] });
    doc.endings = { list, none: 'If none of these holds, the story ends without an ending of its own.' };
  }
  doc.epilogue = (d.epilogue || []).length ? blocks(d.epilogue, ['epilogue']) : [];

  // flags: where each is set and what reads it
  const flags = new Set([...Object.keys(sets), ...Object.keys(reads), ...triggers.flatMap(t => condFlags(t.cond))]);
  const readBy = f => {
    const out = new Set((reads[f] || []).map(w => w.scene ? `[§${sec[w.scene]}](#s${sec[w.scene]})` : ''));
    for (const t of triggers) if (condFlags(t.cond).includes(f)) out.add(`when [§${sec[t.scene]}](#s${sec[t.scene]}) plays`);
    if (JSON.stringify(d.outcome || '').includes(`flag.${f}`)) out.add('the ending');
    if (JSON.stringify(d.epilogue || '').includes(`flag.${f}`)) out.add('the epilogue');
    if (JSON.stringify(d.mornings || '').includes(`flag.${f}`)) out.add('the mornings');
    if (JSON.stringify(d.calendar || '').includes(`flag.${f}`)) out.add('the calendar');
    out.delete('');
    return [...out];
  };
  doc.flags = [...flags].sort().map(f => ({ flag: f, set: setWhere(f), read: readBy(f) }));
  return doc;
}

// ---------------------------------------------------------------- Markdown
// A line made from the story's own words ends with a hidden anchor, <!-- ✎ path hash -->: where the
// words live in the data and a short hash of them as they were. narrativeApply() reads an edited
// file back through them. A narration with several paragraphs has one anchor each (path¶n).
const nHash = s => { let h = 0x811c9dc5; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36).padStart(7, '0').slice(-5); };
const N_MARK = /\s*<!-- ✎ (\S+) (\w+) -->$/;

// `units`, if given, collects each anchored line: { line, pre, text, post, hash }, by path
function narrativeMarkdown(doc, units) {
  const o = [];
  const seen = new Set();
  // a line: pre + the words + post (+ rest, made from other parts of the story), and the words' anchor
  const U = (pre, text, post, at, para, rest = '') => {
    const path = at && !seen.has(at.path + (para === undefined ? '' : '¶' + para)) ? at.path + (para === undefined ? '' : '¶' + para) : null;
    const line = pre + text + post + rest;
    if (path) { seen.add(path); if (units) units.set(path, { line, pre, text, post, rest, hash: at.hash }); }
    o.push(path ? `${line} <!-- ✎ ${path} ${at.hash} -->` : line, '');
  };
  const md = (bs, pad) => { for (const b of bs) blockMd(b, pad, o, U); };
  o.push(`<!-- Made by node tools/narratives.js from js/stories/${doc.id}.js. You can change the words here: a line that ends in a hidden ✎ mark is the story's own wording, and node tools/narratives.js --apply writes your changes back into the story (docs/NARRATIVES.md). Change anything else in the story editor. -->`, '');
  o.push(`# ${doc.title}`, '', doc.meta, '');
  if (doc.rumour) U('> ', doc.rumour, '', doc.rumourAt);
  if (doc.teaser) U('**Teaser:** ', doc.teaser, '', doc.teaserAt);
  o.push('## What it\'s about', '');
  if (doc.about.length) doc.about.forEach((p, i) => U('', p, '', (doc.aboutAt || [])[i]));
  else o.push('*No summary written yet: add an "about" to the story file.*', '');
  if (doc.cast.length || doc.things.length) {
    o.push('## Who and what', '');
    for (const c of doc.cast) o.push(`- **${c.name}**${c.in.length ? `: ${c.in.join(', ')}` : ''}`);
    for (const t of doc.things) o.push(`- *${t.name}* ($${t.guide}${t.in.length ? `; ${t.in.join(', ')}` : ''}): ${t.tells.join(' ')}`);
    o.push('');
  }
  if (doc.timeline.length) {
    o.push('## The month at a glance', '');
    for (const t of doc.timeline) o.push(`- ${t.when}: ${t.ref}`);
    o.push('');
  }
  o.push('## The story', '');
  for (const s of doc.sections) {
    U(`### <a id="s${s.n}"></a>§${s.n}. `, s.title, '', s.at);
    o.push(`*${s.when.join('. ')}.*`, '');
    md(s.blocks, '');
    if (s.leads.length) o.push(`**This can lead to** ${s.leads.join('; ')}.`, '');
  }
  for (const a of doc.around) {
    o.push(`## ${a.title}`, '');
    if (a.intro) o.push(a.intro, '');
    md(a.blocks, '');
  }
  o.push('## Endings', '', 'The first that holds:', '');
  for (const e of doc.endings.list) {
    U('- **', e.title, '**', e.at, undefined, `: ${e.how}${e.set.length ? `. ${nCap(e.set.join('; '))}` : ''}.`);
    o.pop(); // a list: no blank line between
  }
  if (doc.endings.none) o.push('', doc.endings.none);
  o.push('');
  if (doc.epilogue.length) { o.push('### Epilogue lines', ''); md(doc.epilogue, ''); }
  if (doc.flags.length) {
    o.push('## What the story remembers', '', 'Each flag, where it is set and what reads it.', '');
    o.push('| Flag | Set in | Read by |', '|------|--------|---------|');
    for (const f of doc.flags) o.push(`| \`${f.flag}\` | ${f.set.join(', ') || 'not in this story'} | ${f.read.join(', ') || 'nothing in this story'} |`);
    o.push('');
  }
  if (doc.notes) o.push('## Writer\'s notes', '', doc.notes, '');
  return o.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}
function blockMd(b, pad, o, U) {
  const lead = b.cond ? `*If ${b.cond}:* ` : '';
  const at = b.at || [];
  const P = s => { o.push(pad + s, ''); };
  if (b.say !== undefined) b.lines.forEach((l, i) => U(`${pad}${i ? '' : lead}**${nEsc(b.say)}:** “`, l, '”', at[i]));
  else if (b.narrate) b.narrate.forEach((l, i) => {
    const paras = l.split(/\n+/);
    paras.forEach((para, j) => U(`${pad}${i || j ? '' : lead}*`, para.trim(), '*', at[i], paras.length > 1 ? j : undefined));
  });
  else if (b.toast && b.toast.length > 1) {
    P(`${lead}📌 One of these${b.pick ? `, ${b.pick === 'day' ? 'a day at a time' : 'at random'}` : ''}:`);
    b.toast.forEach((t, i) => { U(`${pad}- “`, t, '”', at[i]); o.pop(); });
    o.push('');
  }
  else if (b.toast) U(`${pad}${lead}📌 “`, b.toast[0], '”', at[0]);
  else if (b.line !== undefined) U(`${pad}${lead}“`, b.line, '”', b.at);
  else if (b.fx) P(`${lead}<sub>⟨${b.fx.join(' · ')}⟩</sub>`);
  else if (b.stage) P(`${lead}🎬 **${b.stage}.**`);
  else if (b.enter) P(`${lead}*${b.enter}.*`);
  else if (b.offer) P(`${lead}💰 **A haggle:** ${b.offer}.`);
  else if (b.go) P(`${lead}➜ Plays ${b.go}, then carries on.`);
  else if (b.cue) P(`${lead}*${b.cue}*`);
  else if (b.end) P(`${lead}**The scene ends here.**`);
  else if (b.head) P(`**${b.head}**`);
  else if (b.choose) {
    P(`${lead}**You choose${b.with ? ` (talking to ${nEsc(b.with)})` : ''}:**`);
    b.choose.forEach((opt, i) => {
      U(`${pad}${i + 1}. **`, opt.label, `**${opt.tags.length ? ` <sub>(${opt.tags.join('; ')})</sub>` : ''}`, opt.at);
      for (const x of opt.blocks) blockMd(x, pad + '   ', o, U);
    });
  }
  else if (b.branch) {
    b.branch.forEach(arm => {
      o.push(`${pad}- **${arm.head}:**`, '');
      if (!arm.blocks.length) o.push(`${pad}  *(nothing)*`, '');
      for (const x of arm.blocks) blockMd(x, pad + '  ', o, U);
    });
  }
}

// ---------------------------------------------------------------- the narrative back into the data
// Reads an edited narrative (Markdown) and writes the changed words into a copy of the story's data.
// Words only: each anchored line's words go back to the place its anchor names, with the ‹names›
// turned back into the {templates} they came from. Anything else (a choice added, a condition
// reworded, a line moved) can't be read back and is reported, so nothing is lost silently.
// `look` must be the one the file was made with. Returns { data, changed: [paths], problems: [text] }.
function narrativeApply(data, edited, look) {
  const units = new Map();
  const doc = storyNarrative(data, look);
  const fresh = narrativeMarkdown(doc, units);
  const out = JSON.parse(JSON.stringify(data));
  const changed = [], problems = [];
  if (edited === fresh) return { data: out, changed, problems };
  const freshPlain = new Set(fresh.split('\n').filter(l => !N_MARK.test(l)));
  const got = new Set();
  const short = t => t.length > 70 ? t.slice(0, 67) + '...' : t;
  edited.split('\n').forEach((raw, ln) => {
    const m = N_MARK.exec(raw);
    if (!m) {
      if (raw.trim() && !freshPlain.has(raw)) problems.push(`line ${ln + 1}: not the story's own words, so it can't be written back (change it in the story editor): ${short(raw.trim())}`);
      return;
    }
    const [, key, hash] = m;
    const line = raw.slice(0, m.index);
    if (got.has(key)) { problems.push(`line ${ln + 1}: ${key} is here twice`); return; }
    got.add(key);
    const u = units.get(key);
    if (!u) { problems.push(`line ${ln + 1}: the story has no ${key} any more: make the narrative again (node tools/narratives.js) and redo this edit`); return; }
    if (line === u.line) return;
    if (hash !== u.hash) { problems.push(`line ${ln + 1}: these words changed in the story after the narrative was made, so this edit would undo that: make the narrative again and redo it (${key})`); return; }
    // the words end at post: the line's end, or (when the rest is made from other parts, which may
    // have been edited too) post's first place after them
    const end = u.rest ? line.indexOf(u.post, u.pre.length) : line.length - u.post.length;
    if (!line.startsWith(u.pre) || end < u.pre.length || (!u.rest && !line.endsWith(u.post))) {
      problems.push(`line ${ln + 1}: only the words can change, not what's around them (${short(u.pre.trim() + '…' + u.post.trim())})`); return;
    }
    const words = line.slice(u.pre.length, end);
    const [path, para] = key.split('¶');
    const keys = path.split('.').map(k => /^\d+$/.test(k) ? +k : k);
    let parent = out;
    for (const k of keys.slice(0, -1)) parent = parent[k];
    const last = keys[keys.length - 1];
    const was = parent[last];
    let back;
    try { back = nUnrender(words, para === undefined ? was : was.split(/\n+/)[+para].trim(), u.text, doc.secs); }
    catch (e) { problems.push(`line ${ln + 1}: ${e.message}`); return; }
    if (para !== undefined) {
      const bits = was.split(/(\n+)/);
      const j = +para * 2;
      const m2 = /^(\s*)[\s\S]*?(\s*)$/.exec(bits[j]);
      bits[j] = m2[1] + back + m2[2];
      back = bits.join('');
    }
    if (back !== was) { parent[last] = back; changed.push(key); }
  });
  for (const key of units.keys()) if (!got.has(key)) problems.push(`${key} was taken out of the narrative: taking lines out isn't written back (do it in the story editor)`);
  return { data: out, changed, problems };
}
// edited words back to the data's text: ‹names› to the {templates} they stand for, §-links in a
// summary to §{scene}, and the Markdown escapes taken off
function nUnrender(words, was, wasText, secs) {
  const tpls = String(was).split(/(\{[^}]+\})/).filter((x, i) => i % 2);
  const shown = String(wasText).split(/(‹[^›]*›)/).filter((x, i) => i % 2);
  const used = new Set();
  const unesc = t => t.split(/(\[§\d+\]\(#s\d+\))/).map((x, i) => {
    if (!(i % 2)) return x.replace(/\\([\\`*_[\]<>#|])/g, '$1');
    const n = /§(\d+)/.exec(x)[1];
    if (!secs || !secs[n]) throw new Error(`there's no §${n} to link to`);
    return `§{${secs[n]}}`;
  }).join('');
  return words.split(/(‹[^›]*›)/).map((x, i) => {
    if (!(i % 2)) return unesc(x);
    const k = shown.findIndex((s, j) => s === x && !used.has(j) && tpls[j] !== undefined);
    if (k < 0) throw new Error(`${x} isn't one of the names in this line (${shown.join(' ') || 'it has none'}): keep the ‹names› as they are`);
    used.add(k);
    return tpls[k];
  }).join('');
}

// ---------------------------------------------------------------- HTML (the editor)
const nHtmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// the inline Markdown above, as HTML; <sub> is the one tag the generator writes
function nInline(s) {
  const keep = [];
  let t = String(s).replace(/\\([\\`*_[\]<>#|])/g, (_, c) => { keep.push(nHtmlEsc(c)); return `\u0000${keep.length - 1}\u0000`; });
  t = nHtmlEsc(t).replace(/&lt;sub&gt;/g, '<sub>').replace(/&lt;\/sub&gt;/g, '</sub>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/\[([^\]]+)\]\(#(s\d+)\)/g, '<a href="#$2" data-sec="$2">$1</a>');
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[+i]);
}
function narrativeHTML(doc) {
  const o = [];
  const H = s => nInline(s);
  const bl = bs => bs.map(blockHtml).join('');
  function blockHtml(b) {
    const lead = b.cond ? `<span class="n-if">If ${H(b.cond)}:</span> ` : '';
    if (b.say !== undefined) return b.lines.map((l, i) => `<p class="n-say">${i ? '' : lead}<b>${nHtmlEsc(b.say)}:</b> “${H(l)}”</p>`).join('');
    if (b.narrate) return b.narrate.map((l, i) => `<p class="n-narrate">${i ? '' : lead}${H(l).replace(/\n+/g, '<br><br>')}</p>`).join('');
    if (b.toast) return `<p class="n-toast">${lead}📌 ${b.pick ? `One of these, ${b.pick === 'day' ? 'a day at a time' : 'at random'}: ` : ''}${b.toast.map(t => `“${H(t)}”`).join(' / ')}</p>`;
    if (b.line !== undefined) return `<p class="n-line">${lead}“${H(b.line)}”</p>`;
    if (b.fx) return `<p class="n-fx">${lead}${b.fx.map(H).join(' · ')}</p>`;
    if (b.stage) return `<p class="n-stage">${lead}🎬 ${H(b.stage)}.</p>`;
    if (b.enter) return `<p class="n-enter">${lead}${H(b.enter)}.</p>`;
    if (b.offer) return `<p class="n-offer">${lead}💰 <b>A haggle:</b> ${H(b.offer)}.</p>`;
    if (b.go) return `<p class="n-go">${lead}➜ Plays ${H(b.go)}, then carries on.</p>`;
    if (b.cue) return `<p class="n-enter">${lead}${H(b.cue)}</p>`;
    if (b.end) return `<p class="n-end">${lead}The scene ends here.</p>`;
    if (b.head) return `<p class="n-head">${H(b.head)}</p>`;
    if (b.choose) return `<div class="n-choose"><p class="n-head">${lead}You choose${b.with ? ` (talking to ${nHtmlEsc(b.with)})` : ''}:</p><ol>${b.choose.map(opt =>
      `<li><p class="n-opt"><b>${H(opt.label)}</b>${opt.tags.length ? ` <span class="n-tags">(${opt.tags.map(H).join('; ')})</span>` : ''}</p>${bl(opt.blocks)}</li>`).join('')}</ol></div>`;
    if (b.branch) return `<div class="n-branch">${b.branch.map(arm => `<div class="n-arm"><p class="n-head">${H(arm.head)}:</p>${arm.blocks.length ? bl(arm.blocks) : '<p class="muted">(nothing)</p>'}</div>`).join('')}</div>`;
    return '';
  }
  o.push(`<div class="narrative"><h1>${H(doc.title)}</h1><p class="n-meta">${H(doc.meta)}</p>`);
  if (doc.rumour) o.push(`<blockquote>${H(doc.rumour)}</blockquote>`);
  if (doc.teaser) o.push(`<p><b>Teaser:</b> ${H(doc.teaser)}</p>`);
  o.push('<h2>What it\'s about</h2>', doc.about.length ? doc.about.map(p => `<p>${H(p)}</p>`).join('') : '<p class="muted">No summary written yet. Add one on the story page (“What it\'s about”).</p>');
  if (doc.cast.length || doc.things.length) o.push('<h2>Who and what</h2><ul>',
    ...doc.cast.map(c => `<li><b>${H(c.name)}</b>${c.in.length ? `: ${c.in.map(H).join(', ')}` : ''}</li>`),
    ...doc.things.map(t => `<li><i>${H(t.name)}</i> ($${t.guide}${t.in.length ? `; ${t.in.map(H).join(', ')}` : ''}): ${t.tells.map(H).join(' ')}</li>`), '</ul>');
  if (doc.timeline.length) o.push('<h2>The month at a glance</h2><ul>', ...doc.timeline.map(t => `<li>${H(t.when)}: ${H(t.ref)}</li>`), '</ul>');
  o.push('<h2>The story</h2>');
  for (const s of doc.sections) o.push(`<section id="s${s.n}" class="n-sec"><h3>§${s.n}. ${H(s.title)} <button class="link n-edit" data-scene="${nHtmlEsc(s.scene)}">edit this scene</button></h3>`,
    `<p class="n-when">${s.when.map(H).join('. ')}.</p>`, bl(s.blocks), s.leads.length ? `<p class="n-leads"><b>This can lead to</b> ${s.leads.map(H).join('; ')}.</p>` : '', '</section>');
  for (const a of doc.around) o.push(`<h2>${H(a.title)}</h2>`, a.intro ? `<p>${H(a.intro)}</p>` : '', bl(a.blocks));
  o.push('<h2>Endings</h2><p>The first that holds:</p><ul>', ...doc.endings.list.map(e => `<li><b>${H(e.title)}</b>: ${H(e.how)}${e.set.length ? `. ${nCap(e.set.map(H).join('; '))}` : ''}.</li>`), '</ul>');
  if (doc.endings.none) o.push(`<p class="muted">${H(doc.endings.none)}</p>`);
  if (doc.epilogue.length) o.push('<h3>Epilogue lines</h3>', bl(doc.epilogue));
  if (doc.flags.length) o.push('<h2>What the story remembers</h2><table class="n-flags"><tr><th>Flag</th><th>Set in</th><th>Read by</th></tr>',
    ...doc.flags.map(f => `<tr><td><code>${nHtmlEsc(f.flag)}</code></td><td>${f.set.map(H).join(', ') || '<span class="muted">not in this story</span>'}</td><td>${f.read.map(H).join(', ') || '<span class="muted">nothing in this story</span>'}</td></tr>`), '</table>');
  if (doc.notes) o.push('<h2>Writer\'s notes</h2>', `<p>${H(doc.notes)}</p>`);
  o.push('</div>');
  return o.join('');
}

if (typeof module !== 'undefined') module.exports = { storyNarrative, narrativeMarkdown, narrativeHTML, narrativeApply, nHash };
