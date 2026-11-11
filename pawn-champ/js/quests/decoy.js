// Pawn Champ - The Heron Decoy: the code half of js/stories/decoy.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

// the same honest FAKE tag the brake light gets (js/quests/seaglass.js)
function heronKnownFake(it) {
  if (it && it.fake && it.unique) Object.defineProperty(it, 'knownFake', { get() { return !!this.inspected; }, set() {}, enumerable: true, configurable: true });
  return it;
}
const herons = () => S.stock.filter(x => x.uniqueId === 'heronReal' || x.uniqueId === 'heronFake');
const HERON_BROTHER = { bert: 'Bert', gil: 'Wendell' };

storyHooks('decoy', {
  // a grandson sells you "the" heron (with 'bert' or 'gil'): which of them has the real one is
  // decided once a run, the first time either walks in. The result is named offer, as for an offer.
  async heronSale(ctx, who) {
    if (S.flags.decoyRealBert === undefined) S.flags.decoyRealBert = Math.random() < 0.5;
    const a = ctx.c.actor;
    const item = heronKnownFake(makeUnique((who === 'bert') === S.flags.decoyRealBert ? 'heronReal' : 'heronFake'));
    item.from = HERON_BROTHER[who];
    const cc = { item, persona: 'proud', asking: 90, min: 60, name: a.name, look: a.look };
    view.counterIcon = 'heron';
    const r = await negotiate(cc, a, 'buy');
    hideCard(); view.counterIcon = null;
    if (r.result === 'deal') buyItem(cc, r.price);
    else if (r.result === 'watch') await callWatch({ ...cc, actor: a });
    ctx.vars.offer = r.result;
  },
  // the herons on your shelves, in shelf order, as h1 and h2; and the real one, if you have it
  herons(ctx) { const h = herons(); ctx.vars.h1 = h[0] || null; ctx.vars.h2 = h[1] || null; ctx.vars.real = h.find(x => x.uniqueId === 'heronReal') || null; },
  anyHeron: () => herons().length > 0,
  // after the real herons have shown you: every decoy's clues, true or false
  inspect() { for (const it of herons()) { it.inspected = true; it.clues = it.tells.map(t => ({ text: t, cls: it.fake ? 'bad' : 'good' })); } },
  // each brother buys his decoy back at what you paid and $10: with the ledger line, {who} for the
  // brother (a heron with no seller on record reads as Wendell's, as it always has)
  buyBack(ctx, why) {
    const held = herons();
    for (const it of held) change('coin', it.paid + 10, why.replace('{who}', it.from || 'Wendell'));
    S.stock = S.stock.filter(x => !held.includes(x)); renderPanel();
  },
  cheated() { S.stats.cheated++; },
  // a fake heron on the shelves keeps its honest FAKE tag after a reload
  knownFakes() { for (const it of S.stock) if (it.uniqueId === 'heronFake') heronKnownFake(it); }
});
