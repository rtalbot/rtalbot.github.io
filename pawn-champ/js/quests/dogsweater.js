// Pawn Champ - The Dog in the Sweater: the code half of js/stories/dogsweater.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('dogsweater', {
  // the errand's test: at least this much money
  atLeast(ctx, n) { S.coin = Math.max(S.coin, n); }
});
