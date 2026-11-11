// Pawn Champ - The Lighthouse Prisms: the code half of js/stories/prisms.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name, and Gull Point by day.
// Its place is drawn in js/places/lighthouse.js.
'use strict';

const PRISM_SET = 'Lighthouse prisms';

// the trio counts as three
const prismCount = () => S.stock.reduce((n, x) => n + (x.uniqueId === 'prismTrio' ? 3 : x.set === PRISM_SET ? 1 : 0), 0);
const prismSociety = n => n >= 5 ? 300 : n * 50;

storyHooks('prisms', {
  prismCount,
  countPrisms(ctx) { ctx.vars.n = prismCount(); },
  // what the Historical Society pays: $300 for all five, otherwise $50 a prism
  societyPrice(ctx) { return money(prismSociety(ctx.vars.n)); },
  paySociety(ctx, why) { change('coin', prismSociety(ctx.vars.n), why); },
  clearPrisms() { S.stock = S.stock.filter(x => x.set !== PRISM_SET); },
  testCoin() { S.coin = 200; }
});
