// Pawn Champ - The Toboggan: the code half of js/stories/toboggan.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('toboggan', {
  skipHere: () => townHere('skip'),
  // what Hob's Pond shows (js/places/icepond.js): { lit, boat, toboggan }
  pond(ctx, w) { Object.assign(POND, w); }
});
