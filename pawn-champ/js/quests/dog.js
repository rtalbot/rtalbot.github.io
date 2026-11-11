// Pawn Champ - The Three-Legged Dog: the code half of js/stories/dog.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its place is drawn in js/places/marsh.js.
'use strict';

storyHooks('dog', {
  bought() { S.stats.bought++; },
  // the errand's test: exactly this much money
  setCoin(ctx, n) { S.coin = n; }
});
