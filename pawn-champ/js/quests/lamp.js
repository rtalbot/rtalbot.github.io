// Pawn Champ - Four Accounts of a Lamp: the code half of js/stories/lamp.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('lamp', {
  // an errand's test setup: this much money
  testCoin(ctx, n) { S.coin = n; }
});
