// Pawn Champ - Half a Treasure Map: the code half of js/stories/halfmap.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

const hmHalves = () => S.stock.filter(x => x.uniqueId === 'mapWest' || x.uniqueId === 'mapEast');

storyHooks('halfmap', {
  // Rollo and Marnie each buy their half back at what you paid: with the ledger line
  buyBack(ctx, why) { for (const h of hmHalves()) { S.stock = S.stock.filter(x => x !== h); change('coin', h.paid, why); } },
  // dig alone: up to three bottles of rye, as many as the shelves take, counted as n
  digRye(ctx) { let n = 0; for (let j = 0; j < 3 && shelfFree(); j++) { S.stock.push(makeUnique('tobinRye')); n++; } ctx.vars.n = n; },
  // the two halves lead nowhere now: yours to sell
  release() { for (const h of hmHalves()) releaseUnique(h); }
});
