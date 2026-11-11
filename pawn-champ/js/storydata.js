// Pawn Champ - stories written as data. A story file in js/stories/ calls defineStory() with plain
// data (strictly JSON inside the call), and this file turns it into the same quest, characters,
// items, scenes, beats, nights, calendar entries and hooks a hand-written quest file registers.
// The odd bits of logic a story needs stay in code, as named hooks in js/quests/<id>.js.
// The format, step by step: docs/STORY_DATA.md. The checks: node tools/stories.js.
'use strict';

const STORIES = {};      // story id -> its data, as loaded
const STORY_HOOKS = {};  // code half -> { hook name: fn(ctx) }
// A story's code half registers its hooks here: storyHooks('fog', { sellFakes(ctx) { ... } }). The
// code half is js/quests/<id>.js, or the one a story names with "code": an arc's chapters share one
// (storyHooks('freezerarc', {...}) serves every story with "code": "freezerarc").
function storyHooks(id, hooks) { STORY_HOOKS[id] = Object.assign(STORY_HOOKS[id] || {}, hooks); }
const storyCode = id => (STORIES[id] && STORIES[id].code) || id;
// Scenes other stories hang on a cue in one of their own: cue -> [{ story, scene, if }]. A "cue" step
// plays them there (the vigil at Saint Brine's, the Annual Town Meeting), in load order.
const STORY_CUES = {};

// ---------------------------------------------------------------- conditions
// A condition is a short expression: flag.mott && !flag.haunted, coin >= 80, quest.grey,
// offer == 'deal', !strung. See docs/STORY_DATA.md#conditions for every name it knows.
const STORY_TOKEN = /\s*(\|\||&&|==|!=|>=|<=|[!()<>]|'(?:[^'\\]|\\.)*'|-?\d+(?:\.\d+)?|[A-Za-z_]\w*(?:\.[\w-]+)*)/y;
const storyExprCache = new Map();
function storyTokens(src) {
  const out = [];
  STORY_TOKEN.lastIndex = 0;
  let m;
  while (STORY_TOKEN.lastIndex < src.length) {
    const at = STORY_TOKEN.lastIndex;
    m = STORY_TOKEN.exec(src);
    if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw new Error(`can't read "${src.slice(at).trim()}" in the condition "${src}"`); }
    out.push(m[1]);
  }
  return out;
}
// compiles to a function of the scene context; throws on anything it can't read
function storyCompile(src) {
  if (storyExprCache.has(src)) return storyExprCache.get(src);
  const t = storyTokens(String(src));
  let i = 0;
  const peek = () => t[i], next = () => t[i++];
  const expect = s => { if (next() !== s) throw new Error(`expected ${s} in the condition "${src}"`); };
  const or = () => { let a = and(); while (peek() === '||') { next(); const l = a, r = and(); a = c => l(c) || r(c); } return a; };
  const and = () => { let a = not(); while (peek() === '&&') { next(); const l = a, r = not(); a = c => l(c) && r(c); } return a; };
  const not = () => { if (peek() === '!') { next(); const a = not(); return c => !a(c); } return cmp(); };
  const OPS = { '==': (a, b) => a === b, '!=': (a, b) => a !== b, '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '<': (a, b) => a < b };
  const cmp = () => {
    const a = atom();
    if (OPS[peek()]) { const op = OPS[next()], b = atom(); return c => op(a(c), b(c)); }
    return a;
  };
  const atom = () => {
    const k = next();
    if (k === undefined) throw new Error(`the condition "${src}" stops too soon`);
    if (k === '(') { const a = or(); expect(')'); return a; }
    if (k[0] === '\'') { const s = k.slice(1, -1).replace(/\\(.)/g, '$1'); return () => s; }
    if (/^-?\d/.test(k)) { const n = Number(k); return () => n; }
    if (k === 'true') return () => true;
    if (k === 'false') return () => false;
    if (k === 'null') return () => null;
    if (!/^[A-Za-z_]/.test(k)) throw new Error(`unexpected "${k}" in the condition "${src}"`);
    return c => storyName(k, c);
  };
  const fn = or();
  if (i < t.length) throw new Error(`unexpected "${t[i]}" in the condition "${src}"`);
  storyExprCache.set(src, fn);
  return fn;
}
function storyIf(cond, ctx) {
  if (cond === undefined || cond === true) return true;
  if (cond === false) return false;
  return !!storyCompile(cond)(ctx);
}
// a dotted name: game state (flag.x, coin, quest.x...) or one of the scene's own names
function storyName(name, ctx) {
  const [head, ...rest] = name.split('.');
  const dig = (v, path) => { for (const k of path) { if (v == null) return v; v = k === 'count' && Array.isArray(v) ? v.length : v[k]; } return v; };
  switch (head) {
    case 'flag': return dig((ctx && ctx.flags) || S.flags, rest);
    case 'seen': return !!(S.flags.seen && S.flags.seen[rest.join('.')]);
    case 'quest': return questActive(rest.join('.'));
    case 'ended': return endedAs(rest.join('.'));        // how another story ended (js/stay.js)
    case 'errand': return S.run && S.run.errands ? S.run.errands[rest.join('.')] : undefined; // the day it's planned for, -1 if missed
    case 'random': return Math.random();                 // a new number from 0 to 1 each time it's read
    case 'card': return typeof hasCard === 'function' && hasCard(rest.join('.'));
    case 'coin': case 'rep': case 'heat': case 'week': case 'day': return S[head];
    case 'month': return typeof monthNum === 'function' ? monthNum() : 1;
    case 'shelf': if (rest[0] === 'free') return shelfFree(); break;
    case 'bag':
      if (rest[0] === 'on') return bagOn();
      if (rest[0] === 'out') return bagOn() && !!S.bag && !!S.bag.out;
      break;
    case 'hook': return storyHook(ctx, rest[0], rest.length > 1 ? rest.slice(1).join('.') : undefined); // hook.x, or hook.x.y: x given 'y'
    case 'cue': return (ctx && ctx.cue) || null;            // the cue a scene was played from, if it was
    // friends and grudges (js/standing.js, docs/quests/STANDING.md)
    case 'standing': return standing(rest[0]);                       // -5 (enemy) to +5 (friend)
    case 'mood': return mood(rest[0]);                               // 'enemy', 'sore', 'neutral', 'warm' or 'friend'
    case 'said': return rest.length > 1 ? dig(said(rest[0], rest[1]), rest.slice(2)) : undefined; // an answer a regular remembers
    case 'ally': case 'foe': {                                       // who turns up for a moment: { id, name, look } or nothing
      const who = (head === 'ally' ? ally : foe)(rest[0]);
      return who ? dig(who, rest.slice(1)) : who;
    }
    case 'town': return typeof townHere === 'function' && townHere(rest[0]); // whether a regular is in town this month
    default:
      if (ctx && ctx.vars && head in ctx.vars) return dig(ctx.vars[head], rest);
      return undefined; // a name the scene hasn't set yet (an actor who didn't come) reads as nothing
  }
  throw new Error(`unknown name "${name}"`);
}
function storyHook(ctx, name, arg) {
  const code = storyCode(ctx.story);
  const h = (STORY_HOOKS[code] || {})[name];
  if (!h) throw new Error(`story ${ctx.story}: no hook "${name}" (add it with storyHooks('${code}', { ${name}(ctx) {...} }))`);
  return h(ctx, arg);
}

// ---------------------------------------------------------------- text
// {name} puts a value in a line: {silver.name|lower}, {fakes.count}, {it.name|lower|or:bell},
// {placed:fog-ferry} (the weekday a night landed on), {tonight:fog-ferry} ("tonight" or
// "Thursday night"), {when:x} ("tonight", "Thursday", "next Tuesday", "Monday of week 4"; nothing if
// it isn't planned), {bagWord} ("in your bag" or "on your shelves"), {hook:name}. Filters: lower,
// upper, cap (a capital first letter), money ($1,200) and or:x (x if there's nothing).
// A text can also be { "if": condition, "then": text, "else": text }: one or the other.
function storyText(text, ctx) {
  if (text && typeof text === 'object' && !Array.isArray(text)) return storyText(storyIf(text.if, ctx) ? text.then : text.else === undefined ? '' : text.else, ctx);
  if (typeof text !== 'string') return text;
  return text.replace(/\{([^{}]+)\}/g, (_, expr) => {
    const [base, ...filters] = expr.split('|');
    let v;
    if (base.startsWith('placed:')) v = placedDay(base.slice(7));
    else if (base.startsWith('tonight:')) { const d = placedDay(base.slice(8)); v = d === DAYS[S.day - 1] ? 'tonight' : d + ' night'; }
    else if (base.startsWith('when:')) v = storyWhen(base.slice(5));
    else if (base === 'bagWord') v = bagWord();
    else if (base.startsWith('hook:')) v = storyHook(ctx, base.slice(5));
    else v = storyName(base, ctx);
    for (const f of filters) {
      if (f === 'lower') v = v == null ? v : String(v).toLowerCase();
      else if (f === 'upper') v = v == null ? v : String(v).toUpperCase();
      else if (f === 'money') v = v == null ? v : money(v);
      else if (f === 'cap') v = v == null ? v : String(v).replace(/^./, ch => ch.toUpperCase());
      else if (f === 'money') v = v == null ? v : money(v);
      else if (f.startsWith('or:')) { if (v == null || v === '') v = f.slice(3); }
      else throw new Error(`unknown filter "${f}" in {${expr}}`);
    }
    return v == null ? '' : String(v);
  });
}
// the day a night or errand landed on, said from today: "tonight", "Thursday", "next Tuesday" or
// "Monday of week 4"; null if it isn't planned
function storyWhen(id) {
  const d = S.run && ((S.run.nights || {})[id] || (S.run.errands || {})[id]);
  if (!(d > 0)) return null;
  if (d === dayNum()) return 'tonight';
  const w = Math.ceil(d / 5), wd = DAYS[(d - 1) % 5];
  return w === S.week ? wd : w === S.week + 1 ? `next ${wd}` : `${wd} of week ${w}`;
}
// a line that changes with the day: "toast": [...], "pick": "day"
// or "pick": "random" for one at random
function storyLine(v, step, ctx) {
  if (Array.isArray(v) && step.pick === 'day') v = v[(S.day - 1) % v.length];
  else if (Array.isArray(v) && step.pick === 'random') v = pick(v);
  return storyText(v, ctx);
}

// ---------------------------------------------------------------- things in scenes
function storyLook(ref, ctx) {
  if (ref == null) return null;
  if (typeof ref === 'string' && ref.includes('{')) {           // a look named by a value: "{ally.witness.id}"
    const id = storyText(ref, ctx);
    return (CAST[id] && CAST[id].look) || null;
  }
  const a = ctx.vars[ref];
  if (a && a.look) return a.look;
  if (CAST[ref]) return CAST[ref].look;
  throw new Error(`story ${ctx.story}: no actor or character "${ref}"`);
}
function storyActor(ref, ctx) {
  const a = ctx.vars[ref];
  if (!a || !a.look) throw new Error(`story ${ctx.story}, scene ${ctx.scene}: no actor "${ref}" here`);
  return a;
}
// see-through, by name: "alpha": "ghost" (the dead) or "faint" (far off in the fog), or a number
const STORY_ALPHAS = { ghost: GHOST, faint: 0.42 };
const storyHas = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
function storyAlpha(v) { return storyHas(STORY_ALPHAS, v) ? STORY_ALPHAS[v] : v; }
// A crowd is one actor written once with several places: "id": "ghost", "at": [[206, 150],
// [228, 154]] makes ghost1 and ghost2, alike but for where they stand.
function storyCrowd(spec) {
  if (!Array.isArray(spec.at) || !Array.isArray(spec.at[0])) return [spec];
  return spec.at.map((at, i) => ({ ...spec, id: spec.id + (i + 1), at }));
}
// { "id": "mott", "cast": "mott", "at": [330, 158], "alpha": "ghost", "facingLeft": true }
// or "look": "ghost" / "random" / "kid" (a random child) / "hooded" (one of the Pack) for a passer-by, with a "name"
// An actor whose "if" doesn't hold isn't there, and its name reads as nothing. Two actors can
// share an id with different "if"s, so the scene says one name whichever of them came.
function storyMakeActors(specs, ctx) {
  const all = specs.flatMap(storyCrowd);
  for (const a of all) ctx.vars[a.id] = null;
  for (const a of all) storyMakeActor(a, ctx);
}
function storyMakeActor(spec, ctx) {
  if (spec.if !== undefined && !storyIf(spec.if, ctx)) return null; // (its name was cleared first)
  let look = spec.look === 'ghost' ? ghostLook() : spec.look === 'random' ? randomLook() : spec.look === 'kid' ? { ...randomLook(), kid: true }
    : spec.look === 'hooded' ? hoodedCultistLook() : CAST[spec.cast].look; // hooded: one of the Pack (js/quests/psalter.js)
  if (spec.outfit) look = { ...look, ...spec.outfit }; // look fields laid over it: a passer-by in a hoodie
  const o = { name: spec.name !== undefined ? storyText(spec.name, ctx) : spec.cast ? CAST[spec.cast].name : '' };
  if (spec.alpha !== undefined) o.alpha = storyAlpha(spec.alpha);
  if (spec.facingLeft) o.facingLeft = true;
  const a = makeActor(look, spec.at[0], spec.at[1], o);
  ctx.vars[spec.id] = a;
  if (spec.id === 'keeper') keeper = a; // the keeper the shop's own code talks through, as placeKeeper() sets
  return a;
}
// { "item": "compass", "cond": 2, "mark": "...", "name": "..." } or { "unique": "dittyBag" }, which
// can set fields on the item too: { "unique": "key13", "paid": 13 }
function storyMakeItem(spec) {
  if (spec.unique) { const { unique, ...o } = spec; return Object.assign(makeUnique(unique), o); }
  const { item, ...o } = spec;
  return makeItem(item, o);
}
// { "cat": ["silver", "jewelry"], "fake": false }: true/false test truthiness, a list means any of
function storyMatch(m) {
  const keys = Object.keys(m || {});
  return it => keys.every(k => {
    const want = m[k], v = it[k];
    if (want === true) return !!v;
    if (want === false) return !v;
    if (Array.isArray(want)) return want.includes(v);
    return v === want;
  });
}

// ---------------------------------------------------------------- steps
// Every kind of step, each in one place: its fields, how the editor shows it, and how it plays.
//   fields   { key: type }, the kind's own key first. Types are under "the shapes of things" below.
//   instant  it takes effect at once with nothing on screen, so an epilogue or a night's test can
//            use it
//   says     [label, sentence] for the editor: {key} shows that field, {?key} shows nothing, and a
//            part in [brackets] shows only when every key in it is there
//   example  a new step of this kind, for the editor to add
//   sets(s)  names the step sets beyond its "name" fields (see checkStory)
//   run(s, ctx) plays it: returns a promise if it waits, STORY_END to stop the scene
// Every step can also have "if" (it only happens when that holds) and "note" (for people).
// docs/STORY_DATA.md#steps has a row for each; tools/stories.js checks they're all there.
const STORY_END = Symbol('end');
const STORY_STEP_COMMON = { if: 'cond?', note: 'string?' };
const STORY_STEPS = {
  say: {
    fields: { say: 'who', text: 'text' }, says: ['line', '{say}: {text}'], example: { say: 'someone', text: 'A line.' },
    run(s, ctx) {
      const a = storyActor(s.say, ctx);
      const lines = Array.isArray(s.text) ? s.text : [s.text];
      return (async () => { for (const l of lines) await say(a, storyText(l, ctx)); })();
    }
  },
  narrate: {
    fields: { narrate: 'text' }, says: ['narration', '{narrate}'], example: { narrate: '' },
    run(s, ctx) {
      const lines = Array.isArray(s.narrate) ? s.narrate : [s.narrate];
      return (async () => { for (const l of lines) await narrate(storyText(l, ctx)); })();
    }
  },
  choose: {
    fields: { choose: 'option[]', as: 'name?', with: 'regular?' }, says: ['choice', 'the player chooses[ (talking to {with})]'],
    example: { choose: [{ label: 'Yes', then: [] }, { label: 'No', then: [] }] },
    async run(s, ctx) {
      const shown = s.choose.filter(o => o.if === undefined || storyIf(o.if, ctx));
      const opts = shown.map(o => {
        const off = o.disabled !== undefined && storyIf(o.disabled, ctx);
        const src = off && o.off ? { ...o, ...o.off } : o;
        const out = { label: storyText(src.label, ctx) };
        if (o.disabled !== undefined) out.disabled = off;
        if (src.hint !== undefined) out.hint = storyText(src.hint, ctx);
        if (src.icon !== undefined) out.icon = storyText(src.icon, ctx);
        if (o.needs) out.needs = o.needs;
        if (o.card) out.card = true; // a choice a card opened (js/cards.js): it shows as one
        if (o.without) out.without = storyText(o.without, ctx);
        // talking to a regular: what each answer does to how they feel (respond() in js/standing.js)
        for (const k of ['tone', 'sway', 'save', 'value']) if (s.with && o[k] !== undefined) out[k] = o[k];
        return out;
      });
      const i = await (s.with ? respond(null, s.with, opts) : choose(opts));
      const picked = shown[i];
      if (s.as) ctx.vars[s.as] = i;
      if (!picked || !picked.then) return undefined;
      // "music": a track that plays while this option's steps do (Sound.during)
      return picked.music ? Sound.during(picked.music, () => Promise.resolve(runStorySteps(picked.then, ctx)))() : runStorySteps(picked.then, ctx);
    }
  },
  // a block: { "if": ..., "then": [...], "else": [...] }
  if: {
    fields: { if: 'cond', then: 'steps', else: 'steps?' }, instant: true, says: ['if', 'if {if}'], example: { if: 'flag.something', then: [] },
    run(s, ctx) { const branch = storyIf(s.if, ctx) ? s.then : s.else; return branch ? runStorySteps(branch, ctx) : undefined; }
  },
  set: {
    fields: { set: 'object' }, instant: true, says: ['remember', '{set}'], example: { set: { something: true } },
    // a list or an object is copied, so the game never changes the story's own data
    run(s) { for (const [k, v] of Object.entries(s.set)) S.flags[k] = v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; }
  },
  rep: {
    fields: { rep: 'number', why: 'text?' }, instant: true, says: ['reputation', '{rep}[ {why}]'], example: { rep: 1 },
    run(s, ctx) { change('rep', s.rep, s.why === undefined ? undefined : storyText(s.why, ctx)); }
  },
  coin: {
    fields: { coin: 'number', why: 'text?' }, instant: true, says: ['money', '{coin}[ {why}]'], example: { coin: 10, why: 'Why, for the ledger' },
    run(s, ctx) { change('coin', s.coin, s.why === undefined ? undefined : storyText(s.why, ctx)); }
  },
  heat: {
    fields: { heat: 'number', why: 'text?' }, instant: true, says: ['police heat', '{heat}[ {why}]'], example: { heat: 1 },
    run(s, ctx) { change('heat', s.heat, s.why === undefined ? undefined : storyText(s.why, ctx)); }
  },
  toast: {
    fields: { toast: 'text', look: 'look?', icon: 'icon?', pick: '\'day\'|\'random\'?' }, instant: true,
    says: ['pop-up', '[one of these, by {pick}: ]{toast}'], example: { toast: '' },
    run(s, ctx) { toast(storyLine(s.toast, s, ctx), storyLook(s.look, ctx), s.icon); }
  },
  leave: {
    fields: { leave: 'who', hurry: 'bool?' }, says: ['leaves', '{leave} leaves the shop[{?hurry}, in a hurry]'], example: { leave: 'someone' },
    run(s, ctx) { return leaveShop(storyActor(s.leave, ctx), s.hurry); }
  },
  stage: {
    fields: { stage: 'place', view: 'object?', actors: 'actor[]?', fadeOut: 'bool?', fadeIn: 'bool?' }, says: ['place', '{stage}[ ({view})][ with {actors}]'],
    example: { stage: 'shop', actors: [{ id: 'you', cast: 'keeper', name: 'You', at: [110, 164] }] },
    async run(s, ctx) {
      if (s.fadeOut !== false) await fadeOut();
      view.bg = s.stage;
      if (s.view) Object.assign(view, s.view);
      clearActors();
      storyMakeActors(s.actors || [], ctx);
      if (s.fadeIn !== false) await fadeIn(); // both false: a straight cut, mid-scene
    }
  },
  enter: {
    fields: { enter: 'actor' }, says: ['enters', '{enter} appears'], example: { enter: { id: 'stranger', look: 'random', name: 'A stranger', at: [200, 160] } },
    run(s, ctx) { storyMakeActors([s.enter], ctx); }
  },
  walk: {
    fields: { walk: 'who', to: 'point' }, says: ['walks', '{walk} walks over'], example: { walk: 'someone', to: [160, 160] },
    run(s, ctx) { return walkTo(storyActor(s.walk, ctx), s.to[0], s.to[1]); }
  },
  face: {
    fields: { face: 'who', left: 'bool?' }, says: ['turns', '{face} turns[{?left} to the left]'], example: { face: 'someone', left: true },
    run(s, ctx) { storyActor(s.face, ctx).facingLeft = !!s.left; }
  },
  remove: {
    fields: { remove: 'who' }, says: ['goes', '{remove} goes'], example: { remove: 'someone' },
    run(s, ctx) { const a = ctx.vars[s.remove]; if (a) removeActor(a); }
  },
  view: {
    fields: { view: 'object' }, instant: true, says: ['scene', '{view}'], example: { view: { fog: true } },
    // a value that's words can hold {names}: { "counterIcon": "{it.icon}" }
    run(s, ctx) { for (const [k, v] of Object.entries(s.view)) view[k] = typeof v === 'string' ? storyText(v, ctx) : v; }
  },
  offer: {
    fields: { offer: 'item', as: 'name?', result: 'name?', persona: 'persona?', asking: 'number', min: 'number?', onWatch: '\'continue\'?' },
    says: ['haggle', 'offers {offer}, asking ${asking}[, lowest ${min}][ ({persona})]'], example: { offer: { item: 'ring' }, asking: 40 },
    sets: s => [s.result || 'offer'],
    async run(s, ctx) {
      const item = storyMakeItem(s.offer);
      if (s.as) ctx.vars[s.as] = item;
      const r = await counterSale(ctx.c, item, { persona: s.persona, asking: s.asking, min: s.min });
      ctx.vars[s.result || 'offer'] = r;
      if (r === 'watch' && s.onWatch !== 'continue') return STORY_END; // the police took them away
    }
  },
  find: {
    fields: { find: 'name', in: '\'stock\'|\'bag\'|\'forSale\'', match: 'object?', all: 'bool?', cheapest: 'bool?' }, instant: true,
    says: ['looks for', '{find} ({in})[ that is {match}][{?all}, all of them][{?cheapest}, cheapest first]'],
    example: { find: 'thing', in: 'stock', match: { key: 'ring' } },
    run(s, ctx) {
      const pred = storyMatch(s.match);
      let v;
      if (s.in === 'bag') v = fromBag(pred);
      else {
        let list = s.in === 'forSale' ? forSale() : S.stock;
        list = list.filter(pred);
        if (s.cheapest) list = list.slice().sort((p, q) => p.guide - q.guide);
        v = s.all ? list : list[0] || null;
      }
      ctx.vars[s.find] = v;
    }
  },
  take: {
    fields: { take: 'thing' }, instant: true, says: ['takes', 'the {take} out of stock'], example: { take: 'thing' },
    run(s, ctx) { const it = ctx.vars[s.take]; if (it) removeFromStock(it); }
  },
  sell: {
    fields: { sell: 'thing', to: 'string?' }, says: ['sells', 'the {sell}[ (to {to})]'], example: { sell: 'thing' },
    run(s, ctx) { const it = ctx.vars[s.sell]; if (!it) return; removeFromStock(it); S.stats.sold++; onSold(it, s.to); }
  },
  add: {
    fields: { add: 'item', as: 'name?' }, instant: true, says: ['stock', 'puts {add} on the shelves'], example: { add: { item: 'ring' } },
    run(s, ctx) { const it = storyMakeItem(s.add); S.stock.push(it); if (s.as) ctx.vars[s.as] = it; }
  },
  edit: {
    fields: { edit: 'thing', set: 'object?', price: 'object?', clue: 'text?' }, instant: true,
    says: ['changes', 'the {edit}[: {set}][, price {price}][, a clue: {clue}]'], example: { edit: 'thing', price: { times: 0.8 } },
    run(s, ctx) {
      const it = ctx.vars[s.edit];
      if (!it) return;
      if (s.set) Object.assign(it, JSON.parse(JSON.stringify(s.set))); // a copy: the item mustn't share the story's data
      if (s.price) it.guide = Math.max(s.price.min || 0, Math.round(it.guide * s.price.times));
      if (s.clue) it.clues = [...(it.clues || []), { text: storyText(s.clue, ctx) }];
    }
  },
  use: {
    fields: { use: 'tag', as: 'name?', hard: 'bool?' }, says: ['uses', 'the best thing in the bag for: {use}'], example: { use: 'light', as: 'used' },
    run(s, ctx) { const it = useItem(s.use, s.hard ? { hard: true } : undefined); if (s.as) ctx.vars[s.as] = it; }
  },
  // the player chose to Look (the deep set, js/quests/deep.js): one more Look this run, and the
  // sounding is kept in the Storybook for good
  sounding: {
    fields: { sounding: 'sounding' }, instant: true, says: ['Look', 'the player Looks, and finds the sounding {sounding}'], example: { sounding: 'someSounding' },
    run(s) { deepLook(s.sounding); }
  },
  // a deed that moves a regular's standing (js/standing.js): it can make a friend or an enemy
  sway: {
    fields: { sway: 'regular', by: 'number', why: 'text?' }, instant: true, says: ['standing', '{sway} {by}[ ({why})]'], example: { sway: 'dot', by: 1, why: 'Why, for the ledger' },
    run(s, ctx) { sway(s.sway, s.by, s.why === undefined ? undefined : storyText(s.why, ctx)); }
  },
  plan: {
    fields: { plan: 'errand', after: 'number?' }, instant: true, says: ['plans', 'the errand {plan}'], example: { plan: 'someErrand' },
    run(s) { planErrand(s.plan, s.after); }
  },
  // sets each flag to one of its list, at random: { "roll": { "bingoEnd": ["exposed", "lady"] } }
  roll: {
    fields: { roll: 'object' }, instant: true, says: ['at random', '{roll}'], example: { roll: { something: ['this', 'that'] } },
    run(s) { for (const [k, v] of Object.entries(s.roll)) S.flags[k] = pick(v); }
  },
  // a hook used where steps must happen at once (an epilogue, a test) mustn't wait
  hook: {
    fields: { hook: 'hook', sets: 'name[]?', with: 'any?' }, instant: true, says: ['code', 'runs the hook {hook}[, with {with}]'], example: { hook: 'someHook' },
    run(s, ctx) { return storyHook(ctx, s.hook, s.with); }
  },
  // a scene at the counter carries on with the same customer
  run: {
    fields: { run: 'scene' }, says: ['plays', '{run}'], example: { run: 'someScene' },
    run(s, ctx) { const fn = story[s.run]; return fn.storyCustomer && ctx.c ? fn(ctx.c) : fn(); }
  },
  // other stories' scenes hung on this cue ("cues" in their files) play here, each if its story is in
  // the run and its "if" holds; they know where they are by the name "cue"
  cue: {
    fields: { cue: 'string' }, says: ['others join', 'other stories\' scenes for "{cue}" play here'], example: { cue: 'someCue' },
    async run(s) {
      for (const e of (STORY_CUES[s.cue] || [])) {
        if (!questActive(e.story) || (e.if !== undefined && !storyIf(e.if, storyCtx(e.story, 'cue ' + s.cue)))) continue;
        await story[e.scene](null, s.cue);
      }
    }
  },
  end: {
    fields: { end: 'any' }, instant: true, says: ['ends', 'the scene ends here'], example: { end: true },
    run() { return STORY_END; }
  },
  line: {
    fields: { line: 'text' }, instant: true, says: ['ending line', '{line}'], example: { line: '' },
    run(s, ctx) { ctx.lines.push(storyText(s.line, ctx)); }
  },
  refresh: {
    fields: { refresh: 'any' }, instant: true, says: ['panel', 'the side panel updates'], example: { refresh: 'panel' },
    run() { renderPanel(); }
  }
};
// a step's kind is its first key that names one ("edit" in { "edit": "x", "set": {...} }); a step
// with "then" is an if-block
function storyKind(s) { return 'then' in s ? 'if' : Object.keys(s).find(k => k !== 'if' && storyHas(STORY_STEPS, k)); }
// Runs steps in order. Steps that don't wait (set, toast, line...) run at once, and the call only
// returns a promise once a step has to wait, so a list of them (an epilogue, a night's test setup)
// takes effect synchronously. Returns STORY_END when a step says "end".
function runStorySteps(steps, ctx, from = 0) {
  for (let i = from; i < steps.length; i++) {
    const r = runStoryStep(steps[i], ctx);
    if (r && typeof r.then === 'function') return r.then(v => v === STORY_END ? STORY_END : runStorySteps(steps, ctx, i + 1));
    if (r === STORY_END) return STORY_END;
  }
}
function runStoryStep(s, ctx) {
  const kind = storyKind(s);
  if (!kind) throw new Error(`story ${ctx.story}, scene ${ctx.scene}: a step with nothing to do: ${JSON.stringify(s)}`);
  if (kind !== 'if' && s.if !== undefined && !storyIf(s.if, ctx)) return undefined;
  return STORY_STEPS[kind].run(s, ctx);
}
function storyCtx(id, scene, c) { return { story: id, scene, c: c || null, vars: {}, lines: null }; }

// ---------------------------------------------------------------- loading a story
// the parts of a story file that aren't the quest's own fields
const STORY_PARTS = ['about', 'notes', 'code', 'cast', 'icons', 'uniques', 'soundings', 'overheard', 'spots', 'scenes', 'beats', 'nights', 'errands', 'hub', 'vignettes', 'cues', 'calendar', 'mornings',
  'afterwards', 'sold', 'epilogue', 'talk', 'fallout', 'outcome', 'teaser'];
// "outcome": [{ "if": "flag.ghostFakes", "ending": "tycoon" }, ...]: the first that holds; or a
// name, like "flag.royceEnd", whose value is the ending
function storyOutcome(d) {
  if (typeof d.outcome === 'string') return f => storyName(d.outcome, { story: d.id, flags: f, vars: {} }) || null;
  return f => { const ctx = { story: d.id, flags: f, vars: {} }; const o = d.outcome.find(x => storyIf(x.if, ctx)); return o ? o.ending : null; };
}
function defineStory(d) {
  STORIES[d.id] = d;
  Object.assign(CAST, d.cast || {});
  const q = {};
  for (const [k, v] of Object.entries(d)) {
    if (STORY_PARTS.includes(k)) continue;
    q[k] = v;
    if (k === 'endings' && d.outcome) q.outcome = storyOutcome(d);
  }
  if (d.outcome && !q.outcome) q.outcome = storyOutcome(d);
  // a teaser can depend on the story so far ({ "if", "then", "else" }), read whenever it's shown
  if (d.teaser !== undefined) {
    if (typeof d.teaser === 'string') q.teaser = d.teaser;
    else Object.defineProperty(q, 'teaser', { enumerable: true, get: () => storyText(d.teaser, storyCtx(d.id, 'teaser')) });
  }
  // "requires": a condition on the game so far, checked when a later month of a stay is drawn
  if (typeof d.requires === 'string') q.requires = () => storyIf(d.requires, storyCtx(d.id, 'requires'));
  defineQuest(q);
  Object.assign(ICONS, d.icons || {});
  for (const [id, u] of Object.entries(d.uniques || {})) {
    // "wantedKnown": a condition: whether you know who wants it
    addUnique(id, typeof u.wantedKnown === 'string' ? { ...u, wantedKnown: () => storyIf(u.wantedKnown, storyCtx(d.id, 'unique ' + id)) } : u);
  }
  // the deep set's soundings (js/quests/deep.js): { id: the line the Storybook keeps }
  for (const [id, text] of Object.entries(d.soundings || {})) addSounding(id, text);
  // lines a customer in the queue can be overheard saying (js/secrets.js), "if" a condition holds
  for (const o of (d.overheard || [])) {
    addOverheard(typeof o.line === 'string' ? o.line : () => storyText(o.line, storyCtx(d.id, 'overheard')),
      o.if === undefined ? undefined : () => storyIf(o.if, storyCtx(d.id, 'overheard')));
  }
  // things to click in a place (js/scenespots.js): { "place": [{ "id", "rect", "lines", ... }] }
  for (const [place, list] of Object.entries(d.spots || {})) for (const { note, ...spot } of list) addSceneSpot(place, spot);
  for (const [name, sc] of Object.entries(d.scenes || {})) {
    const fn = async (c, cue) => {
      const ctx = storyCtx(d.id, name, c);
      ctx.cue = cue || null; // played from another story's cue step
      if (sc.customer && c) ctx.vars[sc.customer] = c.actor;
      await runStorySteps(sc.steps, ctx);
    };
    fn.storyScene = d.id + '.' + name;
    story[name] = sc.music === 'eerie' ? Sound.eerie(fn) : sc.music ? Sound.during(sc.music, fn) : fn;
    if (sc.customer) story[name].storyCustomer = true;
  }
  // "hub": an evening that carries vignettes from several stories (addHub, js/runs.js). A "town" hub
  // isn't this story's: it happens whenever one of its vignettes' stories is in the run.
  if (d.hub) {
    const h = d.hub, e = { title: h.title, where: h.where, window: h.window };
    if (h.picks !== undefined) e.picks = h.picks;
    if (h.weekdays) e.weekdays = h.weekdays;
    if (h.open) e.open = () => { if (!h.town && questActive(d.id)) questMet(d.id); return story[h.open](); }; // (another story's vignettes can bring it into a run without this one)
    if (h.close) e.close = () => story[h.close]();
    if (h.test) e.test = () => { runStorySteps(h.test, storyCtx(d.id, 'test hub ' + h.id)); };
    storyOutside(h.town, () => addHub(h.id, e));
  }
  // "vignettes": this story's part of a hub evening, one scene each, offered "if" a condition holds.
  // A "town" vignette is ordinary business: it's on the evening whichever stories brought it into the run.
  for (const v of (d.vignettes || [])) {
    const e = { label: v.label, run: () => story[v.scene]() };
    if (v.crossing) e.crossing = true;
    if (v.if !== undefined) e.when = () => storyIf(v.if, storyCtx(d.id, 'vignette ' + v.scene));
    storyOutside(v.town, () => addVignette(v.hub, e));
  }
  // "cues": this story's scenes that play inside another story's scene, at its "cue" step
  for (const e of (d.cues || [])) (STORY_CUES[e.cue] = STORY_CUES[e.cue] || []).push({ story: d.id, scene: e.scene, if: e.if });
  // "afterwards": steps run every morning of every run, drawn or not: what the story leaves behind
  // for the later months of a stay (the sea keeps leaving things on your step)
  if (d.afterwards) HOOKS.morning.push(() => runStorySteps(d.afterwards, storyCtx(d.id, 'afterwards')));
  if (d.mornings) HOOKS.morning.push(scoped(() => runStorySteps(d.mornings, storyCtx(d.id, 'mornings'))));
  for (const b of (d.beats || [])) {
    if (b.drift) {
      const e = { cast: b.cast, run: story[b.scene] };
      if (b.last) e.last = true;
      if (b.first) e.first = true;
      if (b.if !== undefined) e.when = () => storyIf(b.if, storyCtx(d.id, 'beat ' + b.drift));
      addDriftBeat(b.drift, b.from, b.to, e, b.offset);
    } else if (b.every) { // a visit on every day from one day to another, "if" it holds that day
      const e = { cast: b.cast, run: story[b.scene] };
      if (b.last) e.last = true;
      if (b.first) e.first = true;
      if (b.if !== undefined) e.when = () => storyIf(b.if, storyCtx(d.id, 'beat ' + b.every));
      for (let n = dayOf(b.from); n <= dayOf(b.to); n++) addBeat(dayKey(n), 'customers', e);
    } else if (b.steps) { // a night: it plays if its condition holds
      addBeat(b.at, 'nights', () => { const ctx = storyCtx(d.id, 'night ' + b.at); return storyIf(b.if, ctx) ? Promise.resolve(runStorySteps(b.steps, ctx)) : null; });
      if (b.first) SCRIPT[b.at].nights.unshift(SCRIPT[b.at].nights.pop()); // before the night's others
    } else {
      const e = { cast: b.cast, run: story[b.scene] };
      if (b.alpha !== undefined) e.alpha = storyAlpha(b.alpha);
      if (b.last) e.last = true;
      if (b.first) e.first = true;
      if (b.if !== undefined) e.when = () => storyIf(b.if, storyCtx(d.id, 'beat ' + b.at));
      storyOutside(b.town, () => addBeat(b.at, 'customers', e)); // a "town" visit comes in any run
    }
  }
  for (const n of (d.nights || [])) {
    const e = { id: n.id, window: n.window, run: () => story[n.scene]() };
    if (n.weekdays) e.weekdays = n.weekdays;
    if (n.if !== undefined) e.when = () => storyIf(n.if, storyCtx(d.id, 'night ' + n.id));
    if (n.test) e.test = () => { runStorySteps(n.test, storyCtx(d.id, 'test ' + n.id)); };
    questNight(e);
  }
  for (const n of (d.errands || [])) {
    const e = { id: n.id, title: n.title, where: n.where, run: () => story[n.scene]() };
    if (n.test) e.test = () => { runStorySteps(n.test, storyCtx(d.id, 'test ' + n.id)); };
    questErrand(e);
  }
  for (const e of (d.calendar || [])) {
    const c = {};
    for (const [k, v] of Object.entries(e)) {
      if (k === 'known') c[k] = v === true ? () => true : () => storyIf(v, storyCtx(d.id, 'calendar ' + e.id));
      // a "where" or "title" that depends on a condition reads it whenever the calendar shows it
      else if ((k === 'where' || k === 'title') && v && typeof v === 'object') Object.defineProperty(c, k, { enumerable: true, get: () => S ? storyText(v, storyCtx(d.id, 'calendar ' + e.id)) : storyText(v.else || '', null) });
      // so does a "bring" that depends on one: { "if": ..., "then": ["call"], "else": [] }
      else if (k === 'bring' && v && !Array.isArray(v)) Object.defineProperty(c, k, { enumerable: true, get: () => (S && storyIf(v.if, storyCtx(d.id, 'calendar ' + e.id)) ? v.then : v.else) || [] });
      else c[k] = v;
    }
    storyOutside(e.story === 'town', () => addCalendar(c)); // a town hub's entry shows in every run that has it
  }
  // "sold": { unique id: steps }: what happens when that item is sold, however it goes (from the
  // shelf, to a story customer, to the ghosts). The steps call it "it", and how it went "how".
  if (d.sold) HOOKS.sold.push(scoped((it, how) => {
    const steps = it && it.uniqueId && storyHas(d.sold, it.uniqueId) ? d.sold[it.uniqueId] : null;
    if (!steps) return;
    const ctx = storyCtx(d.id, 'sold ' + it.uniqueId);
    ctx.vars.it = it; ctx.vars.how = how === undefined ? null : how;
    runStorySteps(steps, ctx);
  }));
  if (d.epilogue) HOOKS.ending.push(scoped((title, lines) => { const ctx = storyCtx(d.id, 'epilogue'); ctx.lines = lines; runStorySteps(d.epilogue, ctx); }));
  // "talk": what a regular says about it, and its "sway": { ending: { regular: n } }, how each ending
  // moves the regulars (js/standing.js)
  if (d.talk && typeof TOWN_TALK !== 'undefined') TOWN_TALK[d.id] = d.talk;
  // "fallout": { ending: { "id": regular, "mood": "gone" or "cold", "line", "after" } } (js/town.js)
  if (d.fallout && typeof TOWN_FALLOUT !== 'undefined') TOWN_FALLOUT[d.id] = d.fallout;
  endQuestScope();
}

// registers something as the town's rather than the story's (outside its quest's scope)
function storyOutside(town, fn) {
  if (!town) return fn();
  const was = questScope;
  questScope = null;
  try { fn(); } finally { questScope = was; }
}

// ---------------------------------------------------------------- the shapes of things
// A field's type: a name from STORY_TYPES or STORY_RECORDS, or 'a'|'b' for one of those words.
// "x[]" is a list of them, and "x?" may be left out. The checker walks a story by these types, and
// the editor shows each field by its type.
// A type's check returns true, or what's wrong. c is the checking context (checkStory, below).
const STORY_BUILTIN_PLACES = ['shop', 'shopNight', 'docks', 'office', 'lighthouse', 'clockshop', 'graveyard', 'marsh', 'arcade'];
const storyPoint = v => Array.isArray(v) && v.length === 2 && v.every(n => typeof n === 'number');
const STORY_TYPES = {
  any: () => true,
  string: v => typeof v === 'string' || 'should be words',
  number: v => typeof v === 'number' || 'should be a number',
  bool: v => typeof v === 'boolean' || 'should be true or false',
  object: v => (!!v && typeof v === 'object' && !Array.isArray(v)) || 'should be { "field": value }',
  point: v => storyPoint(v) || 'should be [x, y]',
  rect: v => (!!v && typeof v === 'object' && Object.keys(v).join() === 'x,y,w,h' && Object.values(v).every(n => typeof n === 'number')) || 'should be { "x", "y", "w", "h" }',
  spot: v => storyPoint(v) || (Array.isArray(v) && v.length > 1 && v.every(storyPoint)) || 'should be [x, y], or a list of them for a crowd',
  when: v => /^\d+-[1-5]$/.test(v) || 'should be "week-day", like "3-1"',
  alpha: v => (typeof v === 'number' && v >= 0 && v <= 1) || storyHas(STORY_ALPHAS, v) || `should be from 0 to 1, or ${Object.keys(STORY_ALPHAS).join(' or ')}`,
  text: (v, c) => storyCheckText(v, c),             // a line, or a list of lines, that can hold {names}
  cond: (v, c) => storyCheckCond(v, c),             // a condition (#conditions)
  name: v => /^[A-Za-z_]\w*$/.test(v) || 'should be a name, like "silver"', // a name this sets
  who: (v, c) => c.declared.has(v) || `no actor "${v}" in this scene`,
  thing: (v, c) => c.declared.has(v) || `nothing called "${v}" was found in this scene`,
  look: (v, c) => (typeof v === 'string' && v.includes('{') ? storyCheckText(v, c) : c.declared.has(v) || c.castOk(v) || `no actor or character "${v}"`),
  cast: (v, c) => c.castOk(v) || `no character "${v}"`,
  item: (v, c) => !v || typeof v !== 'object' ? 'an item is { "item": key } or { "unique": id }'
    : v.unique ? !!UNIQUES[v.unique] || storyHas(c.d.uniques, v.unique) || `no unique "${v.unique}"`
    : !!ITEMS[v.item] || `no item "${v.item}"`,
  tag: v => typeof TAGS === 'undefined' || storyHas(TAGS, v) || `"${v}" is not a tag in js/bag.js`,
  scene: (v, c) => storyHas(c.d.scenes, v) || storyHas(story, v) || `no scene "${v}"`,
  hub: (v, c) => storyHas(HUBS, v) || (!!c.d.hub && c.d.hub.id === v) || `no hub "${v}"`,
  errand: (v, c) => storyHas(ERRANDS, v) || (c.d.errands || []).some(e => e.id === v) || `no errand "${v}"`,
  place: v => storyHas(PLACES, v) || STORY_BUILTIN_PLACES.includes(v) || `no place "${v}"`,
  hook: (v, c) => storyHas(c.hooks, v) || `no hook "${v}" (add it in js/quests/${c.d.code || c.d.id}.js)`,
  icon: (v, c) => storyHas(ICONS, v) || storyHas(c.d.icons, v) || `no icon "${v}"`,
  persona: v => storyHas(PERSONAS, v) || `no persona "${v}"`,
  track: v => typeof Soundtrack === 'undefined' || storyHas(Soundtrack.TRACKS, v) || `no track "${v}"`,
  sounding: (v, c) => (typeof SOUNDINGS !== 'undefined' && storyHas(SOUNDINGS, v)) || storyHas(c.d.soundings, v) || `no sounding "${v}"`,
  regular: v => (typeof STANDING_ROLES !== 'undefined' && storyHas(STANDING_ROLES, v)) || `"${v}" is not one of the regulars in js/standing.js`,
  tone: v => (typeof TONES === 'undefined' || TONES.includes(v)) || `a tone is ${TONES.join(', ')}`,
  // { ending: { regular: n } }: how each ending moves the regulars
  sway: (v, c) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return 'should be { "ending": { "regular": 1 } }';
    for (const [end, row] of Object.entries(v)) {
      if (!storyHas(c.d.endings, end)) return `no ending "${end}"`;
      for (const [who, n] of Object.entries(row || {})) {
        const r = STORY_TYPES.regular(who);
        if (r !== true) return r;
        if (typeof n !== 'number') return `${end}: ${who} should be a number`;
      }
    }
    return true;
  }
  // and two kinds of step list, walked by storyCheckSteps: "steps", and "quick" for steps that
  // must take effect at once (an epilogue, a night's test setup)
};
// things made of fields, like a step: fields as for a step; check(x) for anything across fields;
// sets(x) for names it sets beyond its "name" fields
const STORY_RECORDS = {
  sceneData: { fields: { title: 'string?', music: 'track?', customer: 'name?', steps: 'steps', note: 'string?' } },
  option: { fields: { label: 'text', if: 'cond?', disabled: 'cond?', off: 'off?', hint: 'text?', icon: 'text?', needs: 'tag?', without: 'text?', music: 'track?', card: 'bool?',
    tone: 'tone?', sway: 'number?', save: 'string?', value: 'any?', then: 'steps?', note: 'string?' } }, // tone, sway, save, value: in a choice "with" a regular
  off: { fields: { label: 'text?', hint: 'text?' } },  // an option's words while it's greyed out
  actor: {
    fields: { id: 'string', cast: 'cast?', look: '\'ghost\'|\'random\'|\'kid\'|\'hooded\'?', outfit: 'object?', name: 'text?', at: 'spot', alpha: 'alpha?', facingLeft: 'bool?', if: 'cond?', note: 'string?' },
    check: a => !!(a.cast || a.look) || 'needs a "cast", or "look": "ghost", "random", "kid" or "hooded"',
    sets: a => storyCrowd(a).map(x => x.id)
  },
  visit: { fields: { at: 'when', cast: 'cast', scene: 'scene', alpha: 'alpha?', first: 'bool?', last: 'bool?', if: 'cond?', town: 'bool?', note: 'string?' } },  // a beat at the counter
  // a visit on every day between two days, for as long as "if" holds
  daily: { fields: { every: 'string', from: 'when', to: 'when', cast: 'cast', scene: 'scene', first: 'bool?', last: 'bool?', if: 'cond?', note: 'string?' } },
  // a visit on a day picked from the run code, between two days; "offset" days later for a follow-up
  drift: { fields: { drift: 'string', from: 'when', to: 'when', offset: 'number?', cast: 'cast', scene: 'scene', first: 'bool?', last: 'bool?', if: 'cond?', note: 'string?' } },
  nightBeat: { fields: { at: 'when', night: 'bool?', first: 'bool?', if: 'cond?', steps: 'steps', note: 'string?' } },  // a fixed night ("first": before that night's others)
  night: { fields: { id: 'string', window: 'when[]', weekdays: 'number[]?', if: 'cond?', scene: 'scene', test: 'quick?', note: 'string?' } },
  errandDef: { fields: { id: 'string', title: 'string', where: 'string', scene: 'scene', test: 'quick?', note: 'string?' } },  // a trip out by day
  talk: { fields: { by: 'cast', rumour: 'string[]', react: 'any', sway: 'sway?', note: 'string?' } },  // what a regular says (TOWN_TALK), and how endings move them
  // a regular who leaves town ("gone") or won't deal with you ("cold") after an ending (TOWN_FALLOUT)
  fallout: { fields: { id: 'regular', mood: '\'gone\'|\'cold\'', line: 'string', after: 'string', note: 'string?' } },
  overheard: { fields: { line: 'text', if: 'cond?', note: 'string?' } },  // a line heard in the queue
  // a thing to click in a place (js/scenespots.js): a line per click, in turn; a small find, once a run;
  // or a use for something in the bag (needs, without, use)
  hotspot: { fields: { id: 'string', rect: 'rect', lines: 'string[]', where: 'string?', find: 'hotspotFind?', stand: 'object?', walk: 'bool?', needs: 'tag?', without: 'string?', use: 'hotspotUse?', note: 'string?' } },
  hotspotFind: { fields: { on: 'number?', coin: 'number?', rep: 'number?', line: 'string?' } },  // "on": which click finds it (0 is the first)
  hotspotUse: { fields: { line: 'string?', find: 'hotspotFind?', hard: 'bool?' } },
  // an evening several stories share (addHub): its opening and closing scenes, and a test setup
  hubDef: { fields: { id: 'string', title: 'string', where: 'string', window: 'when[]', picks: 'number?', weekdays: 'number[]?', town: 'bool?', open: 'scene?', close: 'scene?', test: 'quick?', note: 'string?' } },
  vignette: { fields: { hub: 'hub', label: 'string', scene: 'scene', if: 'cond?', crossing: 'bool?', town: 'bool?', note: 'string?' } },  // this story's part of one
  // a scene of this story that plays inside another story's scene, at its "cue" step
  cueDef: { fields: { cue: 'string', scene: 'scene', if: 'cond?', note: 'string?' } }
};
// "actor[]?" -> { base: 'actor', list: true, optional: true }; "'a'|'b'" -> { words: ['a', 'b'] }
function storyType(t) {
  const optional = t.endsWith('?');
  if (optional) t = t.slice(0, -1);
  const list = t.endsWith('[]');
  if (list) t = t.slice(0, -2);
  return { base: t, list, optional, words: t[0] === '\'' ? t.split('|').map(w => w.slice(1, -1)) : null };
}
const storyStepFields = kind => ({ ...STORY_STEP_COMMON, ...STORY_STEPS[kind].fields });

// ---------------------------------------------------------------- checking a story
// Everything that can be checked without playing it: every step is a kind we know with fields we
// know, of the right types; every name a condition or a line uses is set somewhere in its scene;
// and every character, item, place, track, tag, hook and scene it names exists. Returns a list of
// problems (empty if none). Used by tools/stories.js, and by the story editor before it saves.
const STORY_QUEST_KEYS = ['id', 'kind', 'colour', 'family', 'title', 'location', 'needs', 'months', 'crosses', 'group', 'rumour', 'endings',
  'teaser', 'after', 'arc', 'sequel', 'requires', 'from', 'door', 'drawn'];
const STORY_GLOBAL_NAMES = ['flag', 'seen', 'quest', 'ended', 'errand', 'random', 'card', 'coin', 'rep', 'heat', 'week', 'day', 'month', 'shelf', 'bag', 'hook',
  'standing', 'mood', 'said', 'ally', 'foe', 'town', 'cue'];

function storyCheck(v, type, at, key, c) {
  const T = storyType(type);
  if (v === undefined) { if (!T.optional) c.bad(at, `needs "${key}"`); return; }
  if (!T.list) return storyCheckOne(v, T, at, key, c);
  if (!Array.isArray(v)) return c.bad(at, `"${key}" should be a list`);
  v.forEach((x, i) => storyCheckOne(x, T, `${at} ${key === T.base ? key : T.base} ${i + 1}`, key, c));
}
function storyCheckOne(v, T, at, key, c) {
  if (T.words) { if (!T.words.includes(v)) c.bad(at, `"${key}" is ${T.words.map(w => `"${w}"`).join(' or ')}`); return; }
  if (T.base === 'steps' || T.base === 'quick') return storyCheckSteps(v, key === T.base ? at : `${at} ${key}`, c, T.base === 'quick');
  if (STORY_RECORDS[T.base]) return storyCheckRecord(v, STORY_RECORDS[T.base], STORY_RECORDS[T.base].fields, at, c);
  if (T.base === 'name' && typeof v === 'string') c.declared.add(v);
  c.at = at;
  const r = STORY_TYPES[T.base](v, c);
  if (r !== true) c.bad(at, `"${key}": ${r}`);
}
function storyCheckRecord(v, def, fields, at, c) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return c.bad(at, 'should be { "field": value }');
  for (const k of Object.keys(v)) if (!storyHas(fields, k)) c.bad(at, `unknown field "${k}"`);
  for (const [k, t] of Object.entries(fields)) storyCheck(v[k], t, at, k, c);
  if (def.sets) for (const n of def.sets(v)) c.declared.add(n);
  if (def.check) { const r = def.check(v); if (r !== true) c.bad(at, r); }
}
function storyCheckSteps(list, where, c, quick) {
  if (!Array.isArray(list)) return c.bad(where, 'steps should be a list');
  const was = c.quick;
  c.quick = was || quick;
  list.forEach((s, i) => {
    const at = `${where} step ${i + 1}`;
    if (!s || typeof s !== 'object' || Array.isArray(s)) return c.bad(at, 'a step is { "kind": ... }');
    const kind = storyKind(s);
    if (!kind) return c.bad(at, `no step kind in ${JSON.stringify(s).slice(0, 80)}`);
    if (c.quick && !STORY_STEPS[kind].instant) c.bad(at, `"${kind}" can't be used here (only steps that take effect at once can)`);
    storyCheckRecord(s, STORY_STEPS[kind], storyStepFields(kind), at, c);
  });
  c.quick = was;
}
// the names a condition reads
function storyCheckCond(v, c) {
  if (typeof v === 'boolean') return true;
  try { storyCompile(v); } catch (e) { return e.message; }
  for (const t of storyTokens(String(v))) if (/^[A-Za-z_]/.test(t) && !['true', 'false', 'null'].includes(t)) c.used.push([t, c.at]);
  return true;
}
// the names a line reads, and its {placed:...}, {hook:...} and filters
function storyCheckText(v, c) {
  for (const l of (Array.isArray(v) ? v : [v])) {
    if (l && typeof l === 'object' && !Array.isArray(l)) { // { "if", "then", "else" }
      for (const k of Object.keys(l)) if (!['if', 'then', 'else'].includes(k)) return `a text with "if" has an unknown field "${k}"`;
      for (const r of [storyCheckCond(l.if, c), storyCheckText(l.then, c), l.else === undefined || storyCheckText(l.else, c)]) if (r !== true) return r;
      continue;
    }
    if (typeof l !== 'string') return 'should be a line, or a list of lines';
    for (const m of l.matchAll(/\{([^{}]+)\}/g)) {
      const [base, ...filters] = m[1].split('|');
      const f = filters.find(x => !['lower', 'upper', 'cap', 'money'].includes(x) && !x.startsWith('or:'));
      if (f) return `unknown filter "${f}" in {${m[1]}}`;
      const [how, arg] = base.split(':');
      if (how === 'placed' || how === 'tonight' || how === 'when') { if (![NIGHTS, c.d.nights || [], c.d.errands || [], Object.values(ERRANDS)].some(l => l.some(n => n.id === arg))) return `no night or errand "${arg}"`; }
      else if (how === 'hook') { if (!storyHas(c.hooks, arg)) return `no hook "${arg}"`; }
      else if (base !== 'bagWord') c.used.push([base, c.at]);
    }
  }
  return true;
}

function checkStory(d) {
  const out = [];
  const bad = (at, msg) => out.push(`${d.id || '?'}: ${at}: ${msg}`);
  const hooks = STORY_HOOKS[d.code || d.id] || {};
  const castOk = id => storyHas(CAST, id) || storyHas(d.cast, id);
  // One part (a scene, the mornings, a beat...) in two passes over the same walk: the first only
  // gathers the names it sets anywhere (its actors, finds, "as"...), the second checks everything
  // against them. Then every name read must be set, or be one of the game's.
  // "names" are ones the part is given before it starts (the item a "sold" part is about)
  const part = (v, type, at, names = []) => {
    const declared = new Set(names);
    let c;
    for (const loud of [false, true]) {
      c = { d, hooks, castOk, declared, used: [], at, quick: false, bad: loud ? bad : () => {} };
      storyCheck(v, type, at, type, c);
    }
    for (const [n, where] of c.used) {
      const head = n.split('.')[0];
      if (!STORY_GLOBAL_NAMES.includes(head) && !declared.has(head)) bad(where, `"${n}": nothing called "${head}" is set in this scene`);
    }
  };
  for (const k of Object.keys(d)) if (!STORY_PARTS.includes(k) && !STORY_QUEST_KEYS.includes(k)) bad('top', `unknown field "${k}"`);
  for (const k of ['id', 'kind', 'title', 'rumour', 'endings']) if (d[k] === undefined) bad('top', `missing "${k}"`);
  if (d.requires !== undefined) part(d.requires, 'cond', 'requires');
  if (typeof d.outcome === 'string') part(d.outcome, 'cond', 'outcome');
  else for (const o of (d.outcome || [])) if (!(d.endings || {})[o.ending]) bad('outcome', `no ending "${o.ending}"`);
  for (const [id, c] of Object.entries(d.cast || {})) if (!c.name || !c.look) bad(`cast ${id}`, 'needs a name and a look');
  for (const [id, u] of Object.entries(d.uniques || {})) {
    if (!u.name) bad(`unique ${id}`, 'needs a name');
    if (u.icon && !ICONS[u.icon] && !storyHas(d.icons, u.icon)) bad(`unique ${id}`, `no icon "${u.icon}"`);
    if (u.wantedKnown !== undefined) part(u.wantedKnown, 'cond', `unique ${id}`);
  }
  for (const [id, t] of Object.entries(d.soundings || {})) if (typeof t !== 'string' || !t) bad(`sounding ${id}`, 'should be a line');
  (d.overheard || []).forEach((o, i) => part(o, 'overheard', `overheard ${i + 1}`));
  for (const [place, list] of Object.entries(d.spots || {})) {
    const r = STORY_TYPES.place(place);
    if (r !== true) bad(`spots ${place}`, r);
    if (!Array.isArray(list)) bad(`spots ${place}`, 'should be a list');
    else list.forEach(s => part(s, 'hotspot', `spot ${place} ${s.id}`));
  }
  for (const [name, sc] of Object.entries(d.scenes || {})) part(sc, 'sceneData', `scene ${name}`);
  if (d.mornings) part(d.mornings, 'steps', 'mornings');
  if (d.afterwards) part(d.afterwards, 'steps', 'afterwards');
  if (d.code !== undefined && typeof d.code !== 'string') bad('top', '"code" should be the name of a file in js/quests/');
  if (d.teaser !== undefined) part(d.teaser, 'text', 'teaser');
  (d.cues || []).forEach((e, i) => part(e, 'cueDef', `cue ${i + 1} (${e.cue})`));
  for (const [u, steps] of Object.entries(d.sold || {})) {
    if (!storyHas(d.uniques, u) && !storyHas(UNIQUES, u)) bad(`sold ${u}`, `no unique "${u}"`);
    part(steps, 'quick', `sold ${u}`, ['it', 'how']);
  }
  if (d.epilogue) part(d.epilogue, 'quick', 'epilogue');
  (d.beats || []).forEach((b, i) => part(b, b.drift ? 'drift' : b.every ? 'daily' : b.steps ? 'nightBeat' : 'visit', `beat ${i + 1} (${b.at || b.drift || b.every})`));
  (d.nights || []).forEach(n => part(n, 'night', `night ${n.id}`));
  (d.errands || []).forEach(n => part(n, 'errandDef', `errand ${n.id}`));
  if (d.talk) part(d.talk, 'talk', 'talk');
  if (d.hub) part(d.hub, 'hubDef', `hub ${d.hub.id}`);
  (d.vignettes || []).forEach((v, i) => part(v, 'vignette', `vignette ${i + 1} (${v.hub})`));
  for (const [end, f] of Object.entries(d.fallout || {})) {
    if (!(d.endings || {})[end]) bad('fallout', `no ending "${end}"`);
    part(f, 'fallout', `fallout ${end}`);
  }
  (d.calendar || []).forEach(e => {
    const at = `calendar ${e.id}`;
    if (e.scene) part(e.scene, 'scene', at);
    if (typeof e.known === 'string') part(e.known, 'cond', at);
    for (const k of ['where', 'title']) if (e[k] !== undefined) part(e[k], 'text', at);
    const bring = e.bring && !Array.isArray(e.bring) ? (part(e.bring.if, 'cond', at), [...(e.bring.then || []), ...(e.bring.else || [])]) : e.bring || [];
    for (const t of bring) part(t, 'tag', at);
  });
  return out;
}

// ---------------------------------------------------------------- for the story editor
// What the editor (editor/, docs/STORY_EDITOR.md) needs to know about the game, which it loads in a
// hidden frame: names and looks of characters, the ids it can check and offer, and the step kinds.
function storyEditorInfo() {
  const steps = {};
  for (const [k, s] of Object.entries(STORY_STEPS)) steps[k] = { fields: storyStepFields(k), instant: !!s.instant, says: s.says, example: s.example };
  return {
    cast: Object.fromEntries(Object.entries(CAST).map(([id, c]) => [id, { name: c.name, look: c.look }])),
    places: [...STORY_BUILTIN_PLACES, ...Object.keys(PLACES)],
    tracks: typeof Soundtrack !== 'undefined' ? Object.keys(Soundtrack.TRACKS) : [],
    tags: Object.keys(TAGS), items: Object.keys(ITEMS), uniques: Object.keys(UNIQUES), personas: Object.keys(PERSONAS),
    icons: Object.keys(ICONS), nights: NIGHTS.map(n => n.id), hubs: Object.keys(HUBS), quests: Object.keys(QUESTS), scenes: Object.keys(story),
    steps, records: Object.fromEntries(Object.entries(STORY_RECORDS).map(([k, r]) => [k, r.fields])), alphas: Object.keys(STORY_ALPHAS),
    // names for the editor's narrative (tools/narrative.js)
    names: { quests: Object.fromEntries(Object.values(QUESTS).map(q => [q.id, q.title])), hubs: Object.fromEntries(Object.entries(HUBS).map(([id, h]) => [id, h.title])),
      items: Object.fromEntries(Object.entries(ITEMS).map(([k, v]) => [k, v.name])) }
  };
}

// Playing one scene on its own: index.html?story=fog&scene=fogMarket&flags=mott,ballKnown&shop=full
// starts a throwaway game in that story's week (nothing is saved), sets the flags, and plays the
// scene. shop=full fills the shelves and packs the bag, as tools/stories.js does.
function storyPreview() {
  let q;
  try { q = new URLSearchParams(location.search); } catch (e) { return; }
  const id = q.get('story'), name = q.get('scene');
  if (!id || !name) return;
  window.addEventListener('load', async () => {
    const d = STORIES[id], sc = d && (d.scenes || {})[name];
    if (!sc) return;
    document.querySelectorAll('#title').forEach(e => e.classList.add('hidden'));
    S = newState();
    S.run = { majors: [id], minors: [], nights: {}, errands: {}, seed: 'preview' };
    const beat = (d.beats || []).find(b => b.scene === name || (b.steps || []).some(s => s.run === name)) ||
      (d.calendar || []).find(e => e.scene === name && e.week) || null;
    const when = beat && (beat.at || beat.from);
    const at = when ? when.split('-').map(Number) : beat ? [beat.week, beat.days[0]] : [2, 2];
    S.week = at[0]; S.day = at[1];
    for (const f of (q.get('flags') || '').split(',').filter(Boolean)) S.flags[f] = true;
    if (q.get('shop') === 'full') {
      S.coin = 500;
      S.stock = ['ring', 'necklace', 'brooch', 'candlestick', 'goblet', 'compass', 'lute', 'musicbox', 'vase', 'painting', 'spade', 'flashlight'].map(k => makeItem(k));
      bagState(); S.bag.out = !sc.customer; S.bag.packed = S.stock.slice(0, 8).map(i => i.uid);
    }
    renderPanel();
    view.bg = 'shop'; clearActors();
    if (typeof setBanner === 'function') setBanner();
    if (sc.customer) {
      const cast = ((d.beats || []).find(b => b.scene === name) || {}).cast || sc.customer;
      placeKeeper();
      const a = await enterActor(CAST[cast].look, CAST[cast].name);
      await story[name]({ type: 'story', cast, name: CAST[cast].name, look: CAST[cast].look, actor: a });
    } else await story[name]();
    await narrate(`That was the whole scene "${sc.title || name}". Close this tab to go back to the editor.`);
  });
}
storyPreview();
