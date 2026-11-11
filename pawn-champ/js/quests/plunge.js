// Pawn Champ - The Polar Plunge: the code half of js/stories/plunge.js (docs/STORY_DATA.md), for what
// the data can't say: the hooks it calls by name, and anything drawn.
// Its place is drawn in js/places/sandbar.js.
'use strict';

storyHooks('plunge', {
  dotHere: () => townHere('dot'),
  // Winnie buys the ring back at what you paid for it (thirty if it came some other way), times "times"
  buyBack(ctx, w) { change('coin', (ctx.vars.ring.paid || 30) * w.times, w.why); }
});

