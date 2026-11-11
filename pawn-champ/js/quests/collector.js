// Pawn Champ - The Collector from Boston: the code half of js/stories/collector.js (docs/STORY_DATA.md),
// for what the data can't say: the hooks it calls by name.
'use strict';

storyHooks('collector', {
  // drawn only for a Trusted Dealer or better
  trustedDealer() { return tierIndex() >= 2; },
  // which room is lit at the Harborview (js/places)
  harborviewRoom(ctx, n) { if (typeof HARBORVIEW !== 'undefined') HARBORVIEW.room = n; },
  // Barrow gets back what you paid Clem for the painting
  refund(ctx) { const p = ctx.vars.slack; if (p && p.paid) change('coin', p.paid, 'Captain Barrow got your money back from Clem Tibbetts'); }
});
