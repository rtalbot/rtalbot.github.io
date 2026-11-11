// Pawn Champ - The First Boat Out: the code half of js/stories/firstboat.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('firstboat', {
  // a second customer comes in through the door to the counter: with their character id, named after it
  async walkIn(ctx, cast) { ctx.vars[cast] = await enterActor(CAST[cast].look, CAST[cast].name); }
});
