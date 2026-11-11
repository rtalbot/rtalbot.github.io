// Pawn Champ - The Selectman's Teeth: the code half of js/stories/teeth.js (docs/STORY_DATA.md), for
// what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('teeth', {
  // Mabel Plover pays twice the guide price: with the ledger's reason
  mabelPays(ctx, why) { change('coin', Math.round(ctx.vars.teeth.guide * 2), why); }
});
