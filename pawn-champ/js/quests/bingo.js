// Pawn Champ - Bingo Night: the code half of js/stories/bingo.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name.
'use strict';

storyHooks('bingo', {
  // the roof fund, when The Saint Brine's Benefit is in the run too: with [dollars, why]
  roofFund(ctx, [n, why]) { if (typeof benefitAdd === 'function') benefitAdd(n, why); }
});
