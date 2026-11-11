// Pawn Champ - Bingo Night, Again: the code half of js/stories/bingo2.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('bingo2', {
  // the roof fund, when The Saint Brine's Benefit is in the run too: with [dollars, why]
  roofFund(ctx, [n, why]) { if (typeof benefitAdd === 'function') benefitAdd(n, why); }
});
