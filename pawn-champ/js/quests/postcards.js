// Pawn Champ - Postcards Up the Coast: the code half of js/stories/postcards.js (docs/STORY_DATA.md),
// for what the data can't say: where Odile is for the rest of a stay (S.stay.odile, js/stay.js).
'use strict';

storyHooks('postcards', {
  // drawn only when Odile wasn't found in October (The Search Goes On)
  odileSearch: () => !!S.stay && S.stay.odile === 'search',
  // 'home' (found: the rest of the stay is Two Keepers), 'silent' (no more postcards in the mornings:
  // ODILE_MORNING has no 'silent'), or 'search' (a night's test)
  odile(ctx, where) { S.stay = S.stay || {}; S.stay.odile = where; }
});
