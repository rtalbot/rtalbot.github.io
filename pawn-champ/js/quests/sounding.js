// Pawn Champ - The Sounding: the code half of js/stories/sounding.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name.
'use strict';

storyHooks('sounding', {
  // whether Cyrus's lead is still in the shop (Mr. Sorrel only calls while it is)
  leadHere() { return !!S.stock.find(x => x.uniqueId === 'soundingLead'); },
  // one more visit from Mr. Sorrel: ctx.with is the flag that counts them
  countVisit(ctx, flag) { S.flags[flag] = (S.flags[flag] || 0) + 1; }
});
