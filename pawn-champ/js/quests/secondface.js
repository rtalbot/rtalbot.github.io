// Pawn Champ - The Second Face: the code half of js/stories/secondface.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('secondface', {
  // the Rusty Anchor with its open-mic stage out (js/places/rustyanchor.js)
  anchorStage(ctx, on) { ANCHOR.stage = on; }
});
