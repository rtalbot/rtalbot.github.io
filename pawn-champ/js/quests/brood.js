// Pawn Champ - The Thaw in the Loft: the code half of js/stories/brood.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('brood', {
  // the nest scene's drawing: with { queen, stir }
  nest(ctx, o) { Object.assign(NEST, o); }
});
