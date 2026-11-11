// Pawn Champ - The Second Page: the code half of js/stories/grey2.js (docs/STORY_DATA.md): the
// December curios the Firm sends (which three, when each arrives, what became of each), and the
// stage it borrows when Mr. Quillon collects from the vigil.
'use strict';

// The December curios. Each run sends three of these four, in a seeded order; each one is addressed to
// a regular, who comes for it the day after it arrives (their scenes are g2Visit_<id> in the story).
const G2_CURIOS = [
  { id: 'advent', name: 'The Advent Calendar That Opens Itself', icon: 'qadvent', guide: 90, cast: 'skip' },
  { id: 'mitten', name: 'A Mitten That Is Always Warm', icon: 'qmitten', guide: 70, cast: 'hal' },
  { id: 'bell', name: 'The Sleigh Bell That Calls Them Home', icon: 'qbell', guide: 110, cast: 'nanFerreira' },
  { id: 'candle', name: 'A Candle That Burns Upward', icon: 'qcandle', guide: 80, cast: 'agathe' }
];
const G2_DAYS = [2, 7, 12]; // when each delivery comes: W1 Tue, W2 Tue, W3 Tue (or the next morning with room)
function g2Curios() {
  if (!S.flags.g2List) {
    const r = seededRandom(((S.run && S.run.seed) || 'grey2') + '/grey2');
    S.flags.g2List = G2_CURIOS.map(c => [r(), c.id]).sort((p, q) => p[0] - q[0]).slice(0, 3).map(x => x[1]);
  }
  return S.flags.g2List.map(id => G2_CURIOS.find(c => c.id === id));
}
const g2Held = id => S.stock.find(x => x.g2 === id);
const g2Obj = k => (S.flags[k] = S.flags[k] && typeof S.flags[k] === 'object' ? S.flags[k] : {});
const g2Fate = () => g2Obj('g2Fate'); // curio id -> 'given' | 'kept'
const g2Given = () => Object.values(g2Fate()).filter(v => v === 'given').length;
const g2HeldAll = () => g2Curios().slice(0, S.flags.g2Sent || 0).every(c => g2Held(c.id)); // every delivery still on the shelf
const g2Price = () => 150 + 50 * g2Given();
function makeG2Curio(c, tag) {
  const it = makeCurio({ name: c.name, icon: c.icon, guide: c.guide }, true);
  it.g2 = c.id; it.clues = [{ text: 'It hums. It is warm, like a cup someone just put down.' }, { text: tag }];
  return it;
}
// the tag on each curio, as the story writes it ("For {curio.for}. ...")
const g2Tag = c => `A grey tag on a red thread: "For ${CAST[c.cast].name}. Paid in full. - Q."`;
// the vigil at Saint Brine's (js/stories/longestnight.js) takes the scene if it's on tonight
const g2VigilTonight = () => questActive('longestnight') && S.run && S.run.nights && S.run.nights.vigil === dayNum() && !!S.flags.vigilHeard && !S.flags.vigilEnd;
let g2Saved = null; // the vigil's stage, kept while you're downstairs

storyHooks('greypage', {
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); },
  // a delivery: the next curio, once its day has come and there's room on the shelf. Names it
  // "curio" ({ name, for }), or nothing. Its tag says what "with" says.
  deliver(ctx, tag) {
    const f = S.flags, list = g2Curios(), n = f.g2Sent || 0;
    ctx.vars.curio = null;
    if (!(n < list.length && dayNum() >= G2_DAYS[n] && shelfFree())) return;
    const c = list[n];
    ctx.vars.curio = { name: c.name, for: CAST[c.cast].name };
    S.stock.push(makeG2Curio(c, storyText(tag, ctx))); f.g2Sent = n + 1; g2Obj('g2Due')[c.id] = dayNum() + 1;
    renderPanel();
  },
  // hook.comes.advent: the regular it's for comes in for it, from the day after it came, while it's
  // still on the shelf and you haven't decided
  comes: (ctx, id) => !!g2Held(id) && !g2Fate()[id] && dayNum() >= ((S.flags.g2Due || {})[id] || 99),
  // what became of it: { id, fate: 'given' or 'kept' }
  fate(ctx, o) { g2Fate()[o.id] = o.fate; },
  fates() { g2Fate(); },
  later(ctx, o) { setTimeout(() => toast(o.text, null, o.icon), 1500); },
  given: () => g2Given(),
  heldBack: () => (S.flags.g2Sent || 0) - g2Given(),
  price: () => g2Price(),
  pay(ctx, why) { change('coin', -g2Price(), why); },
  // every delivery still on the shelf, and none handed on: the small print applies
  full: () => (S.flags.g2Sent || 0) > 0 && g2Given() === 0 && g2HeldAll(),
  // the curios this run sent, for a line: "the advent calendar that opens itself, a mitten..."
  curioList: () => g2Curios().map(c => c.name.replace(/^(A|The) /, m => m.toLowerCase())).join(', '),
  returnAll() { S.stock = S.stock.filter(x => !x.g2); renderPanel(); },
  below(ctx, o) { Object.assign(BELOW, o); },
  vigilTonight: () => g2VigilTonight(),
  // from the vigil: keep its stage, and go back to it after
  saveStage() { g2Saved = { actors: view.actors, keeper, bg: view.bg }; },
  async backToVigil() { await fadeOut(); view.actors = g2Saved.actors; keeper = g2Saved.keeper; view.bg = g2Saved.bg; g2Saved = null; await fadeIn(); },
  // the collection's test: everything kept, or one handed on and one kept
  testCurios() {
    S.coin = 300;
    const list = g2Curios();
    if (Math.random() < 0.5) list.forEach(c => { S.stock.push(makeG2Curio(c, g2Tag(c))); g2Fate()[c.id] = 'kept'; });
    else { g2Fate()[list[0].id] = 'given'; S.stock.push(makeG2Curio(list[1], g2Tag(list[1]))); g2Fate()[list[1].id] = 'kept'; }
  }
});
