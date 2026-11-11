// Pawn Champ - Mister Fathom's Other Families: the code half of js/stories/fathom.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
'use strict';

storyHooks('fathom', {
  // you, behind the counter, as you (always there in a shop day; placed for a scene played on its own)
  keeper(ctx) { if (!keeper) placeKeeper(); ctx.vars.you = keeper; },
  // the cat on Hattie's windowsill (the kitchen's drawing): with true or false
  cat(ctx, on) { KITCHEN.cat = on; },
  // the neighbors leave gifts this many days from today
  giftsIn(ctx, n) { S.flags.fathomGifts = dayNum() + n; },
  giftsDue: () => !!S.flags.fathomGifts && dayNum() >= S.flags.fathomGifts
});
