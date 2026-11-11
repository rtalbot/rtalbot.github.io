// Pawn Champ - The Tattoo Flash: the code half of js/stories/flash.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('flash', {
  // Jolene buys the folder from you at what you paid, and more: with [dollars more, why]
  paidPlus(ctx, [n, why]) { change('coin', ctx.vars.it.paid + n, why); }
});
