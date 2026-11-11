// Pawn Champ - A Ring in the Chowder: the code half of js/stories/chowder.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('chowder', {
  // Ray pays back what you paid for the ring: with the ledger's reason
  payBack(ctx, why) { change('coin', ctx.vars.ring.paid, why); }
});
