// Pawn Champ - Wren's Winter: the code half of js/stories/wrenwinter.js (docs/STORY_DATA.md), for what the
// data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('wrenwinter', {
  // for the night's test: enough money to lend Wren her bus fare. with the least
  coinAtLeast(ctx, n) { S.coin = Math.max(S.coin, n); }
});
