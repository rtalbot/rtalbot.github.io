// Pawn Champ - Red Sea Glass: the code half of js/stories/seaglass.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

// The game only marks a unique fake as FAKE when you inspect it if the engine knows; this keeps
// the tag honest for fake uniques (the brake light) until the groundwork does it itself.
function glassKnownFake(it) {
  if (!it || !it.fake || !it.unique) return it;
  Object.defineProperty(it, 'knownFake', { get() { return !!this.inspected; }, set() {}, enumerable: true, configurable: true });
  return it;
}

storyHooks('seaglass', {
  // the brake light Vinnie sells you shows as fake once you've looked at it
  knownFake(ctx) { glassKnownFake(ctx.vars.glass); },
  knownFakes() { for (const it of S.stock) if (it.uniqueId === 'brakeGlass') glassKnownFake(it); },
  // your loupe: inspections left, and using one
  loupe: () => S.loupe,
  useLoupe() { S.loupe--; },
  testLoupe(ctx, n) { S.loupe = n; },
  // the red piece she picked out of the ones on your shelf ("red", by "pick"), or nothing
  picked(ctx) { ctx.vars.it = ctx.vars.red[ctx.vars.pick] || null; },
  // you sold her a fake: it counts against you, and she's back for her money in two days
  complaint(ctx, item) {
    const a = ctx.vars.okonjo;
    S.stats.cheated++;
    S.complaints.push({ due: dayNum() + 2, refund: 60, name: a.name, look: a.look, item });
  }
});
