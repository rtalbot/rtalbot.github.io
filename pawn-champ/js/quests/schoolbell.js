// Pawn Champ - The School Bell: the code half of js/stories/schoolbell.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('schoolbell', {
  // Father Ignatius pays you back what you paid, up to $40: with the ledger's reason
  poorBox(ctx, why) { change('coin', Math.min(ctx.vars.bell.paid, 40), why); }
});
