// Pawn Champ - The Lucky Lure: the code half of js/stories/lure.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('lure', {
  // a second customer walks in through the door, as the first walks out: with a character id
  async arrive(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); }
});
