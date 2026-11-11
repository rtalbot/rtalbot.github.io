// Pawn Champ - The Halvorsen Plates: the code half of js/stories/plates.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name. The observatory itself is drawn in
// js/places/observatory.js.
'use strict';

storyHooks('plates', {
  platesHere() { return !!S.stock.find(x => x.uniqueId === 'plates'); },
  // one more visit from Ottoline Corliss: ctx.with is the flag that counts them
  countVisit(ctx, flag) { S.flags[flag] = (S.flags[flag] || 0) + 1; },
  // the dome's slit and the window in the sky: { "slit": 0 to 1, "window": 0 to 1 }
  observatory(ctx, o) { if (typeof OBSERVATORY !== 'undefined') Object.assign(OBSERVATORY, o); }
});
