// Pawn Champ - The Sideshow Banner: the code half of js/stories/banner.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('banner', {
  // a beat's pause, in milliseconds
  pause(ctx, ms) { return sleep(ms); },
  // the museum pays $300; the Szabos get it, less what you lent on it
  museumShare(ctx, why) { change('coin', 300 - ctx.vars.it.paid, why); }
});
