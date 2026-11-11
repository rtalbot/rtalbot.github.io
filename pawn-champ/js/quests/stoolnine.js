// Pawn Champ - Stool Nine: the code half of js/stories/stool.js (docs/STORY_DATA.md), for what the data
// can't say: the hooks it calls by name.
'use strict';

storyHooks('stool', {
  // which stool is missing from Pearl's counter (js/places), 0 for none
  gap(ctx, n) { PEARLS.gap = n; },
  // a night's test setup: this much money
  setCoin(ctx, n) { S.coin = n; }
});
