// Pawn Champ - Every Thirty Years: the code half of js/stories/thirtyyears.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('thirtyyears', {
  // you, behind the counter (a stand-in when nobody is: the tools)
  keeper(ctx) { ctx.vars.you = keeper || { name: 'You', look: CAST.keeper.look, x: 236, y: 141 }; },
  hasChest: () => !!S.stock.find(x => x.uniqueId === 'thirtyChest')
});
